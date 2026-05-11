import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import logger from "playwright-framework/Core/logger.js";

class LogsPage {
	constructor(page) {
		this.page = page;
		this.commonPageFunctions = new CommonPageFunctions(this.page);
		this.commonUtils = new CommonUtils();
		this.btnExportCsv = `//span[text()="Export CSV"]/parent::button`;
		this.txtWebElementsFromAddressOrSmsToNumber = `(//tr//td[1]//p)`;
		this.txtWebElementsToAddressOrSmsBody = `(//tr//td[2]//p)`;
		this.txtWebElementsEmailTypeOrSmsRequestIds = `(//tr//td[3]//p)`;
		this.txtWebElementsSentOnOrSmsBlockedReason = `(//tr//td[4]//p)`;
		this.txtWebElementsSmsSentOn = "(//tr//td[5]//p)";
	}

	/**
	 * Downloads email logs CSV and verifies data matches UI
	 * @example
	 * await LogsPage.downloadLogsAndVerifyCsv({ logsType: "email" });
	 * await LogsPage.downloadLogsAndVerifyCsv({ logsType: "sms" });
	 */
	async downloadLogsAndVerifyCsv({ logsType = "email" }) {
		const result = await this.commonPageFunctions.downloadFileAndReturnPath(
			this.page,
			this.btnExportCsv,
		);
		const [csvData, expectedCsvData] = await Promise.all([
			this.commonUtils.readCSVFile(result.filePath),
			this.constructExpectedCsvData(logsType),
		]);
		const isMatching = this.verifyTheLogsCsv({
			csvData: csvData.data,
			expectedCsvData,
			logsType,
		});
		await this.commonUtils.deleteFile(result.filePath);

		const message = isMatching
			? `✅ CSV verification passed: All expected ${logsType} data found`
			: `❌ CSV verification failed: Expected ${logsType} data not found`;

		logger.info(message);
		expect(isMatching).toBe(true);
	}

	/**
	 * Verifies CSV data against UI expected data for logs
	 * @param {Array<Object>} csvData - Parsed CSV data
	 * @param {Array<Object>} expectedCsvData - Expected data from UI
	 * @param {string} logsType - Type of logs ("email" or "sms")
	 * @returns {boolean} True if all expected entries exist in CSV data
	 * @example
	 * const isMatching = LogsPage.verifyTheLogsCsv({
	 *   csvData,
	 *   expectedCsvData,
	 *   logsType: "email",
	 * });
	 */
	verifyTheLogsCsv({ csvData, expectedCsvData, logsType = "email" }) {
		if (
			!Array.isArray(csvData) ||
			!Array.isArray(expectedCsvData) ||
			!csvData.length ||
			!expectedCsvData.length
		) {
			return false;
		}

		const normalize = CommonUtils.normalizeText;
		const normalizeTimestamp = (value) =>
			normalize(String(value || "").substring(0, 16));
		const buildEmailKey = (row) =>
			[
				normalize(row.From),
				normalize(row.To),
				normalizeTimestamp(row["Sent At"]),
				normalize(row.Type),
			].join("|");
		const buildSmsKey = (row) =>
			[
				normalize(row.To),
				normalize(row.Body),
				normalize(row["Request ID"]),
				normalize(row["Blocked Reason"]),
				normalizeTimestamp(row["Sent On"]),
			].join("|");
		const buildKey = logsType === "sms" ? buildSmsKey : buildEmailKey;

		const actualKeys = new Set(csvData.map(buildKey));
		return expectedCsvData.every((expected) =>
			actualKeys.has(buildKey(expected)),
		);
	}

	/**
	 * Constructs expected CSV data from UI elements
	 * @param {string} logsType - Type of logs ("email" or "sms")
	 * @returns {Promise<Array<Object>>} Array of email log entries with From, To, Sent At, Type
	 * @example
	 * const expectedData = await LogsPage.constructExpectedCsvData("email");
	 * const expectedData = await LogsPage.constructExpectedCsvData("sms");
	 * @returns {Promise<Array<Object>>} Array of sms log entries with To, Sent At, Body, Blocked Reason, Request ID
	 * // [{ To: "+919876543210", "Sent At": "2025-10-03T16:06", Body: "Welcome", Blocked Reason: "Welcome", Request ID: "1234567890" }]
	 * // [{ From: "sender@example.com", To: "receiver@example.com", "Sent At": "2025-10-03T16:06", Type: "Welcome" }]
	 *
	 */
	async constructExpectedCsvData(logsType = "email") {
		if (logsType === "email") {
			const [fromEmailAddresses, toEmailAddresses, emailTypeTexts, sentOnDateTexts] =
				await Promise.all([
					PwActions.getAllInnerTexts(
						this.page,
						this.txtWebElementsFromAddressOrSmsToNumber,
					),
					PwActions.getAllInnerTexts(
						this.page,
						this.txtWebElementsToAddressOrSmsBody,
					),
					PwActions.getAllInnerTexts(
						this.page,
						this.txtWebElementsEmailTypeOrSmsRequestIds,
					),
					PwActions.getAllInnerTexts(
						this.page,
						this.txtWebElementsSentOnOrSmsBlockedReason,
					),
				]);
			const emailTypes = emailTypeTexts.map((type) =>
				type.toUpperCase().replace(/\s+/g, "_"),
			);
			const sentOnDates = sentOnDateTexts.map((dateString) =>
				CommonUtils.convertTime(dateString, "toTimestamp", {
					convertToUTC: true,
				}),
			);
			const maxLength = Math.max(
				fromEmailAddresses.length,
				toEmailAddresses.length,
				emailTypes.length,
				sentOnDates.length,
			);

			return Array.from({ length: maxLength }, (_unused, index) => ({
				From: fromEmailAddresses[index] || "",
				To: toEmailAddresses[index] || "",
				"Sent At": sentOnDates[index] || "",
				Type: emailTypes[index] || "",
			}));
		}

		if (logsType === "sms") {
			const [
				toPhoneNumbers,
				smsBodies,
				smsRequestIdTexts,
				smsBlockedReasons,
				sentOnDateTexts,
			] = await Promise.all([
				PwActions.getAllInnerTexts(
					this.page,
					this.txtWebElementsFromAddressOrSmsToNumber,
				),
				PwActions.getAllInnerTexts(
					this.page,
					this.txtWebElementsToAddressOrSmsBody,
				),
				PwActions.getAllInnerTexts(
					this.page,
					this.txtWebElementsEmailTypeOrSmsRequestIds,
				),
				PwActions.getAllInnerTexts(
					this.page,
					this.txtWebElementsSentOnOrSmsBlockedReason,
				),
				PwActions.getAllInnerTexts(this.page, this.txtWebElementsSmsSentOn),
			]);
			const smsSentOnDates = sentOnDateTexts.map((dateString) =>
				CommonUtils.convertTime(dateString, "toTimestamp", {
					convertToUTC: true,
				}),
			);
			const maxLength = Math.max(
				toPhoneNumbers.length,
				smsBodies.length,
				smsRequestIdTexts.length,
				smsBlockedReasons.length,
				smsSentOnDates.length,
			);

			return Array.from({ length: maxLength }, (_unused, index) => ({
				To: toPhoneNumbers[index] || "",
				"Sent At": smsSentOnDates[index] || "",
				Body: smsBodies[index] || "",
				"Blocked Reason": smsBlockedReasons[index] || "",
				"Request ID": smsRequestIdTexts[index] || "",
			}));
		}

		return [];
	}
}

export { LogsPage };

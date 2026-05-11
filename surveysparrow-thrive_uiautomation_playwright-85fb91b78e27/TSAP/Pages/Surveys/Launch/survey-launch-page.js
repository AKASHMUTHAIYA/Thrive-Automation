import path from "path";
import { fileURLToPath } from "url";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { expect } from "@playwright/test";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
// /Users/aldastfrancis/Desktop/thrive_ui_automation/thrive_uiautomation_playwright/TSAP/Shared_Functions/common-functions.js

class SurveyLaunchPage {
	constructor(page) {
		this.page = page;
		this.commonfunction = new CommonPageFunctions(this.page);
		this.btnAddParticipants = "//span[text()='Add Participants']";
		this.btnSendInvites = "//h1[text()='Invite Participants']";
		this.txtAddEmployee =
			"//div[contains(text(),'Add Employees')]/following::div//input";
		this.btnSaveandContinue = "//span[text()='Save & continue']";
		this.btnNext = "//p[text()='Next']";
		this.chkboxAnonymitySettings = "//button[@id='confirmation-checkbox']";
		this.chkboxAggrement = "//button[@id='acceptance-checkbox']";
		this.btnLauchNowFinalConfirmation =
			"(//span[contains(text(),'Launch')])[last()]";
		this.btnScheduleNowFinalConfirmation = "//span[text()='Schedule Now']";
		this.lblSurveyLaunchedConfirmation =
			"//div[text()='Survey has been launched successfully']";
		this.lblSurveyScheduledConfirmation =
			"//div[text()='Survey has been scheduled successfully']";
		this.btnLaunchSurvey = "//button[@aria-label='Launch survey']";
		this.btnScheduleSurvey = "//div[text()='Schedule for later']";
		this.dropdownLaunchNow = "//div[contains(text(),'Launch')]";
		this.chkboxFinalConfirmation = "#confirmation-checkbox";

		// Prepare to launch! Modal Locators - Send invites via section
		this.lblPrepareToLaunch = "//h1[contains(text(),'Prepare to launch')]";
		this.lblSendInvitesVia = "//p[contains(text(),'Send invites via')]";
		this.btnInviteTypeEmail = "//div[@role='dialog']//p[text()='Email']";
		this.btnInviteTypeEmailAndText =
			"//p[@data-testid='text' and text()='Email & Text']";
		this.btnInviteTypeText = "//p[@data-testid='text' and text()='Text']";
		this.txtSMSCreditsText = "//p[text()='ESTIMATED TEXT CREDITS']";

		// Invite count text locators
		this.lblAllParticipantsWillGetInvites =
			"//p[text()='participants will get invites.']";
		this.lblParticipantsViaEmail =
			"//p[contains(text(),'participants will get invites via email')]";
		this.lblParticipantsViaText =
			"//p[contains(text(),'participants will get invites via text message')]";

		// Survey Schedule locators
		this.lblSurveySchedule = "//p[contains(text(),'Survey Schedule')]";
		this.lblSurveyLaunchDate =
			"//p[contains(text(),'Survey launch date')]/following-sibling::p";
		this.lblSurveyCutoffDate =
			"//p[contains(text(),'Survey cut-off date')]/following-sibling::p[@data-testid='launch-stepper-item-with-bullet-point_text']";

		// Anonymity section locators
		this.lblAnonymityPreference =
			"//p[contains(text(),'Anonymity Preference')]";
		this.lblRespondentsType =
			"//div[@data-testid='flex']//p[text()='Respondents are']/following-sibling::p";
	}

	/**
	 * Confirms the launch of an Engagement survey.
	 * * @param {string} launchType - Type of launch ("schedule" or "launch")
	 * @param {string} surveyType - Type of survey ("QR" or null)
	 */

	async confirmEngageSurveyLaunch(surveyType = null, launchType = "launch") {
		await PwActions.waitForDOMContentLoaded(this.page);
		await PwActions.waitForNetworkIdle(this.page, 10000);
		await CommonUtils.sleep(2); // Next button is not clicked immediately, so we need to wait for 2 seconds.
		if (surveyType !== "QR") {
			await PwActions.waitTillVisible(this.page, this.btnNext);
			await PwActions.waitAndClick(this.page, this.btnNext);
			await PwActions.waitAndClick(this.page, this.btnNext);
		}
		await PwActions.click(this.page, this.chkboxAnonymitySettings);
		await PwActions.click(this.page, this.chkboxAggrement);
		if (launchType === "schedule") {
			await PwActions.click(this.page, this.btnScheduleNowFinalConfirmation);
			await PwActions.waitTillVisible(
				this.page,
				this.lblSurveyScheduledConfirmation,
			);
		} else {
			await PwActions.waitTillVisible(
				this.page,
				this.btnLauchNowFinalConfirmation,
				5000,
			);
			await PwActions.click(this.page, this.btnLauchNowFinalConfirmation);
			await PwActions.waitTillVisible(
				this.page,
				this.lblSurveyLaunchedConfirmation,
			);
		}
	}

	/**
	 * Schedules a survey to be launched at a specified time.
	 *
	 * @param CurrentTime - The time at which the survey should be scheduled.
	 */

	async scheduleSurvey(CurrentTime) {
		await CommonUtils.sleep(2); // wait for next button to be enabled
		await PwActions.click(this.page, this.btnLaunchSurvey);
		await PwActions.click(this.page, this.btnScheduleSurvey);
		const { date, time } =
			await this.commonfunction.convertDateTime(CurrentTime);
		await this.commonfunction.setDateAndTime(this.page, date, time);
		await CommonUtils.sleep(1); // Waiting for 1 second to ensure the date and time are set.
	}

	/**
	 * Function to launch a pulse survey
	 */

	async launchPulseSurvey() {
		await CommonUtils.sleep(2); // wait for next button to be enabled
		await PwActions.waitTillVisible(this.page, this.btnLaunchSurvey);
		await PwActions.click(this.page, this.btnLaunchSurvey);
		await PwActions.waitTillVisible(this.page, this.dropdownLaunchNow);
		await PwActions.click(this.page, this.dropdownLaunchNow);
	}

	// Launches the survey
	async launchSurvey() {
		await CommonUtils.sleep(2); // wait for next button to be enabled
		await PwActions.waitTillVisible(this.page, this.btnLaunchSurvey);
		await PwActions.click(this.page, this.btnLaunchSurvey);
		await PwActions.waitTillVisible(this.page, this.dropdownLaunchNow);
		await PwActions.click(this.page, this.dropdownLaunchNow);
	}

	// check sms text visibility in launch modal
	async checkSmsTextVisibilityInLaunchModal() {
		await PwActions.waitTillVisible(this.page, this.btnNext);
		await PwActions.elementIsVisible(this.page, this.txtSMSCreditsText);
	}

	/**
	 * Confirms the launch of an Performance survey.
	 */
	async confirmPerformanceSurveyLaunch() {
		await PwActions.waitAndClick(this.page, this.btnNext);
		await PwActions.waitAndClick(this.page, this.chkboxFinalConfirmation);
		await PwActions.click(this.page, this.btnLauchNowFinalConfirmation);
		await PwActions.waitTillVisible(
			this.page,
			this.lblSurveyLaunchedConfirmation,
		);
	}

	/**
	 * Selects the invite type in the "Prepare to launch!" modal.
	 * @param {string} inviteType - The type of invite to select ("email", "emailAndText", "text")
	 * @example
	 * await surveyLaunchPage.selectInviteType("Email");
	 * await surveyLaunchPage.selectInviteType("Text");
	 * await surveyLaunchPage.selectInviteType("Email & Text");
	 */
	async selectInviteType(inviteType) {
		await PwActions.waitTillVisible(this.page, this.lblSendInvitesVia);
		switch (inviteType) {
			case "Email":
				await PwActions.click(this.page, this.btnInviteTypeEmail);
				break;
			case "Text":
				await PwActions.click(this.page, this.btnInviteTypeText);
				break;
			case "Email & Text":
				await PwActions.click(this.page, this.btnInviteTypeEmailAndText);
				break;
			default:
				throw new Error(`Invalid invite type: ${inviteType}`);
		}
		await CommonUtils.sleep(1);
	}

	/**
	 * Verifies the invite text displayed in the "Prepare to launch!" modal based on the selected invite type.
	 * @param {Object} options - The options object
	 * @param {string} options.inviteType - The type of invite ("email", "emailAndText", "text")
	 * @param {number} options.totalParticipants - The total number of participants
	 * @param {number} [options.emailParticipants] - The number of participants receiving email invites
	 * @param {number} [options.textParticipants] - The number of participants receiving text invites
	 * @example
	 * await surveyLaunchPage.verifyInviteText({
	 *   inviteType: "email",
	 *   totalParticipants: 2,
	 *   emailParticipants: 2
	 * });
	 */
	async verifyInviteText({
		inviteType,
		totalParticipants,
		emailParticipants,
		textParticipants,
	}) {
		switch (inviteType.toLowerCase()) {
			case "email":
				// Verify "X/X participants will get invites via email" text
				const emailText = await PwActions.getText(
					this.page,
					this.lblParticipantsViaEmail,
				);
				const emailOnlyCount = emailParticipants ?? totalParticipants;
				const emailOnlyInviteText =
					emailOnlyCount === 0
						? `No participants will get invites via email`
						: `${emailOnlyCount}/${totalParticipants} participants will get invites via email`;
				await PwActions.verifyTextExpected(emailText, emailOnlyInviteText);
				break;

			case "emailandtext":
			case "both":
				// Verify email invite count
				const emailTextBothEmail = await PwActions.getText(
					this.page,
					this.lblParticipantsViaEmail,
				);
				const emailCount = emailParticipants ?? totalParticipants;
				const emailInviteText =
					emailCount === 0
						? `No participants will get invites via email`
						: `${emailCount}/${totalParticipants} participants will get invites via email`;
				await PwActions.verifyTextExpected(emailTextBothEmail, emailInviteText);

				// Verify text invite count (may differ due to missing phone numbers)
				const emailTextBothText = await PwActions.getText(
					this.page,
					this.lblParticipantsViaText,
				);
				const textCount = textParticipants ?? totalParticipants;
				const textInviteText =
					textCount === 0
						? `No participants will get invites via text message`
						: `${textCount}/${totalParticipants} participants will get invites via text message`;
				await PwActions.verifyTextExpected(emailTextBothText, textInviteText);
				break;

			case "text":
			case "sms":
				// Verify "X/X participants will get invites via text message" text
				const textMsgText = await PwActions.getText(
					this.page,
					this.lblParticipantsViaText,
				);
				const smsTextCount = textParticipants ?? totalParticipants;
				const smsTextInviteText =
					smsTextCount === 0
						? `No participants will get invites via text message`
						: `${smsTextCount}/${totalParticipants} participants will get invites via text message`;
				await PwActions.verifyTextExpected(textMsgText, smsTextInviteText);
				break;

			default:
				throw new Error(`Invalid invite type: ${inviteType}`);
		}
	}

	/**
	 * Verifies the survey schedule dates and times in the "Prepare to launch!" modal (for Engage surveys).
	 * @param {Object} options - The options object
	 * @param {string} options.expectedLaunchDate - The expected launch date (format: "24 Dec '25" or similar)
	 * @param {string} [options.expectedCutoffDate] - The expected cutoff date (optional)
	 * @example
	 * await surveyLaunchPage.verifySurveySchedule({
	 *   expectedLaunchDate: "24 Dec '25",
	 *   expectedCutoffDate: "31 Dec '25"
	 * });
	 */
	async verifySurveySchedule({ expectedLaunchDate, expectedCutoffDate }) {
		// Navigate to the survey schedule section
		await PwActions.click(this.page, this.btnNext);
		await CommonUtils.sleep(1);

		// Verify survey launch date and time
		if (expectedLaunchDate) {
			await PwActions.waitTillVisible(this.page, this.lblSurveyLaunchDate);
			const launchDateText = await PwActions.getText(
				this.page,
				this.lblSurveyLaunchDate,
			);
			const actualLaunchDate = launchDateText.split(/[‘'(]/)[0].trim();
			await PwActions.verifyTextExpected(actualLaunchDate, expectedLaunchDate);
		}

		// Verify survey cutoff date and time
		if (expectedCutoffDate) {
			await PwActions.waitTillVisible(this.page, this.lblSurveyCutoffDate);
			const cutoffDateText = await PwActions.getText(
				this.page,
				this.lblSurveyCutoffDate,
			);
			const actualCutoffDate = cutoffDateText.split(/[‘'(]/)[0].trim();
			await PwActions.verifyTextExpected(actualCutoffDate, expectedCutoffDate);
		}

		// Click Next to proceed to the Anonymity section
		await PwActions.click(this.page, this.btnNext);
		await CommonUtils.sleep(1);
	}

	/**
	 * Verifies the survey schedule dates, times, and frequency data in the "Prepare to launch!" modal (for Pulse surveys).
	 * @param {Object} options - The options object
	 * @param {string} options.expectedCutoffDate - The expected cutoff date
	 * @param {string} options.frequencyStarting - Expected frequency starting text
	 * @param {string} options.frequencyEvery - Expected frequency every text
	 * @param {string} options.frequencyPeriod - Expected frequency period text
	 * @example
	 * await surveyLaunchPage.verifyPulseSurveySchedule({
	 *   expectedCutoffDate: "31 Dec '25",
	 *   frequencyStarting: "Starting on...",
	 *   frequencyEvery: "Every month",
	 *   frequencyPeriod: "for a period of..."
	 * });
	 */
	async verifyPulseSurveySchedule({
		expectedCutoffDate,
		frequencyStarting,
		frequencyEvery,
		frequencyPeriod,
	}) {
		// Navigate to the survey schedule section
		await PwActions.click(this.page, this.btnNext);
		await CommonUtils.sleep(1);

		// Verify frequency starting data
		if (frequencyStarting) {
			const surveyRunOnText = await PwActions.getText(
				this.page,
				"(//p[@data-testid='launch-stepper-item-with-bullet-point_text'])[1]",
			);

			// Extract date/time components for comparison since formats differ:
			// Configure: "Starting Wed, Dec 24 '25 - 22:56 GMT+5:30"
			// Launch: "Dec 24 (Wed) '25 - 22:56 GMT+5:30"

			// Extract core date/time from both strings
			const extractDateTime = (text) => {
				// Launch pattern: Dec 24 (Wed) '25 - 22:56 GMT+5:30
				const launchMatch = text.match(
					/([A-Z][a-z]{2}) (\d{1,2}) \([A-Z][a-z]{2}\) [‘'’](\d{2}) - (\d{2}):(\d{2}) GMT([+-]\d{1,2}:\d{2})/,
				);
				if (launchMatch) {
					return {
						month: launchMatch[1],
						day: launchMatch[2],
						year: launchMatch[3],
						hour: launchMatch[4],
						minute: launchMatch[5],
						timezone: launchMatch[6],
					};
				}
				// Configure pattern: Starting Wed, Dec 24 '25 - 22:56 GMT+5:30
				const configMatch = text.match(
					/Starting [A-Z][a-z]{2}, ([A-Z][a-z]{2}) (\d{1,2}) [‘'’](\d{2}) - (\d{2}):(\d{2}) GMT([+-]\d{1,2}:\d{2})/,
				);
				if (configMatch) {
					return {
						month: configMatch[1],
						day: configMatch[2],
						year: configMatch[3],
						hour: configMatch[4],
						minute: configMatch[5],
						timezone: configMatch[6],
					};
				}
				return null;
			};

			const configDateTime = extractDateTime(frequencyStarting);
			const launchDateTime = extractDateTime(surveyRunOnText);

			expect(launchDateTime).toEqual(configDateTime);
		}

		// Verify frequency every data
		if (frequencyEvery) {
			const repeatFrequencyText = await PwActions.getText(
				this.page,
				"//span[@data-testid='text' and contains(.,'repeat')] //span[@data-testid='launch-stepper-item-with-bullet-point_text']",
			);
			expect(repeatFrequencyText.trim()).toBe(frequencyEvery.trim());
		}

		// Verify frequency period data
		if (frequencyPeriod) {
			const periodFrequencyText = await PwActions.getText(
				this.page,
				"(//span[@data-testid='text'][contains(.,'for a period')] //span[@data-testid='launch-stepper-item-with-bullet-point_text'])[1]",
			);

			// Extract the core period value (e.g., "7 days") from both strings
			// Configure: "for a period of 7 days" → "7 days"
			// Launch: "7 days" → "7 days"
			const extractPeriodValue = (text) => {
				// Remove "for a period of " prefix if present, keep the core value
				return text.replace(/^for a period of\s+/i, "").trim();
			};

			const configPeriod = extractPeriodValue(frequencyPeriod);
			const launchPeriod = extractPeriodValue(periodFrequencyText);

			// Verify the core period values match
			await PwActions.verifyTextExpected(launchPeriod, configPeriod);
		}

		// Verify survey cutoff data (following Engage survey pattern)
		if (expectedCutoffDate) {
			await PwActions.waitTillVisible(this.page, this.lblSurveyCutoffDate);
			const cutoffDateText = await PwActions.getText(
				this.page,
				this.lblSurveyCutoffDate,
			);
			const actualCutoffDate = cutoffDateText.split(/[‘'(]/)[0].trim();
			await PwActions.verifyTextExpected(actualCutoffDate, expectedCutoffDate);
		}

		// Click Next to proceed to the Anonymity section
		await PwActions.click(this.page, this.btnNext);
		await CommonUtils.sleep(1);
	}

	/**
	 * Verifies the anonymity preference in the "Prepare to launch!" modal.
	 * @param {boolean} isAnonymous - Whether the survey is anonymous or not
	 * @example
	 * await surveyLaunchPage.verifyAnonymityPreference(false); // For Non-Anonymous survey
	 * await surveyLaunchPage.verifyAnonymityPreference(true);  // For Anonymous survey
	 */
	async verifyAnonymityPreference(isAnonymous) {
		// Verify anonymity preference (already navigated from verifySurveySchedule)
		await PwActions.waitTillVisible(this.page, this.lblRespondentsType);
		const respondentsTypeText = await PwActions.getText(
			this.page,
			this.lblRespondentsType,
		);

		if (isAnonymous) {
			// Verify anonymous text is displayed beside "Respondents are:"
			const expectedText = "anonymous";
			await PwActions.verifyTextExpected(
				respondentsTypeText.toLowerCase(),
				expectedText,
			);
		} else {
			// Verify identifiable text is displayed beside "Respondents are:"
			const expectedText = "identifiable";
			await PwActions.verifyTextExpected(
				respondentsTypeText.toLowerCase(),
				expectedText,
			);
		}
	}

	/**
	 * Checks the confirmation checkboxes and clicks the Launch Now button.
	 * @example
	 * await surveyLaunchPage.checkConfirmationAndLaunch();
	 */
	async checkConfirmationAndLaunch() {
		// Click the first confirmation checkbox
		await PwActions.waitTillVisible(this.page, this.chkboxAnonymitySettings);
		await PwActions.click(this.page, this.chkboxAnonymitySettings);
		// Click the second acceptance checkbox
		await PwActions.waitTillVisible(this.page, this.chkboxAggrement);
		await PwActions.click(this.page, this.chkboxAggrement);

		// Click the Launch Now button
		await PwActions.waitTillVisible(
			this.page,
			this.btnLauchNowFinalConfirmation,
		);
		await PwActions.click(this.page, this.btnLauchNowFinalConfirmation);

		// Wait for survey launched confirmation
		await PwActions.waitTillVisible(
			this.page,
			this.lblSurveyLaunchedConfirmation,
		);
	}
}

export { SurveyLaunchPage };

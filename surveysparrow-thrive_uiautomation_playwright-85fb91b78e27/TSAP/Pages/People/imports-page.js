import { promises } from "dns";
import { expect, test } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import logger from "playwright-framework/Core/logger.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

class ImportsPage {
	constructor(page) {
		this.page = page;
		this.btnNewImport = "//span[text()='New Import']";
		this.btnImportFromCSV =
			"(//div[contains(@class,'twigs-c-bLRsNV twigs-c-bLRsNV-cLJzhD-size-md')]//div)[1]";
		this.uploadOrDrop = "//input[@type='file']";
		this.btnImport = "//span[text()='Import']";
		this.lbl_LatestEntiresCreated =
			"//table//tr[1]//td[contains(@class,'twigs-c-deIwWr')][4]";
		this.lbl_LatestUpdated =
			"//table//tr[1]//td[contains(@class,'twigs-c-deIwWr')][5]";
		this.lbl_LatestError =
			"//table//tr[1]//td[@class='twigs-c-kcKocc twigs-c-bHEcnO'][5]";
		this.btn_DownloadLatestError =
			"//table//tr[1]//td[contains(@class,'twigs-c-deIwWr')][6]";
		this.btn_LatestStatus =
			"//table//tr[1]//td[contains(@class,'twigs-c-deIwWr')][7]";
		this.btnAutoImports = "//button[@data-testid='auto-import-button']";
		this.btnViewLogs = '//span[text()="View Logs"]/parent::button';
		this.lbl_LatestEntriesCreatedOnIntegration =
			'//h1[text()="Import History"]/parent::div/following::div/table//tr[1]//td[2]';
		this.lbl_LatestUpdatedOnIntegration =
			'//h1[text()="Import History"]/parent::div/following::div/table//tr[1]//td[3]';
		this.lbl_LatestErrorOnIntegration =
			'//h1[text()="Import History"]/parent::div/following::div/table//tr[1]//td[4]';
		this.btnCloseLogsModal = `//h1[text()="Import History"]//following-sibling::button`;
	}

	/**function import new employee details through csv
	 * @param {string} filename - Name of the file to be imported
	 */
	async importFromCSV(filename) {
		await PwActions.click(this.page, this.btnNewImport);
		await PwActions.click(this.page, this.btnImportFromCSV);
		await PwActions.uploadFile(
			this.page,
			this.uploadOrDrop,
			`C:/Users/jissgeorge/Desktop/Automation/thrive_uiautomation_playwright/TSAP/Data/Files/${filename}`,
		);
		await PwActions.click(this.page, this.btnImport);
	}

	/**
	 * Function to reload the import status up to a specified number of retries at given time intervals
	 * by repeatedly clicking a button.
	 * @param {number} retries - Total retries to attempt reloading.
	 * @param {number} interval - Interval (in seconds) between each retry.
	 */
	async reloadImportStatusUntilErrorFile(retries, interval) {
		for (let attempt = 1; attempt <= retries; attempt++) {
			try {
				logger.info(
					`Attempt ${attempt}/${retries}: Checking download button visibility`,
				);
				const isVisible = await PwActions.elementIsVisible(
					this.page,
					this.btn_DownloadLatestError,
				);
				if (isVisible) {
					logger.info("Download button is visible.");
					return true;
				}
				logger.info(
					`Attempt ${attempt}/${retries}: Clicking status button and waiting.`,
				);
				await PwActions.click(this.page, this.btn_LatestStatus);
				await CommonUtils.sleep(interval);
			} catch (error) {
				logger.error(
					`Attempt ${attempt}/${retries}: Error occurred - ${error.message}`,
				);
			}
		}
		throw new Error(
			`Download button is not visible after ${retries} attempts.`,
		);
	}

	/**
	 * Function to check the integration employee import count
	 * @param {number} expectedEmployeesCount - The expected number of employees to be imported
	 * @example
	 * await importsPage.checkIntegrationEmployeeImportCount(10);
	 * This function will click the auto imports button and view logs button, and then get the latest entries created, updated and errors count and check if the sum of the counts is equal to the expected employees count
	 * If the sum of the counts is not equal to the expected employees count, it will throw an error
	 * If the sum of the counts is equal to the expected employees count, it will return true
	 * If the sum of the counts is not equal to the expected employees count, it will throw an error
	 */
	async checkIntegrationEmployeeImportCount({
		page = this.page,
		expectedEmployeesCount,
	}) {
		await PwActions.click(this.page, this.btnAutoImports);
		await PwActions.click(this.page, this.btnViewLogs);
		let [entries, updated, errors] = await Promise.all([
			PwActions.getText(this.page, this.lbl_LatestEntriesCreatedOnIntegration),
			PwActions.getText(this.page, this.lbl_LatestUpdatedOnIntegration),
			PwActions.getText(this.page, this.lbl_LatestErrorOnIntegration),
		]);
		expect(parseInt(entries) + parseInt(updated) + parseInt(errors)).toBe(
			expectedEmployeesCount,
		);
		await PwActions.click(this.page, this.btnCloseLogsModal);
	}
}
export { ImportsPage };

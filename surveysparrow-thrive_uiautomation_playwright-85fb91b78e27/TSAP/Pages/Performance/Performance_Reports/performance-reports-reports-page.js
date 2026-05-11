import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import logger from "playwright-framework/Core/logger.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants.js";
import { envDetails } from "../../../Data/test-data.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";

class PerformanceReportsPage {
	constructor(page) {
		this.page = page;
		this.commonutils = new CommonUtils();
		this.commonFunctions = new CommonPageFunctions(page);
		this.readEmail = new ReadEmail();
		this.btnReviewReports = "//span[text()='Review']";
		this.btnApproveReports = "//span[text()='Approve']";
		this.btnRejectReports = "//span[text()='Reject']/parent::button";
		this.popupApproveReports =
			"//div[text()='Report has been approved successfully']";
		this.popupRejectReports = `//div[text()="Report rejected successfully"]`;
		this.btnReportView = "(//span[text()='View'])[last()]";
		this.txtIndroduction = "(//*[text()='Introduction'])[1]";
		this.txtCompetency = "(//*[text()='Competency Summary'])[1]";
		this.txtStrengths = "(//*[text()='Your Strengths'])[1]";
		this.btnlocateReviewButtonBySubject = (subjectName) =>
			`//tr[.//p[contains(text(),"${subjectName}")]]//button[contains(., "Review")] | //tr[.//p[contains(text(),"${subjectName}")]]//button[contains(., "View")]`;
		this.btnDownloadReport = "//span[text()='Download']";
		this.btnNavigateBack =
			"//button[contains(@class,'twigs-c-gSguNF-hmIMsL-cv')]";
		this.btnViewGroupReport =
			"//div[contains(@class,twigs-c-PJLV-igEKIYe-css)]/descendant::span[text()='View']";
		this.getDownloadButtonBySubject = (subjectName) =>
			`//p[text()='${subjectName}']/ancestor::tr/td[4]//button[2] | //p[text()='${subjectName}']/ancestor::div//span[text()='Download']`;
		this.btnDownloadOrgReport = `(//p[.='Your Organisation Report']/ancestor::div[2]/following-sibling::div//button)[2]`;
		this.btnViewOrgReport = `(//p[.='Your Organisation Report']/ancestor::div[2]/following-sibling::div//button)[1]`;
		this.dropDownReportType =
			"//div[contains(@class,'twigs-select__dropdown-indicator')]";
		this.getReportType = (reportType) =>
			`//div[contains(@class,"option") and normalize-space(.)="${reportType}"]`;
		this.chckBoxSelectAllSubjects =
			"//p[normalize-space(.)='Name']/parent::div//button[@role='checkbox']";
		this.btnBulkDownloadReports =
			"//div[contains(@class,'twigs-select--dropdown-indicator')]/following-sibling::div//button";
		this.toasterBulkDownloadReports =
			"//div[@data-testid='box' and normalize-space(.)='Export Initiated, You will be notified via Email once it is ready']";
		this.dotIndicatorBulkDownloadReports = `//div[contains(@class,'twigs-select--dropdown-indicator')]/following-sibling::div//button/following-sibling::div`;
		this.tooltipCannotViewReport =
			"//div[@data-state = 'delayed-open'][text()='Report cannot be viewed right now']";
		this.getCheckBoxForSubject = (subjectName) =>
			`//p[normalize-space(.)="${subjectName}"]/ancestor::tr//td//button[@role='checkbox']`;
		this.btnBulkApproveReports = `//span[text()="Approve"]/parent::button`;
		this.toasterBulkApproveReports = `//div[normalize-space(.)="Selected Reports are Approved"]/ancestor::li`;
		this.getChartHorizontalBarXpath = (widgetId) =>
			`//div[@id='${widgetId}']//div[contains(@class,'idrQjbA')]//div[@data-testid='box' and contains(@class,'ieaPhug')]`;
		this.getChartVerticalBarXpath = (widgetId) =>
			`//div[@id='${widgetId}']//div[contains(@class,'ikRAtcD')]//div[contains(@class,'ieaPhug')]//div[@data-testid='flex'][contains(@class,'idIWvzD')]`;
		this.getChartRadarXpath = (widgetId) =>
			`//div[@id='${widgetId}']//div[contains(@class,'ijeESRr')]//div[contains(@class,'ihPuCCJ')]//div[@data-testid='flex'][contains(@class,'idIWvzD')]`;
		this.getSubjectScore = (subjectName) =>
			`//p[text()="${subjectName}"]/ancestor::td/following-sibling::td[2]`;
		this.btnSwitchReporteeType =
			'//input[@role="combobox"]/preceding-sibling::div[contains(text(),"Reportees")]';
		this.dropDownReporteeType = (reporteeType) =>
			`//div[text()="${reporteeType}" and contains(@class,'select__option')]`;
		/**
		 * Default folder segments under TSAP/Data/Screenshots.
		 * toHaveScreenshot supports array names where each item maps to a path segment.
		 */
		this.chartSnapshotPathSegments = ["Performance"];
		/**
		 * @param {string} prefix - e.g. Subject-Report, Group-Report
		 * @param {string} chartType - horizontal-barchart | vertical-barchart | radar-chart
		 * @param {string[]} [pathSegments=this.chartSnapshotPathSegments] - folder segments e.g. ["Engage", "Pulse"]
		 * @returns {string[]} Snapshot relative path segments under TSAP/Data/Screenshots/
		 */
		this.getChartBaselineFile = (
			prefix,
			chartType,
			pathSegments = this.chartSnapshotPathSegments,
		) =>
			PerformanceReportsPage.buildSnapshotSegments(
				pathSegments,
				`${prefix}-${chartType}-baseline.png`,
			);
	}

	/**
	 * Builds a Playwright `toHaveScreenshot` name as path segments under `snapshotDir`.
	 *
	 * @param {string[]} pathSegments - Directory segments, e.g. `["Performance"]`
	 * @param {string} fileName - Baseline file name; if it does not end with `.png`, `.png` is appended
	 * @returns {string[]}
	 * @example
	 * PerformanceReportsPage.buildSnapshotSegments(["Performance"], "Subject-Report-horizontal-barchart-baseline.png");
	 */
	static buildSnapshotSegments(pathSegments, fileName) {
		if (!fileName || typeof fileName !== "string") {
			throw new Error(
				"buildSnapshotSegments: fileName must be a non-empty string",
			);
		}
		const normalized = fileName.toLowerCase().endsWith(".png")
			? fileName
			: `${fileName}.png`;
		return [...pathSegments, normalized];
	}

	/**
	/**
	 * Asserts a locator screenshot matches the stored baseline.
	 *
	 * @param {import('@playwright/test').Locator} locator - Element to capture
	 * @param {string|ReadonlyArray<string>} snapshotName - Flat name or path segments from `buildSnapshotSegments`
	 * @param {Object} [expectOptions] - Options passed to `toHaveScreenshot` (e.g. `{ maxDiffPixels: 999 }`)
	 * @param {string} [failureMessage] - Message when the assertion fails
	 * @returns {Promise<void>}
	 * @example
	 * // Example usage with a flat snapshot name:
	 * await PerformanceReportsPage.assertLocatorMatchesBaseline(myLocator, "Performance-Subject-horizontal-barchart-baseline.png");
	 *
	 * // Example usage with path segments (recommended):
	 * const segments = PerformanceReportsPage.buildSnapshotSegments(
	 *   ["Performance", "Subject"],
	 *   "horizontal-barchart-baseline.png"
	 * );
	 * await PerformanceReportsPage.assertLocatorMatchesBaseline(myLocator, segments, { maxDiffPixels: 500 }, "Chart screenshot mismatch");
	 */
	static async assertLocatorMatchesBaseline(
		locator,
		snapshotName,
		expectOptions = {},
		failureMessage = "Locator screenshot did not match baseline",
	) {
		await expect(locator, failureMessage).toHaveScreenshot(
			snapshotName,
			expectOptions,
		);
	}

	/**
	 * Verifies the report approval status.
	 */

	async verifyReportApproval(page = this.page) {
		await PwActions.click(page, this.btnReviewReports);
		await PwActions.elementIsVisible(page, this.btnApproveReports);
		await PwActions.elementIsVisible(page, this.btnRejectReports);
		await PwActions.click(page, this.btnApproveReports);
		await PwActions.elementIsVisible(page, this.popupApproveReports);
	}

	/**
	 * verify reports by clicking the corresponding button.
	 * @param {string} section - The section type (e.g., "Subject")
	 * @param {Page} page - The Playwright page object
	 * @param {string} [subjectName=null] - Optional subject name to verify specific subject's report
	 */

	async verifyReportsIsPresent(section, page = this.page, subjectName = null) {
		const viewButton = subjectName
			? this.btnlocateReviewButtonBySubject(subjectName)
			: this.btnReportView;

		await PwActions.click(page, viewButton);
		await PwActions.waitTillVisible(page, this.txtIndroduction, 20000);
		await PwActions.verifyElementIsPresent(page, this.txtIndroduction);
		await PwActions.verifyElementIsPresent(page, this.txtCompetency);
		await PwActions.verifyElementIsPresent(page, this.txtStrengths);
	}

	/**
	 * Reviews and approves the report for a specific subject.
	 * @param {string} subjectName - The name of the subject whose report needs to be approved.
	 * @returns {Promise<void>} - A promise that resolves when the report is reviewed and approved.
	 * @example
	 * await performanceReportsPage.reviewReport({ subjectName: "Subject Name", action: "approve" });
	 * await performanceReportsPage.reviewReport({ subjectName: "Subject Name", action: "reject" });
	 */

	async reviewAndApproveReport({
		subjectName,
		action = "approve",
		page = this.page,
	}) {
		await CommonUtils.sleep(10);
		await PwActions.waitForNetworkIdle(page, 20000);
		await PwActions.waitForElementVisibility(
			page,
			this.btnlocateReviewButtonBySubject(subjectName),
		);
		await PwActions.click(
			page,
			this.btnlocateReviewButtonBySubject(subjectName),
		);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(page, this.txtIndroduction);
		if (action.toLowerCase() === "approve") {
			await PwActions.click(page, this.btnApproveReports);
			await PwActions.elementIsVisible(page, this.popupApproveReports);
		} else if (action.toLowerCase() === "reject") {
			await PwActions.click(page, this.btnRejectReports);
			await PwActions.elementIsVisible(page, this.popupRejectReports);
		}
		await CommonUtils.sleep(2);
		await PwActions.waitTillElementDisappear(this.page, this.btnApproveReports);
	}

	/**
	 * Navigates back to the previous page from reports
	 * @returns {Promise<void>}
	 */

	async navigateBack(page = this.page) {
		await PwActions.click(page, this.btnNavigateBack);
	}

	/**
	 * Downloads and validates report based on type.
	 * @param {string} reportType - Type of report ('subject' or 'group')
	 * @returns {Promise<string>} Path of the downloaded file
	 */

	async downloadReport(reportType, subjectName, page = this.page) {
		const report = reportType?.toLowerCase();
		expect(["subject", "group"], "Invalid report type").toContain(report);
		if (report === "subject" && !subjectName) {
			throw new Error("Subject name is required for subject report");
		}
		if (report === "group") {
			await PwActions.click(page, this.btnViewGroupReport);
		}
		if (subjectName) {
			const result = await this.commonFunctions.downloadFileAndReturnPath(
				page,
				this.getDownloadButtonBySubject(subjectName),
				60000,
			);
			return result.filePath;
		}
		await PwActions.waitTillVisible(page, this.btnDownloadReport);
		const result = await this.commonFunctions.downloadFileAndReturnPath(
			page,
			this.btnDownloadReport,
			60000,
		);
		return result.filePath;
	}

	/**
	 * Verifies the content of a downloaded PDF file by comparing extracted text with expected titles
	 * @param {string} downloadedFilePath - Path to the downloaded PDF file
	 * @returns {Promise<boolean>} - Returns true if verification is successful
	 */

	async verifyReportTitles(downloadedFilePath) {
		expect(downloadedFilePath, "File path must not be empty").toBeTruthy();
		const { textArray: extractedPdfTitles } =
			await this.commonutils.extractPdfText(downloadedFilePath);
		//commented  out as we have an associated bug related to page count
		// expect(
		//         info.pageCount,
		//         `PDF should have exactly ${constants.performanceReportExpectedPages} pages`
		//     ).toBe(constants.performanceReportExpectedPages);
		CommonUtils.verifyArrayContainsAllElements(
			extractedPdfTitles,
			constants.performanceReportTitles,
		);
		logger.info(`Successfully verified report content`);
	}

	async openReport(subjectName, page = this.page) {
		await CommonUtils.sleep(2);
		await PwActions.click(
			page,
			this.btnlocateReviewButtonBySubject(subjectName),
		);
		await PwActions.waitTillVisible(page, this.txtIndroduction, 30000);
	}

	/**
	 * Downloads the organisation report
	 * @param {Page} page - The Playwright page object.
	 * @returns {Promise<string>} Path of the downloaded file
	 * @example
	 * await performanceReportsPage.downloadOrgReport();
	 */

	async downloadOrgReport(page = this.page) {
		const result = await this.commonFunctions.downloadFileAndReturnPath(
			page,
			this.btnDownloadOrgReport,
			50000,
		);
		await this.verifyReportTitles(result.filePath);
		return result.filePath;
	}

	/**
	 * Opens the organisation report
	 * @param {Page} page - The Playwright page object.
	 * @returns {Promise<void>}
	 * @example
	 * await performanceReportsPage.openOrgReport();
	 */

	async openOrgReport(page = this.page) {
		await PwActions.click(page, this.btnViewOrgReport);
		await PwActions.waitTillVisible(page, this.txtIndroduction);
	}

	/**
	 * Extracts the ID of the first report-page that contains a bar chart.
	 * Used to build dynamic XPaths for chart elements whose parent IDs change per survey.
	 * @param {Page} page - The Playwright page object.
	 * @returns {Promise<string|null>} The element ID, or null if not found.
	 * @example
	 * const widgetId = await performanceReportsPage.extractChartWidgetId();
	 */

	async extractChartWidgetId(page = this.page) {
		return page.evaluate(() => {
			const chartPage = [...document.querySelectorAll(".report-page")].find(
				(p) => p.querySelector(".recharts-bar"),
			);
			return chartPage?.id ?? null;
		});
	}

	/**
	 * Verifies chart screenshots in the current report against stored baselines.
	 * Pass a `charts` array to verify only specific chart types; omit it to verify all three.
	 * @param {string} prefix - Baseline filename prefix e.g. "Subject-Report" or "Group-Report".
	 * @param {Object} [options]
	 * @param {Array<"horizontal-barchart"|"vertical-barchart"|"radar-chart">} [options.charts]
	 *   Chart types to verify. Defaults to all three when omitted.
	 * @param {Page} [options.page]
	 * @param {number} [options.waitBeforeScreenshot=3] - Wait time in seconds before taking screenshot
	 * @param {string[]} [options.snapshotPathSegments] - Baseline folder path segments, default ["Performance"]
	 * @returns {Promise<void>}
	 * @example
	 * await performanceReportsPage.verifyCharts("Subject-Report");
	 * await performanceReportsPage.verifyCharts("Subject-Report", { charts: ["horizontal-barchart"] });
	 * await performanceReportsPage.verifyCharts("Group-Report", { charts: ["vertical-barchart", "radar-chart"] });
	 * await performanceReportsPage.verifyCharts("Subject-Report", { waitBeforeScreenshot: 5 });
	 */

	async verifyCharts(
		prefix,
		{
			charts = ["horizontal-barchart", "vertical-barchart", "radar-chart"],
			page = this.page,
			waitBeforeScreenshot = 3,
			snapshotPathSegments = this.chartSnapshotPathSegments,
		} = {},
	) {
		const widgetId = await this.extractChartWidgetId(page);
		expect(
			widgetId,
			"Widget ID could not be extracted — no .recharts-bar found on page",
		).toBeTruthy();
		const chartXpathMap = {
			"horizontal-barchart": (id) => this.getChartHorizontalBarXpath(id),
			"vertical-barchart": (id) => this.getChartVerticalBarXpath(id),
			"radar-chart": (id) => this.getChartRadarXpath(id),
		};
		const chartsToVerify = charts.map((type) => ({
			xpath: chartXpathMap[type](widgetId),
			file: this.getChartBaselineFile(prefix, type, snapshotPathSegments),
		}));
		for (const chart of chartsToVerify) {
			const baselinePathForLog = chart.file.join("/");
			await PwActions.waitForElementVisibility(page, chart.xpath);
			logger.info(
				`Waiting ${waitBeforeScreenshot}s for chart animations/rendering before screenshot: ${baselinePathForLog}`,
			);
			await CommonUtils.sleep(waitBeforeScreenshot);

			const chartLocator = (
				await PwActions.getLocator(page, chart.xpath)
			).first();
			await chartLocator.evaluate((el) => {
				el.style.animation = "none";
				el.style.transition = "none";
			});

			await PerformanceReportsPage.assertLocatorMatchesBaseline(
				chartLocator,
				chart.file,
				{ maxDiffPixels: 999 },
				`Chart screenshot comparison failed for ${baselinePathForLog}`,
			);
			logger.info(`Screenshot verified successfully: ${baselinePathForLog}`);
		}
	}

	/**
	 * Switches the report type
	 * @param {string} reportType - The report type to switch to
	 * @param {Page} page - The Playwright page object.
	 * @returns {Promise<void>}
	 * @example
	 * await performanceReportsPage.switchReportType("Subject");
	 */
	async switchReportType(reportType, page = this.page) {
		await PwActions.click(page, this.dropDownReportType);
		await PwActions.waitTillVisible(page, this.getReportType(reportType));
		await PwActions.click(page, this.getReportType(reportType));
	}

	/**
	 * Bulk downloads reports for all selected subjects and extracts the zip file.
	 *
	 * Selects all subjects, initiates bulk download, retrieves download URL from email,
	 * downloads and extracts the zip file, then returns the extracted files information.
	 *
	 * @param {Object} params - Parameters object.
	 * @param {string} [params.actionPerformerName=constants.admin_name] - Name of the person performing the action.
	 * @param {Object} [params.page=this.page] - Playwright page object (optional).
	 * @returns {Promise<{extractedPath: string, extractedFiles: string[]}>} Object containing extracted path and file list.
	 *
	 * @example
	 * const result = await performanceReportsPage.bulkDownloadReports({});
	 * const result = await performanceReportsPage.bulkDownloadReports({ actionPerformerName: "John Doe" });
	 * const result = await performanceReportsPage.bulkDownloadReports({ page: customPage, actionPerformerName: "Jane Smith" });
	 *
	 * // Example return value:
	 * // {
	 * //   extractedPath: "/path/to/extracted/folder",
	 * //   extractedFiles: ["Subject_Report_1.pdf", "Subject_Report_2.pdf", "Subject_Report_3.pdf"]
	 * // }
	 */
	async bulkDownloadReports({
		page = this.page,
		actionPerformerName = constants.admin_name,
	}) {
		await PwActions.click(page, this.chckBoxSelectAllSubjects);
		await PwActions.click(page, this.btnBulkDownloadReports);
		await PwActions.waitForElementVisibility(
			page,
			this.toasterBulkDownloadReports,
		);
		await PwActions.waitTillElementDisappear(
			page,
			this.dotIndicatorBulkDownloadReports,
			60000,
		);
		const downloadUrl = await this.readEmail.fetch_survey_url_from_email({
			from: envDetails.senderEmail,
			to: constants.subject_email,
			subject: constants.bulkDownloadReportsEmailSubject,
			body: constants.getBulkDownloadReportsEmailBody(actionPerformerName),
		});
		if (!downloadUrl || !downloadUrl.startsWith("http")) {
			throw new Error(`Invalid download URL: ${downloadUrl}`);
		}
		const filePath = await PwActions.downloadFileFromUrl(
			page,
			downloadUrl,
			"bulk_download_reports.zip",
		);
		const { extractedPath, extractedFiles } =
			await this.commonutils.extractZipFile(filePath);
		await this.commonutils.deleteFile(filePath);
		if (!extractedFiles || extractedFiles.length === 0) {
			throw new Error("No files extracted from zip");
		}
		return { extractedPath, extractedFiles };
	}

	/**
	 * Bulk approves the reports for a list of subjects
	 * @param {Object} params - Parameters object.
	 * @param {Array<string>} [params.subjects=[]] - The list of subject names to approve reports for.
	 * @param {Page} [params.page=this.page] - Playwright page object (optional).
	 * @returns {Promise<void>}
	 * @example
	 * await performanceReportsPage.bulkApproveReports({ subjects: ["John Doe", "Jane Smith", "Bob Johnson"] });
	 */
	async bulkApproveReports({ subjects = [], page = this.page }) {
		for (const subject of subjects) {
			const selector = this.getCheckBoxForSubject(subject);
			await PwActions.click(page, selector);
		}
		await PwActions.click(page, this.btnBulkApproveReports);
		await PwActions.waitForElementVisibility(
			page,
			this.toasterBulkApproveReports,
		);
	}

	/**
	 * Verifies the reports data for a list of subjects
	 * @param {Object} params - Parameters object.
	 * @param {Array<string>} [params.subjects=[]] - The list of subject names to verify reports data for.
	 * @param {Page} [params.page=this.page] - Playwright page object (optional).
	 * @returns {Promise<void>}
	 * @example
	 * await performanceReportsPage.verifyReportsData({ subjects: ["John Doe", "Jane Smith", "Bob Johnson"] });
	 */
	async verifyReportsPageData({ subjects = [], page = this.page }) {
		for (const subject of subjects) {
			await PwActions.waitForElementVisibility(
				page,
				this.getCheckBoxForSubject(subject),
			);
		}
	}

	/**
	 * Switches the reportee type
	 * @param {string} reporteeType - The reportee type to switch to
	 * @param {Page} page - The Playwright page object.
	 * @returns {Promise<void>}
	 * @example
	 * await performanceReportsPage.switchToReporteeType({ reporteeType: "Direct Reportees" });
	 * await performanceReportsPage.switchToReporteeType({ reporteeType: "Indirect Reportees" });
	 * await performanceReportsPage.switchToReporteeType({ reporteeType: "All Reportees" });
	 */
	async switchToReporteeType({ reporteeType, page = this.page }) {
		await PwActions.click(page, this.btnSwitchReporteeType);
		await PwActions.waitForElementVisibility(
			page,
			this.dropDownReporteeType(reporteeType),
		);
		await PwActions.click(page, this.dropDownReporteeType(reporteeType));
	}

	/**
	 * Validates the normalized scores in the Reports tab
	 * @param {Object} params - Parameters object.
	 * @param {Array<string>} [params.subjectsData=[]] - The list of subject names to validate normalized scores for.
	 * @param {Object} [params.subjectsData.subjectName] - The name of the subject.
	 * @param {Object} [params.subjectsData.score] - The score of the subject.
	 * @param {Page} [params.page=this.page] - Playwright page object (optional).
	 * @returns {Promise<void>}
	 * @example
	 * await performanceReportsPage.validateNormalizedScoresInReportsTab({ subjectsData: [{ subjectName: "John Doe", score: "8" }] });
	 */
	async validateNormalizedScoresInReportsTab({
		page = this.page,
		subjectsData = [],
	}) {
		await this.commonFunctions.navigateToTabs("Reports");
		for (const subject of subjectsData) {
			const subjectName = subject.subjectName;
			const subjectScore = subject.score;
			await PwActions.waitForElementVisibility(
				page,
				this.getSubjectScore(subjectName),
			);
			const actualScore = await PwActions.getText(
				page,
				this.getSubjectScore(subjectName),
			);
			await PwActions.verifyTextExpected(subjectScore, actualScore);
		}
	}
}

export { PerformanceReportsPage };

import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants";
import { envDetails } from "../../../Data/test-data";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
import { EntityIds } from "../../../Shared_Functions/entityId";
import { LoginPage } from "../../login-page";
import { expect } from "@playwright/test";
import logger from "playwright-framework/Core/logger.js";

class ApproverPage {
	constructor(page) {
		this.page = page;
		this.loginpage = new LoginPage(this.page);
		this.communfunction = new CommonPageFunctions(this.page);
		this.commonutils = new CommonUtils();
		this.surveyDropdown =
			"//div[contains(text(),'All Surveys')] | //button[@aria-label='Choose a different survey']"; //class name is not unique
		this.assesmentProgressSection =
			"//td[contains(@class,'twigs-c-kcKocc twigs-c-kcKocc-ijMPgrz-css')]"; //class name is not unique
		this.dropdwnViewReport =
			"//div[@class='twigs-c-fSiXSl menu-item']//p[text()='View Report']";
		this.btnApproveReport = "//span[text()='Approve']";
		this.btnRejectReport = "//span[text()='Reject']";
		this.lblApprovalConfirmation =
			"//div[text()='Report has been approved successfully']";
		this.btnBackButton = "//p[text()='Back']//preceding::button";
		this.btnTask = "//button[text()='Tasks']";
		this.lblReviewReportFor = "//p[text()='Review Report for ']";
		this.lblDueDateInTask = (dueDate) => `//p[@aria-label="Due on ${dueDate}"]`;
		this.btnApproverView = "//div[text()='Approver View']";
		this.searchicon = "//button[@aria-label='Search']";
		this.searchInput = "//input[@placeholder='Search']";
		this.txtNoData = "//p[text()='No data to show now']";
		this.txtSubjectName = (subjectname) => `//p[text()='${subjectname}']`;
		this.btnReopen = "//p[text()='Re-Open']";
		this.toasterReopen =
			"//div[text()='Assessment has been re-opened successfully']";
		this.toasterDeleteEvaluator =
			"//div[text()='Evaluator deleted successfully']";
		this.dropdownViewType = `//div[@role='tablist']//div[contains(text(), 'View')]`;
		this.viewTypeOption = (viewType) =>
			`//div[contains(@class,'twigs-select__option') and contains(normalize-space(text()), '${viewType}')]`;
		this.tooltipDisabledTeamAnalytics =
			"//div[normalize-space(text())='Team Analytics has been disabled, please reach out to your admin to enable it']";
		this.btnViewEvaluators = "//p[text()='View Evaluators']";
		this.btnDeleteEvaluators = (evaluatorName) =>
			`//p[normalize-space()='${evaluatorName}']/ancestor::td/following-sibling::td/descendant::button`;
		this.toasterDeleteEvaluator =
			"//div[text()='Deleted Evaluator Successfully']";
		this.eclipseSubjectDropdownOptions = (subjectname) =>
			`//p[text()='${subjectname}']/ancestor::tr//button[contains(@class,"subject-dropdown-menu-trigger")]`;
		this.txtEvaluatorCount = (count) => `//p[text()='${count}']`;
		this.webElementsEvaluators =
			"//tbody[@class='twigs-c-PJLV']/tr[position()>=1]/td[1]/p";
		this.txtHoverElement = "//span[@role='tooltip']";
		this.iconToCloseModal =
			"//*[name()='svg']/*[local-name()='path' and @d='M10.6667 10.6667L21.3333 21.3333']";
		this.btnYesToDelete = "//span[text()='Yes, delete']";
		this.txtRole = "//p[text()='Role']";
		this.btnDetailedFeedback = "(//p[text()='Detailed Feedback'])[1]";
		this.iconEditDetailedFeedback =
			"//*[name()='svg']/*[local-name()='path' and @d='M23.3867 13.4933L18.5067 8.61333']";
		this.iconEditTextFeedback = (role) =>
			`//p[normalize-space()='${role}']/parent::div//span[normalize-space()='Edit']`;
		this.txtFeedbackArea =
			"(//div[contains(@class,'twigs-c-PJLV')]//textarea[contains(@class,'twigs-c-dsiuU') and not(@disabled)])[1]";
		this.btnSave = "//button//span[text()='Save']";
		this.toasterSave =
			"//li[@role='status']//div[normalize-space(text())='Feedback updated successfully']";
		this.txtContains = (text, role) =>
			`//p[text()='${text}']/ancestor::div[contains(@class,'detailed-feedback-block')]//p[text()='${role}']/ancestor::div[3]/following-sibling::p`;
		this.btnBackFromEditFeedback =
			"//p[text()='Edit Feedback']//preceding::button";
		this.dialogAlert =
			"//div[@role = 'alertdialog']/p[text() = 'The evaluations are done, but waiting on approval. Once approved, you’ll be able to see them.']";
		this.btnCloseDialogAlert =
			"//div[@role = 'alertdialog']/p/button[@type = 'button']/span[text() = 'Ok, got it!']";

		/**
		 * Gets the display name for an evaluator, handling truncation for names longer than 15 characters
		 * @param {string} evaluatorName - The original evaluator name
		 * @returns {string} - The display name (truncated if needed)
		 */
		this.getDisplayName = (evaluatorName) => {
			if (evaluatorName.length > 15) {
				return evaluatorName.substring(0, 15) + "...";
			}
			return evaluatorName;
		};
		this.btnSearchSubject = "//button[@aria-label='Search']";
		this.txtInputSubject = "//input[@placeholder='Search']";
		this.getSubjectRow = (subjectName) => `//p[text()="${subjectName}"]`;
		this.btnMoreOptionsMenu =
			"//button[contains(@class,'subject-dropdown-menu')]";
		this.dropDownTxtBtnViewReport = "//p[text()='View Report']";
		this.dropDownTxtBtnDownloadReport = "//p[text()='Download']";
		this.dropdownViewEvaluators = "//p[text()='View Evaluators']";
		this.btnDropDownSurvey =
			"//button[@aria-label='Choose a different survey']";
		this.getSurveyNameFromDropdown = (surveyName) =>
			`//p[normalize-space(.)="${surveyName}"]`;
		this.getBtnDeleteEvaluator = (evaluatorFirstName) =>
			`//td//p[contains(normalize-space(.),"${evaluatorFirstName}")]/ancestor::td/following-sibling::td//button[@data-testid="delete-btn"]`;
		this.btnDelete = "//button//span[text() ='Yes, delete']";
		this.toastEvaluatorDeleted =
			"//li[@data-testid=toast']//div[@class='twigs-c-fSTLQM' and normalize-space(.)='Deleted Evaluator Successfully']";
		this.txtBtnGeneratePDP =
			"//span[text()='Personal Development Plan']/parent::button";
		this.btnGenWithAi = "//p[text()='Generate with AI']";
		this.btnUpdatePlan = "//span[text()='Update Plan']";
		this.btnUpdate = "//span[text()='Update']";
		this.popupSectionUpdate = "//div[text()='Section has been updated.']";
		this.btnBack = "(//p[text()='Edit Section']//preceding::button)[last()]";
		this.txtPdp = "//p[text()='Personal Development Plan']";
		this.txtPdpdata = "//strong[text()='Performance Analysis']";
		this.btnConfirmUpdate = "//span[text()='No,Update']";
		this.getCheckBoxForSubject = (subjectName) =>
			`//tr[contains(@aria-label,"${subjectName}")]//button[@role="checkbox"]`;
		this.btnBulkApproveReports = `//span[text()="Approve Reports"]/parent::button`;
		this.btnDownloadTeamReportFromReportPage =
			"//p[text()='Team Report']/following-sibling::button[@aria-label='Download Report']";
		this.btnDownloadMyReportFromReportPage =
			"//p[text()='My Report']/following-sibling::button[@aria-label='Download Report']";
		this.btnViewTeamReportFromReportPage = `//div//p[text() = 'Team Report']//following::button[@id="view-report-button"][1]`;
		this.btnViewMyReportFromReportPage =
			'//div//p[text() = "My Report"]//following::button[@id="view-report-button"][1]';
		this.btnDownloadTeamReportFromInsideReportPage = `//span[text()="Download"]/parent::button`;
		this.btnChangeLanguage = `//p[text()="PAGES"]/parent::div//following-sibling::button`;
		this.webElementsReportContent = `//div[contains(@class,"report-page")]`;
		this.webElementsReportTitles = `//div[@role="navigation"]//div//p`;
		this.btnCloseEvaluatorsModal = `//span[text()="Evaluators"]/ancestor::div/following-sibling::button`;
		this.btnBackFromReport = `//p[text()="Back"]/preceding-sibling::button`;
		this.dropdownViewType = `//div[contains(@class,"select-view-dropdown")]`;
		this.btnTeamAnalytics = `//span[text()="Team Analytics"]/parent::button`;
		this.btnBackFromTeamAnalytics =
			"//*[name()='svg']/*[local-name() ='path' and @d='M13.3507 7.984L5.336 16L13.3507 24.016']";
		this.txtIntroductionTitle = "//aside//p[text()='Introduction']";
		this.txtPagesTitle = `//p[normalize-space(.)="PAGES"]`;
		this.btnViewReport = (isDisabled) =>
			isDisabled
				? `//button[@disabled]//span[text()='View Report' and preceding::p[text()='My Report']]`
				: `//button//span[text()='View Report' and preceding::p[text()='My Report']]`;

		this.btnAddEvaluators =
			"//div[@role = 'dialog']//button//span[text() = 'Add Evaluators']";
		this.btnConfirmAddEvaluator = "//button//span[text() = 'Add Evaluator(s)']";

		this.inputAddEvaluatorByRole = (role) =>
			`//label[normalize-space()='Add ${role}']/ancestor::div[2]/following-sibling::div//input`;

		this.btnAddGuestUser = (guestEmail) =>
			`//div/p[text()= 'No results found for:']/span[text() ='${guestEmail}']//ancestor::p/following-sibling::button`;

		this.txtGuestUserConfirmation = (guestEmail) =>
			`//p[contains(., 'Creating “')and contains(., '” as a guest')and .//span[normalize-space()='${guestEmail}']]`;

		this.btnAddGuestUser = (guestEmail) =>
			`//div/p[text()= 'No results found for:']/span[text() ='${guestEmail}']//ancestor::p/following-sibling::button`;

		this.btnAddGuestUserConfirmation = `//button[@data-testid = 'select-popover-with-create-guest-option_icon-button_submit']`;

		this.inputGuestUserName =
			"//input[@data-testid='select-popover-with-create-guest-option_input_name']";

		this.getEvaluatorInList = (name) =>
			`//div[@role = 'dialog']//p[contains(text(), '${name}')]`;
	}

	async navigateToTabs(tab, page = this.page) {
		this.btnTopNavigationTab = `//button[text()='${tab}'] | //div[text()='${tab}']`;
		await PwActions.click(page, this.btnTopNavigationTab);
	}

	async selectSurveyFromDropdown({ surveyname, page = this.page }) {
		let dropdwnSurveyName;
		await PwActions.forceClick(page, this.surveyDropdown);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(0.5);
		dropdwnSurveyName = `//div[@role="menuitem"]/p[text()='${surveyname}'] | //div[contains(@class,'menu-list')]/div[text()='${surveyname}']`;
		await PwActions.waitTillVisible(page, dropdwnSurveyName);
		await PwActions.waitAndClick(page, dropdwnSurveyName);
	}

	/**
	 * Views the report for the given subject name.
	 *
	 * This function navigates to the report viewing option for the specified subject name.
	 * It hovers over the assessment progress section, clicks on the subject's options menu,
	 * and then selects the option to view the report.
	 *
	 * @param {string} subjectname - The name of the subject whose report is to be viewed.
	 * @returns {Promise<void>} - A promise that resolves when the report viewing action is complete.
	 */

	async viewReport(subjectname, page = this.page) {
		this.btnSubjectOptionsMenu = `//p[text()='${subjectname}']/ancestor::tr//button[contains(@class,"subject-dropdown-menu-trigger")]`;
		this.assesmentProgressSection = `//p[text()='${subjectname}']`;
		await PwActions.hover(page, this.assesmentProgressSection);
		await PwActions.click(page, this.btnSubjectOptionsMenu);
		await PwActions.click(page, this.dropdwnViewReport);
		await PwActions.waitForElement(page, this.txtIntroductionTitle, 50000);
	}

	/**
	 * Verifies that an approver cannot view a subject's report when the feature is disabled.
	 *
	 * Refreshes the page, opens the subject's action menu, and asserts that the
	 * "View Report" option is not present. Opens the menu again to leave the UI
	 * in a known state after the assertion.
	 *
	 * @param {string} subjectName - The subject whose report visibility is being validated.
	 * @returns {Promise<void>} - Resolves after confirming the menu item is absent.
	 *
	 * @example
	 * // Confirm approver cannot view the report for a subject
	 * await approverPage.verifyDisabledApproverCanViewReport("Subject Automation 6");
	 */

	async verifyDisabledApproverCanViewReport(subjectName) {
		await PwActions.pageRefresh(this.page);
		await this.openSubjectDropdown(subjectName);
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.dropdwnViewReport,
		);
	}

	// Function to approve the report from the report page.

	async approveReportFromReportPage(page = this.page) {
		await PwActions.waitTillVisible(page, this.btnApproveReport, 50000);
		await PwActions.click(page, this.btnApproveReport);
		await PwActions.waitTillVisible(page, this.lblApprovalConfirmation);
	}

	async approveReport(surveyname, subjectname, page = this.page) {
		await this.selectSurveyFromDropdown({ surveyname: surveyname, page: page });
		await this.changeViewType({ page, viewType: "Approver" });
		await this.viewReport(subjectname, page);
		await this.approveReportFromReportPage(page);
	}

	/**
	 * Logs into the approval portal, navigates to the "Performance" section, approves report by selecting survey name,
	 * and logs out of the application.
	 * @param {Page} page - The Playwright page object.
	 * */
	async loginToApprovalPortalAndApproveReportAndLogout(
		page,
		subjectName = constants.subjectName,
	) {
		await this.loginpage.login(
			page,
			envDetails.approverEmail,
			envDetails.approverPassword,
		);
		await this.communfunction.navigateTopNavigateSection("Performance", page);
		await this.navigateToTabs("Reports", page);
		await this.approveReport(EntityIds.getsurveyName(), subjectName, page);
		await this.loginpage.navigateToHomepageAndSignout(page);
	}

	/**
	 * Logs into the approval portal, approves both reports, and logs out.
	 * @param {Page} page - The Playwright page object.
	 */

	async loginToApprovalPortalAndApprovebothReportsAndLogout(page) {
		await this.loginpage.login(
			page,
			envDetails.approverEmail,
			envDetails.approverPassword,
		);
		await this.communfunction.navigateTopNavigateSection("Performance");
		await this.navigateToTabs("Reports");
		await this.approveReport(EntityIds.getsurveyName(), "Subject Automation 1");
		await PwActions.click(this.page, this.btnBackButton);
		await this.approveReport(EntityIds.getsurveyName(), "Subject Automation 2");
		await this.loginpage.navigateToHomepageAndSignout();
	}

	/**
	 * Loads a task for approval based on the survey name.
	 *
	 * @param {string} surveyName - The name of the survey for which the task needs to be loaded.
	 * @returns {Promise<void>} - A promise that resolves when the task is successfully loaded.
	 */

	async loadTaskForApproval(surveyname = null) {
		await this.communfunction.navigateTopNavigateSection("Performance");
		await PwActions.click(this.page, this.btnTask);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		if (surveyname) {
			await this.selectSurveyFromDropdown({ surveyname: surveyname });
		}
	}

	/**
	 * Verifies that a task is loaded with the specified cut-off date.
	 *
	 * @param {string} cutOffDate - The cut-off date to verify against the loaded task.
	 * @returns {Promise<void>} - A promise that resolves if the task is loaded with the correct cut-off date.
	 */

	async verifyTaskIsLoadedWithCutOffDate(cutOffDate) {
		await expect(this.page.locator(this.lblReviewReportFor)).toBeVisible();
		await expect(
			this.page.locator(this.lblDueDateInTask(cutOffDate)),
		).toBeVisible();
	}

	/**
	 * Verifies that a task is not loaded with the specified cut-off date.
	 *
	 * @param {string} cutOffDate - The cut-off date to verify against the loaded task.
	 * @returns {Promise<void>} - A promise that resolves if the task is not loaded with the specified cut-off date.
	 */

	async verifyTaskIsNotLoadedWithCutOffDate(cutOffDate) {
		await expect(this.page.locator(this.lblReviewReportFor)).not.toBeVisible();
		await expect(
			this.page.locator(this.lblDueDateInTask(cutOffDate)),
		).not.toBeVisible();
	}

	async verifyApproverPortal({
		browser,
		surveyName,
		approverEmail = envDetails.approverEmail,
		approverPassword = envDetails.approverPassword,
	}) {
		const newPage = await PwActions.openNewTab(browser);
		await PwActions.goTo(newPage, envDetails.url);
		await this.loginpage.login(newPage, approverEmail, approverPassword);
		await this.communfunction.navigateTopNavigateSection(
			"Performance",
			newPage,
		);
		await this.navigateToTabs("Reports", newPage);
		await this.selectSurveyFromDropdown({
			surveyname: surveyName,
			page: newPage,
		});
		await PwActions.waitForElementVisibility(newPage, this.btnApproverView);
		await PwActions.closeTab(newPage);
	}

	/**
	 * Searches for a subject by entering the subject name into the search field.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.subjectname - The name of the subject to search for.
	 * @param {Object} [params.page] - (Optional) The Playwright Page instance to use; defaults to this.page.
	 * @returns {Promise<void>} - A promise that resolves when the search is complete.
	 */

	async searchSubject({ subjectname, page = this.page }) {
		await PwActions.click(page, this.btnSearchSubject);
		await PwActions.fill(page, this.txtInputSubject, subjectname);
		await CommonUtils.sleep(2);
	}

	/**
	 * Clears the subject search input field.
	 *
	 * @param {import('@playwright/test').Page} [page=this.page] - The Playwright page object to perform actions on.
	 * @returns {Promise<void>}
	 * @example
	 * await approverReportPage.clearSearchSubject(page);
	 */

	async clearSearchSubject(page = this.page) {
		await PwActions.clear(page, this.txtInputSubject);
	}

	/**
	 * Verifies that searching for a non-existent subject displays the "No data" message.
	 * This method performs a negative search test by entering random text into the search field,
	 * waiting for the "No data to show now" message to appear, and then clearing the search input.
	 *
	 * @returns {Promise<void>} - A promise that resolves when the verification is complete.
	 */

	async verifyNegativeSearchSubject() {
		await PwActions.clearAndFill(
			this.page,
			this.searchInput,
			CommonUtils.generateRandomText(5),
		);
		await PwActions.waitTillVisible(this.page, this.txtNoData);
		await PwActions.clear(this.page, this.searchInput);
	}

	/**
	 * Closes the evaluators modal dialog.
	 *
	 * @param {import('@playwright/test').Page} [page=this.page] - The Playwright page object to perform actions on.
	 * @returns {Promise<void>}
	 * @example
	 * await approverReportPage.closeEvaluatorsModal(page);
	 */

	async closeEvaluatorsModal(page = this.page) {
		await PwActions.click(page, this.btnCloseEvaluatorsModal);
	}

	/**
	 * Opens the report view for a specific subject.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.subjectname - The name of the subject whose report should be viewed.
	 * @param {string} params.viewType - The view type to switch to ("Manager" or "Approver").
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @returns {Promise<void>}
	 * @throws {Error} If viewType is not provided
	 * @example
	 * await approverReportPage.viewReportForSubject({
	 *   subjectname: "John Doe",
	 *   viewType: "Approver",
	 *   page
	 * });
	 */

	async viewReportForSubject({ subjectname, viewType, page = this.page }) {
		if (!viewType) {
			throw new Error(
				"viewType is required and must be either 'Manager' or 'Approver'",
			);
		}
		await this.changeViewType({ page, viewType });
		await this.searchSubject({ subjectname, page });
		await PwActions.hover(page, this.getSubjectRow(subjectname));
		await PwActions.click(page, this.btnMoreOptionsMenu);
		await PwActions.click(page, this.dropDownTxtBtnViewReport);
		await PwActions.waitTillVisible(page, this.txtIntroductionTitle, 50000);
	}

	/**
	 * Approves multiple reports in bulk for a list of subjects.
	 *
	 * @param {Object} params - The parameters object
	 * @param {Array<string>} [params.subjects=[]] - The list of subject names to approve reports for.
	 * @param {string} params.viewType - The view type to switch to ("Manager" or "Approver").
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @returns {Promise<void>}
	 * @throws {Error} If viewType is not provided
	 * @example
	 * await approverReportPage.bulkApproveReports({
	 *   subjects: ["John Doe", "Jane Smith", "Bob Johnson"],
	 *   viewType: "Approver",
	 *   page
	 * });
	 */

	async bulkApproveReports({ subjects = [], viewType, page = this.page }) {
		if (!viewType || !["Manager", "Approver"].includes(viewType)) {
			throw new Error(
				"viewType is required and must be either 'Manager' or 'Approver'",
			);
		}
		if (subjects.length === 0) {
			return;
		}
		await this.changeViewType({ page, viewType });
		for (const subject of subjects) {
			const selector = this.getCheckBoxForSubject(subject);
			await PwActions.click(page, selector);
		}
		await PwActions.click(page, this.btnBulkApproveReports);
		const toasterMsg = `${subjects.length} Selected Reports Approved`;
		const toasterXpath = `//div[text()="${toasterMsg}"]`;
		await PwActions.waitForElementVisibility(page, toasterXpath, 90000);
	}

	/**
	 * Downloads and validates team performance report PDF from the report page.
	 * Verifies file extension, validates content, and cleans up the downloaded file.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.viewType - The view type to switch to ("Manager" or "Approver").
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @returns {Promise<void>}
	 * @throws {Error} If viewType is not provided
	 * @example
	 * await approverReportPage.downloadTeamReportFromReportPage({ viewType: "Approver", page });
	 */

	async downloadTeamReportFromReportPage({ viewType, page = this.page }) {
		if (!viewType) {
			throw new Error(
				"viewType is required and must be either 'Manager' or 'Approver'",
			);
		}
		await this.changeViewType({ page, viewType });
		await PwActions.pageRefresh(page);
		await PwActions.waitTillVisible(
			page,
			this.btnDownloadTeamReportFromReportPage,
			50000,
		);
		const result = await this.communfunction.downloadFileAndReturnPath(
			page,
			this.btnDownloadTeamReportFromReportPage,
			50000,
		);
		await CommonUtils.verifyFileExtension(result.extension, "pdf");
		expect(result.filePath, "File path must not be empty").toBeTruthy();
		await this.commonutils.verifyPdfContent(
			result.filePath,
			constants.performanceReportTitles,
		);
		await this.commonutils.deleteFile(result.filePath);
		logger.info("Successfully downloaded and verified team report");
	}

	/**
	 * Opens the team report view.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @returns {Promise<void>}
	 * @example
	 * await approverReportPage.openTeamReportView({ page });
	 */

	async openTeamReportView({ page = this.page }) {
		await PwActions.click(page, this.btnViewTeamReportFromReportPage);
		await PwActions.waitTillVisible(page, this.txtPagesTitle, 50000);
	}

	/**
	 * Opens the my report view.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @returns {Promise<void>}
	 * @example
	 * await approverReportPage.openMyReportView({ page });
	 */

	async openMyReportView({ page = this.page }) {
		await PwActions.click(page, this.btnViewMyReportFromReportPage);
		await PwActions.waitTillVisible(page, this.txtPagesTitle, 50000);
	}

	/**
	 * Changes the view type of the report.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {string} params.viewType - The type of view to change to (e.g., "Manager", "Approver", "Team").
	 * @returns {Promise<void>}
	 * @example
	 * await approverReportPage.changeViewType({ page, viewType: "Manager" });
	 */

	async changeViewType({ page = this.page, viewType }) {
		await PwActions.click(page, this.dropdownViewType);
		await PwActions.waitTillVisible(
			page,
			`//div[contains(@class,"select__option") and text()="${viewType} View"]`,
		);
		await PwActions.click(
			page,
			`//div[contains(@class,"select__option") and text()="${viewType} View"]`,
		);
	}

	/**
	 * Downloads and validates a subject's performance report PDF from the reports page.
	 * Verifies file extension, validates content, and cleans up the downloaded file.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {string} params.subjectname - The name of the subject whose report to download.
	 * @param {string} params.viewType - The view type to switch to ("Manager" or "Approver").
	 * @returns {Promise<void>}
	 * @throws {Error} If viewType is not provided
	 * @example
	 * await approverReportPage.downloadSubjectReportFromReportsPage({
	 *   page,
	 *   subjectname: "John Doe",
	 *   viewType: "Approver"
	 * });
	 */

	async downloadSubjectReportFromReportsPage({
		page = this.page,
		subjectname,
		viewType,
	}) {
		if (!viewType) {
			throw new Error(
				"viewType is required and must be either 'Manager' or 'Approver'",
			);
		}
		await this.changeViewType({ page, viewType });
		await this.searchSubject({ subjectname, page });
		await PwActions.hover(page, this.getSubjectRow(subjectname));
		await PwActions.click(page, this.btnMoreOptionsMenu);
		const result = await this.communfunction.downloadFileAndReturnPath(
			page,
			this.dropDownTxtBtnDownloadReport,
			50000,
		);
		await CommonUtils.verifyFileExtension(result.extension, "pdf");
		expect(result.filePath, "File path must not be empty").toBeTruthy();
		await this.commonutils.verifyPdfContent(
			result.filePath,
			constants.performanceReportTitles,
		);
		await this.commonutils.deleteFile(result.filePath);
		logger.info("Successfully downloaded and verified subject report");
	}

	/**
	 * Opens the team analytics view.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {string} [params.viewType="Approver"] - The view type to switch to ("Manager" or "Approver"). Defaults to "Approver".
	 * @returns {Promise<void>}
	 * @example
	 * await approverReportPage.openTeamAnalytics({ page, viewType: "Approver" });
	 */

	async openTeamAnalytics({ page = this.page, viewType = "Approver" }) {
		await this.changeViewType({ page, viewType });
		await PwActions.click(page, this.btnTeamAnalytics);
	}

	/**
	 * Opens the subject actions dropdown for the provided subject.
	 *
	 * Hovers over the subject row to reveal the actions trigger and clicks it to
	 * open the subject-specific dropdown menu.
	 *
	 * @param {string} subjectName - The subject whose actions dropdown should be opened.
	 * @returns {Promise<void>} - Resolves once the dropdown is opened.
	 *
	 * @example
	 * // Open the actions dropdown for a subject
	 * await approverPage.openSubjectDropdown("Subject Automation 6");
	 */

	async openSubjectDropdown(subjectName, page = this.page) {
		const subjectNameSelector = this.txtSubjectName(subjectName);
		await PwActions.hover(page, subjectNameSelector);
		const eclipseSubjectDropdownOptions =
			this.eclipseSubjectDropdownOptions(subjectName);
		await PwActions.click(page, eclipseSubjectDropdownOptions);
	}

	/**
	 * Reopens an assessment for the specified subject.
	 *
	 * Opens the subject dropdown, clicks the "Re-Open" action, and waits for the
	 * success toaster to confirm the assessment has been reopened.
	 *
	 * @param {string} subjectName - The subject whose assessment should be reopened.
	 * @returns {Promise<void>} - Resolves when the reopen action is confirmed.
	 *
	 * @example
	 * await approverPage.reopenAssessment("Subject Automation 6");
	 */

	async reopenAssessment(subjectName) {
		await this.openSubjectDropdown(subjectName);
		await PwActions.click(this.page, this.btnReopen);
		await PwActions.waitTillVisible(this.page, this.toasterReopen);
	}

	/**
	 * Asserts that reopening an assessment is disabled for the approver.
	 *
	 * Opens the subject dropdown and verifies the "Re-Open" action is not present,
	 * which indicates the configuration "Approvers can reopen assessments" is disabled.
	 *
	 * @param {string} subjectName - The subject whose reopen capability is being validated.
	 * @returns {Promise<void>} - Resolves after confirming the action is not available.
	 *
	 * @example
	 * await approverPage.verifyDisabledApproverCanReopenAssessment("Subject Automation 6");
	 */

	async verifyDisabledApproverCanReopenAssessment(subjectName) {
		await this.openSubjectDropdown(subjectName);
		await PwActions.verifyElementIsNotPresent(this.page, this.btnReopen);
	}

	/**
	 * Deletes evaluators for multiple subjects.
	 *
	 * This function deletes specific evaluators for each subject. Each subject can have its own list of evaluators to delete.
	 *
	 * @param {Array} subjectEvaluatorMap - Array of objects with subject names and their respective evaluators to delete.
	 *   Each object should have: { subjectName: string, evaluatorNames: string[] }
	 * @returns {Promise<void>} - A promise that resolves when all evaluators are deleted.
	 *
	 * @example
	 * // Delete specific evaluators for each subject
	 * await approverPage.deleteEvaluator([
	 *   { subjectName: "Subject 1", evaluatorNames: ["Evaluator A", "Evaluator B"] },
	 *   { subjectName: "Subject 2", evaluatorNames: ["Evaluator C"] }
	 * ]);
	 */

	async deleteEvaluator(subjectEvaluatorMap) {
		const subjectEvaluatorArray = Array.isArray(subjectEvaluatorMap)
			? subjectEvaluatorMap
			: [subjectEvaluatorMap];
		for (const subjectData of subjectEvaluatorArray) {
			const { subjectName, evaluatorNames } = subjectData;

			const evaluatorNamesArray = Array.isArray(evaluatorNames)
				? evaluatorNames
				: [evaluatorNames];

			await this.viewEvaluators(subjectName);
			for (const evaluatorName of evaluatorNamesArray) {
				const displayName = this.getDisplayName(evaluatorName);
				await CommonUtils.sleep(2);
				await PwActions.waitForDOMContentLoaded(this.page, 10000);
				await PwActions.waitTillVisible(
					this.page,
					this.btnDeleteEvaluators(displayName),
				);
				const evaluatorNameSelector = this.btnDeleteEvaluators(displayName);
				await PwActions.waitTillVisible(this.page, evaluatorNameSelector);
				await PwActions.click(this.page, evaluatorNameSelector);
				await PwActions.click(this.page, this.btnYesToDelete);
				await PwActions.waitTillVisible(this.page, this.toasterDeleteEvaluator);
				await PwActions.waitTillElementDisappear(
					this.page,
					this.toasterDeleteEvaluator,
				);
			}
			await this.closeModal();
		}
	}

	/**
	 * Verifies that specific evaluator(s) have been deleted for a subject.
	 *
	 * Opens the evaluators modal for the subject, collects the current evaluator names,
	 * and asserts that the deleted names are not present. Also validates the resulting
	 * total count equals (initial total - deleted count).
	 *
	 * @param {string} subjectName - The subject whose evaluators are being verified.
	 * @param {string[]|string} totalEvaluators - The expected evaluator list before deletion (or a count proxy).
	 * @param {string[]|string} deletedEvaluators - The evaluator name(s) that should have been removed.
	 * @returns {Promise<void>} - Resolves after the verification is completed and the modal is closed.
	 *
	 * @example
	 * await approverPage.verifyDeletedEvaluator(
	 *   "Subject Automation 6",
	 *   ["Evaluator A", "Evaluator B", "Evaluator C"],
	 *   ["Evaluator B"]
	 * );
	 */

	async verifyDeletedEvaluator(
		subjectName,
		totalEvaluators,
		deletedEvaluators,
	) {
		await this.viewEvaluators(subjectName);
		const evaluatorsArray = [];
		const deletedEvaluatorsArray = Array.isArray(deletedEvaluators)
			? deletedEvaluators
			: [deletedEvaluators];
		const totalevaluatorsarray = Array.isArray(totalEvaluators)
			? totalEvaluators
			: [totalEvaluators];
		await PwActions.waitForElement(this.page, this.webElementsEvaluators, 5000);
		const evaluatorNamesArray = await PwActions.getWebElements(
			this.page,
			this.webElementsEvaluators,
		);
		const evaluatorNamesArrayText = await PwActions.getElementsText(
			this.page,
			evaluatorNamesArray,
		);
		for (const evaluatorNames of evaluatorNamesArrayText) {
			const evaluatorName = this.getDisplayName(evaluatorNames);
			evaluatorsArray.push(evaluatorName);
		}
		await expect(evaluatorsArray).not.toContain(deletedEvaluatorsArray);
		await expect(evaluatorsArray.length).toBe(
			totalevaluatorsarray.length - deletedEvaluatorsArray.length,
		);
		await this.closeModal();
	}

	/**
	 * Asserts that evaluator deletion is disabled for the approver.
	 *
	 * Opens the evaluators modal, iterates over listed evaluators, and verifies the
	 * delete icon is not present for each, indicating the configuration disallows
	 * deletion.
	 *
	 * @param {string} subjectName - The subject whose evaluator deletion capability is validated.
	 * @returns {Promise<void>} - Resolves after confirming delete actions are unavailable and closing the modal.
	 *
	 * @example
	 * await approverPage.verifyDisabledApproverCanDeleteEvaluators("Subject Automation 6");
	 */

	async verifyDisabledApproverCanDeleteEvaluators(subjectName) {
		await this.viewEvaluators(subjectName);
		await PwActions.waitTillVisible(
			this.page,
			this.webElementsEvaluators,
			5000,
		);
		const evaluatorElementsArray = await PwActions.getWebElements(
			this.page,
			this.webElementsEvaluators,
		);
		const evaluatorNamesArray = await PwActions.getElementsText(
			this.page,
			evaluatorElementsArray,
		);
		for (const evaluatorName of evaluatorNamesArray) {
			const deleteIcon = this.btnDeleteEvaluators(evaluatorName);
			await PwActions.verifyElementIsNotPresent(this.page, deleteIcon);
		}
		await this.closeModal();
	}

	/**
	 * Opens the evaluators modal for a given subject.
	 *
	 * This method opens the subject's action menu and clicks "View Evaluators" to display
	 * the evaluators list modal for the provided subject name.
	 *
	 * @param {string} subjectName - The subject whose evaluators should be viewed.
	 * @returns {Promise<void>} - Resolves once the evaluators modal has been opened.
	 *
	 * @example
	 * // Open the evaluators modal for a subject
	 * await approverPage.viewEvaluators("Subject Automation 6");
	 */

	async viewEvaluators(subjectName, page = this.page) {
		await this.openSubjectDropdown(subjectName, page);
		await PwActions.waitTillVisible(page, this.btnViewEvaluators);
		await PwActions.click(page, this.btnViewEvaluators);
	}

	/**
	 * Verifies that the evaluators are visible in the team analytics page.
	 *
	 * This function verifies that the evaluators are visible in the team analytics page by checking if the evaluator name is visible.
	 *
	 * @param {string[] | string} evaluatorNames - The evaluator name(s) expected to be shown in the modal.
	 * @returns {Promise<void>} - Resolves after asserting the names and count match the expectation.
	 *
	 * @example
	 * // Verify a single evaluator name is present
	 * await approverPage.verifyEvaluators("Evaluator Automation 1");
	 *
	 * @example
	 * // Verify multiple evaluator names are present
	 * await approverPage.verifyEvaluators(["Evaluator A", "Evaluator B"]);
	 */

	async verifyEvaluators(evaluatorNames) {
		const namesArray = Array.isArray(evaluatorNames)
			? evaluatorNames
			: [evaluatorNames];
		const actualEvaluatorNames =
			await this.getEvaluatorNamesfromModal(namesArray);
		const evaluatorCount = this.txtEvaluatorCount(namesArray.length);
		await PwActions.verifyElementIsPresent(this.page, evaluatorCount);
		await expect(actualEvaluatorNames.sort()).toEqual(namesArray.sort());
		await this.closeModal();
	}

	/**
	 * Extracts evaluator names displayed in the modal by hovering over truncated display names to read full tooltips.
	 *
	 * Given one or more evaluator names, this reads each corresponding tooltip text within the modal and returns the full evaluator names.
	 *
	 * @param {string[] | string} evaluatorNames - The evaluator name(s) to resolve from the modal tooltips.
	 * @returns {Promise<string[]>} - A list of full evaluator names as shown in tooltip text.
	 *
	 * @example
	 * // Get full names for the provided evaluators
	 * const names = await approverPage.getEvaluatorNamesfromModal(["Evaluator A", "Evaluator B"]);
	 * expect(names).toEqual(["Evaluator A", "Evaluator B"]);
	 */

	async getEvaluatorNamesfromModal(evaluatorNames) {
		const evaluatorNamesArray = Array.isArray(evaluatorNames)
			? evaluatorNames
			: [evaluatorNames];
		const actualEvaluatorNames = [];

		for (const evaluatorName of evaluatorNamesArray) {
			const displayName = this.getDisplayName(evaluatorName);
			const evaluatorNameSelector = this.txtSubjectName(displayName);
			await CommonUtils.sleep(4);
			await PwActions.hover(this.page, evaluatorNameSelector);
			await CommonUtils.sleep(2);
			const hoverText = await PwActions.getText(
				this.page,
				this.txtHoverElement,
			);
			actualEvaluatorNames.push(hoverText);
			await PwActions.click(this.page, this.txtRole);
		}

		return actualEvaluatorNames;
	}

	/**
	 * Verifies that the approver cannot view evaluators for a given subject.
	 *
	 * Opens the subject action menu and asserts that the "View Evaluators" option
	 * is not present, indicating the permission to view evaluators is disabled.
	 *
	 * @param {string} subjectName - The subject whose evaluators visibility is validated.
	 * @returns {Promise<void>} - Resolves after confirming the menu item is absent.
	 *
	 * @example
	 * await approverPage.verifydisabledViewEvaluators("Subject Automation 6");
	 */

	async verifydisabledViewEvaluators(subjectName) {
		await this.openSubjectDropdown(subjectName);
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.btnViewEvaluators,
		);
	}

	/**
	 * Verifies that the Manager Portal option is not available in the view switcher.
	 *
	 * Opens the view-type dropdown and asserts that the "Manager" option is not
	 * present, which confirms that manager portal access has been disabled.
	 *
	 * @returns {Promise<void>} - Resolves after the absence of the option is verified.
	 *
	 * @example
	 * await approverPage.verifyDisabledManagerPortal();
	 */

	async verifyDisabledManagerPortal() {
		await PwActions.waitTillVisible(this.page, this.dropdownViewType);
		await PwActions.click(this.page, this.dropdownViewType);
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.viewTypeOption("Manager"),
		);
	}

	/**
	 * Updates the Detailed Feedback text and verifies persistence in the report.
	 *
	 * Expands the Detailed Feedback section, enters edit mode for the provided role,
	 * replaces the text with the supplied value, saves it, navigates back and verifies
	 * that the updated text is displayed inside the Detailed Feedback panel.
	 * Note: The subject's report must already be open before calling this function.
	 *
	 * @param {string} updatedText - The feedback text to save and later validate.
	 * @param {string} role - The role for which feedback is being edited (e.g., "Self", "Manager", "Peer").
	 * @param {Page} page - Playwright page object (defaults to this.page).
	 * @returns {Promise<void>} - Resolves once the text is saved and verified.
	 *
	 * @example
	 * await approverPage.updateTextFeedbackAndVerify(
	 *   "Updated feedback text",
	 *   "Self"
	 * );
	 */

	async updateTextFeedbackAndVerify({ updatedText, role, page = this.page }) {
		// Enter edit mode for Detailed Feedback
		await PwActions.pageRefresh(page);
		await PwActions.waitForNetworkIdle(page, 60000);
		await PwActions.hover(page, this.btnDetailedFeedback);
		await PwActions.click(page, this.iconEditDetailedFeedback);
		await PwActions.click(page, this.iconEditTextFeedback(role));
		await PwActions.waitTillVisible(page, this.txtFeedbackArea);
		await PwActions.click(page, this.txtFeedbackArea);
		await PwActions.clearAndFill(page, this.txtFeedbackArea, updatedText);
		await PwActions.click(page, this.btnSave);
		await PwActions.waitTillVisible(page, this.toasterSave);
		// Go back to reports list and re-open to assert persisted change
		await PwActions.click(page, this.btnBackFromEditFeedback);
		await CommonUtils.sleep(5);
		await PwActions.verifyElementIsPresent(
			page,
			this.txtContains(updatedText, role),
		);
	}

	/**
	 * Verifies that editing feedback is disabled for the approver.
	 *
	 * Opens the subject's report, expands the Detailed Feedback section and
	 * asserts that the edit icon is not present, indicating the configuration is
	 * disabled.
	 *
	 * @param {string} subjectName - The subject whose edit capability is validated.
	 * @returns {Promise<void>} - Resolves after confirming the edit control is absent.
	 *
	 * @example
	 * await approverPage.verifyDisabledEditFeedback("Subject Automation 6");
	 */

	async verifyDisabledEditFeedback(subjectName) {
		await this.viewReport(subjectName);
		await PwActions.hover(this.page, this.btnDetailedFeedback);
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.iconEditDetailedFeedback,
		);
	}

	/**
	 * Closes the modal.
	 *
	 * This function closes the modal by clicking on the close icon.
	 *
	 * @returns {Promise<void>} - A promise that resolves when the modal is closed.
	 */

	async closeModal(page = this.page) {
		await PwActions.click(page, this.iconToCloseModal);
	}

	/**
	 * Downloads and validates the "My Report" performance report PDF from the report page.
	 * Checks that the file extension is PDF, verifies the report's contents, and deletes the downloaded file on completion.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - (Optional) The Playwright Page instance to use for downloading. Defaults to this.page.
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await approverReportPage.downloadMyReportFromReportPage({ page });
	 */

	async downloadMyReportFromReportPage({ page = this.page }) {
		await PwActions.pageRefresh(page);
		await PwActions.waitTillVisible(
			page,
			this.btnDownloadMyReportFromReportPage,
			50000,
		);
		const result = await this.communfunction.downloadFileAndReturnPath(
			page,
			this.btnDownloadMyReportFromReportPage,
			50000,
		);
		await CommonUtils.verifyFileExtension(result.extension, "pdf");
		expect(result.filePath, "File path must not be empty").toBeTruthy();
		await this.commonutils.verifyPdfContent(
			result.filePath,
			constants.performanceReportTitles,
		);
		await this.commonutils.deleteFile(result.filePath);
		logger.info("Successfully downloaded and verified my report");
	}

	/**
	 * Verifies locked subject report in approver view
	 * Assumes already logged in and on the Reports page
	 *
	 * @param {Object} params - Named parameters object
	 * @param {string} params.surveyName - The name of the survey to view
	 * @param {string} params.subjectName - The name of the subject whose report to view
	 * @param {object} params.page - The page instance to use
	 * @param {string} [params.viewType="Approver"] - The view type (Approver, Manager, etc.)
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await approverPage.verifyLockedSubjectReportInApproverView({
	 *   surveyName: "360 Survey",
	 *   subjectName: "John Doe",
	 *   page: thrivePage,
	 *   viewType: "Approver"
	 * });
	 */

	async verifyLockedSubjectReportInApproverView({
		surveyName,
		subjectName,
		page,
		viewType = "Approver",
	}) {
		await this.changeViewType({ page, viewType });
		await this.selectSurveyFromDropdown({ surveyname: surveyName, page });
		await PwActions.click(page, this.txtSubjectName(subjectName));
		await PwActions.click(page, this.btnCloseDialogAlert);
	}

	/**
	 * Approver adds an evaluator (existing user or guest) for a subject
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.subjectName - The name of the subject to add evaluator for
	 * @param {Object} params.evaluator - Evaluator details object
	 * @param {string} params.evaluator.searchValue - Email or name of the evaluator (for search)
	 * @param {string} params.evaluator.role - Role type (Guest, Peer, Manager, etc.)
	 * @param {string} [params.evaluator.evaluatorName] - Name/display (for existing users)
	 * @param {string} [params.evaluator.guestName] - Name for guest user (triggers guest flow if present)
	 * @param {import('@playwright/test').Page} [params.page] - Optional Playwright page object
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Add an existing user as Peer evaluator
	 * await approverReportPage.approverAddingEvaluator({
	 *   subjectName: "John Doe",
	 *   evaluator: { searchValue: "evaluator@example.com", evaluatorName: "Evaluator Name", role: "Peer" }
	 * });
	 *
	 * @example
	 * // Add a guest user as Guest evaluator
	 * await approverReportPage.approverAddingEvaluator({
	 *   subjectName: "John Doe",
	 *   evaluator: { searchValue: "guest@example.com", guestName: "Guest User", role: "Guest" }
	 * });
	 */

	async approverAddingEvaluator({ subjectName, evaluator, page = this.page }) {
		const { searchValue, evaluatorName, guestName, role } = evaluator;
		const isGuest = !!guestName;
		const inputField = this.inputAddEvaluatorByRole(role);

		await this.viewEvaluators(subjectName, page);
		await PwActions.waitTillVisible(page, this.btnAddEvaluators);
		await PwActions.click(page, this.btnAddEvaluators);
		await PwActions.waitTillVisible(page, inputField);
		await PwActions.fill(page, inputField, searchValue);
		await CommonUtils.sleep(2);

		if (isGuest) {
			const isAddGuestButtonVisible = await PwActions.elementIsVisible(
				page,
				this.btnAddGuestUser(searchValue),
			);
			if (!isAddGuestButtonVisible) {
				await PwActions.forceClick(page, inputField);
			}
			await PwActions.waitAndClick(page, this.btnAddGuestUser(searchValue));
			await PwActions.waitTillVisible(
				page,
				this.txtGuestUserConfirmation(searchValue),
			);
			await CommonUtils.sleep(2);
			await PwActions.fill(page, this.inputGuestUserName, guestName);
			await PwActions.click(page, this.inputGuestUserName);
			await CommonUtils.sleep(0.5);
			await PwActions.waitAndClick(page, this.btnAddGuestUserConfirmation);
		} else {
			const isDropdownVisible = await PwActions.elementIsVisible(
				page,
				this.getEvaluatorDropdownOption(searchValue),
			);
			if (!isDropdownVisible) {
				await PwActions.forceClick(page, inputField);
			}
			await PwActions.waitAndClick(
				page,
				this.getEvaluatorDropdownOption(searchValue),
			);
		}

		await PwActions.waitAndClick(page, this.btnConfirmAddEvaluator);
		await CommonUtils.sleep(1);
		await PwActions.waitTillVisible(
			page,
			this.getEvaluatorInList(guestName || evaluatorName),
		);
		await CommonUtils.sleep(3);
		await PwActions.waitTillElementDisappear(
			page,
			this.btnAddGuestUserConfirmation,
		);
		await this.closeModal(page);
		logger.info(
			`Successfully added ${role} evaluator ${guestName || evaluatorName} (${searchValue}) for ${subjectName}`,
		);
	}

	/**
	 * Navigate back from Team Analytics to Reports list
	 * @param {import('@playwright/test').Page} [page=this.page] - The Playwright page object
	 * @example
	 * await approverPage.backFromTeamAnalytics({ page: managerPage });
	 */
	async backFromTeamAnalytics({ page = this.page } = {}) {
		await PwActions.click(page, this.btnBackFromTeamAnalytics);
		logger.info("Navigated back from Team Analytics to Reports list");
	}
}
export { ApproverPage };

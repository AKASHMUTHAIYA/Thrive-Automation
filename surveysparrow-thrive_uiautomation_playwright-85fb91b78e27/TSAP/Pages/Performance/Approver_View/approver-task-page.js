import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { envDetails } from "../../../Data/test-data";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
import { EntityIds } from "../../../Shared_Functions/entityId";
import { LoginPage } from "../../login-page";
import { expect } from "@playwright/test";
import { ApproverPage } from "./approver-report-page";
class ApproverTaskPage {
	constructor(page) {
		this.page = page;
		this.loginpage = new LoginPage(this.page);
		this.communfunction = new CommonPageFunctions(this.page);
		this.approverReportPage = new ApproverPage(this.page);
		this.getBtnReviewOrEvaluate = (subjectName, type) =>
			`//div[@role='listitem'][.//span[text()='${subjectName}']]//div[@data-testid='tasks-buttons']//span[text()='${type}']/ancestor::button`;
		this.getSubjectRow = (evaluatorName) =>
			`//p[text()='${evaluatorName}']/ancestor::tr//div[@type='button']`;
		this.btnApprove = "//div[text()='Approve']";
		this.btnReject = "//div[text()='Reject']";
		this.toastApproved = "//div[text()='Approved']";
		this.surveyDropdown =
			"//p[text()='For assessment:']/following-sibling::div"; //class name is not unique

		this.btnAddEvaluations =
			"//div/button[@data-testid = 'add-eval-btn']/span[text()= 'Add Evaluations']";
		this.btnNominateEvaluators =
			"//div[@role = 'menuitem' and @data-testid = 'nominate-evaluators-dropdown-item']";
		this.inputSearchEvaluator =
			"//div[@role= 'dialog' and @data-state = 'open']//div[@id = 'search-eval']//input";

		this.inputGuestName = "//div/input[@id = 'guest-name']";
		this.dropdownRole = "//div[@id = 'role']";
		this.getDropdownRoleOption = (role) =>
			`//div[contains(@id, 'listbox')]//div[text() = '${role}']`;
		this.btnAddEvaluator =
			"//div[@role = 'dialog']//button//span[text() = 'Add Evaluator']";
		this.getEvaluatorDropdownOption = (emailOrName) =>
			`//div[contains(@id, 'listbox')]//div[contains(text(), '${emailOrName}')]`;
		this.guestDropdownMenu =
			"//div[@class = 'twigs-select__menu css-iouw0n-menu']";
		this.btnRequestEvaluation =
			"//div[@role = 'dialog']//button[@data-testid = 'request-evaluation-button']";
		this.getEvaluatorInList = (name) =>
			`//div[@role = 'dialog']//p[contains(text(), '${name}')]`;
		this.guestRoleDisplay =
			"//div[@id = 'role']//div[contains(text(), 'Guest')]";
	}

	/**
	 * Subject adds an evaluator (existing user or guest) from the task page.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.surveyName - The name of the survey to add evaluator to
	 * @param {Object} params.evaluator - Evaluator details object
	 * @param {string} params.evaluator.searchValue - Email or name of the evaluator (for search)
	 * @param {string} [params.evaluator.evaluatorName] - Name/display (for existing users)
	 * @param {string} [params.evaluator.guestName] - Name for guest user (triggers guest flow if present)
	 * @param {string} params.evaluator.role - Role to assign (Peer, Manager, Reportee, or Guest)
	 * @param {import('@playwright/test').Page} [params.page] - Optional Playwright page object
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Add an existing user as evaluator
	 * await approverTaskPage.subjectAddingEvaluator({
	 *   surveyName: "My Survey",
	 *   evaluator: { searchValue: "john@example.com", evaluatorName: "John Doe", role: "Peer" }
	 * });
	 *
	 * @example
	 * // Add a guest user as evaluator
	 * await approverTaskPage.subjectAddingEvaluator({
	 *   surveyName: "My Survey",
	 *   evaluator: { searchValue: "guest@external.com", guestName: "Some Guest", role: "Peer" }
	 * });
	 */
	async subjectAddingEvaluator({ surveyName, evaluator, page = this.page }) {
		const { searchValue, evaluatorName, guestName, role } = evaluator;
		const isGuest = !!guestName;
		await this.communfunction.navigateToTabs("Tasks", page);
		await this.selectSurveyFromList(surveyName, page);
		await PwActions.waitAndClick(page, this.btnAddEvaluations);
		await PwActions.waitAndClick(page, this.btnNominateEvaluators);
		await PwActions.waitAndClick(page, this.btnAddEvaluator);
		await PwActions.fill(page, this.inputSearchEvaluator, searchValue);
		await CommonUtils.sleep(1);
		await PwActions.waitForDOMContentLoaded(page, 15000);

		if (isGuest) {
			const isGuestMenuVisible = await PwActions.elementIsVisible(
				page,
				this.guestDropdownMenu,
			);
			if (!isGuestMenuVisible) {
				await PwActions.forceClick(page, this.inputSearchEvaluator);
			}
			await CommonUtils.sleep(3);
			await PwActions.waitAndClick(page, this.guestDropdownMenu);

			await PwActions.waitTillVisible(page, this.inputGuestName);
			await PwActions.fill(page, this.inputGuestName, guestName);
		} else {
			const isDropdownVisible = await PwActions.elementIsVisible(
				page,
				this.getEvaluatorDropdownOption(searchValue),
			);
			if (!isDropdownVisible) {
				await PwActions.forceClick(page, this.inputSearchEvaluator);
			}
			await PwActions.waitAndClick(
				page,
				this.getEvaluatorDropdownOption(searchValue),
			);
		}

		if (isGuest && role === "Guest") {
			await PwActions.verifyElementIsPresent(page, this.guestRoleDisplay);
		} else {
			await PwActions.waitAndClick(page, this.dropdownRole);
			await PwActions.waitAndClick(page, this.getDropdownRoleOption(role));
		}
		await PwActions.waitAndClick(page, this.btnRequestEvaluation);

		await PwActions.waitTillVisible(
			page,
			this.getEvaluatorInList(guestName || evaluatorName),
		);

		await this.approverReportPage.closeModal(page);
	}

	/**
	 * Selects a survey from the dropdown list
	 * @param {string} surveyname - The name of the survey to select
	 * @param {Page} page - The page to select the survey from
	 * @example
	 * await approverTaskPage.selectSurveyFromList(EntityIds.surveyName,page);
	 */
	async selectSurveyFromList(surveyname, page = this.page) {
		await PwActions.forceClick(page, this.surveyDropdown);
		const dropDownSurveyName = `//div[contains(@class,"twigs-select__option") and text() = "${surveyname}"]`;
		await PwActions.waitTillVisible(page, dropDownSurveyName);
		await PwActions.waitAndClick(page, dropDownSurveyName);
	}

	/**
	 * Logs in as an approver and approves evaluators
	 * @param {string} surveyName - The name of the survey to approve
	 * @param {string} SubjectName - The name of the subject to approve
	 * @param {string[]} evaluators - The names of the evaluators to approve
	 * @param {Browser} browser - The browser to use for the login
	 * @example
	 * await approverTaskPage.loginAsApproverAndApproveEvaluators(EntityIds.surveyName,EntityIds.subjectName,["Evaluator1","Evaluator2"],browser);
	 */
	async loginAsApproverAndApproveEvaluators(
		surveyName,
		SubjectName,
		evaluators,
		browser,
	) {
		const newPage = await PwActions.openNewTab(browser);
		await PwActions.goTo(newPage, envDetails.url);
		await this.loginpage.login(
			newPage,
			envDetails.approverEmail,
			envDetails.approverPassword,
		);
		await this.communfunction.navigateTopNavigateSection(
			"Performance",
			newPage,
		);
		await this.selectSurveyFromList(surveyName, newPage);
		for (const evaluator of evaluators) {
			await PwActions.click(
				newPage,
				this.getBtnReviewOrEvaluate(SubjectName, "Review"),
			);
			const evaluatorFirstName = evaluator.split(" ")[0]; //currently we have bug here, we need to fix it. In prod it is taking only first name to show the subject row.
			await PwActions.click(newPage, this.getSubjectRow(evaluatorFirstName));
			await PwActions.click(newPage, this.btnApprove);
			await PwActions.waitForElementVisibility(newPage, this.toastApproved);
			await PwActions.pageRefresh(newPage);
			await PwActions.waitForDOMContentLoaded(newPage);
		}
		await PwActions.closeTab(newPage);
	}
}

export { ApproverTaskPage };

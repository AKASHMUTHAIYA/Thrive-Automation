import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

class TeamAnalyticsPage {
	constructor(page) {
		this.page = page;
		this.btnTeamAnalytics = "//span[text()='Team Analytics']";
		this.textSurveyName = (surveyname) =>
			`//p[text()='Team Analytics - ${surveyname}']`;
		this.searchicon = "//button[@aria-label='Search']";
		this.searchInput = "//input[@placeholder='Search']";
		this.txtNoData = "//p[text()='No data to show now']";
		this.txtSubjectName = (subjectname) => `//p[text()='${subjectname}']`;
		this.btnAddFilter = "//button[@aria-label='filter']";
		this.btnResponseTab =
			"//button[text()='Responses'] | //div[text()='Responses']";
	}

	/**
	 * Verifies the presence of the team analytics in approver or manager view.
	 *
	 * This function waits for the team analytics page to be visible, clicks it,
	 * and then waits until the header shows the current survey name.
	 *
	 * @param {string} surveyname - The survey name to expect in the Team Analytics header.
	 * @returns {Promise<void>} - Resolves when the Team Analytics page for the survey is visible.
	 * @throws {Error} - If the Team Analytics page or survey header is not visible.
	 *
	 * @example
	 * // Verify team analytics for the active survey
	 * await teamAnalyticsPage.verifyTeamAnalytics(EntityIds.getsurveyName());
	 *
	 * @example
	 * // Verify team analytics for a specific survey name
	 * await teamAnalyticsPage.verifyTeamAnalytics("Automation·Survey2025");
	 */
	async verifyTeamAnalytics(surveyname) {
		await PwActions.waitTillVisible(this.page, this.btnTeamAnalytics);
		await PwActions.waitForNetworkIdle(this.page, 40000);
		await CommonUtils.sleep(1);
		await PwActions.click(this.page, this.btnTeamAnalytics);
		const surveySelector = this.textSurveyName(surveyname);
		await PwActions.waitTillVisible(this.page, surveySelector, 50000);
	}

	/**
	 * Verifies the presence of the add filter button in the team analytics page.
	 *
	 * This function checks if the add filter button is visible on the team analytics page.
	 *
	 * @returns {Promise<boolean>} - True if the add filter button is visible; otherwise false.
	 *
	 * @example
	 * // Check whether Add Filter is available
	 * const visible = await teamAnalyticsPage.verifyAddFilterInTeamAnalytics();
	 * expect(visible).toBe(true);
	 */
	async verifyAddFilterInTeamAnalytics() {
		const addFilterIsVisible = await PwActions.elementIsVisible(
			this.page,
			this.btnAddFilter,
		);
		return addFilterIsVisible;
	}

	/**
	 * Verifies that the "Responses" tab is not present on the Team Analytics page.
	 *
	 * Navigates to Team Analytics for the specified survey and asserts that the
	 * Responses tab control is not present, indicating the setting is disabled.
	 *
	 * @param {string} surveyName - The survey name to verify Team Analytics for.
	 * @returns {Promise<void>} - Resolves after the absence of the tab is verified.
	 *
	 * @example
	 * await teamAnalyticsPage.verifyDisabledResponseTab("Automation Survey");
	 */
	async verifyDisabledResponseTab(surveyName) {
		await this.verifyTeamAnalytics(surveyName);
		await PwActions.verifyElementIsNotPresent(this.page, this.btnResponseTab);
	}
}

export { TeamAnalyticsPage };

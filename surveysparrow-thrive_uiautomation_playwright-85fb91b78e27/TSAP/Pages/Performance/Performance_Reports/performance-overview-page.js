import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { expect } from "@playwright/test";
import { constants } from "../../../Data/Resources/constants.js";
import { Calculations } from "../../../Shared_Functions/calculations.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";
import { SurveyPage } from "../../Surveys/Survey_Listing_Page/survey-page.js";
class PerformanceOverviewPage {
	constructor(page) {
		this.page = page;
		this.calculations = new Calculations();
		this.commonutils = new CommonUtils();
		this.commonfunctions = new CommonPageFunctions(page);
		this.surveyPage = new SurveyPage(page);
		this.lblOverallScore =
			"//p[text()='Overall Score']/ancestor::div[2]/following-sibling::div//h1";
		this.txtCompletedCount = "//p[text()='Completed']/following-sibling::p";
		this.txtInprogressCount = "//p[text()='In Progress']/following-sibling::p";
		this.txtReadyCount = "//p[text()='Ready']/following-sibling::p";
		this.txtPending = "//p[text()='Pending']/following-sibling::p";
		this.webelementsCompetencySummarySection =
			"//*[name()='g' and @class='recharts-layer recharts-cartesian-axis-tick']//*[name()='tspan']";
		this.webelementsCompetencySummaryBarGraphs =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ilerLnQ-css']//*[name()='g' and @class='recharts-layer recharts-bar-rectangle']"; // class name is not unique
		this.txtSectionNameFromCompetencySummaryGraph =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ilerLnQ-css']//div[contains(@class, 'recharts-tooltip-wrapper')]//p[contains(@class,'twigs-c-kbyIfK-ilmQxFH-css')]"; // class name is not unique
		this.graphCompetencySummaryGraphScore =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ilerLnQ-css']//div[contains(@class, 'recharts-tooltip-wrapper')]//div//span";
		this.textRoleLabels =
			"//h1[text()='Radar Chart']/parent::div/following-sibling::div//label//p";
		this.getPerformanceSummaryCellXpath = (entityName, field) =>
			`//table//tr[td[normalize-space()='${entityName}'] or .//img[@alt='${entityName}']]/td[count(//table//th[normalize-space()='${field}']/preceding-sibling::th) + 1]//p[1]`;
		this.getScoreOnTopPerformersDialog = (performerName) =>
			`//div[@role='dialog' and @data-state='open']//p[normalize-space()='${performerName}']/ancestor::div[@data-testid='flex'][1]/following-sibling::div/p[1]`;
		this.btnCloseTopPerformersModal = "//h1/parent::div//button[3]";
		this.txtEntityName = (entityName) =>
			`//tbody//td//p[text()="${entityName}"]`;
		this.filterGroupBy = "//label[normalize-space(.)='Group By']";
		this.optionDropdownGroupBy = (groupBy) =>
			`//div[@role="menuitem"]//p[text()="${groupBy}"]`;
		this.txtOverallScore =
			'//p[text()="Overall Score"]/ancestor::div[2]/following-sibling::div//h1';
		this.txtOverallScoreRatingScaleValue =
			'//p[text()="Overall Score"]/ancestor::div[2]/following-sibling::div//p';
		this.widgetForCompetency = (competencyName) =>
			`//*[@name='${competencyName}' and @class='recharts-rectangle']`;
		this.txtScoreOfCompetency = (competencyName) =>
			`//p[text()="${competencyName}"]//following-sibling::div//span`;
	}
	/* this function calculates Overall Scroll from the stored resposnse json file and fetch the Overall 
	 Score from Overviewpage. It compare both score*/
	async verifyOverallScore() {
		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);
		const { overallScoreAfterRounded: expected_score } =
			await Calculations.performanceOverallScore(
				responseData[constants.subjectName],
			);
		const actual_score = await PwActions.getText(
			this.page,
			this.lblOverallScore,
		);
		await PwActions.verifyTextExpected(expected_score, actual_score);
	}

	/**
	 * Verifies the evaluation summary counts for completed and in-progress items.
	 *
	 * @param {string | number} completeCount - The expected count of completed evaluations.
	 * @param {string | number} inprogressCount - The expected count of in-progress evaluations.
	 *
	 * This function compares the provided `completeCount` and `inprogressCount` values
	 * against the actual text retrieved from the UI elements corresponding to
	 * completed and in-progress evaluation counts. It uses the `PwActions.verifyTextExpected`
	 * method for comparison, ensuring the displayed values match the expected counts.
	 */
	async verifyEvaluationSummary(completeCount, inprogressCount) {
		const completedText = await PwActions.getText(
			this.page,
			this.txtCompletedCount,
		);
		const inprogressText = await PwActions.getText(
			this.page,
			this.txtInprogressCount,
		);
		await PwActions.verifyTextExpected(completeCount, completedText);
		await PwActions.verifyTextExpected(inprogressCount, inprogressText);
	}

	/**
	 * Verifies the report summary by comparing the provided ready and pending counts
	 * with the text values retrieved from the page.
	 *
	 * @param {number} readyCount - The expected count of ready reports.
	 * @param {number} pendingCount - The expected count of pending reports.
	 */
	async verifyReportSummary(readyCount, pendingCount) {
		await PwActions.verifyTextExpected(
			readyCount,
			await PwActions.getText(this.page, this.txtReadyCount),
		);
		await PwActions.verifyTextExpected(
			pendingCount,
			await PwActions.getText(this.page, this.txtPending),
		);
	}

	/**
	 * Retrieves the competency summary graph score from the page.
	 *
	 * This function fetches the text values of the competency name and competency score
	 * from the competency summary graph section of the page.
	 *
	 * @returns {[string, string]>} -  an array containing the competency name and competency score.
	 */
	async getCompetencySummaryGraphScore() {
		const competencyName = await PwActions.getText(
			this.page,
			this.txtSectionNameFromCompetencySummaryGraph,
		);
		const competencyScore = await PwActions.getText(
			this.page,
			this.graphCompetencySummaryGraphScore,
		);
		return [competencyName, competencyScore];
	}

	/**
	 * Verifies the competency summary by comparing the scores from the page with the expected scores.
	 *
	 * This function reads the survey response data from JSON file and calculate competency score for each section,
	 * retrieves the competency summary details from the page, and compares the actual scores with the expected scores.
	 * If the section is "Overall Summary", it compares the score with the overall performance score. For other sections,
	 * it compares the score with the section-wise competency score.
	 *
	 * @returns {Promise<void>} - A promise that resolves when the verification is complete.
	 */
	async verifyCompetencySummary() {
		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);
		let competencySummaryDetails = [];

		for (const element of await PwActions.getWebElements(
			this.page,
			this.webelementsCompetencySummaryBarGraphs,
		)) {
			await element.hover();
			competencySummaryDetails = await this.getCompetencySummaryGraphScore();
			const section = competencySummaryDetails[0];
			const score = competencySummaryDetails[1];
			if (section === "Overall Summary") {
				const { overallScoreAfterRounded: expectedScore } =
					await Calculations.performanceOverallScore(
						responseData[constants.subjectName],
					);
				await PwActions.verifyTextExpected(score, expectedScore);
			} else {
				const { sectionWiseCompetencyScore: expectedScore } =
					await Calculations.sectionWiseCompetencyScore(
						responseData[constants.subjectName],
						section,
					);
				await PwActions.verifyTextExpected(score, expectedScore);
			}
		}
	}

	/**
	 * Extracts all role label texts from the Radar Chart section in Overview page
	 * @returns {Promise<Array<string>>} Array of all role label texts
	 * @example
	 * const allLabels = await performanceOverviewPage.getAllRoleLabelsFromOverview();
	 * // Returns: ["Self 1", "Peer 1", "Manager 1", "Reportee 1", "Custom 1"]
	 */
	async getAllRoleLabelsFromOverview() {
		await PwActions.waitForElement(this.page, this.textRoleLabels);
		const labelElements = await PwActions.getWebElements(
			this.page,
			this.textRoleLabels,
		);
		const allRoleLabels = await PwActions.getElementsText(
			this.page,
			labelElements,
		);
		return allRoleLabels;
	}

	/**
	 * Verifies role labels in the Overview page's Radar Chart section.
	 * Can verify expected labels are present AND/OR disabled labels are absent.
	 *
	 * @param {Object} options - Verification options
	 * @param {string[]} [options.expectedLabels] - Labels that should be present (exact match)
	 * @param {string[]} [options.disabledLabels] - Labels that should NOT be present
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Verify all expected labels are present
	 * await performanceOverviewPage.verifyRoleLabelsInOverview({
	 *   expectedLabels: ["Self 1", "Peer 1", "Manager 1"]
	 * });
	 *
	 * // Verify disabled labels are not shown
	 * await performanceOverviewPage.verifyRoleLabelsInOverview({
	 *   disabledLabels: ["Peer 1", "Custom 1"]
	 * });
	 *
	 * // Verify both at once
	 * await performanceOverviewPage.verifyRoleLabelsInOverview({
	 *   expectedLabels: ["Self 1", "Manager 1"],
	 *   disabledLabels: ["Peer 1"]
	 * });
	 */
	async verifyRoleLabelsInOverview({
		expectedLabels = [],
		disabledLabels = [],
	}) {
		const actualLabels = await this.getAllRoleLabelsFromOverview();

		if (expectedLabels.length > 0) {
			expect(actualLabels.sort()).toEqual(expectedLabels.sort());
		}

		for (const disabledLabel of disabledLabels) {
			expect(actualLabels).not.toContain(disabledLabel);
		}
	}

	/**
	 * Verifies the scorings displayed on the Overview page based on the provided settings.
	 * Each setting represents the EXPECTED value that will be compared against the actual value on the page.
	 *
	 * @param {Object} params - The parameters object.
	 * @param {Object} [params.settings={}] - Settings object containing the expected values to verify.
	 * @param {string|number} [params.settings.overallScore] - The expected overall score value (e.g., "2.26").
	 *
	 * @example
	 * // Verify overall score
	 * await performanceOverviewPage.verifyOverviewScorings({
	 *   settings: { overallScore: "2.26" }
	 * });
	 *
	 * @example
	 * // Verify multiple scorings (extensible)
	 * await performanceOverviewPage.verifyOverviewScorings({
	 *   settings: { overallScore: "2.26", competencyScore: "3.5" }
	 * });
	 */
	async verifyOverviewScorings({ settings = {} } = {}) {
		if (settings.overallScore) {
			await PwActions.waitForElementVisibility(this.page, this.lblOverallScore);
			const actualOverallScore = await PwActions.getText(
				this.page,
				this.lblOverallScore,
			);
			await PwActions.verifyTextExpected(
				actualOverallScore,
				settings.overallScore,
			);
		}
	}

	/**
	 * Verifies performance summary by comparing page scores against expected values.
	 *
	 * Accepts a pre-calculated summary object matching a section from `adminPerformanceSummary`
	 * in `predefined_test_data.js`:
	 * - departments: { [key]: { label, overall_score, topPerformers[], topCompetency, orgComparisonScore } }
	 * - employees: { [key]: { label, overall_score, topCompetency, orgComparisonScore } }
	 * - teams: { [key]: { label, overall_score, topPerformers[], topCompetency, orgComparisonScore } }
	 *
	 * @param {Object} params - Parameters object.
	 * @param {Object} params.summaryData - One section from adminPerformanceSummary (departments/employees/teams).
	 * @param {Object} [params.page=this.page] - Playwright page object (optional, defaults to instance page).
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await performanceOverviewPage.verifyPerformanceSummary({ summaryData: adminPerformanceSummary.departments });
	 * await performanceOverviewPage.verifyPerformanceSummary({ summaryData: adminPerformanceSummary.employees });
	 * await performanceOverviewPage.verifyPerformanceSummary({ summaryData: adminPerformanceSummary.teams });
	 * // With custom page object
	 * await performanceOverviewPage.verifyPerformanceSummary({ page: customPage, summaryData: adminPerformanceSummary.teams });
	 */
	async verifyPerformanceSummary({ page = this.page, summaryData }) {
		for (const [entityName, entityData] of Object.entries(summaryData)) {
			const { "Top Performers": topPerformers, ...otherFields } = entityData;
			if (topPerformers) {
				await PwActions.click(page, this.txtEntityName(entityName));
				await Promise.all(
					topPerformers.map(async ({ name, score }) => {
						const actualScore = await PwActions.getText(
							page,
							this.getScoreOnTopPerformersDialog(name),
						);
						await PwActions.verifyTextExpected(score, actualScore);
					}),
				);
				await PwActions.click(page, this.btnCloseTopPerformersModal);
			}

			await Promise.all(
				Object.entries(otherFields).map(async ([field, expectedValue]) => {
					const actualValue = await PwActions.getText(
						page,
						this.getPerformanceSummaryCellXpath(entityName, field),
					);
					await PwActions.verifyTextExpected(expectedValue, actualValue);
				}),
			);
		}
	}

	/**
	 * Changes the Group By filter to view performance summary by different organizational units.
	 *
	 * @param {Object} params - Parameters object.
	 * @param {string} params.groupBy - Grouping option: "Departments", "Employees", or "Teams".
	 * @param {Object} [params.page=this.page] - Playwright page object (optional).
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await performanceOverviewPage.changeGroupBy({ groupBy: "Departments" });
	 * await performanceOverviewPage.changeGroupBy({ groupBy: "Employees" });
	 * await performanceOverviewPage.changeGroupBy({ page: customPage, groupBy: "Teams" });
	 */
	async changeGroupBy({ page = this.page, groupBy }) {
		await PwActions.click(page, this.filterGroupBy);
		await PwActions.click(page, this.optionDropdownGroupBy(groupBy));
	}

	/**
	 * Verifies the performance competency summary widget by comparing
	 * each competency's displayed score against the expected value.
	 *
	 * @param {Object} params
	 * @param {import('@playwright/test').Page} [params.page=this.page] - Playwright page object.
	 * @param {Array<{ competencyName: string, score: string }>} params.competencySummaryWidgetData
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await performanceOverviewPage.verifyPerformanceCompetencySummaryWidget({
	 *   competencySummaryWidgetData: [
	 *     { competencyName: 'Leadership Skills',    score: '3.5' },
	 *     { competencyName: 'Communication Skills', score: '3.0' },
	 *     { competencyName: 'Team Skills',          score: '3.2' },
	 *   ],
	 * });
	 */
	async verifyPerformanceCompetencySummaryWidget({
		page = this.page,
		competencySummaryWidgetData = [],
	}) {
		await this.commonfunctions.navigateToSideBarMenu("Overview");
		for (const {
			competencyName,
			score: expectedScore,
		} of competencySummaryWidgetData) {
			const widgetLocator = this.widgetForCompetency(competencyName);
			const scoreLocator = this.txtScoreOfCompetency(competencyName);

			await PwActions.waitForElementVisibility(page, widgetLocator);
			await PwActions.hover(page, widgetLocator);
			await PwActions.waitForElementVisibility(page, scoreLocator);

			const actualScore = await PwActions.getText(page, scoreLocator);
			await PwActions.verifyTextExpected(expectedScore, actualScore);
		}
	}

	/**
	 * Navigates to the Reports Overview and verifies the overall score
	 * and optional rating scale value against expected values.
	 *
	 * @param {Object} params
	 * @param {import('@playwright/test').Page} [params.page=this.page] - Playwright page object.
	 * @param {string} params.overallScore - Expected overall score text.
	 * @param {string} [params.overallScoreRatingScaleValue] - Expected rating scale label (optional).
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await performanceOverviewPage.verifyOverallScore({
	 *   overallScore:                  '3.5',
	 *   overallScoreRatingScaleValue:  'Exceeds Expectations',
	 * });
	 * This function will verify the overall score and overall score rating scale value on the Overview page.
	 * If the overall score rating scale value is not provided, it will not verify the overall score rating scale value.
	 */
	async verifyOverallScoreWidget({
		page = this.page,
		overallScore,
		overallScoreRatingScaleValue,
	}) {
		await this.commonfunctions.navigateToSideBarMenu("Overview");
		await PwActions.waitForElementVisibility(page, this.txtOverallScore);
		const actualOverallScore = await PwActions.getText(
			page,
			this.txtOverallScore,
		);
		await PwActions.verifyTextExpected(overallScore, actualOverallScore);
		if (!overallScoreRatingScaleValue) return;
		await PwActions.waitForElementVisibility(
			page,
			this.txtOverallScoreRatingScaleValue,
		);
		const actualRatingScaleValue = await PwActions.getText(
			page,
			this.txtOverallScoreRatingScaleValue,
		);
		await PwActions.verifyTextContains(
			actualRatingScaleValue,
			overallScoreRatingScaleValue,
		);
	}
}
export { PerformanceOverviewPage };

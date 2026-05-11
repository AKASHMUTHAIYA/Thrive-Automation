import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { Calculations } from "../../../Shared_Functions/calculations.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { EngageManagerView } from "./engage-manager-view.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";
import { expect } from "@playwright/test";
import { EngageReportsBasePage } from "./engage-reports-page.js";
import { constants } from "../../../Data/Resources/constants.js";

const GROUP_KEY_MAP = {
	Department: "department",
	"Job Title": "jobtitle",
	Manager: "manager",
	Tenure: "tenure",
	Tags: "tags",
	"Custom Dropdown": "custom_dropdown",
	Gender: "gender",
	Country: "country",
	Location: "location",
	"Reporting Factors": "sections",
	Sections: "sections",
	Cluster: "cluster",
};

const FILTER_OPTIONS = ["Reporting Factors", "Questions"];
const FILTER_KEY_MAP = {
	"Reporting Factors": "reporting_factors",
	Questions: "questions",
};

class EngageHeatmapPage extends EngageReportsBasePage {
	// without calculations
	constructor(page) {
		super(page);
		this.commonutils = new CommonUtils();
		this.txtHeatmapByQuestionsOrReportingFactors = `(//th[1]//div)[1]`;
		this.optionHeatmapByQuestionsOrReportingFactors = (option) =>
			`//th[1]//div[@aria-disabled][contains(., '${option}')]`;
		this.txtHeatmapScores = (reportingFactorOrQuestion, groupByPropertyName) =>
			`//tr[.//p[normalize-space()='${reportingFactorOrQuestion}']]/td[position() = count(//th[.//p[normalize-space()='${groupByPropertyName}']]/preceding-sibling::th) + 1 ]//p[@data-testid='text'][1]`;
	}

	/**
	 * Helper method to get the expected score value based on scoreBy type
	 * @param {Object} itemData - The item data object
	 * @param {string} scoreBy - Score type ("Favourability Score" or "Percentage Score")
	 * @returns {string} - The expected score value
	 * @example
	 * // Usage example in a Playwright test:
	 * const heatmapPage = new EngageHeatmapPage(page);
	 * const expectedScore = heatmapPage.getExpectedScore({ favvalue: "87.5%" }, "Favourability Score");
	 * expect(expectedScore).toBe("87.5%");
	 */
	getExpectedScore(itemData, scoreBy) {
		const scoreField = this.getScoreValueField(scoreBy);
		return CommonUtils.extractByFormat(itemData[scoreField], "score");
	}

	/**
	 * Gets the score text from the heatmap
	 * @param {string} itemLabel - The item label
	 * @param {string} columnName - The column name
	 * @returns {Promise<string>} - Extracted score
	 * @example
	 * //
	 * const heatmapPage = new EngageHeatmapPage(page);
	 * const score = await heatmapPage.getHeatmapScore("Rating Scale 1", "Overall Score");
	 */
	async getHeatmapScore(itemLabel, columnName) {
		const scoreText = await PwActions.getText(
			this.page,
			this.txtHeatmapScores(itemLabel, columnName),
		);
		return CommonUtils.extractByFormat(scoreText, "score");
	}

	/**
	 * Verifies the Heatmap tab data for Reporting Factors and Questions
	 * @param {Object} params - Options
	 * @param {Object} params.expectedData - Expected engagement admin report data (`Heatmap` / `heatmap` keys)
	 * @param {Array|null} [params.filterBy] - Filter objects with `groupByName` and `filters`
	 * @param {string} [params.scoreBy] - Score type selector label
	 * @param {string|null} [params.clusterName] - Dynamic cluster Group By label (e.g. `Cluster_${timestamp}`); expected rows live under `expectedData.Heatmap.cluster`
	 * @returns {Promise<void>}
	 * @example
	 * //
	 * const heatmapPage = new EngageHeatmapPage(page);
	 * await heatmapPage.verifyHeatmapTab(engage_admin_report_data);
	 *
	 * // With filters:
	 * await heatmapPage.verifyHeatmapTab(engage_admin_report_data_with_filter, [
	 *   { groupByName: "Gender", filterByKey: "custom dropdown", filterByValue: "option2" }
	 * ]);
	 */
	async verifyHeatmapTab({
		expectedData,
		filterBy = null,
		scoreBy = "Favourability Score",
		clusterName = null,
	}) {
		if (scoreBy) {
			await this.selectScoreType(scoreBy);
		}
		// Get group by options
		await PwActions.click(this.page, this.btnGroupBy);
		const groupByList = await PwActions.getElementsText(
			this.page,
			await PwActions.getWebElements(this.page, this.webElementsDrpdwnList),
		);
		await PwActions.click(this.page, this.optionDrpDownOptions(groupByList[0]));

		let optionsToLoop = constants.engageOverviewGroupByOptions;
		if (filterBy && Array.isArray(filterBy) && filterBy.length > 0) {
			optionsToLoop = [
				...new Set(filterBy.map((filter) => filter.groupByName)),
			];
		}

		// if (clusterName && !optionsToLoop.includes(clusterName)) {
		// 	optionsToLoop = [...optionsToLoop, clusterName];
		// }
		//there is a bug in heatmap reports when group by cluster is applied. Ticket - TEG-15799

		for (const groupByOption of optionsToLoop) {
			await this.resetFilter();
			if (groupByOption === "Rounds" || groupByOption === "Reporting Factors")
				continue;

			await PwActions.click(this.page, this.btnGroupBy);
			await PwActions.click(
				this.page,
				this.optionDrpDownOptions(groupByOption),
			);
			await CommonUtils.sleep(2);

			let groupKey;
			if (clusterName && groupByOption === clusterName) {
				groupKey = "cluster";
			} else {
				groupKey =
					GROUP_KEY_MAP[groupByOption] ||
					CommonUtils.extractByFormat(groupByOption, "filter_key");
			}

			let appliedFilter = null;
			if (filterBy && Array.isArray(filterBy)) {
				appliedFilter = filterBy.find(
					(filter) => filter.groupByName === groupByOption,
				);
				if (appliedFilter) {
					await this.applyEngageFilter(appliedFilter);
					await CommonUtils.sleep(2);
				}
			}

			let engagementSummaryData;
			let groupNames = [];

			if (appliedFilter) {
				engagementSummaryData =
					expectedData.Overview[groupKey]?.engagement_summary;
				if (engagementSummaryData) {
					groupNames = [engagementSummaryData.name];
				}
			} else {
				engagementSummaryData =
					expectedData.Overview.engagement_summary?.[groupKey];
				if (engagementSummaryData && Array.isArray(engagementSummaryData)) {
					groupNames = engagementSummaryData.map((item) => item.name);
				}
			}

			if (!groupNames.length) {
				continue;
			}

			for (const filterOption of FILTER_OPTIONS) {
				await PwActions.click(
					this.page,
					this.txtHeatmapByQuestionsOrReportingFactors,
				);
				await PwActions.click(
					this.page,
					this.optionHeatmapByQuestionsOrReportingFactors(filterOption),
				);
				await CommonUtils.sleep(2);

				let expectedHeatmapData;

				if (
					appliedFilter &&
					appliedFilter.filters &&
					appliedFilter.filters.length > 0
				) {
					let heatmapPath = null;

					if (appliedFilter.filters.length > 1) {
						const combinedFilterKey = appliedFilter.filters
							.map(
								(f) =>
									GROUP_KEY_MAP[f.filterByKey] ||
									CommonUtils.extractByFormat(f.filterByKey, "filter_key"),
							)
							.sort()
							.join("_");

						const allValues = appliedFilter.filters.flatMap((f) =>
							f.filterByValues.map((val) =>
								CommonUtils.extractByFormat(val, "filter_key"),
							),
						);
						const combinedValueKey = allValues.sort().join("_");

						heatmapPath =
							expectedData.heatmap?.[groupKey]?.[combinedFilterKey]?.[
								combinedValueKey
							];
					}

					// Fallback to first filter only if combined key not found
					if (!heatmapPath) {
						const firstFilter = appliedFilter.filters[0];
						const filterKey =
							GROUP_KEY_MAP[firstFilter.filterByKey] ||
							CommonUtils.extractByFormat(
								firstFilter.filterByKey,
								"filter_key",
							);
						const filterValue = CommonUtils.extractByFormat(
							firstFilter.filterByValues[0],
							"filter_key",
						);
						heatmapPath =
							expectedData.heatmap?.[groupKey]?.[filterKey]?.[filterValue];
					}

					expectedHeatmapData = heatmapPath?.[FILTER_KEY_MAP[filterOption]];
				} else {
					expectedHeatmapData =
						expectedData.Heatmap?.[groupKey]?.[FILTER_KEY_MAP[filterOption]];
				}

				if (!expectedHeatmapData) {
					continue;
				}

				const itemsToVerify = Object.keys(expectedHeatmapData);

				for (const itemKey of itemsToVerify) {
					const itemData = expectedHeatmapData[itemKey];
					const itemLabel = itemData.label;

					// Verify Overall Score
					const overallScoreUI = await this.getHeatmapScore(
						itemLabel,
						"Overall Score",
					);
					const overallScoreExpected = this.getExpectedScore(
						itemData.overall_score,
						scoreBy,
					);
					await PwActions.verifyTextExpected(
						overallScoreUI,
						overallScoreExpected,
					);

					// Verify scores for each group
					for (const groupName of groupNames) {
						const groupNameKey = CommonUtils.extractByFormat(
							groupName,
							"filter_key",
						);

						if (itemData[groupNameKey]) {
							const displayName =
								groupName === "Uncategorized" ? "uncategorized" : groupName;
							const groupScoreUI = await this.getHeatmapScore(
								itemLabel,
								displayName,
							);
							const groupScoreExpected = this.getExpectedScore(
								itemData[groupNameKey],
								scoreBy,
							);
							await PwActions.verifyTextExpected(
								groupScoreUI,
								groupScoreExpected,
							);
						}
					}
				}
			}
		}
	}
}

/**
 * HeatmapEngagePulsePage class represents the page object for the Engage Pulse Heatmap view
 * This class handles interactions and validations for the manager's heatmap view in the Engage Pulse module
 */
class HeatmapEngagePulsePage {
	/**
	 * Constructor for HeatmapEngagePulsePage
	 * @param {Page} page - Playwright page object
	 */
	constructor(page) {
		this.page = page;
		this.calculations = new Calculations();
		this.commonutils = new CommonUtils();
		this.commonfunction = new CommonPageFunctions(this.page);
		this.engageManagerView = new EngageManagerView(page);
		// XPath selectors for the overall score and all reportees score in the heatmap table
		this.txtEngagePulseManagerOverallScore =
			"//table/tbody//p[text()='Overall Score']/ancestor::tr/td[2]//p";
		this.txtEngagePulseManagerAllReportees =
			"(//table/tbody//p[text()='Overall Score']/ancestor::tr/td[3]//p)[1]";
		this.btnDownloadCsv =
			"//*[name()='svg']/*[name()='path' and @d='M16 22.6667V4']/ancestor::button";
	}

	/**
	 * Verifies the overall favourability scores in the Engage Pulse Heatmap
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const heatmapPage = new HeatmapEngagePulsePage(page);
	 * await heatmapPage.verifyOverallFavourabilityEngagePulseHeatmap();
	 */
	async verifyOverallFavourabilityEngagePulseHeatmap() {
		await CommonUtils.sleep(3);
		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);

		const { favourableScore } = Calculations.engagePulseOverallFavourability(
			responseData["Subject"],
		);

		const [overallScoreText, allReporteesText] = await Promise.all([
			PwActions.getText(this.page, this.txtEngagePulseManagerOverallScore),
			PwActions.getText(this.page, this.txtEngagePulseManagerAllReportees),
		]);

		const expectedScore = CommonUtils.normalizeScore(
			favourableScore.toFixed(1),
		).toString();
		const actualOverallScore =
			CommonUtils.normalizeScore(overallScoreText).toString();
		const actualAllReportees =
			CommonUtils.normalizeScore(allReporteesText).toString();

		await PwActions.verifyTextExpected(expectedScore, actualOverallScore);
		await PwActions.verifyTextExpected(expectedScore, actualAllReportees);
		await PwActions.verifyTextExpected(actualOverallScore, actualAllReportees);

		const { filePath } = await this.commonfunction.downloadFileAndReturnPath(
			this.page,
			this.btnDownloadCsv,
		);
		await this.commonfunction.verifyDownloadedCSV(filePath);
	}
}

export { EngageHeatmapPage, HeatmapEngagePulsePage };

import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { Calculations } from "../../../Shared_Functions/calculations.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { EngagePulseManagerENPSPage } from "./engage-eNPS-page.js";
import { EngageManagerView } from "./engage-manager-view.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";
import { constants } from "../../../Data/Resources/constants.js";
import logger from "playwright-framework/Core/logger.js";
import { expect } from "@playwright/test";
import { EngageReportsBasePage } from "./engage-reports-page.js";
import { SurveyPage } from "../../Surveys/Survey_Listing_Page/survey-page.js";

class EngageOverviewPage extends EngageReportsBasePage {
	constructor(page) {
		super(page);
		this.commonutils = new CommonUtils();
		this.surveyPage = new SurveyPage(page);
		this.txtNoData = "//h1[text()='Sip on some coffee']";
		this.txtOverallScore = "//div[p[contains(., 'Score')]]//h1";
		this.txtparticipationRate =
			"//div[p[contains(., 'Summary')]]//p[contains(., 'Rate')]";
		this.txtParticipantsCount =
			"//div[p[contains(., 'Summary')]]//p[contains(., 'Participants')]";
		this.txtResponsesCount =
			"//div[p[contains(., 'Summary')]]//p[contains(., 'Responses')]";
		this.txtMostEngagedName = "//div[p[contains(., 'Most Engaged')]]//p[2]";
		this.txtMostEngagedScore = "//div[p[contains(., 'Most Engaged')]]//div//h1";
		this.txtMostEngagedComparison =
			"//div[p[contains(., 'Most Engaged')]]//div//a//p";
		this.txtLeastEngagedName = "//div[p[contains(., 'Least Engaged')]]//p[2]";
		this.txtLeastEngagedScore =
			"//div[p[contains(., 'Least Engaged')]]//div//h1";
		this.txtLeastEngagedComparison =
			"//div[p[contains(., 'Least Engaged')]]//div//a//p";

		this.txtEngagementScoreInsideModal = (surveyType, name) =>
			`//p[normalize-space()='${surveyType} SUMMARY']/following::p[normalize-space()='${name}']/following::p[1]`;
		this.txtScoreInsideModal =
			"(//p[contains(text(),'Employees')]//ancestor::div//table//td[2]//p)";
		this.tableInsideModal =
			"//p[contains(text(),'Employees')]//ancestor::div//table";
		this.txtEngagementScoreInsideModalList =
			"//p[contains(text(),'Employees')]//ancestor::div//table//td[3]//p";
		this.txtAnsweredQuestionsCountInsideModalList =
			"//p[contains(text(),'Employees')]//ancestor::div//table//td[2]//p";
		this.engagementSummaryRow = (name) =>
			`//tr[.//td//p[normalize-space()='${name}']]/td//div[@role='group']`;
		this.btnSearchIconInsideModal = `//*[name()='svg']/*[local-name() ='path' and @d="M18.8666 18.7467L26.6666 26.6533"]`;
		this.inputSearchIconInsideModal = `//input[@placeholder='Search employees']`;
		this.txtNoDataCopy = "//p[contains(text(),'no data')]";
		this.btnCloseModal = `//*[name()='svg']/*[local-name() ='path' and @d='M10.6667 10.6667L21.3333 21.3333']`;
		this.txtOverviewTabHeader = "//h1[text()='Overview']";
		this.webElementsRespondentDistributionBars = (name) =>
			`(//h1[contains(text(),"Distribution")]//ancestor::div[3]//*[local-name()='svg']//*[local-name()='path' and @name="${name}"])[1]`;
		this.webElementsScoreComaprisons = (name) =>
			`(//h1[contains(text(),"Score Comparison")]//ancestor::div[3]//*[local-name()='svg']//*[local-name()='path' and @name="${name}"])[1]`;
		this.btnStartAnalyzing =
			"//button[@data-testid='no-data_button_start-analyzing']";
		this.txtMaintainAndMonitor = "//p[text()='Maintain & Monitor']";
	}

	/**
	 * Verifies engaged section (Most/Least Engaged)
	 * @param {string} option - Current group option
	 * @param {string} type - 'Most' or 'Least'
	 * @param {Object} expectedData - Expected data object
	 * @param {string} key - Data key for lookup
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageOverviewPage(page);
	 * await overviewPage.verifyEngagedSection("Most", expectedData, "department");
	 *
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageOverviewPage(page);
	 * await overviewPage.verifyEngagedSection("Least", { Overview: { least_engaged: { jobtitle: { name: "Job 1", favscore: "87.5%", favcomparison: "37.5" } } } }, "jobtitle");
	 */
	async verifyEngagedSection(type, expectedData, key) {
		const selectors = {
			name:
				type === "Most" ? this.txtMostEngagedName : this.txtLeastEngagedName,
			score:
				type === "Most" ? this.txtMostEngagedScore : this.txtLeastEngagedScore,
			comparison:
				type === "Most"
					? this.txtMostEngagedComparison
					: this.txtLeastEngagedComparison,
		};
		const expectedDataKey = type === "Most" ? "most_engaged" : "least_engaged";

		if (!(await PwActions.elementIsVisible(this.page, selectors.name, 2))) {
			return;
		}

		const [name, score, comparison] = await Promise.all([
			PwActions.getText(this.page, selectors.name),
			PwActions.getText(this.page, selectors.score),
			PwActions.getText(this.page, selectors.comparison),
		]);

		const expectedEngaged = expectedData.Overview[expectedDataKey][key];
		if (expectedEngaged) {
			expect(name?.trim().toLowerCase()).toBe(
				expectedEngaged.name.trim().toLowerCase(),
			);
			expect(score?.trim()).toBe(expectedEngaged.favscore.trim());
			expect(comparison?.trim()).toBe(expectedEngaged.favcomparison.trim());
		}
	}
	/**
	 * Verifies the no data message
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageOverviewPage(page);
	 * await overviewPage.verifyNoDataMessage();
	 */

	async verifyNoDataMessage() {
		await this.surveyPage.navigateTopSections("Reports");
		await PwActions.pageRefresh(this.page);
		await PwActions.waitTillVisible(this.page, this.txtNoData);
		await PwActions.verifyElementIsPresent(this.page, this.txtNoData);
	}

	/**
	 * Generates text insights by clicking the "Start Analyzing" button
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageOverviewPage(page);
	 * await overviewPage.generateTextInsights();
	 */
	async generateTextInsights() {
		await PwActions.waitForElement(this.page, this.btnStartAnalyzing);
		await PwActions.click(this.page, this.btnStartAnalyzing);
		await CommonUtils.sleep(5);
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.btnStartAnalyzing,
		);
	}

	/**
	 * Verifies non-anonymous modal for engagement summary
	 * @param {string} name - Summary item name
	 * @param {string} surveyType - Survey type
	 * @param {Object} expectedData - Expected data
	 * @param {string} key - Data key
	 * @param {string} scoreBy - Score type: "Favourability Score" or "Percentage Score"
	 * @param {Object} appliedFilter - Applied filter object (optional)
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageOverviewPage(page);
	 * await overviewPage.verifyNonAnonymousModal({ name: "Engineering", surveyType: "Engage", expectedData: {department: [
	 * 	{name: "Engineering", favscore: "37.5", perscore: "60", favcomparison: "12.5", responses: "4", individualFavScores: ["75%", "0%", "0%", "75%"], individualPercentScores: ["80%", "40%", "40%", "80%"], positiveSearchEmployee: "Engage Automation 1", negativeSearchEmployee: "Subject Automation 1"}
	 * ]}, key: "department", scoreBy: "Favourability Score", appliedFilter: null });
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageOverviewPage(page);
	 * await overviewPage.verifyNonAnonymousModal({ name: "Engineering", surveyType: "Engage", expectedData: {department: [
	 * 	{name: "Engineering", favscore: "37.5", perscore: "60", favcomparison: "12.5", responses: "4", individualFavScores: ["75%", "0%", "0%", "75%"], individualPercentScores: ["80%", "40%", "40%", "80%"], positiveSearchEmployee: "Engage Automation 1", negativeSearchEmployee: "Subject Automation 1"}
	 * ]}, key: "department", scoreBy: "Favourability Score", appliedFilter: null });
	 */
	async verifyNonAnonymousModal({
		name,
		surveyType,
		expectedData,
		key,
		scoreBy = "Favourability Score",
		appliedFilter = null,
	}) {
		await PwActions.click(this.page, this.engagementSummaryRow(name));
		await PwActions.waitForElementVisibility(this.page, this.tableInsideModal);

		const tempSurveyType = surveyType === "Engagement" ? "ENGAGEMENT" : "PULSE";
		const engagementScoreInsideModal = await PwActions.getText(
			this.page,
			this.txtEngagementScoreInsideModal(tempSurveyType, name),
		);

		// Handle both filtered and non-filtered data structures
		let expectedItem;
		if (appliedFilter) {
			// For filtered data, expectedData.Overview[key]?.engagement_summary is an object
			const expectedSummary = expectedData.Overview[key]?.engagement_summary;
			if (
				expectedSummary &&
				!Array.isArray(expectedSummary) &&
				expectedSummary.name?.trim().toLowerCase() === name.trim().toLowerCase()
			) {
				expectedItem = expectedSummary;
			}
		} else {
			// For non-filtered data, expectedData.Overview.engagement_summary[key] is an array
			const expectedSummaryArray =
				expectedData.Overview.engagement_summary?.[key];
			if (Array.isArray(expectedSummaryArray)) {
				expectedItem = expectedSummaryArray.find(
					(item) =>
						item.name.trim().toLowerCase() === name.trim().toLowerCase(),
				);
			}
		}

		if (!expectedItem) {
			throw new Error(
				`Expected item not found for name: ${name}, key: ${key}, filter: ${appliedFilter ? "applied" : "none"}`,
			);
		}

		// Determine which score fields to use based on scoreBy
		const scoreField = scoreBy === "Percentage Score" ? "perscore" : "favscore";
		const individualScoresField =
			scoreBy === "Percentage Score"
				? "individualPercentScores"
				: "individualFavScores";

		expect(
			CommonUtils.extractByFormat(engagementScoreInsideModal, "score"),
		).toBe(expectedItem?.[scoreField]);

		// Verify individual scores
		let scoresInsideModalList = await PwActions.getAllInnerTexts(
			this.page,
			this.txtScoreInsideModal,
		);
		const expectedIndividualScores = expectedItem?.[individualScoresField];

		expect(scoresInsideModalList.length).toBe(expectedIndividualScores.length);
		expect([...scoresInsideModalList].sort()).toEqual(
			[...expectedIndividualScores].sort(),
		);
		// Verify search functionality
		await PwActions.click(this.page, this.btnSearchIconInsideModal);
		await PwActions.fill(
			this.page,
			this.inputSearchIconInsideModal,
			expectedItem?.positiveSearchEmployee,
		);
		await CommonUtils.sleep(1);
		await PwActions.waitForElementVisibility(this.page, this.tableInsideModal);

		scoresInsideModalList = await PwActions.getAllInnerTexts(
			this.page,
			this.txtScoreInsideModal,
		);
		expect(scoresInsideModalList.length).toBe(1);

		await PwActions.clearAndFill(
			this.page,
			this.inputSearchIconInsideModal,
			expectedItem?.negativeSearchEmployee,
		);
		await CommonUtils.sleep(1);
		await expect(this.page.locator(this.tableInsideModal)).not.toBeVisible();
		await expect(this.page.locator(this.txtNoDataCopy)).toBeVisible();
		await PwActions.click(this.page, this.btnCloseModal);
	}

	/**
	 * Verifies the Overview tab data by comparing with expected data
	 * @param {Object} params - Function parameters object
	 * @param {Object} params.expectedData - The expected engagement admin report data
	 * @param {string} [params.settings="anonymous"] - 'anonymous' or 'non-anonymous'
	 * @param {string} [params.surveyType="Engagement"] - 'Engage' or 'Pulse'
	 * @param {string} [params.viewType="admin"] - 'admin' or 'manager'
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageOverviewPage(page);
	 * await overviewPage.verifyOverviewTab({ expectedData: { Overview: { summary: { overall_score: "50", percentage_overall_score: "63.75", participation_rate: "100%", participants: "8", responses: "8" }, most_engaged: { department: { name: "Manager Team", favscore: "62.5%", perscore: "67.5%", favcomparison: "12.5", percomparison: "3.8" }, jobtitle: { name: "Job 1", favscore: "87.5%", favcomparison: "37.5" }, manager: { name: "Manager New", favscore: "50%", favcomparison: "Equal" }, tenure: { name: "6-12 months", favscore: "87.5%", favcomparison: "37.5" }, tag: { name: "Uncategorized", favscore: "50%", favcomparison: "Equal" }, custom_dropdown: { name: "option1", favscore: "87.5%", favcomparison: "37.5" }, gender: { name: "Male", favscore: "50%", favcomparison: "Equal" }, country: { name: "IN", favscore: "62.5%", favcomparison: "12.5" } } }, settings: "non-anonymous", surveyType: "Pulse", viewType: "manager" });
	 * @returns {Promise<void>}
	 */
	async verifyOverviewTab({
		expectedData,
		settings = "anonymous",
		surveyType = "Engagement",
		filterBy = null,
		scoreBy = "Favourability Score",
		viewType = "admin",
		clusterName = null,
	}) {
		const GROUP_KEY_MAP = {
			Department: "department",
			"Job Title": "jobtitle",
			Manager: "manager",
			Tenure: "tenure",
			Tag: "tag",
			"Custom Dropdown": "custom_dropdown",
			Gender: "gender",
			Country: "country",
			"Reporting Factors": "sections",
			Cluster: "cluster",
		};

		// Select score type if specified
		if (scoreBy) {
			await this.selectScoreType(scoreBy);
		}

		await PwActions.click(this.page, this.btnGroupBy);
		const groupByList = await PwActions.getAllInnerTexts(
			this.page,
			this.webElementsDrpdwnList,
		);

		if (viewType !== "admin") {
			expect(groupByList).not.toContain("Manager");
			const expectedOptionsWithoutManager =
				constants.engageOverviewGroupByOptions.filter(
					(option) => option !== "Manager",
				);
			expect(groupByList).toEqual(
				expect.arrayContaining(expectedOptionsWithoutManager),
			);
		} else {
			expect(groupByList).toEqual(
				expect.arrayContaining(constants.engageOverviewGroupByOptions),
			);
		}

		await PwActions.click(this.page, this.optionDrpDownOptions(groupByList[0]));

		let optionsToLoop = constants.engageOverviewGroupByOptions;
		if (filterBy && Array.isArray(filterBy) && filterBy.length > 0) {
			optionsToLoop = [
				...new Set(filterBy.map((filter) => filter.groupByName)),
			];
		}

		if (clusterName) {
			optionsToLoop = [...optionsToLoop, clusterName];
		}

		for (const option of optionsToLoop) {
			await this.resetFilter();
			if (scoreBy) {
				await this.selectScoreType(scoreBy);
			}
			if (viewType !== "admin" && option === "Manager") {
				continue;
			}
			await PwActions.click(this.page, this.btnGroupBy);
			await PwActions.click(this.page, this.optionDrpDownOptions(option));
			await PwActions.waitForNetworkIdle(this.page, 20000);
			await CommonUtils.sleep(5);
			await PwActions.waitForElementVisibility(this.page, this.txtOverallScore);

			let key;
			if (option === clusterName) {
				key = "cluster"; // Use static key for data lookup
			} else {
				key =
					GROUP_KEY_MAP[option] || option.toLowerCase().replace(/\s+/g, "_");
			}

			let appliedFilter = null;
			if (filterBy && Array.isArray(filterBy)) {
				appliedFilter = filterBy.find(
					(filter) => filter.groupByName === option,
				);
				if (appliedFilter) {
					await this.applyEngageFilter(appliedFilter);
					await CommonUtils.sleep(2);
				}
			}

			const [
				overallScore,
				participationRate,
				participantsCount,
				responsesCount,
			] = await Promise.all([
				PwActions.getText(this.page, this.txtOverallScore),
				PwActions.getText(this.page, this.txtparticipationRate),
				PwActions.getText(this.page, this.txtParticipantsCount),
				PwActions.getText(this.page, this.txtResponsesCount),
			]);

			let expectedTopSummary = expectedData.Overview.summary;
			if (
				appliedFilter &&
				appliedFilter.filters &&
				appliedFilter.filters.length > 0
			) {
				let filteredSummary = null;

				// For multiple filters, try combined key first
				if (appliedFilter.filters.length > 1) {
					// Create combined filter key: e.g., "country_gender"
					const combinedFilterKey = appliedFilter.filters
						.map(
							(f) =>
								GROUP_KEY_MAP[f.filterByKey] ||
								CommonUtils.extractByFormat(f.filterByKey, "filter_key"),
						)
						.sort()
						.join("_");

					// Create combined value key: e.g., "in_pk_male_female"
					const allValues = appliedFilter.filters.flatMap((f) =>
						f.filterByValues.map((val) =>
							CommonUtils.extractByFormat(val, "filter_key"),
						),
					);
					const combinedValueKey = allValues.sort().join("_");

					filteredSummary =
						expectedData.Overview[key].summary[combinedFilterKey]?.[
							combinedValueKey
						];
				}

				// Fallback to first filter only if combined key not found
				if (!filteredSummary) {
					const firstFilter = appliedFilter.filters[0];
					const filterValue = CommonUtils.extractByFormat(
						firstFilter.filterByValues[0],
						"filter_key",
					);
					let filterKey;
					if (firstFilter.filterByKey === clusterName) {
						filterKey = "cluster";
					} else {
						filterKey =
							GROUP_KEY_MAP[firstFilter.filterByKey] ||
							CommonUtils.extractByFormat(
								firstFilter.filterByKey,
								"filter_key",
							);
					}
					filteredSummary =
						expectedData.Overview[key].summary[filterKey]?.[filterValue];
				}

				if (filteredSummary) {
					expectedTopSummary = filteredSummary;
				}
			}

			const overallScoreField =
				scoreBy === "Percentage Score"
					? "percentage_overall_score"
					: "overall_score";

			expect(overallScore?.trim()).toBe(
				expectedTopSummary[overallScoreField].trim(),
			);
			expect(CommonUtils.extractByFormat(participationRate, "percentage")).toBe(
				expectedTopSummary.participation_rate.trim(),
			);
			expect(CommonUtils.extractByFormat(participantsCount, "integer")).toBe(
				expectedTopSummary.participants.trim(),
			);
			expect(CommonUtils.extractByFormat(responsesCount, "integer")).toBe(
				expectedTopSummary.responses.trim(),
			);

			if (filterBy === null) {
				await this.verifyEngagedSection("Most", expectedData, key);
				await this.verifyEngagedSection("Least", expectedData, key);
			}

			const engagementSummaryNames = await PwActions.getAllInnerTexts(
				this.page,
				this.webElementsEngagementSummaryNames,
			);
			for (const name of engagementSummaryNames) {
				await PwActions.waitForElementVisibility(
					this.page,
					this.webElementsScoreComaprisons(name),
				);
				if (option !== "Reporting Factors") {
					await PwActions.waitForElementVisibility(
						this.page,
						this.webElementsRespondentDistributionBars(name),
					);
				}
			}
			let engagementSummaryResponses;

			if (settings === "non-anonymous" && option !== "Reporting Factors") {
				for (const name of engagementSummaryNames) {
					await this.verifyNonAnonymousModal({
						name,
						surveyType,
						expectedData,
						key,
						scoreBy,
						appliedFilter,
					});
				}
			} else {
				engagementSummaryResponses = await PwActions.getAllInnerTexts(
					this.page,
					this.webElementsEngagementSummaryColumn("Responses"),
				);
			}

			const [engagementSummaryScores, engagementSummaryComparisons] =
				await Promise.all([
					PwActions.getAllInnerTexts(
						this.page,
						this.webElementsEngagementSummaryColumn("Score"),
					),
					PwActions.getAllInnerTexts(
						this.page,
						this.webElementsEngagementSummaryColumn("Comparison"),
					),
				]);

			let expectedSummary;

			// Determine which score and comparison fields to use based on scoreBy
			const scoreField =
				scoreBy === "Percentage Score" ? "perscore" : "favscore";
			const comparisonField =
				scoreBy === "Percentage Score" ? "percomparison" : "favcomparison";

			if (appliedFilter) {
				expectedSummary = expectedData.Overview[key]?.engagement_summary;

				if (expectedSummary && !Array.isArray(expectedSummary)) {
					const idx = engagementSummaryNames.findIndex(
						(n) =>
							n?.trim().toLowerCase() ===
							expectedSummary.name.trim().toLowerCase(),
					);

					if (idx >= 0) {
						expect(engagementSummaryScores[idx]?.trim()).toBe(
							expectedSummary[scoreField]?.trim(),
						);
						if (expectedSummary[comparisonField]) {
							expect(engagementSummaryComparisons[idx]?.trim()).toBe(
								expectedSummary[comparisonField].trim(),
							);
						}

						if (
							expectedSummary.responses !== undefined &&
							settings !== "non-anonymous"
						) {
							expect(
								CommonUtils.extractByFormat(
									engagementSummaryResponses[idx],
									"integer",
								),
							).toBe(expectedSummary.responses.trim());
						}
					}
				}
			} else {
				expectedSummary = expectedData.Overview.engagement_summary?.[key];

				if (expectedSummary && Array.isArray(expectedSummary)) {
					expect(engagementSummaryNames.length).toBe(expectedSummary.length);

					for (const expected of expectedSummary) {
						const idx = engagementSummaryNames.findIndex(
							(n) =>
								n?.trim().toLowerCase() === expected.name.trim().toLowerCase(),
						);
						expect(idx).toBeGreaterThanOrEqual(0);

						expect(engagementSummaryScores[idx]?.trim()).toBe(
							expected[scoreField]?.trim(),
						);
						if (expected[comparisonField]) {
							expect(engagementSummaryComparisons[idx]?.trim()).toBe(
								expected[comparisonField].trim(),
							);
						}

						if (
							expected.responses !== undefined &&
							settings !== "non-anonymous"
						) {
							expect(
								CommonUtils.extractByFormat(
									engagementSummaryResponses[idx],
									"integer",
								),
							).toBe(expected.responses.trim());
						}
					}
				}
			}
		}

		// Verify filter options
		if (await PwActions.elementIsVisible(this.page, this.btnFilter, 2)) {
			await PwActions.click(this.page, this.btnFilter);
			const filterList = await PwActions.getAllInnerTexts(
				this.page,
				this.webElementsDrpdwnList,
			);

			// Verify filterList contains all filter options
			let expectedFilterOptions = constants.engageOverviewFilterByOptions;
			if (viewType !== "admin") {
				expect(filterList).not.toContain("Manager");
				expectedFilterOptions = expectedFilterOptions.filter(
					(option) => option !== "Manager",
				);
			}
			expect(filterList).toEqual(expect.arrayContaining(expectedFilterOptions));

			await PwActions.forceClick(this.page, this.txtOverviewTabHeader);
		}

		// Verify score by options
		await PwActions.click(this.page, this.btnscoreBy);
		const scoreByList = await PwActions.getAllInnerTexts(
			this.page,
			this.webElementsDrpdwnList,
		);

		expect(scoreByList).toContain("Favourability Score");
		expect(scoreByList).toContain("Percentage Score");

		await PwActions.forceClick(this.page, this.txtOverviewTabHeader);
	}
}

class EngageManagerOverviewPage {
	constructor(page) {
		this.page = page;
		this.engageManagerView = new EngageManagerView(this.page);
		this.engageManagerENPS = new EngagePulseManagerENPSPage(this.page);
		this.commonutils = new CommonUtils();
		this.calculations = new Calculations();
		this.lblOverallScore =
			"//p[text()='Overall Score']/ancestor::div[contains(@class,'iLdUSH')]//h1";
		this.lblEngagePulseOverallScore =
			"//p[normalize-space()='Score (%)']//preceding-sibling::p[last()]";
		this.lblEngagePulseOverallENPS =
			"//p[(text())='ENPS']/preceding-sibling::p";
		this.lblEngagementSummaryPercentage =
			"//p[normalize-space(text()) = '%']/preceding-sibling::p[1]";
		this.graphEngagementOverallPercentage =
			"(//*[local-name()='svg']//*[local-name()='g' and contains(@class, 'recharts-layer recharts-bar-rectangle')]/*[local-name()='path' and @name='Overall'])[1]";
		this.graphEngagementDepartmentPercentage =
			"(//*[local-name()='svg']//*[local-name()='g' and contains(@class, 'recharts-layer recharts-bar-rectangle')]/*[local-name()='path' and @name='Manager Team'])[1]";
		this.txtBenchmarkPercentage =
			"((//p[text()='Benchmark Score'])[last()]//following::span)[1]";
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

		this.departmentName = (departmentName) =>
			`//tr//td/p[normalize-space()='${departmentName}']`;
		this.departmentScore =
			"//h1[text()='Engagement Summary']/following-sibling::div//td/div/p[not(contains(., '%'))]";
	}

	/**
	 * Verifies the manager overview page by comparing calculated scores with UI displayed values.
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageManagerOverviewPage(page);
	 * await overviewPage.verifyManagerOverviewPage();
	 */
	async verifyManagerOverviewPage() {
		await PwActions.waitForDOMContentLoaded(this.page, 20000);
		await CommonUtils.sleep(10);

		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);

		expect(
			responseData && responseData.Subject,
			"Response data is missing or invalid. Cannot verify manager overview page.",
		).toBeTruthy();

		const favorabilityScores = Calculations.engagePulseOverallFavourability(
			responseData.Subject,
		);
		const enpsScores = Calculations.engagePulseOverallENPS(
			responseData.Subject,
		);

		const actual_score = await PwActions.getText(
			this.page,
			this.lblEngagePulseOverallScore,
		);

		const actual_ENPS = await PwActions.getText(
			this.page,
			this.lblEngagePulseOverallENPS,
		);
		const engagement_summary = await PwActions.getText(
			this.page,
			this.lblEngagementSummaryPercentage,
		);

		await PwActions.hover(this.page, this.graphEngagementOverallPercentage);
		const Benchmark_overall_percentage = await PwActions.getText(
			this.page,
			this.txtBenchmarkPercentage,
		);
		await PwActions.hover(this.page, this.graphEngagementDepartmentPercentage);
		await PwActions.waitForElementVisibility(
			this.page,
			this.txtBenchmarkPercentage,
		);
		const Benchmark_department_percentage = await PwActions.getText(
			this.page,
			this.txtBenchmarkPercentage,
		);

		await CommonUtils.sleep(3);
		logger.info(
			`Actual score: ${actual_score} (${typeof actual_score}) UI score`,
		);
		logger.info(
			`Favorability score: ${favorabilityScores.favourableScore} (${typeof favorabilityScores.favourableScore}) calculated score`,
		);
		await PwActions.verifyTextExpected(
			Number(favorabilityScores.favourableScore).toFixed(1),
			parseFloat(actual_score).toFixed(1),
		);

		logger.info(
			`ENPS Score: ${enpsScores.enpsScore} (${typeof enpsScores.enpsScore}) calculated score`,
		);
		logger.info(`Actual ENPS: ${actual_ENPS} (${typeof actual_ENPS}) UI score`);

		const expectedENPS = String(Number(enpsScores.enpsScore).toFixed(1));
		const actualENPS = String(parseFloat(actual_ENPS).toFixed(1));

		await PwActions.verifyTextExpected(expectedENPS, actualENPS);

		await PwActions.verifyTextExpected(
			Number(favorabilityScores.favourableScore).toFixed(1),
			parseFloat(engagement_summary).toFixed(1),
		);
		await PwActions.verifyTextExpected(
			Number(favorabilityScores.favourableScore).toFixed(1),
			parseFloat(Benchmark_overall_percentage).toFixed(1),
		);
		await PwActions.verifyTextExpected(
			Number(favorabilityScores.favourableScore).toFixed(1),
			parseFloat(Benchmark_department_percentage).toFixed(1),
		);

		await this.verifyManagerDepartmentScore(favorabilityScores.favourableScore);
	}

	/**
	 * Verifies the manager department score displayed in the UI
	 * @param {number} expectedScore - Expected favorability score
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Usage example in a Playwright test:
	 * const overviewPage = new EngageManagerOverviewPage(page);
	 * await overviewPage.verifyManagerDepartmentScore(favorabilityScores.favourableScore);
	 */
	async verifyManagerDepartmentScore(expectedScore) {
		try {
			logger.info("Starting manager department score verification...");

			const departmentNameLocator = this.departmentName(
				constants.manager_department,
			);
			const departmentNameExists = await PwActions.elementIsVisible(
				this.page,
				departmentNameLocator,
			);

			expect(
				departmentNameExists,
				`Department name "${constants.manager_department}" should exist in UI`,
			).toBe(true);

			logger.info(
				`✅ Department name "${constants.manager_department}" found in UI`,
			);

			const departmentScoreText = await PwActions.getText(
				this.page,
				this.departmentScore,
			);

			expect(
				departmentScoreText,
				"Department score should exist in UI",
			).toBeTruthy();

			logger.info(`Department score from UI: ${departmentScoreText}`);

			const departmentScoreNumber = Number.parseFloat(departmentScoreText);

			expect(
				Number.isNaN(departmentScoreNumber),
				"Department score should be a valid number",
			).toBe(false);

			logger.info(`Department score number: ${departmentScoreNumber}`);

			expect(Number(departmentScoreNumber).toFixed(1)).toBe(
				Number(expectedScore).toFixed(1),
			);

			logger.info(
				`✅ Manager department score verification passed: Expected ${expectedScore}, Actual ${departmentScoreNumber}`,
			);
		} catch (error) {
			logger.error(
				`❌ Manager department score verification failed: ${error.message}`,
			);
			throw error;
		}
	}
}

export { EngageOverviewPage, EngageManagerOverviewPage };

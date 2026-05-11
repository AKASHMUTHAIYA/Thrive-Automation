import path from "path";
import { fileURLToPath } from "url";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { Calculations } from "../../../Shared_Functions/calculations.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { EngageManagerView } from "./engage-manager-view.js";
import logger from "playwright-framework/Core/logger.js";
import { expect } from "@playwright/test";
import { constants } from "../../../Data/Resources/constants.js";
import { EngageReportsBasePage } from "./engage-reports-page.js";

class EngageQuestionsPage extends EngageReportsBasePage {
	constructor(page) {
		super(page);
		this.commonutils = new CommonUtils();
		this.txtQuestionsTabOverallScore = "//div[h1[contains(., 'Score')]]//h1[2]";
		this.txtQuestionsTabFavorableScore = "//p[contains(., 'Favourable')]";
		this.txtQuestionsTabNeutralScore = "//p[contains(., 'Neutral')]";
		this.txtQuestionsTabUnfavorableScore = "//p[contains(., 'Unfavourable')]";
		this.txtQuestionsTabParticipationRate = "//p[contains(., 'Rate')]";
		this.txtQuestionsTabParticipantsCount = "//p[contains(., 'Participants')]";
		this.txtQuestionsTabResponsesCount =
			"//p[contains(., 'Responses') and preceding-sibling::p[contains(., 'Participants')]]";
		this.txtQuestionTabComparisons = (reportingFactorOrQuestion) =>
			`(//tr[.//div[contains(normalize-space(), '${reportingFactorOrQuestion}')]]//td)[4]//p`;
		this.txtQuestionTabScores = (reportingFactorOrQuestion) =>
			`(//tr[.//div[contains(normalize-space(), '${reportingFactorOrQuestion}')]]//td)[3]`;
		this.txtResponsesTabQuestionResponsesCount = (questionName) =>
			`(//tr[.//div[contains(normalize-space(), '${questionName}')]]//td//p)[2]`;
		this.txtResponsesTabQuestionScores = (questionName) =>
			`(//tr[.//div[contains(normalize-space(), '${questionName}')]]//td//p)[3]`;
		this.txtByRespondentWiseScoresElements = "//td//p[2]";
		this.tableInsideModal =
			"//p[contains(text(),'Employees')]//ancestor::div//table";
		this.txtEngagementScoreInsideModalList =
			"//p[contains(text(),'Employees')]//ancestor::div//table//td[3]//p";
		this.txtAnsweredQuestionsCountInsideModalList =
			"//p[contains(text(),'Employees')]//ancestor::div//table//td[2]";
		this.txtRatingScaleValuesInsideModalList =
			"//p[contains(text(),'Employees')]//ancestor::div//table//td[2]//p | //p[contains(text(),'Employees')]//ancestor::div//table//td[3]";
		this.btnCloseModal = `//*[name()='svg']/*[local-name() ='path' and @d='M10.6667 10.6667L21.3333 21.3333']`;
		this.SectionOrQuestionAnswersModal = (itemLabel) =>
			`//tr[.//td//p[normalize-space()='${itemLabel}']]`;
	}

	/**
	 * Helper method to verify summary scores
	 * @param {Object} summaryData - Summary data to verify
	 * @param {string} scoreBy - Score type ("Favourability Score" or "Percentage Score")
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const engageQuestionsPage = new EngageQuestionsPage(page);
	 * await engageQuestionsPage.verifySummaryScores({
	 *   summaryData: {
	 *     participation_rate: "100%",
	 *     participants: "4",
	 *     responses: "4",}
	 */
	async verifySummaryScores(summaryData, scoreBy) {
		const { scoreField } = this.getScoreFields(scoreBy);

		const summaryVerifications = [
			{
				selector: this.txtQuestionsTabOverallScore,
				expected: summaryData[scoreField],
				format: "score",
			},
			{
				selector: this.txtQuestionsTabParticipationRate,
				expected: summaryData.participation_rate,
				format: "decimal",
			},
			{
				selector: this.txtQuestionsTabParticipantsCount,
				expected: summaryData.participants,
				format: "integer",
			},
			{
				selector: this.txtQuestionsTabResponsesCount,
				expected: summaryData.responses,
				format: "integer",
			},
		];

		// Add Favorable, Neutral, Unfavorable only for Favourability Score
		if (scoreBy === "Favourability Score") {
			summaryVerifications.push(
				{
					selector: this.txtQuestionsTabFavorableScore,
					expected: summaryData.favourable,
					format: "decimal",
				},
				{
					selector: this.txtQuestionsTabNeutralScore,
					expected: summaryData.neutral,
					format: "decimal",
				},
				{
					selector: this.txtQuestionsTabUnfavorableScore,
					expected: summaryData.unfavourable,
					format: "decimal",
				},
			);
		}

		for (const { selector, expected, format } of summaryVerifications) {
			const uiText = await PwActions.getText(this.page, selector);
			const uiValue = CommonUtils.extractByFormat(uiText, format);
			const expectedValue = CommonUtils.extractByFormat(expected, format);
			expect(uiValue).toBe(expectedValue);
		}
	}

	/**
	 * Verifies the Questions tab data
	 * @param {Object} expectedData - The expected engagement admin report data
	 * @param {string} settings - Survey settings (anonymous or non-anonymous)
	 * @param {string} scoreBy - Score type ("Favourability Score" or "Percentage Score")
	 * @param {Array|null} filterBy - Array of filter objects with groupByName, filterByKey, and filterByValue
	 * @returns {Promise<void>}
	 * @example
	 * // Without filter:
	 * await engageQuestionsPage.verifyQuestionsTab({
	 *   expectedData: engage_admin_report_data,
	 *   settings: "anonymous",
	 *   scoreBy: "Favourability Score"
	 * });
	 *
	 * // With filters:
	 * await engageQuestionsPage.verifyQuestionsTab({
	 *   expectedData: engage_admin_report_data_with_filter,
	 *   settings: "anonymous",
	 *   scoreBy: "Percentage Score",
	 *   filterBy: [
	 *     { groupByName: "Questions", filterByKey: "Gender", filterByValue: "Male" },
	 *     { groupByName: "Reporting Factors", filterByKey: "Department", filterByValue: "Engineering" }
	 *   ]
	 * });
	 */
	async verifyQuestionsTab({
		expectedData,
		settings = "anonymous",
		scoreBy = "Favourability Score",
		filterBy = null,
	}) {
		const FILTER_KEY_MAP = {
			Questions: "questions",
			"Reporting Factors": "reporting_factors",
		};

		if (scoreBy) {
			await this.selectScoreType(scoreBy);
		}

		let optionsToLoop = constants.questionsTabGroupByOptions;
		if (filterBy && Array.isArray(filterBy) && filterBy.length > 0) {
			optionsToLoop = [
				...new Set(filterBy.map((filter) => filter.groupByName)),
			];
		}

		for (const groupByOption of optionsToLoop) {
			await this.resetFilter();
			if (scoreBy) {
				await this.selectScoreType(scoreBy);
			}

			await PwActions.click(this.page, this.btnGroupBy);
			await PwActions.click(
				this.page,
				this.optionDrpDownOptions(groupByOption),
			);
			await CommonUtils.sleep(2);

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

			let expectedQuestionsData;
			let summaryData;

			if (
				appliedFilter &&
				appliedFilter.filters &&
				appliedFilter.filters.length > 0
			) {
				const tabKey = FILTER_KEY_MAP[groupByOption];
				let questionsPath = null;

				// For multiple filters, try combined key first
				if (appliedFilter.filters.length > 1) {
					// Create combined filter key: e.g., "country_gender"
					const combinedFilterKey = appliedFilter.filters
						.map(
							(f) =>
								constants.questionsTabGroupByKeyMap[f.filterByKey] ||
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

					questionsPath =
						expectedData.Questions_tab?.[tabKey]?.[combinedFilterKey]?.[
							combinedValueKey
						];
				}

				// Fallback to first filter only if combined key not found
				if (!questionsPath) {
					const firstFilter = appliedFilter.filters[0];
					const filterKey =
						constants.questionsTabGroupByKeyMap[firstFilter.filterByKey] ||
						CommonUtils.extractByFormat(firstFilter.filterByKey, "filter_key");
					const filterValue = CommonUtils.extractByFormat(
						firstFilter.filterByValues[0],
						"filter_key",
					);
					questionsPath =
						expectedData.Questions_tab?.[tabKey]?.[filterKey]?.[filterValue];
				}

				expectedQuestionsData = questionsPath;
				summaryData = expectedQuestionsData?.summary?.all_responses;

				if (!expectedQuestionsData) {
					logger.warn(
						`No filtered data found for ${groupByOption} -> ${appliedFilter.filters.map((f) => `${f.filterByKey}: ${f.filterByValues.join(",")}`).join(" AND ")}`,
					);
					continue;
				}
			} else {
				expectedQuestionsData =
					expectedData.Questions_tab[
						constants.questionsTabGroupByKeyMap[groupByOption]
					];
				summaryData = expectedData.Questions_tab?.summary?.all_responses;
			}

			if (summaryData) {
				await this.verifySummaryScores(summaryData, scoreBy);
			}

			const itemsToVerify = Object.keys(expectedQuestionsData).filter(
				(key) => key !== "summary",
			);

			for (const itemKey of itemsToVerify) {
				const itemData = expectedQuestionsData[itemKey];
				const itemLabel = itemData.label;

				await Promise.all([
					PwActions.waitForElement(
						this.page,
						this.txtQuestionTabScores(itemLabel),
					),
					PwActions.waitForElement(
						this.page,
						this.txtQuestionTabComparisons(itemLabel),
					),
				]);

				const { scoreField, comparisonField } = this.getScoreFields(scoreBy);

				const scoreText = await PwActions.getText(
					this.page,
					this.txtQuestionTabScores(itemLabel),
				);
				const scoreUI = CommonUtils.extractByFormat(scoreText, "score");
				expect(scoreUI).toBe(
					CommonUtils.extractByFormat(itemData[scoreField], "score"),
				);

				const comparisonUI = await PwActions.getText(
					this.page,
					this.txtQuestionTabComparisons(itemLabel),
				);
				expect(comparisonUI).toBe(itemData[comparisonField].trim());

				if (settings === "non-anonymous" && !appliedFilter) {
					await this.verifyNonAnonymousModal({ itemLabel, itemData });
				}
			}
		}
	}

	/**
	 * Verifies non-anonymous modal data for a specific item
	 * @param {string} itemLabel - The item label
	 * @param {Object} itemData - Expected item data
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const engageQuestionsPage = new EngageQuestionsPage(page);
	 * await engageQuestionsPage.verifyNonAnonymousModal({ itemLabel: "Section 1", itemData: section_1: {
				label: "Section 1",
				favscore: "50%",
				favcomparison: "Equal",
				answeredQuestionsCount: ["2", "2", "2", "2", "2", "2", "2", "2"],
				percentageEngagementScore: ["90%", "30%", "30%", "90%", "90%", "30%", "30%", "90%"],
				favourabilityEngagementScore: ["100%", "0%", "0%", "100%", "100%", "0%", "0%", "100%"],
			});
	 */
	async verifyNonAnonymousModal({ itemLabel, itemData }) {
		await PwActions.click(
			this.page,
			this.SectionOrQuestionAnswersModal(itemLabel),
		);
		await PwActions.waitForElementVisibility(this.page, this.tableInsideModal);

		if (itemLabel.includes("Rating Scale")) {
			const ratingScaleValues = await PwActions.getElementsText(
				this.page,
				await PwActions.getWebElements(
					this.page,
					this.txtRatingScaleValuesInsideModalList,
				),
			);
			expect(ratingScaleValues.length).toBe(
				itemData.individualRatingScaleValues.length,
			);
			expect(ratingScaleValues).toEqual(itemData.individualRatingScaleValues);
		} else if (itemLabel.includes("Section")) {
			const answeredQuestionsCount = await PwActions.getElementsText(
				this.page,
				await PwActions.getWebElements(
					this.page,
					this.txtAnsweredQuestionsCountInsideModalList,
				),
			);
			expect(answeredQuestionsCount.length).toBe(
				itemData.answeredQuestionsCount.length,
			);
			expect(answeredQuestionsCount).toEqual(itemData.answeredQuestionsCount);

			const engagementScores = await PwActions.getElementsText(
				this.page,
				await PwActions.getWebElements(
					this.page,
					this.txtEngagementScoreInsideModalList,
				),
			);
			expect(engagementScores.length).toBe(
				itemData.favourabilityEngagementScore.length,
			);
			expect([...engagementScores].sort()).toEqual(
				[...itemData.favourabilityEngagementScore].sort(),
			);
		}

		await PwActions.click(this.page, this.btnCloseModal);
	}

	/**
	 * Verifies the Responses tab data
	 * @param {Object} expectedData - The expected engagement admin report data
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const engageQuestionsPage = new EngageQuestionsPage(page);
	 * await engageQuestionsPage.verifyResponsesTab({
	 *   expectedData: engage_admin_report_data,
	 *   scoreBy: "Favourability Score"
	 * }); questionData: {
			label: "Engage Rating Scale 1.1",
			favscore: "50%",
			perscore: "60%",
			responses: "8",
			favcomparison: "Equal",
	 * });
	 */
	async verifyResponsesTab({ expectedData, scoreBy = "Favourability Score" }) {
		if (scoreBy) {
			await this.selectScoreType(scoreBy);
		}
		await this.resetFilter();
		await CommonUtils.sleep(2);
		const questionsData = expectedData.Questions_tab.questions;

		for (const questionKey of Object.keys(questionsData)) {
			const questionData = questionsData[questionKey];
			const questionName = questionData.label;

			const responsesCountText = await PwActions.getText(
				this.page,
				this.txtResponsesTabQuestionResponsesCount(questionName),
			);
			const responsesCountUI = responsesCountText?.match(/\d+/)?.[0]?.trim();
			expect(responsesCountUI).toBe(questionData.responses.trim());

			const scoresUI = (
				await PwActions.getText(
					this.page,
					this.txtResponsesTabQuestionScores(questionName),
				)
			)
				.replace(/\s+/g, "")
				.trim();
			if (scoreBy === "Percentage Score") {
				expect(scoresUI).toBe(questionData.perscore.trim());
			} else {
				expect(scoresUI).toBe(questionData.favscore.trim());
			}
		}
	}
}

class QuestionsEngagePulseManagerPage {
	constructor(page) {
		this.page = page;
		this.calculations = new Calculations();
		this.commonutils = new CommonUtils();
		this.commonfunction = new CommonPageFunctions(this.page);
		this.engageManagerView = new EngageManagerView(this.page);
		this.txtAllResponsesScore = "(//h1[text()='Score:']//following::h1)[1]";

		// Dynamic locator for Rating Scale questions - will find all Rating Scale questions
		this.txtRatingScaleScoreValue = (questionName) =>
			`//p[contains(text(), '${questionName}')]/following::h1[1]`;
		this.txtEnpsScore =
			"(//p[contains(text(), 'recommend our company')]/following::h1)[1]";
		this.txtYesScore =
			"(//div[@class='twigs-c-PJLV twigs-c-PJLV-icqShdA-css']/p)[1]";
		this.txtNoScore =
			"(//div[@class='twigs-c-PJLV twigs-c-PJLV-icqShdA-css']/p)[2]";

		this.txtMultipleChoice =
			"//p[text()='Multiple Choice']/ancestor::div[1]/following-sibling::table//td[2]//div[@data-testid='flex']/div/p[1]";
		this.txtMultipleChoiceScore =
			"//p[text()='Multiple Choice']/ancestor::div[1]/following-sibling::table//td[2]//div[@data-testid='flex']/div/p[2]";
	}

	/**
	 * Verifies the responses and scores for each question type in the Engage Pulse Manager view
	 * This function performs the following validations:
	 * 1. Overall favourability score
	 * 2. Rating scale scores
	 * 3. eNPS (Employee Net Promoter Score)
	 * 4. Yes/No question responses
	 * 5. Multiple choice question responses
	 *
	 * The function compares the UI-displayed scores with backend-calculated values
	 * to ensure data consistency and accuracy.
	 *
	 * @returns {Object} An object containing:
	 *   - Normalized scores from UI (overall, rating, eNPS, yes/no, multiple choice)
	 *   - Calculated scores from backend data
	 *   - Multiple choice response data
	 *
	 * @example
	 * // Usage example in a Playwright test:
	 * const questionsPage = new QuestionsEngagePulseManagerPage(page);
	 * await questionsPage.verifyEachQuestionTypeResponses();
	 */
	async verifyEachQuestionTypeResponses() {
		await CommonUtils.sleep(5);
		await PwActions.waitTillVisible(
			this.page,
			this.txtAllResponsesScore,
			10000,
		);

		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);

		expect(
			responseData && responseData["Subject"],
			"Response data should exist and contain Subject information",
		).toBeTruthy();

		const {
			totalScore,
			favourableScore,
			unfavourableScore,
			neutralScore,
			eachRatingQuestionFavourability,
		} = Calculations.engagePulseOverallFavourability(responseData.Subject);

		const { yesCount, noCount, yesPercentage, noPercentage } =
			Calculations.calculateYesNoResponses(responseData);

		const { totalResponses, optionData } =
			Calculations.calculateMultiChoiceResponses(responseData);

		const overallScoreVisible = await PwActions.elementIsVisible(
			this.page,
			this.txtAllResponsesScore,
		);
		logger.info(`Overall score element visible: ${overallScoreVisible}`);

		const overall_score = await PwActions.getText(
			this.page,
			this.txtAllResponsesScore,
		);
		logger.info(`Overall score from UI: ${overall_score}`);

		const ratingScaleQuestionNames = [];

		for (const participant in responseData.Subject) {
			const participantData = responseData.Subject[participant];
			for (const section in participantData) {
				const sectionData = participantData[section];
				for (const questionName in sectionData) {
					const questionData = sectionData[questionName];

					if (
						typeof questionData === "object" &&
						questionData.value &&
						questionData.scale
					) {
						if (!ratingScaleQuestionNames.includes(questionName)) {
							ratingScaleQuestionNames.push(questionName);
						}
					}
				}
			}
			break;
		}

		logger.info(
			`Found ${ratingScaleQuestionNames.length} Rating Scale questions: ${ratingScaleQuestionNames.join(", ")}`,
		);

		const ratingScaleData = [];
		for (const questionName of ratingScaleQuestionNames) {
			const ratingScale = this.txtRatingScaleScoreValue(questionName);

			try {
				const scoreElement = await this.page.$(ratingScale);
				if (scoreElement) {
					const scoreText = await scoreElement.textContent();
					const normalizedScore = CommonUtils.normalizeScore(scoreText);

					ratingScaleData.push({
						questionName: questionName,
						score: normalizedScore,
					});

					logger.info(`Found "${questionName}" - Score: ${normalizedScore}`);
				} else {
					expect(
						scoreElement,
						`Score element should exist for question "${questionName}" in Rating Scale section`,
					).toBeTruthy();
				}
			} catch (error) {
				expect(
					error,
					`Should be able to find score for question "${questionName}" without errors. Error: ${error.message}`,
				).toBeNull();
			}
		}

		const enpsScoreVisible = await PwActions.elementIsVisible(
			this.page,
			this.txtEnpsScore,
		);
		logger.info(`eNPS score element visible: ${enpsScoreVisible}`);

		const question_enps_score = await PwActions.getText(
			this.page,
			this.txtEnpsScore,
		);
		logger.info(`eNPS score from UI: ${question_enps_score}`);

		const yesScoreVisible = await PwActions.elementIsVisible(
			this.page,
			this.txtYesScore,
		);
		logger.info(`Yes score element visible: ${yesScoreVisible}`);

		const yes_score = await PwActions.getText(this.page, this.txtYesScore);
		logger.info(`Yes score from UI: ${yes_score}`);

		const noScoreVisible = await PwActions.elementIsVisible(
			this.page,
			this.txtNoScore,
		);
		logger.info(`No score element visible: ${noScoreVisible}`);

		const no_score = await PwActions.getText(this.page, this.txtNoScore);
		logger.info(`No score from UI: ${no_score}`);

		const multipleChoiceOptions = await PwActions.getWebElements(
			this.page,
			this.txtMultipleChoice,
		);
		const multipleChoiceScores = await PwActions.getWebElements(
			this.page,
			this.txtMultipleChoiceScore,
		);

		const multipleChoiceData = [];
		for (let i = 0; i < multipleChoiceOptions.length; i++) {
			const optionText = await multipleChoiceOptions[i].textContent();
			const scoreText = await multipleChoiceScores[i].textContent();
			const normalizedScore = CommonUtils.normalizeScore(scoreText);

			multipleChoiceData.push({
				option: optionText,
				score: normalizedScore,
			});
		}

		const normalizedOverall = CommonUtils.normalizeScore(overall_score);
		const normalizedEnps = CommonUtils.normalizeScore(question_enps_score);
		const normalizedYes = CommonUtils.normalizeScore(yes_score);
		const normalizedNo = CommonUtils.normalizeScore(no_score);

		const enpsScores = Calculations.engagePulseOverallENPS(
			responseData["Subject"],
		);

		await PwActions.verifyTextExpected(
			Number(normalizedOverall).toFixed(1),
			favourableScore.toFixed(1),
		);

		logger.info(
			`Verifying ${ratingScaleData.length} individual Rating Scale questions...`,
		);
		for (const uiQuestion of ratingScaleData) {
			const calculatedScore =
				eachRatingQuestionFavourability[uiQuestion.questionName];

			logger.info(
				`Verifying "${uiQuestion.questionName}" - UI: ${uiQuestion.score}, Calculated: ${calculatedScore}`,
			);
			await PwActions.verifyTextExpected(
				Number(uiQuestion.score).toFixed(1),
				calculatedScore.toFixed(1),
			);
		}

		await PwActions.verifyTextExpected(
			Number(normalizedEnps).toFixed(1),
			enpsScores.enpsScore.toFixed(1),
		);

		await PwActions.verifyTextExpected(
			Number(normalizedYes).toFixed(1),
			yesPercentage.toFixed(1),
		);
		await PwActions.verifyTextExpected(
			Number(normalizedNo).toFixed(1),
			noPercentage.toFixed(1),
		);

		for (const uiOption of multipleChoiceData) {
			const calculatedPercentage = optionData[uiOption.option];
			if (calculatedPercentage) {
				await PwActions.verifyTextExpected(
					Number(uiOption.score).toFixed(1),
					calculatedPercentage.toFixed(1),
				);
			}
		}
		return {
			overall_score: normalizedOverall,
			question_enps_score: normalizedEnps,
			yes_score: normalizedYes,
			no_score: normalizedNo,
			ratingScaleData,
			multipleChoiceData,
			calculated: {
				favourableScore,
				enpsScore: enpsScores.enpsScore,
				yesPercentage,
				noPercentage,
				optionData,
				eachRatingQuestionFavourability,
			},
		};
	}
}

export { EngageQuestionsPage, QuestionsEngagePulseManagerPage };

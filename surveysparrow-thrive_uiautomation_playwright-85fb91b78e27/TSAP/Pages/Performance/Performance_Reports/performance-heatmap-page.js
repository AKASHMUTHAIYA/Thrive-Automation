import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { Calculations } from "../../../Shared_Functions/calculations.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { expect } from "@playwright/test";
class PerformanceHeatmapPage {
	constructor(page) {
		this.page = page;
		this.calculations = new Calculations();
		this.commonutils = new CommonUtils();
		this.drpdwnByDepartment = "//div[text()='Departments']/parent::div";
		this.drpdwnBySubject = "//div[text()='By Subject']";
		this.btnEmployeeFromDepartment = "//p[text()='Employees']";
		this.drpdwnByPercentage = "//p[text()='Percentage']";
		this.drpdwnByScore = "//p[text()='Score']";
		this.lblOverallScore = "(//p[text()='Overall Score']//following::p)[1]";
		this.lblOverallScoreLeaderShip =
			"//p[text()='Leadership Skills']//following::p[1]";
		this.lblOverallScoreCommunication =
			"//p[text()='Communication Skills']//following::p[1]";
		this.btnOverallScoreSubject1 =
			"(//p[text()='Overall Score']//following::td)[2]";
		this.btnOverallScoreSubject2 =
			"(//p[text()='Overall Score']//following::td)[3]";
		this.btnOverallScoreSubject1Value =
			"//p[text()='Subject Automation 1']//following::h5";
		this.btnOverallScoreSubject2Value =
			"//p[text()='Subject Automation 2']//following::h5";
		this.btnOverallScoreLeaderShip1Value =
			"(//p[text()='Leadership Skills']//following::td)[2]";
		this.btnOverallScoreLeaderShip2Value =
			"(//p[text()='Leadership Skills']//following::td)[3]";
		this.btnOverallScoreCommunication1Value =
			"(//p[text()='Communication Skills']//following::td)[2]";
		this.btnOverallScoreCommunication2Value =
			"(//p[text()='Communication Skills']//following::td)[3]";
		this.btnExportAsExcel = "//div[text()='Export as Excel']";
		this.dropDownHeatMapType = `//th//div[contains(@class,"select--dropdown")]`;
		this.selectHeatMapType = (heatMapType) =>
			`//div[contains(@class,"select__option") and text()="${heatMapType}"]`;
		this.getOverallScore = (
			competencyOrReportingFactorOrQuestion,
			subjectOrDepartmentOrManagerTeam,
		) =>
			`//table[@data-testid='heatmap_table']//tr[.//p[normalize-space()='${competencyOrReportingFactorOrQuestion}']]/td[position() = count(//table[@data-testid='heatmap_table']//th[.//p[normalize-space()='${subjectOrDepartmentOrManagerTeam}']]/preceding-sibling::th) + 1 ]//p[@data-testid='text'][1]`;
		this.getChangeValue = (
			competencyOrReportingFactorOrQuestion,
			subjectOrDepartmentOrManagerTeam,
		) =>
			`//table[@data-testid='heatmap_table']//tr[.//p[normalize-space()='${competencyOrReportingFactorOrQuestion}']]/td[position() = count(//table[@data-testid='heatmap_table']//th[.//p[normalize-space()='${subjectOrDepartmentOrManagerTeam}']]/preceding-sibling::th) + 1 ]//p[@data-testid='text'][2]`;
		this.txtScoreOnHoverCard = `//h5[@data-testid="heading"]`;
		this.txtChangeOnHoverCard = `(//h5[@data-testid="heading"]/following-sibling::div//p)[1]`;
		this.dropDownScoreType = `//label[text()="Score By"]//parent::div`;
		this.selectScoreType = (scoreType) =>
			`//p[text()="${scoreType}"]//ancestor::div[@role="menuitem"]`;
		this.sectionHeatMap = `//div[text()="Heatmap"]`;
	}

	/**
	 * Verifies the overall score for a given subject in the heatmap report.
	 */

	async verifyOverallScoreBySubject() {
		await PwActions.waitTillVisible(this.page, this.lblOverallScore);
		await PwActions.forceClick(this.page, this.drpdwnByDepartment);
		await PwActions.click(this.page, this.btnEmployeeFromDepartment);
		await PwActions.waitTillVisible(this.page, this.lblOverallScore);

		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);
		const {
			overallScoreAfterRounded: expected_score_subject,
			numerator: numerator1,
			denominator: denominator1,
		} = await Calculations.performanceOverallScore(
			responseData["Subject Automation 1"],
			"Subject",
		);

		const {
			overallScoreAfterRounded: expected_score_subject2,
			numerator: numerator2,
			denominator: denominator2,
		} = await Calculations.performanceOverallScore(
			responseData["Subject Automation 2"],
			"Subject2",
		);
		const overall_expected_score =
			(numerator1 + numerator2) / (denominator1 + denominator2);
		const expected_score = await Calculations.progressiveRound(
			overall_expected_score,
		);
		await PwActions.waitTillVisible(this.page, this.lblOverallScore);
		const actual_score = await PwActions.getText(
			this.page,
			this.lblOverallScore,
		);
		await PwActions.verifyTextExpected(actual_score, expected_score);

		await PwActions.hover(this.page, this.btnOverallScoreSubject1);
		const actual_score_subject1 = await PwActions.getText(
			this.page,
			this.btnOverallScoreSubject1Value,
		);
		await PwActions.hover(this.page, this.btnOverallScoreSubject2);
		const actual_score_subject2 = await PwActions.getText(
			this.page,
			this.btnOverallScoreSubject2Value,
		);

		await PwActions.verifyTextExpected(
			expected_score_subject,
			actual_score_subject1,
		);
		await PwActions.verifyTextExpected(
			expected_score_subject2,
			actual_score_subject2,
		);
	}

	/**
	 * Verifies the overall score for a given set of competencies in the heatmap report.
	 */

	async verifyOverallScoreByCompetencies() {
		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);
		const sections = [
			"Leadership Skills",
			"Communication Skills",
			"Team Skills",
			"Organizational Skills",
			"Creativity Skills",
			"Interpersonal Skills",
			"Organizational Alignment",
		];
		for (const section of sections) {
			// Calculate expected scores for both subjects
			const {
				sectionWiseCompetencyScore: expectedScoreSubject1,
				sumOfAllScoresInSection: numerator1,
				numberOfQuestionsInSection: denominator1,
			} = await Calculations.sectionWiseCompetencyScore(
				responseData["Subject Automation 1"],
				section,
			);
			const {
				sectionWiseCompetencyScore: expectedScoreSubject2,
				sumOfAllScoresInSection: numerator2,
				numberOfQuestionsInSection: denominator2,
			} = await Calculations.sectionWiseCompetencyScore(
				responseData["Subject Automation 2"],
				section,
			);

			// Calculate overall expected score
			const overallExpectedScore =
				(numerator1 + numerator2) / (denominator1 + denominator2);
			const expectedScore =
				await Calculations.progressiveRound(overallExpectedScore);

			// Get actual overall score from the UI
			this.lblOverallScoreSection = `//p[text()='${section}']//following::p[1]`;
			const actualScore = await PwActions.getText(
				this.page,
				this.lblOverallScoreSection,
			);
			await PwActions.verifyTextExpected(expectedScore, actualScore);

			// Verify individual scores for both subjects
			this.lblOverallScoreSectionValue = `(//p[text()='${section}']//following::td)[2]`;
			await PwActions.hover(this.page, this.lblOverallScoreSectionValue);
			const actualScoreSubject1 = await PwActions.getText(
				this.page,
				this.btnOverallScoreSubject1Value,
			);

			this.lblOverallScoreSectionValue2 = `(//p[text()='${section}']//following::td)[3]`;
			await PwActions.hover(this.page, this.lblOverallScoreSectionValue2);
			const actualScoreSubject2 = await PwActions.getText(
				this.page,
				this.btnOverallScoreSubject2Value,
			);

			await PwActions.verifyTextExpected(
				expectedScoreSubject1,
				actualScoreSubject1,
			);
			await PwActions.verifyTextExpected(
				expectedScoreSubject2,
				actualScoreSubject2,
			);
		}
	}

	/**
	 * Verifies the heatmap values match expected competency scores and changes
	 * using predefined test data from predefined_test_data.js (e.g., teamAnalyticsHeatMap).
	 * @param {Object} params - The parameters object.
	 * @param {import('@playwright/test').Page} params.page - The Playwright page object.
	 * @param {Object.<string, CompetencyData>} params.competencies - Map of competency data to verify against UI values.
	 * @typedef {Object} CompetencyData
	 * @property {string} label - Display label of the competency.
	 * @property {string} [all_subjects] - Overall score across all subjects.
	 * @property {SubjectScore} [subjectKey] - Individual subject scores (dynamic keys).
	 * @typedef {Object} SubjectScore
	 * @property {string} label - Display label of the subject.
	 * @property {string} value - Score value for the subject.
	 * @property {string} change - Change value for the subject.
	 */
	async verifyHeatmapValues({ page = this.page, competencies }) {
		for (const [key, scoreData] of Object.entries(competencies)) {
			for (const [subject, section] of Object.entries(scoreData)) {
				if (subject === "all_subjects") {
					expect(
						await PwActions.getText(
							page,
							this.getOverallScore(scoreData.label, "All Subjects"),
						),
					).toBe(scoreData.all_subjects);
					continue;
				}
				if (typeof section !== "object") continue;

				const { label, value, change } = section;
				const overallSel = this.getOverallScore(scoreData.label, label);
				const changeSel = this.getChangeValue(scoreData.label, label);

				expect(await PwActions.getText(page, overallSel)).toBe(value);
				const changeText = await PwActions.getText(page, changeSel);
				const normalizedChange = changeText.replace(/^-\s*|\s*-$/g, "").trim();
				expect(normalizedChange).toBe(change);

				await PwActions.hover(page, overallSel);
				const [hoverScore, hoverChangeRaw] = await Promise.all([
					PwActions.getText(page, this.txtScoreOnHoverCard),
					PwActions.getText(page, this.txtChangeOnHoverCard),
				]);
				await PwActions.hover(page, this.sectionHeatMap);
				await PwActions.verifyTextExpected(hoverScore, value);
				const normalizedHoverChange = hoverChangeRaw
					.replace(/^-\s*|\s*-$/g, "")
					.trim();
				if (
					change === "Equal" &&
					normalizedHoverChange.toLowerCase().includes("equal")
				) {
					expect(
						normalizedHoverChange.toLowerCase(),
						`Hover tooltip change should reference Equal when fixture change is Equal; got "${normalizedHoverChange}"`,
					).toMatch(/equal/);
				} else if (normalizedHoverChange === "Equal") {
					await PwActions.verifyTextExpected(normalizedHoverChange, change);
				} else {
					await PwActions.verifyTextExpected(
						`${normalizedHoverChange}%`,
						change,
					);
				}
			}
		}
	}

	/**
	 * Selects a heatmap view type from the dropdown (e.g., "Competencies" or "Questions").
	 * @param {Object} params - The parameters object.
	 * @param {import('@playwright/test').Page} [params.page=this.page] - The Playwright page object.
	 * @param {string} params.heatMapType - The heatmap type to select (e.g., "Competencies", "Questions").
	 * @example
	 * // With explicit page
	 * await heatmapPage.changeHeatmapType({ page, heatMapType: "Questions" });
	 * // Using default page
	 * await heatmapPage.changeHeatmapType({ heatMapType: "Competencies" });
	 */
	async changeHeatmapType({ page = this.page, heatMapType }) {
		await PwActions.click(page, this.dropDownHeatMapType);
		await PwActions.waitTillVisible(page, this.selectHeatMapType(heatMapType));
		await PwActions.click(page, this.selectHeatMapType(heatMapType));
	}

	/**
	 * Verifies the exported CSV data from the heatmap page against expected values.
	 * Validates CSV structure, headers, and data integrity. Automatically handles percentage values.
	 * Auto-detects whether data is competencies or questions based on content.
	 *
	 * @param {Object} params - The parameters object.
	 * @param {string} params.filePath - Path to the exported CSV file to verify.
	 * @param {Object} params.expectedData - Expected data structure for verification.
	 * @param {Array<string>} [params.expectedData.headers] - Expected header columns (e.g., ["Questions", "All Subjects", "Engineering"]).
	 * @param {Array<Object>} [params.expectedData.rows] - Expected row data with question names and scores (values can include "%" or be plain numbers).
	 * @param {Object} [params.expectedData.competencies] - Object structure for competencies (from teamAnalyticsHeatMap.competencies).
	 * @param {Object} [params.expectedData.questions] - Object structure for questions (from teamAnalyticsHeatMap.questions).
	 *
	 * @example
	 * // Using rows format
	 * await heatmapPage.verifyHeatmapCSVData({
	 *   filePath: '/path/to/heatmap.csv',
	 *   expectedData: {
	 *     headers: ["Questions", "All Subjects", "Engineering", "Manager Team"],
	 *     rows: [
	 *       { "Questions": "Overall Score", "All Subjects": "52%", "Engineering": "24%", "Manager Team": "80%" }
	 *     ]
	 *   }
	 * });
	 *
	 * @example
	 * // Using object format - auto-detects competencies
	 * await heatmapPage.verifyHeatmapCSVData({
	 *   filePath: '/path/to/heatmap.csv',
	 *   expectedData: teamAnalyticsHeatMap.competencies
	 * });
	 *
	 * @example
	 * // Using object format - auto-detects questions
	 * await heatmapPage.verifyHeatmapCSVData({
	 *   filePath: '/path/to/heatmap.csv',
	 *   expectedData: teamAnalyticsHeatMap.questions
	 * });
	 */
	async verifyHeatmapCSVData({ filePath, expectedData }) {
		const fileExists = this.commonutils.verifyFileExists(filePath);
		expect(fileExists, `CSV file not found at path: ${filePath}`).toBeTruthy();
		const csvData = await this.commonutils.readCSVFile(filePath);

		// Get the actual column headers from the CSV
		const headers = Object.keys(csvData.data[0] || {});
		const allSubjectsColumn = headers.find((header) =>
			header.includes("All Subjects"),
		);

		for (const [key, competencyData] of Object.entries(expectedData)) {
			const csvRow = csvData.data.find(
				(row) =>
					row.Questions === competencyData.label ||
					row.Section === competencyData.label,
			);
			expect(
				csvRow,
				`Row not found in CSV for question: "${competencyData.label}"`,
			).toBeDefined();
			if (competencyData.all_subjects) {
				expect(
					allSubjectsColumn,
					"All Subjects column not found in CSV headers",
				).toBeDefined();
				const expectedAllSubjects = competencyData.all_subjects.replace(
					"%",
					"",
				);
				const actualAllSubjects = csvRow[allSubjectsColumn]?.toString();
				const expectedNum = Number.parseFloat(expectedAllSubjects);
				const actualNum = Number.parseFloat(actualAllSubjects);
				expect(
					actualNum,
					`All Subjects value mismatch for "${competencyData.label}". Expected: ${expectedNum}, Actual: ${actualNum}`,
				).toBe(expectedNum);
			}
			for (const [subjectKey, subjectData] of Object.entries(competencyData)) {
				if (
					subjectKey !== "label" &&
					subjectKey !== "all_subjects" &&
					typeof subjectData === "object"
				) {
					const columnLabel = headers.find((header) =>
						header.includes(subjectData.label),
					);
					expect(
						columnLabel,
						`Column containing "${subjectData.label}" not found in CSV headers for "${competencyData.label}"`,
					).toBeDefined();
					const expectedValue = subjectData.value.replace("%", "");
					const actualValue = csvRow[columnLabel]?.toString();
					const expectedNum = Number.parseFloat(expectedValue);
					const actualNum = Number.parseFloat(actualValue);
					expect(
						actualNum,
						`Value mismatch for "${competencyData.label}" in column "${columnLabel}". Expected: ${expectedNum}, Actual: ${actualNum}`,
					).toBe(expectedNum);
				}
			}
		}
	}

	/**
	 * Selects a score type from the dropdown (e.g., "Percentage" or "Score").
	 * @param {Object} params - The parameters object.
	 * @param {import('@playwright/test').Page} [params.page=this.page] - The Playwright page object.
	 * @param {string} params.scoreType - The score type to select (e.g., "Percentage", "Score").
	 * @example
	 * // With explicit page
	 * await heatmapPage.changeScoreByType({ page, scoreType: "Percentage" });
	 * // Using default page
	 * await heatmapPage.changeScoreByType({ scoreType: "Score" });
	 */
	async changeScoreByType({ page = this.page, scoreType }) {
		await PwActions.click(page, this.dropDownScoreType);
		await PwActions.waitTillVisible(page, this.selectScoreType(scoreType));
		await PwActions.click(page, this.selectScoreType(scoreType));
	}
}

export { PerformanceHeatmapPage };

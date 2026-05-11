import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { EUI } from "../../Surveys/Attend_Survey/attend-survey-EUI-page.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { expect } from "playwright/test";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";
import { APIActions } from "playwright-framework/Core/API_Actions/api-actions.js";
import { envDetails } from "../../../Data/test-data.js";
import logger from "playwright-framework/Core/logger.js";
class PerformanceResponsesPage {
	constructor(page) {
		this.page = page;
		this.surveyEuiPage = new EUI();
		this.commonutils = new CommonUtils();
		this.btnMoreInfo = "//span[text()='More Info']";
		this.txtStartedTime = "(//p[text()='Started Time']//following::p)[1]";
		this.txtSubmittedTime = "(//p[text()='Submitted Time']//following::p)[1]";
		this.txtLanguage = "//p[text()='English']";
		this.btnDownload =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-icrtaVg-css']/following-sibling::button";
		this.btnDownloadCSV = "//div[@role='menuitem']//p[text()='CSV']";
		this.commonFunctions = new CommonPageFunctions(this.page);
		this.apiActions = new APIActions();
		this.evaluatorElements = "//tbody[contains(@class, 'PJLV')]//tr";
		this.btnSearchResponses = "//button[@aria-label='Search']";
		this.inputSearchResponses = "//input[@placeholder='Search Responses']";
		this.webElementsSearchSubjects = `//div[@data-testid="flex" and contains(@class, "idDLDNu-css")]/p[@data-testid="text"][1]`;
		this.getResponseSubmissionDate = (subjectName, evaluatorName) =>
			`//table//tr[.//*[normalize-space(text())='${subjectName}'] and .//*[normalize-space(text())='${evaluatorName}']]//td[2]`;
		this.webElementResponsesContainer = `//p[contains(normalize-space(.),'Responses')]/ancestor::div[@class='twigs-c-PJLV twigs-c-PJLV-ifZrNKq-css']/div[2]`;
		this.btnChangeLanguage =
			"//button[@aria-label='Search']/following-sibling::button";
		this.btnChooseLanguage = (language) =>
			`//div[@role="menuitem"]//p[normalize-space(.)="${language}"]`;
		this.getResponseForSubjectByEvaluator = (subjectName, evaluatorName) =>
			`//p[normalize-space(.)="${evaluatorName}"]/ancestor::div[@data-testid="flex"][2]/p[normalize-space(.)="${subjectName}"]`;
		this.getResponseValueForOptionQuestion = (question) =>
			`//p[text()='${question}']/following-sibling::div//p`;
		this.getResponseValueForTextQuestion = (question) =>
			`(//p[normalize-space(.)="${question}"]/following-sibling::div//p)[3]`;
		this.txtOpenFeedBackResponses =
			"//p[normalize-space(.)='Open Feedback']/parent::div/following-sibling::p";
		this.btnDownloadResponses = `(//button[@data-testid='button' and @aria-haspopup='menu'])[1]`;
		this.btnTranslateResponsesTo = `//p[contains(normalize-space(.),"Translate Responses to")]/preceding-sibling::button`;
		this.getQuestionAnswer = (sectionName, question) =>
			`//p[text()='${sectionName}']/parent::div/parent::div//p[text()='${question}']/parent::div/div//p`;
		this.getQuestionTextAnswer = (sectionName, question) =>
			`(//p[text()='${sectionName}']/parent::div/parent::div//p[text()='${question}']/parent::div/div//p)[last()]`;
		this.getQuestionTextAnswerForRatingGoal = (sectionName, question) =>
			`(//p[text()='${sectionName}']/parent::div/parent::div//p[text()='${question}']/parent::div/following-sibling::div//p)[1]`;
		this.getQuestionTextAnswerForTextGoal = (sectionName, question) =>
			`(//p[text()='${sectionName}']/parent::div/parent::div//p[text()='${question}']/parent::div/following-sibling::div//p)[2]`;
		this.getResponseSubmissionDate = (subjectName, evaluatorName) =>
			`//table//tr[.//*[normalize-space(text())='${subjectName}'] and .//*[normalize-space(text())='${evaluatorName}']]//td[2]`;
		this.webElementResponsesContainer = `//p[contains(normalize-space(.),'Responses')]/ancestor::div[@class='twigs-c-PJLV twigs-c-PJLV-ifZrNKq-css']/div[2]`;
		this.btnChangeLanguage =
			"//button[@aria-label='Search']/following-sibling::button";
		this.btnChooseLanguage = (language) =>
			`//div[@role="menuitem"]//p[normalize-space(.)="${language}"]`;
		this.getResponseForSubjectByEvaluator = (subjectName, evaluatorName) =>
			`//p[normalize-space(.)="${evaluatorName}"]/ancestor::div[@data-testid="flex"][2]/p[normalize-space(.)="${subjectName}"]`;
		this.getResponseValueForOptionQuestion = (question) =>
			`//p[text()='${question}']/following-sibling::div//p`;
		this.getResponseValueForTextQuestion = (question) =>
			`(//p[normalize-space(.)="${question}"]/following-sibling::div//p)[3]`;
		this.txtOpenFeedBackResponses =
			"//p[normalize-space(.)='Open Feedback']/parent::div/following-sibling::p";
		this.btnDownloadResponses = `(//button[@data-testid='button' and @aria-haspopup='menu'])[1]`;
		this.btnTranslateResponsesTo = `//p[contains(normalize-space(.),"Translate Responses to")]/preceding-sibling::button`;
		this.getMCQOptionBoxes = (sectionName, question) =>
			`//div//p[normalize-space() = '${sectionName}']//parent::div//following::div//div//p[normalize-space() = '${question}']//parent::div//div[@class = 'twigs-c-PJLV twigs-c-PJLV-ibJzVdy-css']`;
	}

	/**
	 * Verifies the time and language settings on the response page.
	 */

	async verifyTimeLanguage() {
		await PwActions.click(this.page, this.btnMoreInfo);
		const start_time = await PwActions.getText(this.page, this.txtStartedTime);
		const submitted_time = await PwActions.getText(
			this.page,
			this.txtSubmittedTime,
		);

		await PwActions.elementIsVisible(this.page, this.txtStartedTime);
		await PwActions.elementIsVisible(this.page, this.txtSubmittedTime);
		await PwActions.elementIsVisible(this.page, this.txtLanguage);

		const dateRegex = /^\d{2} [A-Z][a-z]{2} '\d{2} \d{2}:\d{2} (AM|PM)$/;

		expect(dateRegex.test(start_time)).toBeTruthy();
		expect(dateRegex.test(submitted_time)).toBeTruthy();
	}

	/**
	 * Verifies the response data for a given participant.
	 *
	 * This function navigates to a specific participant's page, refreshes the page up to 5 times if the participant
	 * is not initially visible, and then verifies that the response data matches the expected values. The response
	 * data can include both opinion and text types.
	 *
	 * @param {string} participantName - The name of the participant whose responses are to be verified.
	 *
	 */

	async verifyResponse(participantName) {
		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);
		let flag = false;
		let count = 0;
		let data = [];
		let section = [];

		let fullParticipantName;

		if (participantName === "Reportee" || participantName === "Manager") {
			fullParticipantName = `Evaluator-${participantName}`;
		} else if (participantName === "Evaluator") {
			fullParticipantName = "Evaluator-Peer";
		} else {
			fullParticipantName = "Subject";
		}

		if (participantName.includes("Subject")) {
			this.btnSelectParticipant = `(//tbody[contains(@class, 'PJLV')]//p[contains(text(),'${participantName}')])[last()]`;
		} else {
			this.btnSelectParticipant = `//tbody[contains(@class, 'PJLV')]//p[contains(text(),'${participantName}') and contains(@class, 'weight-regular twigs-c')]`;
		}
		do {
			if (
				await PwActions.elementIsVisible(this.page, this.btnSelectParticipant)
			) {
				flag = true;
			} else {
				await CommonUtils.sleep(1);
				await PwActions.pageRefresh(this.page);
				count += 1;
			}
		} while (flag === false && count < 5);
		await PwActions.click(this.page, this.btnSelectParticipant);

		if (responseData[fullParticipantName]) {
			data = responseData[fullParticipantName];
			for (const j in data) {
				section = data[j];
				for (const question in section) {
					if (section[question][0] === "opinion") {
						this.lblResponseValueForEachQuestion = `//p[text()='${question}']/parent::div//div[contains(@class, 'FKjS')]//p`;
						const actualValue = await PwActions.getText(
							this.page,
							this.lblResponseValueForEachQuestion,
						);
						const expectedValue = section[question][1];
						await PwActions.verifyTextExpected(
							actualValue,
							`Score: ${expectedValue}`,
						);
					} else if (section[question][0] === "text") {
						this.lblResponseValueForEachQuestion = `(//p[text()='${question}']/parent::div//div[contains(@class, 'FKjS')]//p)[2]`;
						const actualValue = await PwActions.getText(
							this.page,
							this.lblResponseValueForEachQuestion,
						);
						const expectedValue = section[question][1];
						await PwActions.verifyTextExpected(actualValue, expectedValue);
					}
				}
			}
		}
	}

	/**
	 * Helper for verifyResponsesDownloadAsCSV — builds Maps for O(1) API row lookup.
	 *
	 * @param {Array<object>|null|undefined} apiResponses - Responses array from internal API.
	 * @returns {{ bySubmissionId: Map<string, object>, byEmailPair: Map<string, object> }}
	 *
	 * @example
	 * const { bySubmissionId, byEmailPair } = this.buildSurveyResponsesLookupMaps(responses);
	 */
	buildSurveyResponsesLookupMaps(apiResponses) {
		const bySubmissionId = new Map();
		const byEmailPair = new Map();
		for (const r of apiResponses ?? []) {
			bySubmissionId.set(String(r.submission_id), r);
			byEmailPair.set(`${r.evaluatoremail}|${r.subjectemail}`, r);
		}
		return { bySubmissionId, byEmailPair };
	}

	/**
	 * Helper for verifyResponsesDownloadAsCSV — strips "1.1 - " style prefix so EntityIds keys match attend.
	 *
	 * @param {string} questionColumnLabel - Header from getQuestionsFromSurvey / CSV.
	 * @returns {string} Plain question text for EntityIds.getQuestionScale.
	 *
	 * @example
	 * this.normalizeResponsesCsvQuestionLabel("1.1 - Rating Scale"); // "Rating Scale"
	 */
	normalizeResponsesCsvQuestionLabel(questionColumnLabel) {
		const match = questionColumnLabel.match(/^\d+\.\d+\s*-\s*(.+)$/);
		return match ? match[1].trim() : questionColumnLabel;
	}

	/**
	 * Returns whether a question label corresponds to a **multi-select MultiChoice** in the attended
	 * response fixture. Walks `jsonData` (subject → evaluator → section → question key) until a key
	 * matches `questionText` (exact, substring, or reverse substring), then checks the stored tuple
	 * `[type, value]` for `type === "MultiChoice"` and `value` being an **array** (multiple selections).
	 * Results are memoized in `cache` keyed by `questionText` for repeated lookups during one CSV run.
	 *
	 * @param {object} options
	 * @param {object} options.jsonData - Nested attended response JSON from the survey fixture.
	 * @param {string} options.questionText - CSV column or question label to resolve (e.g. header text).
	 * @param {Map<string, boolean>} options.cache - Per-run cache: question label → multi-select MultiChoice flag.
	 * @returns {boolean} True if the fixture encodes this question as MultiChoice with an array of selected values.
	 *
	 * @example
	 * // Fixture shape for a multi-select MCQ (returns true):
	 * // sectionData["1.1 - Question?"] = ["MultiChoice", ["A", "B"]];
	 * const cache = new Map();
	 * const isMultiSelect = this.isMultiSelectQuestion({
	 *   jsonData: responseFixture,
	 *   questionText: "1.1 - Pick all that apply",
	 *   cache,
	 * });
	 * // Returns: true — MultiChoice with array value (multi-select).
	 * @example
	 * // Single-select MCQ (returns false): ["MultiChoice", "Option A"] — value is string, not array.
	 * const cache2 = new Map();
	 * const isMulti = this.isMultiSelectQuestion({
	 *   jsonData: responseFixture,
	 *   questionText: "2.1 - Choose one",
	 *   cache: cache2,
	 * });
	 * // Returns: false
	 */
	isMultiSelectQuestion({ jsonData, questionText, cache }) {
		if (cache.has(questionText)) {
			return cache.get(questionText);
		}
		let result = false;
		outer: for (const subject in jsonData) {
			for (const evaluator in jsonData[subject]) {
				for (const section in jsonData[subject][evaluator]) {
					const sectionData = jsonData[subject][evaluator][section];
					for (const question in sectionData) {
						if (
							question === questionText ||
							question.includes(questionText) ||
							questionText.includes(question)
						) {
							const qData = sectionData[question];
							if (Array.isArray(qData) && qData.length === 2) {
								const [type, value] = qData;
								if (type === "MultiChoice" && Array.isArray(value)) {
									result = true;
									break outer;
								}
							}
						}
					}
				}
			}
		}
		cache.set(questionText, result);
		return result;
	}

	/**
	 * Verifies that all expected columns exist in the CSV headers for a survey responses download.
	 * Handles two special cases before asserting:
	 * - MCQ multi-select questions: skips base column validation when option sub-columns (e.g. "Q - Option A") are detected.
	 * - Scaled opinion questions: expects the column suffixed as "(Out of N)" using the scale stop value from EntityIds.
	 *
	 * @param {object}               options
	 * @param {string[]}             options.expectedColumns       - Full ordered list of expected column names
	 * @param {string[]}             options.dataColumns           - Keys parsed from the first CSV row
	 * @param {string[]}             options.questionColumns       - Question headers returned by getQuestionsFromSurvey
	 * @param {object}               options.jsonResponseData      - Attended survey response fixture JSON used for MCQ multi-select detection
	 * @param {Map<string, boolean>} options.mcqMultiSelectCache   - Shared cache for MCQ multi-select detection, reused across one CSV verification run
	 * @returns {void}
	 *
	 * @example
	 * // Typical call after parsing the CSV header row and loading the attended-response fixture:
	 * const mcqMultiSelectCache = new Map();
	 * this.verifyResponsesCsvExpectedColumns({
	 *   expectedColumns: ["Email", "Rate your manager", "Pick all that apply"],
	 *   dataColumns: [
	 *     "Email",
	 *     "Rate your manager (Out of 5)",
	 *     "Pick all that apply - Option A",
	 *     "Pick all that apply - Option B",
	 *   ],
	 *   questionColumns: ["Rate your manager", "Pick all that apply"],
	 *   jsonResponseData: attendedSurveyJson,
	 *   mcqMultiSelectCache,
	 * });
	 * // e.g. "Rate your manager" is asserted as "Rate your manager (Out of 5)" when EntityIds has scale.stop === 5.
	 * // e.g. "Pick all that apply" is skipped as a single column when option sub-columns exist (multi-select).
	 */
	verifyResponsesCsvExpectedColumns({
		expectedColumns,
		dataColumns,
		questionColumns,
		jsonResponseData,
		mcqMultiSelectCache,
	}) {
		for (const column of expectedColumns) {
			const isMultiSelect = this.isMultiSelectQuestion({
				jsonData: jsonResponseData,
				questionText: column,
				cache: mcqMultiSelectCache,
			});
			const hasOptionColumns = dataColumns.some((col) =>
				col.startsWith(`${column} - `),
			);

			if (
				questionColumns.includes(column) &&
				(isMultiSelect || (hasOptionColumns && !dataColumns.includes(column)))
			) {
				logger.info(
					`[MCQ Multi-Select] Skipping base column validation for "${column}" - detected as multi-select (JSON: ${isMultiSelect}, CSV options: ${hasOptionColumns})`,
				);
				continue;
			}

			const normalizedLabel = this.normalizeResponsesCsvQuestionLabel(column);
			const scale = EntityIds.getQuestionScale(normalizedLabel);
			if (!scale?.stop && questionColumns.includes(column)) {
				logger.warn(
					`[Scale] No scale stop value found for question: "${column}"`,
				);
			}

			const expectedColumnName =
				questionColumns.includes(column) && scale?.stop
					? `${column} (Out of ${scale.stop})`
					: column;

			expect(
				dataColumns,
				`Expected column - "${expectedColumnName}" not found.`,
			).toContain(expectedColumnName);
		}
	}

	/**
	 * Verifies that a single CSV row's metadata fields match the corresponding API response values.
	 * Covers: StartDate, SubmittedDate, CompletionStatus, EvaluatorName, EvaluatorEmail,
	 * SubjectName, SubjectEmail, Browser, OS, SubmissionId, and LanguageName.
	 *
	 * Applies the following normalizations before asserting:
	 * - Dates are formatted to dd/MM/yyyy via CommonUtils.formatDate
	 * - Evaluator/Subject names are constructed from first + last name fields
	 * - Browser is trimmed to the first word only (e.g. "Chrome 120" → "Chrome")
	 * - Language code "en" is expanded to "English"
	 * - CompletionStatus is uppercased on both sides before comparison
	 *
	 * @param {object} options
	 * @param {object} options.row         - Single parsed CSV row object keyed by column header
	 * @param {object} options.apiResponse - Matching internal API response object for the same submission
	 * @returns {void}
	 *
	 * @example
	 * // After parsing one CSV data row and fetching the matching submission from the internal API:
	 * this.verifyResponsesCsvRowMetadata({
	 *   row: {
	 *     StartDate: "15/01/2026",
	 *     SubmittedDate: "15/01/2026",
	 *     CompletionStatus: "COMPLETED",
	 *     EvaluatorName: "Jane Doe",
	 *     EvaluatorEmail: "jane@example.com",
	 *     SubjectName: "John Smith",
	 *     SubjectEmail: "john@example.com",
	 *     Browser: "Chrome 120",
	 *     OS: "macOS",
	 *     SubmissionId: "12345",
	 *     LanguageName: "English",
	 *   },
	 *   apiResponse: {
	 *     start_time: "2026-01-15T10:00:00.000Z",
	 *     completed_time: "2026-01-15T10:30:00.000Z",
	 *     state: "completed",
	 *     evaluatorfirstname: "Jane",
	 *     evaluatorlastname: "Doe",
	 *     evaluatoremail: "jane@example.com",
	 *     subjectfirstname: "John",
	 *     subjectlastname: "Smith",
	 *     subjectemail: "john@example.com",
	 *     submission_id: 12345,
	 *     submission: {
	 *       language: "en",
	 *       metaData: { browser: "Chrome 120", os: "macOS" },
	 *     },
	 *   },
	 * });
	 * // e.g. CSV "Chrome 120" is compared to API browser first token "Chrome"; language "en" expects CSV "English".
	 */
	verifyResponsesCsvRowMetadata({ row, apiResponse }) {
		const expectedStartDate = CommonUtils.formatDate(
			apiResponse.start_time,
			"dd/MM/yyyy",
		);
		const expectedSubmittedDate = CommonUtils.formatDate(
			apiResponse.completed_time,
			"dd/MM/yyyy",
		);
		const expectedEvaluatorName =
			`${apiResponse.evaluatorfirstname} ${apiResponse.evaluatorlastname}`.trim();
		const expectedSubjectName =
			`${apiResponse.subjectfirstname} ${apiResponse.subjectlastname}`.trim();
		const expectedBrowser =
			apiResponse.submission.metaData.browser.split(" ")[0];
		const expectedLanguage =
			apiResponse.submission.language === "en"
				? "English"
				: apiResponse.submission.language;

		expect(
			String(row.StartDate ?? "").trim(),
			`Expected Start Date: ${expectedStartDate}`,
		).toBe(expectedStartDate);
		expect(
			String(row.SubmittedDate ?? "").trim(),
			`Expected Submitted Date: ${expectedSubmittedDate}`,
		).toBe(expectedSubmittedDate);
		expect(
			String(row.CompletionStatus ?? "")
				.trim()
				.toUpperCase(),
			`Expected Completion Status: ${apiResponse.state.toUpperCase()}`,
		).toBe(apiResponse.state.toUpperCase());
		expect(
			String(row.EvaluatorName ?? "").trim(),
			`Expected Evaluator Name: ${expectedEvaluatorName}`,
		).toBe(expectedEvaluatorName);
		expect(
			String(row.EvaluatorEmail ?? "").trim(),
			`Expected Evaluator Email: ${apiResponse.evaluatoremail}`,
		).toBe(apiResponse.evaluatoremail);
		expect(
			String(row.SubjectName ?? "").trim(),
			`Expected Subject Name: ${expectedSubjectName}`,
		).toBe(expectedSubjectName);
		expect(
			String(row.SubjectEmail ?? "").trim(),
			`Expected Subject Email: ${apiResponse.subjectemail}`,
		).toBe(apiResponse.subjectemail);
		expect(
			String(row.Browser ?? "")
				.trim()
				.split(" ")[0],
			`Expected Browser: ${expectedBrowser}`,
		).toBe(expectedBrowser);
		expect(
			String(row.OS ?? "").trim(),
			`Expected OS: ${apiResponse.submission.metaData.os}`,
		).toBe(apiResponse.submission.metaData.os);
		expect(
			String(row.SubmissionId ?? "").trim(),
			`Expected Submission ID: ${apiResponse.submission_id}`,
		).toBe(apiResponse.submission_id.toString());
		expect(
			String(row.LanguageName ?? "").trim(),
			`Expected Language Name: ${expectedLanguage}`,
		).toBe(expectedLanguage);
	}

	/**
	 * Verifies that all question cells in a single CSV row match the expected values from the attended fixture JSON.
	 * Iterates over every section and question in the evaluator's fixture data and asserts against the parsed CSV row.
	 *
	 * Handles three question types:
	 * - MultiChoice: collects all option sub-columns (e.g. "Q - Option 1", "Q - Other"), normalizes text,
	 *   strips "Other:" prefix, and asserts each expected option is present with correct count.
	 * - opinion / text: compares trimmed string values directly; treats "N/A" or "NA" fixture values as
	 *   acceptable when the CSV cell is empty, "N/A", or "NA".
	 *
	 * Column matching strips the leading section prefix (e.g. "1.2 - ") from question keys before
	 * searching CSV headers, falling back to the full question key if no match is found.
	 *
	 * @param {object} options
	 * @param {object} options.row           - Single parsed CSV row object keyed by column header
	 * @param {object} options.evaluatorData - Nested fixture data for one evaluator, shaped as section → question → [type, value]
	 * @returns {void}
	 *
	 * @example
	 * this.verifyResponsesCsvRowQuestions({
	 *     row: csvRows[0],
	 *     evaluatorData: jsonData[subjectId][evaluatorId],
	 * });
	 */
	verifyResponsesCsvRowQuestions({ row, evaluatorData }) {
		const rowKeys = Object.keys(row);

		for (const [sectionName, sectionData] of Object.entries(evaluatorData)) {
			logger.info(`Section: ${sectionName}`);
			for (const [question, value] of Object.entries(sectionData)) {
				const [type, expectedValue] = Array.isArray(value)
					? value
					: typeof value === "object" && value !== null
						? [value.type, value.value]
						: (() => {
								throw new Error(
									`Unexpected data format for question: ${question}`,
								);
							})();

				const questionWithoutSection = question.replace(/^\d+\.\d+\s+-\s+/, "");
				const csvKey = rowKeys.find(
					(key) =>
						key.includes(questionWithoutSection) || key.includes(question),
				);

				expect(
					csvKey,
					`No matching CSV column for question: ${question}`,
				).toBeDefined();

				if (type === "MultiChoice") {
					const allColumns = Object.keys(row);
					const baseQuestionName = csvKey.replace(
						/ - (Option \d+|Other)\s*$/,
						"",
					);
					const mcqColumns = allColumns.filter(
						(key) =>
							key === baseQuestionName ||
							key.startsWith(`${baseQuestionName} - `),
					);

					const actualSelectedOptions = mcqColumns
						.map((col) => {
							const cell = row[col]?.trim();
							return cell ? cell : null;
						})
						.filter((v) => v !== null);

					logger.info(`${question}:`);
					logger.info(`  Expected: ${JSON.stringify(expectedValue)}`);
					logger.info(`  Actual: ${JSON.stringify(actualSelectedOptions)}`);

					const expectedOptions = Array.isArray(expectedValue)
						? expectedValue
						: [expectedValue];

					expect(
						actualSelectedOptions.length,
						`Expected ${expectedOptions.length} selected option(s) for ${question}, but found ${actualSelectedOptions.length}`,
					).toBe(expectedOptions.length);

					for (const expectedOption of expectedOptions) {
						let normalizedExpected = CommonUtils.normalizeText(expectedOption);

						if (normalizedExpected.startsWith("Other:")) {
							normalizedExpected = normalizedExpected
								.replace(/^Other:\s*/, "")
								.trim();
						}

						const found = actualSelectedOptions.some((actual) => {
							const normalizedActual = CommonUtils.normalizeText(actual);
							return (
								normalizedActual === normalizedExpected ||
								normalizedActual.includes(normalizedExpected) ||
								normalizedExpected.includes(normalizedActual)
							);
						});
						expect(
							found,
							`Expected option "${expectedOption}" not found in CSV for ${question}`,
						).toBeTruthy();
					}
				} else if (type === "opinion" || type === "text") {
					const rawCell = row[csvKey];
					const actualStr = rawCell == null ? "" : String(rawCell).trim();
					const expectedStr = String(expectedValue ?? "").trim();
					const isNaAnswer =
						/^n\/a$/i.test(expectedStr) || /^na$/i.test(expectedStr);

					logger.info(`${question}:`);
					logger.info(`  Expected: ${expectedValue}`);
					logger.info(`  Actual: ${rawCell}`);

					if (isNaAnswer) {
						expect(
							actualStr === "" ||
								/^n\/a$/i.test(actualStr) ||
								/^na$/i.test(actualStr),
							`Expected N/A for ${question} to appear as empty cell or N/A in CSV, got "${actualStr}"`,
						).toBeTruthy();
					} else {
						expect(
							actualStr,
							`Expected value for ${question} does not match actual value`,
						).toBe(expectedStr);
					}
				}
			}
		}
	}

	/**
	 * Verifies a downloaded survey responses CSV against both the attended fixture JSON and the internal API.
	 * Performs a full 3-way verification across every row in the CSV.
	 *
	 * Verification order per row:
	 * 1. Column headers — asserts all expected columns exist, handling MCQ multi-select sub-columns
	 *    and scaled opinion "(Out of N)" suffixes via verifyResponsesCsvExpectedColumns.
	 * 2. Row count — asserts CSV row count matches the total responses shown in the UI.
	 * 3. Metadata — asserts StartDate, SubmittedDate, CompletionStatus, EvaluatorName, EvaluatorEmail,
	 *    SubjectName, SubjectEmail, Browser, OS, SubmissionId, and LanguageName via verifyResponsesCsvRowMetadata.
	 * 4. Question responses — asserts MCQ, opinion, and text answers against fixture JSON
	 *    via verifyResponsesCsvRowQuestions.
	 *
	 * API lookup uses a dual-key strategy: primary lookup by SubmissionId,
	 * fallback by EvaluatorEmail|SubjectEmail pair via buildSurveyResponsesLookupMaps.
	 *
	 * Role mapping is applied when the fixture JSON is keyed by role
	 * (e.g. "Peer" → "Evaluator-Peer", "Self" → "Subject") before evaluator data lookup.
	 *
	 * @param {string}  csvFilePath              - Absolute path to the downloaded CSV file
	 * @param {object}  [page=this.page]         - Playwright page instance, used to read cookies and total response count
	 * @param {object}  [options={}]             - Optional fields merged into the internal API payload
	 * @param {string}  [options.viewType]       - API filter view type (e.g. "MANAGER_VIEW")
	 * @param {string}  [options.reporteeType]   - API filter reportee type (e.g. "DIRECT_REPORTEES")
	 * @returns {Promise<void>}
	 * @throws {Error} When the internal API request fails, or any CSV/API/fixture assertion does not align
	 *
	 * @example
	 * await performanceResponsesPage.verifyResponsesDownloadAsCSV(
	 *     "/path/to/responses.csv",
	 *     page,
	 *     { viewType: "MANAGER_VIEW", reporteeType: "DIRECT_REPORTEES" },
	 * );
	 */
	async verifyResponsesDownloadAsCSV(
		csvFilePath,
		page = this.page,
		options = {},
	) {
		const [data, jsonResponseData, survey_id, cookieValue] = await Promise.all([
			this.commonutils.readCSVFile(csvFilePath),
			this.commonutils.readJsonFileAndConvertToObject(
				`${EntityIds.getsurveyName()} Survey Response.json`,
			),
			EntityIds.getsurveyId(),
			page.context().cookies(),
		]);

		const dataArray = Array.isArray(data.data)
			? data.data
			: Object.values(data.data);

		const totalResponses = await this.getTotalResponses(page);
		expect(
			dataArray.length,
			"The number of responses in the CSV file is 0",
		).not.toBe(0);
		expect(
			dataArray.length,
			"The number of responses in the CSV file does not match the number of evaluators for the subject",
		).toBe(totalResponses);

		const internal_url = `${envDetails.uri}/api/internal/surveys/${survey_id}/responses?pageNo=1`;
		const payload = {
			filterType: "ALL",
			sortType: "LAST_SUBMITTED",
			dateRange: {},
			search: "",
			filters: [],
		};

		if (options && typeof options === "object") {
			if (options.viewType) payload.viewType = options.viewType;
			if (options.reporteeType) payload.reporteeType = options.reporteeType;
		}

		let apiResponses;
		try {
			const result = await this.apiActions.postRequest({
				url: internal_url,
				cookieValue: cookieValue,
				data: payload,
			});
			apiResponses = result?.responses;
			logger.info(`API Responses: ${JSON.stringify(apiResponses)}`);
		} catch (err) {
			throw new Error(
				`Failed to fetch survey responses from API: ${err.message}`,
			);
		}
		expect(apiResponses, "API returned no responses array").toBeDefined();

		const { bySubmissionId, byEmailPair } =
			this.buildSurveyResponsesLookupMaps(apiResponses);

		const questionColumns =
			await this.commonFunctions.getQuestionsFromSurvey(jsonResponseData);
		const mcqMultiSelectCache = new Map();

		const expectedColumns = [
			...questionColumns,
			"StartDate",
			"SubmittedDate",
			"CompletionStatus",
			"EvaluatorName",
			"EvaluatorEmail",
			"Relation",
			"SubjectName",
			"SubjectEmail",
			"Browser",
			"OS",
			"SubmissionId",
			"LanguageName",
		];

		this.verifyResponsesCsvExpectedColumns({
			expectedColumns,
			dataColumns: Object.keys(dataArray[0]),
			questionColumns,
			jsonResponseData,
			mcqMultiSelectCache,
		});

		const roleMapping = {
			Peer: "Evaluator-Peer",
			Manager: "Evaluator-Manager",
			Reportee: "Evaluator-Reportee",
			Self: "Subject",
		};

		for (const row of dataArray) {
			const subjectName = String(row.SubjectName ?? "").trim();
			const evaluatorName = String(row.EvaluatorName ?? "").trim();
			const rawRole = evaluatorName;
			const roleMapped = roleMapping[rawRole] || rawRole;

			logger.info(
				`\n=== Checking responses for ${evaluatorName} (${String(row.Relation ?? "").trim()}) evaluating ${subjectName} ===`,
			);

			const apiResponse =
				bySubmissionId.get(String(row.SubmissionId ?? "").trim()) ||
				byEmailPair.get(
					`${String(row.EvaluatorEmail ?? "").trim()}|${String(row.SubjectEmail ?? "").trim()}`,
				);

			expect(
				apiResponse,
				`No API response found for submission ${row.SubmissionId}`,
			).toBeDefined();

			this.verifyResponsesCsvRowMetadata({ row, apiResponse });

			expect(
				jsonResponseData[subjectName],
				`No data found for subject: ${subjectName}`,
			).toBeDefined();

			const evaluatorData =
				jsonResponseData[subjectName][evaluatorName] ||
				jsonResponseData[subjectName][roleMapped];

			if (!evaluatorData) {
				logger.error(
					`Available keys for subject "${subjectName}": ${Object.keys(jsonResponseData[subjectName]).join(", ")}`,
				);
				logger.error(
					`Looking for evaluator: "${evaluatorName}" or role: "${roleMapped}"`,
				);
				expect(
					evaluatorData,
					`No response data found for ${subjectName} under evaluator: ${evaluatorName} or role: ${roleMapped}`,
				).toBeTruthy();
				continue;
			}

			logger.info(
				`\nChecking question responses for evaluator: ${evaluatorName} (${roleMapped})`,
			);

			this.verifyResponsesCsvRowQuestions({ row, evaluatorData });
		}
	}

	/**
	 * Returns the total number of responses from the current page.
	 * @returns {Promise<number>} The total number of responses.
	 */

	async getTotalResponses(page = this.page) {
		const locator = await PwActions.getLocator(page, this.evaluatorElements);
		await locator.first().waitFor({ state: "visible", timeout: 15000 });
		const elements = await locator.all();
		return elements.length;
	}

	/**
	 * Searches for responses based on the subject or evaluator name.
	 * @param {string} subjectOrEvaluatorName - The subject or evaluator name to search for.
	 * @param {Page} page - The page to search on.
	 * @returns {Promise<void>}
	 * @example
	 * await searchResponses({ subjectOrEvaluatorName: "John Doe", page: page });
	 */

	async searchResponses({ subjectOrEvaluatorName, page = this.page }) {
		await PwActions.click(page, this.btnSearchResponses);
		await PwActions.fill(
			page,
			this.inputSearchResponses,
			subjectOrEvaluatorName,
		);
		await CommonUtils.sleep(2);
		const elements = await PwActions.getWebElementsPage(
			page,
			this.webElementsSearchSubjects,
		);
		const searchResults = await PwActions.getElementsText(page, elements);
		for (const searchResult of searchResults) {
			expect(
				searchResult.toLowerCase(),
				`Expected search result: ${subjectOrEvaluatorName.toLowerCase()}`,
			).toBe(subjectOrEvaluatorName.toLowerCase());
		}
	}

	/**
	 * Clicks on a specific response row in the responses list
	 *
	 * @param {Object} params - Configuration parameters
	 * @param {string} params.subjectName - Name of the subject being evaluated
	 * @param {string} params.evaluatorName - Name of the evaluator who provided the response
	 * @param {Object} [params.page] - Playwright page object (defaults to this.page)
	 *
	 * @description
	 * Locates and clicks on the response row that matches the subject and evaluator combination
	 * to open the detailed response view
	 *
	 * @example
	 * await performanceResponsesPage.clickOnResponseRow({
	 *     subjectName: "John Doe",
	 *     evaluatorName: "Jane Smith",
	 *     page: thrivePage
	 * });
	 */

	async clickOnResponseRow({ subjectName, evaluatorName, page = this.page }) {
		await PwActions.click(
			page,
			this.getResponseForSubjectByEvaluator(subjectName, evaluatorName),
		);
	}

	/**
	 * Verifies all performance survey responses against JSON data
	 *
	 * @param {Object} params - Configuration parameters
	 * @param {Object} params.page - Playwright page object
	 * @param {string} params.surveyName - Name of the survey (used to locate JSON response file)
	 *
	 * @description
	 * Automatically verifies all responses by:
	 * - Reading response data from JSON file (TSAP/Data/Files/{surveyName} Survey Response.json)
	 * - Iterating through all subjects and their evaluators
	 * - Clicking on each response row to view details
	 * - Verifying all sections and questions including:
	 *   - Opinion scale questions (ratings)
	 *   - Text feedback questions
	 *   - MultiChoice questions (single and multi-select, including "Other" text)
	 *   - Goal-based questions (both OpinionScale and TextInput)
	 * - Comparing UI values against expected values from JSON
	 *
	 * @throws {Error} If response data file not found or verification fails
	 *
	 * @example
	 * await performanceResponsesPage.verifyPerformanceResponses({
	 *     page: thrivePage
	 * });
	 */

	async verifyPerformanceResponses({ page = this.page }) {
		const surveyName = EntityIds.getsurveyName();
		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${surveyName} Survey Response.json`,
		);
		await PwActions.pageRefresh(page);
		await PwActions.waitForNetworkIdle(page, 5000);
		for (const [subjectName, evaluators] of Object.entries(responseData)) {
			for (const [evaluatorName, sections] of Object.entries(evaluators)) {
				logger.info(`Verifying ${evaluatorName} -> ${subjectName}`);
				await this.clickOnResponseRow({ subjectName, evaluatorName, page });
				await CommonUtils.sleep(2);

				for (const [sectionName, questions] of Object.entries(sections)) {
					for (const [questionText, questionData] of Object.entries(
						questions,
					)) {
						let actualText;
						let ans;
						let stopValue;
						let expectedValue;

						if (
							Array.isArray(questionData) &&
							questionData[0] === "MultiChoice"
						) {
							expectedValue = questionData[1];
							const expectedOptions = Array.isArray(expectedValue)
								? expectedValue
								: [expectedValue];

							const actualOptions = await PwActions.getAllInnerTexts(
								page,
								this.getMCQOptionBoxes(sectionName, questionText),
							);
							for (const expectedOption of expectedOptions) {
								let normalizedExpected =
									CommonUtils.normalizeText(expectedOption);

								// Handle "Other:" responses - strip the prefix
								if (normalizedExpected.startsWith("Other:")) {
									normalizedExpected = normalizedExpected
										.replace(/^Other:\s*/, "")
										.trim();
								}

								const found = actualOptions.some((actualOption) => {
									const normalizedActual =
										CommonUtils.normalizeText(actualOption);
									return (
										normalizedActual === normalizedExpected ||
										normalizedActual.includes(normalizedExpected) ||
										normalizedExpected.includes(normalizedActual)
									);
								});
								expect(
									found,
									`Expected option "${expectedOption}" not found in UI for question: ${questionText}`,
								).toBeTruthy();
							}
							continue;
						} else if (Array.isArray(questionData)) {
							expectedValue = questionData[1];
							actualText = await PwActions.getText(
								page,
								this.getQuestionTextAnswer(sectionName, questionText),
							);
						} else if (questionData.type === "opinion") {
							ans = questionData.value;
							if (ans === "Not Answered") {
								expectedValue = "Not Answered";
							} else if (ans === "N/A") {
								expectedValue = "N/A";
							} else {
								stopValue = questionData.scale?.stop;
								expectedValue = `Score: ${ans} / ${stopValue}`;
							}
							actualText = await PwActions.getText(
								page,
								this.getQuestionTextAnswer(sectionName, questionText),
							);
						} else if (questionData.type === "goal") {
							const { feedbackMethod, answers } = questionData;

							for (const answer of answers) {
								const { goalName, score, text } = answer;
								expectedValue = score || text;

								const locator =
									feedbackMethod === "OpinionScale"
										? this.getQuestionTextAnswerForRatingGoal(
												sectionName,
												goalName,
											)
										: this.getQuestionTextAnswerForTextGoal(
												sectionName,
												goalName,
											);

								actualText = await PwActions.getText(page, locator);

								expect(actualText).toContain(String(expectedValue));
							}
							continue;
						} else {
							continue;
						}

						expect(actualText).toContain(String(expectedValue));
					}
				}

				logger.info(`Verified ${evaluatorName}`);
			}
		}

		logger.info("All responses verified successfully");
	}

	/**
	 * Gets question data for a specific subject, evaluator, section, and question
	 * @param {string} subjectName - The name of the subject
	 * @param {string} evaluatorName - The name of the evaluator
	 * @param {string} sectionName - The name of the section
	 * @param {string} questionText - The text of the question
	 * @returns {object|null} - Returns question data or null if not found
	 * @example
	 * const questionData = await performanceResponsesPage.getQuestionData({
	 *     subjectName: "Goals Employee",
	 *     evaluatorName: "Evaluator-Peer",
	 *     sectionName: "Leadership Skills",
	 *     questionText: "Goal 1"
	 * });
	 */
	async getQuestionDataFromJsonFile({
		subjectName,
		evaluatorName,
		sectionName,
		questionText,
	}) {
		const surveyName = EntityIds.getsurveyName();
		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${surveyName} Survey Response.json`,
		);

		if (
			responseData[subjectName]?.[evaluatorName]?.[sectionName]?.[questionText]
		) {
			return responseData[subjectName][evaluatorName][sectionName][
				questionText
			];
		}

		return null;
	}

	/**
	 * Returns the submission date for a given subject and evaluator.
	 * @param {string} subjectName - The name of the subject.
	 * @param {string} evaluatorName - The name of the evaluator.
	 * @returns {Promise<string>} The submission date.
	 * @example
	 * await getSubmissionDate("Subject Automation 1", "Evaluator Automation");
	 */
	async getSubmissionDate(subjectName, evaluatorName) {
		return await PwActions.getText(
			this.page,
			this.getResponseSubmissionDate(subjectName, evaluatorName),
		);
	}

	/**
	 * Verifies all survey responses for a subject by a specific evaluator.
	 * Clicks on the evaluator's response and validates both opinion and text questions
	 * against expected values from the JSON file. All verifications run in parallel.
	 *
	 * Supports two data formats:
	 * - Opinion questions: {type: "opinion", value: "2", scale: {...}} — N/A uses expected "N/A"; else `Score: {value} / {scale.stop}` (same as verify loop using getQuestionTextAnswer).
	 * - Text questions: ["text", "answer"] or {type: "text", value: "answer"}
	 *
	 * @param {Object} params - Parameters object
	 * @param {Page} params.page - The Playwright page object (defaults to this.page)
	 * @param {string} params.subjectName - The name of the subject being evaluated
	 * @param {string} params.evaluatorName - The name of the evaluator who provided the response
	 * @returns {Promise<void>}
	 * @throws {Error} If no response data is found for the subject-evaluator combination
	 * @example
	 * await performanceResponsesPage.verifyResponseForSubjectByEvaluator({
	 *   page: page,
	 *   subjectName: "Subject Automation 1",
	 *   evaluatorName: "Evaluator Automation"
	 * });
	 */

	async verifyResponseForSubjectByEvaluator({
		page = this.page,
		subjectName,
		evaluatorName,
	}) {
		await PwActions.waitForElementVisibility(
			page,
			this.getResponseForSubjectByEvaluator(subjectName, evaluatorName),
			70000,
		);
		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);

		const evaluatorData = responseData?.[subjectName]?.[evaluatorName];
		if (!evaluatorData)
			throw new Error(
				`No response data found for ${subjectName} → ${evaluatorName}`,
			);

		await PwActions.click(
			page,
			this.getResponseForSubjectByEvaluator(subjectName, evaluatorName),
		);

		const verificationPromises = Object.entries(evaluatorData).flatMap(
			([sectionName, sectionData]) =>
				Object.entries(sectionData).map(([question, value]) => {
					return (async () => {
						const type = Array.isArray(value) ? value[0] : value?.type;
						const rawAnswer = Array.isArray(value) ? value[1] : value?.value;

						if (!type) return;

						let actualValue;
						if (type === "opinion") {
							const ans = rawAnswer;
							let expectedDisplay;
							if (ans === "N/A") {
								expectedDisplay = "N/A";
							} else {
								const stopValue = value?.scale?.stop;
								expectedDisplay = `Score: ${ans} / ${stopValue}`;
							}
							actualValue = await PwActions.getText(
								page,
								this.getQuestionTextAnswer(sectionName, question),
							);
							await PwActions.verifyTextExpected(actualValue, expectedDisplay);
						} else if (type === "text") {
							actualValue = await PwActions.getText(
								page,
								this.getQuestionTextAnswer(sectionName, question),
							);
							await PwActions.verifyTextExpected(actualValue, rawAnswer);
						}
					})();
				}),
		);
		await Promise.all(verificationPromises);
	}

	/**
	 * Get the language of the responses
	 * @param {Page} page - The page to get the language from.
	 * @returns {Promise<string>} The language of the responses
	 * @example
	 * const language = await getResponsesLanguage(page);
	 * console.log(language);
	 */
	async getResponsesLanguage(page = this.page) {
		await PwActions.waitTillVisible(page, this.webElementResponsesContainer);
		const text = await PwActions.getAllInnerTexts(
			page,
			this.webElementResponsesContainer,
		);
		const language = await this.commonutils.getTextLanguage(text[0]);
		return language;
	}

	/**
	 * Change the language of the responses
	 * @param {string} language - The language to change to
	 * @returns {Promise<void>}
	 * @example
	 * await changeResponsesLanguage("Tamil");
	 */
	async changeResponsesLanguage(language) {
		await PwActions.click(this.page, this.btnChangeLanguage);
		await PwActions.click(this.page, this.btnChooseLanguage(language));
	}

	/**
	 * Get the language of the open feedback responses
	 * @param {Page} page - The page to get the language from.
	 * @returns {Promise<string>} The language of the open feedback responses
	 * @example
	 * const language = await getOpenFeedBackResponsesLanguage(page);
	 * console.log(language);
	 */
	async getOpenFeedBackResponsesLanguage(page = this.page) {
		await PwActions.waitTillVisible(page, this.txtOpenFeedBackResponses);
		const text = await PwActions.getAllInnerTexts(
			page,
			this.txtOpenFeedBackResponses,
		);
		const language = await this.commonutils.getTextLanguage(text[0]);
		return language;
	}

	/**
	 * Download the responses
	 * @param {Page} page - The page to download the responses from.
	 * @returns {Promise<string>} The path to the downloaded responses file.
	 * @example
	 * const filePath = await downloadResponses(page);
	 * console.log(filePath);
	 */
	async downloadResponses(page = this.page) {
		await PwActions.waitForElement(page, this.btnDownloadResponses);
		await CommonUtils.sleep(10);
		await PwActions.click(page, this.btnDownloadResponses);
		const result = await this.commonFunctions.downloadFileAndReturnPath(
			page,
			this.btnDownloadCSV,
		);
		return result.filePath;
	}

	/**
	 * Verify the language of the downloaded responses
	 * @param {string} filePath - The path to the downloaded responses file.
	 * @param {number} totalQuestions - The total number of questions in the survey.
	 * @param {string} language - The language to verify.
	 * @returns {Promise<void>}
	 * @example
	 * await verifyDownloadedResponsesLanguage(filePath, totalQuestions, language);
	 */
	async verifyDownloadedResponsesLanguage(filePath, totalQuestions, language) {
		const data = await this.commonutils.readCSVFile(filePath);
		const headers = Object.keys(data.data[0]);
		const questionHeaders = headers.slice(0, totalQuestions);
		const verificationPromises = questionHeaders.map(async (header, index) => {
			const detectedLanguage = await this.commonutils.getTextLanguage(header);
			expect(
				detectedLanguage.toLowerCase(),
				`Header "${header}" at position ${index + 1} is not in ${language} language. Detected: ${detectedLanguage}`,
			).toBe(language.toLowerCase());
		});
		await Promise.all(verificationPromises);
		logger.info(
			`Verified ${totalQuestions} CSV headers are in ${language} language`,
		);
	}

	/**
	 * Translate the responses to the selected language
	 * @param {Page} page - The page to translate the responses to.
	 * @returns {Promise<void>}
	 * @example
	 * await translateResponsesTo(page);
	 */
	async translateResponsesTo(page = this.page) {
		await PwActions.click(page, this.btnTranslateResponsesTo);
	}

	/**
	 * Verify the language of both headers and data in the downloaded responses CSV
	 * @param {string} filePath - The path to the downloaded responses file.
	 * @param {number} totalQuestions - The total number of questions to verify (from the start).
	 * @param {string} language - The expected language.
	 * @returns {Promise<void>}
	 * @example
	 * await verifyDownloadedResponsesHeadersAndDataLanguage(filePath, 5, 'spanish');
	 */
	async verifyDownloadedResponsesHeadersAndDataLanguage(
		filePath,
		totalQuestions,
		language,
	) {
		const data = await this.commonutils.readCSVFile(filePath);
		const headers = Object.keys(data.data[0]);
		const questionHeaders = headers.slice(0, totalQuestions);
		const expectedLanguage = language.toLowerCase();
		const validateLanguage = async (text, location) => {
			if (Number.isInteger(Number(text.trim()))) {
				return { validated: false, reason: "integer" };
			}
			const detectedLanguage = await this.commonutils.getTextLanguage(text);
			expect(
				detectedLanguage.toLowerCase(),
				`${location}: "${text}" is not in ${language} language. Detected: ${detectedLanguage}`,
			).toBe(expectedLanguage);
			return { validated: true };
		};
		const headerPromises = questionHeaders.map((header, index) =>
			validateLanguage(header, `Header position ${index + 1}`),
		);
		const dataPromises = data.data.flatMap((row, rowIndex) =>
			questionHeaders.map((header, colIndex) => {
				const cellValue = row[header];
				if (cellValue && cellValue.trim() !== "") {
					return validateLanguage(
						cellValue,
						`Row ${rowIndex + 1}, Column ${colIndex + 1} (${header})`,
					);
				}
				return Promise.resolve({ validated: false, reason: "empty" });
			}),
		);
		const allResults = await Promise.all([...headerPromises, ...dataPromises]);
		const validatedCount = allResults.filter((r) => r.validated).length;
		const skippedCount = allResults.length - validatedCount;
		logger.info(
			`Verified ${totalQuestions} CSV columns in ${language} language. Validated: ${validatedCount}, Skipped: ${skippedCount}`,
		);
	}

	/**
	 * Verifies that the response is not submitted for a given subject and evaluator.
	 * @param {Object} params - Parameters object
	 * @param {Page} params.page - The Playwright page object (defaults to this.page)
	 * @param {string} params.subjectName - The name of the subject.
	 * @param {string} params.evaluatorName - The name of the evaluator.
	 * @returns {Promise<void>}
	 * @throws {Error} If the response is submitted for the given subject and evaluator.
	 * @example
	 * await performanceResponsesPage.verifyResponseNotSubmitted({
	 *   page: page,
	 *   subjectName: "Subject Automation 1",
	 *   evaluatorName: "Evaluator Automation"
	 * });
	 */
	async verifyResponseNotSubmitted({
		page = this.page,
		subjectName,
		evaluatorName,
	}) {
		await PwActions.waitForElement(
			page,
			this.getResponseForSubjectByEvaluator(subjectName, evaluatorName),
			15000,
		);
		const isElementVisible = await PwActions.elementIsVisible(
			page,
			this.getResponseForSubjectByEvaluator(subjectName, evaluatorName),
		);
		expect(isElementVisible, "Response is submitted").toBe(false);
	}

	/**
	 * Verify the response for a particular question
	 * @param {Object} params - Parameters object
	 * @param {Page} params.page - The Playwright page object (defaults to this.page)
	 * @param {string} params.subjectName - The name of the subject.
	 * @param {string} params.evaluatorName - The name of the evaluator.
	 * @param {string} params.questionName - The name of the question.
	 * @param {string} params.expectedValue - The expected value of the question.
	 * @returns {Promise<void>}
	 * @example
	 * await performanceResponsesPage.verifyResponseForAnParticularQuestion({
	 *   page: page,
	 *   subjectName: "Subject Automation 1",
	 *   evaluatorName: "Evaluator Automation",
	 *   questionName: "Question 1",
	 *   expectedValue: "Expected Value"
	 * });
	 * This will verify the response for the question "Question 1" for the subject "Subject Automation 1" and evaluator "Evaluator Automation" and the expected value is "Expected Value"
	 */
	async verifyResponseForAnParticularQuestion({
		page = this.page,
		subjectName,
		evaluatorName,
		sectionName,
		questionName,
		expectedValue,
	}) {
		await PwActions.waitForElementVisibility(
			page,
			this.getResponseForSubjectByEvaluator(subjectName, evaluatorName),
			15000,
		);
		await PwActions.click(
			page,
			this.getResponseForSubjectByEvaluator(subjectName, evaluatorName),
		);
		try {
			const actualValue = await PwActions.getText(
				page,
				this.getQuestionAnswer(sectionName, questionName),
			);
			await PwActions.verifyTextExpected(actualValue, expectedValue);
		} catch (error) {
			const actualValue = await PwActions.getText(
				page,
				this.getQuestionTextAnswer(sectionName, questionName),
			);
			await PwActions.verifyTextExpected(actualValue, expectedValue);
		}
	}
}
export { PerformanceResponsesPage };

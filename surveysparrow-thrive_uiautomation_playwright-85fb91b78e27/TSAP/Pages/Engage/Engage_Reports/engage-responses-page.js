import path from "path";
import { fileURLToPath } from "url";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { EngageManagerView } from "./engage-manager-view.js";
import { ReportsHeader } from "../../Performance/Performance_Reports/reports-header-page.js";
import logger from "playwright-framework/Core/logger.js";
import { expect } from "@playwright/test";

const QUESTION_TYPES = {
	RATING_SCALE: "Rating Scale",
	ENPS: "recommend",
	YES_NO: "Yes/No",
	MULTI_CHOICE: "MultiChoice",
	TEXT_INPUT: "Text Input",
};

class EngageResponsesPage {
	constructor(page) {
		this.page = page;
		this.reportsHeaderPage = new ReportsHeader(page);
		this.getAllParticipantsName =
			"//table//tbody//tr//td//p[@data-state='closed']";
		this.getAllParticipantsNameByQuestion =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ihrOJZz-css']//p[contains(@class,'twigs-c-kbyIfK twigs-c-kbyIfK-hzzdKO-size-md twigs-c-kbyIfK-ffbv-weight-bold twigs-c-kbyIfK-iiLxjww-css')]";
	}
	/**
	 * Returns all participant names displayed in the Engage Responses table for the specified report section.
	 *
	 * @param {"By Respondent" | "By Question"} section - The report section to extract participant names from.
	 *        Use "By Respondent" to get names from the respondent-based view,
	 *        or "By Question" to get names from the question-based view.
	 * @returns {Promise<string[]>} Resolves to an array of participant names as shown in the UI.
	 *
	 *
	 * @throws {Error} If an unknown section is provided.
	 *
	 * @example
	 * // Get participant names from the "By Respondent" section
	 * const names = await engageResponsesPage.getAllParticipantNamesFromTable("By Respondent");
	 * Returns: names = ["Participant 1", "Participant 2", "Participant 3"];
	 *
	 * // Get participant names from the "By Question" section
	 * const namesByQuestion = await engageResponsesPage.getAllParticipantNamesFromTable("By Question");
	 * Returns: namesByQuestion = ["Participant 1", "Participant 2", "Participant 3"];
	 *
	 */
	async getAllParticipantNamesFromTable(section) {
		let participantNames;

		if (section == "By Respondent") {
			await PwActions.waitTillVisible(this.page, this.getAllParticipantsName);

			const participantElements = await PwActions.getWebElementsPage(
				this.page,
				this.getAllParticipantsName,
			);

			participantNames = await PwActions.getElementsText(
				this.page,
				participantElements,
			);
		} else if (section == "By Question") {
			await this.reportsHeaderPage.navigateHeaderReportSection("By Question");
			await PwActions.waitTillVisible(
				this.page,
				this.getAllParticipantsNameByQuestion,
			);

			const participantElements = await PwActions.getWebElementsPage(
				this.page,
				this.getAllParticipantsNameByQuestion,
			);

			participantNames = await PwActions.getElementsText(
				this.page,
				participantElements,
			);
		} else {
			throw new Error(
				"Unknown section. Please use 'By Respondent' or 'By Question'.",
			);
		}

		return participantNames;
	}
}

/**
 * EngagePulseManagerResponsesPage class handles the responses view in the Engage Pulse Manager interface
 * This class provides functionality to:
 * - View and analyze different types of survey responses
 * - Verify response data against UI elements
 * - Download and verify response data
 */
class EngagePulseManagerResponsesPage {
	/**
	 * Constructor for EngagePulseManagerResponsesPage
	 * Initializes page elements and utility classes
	 * @param {Page} page - Playwright page object
	 */
	constructor(page) {
		this.page = page;
		this.commonutils = new CommonUtils();
		this.commonfunction = new CommonPageFunctions(this.page);
		this.engageManagerView = new EngageManagerView(this.page);
		this.btnByRespondent = "//button[contains(text(), 'By Respondent')]";
		this.btnByQuestion = "//button[contains(text(), 'By Question')]";
		this.btnDownloadCsv =
			"//*[name()='svg']/*[name()='path' and @d='M16 22.6667V4']/ancestor::button";

		this.txtEnpsScaleSection =
			"//tr//p[text()='How likely are you to recommend our comp...']";

		this.txtScoreResponseElements = "//p[contains(text(), 'Score')]//span";
		this.txtYesNoResponseElements = "//p[contains(text(),'Response')]//span";
		this.txtMultiChoiceResponseElements =
			"//p[contains(text(),'Choice')]//span";

		this.getTextInputResponseLocator = (text) => `//*[text()='${text}']`;

		this.subjectNameElements = "//p[contains(text(), 'Subject Automation')]";
		this.subjectName = (subjectName) => `//p[text() =  '${subjectName}']`;
		this.subjectSelectionLocator = (subjectName) =>
			`//table//p[text()='${subjectName}']`;
		this.sectionNameLocator = (sectionName) =>
			`//div//p[text()='${sectionName}']`;
		this.questionLocator = (questionName) =>
			`//div//p[text()='${questionName}']`;

		// Dynamic response locators for different question types
		this.getResponseLocator = (questionType, expectedValue) => {
			if (questionType.includes("Rating Scale")) {
				return `//div//p[text() = '${questionType}']/following-sibling::div//p[starts-with(normalize-space(), 'Score:')]`;
			} else if (questionType.includes("recommend")) {
				return `//div//p[text() = '${questionType}']/following-sibling::div//p[starts-with(normalize-space(), 'Score:')]`;
			} else if (questionType === "Text Input") {
				return `//div//p[text() = '${questionType}']/following-sibling::div//p[text()='${expectedValue}']`;
			} else if (questionType === "Yes/No") {
				return `//div//p[text() = '${questionType}']/following-sibling::div//p[starts-with(normalize-space(), 'Response:')]`;
			} else if (questionType === "MultiChoice") {
				return `//div//p[text() = '${questionType}']/following-sibling::div//p[starts-with(normalize-space(), 'Choice:')]`;
			} else {
				return `//div//p[text() = '${questionType}']/following-sibling::div//p[text()='${expectedValue}']`;
			}
		};

		this.subjectNameInReportLocator = (subjectName) =>
			`//div//h1[text()='${subjectName}']`;

		this.anonymousSubjectNameLocator =
			"//table//tbody//tr//td//p[@data-state='closed']";
		this.anonymousSubjectNameInReportLocator = (anonymousName) =>
			`//table//tbody//tr//td//p[@data-state='closed' and text()='${anonymousName}']`;
	}

	/**
	 * Get question locator based on question name
	 * @param {string} questionName - The question name
	 * @returns {string} XPath locator for the question
	 */
	getQuestionLocator(questionName) {
		if (this.isQuestionType(questionName, QUESTION_TYPES.ENPS)) {
			return this.txtEnpsScaleSection;
		}
		return `//tr//p[text()='${questionName}']`;
	}

	/**
	 * Check if question is of a specific type
	 * @param {string} questionName - The question name
	 * @param {string} questionType - The question type to check
	 * @returns {boolean} True if question matches the type
	 */
	isQuestionType(questionName, questionType) {
		if (
			questionType === QUESTION_TYPES.ENPS ||
			questionType === QUESTION_TYPES.RATING_SCALE
		) {
			return questionName.includes(questionType);
		}
		return questionName === questionType;
	}

	/**
	 * Check if question is a score-based question (Rating Scale or eNPS)
	 * @param {string} questionName - The question name
	 * @returns {boolean} True if question is score-based
	 */
	isScoreQuestion(questionName) {
		return (
			this.isQuestionType(questionName, QUESTION_TYPES.RATING_SCALE) ||
			this.isQuestionType(questionName, QUESTION_TYPES.ENPS)
		);
	}

	/**
	 * Check if question is a choice-based question (Yes/No or MultiChoice)
	 * @param {string} questionName - The question name
	 * @returns {boolean} True if question is choice-based
	 */
	isChoiceQuestion(questionName) {
		return (
			this.isQuestionType(questionName, QUESTION_TYPES.YES_NO) ||
			this.isQuestionType(questionName, QUESTION_TYPES.MULTI_CHOICE)
		);
	}

	/**
	 * Get response elements locator based on question type
	 * @param {string} questionName - The question name
	 * @returns {string} XPath locator for response elements
	 */
	getResponseElementsLocator(questionName) {
		if (this.isScoreQuestion(questionName)) {
			return this.txtScoreResponseElements;
		} else if (this.isQuestionType(questionName, QUESTION_TYPES.YES_NO)) {
			return this.txtYesNoResponseElements;
		} else if (this.isQuestionType(questionName, QUESTION_TYPES.MULTI_CHOICE)) {
			return this.txtMultiChoiceResponseElements;
		}
		return this.txtScoreResponseElements;
	}

	/**
	 * Get all question names from response data
	 * @param {Object} responseData - Response data object
	 * @returns {Promise<Array>} Array of question names
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const questionNames = await responsesPage.getAllQuestionNamesFromResponseData(responseData);
	 * console.log("Question names:", questionNames);
	 */
	async getAllQuestionNamesFromResponseData(responseData) {
		const questionNames = new Set();

		const firstParticipant = Object.values(responseData.Subject)[0];
		const firstSection = Object.values(firstParticipant)[0];

		for (const questionName in firstSection) {
			questionNames.add(questionName);
		}

		const questionNamesArray = Array.from(questionNames);
		logger.info(
			`Found questions from response data: ${questionNamesArray.join(", ")}`,
		);
		return questionNamesArray;
	}

	/**
	 * Extract responses for a specific question from response data
	 * @param {string} questionName - The question name
	 * @param {Object} responseData - Response data
	 * @returns {Promise<Object>} Responses for the question
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const responses = await responsesPage.extractQuestionResponses(questionName, responseData);
	 * console.log("Responses:", responses);
	 */
	async extractQuestionResponses(questionName, responseData) {
		logger.info(`Extracting responses for question: ${questionName}`);

		const responses = [];

		for (const participant in responseData.Subject) {
			const data = responseData.Subject[participant];
			for (const section in data) {
				const sectionData = data[section];
				if (sectionData[questionName]) {
					let responseValue = null;

					if (this.isQuestionType(questionName, QUESTION_TYPES.RATING_SCALE)) {
						if (sectionData[questionName].value) {
							responseValue = sectionData[questionName].value;
						} else if (
							Array.isArray(sectionData[questionName]) &&
							sectionData[questionName][1]
						) {
							responseValue = sectionData[questionName][1];
						}
					} else if (this.isQuestionType(questionName, QUESTION_TYPES.ENPS)) {
						if (
							Array.isArray(sectionData[questionName]) &&
							sectionData[questionName][1]
						) {
							responseValue = sectionData[questionName][1];
						}
					} else if (this.isQuestionType(questionName, QUESTION_TYPES.YES_NO)) {
						if (
							Array.isArray(sectionData[questionName]) &&
							sectionData[questionName][1]
						) {
							responseValue = sectionData[questionName][1];
						}
					} else if (
						this.isQuestionType(questionName, QUESTION_TYPES.MULTI_CHOICE)
					) {
						if (
							Array.isArray(sectionData[questionName]) &&
							sectionData[questionName][1]
						) {
							responseValue = sectionData[questionName][1];
						}
					} else if (
						this.isQuestionType(questionName, QUESTION_TYPES.TEXT_INPUT)
					) {
						if (
							Array.isArray(sectionData[questionName]) &&
							sectionData[questionName][1]
						) {
							responseValue = sectionData[questionName][1];
						}
					}

					if (responseValue !== null) {
						responses.push({
							participant,
							response: responseValue,
						});
					}
					break;
				}
			}
		}

		logger.info(
			`Extracted ${responses.length} responses for ${questionName}: ${responses.map((r) => r.response).join(", ")}`,
		);
		return { responses };
	}

	/**
	 * Get UI responses for a specific question
	 * @param {string} questionName - The question name
	 * @returns {Promise<Object>} UI responses for the question
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const uiResponses = await responsesPage.getUIResponsesForQuestion(questionName);
	 * console.log("UI responses:", uiResponses);
	 */
	async getUIResponsesForQuestion(questionName) {
		logger.info(`Getting UI responses for question: ${questionName}`);

		const questionLocator = this.getQuestionLocator(questionName);
		await PwActions.click(this.page, questionLocator);
		await CommonUtils.sleep(2);

		const responseElementsLocator =
			this.getResponseElementsLocator(questionName);
		const responseElements = await this.page
			.locator(responseElementsLocator)
			.allInnerTexts();

		if (this.isScoreQuestion(questionName)) {
			const numericScores = responseElements
				.map((score) => Number.parseFloat(score))
				.filter((score) => !Number.isNaN(score));
			logger.info(`UI scores for ${questionName}: ${numericScores.join(", ")}`);
			return { responses: numericScores };
		} else if (this.isChoiceQuestion(questionName)) {
			logger.info(
				`UI responses for ${questionName}: ${responseElements.join(", ")}`,
			);
			return { responses: responseElements };
		} else if (this.isQuestionType(questionName, QUESTION_TYPES.TEXT_INPUT)) {
			logger.info(
				`UI Text Input responses for ${questionName}: Will be verified individually`,
			);
			return { responses: [] };
		}

		return { responses: responseElements };
	}

	/**
	 * Verify that UI responses match the expected responses from data
	 * @param {string} questionName - The question name
	 * @param {Object} expectedResponses - Expected responses from data
	 * @param {Object} uiResponses - UI responses
	 * @param {boolean} isAnonymous - Whether the survey is anonymous
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * await responsesPage.verifyQuestionResponses(questionName, expectedResponses, uiResponses, isAnonymous);
	 */
	async verifyQuestionResponses(
		questionName,
		expectedResponses,
		uiResponses,
		isAnonymous = false,
	) {
		logger.info(
			`Verifying responses for question: ${questionName} (Anonymous: ${isAnonymous})`,
		);

		if (isAnonymous) {
			await this.verifyAnonymousQuestionResponses(
				questionName,
				expectedResponses,
			);
		} else {
			await this.verifyNonAnonymousQuestionResponses(
				questionName,
				expectedResponses,
				uiResponses,
			);
		}
	}

	/**
	 * Verify responses for anonymous surveys - just check if responses exist in UI
	 * @param {string} questionName - The question name
	 * @param {Object} expectedResponses - Expected responses from data
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * await responsesPage.verifyAnonymousQuestionResponses(questionName, expectedResponses);
	 */
	async verifyAnonymousQuestionResponses(questionName, expectedResponses) {
		logger.info(`Verifying anonymous responses for question: ${questionName}`);

		const expectedValues = expectedResponses.responses.map((r) => r.response);
		logger.info(
			`Expected responses to exist in UI: ${expectedValues.join(", ")}`,
		);

		if (this.isQuestionType(questionName, QUESTION_TYPES.TEXT_INPUT)) {
			logger.info(`Verifying Text Input responses individually...`);
			for (const expectedText of expectedValues) {
				const textLocator = `//*[text()='${expectedText}']`;
				const textExists = await PwActions.elementIsVisible(
					this.page,
					textLocator,
				);
				expect(
					textExists,
					`Text Input "${expectedText}" should exist in UI`,
				).toBe(true);
				logger.info(`✅ Text Input "${expectedText}" found in UI`);
			}
			logger.info(`✅ All Text Input responses verified successfully`);
			return;
		}

		let uiResponseElements = [];

		if (this.isQuestionType(questionName, QUESTION_TYPES.ENPS)) {
			await PwActions.click(this.page, this.txtEnpsScaleSection);
			await CommonUtils.sleep(2);
		}

		const responseElementsLocator =
			this.getResponseElementsLocator(questionName);
		uiResponseElements = await this.page
			.locator(responseElementsLocator)
			.allInnerTexts();

		logger.info(`UI responses found: ${uiResponseElements.join(", ")}`);

		for (const expectedValue of expectedValues) {
			const responseExists = uiResponseElements.includes(String(expectedValue));
			expect(
				responseExists,
				`Response "${expectedValue}" should exist in UI for anonymous survey`,
			).toBe(true);
			logger.info(`✅ Response "${expectedValue}" found in UI`);
		}

		logger.info(`✅ All expected responses found in UI for anonymous survey`);
	}

	/**
	 * Verify responses for non-anonymous surveys - verify each participant's specific response
	 * @param {string} questionName - The question name
	 * @param {Object} expectedResponses - Expected responses from data with participant info
	 * @param {Object} uiResponses - UI responses
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * await responsesPage.verifyNonAnonymousQuestionResponses(questionName, expectedResponses, uiResponses);
	 */
	async verifyNonAnonymousQuestionResponses(
		questionName,
		expectedResponses,
		uiResponses,
	) {
		logger.info(
			`Verifying non-anonymous responses for question: ${questionName}`,
		);

		const expectedValues = expectedResponses.responses.map((r) => r.response);
		const uiValues = uiResponses.responses;

		logger.info(`Expected responses: ${expectedValues.join(", ")}`);
		logger.info(`UI responses: ${uiValues.join(", ")}`);

		if (this.isQuestionType(questionName, QUESTION_TYPES.TEXT_INPUT)) {
			logger.info(`Verifying Text Input responses individually...`);
			for (const expectedText of expectedValues) {
				const textLocator = `//*[text()='${expectedText}']`;
				const textExists = await PwActions.elementIsVisible(
					this.page,
					textLocator,
				);
				expect(
					textExists,
					`Text Input "${expectedText}" should exist in UI`,
				).toBe(true);
				logger.info(`✅ Text Input "${expectedText}" found in UI`);
			}
			logger.info(`✅ All Text Input responses verified successfully`);
			return;
		}

		expect(
			expectedValues.length,
			`Response count should match for ${questionName}`,
		).toBe(uiValues.length);

		const sortedExpected = [...expectedValues].sort();
		const sortedUI = [...uiValues].sort();

		for (let i = 0; i < sortedExpected.length; i++) {
			expect(
				String(sortedExpected[i]),
				`Response at index ${i} should match for ${questionName}`,
			).toBe(String(sortedUI[i]));
		}

		logger.info(`✅ ${questionName}: All participant responses match!`);
	}

	/**
	 * Verifies subject names and their scores in the UI
	 * @param {Object} subjectData - Subject data from response
	 * @param {string} questionType - Type of question (e.g., "Rating Scale", "eNPS")
	 * @param {string} scoreLocator - XPath for score elements
	 * @param {boolean} isAnonymous - Whether the survey is anonymous (default: false)
	 * @returns {Promise<Object>} Verification results
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * await responsesPage.verifySubjectNamesAndScores(subjectData, questionType, scoreLocator, isAnonymous);
	 */

	async verifySubjectNamesAndScores(
		subjectData,
		questionType,
		scoreLocator,
		isAnonymous = false,
	) {
		const verificationResults = [];

		if (isAnonymous) {
			logger.info(`Verifying anonymity for ${questionType} section`);
			await this.verifyAnonymity(Object.keys(subjectData));
			return {
				questionType,
				results: [],
				summary: {
					totalSubjects: Object.keys(subjectData).length,
					subjectsFound: 0,
					scoresMatch: 0,
					subjectsWithErrors: 0,
					anonymityVerified: true,
				},
			};
		}

		const uiSubjects = await this.getAllSubjectNamesFromUI();
		const uiScores = await this.page.locator(scoreLocator).allInnerTexts();

		const uiSubjectScoreMap = {};
		for (let i = 0; i < uiSubjects.length && i < uiScores.length; i++) {
			uiSubjectScoreMap[uiSubjects[i]] = uiScores[i];
		}

		for (const [subjectName, participantData] of Object.entries(subjectData)) {
			try {
				const subjectNameLocator = this.subjectName(subjectName);
				const subjectExists = await PwActions.elementIsVisible(
					this.page,
					subjectNameLocator,
				);

				expect(
					subjectExists,
					`Subject name "${subjectName}" should exist in UI`,
				).toBe(true);

				let expectedScore = null;
				for (const sectionData of Object.values(participantData)) {
					if (sectionData[questionType]) {
						expectedScore = sectionData[questionType][1];
						break;
					}
				}

				expect(
					expectedScore,
					`Expected ${questionType} score should exist for subject "${subjectName}" in response data`,
				).not.toBeNull();

				const uiScore = uiSubjectScoreMap[subjectName];

				expect(
					uiScore,
					`UI score should exist for subject "${subjectName}" in the interface`,
				).toBeDefined();

				const uiScoreNumber = Number.parseFloat(uiScore);
				const expectedScoreNumber = Number.parseFloat(expectedScore);
				expect(
					Math.abs(uiScoreNumber - expectedScoreNumber),
					`Score should match for subject "${subjectName}": UI Score (${uiScore}) should match Expected Score (${expectedScore})`,
				).toBeLessThan(0.1);

				logger.info(
					`Subject ${subjectName}: UI Score (${uiScore}) matches Expected Score (${expectedScore})`,
				);

				verificationResults.push({
					subjectName,
					exists: true,
					expectedScore: expectedScore,
					uiScore: uiScore,
					scoreMatch: true, // Assuming scoreMatch is true for now, will be updated in verifyAllQuestionResponses
				});
			} catch (error) {
				logger.error(
					`Error verifying subject ${subjectName}: ${error.message}`,
				);
				verificationResults.push({
					subjectName,
					exists: false,
					expectedScore: null,
					uiScore: null,
					error: error.message,
				});
			}
		}

		return {
			questionType,
			results: verificationResults,
			summary: {
				totalSubjects: verificationResults.length,
				subjectsFound: verificationResults.filter((r) => r.exists).length,
				scoresMatch: verificationResults.filter((r) => r.scoreMatch).length,
				subjectsWithErrors: verificationResults.filter((r) => r.error).length,
			},
		};
	}

	/**
	 * Performs comprehensive verification of all response sections using simple response comparison
	 * @param {Object} options - Configuration options
	 * @param {boolean} options.isAnonymous - Whether the survey is anonymous (default: false)
	 * @returns {Object} Verification results for all sections
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * await responsesPage.verifyAllQuestionResponses(options);
	 */

	async verifyAllQuestionResponses(options = {}) {
		const {
			viewType = this.btnByQuestion,
			delay = 5,
			isAnonymous = false,
		} = options;

		await CommonUtils.sleep(delay);
		await PwActions.click(this.page, viewType);
		await CommonUtils.sleep(delay);

		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);

		const questionNames =
			await this.getAllQuestionNamesFromResponseData(responseData);
		logger.info(
			`Starting verification for ${questionNames.length} questions: ${questionNames.join(", ")}`,
		);

		const verificationResults = {};

		for (const questionName of questionNames) {
			try {
				logger.info(`\n=== Processing question: ${questionName} ===`);
				await CommonUtils.sleep(delay);
				await PwActions.waitForNetworkIdle(this.page, 10000);
				const expectedResponses = await this.extractQuestionResponses(
					questionName,
					responseData,
				);
				const uiResponses = await this.getUIResponsesForQuestion(questionName);
				await this.verifyQuestionResponses(
					questionName,
					expectedResponses,
					uiResponses,
					isAnonymous,
				);
				verificationResults[questionName] = {
					expectedResponses,
					uiResponses,
					verified: true,
				};

				logger.info(`✅ ${questionName}: Verification completed successfully`);
			} catch (error) {
				logger.error(
					`❌ ${questionName}: Verification failed - ${error.message}`,
				);
				verificationResults[questionName] = {
					verified: false,
					error: error.message,
				};
			}
		}

		const successfulVerifications = Object.values(verificationResults).filter(
			(r) => r.verified,
		).length;
		const totalQuestions = questionNames.length;

		logger.info(`\n=== Verification Summary ===`);
		logger.info(`Total questions: ${totalQuestions}`);
		logger.info(`Successful verifications: ${successfulVerifications}`);
		logger.info(
			`Failed verifications: ${totalQuestions - successfulVerifications}`,
		);

		if (successfulVerifications === totalQuestions) {
			logger.info("🎉 All question verifications passed successfully!");
		} else {
			const failedCount = totalQuestions - successfulVerifications;
			logger.error(`❌ ${failedCount} question(s) failed verification`);
			expect(successfulVerifications).toBe(
				totalQuestions,
				`${failedCount} question(s) failed verification. Expected all ${totalQuestions} questions to pass.`,
			);
		}

		return {
			questionNames,
			verificationResults,
			summary: {
				totalQuestions,
				successfulVerifications,
				failedVerifications: totalQuestions - successfulVerifications,
				allPassed: successfulVerifications === totalQuestions,
			},
		};
	}

	/**
	 * Gets all subject names from the UI in their current order
	 * @param {boolean} isAnonymous - Whether the survey is anonymous (default: false)
	 * @returns {Promise<string[]>} Array of subject names as they appear in UI
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const subjectNames = await responsesPage.getAllSubjectNamesFromUI(isAnonymous);
	 * console.log("Subject names:", subjectNames);
	 */

	async getAllSubjectNamesFromUI(isAnonymous = false) {
		try {
			if (isAnonymous) {
				logger.info(
					"Checking for subject names in anonymous survey - should be empty",
				);
				const subjectNameElements = await this.page
					.locator("//p[contains(text(), 'Subject Automation')]")
					.all();

				expect(
					subjectNameElements.length,
					`ANONYMITY VIOLATION: Subject names should not be visible in anonymous survey`,
				).toBe(0);

				logger.info(
					"✅ No subject names found in anonymous survey - anonymity maintained",
				);
				return [];
			}

			const subjectNameElements = await this.page
				.locator(this.subjectNameElements)
				.all();
			const subjectNames = [];

			for (const element of subjectNameElements) {
				const text = await element.textContent();
				if (text && text.trim()) {
					subjectNames.push(text.trim());
				}
			}

			logger.info(
				`Found ${subjectNames.length} subjects in UI: ${subjectNames.join(", ")}`,
			);
			return subjectNames;
		} catch (error) {
			logger.error(`Error getting subject names from UI: ${error.message}`);
			return [];
		}
	}

	/**
	 * Verifies individual subject reports by selecting subjects and validating their responses
	 * @param {boolean} isAnonymous - Whether the survey is anonymous (default: false)
	 * @returns {Promise<Object>} Verification results for all subjects
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const verificationResults = await responsesPage.verifyIndividualSubjectReports(isAnonymous);
	 * console.log("Verification results:", verificationResults);
	 */

	async verifyIndividualSubjectReports(isAnonymous = false) {
		logger.info(
			`Starting individual subject verification... (Anonymous: ${isAnonymous})`,
		);

		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);

		await PwActions.click(this.page, this.btnByRespondent);
		await CommonUtils.sleep(3);

		const verificationResults = [];

		const subjects = Object.keys(responseData.Subject);
		logger.info(
			`Found ${subjects.length} subjects to verify: ${subjects.join(", ")}`,
		);

		if (isAnonymous) {
			logger.info("Verifying anonymity: Subject names should NOT be visible");
			await this.verifyAnonymity(subjects);

			logger.info("Verifying anonymous subjects and their responses");
			const anonymousVerification =
				await this.verifyAnonynimityAndSubjectResponses(responseData);

			const { filePath } = await this.commonfunction.downloadFileAndReturnPath(
				this.page,
				this.btnDownloadCsv,
			);
			await this.commonfunction.verifyDownloadedCSV(filePath);

			return {
				verificationResults: [],
				summary: {
					totalSubjects: subjects.length,
					subjectsFound: 0,
					totalQuestions: 0,
					questionsWithMatchingResponses: 0,
					anonymityVerified: true,
					anonymousSubjectsVerified: anonymousVerification.verified,
					anonymousSubjectsCount: anonymousVerification.count,
					message:
						"Individual report verification completed for anonymous survey",
				},
			};
		}

		for (const subjectName of subjects) {
			try {
				logger.info(`Verifying individual report for: ${subjectName}`);

				const subjectSelector = this.subjectSelectionLocator(subjectName);
				await PwActions.click(this.page, subjectSelector);
				await CommonUtils.sleep(2);

				const subjectExists = await PwActions.elementIsVisible(
					this.page,
					this.subjectNameInReportLocator(subjectName),
				);
				expect(
					subjectExists,
					`CRITICAL FAILURE: Subject name "${subjectName}" should exist in individual report. This indicates a serious UI/data mismatch issue.`,
				).toBe(true);

				const subjectData = responseData.Subject[subjectName];
				const sectionResults = [];

				for (const [sectionId, sectionData] of Object.entries(subjectData)) {
					try {
						const sectionExists = await PwActions.elementIsVisible(
							this.page,
							this.sectionNameLocator(sectionId),
						);
						expect(
							sectionExists,
							`Section "${sectionId}" should exist for subject ${subjectName}`,
						).toBe(true);

						const questionResults = [];
						for (const [questionName, questionData] of Object.entries(
							sectionData,
						)) {
							try {
								const questionExists = await PwActions.elementIsVisible(
									this.page,
									this.questionLocator(questionName),
								);
								expect(
									questionExists,
									`Question "${questionName}" should exist in UI`,
								).toBe(true);

								let expectedResponse = null;

								if (questionName.includes(QUESTION_TYPES.RATING_SCALE)) {
									if (questionData.value) {
										expectedResponse = questionData.value;
									} else if (Array.isArray(questionData) && questionData[1]) {
										expectedResponse = questionData[1];
									}
								} else if (questionName.includes(QUESTION_TYPES.ENPS)) {
									if (Array.isArray(questionData) && questionData[1]) {
										expectedResponse = questionData[1];
									}
								} else if (questionName === QUESTION_TYPES.YES_NO) {
									if (Array.isArray(questionData) && questionData[1]) {
										expectedResponse = questionData[1];
									}
								} else if (questionName === QUESTION_TYPES.MULTI_CHOICE) {
									if (Array.isArray(questionData) && questionData[1]) {
										expectedResponse = questionData[1];
									}
								} else if (questionName === QUESTION_TYPES.TEXT_INPUT) {
									if (Array.isArray(questionData) && questionData[1]) {
										expectedResponse = questionData[1];
									}
								}

								if (expectedResponse === null) {
									logger.error(
										`Could not extract expected response for question: ${questionName}`,
									);
									questionResults.push({
										questionName,
										questionFound: true,
										responseMatch: false,
										expectedResponse: null,
										uiResponse: null,
										error: "Could not extract expected response from data",
									});
									continue;
								}

								const responseLocator = this.getResponseLocator(
									questionName,
									expectedResponse,
								);

								const responseExists = await PwActions.elementIsVisible(
									this.page,
									responseLocator,
								);
								if (!responseExists) {
									logger.error(
										`Response not found for question: ${questionName}`,
									);
									questionResults.push({
										questionName,
										questionFound: true,
										responseMatch: false,
										expectedResponse,
										uiResponse: null,
										error: "Response not found in UI",
									});
									continue;
								}

								const uiResponse = await PwActions.getText(
									this.page,
									responseLocator,
								);

								const actualResponse = this.extractResponseValue(
									questionName,
									uiResponse,
								);

								const responseMatch =
									String(actualResponse) === String(expectedResponse);

								expect(
									responseMatch,
									`Subject ${subjectName} - ${questionName}: UI Response (${actualResponse}) should match Expected (${expectedResponse})`,
								).toBe(true);

								logger.info(
									`✅ Subject ${subjectName} - ${questionName}: UI Response (${actualResponse}) matches Expected (${expectedResponse})`,
								);

								questionResults.push({
									questionName,
									questionFound: true,
									responseMatch,
									expectedResponse,
									uiResponse: actualResponse,
									rawUIResponse: uiResponse,
								});
							} catch (error) {
								logger.error(
									`Error verifying question ${questionName} for subject ${subjectName}: ${error.message}`,
								);
								questionResults.push({
									questionName,
									questionFound: false,
									responseMatch: false,
									error: error.message,
								});
							}
						}

						sectionResults.push({
							sectionId,
							sectionFound: true,
							questions: questionResults,
						});
					} catch (error) {
						logger.error(
							`Error verifying section ${sectionId} for subject ${subjectName}: ${error.message}`,
						);
						sectionResults.push({
							sectionId,
							sectionFound: false,
							questions: [],
							error: error.message,
						});
					}
				}

				verificationResults.push({
					subjectName,
					subjectFound: true,
					sections: sectionResults,
				});
			} catch (error) {
				logger.error(
					`Error verifying individual report for subject ${subjectName}: ${error.message}`,
				);
				verificationResults.push({
					subjectName,
					subjectFound: false,
					sections: [],
					error: error.message,
				});
			}
		}

		const { filePath } = await this.commonfunction.downloadFileAndReturnPath(
			this.page,
			this.btnDownloadCsv,
		);
		await this.commonfunction.verifyDownloadedCSV(filePath);

		const summary = {
			totalSubjects: verificationResults.length,
			subjectsFound: verificationResults.filter((r) => r.subjectFound).length,
			totalQuestions: verificationResults.reduce(
				(sum, r) =>
					sum + r.sections.reduce((sSum, s) => sSum + s.questions.length, 0),
				0,
			),
			questionsWithMatchingResponses: verificationResults.reduce(
				(sum, r) =>
					sum +
					r.sections.reduce(
						(sSum, s) =>
							sSum + s.questions.filter((q) => q.responseMatch).length,
						0,
					),
				0,
			),
		};

		logger.info(
			`Individual subject verification summary: ${summary.subjectsFound}/${summary.totalSubjects} subjects found, ${summary.questionsWithMatchingResponses}/${summary.totalQuestions} responses match`,
		);

		logger.info("Individual subject verification completed successfully!");
		return {
			verificationResults,
			summary,
		};
	}

	/**
	 * Verifies that subject names are NOT visible in anonymous surveys
	 * @param {string[]} subjectNames - Array of subject names to check
	 * @returns {Promise<void>}
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * await responsesPage.verifyAnonymity(subjectNames);
	 */

	async verifyAnonymity(subjectNames) {
		logger.info("Starting anonymity verification...");

		for (const subjectName of subjectNames) {
			try {
				const subjectSelector = this.subjectSelectionLocator(subjectName);
				const subjectExists = await PwActions.elementIsVisible(
					this.page,
					subjectSelector,
				);

				expect(
					subjectExists,
					`ANONYMITY VIOLATION: Subject name "${subjectName}" should not be visible in anonymous survey`,
				).toBe(false);
				logger.info(
					`✅ Subject name "${subjectName}" correctly hidden in anonymous survey`,
				);

				const subjectInReport = this.subjectNameInReportLocator(subjectName);
				const subjectInReportExists = await PwActions.elementIsVisible(
					this.page,
					subjectInReport,
				);

				expect(
					subjectInReportExists,
					`ANONYMITY VIOLATION: Subject name "${subjectName}" should not appear in individual report header`,
				).toBe(false);
				logger.info(
					`✅ Subject name "${subjectName}" correctly hidden in individual report header`,
				);
			} catch (error) {
				logger.error(
					`Error verifying anonymity for subject ${subjectName}: ${error.message}`,
				);
				throw error;
			}
		}

		logger.info(
			"✅ Anonymity verification completed successfully - All subject names are properly hidden",
		);
	}

	/**
	 * Verifies anonymous subjects and their responses in anonymous surveys
	 * @param {Object} responseData - Response data from JSON file
	 * @returns {Promise<Object>} Verification results for anonymous subjects
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const verificationResults = await responsesPage.verifyAnonynimityAndSubjectResponses(responseData);
	 * console.log("Verification results:", verificationResults);
	 */

	async verifyAnonynimityAndSubjectResponses(responseData) {
		logger.info("Starting anonymous subjects verification...");

		try {
			const anonymousSubjectElements = await this.page
				.locator(this.anonymousSubjectNameLocator)
				.all();

			expect(
				anonymousSubjectElements.length,
				"Anonymous subjects should exist in UI",
			).toBeGreaterThan(0);

			logger.info(
				`Found ${anonymousSubjectElements.length} anonymous subjects in UI`,
			);

			const anonymousSubjectNames = [];
			for (const element of anonymousSubjectElements) {
				const text = await element.textContent();
				if (text?.trim()) {
					anonymousSubjectNames.push(text.trim());
				}
			}

			logger.info(`Anonymous subjects: ${anonymousSubjectNames.join(", ")}`);

			const actualSubjectNames = Object.keys(responseData.Subject);
			logger.info(`Actual subjects: ${actualSubjectNames.join(", ")}`);

			for (const anonymousName of anonymousSubjectNames) {
				expect(
					actualSubjectNames.includes(anonymousName),
					`ANONYMITY VIOLATION: Anonymous name "${anonymousName}" should not match any actual subject name`,
				).toBe(false);
			}

			logger.info("✅ All anonymous names are properly anonymized");

			const responseVerificationResults = [];

			for (const anonymousName of anonymousSubjectNames) {
				const usedResponses = new Map();
				logger.info(
					`Verifying responses for anonymous subject: ${anonymousName}`,
				);

				const anonymousSubjectLocator =
					this.anonymousSubjectNameInReportLocator(anonymousName);
				await PwActions.click(this.page, anonymousSubjectLocator);
				await CommonUtils.sleep(2);

				const subjectResponseVerification = await this.verifySubjectResponses(
					responseData,
					usedResponses,
				);

				responseVerificationResults.push({
					anonymousName,
					verified: subjectResponseVerification.verified,
					responsesFound: subjectResponseVerification.responsesFound,
					responsesVerified: subjectResponseVerification.responsesVerified,
				});
			}

			const allResponsesVerified = responseVerificationResults.every(
				(result) => result.verified,
			);
			const totalResponsesFound = responseVerificationResults.reduce(
				(sum, result) => sum + result.responsesFound,
				0,
			);
			const totalResponsesVerified = responseVerificationResults.reduce(
				(sum, result) => sum + result.responsesVerified,
				0,
			);

			expect(
				allResponsesVerified,
				"All anonymous subject responses should be verified",
			).toBe(true);

			logger.info(
				`✅ Anonymous subjects verification completed: ${totalResponsesVerified}/${totalResponsesFound} responses verified`,
			);

			return {
				verified: true,
				count: anonymousSubjectNames.length,
				anonymousNames: anonymousSubjectNames,
				responseVerification: responseVerificationResults,
			};
		} catch (error) {
			logger.error(`Error verifying anonymous subjects: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Verifies responses for a single anonymous subject
	 * @param {Object} responseData - Response data from JSON file
	 * @param {Map} usedResponses - Map to track used responses
	 * @returns {Promise<Object>} Verification results for this subject's responses
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const verificationResults = await responsesPage.verifySubjectResponses(responseData, usedResponses);
	 * console.log("Verification results:", verificationResults);
	 */

	async verifySubjectResponses(responseData, usedResponses) {
		const verificationResults = [];
		let responsesFound = 0;
		let responsesVerified = 0;

		const allSections = new Set();
		const allQuestions = new Set();
		const allResponses = [];

		for (const [subjectName, subjectData] of Object.entries(
			responseData.Subject,
		)) {
			for (const [sectionId, sectionData] of Object.entries(subjectData)) {
				allSections.add(sectionId);
				for (const [questionName, questionData] of Object.entries(
					sectionData,
				)) {
					allQuestions.add(questionName);

					let response = null;

					if (this.isQuestionType(questionName, QUESTION_TYPES.RATING_SCALE)) {
						if (questionData.value) {
							response = questionData.value;
						} else if (Array.isArray(questionData) && questionData[1]) {
							response = questionData[1];
						}
					} else if (this.isQuestionType(questionName, QUESTION_TYPES.ENPS)) {
						if (Array.isArray(questionData) && questionData[1]) {
							response = questionData[1];
						}
					} else if (this.isQuestionType(questionName, QUESTION_TYPES.YES_NO)) {
						if (Array.isArray(questionData) && questionData[1]) {
							response = questionData[1];
						}
					} else if (
						this.isQuestionType(questionName, QUESTION_TYPES.MULTI_CHOICE)
					) {
						if (Array.isArray(questionData) && questionData[1]) {
							response = questionData[1];
						}
					} else if (
						this.isQuestionType(questionName, QUESTION_TYPES.TEXT_INPUT)
					) {
						if (Array.isArray(questionData) && questionData[1]) {
							response = questionData[1];
						}
					}

					if (response !== null) {
						allResponses.push({
							questionName,
							response,
							sectionId,
						});
					}
				}
			}
		}

		logger.info(`Collected ${allResponses.length} total responses from data`);

		for (const sectionId of allSections) {
			const sectionExists = await PwActions.elementIsVisible(
				this.page,
				this.sectionNameLocator(sectionId),
			);

			expect(
				sectionExists,
				`Section "${sectionId}" should exist in UI for anonymous subject verification`,
			).toBe(true);

			for (const questionName of allQuestions) {
				const questionExists = await PwActions.elementIsVisible(
					this.page,
					this.questionLocator(questionName),
				);

				if (!questionExists) {
					continue;
				}

				const questionResponses = allResponses.filter(
					(r) => r.questionName === questionName,
				);

				if (questionResponses.length === 0) {
					continue;
				}

				responsesFound++;

				if (questionName === "Text Input") {
					let textInputVerified = false;

					for (const expectedResponse of questionResponses) {
						const responseKey = `${questionName}:${expectedResponse.response}`;

						if (usedResponses.has(responseKey)) {
							continue;
						}

						const responseLocator = this.getResponseLocator(
							questionName,
							expectedResponse.response,
						);

						const responseExists = await PwActions.elementIsVisible(
							this.page,
							responseLocator,
						);

						if (responseExists) {
							const uiResponse = await PwActions.getText(
								this.page,
								responseLocator,
							);
							const actualResponse = this.extractResponseValue(
								questionName,
								uiResponse,
							);

							if (
								String(actualResponse) === String(expectedResponse.response)
							) {
								usedResponses.set(responseKey, true);
								responsesVerified++;
								textInputVerified = true;
								logger.info(
									`✅ Anonymous subject - Text Input: Response "${actualResponse}" verified`,
								);
								verificationResults.push({
									questionName,
									response: actualResponse,
									verified: true,
								});
								break;
							}
						}
					}

					expect(
						textInputVerified,
						`Anonymous subject Text Input verification failed: No unused matching response found for question "${questionName}"`,
					).toBe(true);
				} else {
					const responseLocator = this.getResponseLocator(questionName, "");
					const responseExists = await PwActions.elementIsVisible(
						this.page,
						responseLocator,
					);

					expect(
						responseExists,
						`Response should exist in UI for question "${questionName}"`,
					).toBe(true);

					const uiResponse = await PwActions.getText(
						this.page,
						responseLocator,
					);
					const actualResponse = this.extractResponseValue(
						questionName,
						uiResponse,
					);

					const matchingResponse = this.findMatchingResponse(
						questionName,
						actualResponse,
						allResponses,
						usedResponses,
					);

					expect(
						matchingResponse,
						`Anonymous subject response verification failed: Response "${actualResponse}" for question "${questionName}" could not be matched with any expected response`,
					).toBeTruthy();

					responsesVerified++;
					logger.info(
						`✅ Anonymous subject - ${questionName}: Response "${actualResponse}" verified`,
					);
					verificationResults.push({
						questionName,
						response: actualResponse,
						verified: true,
					});
				}
			}
		}

		return {
			verified: responsesVerified > 0,
			responsesFound,
			responsesVerified,
			results: verificationResults,
		};
	}

	/**
	 * Extracts the actual response value from UI response text
	 * @param {string} questionName - Name of the question
	 * @param {string} uiResponse - Raw UI response text
	 * @returns {string} Extracted response value
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const extractedResponse = await responsesPage.extractResponseValue(questionName, uiResponse);
	 * console.log("Extracted response:", extractedResponse);
	 */
	extractResponseValue(questionName, uiResponse) {
		if (questionName.includes(QUESTION_TYPES.RATING_SCALE)) {
			const scoreMatch = uiResponse.match(/Score:\s*(\d+)/);
			return scoreMatch ? scoreMatch[1] : uiResponse;
		} else if (questionName.includes(QUESTION_TYPES.ENPS)) {
			const scoreMatch = uiResponse.match(/Score:\s*(\d+)/);
			return scoreMatch ? scoreMatch[1] : uiResponse;
		} else if (questionName === QUESTION_TYPES.YES_NO) {
			const responseMatch = uiResponse.match(/Response:\s*(Yes|No)/);
			return responseMatch ? responseMatch[1] : uiResponse;
		} else if (questionName === QUESTION_TYPES.MULTI_CHOICE) {
			const choiceMatch = uiResponse.match(/Choice:\s*(Option \d+)/);
			return choiceMatch ? choiceMatch[1] : uiResponse;
		}
		return uiResponse;
	}

	/**
	 * Finds a matching response from available responses and marks it as used
	 * @param {string} questionName - Name of the question
	 * @param {string} actualResponse - Response from UI
	 * @param {Array} allResponses - All available responses
	 * @param {Map} usedResponses - Map of used responses
	 * @returns {Object|null} Matching response object or null
	 * @example
	 * // Usage example in a Playwright test:
	 * const responsesPage = new EngagePulseManagerResponsesPage(page);
	 * const matchingResponse = await responsesPage.findMatchingResponse(questionName, actualResponse, allResponses, usedResponses);
	 * console.log("Matching response:", matchingResponse);
	 */
	findMatchingResponse(
		questionName,
		actualResponse,
		allResponses,
		usedResponses,
	) {
		const questionResponses = allResponses.filter(
			(r) => r.questionName === questionName,
		);

		for (const response of questionResponses) {
			const responseKey = `${questionName}:${response.response}`;

			const dataResponseStr = String(response.response);
			const actualResponseStr = String(actualResponse);
			const isUsed = usedResponses.has(responseKey);

			if (dataResponseStr === actualResponseStr && !isUsed) {
				usedResponses.set(responseKey, true);
				return response;
			}
		}

		return null;
	}
}

export { EngageResponsesPage, EngagePulseManagerResponsesPage };

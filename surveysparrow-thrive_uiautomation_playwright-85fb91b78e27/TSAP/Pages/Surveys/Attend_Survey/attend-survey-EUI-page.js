import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { franc } from "franc";
import iso6391 from "iso-639-1";
import langdetect from "langdetect";

import fs from "fs";
import { APIActions } from "playwright-framework/Core/API_Actions/api-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import {
	constants,
	questionVerificationData,
} from "../../../Data/Resources/constants.js";
import { languagesList } from "../../../Data/Resources/languages.js";
import { envDetails } from "../../../Data/test-data.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { sharedData } from "../../../Data/Resources/shared-data.js";
import { PerformanceParticipantsPage } from "../../Performance/Performance_Participants/performance-participants.js";
import logger from "playwright-framework/Core/logger.js";
import { LoginPage } from "../../login-page.js";
import {
	data_to_attend_survey_high_values,
	data_to_attend_survey_low_values,
	data_to_attend_survey_high_values_na_zero,
	data_to_attend_survey_low_values_na_zero,
	data_to_attend_survey_mixed_values,
	data_to_attend_survey_low_normalized_values,
	data_to_attend_survey_high_normalized_values,
} from "../../../Data/Resources/predefined_test_data.js";

let test_data = {};

export class EUI {
	data = {};
	surveyProperties = [];
	constructor(page, commonPageFunctions = null) {
		this.page = page;
		this._commonPageFunctions = null;
		this.performanceParticipantsPage = new PerformanceParticipantsPage(page);
		this.commonUtils = new CommonUtils();
		this.responseData = {};
		this.participant = null;
		this.btnStartSurvey = "//button[@data-qa='welcome_cta_button']/span";
		this.txtSurveyOver = "//h1[contains(text(), 'Over')]";
		this.txtQuestionText =
			"//h1[contains(@class, 'ss-survey-heading--text') and contains(@id, 'question-title')]";
		this.btnNext = "//button[@data-qa='next_button']";
		this.txtNextButton = "//button[@data-qa='next_button']/span";
		this.btnSubmit = "//button[@data-qa='submit_button']";
		this.lblThankYou = "//h1[text()='Thank you.']";
		this.lblThankYouInLanguage =
			"//h1[contains(@class, 'ss_completed_thankyou__header')]";
		this.dropdownLanguageSelector =
			"//div[@class='css-1wy0on6 ss-language-selector__select__indicators']";
		this.btnLanguage = (language) =>
			`//p[@class='ss-language-option__label' and text()='${language}']`;
		this.txtWelcomePageTextFirstSection =
			"(//h3[contains(@class,'ss-survey-text-question-text main-header')])[1]";
		this.textSectionName =
			"//div[@class='ss_cl_survey_qstn_item ss_cl_survey_qstn_item--section-intro active']//h1[contains(@class,'ss-survey-text-question-text')]";
		this.textSectionNameIfImageAdded =
			"//div[@class='ss-classic-survey-section-intro__image']//h1[contains(@class,'ss-survey-text-question-text')]";
		this.txtSectionDescription =
			"//div[@class='ss_cl_survey_qstn_item ss_cl_survey_qstn_item--section-intro active']//h3[contains(@class,'ss-survey-text-question-text')]";
		this.textSectionDescriptionIfImageAdded =
			"//div[@class='ss_cl_survey_qstn']//h3[contains(@class,'ss-survey-text-question-text')]";
		this.webElementsQuestionText = "//h1[contains(@id,'question-title')]";
		this.surveyHeader = '//div[@class="ss-fp-section__inner-frame "]//h3';
		this.lblItsOver = '//h1[text()="It\'s Over"]';
		this.lblQuestionElement = (questionNumber) =>
			`(//h1[contains(@id, 'question-title')])[${questionNumber}]`;
		this.initializeCommonPageFunctions();
		this.surveyIntroImage = "//div[@class='ss-classic-survey-intro-image']";
		this.sectionHeaderImage =
			"//div[@class='ss-classic-survey-section-intro__image']";
		this.webElementsAllAvailableScalesForEachQuestion = (questionNumber) =>
			`(//div[contains(@aria-labelledby,"question-title")])[${questionNumber}]//button`;
		this.webElementTooltipForRatingScaleForEachQuestion = (questionName) =>
			`//h1//span[text()='${questionName}']/ancestor::div[@data-qa="question_normal"]/span//button/span[contains(@class,'ss-option-no__key-assist')]`;
		this.inputMultiLineTextArea = (sectionNumber, questionNumber) =>
			`//div[contains(@class, 'ss_cl_survey_qstn_item')][.//p[contains(text(),'${sectionNumber}.${questionNumber}')]]//textarea[@maxlength="10000"]`;
		this.inputSingleLineTextArea = (sectionNumber, questionNumber) =>
			`//p[text()='${sectionNumber}.${questionNumber}']/ancestor::div[contains(@class,'ss_cl_survey_qstn_item')]//span[@class='ss_span_wrapper']//textarea[@maxlength='1000']`;
		this.inputRadioOrCheckboxOtherOption = (questionNumber) =>
			`(//div[contains(@aria-labelledby,"question-title")])[${questionNumber}]//button//span[text()='Other']`;
		this.inputActiveCheckBoxes = (questionNumber) =>
			`(//div[contains(@aria-labelledby,"question-title")])[${questionNumber}]//button[contains(@class,'assist active')]`;
		this.inputTextBoxIfOthersOptionIsSelected = (questionNumber) =>
			`(//div[contains(@aria-labelledby,"question-title")]/following::div)[${questionNumber}]//textarea[@placeholder='Please enter your other input']`;
		this.errorIndicator = "//p[contains(text(),'Errors Found')]";
		this.webElementsMandatoryQuestionNumbers =
			"//*[name()='svg' and @name='asterisk']/following-sibling::p";
		this.webElementsQuestionNumbers =
			"//p[contains(@class, 'ss-survey-heading--text')]";
		this.webElementMultiChoiceOption = (question) =>
			`//*[text()='${question}']//following::span[@class='ss-answer-option--choice__copy']`;
		this.btnGoalRating = (question, rating) =>
			`//*[normalize-space(.)="${question}"]/parent::div//button[@data-hotkey-value="${rating}"]`;
		this.txtBoxGoals = (question) =>
			`//*[normalize-space(.)="${question}"]/parent::div//textarea`;
		this.btnEditResponses = `//a[@aria-label="Edit Responses"]`;
		this.btnPreviousSection = `//button[@title="Previous Section"]`;
		this.asteriskIconForQuestion = (question) =>
			`//*[normalize-space(.)='${question}']/ancestor::div[2]/preceding-sibling::div//*[name()='svg' and @name='asterisk']`;
		this.txtErrorIndicatorMakeReasonMandatory = (
			sectionNumber,
			questionNumber,
		) =>
			`//p[normalize-space()='${sectionNumber}.${questionNumber}']/ancestor::div[contains(@class,'ss_cl_survey_qstn_wrapper')]/following-sibling::div//h6[contains(normalize-space(.),'Please enter the reason for your rating to proceed.')]`;
		this.lblQuestionValidationError = (sectionNumber, questionNumber) =>
			`//p[text()='${sectionNumber}.${questionNumber}']/ancestor::div[contains(@class,'ss_cl_survey_qstn_item')]//h6[contains(@class,'error')]`;
		this.btnReasonTextBox = (placeholder) =>
			`//div[@class="reason-for-rating-container"]/p[text()="${placeholder}"]`;
		this.txtBoxReason = (goalName) =>
			`//*[normalize-space(.)="${goalName}"]/parent::div//textarea`;
		this.btnNotApplicable = (sectionNumber, questionNumber) =>
			`//p[text()="${sectionNumber}.${questionNumber}"]/ancestor::div[@class="ss_cl_survey_qstn_wrapper"]/following-sibling::div//button[@aria-label='NOT APPLICABLE']`;
		this.tooltipForGoalRatingScale = (sectionNumber, questionNumber, index) =>
			`//p[text()="${sectionNumber}.${questionNumber}"]/ancestor::div[contains(@id,"question")]//button[@data-hotkey-value="${index}"]/span[@class='ss-option-no__key-assist']`;
		this.webScaleElementForQuestion = (question) =>
			`//*[normalize-space(.)="${question}"]/ancestor::div[@class="ss-spf-question-container"]/descendant::button`;
		this.txtBoxForQuestion = (question) =>
			`//*[contains(normalize-space(.), "${question}")]/ancestor::div[@class="ss-spf-question-container"]//textarea`;
		this.webElementsRatingScaleForGoal = (goal) =>
			`//*[normalize-space(.)="${goal}"]/parent::div//button`;
		this.webElementsTooltipsForRatingScaleForGoal = (goal) =>
			`//*[normalize-space(.)="${goal}"]/parent::div//button/span[contains(@class,'ss-option-no__key-assist')]`;
		this.btnNotApplicableForGoal = (goal) =>
			`//*[normalize-space(.)="${goal}"]/parent::div//button[@aria-label="NOT APPLICABLE"]`;
		this.btnNotApplicableQuestionContainer = (questionName) =>
			`//*[normalize-space(.)='${questionName}']/ancestor::div[@class='ss-spf-question-container']/descendant::button[@aria-label='NOT APPLICABLE']`;
		this.mcqOtherOptionByQuestionName = (questionName) =>
			`//*[normalize-space(.)='${questionName}']/ancestor::div[@class="ss-spf-question-container"]//button//span[text()='Other']`;
		this.mcqOtherTextInputByQuestionName = (questionName) =>
			`//*[normalize-space(.)='${questionName}']/ancestor::div[@class="ss-spf-question-container"]//textarea[@placeholder='Please enter your other input']`;
		this.mcqOtherTextareaByQuestionName = (questionName) =>
			`//*[normalize-space(.)='${questionName}']/ancestor::div[@class="ss-spf-question-container"]//button//span[text()='Other']/ancestor::div[@class="ss-spf-question-container"]//textarea`;
		this.mcqOptionByQuestionName = (questionName, optionText) =>
			`//*[normalize-space(.)='${questionName}']/ancestor::div[@class="ss-spf-question-container"]//span[text()='${optionText}']/ancestor::button`;
		this.spanMcqOptionInQuestionContainer = (questionName, optionText) =>
			`//*[normalize-space(.)='${questionName}']/ancestor::div[@class='ss-spf-question-container']//span[text()='${optionText}']`;
		this.spanMcqOptionFollowingQuestionName = (questionName, optionText) =>
			`//*[text()='${questionName}']//following::span[text()='${optionText}'][1]`;
		this.mcqAllOptionsByQuestionName = (questionName) =>
			`//*[normalize-space(.)='${questionName}']/ancestor::div[@class="ss-spf-question-container"]//span[@class='ss-answer-option--choice__copy']`;
		this.mcqSelectedOptionsByQuestionName = (questionName) =>
			`//*[normalize-space(.)='${questionName}']/ancestor::div[@class="ss-spf-question-container"]//button[contains(@class,'active')]//span[@class='ss-answer-option--choice__copy']`;
		this.inputOthersMCQ = (questionName) =>
			`(//div//span[text()='${questionName}']//following::span[1]//textarea[last()] | //div//span[text()='${questionName}']//following::span[2]//textarea[last()])`;
		this.errorMCQMinSelection = (questionName, minSelection) =>
			`//div//span[text() = '${questionName}']//following::div[@aria-live = "assertive"]//h6[text() = 'Please select at least ${minSelection} choices.']`;
		this.errorMCQMaxSelection = (questionName, maxSelection) =>
			`//div//span[text() = '${questionName}']//following::div[@aria-live = "assertive"]//h6[text() = 'The maximum number of selection is limited to ${maxSelection}.']`;
		this.getTextQuestionTextareaXpath = (questionName) =>
			`//span[text()='${questionName}']//following::div[2]//textarea`;
		this.getMCQOtherButtonXpath = (questionName) =>
			`//span[text()='${questionName}']//following::div[2]//span[text()='Other']`;
		this.getMCQOtherTextareaXpath = (questionName) =>
			`//span[text()='${questionName}']//following::div[2]//span[text()='Other']//following::textarea[1]`;
		this.mcqQuestionTitleByIndex = (questionNumber) =>
			`(//h1[contains(@id, 'question-title')])[${questionNumber}]`;
		this.mcqOptionByIndex = (questionNumber, optionIndex) =>
			`(//div[contains(@aria-labelledby,"question-title")])[${questionNumber}]//button[${optionIndex}]`;

		// Goal Side Panel locators
		this.btnGoalNameTrigger = (snapshotId) =>
			`//h3[@id="question-title-${snapshotId}"]`;
		this.iframeSidePanel = `//iframe[@title="Goal Details Drawer"]`;
		this.txtGoalSidePanelTitle = `//h1[@data-testid="goal-content_heading"]`;
		this.txtGoalSidePanelDescription = `//div[@data-testid="expandable-description-wrapper_box"]//div[@contenteditable="false"]`;
		this.txtGoalSidePanelStatus = `//div[contains(@class,"status-indicator")]//p`;
		this.txtGoalSidePanelOwner = `//button[@data-testid="owner-dropdown_dropdown-menu-trigger"]//p[contains(@class,"value-text")]`;
		this.txtGoalSidePanelVisibility = `//button[@data-testid="visibility-dropdown_dropdown-menu-trigger"]//p[contains(@class,"value-text")]`;
		this.txtGoalSidePanelDueBy = `//button[@data-testid="due-by_popover-trigger"]//p[contains(@class,"value-text")]`;
		this.txtGoalSidePanelCycle = `//button[@data-testid="cycle-dropdown_dropdown-menu-trigger"]//p[contains(@class,"value-text")]`;
		this.txtGoalSidePanelProgress = `//button[@data-testid="goal-content_button_progression"]//p`;
		this.btnGoalSidePanelClose = `(//button[@data-testid="tabs-content_icon-button"])[last()]`;
		this.txtGoalSidePanelLevel = `//p[contains(normalize-space(.),". Goal")]`;
		this.txtGoalSidePanelParticipants = `//div[@data-testid="add-participants_flex"]`;
		this.txtGoalSidePanelParticipantName = (name, role) =>
			`//p[text()="${name}"]/parent::div/following-sibling::p[text()="${role}"]`;
		this.btnGoalSidePanelRedirectConfirm = `//button[@data-testid="comman-confirmation-modal_button_confirm"]`;
		this.getGoalSidePanelChildItemRow = (name) =>
			`//div[@data-testid="tabpanel-goal"]//p[text()="${name}"]`;

		// Task Side Panel locators (tabpanel-task)
		this.txtTaskSidePanelTitle = `//h1[@data-testid="task-content_heading"]`;
		this.txtTaskSidePanelDescription = `//div[@data-testid="tabpanel-task"]//div[@data-testid="expandable-description-wrapper_box"]`;
		this.txtTaskSidePanelProgress = `//div[@data-testid="tabpanel-task"]//button[@data-testid="task-content_button_progression"]//p`;
		this.txtTaskSidePanelStatus = `//div[@data-testid="tabpanel-task"]//div[contains(@class,"status-indicator")]//p`;
		this.txtTaskSidePanelOwner = `//div[@data-testid="tabpanel-task"]//button[@data-testid="owner-dropdown_dropdown-menu-trigger"]//p[contains(@class,"value-text")]`;
		this.txtTaskSidePanelVisibility = `//div[@data-testid="tabpanel-task"]//button[@data-testid="visibility-dropdown_dropdown-menu-trigger"]//p[contains(@class,"value-text")]`;
		this.txtTaskSidePanelDueBy = `//div[@data-testid="tabpanel-task"]//button[@data-testid="due-by_popover-trigger"]//p[contains(@class,"value-text")]`;
		this.txtTaskSidePanelCycle = `//div[@data-testid="tabpanel-task"]//button[@data-testid="cycle-dropdown_dropdown-menu-trigger"]//p[contains(@class,"value-text")]`;

		// Parent goal (alignment) – shown when alignment.parent is present in API response
		this.txtGoalSidePanelParentGoal = `//p[text()="Aligned to:"]/following-sibling::div//p`;
		this.txtTaskSidePanelParentGoal = `//div[@data-testid="tabpanel-task"]//p[text()="Aligned to:"]/following-sibling::div//p`;

		// Task metric values locators (start, current, target) - only applicable for tasks
		this.txtTaskSidePanelStartValue = `//div[@data-testid="tabpanel-task"]//p[normalize-space(text())='Started At:']/following-sibling::div//input`;
		this.txtTaskSidePanelTargetValue = `//div[@data-testid="tabpanel-task"]//p[normalize-space(text())='Target:']/following-sibling::div//input`;
		this.txtTaskSidePanelCurrentValue = `//div[@data-testid="tabpanel-task"]//p[contains(text(),'Currently At:')]/parent::div//input[@data-testid="metric-input_input"]`;
	}

	async initializeCommonPageFunctions() {
		if (!this._commonPageFunctions) {
			const { CommonPageFunctions } = await import(
				"../../../Shared_Functions/common-functions.js"
			);
			this._commonPageFunctions = new CommonPageFunctions(this.page, this);
		}
		return this._commonPageFunctions;
	}

	getQuestionTitleXpath(questionNumer) {
		this.txtQuestionText = `(//h1[contains(@id, 'question-title')])[${questionNumer}]`;
		return this.txtQuestionText;
	}

	async getsurveyAPIDetails(cookie) {
		this.survey_id = EntityIds.getsurveyId();
		const internal_url = `${envDetails.uri}/api/internal/surveys/${this.survey_id}`;
		const cookieValue = cookie;
		const api_action = new APIActions();
		const api_data = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});
		return api_data;
	}

	/**
	 * Fetches survey configuration from the public API endpoint
	 *
	 * @param {Object} page - Playwright page object to get the current URL
	 *
	 * @description
	 * - Extracts the current survey URL from the page
	 * - Appends '/config' to get the public configuration endpoint
	 * - Makes an unauthenticated API call to fetch survey configuration
	 * - Used for accessing goal data and other survey metadata
	 *
	 * @returns {Promise<Object>} API response containing survey configuration
	 * @returns {Object} return.data - Survey configuration data
	 * @returns {Array} return.data.sections - Array of survey sections with questions
	 * @returns {Object} return.data.goalData - Goal data keyed by question id (for goal-based questions)
	 *
	 * @example
	 * const config = await this.getsurveyAPIDetailsFromPublicConfig(page);
	 * // Returns: { data: { sections: [...], goalData: { "123": { goals: [...] } } } }
	 * const goalData = config.data.goalData;
	 */

	async getsurveyAPIDetailsFromPublicConfig(page, cookie = null) {
		const api_action = new APIActions();

		try {
			const currentUrl = await PwActions.getCurrentUrl(page);
			// If URL contains /configure, use internal API with cookie
			if (currentUrl.includes("/configure")) {
				this.survey_id = EntityIds.getsurveyId();
				const internal_url = `${envDetails.uri}/api/internal/surveys/${this.survey_id}`;
				const api_data = await api_action.getRequest({
					url: internal_url,
					cookieValue: cookie,
				});
				const internal_url_preview = `${envDetails.uri}/api/internal/hydrationMeta?survey_id=${this.survey_id}&preview=true`;
				const api_data_preview = await api_action.getRequest({
					url: internal_url_preview,
					cookieValue: cookie,
				});
				this.surveyProperties =
					api_data_preview?.survey?.surveyProperties ?? [];
				return api_data;
			} else {
				// Use public config endpoint
				const configUrl = `${currentUrl}/config`;
				const api_data = await api_action.getRequest({ url: configUrl });
				this.surveyProperties = api_data?.data?.survey?.surveyProperties ?? [];
				return api_data;
			}
		} catch (error) {
			// If getting URL fails (e.g., page is a frame), assume it's a preview survey
			this.survey_id = EntityIds.getsurveyId();
			const internal_url = `${envDetails.uri}/api/internal/surveys/${this.survey_id}`;
			const api_data = await api_action.getRequest({
				url: internal_url,
				cookieValue: cookie,
			});
			const internal_url_preview = `${envDetails.uri}/api/internal/hydrationMeta?survey_id=${this.survey_id}&preview=true`;
			const api_data_preview = await api_action.getRequest({
				url: internal_url_preview,
				cookieValue: cookie,
			});
			this.surveyProperties = api_data_preview?.survey?.surveyProperties ?? [];
			return api_data;
		}
	}

	/**
	 * Attends survey by navigating to the given survey URL. It fetches survey details using internal api.
	 * Itareate through each question properties and based on the question type attends the question
	 *
	 * @param {Object} page - page object used to interact with the browser.
	 * @param {string} cookie - The authentication cookie required to access the survey internal api
	 * @param {string} participantName - The name of the participant
	 * @param {string} subject - The subject of the survey
	 * @param {array} settings - The settings of the survey
	 **/
	/**
	 * Common helper to ensure settings is a valid array
	 * @param {Array} settings - Array of settings strings
	 * @returns {Array} - Validated settings array
	 */
	ensureSettingsArray(settings) {
		if (!settings || !Array.isArray(settings)) {
			return [];
		}
		return settings;
	}

	/**
	 * Resets the shared data object used for communication between
	 * verifyQuestionVerificationUsingSettings helpers and question-attending methods.
	 * Must be called after consuming this.data in each attend* method.
	 *
	 * @returns {void}
	 *
	 * @example
	 * this.resetData();
	 */
	resetData() {
		this.data = {};
	}

	async attendSurvey({ page, participantName, subject, settings = [] }) {
		this.page = page;
		this.participant = participantName;
		let sectioncount = 0;
		const cookieValue = EntityIds.getCookie();

		// Ensure settings is an array
		settings = this.ensureSettingsArray(settings);

		const api_data = await this.getsurveyAPIDetailsFromPublicConfig(
			page,
			cookieValue,
		);
		this.surveyPublicConfig = api_data;
		const sections = api_data.data ? api_data.data.sections : api_data.sections;
		await PwActions.waitForElement(this.page, this.btnStartSurvey, 15000);
		if (await PwActions.elementIsVisible(this.page, this.btnStartSurvey)) {
			await PwActions.click(this.page, this.btnStartSurvey);
		}

		if (!test_data[subject]) {
			test_data[subject] = {};
		}

		if (!test_data[subject][this.participant]) {
			test_data[subject][this.participant] = {};
		}
		if (settings.includes("partial Submission")) {
			while (
				(await PwActions.elementIsVisible(page, this.btnPreviousSection)) &&
				!(await PwActions.isElementDisabledOrEnabled(
					page,
					this.btnPreviousSection,
				))
			) {
				await PwActions.click(page, this.btnPreviousSection);
				await CommonUtils.sleep(2);
			}
		}
		const number_of_sections = settings.includes("partial Submission")
			? CommonUtils.getRandomIntInclusive(1, sections.length - 1)
			: sections.length;
		for (let i = 0; i < number_of_sections; i++) {
			const section = sections[i];
			if (settings.includes("Don't allow switching between translations")) {
				await PwActions.verifyElementIsNotPresent(
					this.page,
					this.dropdownLanguageSelector,
				);
			}
			if (settings.includes("Switch Language")) {
				await PwActions.waitForElementVisibility(
					this.page,
					this.dropdownLanguageSelector,
					10000,
				);
			}
			sectioncount++;
			const sectionName = section.name;
			test_data[subject][this.participant][sectionName] = {};
			const sectionQuestions = await section.questions;

			for (let qIndex = 0; qIndex < sectionQuestions.length; qIndex++) {
				const question = sectionQuestions[qIndex];
				const qtype = question.type;
				const prop = question.properties.data;
				prop.isRequired = question.required;
				prop.questionProperties = question.questionProperties;
				let question_name = "";
				if (question.rawTxt === undefined || question.rawTxt === null) {
					question_name = question.txt;
					question_name = question_name.replace(/\n/g, " ").trim();
				} else {
					question_name = question.rawTxt;
					question_name = question_name.replace(/\n/g, " ").trim();
				}

				// Handle verification settings before attending

				if (qtype === "OpinionScale") {
					await this.attendOpinionQuestion({
						property: prop,
						questioName: question_name,
						sectionName: sectionName,
						subject: subject,
						settings: settings,
						question_name_in_language: null,
					});
				} else if (qtype === "TextInput") {
					await this.attendTextQuestion({
						property: prop,
						questionName: question_name,
						sectionName: sectionName,
						subject: subject,
						settings: settings,
						question_name_in_language: null,
					});
				} else if (qtype === "YesNo") {
					await this.attendYesNoQuestion({
						property: prop,
						questioName: question_name,
						sectionName: sectionName,
						subject: subject,
						settings: settings,
					});
				} else if (qtype === "NPSScore" || qtype === "eNPSScore") {
					await this.attendENPSQuestion({
						property: prop,
						questioName: question_name,
						sectionName: sectionName,
						subject: subject,
						settings: settings,
					});
				} else if (qtype === "MultiChoice") {
					await this.attendMultiChoiceQuestion({
						property: prop,
						question,
						questionName: question_name,
						sectionName: sectionName,
						subject: subject,
						settings: settings,
					});
				} else if (qtype === "Goal") {
					await this.attendGoalQuestion({
						property: prop,
						question: question,
						questionName: question_name,
						sectionName: sectionName,
						subject: subject,
						settings: settings,
					});
				}

				// Settings verification is now handled within each question method
			}
			await PwActions.waitForNetworkIdle(this.page, 20000);
			if (sectioncount < number_of_sections) {
				await CommonUtils.sleep(3);
				await PwActions.click(this.page, this.btnNext);
			} else if (!settings.includes("partial Submission")) {
				await CommonUtils.sleep(4);
				await PwActions.waitForDOMContentLoaded(this.page, 15000);
				await CommonUtils.sleep(4);
				await PwActions.click(page, this.btnSubmit);
				await PwActions.waitForElementVisibility(
					this.page,
					this.lblThankYou,
					30000,
				);
				if (settings.includes("EditResubmit")) {
					await PwActions.verifyElementIsPresent(
						this.page,
						this.btnEditResponses,
					);
				} else {
					await PwActions.verifyElementIsNotPresent(
						this.page,
						this.btnEditResponses,
					);
				}
			}
		}
		if (!this.responseData[subject]) {
			this.responseData[subject] = {};
		}

		// Loop through the new data in test_data[subject].
		for (const participantName in test_data[subject]) {
			// If the participant name doesn't exist in this.responseData, initialize it.
			if (!this.responseData[subject][participantName]) {
				this.responseData[subject][participantName] = {};
			}

			// Merge the data from test_data[subject][participantName] into this.responseData.
			Object.assign(
				this.responseData[subject][participantName],
				test_data[subject][participantName],
			);
		}

		// Save the survey response data to JSON file
		const surveyResponse = await this.getResponse();
		await this.commonUtils.addDataToJsonFile(
			`${EntityIds.getsurveyName()} Survey Response.json`,
			surveyResponse,
		);
		if (settings.includes("partial Submission")) {
			await CommonUtils.sleep(6);
		}

		test_data = {};
	}

	async attend_survey_with_multilanuage(
		page,
		cookie,
		participant,
		language,
		settings = [],
	) {
		this.page = page;
		this.participant = participant;
		let sectioncount = 0;
		const cookieValue = cookie;
		const languageCode = iso6391.getCode(language);
		await this.initializeCommonPageFunctions();
		const api_data = await this.getsurveyAPIDetailsFromPublicConfig(
			this.page,
			cookieValue,
		);
		await PwActions.click(this.page, this.btnStartSurvey);
		test_data[this.participant] = {};
		const number_of_sections = api_data.data
			? api_data.data.sections
			: api_data.sections;
		for (const section of await number_of_sections) {
			sectioncount++;
			const sectionName = section.name;
			test_data[this.participant][section.name] = {};
			let questionCount = 0;
			await PwActions.verifyTextExpected(
				await this.commonUtils.getTextLanguage(
					await PwActions.getText(this.page, this.textSectionName),
				),
				language,
			);
			await PwActions.verifyTextExpected(
				await this.commonUtils.getTextLanguage(
					await PwActions.getText(this.page, this.txtSectionDescription),
				),
				language,
			);
			for (const question of await section.questions) {
				questionCount++;
				await PwActions.verifyTextExpected(
					await this.commonUtils.getTextLanguage(
						await PwActions.getText(
							this.page,
							this.getQuestionTitleXpath(questionCount),
						),
					),
					language,
				);
				const qtype = question.type;
				const prop = question.properties.data;
				const question_name = question.txt;
				const question_name_in_language =
					question.multiLanguageTxt[languageCode];

				if (qtype === "OpinionScale") {
					await this.attendOpinionQuestion({
						property: prop,
						questioName: question_name,
						sectionName: sectionName,
						subject: undefined,
						question_name_in_language: question_name_in_language,
						settings: settings,
					});
				} else if (qtype === "TextInput") {
					await this.attendTextQuestion({
						questionName: question_name,
						sectionName: sectionName,
						subject: undefined,
						question_name_in_language: question_name_in_language,
						settings: settings,
					});
				}
			}
			if (sectioncount < number_of_sections.length) {
				await CommonUtils.sleep(3);
				await PwActions.click(this.page, this.btnNext);
			} else {
				await CommonUtils.sleep(2);
				await PwActions.click(this.page, this.btnSubmit);
				await PwActions.waitTillVisible(
					this.page,
					this.lblThankYouInLanguage,
					20000,
				);
			}
		}
		this.responseData = test_data;
		test_data = {};
	}

	/**
	 * Returns the survey response data
	 * @returns {Object} The response data collected during survey attendance
	 */

	async getResponse() {
		return this.responseData;
	}

	/**
	 * Returns the entire survey property object matching the given properties value.
	 * surveyProperties is an array of objects; this returns the full matching object.
	 * Objects with key "DEFAULT_RATING_SCALE" are rejected when multiple matches exist.
	 * @param {string|number} propertiesValue - The id value to match
	 * @returns {Object|undefined} The entire matching survey property object, or undefined if not found
	 * @example
	 * const ratingScaleData = this.getRatingScaleData(2210532);
	 * // Returns full object, e.g.:
	 * // {
	 * //   "value": "Agreement (custom 4)",
	 * //   "id": 2210532,
	 * //   "companyId": 2220,
	 * //   "key": "RATING_SCALE_LABEL",
	 * //   "properties": { "includeNA": false, "length": 6, "includeZero": false },
	 * //   "multiLanguageProperties": {
	 * //     "en": { "1": "Strongly Disagree", "2": "Disagree", "3": "Average", "4": "Okay", "5": "Strongly Agree", "6": "Excellent 💯" }
	 * //   },
	 * //   "parentPropertyId": 2197657,
	 * //   "survey_id": 50539,
	 * //   ...
	 * // }
	 */
	getRatingScaleData(propertiesValue) {
		if (!Array.isArray(this.surveyProperties)) return undefined;
		const properties = this.surveyProperties.filter(
			(p) => p.key !== "DEFAULT_RATING_SCALE",
		);
		const matchById = (id) =>
			properties.find((p) => String(p.id) === String(id));
		if (propertiesValue == null) {
			const defaultScale = this.surveyProperties.find(
				(p) => p.key === "DEFAULT_RATING_SCALE",
			);
			return defaultScale ? matchById(defaultScale.value) : undefined;
		}
		return matchById(propertiesValue);
	}

	/**
	 * attends to an opinion question on a page.
	 *
	 * @param {object} page -  the page instance
	 * @param {Object} property - An object containing the properties for the question through question api.
	 * @param {string} questioName - The name of the opinion question to be answered.
	 * @param {string} sectionName - The name of the section the question belongs to.
	 *
	 * This function randomly selects an opinion option (between 1 and 5 inclusive) for the given question
	 * and clicks the corresponding button on the page. The selected option is then stored in the `test_data`
	 * object with the question name as the key.
	 */
	async attendOpinionQuestion({
		property,
		questioName,
		sectionName,
		subject = null,
		question_name_in_language,
		settings = null,
	}) {
		let num;
		let question = questioName;

		const surveyNameLower = (EntityIds.getsurveyName() ?? "").toLowerCase();
		const isPerformanceSurvey =
			surveyNameLower.length > 0 &&
			(surveyNameLower.includes("performance") ||
				surveyNameLower.includes("360"));

		let normalizedStart;
		let normalizedEnd;
		if (isPerformanceSurvey) {
			const propertyId =
				property.questionProperties?.length > 0
					? property.questionProperties[0].value
					: null;
			const ratingScaleData = this.getRatingScaleData(propertyId);
			if (!ratingScaleData?.properties) {
				throw new Error(
					`Rating scale data not found for propertyId=${propertyId}. Ensure survey config is loaded.`,
				);
			}
			normalizedStart = ratingScaleData.properties.includeZero ? 0 : 1;
			normalizedEnd = ratingScaleData.properties.length;
		} else {
			normalizedStart = property.start;
			normalizedEnd = property.step;
		}

		const replaceSubject = (q) => q.replace("$Subject_FirstName", "Subject");

		// Helper function to get opinion button selector
		const getBtnOpinionOption = (q, num, lang = null) => {
			if (num === "N/A") {
				return `//*[normalize-space()="${q}"]/ancestor::div[@class="ss-spf-question-container"]/descendant::button[@aria-label="NOT APPLICABLE"]`;
			}
			if (lang !== null) {
				const textAlone = CommonUtils.extractTextFromHtml(lang);
				return `//span[normalize-space()='${textAlone}']/ancestor::div[@data-qa='question_normal']//button[contains(@class, 'ss-answer-option') and @data-hotkey-value='${num.toString()}'] | //h1[normalize-space()='${textAlone}']/ancestor::div[@data-qa='question_normal']//button[contains(@class, 'ss-answer-option') and @data-hotkey-value='${num.toString()}']`;
			}
			return `//*[normalize-space(.)="${q}"]/ancestor::div[@class="ss-spf-question-container"]/descendant::button[@data-hotkey-value='${num.toString()}']
		| //*[normalize-space()="${q}"]/ancestor::div[@class="ss-spf-question-container"]/descendant::button[text()='${num.toString()}']`;
		};
		await PwActions.waitForElement(this.page, getBtnOpinionOption(question, 1));

		// Helper function to click opinion option
		const clickOpinion = async (num, lang = null) => {
			this.btn_opinion_option = getBtnOpinionOption(question, num, lang);
			await PwActions.click(this.page, this.btn_opinion_option);
			this.data.value = num;
		};

		let start, end;
		question = replaceSubject(questioName);

		// Ensure settings is an array
		settings = this.ensureSettingsArray(settings);

		// Determine answer value based on settings - process settings in priority order
		let answerDetermined = false;

		// Process Display Logic setting (special case - needs to be handled first)
		if (settings.includes("Display Logic")) {
			start =
				Number.parseInt(data_to_attend_survey_low_values["Rating Scale"], 10) +
				2;
			end = property.step;
			num = CommonUtils.getRandomIntInclusive(start, end);
			this.btn_opinion_option = getBtnOpinionOption(question, num);
			await PwActions.click(this.page, this.btn_opinion_option);
			await PwActions.verifyElementIsPresent(this.page, this.btnSubmit);

			start = property.start;
			end = Number.parseInt(
				data_to_attend_survey_low_values["Rating Scale"],
				10,
			);
			num = CommonUtils.getRandomIntInclusive(start, end);
			this.btn_opinion_option = getBtnOpinionOption(question, num);
			await CommonUtils.sleep(1);
			await PwActions.click(this.page, this.btn_opinion_option);
			answerDetermined = true;
		}

		await this.verifyQuestionVerificationUsingSettings({
			questionName: question,
			settings: settings,
		});

		// Process other answer selection settings if Display Logic wasn't used
		if (!answerDetermined) {
			for (const setting of settings) {
				if (
					setting === "Skip non mandatory questions" &&
					!property.isRequired
				) {
					this.data.value = "Not Answered";
					answerDetermined = true;
					break;
				} else if (setting === "Mandatory Question") {
					await PwActions.waitForElement(
						this.page,
						this.asteriskIconForQuestion(question),
						10000,
					);
					await PwActions.verifyElementIsPresent(
						this.page,
						this.asteriskIconForQuestion(question),
					);
				} else if (
					setting ===
						"Attend with default answer high values with mix of N/A and 0" ||
					setting ===
						"Edit and resubmit with default high value with mix of N/A and 0"
				) {
					num = data_to_attend_survey_high_values_na_zero[question];
					await clickOpinion(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting ===
						"Attend with default answer low values with mix of N/A and 0" ||
					setting ===
						"Edit and resubmit with default low value with mix of N/A and 0"
				) {
					num = data_to_attend_survey_low_values_na_zero[question];
					await clickOpinion(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting === "Attend with default answer high values" ||
					setting === "Edit and resubmit with default high value"
				) {
					num = data_to_attend_survey_high_values[question];
					await clickOpinion(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting === "Attend with default answer low values" ||
					setting === "Edit and resubmit with default low value"
				) {
					num = data_to_attend_survey_low_values[question];
					await clickOpinion(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting === "Attend with default answer mixed values" ||
					setting === "Edit and resubmit with default mixed values"
				) {
					num = data_to_attend_survey_mixed_values[question];
					await clickOpinion(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting === "Attend with default answer high normalized values" ||
					setting === "Edit and resubmit with default high normalized value"
				) {
					num = data_to_attend_survey_high_normalized_values[question];
					await clickOpinion(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting === "Attend with default answer low normalized values" ||
					setting === "Edit and resubmit with default low normalized value"
				) {
					num = data_to_attend_survey_low_normalized_values[question];
					await clickOpinion(num, question_name_in_language);
					answerDetermined = true;
					break;
				}
			}

			if (
				!answerDetermined &&
				!settings.includes("Verify NA Present") &&
				!settings.includes("Verify StartFromZero Present")
			) {
				this.data.value = CommonUtils.getRandomIntInclusive(
					normalizedStart,
					normalizedEnd,
				);
				await clickOpinion(this.data.value, question_name_in_language);
			}
		}
		this.data.type = "opinion";
		this.data.scale = { start: normalizedStart, stop: normalizedEnd };
		EntityIds.setQuestionScale(question, this.data.scale);
		if (subject === null) {
			test_data[this.participant][sectionName][question] = this.data;
		} else {
			test_data[subject][this.participant][sectionName][question] = this.data;
		}
		this.resetData();
		await PwActions.waitForNetworkIdle(this.page, 30000);
		await CommonUtils.sleep(2);
	}

	/**
	 * attends to an opinion question on a page.
	 *
	 * @param {object} page -  the page instance
	 * @param {string} questioName - The name of the text question to be answered.
	 * @param {string} sectionName - The name of the section the question belongs to.
	 *
	 * This function randomly generate a text with 8 charecters and fills in the input field
	 * on the page. The text is then stored in the `test_data`
	 * object with the question name as the key.
	 */

	async attendTextQuestion({
		property,
		questionName,
		sectionName,
		subject = null,
		question_name_in_language,
		settings = null,
	}) {
		let question = questionName;
		let text; // Declare text variable outside the if/else blocks

		question = questionName.replace("$Subject_FirstName", "Subject");

		// Ensure settings is an array
		settings = this.ensureSettingsArray(settings);

		await this.verifyQuestionVerificationUsingSettings({
			questionName: question,
			settings: settings,
		});

		// Loop through settings to determine text value (priority order)
		let textDetermined = false;
		for (const setting of settings) {
			if (setting === "Skip non mandatory questions" && !property.isRequired) {
				this.data.value = "Not Answered";
				textDetermined = true;
				break;
			} else if (setting === "Mandatory Question") {
				await PwActions.waitForElement(
					this.page,
					this.asteriskIconForQuestion(question),
					10000,
				);
				await PwActions.verifyElementIsPresent(
					this.page,
					this.asteriskIconForQuestion(question),
				);
			} else if (
				setting === "Attend with default answer low values" ||
				setting === "Edit and resubmit with default low value"
			) {
				text = data_to_attend_survey_low_values[question];
				textDetermined = true;
				break;
			} else if (
				setting === "Attend with default answer high values" ||
				setting === "Edit and resubmit with default high value"
			) {
				text = data_to_attend_survey_high_values[question];
				textDetermined = true;
				break;
			} else if (
				setting ===
					"Attend with default answer low values with mix of N/A and 0" ||
				setting ===
					"Edit and resubmit with default low value with mix of N/A and 0"
			) {
				text = data_to_attend_survey_low_values_na_zero[question];
				textDetermined = true;
				break;
			} else if (
				setting ===
					"Attend with default answer high values with mix of N/A and 0" ||
				setting ===
					"Edit and resubmit with default high value with mix of N/A and 0"
			) {
				text = data_to_attend_survey_high_values_na_zero[question];
				textDetermined = true;
				break;
			} else if (
				setting === "Attend with default answer mixed values" ||
				setting === "Edit and resubmit with default mixed values"
			) {
				text = data_to_attend_survey_mixed_values[question];
				textDetermined = true;
				break;
			}
		}

		// Default: random text if no specific setting was found
		if (!textDetermined) {
			text = faker.word.words(3);
		}

		await CommonUtils.sleep(0.5); // Added wait for question to load
		if (question_name_in_language !== null) {
			this.txt_text_question = `//h1[contains(text(),"${question_name_in_language}")]/ancestor::div[@class='ss-spf-question-container']//textarea`;
		} else {
			this.txt_text_question = `//*[contains(normalize-space(.), "${question}")]/ancestor::div[@class="ss-spf-question-container"]//textarea`;
		}
		await PwActions.fill(this.page, this.txt_text_question, text);
		const data = ["text", text];
		if (subject === null) {
			test_data[this.participant][sectionName][question] = data;
		} else {
			test_data[subject][this.participant][sectionName][question] = data;
		}
	}

	/**
	 * attends to an yes/no question on a page.
	 *
	 * @param {string} questioName - The name of the opinion question to be answered.
	 * @param {string} sectionName - The name of the section the question belongs to.
	 * @param {string} question_name_in_language - The name of the question in the language to be answered.
	 *
	 * This function randomly selects yes/no option for the given question
	 * and clicks the corresponding button on the page.
	 */

	async attendYesNoQuestion({
		property,
		questioName,
		sectionName,
		subject = null,
		question_name_in_language,
		settings = null,
	}) {
		let question = questioName;
		const YesNoOption = CommonUtils.getRandomElement(sharedData.YesNoOption);
		question = questioName.replace("$Subject_FirstName", "Subject");

		if (question_name_in_language !== undefined) {
			this.btn_yesno_option = `//*[normalize-space()='${question_name_in_language}']/ancestor::div[@class='ss-spf-question-container']//button[@aria-label='${num.toString()}']`;
		} else {
			this.btn_yesno_option = `//*[normalize-space(.)='${question}']//following::p[normalize-space()='${YesNoOption}']`;
		}
		await PwActions.click(this.page, this.btn_yesno_option);
		const data = ["YesNo", YesNoOption];
		if (subject === null) {
			test_data[this.participant][sectionName][question] = data;
		} else {
			test_data[subject][this.participant][sectionName][question] = data;
		}
	}
	/**
	 * attends to an eNPS question on a page.
	 *
	 * @param {object} page -  the page instance
	 * @param {Object} property - An object containing the properties for the question through question api.
	 * @param {string} questioName - The name of the opinion question to be answered.
	 * @param {string} sectionName - The name of the section the question belongs to.
	 *
	 * This function randomly selects an opinion option (between 1 and 5 inclusive) for the given question
	 * and clicks the corresponding button on the page. The selected option is then stored in the `test_data`
	 * object with the question name as the key.
	 */
	async attendENPSQuestion({
		property,
		questioName,
		sectionName,
		subject = null,
		question_name_in_language,
		settings = null,
	}) {
		let question = questioName;
		let start = property.start;
		let end = property.step;
		let num = CommonUtils.getRandomIntInclusive(start, end);
		question = questioName.replace("$Subject_FirstName", "Subject");

		settings = this.ensureSettingsArray(settings);

		await this.verifyQuestionVerificationUsingSettings({
			questionName: question,
			settings,
		});

		// Helper function to get ENPS button selector
		const getBtnEnpsOption = (q, num, lang = null) => {
			if (lang !== null) {
				return `//*[normalize-space()='${lang}']/ancestor::div[@class='ss-spf-question-container']//button[@aria-label='${num.toString()}']`;
			}
			return `//*[normalize-space()="${q}"]/ancestor::div[@class="ss-spf-question-container"]/descendant::button[@aria-label='${num.toString()}']
		| //*[normalize-space()="${q}"]/ancestor::div[@class="ss-spf-question-container"]/descendant::button[text()='${num.toString()}']`;
		};

		// Helper function to click ENPS option
		const clickEnps = async (num, lang = null) => {
			this.btn_enps_option = getBtnEnpsOption(question, num, lang);
			await PwActions.click(this.page, this.btn_enps_option);
		};

		// Ensure settings is an array
		if (!settings || !Array.isArray(settings)) {
			settings = [];
		}

		// Determine answer value based on settings - process settings in priority order
		let answerDetermined = false;

		// Process other answer selection settings
		if (!answerDetermined) {
			// Loop through settings to determine answer value (priority order)
			for (const setting of settings) {
				if (
					setting ===
					"Attend with default answer high values with mix of N/A and 0"
				) {
					num = data_to_attend_survey_high_values_na_zero[question];
					await clickEnps(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting ===
					"Attend with default answer low values with mix of N/A and 0"
				) {
					num = data_to_attend_survey_low_values_na_zero[question];
					await clickEnps(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting === "Attend with default answer high values" ||
					setting === "Edit and resubmit with default high value"
				) {
					num = data_to_attend_survey_high_values[question];
					await clickEnps(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting === "Attend with default answer low values" ||
					setting === "Edit and resubmit with default low value"
				) {
					num = data_to_attend_survey_low_values[question];
					await clickEnps(num, question_name_in_language);
					answerDetermined = true;
					break;
				} else if (
					setting === "Attend with default answer mixed values" ||
					setting === "Edit and resubmit with default mixed values"
				) {
					num = data_to_attend_survey_mixed_values[question];
					await clickEnps(num, question_name_in_language);
					answerDetermined = true;
					break;
				}
			}

			// Default: random value if no specific setting was found
			if (!answerDetermined) {
				start = property.start;
				end = property.step;
				num = CommonUtils.getRandomIntInclusive(start, end);
				await clickEnps(num, question_name_in_language);
			}
		}

		const data = ["eNPS", num.toString()];
		if (subject === null) {
			test_data[this.participant][sectionName][question] = data;
		} else {
			test_data[subject][this.participant][sectionName][question] = data;
		}
	}
	/**
	 * Attends a MultiChoice question in the survey
	 *
	 * @param {Object} question - Full question object from API containing id, properties, choices, multipleAnswers etc.
	 * @param {string} questionName - The name/text of the question to be answered
	 * @param {string} sectionName - The name of the section the question belongs to
	 * @param {string|null} subject - Subject name for 360 surveys (optional)
	 * @param {string|null} questionNameInLanguage - Question name in different language (optional)
	 * @param {string|null} settings - Attendance settings like "Attend with default answer high values" (optional)
	 *
	 * @description
	 * - Runs verifyQuestionVerificationUsingSettings first for any "Verify " settings
	 * - If verification helpers already selected options on the DOM (this.data.selectedOptions),
	 *   skips the click loop and uses those directly for storage
	 * - Otherwise resolves answer from settings-based predefined data or random selection,
	 *   then clicks options on the DOM
	 */
	async attendMultiChoiceQuestion({
		property,
		question,
		questionName,
		sectionName,
		subject = null,
		questionNameInLanguage = null,
		settings = null,
	}) {
		const qName = questionName.replace("$Subject_FirstName", "Subject");
		await CommonUtils.sleep(2);
		const isMultiSelect = question?.multipleAnswers === true;

		let availableOptions = [];
		const choices = question?.choices || [];

		if (choices.length > 0) {
			availableOptions = choices
				.map((c) => c.multiLanguageTxt?.en || c.txt)
				.filter(Boolean);
		} else {
			const elements = await PwActions.getWebElements(
				this.page,
				this.webElementMultiChoiceOption(qName),
			);
			availableOptions = await PwActions.getElementsText(this.page, elements);
		}

		const otherChoice = choices.find((c) => c.other === true);
		const otherOptionText =
			otherChoice?.multiLanguageTxt?.en || otherChoice?.txt;

		let selectedOptions;
		let otherText = null;
		let alreadyClickedOnDOM = false; // This variable is used to check if the options have already been clicked on the , the attending might have happen in verifyQuestionVerificationUsingSettings

		settings = this.ensureSettingsArray(settings);

		await this.verifyQuestionVerificationUsingSettings({
			questionName: qName,
			settings: settings,
		});

		if (this.data.selectedOptions) {
			selectedOptions = this.data.selectedOptions;
			otherText = this.data.otherText || null;
			alreadyClickedOnDOM = true; // This variable is used to check if the options have already been clicked on the , the attending might have happen in verifyQuestionVerificationUsingSettings
			this.resetData();
		}

		if (!alreadyClickedOnDOM) {
			// If the options have not been clicked on the DOM, then we need to click on the options
			let answerDetermined = false; // This variable is used to check if the answer has been determined based on the settings

			for (const setting of settings) {
				if (
					setting === "Skip non mandatory questions" &&
					!property.isRequired
				) {
					this.data.value = "Not Answered";
					answerDetermined = true;
					break;
				} else if (setting === "Attend with default answer high values") {
					const mcqData = data_to_attend_survey_high_values[qName];
					if (mcqData) {
						if (typeof mcqData === "string") {
							selectedOptions = [mcqData];
						} else if (Array.isArray(mcqData)) {
							selectedOptions = mcqData;
						} else if (typeof mcqData === "object") {
							selectedOptions = Array.isArray(mcqData.options)
								? mcqData.options
								: [mcqData.options];
							otherText = mcqData.otherText;
						}
						answerDetermined = true;
						break;
					}
				} else if (setting === "Attend with default answer low values") {
					const mcqData = data_to_attend_survey_low_values[qName];
					if (mcqData) {
						if (typeof mcqData === "string") {
							selectedOptions = [mcqData];
						} else if (Array.isArray(mcqData)) {
							selectedOptions = mcqData;
						} else if (typeof mcqData === "object") {
							selectedOptions = Array.isArray(mcqData.options)
								? mcqData.options
								: [mcqData.options];
							otherText = mcqData.otherText;
						}
						answerDetermined = true;
						break;
					}
				}
			}

			if (!answerDetermined) {
				if (isMultiSelect) {
					const count = CommonUtils.getRandomIntInclusive(
						2,
						availableOptions.length,
					);
					selectedOptions = CommonUtils.getShuffledItems(
						availableOptions,
						count,
					);
				} else {
					selectedOptions = [CommonUtils.getRandomElement(availableOptions)];
				}
			}

			let filledOtherText = null;

			for (const option of selectedOptions) {
				const optionLocator =
					questionNameInLanguage !== null
						? this.spanMcqOptionInQuestionContainer(
								questionNameInLanguage,
								option,
							)
						: this.spanMcqOptionFollowingQuestionName(qName, option);

				await PwActions.waitForElementVisibility(
					this.page,
					optionLocator,
					10000,
				);
				await PwActions.click(this.page, optionLocator);

				if (otherChoice && option === otherOptionText) {
					await CommonUtils.sleep(3);
					const finalOtherText = otherText || faker.word.words(3);
					await PwActions.fill(
						this.page,
						this.inputOthersMCQ(qName),
						finalOtherText,
					);
					filledOtherText = finalOtherText;
				}
			}

			if (filledOtherText) {
				otherText = filledOtherText;
			}
		}

		const optionsForStorage = selectedOptions.map((option) =>
			otherText && option === otherOptionText
				? `Other: ${otherText}`
				: otherText && option === "Other"
					? `Other: ${otherText}`
					: option,
		);

		const data = [
			"MultiChoice",
			optionsForStorage.length === 1 ? optionsForStorage[0] : optionsForStorage,
		];

		if (subject === null) {
			test_data[this.participant][sectionName][qName] = data;
		} else {
			test_data[subject][this.participant][sectionName][qName] = data;
		}
	}

	/**
	 * Attends a goal-based survey question by providing feedback on listed goals
	 *
	 * @param {Object} question - The question object containing id and properties
	 * @param {string} questionName - Display name of the question
	 * @param {string} sectionName - Name of the section containing this question
	 * @param {string|null} subject - Subject name (optional)
	 * @param {Object|null} settings - Additional settings (optional)
	 *
	 * @description
	 * - Retrieves goal data from public config using question id
	 * - Supports two feedback methods:
	 *   1. OpinionScale: Provides random rating (1-5 by default) for each goal
	 *   2. TextInput: Provides random text feedback for each goal
	 * - Stores responses in survey response JSON file
	 *
	 * @example
	 * await attendGoalQuestion({
	 *   question: question,
	 *   questionName: "Rate your goals",
	 *   sectionName: "Performance",
	 *   subject: "John Doe",
	 *   settings: settings,
	 * });
	 */

	async attendGoalQuestion({
		property,
		question,
		questionName,
		sectionName,
		subject = null,
		settings = null,
	}) {
		// Ensure config is available
		const config = this.surveyPublicConfig?.data;
		if (!config) return;
		const questionId = question?.id;
		const goalBlock = config.goalData?.[String(questionId)];
		if (
			!goalBlock ||
			!Array.isArray(goalBlock.goals) ||
			goalBlock.goals.length === 0
		) {
			// Nothing to attend
			return;
		}

		// Determine feedback method and scale from question properties
		const prop = question?.properties?.data || {};
		const feedbackMethod = prop.feedbackMethod || "OpinionScale";
		const start = typeof prop.start === "number" ? prop.start : 1;
		const end = typeof prop.step === "number" ? prop.step : 5;
		const reasonRequired = Boolean(prop.reasonRequired);
		let reason = null;

		// Process settings using common helper
		settings = this.ensureSettingsArray(settings);

		const answers = [];
		for (const goal of goalBlock.goals) {
			const goalName = goal.name;
			await PwActions.waitForElement(
				this.page,
				this.btnGoalRating(goalName, 1),
				10000,
			);
			await this.verifyQuestionVerificationUsingSettings({
				questionName: goalName,
				settings: settings,
				goal,
			});
			if (this.data.value) {
				answers.push({ goalName, score: this.data.value });
			} else if (
				feedbackMethod === "OpinionScale" &&
				!settings.includes("Verify Goal NA Present") &&
				!settings.includes("Verify Goal StartFromZero Present")
			) {
				let scoreDetermined = false;
				for (const setting of settings) {
					if (
						setting === "Skip non mandatory questions" &&
						!property.isRequired
					) {
						this.data.score = "Not Answered";
						scoreDetermined = true;
						break;
					} else if (
						setting === "Attend with default answer high values" ||
						setting === "Edit and resubmit with default high value"
					) {
						this.data.score = end;
						scoreDetermined = true;
						break;
					} else if (
						setting === "Attend with default answer low values" ||
						setting === "Edit and resubmit with default low value"
					) {
						this.data.score = start;
						scoreDetermined = true;
						break;
					}
				}
				if (!scoreDetermined) {
					this.data.score = CommonUtils.getRandomIntInclusive(start, end);
				}
				await PwActions.click(
					this.page,
					this.btnGoalRating(goalName, this.data.score),
				);
				if (reasonRequired) {
					reason = faker.word.words(3);
					await PwActions.fill(
						this.page,
						this.txtBoxReason(questionName),
						reason,
					);
				}
				answers.push({
					goalName,
					score: this.data.score,
					reason: reason || null,
				});
				this.resetData();
			} else if (feedbackMethod === "TextInput") {
				let text;
				const questionKey = questionName.replace(
					"$Subject_FirstName",
					"Subject",
				);
				let textDetermined = false;
				for (const setting of settings) {
					if (
						setting === "Skip non mandatory questions" &&
						!property.isRequired
					) {
						this.data.value = "Not Answered";
						textDetermined = true;
						break;
					} else if (
						setting === "Attend with default answer low values" ||
						setting === "Edit and resubmit with default low value"
					) {
						text = data_to_attend_survey_low_values[questionKey];
						textDetermined = true;
						break;
					} else if (
						setting === "Attend with default answer high values" ||
						setting === "Edit and resubmit with default high value"
					) {
						text = data_to_attend_survey_high_values[questionKey];
						textDetermined = true;
						break;
					}
				}
				if (!textDetermined) {
					text = faker.word.words(3);
				}
				await PwActions.fill(this.page, this.txtBoxGoals(goalName), text);
				answers.push({ goalName, text });
			}
		}

		const qKey = questionName.replace("$Subject_FirstName", "Subject");
		const data = {
			type: "goal",
			feedbackMethod,
			answers,
		};
		if (subject === null) {
			test_data[this.participant][sectionName][qKey] = data;
		} else {
			test_data[subject][this.participant][sectionName][qKey] = data;
		}
	}

	/**
	 * Extracts the survey ID from the current page URL.
	 * The survey ID is the segment that starts with 'tgC-' in the URL path.
	 *
	 * @param {Object} page - The Playwright page object
	 * @returns {Promise<string|null>} The survey ID or null if not found
	 *
	 * @example
	 * // URL: https://eswar-prod.thrivesparrow.com/s/Schedulue-now/tgC-ef344124a4ddefe3
	 * const surveyId = await this.extractSurveyIdFromUrl(page);
	 * // Returns: "tgC-ef344124a4ddefe3"
	 */
	async extractSurveyIdFromUrl(page) {
		const currentUrl = await PwActions.getCurrentUrl(page);
		const urlParts = currentUrl.split("/");
		const surveyIdPart = urlParts.find((part) => part.startsWith("tgC-"));
		return surveyIdPart || null;
	}

	/**
	 * Fetches goal snapshot details from the API using the snapshot data ID.
	 * This retrieves the frozen goal data that was captured at the time of invite.
	 *
	 * @param {Object} params - Parameters object
	 * @param {string} params.surveyId - The survey ID (tgC-... format)
	 * @param {string} params.snapshotDataId - The snapshot data ID (UUID)
	 * @param {boolean} [params.isPreview=false] - Whether this is a preview request
	 * @returns {Promise<Object>} The goal snapshot details from the API
	 *
	 * @example
	 * const goalDetails = await this.getGoalSnapshotDetails({
	 *   surveyId: "tgC-ef344124a4ddefe3",
	 *   snapshotDataId: "c0bcb42d-21fe-42ae-89d4-ebf7466192cc"
	 * });
	 */
	async getGoalSnapshotDetails({
		surveyId,
		snapshotDataId,
		isPreview = false,
	}) {
		try {
			const api_action = new APIActions();
			const baseUrl = envDetails.uri;
			const url = `${baseUrl}/api/surveys/${surveyId}/${snapshotDataId}?isPreview=${isPreview}`;

			const response = await api_action.getRequest({
				url: url,
				headers: [{ key: "secret", value: envDetails.goalSnapshotSecret }],
			});

			return response;
		} catch (error) {
			logger.error(`getGoalSnapshotDetails failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Fetches task snapshot details from the API for a child task of a goal.
	 * Uses the goal snapshot secret header for authentication.
	 *
	 * @param {object}         params                       - Parameters object
	 * @param {string}         params.surveyId              - Survey ID (tgC-... format)
	 * @param {string}         params.parentSnapshotDataId  - Parent goal snapshot data ID (UUID)
	 * @param {number|string}  params.taskId                - Task ID to fetch snapshot for
	 * @param {boolean}        [params.isPreview=false]     - Whether this is a preview request
	 * @returns {Promise<object>} Task snapshot details returned from the API
	 *
	 * @example
	 * const taskSnapshot = await this.getTaskSnapshotDetails({
	 *     surveyId: "tgC-abc123",
	 *     parentSnapshotDataId: "550e8400-e29b-41d4-a716-446655440000",
	 *     taskId: 42,
	 *     isPreview: true,
	 * });
	 */
	async getTaskSnapshotDetails({
		surveyId,
		parentSnapshotDataId,
		taskId,
		isPreview = false,
	}) {
		try {
			const api_action = new APIActions();
			const baseUrl = envDetails.uri;
			const url = `${baseUrl}/api/surveys/${surveyId}/${parentSnapshotDataId}/task/${taskId}?isPreview=${isPreview}`;

			const response = await api_action.getRequest({
				url,
				headers: [{ key: "secret", value: envDetails.goalSnapshotSecret }],
			});

			return response;
		} catch (error) {
			logger.error(`getTaskSnapshotDetails failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Opens the goal side panel by clicking on a goal name in the EUI.
	 *
	 * @param {Object} params - Parameters object
	 * @param {string} params.snapshotId - The snapshot ID used to identify the goal trigger element
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await this.openGoalSidePanel({ snapshotId: "c0bcb42d-21fe-42ae-89d4-ebf7466192cc" });
	 */
	async openGoalSidePanel({ snapshotId }) {
		await PwActions.waitForElement(
			this.page,
			this.btnGoalNameTrigger(snapshotId),
			10000,
		);
		await PwActions.click(this.page, this.btnGoalNameTrigger(snapshotId));
		const iframeSidePanel = await PwActions.switchToFrame(
			this.page,
			this.iframeSidePanel,
		);
		await PwActions.waitForElement(
			iframeSidePanel,
			this.txtGoalSidePanelTitle,
			10000,
		);
	}

	/**
	 * Returns cached locator objects for goal or task side panel elements.
	 * Memoizes the result to avoid rebuilding on each call.
	 * @param {boolean} isTask - True for task locators, false for goal locators
	 * @returns {Object} Locator object with title, desc, progress, status, owner, visibility, dueBy, cycle, level, parentGoal, and for tasks: startValue, targetValue, currentValue
	 */
	getSidePanelLocators(isTask) {
		const key = isTask ? "task" : "goal";
		if (!this._locatorCache) this._locatorCache = {};
		if (this._locatorCache[key]) return this._locatorCache[key];

		const baseLocators = {
			title: isTask ? this.txtTaskSidePanelTitle : this.txtGoalSidePanelTitle,
			desc: isTask
				? this.txtTaskSidePanelDescription
				: this.txtGoalSidePanelDescription,
			progress: isTask
				? this.txtTaskSidePanelProgress
				: this.txtGoalSidePanelProgress,
			status: isTask
				? this.txtTaskSidePanelStatus
				: this.txtGoalSidePanelStatus,
			owner: isTask ? this.txtTaskSidePanelOwner : this.txtGoalSidePanelOwner,
			visibility: isTask
				? this.txtTaskSidePanelVisibility
				: this.txtGoalSidePanelVisibility,
			dueBy: isTask ? this.txtTaskSidePanelDueBy : this.txtGoalSidePanelDueBy,
			cycle: isTask ? this.txtTaskSidePanelCycle : this.txtGoalSidePanelCycle,
			level: this.txtGoalSidePanelLevel,
			parentGoal: isTask
				? this.txtTaskSidePanelParentGoal
				: this.txtGoalSidePanelParentGoal,
		};

		if (isTask) {
			baseLocators.startValue = this.txtTaskSidePanelStartValue;
			baseLocators.targetValue = this.txtTaskSidePanelTargetValue;
			baseLocators.currentValue = this.txtTaskSidePanelCurrentValue;
		}

		this._locatorCache[key] = baseLocators;
		return this._locatorCache[key];
	}

	/**
	 * Closes the goal side panel by clicking the close button.
	 *
	 * @returns {Promise<void>}
	 */
	async closeGoalSidePanel() {
		const iframeSidePanel = await PwActions.switchToFrame(
			this.page,
			this.iframeSidePanel,
		);
		await PwActions.click(iframeSidePanel, this.btnGoalSidePanelClose);
	}

	/**
	 * Formats a date string to the expected UI format (e.g., "27 Feb '26").
	 *
	 * @param {string} isoDateString - ISO date string (e.g., "2026-02-27T18:29:59.999Z")
	 * @returns {string} Formatted date string
	 */
	formatGoalDueDate(isoDateString) {
		if (!isoDateString) return "";
		const date = new Date(isoDateString);
		const dayNum = date.getDate();
		const day = dayNum < 10 ? `0${dayNum}` : String(dayNum);
		const month = date.toLocaleString("en-US", { month: "short" });
		const year = String(date.getFullYear()).slice(-2);
		return `${day} ${month} '${year}`;
	}

	/**
	 * Strips HTML tags from a string and normalizes whitespace for comparison with UI text.
	 * @param {string} html - HTML string (e.g. API content field)
	 * @returns {string} Plain text with collapsed whitespace
	 */
	stripHtmlForComparison(html) {
		if (!html || typeof html !== "string") return "";
		return html
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	}

	/**
	 * Verifies goal or task side panel content (title, description, progress, status, owner, visibility, due date, cycle, level).
	 * Used for both main goal and child task verification. Does not handle participants or children.
	 * @param {import("@playwright/test").FrameLocator} iframeSidePanel - Side panel iframe
	 * @param {Object} data - Normalized goal/task data from API
	 */
	async verifySidePanelFieldsVsUi(iframeSidePanel, data) {
		try {
			if (!data || typeof data !== "object") {
				logger.warn("verifySidePanelFieldsVsUi: No data provided, skipping");
				return;
			}
			const {
				name,
				content,
				currentProgress,
				status,
				assigneeDetails,
				visibility,
				dueDate,
				cycleName,
				level,
				alignment,
				startValue,
				endValue,
				currentValue,
				okrMetric,
			} = data;

			const isTask = data.type === "TASK";
			const loc = this.getSidePanelLocators(isTask);
			const hasMetricValues = isTask && okrMetric?.metricType !== "DECISION";

			const visibilityKey =
				visibility && typeof visibility === "object"
					? Object.entries(visibility).find(([, v]) => v)?.[0]
					: null;

			const verifications = [
				name && {
					locator: loc.title,
					expected: name,
					field: isTask ? "Task Title" : "Goal Title",
				},
				content && {
					locator: loc.desc,
					expected: this.stripHtmlForComparison(content),
					field: isTask ? "Task Description" : "Goal Description",
					normalizeWhitespace: true,
				},
				currentProgress !== undefined && {
					locator: loc.progress,
					expected: `${currentProgress}%`,
					field: "Progress",
				},
				status && {
					locator: loc.status,
					expected: constants.goalStatusMapping[status] || status,
					field: "Status",
				},
				assigneeDetails?.fullName && {
					locator: loc.owner,
					expected: assigneeDetails.fullName,
					field: "Owner",
				},
				visibilityKey && {
					locator: loc.visibility,
					expected:
						constants.goalVisibilityMapping[visibilityKey] || visibilityKey,
					field: "Visibility",
				},
				dueDate && {
					locator: loc.dueBy,
					expected: this.formatGoalDueDate(dueDate),
					field: "Due By",
				},
				cycleName && {
					locator: loc.cycle,
					expected: cycleName,
					field: "Cycle",
				},
				level &&
					!isTask && {
						locator: loc.level,
						expected: constants.goalLevelMapping[level] || level,
						field: "Goal Level",
					},
				alignment?.parent?.name && {
					locator: loc.parentGoal,
					expected: alignment.parent.name,
					field: "Parent goal",
				},
				hasMetricValues &&
					startValue !== undefined && {
						locator: loc.startValue,
						expected: String(startValue),
						field: "Start Value",
						isInputValue: true,
					},
				hasMetricValues &&
					endValue !== undefined && {
						locator: loc.targetValue,
						expected: String(endValue),
						field: "Target Value",
						isInputValue: true,
					},
				hasMetricValues &&
					currentValue !== undefined && {
						locator: loc.currentValue,
						expected: String(currentValue),
						field: "Current Value",
						isInputValue: true,
					},
			].filter(Boolean);
			for (const v of verifications) {
				let actualText;
				if (v.isInputValue) {
					actualText = await PwActions.getAttributeValue(
						iframeSidePanel,
						v.locator,
						"value",
					);
				} else {
					actualText = await PwActions.getText(iframeSidePanel, v.locator);
				}
				if (v.normalizeWhitespace) {
					actualText = actualText.replace(/\s+/g, " ").trim();
				}
				await PwActions.verifyTextExpected(actualText, v.expected);
				logger.info(
					`Verified ${v.field}: Expected "${v.expected}", Actual "${actualText}"`,
				);
			}
		} catch (error) {
			logger.error(`verifySidePanelFieldsVsUi failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Unified 3-way verification for the goal side panel. Orchestrates
	 * constants vs API, API vs UI, constants vs UI checks, plus participants
	 * and child tasks/goals verification.
	 *
	 * @param {Object} params
	 * @param {Object|null} [params.expectedData] - Converted constants data from convertGoalPayloadToSnapshotFormat(), or null/omitted to skip constants verification
	 * @param {Object} params.apiData - Raw API response from getGoalSnapshotDetails()
	 * @param {string} [params.surveyId] - Survey ID (required for child task/goal verification)
	 * @param {string} [params.snapshotDataId] - Snapshot ID (required for child task/goal verification)
	 * @returns {Promise<boolean>} true if a child goal redirect occurred
	 *
	 * @example
	 * const apiData = await this.getGoalSnapshotDetails({ surveyId, snapshotDataId });
	 * const expected = constants.convertGoalPayloadToSnapshotFormat(constants.goalData);
	 * const didRedirect = await this.verifyGoalSidePanelDetails({ expectedData: expected, apiData, surveyId, snapshotDataId });
	 * if (!didRedirect) await this.closeGoalSidePanel();
	 */
	async verifyGoalSidePanelDetails({
		expectedData = null,
		apiData,
		surveyId = null,
		snapshotDataId = null,
	}) {
		try {
			const data = apiData?.data ?? apiData;
			if (!data || typeof data !== "object") {
				logger.warn(
					"verifyGoalSidePanelDetails: No API data provided, skipping",
				);
				return false;
			}

			const iframeSidePanel = await PwActions.switchToFrame(
				this.page,
				this.iframeSidePanel,
			);

			const hasExpectedData =
				expectedData &&
				typeof expectedData === "object" &&
				Object.keys(expectedData).length > 0;

			if (hasExpectedData) {
				await this.verifyConstantsVsApi({ expectedData, apiData: data });
			}

			await this.verifySidePanelFieldsVsUi(iframeSidePanel, data);
			logger.info(
				"[Data vs UI] All goal side panel fields verified against data",
			);

			await this.verifyEuiGoalParticipants({
				iframeSidePanel,
				data,
			});

			const didRedirectForChildGoal = await this.verifyEuiGoalChildren({
				iframeSidePanel,
				data,
				expectedData,
				hasExpectedData,
				surveyId,
				snapshotDataId,
			});

			return didRedirectForChildGoal;
		} catch (error) {
			logger.error(`verifyGoalSidePanelDetails failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Compares constants (expected) data against the snapshot API response for
	 * goal/task fields, children existence/count, and participants count/match.
	 * Returns the API data as the consolidated verified object for UI verification.
	 *
	 * @param {Object} params
	 * @param {Object} params.expectedData - Converted constants data
	 * @param {Object} params.apiData - Resolved API response data
	 * @returns {Promise<Object>} The verified API data (consolidated object)
	 */
	async verifyConstantsVsApi({ expectedData, apiData }) {
		const data = apiData?.data ?? apiData;
		const isTask = data.type === "TASK";

		const constantsVsApi = [
			expectedData.name &&
				data.name && {
					expected: expectedData.name,
					actual: data.name,
					field: isTask ? "Task Name" : "Goal Name",
				},
			expectedData.content &&
				data.content && {
					expected: expectedData.content,
					actual: this.stripHtmlForComparison(data.content),
					field: isTask ? "Task Description" : "Goal Description",
				},
			expectedData.status &&
				data.status && {
					expected: expectedData.status,
					actual: data.status,
					field: "Status",
				},
			expectedData.currentProgress !== undefined &&
				data.currentProgress !== undefined && {
					expected: String(expectedData.currentProgress),
					actual: String(data.currentProgress),
					field: "Progress",
				},
			expectedData.assigneeDetails?.fullName &&
				data.assigneeDetails?.fullName && {
					expected: expectedData.assigneeDetails.fullName,
					actual: data.assigneeDetails.fullName,
					field: "Owner",
				},
			expectedData.visibility &&
				data.visibility && {
					expected: Object.keys(expectedData.visibility).find(
						(k) => expectedData.visibility[k],
					),
					actual: Object.keys(data.visibility).find((k) => data.visibility[k]),
					field: "Visibility",
				},
			expectedData.cycleName &&
				data.cycleName && {
					expected: expectedData.cycleName,
					actual: data.cycleName,
					field: "Cycle Name",
				},
			!isTask &&
				expectedData.level &&
				data.level && {
					expected: expectedData.level,
					actual: data.level,
					field: "Goal Level",
				},
			expectedData.alignment?.parent?.name &&
				data.alignment?.parent?.name && {
					expected: expectedData.alignment.parent.name,
					actual: data.alignment.parent.name,
					field: "Parent Goal",
				},
			isTask &&
				expectedData.okrMetric?.metricType &&
				data.okrMetric?.metricType && {
					expected: expectedData.okrMetric.metricType,
					actual: data.okrMetric.metricType,
					field: "Metric Type",
				},
			isTask &&
				expectedData.startValue !== undefined &&
				data.startValue !== undefined && {
					expected: String(expectedData.startValue),
					actual: String(data.startValue),
					field: "Start Value",
				},
			isTask &&
				expectedData.endValue !== undefined &&
				data.endValue !== undefined && {
					expected: String(expectedData.endValue),
					actual: String(data.endValue),
					field: "Target Value",
				},
			isTask &&
				expectedData.currentValue !== undefined &&
				data.currentValue !== undefined && {
					expected: String(expectedData.currentValue),
					actual: String(data.currentValue),
					field: "Current Value",
				},
		].filter(Boolean);

		for (const v of constantsVsApi) {
			await PwActions.verifyTextExpected(v.actual, v.expected);
			logger.info(
				`[Constants vs API] Verified ${v.field}: Expected "${v.expected}", Actual "${v.actual}"`,
			);
		}

		if (
			Array.isArray(expectedData.tasksAndChildGoals) &&
			Array.isArray(data.tasksAndChildGoals)
		) {
			for (const expectedChild of expectedData.tasksAndChildGoals) {
				const matchedChild = data.tasksAndChildGoals.find(
					(c) => c.type === expectedChild.type && c.name === expectedChild.name,
				);
				if (matchedChild) {
					logger.info(
						`[Constants vs API] Verified child ${expectedChild.type} "${expectedChild.name}" exists in API response`,
					);
				} else {
					throw new Error(
						`[Constants vs API] Child ${expectedChild.type} "${expectedChild.name}" from constants not found in API response`,
					);
				}
			}

			await PwActions.verifyTextExpected(
				String(data.tasksAndChildGoals.length),
				String(expectedData.tasksAndChildGoals.length),
			);
			logger.info(
				`[Constants vs API] Verified children count: Expected ${expectedData.tasksAndChildGoals.length}, Actual ${data.tasksAndChildGoals.length}`,
			);
		}

		if (
			Array.isArray(expectedData.participants) &&
			expectedData.participants.length > 0 &&
			Array.isArray(data.participants)
		) {
			await PwActions.verifyTextExpected(
				String(data.participants.length),
				String(expectedData.participants.length),
			);
			logger.info(
				`[Constants vs API] Verified participant count: Expected ${expectedData.participants.length}, Actual ${data.participants.length}`,
			);

			for (const expectedParticipant of expectedData.participants) {
				const matched = data.participants.find(
					(p) =>
						p.fullName === expectedParticipant.fullName &&
						p.role === expectedParticipant.role,
				);
				if (matched) {
					logger.info(
						`[Constants vs API] Verified participant "${expectedParticipant.fullName}" (${expectedParticipant.role}) exists in API response`,
					);
				} else {
					throw new Error(
						`[Constants vs API] Participant "${expectedParticipant.fullName}" (${expectedParticipant.role}) from constants not found in API response`,
					);
				}
			}
		}

		logger.info("[Constants vs API] All matching fields verified successfully");
		return data;
	}

	/**
	 * Verifies participants in the goal side panel: data vs UI presence check.
	 * Constants vs API participant matching is already handled by verifyConstantsVsApi,
	 * so only data-vs-UI verification is needed here (transitive property guarantees
	 * constants vs UI).
	 *
	 * @param {Object} params
	 * @param {import("@playwright/test").FrameLocator} params.iframeSidePanel - Side panel iframe
	 * @param {Object} params.data - Resolved API response data
	 * @returns {Promise<void>}
	 */
	async verifyEuiGoalParticipants({ iframeSidePanel, data }) {
		const { participants } = data;
		if (
			!participants ||
			!Array.isArray(participants) ||
			participants.length === 0
		) {
			return;
		}

		await PwActions.click(iframeSidePanel, this.txtGoalSidePanelParticipants);
		for (const participant of participants) {
			if (participant?.fullName && participant?.role) {
				const roleDisplay =
					constants.goalParticipantRoleMapping?.[participant.role] ||
					participant.role;
				await PwActions.verifyElementIsPresent(
					iframeSidePanel,
					this.txtGoalSidePanelParticipantName(
						participant.fullName,
						roleDisplay,
					),
				);
				logger.info(
					`[Data vs UI] Verified participant present in side panel: ${participant.fullName} (${roleDisplay})`,
				);
			}
		}
	}

	/**
	 * Verifies child tasks and child goals of a main goal using a 3-way check.
	 * For tasks — fetches API snapshot, validates constants vs API via verifyConstantsVsApi,
	 * then API vs UI via verifySidePanelFieldsVsUi. For child goals — delegates to
	 * verifyChildGoalInNewTab (currently disabled). Skips verification entirely if
	 * children array is empty or survey/snapshot IDs are missing.
	 *
	 * @param {object}                                    params
	 * @param {import("@playwright/test").FrameLocator}   params.iframeSidePanel    - Side panel iframe locator
	 * @param {object}                                    params.data               - Resolved API response containing tasksAndChildGoals
	 * @param {object|null}                               params.expectedData       - Converted constants data for 3-way check, or null
	 * @param {boolean}                                   params.hasExpectedData    - Whether constants data is available for comparison
	 * @param {string|null}                               params.surveyId           - Survey ID used for task snapshot API calls (tgC-... format)
	 * @param {string|null}                               params.snapshotDataId     - Parent snapshot ID used for task snapshot API calls (UUID)
	 * @returns {Promise<boolean>} Always false — child goal verification opens a new tab, no redirect occurs
	 *
	 * @example
	 * const didRedirect = await this.verifyEuiGoalChildren({
	 *     iframeSidePanel,
	 *     data: resolvedApiData,
	 *     expectedData: convertedConstants,
	 *     hasExpectedData: true,
	 *     surveyId: "tgC-abc123",
	 *     snapshotDataId: "550e8400-e29b-41d4-a716-446655440000",
	 * });
	 */
	async verifyEuiGoalChildren({
		iframeSidePanel,
		data,
		expectedData,
		hasExpectedData,
		surveyId,
		snapshotDataId,
	}) {
		let didRedirectForChildGoal = false;
		const children = data.tasksAndChildGoals;
		if (
			!Array.isArray(children) ||
			children.length === 0 ||
			!surveyId ||
			!snapshotDataId
		) {
			return didRedirectForChildGoal;
		}

		const tasks = [];
		const goals = [];
		for (const c of children) {
			if (c?.type === "TASK" && c?.name && c?.id != null) tasks.push(c);
			else if (c?.type === "GOAL" && c?.name) goals.push(c);
		}

		const taskDataMap = new Map();
		if (tasks.length > 0) {
			const taskPromises = tasks.map((task) =>
				this.getTaskSnapshotDetails({
					surveyId,
					parentSnapshotDataId: task.parentSnapshotDataId ?? snapshotDataId,
					taskId: task.id,
				}).then((res) => ({ task, data: res?.data ?? res })),
			);
			const taskResults = await Promise.all(taskPromises);
			for (const { task, data: taskData } of taskResults) {
				taskDataMap.set(task.id, taskData);
			}
		}

		for (const child of [...tasks, ...goals]) {
			if (child?.type === "TASK") {
				await PwActions.click(
					iframeSidePanel,
					this.getGoalSidePanelChildItemRow(child.name),
				);
				await PwActions.waitForElement(
					iframeSidePanel,
					this.txtTaskSidePanelTitle,
					10000,
				);
				await PwActions.verifyTextExpected(
					await PwActions.getText(iframeSidePanel, this.txtTaskSidePanelTitle),
					child.name,
				);

				const taskData = taskDataMap.get(child.id);

				if (hasExpectedData && Array.isArray(expectedData.tasksAndChildGoals)) {
					const constantsTask = expectedData.tasksAndChildGoals.find(
						(t) => t.type === "TASK" && t.name === child.name,
					);
					if (constantsTask) {
						await this.verifyConstantsVsApi({
							expectedData: constantsTask,
							apiData: taskData,
						});
					}
				}

				await this.verifySidePanelFieldsVsUi(iframeSidePanel, taskData);

				await this.closeGoalSidePanel();
				await PwActions.waitForElement(
					iframeSidePanel,
					this.txtGoalSidePanelTitle,
					10000,
				);
				logger.info(
					`Verified child task "${child.name}" in side panel; parent goal remains open`,
				);
			} else if (child?.type === "GOAL") {
				// await this.verifyChildGoalInNewTab({ iframeSidePanel, childGoalName: child.name });
				// didRedirectForChildGoal = false;
			}
		}

		return didRedirectForChildGoal;
	}

	/**
	 * Verifies a child goal by opening it in a new tab, logging in as admin, and checking the goal side panel.
	 * This avoids navigating away from the survey page.
	 *
	 * @param {import("@playwright/test").FrameLocator} iframeSidePanel - The side panel iframe
	 * @param {string} childGoalName - The name of the child goal to verify
	 * @returns {Promise<void>}
	 */
	async verifyChildGoalInNewTab({ iframeSidePanel, childGoalName }) {
		const browser = this.page.context();

		await PwActions.click(
			iframeSidePanel,
			this.getGoalSidePanelChildItemRow(childGoalName),
		);
		await PwActions.waitForElement(
			iframeSidePanel,
			this.btnGoalSidePanelRedirectConfirm,
			10000,
		);

		const newPagePromise = browser.waitForEvent("page");
		await PwActions.click(
			iframeSidePanel,
			this.btnGoalSidePanelRedirectConfirm,
		);
		const newPage = await newPagePromise;
		await PwActions.waitForDOMContentLoaded(newPage, 15000);
		logger.info(`New tab opened for child goal "${childGoalName}"`);

		const loginPage = new LoginPage(newPage);
		await loginPage.login(newPage, envDetails.adminEmail, envDetails.password);
		logger.info("Logged in as admin in the new tab");

		await PwActions.waitForElement(newPage, this.btnGoalSidePanelClose, 15000);
		const isSidePanelVisible = await PwActions.elementIsVisible(
			newPage,
			this.btnGoalSidePanelClose,
		);
		if (!isSidePanelVisible) {
			throw new Error(
				`Goal side panel not visible for child goal "${childGoalName}" in new tab`,
			);
		}
		logger.info(
			`Verified goal side panel is visible for child goal "${childGoalName}" in new tab`,
		);

		const actualTitle = await PwActions.getText(
			newPage,
			this.txtGoalSidePanelTitle,
		);
		await PwActions.verifyTextExpected(actualTitle, childGoalName);
		logger.info(
			`[Constants vs UI] Verified child goal title: Expected "${childGoalName}", Actual "${actualTitle}"`,
		);

		await PwActions.closeTab(newPage);
		logger.info("Closed the new tab; returning to original survey page");
	}

	/**
	 * Verifies that the goal side panel is visible and contains expected elements.
	 *
	 * @returns {Promise<boolean>} True if the side panel is visible
	 */
	async isGoalSidePanelVisible() {
		const iframeSidePanel = await PwActions.switchToFrame(
			this.page,
			this.iframeSidePanel,
		);
		return await PwActions.elementIsVisible(
			iframeSidePanel,
			this.txtGoalSidePanelTitle,
		);
	}

	/**
	 * Gets all goals from the current goal-based question using the public config.
	 *
	 * @param {string|number} questionId - The question ID
	 * @returns {Array} Array of goal objects with snapShotDataId, name, etc.
	 */
	getGoalsForQuestion(questionId) {
		const config = this.surveyPublicConfig?.data;
		if (!config) return [];
		const goalBlock = config.goalData?.[String(questionId)];
		if (!goalBlock || !Array.isArray(goalBlock.goals)) return [];
		return goalBlock.goals;
	}

	/**
	 * Verifies that the survey content displayed in the UI matches the expected content from the builder.
	 * This function retrieves the survey content from the API and compares it with the questions in the builder
	 *
	 * Steps performed:
	 * Open the survey URL from the received email
	 * Fetch the survey content (questions) via API.
	 * Open a new tab in the browser and navigate to the survey URL.
	 * Iterate over the sections and questions from the API response and store questions in an array.
	 * Compare the Questions showing EUI and Questions available in Bulder including questions order.
	 * If any mismatch is found, an error is thrown.
	 *
	 * @param {Object} browser - The browser instance
	 * @param {string} surveyName - The name of the survey
	 * @param {string} cookie - The cookie value to authenticate and fetch the survey data via API.
	 * @param {Array} questionsInBuilder - Question names present in survey builder.
	 *
	 * @throws {Error} - Throws an error if the survey content does not match the expected content in EUI.
	 */

	async verifySurveyContentInUi(
		browser,
		surveyName,
		cookie,
		questionsInBuilder,
		surveyUrl = null,
	) {
		await this.initializeCommonPageFunctions();
		let survey_url = surveyUrl;
		const questionNamesInEui = [];
		this.survey_id = EntityIds.getsurveyId();
		const allQuestionsInBuilder = questionsInBuilder.map((question) => {
			return question.replace(/\s+/g, " ").trim();
		});
		const selfEmailBody = constants.getSelfEmailBody(
			constants.subjectName,
			surveyName,
		);
		if (!survey_url)
			survey_url =
				await this._commonPageFunctions.open_survey_from_received_email(
					constants.self_email_subject,
					constants.subject_email,
					selfEmailBody,
				);
		const api_data =
			await this._commonPageFunctions.getsurveyAPIDetails(cookie);
		const page2 = await PwActions.openNewTab(browser);
		await PwActions.goTo(page2, survey_url);
		await PwActions.click(page2, this.btnStartSurvey);
		for (const section of api_data.sections) {
			for (const question of section.questions) {
				if (question.rawTxt != null) {
					questionNamesInEui.push(question.rawTxt.replace(/\n/g, " ").trim());
				} else {
					questionNamesInEui.push(question.txt.replace(/\n/g, " ").trim());
				}
			}
		}
		try {
			await this.commonUtils.compareArrays(
				allQuestionsInBuilder,
				questionNamesInEui,
			);
		} catch (error) {
			logger.error(`Error comparing arrays: ${error.message}`);
			throw new Error(`Survey content mismatch: ${error.message}`);
		}
		await PwActions.closeTab(page2);
	}

	async selectLanguage(language, page = null) {
		const targetPage = page || this.page;
		await PwActions.forceClick(targetPage, this.dropdownLanguageSelector);
		await PwActions.click(targetPage, this.btnLanguage(language));
	}

	/**
	 * Verifies that the language in the EUI (End User Interface) is correctly set.
	 *
	 * This function selects the specified language, verifies that the welcome text and start survey button
	 * are translated correctly, and then attends the survey with the specified language.
	 *
	 * @param {object} page - The page instance.
	 * @param {string} language - The expected language code (e.g., "fr" for French, "es" for Spanish).
	 * @param {string} cookie - The authentication cookie.
	 * @param {string} participant - The participant type.
	 */
	async verifyLanguageInEUI(
		page,
		language,
		cookie,
		participant,
		settings = ["Choose Language"],
	) {
		this.page = page;
		if (
			settings.includes("Choose Language") &&
			!settings.includes("Don't choose language")
		) {
			await this.selectLanguage(language);
		}
		const welcomeTextFirstSection = await PwActions.getText(
			this.page,
			this.txtWelcomePageTextFirstSection,
		);
		await PwActions.verifyTextExpected(
			await this.commonUtils.getTextLanguage(welcomeTextFirstSection),
			language,
		);
		await this.verifyTextIsTranslatedAsExpected(
			await PwActions.getText(this.page, this.btnStartSurvey),
			language,
		);
		await this.attend_survey_with_multilanuage(
			page,
			cookie,
			participant,
			language,
		);
	}

	/**
	 * Verifies that the text in a section is in the specified language.
	 *
	 * This function checks the language of the section name, all question texts within the section,
	 * and the text of the next button to ensure they are in the specified language.
	 *
	 * @param {string} language - The expected language code (e.g., "fr" for French, "es" for Spanish).
	 */

	async verifyLanguageInSection(language) {
		const sectionName = await PwActions.getText(
			this.page,
			this.textSectionName,
		);
		await PwActions.verifyTextExpected(
			await this.commonUtils.getTextLanguage(sectionName),
			language,
		);
		const elements = await PwActions.getWebElements(
			this.page,
			this.webElementsQuestionText,
		);
		for (const element of elements) {
			const questionText = await PwActions.getText(this.page, element);
			await PwActions.verifyTextExpected(
				await this.commonUtils.getTextLanguage(questionText),
				language,
			);
		}
		await PwActions.verifyTextExpected(
			await this.commonUtils.getTextLanguage(
				await PwActions.getText(this.page, this.txtNextButton),
			),
			language,
		);
	}

	/**
	 * Detects the language of the given text.
	 *
	 * This function uses language detection libraries to determine the language code of the provided text.
	 * It first tries to detect the language using the `franc` library. If the detected language is not found
	 * in the `languagesList`, it uses the `langdetect` library as a fallback. For Chinese, it normalizes the
	 * language code to "zh". Finally, it returns the language name using the `iso6391` library.
	 *
	 * @param {string} text - The text whose language is to be detected.
	 */
	async getTextLanguage(text) {
		let textCode = franc(text);
		let language = languagesList[textCode];
		if (language === undefined) {
			textCode = langdetect.detectOne(text);
			if (textCode === "zh-cn") {
				textCode = "zh";
			}
			language = iso6391.getName(textCode);
		}
		return language;
	}

	/**
	 * Verifies that the given text is translated from English.
	 *
	 * This function uses language detection libraries to determine the language of the provided text.
	 * It checks that the detected language is not English, indicating that the text has been translated.
	 *
	 * @param {string} text - The text to be verified.
	 */
	async verifyTextIsTranslatedAsExpected(text, language) {
		const languageCode = await this.commonUtils.getTextLanguage(text);
		await PwActions.verifyTextExpected(languageCode, language);
	}

	/**
	 * Attends an Engage/Pulse survey by opening it in a new tab and completing it.
	 *
	 * @param {Object} params - The parameters for attending the survey.
	 * @param {string} params.survey_url - The URL of the survey to attend.
	 * @param {Browser} params.browser - The browser instance to use for opening a new tab.
	 * @param {string} [params.subjectName=constants.subjectName] - The name of the participant attending the survey.
	 * @param {Array} [params.settings=[]] - Additional settings for attending the survey.
	 */

	async attendEngagePulseSurvey({
		survey_url,
		browser,
		subjectName = constants.subjectName,
		settings = [],
	}) {
		const page2 = await PwActions.openNewTab(browser);
		await PwActions.goTo(page2, survey_url);
		await this.attendSurvey({
			page: page2,
			subject: "Subject",
			participantName: subjectName,
			settings: settings,
		});
		// Save the survey response data to JSON file
		const surveyResponse = await this.getResponse();
		await this.commonUtils.addDataToJsonFile(
			`${EntityIds.getsurveyName()} Survey Response.json`,
			surveyResponse,
		);
		await PwActions.closeTab(page2);
	}

	/**
	 * Verifies that the 'Start Survey' button is visible on the page.
	 *
	 * This function uses Playwright's expect method to assert that the 'Start Survey' button is visible.
	 * It is useful for confirming that the survey can be started by the user.
	 *
	 * @param {object} page - The page instance.
	 */

	async verifyStartSurveyButtonIsVisibleInSurvey() {
		await expect(this.page.locator(this.btnStartSurvey)).toBeVisible();
	}

	/**
	 * Verifies that the 'Start Survey' button is not visible on the page.
	 *
	 * This function uses Playwright's expect method to assert that the 'Start Survey' button is not visible.
	 * It is useful for confirming that the survey cannot be started by the user.
	 *
	 * @param {object} page - The page instance.
	 */

	async verifyStartSurveyButtonIsNotVisible() {
		await expect(this.page.locator(this.btnStartSurvey)).not.toBeVisible();
	}

	/**
	 * Verifies that the 'It's Over' text is visible on the page.
	 *
	 * This function uses Playwright's expect method to assert that the 'It's Over' text is visible.
	 * It is useful for confirming that the survey has been completed and no further actions are required.
	 *
	 * @param {object} page - The page instance.
	 */

	async verifyItsOverTextIsVisibleInSurvey() {
		await expect(this.page.locator(this.lblItsOver)).toBeVisible();
	}

	/**
	 * Verify the user is not able to attend engage/pulse survey after cutoff date
	 *
	 * @param {string} survey_url - The URL of the survey to attend.
	 * @param {object} browser - The Playwright browser instance.
	 * @param {Array} cookieValue - An array of cookies to set in the browser context.
	 *
	 */

	async verifySurveyCutOffTime(survey_url, browser, cookieValue) {
		const page2 = await PwActions.openNewTab(browser);
		await PwActions.goTo(page2, survey_url);
		await PwActions.waitTillVisible(page2, this.txtSurveyOver);
		await PwActions.verifyElementIsPresent(page2, this.txtSurveyOver);
		await PwActions.closeTab(page2);
	}

	/**
	 * Verifies the presence of variables in the survey
	 * @param {object} variableData - The data containing the variable information
	 * @param {string} surveyUrl - The URL of the survey
	 * @param {object} browser - The Playwright browser instance
	 * @param {boolean} visible - Whether the variable should be visible
	 * @example
	 * Let's say you have a survey and you want to verify the variables, Then call this function with the variable data, survey URL, browser instance and visible as the parameter.
	 * await this.attendSurveyEUI.verifyVariablesInSurvey(variableData,surveyUrl,browser,visible);
	 *
	 * @example
	 * Let's say you have a survey and you want to verify the variables are not visible, Then call this function with the variable data, survey URL, browser instance and visible as the parameter.
	 * await this.attendSurveyEUI.verifyVariablesInSurvey(variableData,surveyUrl,browser,false);
	 */

	async verifyVariablesInSurvey(
		variableData,
		surveyUrl,
		browser,
		visible = true,
	) {
		const page2 = await PwActions.openNewTab(browser);
		await PwActions.goTo(page2, surveyUrl);
		for (const data of variableData.data) {
			if (data.area === "Survey Header") {
				const surveyHeaderText = await PwActions.getText(
					page2,
					this.surveyHeader,
				);
				if (!visible) {
					expect(surveyHeaderText).not.toContain(data.variableName);
					break;
				} else {
					expect(surveyHeaderText).toContain(data.variableName);
					break;
				}
			}
		}
		await PwActions.click(page2, this.btnStartSurvey);
		for (const data of variableData.data) {
			if (data.area === "Section Header") {
				const sectionHeaderText = await PwActions.getText(
					page2,
					this.textSectionName,
				);
				if (!visible) {
					expect(sectionHeaderText).not.toContain(data.variableName);
				} else {
					expect(sectionHeaderText).toContain(data.variableName);
				}
			} else if (data.area === "Question") {
				const questionText = await PwActions.getText(
					page2,
					this.lblQuestionElement(data.qno),
				);
				if (!visible) {
					expect(questionText).not.toContain(data.variableName);
				} else {
					expect(questionText).toContain(data.variableName);
				}
			}
		}
		await PwActions.closeTab(page2);
	}

	/**
	 * Verifies the presence of mandatory question in the survey
	 * @param {string} surveyUrl - The URL of the survey
	 * @param {object} browser - The Playwright browser instance
	 * @param {number} sectionNumber - The number of the section
	 * @param {number} questionNumber - The number of the question
	 * @param {boolean} visible - Whether the mandatory question should be visible
	 * @example
	 * Let's say you have a question and you want to verify the mandatory question, Then call this function with the survey URL, browser instance, section number and question number as the parameter.
	 * await this.attendSurveyEUI.verifyQuestionValidationBehavior(surveyUrl,browser,sectionNumber,questionNumber);
	 * @example
	 * Let's say you have a question and you want to verify the mandatory question is not visible, Then call this function with the survey URL, browser instance, section number and question number as the parameter.
	 * await this.attendSurveyEUI.verifyQuestionValidationBehavior(surveyUrl,browser,sectionNumber,questionNumber,false);
	 */

	async verifyQuestionValidationBehavior(
		surveyUrl,
		browser,
		sectionNumber,
		questionNumber,
		visible = true,
	) {
		const page2 = await PwActions.openNewTab(browser);
		try {
			await PwActions.goTo(page2, surveyUrl);
			await PwActions.click(page2, this.btnStartSurvey);
			if (await PwActions.elementIsVisible(page2, this.btnNext)) {
				await PwActions.click(page2, this.btnNext);
			} else {
				await PwActions.click(page2, this.btnSubmit);
			}
			const errorMessageElement = this.lblQuestionValidationError(
				sectionNumber,
				questionNumber,
			);
			if (visible) {
				await PwActions.waitTillVisible(page2, errorMessageElement);
				await PwActions.verifyElementIsPresent(page2, errorMessageElement);
			} else {
				await PwActions.verifyElementIsNotPresent(page2, errorMessageElement);
			}
		} finally {
			await PwActions.closeTab(page2);
		}
	}

	/**
	 * Verifies MCQ min/max selection constraint validation in EUI
	 * @param {object} settings - Configuration object
	 * @param {string} settings.surveyUrl - The URL of the survey
	 * @param {object} settings.browser - The Playwright browser instance
	 * @param {number} settings.sectionNumber - The section number of the question
	 * @param {number} settings.questionNumber - The question number
	 * @param {string} [settings.questionName] - The question name/text (optional, will be fetched if not provided)
	 * @param {number} settings.minSelection - Minimum number of selections required
	 * @param {number} settings.maxSelection - Maximum number of selections allowed
	 * @example
	 * await this.attendSurveyEUI.verifyMCQMinMaxSelectionConstraint({
	 *   surveyUrl: surveyUrl,
	 *   browser: browser,
	 *   sectionNumber: 1,
	 *   questionNumber: 2,
	 *   minSelection: 2,
	 *   maxSelection: 3
	 * });
	 */

	async verifyMCQMinMaxSelectionConstraint(settings = {}) {
		const {
			surveyUrl,
			browser,
			sectionNumber,
			questionNumber,
			questionName: providedQuestionName,
			minSelection,
			maxSelection,
		} = settings;

		const page2 = await PwActions.openNewTab(browser);
		try {
			await PwActions.goTo(page2, surveyUrl);
			await PwActions.click(page2, this.btnStartSurvey);

			const questionName =
				providedQuestionName ||
				(await PwActions.getText(
					page2,
					this.mcqQuestionTitleByIndex(questionNumber),
				));

			const minErrorMessage = this.errorMCQMinSelection(
				questionName,
				minSelection,
			);
			const maxErrorMessage = this.errorMCQMaxSelection(
				questionName,
				maxSelection,
			);

			logger.info(
				`Testing min constraint: Selecting 1 option when minimum is ${minSelection}`,
			);
			await PwActions.click(page2, this.mcqOptionByIndex(questionNumber, 1));
			await CommonUtils.sleep(1);
			if (await PwActions.elementIsVisible(page2, this.btnNext)) {
				await PwActions.click(page2, this.btnNext);
			} else {
				await PwActions.click(page2, this.btnSubmit);
			}
			await PwActions.waitTillVisible(page2, minErrorMessage);
			await PwActions.verifyElementIsPresent(page2, minErrorMessage);
			const minErrorText = await PwActions.getText(page2, minErrorMessage);
			logger.info(
				`✓ Min selection constraint validation: "${minErrorText}" displayed correctly`,
			);

			await PwActions.click(page2, this.mcqOptionByIndex(questionNumber, 1));
			await CommonUtils.sleep(1);

			logger.info(
				`Testing max constraint: Attempting to select ${maxSelection + 1} options when maximum is ${maxSelection}`,
			);
			for (let i = 1; i <= maxSelection; i++) {
				await PwActions.click(page2, this.mcqOptionByIndex(questionNumber, i));
				await CommonUtils.sleep(0.5);
			}
			const maxPlusOneOption = this.mcqOptionByIndex(
				questionNumber,
				maxSelection + 1,
			);
			const isClickable = await page2
				.locator(maxPlusOneOption)
				.isEnabled({ timeout: 3000 })
				.catch(() => false);
			if (isClickable) {
				await PwActions.click(page2, maxPlusOneOption);
				await CommonUtils.sleep(1);
				const maxErrorVisible = await PwActions.elementIsVisible(
					page2,
					maxErrorMessage,
				);
				if (maxErrorVisible) {
					await PwActions.verifyElementIsPresent(page2, maxErrorMessage);
					const maxErrorText = await PwActions.getText(page2, maxErrorMessage);
					logger.info(
						`✓ Max selection constraint: "${maxErrorText}" displayed correctly`,
					);
				} else {
					const activeCheckboxes = await PwActions.getWebElements(
						page2,
						this.inputActiveCheckBoxes(questionNumber),
					);
					expect(activeCheckboxes.length).toBeLessThanOrEqual(maxSelection);
					logger.info(
						"✓ Max selection constraint: System auto-deselects or prevents over-selection",
					);
				}
			} else {
				logger.info(
					"✓ Max selection constraint: Option disabled after reaching max",
				);
			}

			for (let i = 1; i <= maxSelection; i++) {
				const isSelected = await page2
					.locator(this.mcqOptionByIndex(questionNumber, i))
					.evaluate((el) => el.classList.contains("active"));
				if (isSelected) {
					await PwActions.click(
						page2,
						this.mcqOptionByIndex(questionNumber, i),
					);
					await CommonUtils.sleep(0.3);
				}
			}
			logger.info(
				`Testing valid selection: Selecting ${minSelection} options (within ${minSelection}-${maxSelection} range)`,
			);
			for (let i = 1; i <= minSelection; i++) {
				await PwActions.click(page2, this.mcqOptionByIndex(questionNumber, i));
				await CommonUtils.sleep(0.5);
			}
			if (await PwActions.elementIsVisible(page2, this.btnNext)) {
				await PwActions.click(page2, this.btnNext);
			} else {
				await PwActions.click(page2, this.btnSubmit);
			}
			await PwActions.verifyElementIsNotPresent(page2, minErrorMessage);
			await PwActions.verifyElementIsNotPresent(page2, maxErrorMessage);
			logger.info(
				"✓ Valid selection: Successfully proceeded with valid number of selections (no errors)",
			);
		} finally {
			await PwActions.closeTab(page2);
		}
	}

	async verifyOtherOption(page, questionNames) {
		if (!questionNames || questionNames.length === 0) {
			throw new Error('questionNames is required to locate "Other" buttons');
		}

		logger.info(
			`Looking for "Other" buttons in ${questionNames.length} question(s)`,
		);
		const otherButtons = [];

		for (const questionName of questionNames) {
			const xpath = this.getMCQOtherButtonXpath(questionName);
			const buttons = await PwActions.getWebElements(page, xpath).catch(
				() => [],
			);

			if (buttons.length > 0) {
				logger.info(
					`Found ${buttons.length} "Other" button(s) for question: "${questionName}"`,
				);
				otherButtons.push(...buttons);
			}
		}

		if (otherButtons.length === 0) {
			throw new Error(
				`No "Other" buttons found for questions: ${questionNames.join(", ")}`,
			);
		}

		logger.info(`Total "Other" button(s) to click: ${otherButtons.length}`);

		for (let i = 0; i < otherButtons.length; i++) {
			await otherButtons[i].click();
			await CommonUtils.sleep(0.5);
			logger.info(
				`✓ Clicked "Other" button ${i + 1}/${otherButtons.length} to reveal text input`,
			);
		}
	}

	async verifyTextareaPlaceholder(
		page,
		expectedLanguage,
		questionType,
		questionNames,
		switchLanguage = false,
	) {
		logger.info(
			`Verifying placeholders for ${questionType} questions: ${questionNames.join(", ")}`,
		);

		if (switchLanguage) {
			await this.selectLanguage(expectedLanguage, page);
			await CommonUtils.sleep(2);
			logger.info(`✓ Switched language to ${expectedLanguage}`);
		}

		const textareaXpath = `//textarea`;
		const allTextareas = await PwActions.getWebElements(
			page,
			textareaXpath,
		).catch(() => []);

		if (allTextareas.length === 0) {
			throw new Error(`No textarea elements found on the page`);
		}

		logger.info(`Found ${allTextareas.length} textarea(s) to verify`);

		let verifiedCount = 0;

		for (const element of allTextareas) {
			const rawPlaceholder = await element.getAttribute("placeholder");
			const placeholderText = CommonUtils.normalizeText(rawPlaceholder);

			if (this.isTranslatablePlaceholder(placeholderText)) {
				const detectedLanguage = await this.getTextLanguage(placeholderText);
				await PwActions.verifyTextExpected(detectedLanguage, expectedLanguage);
				logger.info(
					`✓ Placeholder verified: "${placeholderText}" is in ${expectedLanguage}`,
				);
				verifiedCount++;
			}
		}

		if (verifiedCount === 0) {
			logger.warn("⚠️ No translatable placeholders found");
		} else {
			logger.info(
				`✓ Successfully verified ${verifiedCount} placeholder translation(s)`,
			);
		}
	}

	isTranslatablePlaceholder(placeholderText) {
		return (
			placeholderText &&
			!placeholderText.includes("@") &&
			!placeholderText.match(/^\d+$/)
		);
	}

	/**
	 * Verifies placeholder translations in EUI for text input questions
	 * @param {object} settings - Configuration object
	 * @param {string} settings.surveyUrl - The URL of the survey
	 * @param {object} settings.browser - The Playwright browser instance
	 * @param {string} settings.expectedLanguage - The expected language of the placeholder
	 * @param {string} settings.questionType - Type of question: "TEXT" or "MCQ" (required)
	 * @param {string[]} settings.questionNames - Array of question names/titles (required)
	 * @param {boolean} [settings.switchLanguage] - Whether to switch language before verification (default: false)
	 * @example
	 * // For MCQ questions with "Others" option
	 * await this.attendSurveyEUI.verifyPlaceholderTranslation({
	 *   surveyUrl: surveyUrl,
	 *   browser: browser,
	 *   expectedLanguage: "Tamil",
	 *   questionType: "MCQ",
	 *   switchLanguage: true,
	 *   questionNames: ["MCQ Single Select with Others Predefined", "MCQ Multi Select with Others Predefined"]
	 * });
	 *
	 * // For TEXT input questions
	 * await this.attendSurveyEUI.verifyPlaceholderTranslation({
	 *   surveyUrl: surveyUrl,
	 *   browser: browser,
	 *   expectedLanguage: "Tamil",
	 *   questionType: "TEXT",
	 *   switchLanguage: true,
	 *   questionNames: ["What is your feedback?", "Any suggestions?"]
	 * });
	 */

	async verifyPlaceholderTranslation({
		surveyUrl,
		browser,
		expectedLanguage,
		questionType,
		questionNames = [],
		switchLanguage = false,
	} = {}) {
		if (!questionType || !["TEXT", "MCQ"].includes(questionType)) {
			throw new Error(
				'questionType is required and must be either "TEXT" or "MCQ"',
			);
		}

		if (!questionNames || questionNames.length === 0) {
			throw new Error("questionNames is required to locate placeholders");
		}

		const page2 = await PwActions.openNewTab(browser);

		try {
			await PwActions.goTo(page2, surveyUrl);
			await PwActions.click(page2, this.btnStartSurvey);
			await CommonUtils.sleep(2);

			if (questionType === "MCQ") {
				await this.verifyOtherOption(page2, questionNames);
			}

			await this.verifyTextareaPlaceholder(
				page2,
				expectedLanguage,
				questionType,
				questionNames,
				switchLanguage,
			);
		} finally {
			await PwActions.closeTab(page2);
		}
	}

	/**
	 * Verifies the presence of images in the survey
	 * @param {string} surveyUrl - The URL of the survey
	 * @param {object} browser - The Playwright browser instance
	 * @param {object} imageData - The data containing the image information
	 * @param {string} filePath - Path of the image to be compared
	 * @example
	 * Let's say you have a survey and you want to verify the image, Then call this function with the survey URL, browser instance, image data and file path as the parameter.
	 * await this.attendSurveyEUI.verifyImageInSurvey(surveyUrl,browser,imageData,filePath);
	 */
	async verifyImageInSurvey(surveyUrl, browser, imageData) {
		const page2 = await PwActions.openNewTab(browser);
		try {
			await PwActions.goTo(page2, surveyUrl);
			for (const data of imageData.data) {
				if (data.area === "Survey Intro") {
					await CommonUtils.sleep(3);
					const backgroundImageUrl = await PwActions.getBackgroundImageUrl(
						page2,
						this.surveyIntroImage,
					);
					const filePath = await PwActions.downloadBase64ImageToPath(
						page2,
						backgroundImageUrl,
						"downloaded_image.jpeg",
					);
					await CommonUtils.compareImages(data.imagePath, filePath, 0);
					await this.commonUtils.deleteFile(filePath);
					break;
				}
			}
			await PwActions.click(page2, this.btnStartSurvey);
			for (const data of imageData.data) {
				if (data.area === "Section Header") {
					const sectionHeaderImageUrl = await PwActions.getBackgroundImageUrl(
						page2,
						this.sectionHeaderImage,
					);
					const filePath = await PwActions.downloadBase64ImageToPath(
						page2,
						sectionHeaderImageUrl,
						"downloaded_image.jpeg",
					);
					await CommonUtils.compareImages(data.imagePath, filePath, 0);
					await this.commonUtils.deleteFile(filePath);
				}
			}
		} finally {
			await PwActions.closeTab(page2);
		}
	}

	/**
	 * Verifies the rating scale in the survey
	 * @param {string} surveyUrl - The URL of the survey
	 * @param {object} browser - The Playwright browser instance
	 * @param {object} scaleData - The data containing the scale information
	 * @param {number} questionNumber - The number of the question to verify the rating scale
	 * @example
	 * Let's say you have a question and you want to verify the rating scale, Then call this function with the survey URL, browser instance, scale data and question number as the parameter.
	 * await this.attendSurveyEUI.verifyQuestionRatingScaleTooltips(surveyUrl,browser,scaleData,questionNumber);
	 */
	async verifyQuestionRatingScaleTooltips(
		surveyUrl,
		browser,
		scaleData,
		questionNumber,
	) {
		const page2 = await PwActions.openNewTab(browser);
		try {
			await PwActions.goTo(page2, surveyUrl);
			await PwActions.click(page2, this.btnStartSurvey);
			const btnsAllAvailableScalesForEachQuestion =
				await PwActions.getWebElements(
					page2,
					this.webElementsAllAvailableScalesForEachQuestion(questionNumber),
				);
			expect(btnsAllAvailableScalesForEachQuestion.length).toBe(
				scaleData.data.length,
			);
			const tooltipElements = await PwActions.getWebElements(
				page2,
				this.webElementTooltipForRatingScaleForEachQuestion(questionNumber),
			);
			for (
				let i = 0;
				i < scaleData.data.length &&
				i < btnsAllAvailableScalesForEachQuestion.length &&
				i < tooltipElements.length;
				i++
			) {
				const btn = btnsAllAvailableScalesForEachQuestion[i];
				const tooltipElement = tooltipElements[i];
				const scaleDataItem = scaleData.data[i];

				await btn.hover();
				const tooltipText = await tooltipElement.textContent();
				await PwActions.verifyTextExpected(tooltipText, scaleDataItem.value);
			}
		} finally {
			await PwActions.closeTab(page2);
		}
	}

	/**
	 * Verifies whether the content is in the source language
	 * @param {string} surveyUrl - The URL of the survey
	 * @param {object} cookieValue - The cookie value
	 * @param {object} browser - The Playwright browser instance
	 * @param {string} language - The language to verify
	 * @example
	 * Let's say you want to verify whether the content is in the source language, Then call this function with the survey URL, cookie value, browser instance and language as the parameter.
	 * await this.attendSurveyEUI.verifyWhetherContentIsInSourceLanguage(surveyUrl,cookieValue,browser,language);
	 */
	async verifyWhetherContentIsInSourceLanguage(
		surveyUrl,
		cookieValue,
		browser,
		language,
	) {
		await this.initializeCommonPageFunctions();
		const page2 = await PwActions.openNewTab(browser);
		try {
			await PwActions.goTo(page2, surveyUrl);
			const api_data = await this.getsurveyAPIDetailsFromPublicConfig(
				page2,
				cookieValue,
			);
			await PwActions.waitForElement(page2, this.btnStartSurvey, 12000);
			if (await PwActions.elementIsVisible(page2, this.btnStartSurvey)) {
				await PwActions.click(page2, this.btnStartSurvey);
			}
			let sectioncount = 0;
			const number_of_sections = api_data.data
				? api_data.data.sections
				: api_data.sections;
			let sectionNameText = "";
			for (const section of number_of_sections) {
				sectioncount++;
				await CommonUtils.sleep(2);
				if (
					await PwActions.elementIsVisible(
						page2,
						this.textSectionNameIfImageAdded,
					)
				) {
					sectionNameText = await PwActions.getText(
						page2,
						this.textSectionNameIfImageAdded,
					);
				} else {
					sectionNameText = await PwActions.getText(
						page2,
						this.textSectionName,
					);
				}
				const sectionLanguage =
					await this.commonUtils.getTextLanguage(sectionNameText);
				await PwActions.verifyTextExpected(sectionLanguage, language);

				// Check section description (with or without image)
				await CommonUtils.sleep(2);
				const sectionDescSelector = (await PwActions.elementIsVisible(
					page2,
					this.textSectionDescriptionIfImageAdded,
				))
					? this.textSectionDescriptionIfImageAdded
					: this.txtSectionDescription;

				if (await PwActions.elementIsVisible(page2, sectionDescSelector)) {
					const sectionDescText = await PwActions.getText(
						page2,
						sectionDescSelector,
					);
					const sectionDescLanguage =
						await this.commonUtils.getTextLanguage(sectionDescText);
					await PwActions.verifyTextExpected(sectionDescLanguage, language);
				}

				let questionCount = 0;
				for (let i = 0; i < section.questions.length; i++) {
					questionCount++;
					const questionText = await PwActions.getText(
						page2,
						this.getQuestionTitleXpath(questionCount),
					);
					const questionLanguage =
						await this.commonUtils.getTextLanguage(questionText);
					await PwActions.verifyTextExpected(questionLanguage, language);
				}
				if (sectioncount < number_of_sections.length) {
					await CommonUtils.sleep(2);
					await PwActions.click(page2, this.btnNext);
					if (await PwActions.elementIsVisible(page2, this.errorIndicator)) {
						await this.attendAllMandatoryQuestionOnASection(page2);
					}
				} else {
					logger.info(
						`Completed verification of all ${number_of_sections.length} sections in ${language} language`,
					);
				}
			}
		} finally {
			await PwActions.closeTab(page2);
		}
	}

	/**
	 * Verifies the question configuration
	 * @param {string} surveyUrl - The URL of the survey
	 * @param {object} browser - The Playwright browser instance
	 * @param {object} questionConfigurationData - The data containing the question configuration information
	 * @returns {Promise<void>}
	 * @example
	 * Let's say you have a question and you want to verify the question configuration, Then call this function with the survey URL, browser instance and question configuration data as the parameter.
	 * await this.attendSurveyEUI.verifyQuestionConfiguration(surveyUrl,browser,questionConfigurationData);
	 */
	async verifyQuestionConfiguration(
		surveyUrl,
		browser,
		questionConfigurationData,
	) {
		const page2 = await PwActions.openNewTab(browser);
		try {
			await PwActions.goTo(page2, surveyUrl);
			await PwActions.waitForCompletePageLoad(page2);
			const {
				questionType,
				questionNumber,
				sectionNumber,
				scale,
				startFromZero,
				type,
				markAsMandatory,
				placeholder,
				includeOther,
				scaleLabels,
				makeReasonMandatory,
				includeNA,
				questionMethod,
			} = questionConfigurationData;

			let needsNavigation = false;
			let currentSectionNumber = 1;
			await CommonUtils.sleep(5);
			if (await PwActions.elementIsVisible(page2, this.btnStartSurvey)) {
				await PwActions.click(page2, this.btnStartSurvey);
			}
			const questionNumbersElements = await PwActions.getWebElements(
				page2,
				this.webElementsQuestionNumbers,
			);
			if (questionNumbersElements.length > 0) {
				const questionNumbers = await PwActions.getElementsText(
					page2,
					questionNumbersElements,
				);
				if (questionNumbers.length > 0) {
					currentSectionNumber = Number.parseInt(
						questionNumbers[0].split(".")[0],
					);
					needsNavigation = currentSectionNumber < sectionNumber;
				}
			}
			if (needsNavigation) {
				for (let i = currentSectionNumber; i < sectionNumber; i++) {
					await PwActions.click(page2, this.btnNext);
					if (await PwActions.elementIsVisible(page2, this.errorIndicator)) {
						await this.attendAllMandatoryQuestionOnASection(page2);
					}
				}
			}
			if (sectionNumber > 1) {
				await PwActions.waitForDOMContentLoaded(page2, 15000);
				await PwActions.waitTillVisible(
					page2,
					`//p[contains(@class, 'ss-survey-heading--text') and contains(text(),'${sectionNumber}.${questionNumber}')]`,
				);
			}
			let scaleElements;
			switch (questionType) {
				case "Rating Scale":
					if (scale) {
						scaleElements = await PwActions.getWebElements(
							page2,
							this.webElementsAllAvailableScalesForEachQuestion(questionNumber),
						);
						if (startFromZero) {
							expect(scaleElements.length).toBe(scale + 1);
						} else {
							expect(scaleElements.length).toBe(scale);
						}
					}
					if (includeNA) {
						if (!scaleElements) {
							scaleElements = await PwActions.getWebElements(
								page2,
								this.webElementsAllAvailableScalesForEachQuestion(
									questionNumber,
								),
							);
						}
						const scaleElementsText = await PwActions.getElementsText(
							page2,
							scaleElements,
						);
						expect(scaleElementsText[scaleElementsText.length - 1]).toBe(
							"N/ANot Applicable",
						);
					}
					if (startFromZero) {
						if (!scaleElements) {
							scaleElements = await PwActions.getWebElements(
								page2,
								this.webElementsAllAvailableScalesForEachQuestion(
									questionNumber,
								),
							);
						}
						const textScaleElements = await PwActions.getElementsText(
							page2,
							scaleElements,
						);
						expect(textScaleElements[0]).toContain("0");
					}
					if (type === "Frequency") {
						let frequencyScale;
						if (scale === 5) {
							frequencyScale = constants.frequencyScale.frequencyScale5Point;
						} else if (scale === 7) {
							frequencyScale = constants.frequencyScale.frequencyScale7Point;
						} else if (scale === 10) {
							frequencyScale = constants.frequencyScale.frequencyScale10Point;
						}

						if (frequencyScale) {
							const scaleKeys = Object.keys(frequencyScale);
							const firstKey = startFromZero ? "0" : "1";
							const lastKey = scaleKeys[scaleKeys.length - 1];

							await PwActions.verifyElementIsPresent(
								page2,
								`(//label[@data-label-value="${frequencyScale[firstKey]}"])[${questionNumber}]`,
							);
							await PwActions.verifyElementIsPresent(
								page2,
								`(//label[@data-label-value="${frequencyScale[lastKey]}"])[${questionNumber}]`,
							);
						}
					}
					if (type === "Agreement") {
						let agreementScale;
						if (scale === 5) {
							agreementScale = constants.agreementScale.agreementScale5Point;
						} else if (scale === 7) {
							agreementScale = constants.agreementScale.agreementScale7Point;
						} else if (scale === 10) {
							agreementScale = constants.agreementScale.agreementScale10Point;
						}

						if (agreementScale) {
							const scaleKeys = Object.keys(agreementScale);
							const firstKey = startFromZero ? "0" : "1";
							const lastKey = scaleKeys[scaleKeys.length - 1];

							await PwActions.verifyElementIsPresent(
								page2,
								`(//label[@data-label-value="${agreementScale[firstKey]}"])[${questionNumber}]`,
							);
							await PwActions.verifyElementIsPresent(
								page2,
								`(//label[@data-label-value="${agreementScale[lastKey]}"])[${questionNumber}]`,
							);
						}
					}
					break;

				case "Text Input":
					if (markAsMandatory) {
						try {
							await PwActions.click(page2, this.btnNext);
						} catch {
							await PwActions.click(page2, this.btnSubmit);
						}
						await PwActions.verifyElementIsPresent(
							page2,
							`//p[text()='${sectionNumber}.${questionNumber}']/ancestor::div[contains(@class,'ss_cl_survey_qstn_item')]//h6[contains(@class,'error')]`,
						);
					} else {
						try {
							await PwActions.click(page2, this.btnNext);
						} catch {
							await PwActions.click(page2, this.btnSubmit);
						}
						await PwActions.verifyElementIsNotPresent(
							page2,
							`//p[text()='${sectionNumber}.${questionNumber}']/ancestor::div[contains(@class,'ss_cl_survey_qstn_item')]//h6[contains(@class,'error')]`,
						);
					}
					if (type === "multi line") {
						await PwActions.verifyElementIsPresent(
							page2,
							this.inputMultiLineTextArea(sectionNumber, questionNumber),
						);
					} else {
						await PwActions.verifyElementIsPresent(
							page2,
							this.inputSingleLineTextArea(sectionNumber, questionNumber),
						);
					}
					if (placeholder) {
						await PwActions.verifyElementIsPresent(
							page2,
							`//textarea[@placeholder="${placeholder}"]`,
						);
					}
					break;

				case "MultiChoice":
					if (type === "Multiple Selection") {
						const checkBoxElements = await PwActions.getWebElements(
							page2,
							this.webElementsAllAvailableScalesForEachQuestion(questionNumber),
						);
						for (const element of checkBoxElements) {
							await element.click();
						}
						const activeCheckBoxElements = await PwActions.getWebElements(
							page2,
							this.inputActiveCheckBoxes(questionNumber),
						);
						expect(activeCheckBoxElements.length).toEqual(
							checkBoxElements.length,
						);
					} else {
						const radioButtonElements = await PwActions.getWebElements(
							page2,
							this.webElementsAllAvailableScalesForEachQuestion(questionNumber),
						);
						for (const element of radioButtonElements) {
							await element.click();
						}
						const activeRadioButtonElements = await PwActions.getWebElements(
							page2,
							this.inputActiveCheckBoxes(questionNumber),
						);
						expect(activeRadioButtonElements.length).toEqual(1);
						await activeRadioButtonElements[
							activeRadioButtonElements.length - 1
						].click();
					}
					if (includeOther) {
						await PwActions.verifyElementIsPresent(
							page2,
							this.inputRadioOrCheckboxOtherOption(questionNumber),
						);
						await PwActions.click(
							page2,
							this.inputRadioOrCheckboxOtherOption(questionNumber),
						);
						await PwActions.click(
							page2,
							this.inputRadioOrCheckboxOtherOption(questionNumber),
						);
						await PwActions.verifyElementIsPresent(
							page2,
							this.inputTextBoxIfOthersOptionIsSelected(questionNumber),
						);
						await PwActions.fill(
							page2,
							this.inputTextBoxIfOthersOptionIsSelected(questionNumber),
							"Other",
						);
					} else {
						await PwActions.verifyElementIsNotPresent(
							page2,
							this.inputRadioOrCheckboxOtherOption(questionNumber),
						);
					}
					break;

				case "eNPS":
					const btnsAllAvailableScalesForEachQuestion =
						await PwActions.getWebElements(
							page2,
							this.webElementsAllAvailableScalesForEachQuestion(questionNumber),
						);
					const tooltipElements = await PwActions.getWebElements(
						page2,
						this.webElementTooltipForRatingScaleForEachQuestion(questionNumber),
					);
					for (
						let i = 1;
						i <= scaleLabels.length &&
						i <= btnsAllAvailableScalesForEachQuestion.length &&
						i <= tooltipElements.length;
						i++
					) {
						const btn = btnsAllAvailableScalesForEachQuestion[i - 1];
						const tooltipElement = tooltipElements[i - 1];
						const scaleDataItem = scaleLabels[i - 1];
						await btn.hover();
						await CommonUtils.sleep(1);
						const tooltipText = await tooltipElement.textContent();
						await PwActions.verifyTextExpected(
							tooltipText,
							scaleDataItem.label,
						);
					}
					break;
				case "Goal":
					scaleElements = await PwActions.getWebElements(
						page2,
						this.webElementsAllAvailableScalesForEachQuestion(questionNumber),
					);

					if (questionMethod === "Rating Scale") {
						if (includeNA) {
							await PwActions.verifyElementIsPresent(
								page2,
								this.btnNotApplicable(sectionNumber, questionNumber),
							);
						} else {
							await PwActions.verifyElementIsNotPresent(
								page2,
								this.btnNotApplicable(sectionNumber, questionNumber),
							);
						}

						if (scaleLabels) {
							for (
								let index = 1;
								index < scaleElements.length && index < scaleLabels.length;
								index++
							) {
								await scaleElements[index].hover();
								await CommonUtils.sleep(1);

								const tooltipText = await PwActions.getText(
									page2,
									this.tooltipForGoalRatingScale(
										sectionNumber,
										questionNumber,
										index,
									),
								);

								await PwActions.verifyTextExpected(
									tooltipText,
									scaleLabels[index - 1],
								);
							}
						}

						if (placeholder) {
							await scaleElements[1].click();
							await CommonUtils.sleep(1);

							if (
								await PwActions.elementIsVisible(
									page2,
									this.btnReasonTextBox(placeholder),
								)
							) {
								await PwActions.click(
									page2,
									this.btnReasonTextBox(placeholder),
								);
							}

							await PwActions.verifyElementIsPresent(
								page2,
								`//textarea[@placeholder="${placeholder}"]`,
							);
						}

						if (makeReasonMandatory) {
							await scaleElements[0].click();

							if (await PwActions.elementIsVisible(page2, this.btnNext)) {
								await PwActions.click(page2, this.btnNext);
							} else {
								await PwActions.click(page2, this.btnSubmit);
							}

							await CommonUtils.sleep(1);

							await PwActions.verifyElementIsPresent(
								page2,
								this.txtErrorIndicatorMakeReasonMandatory(
									sectionNumber,
									questionNumber,
								),
							);
						} else {
							await scaleElements[0].click();

							if (await PwActions.elementIsVisible(page2, this.btnNext)) {
								await PwActions.click(page2, this.btnNext);
							} else {
								await PwActions.click(page2, this.btnSubmit);
							}

							await PwActions.verifyElementIsNotPresent(
								page2,
								this.txtErrorIndicatorMakeReasonMandatory(
									sectionNumber,
									questionNumber,
								),
							);
						}
					} else {
						if (placeholder) {
							await PwActions.verifyElementIsPresent(
								page2,
								`//textarea[@placeholder="${placeholder}"]`,
							);
						}

						if (type === "single line") {
							await PwActions.verifyElementIsPresent(
								page2,
								this.inputSingleLineTextArea(sectionNumber, questionNumber),
							);
						} else {
							await PwActions.verifyElementIsPresent(
								page2,
								this.inputMultiLineTextArea(sectionNumber, questionNumber),
							);
						}
					}

					break;
			}
		} finally {
			await PwActions.closeTab(page2);
		}
	}

	/**
	 * Attends all the mandatory questions on a section
	 * @param {object} page - The Playwright page instance
	 * @example
	 * Let's say you have a section and you want to attend all the mandatory questions, Then call this function with the page instance as the parameter.
	 * Note: Call this function only if the error indicator is visible.
	 * await this.attendSurveyEUI.attendAllMandatoryQuestionOnASection(page);
	 */
	async attendAllMandatoryQuestionOnASection(page) {
		const mandatoryQuestion = await PwActions.getElementsText(
			page,
			await PwActions.getWebElements(
				page,
				this.webElementsMandatoryQuestionNumbers,
			),
		);
		if (!mandatoryQuestion || mandatoryQuestion.length === 0) {
			return;
		} else {
			const questionNumbers = mandatoryQuestion
				.map((question) => {
					const parts = question.split(".");
					return parts.length > 1 ? parts[1] : null;
				})
				.filter((num) => num !== null);
			const sectionNumber = mandatoryQuestion[0].split(".")[0];
			for (const questionNumber of questionNumbers) {
				const answerElements = await PwActions.getWebElements(
					page,
					this.webElementsAllAvailableScalesForEachQuestion(questionNumber),
				);
				if (answerElements.length > 0) {
					await answerElements[0].click();
				} else {
					const textInputElement = (await PwActions.elementIsVisible(
						page,
						this.inputSingleLineTextArea(sectionNumber, questionNumber),
					))
						? this.inputSingleLineTextArea(sectionNumber, questionNumber)
						: this.inputMultiLineTextArea(sectionNumber, questionNumber);
					await PwActions.fill(page, textInputElement, "Test answer");
				}
			}
		}
		const visibleButton = (await PwActions.elementIsVisible(page, this.btnNext))
			? this.btnNext
			: this.btnSubmit;
		await CommonUtils.sleep(1);
		await PwActions.click(page, visibleButton);
	}

	/**
	 * Attends survey using CSV link for a specific evaluator and subject
	 * Checks if participants CSV exists, downloads if needed, finds the survey link for the evaluator/subject pair, and attends the survey
	 *
	 * @param {Object} params - Named parameters object
	 * @param {object} params.thrivePage - The Thrive admin page instance (for getting session cookies and browser context)
	 * @param {string} params.surveyName - The name of the survey (used for CSV filename)
	 * @param {string} params.evaluatorName - The name of the evaluator who will attend the survey (unique identifier)
	 * @param {string} [params.subjectName=null] - The name of the subject being evaluated (optional - if not provided, picks first match for evaluator)
	 * @param {Array<string>} [params.settings=[]] - Array of attendance behavior flags (e.g., ["attend with low values", "mandatoryQuestions"])
	 *
	 * @returns {Promise<{filePath: string, csvData: Array}>} Object containing the CSV file path and parsed data
	 *
	 * @example
	 * // Manager evaluates a specific subject
	 * await surveyEuiPage.attendSurveyUsingCsvLink({
	 *   thrivePage,
	 *   surveyName: EntityIds.surveyName,
	 *   evaluatorName: "John Manager",
	 *   subjectName: "Alice Subject",
	 *   settings: ["attend with low values", "mandatoryQuestions"]
	 * });
	 *
	 * @example
	 * // Self-evaluation (subject = evaluator)
	 * await surveyEuiPage.attendSurveyUsingCsvLink({
	 *   thrivePage,
	 *   surveyName: EntityIds.surveyName,
	 *   evaluatorName: "Alice Subject",
	 *   subjectName: "Alice Subject",
	 *   settings: ["attend with high values"]
	 * });
	 *
	 * @example
	 * // Pick first match for evaluator (if evaluator has only one subject)
	 * await surveyEuiPage.attendSurveyUsingCsvLink({
	 *   thrivePage,
	 *   surveyName: EntityIds.surveyName,
	 *   evaluatorName: "Bob Evaluator"
	 * });
	 */
	async attendSurveyUsingCsvLink({
		thrivePage,
		surveyName,
		evaluatorName,
		subjectName = null,
		settings = [],
	}) {
		// Check if CSV file already exists, if not download it
		let filePath =
			this.performanceParticipantsPage.getDownloadedParticipantFilePath(
				surveyName,
			);
		let csvData;

		// Check if file already exists
		if (fs.existsSync(filePath)) {
			logger.info(`CSV file already exists at: ${filePath}, skipping download`);
		} else {
			// Download the CSV using constructor's performanceParticipantsPage
			logger.info(`Downloading participants CSV for survey: ${surveyName}`);
			try {
				filePath =
					await this.performanceParticipantsPage.downloadParticipantsCSV(
						surveyName,
					);
				logger.info(`CSV file ready at: ${filePath}`);
			} catch (error) {
				logger.error(`Failed to download CSV: ${error.message}`);
				throw new Error(
					`Could not download participants CSV for survey "${surveyName}": ${error.message}`,
				);
			}
		}

		// Read the CSV file
		try {
			csvData = await this.commonUtils.readCSVFile(filePath);
		} catch (error) {
			logger.error(`Failed to read CSV file: ${error.message}`);
			throw new Error(
				`Could not read CSV file at ${filePath}: ${error.message}`,
			);
		}

		// Extract survey links from CSV data
		const surveyLinksData =
			this.performanceParticipantsPage.getParticipantsSurveyLinkFromCSV(
				csvData,
			);

		// Find the survey link for the given evaluator name and subject (if provided)
		let participantSurveyLink;

		if (subjectName) {
			// If subject name is provided, find specific evaluator-subject pair
			// Match by either evaluator name or evaluator email
			// Match by either subject name or subject email
			participantSurveyLink = surveyLinksData.find(
				(link) =>
					(link.evaluatorName === evaluatorName ||
						link.evaluatorEmail === evaluatorName) &&
					(link.subjectName === subjectName ||
						link.subjectEmail === subjectName),
			);

			if (!participantSurveyLink) {
				const availablePairs = surveyLinksData
					.filter(
						(link) =>
							link.evaluatorName === evaluatorName ||
							link.evaluatorEmail === evaluatorName,
					)
					.map((link) => `Subject: ${link.subjectName}`)
					.join(", ");
				throw new Error(
					`No survey link found for evaluator: "${evaluatorName}" and subject: "${subjectName}". ` +
						`Available subjects for this evaluator: ${availablePairs || "None"}`,
				);
			}
		} else {
			// If no subject name, find first match for evaluator
			// Match by either evaluator name or evaluator email
			participantSurveyLink = surveyLinksData.find(
				(link) =>
					link.evaluatorName === evaluatorName ||
					link.evaluatorEmail === evaluatorName,
			);

			if (!participantSurveyLink) {
				const availableEvaluators = surveyLinksData
					.map((link) => link.evaluatorName)
					.join(", ");
				throw new Error(
					`No survey link found for evaluator: "${evaluatorName}". Available evaluators: ${availableEvaluators}`,
				);
			}
		}

		logger.info(
			`Attending survey for evaluator: ${evaluatorName}, Subject: ${participantSurveyLink.subjectName}, Role: ${participantSurveyLink.mappedRole}`,
		);

		// Open a new tab and attend the survey
		// Get browser from thrivePage context
		const browser = thrivePage.context().browser();
		const page2 = await PwActions.openNewTab(browser);
		await PwActions.goTo(page2, participantSurveyLink.surveyUrl);

		// Attend the survey
		// - Get cookies from thrivePage (current admin session)
		// - Use mappedRole from CSV (e.g., "Subject", "Evaluator-Peer", "Evaluator-Manager")
		// - Convert settings array to string
		await this.attendSurvey({
			page: page2,
			participantName: participantSurveyLink.evaluatorName,
			subject: participantSurveyLink.subjectName,
			settings: settings,
		});

		// Close the new tab
		await PwActions.closeTab(page2);

		return { filePath, csvData };
	}

	/**
	 * Asserts the attendee has reached the survey completion screen (thank-you state).
	 * Waits for the thank-you label, then either expects the Edit responses control to be present
	 * (when resubmission is allowed) or absent (default).
	 *
	 * @param {import('@playwright/test').Page} page - Playwright page showing the completed survey (EUI).
	 * @param {boolean} [editAndResubmit=false] - When true, verifies `btnEditResponses` is visible; when false, verifies it is not shown.
	 * @returns {Promise<void>}
	 * @throws {Error} When thank-you is not visible within the timeout, or when edit-resubmit presence does not match `editAndResubmit`.
	 *
	 * @example
	 * await surveyEuiPage.verifySurveyCompleted(participantPage);
	 *
	 * @example
	 * await surveyEuiPage.verifySurveyCompleted(participantPage, true);
	 */
	async verifySurveyCompleted(page, editAndResubmit = false) {
		await PwActions.waitTillVisible(page, this.lblThankYou, 20000);
		await PwActions.verifyElementIsPresent(page, this.lblThankYou);
		if (editAndResubmit) {
			await PwActions.verifyElementIsPresent(page, this.btnEditResponses);
		} else {
			await PwActions.verifyElementIsNotPresent(page, this.btnEditResponses);
		}
	}

	/**
	 * Handles question verification based on settings using direct UI checks.
	 * Each "Verify " prefixed setting triggers a direct UI verification on the current page.
	 * No API data dependency -- all checks are purely UI-based.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {Array<string>} params.settings - Settings array containing verification commands
	 *
	 * @description
	 * Supported verification settings (Rating Scale):
	 * - "Verify NA Present" / "Verify NA NotPresent" - Verify N/A button presence
	 * - "Verify StartFromZero Present" / "Verify StartFromZero NotPresent" - Verify scale starts from zero
	 * - "Verify Scale Count" - Verify scale button count
	 * - "Verify Scale Labels" - Verify scale labels/tooltips
	 *
	 * Supported verification settings (Text Input):
	 * - "Verify Mandatory Present" / "Verify Mandatory NotPresent" - Verify mandatory asterisk
	 * - "Verify Placeholder" - Verify placeholder text
	 * - "Verify InputType" - Verify input type (multiline/singleline)
	 *
	 * Supported verification settings (MultiChoice):
	 * - "Verify MCQ IncludeOther" - Verify "Other" option presence (legacy)
	 * - "Verify MCQ Other Present" / "Verify MCQ Other NotPresent" - Verify MCQ "Other" option
	 * - "Verify MCQ Options Count" - Verify MCQ options count
	 * - "Verify MCQ SingleSelect" - Verify MCQ is single select
	 * - "Verify MCQ MultiSelect" - Verify MCQ is multi select
	 * - "Verify MCQ SelectOtherWithText" - Select MCQ "Other" and fill text
	 * - "Verify MCQ MinSelection X" - Verify min selection error (X = number)
	 * - "Verify MCQ MaxSelection X" - Verify max selection error (X = number)
	 *
	 * Supported verification settings (Goal):
	 * - "Verify Goal NA Present" / "Verify Goal NA NotPresent" - Verify N/A for goal questions
	 * - "Verify Goal StartFromZero Present" / "Verify Goal StartFromZero NotPresent"
	 * - "Verify Goal Scale Count" / "Verify Goal Scale Labels"
	 * - "Verify Goal Placeholder" / "Verify Goal InputType"
	 * - "Verify Goal details" - Open goal side panel, fetch snapshot API, verify panel against API (requires goal from attendGoalQuestion)
	 *
	 * @param {Object} params - Parameters object
	 * @param {string} params.questionName - Display name of the question (or goal name when called from attendGoalQuestion)
	 * @param {Array<string>} params.settings - Verification settings array
	 * @param {Object} [params.goal] - Current goal object with snapShotDataId (passed from attendGoalQuestion for "Verify Goal details")
	 *
	 * @example
	 * await this.verifyQuestionVerificationUsingSettings({
	 *   questionName: "Rate your experience",
	 *   settings: ["Verify NA Present", "Verify Scale Count", "Verify Scale Labels"],
	 * });
	 */
	async verifyQuestionVerificationUsingSettings({
		questionName,
		settings,
		goal = null,
	}) {
		for (const rawSetting of settings) {
			const setting = rawSetting.trim();

			switch (true) {
				case setting === "Verify NA Present":
					await this.verifyNAOptionVisibility({
						questionName,
						shouldBePresent: true,
					});
					break;
				case setting === "Verify NA NotPresent":
					await this.verifyNAOptionVisibility({
						questionName,
						shouldBePresent: false,
					});
					break;
				case setting === "Verify Goal NA Present":
					await this.verifyNAOptionVisibility({
						questionName,
						shouldBePresent: true,
						isGoalQuestion: true,
					});
					break;
				case setting === "Verify Goal NA NotPresent":
					await this.verifyNAOptionVisibility({
						questionName,
						shouldBePresent: false,
						isGoalQuestion: true,
					});
					break;
				case setting === "Verify StartFromZero Present":
					await this.verifyScaleStartsFromZero({
						questionName,
						shouldStartFromZero: true,
					});
					break;
				case setting === "Verify StartFromZero NotPresent":
					await this.verifyScaleStartsFromZero({
						questionName,
						shouldStartFromZero: false,
					});
					break;
				case setting === "Verify Goal StartFromZero Present":
					await this.verifyScaleStartsFromZero({
						questionName,
						shouldStartFromZero: true,
						isGoalQuestion: true,
					});
					break;
				case setting === "Verify Goal StartFromZero NotPresent":
					await this.verifyScaleStartsFromZero({
						questionName,
						shouldStartFromZero: false,
						isGoalQuestion: true,
					});
					break;
				case setting === "Verify Scale Count":
					await this.verifyScaleCount({ questionName });
					break;
				case setting === "Verify Goal Scale Count":
					await this.verifyScaleCount({ questionName, isGoalQuestion: true });
					break;
				case setting === "Verify Mandatory Present":
					await this.verifyMandatoryQuestion({
						questionName,
						shouldBePresent: true,
					});
					break;
				case setting === "Verify Mandatory NotPresent":
					await this.verifyMandatoryQuestion({
						questionName,
						shouldBePresent: false,
					});
					break;
				case setting === "Verify Placeholder":
					await this.verifyPlaceholderPresent({ questionName });
					break;
				case setting === "Verify Goal Placeholder":
					await this.verifyPlaceholderPresent({
						questionName,
						isGoalQuestion: true,
					});
					break;
				case setting === "Verify InputType":
					await this.verifyInputType({ questionName });
					break;
				case setting === "Verify Goal InputType":
					await this.verifyInputType({ questionName, isGoalQuestion: true });
					break;
				case setting === "Verify MCQ IncludeOther":
					await this.verifyOtherOptionPresent({ questionName });
					break;
				case setting === "Verify Scale Labels":
					await this.verifyScaleLabels({ questionName });
					break;
				case setting === "Verify Goal Scale Labels":
					await this.verifyScaleLabels({ questionName, isGoalQuestion: true });
					break;
				case setting === "Verify Goal details":
					if (goal?.snapShotDataId) {
						const surveyId = await this.extractSurveyIdFromUrl(this.page);
						if (surveyId) {
							await this.openGoalSidePanel({
								snapshotId: goal.snapShotDataId,
							});
							const apiData = await this.getGoalSnapshotDetails({
								surveyId,
								snapshotDataId: goal.snapShotDataId,
							});

							let expectedData = null;
							if (
								constants.goalData &&
								Object.keys(constants.goalData).length > 0
							) {
								expectedData = constants.convertGoalPayloadToSnapshotFormat(
									constants.goalData,
									{ goalName: goal.name },
								);
							}

							const didRedirect = await this.verifyGoalSidePanelDetails({
								expectedData,
								apiData,
								surveyId,
								snapshotDataId: goal.snapShotDataId,
							});
							if (!didRedirect) {
								await this.closeGoalSidePanel();
							}
							logger.info(
								`[3-Way] Verified goal "${goal.name}" — constants vs API vs UI`,
							);
						}
					}
					break;
				case setting === "Verify MCQ Other Present":
					await this.verifyMCQOtherOption({
						questionName,
						shouldBePresent: true,
					});
					break;
				case setting === "Verify MCQ Other NotPresent":
					await this.verifyMCQOtherOption({
						questionName,
						shouldBePresent: false,
					});
					break;
				case setting === "Verify MCQ Options Count":
					await this.verifyMCQOptionsCount({ questionName });
					break;
				case setting === "Verify MCQ SingleSelect":
					await this.verifyMCQSingleSelect({ questionName });
					break;
				case setting === "Verify MCQ MultiSelect":
					await this.verifyMCQMultiSelect({ questionName });
					break;
				case setting === "Verify MCQ SelectOtherWithText":
					await this.selectMCQOtherWithText({ questionName });
					break;
				case setting === "Verify MCQ OtherInput Placeholder":
					await this.verifyMCQOtherInputPlaceholder({ questionName });
					break;
				case setting.startsWith("Verify MCQ OtherInput Placeholder "): {
					const expectedText = setting
						.replace("Verify MCQ OtherInput Placeholder ", "")
						.trim();
					await this.verifyMCQOtherInputPlaceholder({
						questionName,
						expectedPlaceholder: expectedText,
					});
					break;
				}
				case setting.startsWith("Verify MCQ MinSelection"): {
					const minValue = setting.match(/\d+/)?.[0];
					if (minValue) {
						await this.verifyMCQMinSelectionError({
							questionName,
							minSelection: Number.parseInt(minValue, 10),
						});
					}
					break;
				}
				case setting.startsWith("Verify MCQ MaxSelection"): {
					const maxValue = setting.match(/\d+/)?.[0];
					if (maxValue) {
						await this.verifyMCQMaxSelectionError({
							questionName,
							maxSelection: Number.parseInt(maxValue, 10),
						});
					}
					break;
				}
				case setting === "Verify eNPS Scale Count":
					await this.verifyENPSScaleCount({ questionName });
					break;
				case setting === "Verify eNPS Scale Labels":
					await this.verifyENPSScaleLabels({ questionName });
					break;
				default:
					break;
			}
		}
	}

	/**
	 * Verifies the eNPS scale has the expected number of buttons (11: 0-10).
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 */
	async verifyENPSScaleCount({ questionName }) {
		await CommonUtils.sleep(4);
		const scaleLocator = this.webScaleElementForQuestion(questionName);
		const scaleButtons = await PwActions.getWebElements(
			this.page,
			scaleLocator,
		);
		logger.info(
			`Question "${questionName}": eNPS scale count is ${scaleButtons.length}`,
		);
		expect(scaleButtons.length).toBe(10);
	}

	/**
	 * Verifies eNPS scale labels/tooltips match expected values from questionVerificationData.ratingScaleData.enps.
	 * Hovers over each scale button and compares tooltip text with expected labels.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 */
	async verifyENPSScaleLabels({ questionName }) {
		const expectedLabels = questionVerificationData.ratingScaleData.enps.slice(
			0,
			10,
		);
		const scaleLocator = this.webScaleElementForQuestion(questionName);
		const tooltipLocator =
			this.webElementTooltipForRatingScaleForEachQuestion(questionName);

		const scaleElements = await PwActions.getWebElements(
			this.page,
			scaleLocator,
		);
		const tooltipElements = await PwActions.getWebElements(
			this.page,
			tooltipLocator,
		);
		expect(scaleElements.length).toBe(expectedLabels.length);
		const actualTooltipTexts = [];
		for (
			let i = 0;
			i < scaleElements.length && i < tooltipElements.length;
			i++
		) {
			await scaleElements[i].hover();
			await CommonUtils.sleep(1);
			const tooltipText = await tooltipElements[i].textContent();
			actualTooltipTexts.push(tooltipText);
		}
		expect(actualTooltipTexts).toEqual(expectedLabels);
	}

	/**
	 * Verifies that the N/A (Not Applicable) button is present or absent for a question.
	 * If present and shouldBePresent is true, clicks the N/A button and stores the value.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {boolean} [params.shouldBePresent=true] - Whether the N/A button should be present
	 * @param {boolean} [params.isGoalQuestion=false] - Whether this is a goal-based question
	 *
	 * @example
	 * await this.verifyNAOptionVisibility({
	 *   questionName: "Rate your experience",
	 *   shouldBePresent: true,
	 *   isGoalQuestion: false,
	 * });
	 */
	async verifyNAOptionVisibility({
		questionName,
		shouldBePresent = true,
		isGoalQuestion = false,
	}) {
		const naButtonXpath = isGoalQuestion
			? this.btnNotApplicableForGoal(questionName)
			: this.btnNotApplicableQuestionContainer(questionName);
		if (shouldBePresent) {
			await PwActions.verifyElementIsPresent(this.page, naButtonXpath);
			logger.info(`Question "${questionName}": N/A button is present`);
			await PwActions.click(this.page, naButtonXpath);
			this.data.value = "N/A";
		} else {
			await PwActions.verifyElementIsNotPresent(this.page, naButtonXpath);
			logger.info(`Question "${questionName}": N/A button is not present`);
		}
	}

	/**
	 * Verifies that the rating scale starts from zero by checking the first scale button text.
	 * If shouldStartFromZero is true and scale starts from zero, clicks the first scale button.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {boolean} [params.shouldStartFromZero=true] - Whether the scale should start from zero
	 * @param {boolean} [params.isGoalQuestion=false] - Whether this is a goal-based question
	 *
	 * @example
	 * await this.verifyScaleStartsFromZero({
	 *   questionName: "Rate your experience",
	 *   shouldStartFromZero: true,
	 *   isGoalQuestion: false,
	 * });
	 */
	async verifyScaleStartsFromZero({
		questionName,
		shouldStartFromZero = true,
		isGoalQuestion = false,
	}) {
		const scaleLocator = isGoalQuestion
			? this.webElementsRatingScaleForGoal(questionName)
			: this.webScaleElementForQuestion(questionName);
		const scaleElements = await PwActions.getWebElements(
			this.page,
			scaleLocator,
		);
		const textScaleElements = await PwActions.getElementsText(
			this.page,
			scaleElements,
		);
		if (shouldStartFromZero) {
			expect(textScaleElements[0]).toContain("0");
			await scaleElements[0].click();
			this.data.value = "0";
		} else {
			expect(textScaleElements[0]).not.toContain("0");
		}
	}

	/**
	 * Verifies the number of scale options matches expected count from questionVerificationData.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {boolean} [params.isGoalQuestion=false] - Whether this is a goal-based question
	 *
	 * @example
	 * await this.verifyScaleCount({
	 *   questionName: "scale5 question",
	 *   isGoalQuestion: false,
	 * });
	 */
	async verifyScaleCount({ questionName, isGoalQuestion = false }) {
		const ratingScaleData = questionVerificationData.ratingScaleData;
		const scaleKey = Object.keys(ratingScaleData).find((key) =>
			questionName.toLowerCase().includes(key.toLowerCase()),
		);
		if (scaleKey && ratingScaleData[scaleKey]) {
			const scaleLocator = isGoalQuestion
				? this.webElementsRatingScaleForGoal(questionName)
				: this.webScaleElementForQuestion(questionName);
			const scaleButtons = await PwActions.getWebElements(
				this.page,
				scaleLocator,
			);
			logger.info(
				`Question "${questionName}": Scale count is ${scaleButtons.length}`,
			);
			expect(scaleButtons.length).toBe(ratingScaleData[scaleKey].length);
		}
	}

	/**
	 * Verifies that a question is marked as mandatory by checking for the asterisk icon.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {boolean} [params.shouldBePresent=true] - Whether the mandatory asterisk should be present
	 *
	 * @example
	 * await this.verifyMandatoryQuestion({
	 *   questionName: "Required field",
	 *   shouldBePresent: true,
	 * });
	 */
	async verifyMandatoryQuestion({ questionName, shouldBePresent = true }) {
		if (shouldBePresent) {
			await PwActions.verifyElementIsPresent(
				this.page,
				this.asteriskIconForQuestion(questionName),
			);
		} else {
			await PwActions.verifyElementIsNotPresent(
				this.page,
				this.asteriskIconForQuestion(questionName),
			);
		}
	}

	/**
	 * Verifies that a text question has the expected placeholder text.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {boolean} [params.isGoalQuestion=false] - Whether this is a goal-based question
	 *
	 * @example
	 * await this.verifyPlaceholderPresent({
	 *   questionName: "Enter your feedback",
	 *   isGoalQuestion: false,
	 * });
	 */
	async verifyPlaceholderPresent({ questionName, isGoalQuestion = false }) {
		const textareaXpath = isGoalQuestion
			? this.txtBoxGoals(questionName)
			: this.txtBoxForQuestion(questionName);
		const actualPlaceholder = await PwActions.getAttributeValue(
			this.page,
			textareaXpath,
			"placeholder",
		);

		let expectedPlaceholder;
		if (isGoalQuestion) {
			expectedPlaceholder = questionVerificationData.goalQuestion.placeholder;
		} else {
			const textInputData = questionVerificationData.textInputData;
			const inputKey = Object.keys(textInputData).find((key) =>
				questionName.toLowerCase().includes(key.toLowerCase()),
			);
			expectedPlaceholder = inputKey
				? textInputData[inputKey]
				: textInputData.default;
		}
		expect(actualPlaceholder).toBe(expectedPlaceholder);
	}

	/**
	 * Verifies the input type (multiline or singleline) based on maxlength attribute.
	 * Multiline inputs have maxlength of 10000, singleline have 1000.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {boolean} [params.isGoalQuestion=false] - Whether this is a goal-based question
	 *
	 * @example
	 * await this.verifyInputType({
	 *   questionName: "multiline feedback",
	 *   isGoalQuestion: false,
	 * });
	 */
	async verifyInputType({ questionName, isGoalQuestion = false }) {
		const textareaXpath = isGoalQuestion
			? this.txtBoxGoals(questionName)
			: this.txtBoxForQuestion(questionName);
		const maxlength = await PwActions.getAttributeValue(
			this.page,
			textareaXpath,
			"maxlength",
		);
		if (questionName.toLowerCase().includes("multiline")) {
			expect(maxlength).toBe("10000");
		} else {
			expect(maxlength).toBe("1000");
		}
	}

	/**
	 * Verifies that the "Other" option is present for a MultiChoice question.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 *
	 * @example
	 * await this.verifyOtherOptionPresent({
	 *   questionName: "Select your preference",
	 * });
	 */
	async verifyOtherOptionPresent({ questionName }) {
		await PwActions.verifyElementIsPresent(
			this.page,
			this.mcqOtherOptionByQuestionName(questionName),
		);
		logger.info(`Question "${questionName}": "Other" option is present`);
	}

	/**
	 * Verifies that scale labels/tooltips match expected values from questionVerificationData.
	 * Hovers over each scale button and compares tooltip text with expected labels.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {boolean} [params.isGoalQuestion=false] - Whether this is a goal-based question
	 *
	 * @example
	 * await this.verifyScaleLabels({
	 *   questionName: "scale5 question",
	 *   isGoalQuestion: false,
	 * });
	 */
	async verifyScaleLabels({ questionName, isGoalQuestion = false }) {
		const ratingScaleData = questionVerificationData.ratingScaleData;
		const scaleKey = Object.keys(ratingScaleData).find((key) =>
			questionName.toLowerCase().includes(key.toLowerCase()),
		);

		if (!scaleKey || !ratingScaleData[scaleKey]) {
			return;
		}
		const scaleLocator = isGoalQuestion
			? this.webElementsRatingScaleForGoal(questionName)
			: this.webScaleElementForQuestion(questionName);

		const tooltipLocator = isGoalQuestion
			? this.webElementsTooltipsForRatingScaleForGoal(questionName)
			: this.webElementTooltipForRatingScaleForEachQuestion(questionName);

		const scaleElements = await PwActions.getWebElements(
			this.page,
			scaleLocator,
		);
		const tooltipElements = await PwActions.getWebElements(
			this.page,
			tooltipLocator,
		);
		const expectedLabels = ratingScaleData[scaleKey];
		expect(scaleElements.length).toBe(expectedLabels.length);
		const actualTooltipTexts = [];
		for (
			let i = 0;
			i < scaleElements.length && i < tooltipElements.length;
			i++
		) {
			await scaleElements[i].hover();
			await CommonUtils.sleep(1);
			const tooltipText = await tooltipElements[i].textContent();
			actualTooltipTexts.push(tooltipText);
		}
		expect(actualTooltipTexts).toEqual(expectedLabels);
	}

	/**
	 * Verifies the MCQ "Other" option is present or not present.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {boolean} [params.shouldBePresent=true] - Whether the "Other" option should be present
	 *
	 * @example
	 * await this.verifyMCQOtherOption({
	 *   questionName: "Select your preference",
	 *   shouldBePresent: true,
	 * });
	 */
	async verifyMCQOtherOption({ questionName, shouldBePresent = true }) {
		const otherOptionXpath = this.mcqOtherOptionByQuestionName(questionName);
		if (shouldBePresent) {
			await PwActions.verifyElementIsPresent(this.page, otherOptionXpath);
			logger.info(`Question "${questionName}": MCQ "Other" option is present`);
		} else {
			await PwActions.verifyElementIsNotPresent(this.page, otherOptionXpath);
			logger.info(
				`Question "${questionName}": MCQ "Other" option is not present`,
			);
		}
	}

	/**
	 * Verifies the count of MCQ options for a question is greater than zero.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 *
	 * @example
	 * await this.verifyMCQOptionsCount({
	 *   questionName: "Select your preference",
	 * });
	 */
	async verifyMCQOptionsCount({ questionName }) {
		const optionElements = await PwActions.getWebElements(
			this.page,
			this.mcqAllOptionsByQuestionName(questionName),
		);
		logger.info(
			`Question "${questionName}": MCQ has ${optionElements.length} options`,
		);
		expect(optionElements.length).toBeGreaterThan(0);
	}

	/**
	 * Verifies that MCQ is configured as single select (radio button behavior).
	 * Selects two options sequentially and verifies only one remains selected.
	 * Stores the selected option in this.data.selectedOptions.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 *
	 * @example
	 * await this.verifyMCQSingleSelect({
	 *   questionName: "Select one option",
	 * });
	 */
	async verifyMCQSingleSelect({ questionName }) {
		const optionElements = await PwActions.getWebElements(
			this.page,
			this.mcqAllOptionsByQuestionName(questionName),
		);
		const optionTexts = await PwActions.getElementsText(
			this.page,
			optionElements,
		);

		if (optionTexts.length >= 2) {
			const alreadySelected =
				(await PwActions.getWebElements(
					this.page,
					this.mcqSelectedOptionsByQuestionName(questionName),
				)) ?? [];
			const alreadySelectedTexts =
				(await PwActions.getElementsText(this.page, alreadySelected)) ?? [];
			for (const text of alreadySelectedTexts) {
				if (!text) continue;
				await PwActions.click(
					this.page,
					this.mcqOptionByQuestionName(questionName, text),
				);
			}
			await CommonUtils.sleep(0.3);

			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionTexts[0]),
			);
			await CommonUtils.sleep(0.5);
			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionTexts[1]),
			);
			await CommonUtils.sleep(0.5);

			const selectedElements = await PwActions.getWebElements(
				this.page,
				this.mcqSelectedOptionsByQuestionName(questionName),
			);
			expect(selectedElements.length).toBe(1);
			logger.info(
				`Question "${questionName}": Verified as single select (radio)`,
			);

			this.data.selectedOptions = [optionTexts[1]];
		}
	}

	/**
	 * Verifies that MCQ is configured as multi select (checkbox behavior).
	 * Selects two options and verifies both remain selected.
	 * Stores the selected options in this.data.selectedOptions.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 *
	 * @example
	 * await this.verifyMCQMultiSelect({
	 *   questionName: "Select multiple options",
	 * });
	 */
	async verifyMCQMultiSelect({ questionName }) {
		const optionElements = await PwActions.getWebElements(
			this.page,
			this.mcqAllOptionsByQuestionName(questionName),
		);
		const optionTexts = await PwActions.getElementsText(
			this.page,
			optionElements,
		);

		if (optionTexts.length >= 2) {
			const alreadySelected =
				(await PwActions.getWebElements(
					this.page,
					this.mcqSelectedOptionsByQuestionName(questionName),
				)) ?? [];
			const alreadySelectedTexts =
				(await PwActions.getElementsText(this.page, alreadySelected)) ?? [];
			for (const text of alreadySelectedTexts) {
				if (!text) continue;
				await PwActions.click(
					this.page,
					this.mcqOptionByQuestionName(questionName, text),
				);
			}
			await CommonUtils.sleep(0.3);

			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionTexts[0]),
			);
			await CommonUtils.sleep(0.5);
			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionTexts[1]),
			);
			await CommonUtils.sleep(0.5);

			const selectedElements = await PwActions.getWebElements(
				this.page,
				this.mcqSelectedOptionsByQuestionName(questionName),
			);
			expect(selectedElements.length).toBe(2);
			logger.info(
				`Question "${questionName}": Verified as multi select (checkbox)`,
			);

			this.data.selectedOptions = [optionTexts[0], optionTexts[1]];
		}
	}

	/**
	 * Selects the "Other" option and fills in the text input for MCQ.
	 * Stores the selected option and text in this.data.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 *
	 * @example
	 * await this.selectMCQOtherWithText({
	 *   questionName: "Select your preference",
	 * });
	 */
	async selectMCQOtherWithText({ questionName }) {
		const otherOptionXpath = this.mcqOtherOptionByQuestionName(questionName);
		await PwActions.verifyElementIsPresent(this.page, otherOptionXpath);
		await PwActions.click(this.page, otherOptionXpath);
		await CommonUtils.sleep(0.5);

		const otherTextInputXpath =
			this.mcqOtherTextInputByQuestionName(questionName);
		await PwActions.waitForElementVisibility(
			this.page,
			otherTextInputXpath,
			5000,
		);
		const randomText = faker.lorem.sentence(3);
		await PwActions.fill(this.page, otherTextInputXpath, randomText);
		logger.info(
			`Question "${questionName}": Selected "Other" and entered text: ${randomText}`,
		);

		this.data.selectedOptions = ["Other"];
		this.data.otherText = randomText;
	}

	/**
	 * Verifies the placeholder text of the MCQ "Other" option textarea.
	 * Clicks the "Other" option to reveal the textarea, reads the placeholder attribute,
	 * asserts it against the expected value, then un-clicks "Other" to restore clean state.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {string} [params.expectedPlaceholder] - The expected placeholder text. If not provided,
	 *   uses the value from questionVerificationData.mcqOtherInput.defaultPlaceholder
	 *
	 * @example
	 * await this.verifyMCQOtherInputPlaceholder({
	 *   questionName: "Select your preference",
	 *   expectedPlaceholder: "Please specify your answer",
	 * });
	 */
	async verifyMCQOtherInputPlaceholder({ questionName, expectedPlaceholder }) {
		const otherOptionXpath = this.mcqOtherOptionByQuestionName(questionName);
		await PwActions.verifyElementIsPresent(this.page, otherOptionXpath);
		await PwActions.click(this.page, otherOptionXpath);
		await CommonUtils.sleep(0.5);

		const otherTextareaXpath =
			this.mcqOtherTextareaByQuestionName(questionName);
		await PwActions.waitForElementVisibility(
			this.page,
			otherTextareaXpath,
			5000,
		);

		const actualPlaceholder = await PwActions.getAttributeValue(
			this.page,
			otherTextareaXpath,
			"placeholder",
		);

		const expected =
			expectedPlaceholder ||
			questionVerificationData.mcqOtherInput.defaultPlaceholder;

		expect(actualPlaceholder).toBe(expected);
		logger.info(
			`Question "${questionName}": MCQ Other input placeholder verified - "${actualPlaceholder}"`,
		);

		await PwActions.click(this.page, otherOptionXpath);
		await CommonUtils.sleep(0.3);
	}

	/**
	 * Verifies that the MCQ minimum selection error message is displayed.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {number} params.minSelection - The minimum number of selections required
	 *
	 * @example
	 * await this.verifyMCQMinSelectionError({
	 *   questionName: "Select at least 2",
	 *   minSelection: 2,
	 * });
	 */
	async verifyMCQMinSelectionError({ questionName, minSelection }) {
		const errorXpath = this.errorMCQMinSelection(questionName, minSelection);
		const allOptionElements =
			(await PwActions.getWebElements(
				this.page,
				this.mcqAllOptionsByQuestionName(questionName),
			)) ?? [];
		let selectionOptionElements =
			(await PwActions.getWebElements(
				this.page,
				this.mcqSelectedOptionsByQuestionName(questionName),
			)) ?? [];

		let selectedOptions =
			(await PwActions.getElementsText(this.page, selectionOptionElements)) ??
			[];
		for (const optionText of selectedOptions ?? []) {
			if (!optionText) continue;
			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionText),
			);
		}
		const invalidCount = Math.max(minSelection - 1, 0);
		for (let i = 0; i < invalidCount; i++) {
			const optionText = (
				await allOptionElements?.[i]?.textContent?.()
			)?.trim();

			if (!optionText) continue;

			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionText),
			);
		}
		await CommonUtils.sleep(0.5);
		if (!(await PwActions.elementIsVisible(this.page, errorXpath, 4))) {
			if (await PwActions.elementIsVisible(this.page, this.btnNext, 4)) {
				await CommonUtils.sleep(4);
				await PwActions.click(this.page, this.btnNext);
				await PwActions.waitForElementVisibility(this.page, errorXpath, 30000);
			} else {
				await CommonUtils.sleep(4);
				await PwActions.click(this.page, this.btnSubmit);
				await PwActions.waitForElementVisibility(this.page, errorXpath, 30000);
			}
		}
		await PwActions.verifyElementIsPresent(this.page, errorXpath);
		logger.info(
			`Question "${questionName}": Min selection error (${minSelection}) triggered correctly`,
		);

		const residualElements =
			(await PwActions.getWebElements(
				this.page,
				this.mcqSelectedOptionsByQuestionName(questionName),
			)) ?? [];
		const residualTexts =
			(await PwActions.getElementsText(this.page, residualElements)) ?? [];
		for (const optionText of residualTexts) {
			if (!optionText) continue;
			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionText),
			);
		}
		await CommonUtils.sleep(0.3);
	}

	/**
	 * Verifies that the MCQ maximum selection error message is displayed.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.questionName - The display name of the question
	 * @param {number} params.maxSelection - The maximum number of selections allowed
	 *
	 * @example
	 * await this.verifyMCQMaxSelectionError({
	 *   questionName: "Select up to 3",
	 *   maxSelection: 3,
	 * });
	 */
	async verifyMCQMaxSelectionError({ questionName, maxSelection }) {
		const errorXpath = this.errorMCQMaxSelection(questionName, maxSelection);
		const allOptionElements =
			(await PwActions.getWebElements(
				this.page,
				this.mcqAllOptionsByQuestionName(questionName),
			)) ?? [];

		if ((allOptionElements?.length ?? 0) <= maxSelection) {
			throw new Error(
				`Not enough options to trigger max selection validation for "${questionName}"`,
			);
		}
		let selectionOptionElements =
			(await PwActions.getWebElements(
				this.page,
				this.mcqSelectedOptionsByQuestionName(questionName),
			)) ?? [];
		let selectedOptions =
			(await PwActions.getElementsText(this.page, selectionOptionElements)) ??
			[];

		for (const optionText of selectedOptions ?? []) {
			if (!optionText) continue;

			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionText),
			);
		}
		const invalidCount = maxSelection + 1;
		for (let i = 0; i < invalidCount; i++) {
			const optionText = (
				await allOptionElements?.[i]?.textContent?.()
			)?.trim();

			if (!optionText) continue;

			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionText),
			);
		}
		await CommonUtils.sleep(0.5);
		if (!(await PwActions.elementIsVisible(this.page, errorXpath, 4))) {
			if (await PwActions.elementIsVisible(this.page, this.btnNext, 4)) {
				await CommonUtils.sleep(4);
				await PwActions.click(this.page, this.btnNext);
				await PwActions.waitForElementVisibility(this.page, errorXpath, 30000);
			} else {
				await CommonUtils.sleep(4);
				await PwActions.click(this.page, this.btnSubmit);
				await PwActions.waitForElementVisibility(this.page, errorXpath, 30000);
			}
		}
		await PwActions.verifyElementIsPresent(this.page, errorXpath);
		logger.info(
			`Question "${questionName}": Max selection error (${maxSelection}) triggered correctly`,
		);

		const residualElements =
			(await PwActions.getWebElements(
				this.page,
				this.mcqSelectedOptionsByQuestionName(questionName),
			)) ?? [];
		const residualTexts =
			(await PwActions.getElementsText(this.page, residualElements)) ?? [];
		for (const optionText of residualTexts) {
			if (!optionText) continue;
			await PwActions.click(
				this.page,
				this.mcqOptionByQuestionName(questionName, optionText),
			);
		}
		await CommonUtils.sleep(0.3);
	}
}

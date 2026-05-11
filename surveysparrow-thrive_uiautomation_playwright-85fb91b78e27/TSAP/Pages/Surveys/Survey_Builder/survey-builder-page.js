import { test, expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { generateRandomName } from "../../../Data/Resources/random-values";
import logger from "playwright-framework/Core/logger.js";
import {
	constants,
	questionVerificationData,
} from "../../../Data/Resources/constants";
import { EntityIds } from "../../../Shared_Functions/entityId";
import { EUI } from "../Attend_Survey/attend-survey-EUI-page";
import { SurveyPreviewPage } from "./survey-preview-page";
import { timeStamp } from "console";
import { data_to_attend_survey_low_values } from "../../../Data/Resources/predefined_test_data";
class SurveyBuilderPage {
	constructor(page) {
		this.page = page;
		this.commonutils = new CommonUtils();
		this.txtSectionDescriptionToEdit = "//div[@class='desc-text']//p";
		this.iconAddQuestionHover =
			"(//button[@aria-label='Add new question'])[last()]";
		this.webElementsAllQuestions =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-idwVdwR-css']/div[@draggable='true']/div[@draggable='true']/p";
		this.webElementsAllSections =
			"//p[text()='Questions']/ancestor::aside//div[contains(@class,'builder-sidebar-section-block')]/div/div/div/following-sibling::p";
		this.btnAddNewSection = "//span[text()='Add Section']";
		this.txtBoxSectionTitle = "//div[@class='section-text']";
		this.txtSectionTitle =
			"(//div[contains(@id , 'builder-sidebar-section-block')]//p)[2]";
		this.txtSectionDescription = "//div[@class='desc-text']";
		this.txtQuestionTitleInSideBar =
			"(//div[contains(@id , 'builder-sidebar-question-block')]//p)[2]";
		this.containerSectionDetails =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ilaUUeO-css']";
		this.btnDeleteSection = `(//div[contains(@class,'actions-toolbar') and not(contains(@style,'opacity: 0'))]//button[@aria-label='Delete'])[1]`;
		this.btnConfirmDeleteSection =
			"//span[text()='Yes, Delete'] | //span[text()='Yes, delete']";
		this.containerFirstSection =
			"(//p[text()='1']/parent::div[@class='twigs-c-PJLV twigs-c-PJLV-iiMWbWS-css'])[1]";
		this.txtallQuestionTextAreas = "//div[@class='question-text']";
		this.txtQuestionTextArea = "(//div[@class='question-text'])[last()]";
		this.txtboxFirstQuestion =
			"//div[contains(@id, 'builder-sidebar-question-block')]";
		this.btnSelectLanguage =
			"//p[text()='Questions']/parent::div//button[contains(@class, 'variant-solid')]";
		this.btnAddLanguage = "//p[text()='Add Language']";
		this.btnAddTranslations =
			"//span[text()='Add Translations']/parent::button";
		this.txtAddTranslationsConfirmation =
			"//div[text()='Translations have been added successfully.']";
		this.previewBtn = "//button[@aria-label='Preview survey']";
		this.btnQuestionBank = `(//div[@data-testid="builder-open-question-bank"]/p[text()='Question Bank'])[last()]`;
		this.webElementsAllQuestionbanks = `//div[@data-orientation="vertical"]//div[@data-testid="box"]/p`;
		this.btnAddQuestionsFromQuestionbank = `//button/span[text()='Add Questions']`;
		this.txtAsNewSection = `//div[@data-testid="box"]/p[text()='As new section']`;
		this.txtToCurrentSection = `//div[@data-testid="box"]/p[text()='To current section']`;
		this.txtTranslatingStatus = "//p[contains(text(),'Translating')]";
		this.btnSourceLanguage = `//p[text()='Source Language']/following-sibling::button`;
		this.inputSearchSourceLanguage = `//input[@placeholder="Search language"]`;
		this.btnCloseLanguageModel =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-igijNqx-css']/button";
		this.btnSelectLanguageFromBuild =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ikjEOAA-css']//button[1]";
		this.btnManageLanguageTranslation =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ikjEOAA-css']//button[2]";
		this.txtFirstQuestion = "(//div[@class='question-text'])[1]";
		this.btnConfirmDeleteLanguage =
			"//span[text()='Yes, Delete'] | //span[text()='Yes, delete']";
		this.txtDeleteTranslationsConfirmation =
			"//div[text()='Translation got deleted Successfully.']";
		this.drpdwnEditQuestion = "//div[contains(@class, 'question-config')]";
		this.btnChangeQuestionType = "//p[text()='Change']";
		this.txtUnlock = `//input[@name="unlockText"]`;
		this.inputDialogProceed = `//div[@role='dialog']//input`;
		this.btnToProceed = `//span[text()='Yes, Proceed']`;
		this.btnDeleteQuestion = `//div[contains(@style,"opacity: 1")]//button[@aria-label="Delete"]`;
		this.txtSurveyTitle = "//input[@placeholder='Untitled Survey']";
		this.btnAddOption = "(//span[text()='Add option'])[last()]";
		this.txtAddOption = "(//input[@placeholder='Add option'])[last()]";
		this.txtEditSurveyName = "(//input[@data-testid = 'input'])[1]";
		this.btnBackButton = "//input[@data-testid = 'input']//preceding::a";
		this.btnCreateNewSurvey = "//span[contains(text(),'Create new')]";
		this.txtSurveyHeaders = "//div[@class='welcome-text']";
		this.getBtnAddVariable = (questionNumber) =>
			questionNumber
				? `(//button[@aria-label='Add Variable'])[${questionNumber}]`
				: `//button[@aria-label='Add Variable']`; //same can be used in all the places where we need to add variable question number includes section number as well
		this.elementHeaderSection =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-iddGajr-css']";
		this.inputPlaceholder = "//input[@placeholder='Search variable']";
		this.inputSectionsHeader = (sectionNumber) =>
			`(//h1[text()='${sectionNumber}']/ancestor::div[@data-testid='flex'])[last()]//div[@contenteditable='true']`;
		this.dropdownVariable = (option) =>
			`//div[@data-testid='variable-menu-item-0']/p[text()='${option}']`;
		this.getSectionElement = (sectionNumber) =>
			`(//div[contains(@class, 'builder-sidebar-section-block')])[${sectionNumber}]`;
		this.headerSection =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-idxYVvq-css builder-sidebar-welcome-block']";
		this.inputQuestionElement = (questionNumber) =>
			`(//div[@class="question-text" and @contenteditable="true"])[${questionNumber}]`;
		this.btnCreate = '//div[contains(text(), "Create")]';
		this.btnConfigure = '//div[@role="menuitem" and .//p[text()="Configure"]]';
		this.btnChangeImage = `(//div[contains(@class, 'image-controls')]//button)[1]`;
		this.surveyIntroImage = `(//div[contains(@class, 'welcome-image-container')]//div)[1]`;
		this.inputImage = `//div[@data-testid='box']//input[@type='file']`;
		this.btnAddImageSectionHeader = `(//h1[@data-testid='heading']/ancestor::*[3]/preceding-sibling::div[contains(@class, 'actions-toolbar')]//button[@aria-label='Add image'])[1]`;
		this.btnEditRatingScale = `//button[@data-testid="survey-defaults_icon-button_edit-scale"]`;
		this.ratingSlider = `//div[@role='slider']`;
		this.btnUpdateRatingScale = `//span[text()='Update']`;
		this.btnSaveRatingScale = `//button[@data-testid="edit-scale-modal_button_save-update"]`;
		this.btnOverrideChanges = `//button[@data-testid="comman-confirmation-modal_button_confirm"]`;
		this.btnMenuForQuestion = (questionNumber) =>
			`(//div[@aria-haspopup="menu"])[${questionNumber}]`;
		this.scaleLabels = (questionNumber) =>
			`(//div[contains(@class, 'ifixGjY-css')])[${questionNumber}]//div[contains(@class, 'ileZfAw-css')]/div`;
		this.btnMoreOption = `//button[@aria-label="more options"]`;
		this.btnAddScale = `//div[text()='Add Scale' and @role='menuitem']`;
		this.inputRatingScaleTitle = `//input[@name="scaleTitle"]`;
		this.imgSurveyIntro = `//div[@class='twigs-c-PJLV twigs-c-PJLV-iflKSSN-css image-controls']/parent::div`;
		this.imgSectionInto = `//div[@class='twigs-c-PJLV twigs-c-PJLV-iiETCpq-css image-controls']/parent::div`;
		this.previewFrame = "//iframe[@id='responsive-preview-iframe']";
		this.inputSearchLanguage = `//div[text()='Search from 100+ languages']/following-sibling::div//input`;
		this.btnYesChange = `//span[text()="Yes, change"]/ancestor::button`;
		this.eui = new EUI(page);
		this.surveyPreviewPage = new SurveyPreviewPage(page);
		this.btnDropdownSourceLanguage = `//span[text()='Source']`;
		this.dropDownScaleOnConfigure =
			"//label[text()='Scale']/following::input[@class='twigs-select__input'][1]";
		this.checkboxStartFromZero =
			"//button[@id='include-zero'] | //label[text()='Start from zero']/parent::div/button";
		this.dropDownTypeOnConfigure =
			"(//label[text()='Type']/following::input[@class='twigs-select__input'])[1]";
		this.checkboxMarkAsMandatory =
			"//button[@id='mark-as-required-text-question']";
		this.inputPlaceholderOnConfigure =
			"//input[@value='Please Enter Your Response']";
		this.checkboxIncludeOther =
			"//label[contains(text(),Other)]/preceding-sibling::button";
		this.toggleMinSelection =
			"//div//label[text()='Customise no: of minimum selectable options']";
		this.toggleMinSelectionButton =
			"//div//label[text()='Customise no: of minimum selectable options']//ancestor::div[3]//preceding-sibling::button";
		this.inputMinSelectionBox =
			"//div//label[text()='Customise no: of minimum selectable options']//ancestor::div[4]//div[contains(@class, 'twigs-select--dropdown-indicator-right')]";
		this.dropdownMinSelection = (number) =>
			`//div//label[text()='Customise no: of minimum selectable options']//ancestor::div[4]//div[contains(@class, 'twigs-select__menu')]//div[text()='${number}']`;
		this.toggleMaxSelection =
			"//div//label[text()='Customise no: of maximum selectable options']";
		this.toggleMaxSelectionButton =
			"//div//label[text()='Customise no: of maximum selectable options']//ancestor::div[3]//preceding-sibling::button";
		this.inputMaxSelectionBox =
			"//div//label[text()='Customise no: of maximum selectable options']//ancestor::div[4]//div[contains(@class, 'twigs-select--dropdown-indicator-right')]";
		this.dropdownMaxSelection = (number) =>
			`//div//label[text()='Customise no: of maximum selectable options']//ancestor::div[4]//div[contains(@class, 'twigs-select__menu')]//div[text()='${number}']`;
		this.errorMaxLessThanMin =
			"//p[text()='Maximum value should be more than minimum value']";
		this.inputOtherPlaceholder =
			"//button[@value='on']//following::div//input[@data-testid='multi-choice-configure_placeholder-input']";
		this.getMCQOptionDraggableXpath = (questionName, optionValue) =>
			`//span[normalize-space()='${questionName}']/ancestor::div[@data-testid='box'][1]//following::div[1]//input[@value='${optionValue}']/parent::div`;
		this.getMCQOptionsXpath = (sectionName, questionName) =>
			`//span[normalize-space()='${questionName}']/ancestor::div[@data-testid='box'][1]//following::div[1]//input[contains(@data-testid,'multi-choice_option-input')]`;
		this.getSectionByName = (sectionName) =>
			`//div[contains(@class, 'builder-sidebar-section-block')]//p[text()='${sectionName}']`;
		this.lblWarningForScaleChange =
			"//p[contains(text(),'If you are changing a question scale')]";
		this.dropdownRatingScale =
			"//div[@class='twigs-select__control css-reqq1a-control']";
		this.dropdownEngageRatingScale =
			"//label[normalize-space(.)='Scale']/ancestor::div[@data-testid='flex']/following-sibling::div[1]//div[contains(@class, 'twigs-select__control')]";
		this.txtQuestionDescription = "//p[text()='Your content goes here!']";
		this.btnAddDisplayLogic = "(//button[@aria-label='Add display logic'])[1]";
		this.btnAddDisplayLogicSection =
			"(//button[@aria-label='Add display logic'])[last()]";
		this.txtAddCondition = "//span[text()='Add Condition']";
		this.btnAddQustions = "//div[text()='Question']";
		this.txtAddQustion =
			"(//p[text()='Search']//following::div[@aria-disabled])[1]";
		this.btnLessThan = "//div[text()='Less than']";
		this.btnApplyLogic = "//span[text()='Apply Logic']";
		this.AddCustomLogic = "//p[text()='Custom Logic']";
		this.getQuestionElement = (questionNumber) =>
			`(//div[@class="question-text" and@data-testid="editor_content-editable"])[${questionNumber}]`;
		this.btnGoalBasedQuestion =
			"//button[@data-testid='question-type-card-Goal']";
		this.btnGoalBasedQuestion =
			"//button[@data-testid='question-type-card-Goal']";
		this.btnGoalBasedQuestion =
			"//button[@data-testid='question-type-card-Goal']";
		this.drpDwnGoalCycle =
			"(//p[text()='Where Goal Cycle is']/following::div/div/p[1])[1]";
		this.search = `//input[@placeholder="Search"]`;
		this.btnAllCycles = `//button[contains(@data-testid,'checkbox_select-all-checkbox')]`;
		this.chkBoxSelectSearchedCycle = (cycleName) =>
			`//p[text()='${cycleName}']/parent::div/parent::div/preceding-sibling::div/button`;
		this.btnApply = "//span[text()='Apply']";
		this.btnCanelInCycleDropDown = `//button[@data-testid="cascaded-custom-dropdown_button"]/span[text()="Cancel"]`;
		this.btnAddCondition = `//span[text()='Add Condition']`;
		this.btnChoiceForCondition = (choice) =>
			`//p[@data-testid="text" and text()='${choice}']`;
		this.btnChooseValue = `//p[text()='Choose value']`;
		this.chkBoxSelectSearchedEmployee = (employeeName) =>
			`//p[text()='${employeeName}']/parent::div/parent::div/preceding-sibling::div/button`;
		this.radioBtnGoalRatingcale = `//p[text()='Feedback method']/following-sibling::div//p[text()='Rating Scale']/parent::label/preceding-sibling::button`;
		this.radioBtnGoalText = `//p[text()='Feedback method']/following-sibling::div//p[text()='Text']/parent::label/preceding-sibling::button`;
		this.btnSave = "//span[text()='Save']";
		this.btnstartSurvey = "//button[@data-qa='welcome_cta_button']/span";
		this.chkBoxIncludeNAInGoalQuestion = `//button[@data-testid="question-level-edit-scale-modal_checkbox_include-na"]`;
		this.toggleMakeReasonMandatoryForGoalQuestion = `//button[@data-testid="goal-based-configure_switch_required"]`;
		this.txtBoxPlacholderForGoalQuestion = `//input[@data-testid="goal-based-configure_input_placeholder-text"]`;
		this.btnRatingScaleConfigForGoalQuestion = `//div[@data-testid="goal-based-configure_flex_rating-config"]`;
		this.txtBoxPlaceholderForTextGoalQuestion = `//input[@data-testid="text-options_input_placeholder"]`;
		this.btnSaveConfigurationTexBasedForGoalQuestion = `//button[@data-testid="text-options_button_update"]`;
		this.btnCloseButtonForGoalQuestionConfig = `//button[@data-testid="question-level-edit-scale-modal_icon-button_close"]`;
		this.btnDropDownConditionValues = (conditionType) =>
			`(//p[text()='Where ${conditionType} is']/following::div/div/p[1])[1]`;
		this.btnCancelInGoalModal = `//button[@data-testid="goal-based-configure_button_cancel"]`;
		this.inputScaleLabelForIndex = (index) =>
			`//input[@data-testid="question-level-edit-scale-modal_input_${index}"]`;
		this.chkBoxIncludeNAInGoalQuestion = `//button[@data-testid="question-level-edit-scale-modal_checkbox_include-na"]`;
		this.toggleMakeReasonMandatoryForGoalQuestion = `//button[@data-testid="goal-based-configure_switch_required"]`;
		this.txtBoxPlacholderForGoalQuestion = `//input[@data-testid="goal-based-configure_input_placeholder-text"]`;
		this.btnRatingScaleConfigForGoalQuestion = `//div[@data-testid="goal-based-configure_flex_rating-config"]`;
		this.txtBoxPlaceholderForTextGoalQuestion = `//input[@data-testid="text-options_input_placeholder"]`;
		this.btnSaveConfigurationTexBasedForGoalQuestion = `//button[@data-testid="text-options_button_update"]`;
		this.btnCloseButtonForGoalQuestionConfig = `//button[@data-testid="question-level-edit-scale-modal_icon-button_close"]`;
		this.btnDropDownConditionValues = (conditionType) =>
			`(//p[text()='Where ${conditionType} is']/following::div/div/p[1])[1]`;
		this.btnCancelInGoalModal = `//button[@data-testid="goal-based-configure_button_cancel"]`;
		this.inputScaleLabelForIndex = (index) =>
			`//input[@data-testid="question-level-edit-scale-modal_input_${index}"]`;
		this.checkboxIncludeNA = '//button[@id="include-na"]';
		this.inputStartFromZero =
			'//input[@data-testid="question-level-edit-scale-modal_input_0"]';
		this.buttonMandatoryButtonForQuestion =
			"//div[contains(@class,'actions-toolbar') and contains(@style,'opacity: 1')]//button[@aria-label='Make question mandatory']";
		this.lblSectionName = (sectionName) => `//p[text()='${sectionName}']`;
		this.chkBoxIncludeEnpsZero =
			"//p[contains(text(),'eNPS')]/parent::div/following-sibling::div//button[@role='checkbox']";
	}

	/**
	 * Function to get Xpath of a section or Question
	 *
	 * @param {String} sectionNameorQuestion - The name of the section or Question to get Xpath
	 */
	getSectionOrQuestionXpath(sectionNameorQuestion) {
		return `//p[text()='Questions']/ancestor::aside//p[text()='Questions']/following::p[text()='${sectionNameorQuestion}']`;
	}

	/**
	 * Function to get Xpath to add a question in a section
	 *
	 * @param {String} sectionName - The name of the sectio to get Xpath
	 */
	getNewQuestionInSectionXpath(sectionName) {
		return `(//p[text()='${sectionName}']/ancestor::div[@draggable='true']//span[text()='New Question'])[last()]`;
	}

	/**
	 * Function to get Xpath based on Question type and add qusetion
	 *
	 * @param {String} questionType - The name of the sectio to get Xpath
	 */
	getQuestionTypeAddXpath(questionType) {
		return `(//p[contains(text(),'${questionType}')])[last()]`;
	}

	/**
	 * Function to get Xpath based on Question type
	 *
	 * @param {String} questionType - The type of the question to get Xpath
	 */
	getQuestionTypeXpath(questionType) {
		return `//p[text()='${questionType}']/parent::div/preceding-sibling::button`;
	}

	/**
	 * Function to get Xpath for all Questions in a section
	 *
	 * @param {String} sectionName - The name of the section in which to get Xpath for all Questions
	 */
	allQuestionsXpathInSection(sectionName) {
		return `//p[text()='Questions']/ancestor::aside//div[.//p[text()='${sectionName}']]/following-sibling::div[contains(@class,'builder-sidebar-question-block')]/p`;
	}

	/**
	 * FUnction to get section or Question Xpath to drag or drop
	 *
	 * @param {String} sectionNameOrQuestionName - The name of the section or question to drag and drop
	 */
	getSectionOrQuestionXpathToDragAndDrop(sectionNameOrQuestionName) {
		return `//p[text()='${sectionNameOrQuestionName}']/parent::div`;
	}

	/**
	 * Function to get Xpath for a Question Bank
	 *
	 * @param {String} questionBank - The name of the Question Bank
	 */

	async getQuestionBankXpath(questionBank) {
		return `//div[@data-testid="box"]/p[normalize-space()='${questionBank}']`;
	}

	/**
	 * Function to get Xpath for Select all button in particlar question bank
	 *
	 * @param {String} questionBank - The name of the Question Bank
	 */

	async getSelectAllButtonXapthInQuestionBank(questionBank) {
		return `(//p[normalize-space()='${questionBank}']/parent :: div[@data-testid="box"]/descendant :: p)[last()]`;
	}

	/**
	 * Function to get Accordion Xpath For QuestionBank to see question present in questions bank
	 *
	 * @param {String} questionBankName - The name of the Question Bank
	 */

	async getAccordionXpathForQuestionBank(questionBankName) {
		return `//p[normalize-space()='${questionBankName}']/ancestor::button/child::*[name()='svg']`;
	}

	/**
	 * Function to get All Questions Xpath in Question Bank
	 *
	 * @param {String} questionBankName - The name of the Question Bank
	 */

	async getAllQuestionsXpathInQuestionBank(questionBankName) {
		return `//p[normalize-space()='${questionBankName}']/ancestor::div[@data-state="open"]/descendant::label`;
	}

	/**
	 * Function to get the question name
	 *
	 * @param {String} questionName - The name of the question
	 */
	getQuestionName(questionName) {
		return `//span[text()='${questionName}']`;
	}

	getRatingScaleQuestionContainerXpath(question) {
		return `//span[text()='${question}']/ancestor::div[contains(@id, 'question-container')]//p[text()='Strongly Disagree']`;
	}

	/**
	 * Function to set the logic value
	 *
	 * @param {String} LogicValue - The value of the rating question
	 */
	setLogicValue(LogicValue) {
		return `//div[text()='${LogicValue}']`;
	}

	/**
	 * Function to get the scale option Xpath
	 *
	 * @param {String} scaleName - The name of the scale to get Xpath
	 */

	getScaleOptionXpath(scaleName) {
		return `//div[contains(@class,'menu-list')]//*[contains(text(), '${scaleName}')]`;
	}

	/**
	 * Adds language by navigating to select language section. It selects the language provided
	 * @param {Array<string>} languages
	 */

	async addLanguage(languages) {
		await PwActions.click(this.page, this.btnSelectLanguage);
		await PwActions.click(this.page, this.btnAddLanguage);
		for (let i = 0; i < languages.length; i++) {
			this.btnLanguage = `//p[text()='${languages[i]}']/ancestor::div[@data-testid='chip']`;
			await PwActions.click(this.page, this.btnLanguage);
		}
		await PwActions.click(this.page, this.btnAddTranslations);
		await PwActions.waitTillVisible(
			this.page,
			this.txtAddTranslationsConfirmation,
			100000,
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.txtAddTranslationsConfirmation,
		);
		await PwActions.click(this.page, this.btnCloseLanguageModel);
	}

	/**
	 * Function to Add a new Section in survey builder.
	 *
	 * @param {string} sectionName - The name of the New Section.
	 * @param {string} sectionDescription - The description for the section
	 */

	async addSection(sectionName, sectionDescription = "") {
		await CommonUtils.sleep(6);
		await PwActions.click(this.page, this.btnAddNewSection);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(6);
		await PwActions.waitForNetworkIdle(this.page, 15000);
		await PwActions.fill(this.page, this.txtBoxSectionTitle, sectionName);
		await CommonUtils.sleep(4);
		await PwActions.waitForNetworkIdle(this.page, 15000);
		if (sectionDescription) {
			await PwActions.fill(
				this.page,
				this.txtSectionDescription,
				sectionDescription,
			);
			await CommonUtils.sleep(2);
		}
	}

	/**
	 * Function to Edit a new Section in survey builder.
	 *
	 * @param {string} sectionName - The name of the New Section.
	 * @param {string} sectionDescription - The description for the section
	 */

	async editSectionEngage(sectionName, sectionDescription = "") {
		await CommonUtils.sleep(2);
		await PwActions.fill(this.page, this.txtBoxSectionTitle, sectionName);
		await CommonUtils.sleep(2);
		if (sectionDescription) {
			await PwActions.fill(
				this.page,
				this.txtSectionDescription,
				sectionDescription,
			);
			await CommonUtils.sleep(2);
		}
	}

	/**
	 * Function to Verify the Added Section in survey builder.
	 *
	 * @param {string} newSectionName - The name of the New Section.
	 * @param {string} newSectionDescription - The description for the section
	 */

	async verifyAddedSection(newSectionName, newSectionDescription = "") {
		const section = this.getSectionOrQuestionXpath(newSectionName);
		await CommonUtils.sleep(4);
		await PwActions.pageRefresh(this.page);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(4);
		await PwActions.waitTillVisible(this.page, section);
		await PwActions.click(this.page, section);
		const actualValue = await PwActions.getText(
			this.page,
			this.txtBoxSectionTitle,
		);
		await PwActions.verifyTextExpected(actualValue, newSectionName);
		if (newSectionDescription) {
			const actualDescription = await PwActions.getText(
				this.page,
				this.txtSectionDescription,
			);
			await PwActions.verifyTextExpected(
				actualDescription,
				newSectionDescription,
			);
		}
	}

	/**
	 * Deletes a section based on the provided section name.
	 *
	 * @param {string} sectionName - The name of the section to be deleted.
	 */

	async deleteSection(sectionName) {
		this.lblSectionName = `//p[text()='${sectionName}']`;
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.lblSectionName);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.hover(this.page, this.containerSectionDetails);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.waitTillVisible(this.page, this.btnDeleteSection);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(3);
		await PwActions.waitForNetworkIdle(this.page, 2000);
		await PwActions.click(this.page, this.btnDeleteSection);
		await PwActions.click(this.page, this.btnConfirmDeleteSection);
	}

	/**
	 * Function to verify whether the section is deleted or not in survey builder.
	 *
	 * @param {array} allSectionsAfterSectionDeleted - Names of all sections after deleting a secction.
	 * @param {String} deletedSection - Name of the deleted Section
	 */

	async verifySectionDeleted(allSectionsAfterSectionDeleted, deletedSection) {
		try {
			expect(allSectionsAfterSectionDeleted).not.toContain(deletedSection);
		} catch (error) {
			throw new Error(`Section "${deletedSection}" is not deleted.`);
		}
	}

	// Delete first section

	async deleteFirstSection() {
		await PwActions.click(this.page, this.containerFirstSection);
		await PwActions.hover(this.page, this.containerSectionDetails);
		await PwActions.click(this.page, this.btnDeleteSection);
		await PwActions.click(this.page, this.btnConfirmDeleteSection);
	}

	// Delete first section

	async verifyFirstSectionDeletion() {
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.containerFirstSection,
		);
	}

	/**
	 * Adds Questions to the section based on the provided section name, question type and question description.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.sectionName - The name of the section in which question to add.
	 * @param {string} params.questionType - The type of the question to add (EX: RATING SCALE, TEXT INPUT, Goals, eNPS, MultiChoice).
	 * @param {string} [params.questionDescription=""] - The question description to add.
	 * @param {Object} [params.settings={}] - Configuration settings for the question (mainly for Goals questions).
	 * @param {string} [params.settings.goalCycle] - For Goals: The Goal Cycle to filter goals by.
	 * @param {Array<Object>} [params.settings.conditions] - For Goals: Array of conditions to filter goals.
	 * @param {string} params.settings.conditions[].condition - Condition type (e.g., "Goal Manager", "Goal Owner", "Goal Level").
	 * @param {string} params.settings.conditions[].value - The value to filter by.
	 * @param {string} [params.settings.feedbackMethod] - For Goals: "Rating Scale" or "Text".
	 *
	 * @example
	 * // Add a Rating Scale question
	 * await surveyBuilderPage.addQuestionInSection({
	 *   sectionName: "Performance",
	 *   questionType: "Rating Scale",
	 *   questionName: "How would you rate this?"
	 * });
	 *
	 * @example
	 * // Add a Goals question with conditions
	 * await surveyBuilderPage.addQuestionInSection({
	 *   sectionName: "Leadership Skills",
	 *   questionType: "Goals",
	 *   questionName: "Collect feedback on goals owned by 'Subject'",
	 *   settings: {
	 *     goalCycle: "Q1 2024",
	 *     conditions: [
	 *       { condition: "Goal Manager", value: "John Doe" },
	 *       { condition: "Goal Level", value: "Team" }
	 *     ],
	 *     feedbackMethod: "Rating Scale"
	 *   }
	 * });
	 */

	async addQuestionInSection({
		sectionName,
		questionType,
		questionName = "",
		settings = {},
	}) {
		const addQuestion = this.getNewQuestionInSectionXpath(sectionName);
		const question = this.getQuestionTypeXpath(questionType);
		const questionAdd = this.getQuestionTypeAddXpath(questionType);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.waitTillVisible(this.page, addQuestion);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, addQuestion);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, questionAdd);
		await CommonUtils.sleep(2);
		await PwActions.scroll(this.page, questionAdd);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, questionAdd);
		await CommonUtils.sleep(5);
		if (questionName) {
			await PwActions.waitForNetworkIdle(this.page, 5000);
			await PwActions.fill(this.page, this.txtQuestionTextArea, questionName);
		} else {
			await PwActions.fill(this.page, this.txtQuestionTextArea, questionType);
		}
		if (questionType === "eNPS") {
			if (questionName == "") {
				questionName = constants.eNPSQuestion;
			}
			await PwActions.clearAndFill(
				this.page,
				this.txtQuestionTextArea,
				questionName,
			);
		} else if (questionType === "MultiChoice") {
			for (let i = 1; i <= 4; i++) {
				await PwActions.waitForNetworkIdle(this.page, 5000);
				await CommonUtils.sleep(1);
				await PwActions.waitTillVisible(this.page, this.btnAddOption);
				await PwActions.click(this.page, this.btnAddOption);
				await PwActions.fill(this.page, this.txtAddOption, `Option ${i}`);
				await PwActions.waitForNetworkIdle(this.page, 2000);
				await CommonUtils.sleep(2);
			}
		} else if (questionType === "Goal") {
			// Handle Goal Cycle selection
			if (settings.goalCycle) {
				await PwActions.click(this.page, this.drpDwnGoalCycle);
				await PwActions.waitForDOMContentLoaded(this.page, 15000);
				await PwActions.click(this.page, this.btnAllCycles);
				await CommonUtils.sleep(1);
				await PwActions.click(this.page, this.btnAllCycles);
				await PwActions.waitForDOMContentLoaded(this.page, 15000);
				await PwActions.fill(this.page, this.search, settings.goalCycle);
				await PwActions.click(
					this.page,
					this.chkBoxSelectSearchedCycle(settings.goalCycle),
				);
				await PwActions.click(this.page, this.btnApply);
				await CommonUtils.sleep(2);
				await PwActions.waitForNetworkIdle(this.page, 2000);
			}

			// Handle multiple conditions
			if (settings.conditions && Array.isArray(settings.conditions)) {
				for (
					let eachConditionIndex = 0;
					eachConditionIndex < settings.conditions.length;
					eachConditionIndex++
				) {
					const conditionItem = settings.conditions[eachConditionIndex];

					// Click Add Condition button
					await PwActions.click(this.page, this.txtAddCondition);
					await CommonUtils.sleep(1);

					// Select the condition type (e.g., "Goal Manager", "Goal Owner", etc.)
					if (conditionItem.condition) {
						await PwActions.click(
							this.page,
							this.btnChoiceForCondition(conditionItem.condition),
						);
						await CommonUtils.sleep(1);
					}

					// Click "Choose value" to open the value selector
					await PwActions.click(this.page, this.btnChooseValue);
					await CommonUtils.sleep(1);

					// Search and select the value
					if (conditionItem.value) {
						for (const value of conditionItem.value) {
							await PwActions.fill(this.page, this.search, value);
							await CommonUtils.sleep(1);
							await PwActions.click(
								this.page,
								this.chkBoxSelectSearchedEmployee(value),
							);
						}
						await PwActions.click(this.page, this.btnApply);
						await CommonUtils.sleep(2);
					}
				}
			}

			// Handle Feedback Method selection
			if (settings.feedbackMethod) {
				if (settings.feedbackMethod === "Rating Scale") {
					await PwActions.click(this.page, this.radioBtnGoalRatingcale);
					await CommonUtils.sleep(1);
				} else if (settings.feedbackMethod === "Text") {
					await PwActions.click(this.page, this.radioBtnGoalText);
					await CommonUtils.sleep(1);
				}
			}

			// Click Save button to save the Goal question configuration
			await PwActions.click(this.page, this.btnSave);
			await CommonUtils.sleep(3);
		}

		await PwActions.waitForDOMContentLoaded(this.page, 10000);
		await PwActions.waitForNetworkIdle(this.page, 2000);
	}

	/**
	 * Edit Questions to the section based on the provided section name, question type and question description.
	 * @param {string} sectionName - The name of the section in which question to add.
	 * @param {string} questionType - The type of the question to add (EX : RATING SCALE,TEXT INPUT).
	 * @param {string} questionDescription - The question description to add.
	 */

	async editQuestionInSection(
		sectionName,
		questionType,
		questionDescription = "",
	) {
		const questionAdd = this.getQuestionTypeAddXpath(questionType);
		await PwActions.click(this.page, this.txtQuestionTextArea);
		await PwActions.click(this.page, this.drpdwnEditQuestion);
		await PwActions.click(this.page, this.btnChangeQuestionType);
		if (await PwActions.elementIsVisible(this.page, this.txtUnlock)) {
			await PwActions.click(this.page, this.txtUnlock);
			await PwActions.fill(this.page, this.txtUnlock, "Proceed");
			await PwActions.click(this.page, this.btnToProceed);
		}
		await CommonUtils.sleep(2);
		await PwActions.fill(this.page, this.txtQuestionTextArea, questionType);
		await CommonUtils.sleep(2);
		if (questionDescription) {
			await PwActions.fill(
				this.page,
				this.txtQuestionTextArea,
				questionDescription,
			);
		}
		await CommonUtils.sleep(3);
		await PwActions.waitTillVisible(this.page, questionAdd);
		await PwActions.scroll(this.page, questionAdd);
		await PwActions.click(this.page, questionAdd);
		await CommonUtils.sleep(2);
	}

	/**
	 * Delete Questions to the section based on the provided section name, question type and question description.
	 */

	async deleteQuestionInSection(questionNameinSection) {
		if (
			!(await PwActions.elementIsVisible(this.page, this.txtQuestionTextArea))
		) {
			await PwActions.click(this.page, this.txtboxFirstQuestion);
		}
		const questionName = this.getQuestionName(questionNameinSection);
		await PwActions.hover(this.page, questionName);
		await PwActions.waitTillVisible(this.page, this.btnDeleteQuestion);
		await PwActions.click(this.page, this.btnDeleteQuestion);
		await PwActions.click(this.page, this.btnConfirmDeleteSection);
	}

	/**
	 * Function Verify the question added in New Section.
	 *
	 * @param {Object} options - The options object.
	 * @param {string} options.question - The name of the Question.
	 * @param {import('@playwright/test').Page} [options.page=this.page] - The Playwright page instance.
	 */

	async verifyAddedQuestion({ question, page = this.page }) {
		try {
			const addedQuestionName = await PwActions.getText(
				page,
				this.txtQuestionTextArea,
			);
			if (question === "eNPS") {
				const eNPSQuestion = constants.eNPSQuestion;
				await PwActions.verifyTextExpected(addedQuestionName, eNPSQuestion);
			} else {
				await PwActions.verifyTextExpected(addedQuestionName, question);
			}
		} catch (error) {
			throw new Error(`Question is not added ${question}`);
		}
	}

	/**
	 * Function to get all the Section Elements
	 *
	 * @returns {Promise<array>} allsectionsElements - an array of all sections elements
	 */

	async getSectionsElements() {
		const allsectionsElements = await PwActions.getWebElementsPage(
			this.page,
			this.webElementsAllSections,
		);
		return allsectionsElements;
	}

	/**
	 * Function to get the Names of all sections
	 *
	 * @returns {Promise<array>} allSectionsNames - an array of all sections Names
	 */

	async getSectionsNames() {
		const sectionElements = await this.getSectionsElements();
		const allSectionsNames = await PwActions.getElementsText(
			this.page,
			sectionElements,
		);
		return allSectionsNames;
	}

	/**
	 * Function to get all the Questions Elements
	 *
	 * @returns {Promise<array>} allQuestionsElements - an array of all questions elements
	 */

	async getQuestionsElements() {
		const allQuestionsElements = await PwActions.getWebElementsPage(
			this.page,
			this.webElementsAllQuestions,
		);
		return allQuestionsElements;
	}

	/**
	 * Function to get the Names of all questions
	 *
	 * @returns {Promise<array>} allQuestionsNames - an array of all questions Names
	 */

	async getQuestionsNames() {
		const questionsElements = await this.getQuestionsElements();
		const allQuestionsNames = await PwActions.getElementsText(
			this.page,
			questionsElements,
		);
		return allQuestionsNames;
	}

	/**
	 * Function to get the total number of questions in the survey
	 * @returns {Promise<number>} The total number of questions in the survey
	 * @example
	 * const totalQuestions = await getTotalQuestions();
	 * console.log(totalQuestions);
	 */

	async getTotalQuestions(page = this.page) {
		const questionsElements = await this.getQuestionsElements(page);
		return questionsElements.length;
	}

	/**
	 * Function to get all Question Elements in a Section.
	 *
	 * @param {string} sectionName - Section name to get questions Elements
	 * @returns {Promise<array>} allQuestionsElementsInSection - an array of questions elements in section
	 */

	async getQuestionsElementsInSection(sectionName) {
		const questionsInSection = this.allQuestionsXpathInSection(sectionName);
		const allQuestionsElementsInSection = await PwActions.getWebElementsPage(
			this.page,
			questionsInSection,
		);
		return allQuestionsElementsInSection;
	}

	/**
	 * Function to get all Question Names in a Section.
	 *
	 * @param {string} sectionName - Section name to get questions Names
	 * @returns {Promise<array>} allQuestionsNamesInSection - an array of questions Names in section
	 */

	async getQuestionsNamesInSection(sectionName) {
		const questionsElementsInSection =
			await this.getQuestionsElementsInSection(sectionName);
		const allQuestionsNamesInSection = await PwActions.getElementsText(
			this.page,
			questionsElementsInSection,
		);
		return allQuestionsNamesInSection;
	}

	// Function to get all the Question Banks Elements and store in allQuestionBanksElements array

	async getQuestionBanksElements() {
		const allQuestionBanksElements = await PwActions.getWebElementsPage(
			this.page,
			this.webElementsAllQuestionbanks,
		);
		return allQuestionBanksElements;
	}

	// Function to get the Names of all question Banks and store in allQuestionBanksNames array

	async getQuestionBanksNames() {
		const questionBankElements = await this.getQuestionBanksElements();
		const allQuestionBanksNames = await PwActions.getElementsText(
			this.page,
			questionBankElements,
		);
		return allQuestionBanksNames;
	}

	/**
	 * Function to get all the Questions Elements in Question Bank and store in questionsElementsInQuestionBank array
	 * @param {string} questionBank -  name of the question bank
	 **/

	async getQuestionsElementsInQuestionBank(questionBank) {
		const questionsXpathInQuestionBank =
			await this.getAllQuestionsXpathInQuestionBank(questionBank);
		const questionsElementsInQuestionBank = await PwActions.getWebElementsPage(
			this.page,
			questionsXpathInQuestionBank,
		);
		return questionsElementsInQuestionBank;
	}

	/**
	 * Function to get all the Questions Names in Question Bank and store in allQuestionsNamesInQuestionBank array
	 * @param {string} questionBank -  name of the question bank
	 **/

	async getQuestionsNamesInQuestionBank(questionBank) {
		const questionsElementsInQuestionBank =
			await this.getQuestionsElementsInQuestionBank(questionBank);
		const allQuestionsNamesInQuestionBank = await PwActions.getElementsText(
			this.page,
			questionsElementsInQuestionBank,
		);
		return allQuestionsNamesInQuestionBank;
	}

	/**
	 * Function to Edit the Sections
	 *
	 * @param {string} sectionName -  The Name of the Section to edit.
	 * @param {string} newSectionName -  The Name of the New Section to edit.
	 * @param {string} newsectionDescription -  New Description to edit.
	 */

	async editSections(sectionName, newSectionName, newSectionDescription = "") {
		const section = this.getSectionOrQuestionXpath(sectionName);
		await PwActions.click(this.page, section);
		await PwActions.click(this.page, this.txtSectionTitle);
		await CommonUtils.sleep(2);
		await PwActions.clearAndFill(
			this.page,
			this.txtBoxSectionTitle,
			newSectionName,
		);
		await CommonUtils.sleep(2);
		if (newSectionDescription) {
			await PwActions.clearAndFill(
				this.page,
				this.txtSectionDescriptionToEdit,
				newSectionDescription,
			);
			await CommonUtils.sleep(2);
		}
	}

	/**
	 * Function to verify the changes done in sections.
	 *
	 * @param {string} newSectionName -  The Name of the New Section which is edited.
	 * @param {string} newsectionDescription -  New Description which is edited.
	 */

	async verifySectionChanges(newSectionName, newsectionDescription = "") {
		try {
			const section = this.getSectionOrQuestionXpath(newSectionName);
			await PwActions.pageRefresh(this.page);
			await PwActions.click(this.page, section);
			const actualValue = await PwActions.getText(this.page, section);
			await PwActions.verifyTextExpected(actualValue, newSectionName);
			if (newsectionDescription) {
				const actualDescription = await PwActions.getText(
					this.page,
					this.txtSectionDescriptionToEdit,
				);
				await PwActions.verifyTextExpected(
					actualDescription,
					newsectionDescription,
				);
			}
		} catch (error) {
			throw new Error(`Section verification failed: ${error.message}`);
		}
	}

	/**
	 * Function to rearrange the sections.
	 *
	 * @param {string} sectionNameToDrag -  The Name of the Section to drag.
	 * @param {string} sectionNameToDrop -  The Name of the Section to drop.
	 * @param {Array} sectionNames - All Section Names in a survey.
	 */

	async reArrangeSections(sectionNameToDrag, sectionNameToDrop, sectionNames) {
		const sectionToDrag = sectionNameToDrag;
		let sectionToDrop = sectionNameToDrop;
		while (sectionToDrag === sectionToDrop) {
			logger.info(
				`Both section to drag and drop are the same: ${sectionToDrag}. Generating a new section to drop...`,
			);
			sectionToDrop = generateRandomName(sectionNames);
			logger.info(`Generated new section to drop: ${sectionToDrop}`);
		}
		const sectionToDragXpath =
			this.getSectionOrQuestionXpathToDragAndDrop(sectionToDrag);
		const sectionToDropXpath =
			this.getSectionOrQuestionXpathToDragAndDrop(sectionToDrop);
		await PwActions.waitForNetworkIdle(this.page, 5000);
		await PwActions.dragAndScrollUntilDropVisible(
			this.page,
			sectionToDragXpath,
			sectionToDropXpath,
		);
		await PwActions.waitForNetworkIdle(this.page, 5000);
		await CommonUtils.sleep(1);
		await PwActions.pageRefresh(this.page);
		await PwActions.waitTillVisible(this.page, sectionToDragXpath);
	}
	/**
	 * Function to verify rearrranged sections.
	 *
	 * @param {Array} sectionsOrderBeforeReArrange -  The order of the sections before rearranging the sections.
	 * @param {Array} sectionsOrderAfterReArrange -  The order of the sections after rearranging the sections.
	 * @param {string} sectionNameToDrag -  The Name of the Section to drag.
	 * @param {string} sectionNameToDrop -  The Name of the Section to drop.
	 */
	async verifyreArrangedSections(
		sectionsOrderBeforeReArrange,
		sectionsOrderAfterReArrange,
		sectionNameToDrag,
		sectionNameToDrop,
	) {
		const indexOFSectionNameToDrop =
			sectionsOrderBeforeReArrange.indexOf(sectionNameToDrop);
		expect(sectionsOrderBeforeReArrange.length).toBe(
			sectionsOrderAfterReArrange.length,
			"The sections count is not matched before and after rearrange",
		);
		expect(sectionsOrderAfterReArrange[indexOFSectionNameToDrop]).toBe(
			sectionNameToDrag,
			"Sections are not rearranged",
		);
	}

	/**
	 * Function to rearrange the Questions.
	 *
	 * @param {string} questionNameToDrag -  The Name of the Question to drag.
	 * @param {string} questionNameToDrop -  The Name of the Question to drop.
	 * @param {Array} questionNames - All Question Names in a survey.
	 */

	async reArrangeQuestions(
		questionNameToDrag,
		questionNameToDrop,
		questionNames = [],
	) {
		const questionToDrag = questionNameToDrag;
		let questionToDrop = questionNameToDrop;
		while (questionToDrag === questionToDrop) {
			logger.info(
				`Both question to drag and drop are the same: ${questionToDrag}. Generating a new question to drop...`,
			);
			questionToDrop = generateRandomName(questionNames);
			logger.info(`Generated new question to drop: ${questionToDrop}`);
		}
		const questionToDragXpath =
			this.getSectionOrQuestionXpathToDragAndDrop(questionToDrag);
		const questionToDropXpath =
			this.getSectionOrQuestionXpathToDragAndDrop(questionToDrop);
		await PwActions.dragAndDrop(
			this.page,
			questionToDragXpath,
			questionToDropXpath,
		);
		await CommonUtils.sleep(2);
		await PwActions.pageRefresh(this.page);
		await PwActions.waitTillVisible(this.page, questionToDragXpath);
	}

	/**
	 * Function to verify rearrranged Questions.
	 *
	 * @param {Array} questionsOrderBeforeReArrange -  The order of the questions before rearranging the questions.
	 * @param {Array} questionsOrderAfterReArrange -  The order of the questions after rearranging the questions.
	 * @param {string} questionNameToDrag -  The Name of the Question to drag.
	 * @param {string} questionNameToDrop -  The Name of the Question to drop.
	 */

	async verifyreArrangedQuestions(
		questionsOrderBeforeReArrange,
		questionsOrderAfterReArrange,
		questionNameToDrag,
		questionNameToDrop,
	) {
		const indexOfQuestionNameToDrop =
			questionsOrderBeforeReArrange.indexOf(questionNameToDrop);
		expect(questionsOrderBeforeReArrange.length).toBe(
			questionsOrderAfterReArrange.length,
			"The questions count is not matched before and after rearrange",
		);
		expect(questionsOrderAfterReArrange[indexOfQuestionNameToDrop]).toBe(
			questionNameToDrag,
			"Questions are not rearranged",
		);
	}

	/**
	 * Function to rearrange MCQ options within a question
	 *
	 * @param {string} sectionName - The name of the section containing the question
	 * @param {string} questionName - The name of the question
	 * @param {string} optionToDrag - The text of the option to drag
	 * @param {string} optionToDrop - The text of the option to drop on
	 * @param {Array} optionTexts - All option texts (optional, for validation if same)
	 *
	 * @example
	 * // Rearranging the option order in an MCQ question
	 * await surveyBuildEditPage.reArrangeMCQOptions(
	 *   "Section A",
	 *   "Your favorite fruit?",
	 *   "Banana",      // option to drag
	 *   "Apple",       // option to drop on
	 *   ["Apple", "Banana", "Cherry", "Other"] // (optional) existing option texts
	 * );
	 */

	async reArrangeMCQOptions(
		sectionName,
		questionName,
		optionToDrag,
		optionToDrop,
		optionTexts = [],
	) {
		let dropOption = optionToDrop;
		while (optionToDrag === dropOption && optionTexts.length > 0) {
			dropOption = generateRandomName(optionTexts);
		}

		const optionToDragXpath = this.getMCQOptionDraggableXpath(
			questionName,
			optionToDrag,
		);
		const optionToDropXpath = this.getMCQOptionDraggableXpath(
			questionName,
			dropOption,
		);

		await PwActions.dragAndScrollUntilDropVisible(
			this.page,
			optionToDragXpath,
			optionToDropXpath,
		);
		await PwActions.pageRefresh(this.page);

		await PwActions.click(this.page, this.getSectionByName(sectionName));
		await CommonUtils.sleep(1);

		await PwActions.waitTillVisible(this.page, optionToDragXpath);
	}

	/**
	 * Function to get MCQ option texts from a question
	 *
	 * @param {string} sectionName - The name of the section containing the question
	 * @param {string} questionName - The name of the question
	 * @param {boolean} includeOther - Include "Other" option in results (default: false)
	 * @returns {Promise<Array>} Array of option texts
	 */

	async getMCQOptionsTexts(sectionName, questionName, includeOther = false) {
		const optionsXpath = this.getMCQOptionsXpath(sectionName, questionName);
		await PwActions.click(this.page, this.getSectionByName(sectionName));
		await PwActions.waitTillVisible(this.page, `${optionsXpath}[1]`, 10000);

		const optionElements = await this.page.locator(optionsXpath).all();
		const values = await Promise.all(
			optionElements.map((el) => el.getAttribute("value")),
		);
		return includeOther ? values : values.filter((v) => v !== "Other");
	}

	//Naviagets to Question Bank

	async navigateToQuestionBanks() {
		await PwActions.click(this.page, this.btnQuestionBank);
	}

	/**
	 * Function to add Questions from Question bank and adds in new Section .
	 * This function selects all the questions in a Question bank and adds in new section
	 *
	 * @param {string} questionBank -  The Name of the Question to drop.
	 */

	async addQuestionsInNewSectionFromQuestionBank(questionBank) {
		let questionsInQuestionBank = [];
		try {
			const accordion =
				await this.getAccordionXpathForQuestionBank(questionBank);
			await PwActions.click(this.page, accordion);
			await CommonUtils.sleep(2);
			questionsInQuestionBank =
				await this.getQuestionsNamesInQuestionBank(questionBank);
			const selectAll =
				await this.getSelectAllButtonXapthInQuestionBank(questionBank);
			await PwActions.click(this.page, selectAll);
			await PwActions.click(this.page, this.btnAddQuestionsFromQuestionbank);
			await PwActions.click(this.page, this.txtAsNewSection);
		} catch (error) {
			throw new Error(
				`Failed to add questions from question bank ${error.message}`,
			);
		}
		return questionsInQuestionBank;
	}

	/**
	 * Function to verify the questions added in new section from question bank.
	 * @param {array} questionNamesInQuestionBank - The names of the questions in question bank.
	 * @param {string} sectionName - The name of the section in which questions are added.
	 */

	async verifyaddedQuestionsInNewSectionFromQuestionBank(
		questionNamesInQuestionBank,
		sectionName,
	) {
		const questionsInNewSection =
			await this.getQuestionsNamesInSection(sectionName);
		await PwActions.pageRefresh(this.page);
		await this.openSection(sectionName);
		await this.commonutils.compareArrays(
			questionNamesInQuestionBank,
			questionsInNewSection,
		);
	}

	/**
	 * Function navigates to question banks and adds questions from question bank aftet clicking on the section in which questions needs to be added.
	 * This function selects all the questions in a Question bank and adds in current section
	 *
	 * @param {string} questionBank -  The Name of the Question to drop.
	 */

	async addQuestionsInCurrentSectionFromQuestionBank(questionBank) {
		let questionNamesInQuestionBank = [];
		try {
			const accordion =
				await this.getAccordionXpathForQuestionBank(questionBank);
			await PwActions.click(this.page, accordion);
			await CommonUtils.sleep(2);
			questionNamesInQuestionBank =
				await this.getQuestionsNamesInQuestionBank(questionBank);
			const selectAll =
				await this.getSelectAllButtonXapthInQuestionBank(questionBank);
			await PwActions.click(this.page, selectAll);
			await PwActions.click(this.page, this.btnAddQuestionsFromQuestionbank);
			await PwActions.click(this.page, this.txtToCurrentSection);
		} catch (error) {
			throw new Error(
				`Failed to add questions from question bank ${error.message}`,
			);
		}
		return questionNamesInQuestionBank;
	}

	/**
	 * Function to verify the questions added in current section from question bank.
	 * @param {array} questionNamesInQuestionBank - The names of the questions in question bank.
	 * @param {string} sectionName - The name of the section in which questions are added.
	 */

	async verifyaddedQuestionsInCurrentSectionFromQuestionBank(
		questionNamesInQuestionBank,
		sectionName,
	) {
		const questionsInCurrentSection =
			await this.getQuestionsNamesInSection(sectionName);
		await PwActions.pageRefresh(this.page);
		try {
			await this.openSection(sectionName);
			await CommonUtils.verifyArrayContainsAllElements(
				questionsInCurrentSection,
				questionNamesInQuestionBank,
			);
		} catch (error) {
			throw new Error(
				`questions added from question bank are not matched in current section ${error.message}`,
			);
		}
	}

	/** This function clicks or open the seaction passed
	 *
	 * @param {string} sectionName - name of the section
	 */

	async openSection(sectionName) {
		const section = this.getSectionOrQuestionXpath(sectionName);
		await PwActions.click(this.page, section);
	}

	/* Function to delete multiple sections from the list
	 * @param {array} sectionNames -List of names of the sections to delete
	 */

	async deleteSectionsFromList(sectionNames) {
		for (const section of sectionNames) {
			await this.deleteSection(section);
		}
	}

	/**
	 * Function to generate an XPath expression for locating a language element.
	 * @param {string} language - The name of the language to find in the DOM.
	 * @returns {string} XPath expression to locate the specified language element.
	 */
	getLanguageXpath(language) {
		const languageXpath = `//p[text()='${language}']/parent::div`;
		return languageXpath;
	}

	/**
	 * Function to select a language from the dropdown and verify the selection.
	 * @param {string} language - The language to be selected from the dropdown.
	 */

	async selectLanguageFromDropdown(language) {
		await PwActions.click(this.page, this.btnSelectLanguageFromBuild);
		await PwActions.click(this.page, this.getLanguageXpath(language));
		await CommonUtils.sleep(3);
		logger.info(`Switched to ${language} language in builder`);
	}

	/**
	 * Function to delete a selected language from the list.
	 *
	 * @param {string} language - The name of the language to delete.
	 */

	async deleteSelectedLanguage(language) {
		this.btnDeleteLanguage = `//p[text()='${language}']/ancestor::tr//td//button`;
		await PwActions.click(this.page, this.btnManageLanguageTranslation);
		await PwActions.click(this.page, this.btnDeleteLanguage);
		await PwActions.click(this.page, this.btnConfirmDeleteLanguage);
		await PwActions.waitTillVisible(
			this.page,
			this.txtDeleteTranslationsConfirmation,
			20000,
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.txtDeleteTranslationsConfirmation,
		);
		await PwActions.click(this.page, this.btnCloseLanguageModel);
	}

	/**
	 * Function to verify that a specific language has been deleted from the list.
	 * @param {string} language - The name of the language to verify its deletion.
	 */

	async verifyLanguageDeleted(language) {
		await PwActions.click(this.page, this.btnSelectLanguageFromBuild);
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.getLanguageXpath(language),
		);
	}
	/**
	 * Function to delete all the sections.
	 *
	 * @param {array} sectionElements -  The sections in the page.
	 */
	async deleteAllSections() {
		const sectionElements = await this.getSectionsElements();
		const sectionNames = await this.getSectionsNames(sectionElements);
		const totalSections = sectionNames.length;
		for (let i = 0; i < totalSections; i++) {
			const sectionName = sectionNames[i];
			await this.deleteSection(sectionName);
		}
	}

	/**
	 * Function to open preview page.
	 */

	async openSurveyPreview() {
		await PwActions.click(this.page, this.previewBtn);
		await CommonUtils.sleep(3);
		const previewIframe = await PwActions.switchToFrame(
			this.page,
			this.previewFrame,
		);
		await PwActions.waitForElement(previewIframe, this.btnstartSurvey, 16000);
	}

	/**
	 * Function to open preview page.
	 */

	async confirmNavigation() {
		if (await PwActions.elementIsVisible(this.page, this.txtUnlock)) {
			await PwActions.click(this.page, this.txtUnlock);
			await PwActions.fill(this.page, this.txtUnlock, "Proceed");
			await PwActions.click(this.page, this.btnToProceed);
		}
	}

	/**
	 * Waits for a specific question type to be added and visible in the survey builder
	 * @param {string} question - The type of question being added (e.g. "Rating Scale")
	 * @param {string} questionName - The name/identifier of the specific question
	 * @returns {Promise<void>} - Resolves when the question is visible
	 */

	async waitForQuestionToBeAdded(question, questionName) {
		if (question === "Rating Scale") {
			await PwActions.waitTillVisible(
				this.page,
				this.getRatingScaleQuestionContainerXpath(questionName),
			);
		}
	}

	/**
	 * Verifies that a survey has been successfully duplicated by checking its title
	 * @param {string} surveyName - The name of the original survey
	 * @returns {Promise<void>} - Resolves when verification is complete
	 */

	async verifySurveyDuplicated(surveyName) {
		await CommonUtils.sleep(0.5);
		await PwActions.waitTillVisible(this.page, this.txtSurveyTitle, 10000);
		const surveytitle = await PwActions.getAttributeValue(
			this.page,
			this.txtSurveyTitle,
			"value",
		);
		const expectedSurveyTitle = surveyName + " - Clone";
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.verifyTextExpected(surveytitle, expectedSurveyTitle);
	}

	async verifySurveySectionsAndQuestions(
		sectionName,
		questionDescription,
		question,
	) {
		const actualSectionName = await PwActions.getText(
			this.page,
			this.txtSectionTitle,
		);
		await PwActions.verifyTextExpected(actualSectionName, sectionName);
		const actualQuestionName = await PwActions.getText(
			this.page,
			this.txtQuestionTitleInSideBar,
		);
		await PwActions.verifyTextExpected(actualQuestionName, questionDescription);
	}

	/**
	 * Function to rename the survey
	 *
	 * @param {string} newSurveyName -  New name given to the survey
	 */

	async renameSurvey(newSurveyName) {
		await PwActions.waitAndClick(this.page, this.txtEditSurveyName);
		await PwActions.clearAndFill(
			this.page,
			this.txtEditSurveyName,
			newSurveyName,
		);
		await PwActions.press(this.page, "Enter");
		await CommonUtils.sleep(3);
	}

	/**
	 * Function to navigate on the Survey Builder
	 * @param {number} sectionNumber - The number of the section to navigate to
	 * @example
	 * Let's say you have a section and you want to navigate to that section, Then call this function with the section number as the parameter.
	 * await surveyBuilderPage.navigateToSection(1);
	 * This will navigate to the 1st section.
	 */

	async navigateToSection(sectionNumber) {
		await PwActions.click(this.page, this.getSectionElement(sectionNumber));
	}

	/**
	 * Function to navigate to the Survey Header
	 * @example
	 * Let's say you want to navigate to the survey header, Then call this function.
	 * await surveyBuilderPage.navigateToSurveyHeader();
	 */

	async navigateToSurveyHeader() {
		await PwActions.click(this.page, this.headerSection);
	}

	/**
	 * Private helper function to add variable on the Survey Builder. This is a common function that uses different xpaths based on the number parameter.
	 * If the number parameter is not passed, it will use a common xpath. If the number parameter is passed, it will use the xpath for that respective question.
	 * This function should not be called directly. Use the specific wrapper functions instead (addVariableOnSurveyHeader, addVariableOnSectionHeader, addVariableOnQuestion).
	 * @param {string} variableName - The name of the variable to add
	 * @param {number} number - The Question Number (optional)
	 * @example
	 * // Internal usage with common xpath (when number is not provided)
	 * await this.addVariable("Automation Variable");
	 * @example
	 * // Internal usage with specific question xpath (when number is provided)
	 * await this.addVariable("Automation Variable", 1);
	 * @private
	 */

	async addVariable(variableName, number = null) {
		await PwActions.waitForDOMContentLoaded(this.page, 10000);
		await CommonUtils.sleep(0.5);
		await PwActions.scrollToBottom(this.page);
		await PwActions.click(this.page, this.getBtnAddVariable(number));
		await PwActions.scroll(this.page, this.inputPlaceholder);
		await PwActions.fill(this.page, this.inputPlaceholder, variableName);
		await PwActions.waitForNetworkIdle(this.page, 10000);
		await PwActions.scroll(this.page, this.dropdownVariable(variableName));
		await PwActions.click(this.page, this.dropdownVariable(variableName));
	}

	/**
	 * Function to add variable on the Survey Header
	 * @param {string} variableName - The name of the variable to add
	 * @example
	 * Let's say you have a survey header and you want to add a variable, Then call this function with the variable name as the parameter.
	 * await surveyBuilderPage.addVariableOnSurveyHeader("Automation Variable");
	 * This will add the variable "Automation Variable" to the survey header.
	 */

	async addVariableOnSurveyHeader(variableName) {
		await this.navigateToSurveyHeader();
		await PwActions.hover(this.page, this.txtSurveyHeaders);
		await this.addVariable(variableName);
	}

	async editSurveyHeaderContent(content) {
		await this.navigateToSurveyHeader();
		await PwActions.clearAndFill(this.page, this.txtSurveyHeaders, content);
		await PwActions.click(this.page, this.headerSection);
	}

	/**
	 * Function to add variable on the Section Header
	 * @param {string} variableName - The name of the variable to add
	 * @example
	 * Let's say you have a section and you want to add a variable, Then call this function with the variable name and section number as the parameter.
	 * await surveyBuilderPage.addVariableOnSectionHeader("Automation Variable",1);
	 * This will add the variable "Automation Variable" to the 1st section.
	 */

	async addVariableOnSectionHeader(variableName, sectionNumber) {
		await this.navigateToSection(sectionNumber);
		await PwActions.hover(this.page, this.inputSectionsHeader(sectionNumber));
		await this.addVariable(variableName, sectionNumber);
	}

	/**
	 * Function to add variable on the Question Header
	 * @param {string} variableName - The name of the variable to add
	 * @example
	 * Let's say you have a question and you want to add a variable, Then call this function with the variable name and question number as the parameter.
	 * await surveyBuilderPage.addVariableOnQuestion("Automation Variable",1);
	 * This will add the variable "Automation Variable" to the 1st question.
	 */

	async addVariableOnQuestion(variableName, questionNumber) {
		await PwActions.hover(this.page, this.inputQuestionElement(questionNumber));
		await this.addVariable(variableName, questionNumber + 1);
	}

	/**
	 * Function to navigate to the Survey Builder after the survey is launched
	 * @example
	 * Let's say you want to navigate to the survey builder, Then call this function.
	 * await surveyBuilderPage.navigateToSurveyBuilder();
	 */

	async navigateToSurveyBuilder() {
		await PwActions.pageRefresh(this.page);
		await PwActions.click(this.page, this.btnCreate);
		await CommonUtils.sleep(2);
		if (await PwActions.elementIsVisible(this.page, this.txtUnlock)) {
			await PwActions.fill(this.page, this.txtUnlock, "Proceed");
			await PwActions.click(this.page, this.btnToProceed);
		}
	}

	// /**
	//  * Navigates to the "Create" section of the survey builder and handles the confirmation dialog.
	//  * @example
	//  * await surveyBuilderPage.bypassToCreate();
	//  */

	// async bypassToCreate() {
	// 	await PwActions.click(this.page, this.btnCreate);
	// 	await PwActions.fill(this.page, this.inputDialogProceed, "Proceed");
	// 	await PwActions.click(this.page, this.btnToProceed);
	// }

	/**
	 * Function to delete a variable from the survey builder
	 * @param {string} element - The element of the variable
	 * @example
	 * Let's say you have a variable and you want to delete the variable, Then call this function with the element as the parameter.
	 * await surveyBuilderPage.deleteVariable(this.txtSurveyHeaders);
	 * This will delete the variable from the survey header.
	 */

	async deleteVariable(element) {
		const text = await PwActions.getText(this.page, element);
		const cleanedText = text
			.replace(/\$[A-Za-z0-9_]+(\s+[A-Za-z0-9_]+)?/g, "")
			.replace(/\s{2,}/g, " ")
			.trim();
		await PwActions.clearAndFill(this.page, element, cleanedText);
	}

	/**
	 * Function to delete a variable from the survey header
	 * @example
	 * Let's say you have a survey header and you want to delete the variable, Then call this function.
	 * await surveyBuilderPage.deleteVariableOnSurveyHeader();
	 * This will delete the variable from the survey header.
	 */

	async deleteVariableOnSurveyHeader() {
		await this.navigateToSurveyHeader();
		await this.deleteVariable(this.txtSurveyHeaders);
	}

	/**
	 * Function to delete a variable from the section header
	 * @param {number} sectionNumber - The number of the section
	 * @example
	 * Let's say you have a section and you want to delete the variable, Then call this function with the section number as the parameter.
	 * await surveyBuilderPage.deleteVariableOnSectionHeader(1);
	 * This will delete the variable from the 1st section.
	 */

	async deleteVariableOnSectionHeader(sectionNumber) {
		await this.navigateToSection(sectionNumber);
		await this.deleteVariable(this.inputSectionsHeader(sectionNumber));
	}

	/**
	 * Function to delete a variable from the question
	 * @param {number} questionNumber - The number of the question
	 * @example
	 * Let's say you have a question and you want to delete the variable, Then call this function with the question number as the parameter.
	 * await surveyBuilderPage.deleteVariableOnQuestionHeader(1);
	 * This will delete the variable from the 1st question.
	 */

	async deleteVariableOnQuestionHeader(questionNumber) {
		await this.deleteVariable(this.inputQuestionElement(questionNumber));
	}

	/**
	 * Function to mark a question as mandatory and non-mandatory
	 * @param {number} questionNumber - The number of the question
	 * @example
	 * Let's say you have a question and you want to mark it as mandatory, Then call this function with the section number and question number as the parameter.
	 * await surveyBuilderPage.markQuestionAsMandatoryOrNonMandatory(1,1);
	 * This will mark the 1st question in the 1st section as mandatory.
	 */

	async markQuestionAsMandatoryOrNonMandatory(sectionNumber, questionNumber) {
		if (sectionNumber) {
			await this.navigateToSection(sectionNumber);
		}
		await PwActions.hover(this.page, this.inputQuestionElement(questionNumber));
		const mandatoryButton = `(//button[@aria-label="Make question mandatory"])[${questionNumber}]`;
		await PwActions.click(this.page, mandatoryButton);
		await CommonUtils.sleep(2);
	}

	/**
	 * Function to add image on the survey builder
	 * @param {string} path - The path of the image to add
	 * @example
	 * Let's say you want to add an image on the survey intro, Then call this function with the path as the parameter.
	 * await surveyBuilderPage.addImageOnBuilder("path/to/image.jpg");
	 */

	async addImageOnBuilder(path) {
		await this.navigateToSurveyHeader();
		await PwActions.hover(this.page, this.surveyIntroImage);
		await PwActions.click(this.page, this.btnChangeImage);
		await PwActions.uploadFile(this.page, this.inputImage, path);
		await this.verifyAddedImageOnSurvey(path, true);
	}

	/**
	 * Function to add image on the section header
	 * @param {string} path - The path of the image to add
	 * @param {number} sectionNumber - The number of the section
	 * @example
	 * Let's say you want to add an image on the section header, Then call this function with the path and section number as the parameter.
	 * await surveyBuilderPage.addImageOnSectionHeader("path/to/image.jpg",1);
	 */

	async addImageOnSectionHeader(path, sectionNumber) {
		await this.navigateToSection(sectionNumber);
		await PwActions.hover(this.page, this.inputSectionsHeader(sectionNumber));
		await PwActions.click(this.page, this.btnAddImageSectionHeader);
		await PwActions.uploadFile(this.page, this.inputImage, path);
		await this.verifyAddedImageOnSurvey(path, false);
	}

	/**
	 * Function to add a random tooltip for the rating scale
	 * @param {number} start - The start value of the slider
	 * @param {number} end - The end value of the slider
	 * @returns {object} - The data of the rating scale
	 * @example
	 * Let's say you want to add a random tooltip for the rating scale, Then call this function with the start and end as the parameter.
	 * await surveyBuilderPage.addRandomTooltipForRatingScale(3,10);
	 */

	async addRandomTooltipForRatingScale(start, end) {
		const scales = {
			data: [],
		};
		let btnUpdateOrSaveRatingScale;
		for (let i = start; i <= end; i++) {
			const randomTooltip = CommonUtils.generateRandomText(5);
			const scaleLabelInput = `//input[@name="scaleLabels.${i - 1}.label"]`;
			await PwActions.scroll(this.page, scaleLabelInput);
			await PwActions.fill(this.page, scaleLabelInput, randomTooltip);
			scales.data.push({ key: start, value: randomTooltip });
		}
		try {
			await PwActions.verifyElementIsPresent(
				this.page,
				this.btnUpdateRatingScale,
			);
			btnUpdateOrSaveRatingScale = this.btnUpdateRatingScale;
		} catch {
			btnUpdateOrSaveRatingScale = this.btnSaveRatingScale;
		}
		await PwActions.click(this.page, btnUpdateOrSaveRatingScale);
		await PwActions.waitForElement(this.page, this.btnOverrideChanges, 5000);
		if (await PwActions.elementIsVisible(this.page, this.btnOverrideChanges)) {
			await PwActions.click(this.page, this.btnOverrideChanges);
		}
		return scales;
	}

	/**
	 * Function to navigate to the add question section
	 * @example
	 * Let's say you want to navigate to the add question section, Then call this function.
	 * await surveyBuilderPage.navigateToAddQuestionSection();
	 */

	async navigateToAddQuestionSection() {
		await PwActions.click(
			this.page,
			`(//a[@href="/configure/perform/${EntityIds.getsurveyId()}/builder/edit"])[2] | //a[@href="/configure/surveys/${EntityIds.getsurveyId()}/builder/settings" and @class='active']`,
		);
	}

	/**
	 * Function to navigate to the survey settings
	 * @example
	 * Let's say you want to navigate to the survey settings, Then call this function.
	 * await surveyBuilderPage.navigateToSurveySettings();
	 */

	async navigateToSurveySettings() {
		await PwActions.click(
			this.page,
			(this.btnBuilderSettings = `//a[@href="/configure/perform/${EntityIds.getsurveyId()}/builder/settings"] | //a[@href="/configure/surveys/${EntityIds.getsurveyId()}/builder/settings"]`),
		);
	}

	/**
	 * Function to verify the rating scale
	 * @param {number} limit - The limit of the rating scale
	 * @example
	 * Let's say you have added a rating scale and you want to verify the rating scale, Then call this function with the limit as the parameter.
	 * await surveyBuilderPage.verifyRatingScale(5);
	 */

	async verifyRatingScale(limit) {
		const elements = await PwActions.getWebElements(
			this.page,
			this.scaleLabels(1),
		);
		expect(elements.length).toBe(limit);
	}

	/**
	 * Function to create or edit the rating scale
	 * @param {boolean} isEdit - Whether to edit the rating scale
	 * @param {string} currentScaleValue - The current scale value of the rating scale
	 * @returns {object} - The data of the rating scale
	 * @example
	 * Let's say you want to create a rating scale, Then call this function with the current scale value as the parameter.
	 * await surveyBuilderPage.createOrEditRatingScale(currentScaleValue,false);
	 * @example
	 * Let's say you want to edit the rating scale, Then call this function with the current scale value as the parameter.
	 * await surveyBuilderPage.createOrEditRatingScale(currentScaleValue,true);
	 */

	async createOrEditRatingScale(currentScaleValue, isEdit) {
		if (!isEdit) {
			await PwActions.click(this.page, this.btnMoreOption);
			await PwActions.click(this.page, this.btnAddScale);
		} else {
			await PwActions.click(this.page, this.btnEditRatingScale);
		}
		const scaleName = `Automation Rating Scale${this.commonutils.getCurrentTime()}`;
		await PwActions.fill(this.page, this.inputRatingScaleTitle, scaleName);
		const randomValue = CommonUtils.getRandomIntInclusive(3, 10);
		if (isEdit) {
			await PwActions.setSliderValue(
				this.page,
				this.ratingSlider,
				3,
				10,
				randomValue,
				currentScaleValue,
			);
		} else {
			await PwActions.setSliderValue(
				this.page,
				this.ratingSlider,
				3,
				10,
				randomValue,
				currentScaleValue,
			);
		}
		const scalesData = await this.addRandomTooltipForRatingScale(
			1,
			randomValue,
		);
		scalesData.scaleName = scaleName;
		return scalesData;
	}

	/**
	 * Function to verify the added image on the survey
	 * @param {object} imageData - The data of the image
	 * @param {boolean} isSurveyIntro - if true then verify the image on the survey intro else verify the image on the section intro
	 * @example
	 * Let's say you have added an image on the survey intro, Then call this function with the image data as the parameter.
	 * await surveyBuilderPage.verifyAddedImageOnSurvey(imageData,true);
	 */

	async verifyAddedImageOnSurvey(imageData, isSurveyIntro) {
		if (isSurveyIntro) {
			await this.navigateToSurveyHeader();
			await CommonUtils.sleep(3);
			await PwActions.verifyElementIsPresent(this.page, this.imgSurveyIntro);
			const backgroundImageUrl = await PwActions.getBackgroundImageUrl(
				this.page,
				this.imgSurveyIntro,
			);
			const filePath = await PwActions.downloadBase64ImageToPath(
				this.page,
				backgroundImageUrl,
				"downloaded_image.jpeg",
			);
			await CommonUtils.compareImages(imageData, filePath, 0);
			await this.commonutils.deleteFile(filePath);
		} else {
			await CommonUtils.sleep(3);
			await PwActions.verifyElementIsPresent(this.page, this.imgSectionInto);
			const backgroundImageUrl = await PwActions.getBackgroundImageUrl(
				this.page,
				this.imgSectionInto,
			);
			const filePath = await PwActions.downloadBase64ImageToPath(
				this.page,
				backgroundImageUrl,
				"downloaded_image.jpeg",
			);
			await CommonUtils.compareImages(imageData, filePath, 0);
			await this.commonutils.deleteFile(filePath);
		}
	}

	/**
	 * Function to verify survey preview by attending questions.
	 * @param {Object} options - Options object with named parameters
	 * @param {Array} options.settings - Array of settings to attend the survey (default: [])
	 *   - "Attend with default answer high values"
	 *   - "Attend with default answer low values"
	 *   - "Attend with default answer mixed values"
	 *   - "Attend with high values with NA=0"
	 *   - "Attend with low values with NA=0"
	 * @param {string} options.participantName - Name of the participant (default: "Subject")
	 * @param {string} options.subject - Subject name (default: constants.subjectName)
	 * @example
	 * // No arguments - uses all defaults
	 * await surveyBuilderPage.attendPreviewSurvey();
	 *
	 * // With settings array
	 * await surveyBuilderPage.attendPreviewSurvey({
	 *     settings: ["Attend with default answer high values"]
	 * });
	 *
	 * // Full customization
	 * await surveyBuilderPage.attendPreviewSurvey({
	 *     settings: ["Attend with default answer high values"],
	 *     participantName: "John Doe",
	 *     subject: "Custom Subject"
	 * });
	 */

	async attendPreviewSurvey({
		settings = [],
		participantName = "Subject",
		subject = constants.subjectName,
	} = {}) {
		const previewIframe = await PwActions.switchToFrame(
			this.page,
			this.previewFrame,
		);
		await this.eui.attendSurvey({
			page: previewIframe,
			participantName,
			subject,
			settings,
		});
		await PwActions.pageRefresh(this.page);
	}

	/**
	 * Function to verify the re arranged question order between sections
	 * @param {string} listOfQuestionsInDraggedSectionBeforeReArrange - The section where the question is dragged - Before re arranging
	 * @param {string} listOfQuestionsInDroppedSectionBeforeReArrange - The section where the question is dropped - Before re arranging
	 * @param {string} listOfQuestionsInDraggedSectionAfterReArrange - The section where the question is dragged - After re arranging
	 * @param {string} listOfQuestionsInDroppedSectionAfterReArrange - The section where the question is dropped - After re arranging
	 * @param {string} questionDrag - The question that is dragged - Before re arranging
	 * @param {string} questionDrop - The question that is dropped - Before re arranging
	 * @example
	 * Let's say you have two sections with 3 questions in each section and you want to drag a question from one section to another section and drop it, and now we want to verify the question order. Then call this function with the questions as the parameter.
	 * await surveyBuilderPage.verifyReArrangedQuestionOrderBetweenSections(listOfQuestionsInDraggedSectionBeforeReArrange, listOfQuestionsInDroppedSectionBeforeReArrange, listOfQuestionsInDraggedSectionAfterReArrange, listOfQuestionsInDroppedSectionAfterReArrange, questionDrag, questionDrop);
	 */

	async verifyReArrangedQuestionOrderBetweenSections(
		listOfQuestionsInDraggedSectionBeforeReArrange,
		listOfQuestionsInDroppedSectionBeforeReArrange,
		listOfQuestionsInDraggedSectionAfterReArrange,
		listOfQuestionsInDroppedSectionAfterReArrange,
		questionDrag,
		questionDrop,
	) {
		expect(listOfQuestionsInDraggedSectionBeforeReArrange).toContain(
			questionDrag,
		);
		expect(listOfQuestionsInDroppedSectionBeforeReArrange).toContain(
			questionDrop,
		);
		expect(listOfQuestionsInDraggedSectionAfterReArrange).not.toContain(
			questionDrag,
		);
		expect(listOfQuestionsInDroppedSectionAfterReArrange).toContain(
			questionDrop,
		);
		const totalQuestionsBefore =
			listOfQuestionsInDraggedSectionBeforeReArrange.length +
			listOfQuestionsInDroppedSectionBeforeReArrange.length;
		const totalQuestionsAfter =
			listOfQuestionsInDraggedSectionAfterReArrange.length +
			listOfQuestionsInDroppedSectionAfterReArrange.length;
		expect(totalQuestionsAfter).toBe(totalQuestionsBefore);
		expect(listOfQuestionsInDraggedSectionAfterReArrange.length).toBe(
			listOfQuestionsInDraggedSectionBeforeReArrange.length - 1,
		);
		expect(listOfQuestionsInDroppedSectionAfterReArrange.length).toBe(
			listOfQuestionsInDroppedSectionBeforeReArrange.length + 1,
		);
		const indexOfQuestionDrop =
			listOfQuestionsInDroppedSectionBeforeReArrange.indexOf(questionDrop);
		expect(
			listOfQuestionsInDroppedSectionAfterReArrange[indexOfQuestionDrop],
		).toBe(questionDrag);
	}

	/**
	 * Function to search and add language
	 * @param {string} language - The language to search and add
	 * @example
	 * Let's say you want to add a new language to the Survey Builder, Then call this function with the language as the parameter.
	 * await surveyBuilderPage.searchAndAddLanguage("Tamil");
	 */

	async searchAndAddLanguage(language) {
		await PwActions.click(this.page, this.btnSelectLanguage);
		await PwActions.click(this.page, this.btnAddLanguage);
		await PwActions.click(this.page, this.inputSearchLanguage);
		await PwActions.fill(this.page, this.inputSearchLanguage, language);
		await PwActions.waitTillVisible(
			this.page,
			`//div[@class="twigs-select__menu-list css-qr46ko"]//div[text()='${language}']`,
		);
		await PwActions.click(
			this.page,
			`//div[@class="twigs-select__menu-list css-qr46ko"]//div[text()='${language}']`,
		);
		await CommonUtils.sleep(2);
		await PwActions.waitForNetworkIdle(this.page, 15000);
		await PwActions.click(this.page, this.btnAddTranslations);
		await PwActions.waitForElement(
			this.page,
			this.txtTranslatingStatus,
			500000,
		);
		await PwActions.waitTillElementDisappear(
			this.page,
			this.txtTranslatingStatus,
			200000,
		);
		await CommonUtils.sleep(1);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.txtAddTranslationsConfirmation,
		);
		await PwActions.click(this.page, this.btnCloseLanguageModel);
	}

	/**
	 * Function to change the source language
	 * @param {string} langauge - The language to change
	 * @example
	 * Let's say you want to change the source language of the Survey Builder to Tamil, Then call this function with Tamil as the parameter.
	 * await surveyBuilderPage.changeSourceLanguage("Tamil");
	 */

	async changeSourceLanguage(langauge) {
		await PwActions.click(this.page, this.btnSelectLanguage);
		await PwActions.click(this.page, this.btnAddLanguage);
		await PwActions.click(this.page, this.btnSourceLanguage);
		await PwActions.fill(this.page, this.inputSearchSourceLanguage, langauge);
		await PwActions.waitForElementVisibility(
			this.page,
			`//div[@role="menuitem" and text()='${langauge}']`,
			10000,
		);
		await PwActions.click(
			this.page,
			`//div[@role="menuitem" and text()='${langauge}']`,
		);
		await PwActions.click(this.page, this.btnYesChange);
		await PwActions.click(this.page, this.btnCloseLanguageModel);
	}

	/**
	 * Function to change to the source language
	 * @param {string} langauge - The language to change
	 * @example
	 * Let's say you have added a new language or else you're in a different language, Now if you want to change to the source language, call this function.
	 * await surveyBuilderPage.changeToSourceLanguage();
	 */

	async changeToSourceLanguage() {
		await PwActions.click(this.page, this.btnSelectLanguage);
		await PwActions.click(this.page, this.btnDropdownSourceLanguage);
	}

	/**
	 * Function to verify the content language
	 * @param {string} langauge - The language to verify
	 * @example
	 * You have changed the langugage to Tamil, Then to verify the content language, pass the langauge as Tamil like :
	 * await surveyBuilderPage.verifyContentLanguage("Tamil");
	 */

	async verifyContentLanguage(langauge) {
		await CommonUtils.sleep(3);
		let lan;
		await this.navigateToSurveyHeader();
		const surveyHeaderText = await PwActions.getText(
			this.page,
			this.txtSurveyHeaders,
		);
		lan = await this.commonutils.getTextLanguage(surveyHeaderText);
		expect(lan).toBe(langauge);
		const sectionNames = await this.getSectionsNames();
		for (const sectionName of sectionNames) {
			lan = await this.commonutils.getTextLanguage(sectionName);
			expect(lan).toBe(langauge);
			const questionNames = await this.getQuestionsNamesInSection(sectionName);
			for (const questionName of questionNames) {
				lan = await this.commonutils.getTextLanguage(questionName);
				expect(lan).toBe(langauge);
				try {
					const mcqOptions = await this.getMCQOptionsTexts(
						sectionName,
						questionName,
						true,
					);
					for (const optionText of mcqOptions) {
						if (
							optionText &&
							optionText.trim() !== "" &&
							optionText !== "Other"
						) {
							lan = await this.commonutils.getTextLanguage(optionText);
							expect(lan).toBe(langauge);
						}
					}
				} catch (error) {}
			}
		}
		logger.info("Content in Builder is verified in " + langauge + " language");
	}

	/**
	 * Function to change the configuration of the question
	 * @param {string} questionType - Whether the question is a rating scale or a text input or eNPS or MultiChoice
	 * @param {Object} settings - Configuration settings object containing scale, type, placeholder, and flag
	 * @param {string} [settings.type] - Question subtype (e.g., "Single Selection", "Multiple Selection" for MCQ)
	 * @param {boolean} [settings.flag] - Multi-purpose boolean flag:
	 *   - Rating Scale: Start from zero
	 *   - Text Input: Mark as mandatory
	 *   - MultiChoice: Include "Other" option
	 *   - eNPS: Not applicable
	 * @param {number} [settings.scale] - Rating scale value (for Rating Scale questions)
	 * @param {string} [settings.placeholder] - Placeholder text (for Text Input questions)
	 * @param {number} [settings.minSelection] - Minimum selectable options (for MultiChoice with Multiple Selection)
	 * @param {number} [settings.maxSelection] - Maximum selectable options (for MultiChoice with Multiple Selection)
	 * @param {string} [settings.otherPlaceholder] - Placeholder text for "Other" option (for MultiChoice when Others is enabled)
	 * @param {number} questionNumber - The question number
	 * @param {number} sectionNumber - The section number
	 * @param {Page} page - Optional Playwright page object (defaults to this.page)
	 * @example
	 * // Rating Scale configuration
	 * await surveyBuilderPage.changeConfiguration("Rating Scale", { scale: 7, type: "Frequency", flag: true }, 1, 1);
	 * @example
	 * // MultiChoice Single Selection with Other option
	 * await surveyBuilderPage.changeConfiguration("MultiChoice", { type: "Single Selection", flag: true, otherPlaceholder: "Please specify" }, 1, 1);
	 * @example
	 * // MultiChoice Multiple Selection with min/max limits and Other option
	 * await surveyBuilderPage.changeConfiguration("MultiChoice", { type: "Multiple Selection", minSelection: 2, maxSelection: 4, flag: true, otherPlaceholder: "Enter other option" }, 1, 1);
	 */

	async changeConfiguration(
		questionType,
		settings,
		questionNumber,
		sectionNumber,
		page = this.page,
	) {
		await this.navigateToSection(sectionNumber);
		await CommonUtils.sleep(2);
		const data = {
			questionType: questionType,
			questionNumber: questionNumber,
			sectionNumber: sectionNumber,
			scaleLabels: [],
		};
		await PwActions.hover(page, this.inputQuestionElement(questionNumber));
		await PwActions.click(page, this.btnMenuForQuestion(questionNumber));
		await PwActions.click(page, this.btnConfigure);
		await PwActions.waitForElement(page, this.txtUnlock);
		if (await PwActions.elementIsVisible(page, this.txtUnlock, 3)) {
			await PwActions.fill(page, this.txtUnlock, "Proceed");
			await PwActions.click(page, this.btnToProceed);
			await CommonUtils.sleep(2);
		}
		const selectOption = async (dropdownTrigger, value) => {
			await PwActions.click(page, dropdownTrigger);
			await CommonUtils.sleep(1);
			await PwActions.click(
				page,
				`//div[contains(@class ,'twigs-select__menu')]//p[contains(text(), '${value}')]`,
			);
		};
		switch (questionType) {
			case "Rating Scale":
				if (settings.scale) {
					await selectOption(this.dropDownScaleOnConfigure, settings.scale);
					data.scale = settings.scale;
				}

				if (settings.flag) {
					await PwActions.click(page, this.checkboxStartFromZero);
					data.startFromZero = true;
					if (
						await PwActions.elementIsVisible(page, this.inputStartFromZero, 3)
					) {
						await PwActions.fill(page, this.inputStartFromZero, "0");
					}
				}
				if (settings.includeNA) {
					if (
						!(await PwActions.isElementChecked(page, this.checkboxIncludeNA))
					) {
						await PwActions.click(page, this.checkboxIncludeNA);
					}
					data.includeNA = true;
				}

				if (settings.type) {
					await selectOption(this.dropDownTypeOnConfigure, settings.type);
					data.type = settings.type;
				}
				if (settings.setScale) {
					await PwActions.setSliderValue(
						page,
						this.ratingSlider,
						3,
						10,
						settings.setScale,
						5,
					);
					const ratingScaleData = questionVerificationData.ratingScaleData;
					const scaleValue = settings.setScale || settings.scale;
					const scaleKey = `scale${scaleValue}`;
					const fallbackLength = settings.flag ? scaleValue + 1 : scaleValue;
					const scaleLabels = ratingScaleData[scaleKey]
						? ratingScaleData[scaleKey]
						: ratingScaleData.overall.slice(0, fallbackLength);

					if (Array.isArray(scaleLabels) && scaleLabels.length > 0) {
						for (let i = 0; i < scaleLabels.length; i++) {
							await PwActions.fill(
								page,
								`//input[@name="scaleLabels.${i}.label"]`,
								scaleLabels[i],
							);
							await CommonUtils.sleep(1);
							data.scaleLabels.push({
								number: i + (settings.flag ? 0 : 1),
								label: scaleLabels[i],
							});
						}
					}
				}
				break;

			case "Text Input":
				if (settings.flag) {
					if (
						!(await PwActions.isElementChecked(
							page,
							this.checkboxMarkAsMandatory,
						))
					) {
						await PwActions.click(page, this.checkboxMarkAsMandatory);
					}
					data.markAsMandatory = true;
				}

				if (settings.type) {
					await selectOption(this.dropDownTypeOnConfigure, settings.type);
					data.type = settings.type;
				}

				if (settings.placeholder) {
					await PwActions.fill(
						page,
						this.inputPlaceholderOnConfigure,
						settings.placeholder,
					);
					data.placeholder = settings.placeholder;
				}
				break;

			case "MultiChoice":
				await this.configureMCQ(settings, data, selectOption);
				break;

			case "eNPS": {
				const enpsLabels = questionVerificationData.ratingScaleData.enps;
				for (let i = 1; i < 11; i++) {
					const selector = `//input[@name="scaleLabels.${i}.label"]`;
					await PwActions.fill(page, selector, enpsLabels[i - 1]);
					await CommonUtils.sleep(1);
					data.scaleLabels.push({ number: i, label: enpsLabels[i - 1] });
				}
				break;
			}
			case "Goal":
				await CommonUtils.sleep(2);
				if (await PwActions.elementIsVisible(this.page, this.txtUnlock)) {
					await PwActions.fill(this.page, this.txtUnlock, "Proceed");
					await PwActions.click(this.page, this.btnToProceed);
				}
				if (settings.questionMethod == "Rating Scale") {
					data.questionMethod = "Rating Scale";
					if (settings.type) {
						await PwActions.click(
							this.page,
							this.btnRatingScaleConfigForGoalQuestion,
						);
						await selectOption(this.dropDownTypeOnConfigure, settings.type);
						data.type = settings.type;
						await PwActions.click(this.page, this.btnUpdateRatingScale);
					}
					if (settings.includeNA) {
						await PwActions.click(
							this.page,
							this.btnRatingScaleConfigForGoalQuestion,
						);
						await PwActions.click(
							this.page,
							this.chkBoxIncludeNAInGoalQuestion,
						);
						data.includeNA = true;
						await PwActions.click(this.page, this.btnUpdateRatingScale);
					}
					if (settings.makeReasonMandatory) {
						await PwActions.click(
							this.page,
							this.toggleMakeReasonMandatoryForGoalQuestion,
						);
						data.makeReasonMandatory = true;
					}
					if (settings.placeholder) {
						await PwActions.fill(
							this.page,
							this.txtBoxPlacholderForGoalQuestion,
							settings.placeholder,
						);
						data.placeholder = settings.placeholder;
					}
					if (settings.scaleLabels) {
						await PwActions.click(
							this.page,
							this.btnRatingScaleConfigForGoalQuestion,
						);
						await CommonUtils.sleep(2);

						for (let index = 0; index < settings.scaleLabels.length; index++) {
							await PwActions.fill(
								this.page,
								this.inputScaleLabelForIndex(index),
								settings.scaleLabels[index],
							);
						}

						data.scaleLabels = settings.scaleLabels;
						await PwActions.click(this.page, this.btnUpdateRatingScale);
					}
					if (settings.startFromZero) {
						await PwActions.click(
							this.page,
							this.btnRatingScaleConfigForGoalQuestion,
						);
						await PwActions.click(this.page, this.checkboxStartFromZero);
						data.startFromZero = true;
						await PwActions.fill(this.page, this.inputStartFromZero, "0");
						await PwActions.click(this.page, this.btnUpdateRatingScale);
						await CommonUtils.sleep(2);
					}
				} else {
					data.questionMethod = "Text";

					if (settings.type) {
						await PwActions.click(
							this.page,
							this.btnRatingScaleConfigForGoalQuestion,
						);
						await selectOption(this.dropDownTypeOnConfigure, settings.type);
						data.type = settings.type;
						await PwActions.click(
							this.page,
							this.btnSaveConfigurationTexBasedForGoalQuestion,
						);
					}
					if (settings.placeholder) {
						await PwActions.click(
							this.page,
							this.btnRatingScaleConfigForGoalQuestion,
						);
						await PwActions.fill(
							this.page,
							this.txtBoxPlaceholderForTextGoalQuestion,
							settings.placeholder,
						);
						data.placeholder = settings.placeholder;
						await PwActions.click(
							this.page,
							this.btnSaveConfigurationTexBasedForGoalQuestion,
						);
					}
				}
				break;
			default:
				throw new Error(`Invalid question type: ${questionType}`);
		}
		if (questionType == "Goal") {
			await PwActions.click(this.page, this.btnSave);
		} else {
			await PwActions.click(this.page, this.btnUpdateRatingScale);
		}
		if (
			await PwActions.elementIsVisible(this.page, this.lblWarningForScaleChange)
		) {
			await PwActions.fill(this.page, this.txtUnlock, "Proceed");
			await PwActions.click(this.page, this.btnToProceed);
		}
		await CommonUtils.sleep(3);
		await PwActions.pageRefresh(page);
		return data;
	}

	/**
	 * Helper function to configure MultiChoice (MCQ) question settings
	 * @param {Object} settings - MCQ configuration settings
	 * @param {string} [settings.type] - Selection type: "Single Selection" or "Multiple Selection"
	 * @param {boolean} [settings.flag] - Enable "Include Other" option
	 * @param {string} [settings.otherPlaceholder] - Placeholder text for Other option input
	 * @param {number} [settings.minSelection] - Minimum selections required (Multiple Selection only)
	 * @param {number} [settings.maxSelection] - Maximum selections allowed (Multiple Selection only)
	 * @param {Object} data - Data object to store configuration details
	 * @param {Function} selectOption - Helper function to select dropdown options
	 */

	async configureMCQ(settings, data, selectOption) {
		// Set selection type - only need to select if Multiple Selection
		// (Single Selection is the default when MCQ question is added)
		if (settings.type === "Multiple Selection") {
			await CommonUtils.sleep(1);
			await selectOption(this.dropDownTypeOnConfigure, settings.type);
			await CommonUtils.sleep(2);
			data.type = settings.type;

			if (settings.minSelection !== undefined) {
				// Configure minimum selection (only for Multiple Selection)
				await PwActions.setToggleState(
					this.page,
					this.toggleMinSelectionButton,
					"on",
				);
				await CommonUtils.sleep(1);

				await PwActions.click(this.page, this.inputMinSelectionBox);
				await CommonUtils.sleep(1);
				await PwActions.click(
					this.page,
					this.dropdownMinSelection(settings.minSelection),
				);
				data.minSelection = settings.minSelection;
			}

			if (settings.maxSelection !== undefined) {
				await PwActions.setToggleState(
					this.page,
					this.toggleMaxSelectionButton,
					"on",
				);
				await CommonUtils.sleep(1);

				if (
					settings.minSelection !== undefined &&
					settings.maxSelection !== undefined &&
					settings.minSelection > settings.maxSelection
				) {
				} else if (settings.minSelection !== undefined) {
					const errorVisible = await PwActions.waitForElementVisibility(
						this.page,
						this.errorMaxLessThanMin,
						5000,
					).catch(() => false);

					if (errorVisible) {
						await PwActions.waitForElementVisibility(
							this.page,
							this.errorMaxLessThanMin,
							5000,
						);
					}
				}

				await PwActions.click(this.page, this.inputMaxSelectionBox);
				await CommonUtils.sleep(1);

				await PwActions.click(
					this.page,
					this.dropdownMaxSelection(settings.maxSelection),
				);
				data.maxSelection = settings.maxSelection;

				if (
					settings.minSelection &&
					settings.maxSelection >= settings.minSelection
				) {
					await CommonUtils.sleep(1);
					await expect(
						this.page.locator(this.errorMaxLessThanMin),
					).not.toBeVisible();
				}
			}
		} else {
			await selectOption(this.dropDownTypeOnConfigure, settings.type);
			data.type = settings.type || "Single Selection";
		}

		// Enable Include Other option (works for both Single and Multiple Selection)
		if (settings.flag) {
			await CommonUtils.sleep(2);
			await PwActions.setToggleState(
				this.page,
				this.checkboxIncludeOther,
				"on",
			);
			data.includeOther = true;

			if (settings.otherPlaceholder) {
				await CommonUtils.sleep(2);
				await PwActions.fill(
					this.page,
					this.inputOtherPlaceholder,
					settings.otherPlaceholder,
				);
				data.otherPlaceholder = settings.otherPlaceholder;
			}
		}
	}

	/**
	 * Function to add display logic in sections in	the survey
	 */
	async addDisplayLogicInSections(sectionNames) {
		const sectionName = this.getQuestionName(sectionNames[1]);
		this.lblSectionName = `//p[text()='${sectionNames[1]}']`;
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.waitAndClick(this.page, this.lblSectionName);
		await PwActions.hover(this.page, sectionName);
		await PwActions.click(this.page, this.btnAddDisplayLogic);
		await PwActions.waitAndClick(this.page, this.txtAddCondition);
		await PwActions.click(this.page, this.btnAddQustions);
		await PwActions.click(this.page, this.txtAddQustion);
		await PwActions.click(this.page, this.btnLessThan);
		await PwActions.click(
			this.page,
			this.setLogicValue(
				Number.parseInt(data_to_attend_survey_low_values["Rating Scale"], 10) +
					1,
			),
		);
		await PwActions.click(this.page, this.btnApplyLogic);
	}

	/**
	 * Function to add display logic in questions in the survey
	 */
	async addDisplayLogicInQuestions(QuestionName) {
		const questionName = this.getQuestionName(QuestionName);
		await PwActions.hover(this.page, questionName);
		await PwActions.click(this.page, this.btnAddDisplayLogicSection);
		await PwActions.click(this.page, this.AddCustomLogic);
		await PwActions.waitAndClick(this.page, this.txtAddCondition);
		await PwActions.click(this.page, this.btnAddQustions);
		await PwActions.click(this.page, this.txtAddQustion);
		await PwActions.click(this.page, this.btnLessThan);
		await PwActions.click(
			this.page,
			this.setLogicValue(
				Number.parseInt(data_to_attend_survey_low_values["Rating Scale"], 10) +
					1,
			),
		);
		await PwActions.click(this.page, this.btnApplyLogic);
	}
	/**
	 * Function to add multiple sections and questions
	 * @param {number} numberOfSections - The number of sections to add
	 * @param {number} numberOfQuestions - The number of questions to add for each section
	 * @param {string} questionType - The type of question to add
	 * @param {string} prefix - The prefix to add to the question name
	 * @example
	 * Let's say you want to add 1 section with 3 rating scale questions in the survey, Then call this function with the number of sections, number of questions, question type and the prefix as the parameter.
	 * await surveyBuilderPage.addMultipleSectionsAndQuestions(1, 3, "Rating Scale", "Engage");
	 * This will create: "Engage Rating Scale 1.1", "Engage Rating Scale 1.2", "Engage Rating Scale 1.3"
	 */

	async addMultipleSectionsAndQuestions(
		numberOfSections,
		numberOfQuestions,
		questionType,
		prefix = "Engage",
	) {
		for (
			let sectionNumber = 1;
			sectionNumber <= numberOfSections;
			sectionNumber++
		) {
			await this.addSection(
				`Section ${sectionNumber}`,
				`Section description ${sectionNumber}`,
			);
			for (
				let questionNumber = 1;
				questionNumber <= numberOfQuestions;
				questionNumber++
			) {
				await this.addQuestionInSection({
					sectionName: `Section ${sectionNumber}`,
					questionType: questionType,
					questionName: `${prefix} ${questionType} ${sectionNumber}.${questionNumber}`,
				});
			}
		}
	}

	/**
	 * Function to add same type of question in the survey for n number of times
	 * @param {string} sectionName - The name of the section in which to add questions
	 * @param {string} questionType - The type of question to add
	 * @param {number} numberOfQuestions - The number of questions to add
	 * @example
	 * Let's say you want to add 3 rating scale questions in the survey, Then call this function with the section name, question type and the number of questions as the parameter.
	 * await surveyBuilderPage.addSameTypeQuestion("My Section", "Rating Scale", 3);
	 * This will create: "Rating Scale 1", "Rating Scale 2", "Rating Scale 3"
	 */
	async addSameTypeQuestion(sectionName, questionType, numberOfQuestions) {
		// Step 1: Add all questions normally (without numbering)
		for (let i = 0; i < numberOfQuestions; i++) {
			await this.addQuestionInSection({
				sectionName: sectionName,
				questionType: questionType,
			});
		}

		// Step 2: Wait a moment for all questions to be added
		await CommonUtils.sleep(1);

		// Step 3: Get all question texts using PwActions
		const questionTextElements = await PwActions.getWebElementsPage(
			this.page,
			this.txtallQuestionTextAreas,
		);
		const allQuestionTexts = await PwActions.getElementsText(
			this.page,
			questionTextElements,
		);

		// Step 4: Find questions that match the desired question type and rename them
		let questionNumber = 1;
		for (let i = 0; i < allQuestionTexts.length; i++) {
			const currentText = allQuestionTexts[i];

			// Check if this question matches the desired question type
			if (currentText === questionType) {
				const numberedQuestionType = `${questionType} ${questionNumber}`;

				// Use indexed selector to target the specific question text area
				const questionSelector = `(${this.txtallQuestionTextAreas})[${i + 1}]`;

				// Click on the question text area to edit it
				await PwActions.click(this.page, questionSelector);
				await CommonUtils.sleep(1);

				// Clear the existing text and enter the new numbered text
				await PwActions.fill(this.page, questionSelector, numberedQuestionType);
				await CommonUtils.sleep(1);

				questionNumber++;
			}
		}
	}

	// Static counter to track current scale for sequential selection
	static currentScaleIndex = 0;

	/**
	 * Function to change the rating scale for different survey types
	 * @param {string} surveyType - The type of survey ("engage", or "performance")
	 * @param {string} scaleName - The name of the scale to change (for 360 surveys)
	 * @param {string} scaleNumber - The scale to select (constants.RATING_SCALE_OPTIONS.SCALE_5, SCALE_7, or SCALE_10 for engage/performance)
	 * @param {number|string} questionNumber - The question number to change (default: 1). Use "all" to change all questions.
	 * @example
	 * // For 360 surveys (existing flow)
	 * await surveyBuilderPage.changeRatingScaleByType("360", "Automation Rating Scale");
	 *
	 * // For Engage/Performance surveys - single question
	 * await surveyBuilderPage.changeRatingScaleByType("engage", null, constants.RATING_SCALE_OPTIONS.SCALE_7); // Select "7 Point scale" for question 1
	 * await surveyBuilderPage.changeRatingScaleByType("performance", null, constants.RATING_SCALE_OPTIONS.SCALE_10, 2); // Select "10 Point scale" for question 2
	 *
	 * // For Engage/Performance surveys - all questions
	 * await surveyBuilderPage.changeRatingScaleByType("engage", null, constants.RATING_SCALE_OPTIONS.SCALE_7, "all"); // Select "7 Point scale" for all questions
	 * await surveyBuilderPage.changeRatingScaleByType("engage", null, null, "all"); // Sequential scale for all questions ("5 Point scale", "7 Point scale", "10 Point scale"...)
	 */
	async changeRatingScaleByType(
		surveyType,
		scaleName = null,
		scaleNumber = null,
		questionNumber = 1,
	) {
		// For 360 surveys - use existing flow
		if (surveyType.toLowerCase() === "performance") {
			await PwActions.hover(
				this.page,
				this.inputQuestionElement(questionNumber),
			);
			await PwActions.click(this.page, this.btnMenuForQuestion(questionNumber));
			await PwActions.click(this.page, this.btnConfigure);
			await PwActions.click(this.page, this.dropdownRatingScale);
			await PwActions.click(this.page, this.getScaleOptionXpath(scaleName));
			await PwActions.click(this.page, this.btnUpdateRatingScale);
		}
		// For Engage surveys - select scale number from dropdown
		else if (surveyType.toLowerCase() === "engage") {
			// If no scale number provided, cycle through scales sequentially (5, 7, 10)
			let selectedScaleNumber = scaleNumber;
			if (!selectedScaleNumber) {
				// Get current scale index to cycle through them dynamically
				const scaleOptions = Object.values(constants.RATING_SCALE_OPTIONS);
				// Cycle through scales sequentially: 5, 7, 10, 5, 7, 10...
				selectedScaleNumber =
					scaleOptions[
						SurveyBuilderPage.currentScaleIndex % scaleOptions.length
					];
				// Increment for next use
				SurveyBuilderPage.currentScaleIndex++;
			}

			// Get all valid scale options dynamically
			const validScaleOptions = Object.values(constants.RATING_SCALE_OPTIONS);

			// Validate scale selection
			if (!validScaleOptions.includes(selectedScaleNumber)) {
				throw new Error(
					`Invalid scale selection: ${selectedScaleNumber}. Must be one of: ${validScaleOptions.join(", ")}.`,
				);
			}

			// Handle "all" questions case
			if (questionNumber === "all" || questionNumber === "ALL") {
				// Get all question text elements to find Rating Scale questions
				const questionTextElements = await PwActions.getWebElementsPage(
					this.page,
					this.txtallQuestionTextAreas,
				);

				// Find Rating Scale question numbers dynamically
				const ratingScaleQuestionNumbers = [];
				for (let i = 0; i < questionTextElements.length; i++) {
					const element = questionTextElements[i];
					if (element) {
						const questionText = await element.textContent();
						if (questionText && questionText.includes("Rating Scale")) {
							ratingScaleQuestionNumbers.push(i + 1); // Convert to 1-based index
						}
					}
				}

				if (ratingScaleQuestionNumbers.length === 0) {
					console.log("No Rating Scale questions found to change scale.");
					return;
				}

				// Change rating scale only for found Rating Scale questions
				for (const questionNum of ratingScaleQuestionNumbers) {
					// Cycle through scales for each question if no specific scale provided
					let scaleForThisQuestion = selectedScaleNumber;
					if (!scaleNumber) {
						const scaleOptions = Object.values(constants.RATING_SCALE_OPTIONS);
						scaleForThisQuestion =
							scaleOptions[
								SurveyBuilderPage.currentScaleIndex % scaleOptions.length
							];
						SurveyBuilderPage.currentScaleIndex++;
					}

					await PwActions.hover(
						this.page,
						this.inputQuestionElement(questionNum),
					);
					await PwActions.click(
						this.page,
						this.btnMenuForQuestion(questionNum),
					);
					await PwActions.click(this.page, this.btnConfigure);
					await PwActions.click(this.page, this.dropdownEngageRatingScale);
					await PwActions.click(
						this.page,
						this.getScaleOptionXpath(scaleForThisQuestion),
					);
					await PwActions.click(this.page, this.btnUpdateRatingScale);
					await CommonUtils.sleep(1);
				}
			} else {
				// Handle single question case
				await PwActions.hover(
					this.page,
					this.inputQuestionElement(questionNumber),
				);
				await PwActions.click(
					this.page,
					this.btnMenuForQuestion(questionNumber),
				);
				await PwActions.click(this.page, this.btnConfigure);
				await PwActions.click(this.page, this.dropdownEngageRatingScale);
				await PwActions.click(
					this.page,
					this.getScaleOptionXpath(selectedScaleNumber),
				);
				await PwActions.click(this.page, this.btnUpdateRatingScale);
			}
		} else {
			throw new Error(
				`Invalid survey type: ${surveyType}. Must be  "engage", or "performance".`,
			);
		}
		await PwActions.waitForNetworkIdle(this.page, 10000);
	}

	/**
	 * Function to edit the question in the section
	 * @param {number} questionNumber - The number of the question to edit
	 * @param {number} sectionNumber - The number of the section in which the question is to be edited
	 * @param {string} newQuestionText - The new text of the question
	 * @example
	 * await surveyBuilderPage.editQuestion(1, 1, "New Question 1");
	 * This will edit the question "Question 1" in the section 1 to "New Question 1".
	 * @returns {Promise<void>} - The function returns a promise that resolves when the question is edited.
	 */
	async editQuestion(questionNumber, sectionNumber, newQuestionText) {
		const sectionXpath = this.getSectionElement(sectionNumber);
		await PwActions.waitAndClick(this.page, sectionXpath);
		const questionXpath = this.getQuestionElement(questionNumber);
		await PwActions.waitAndClick(this.page, questionXpath);
		await PwActions.clearAndFill(this.page, questionXpath, newQuestionText);
	}
	/**
	 * Function to verify that the builder has no sections and questions
	 * @returns {Promise<void>} - The function returns a promise that resolves when the builder has no sections and questions
	 */

	async verifyBuilderHasNoSectionsAndQuestions() {
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.webElementsAllSections,
		);
	}

	/**
	 * Function to verify Goal Question Configuration that is set in builder
	 * @param {Number} questionNumber - The question number to verify
	 * @param {Object} settings - The settings of the question to verify
	 * @param {Array<string>} [settings.goalCycle] - Array of goal cycle names to verify
	 * @param {Array<Object>} [settings.conditions] - Array of condition objects with condition and value properties
	 * @param {string} [settings.feedbackMethod] - The feedback method ("Rating Scale" or "Text")
	 * @param {boolean} [settings.includeNA] - Whether "Not Applicable" option is included
	 * @param {Array<string>} [settings.scaleLabels] - Array of scale label texts to verify
	 * @param {boolean} [settings.makeReasonMandatory] - Whether reason is mandatory for rating
	 * @param {string} [settings.placeholder] - Placeholder text to verify
	 * @param {string} [settings.type] - The type of text input ("single line" or "multi line")
	 * @example
	 * // Example: Verify a Goal question with Rating Scale feedback method
	 * await surveyBuilderPage.verifyGoalQuestionConfiguration(1, {
	 *   goalCycle: ["Q1 2024", "Q2 2024"],
	 *   feedbackMethod: "Rating Scale",
	 *   includeNA: true,
	 *   scaleLabels: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
	 *   makeReasonMandatory: true,
	 *   placeholder: "Please provide a reason for your rating"
	 * });
	 *
	 * @example
	 * // Example: Verify a Goal question with Text feedback method
	 * await surveyBuilderPage.verifyGoalQuestionConfiguration(2, {
	 *   goalCycle: ["Q1 2024"],
	 *   feedbackMethod: "Text",
	 *   type: "multi line",
	 *   placeholder: "Please enter your feedback"
	 * });
	 *
	 * @example
	 * // Example: Verify a Goal question with conditions
	 * await surveyBuilderPage.verifyGoalQuestionConfiguration(3, {
	 *   goalCycle: ["Q1 2024"],
	 *   feedbackMethod: "Rating Scale",
	 *   conditions: [
	 *     { condition: "Employee", value: ["John Doe", "Jane Smith"] }
	 *   ],
	 *   scaleLabels: ["1", "2", "3", "4", "5"]
	 * });
	 */
	async verifyGoalQuestionConfiguration(questionNumber, settings) {
		const questionXpath = this.getQuestionElement(questionNumber);
		await CommonUtils.sleep(2);
		await PwActions.hover(this.page, questionXpath);
		await PwActions.click(this.page, this.btnMenuForQuestion(questionNumber));
		await PwActions.click(this.page, this.btnConfigure);

		if (await PwActions.elementIsVisible(this.page, this.txtUnlock)) {
			await PwActions.fill(this.page, this.txtUnlock, "Proceed");
			await PwActions.click(this.page, this.btnToProceed);
		}

		const {
			goalCycle,
			conditions,
			feedbackMethod,
			includeNA,
			scaleLabels,
			makeReasonMandatory,
			placeholder,
			type,
		} = settings;

		if (goalCycle?.length) {
			await PwActions.click(this.page, this.drpDwnGoalCycle);

			for (const cycle of goalCycle) {
				await PwActions.fill(this.page, this.search, cycle);
				expect(
					await PwActions.isElementChecked(
						this.page,
						this.chkBoxSelectSearchedCycle(cycle),
					),
					`Cycle ${cycle} is not selected`,
				).toBe(true);
			}

			await PwActions.click(this.page, this.btnCanelInCycleDropDown);
		}
		if (feedbackMethod) {
			const feedbackRadio =
				feedbackMethod === "Rating Scale"
					? this.radioBtnGoalRatingcale
					: this.radioBtnGoalText;

			expect(
				await PwActions.isElementChecked(this.page, feedbackRadio),
				`${feedbackMethod} is not selected`,
			).toBe(true);
		}
		if (includeNA) {
			await PwActions.click(
				this.page,
				this.btnRatingScaleConfigForGoalQuestion,
			);
			expect(
				await PwActions.isElementChecked(
					this.page,
					this.chkBoxIncludeNAInGoalQuestion,
				),
				`Include NA is not selected`,
			).toBe(true);
			await PwActions.click(
				this.page,
				this.btnCloseButtonForGoalQuestionConfig,
			);
		}

		if (makeReasonMandatory) {
			expect(
				await PwActions.isElementChecked(
					this.page,
					this.toggleMakeReasonMandatoryForGoalQuestion,
				),
				`Make Reason Mandatory is not selected`,
			).toBe(true);
		}
		if (placeholder) {
			const placeholderText = await PwActions.getAttributeValue(
				this.page,
				this.txtBoxPlacholderForGoalQuestion,
				"value",
			);

			expect(placeholderText, `Placeholder is not set`).toBe(placeholder);
		}
		if (scaleLabels?.length) {
			await PwActions.click(
				this.page,
				this.btnRatingScaleConfigForGoalQuestion,
			);

			for (let index = 0; index < scaleLabels.length; index++) {
				const labelText = await PwActions.getText(
					this.page,
					this.inputScaleLabelForIndex(index),
				);

				expect(labelText, `Label ${index} is not set`).toBe(scaleLabels[index]);
			}

			await PwActions.click(
				this.page,
				this.btnCloseButtonForGoalQuestionConfig,
			);
		}
		if (type) {
			await PwActions.click(
				this.page,
				this.btnRatingScaleConfigForGoalQuestion,
			);

			await PwActions.verifyElementIsPresent(
				this.page,
				`//div[text()="${type}"]`,
			);

			await PwActions.click(
				this.page,
				this.btnCloseButtonForGoalQuestionConfig,
			);
		}
		if (conditions?.length) {
			for (const { condition, value } of conditions) {
				await PwActions.click(
					this.page,
					this.btnDropDownConditionValues(condition),
				);
				for (const val of value) {
					await PwActions.fill(this.page, this.search, val);

					expect(
						await PwActions.isElementChecked(
							this.page,
							this.chkBoxSelectSearchedEmployee(val),
						),
						`Condition ${condition} is not selected`,
					).toBe(true);
				}

				await PwActions.click(this.page, this.btnCanelInCycleDropDown);
			}
		}
		await PwActions.click(this.page, this.btnCancelInGoalModal);
	}

	/**
	 * Function to make a question mandatory or non-mandatory
	 * @param {Object} options - The options for the function
	 * @param {Page} options.page - The page to make the question mandatory or non-mandatory
	 * @param {string} options.questionName - The name of the question to make mandatory or non-mandatory
	 * @param {string} options.sectionName - The name of the section to make the question mandatory or non-mandatory
	 * @example
	 * await surveyBuilderPage.makeQuestionMandatoryNonMandatory({ page: this.page, questionName: "Question 1", sectionName: "Section 1" });
	 * This will make the question "Question 1" mandatory.
	 */

	async makeQuestionMandatoryNonMandatory({
		page = this.page,
		questionName,
		sectionName,
	}) {
		await PwActions.waitForElementVisibility(
			page,
			this.lblSectionName(sectionName),
			10000,
		);
		await PwActions.click(page, this.lblSectionName(sectionName));
		await PwActions.waitForElementVisibility(
			page,
			this.getQuestionName(questionName),
			10000,
		);
		await PwActions.hover(page, this.getQuestionName(questionName));
		await PwActions.waitForElementVisibility(
			page,
			this.buttonMandatoryButtonForQuestion,
			10000,
		);
		await PwActions.click(page, this.buttonMandatoryButtonForQuestion);
		await CommonUtils.sleep(2);
	}
	/**
	 * Function to include zero in eNPS question
	 * click on the checkbox to include zero in eNPS question
	 * @example
	 * await surveyBuilderPage.includeZeroInEnpsQuestion();
	 * This will include zero in the eNPS question.
	 * @returns {Promise<void>} - The function returns a promise that resolves when the zero is included in the eNPS question
	 */
	async includeZeroInEnpsQuestion() {
		await this.navigateToSurveySettings();
		await PwActions.elementIsVisible(this.page, this.chkBoxIncludeEnpsZero);
		await PwActions.toggleCheckBox(this.page, true, this.chkBoxIncludeEnpsZero);
	}
}

export { SurveyBuilderPage };

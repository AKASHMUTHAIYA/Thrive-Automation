import { expect, test } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
import { SurveyPage } from "../../Surveys/Survey_Listing_Page/survey-page.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";

class EngageConfigurePage {
	constructor(page) {
		this.page = page;
		this.surveyPage = new SurveyPage(page);
		this.btnAnonymous =
			"(//label[contains(text(),'information anonymous')]//preceding::button)[last()]";
		this.btnAnonymity = "//div[text()='Anonymity']";
		this.btnVisibility = "//div[text()='Visibility']";
		this.btnManagerConfigurations =
			"//button[@data-testid='visibility_icon-button_edit-managers-switch']";
		this.btnManagerAnonymity =
			"//button[@data-testid='visibility-tabs-and-settings-selection_switch_anonymity']";
		this.btnManagerDirectReporteesVisibility =
			"//button[@data-testid='visibility-tabs-and-settings-selection_radio_direct-reportees']";
		this.btnManagerConfigSave =
			"//button[@data-testid='configure-cluster-modal_button_save']";
		this.commonfunction = new CommonPageFunctions(this.page);
		this.btnSetFrequency = "//span[text()='Set Frequency']";
		this.btnChoose = "//div[text()='Choose']";
		this.txtCustom = "//div[text()='Custom']";
		this.txtDuration = "//input[@placeholder='Duration']";
		this.btnChoosedate = "//span[text()='Choose a date']";
		this.btnSaveSettings = "//span[text()='Save Settings']";
		this.btnSurveySettings = "//div[text()='Survey settings']";
		this.iconNonAnonymityInfo = "//span[@role='img']";
		this.txtPaused = "//p[text()='paused']";
		this.btnPauseSurvey = "//button[.//span[contains(text(),'Pause Survey')]]";
		this.txtNonAnonymityInfo =
			"//p[text()='Respondents identity will be captured with their response. To encourage candid feedback from your employees, it is recommended to run surveys anonymously.']";
		this.cutOffDate =
			"//span[text()='Add cut-off date'] | //button[@data-testid='survey-cutoff-settings_icon-button_delete']/parent::div//p[1]";
		this.txtProceed = "//span[text()='Proceed']";
		this.btnMessage = "//div[text()='Messaging']";
		this.btnSurveyReminder = "(//p[text()='Survey reminder'])[1]";
		this.btnInviteToTakeSurvey = "(//p[text()='Invite to take survey'])[1]";
		this.toggleReminderEmail = "(//p[text()='on']//preceding::button)[last()]";
		this.btnReportReady = "//p[text()='Report ready']";
		this.txtToggleOff = "(//p[text()='OFF'])[1]";
		this.btnDeleteCutOff =
			"//button[@data-testid='survey-cutoff-settings_icon-button_delete']";
		this.btnEdit = "//span[text()='Edit']";
		this.txtSurveyInvitation = "//input[@value='Survey Invitation']";
		this.txtEmailTitle =
			"//input[@value='Your Feedback Matters!'] | //input[@value='Your Pulse Survey Awaits!']";
		this.btnApplyChanges = "//span[text()='Apply Changes']";
		this.txtEmailTitleEdited = "//h5[text()='Survey Invitation Edited']";
		this.txtEmailContentEdited = "//p[text()='Your Feedback Matters Edited!']";
		this.btnAnonymityAndVisibility =
			"//*[@id='nav-link']/div[contains(text(), 'Anonymity & Visibility')]";
		this.btnMessaging = "//div[text()='Messaging']";
		this.txtReminder = "(//p[text()='Survey reminder'])[1]";
		this.btnEdit = "//span[text()='Edit']";
		this.txtSurveyInvitation = "//input[@value='Survey Invitation']";
		this.txtEmailTitle =
			"//label[text()='Title']/ancestor::div[3]/following-sibling::input";
		this.btnApplyChanges = "//span[text()='Apply Changes']";
		this.txtEmailTitleEdited = "//h5[text()='Survey Invitation Edited']";
		this.txtEmailContentEdited = "//p[text()='Your Feedback Matters Edited!']";
		this.txtCompleteSurvey = "//input[@value='Complete the Survey']";
		this.txtEmailReminderTitle =
			":is(input[value='Your Voice Matters!'], input[value='Your Pulse Check Counts!'])";
		this.btnProceedDialog = "//span[contains(text(),'Yes,')]//parent::button";
		this.btnCutoffCancelDialog =
			"//div[@role = 'dialog']/div[3]/button/span[normalize-space(.)='Yes, Proceed']";
		this.btnReportSettings = "//div[text()='Report settings']";
		this.txtReportingFactors = "//p[text()='Reporting Factors']";
		this.txtReportingFactorsList =
			"//tbody//div[contains(@class,'igrSnLq-css')]//p";
		this.btnQuestionsTextButton = (reportingFactor) =>
			`//tr[.//p[contains(text(), '${reportingFactor}')]]//td[3]//div//div//button`;
		this.txtQuestionsListInReportingFactor =
			"//div[contains(@class,'iXamBL-css')]//p[@dir='ltr']";
		this.btnClose = "//button[@aria-label='close']";
		this.btnAddReportingFactor = "//button//span[text()='Add Factor']";
		this.inputReportingFactor = (reportingFactorName) =>
			`//tbody[.//div[contains(text(),'${reportingFactorName}')]]//input`;
		this.btnSaveAndContinue = "//button//span[text()='Save and Continue']";
		this.btnAddQuestions = "//button//span[contains(text(),'Add Questions')]";
		this.chkboxAddQuestions = (question) =>
			`//span[text()='${question}']/ancestor::div[contains(@class, 'icCFqM-css')]//button`;
		this.btnDone = "//button//span[text()='Done']";
		this.inputSearchQuestion =
			"//input[contains(@placeholder,'Search a question')]";
		this.btnQuestionsEdit = "//span[text()='Edit']";
		this.txtReportingFactorName = (reportingFactorName) =>
			`//p[text()='${reportingFactorName}']`;
		this.btnReportingFactorNameEdit = (reportingFactorName) =>
			`//p[text()='${reportingFactorName}']//parent::div//button[@id='editButton']`;
		this.btnReportingFactorDelete = (reportingFactor) =>
			`//tr[.//p[contains(text(), '${reportingFactor}')]]//button[@id='deleteButton']`;
		this.btnConfirmDelete =
			"//span[normalize-space(.)='Yes, Delete'] | //span[text()='Yes, delete']";
		this.lblDeleteSuccessToaster = "//div[text()='Deleted Successfully']";
		this.lblQuestionsHeader = "//h1[text()='Questions']";
		this.btnLiveSurveyFrequencyTime = "//p[contains(text(), 'Starting')]";
		this.btnLiveSurveyFrequencyTimeInsideModal =
			"//p[contains(text(), 'Starting')]/parent::div//button";
		this.btnEditTemplate =
			"//*[name()='svg']/*[local-name()='path' and @d='M23.3867 13.4933L18.5067 8.61333']/ancestor::button";
		this.inputHeaderImage = "(//input[@name='file'])[1]";
		this.btnEmailTemplatesList = (templateName) =>
			`(//p[text()='${templateName}'])[1]`;
		this.toastSuccess = "//div[text()='Email Template updated successfully']";
		this.btnRemoveHeaderImage =
			"//label[text()='Header image']/ancestor::div[2]/following-sibling::div/div[2]/button";
		this.headerImageSrc = "//img[contains(@src, 'custom-header-img')]";
		this.btnDefaultBranding = "//button[@value='default']";
		this.inputEmailSubject =
			"//input[@data-testid='sidebar_form-input_email-subject']";
		this.txtCompleted = "//p[text()='Completed']";
		this.inputEmailTitle =
			"//label[text()='Title']/ancestor::div[3]/following-sibling::input";
		this.inputEmailContent =
			"//div[@class='template-text' and @contenteditable='true']";
		this.btnAddVariable =
			"//label[text()='Body']//ancestor::div[2]/following-sibling::div/div/button[6]";
		this.drpdwnVariable = (variableName) =>
			`//p[normalize-space(text())='${variableName}']`;
		this.drpdwnvariableInTemplate = (variableText) =>
			`//span[contains(@class,'thrive-perform-variable') and normalize-space(.)='{${variableText}}']`;
		this.variableInPreview = (variableText) =>
			`//div[contains(@class,'preview')]//p[contains(text(),'${variableText}')]`;
		this.chkboxFiltersForManagers =
			"//p[text()='Enable Filtering']//parent::div//button";

		// Frequency data locators
		this.getFrequencyTextXpath = (text) =>
			`//p[@data-testid='text' and (starts-with(normalize-space(text()), '${text}') or contains(normalize-space(text()), '${text}'))]`;

		this.txtSurveyNotifications =
			"//p[contains(normalize-space(),'Survey Notifications')]";
		this.chkBoxEmailNotifications =
			"//p[text()='Email']//ancestor::div[3]//button";
		this.chkBoxTextMessageNotifications =
			"//p[text()='Text Message']//ancestor::div[4]//button";
		this.inputAdminThreshold =
			"//input[@name='ADMIN_MINIMUM_RESPONSE_THRESHOLD_VALUE']";
		this.txtNoData = "//h1[text()='Sip on some coffee']";
		this.chkboxDeactivatedEmployeeEligibility =
			"//button[@data-testid='lifecycle-survey-settings_deactivated-employee-eligibility-checkbox']";
		this.inputDeactivatedEmployeeEmailType =
			"//label[starts-with(normalize-space(.),'Allow deactivated employee')]/ancestor::div[1]/following-sibling::div//input";
		this.optionDeactivatedEmployeeEmailType = (value) =>
			`//div[contains(@class, 'twigs-select__menu-list')]//div[text()='${value}']`;

		//elements for adding cluster and group heads visibility in survey

		this.btnAddClusterVisibility =
			"//button[@data-testid='visibility_button_define-visibility']";
		this.btnAddHeadsVisibility =
			"//button[@data-testid='define-visibility-modal_button_add-heads']";
		this.inputSearchHeads =
			"//input[@data-testid='define-visibility-modal_input_search']";
		this.chkboxSelectHead = (headName) =>
			`//p[contains(text(),'${headName}')]//parent::div//preceding-sibling::div//button`;
		this.btnModalAddHeads =
			"//button[@data-testid='define-visibility-modal_button_add' and not( @disabled)]";
		this.btnModalCancel =
			"//button[@data-testid='define-visibility-modal_button_cancel']";
	}

	/**
	 * Function to enable non-anonymous toggle in configure
	 */

	async nonAnonymousSurvey() {
		await PwActions.click(this.page, this.btnAnonymity);
		const isChecked = await this.page.isChecked(this.btnAnonymous);
		if (isChecked) {
			await PwActions.waitAndClick(this.page, this.btnAnonymous);
			await PwActions.waitTillVisible(this.page, this.iconNonAnonymityInfo);
			await PwActions.waitTillVisible(this.page, this.txtNonAnonymityInfo);
		}
	}

	/**
	 * Function to turn on manager anonymity toggle in configure
	 * Checks if toggle is already enabled, if not enables it and waits for confirmation icon
	 */
	async managerAnonymityToggleTurnOn() {
		await PwActions.click(this.page, this.btnVisibility);
		await PwActions.click(this.page, this.btnManagerConfigurations);
		await PwActions.toggleCheckBox(this.page, true, this.btnManagerAnonymity);
		await PwActions.click(this.page, this.btnManagerDirectReporteesVisibility);
		await PwActions.click(this.page, this.btnManagerConfigSave);
	}
	async managerAnonymityToggleTurnOff() {
		await PwActions.click(this.page, this.btnVisibility);
		await PwActions.click(this.page, this.btnManagerConfigurations);
		await PwActions.toggleCheckBox(this.page, false, this.btnManagerAnonymity);
		await PwActions.click(this.page, this.btnManagerDirectReporteesVisibility);
		await PwActions.click(this.page, this.btnManagerConfigSave);
	}

	/**
	 * Functio to turn on filters for manager in configure
	 * @example
	 * await engageConfigurePage.managerFiltersTurnOn();
	 * This function will turn on the filters for manager in configure
	 */
	async managerFiltersTurnOn() {
		await PwActions.click(this.page, this.btnVisibility);
		await PwActions.click(this.page, this.btnManagerConfigurations);
		await PwActions.click(this.page, this.chkboxFiltersForManagers);
		await PwActions.click(this.page, this.btnManagerConfigSave);
		await PwActions.click(this.page, this.btnManagerConfigSave);
	}

	/**
	 * Sets the frequency for the survey to run every specified number of months.
	 * @param frequencyTime - The time period to set the frequency
	 * @param settings - Settings string (e.g., "livesurvey")
	 */
	async setFrequencyForMonths(frequencyTime, settings = "") {
		const { weekValue, dayOfWeek } =
			await this.commonfunction.getWeekAndDay(frequencyTime);
		const week = await this.commonfunction.numberToOrdinalWord(weekValue);
		if (week === "Fifth") {
			this.txtChooseWeek = `//p[text()='Last']`;
		} else {
			this.txtChooseWeek = `//p[text()='${week}']`;
		}
		this.txtChooseDay = `//p[text()='${dayOfWeek}']`;
		await PwActions.click(this.page, this.btnSurveySettings);

		switch (settings) {
			case "livesurvey":
				await PwActions.click(this.page, this.btnLiveSurveyFrequencyTime);
				await PwActions.click(this.page, this.btnCutoffCancelDialog);
				await PwActions.click(
					this.page,
					this.btnLiveSurveyFrequencyTimeInsideModal,
				);
				break;
			default:
				await PwActions.click(this.page, this.btnSetFrequency);
				await PwActions.waitTillVisible(this.page, this.btnChoose);
				await this.page.waitForTimeout(500);
				await PwActions.forceClick(this.page, this.btnChoose);
				await PwActions.waitTillVisible(this.page, this.txtCustom);
				await this.page.waitForTimeout(500);
				await PwActions.click(this.page, this.txtCustom);
				await PwActions.click(this.page, this.btnChoosedate);
				break;
		}

		const { date, time } = await this.commonfunction.convertDateTime(
			new Date(),
		);

		const modifiedTime = await this.commonfunction.addMinutesToTime(time, "1");

		await this.commonfunction.setDateAndTime(this.page, date, modifiedTime);
		await PwActions.waitForNetworkIdle(this.page, 10000);
		await PwActions.click(this.page, this.btnSaveSettings);
	}

	/**
	 * Function to set the cut off date
	 * @param {string} cutOfftime - The time to set the cut off date
	 * @param {string} minutesToAdd - The minutes to add to the time
	 * @example
	 * await engageConfigurePage.cutOffDates("2025-12-15 10:00", "10");
	 * This function will set the cut off date to 2025-12-15 10:10
	 */
	async cutOffDates(cutOfftime, minutesToAdd) {
		await this.surveyPage.navigateTopSections("Configure");

		await PwActions.click(this.page, this.cutOffDate);
		const { date, time } =
			await this.commonfunction.convertDateTime(cutOfftime);
		const modifiedTime = await this.commonfunction.addMinutesToTime(
			time,
			minutesToAdd,
		);
		await this.commonfunction.setDateAndTime(this.page, date, modifiedTime);
	}
	/**
	 * Function to proceed the set cut off date
	 * @example
	 * await engageConfigurePage.proceedSetCutOffDate();
	 * This function will proceed the set cut off date and verify the cut off date is set
	 */
	async proceedSetCutOffDate() {
		await PwActions.waitTillVisible(this.page, this.txtProceed);
		await PwActions.click(this.page, this.txtProceed);
		await PwActions.waitTillVisible(this.page, this.btnDeleteCutOff);
	}
	/**
	 * Function to delete the cut off date
	 * @example
	 * await engageConfigurePage.deleteCutOffDate();
	 * This function will delete the cut off date from the survey and verify the survey becomes live
	 */

	async deleteCutOffDate() {
		await PwActions.waitTillVisible(this.page, this.btnDeleteCutOff);
		await PwActions.click(this.page, this.btnDeleteCutOff);
		await PwActions.click(this.page, this.btnConfirmDelete);
		await CommonUtils.sleep(2);
		await PwActions.pageRefresh(this.page);
		expect(await this.surveyPage.getSurveyStatusFromInsideSurvey()).toBe(
			"Live",
		);
	}

	async disableReminderEmail() {
		await PwActions.waitTillVisible(this.page, this.btnMessage);
		await PwActions.click(this.page, this.btnMessage);
		await PwActions.waitTillVisible(this.page, this.btnSurveyReminder);
		await PwActions.click(this.page, this.btnSurveyReminder);
		await PwActions.waitTillVisible(this.page, this.toggleReminderEmail);
		await PwActions.click(this.page, this.toggleReminderEmail);
		await PwActions.pageRefresh(this.page);
		await PwActions.waitTillVisible(this.page, this.txtToggleOff);
		await PwActions.verifyElementIsPresent(this.page, this.txtToggleOff);
	}

	/**
	 * Disables the 'Invite to take Survey' functionality in the messaging configuration.
	 * This function navigates to the messaging section, turns off the reminder email toggle,
	 * refreshes the page, and verifies that the toggle is in the off state.
	 */
	async disableInvitetotakeSurvey() {
		await PwActions.waitTillVisible(this.page, this.btnMessage);
		await PwActions.click(this.page, this.btnMessage);
		await PwActions.waitTillVisible(this.page, this.btnInviteToTakeSurvey);
		await PwActions.click(this.page, this.btnInviteToTakeSurvey);
		await PwActions.waitTillVisible(this.page, this.toggleReminderEmail);
		await PwActions.click(this.page, this.toggleReminderEmail);
		await CommonUtils.sleep(2);
		await PwActions.pageRefresh(this.page);
		await PwActions.waitTillVisible(this.page, this.txtToggleOff);
		await PwActions.verifyElementIsPresent(this.page, this.txtToggleOff);
	}
	/**
	 * Disables the 'Report ready' functionality in the messaging configuration.
	 * This function navigates to the messaging section, turns off the report ready toggle,
	 * refreshes the page, and verifies that the toggle is in the off state.
	 *
	 * example:
	 * await engageConfigurePage.disableReportReadyEmail();
	 * This function will disable the report ready email functionality in the messaging configuration
	 */

	async disableReportReadyEmail() {
		await PwActions.waitTillVisible(this.page, this.btnMessage);
		await PwActions.click(this.page, this.btnMessage);
		await PwActions.waitTillVisible(this.page, this.btnReportReady);
		await PwActions.click(this.page, this.btnReportReady);
		await PwActions.waitTillVisible(this.page, this.toggleReminderEmail);
		await PwActions.click(this.page, this.toggleReminderEmail);
		await CommonUtils.sleep(2);
		await PwActions.pageRefresh(this.page);
		await PwActions.waitTillVisible(this.page, this.txtToggleOff);
		await PwActions.verifyElementIsPresent(this.page, this.txtToggleOff);
	}

	/**
	 * Function to Edit the Survey Invitation Email Template
	 */
	async editSurveyInvitationEmail() {
		await PwActions.waitTillVisible(this.page, this.btnMessage);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnMessage);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnEdit);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, this.txtSurveyInvitation);
		await PwActions.fill(
			this.page,
			this.txtSurveyInvitation,
			constants.engage_email_subject_edited,
		);
		await PwActions.fill(
			this.page,
			this.txtEmailTitle,
			"Your Feedback Matters Edited!",
		);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnApplyChanges);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, this.txtEmailTitleEdited);
		await PwActions.waitTillVisible(this.page, this.txtEmailTitleEdited);
		await PwActions.verifyElementIsPresent(this.page, this.txtEmailTitleEdited);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.txtEmailContentEdited,
		);
	}

	/**
	 * Function to Edit the Survey Invitation Email Template
	 */
	async editSurveyReminderEmail() {
		await PwActions.click(this.page, this.btnMessaging);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, this.txtReminder);
		await PwActions.click(this.page, this.txtReminder);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnEdit);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, this.txtCompleteSurvey);
		await PwActions.fill(
			this.page,
			this.txtCompleteSurvey,
			constants.engage_email_subject_edited,
		);
		await PwActions.fill(
			this.page,
			this.txtEmailReminderTitle,
			"Your Feedback Matters Edited!",
		);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnApplyChanges);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, this.txtEmailTitleEdited);
		await PwActions.waitTillVisible(this.page, this.txtEmailTitleEdited);
		await PwActions.verifyElementIsPresent(this.page, this.txtEmailTitleEdited);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.txtEmailContentEdited,
		);
	}
	/**
	 * Function to navigate to the 'Engage Reporting Factors' tab in the configure page.
	 * @example
	 * await engageConfigurePage.navigateToReportSettings();
	 * This function will navigate to the 'Report Settings' tab in the configure page
	 */
	async navigateToReportSettings() {
		await PwActions.waitTillVisible(this.page, this.btnReportSettings);
		await PwActions.click(this.page, this.btnReportSettings);
		await PwActions.waitTillVisible(this.page, this.txtReportingFactors);
	}

	/**
	 * Function to get the reporting factors
	 * @returns {array} - The list of reporting factors
	 * @example
	 * const reportingFactorsList = await engageConfigurePage.getReportingFactors();
	 * This function will return the list of reporting factors
	 */
	async getReportingFactors() {
		const reportingFactorsList = await PwActions.getWebElementsPage(
			this.page,
			this.txtReportingFactorsList,
		);
		const reportingFactorsListTexts = await PwActions.getElementsText(
			this.page,
			reportingFactorsList,
		);
		return reportingFactorsListTexts;
	}

	/**
	 * Function to verify the questions inside the reporting factor
	 * @param {string} reportingFactor - The name of the reporting factor to verify the questions
	 * @param {array} questions - The questions to verify inside the reporting factor
	 * @example
	 * await engageConfigurePage.verifyQuestionsInsideReportingFactor("Reporting Factor 1", ["Question 1", "Question 2"]);
	 * This function will verify that the questions "Question 1" and "Question 2" are inside the reporting factor "Reporting Factor 1"
	 */
	async verifyQuestionsInsideReportingFactor(reportingFactor, questions) {
		await PwActions.jsClick(
			this.page,
			this.btnQuestionsTextButton(reportingFactor),
		);
		const questionsList = await PwActions.getWebElementsPage(
			this.page,
			this.txtQuestionsListInReportingFactor,
		);
		const questionsListTexts = await PwActions.getElementsText(
			this.page,
			questionsList,
		);
		expect(questionsListTexts).toEqual(questions);
		await PwActions.click(this.page, this.btnClose);
	}

	/**
	 * Function to add a new reporting factor
	 * @param {string} reportingFactorName - The name of the reporting factor to add
	 * @example
	 * await engageConfigurePage.addNewReportingFactor("Reporting Factor 1");
	 * This function will add the reporting factor "Reporting Factor 1" to the reporting factors list
	 */
	async addNewReportingFactor(reportingFactorName) {
		await PwActions.click(this.page, this.btnAddReportingFactor);
		await PwActions.fill(
			this.page,
			this.inputReportingFactor("reporting"),
			reportingFactorName,
		);
		await PwActions.jsClick(this.page, this.btnSaveAndContinue);
		await PwActions.jsClick(this.page, this.btnDone);
		await CommonUtils.sleep(2);
	}

	/**
	 * Function to add or remove questions from the reporting factor
	 * @param {string} reportingFactorName - The name of the reporting factor to add or remove questions from
	 * @param {array} questions - The questions to add or remove from the reporting factor
	 * @example
	 * await engageConfigurePage.addOrRemoveQuestionsFromReportingFactor("Reporting Factor 1", ["Question 1", "Question 2"]);
	 * This function will select or unselect the questions "Question 1" and "Question 2" from the reporting factor "Reporting Factor 1"
	 */
	async addOrRemoveQuestionsFromReportingFactor(
		reportingFactorName,
		questions,
	) {
		await PwActions.waitTillVisible(
			this.page,
			this.btnQuestionsTextButton(reportingFactorName),
		);
		await PwActions.jsClick(
			this.page,
			this.btnQuestionsTextButton(reportingFactorName),
		);
		await PwActions.waitTillVisible(this.page, this.lblQuestionsHeader);
		if (await PwActions.elementIsVisible(this.page, this.btnQuestionsEdit)) {
			await PwActions.jsClick(this.page, this.btnQuestionsEdit);
		}

		await PwActions.waitTillVisible(this.page, this.inputSearchQuestion);

		const questionsList = Array.isArray(questions) ? questions : [questions];
		for (const question of questionsList) {
			await PwActions.click(this.page, this.inputSearchQuestion);
			await PwActions.clearAndFill(
				this.page,
				this.inputSearchQuestion,
				question,
			);
			await PwActions.waitTillVisible(
				this.page,
				this.chkboxAddQuestions(question),
			);
			await PwActions.click(this.page, this.chkboxAddQuestions(question));
		}
		await PwActions.click(this.page, this.btnDone);
		await CommonUtils.sleep(2);
	}
	/**
	 * Function to verify the added reporting factor
	 * @param {string} reportingFactorName - The name of the reporting factor to verify
	 * @example
	 * await engageConfigurePage.verifyAddedReportingFactor("Reporting Factor 1");
	 * This function will verify that the reporting factor "Reporting Factor 1" is added to the reporting factors list
	 */

	async verifyAddedReportingFactor(reportingFactorName) {
		const reportingFactorsList = await this.getReportingFactors();
		expect(reportingFactorsList).toContain(reportingFactorName);
	}
	/**
	 * Function to edit the reporting factor name
	 * @param {string} reportingFactorName - The name of the reporting factor to edit
	 * @param {string} newReportingFactorName - The new name for the reporting factor
	 * @example
	 * await engageConfigurePage.editReportingFactorName("Reporting Factor 1", "New Reporting Factor 1");
	 * This function will edit the reporting factor "Reporting Factor 1" to "New Reporting Factor 1"
	 */
	async editReportingFactorName(reportingFactorName, newReportingFactorName) {
		await PwActions.hover(
			this.page,
			this.txtReportingFactorName(reportingFactorName),
		);
		await PwActions.click(
			this.page,
			this.btnReportingFactorNameEdit(reportingFactorName),
		);
		await PwActions.fill(
			this.page,
			this.inputReportingFactor(reportingFactorName),
			newReportingFactorName,
		);
		await PwActions.click(this.page, this.btnSaveAndContinue);
		await CommonUtils.sleep(2);
	}

	/**
	 * Function to delete the reporting factor
	 * @param {string} reportingFactorName - The name of the reporting factor to delete
	 * @example
	 * await engageConfigurePage.deleteReportingFactor("Reporting Factor 1");
	 * This function will delete the reporting factor "Reporting Factor 1" from the reporting factors list
	 */
	async deleteReportingFactor(reportingFactorName) {
		await PwActions.jsClick(
			this.page,
			this.btnReportingFactorDelete(reportingFactorName),
		);
		await PwActions.click(this.page, this.btnConfirmDelete);
		await PwActions.waitTillVisible(this.page, this.lblDeleteSuccessToaster);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.lblDeleteSuccessToaster,
		);
	}

	/**
	 * Function to verify the deleted reporting factor
	 * @param {string} reportingFactorName - The name of the reporting factor to verify
	 * @example
	 * await engageConfigurePage.verifyDeletedReportingFactor("Reporting Factor 1");
	 * This function will verify that the reporting factor "Reporting Factor 1" is deleted from the reporting factors list
	 */
	async verifyDeletedReportingFactor(reportingFactorName) {
		const reportingFactorsList = await this.getReportingFactors();
		expect(reportingFactorsList).not.toContain(reportingFactorName);
	}

	/**
	 * Function to pause a pulse survey
	 * Navigates to configure page, clicks pause survey button, confirms the action, and verifies the survey is paused
	 * @example
	 * await engageConfigurePage.pausePulseSurvey();
	 * This function will pause the pulse survey and verify that it is paused
	 */
	async pausePulseSurvey() {
		await this.surveyPage.navigateTopSections("Configure");
		await PwActions.waitTillVisible(this.page, this.btnPauseSurvey);
		await PwActions.click(this.page, this.btnPauseSurvey);
		await PwActions.waitTillVisible(this.page, this.btnProceedDialog);
		await PwActions.click(this.page, this.btnProceedDialog);
		await PwActions.waitTillVisible(this.page, this.txtPaused);
		await PwActions.verifyElementIsPresent(this.page, this.txtPaused);
	}

	/**
	 * Helper function to open email template editor
	 * @private
	 */
	async openTemplateEditor(template) {
		await PwActions.click(this.page, this.btnEmailTemplatesList(template));
		await PwActions.click(this.page, this.btnEditTemplate);
		await PwActions.waitTillVisible(this.page, this.inputEmailSubject);
		await CommonUtils.sleep(1); // Wait for template editor to load
	}

	/**
	 * Helper function to save template changes and wait for confirmation
	 * @private
	 */
	async saveTemplateChanges() {
		const templateApi = constants.getMessagingTemplateUpdateEndpoint(
			EntityIds.getsurveyId(),
		);
		await PwActions.clickAndSyncWithApi(
			this.page,
			this.btnApplyChanges,
			templateApi,
		);
		await PwActions.waitTillVisible(this.page, this.toastSuccess);
		await PwActions.waitTillElementDisappear(this.page, this.toastSuccess);
		await CommonUtils.sleep(2);
	}

	/**
	 * Function to add only header image to email template (for Engage/Pulse surveys).
	 * @param {string} template - The name of the email template to edit
	 * @param {string} surveyName - The name of the survey (not used, kept for backward compatibility)
	 * @returns {Promise<void>} No return value
	 * @example
	 * await engageConfigurePage.addHeaderImageToMailContent("Invite to take survey", "Survey Name");
	 */
	async addHeaderImageToMailContent(template, surveyName) {
		await this.openTemplateEditor(template);

		await PwActions.uploadFile(
			this.page,
			this.inputHeaderImage,
			constants.Custom_Header_Img,
		);
		await PwActions.waitForElement(this.page, this.headerImageSrc);
		await CommonUtils.sleep(1); // Wait for image upload to complete

		await this.saveTemplateChanges();
	}

	/**
	 * Function to remove only header image from email template (for Engage/Pulse surveys).
	 * @param {string} template - The name of the email template to edit
	 * @param {string} surveyName - The name of the survey (not used, kept for backward compatibility)
	 * @returns {Promise<void>} No return value
	 * @example
	 * await engageConfigurePage.removeHeaderImageFromMailContent("Invite to take survey", "Survey Name");
	 */
	async removeHeaderImageFromMailContent(template, surveyName) {
		await this.openTemplateEditor(template);

		await PwActions.waitAndClick(this.page, this.btnRemoveHeaderImage);
		await PwActions.waitTillElementDisappear(this.page, this.headerImageSrc);

		await this.saveTemplateChanges();
	}

	/**
	 * Function to add custom branding image to email template (for Engage/Pulse surveys).
	 * @param {string} template - The name of the email template to edit
	 * @param {string} surveyName - The name of the survey for which the template is being customized
	 *
	 * This function performs the following steps:
	 * 1. Clicks on the specified email template from the templates list
	 * 2. Opens the template editor by clicking the edit button
	 * 3. Uploads a custom branding image file (custom-branding-logo.png) to the template
	 * 4. Waits for the file upload to complete
	 * 5. Applies all changes to the template
	 * 6. Verifies the success toast message appears and disappears
	 *
	 * @example
	 * // Add custom branding to Engage survey invitation template
	 * await engageConfigurePage.addCustomBrandingToMailContent(
	 *   "Invite to take survey",
	 *   "Employee Engagement Survey 2024"
	 * );
	 *
	 * @returns {Promise<void>} No return value
	 */
	async addCustomBrandingToMailContent(template, surveyName) {
		await PwActions.click(this.page, this.btnEmailTemplatesList(template));
		await PwActions.click(this.page, this.btnEditTemplate);

		//uploading custom branding image
		await this.surveyPage.uploadCustomBrandingImage(
			constants.Custom_Branding_Logo,
			false,
		);

		await PwActions.waitTillVisible(this.page, this.btnApplyChanges);
		await PwActions.waitAndClick(this.page, this.btnApplyChanges);
		await PwActions.waitTillVisible(this.page, this.toastSuccess);
		await PwActions.waitTillElementDisappear(this.page, this.toastSuccess);
	}

	/**
	 * Function to add custom branding to email template and apply to all templates.
	 * @param {string} template - The name of the email template to edit
	 * @param {string} surveyName - The name of the survey for which the template is being customized
	 *
	 * This function performs the following steps:
	 * 1. Clicks on the specified email template from the templates list
	 * 2. Opens the template editor by clicking the edit button
	 * 3. Uploads the custom branding image
	 * 4. Checks the "Apply this change for all templates" checkbox
	 * 5. Applies all changes to the template
	 * 6. Verifies the success toast message appears and disappears
	 *
	 * @returns {Promise<void>} No return value
	 */
	async addCustomBrandingToAllTemplates(template, surveyName) {
		await PwActions.click(this.page, this.btnEmailTemplatesList(template));
		await PwActions.click(this.page, this.btnEditTemplate);

		// Upload custom branding image
		await this.surveyPage.uploadCustomBrandingImage(
			constants.Custom_Branding_Logo,
			true,
		);
		await PwActions.waitTillVisible(this.page, this.btnApplyChanges);
		await PwActions.waitAndClick(this.page, this.btnApplyChanges);
	}

	/**
	 * Function to remove custom branding image from email template (for Engage/Pulse surveys).
	 * @param {string} template - The name of the email template to edit
	 * @param {string} surveyName - The name of the survey for which the template is being customized
	 *
	 * This function performs the following steps:
	 * 1. Clicks on the specified email template from the templates list
	 * 2. Opens the template editor by clicking the edit button
	 * 3. Removes the custom branding image if it is present by clicking the remove button
	 * 4. Waits for the image removal to complete
	 * 5. Applies all changes to the template
	 * 6. Verifies the success toast message appears and disappears
	 *
	 * @example
	 * // Remove custom branding from Engage survey invitation template
	 * await engageConfigurePage.removeCustomBrandingFromMailContent(
	 *   "Invite to take survey",
	 *   "Employee Engagement Survey 2024"
	 * );
	 *
	 * @returns {Promise<void>} No return value
	 */
	async removeCustomBrandingFromMailContent(template, surveyName) {
		await PwActions.click(this.page, this.btnEmailTemplatesList(template));
		await PwActions.click(this.page, this.btnEditTemplate);

		// Then enable default branding
		await PwActions.waitAndClick(this.page, this.btnDefaultBranding);
		await CommonUtils.sleep(1);

		await PwActions.waitAndClick(this.page, this.btnApplyChanges);
		await PwActions.waitTillVisible(this.page, this.toastSuccess);
		await PwActions.waitTillElementDisappear(this.page, this.toastSuccess);
	}

	/**
	 * Function to add a single variable to the email body content.
	 * @param {string} variableName - The name of the variable to add (e.g., "Survey Name", "Survey URL", "Company Name", "Employee First Name", "Employee Full Name")
	 *
	 * This function performs the following steps:
	 * 1. Clicks on the "Add Variable" button in the email body section
	 * 2. Waits for the variable dropdown to appear
	 * 3. Clicks on the specific variable from the dropdown menu based on the provided variable name
	 * 4. The variable is then inserted into the email body content at the current cursor position
	 *
	 * @example
	 * // Add Survey Name variable to email body
	 * await engageConfigurePage.addVariableToMailBody("Survey Name");
	 *
	 * // Add Employee Full Name variable to email body
	 * await engageConfigurePage.addVariableToMailBody("Employee Full Name");
	 *
	 * @returns {Promise<void>} No return value
	 */
	async addVariableToMailBody(variableName) {
		await PwActions.waitAndClick(this.page, this.inputEmailContent);
		await this.page.keyboard.type(" ");
		await PwActions.waitAndClick(this.page, this.btnAddVariable);
		await PwActions.waitAndClick(this.page, this.drpdwnVariable(variableName));
	}

	/**
	 * Function to add multiple variables to an Engage/Pulse survey email template.
	 * @param {string} template - The name of the email template to edit
	 * @param {string[]} variableNames - Array of variable names to add
	 *
	 * @example
	 * // Add multiple variables to Invite template
	 * await engageConfigurePage.addMultipleVariablesToTemplate(
	 *   "Invite to take survey",
	 *   ["Survey Name", "Survey URL", "Company Name", "Employee First Name", "Employee Full Name"]
	 * );
	 *
	 * @returns {Promise<void>} No return value
	 */
	async addMultipleVariablesToTemplate(template, variableNames) {
		await this.openTemplateEditor(template);
		for (const variableName of variableNames) {
			await this.addVariableToMailBody(variableName);
			await CommonUtils.sleep(0.5); // Small delay between adding variables
		}
		await this.saveTemplateChanges();
	}

	/**
	 * Function to verify that a variable is visible in the email template body.
	 * @param {string} variableText - The variable text to verify (e.g., "{surveyName}", "{surveyURL}")
	 * @returns {Promise<boolean>} - Returns true if the variable is visible in the template
	 *
	 * @example
	 * // Verify surveyName variable is visible in template
	 * const isVisible = await engageConfigurePage.verifyVariableInTemplate("{surveyName}");
	 */
	async verifyVariableInTemplate(variableText) {
		return await PwActions.elementIsVisible(
			this.page,
			this.drpdwnvariableInTemplate(variableText),
		);
	}

	/**
	 * Function to verify that a variable is visible in the email preview.
	 * @param {string} variableText - The variable text to verify
	 * @returns {Promise<boolean>} - Returns true if the variable is visible in the preview
	 *
	 * @example
	 * // Verify variable is visible in email preview
	 * const isVisible = await engageConfigurePage.verifyVariableInPreview("{surveyName}");
	 */
	async verifyVariableInPreview(variableText) {
		return await PwActions.elementIsVisible(
			this.page,
			this.variableInPreview(variableText),
		);
	}

	/**
	 /**
	  * Fetches the frequency data from the Configure page for Pulse surveys
	  * @returns {Promise<Object>} - Object containing frequencyStarting, frequencyEvery, and frequencyPeriod
	  * @example
	  * const frequencyData = await engageConfigurePage.getFrequencyData();
	  * // frequencyData = { frequencyStarting: "text", frequencyEvery: "text", frequencyPeriod: "text" }
	  */
	async getFrequencyData() {
		// Wait for the frequency 'Starting' text to appear
		await CommonUtils.sleep(1);
		await PwActions.elementIsVisible(
			this.page,
			this.getFrequencyTextXpath("Starting"),
			10,
		);

		// Fetch frequency data
		const [frequencyStarting, frequencyEvery, frequencyPeriod] =
			await Promise.all([
				PwActions.getText(this.page, this.getFrequencyTextXpath("Starting")),
				PwActions.getText(this.page, this.getFrequencyTextXpath("Every")),
				PwActions.getText(
					this.page,
					this.getFrequencyTextXpath("for a period"),
				),
			]);

		return {
			frequencyStarting,
			frequencyEvery,
			frequencyPeriod,
		};
	}

	/**
	 * Verifies that exit surveys are non-anonymous by default.
	 * Checks that the anonymity toggle for "information anonymous" is not present for exit surveys.
	 * @returns {Promise<void>}
	 * @example
	 * await surveyPage.verifyExitIsNonAnonymousByDefault();
	 */
	async verifyExitSurveyIsNonAnonymousByDefault() {
		await PwActions.click(this.page, this.btnAnonymity);
		await PwActions.verifyElementIsNotPresent(this.page, this.btnAnonymous);
	}

	/**
	 * Verifies that the deactivated employee eligibility checkbox is disabled by default
	 * Checks that the deactivated employee eligibility checkbox is unchecked by default
	 * @returns {Promise<void>}
	 * @example
	 * await surveyPage.verifyDeactivatedEmployeeEligibilityCheckboxDisabled();
	 */
	async verifyDeactivatedEmployeeEligibilityCheckboxDisabled() {
		await this.commonfunction.verifyCheckboxUnchecked(
			this.chkboxDeactivatedEmployeeEligibility,
		);
	}

	/**
	 * Toggles the deactivated employee eligibility checkbox on or off
	 * Uses PwActions.setToggleState which checks the data-state attribute
	 * @param {boolean|string} [enable=true] - If true or "on", enables the checkbox (checks it), if false or "off", disables it (unchecks it)
	 * @returns {Promise<void>}
	 * @example
	 * // Enable the checkbox
	 * await surveyPage.toggleDeactivatedEmployeeEligibilityCheckbox(true);
	 *
	 * // Disable the checkbox
	 * await surveyPage.toggleDeactivatedEmployeeEligibilityCheckbox(false);
	 */
	async toggleDeactivatedEmployeeEligibilityCheckbox(enable = true) {
		await PwActions.setToggleState(
			this.page,
			this.chkboxDeactivatedEmployeeEligibility,
			enable,
		);
	}

	/**
	 * Selects an option from a dropdown by clicking the dropdown indicator, typing the value, and selecting it
	 * Reuses the pattern from employees-page.js for selecting dropdown values
	 * @param {string} value - The value to select from the dropdown (e.g., "Email")
	 * @param {string} [dropdownSelector] - Optional custom dropdown selector. If not provided, uses the default dropdown indicator
	 * @param {string} [inputSelector] - Optional custom input selector. If not provided, uses the default dropdown input
	 * @returns {Promise<void>}
	 * @example
	 * // Select "Email" from the default dropdown
	 * await surveyPage.selectOptionFromDropdown("Email");
	 *
	 * // Select a value from a custom dropdown
	 * await surveyPage.selectOptionFromDropdown("Email", "//custom-dropdown-selector", "//custom-input-selector");
	 */
	async selectDeactivatedEmployeeEmailType(value) {
		const input = this.inputDeactivatedEmployeeEmailType;
		const option = this.optionDeactivatedEmployeeEmailType(value);
		await PwActions.fill(this.page, input, value);
		await PwActions.waitAndClick(this.page, option);
		await CommonUtils.sleep(0.5);
	}

	/**
	 * Function to verify the availability of survey notification options
	 * @returns {Promise<void>} No return value
	 *
	 * @example
	 * await engageConfigurePage.verifyAvailabilityOfSurveyNotificationOptions();
	 * This function will verify that the survey notification options are available
	 */
	async verifyAvailabilityOfSurveyNotificationOptions() {
		await PwActions.waitTillVisible(this.page, this.txtSurveyNotifications);
		await PwActions.waitTillVisible(
			this.page,
			this.chkBoxTextMessageNotifications,
		);
		await PwActions.waitTillVisible(this.page, this.chkBoxEmailNotifications);
	}
	/**
	 * Chooses the SMS share type for the survey
	 * @returns {Promise<void>}
	 * @example
	 * await engageConfigurePage.chooseSmsShareType();
	 */
	async chooseSmsShareType() {
		await this.surveyPage.navigateTopSections("Configure");
		await PwActions.toggleCheckBox(
			this.page,
			true,
			this.chkBoxTextMessageNotifications,
		);
	}
	/**
	 * Sets the admin threshold for the survey
	 * @param {string} threshold - The threshold value to set
	 * @returns {Promise<void>}
	 * @example
	 * await engageConfigurePage.setAdminThreshold("10");
	 */
	async setAdminThreshold(threshold) {
		await this.surveyPage.navigateTopSections("Configure");
		await PwActions.click(this.page, this.btnAnonymity);
		await CommonUtils.sleep(1);
		await PwActions.clearAndFill(
			this.page,
			this.inputAdminThreshold,
			threshold,
		);
		await CommonUtils.sleep(1);
		await PwActions.click(this.page, this.btnAnonymity);
	}

	/**
	 * Verifies that exit surveys are non-anonymous by default.
	 * Checks that the anonymity toggle for "information anonymous" is not present for exit surveys.
	 * @returns {Promise<void>}
	 * @example
	 * await surveyPage.verifyExitIsNonAnonymousByDefault();
	 */
	async verifyExitSurveyIsNonAnonymousByDefault() {
		await PwActions.click(this.page, this.btnAnonymity);
		await PwActions.verifyElementIsNotPresent(this.page, this.btnAnonymous);
	}

	/**
	 * Verifies that the deactivated employee eligibility checkbox is disabled by default
	 * Checks that the deactivated employee eligibility checkbox is unchecked by default
	 * @returns {Promise<void>}
	 * @example
	 * await surveyPage.verifyDeactivatedEmployeeEligibilityCheckboxDisabled();
	 */
	async verifyDeactivatedEmployeeEligibilityCheckboxDisabled() {
		await this.commonfunction.verifyCheckboxUnchecked(
			this.chkboxDeactivatedEmployeeEligibility,
		);
	}

	/**
	 * Toggles the deactivated employee eligibility checkbox on or off
	 * Uses PwActions.setToggleState which checks the data-state attribute
	 * @param {boolean|string} [enable=true] - If true or "on", enables the checkbox (checks it), if false or "off", disables it (unchecks it)
	 * @returns {Promise<void>}
	 * @example
	 * // Enable the checkbox
	 * await surveyPage.toggleDeactivatedEmployeeEligibilityCheckbox(true);
	 *
	 * // Disable the checkbox
	 * await surveyPage.toggleDeactivatedEmployeeEligibilityCheckbox(false);
	 */
	async toggleDeactivatedEmployeeEligibilityCheckbox(enable = true) {
		await PwActions.setToggleState(
			this.page,
			this.chkboxDeactivatedEmployeeEligibility,
			enable,
		);
	}

	/**
	 * Selects an option from a dropdown by clicking the dropdown indicator, typing the value, and selecting it
	 * Reuses the pattern from employees-page.js for selecting dropdown values
	 * @param {string} value - The value to select from the dropdown (e.g., "Email")
	 * @param {string} [dropdownSelector] - Optional custom dropdown selector. If not provided, uses the default dropdown indicator
	 * @param {string} [inputSelector] - Optional custom input selector. If not provided, uses the default dropdown input
	 * @returns {Promise<void>}
	 * @example
	 * // Select "Email" from the default dropdown
	 * await surveyPage.selectOptionFromDropdown("Email");
	 *
	 * // Select a value from a custom dropdown
	 * await surveyPage.selectOptionFromDropdown("Email", "//custom-dropdown-selector", "//custom-input-selector");
	 */
	async selectDeactivatedEmployeeEmailType(value) {
		const input = this.inputDeactivatedEmployeeEmailType;
		const option = this.optionDeactivatedEmployeeEmailType(value);
		await PwActions.fill(this.page, input, value);
		await PwActions.waitAndClick(this.page, option);
		await CommonUtils.sleep(0.5);
	}

	async addClusterVisibility(clusterName) {
		await PwActions.click(this.page, this.btnVisibility);
		await PwActions.click(this.page, this.btnAddClusterVisibility);
		await PwActions.waitTillVisible(this.page, this.btnAddHeadsVisibility);
		await PwActions.click(this.page, this.btnAddHeadsVisibility);
		await PwActions.fill(this.page, this.inputSearchHeads, clusterName);
		await PwActions.waitTillVisible(
			this.page,
			this.chkboxSelectHead(clusterName),
		);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.chkboxSelectHead(clusterName));
		await PwActions.waitTillVisible(this.page, this.btnModalAddHeads);
		await PwActions.click(this.page, this.btnModalAddHeads);
		await PwActions.click(this.page, this.btnModalAddHeads);
		await PwActions.click(this.page, this.btnModalAddHeads);
	}
}

export { EngageConfigurePage };

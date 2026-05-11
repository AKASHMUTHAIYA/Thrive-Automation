import { expect, test } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";

class SurveyPage {
	constructor(page) {
		this.page = page;
		this.survey_name = null;
		this.survey_id = null;
		this.commonfunction = new CommonPageFunctions(page);
		this.btnCreateNewSurvey =
			"//span[text()='Create new'] | //span[text()='Create new survey']";
		this.btnBlankSurvey =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-iePstSi-css']";
		this.drpdwnAllSurveys =
			"//div[contains(@class, 'twigs-select__dropdown-indicator')]";
		this.btnSearchSurveys = "//button[@aria-label='Search surveys']";
		this.txtSurveyTitle = `//input[@name="surveyName"]`;
		this.btnCreateSurvey = "//button[@type='submit']";
		this.txtSearchSurveys = "//input[@placeholder='Search all Surveys']";
		this.lblQuestions = "//p[text()='Questions']";
		this.tablebodySurveyList =
			"//table[@class='twigs-c-PJLV twigs-c-PJLV-ikZWDob-css']//tbody";
		this.loadingElement =
			"//div[@class='twigs-c-PJLV twigs-c-vxxMQ twigs-c-vxxMQ-imfpdQ-size-md']";
		this.webElementsAllSurveys =
			"//tr[contains(@class, 'survey-list-table-row')]//p[contains(@class, 'weight-bold')]";
		this.txtUnlock = `//input[@name="unlockText"]`;
		this.btnToProceed = `//span[text()='Yes, Proceed']`;
		this.btnUseThisTemplate = "//span[normalize-space()='Use this Template']";
		this.btnBackToSurveyHomePage =
			"//*[name()='svg']/*[local-name() ='path' and @d='M13.3507 7.984L5.336 16L13.3507 24.016']";
		this.txtBoxSurveyName = "//input[@placeholder='Untitled Survey']";
		this.btnMessaging = "//button[text()='Messaging']";
		this.btnInviteEvaluatorSubject =
			"(//p[text()='Invite to Evaluate Subject'])[1]";
		this.chkboxSendAsSeperateEmails =
			"(//label[text()='Send as Seperate Emails']//preceding::button)[last()]";
		this.btnArchiveSurvey = "//div[text()='Archive Survey']";
		this.popupArchiveSurvey = "//div[text()='Archived succesfully']";
		this.btnArchivedSurveys = "//div[text()='Archived Surveys']";
		this.btnUnarchiveSurvey = "//div[text()='Unarchive Survey']";
		this.btnSurveys = "//div[text()='Surveys']";
		this.btnNavigationSection = "//div[text()='Configure']";
		this.btnEngageSurvey = `//div[@data-testid="survey-type-card_flex"]//p[text()="Engagement"]`;
		this.btnPulseSurvey = `//div[@data-testid="survey-type-card_flex"]//p[text()="Pulse"]`;
		this.btnExitSurvey = `//div[@data-testid="survey-type-card_flex"][@aria-label="Survey type: ExitForm"]`;
		this.btnOnboardingSurvey = `//div[@data-testid="survey-type-card_flex"][@aria-label="Survey type: OnboardingForm"]`;
		this.btnDuplicateSurvey = "//div[text()='Duplicate Survey']";
		this.btnDuplicateSurveySubmit = "//span[text()='Duplicate']/parent::button";
		this.btnAnonymity = "//div[text()='Anonymity']";
		this.btnAnonymous =
			"(//label[contains(text(),'information anonymous')]//preceding::button)[last()]";
		this.containerDuplicateDialogBox =
			"//h2[text()='Duplicate Survey']/ancestor::div[@role='dialog']";
		this.webElementsEngagePulseQuestionBanks =
			"//tbody/descendant::p[text()='Engagement Survey,Pulse Survey']";
		this.webElementsEngageQuestionBanks =
			"//tbody/descendant::p[text()='Engagement Survey']";
		this.webElementsPulseQuestionBanks =
			"//tbody/descendant::p[text()='Pulse Survey']";
		this.webElementsPerformanceQuestionBanks =
			"//tbody/descendant::p[text()='Performance Survey']";
		this.lblParticipantsName = (participantName) =>
			`//p[text()='${participantName}']`;
		this.webElementsAllTemplates = (surveyType) =>
			`//p[text()='${surveyType}']/ancestor::div[@data-testid='box']/following-sibling::div/p`;
		this.lblParticipantCount = (surveyName) =>
			`//p[text()='${surveyName}']/ancestor::tr/td[4]`;
		this.btnToggleLogo =
			"//button[@data-testid='sidebar_switch_custom-branding']";
		this.chkboxApplyChangesToAll =
			"//label[text()='Apply this change for all templates']/preceding-sibling::button";
		this.inputCustomBrandingImage =
			"//p[normalize-space(.)='Logo']/ancestor::div/following-sibling::div//input";
		this.inputInviteCollaborator =
			"//div[text()='Invite Collaborator']/following-sibling::div//input";
		this.txtEmployee = (employee) => `//p[text()='${employee}']`;
		this.txtSurveyName = (surveyName) => `//*[text()='${surveyName}']`;
		this.surveyListTableRows = "//tr[contains(@id,'survey-list-table-row')]";
		this.surveyNameFrCollaborator = (surveyName) =>
			`//p[text()='${surveyName}']`;
		this.page = page;
		this.inputInviteCollaborator =
			"//div[text()='Invite Collaborator']/following-sibling::div//input";
		this.txtEmployee = (employee) => `//p[text()='${employee}']`;
		this.selectoptions = (surveyName) =>
			`//p[text()='${surveyName}']/ancestor::td/following-sibling::td//button`;
		this.nameForSurvey = '//td[normalize-space(text())="Not Set"]';
		this.getAllMenuItems = "//div[@role='menuitem']";

		this.btnSurveyActions = (surveyName) =>
			`//p[text()='${surveyName}']/ancestor::tr//td[last()]//button`;
		this.templateCardLocator = "//div[contains(@id, 'template-card')]";
		this.radioBtnCustom = "//button[@value='custom']";
		this.btnSaveInImageCropper = "//span[text()='Save']/ancestor::button";
		this.btnViewMore = "//span[contains(text(),'View')]/parent::button";
		this.txtClonedSurveyName = `//label[normalize-space(.)="Title"]/ancestor::div/input`;
		this.inputTitleDuplicateSurvey = `//label[normalize-space(.)="Title"]/ancestor::div[3]/following-sibling::input`;
		this.btnExitSurvey = `//div[@data-testid="survey-type-card_flex"][@aria-label="Survey type: ExitForm"]`;
		this.txtExitSurveyTitle = `//input[@name="surveyName"][@placeholder="e.g. Employee Exit Survey"]`;
		this.txtSurveyStatus = "(//nav//div[3]//div//p)[1]";
	}

	/**
	 * Getting Xpath for particular Survey Template.
	 *
	 * @param {string} templateName - Survey Template name.
	 */
	getTemplateXpath(templateName) {
		return `//p[text()='${templateName}']/ancestor::div[@class='twigs-c-PJLV twigs-c-PJLV-ifDduug-css']`;
	}

	/**
	 * Getting Xpath for particular Survey.
	 *
	 * @param {string} surveyName - Survey name.
	 */
	getSurveyElementXpath(surveyName) {
		return `//p[text()='${surveyName}']/ancestor::td`;
	}

	/**
	 * creates a new survey with the provided name.
	 *
	 * @param {string} surveyname - The name of the survey to be created.
	 * @param {string} [surveyType] - Optional survey type to select explicitly ("engage"|"engagement"|"pulse"|"exit"|"onboarding").
	 */
	async createNewSurvey(surveyname, page = this.page) {
		this.survey_name = surveyname;
		EntityIds.setsurveyName(this.survey_name);
		this.txtSurveyTitleInBuild = `//input[@value = '${surveyname}']`;
		await this.commonfunction.waitTillLoadingElementDisappear(25, page);
		await PwActions.waitForElement(
			page,
			this.commonfunction.elementFeaturePopup,
		);
		await this.commonfunction.closeFeaturePopupIfPresent(page);
		await PwActions.waitAndClick(page, this.btnCreateNewSurvey);
		if (surveyname.toLowerCase().includes("engage")) {
			await PwActions.click(page, this.btnEngageSurvey);
		}
		if (surveyname.toLowerCase().includes("pulse")) {
			await PwActions.click(page, this.btnPulseSurvey);
		}
		if (surveyname.toLowerCase().includes("exit")) {
			await PwActions.click(this.page, this.btnExitSurvey);
			await PwActions.waitForNetworkIdle(page, 10000);
		}

		await PwActions.fill(page, this.txtSurveyTitle, surveyname);
		await PwActions.waitForNetworkIdle(page, 10000);
		await CommonUtils.sleep(1);
		await PwActions.click(page, this.btnCreateSurvey);
		await PwActions.waitForDOMContentLoaded(page, 15000);
		await PwActions.waitTillVisible(page, this.lblQuestions, 30000);
		await CommonUtils.sleep(2);
		await PwActions.waitForNetworkIdle(page, 10000);
		await PwActions.waitTillElementDisappear(page, this.btnCreateSurvey, 20000);
		await PwActions.waitTillVisible(page, this.lblQuestions, 30000);

		// Store the survey builder URL
		EntityIds.setSurveyBuilderUrl(await page.url());

		this.survey_id = await this.getSurveyIdFromURL(
			await PwActions.getCurrentUrl(page),
		);
		EntityIds.setsurveyId(this.survey_id);
		await PwActions.waitForCompletePageLoad(page, 10000);
		await PwActions.waitForDOMContentLoaded(page, 10000);
		await CommonUtils.sleep(2);
	}

	/**
	 * Sets the survey time to a specified number of minutes after the current time.
	 * This function is used to configure the scheduled time for exit surveys.
	 *
	 * @param {number} [minutesAfter=3] - Number of minutes after current time to set (default: 3).
	 * @example
	 * // Set time to 3 minutes from now (default)
	 * await surveyPage.setTimeAfterCurrentTime();
	 *
	 * // Set time to 5 minutes from now
	 * await surveyPage.setTimeAfterCurrentTime(5);
	 */
	async scheduleSurveyFromNow(minutesAfter = 2) {
		// Locators for custom time picker
		this.btnApplyTime = `//button[@data-testid="custom-time-picker_button_apply"]`;
		this.btnScheduleTime = `//button[@data-testid="schedule-survey_button_time-picker"]`;

		// Calculate time 3 minutes from now
		const now = new Date();
		now.setMinutes(now.getMinutes() + minutesAfter);

		let hours = now.getHours();
		const minutes = now.getMinutes();

		// Convert to 12-hour format
		const isPM = hours >= 12;
		hours = hours % 12;
		if (hours === 0) hours = 12;

		// Format hour and minute with leading zeros
		const hourStr = String(hours).padStart(2, "0");
		const minuteStr = String(minutes).padStart(2, "0");

		// Locators for hour and minute selection in the time picker
		// The time picker shows hours (01-12) and minutes (00-59) as clickable elements
		this.btnHourSelection = `//button[@data-testid="custom-time-picker_field-button_hour" and text()="${hourStr}"]`;
		this.btnMinuteSelection = `//button[@data-testid="custom-time-picker_field-button_minute" and text()="${minuteStr}"]`;
		this.btnAmSelection = `//button[@data-testid="custom-time-picker_field-button_am"]`;
		this.btnPmSelection = `//button[@data-testid="custom-time-picker_field-button_pm"]`;

		// Click on the time picker trigger to open the picker
		await PwActions.click(this.page, this.btnScheduleTime);
		await CommonUtils.sleep(0.5);
		await PwActions.click(this.page, this.btnHourSelection);
		await CommonUtils.sleep(0.5);
		await PwActions.click(this.page, this.btnMinuteSelection);
		await CommonUtils.sleep(0.5);
		if (isPM) {
			await PwActions.click(this.page, this.btnPmSelection);
		} else {
			await PwActions.click(this.page, this.btnAmSelection);
		}
		await CommonUtils.sleep(0.5);
		await PwActions.click(this.page, this.btnApplyTime);
		await CommonUtils.sleep(0.5);
	}

	/**
	 * Function to enable send as seperate emails
	 */
	async sendSeperateEmails() {
		await PwActions.click(this.page, this.btnMessaging);
		await PwActions.click(this.page, this.btnInviteEvaluatorSubject);
		await PwActions.click(this.page, this.chkboxSendAsSeperateEmails);
	}

	/**
	 *creates a survey from survey Template.
	 *
	 * @param {string} templateName - Survey Template to create a survey .
	 *  @param {string} surveyname - Survey Name to replace with template name.
	 */
	async createSurveyFromTemplate(templateName, surveyName) {
		this.survey_name = surveyName;
		EntityIds.setsurveyName(this.survey_name);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(1.5);
		const templatePath = this.getTemplateXpath(templateName);
		await PwActions.click(this.page, templatePath);
		await PwActions.click(this.page, this.btnUseThisTemplate);
		await CommonUtils.sleep(5);
		await PwActions.clear(this.page, this.txtBoxSurveyName);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(1);
		await PwActions.fill(this.page, this.txtBoxSurveyName, surveyName);
		await PwActions.press(this.page, "Enter");
		this.survey_id = await this.getSurveyIdFromURL(
			await PwActions.getCurrentUrl(this.page),
		);
		EntityIds.setsurveyId(this.survey_id);
	}

	/**
	 * selects a survey type from a dropdown menu.
	 *
	 * @param {string} surveyType - The type of survey to select.
	 */
	async selectSurveyTypeFromDropdown(surveyType) {
		this.surveyTypeOptions = `//div[contains(@class, 'twigs-select__menu-list')]//div[text()='${surveyType}']`;
		await PwActions.click(this.page, this.drpdwnAllSurveys);
		await PwActions.click(this.page, this.surveyTypeOptions);
	}

	/**
	 * Searches for a survey by name.
	 *
	 * @param {string} surveyname - The name of the survey to search for.
	 */
	async searchSurvey(surveyname) {
		await PwActions.click(this.page, this.btnSearchSurveys);
		await PwActions.fill(this.page, this.txtSearchSurveys, surveyname);
	}

	/**
	 * selects a survey from a list based on the provided survey name.
	 *
	 * @param {string} surveyName - The name of the survey to be selected.
	 */
	async selectSurveyFromList(surveyName) {
		this.surveyOption = `//p[text()='${surveyName}']/ancestor::td`;
		await PwActions.click(this.page, this.surveyOption);
	}

	async getSurveyIdFromURL(url) {
		let number = null;
		const match = url.match(/\/(?:perform|surveys)\/(\d+)\//);

		if (match) {
			number = match[1];
			console.log(number);
		}
		return number;
	}

	/**
	 * navigate to the to sections in syrvey page.
	 *
	 * @param {string} section - The name of the section to navigate.
	 */
	async navigateTopSections(section, page = this.page) {
		await PwActions.waitForCompletePageLoad(page, 10000);
		await PwActions.waitForDOMContentLoaded(page, 10000);
		this.btnNavigationSection = `//div[text()='${section}']`;
		this.btnNavigationSectionReports = `//a[text()='${section}']`;
		if (
			section === "Create" ||
			section === "Configure" ||
			section === "Participants" ||
			section === "Distribution"
		) {
			await CommonUtils.sleep(2);
			await PwActions.waitForNetworkIdle(page, 20000);
			await PwActions.click(page, this.btnNavigationSection);
		} else if (section === "Reports") {
			await PwActions.click(page, this.btnNavigationSectionReports);
		}
	}

	// This function navigates to survey home page(Survey Listing page)
	async navigateToSurveyHomePage(page = this.page) {
		await PwActions.waitTillVisible(page, this.btnBackToSurveyHomePage);
		await PwActions.click(page, this.btnBackToSurveyHomePage);
		await PwActions.pageRefresh(page);
		await CommonUtils.sleep(3);
	}

	async verifyPageUI() {
		await this.commonfunction.waitTillLoadingElementDisappear();
		await CommonUtils.sleep(1);
		await PwActions.visualTestComparison(this.page, "PerformancePage.png", [
			this.tablebodySurveyList,
		]);
	}

	//Function to get all the surveyElements and store in surveys array
	async getSurveysElements() {
		const surveys = await PwActions.getWebElementsPage(
			this.page,
			this.webElementsAllSurveys,
		);
		return surveys;
	}

	//Function to get text of each survreyElement and store in surveyNames arr
	async getSurveysNames() {
		const surveysElements = await this.getSurveysElements();
		const surveyNames = await PwActions.getElementsText(
			this.page,
			surveysElements,
		);
		return surveyNames;
	}

	//Function to get all the surveyElements and store in surveyTemplateElements array
	/**
	 * Gets the template elements for a specific survey type
	 *
	 * @param {string} surveyType - The type of survey ('engage', 'pulse', or 'performance')
	 * @returns {Promise<Array>} The template elements for the specified survey type
	 */
	async getSurveyTemplatesElements(surveyType) {
		let templateSelector;
		switch (surveyType.toLowerCase()) {
			case "engage":
				templateSelector = this.webElementsAllTemplates("Engagement");
				break;
			case "pulse":
				templateSelector = this.webElementsAllTemplates("Pulse");
				break;
			case "performance":
				templateSelector = this.webElementsAllTemplates("Performance");
				break;
			default:
				throw new Error(
					`Invalid survey type: ${surveyType}. Must be 'engage', 'pulse', or 'performance'`,
				);
		}
		const surveyTemplateElements = await PwActions.getWebElementsPage(
			this.page,
			templateSelector,
		);
		return surveyTemplateElements;
	}

	/**
	 * Gets the template names for a specific survey type
	 *
	 * @param {string} surveyType - The type of survey ('engage', 'pulse', or 'performance')
	 * @returns {Promise<Array>} The template names for the specified survey type
	 */
	async getSurveyTemplatesNames(surveyType) {
		CommonUtils.sleep(2);
		const surveyTemplateElements =
			await this.getSurveyTemplatesElements(surveyType);
		const surveyTemplateNames = await PwActions.getElementsText(
			this.page,
			surveyTemplateElements,
		);
		return surveyTemplateNames;
	}

	/**
	 * Gets the question banks elements for a specific survey type
	 *
	 * @param {string} surveyType - The type of survey ('engage', 'pulse', 'engagepulse', or 'performance')
	 * @returns {Promise<Array>} The question banks elements for the specified survey type
	 */
	async getQuestionBanksElements(surveyType) {
		let questionBanksSelector;
		const surveyTypeLower = surveyType.toLowerCase();
		expect(["engage", "pulse", "engagepulse", "performance"]).toContain(
			surveyTypeLower,
		);
		switch (surveyTypeLower) {
			case "engage":
				questionBanksSelector = this.webElementsEngageQuestionBanks;
				break;
			case "pulse":
				questionBanksSelector = this.webElementsPulseQuestionBanks;
				break;
			case "engagepulse":
				questionBanksSelector = this.webElementsEngagePulseQuestionBanks;
				break;
			case "performance":
				questionBanksSelector = this.webElementsPerformanceQuestionBanks;
				break;
		}
		const questionBanksElements = await PwActions.getWebElementsPage(
			this.page,
			questionBanksSelector,
		);
		return questionBanksElements;
	}

	/**
	 * Gets the names of the question banks names for a specific survey type
	 *
	 * @param {string} surveyType - The type of survey ('engage', 'pulse', 'engagepulse', or 'performance')
	 * @returns {Promise<Array>} The names of the question banks for the specified survey type
	 */
	async getQuestionBanksNames(surveyType) {
		const questionBanksElements =
			await this.getQuestionBanksElements(surveyType);
		const questionBanksNames = await PwActions.getElementsText(
			this.page,
			questionBanksElements,
		);
		return questionBanksNames;
	}

	/**
	 * Function to get the status of the survey.
	 *
	 * @param {string} surveyName - The name of the Survey.
	 */
	async getSurveyStatus(surveyName) {
		const surveyStatusElement = `//div[@class="twigs-c-PJLV twigs-c-PJLV-ifixGjY-css"]/div/p[text()='${surveyName}']/parent::div/child::div/div/p`;
		const surveyStatus = await PwActions.getText(
			this.page,
			surveyStatusElement,
		);
		return surveyStatus;
	}

	/**
	 * Function to get the status of the survey from inside the survey.
	 *
	 */
	async getSurveyStatusFromInsideSurvey() {
		await PwActions.pageRefresh(this.page);
		await PwActions.waitForCompletePageLoad(this.page);
		const surveyStatus = await PwActions.getText(
			this.page,
			this.txtSurveyStatus,
		);
		return surveyStatus;
	}

	/**
	 * Function to open a survey and navigate to Create tab based on status of the Survey
	 *
	 * @param {string} surveyname - The name of the Survey.
	 * @param {string} surveyStatus - The Status of the Survey.
	 */
	async openSurveyAndnavigateToCreateTab(
		surveyname,
		surveyStatus,
		page = this.page,
	) {
		const surveyElement = `${this.webElementsAllSurveys}[text()='${surveyname}']`;
		await CommonUtils.sleep(2);
		await PwActions.click(page, surveyElement);
		if (surveyStatus === "Live" || surveyStatus === "Completed") {
			await this.navigateTopSections("Create", page);
			await PwActions.click(page, this.txtUnlock);
			await PwActions.fill(page, this.txtUnlock, "Proceed");
			await PwActions.click(page, this.btnToProceed);
		}
	}

	/**
	 * Function to verify whether the created survey is showing Live in survey listing page or not
	 *
	 * @param {string} surveyname - The name of the Survey.
	 */
	async verifyCreatedSurveyInSurveyListingPage(surveyName) {
		try {
			const surveyStatus = await this.getSurveyStatus(surveyName);
			if (surveyStatus !== "Live") {
				throw new Error(`Survey "${surveyName}" is not launced`);
			}
		} catch (error) {
			console.error(
				`Error while verifying the survey "${surveyName}": ${error.message}`,
			);
			throw error;
		}
	}

	/**
	 * This function is to archieve the survey
	 * @param {survey_name} pass the name of the survey
	 */

	async archiveSurvey(survey_name) {
		this.btnBackSurvey = `//input[@value='${survey_name}']//preceding::a`;
		this.txtSurveyName = `//p[text()='${survey_name}']`;
		this.btnMenu = `(//p[text()='${survey_name}']//following::div)[6]`;
		await PwActions.click(this.page, this.btnBackSurvey);
		await PwActions.hover(this.page, this.txtSurveyName);
		await PwActions.click(this.page, this.btnMenu);
		await PwActions.click(this.page, this.btnArchiveSurvey);
		await PwActions.elementIsVisible(this.page, this.popupArchiveSurvey);
		await PwActions.pageRefresh(this.page);
		await PwActions.elementIsVisible(this.page, this.btnCreateNewSurvey);
		await PwActions.verifyElementIsNotPresent(this.page, this.txtSurveyName);
	}

	/**
	 * This function is to unarchieve the survey
	 * @param {survey_name} pass the name of the survey
	 */

	async unarchiveSurvey(survey_name) {
		this.btnBackSurvey = `//input[@value='${survey_name}']//preceding::a`;
		this.txtSurveyName = `//p[text()='${survey_name}']`;
		this.btnMenu = `(//p[text()='${survey_name}']//following::div)[3]`;
		await PwActions.pageRefresh(this.page);
		await PwActions.elementIsVisible(this.page, this.btnArchivedSurveys);
		await PwActions.click(this.page, this.btnArchivedSurveys);
		await PwActions.elementIsVisible(this.page, this.txtSurveyName);
		await PwActions.hover(this.page, this.txtSurveyName);
		await PwActions.click(this.page, this.btnMenu);
		await PwActions.click(this.page, this.btnUnarchiveSurvey);
		await PwActions.elementIsVisible(this.page, this.popupArchiveSurvey);
		await PwActions.pageRefresh(this.page);
		await PwActions.elementIsVisible(this.page, this.btnArchivedSurveys);
		await PwActions.verifyElementIsNotPresent(this.page, this.txtSurveyName);
	}

	/**
	 * This function is to verify the survey is present in home page
	 * @param {survey_name} pass the name of the survey
	 */

	async verifySurveyIsVisible(survey_name) {
		this.txtSurveyName = `//p[text()='${survey_name}']`;
		await PwActions.elementIsVisible(this.page, this.btnSurveys);
		await PwActions.click(this.page, this.btnSurveys);
		await PwActions.elementIsVisible(this.page, this.txtSurveyName);
	}

	async cloneSurvey(surveyName, components = "Content") {
		this.btnSurveyActions = `//p[text()='${surveyName}']/ancestor::tr//td[last()]//button`;
		await this.commonfunction.waitTillLoadingElementDisappear(10);
		await this.searchSurvey(surveyName);
		await PwActions.hover(this.page, this.getSurveyElementXpath(surveyName));
		await PwActions.click(this.page, this.btnSurveyActions);
		await PwActions.click(this.page, this.btnDuplicateSurvey);
		const clonedSurveyName = await PwActions.getAttributeValue(
			this.page,
			this.inputTitleDuplicateSurvey,
			"value",
		);
		// await this.chooseComponentToCopy("Content");
		await this.chooseComponentToCopy(components);
		EntityIds.setsurveyName(
			await PwActions.getText(this.page, this.txtClonedSurveyName),
		);
		await PwActions.click(this.page, this.btnDuplicateSurveySubmit);
		await PwActions.waitTillVisible(this.page, this.lblQuestions, 30000);
		EntityIds.setsurveyName(clonedSurveyName);
		EntityIds.setsurveyId(await this.getSurveyIdFromURL(this.page.url()));
		return clonedSurveyName;
	}

	async chooseComponentToCopy(components) {
		const componentsToSelect = components
			.split(",")
			.map((component) => component.trim());
		const isContentSelected = componentsToSelect.includes("Content");
		const isConfigurationSelected =
			componentsToSelect.includes("Configuration");
		const isDistributionSelected = componentsToSelect.includes("Distribution");

		if (isContentSelected) {
			await this.selectUnselectComponent("Content", "select");
		} else {
			await this.selectUnselectComponent("Content", "unselect");
		}

		if (isConfigurationSelected) {
			await this.selectUnselectComponent("Configuration", "select");
		} else {
			await this.selectUnselectComponent("Configuration", "unselect");
		}

		if (isDistributionSelected) {
			await this.selectUnselectComponent("Distribution", "select");
		} else {
			await this.selectUnselectComponent("Distribution", "unselect");
		}
	}

	async selectUnselectComponent(component, action) {
		this.btnComponetTickMark = `//p[text()='${component}']/parent::div/preceding-sibling::div[contains(@class,'iefQDCD')]`;
		this.btnComponet = `//p[text()='${component}']/ancestor::div[contains(@class,'clone-survey-chip')]`;
		await PwActions.waitForElement(this.page, this.btnComponetTickMark, 3000);
		const isChecked = await PwActions.elementIsVisible(
			this.page,
			this.btnComponetTickMark,
		);

		if (action === "select" && !isChecked) {
			await PwActions.click(this.page, this.btnComponet);
		} else if (action === "unselect" && isChecked) {
			await PwActions.click(this.page, this.btnComponet);
		}
	}

	/**
	 * Function to get the participant count of the survey
	 * @param {string} surveyName - The name of the survey
	 * @returns {Promise<string>} The participant count of the survey
	 */
	async getParticipantCount(surveyName) {
		const participantCount = await PwActions.getText(
			this.page,
			this.lblParticipantCount(surveyName),
		);
		return participantCount;
	}
	/**
	 * Function to verify the participant count of the survey
	 * @param {string} surveyName - The name of the survey
	 * @param {string} expectedCount - The expected participant count
	 */
	async verifySurveyParticipantsCount(surveyName, expectedCount) {
		const participantCount = await this.getParticipantCount(surveyName);
		expect(
			participantCount,
			"Expected members count should match participant count",
		).toBe(expectedCount);
	}

	/**
	 * Function to check anonymous toggle in configure is unchecked
	 */

	async checknonAnonymousSurvey() {
		await PwActions.click(this.page, this.btnAnonymity);
		const isChecked = await this.page.isChecked(this.btnAnonymous);
		expect(
			isChecked,
			"Anonymity toggle should be unchecked for non-anonymous survey",
		).toBeFalsy();
	}
	/**
	 * Function to check anonymous toggle in configure is checked
	 */
	async checkAnonymousSurvey() {
		await PwActions.click(this.page, this.btnAnonymity);
		const isChecked = await this.page.isChecked(this.btnAnonymous);
		expect(
			isChecked,
			"Anonymity toggle should be checked for anonymous survey",
		).toBeTruthy();
	}

	/**
	 * Function to check to check distribution page
	 */

	async checkDistributionPage(engageParticipantName) {
		await PwActions.waitForDOMContentLoaded(this.page);
		await PwActions.waitTillVisible(
			this.page,
			this.lblParticipantsName(engageParticipantName),
			20000,
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.lblParticipantsName(engageParticipantName),
		);
	}

	/**
	 * Function to navigate to side tab
	 * @param {string} sideTabName - The name of the side tab e.g. Surveys, Archived Surveys, Question Banks
	 */
	async navigateToSideTab(sideTabName) {
		const sideTabElement = `//div[text()='${sideTabName}']`;
		await PwActions.click(this.page, sideTabElement);
	}

	/**
	 * Uploads a custom branding image for the survey.
	 *
	 * This function enables the custom branding toggle, uploads the specified image file,
	 * optionally applies the changes to all surveys if the flag is set, and waits for the upload to complete.
	 *
	 * @param {string} imagePath - The file path of the image to upload as custom branding.
	 * @param {boolean} applyChangesToAll - If true, applies the custom branding image to all surveys.
	 * @returns {Promise<void>} No return value.
	 *
	 * @example
	 * // Upload a custom branding image and apply changes to all surveys
	 * await surveyPage.uploadCustomBrandingImage("TSAP/Data/Resources/custom-branding-logo.png", true);
	 *
	 * // Upload a custom branding image for the current survey only
	 * await surveyPage.uploadCustomBrandingImage("TSAP/Data/Resources/custom-branding-logo.png", false);
	 */
	async uploadCustomBrandingImage(imagePath, applyChangesToAll) {
		await PwActions.setToggleState(this.page, this.btnToggleLogo, "on");
		await PwActions.click(this.page, this.radioBtnCustom);
		await PwActions.uploadFile(
			this.page,
			this.inputCustomBrandingImage,
			imagePath,
		);
		await PwActions.click(this.page, this.btnSaveInImageCropper);
		if (applyChangesToAll) {
			await PwActions.check(this.page, this.chkboxApplyChangesToAll);
		}
		await CommonUtils.sleep(5);
	}

	/**
	 * Adds a collaborator to a survey by entering their name and selecting them.
	 * @param {string} employee - The name or identifier of the employee to be added as a collaborator.
	 * @returns {Promise<void>}
	 * @example
	 * await addSurveyCollaborator("John Doe");
	 * // Steps performed:
	 * // 1. Clicks on the invite collaborator input.
	 * // 2. Fills in "John Doe".
	 * // 3. Waits until "John Doe" appears in the suggestion list.
	 * // 4. Selects "John Doe" from the list.
	 */

	async addSurveyCollaborator(employee) {
		await PwActions.click(this.page, this.inputInviteCollaborator);
		await PwActions.fill(this.page, this.inputInviteCollaborator, employee);
		const employeeName = this.txtEmployee(employee);
		await PwActions.waitTillVisible(this.page, employeeName);
		await PwActions.click(this.page, employeeName);
		await PwActions.waitTillVisible(this.page, employeeName);
	}

	/**
	 * Verifies whether a given survey is visible in the collaborator's view.
	 * @param {string} surveyName - The name of the survey to verify.
	 * @returns {Promise<void>} Throws an assertion error if the survey is not visible.
	 * @example
	 * await verifySurveyInCollaboratorView("Employee Engagement Survey");
	 * // Suppose the collaborator view lists:
	 * // <div class="survey-name">Employee Engagement Survey</div>
	 * // The function confirms the survey is visible.
	 */

	async verifySurveyInCollaboratorView(surveyName, page = this.page) {
		await PwActions.waitForElementVisibility(
			page,
			this.txtSurveyName(surveyName),
		);
		const surveyExists = await PwActions.elementIsVisible(
			page,
			this.txtSurveyName(surveyName),
		);
		expect(surveyExists).toBeTruthy();
	}

	/**
	 * Returns the count of surveys found in the survey list table.
	 * @returns {Promise<number>} The count of surveys found in the survey list table.
	 * @example
	 * const totalSurveys = await getTotalSurveysInCollaboratorView();
	 * // Suppose the collaborator view table contains 3 rows:
	 * // <tr><td>Survey 1</td></tr>
	 * // <tr><td>Survey 2</td></tr>
	 * // <tr><td>Survey 3</td></tr>
	 * // Returns: 3
	 */
	async getTotalSurveysInCollaboratorView() {
		const elements = await PwActions.getWebElementsPage(
			this.page,
			this.surveyListTableRows,
		);
		return elements.length;
	}

	/**
	 * Clicks on a survey in the collaborator view.
	 * @param {string} surveyName - The name of the survey to click on.
	 * @returns {Promise<void>}
	 * @example
	 * await clickOnSurvey("Employee Engagement Survey");
	 * // Steps performed:
	 * // 1. Finds the survey name in the collaborator view.
	 * // 2. Clicks on the survey name.
	 */
	async clickOnSurvey(surveyName) {
		const surveyLocator = this.surveyNameFrCollaborator(surveyName);
		await PwActions.doubleClick(this.page, surveyLocator);
	}

	/**
	 * Retrieves the text content of all menu items available for a specific survey by clicking on its actions button.
	 * @param {object} page - The Playwright page instance.
	 * @param {string} surveyName - The name of the survey to get the options for.
	 * @returns {Promise<string[]>} An array containing the text of all available menu items for the survey.
	 * @example
	 * const options = await surveyCollaboratorPage.getSurveyOptionsText(page, "Employee Satisfaction Survey");
	 * // Returns: ["Edit survey","view reports"]
	 * // This will:
	 * // 1. Hover over the survey name
	 * // 2. Click on the survey actions button
	 * // 3. Get all menu items and extract their text content
	 */

	async getSurveyOptionsText(surveyName) {
		await PwActions.hover(this.page, `//p[text()='${surveyName}']`);
		const surveyActionsButton = this.btnSurveyActions(surveyName);

		await PwActions.click(this.page, surveyActionsButton);

		const menuItemsElements = await PwActions.getWebElements(
			this.page,
			this.getAllMenuItems,
		);
		const menuItemsText = await PwActions.getElementsText(
			this.page,
			menuItemsElements,
		);
		return menuItemsText;
	}

	/**
	 * Checks if template cards are not present in the collaborator view by verifying the visibility of template card elements.
	 * @param {object} page - The Playwright page instance.
	 * @returns {Promise<boolean>} Returns true if template cards are NOT present, false if they are visible.
	 * @example
	 * const isTemplateCardNotPresent = await surveyCollaboratorPage.isTemplateCardNotPresent(page);
	 * // Returns: true (if template cards are not visible)
	 * // Returns: false (if template cards are visible)
	 * // This is useful for verifying that collaborator view doesn't show template cards
	 */

	async isTemplateCardNotPresent() {
		const elementExists = await PwActions.elementIsVisible(
			this.page,
			this.templateCardLocator,
		);
		return !elementExists;
	}

	/**
	 * Opens a survey directly by navigating to its URL based on survey type and ID
	 * @param {string} surveyType - The type of survey ('engage' or 'performance')
	 * @param {string|number} surveyId - The ID of the survey to open
	 * @returns {Promise<void>}
	 * @example
	 * // Open an engage survey
	 * await surveyPage.openSurveyByUrl({ surveyType: "engage", surveyId: "73042" });
	 *
	 * // Open a performance survey
	 * await surveyPage.openSurveyByUrl({ surveyType: "performance", surveyId: "46784" });
	 */
	async openSurveyByUrl({ page = this.page, surveyType, surveyId }) {
		const currentUrl = await PwActions.getCurrentUrl(page);
		const baseUrl = new URL(currentUrl).origin;
		let surveyUrl;

		switch (surveyType.toLowerCase()) {
			case "engage":
			case "pulse":
				surveyUrl = `${baseUrl}/engage/survey/${surveyId}/overview`;
				break;
			case "performance":
			case "360":
				surveyUrl = `${baseUrl}/configure/perform/${surveyId}/reports/overview?tab=overview`;
				break;
			default:
				throw new Error(
					`Invalid survey type: ${surveyType}. Must be 'engage', 'pulse', 'performance', or '360'`,
				);
		}

		await PwActions.goTo(page, surveyUrl);
		await PwActions.waitForCompletePageLoad(page, 15000);
		await CommonUtils.sleep(30);
		await PwActions.pageRefresh(page);
		await PwActions.waitForCompletePageLoad(page, 35000);
		if (await PwActions.elementIsVisible(page, this.btnViewMore)) {
			await PwActions.click(page, this.btnViewMore);
		}
	}
}

export { SurveyPage };

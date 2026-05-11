import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants";
import { envDetails } from "../../../Data/test-data";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
import { EntityIds } from "../../../Shared_Functions/entityId";
import { LoginPage } from "../../login-page";
import { SurveyPage } from "../../Surveys/Survey_Listing_Page/survey-page";

/**
 * EngageManagerView class handles the navigation and interaction with the Engage Manager interface
 * This class provides functionality to:
 * - Navigate to different sections of the Engage Manager view
 * - Access various tabs (Overview, Heatmap, Questions, eNPS, Responses)
 * - Login and access specific survey reports
 */
class EngageManagerView {
	/**
	 * Constructor for EngageManagerView
	 * Initializes page elements and utility classes
	 * @param {Page} page - Playwright page object
	 */
	constructor(page) {
		this.page = page;
		this.loginpage = new LoginPage(this.page);
		this.commonfuntion = new CommonPageFunctions(this.page);

		// XPath selectors for navigation tabs
		this.engageTab = "//a[text()='Engage']";
		this.txtOverviewTab =
			"//div[@data-state='open']//p[normalize-space(text())='Overview']";
		this.txtHeatmapTab =
			"//div[@data-state='open']//p[normalize-space(text())='Heatmap']";
		this.txtQuestionsTab =
			"//div[@data-state='open']//p[normalize-space(text())='Questions']";
		this.txtENPSTab =
			"//div[@data-state='open']//p[normalize-space(text())='eNPS']";
		this.txtResponsesTab =
			"//div[@data-state='open']//p[normalize-space(text())='Responses']";
		this.txtSurveysListTab = "//aside//p[text()='Reports']";

		// Dynamic selector for survey name
		this.txtSurveyName = (surveyName) =>
			`(//p[normalize-space(text())='${surveyName}'])[1]`;
	}

	/**
	 * Logs in to the manager view and navigates to a specific survey's reports
	 * @param {string} surveyName - Name of the survey to access
	 * @param {string|number} [surveyId] - Optional survey ID to navigate directly via URL
	 * @returns {Promise<void>}
	 */
	async loginToManagerViewToSurveyReports(surveyName, surveyId = null) {
		await this.loginpage.login(
			this.page,
			constants.manager_evaluator_email,
			envDetails.password,
		);
		await this.commonfuntion.navigateTopNavigateSection("Engage");
		await PwActions.waitForDOMContentLoaded(this.page);
		await CommonUtils.sleep(50);
		await PwActions.waitForElementVisibility(this.page, this.txtSurveysListTab);
		if (surveyId) {
			const surveyPage = new SurveyPage(this.page);
			await surveyPage.openSurveyByUrl({ surveyType: "engage", surveyId });
		} else {
			await PwActions.forceClick(this.page, this.txtSurveyName(surveyName));
			await PwActions.pageRefresh(this.page);
		}
		await CommonUtils.sleep(60);
	}
}

export { EngageManagerView };

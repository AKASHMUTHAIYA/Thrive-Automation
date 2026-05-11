import { test } from "../../Fixtures/application-setup";
import PwActions from "playwright-framework/Core/pw-actions.js";

class EngagementSurveyPage {
	constructor(page) {
		this.page = page;
		this.lnkEngage = 'a[role="link"]:text("Engage")';
		this.btnCreateNew = 'button:text("Create new")';
		this.btnEngagementSurvey = 'p:text("Engagement Survey")';
		this.txtSurveyName = '[data-testid="input"]';
		this.btnCreateSurvey = 'button:text("Create Survey")';
	}

	/**
	 * Navigates to the Engage section
	 */
	async navigateToEngage() {
		await PwActions.click(this.page, this.lnkEngage);
	}

	/**
	 * Creates a new engagement survey with the given name
	 * @param {string} surveyName - Name of the survey to create
	 */
	async createSurvey(surveyName) {
		await PwActions.click(this.page, this.btnCreateNew);
		await PwActions.click(this.page, this.btnEngagementSurvey);
		await PwActions.click(this.page, this.txtSurveyName);
		await PwActions.fill(this.page, this.txtSurveyName, surveyName);
		await PwActions.click(this.page, this.btnCreateSurvey);
	}
}

test("Unit_Test1 @test", async ({ thrivePage, browser }) => {
	const engagementSurveyPage = new EngagementSurveyPage(thrivePage);
	await engagementSurveyPage.navigateToEngage();
	await engagementSurveyPage.createSurvey("Test Survey12345");
});

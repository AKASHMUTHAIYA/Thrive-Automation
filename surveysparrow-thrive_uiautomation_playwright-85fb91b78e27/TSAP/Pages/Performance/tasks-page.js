import PwActions from "playwright-framework/Core/pw-actions.js";
import { envDetails } from "../../Data/test-data.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions.js";
import { EntityIds } from "../../Shared_Functions/entityId.js";

export class TasksPage {
	constructor(page) {
		this.page = page;
		this.drpdwnSelectSurvey =
			"//div[@aria-label='Performance sections']//div[contains(@class,'twigs-select__dropdown-indicator')]";
		this.page = page;
		this.drpdwnSelectSurvey =
			"//div[@aria-label='Performance sections']//div[contains(@class,'twigs-select__dropdown-indicator')]";
	}

	async selectSurvey(surveyName) {
		const survey = `//div[contains(@class,'twigs-select__menu-list css-qr46ko')]//div[text()='${surveyName}']`;
		await PwActions.click(this.page, this.drpdwnSelectSurvey);
		await PwActions.click(this.page, survey);
	}
	async selectSurvey(surveyName) {
		const survey = `//div[contains(@class,'twigs-select__menu-list css-qr46ko')]//div[text()='${surveyName}']`;
		await PwActions.click(this.page, this.drpdwnSelectSurvey);
		await PwActions.click(this.page, survey);
	}

	async evaluateSubject(subjectName) {
		const evaluate = `//span[text()='${subjectName}']/ancestor::div[@class='twigs-c-PJLV twigs-c-PJLV-ibustvE-css']//span[text()='Evaluate']`;
		await PwActions.click(this.page, evaluate);
	}
}

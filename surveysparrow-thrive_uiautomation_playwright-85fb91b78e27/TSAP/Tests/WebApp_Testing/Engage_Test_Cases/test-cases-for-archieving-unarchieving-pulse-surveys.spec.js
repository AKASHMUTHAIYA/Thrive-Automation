import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import {
	generateRandomEvaluatorRole,
	generateRandomTemplate,
} from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EUI } from "../../../Pages/Surveys/Attend_Survey/attend-survey-EUI-page.js";

test.describe("Archieving and unarchieving pulse Surveys", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let surveyBuildEditPage;
	let commonutils;
	let time;
	let SurveyEuiPage;
	let configurePage;
	let cookieValue;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		SurveyEuiPage = new EUI(thrivePage);
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		surveyPage = poManager.getSurveyPage();
		configurePage = poManager.getEngageConfigurePage();
		time = commonutils.getCurrentTime();
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
		await allure.step("Creating a Pulse survey", async () => {
			await surveyPage.createNewSurvey(`Automation Pulse Survey${time}`);
		});
	});
	test("TC_01_Create a new pulse survey and archieving/unarchieving pulse Surveys @Regression", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("Archive the survey", async () => {
			await surveyPage.archiveSurvey(surveyPage.survey_name);
		});
		await allure.step("Unarchive the survey", async () => {
			await surveyPage.unarchiveSurvey(surveyPage.survey_name);
		});
		await allure.step("Verify the survey in surveys page", async () => {
			await surveyPage.verifySurveyIsVisible(surveyPage.survey_name);
		});
	});
});

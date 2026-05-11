import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import {
	generateRandomEvaluatorRole,
	generateRandomQuestionType,
	generateRandomTemplate,
} from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EUI } from "../../../Pages/Surveys/Attend_Survey/attend-survey-EUI-page.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";

test.describe("Share engage survey", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let commonutils;
	let time;
	let SurveyEuiPage;
	let surveyBuildEditPage;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		SurveyEuiPage = new EUI(thrivePage);
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		surveyPage = poManager.getSurveyPage();
		time = commonutils.getCurrentTime();

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test("TC_01_Create Engagement survey and rename the survey name @Regression", async ({
		thrivePage,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

		await allure.description(
			"This test Create Anonymous Engagement survey manually with Email Share",
		);
		const poManager = new POManager(thrivePage);
		const commonFunctions = poManager.getCommonPageFunctions();
		const surveyPage = poManager.getSurveyPage();

		await allure.step("Creating a Engage survey", async () => {
			await surveyPage.createNewSurvey(`Automation Engage Survey${time}`);
		});

		await allure.step(
			"Add sections and questions in the Engage survey",
			async () => {
				await surveyBuildEditPage.addSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				const question = generateRandomQuestionType();
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: question,
					questionName: question,
				});
			},
		);

		await allure.step("Rename the engage survey", async () => {
			const newSurveyName = CommonUtils.generateRandomText(8);
			await surveyBuildEditPage.renameSurvey(newSurveyName);
			await surveyPage.navigateToSurveyHomePage();
			await surveyPage.verifySurveyIsVisible(newSurveyName);
		});
	});

	test("TC_02_Create Pulse survey and rename the survey name @Regression", async ({
		thrivePage,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

		await allure.description(
			"This test Create Anonymous Pulse survey manually with Email Share",
		);
		const poManager = new POManager(thrivePage);
		const commonFunctions = poManager.getCommonPageFunctions();
		const surveyPage = poManager.getSurveyPage();

		await allure.step("Creating a Pulse survey", async () => {
			await surveyPage.createNewSurvey(`Automation Pulse Survey${time}`);
		});

		await allure.step(
			"Add sections and questions in the Pulse survey",
			async () => {
				await surveyBuildEditPage.addSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				const question = generateRandomQuestionType();
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: question,
					questionName: question,
				});
			},
		);

		await allure.step("Rename the Pulse survey", async () => {
			const newSurveyName = CommonUtils.generateRandomText(8);
			await surveyBuildEditPage.renameSurvey(newSurveyName);
			await surveyPage.navigateToSurveyHomePage();
			await surveyPage.verifySurveyIsVisible(newSurveyName);
		});
	});
});

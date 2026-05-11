import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { generateRandomQuestionType } from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

test.describe("Pause pulse survey", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let surveyLaunch;
	let surveyBuilderPage;
	let engageConfigurePage;
	let engageDistributionPage;
	let commonutils;
	let time;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuilderPage = poManager.getSurveyBuilderPage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		surveyPage = poManager.getSurveyPage();
		time = commonutils.getCurrentTime();

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test.afterEach(async ({ thrivePage }) => {
		await allure.step("Pause the pulse survey after test", async () => {
			await PwActions.pageRefresh(thrivePage);
			await engageConfigurePage.pausePulseSurvey();
		});
	});

	test("TC_01_Create and pause a Pulse survey @Regression", async ({
		thrivePage,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

		await allure.description(
			"This test creates a Pulse survey, launches it, and then pauses the survey after it becomes live",
		);

		await allure.step("Creating a Pulse survey", async () => {
			await surveyPage.createNewSurvey(`Automation Pulse Survey ${time}`);
		});

		await allure.step(
			"Add section and question in the Pulse survey",
			async () => {
				await surveyBuilderPage.addSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				const question = generateRandomQuestionType();
				await surveyBuilderPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: question,
					questionName: question,
				});
			},
		);

		await allure.step("Set frequency in configure page", async () => {
			await surveyPage.navigateTopSections("Configure");
			await engageConfigurePage.setFrequencyForMonths(time);
		});

		await allure.step("Add participant in Distribution", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch the pulse survey", async () => {
			await surveyLaunch.launchPulseSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(130);
		});
	});
});

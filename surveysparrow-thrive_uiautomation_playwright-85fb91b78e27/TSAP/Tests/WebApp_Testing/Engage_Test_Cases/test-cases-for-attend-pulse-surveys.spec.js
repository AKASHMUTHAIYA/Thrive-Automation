import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { sharedData } from "../../../Data/Resources/shared-data.js";
import {
	generateRandomEvaluatorRole,
	generateRandomQuestionType,
	generateRandomTemplate,
} from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import { envDetails } from "../../../Data/test-data.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

test.describe("Attend pulse survey", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let engageDistributionPage;
	let EngageSurveyConfigure;
	let surveyBuildEditPage;
	let commonutils;
	let time;
	let surveyEUIPage;
	let newSectionToAdd;
	let newsectionDescriptionToAdd;
	let readEmail;
	let participantsDistributionPage;
	let surveyLaunchPage;

	let cookieValue;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyEUIPage = poManager.getSurveyEUIPage();
		readEmail = new ReadEmail();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		surveyPage = poManager.getSurveyPage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		participantsDistributionPage = poManager.getParticipantsDistributionPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		time = commonutils.getCurrentTime();
		newSectionToAdd = CommonUtils.generateRandomText(5);
		newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		cookieValue = "";

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test("TC_01_Creating Non-anonymous Pulse survey manually with Email Share @Regression ", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		await allure.description(
			"This test Create Non-anonymous Pulse survey manually with Email Share",
		);
		const poManager = new POManager(thrivePage);
		const commonFunctions = poManager.getCommonPageFunctions();
		const surveyPage = poManager.getSurveyPage();
		await allure.step("Creating a Pulse survey", async () => {
			await surveyPage.createNewSurvey(`Automation Pulse Survey${time}`);
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step(
			"Add sections and questions in the Pulse survey",
			async () => {
				await surveyBuildEditPage.addSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				for (const questionType of sharedData.EngageQuestions) {
					await surveyBuildEditPage.addQuestionInSection({
						sectionName: newSectionToAdd,
						questionType: questionType,
						questionName: questionType,
					});
				}
			},
		);
		await allure.step("Enable non-anonymous toggle in configure", async () => {
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.nonAnonymousSurvey();
			time = commonutils.getCurrentTime();
			await EngageSurveyConfigure.setFrequencyForMonths(time);
		});
		await allure.step("Share the Pulse survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});
		await allure.step("Launch the survey", async () => {
			await surveyLaunchPage.launchPulseSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(180);
		});
		await allure.step("Verify the survey is launched", async () => {
			const survey_url = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getPulseEmailBody(
					constants.engageParticipant1,
					EntityIds.surveyName,
				),
			);
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url,
				browser,
			});
		});
	});
});

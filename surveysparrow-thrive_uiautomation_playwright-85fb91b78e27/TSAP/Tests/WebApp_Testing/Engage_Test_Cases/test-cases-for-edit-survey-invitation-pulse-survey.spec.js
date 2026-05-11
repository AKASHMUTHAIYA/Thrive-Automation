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
import { EUI } from "../../../Pages/Surveys/Attend_Survey/attend-survey-EUI-page.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

test.describe("Attend pulse survey", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let SurveySharePage;
	let surveyParticipantsPage;
	let surveyBuildEditPage;
	let EngageSurveyConfigure;
	let engageDistributionPagePage;
	let surveyLaunch;
	let commonutils;
	let time;
	let surveyEUIPage;
	let cookieValue;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyEUIPage = poManager.getSurveyEUIPage();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		surveyPage = poManager.getSurveyPage();
		surveyParticipantsPage = poManager.getParticipantsDistributionPage();
		SurveySharePage = poManager.getEngageDistributionPage();
		engageDistributionPagePage = poManager.getEngageDistributionPage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		time = commonutils.getCurrentTime();
		cookieValue = "";

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test.afterEach(async ({ thrivePage }) => {
		await allure.step("Pause the pulse survey after test", async () => {
			await PwActions.pageRefresh(thrivePage);
			await EngageSurveyConfigure.pausePulseSurvey();
		});
	});

	test("TC_01_Editing the Survey Invitation Email Template in Pulse Survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		await allure.description(
			"This test is to Edit the Survey Invitation Email Template in Pulse survey",
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
				const question = generateRandomQuestionType();
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: question,
					questionName: question,
				});
			},
		);
		await allure.step("Edit the Survey Invitation Email Template", async () => {
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.editSurveyInvitationEmail();
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.setFrequencyForMonths(time);
		});
		await allure.step("Share the Pulse survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});
		await allure.step("Launch the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(180);
		});
		await allure.step("Verify the survey is launched", async () => {
			const survey_url = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject_edited,
				constants.new_employee_email,
				constants.getPulseEmailBodyEdited(
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

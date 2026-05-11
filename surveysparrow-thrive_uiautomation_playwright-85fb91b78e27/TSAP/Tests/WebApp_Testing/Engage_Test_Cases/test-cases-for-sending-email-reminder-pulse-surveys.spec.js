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
	let engageDistributionPagePage;
	let surveyParticipantsPage;
	let surveyBuildEditPage;
	let surveyLaunch;
	let EngageSurveyConfigure;
	let commonutils;
	let time;
	let surveyEUIPage;
	let cookieValue;
	let surveyLaunchPage;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyEUIPage = poManager.getSurveyEUIPage();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		surveyPage = poManager.getSurveyPage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyParticipantsPage = poManager.getParticipantsDistributionPage();
		engageDistributionPagePage = poManager.getEngageDistributionPage();
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

	test("TC_01_Creating Non-anonymous Pulse survey manually with Email Share @Regression", async ({
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
				const question = generateRandomQuestionType();
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: question,
					questionName: question,
				});
			},
		);
		await allure.step("Enable non-anonymous toggle in configure", async () => {
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
			await CommonUtils.sleep(180); // For the pulse survey, reminder email will be enabled after the normal email are send. We are scheduling the pulse survey emails 1 or 2 mins after the current time. So we need to wait atleast 3 mins for the reminder email to be enabled. Due to which we have added the 3 mins wait
		});

		await allure.step("Send Reminder", async () => {
			await engageDistributionPagePage.SendReminder();
		});

		await allure.step("Verify the survey is launched", async () => {
			const survey_url = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_reminder_subject,
				constants.new_employee_email,
				constants.getPulseEmailReminderBody(
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

	test("TC_02_Editing Pulse Scheduling Email reminder template for Pulse survey and attend the survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		await allure.description(
			"This test Editing Pulse Scheduling Email reminder template for Pulse survey",
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
			await EngageSurveyConfigure.editSurveyReminderEmail();
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
			await surveyLaunchPage.launchPulseSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(180); // For the pulse survey, reminder email will be enabled after the normal email are send. We are scheduling the pulse survey emails 1 or 2 mins after the current time. So we need to wait atleast 3 mins for the reminder email to be enabled. Due to which we have added the 3 mins wait
		});

		await allure.step("Send Reminder", async () => {
			await engageDistributionPagePage.SendReminder();
		});

		await allure.step("Verify the survey is launched", async () => {
			const survey_url = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject_edited,
				constants.new_employee_email,
				constants.getPulseEmailReminderBodyEdited(
					constants.engageSubjectName,
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

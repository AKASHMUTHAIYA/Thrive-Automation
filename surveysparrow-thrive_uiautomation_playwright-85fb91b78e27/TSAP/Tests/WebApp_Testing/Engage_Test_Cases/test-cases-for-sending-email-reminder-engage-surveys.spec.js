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

test.describe("Attend engage survey", () => {
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
	let SurveySharePage;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyEUIPage = poManager.getSurveyEUIPage();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		surveyPage = poManager.getSurveyPage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		surveyParticipantsPage = poManager.getParticipantsDistributionPage();
		engageDistributionPagePage = poManager.getEngageDistributionPage();
		SurveySharePage = poManager.getEngageDistributionPage();
		time = commonutils.getCurrentTime();
		cookieValue = "";

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test("TC_01_Scheduling Email reminder for Engagement survey and attend the survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

		await allure.description(
			"This test Scheduling Email reminder for Engagement survey",
		);
		const poManager = new POManager(thrivePage);
		const commonFunctions = poManager.getCommonPageFunctions();
		const surveyPage = poManager.getSurveyPage();

		await allure.step("Creating a Engage survey", async () => {
			await surveyPage.createNewSurvey(`Automation Engage Survey${time}`);
			cookieValue = await thrivePage.context().cookies();
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

		await allure.step("Share the Engage survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Send Reminder", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await engageDistributionPagePage.SendReminder();
		});

		await allure.step(
			"Verify the survey is received and attend the survey",
			async () => {
				const survey_url =
					await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						constants.new_employee_email,
						constants.getEngageEmailReminderBody(
							constants.engageParticipant1,
							EntityIds.surveyName,
						),
					);
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url,
				browser,
			});
			},
		);
	});

	test("TC_02_Editing Engage Scheduling Email reminder template for Engagement survey and attend the survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

		await allure.description(
			"This test Editing Engage Scheduling Email reminder template for Engagement survey",
		);
		const poManager = new POManager(thrivePage);
		const commonFunctions = poManager.getCommonPageFunctions();
		const surveyPage = poManager.getSurveyPage();

		await allure.step("Creating a Engage survey", async () => {
			await surveyPage.createNewSurvey(`Automation Engage Survey${time}`);
			cookieValue = await thrivePage.context().cookies();
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

		await allure.step("Edit the Survey Invitation Email Template", async () => {
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.editSurveyReminderEmail();
		});

		await allure.step("Share the Engage survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Send Reminder", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await engageDistributionPagePage.SendReminder();
		});

		await allure.step(
			"Verify the survey is received and attend the survey",
			async () => {
				const survey_url =
					await commonFunctions.open_survey_from_received_email(
						constants.engage_email_subject_edited,
						constants.new_employee_email,
						constants.getEngageEmailReminderBodyEdited(
							constants.engageSubjectName,
							EntityIds.surveyName,
						),
					);
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url,
				browser,
			});
			},
		);
	});
});

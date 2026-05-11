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
	let surveyLaunch;
	let surveyBuildEditPage;
	let surveyEUIPage;
	let EngageSurveyConfigure;
	let commonutils;
	let time;
	let cookieValue;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		surveyEUIPage = poManager.getSurveyEUIPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		surveyPage = poManager.getSurveyPage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		engageDistributionPagePage = poManager.getEngageDistributionPage();
		time = commonutils.getCurrentTime();
		cookieValue = "";

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test("TC_01_Editing the Survey Invitation Email Template in Engagement Survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

		await allure.description(
			"This test is to Edit the Survey Invitation Email Template in Engagement Survey",
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
			await EngageSurveyConfigure.editSurveyInvitationEmail();
		});

		await allure.step("Share the Engage survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
		});

		await allure.step(
			"Verify the survey is launched and attend the survey",
			async () => {
				const survey_url =
					await commonFunctions.open_survey_from_received_email(
						constants.engage_email_subject_edited,
						constants.new_employee_email,
						constants.getEngageEmailBodyEdited(
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
});

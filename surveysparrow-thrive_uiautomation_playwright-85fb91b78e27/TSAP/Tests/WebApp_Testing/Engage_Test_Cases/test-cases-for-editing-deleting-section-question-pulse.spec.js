import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import {
	generateRandomEvaluatorRole,
	generateRandomQuestionType,
	generateRandomQuestionTypeEngage,
	generateRandomTemplate,
} from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EUI } from "../../../Pages/Surveys/Attend_Survey/attend-survey-EUI-page.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

test.describe("Share pulse survey", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let engageDistributionPage;
	let surveyLaunchPage;
	let surveyBuildEditPage;
	let engageSurveyConfigure;
	let commonutils;
	let time;
	let surveyEuiPage;
	let cookieValue;
	let editQuestion;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyEuiPage = new EUI(thrivePage);
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		engageSurveyConfigure = poManager.getEngageConfigurePage();
		surveyPage = poManager.getSurveyPage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		time = commonutils.getCurrentTime();
		cookieValue = "";

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test("TC_01_Editing and deleting sections in Pulse survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const editSectionTitle = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

		await allure.description(
			"This test Edit and delete sections in Pulse survey",
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
				await CommonUtils.sleep(2);
				await surveyBuildEditPage.verifyAddedSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				await surveyBuildEditPage.verifyAddedQuestion({ question });
			},
		);

		await allure.step(
			"edit sections and questions in the Pulse survey",
			async () => {
				await surveyBuildEditPage.editSectionEngage(
					editSectionTitle,
					newsectionDescriptionToAdd,
				);
				editQuestion = generateRandomQuestionTypeEngage();
				await surveyBuildEditPage.editQuestionInSection(
					editSectionTitle,
					editQuestion,
				);
				await CommonUtils.sleep(2);
				await surveyBuildEditPage.verifyAddedSection(
					editSectionTitle,
					newsectionDescriptionToAdd,
				);
				await surveyBuildEditPage.verifyAddedQuestion({
					question: editQuestion,
				});
			},
		);

		await allure.step("Set frequency in configure page", async () => {
			await surveyPage.navigateTopSections("Configure");
			time = commonutils.getCurrentTime();
			await engageSurveyConfigure.setFrequencyForMonths(time);
		});

		await allure.step("Share the Pulse survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch the survey", async () => {
			await surveyLaunchPage.launchSurvey();
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

			await surveyEuiPage.attendEngagePulseSurvey({
				survey_url: survey_url,
				browser: browser,
			});
		});

		await allure.step(
			"delete sections and questions in the Pulse survey",
			async () => {
				await surveyPage.navigateTopSections("Create");
				await PwActions.waitForNetworkIdle(thrivePage, 20000);
				await surveyBuildEditPage.confirmNavigation();
				await surveyBuildEditPage.deleteQuestionInSection(editQuestion);
				await surveyBuildEditPage.deleteFirstSection();
				await surveyBuildEditPage.verifyFirstSectionDeletion();
			},
		);
	});
});

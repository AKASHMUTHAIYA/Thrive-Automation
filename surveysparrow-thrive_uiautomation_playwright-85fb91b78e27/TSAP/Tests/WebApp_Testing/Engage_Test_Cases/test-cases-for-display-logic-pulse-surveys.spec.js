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
	let sectionNames;
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
		newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		cookieValue = "";
		sectionNames = [];

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

	test("TC_01_Creating Non-anonymous Pulse survey manually with Email Share and verify that section display logic is working @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		await allure.description(
			"This test Create Non-anonymous Pulse survey manually with Email Share and verify that section display logic is working",
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
				for (let i = 0; i < 2; i++) {
					newSectionToAdd = CommonUtils.generateRandomText(5);
					await surveyBuildEditPage.addSection(newSectionToAdd);
					await surveyBuildEditPage.addQuestionInSection({
						sectionName: newSectionToAdd,
						questionType: "Rating Scale",
						questionName: "Rating Scale",
					});
					sectionNames.push(newSectionToAdd);
				}
			},
		);

		await allure.description(
			"This test Create Anonymous Engagement survey manually with Email Share",
		);

		await allure.step("Add display logic in the survey", async () => {
			await surveyBuildEditPage.addDisplayLogicInSections(sectionNames);
		});

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
				subjectName: constants.subjectName,
				settings: ["Display Logic"],
			});
		});
	});

	test("TC_02_Creating Non-anonymous Pulse survey manually with Email Share and verify that question display logic is working @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		await allure.description(
			"This test Create Non-anonymous Pulse survey manually with Email Share and verify that question display logic is working",
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
				for (let i = 0; i < 2; i++) {
					newSectionToAdd = CommonUtils.generateRandomText(5);
					await surveyBuildEditPage.addSection(newSectionToAdd);
					await surveyBuildEditPage.addQuestionInSection({
						sectionName: newSectionToAdd,
						questionType: "Rating Scale",
						questionName: "Rating Scale",
					});
					sectionNames.push(newSectionToAdd);
				}
			},
		);

		await allure.description(
			"This test Create Anonymous Engagement survey manually with Email Share",
		);

		await allure.step("Add display logic in the survey", async () => {
			await surveyBuildEditPage.addDisplayLogicInQuestions("Rating Scale");
		});

		await allure.step("Enable non-anonymous toggle in configure", async () => {
			time = commonutils.getCurrentTime();
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.nonAnonymousSurvey();
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
				subjectName: constants.subjectName,
				settings: ["Display Logic"],
			});
		});
	});
});

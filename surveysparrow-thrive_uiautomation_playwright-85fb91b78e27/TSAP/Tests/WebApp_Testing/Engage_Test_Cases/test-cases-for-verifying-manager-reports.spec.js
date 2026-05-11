import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants";
import { sharedData } from "../../../Data/Resources/shared-data.js";
import { envDetails } from "../../../Data/test-data";
import { test } from "../../../Fixtures/application-setup";
import { EUI } from "../../../Pages/Surveys/Attend_Survey/attend-survey-EUI-page.js";
import { POManager } from "../../../Pages/POManager";
import { SurveyLaunchPage } from "../../../Pages/Surveys/Launch/survey-launch-page";
import { LoginPage } from "../../../Pages/login-page.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";

test.describe("Manager Reports", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let surveyBuilderPage;
	let engageDistributionPage;
	let commonUtils;
	let time;
	let cookieValue;
	let surveyLaunch;
	let surveyEUIpage;
	let survey_url;
	let browser;
	let EngageSurveyConfigure;
	let readEmail;
	let loginPage;
	let engageManagerView;
	let generateRandomText;
	let engageManagerOverviewPage;
	let engageManagerENPSPage;
	let heatmapPageEngagePulse;
	let questionsEngagePulseManagerPage;
	let engagePulseManagerResponsesPage;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		loginPage = new LoginPage(thrivePage);
		generateRandomText = CommonUtils.generateRandomText(5);
		engageManagerView = poManager.getEngageManagerView();
		engageManagerOverviewPage = poManager.getEngageManagerOverviewPage();
		engageManagerENPSPage = poManager.getEngagePulseManagerENPSPage();
		heatmapPageEngagePulse = poManager.getEngageManagerHeatmapPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		questionsEngagePulseManagerPage = poManager.getEngageManagerQuestionsPage();
		engagePulseManagerResponsesPage = poManager.getEngageManagerResponsesPage();
		readEmail = new ReadEmail();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyPage = poManager.getSurveyPage();
		surveyBuilderPage = poManager.getSurveyBuilderPage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		commonUtils = new CommonUtils();
		time = commonUtils.getCurrentTime();
		surveyLaunch = poManager.getSurveyLaunchPage();
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		surveyEUIpage = poManager.getSurveyEUIPage();

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});

		await allure.step("Creating a Engage survey", async () => {
			await surveyPage.createNewSurvey(`Manager Engage${generateRandomText}`);
			cookieValue = await thrivePage.context().cookies();
		});

		await allure.step(
			"Add sections and questions in the Engage survey",
			async () => {
				await surveyBuilderPage.addSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				for (const questionType of sharedData.EngageQuestions) {
					await surveyBuilderPage.addQuestionInSection({
						sectionName: newSectionToAdd,
						questionType: questionType,
					});
				}
				await surveyBuilderPage.addSameTypeQuestion(
					newSectionToAdd,
					"Rating Scale",
					2,
				);
				await surveyBuilderPage.changeRatingScaleByType(
					"engage",
					null,
					null,
					"all",
				);
			},
		);
	});

	test(" TC_01_Verifying manager reports for Anonymous Engage survey @Regression @report @productionSanity @manager @engagereport", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("Share the Engage survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.manager_department,
			);
		});

		await allure.step("Launch the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
		});
		await allure.step(
			"Verify the survey is launched and attend the survey",
			async () => {
				const survey_url = await readEmail.fetch_survey_url_from_email({
					to: constants.subject_email,
					subject: constants.engage_email_subject,
					body: constants.getEngageEmailBody(
						constants.subjectName,
						EntityIds.getsurveyName(),
					),
				});

				await surveyEUIpage.attendEngagePulseSurvey({
					survey_url,
					browser,
					subjectName: constants.subjectName,
				});

				const survey_url2 = await readEmail.fetch_survey_url_from_email({
					to: constants.subject_email2,
					subject: constants.engage_email_subject,
					body: constants.getEngageEmailBody(
						constants.subjectName2,
						EntityIds.getsurveyName(),
					),
				});

				await surveyEUIpage.attendEngagePulseSurvey({
					survey_url: survey_url2,
					browser,
					subjectName: constants.subjectName2,
				});
				const survey_url3 = await readEmail.fetch_survey_url_from_email({
					to: constants.subjectEmail3,
					subject: constants.engage_email_subject,
					body: constants.getEngageEmailBody(
						constants.subjectName3,
						EntityIds.getsurveyName(),
					),
				});

				await surveyEUIpage.attendEngagePulseSurvey({
					survey_url: survey_url3,
					browser,
					subjectName: constants.subjectName3,
				});

				const survey_url4 = await readEmail.fetch_survey_url_from_email({
					to: constants.subjectEmail4,
					subject: constants.engage_email_subject,
					body: constants.getEngageEmailBody(
						constants.subjectName4,
						EntityIds.getsurveyName(),
					),
				});

				await surveyEUIpage.attendEngagePulseSurvey({
					survey_url: survey_url4,
					browser,
					subjectName: constants.subjectName4,
				});
				await loginPage.navigateToHomepageAndSignout();
			},
		);

		await allure.step("Navigate to Manager Reports", async () => {
			await engageManagerView.loginToManagerViewToSurveyReports(
				EntityIds.getsurveyName(),
			);
			await allure.step(
				"Verify overview, heatmap,enps,responses in reports",
				async () => {
					await engageManagerOverviewPage.verifyManagerOverviewPage();
					await PwActions.click(thrivePage, engageManagerView.txtHeatmapTab);
					await heatmapPageEngagePulse.verifyOverallFavourabilityEngagePulseHeatmap();
					await PwActions.click(thrivePage, engageManagerView.txtENPSTab);
					await engageManagerENPSPage.verifyENPSScore();
					await PwActions.click(thrivePage, engageManagerView.txtQuestionsTab);
					await questionsEngagePulseManagerPage.verifyEachQuestionTypeResponses();
					await PwActions.click(thrivePage, engageManagerView.txtResponsesTab);
					await engagePulseManagerResponsesPage.verifyAllQuestionResponses();
					await engagePulseManagerResponsesPage.verifyIndividualSubjectReports(
						true,
					);
				},
			);
		});
	});

	test(" TC_02_Verifying manager reports for Non-Anonymous Engage survey @Regression @report @productionSanity @manager @engagereport", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("Enable non-anonymous toggle in configure", async () => {
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.nonAnonymousSurvey();
			await EngageSurveyConfigure.managerAnonymityToggleTurnOn();
		});

		await allure.step("Share the Engage survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.manager_department,
			);
		});

		await allure.step("Launch the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
		});
		await allure.step(
			"Verify the survey is launched and attend the survey",
			async () => {
				const survey_url = await readEmail.fetch_survey_url_from_email({
					to: constants.subject_email,
					subject: constants.engage_email_subject,
					body: constants.getEngageEmailBody(
						constants.subjectName,
						EntityIds.getsurveyName(),
					),
				});

				await surveyEUIpage.attendEngagePulseSurvey({
					survey_url,
					browser,
					subjectName: constants.subjectName,
				});

				const survey_url2 = await readEmail.fetch_survey_url_from_email({
					to: constants.subject_email2,
					subject: constants.engage_email_subject,
					body: constants.getEngageEmailBody(
						constants.subjectName2,
						EntityIds.getsurveyName(),
					),
				});

				await surveyEUIpage.attendEngagePulseSurvey({
					survey_url: survey_url2,
					browser,
					subjectName: constants.subjectName2,
				});
				const survey_url3 = await readEmail.fetch_survey_url_from_email({
					to: constants.subjectEmail3,
					subject: constants.engage_email_subject,
					body: constants.getEngageEmailBody(
						constants.subjectName3,
						EntityIds.getsurveyName(),
					),
				});

				await surveyEUIpage.attendEngagePulseSurvey({
					survey_url: survey_url3,
					browser,
					subjectName: constants.subjectName3,
				});

				const survey_url4 = await readEmail.fetch_survey_url_from_email({
					to: constants.subjectEmail4,
					subject: constants.engage_email_subject,
					body: constants.getEngageEmailBody(
						constants.subjectName4,
						EntityIds.getsurveyName(),
					),
				});

				await surveyEUIpage.attendEngagePulseSurvey({
					survey_url: survey_url4,
					browser,
					subjectName: constants.subjectName4,
				});
				await loginPage.navigateToHomepageAndSignout();
			},
		);

		await allure.step("Navigate to Manager Reports", async () => {
			await engageManagerView.loginToManagerViewToSurveyReports(
				EntityIds.getsurveyName(),
			);
			await allure.step(
				"Verify overview, heatmap,enps,responses in reports",
				async () => {
					await PwActions.click(thrivePage, engageManagerView.txtOverviewTab);
					await CommonUtils.sleep(60);
					await engageManagerOverviewPage.verifyManagerOverviewPage();
					await PwActions.click(thrivePage, engageManagerView.txtHeatmapTab);
					await heatmapPageEngagePulse.verifyOverallFavourabilityEngagePulseHeatmap();
					await PwActions.click(thrivePage, engageManagerView.txtENPSTab);
					await engageManagerENPSPage.verifyENPSScore();
					await PwActions.click(thrivePage, engageManagerView.txtQuestionsTab);
					await questionsEngagePulseManagerPage.verifyEachQuestionTypeResponses();
					await PwActions.click(thrivePage, engageManagerView.txtResponsesTab);
					await engagePulseManagerResponsesPage.verifyAllQuestionResponses();
					await engagePulseManagerResponsesPage.verifyIndividualSubjectReports(
						false,
					);
				},
			);
		});
	});
});

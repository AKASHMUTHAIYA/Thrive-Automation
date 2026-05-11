import { allure } from "allure-playwright";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
test.describe("Engage Text Insights Test Cases", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let surveyLaunchPage;
	let engageDistributionPage;
	let surveyBuildEditPage;
	let engageSurveyConfigure;
	let commonutils;
	let time;
	let surveyEUIPage;
	let cookieValue;
	let engageOverviewPage;
	let participants;
	test.beforeEach(async ({ thrivePage, browser }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyEUIPage = poManager.getSurveyEUIPage();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		engageSurveyConfigure = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyPage = poManager.getSurveyPage();
		time = commonutils.getCurrentTime();
		engageOverviewPage = poManager.getEngageOverviewPage();
		cookieValue = "";

		participants = [
			{
				email: constants.subject_email,
				name: constants.subjectName,
				scenario: "Attend with default answer mixed values",
			},
			{
				email: constants.subject_email2,
				name: constants.subjectName2,
				scenario: "Attend with default answer mixed values",
			},
			{
				email: constants.subjectEmail3,
				name: constants.subjectName3,
				scenario: "Attend with default answer low values",
			},
			{
				email: constants.subjectEmail4,
				name: constants.subjectName4,
				scenario: "Attend with default answer high values",
			},
			{
				email: constants.engageParticipant1Email,
				name: constants.engageParticipant1,
				scenario: "Attend with default answer low values",
			},
			{
				email: constants.engageParticipant2Email,
				name: constants.engageParticipant2,
				scenario: "Attend with default answer high values",
			},
			{
				email: constants.engageParticipant3Email,
				name: constants.engageParticipant3,
				scenario:
					"Attend with default answer high values with mix of N/A and 0",
			},
			{
				email: constants.engageParticipant4Email,
				name: constants.engageParticipant4,
				scenario:
					"Attend with default answer high values with mix of N/A and 0",
			},
		];
	});
	test("TC_01_User creates non-anonymous engage survey and adds participants and attends survey @non-anonymous @textinsights @reports @regression @engage", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("User creates engage survey", async () => {
			await surveyPage.createNewSurvey(`Engage text Survey ${time}`);
			await surveyBuildEditPage.includeZeroInEnpsQuestion();
			await surveyPage.navigateTopSections("Create");
			await surveyBuildEditPage.addMultipleSectionsAndQuestions(
				2,
				5,
				"Text Input",
			);
			await surveyPage.navigateTopSections("Configure");
			await engageSurveyConfigure.nonAnonymousSurvey();
			await surveyPage.navigateTopSections("Distribution");
		});

		await allure.step("User adds participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
		});

		await allure.step("User launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step("Attend the survey", async () => {
			const surveyURLs = await Promise.all(
				participants.map(async (participant) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.engage_email_subject,
							participant.email,
							constants.getEngageEmailBody(
								participant.name,
								EntityIds.surveyName,
							),
						);
					return { url: surveyURL, ...participant };
				}),
			);
			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}
		});
		await allure.step("navigate to text insights tab", async () => {
			await surveyPage.navigateTopSections("Reports");
			await CommonUtils.sleep(10);
			await commonFunctions.navigateToTabs("Text Insights");
			await engageOverviewPage.generateTextInsights();
		});
	});
	test("TC_02_User creates anonymous engage survey and adds participants and attends survey @anonymous @textinsights @reports @regression @engage", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("User creates engage survey", async () => {
			await surveyPage.createNewSurvey(`Engage text Survey ${time}`);
			await surveyBuildEditPage.includeZeroInEnpsQuestion();
			await surveyPage.navigateTopSections("Create");
			await surveyBuildEditPage.addMultipleSectionsAndQuestions(
				2,
				5,
				"Text Input",
			);
			await surveyPage.navigateTopSections("Configure");
			//await engageSurveyConfigure.anonymousSurvey();
			await surveyPage.navigateTopSections("Distribution");
		});

		await allure.step("User adds participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
		});

		await allure.step("User launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step("Attend the survey", async () => {
			const surveyURLs = await Promise.all(
				participants.map(async (participant) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.engage_email_subject,
							participant.email,
							constants.getEngageEmailBody(
								participant.name,
								EntityIds.surveyName,
							),
						);
					return { url: surveyURL, ...participant };
				}),
			);
			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}
		});
		await allure.step("navigate to text insights tab", async () => {
			await surveyPage.navigateTopSections("Reports");
			await CommonUtils.sleep(10);
			await commonFunctions.navigateToTabs("Text Insights");
			await engageOverviewPage.generateTextInsights();
		});
	});
	test("TC_03_User creates non-anonymous pulse survey and adds participants and attends survey @non-anonymous @textinsights @reports @regression @engage", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("User creates pulse survey", async () => {
			await surveyPage.createNewSurvey(`Pulse text Survey ${time}`);
			await surveyBuildEditPage.includeZeroInEnpsQuestion();
			await surveyPage.navigateTopSections("Create");
			await surveyBuildEditPage.addMultipleSectionsAndQuestions(
				2,
				5,
				"Text Input",
			);
			await surveyPage.navigateTopSections("Configure");
			await engageSurveyConfigure.nonAnonymousSurvey();
			time = commonutils.getCurrentTime();
			await engageSurveyConfigure.setFrequencyForMonths(time);

			await surveyPage.navigateTopSections("Distribution");
		});

		await allure.step("User adds participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
		});

		await allure.step("User launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(130);
		});

		await allure.step("Attend the survey", async () => {
			const surveyURLs = await Promise.all(
				participants.map(async (participant) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.engage_email_subject,
							participant.email,
							constants.getPulseEmailBody(
								participant.name,
								EntityIds.surveyName,
							),
						);
					return { url: surveyURL, ...participant };
				}),
			);
			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}
		});
		await allure.step("navigate to text insights tab", async () => {
			await surveyPage.navigateTopSections("Reports");
			await CommonUtils.sleep(10);
			await commonFunctions.navigateToTabs("Text Insights");
			await engageOverviewPage.generateTextInsights();
		});
	});
	test("TC_04_User creates anonymous pulse survey and adds participants and attends survey @anonymous @textinsights @reports @regression @engage", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("User creates pulse survey", async () => {
			await surveyPage.createNewSurvey(`Pulse text Survey ${time}`);
			await surveyBuildEditPage.includeZeroInEnpsQuestion();
			await surveyPage.navigateTopSections("Create");
			await surveyBuildEditPage.addMultipleSectionsAndQuestions(
				2,
				5,
				"Text Input",
			);
			await surveyPage.navigateTopSections("Configure");
			time = commonutils.getCurrentTime();
			await engageSurveyConfigure.setFrequencyForMonths(time);

			await surveyPage.navigateTopSections("Distribution");
		});

		await allure.step("User adds participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
		});

		await allure.step("User launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(130);
		});

		await allure.step("Attend the survey", async () => {
			const surveyURLs = await Promise.all(
				participants.map(async (participant) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.engage_email_subject,
							participant.email,
							constants.getPulseEmailBody(
								participant.name,
								EntityIds.surveyName,
							),
						);
					return { url: surveyURL, ...participant };
				}),
			);
			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}
		});
		await allure.step("navigate to text insights tab", async () => {
			await surveyPage.navigateTopSections("Reports");
			await CommonUtils.sleep(10);
			await commonFunctions.navigateToTabs("Text Insights");
			await engageOverviewPage.generateTextInsights();
		});
	});
});

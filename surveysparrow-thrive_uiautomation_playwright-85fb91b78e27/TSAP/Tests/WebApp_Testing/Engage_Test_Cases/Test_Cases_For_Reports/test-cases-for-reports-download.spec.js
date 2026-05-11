import { test } from "../../../../Fixtures/application-setup";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { POManager } from "../../../../Pages/POManager";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../../Data/Resources/constants";
import { generateRandomQuestionType } from "../../../../Data/Resources/random-values";
import { EntityIds } from "../../../../Shared_Functions/entityId";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { envDetails } from "../../../../Data/test-data";
import { CommonPageFunctions } from "../../../../Shared_Functions/common-functions";

let poManager;
let commonFunctions;
let surveyPage;
let surveyLaunch;
let engageDistributionPage;
let surveyBuildEditPage;
let commonutils;
let time;
let readEmail;
let surveyEuiPage;
let newSectionToAdd;
let newsectionDescriptionToAdd;
let newSection2ToAdd;
let newsectionDescription2ToAdd;
let cookieValue;
let engageOverviewPage;
let reportsHeaderPage;
let engageHeatmapPage;
let engageResponsesPage;
let engageConfigurePage;

test.describe("Anonymous Engagement Survey Reports", () => {
	test.beforeEach(async ({ thrivePage, browser }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		readEmail = new ReadEmail();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		surveyPage = poManager.getSurveyPage();
		surveyEuiPage = poManager.getSurveyEUIPage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		engageOverviewPage = poManager.getEngageOverviewPage();
		engageHeatmapPage = poManager.getEngageHeatmapPage();
		engageResponsesPage = poManager.getEngageResponsesPage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		reportsHeaderPage = poManager.getReportsHederPage();
		time = commonutils.getCurrentTime();
		newSectionToAdd = CommonUtils.generateRandomText(5);
		newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});

		await allure.step("Creating a Engage survey", async () => {
			await surveyPage.createNewSurvey(`Reports download in Engage ${time}`);
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
					questionType: "Rating Scale",
					questionName: question,
				});
			},
		);

		await allure.step("Add participants to the survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});

		await allure.step("Add participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engageParticipant1,
			);
			await engageDistributionPage.addAdditionalParticipants(
				constants.engageParticipant2,
			);
		});
	});

	test("TC_01_Download Reports in Anonymous Engagement Survey @smoke @Regression @engage_reports", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test case downloads and verifies overview report, heatmap and response reports in anonymous engagement survey",
		);
		await allure.step("Launch and attend the survey", async () => {
			await allure.step("Launch and verify the survey", async () => {
				await surveyLaunch.launchSurvey();
				await surveyLaunch.confirmEngageSurveyLaunch();
			});

			await allure.step(" Attend the survey", async () => {
				const participants = [
					{
						name: constants.engageParticipant1,
						email: constants.engageParticipant1Email,
					},
					{
						name: constants.engageParticipant2,
						email: constants.engageParticipant2Email,
					},
				];

				for (const participant of participants) {
					const emailBody = constants.getEngageEmailBody(
						participant.name,
						EntityIds.surveyName,
					);
					const surveyUrl = await readEmail.fetch_survey_url_from_email({
						from: envDetails.senderEmail,
						to: participant.email,
						subject: constants.engage_email_subject,
						body: emailBody,
					});
					await surveyEuiPage.attendEngagePulseSurvey({
						survey_url: surveyUrl,
						browser,
					});
				}
			});

			await allure.step("Navigate to the reports page", async () => {
				await surveyPage.navigateTopSections("Reports");
				await PwActions.pageRefresh(thrivePage);
			});
		});

		await allure.step("Download and verify the overview report", async () => {
			const { filePath } =
				await commonFunctions.downloadOverviewReport("Engage");
			const { textArray } = await commonutils.extractPdfText(filePath);
			CommonUtils.verifyArrayContainsAllElements(
				textArray,
				constants.engageOverviewReportTitles,
			);
		});

		await allure.step("Navigate to and download the heatmap", async () => {
			await commonFunctions.navigateEngageReportsHeader("Heatmap");
			const { filePath } = await commonFunctions.downloadHeatmap("Engage");
			const hasData = await commonutils.csvFileHasData(filePath);
			expect(hasData, "Heatmap CSV file has no data").toBeTruthy();
		});

		await allure.step(
			"Navigate to By Questions tab and download the response report",
			async () => {
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Question");

				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);

		await allure.step(
			"Navigate to By Respondents tab and download the response report",
			async () => {
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);
	});
	test("TC_02_Download Reports in Non-Anonymous Engagement Survey @Regression @engage_reports ", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test case downloads and verifies overview report, heatmap and response reports in anonymous engagement survey",
		);
		await allure.step(
			"Set Non-Anonymous option in survey settings",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.nonAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
			},
		);
		await allure.step("Launch and attend the survey", async () => {
			await allure.step("Launch and verify the survey", async () => {
				await surveyLaunch.launchSurvey();
				await surveyLaunch.confirmEngageSurveyLaunch();
			});

			await allure.step(" Attend the survey", async () => {
				const participants = [
					{
						name: constants.engageParticipant1,
						email: constants.engageParticipant1Email,
					},
					{
						name: constants.engageParticipant2,
						email: constants.engageParticipant2Email,
					},
				];

				for (const participant of participants) {
					const emailBody = constants.getEngageEmailBody(
						participant.name,
						EntityIds.surveyName,
					);
					const surveyUrl = await readEmail.fetch_survey_url_from_email({
						from: envDetails.senderEmail,
						to: participant.email,
						subject: constants.engage_email_subject,
						body: emailBody,
					});
					await surveyEuiPage.attendEngagePulseSurvey({
						survey_url: surveyUrl,
						browser,
					});
				}
			});

			await allure.step("Navigate to the reports page", async () => {
				await surveyPage.navigateTopSections("Reports");
				await PwActions.pageRefresh(thrivePage);
			});
		});

		await allure.step("Download and verify the overview report", async () => {
			const { filePath } =
				await commonFunctions.downloadOverviewReport("Engage");
			const { textArray } = await commonutils.extractPdfText(filePath);
			CommonUtils.verifyArrayContainsAllElements(
				textArray,
				constants.engageOverviewReportTitles,
			);
		});

		await allure.step("Navigate to and download the heatmap", async () => {
			await commonFunctions.navigateEngageReportsHeader("Heatmap");
			const { filePath } = await commonFunctions.downloadHeatmap("Engage");
			const hasData = await commonutils.csvFileHasData(filePath);
			expect(hasData, "Heatmap CSV file has no data").toBeTruthy();
		});

		await allure.step(
			"Navigate to By Questions tab and download the response report",
			async () => {
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Question");

				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);

		await allure.step(
			"Navigate to By Respondents tab and download the response report",
			async () => {
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);
	});
});

test.describe("Pulse Survey Reports", () => {
	test.beforeEach(async ({ thrivePage, browser }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		readEmail = new ReadEmail();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		surveyPage = poManager.getSurveyPage();
		surveyEuiPage = poManager.getSurveyEUIPage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		engageOverviewPage = poManager.getEngageOverviewPage();
		engageHeatmapPage = poManager.getEngageHeatmapPage();
		engageResponsesPage = poManager.getEngageResponsesPage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		reportsHeaderPage = poManager.getReportsHederPage();
		time = commonutils.getCurrentTime();
		newSectionToAdd = CommonUtils.generateRandomText(5);
		newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		newSection2ToAdd = CommonUtils.generateRandomText(5);
		newsectionDescription2ToAdd = CommonUtils.generateRandomText(15);

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});

		await allure.step("Creating a Pulse survey", async () => {
			await surveyPage.createNewSurvey(`Reports download in Pulse survey`);
			cookieValue = await thrivePage.context().cookies();
		});

		await allure.step(
			"Add sections and questions in the Pulse survey",
			async () => {
				// Add Section 1 with 2 questions
				await surveyBuildEditPage.addSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				const question1Type = generateRandomQuestionType();
				const question1Name = `Pulse Question 1 ${CommonUtils.generateRandomText(5)}`;
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: question1Type,
					questionName: question1Name,
				});
				const question2Type = generateRandomQuestionType();
				const question2Name = `Pulse Question 2 ${CommonUtils.generateRandomText(5)}`;
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: question2Type,
					questionName: question2Name,
				});

				// Add Section 2 with 1 question
				await surveyBuildEditPage.addSection(
					newSection2ToAdd,
					newsectionDescription2ToAdd,
				);
				const question3Type = generateRandomQuestionType();
				const question3Name = `Pulse Question 3 ${CommonUtils.generateRandomText(5)}`;
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSection2ToAdd,
					questionType: question3Type,
					questionName: question3Name,
				});
			},
		);

		await allure.step("Navigate to Configure and set frequency", async () => {
			await surveyPage.navigateTopSections("Configure");
			time = commonutils.getCurrentTime();
			await engageConfigurePage.setFrequencyForMonths(time);
			// Add wait to ensure frequency is saved properly before moving to next ste
		});

		await allure.step("Add participants to the survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engageParticipant1,
			);
			await engageDistributionPage.addAdditionalParticipants(
				constants.engageParticipant2,
			);
			await engageDistributionPage.addAdditionalParticipants(
				constants.engageParticipant3,
			);
			await engageDistributionPage.addAdditionalParticipants(
				constants.engageParticipant4,
			);
		});
	});

	test("TC_03_Download Reports in Anonymous Pulse Survey @Regression @pulse_reports", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test case downloads and verifies overview report, heatmap and response reports in anonymous pulse survey",
		);
		await allure.step("Launch and attend the survey", async () => {
			await allure.step("Launch and verify the survey", async () => {
				await surveyLaunch.launchPulseSurvey();
				await surveyLaunch.confirmEngageSurveyLaunch();
				await CommonUtils.sleep(300);
			});

			await allure.step("Attend the survey", async () => {
				const participants = [
					{
						name: constants.engageParticipant1,
						email: constants.engageParticipant1Email,
					},
					{
						name: constants.engageParticipant2,
						email: constants.engageParticipant2Email,
					},
					{
						name: constants.engageParticipant3,
						email: constants.engageParticipant3Email,
					},
					{
						name: constants.engageParticipant4,
						email: constants.engageParticipant4Email,
					},
				];

				for (const participant of participants) {
					const emailBody = constants.getPulseEmailBody(
						participant.name,
						EntityIds.surveyName,
					);
					const surveyUrl = await readEmail.fetch_survey_url_from_email({
						from: envDetails.senderEmail,
						to: participant.email,
						subject: constants.engage_email_subject,
						body: emailBody,
					});
					// Open new tab, attend survey, and close tab explicitly
					const page2 = await PwActions.openNewTab(browser);
					await PwActions.goTo(page2, surveyUrl);
					await surveyEuiPage.attendSurvey({
						page: page2,
						participantName: participant.name,
						subject: "Subject",
					});
					await page2.close();
				}
			});

			await allure.step("Refresh page and navigate to reports", async () => {
				await PwActions.pageRefresh(thrivePage);
				await surveyPage.navigateTopSections("Reports");
				await PwActions.pageRefresh(thrivePage);
			});
		});

		await allure.step("Download and verify the overview report", async () => {
			const { filePath } =
				await commonFunctions.downloadOverviewReport("Engage");
			const { textArray } = await commonutils.extractPdfText(filePath);
			CommonUtils.verifyArrayContainsAllElements(
				textArray,
				constants.pulseOverviewReportTitles,
			);
		});

		await allure.step("Navigate to and download the heatmap", async () => {
			await commonFunctions.navigateEngageReportsHeader("Heatmap");
			const { filePath } = await commonFunctions.downloadHeatmap("Engage");
			const hasData = await commonutils.csvFileHasData(filePath);
			expect(hasData, "Heatmap CSV file has no data").toBeTruthy();
		});

		await allure.step(
			"Navigate to By Questions tab and download the response report",
			async () => {
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Question");

				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);

		await allure.step(
			"Navigate to By Respondents tab and download the response report",
			async () => {
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);
	});
	test("TC_04_Download Reports in Non-Anonymous Pulse Survey @Regression @pulse_reports ", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test case downloads and verifies overview report, heatmap and response reports in non-anonymous pulse survey",
		);
		await allure.step(
			"Set Non-Anonymous option in survey settings",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.nonAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
			},
		);
		await allure.step("Launch and attend the survey", async () => {
			await allure.step("Launch and verify the survey", async () => {
				await surveyLaunch.launchPulseSurvey();
				await surveyLaunch.confirmEngageSurveyLaunch();
				await CommonUtils.sleep(300);
			});

			await allure.step(" Attend the survey", async () => {
				const participants = [
					{
						name: constants.engageParticipant1,
						email: constants.engageParticipant1Email,
					},
					{
						name: constants.engageParticipant2,
						email: constants.engageParticipant2Email,
					},
					{
						name: constants.engageParticipant3,
						email: constants.engageParticipant3Email,
					},
					{
						name: constants.engageParticipant4,
						email: constants.engageParticipant4Email,
					},
				];

				for (const participant of participants) {
					const emailBody = constants.getPulseEmailBody(
						participant.name,
						EntityIds.surveyName,
					);
					const surveyUrl = await readEmail.fetch_survey_url_from_email({
						from: envDetails.senderEmail,
						to: participant.email,
						subject: constants.engage_email_subject,
						body: emailBody,
					});
					// Open new tab, attend survey, and close tab explicitly
					const page2 = await PwActions.openNewTab(browser);
					await PwActions.goTo(page2, surveyUrl);
					await surveyEuiPage.attendSurvey({
						page: page2,
						participantName: participant.name,
						subject: "Subject",
					});
					await page2.close();
				}
			});

			await allure.step("Refresh page and navigate to reports", async () => {
				await PwActions.pageRefresh(thrivePage);
				await surveyPage.navigateTopSections("Reports");
				await PwActions.pageRefresh(thrivePage);
			});
		});

		await allure.step("Download and verify the overview report", async () => {
			const { filePath } =
				await commonFunctions.downloadOverviewReport("Engage");
			const { textArray } = await commonutils.extractPdfText(filePath);
			CommonUtils.verifyArrayContainsAllElements(
				textArray,
				constants.pulseOverviewReportTitles,
			);
		});

		await allure.step("Navigate to and download the heatmap", async () => {
			await commonFunctions.navigateEngageReportsHeader("Heatmap");
			const { filePath } = await commonFunctions.downloadHeatmap("Engage");
			const hasData = await commonutils.csvFileHasData(filePath);
			expect(hasData, "Heatmap CSV file has no data").toBeTruthy();
		});

		await allure.step(
			"Navigate to By Questions tab and download the response report",
			async () => {
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Question");

				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);

		await allure.step(
			"Navigate to By Respondents tab and download the response report",
			async () => {
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);
	});
});

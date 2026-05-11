import { allure } from "allure-playwright";
import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

let poManager;
let commonFunctions;
let surveyPage;
let engageDistributionPage;
let surveyBuildEditPage;
let commonutils;
let cookieValue;
let engageConfigurePage;
let surveyLaunchPage;
let surveyEUIPage;
let surveyName;
let participantsDistributionPage;
let reportsHeaderPage;
let engageResponsesPage;
test.describe("TEG-9115 and TEG-9116: Delete participants from non-anonymous and anonymous Engage/Pulse surveys and verify removal from reports", () => {
	test.beforeEach(async ({ thrivePage, browser }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyPage = poManager.getSurveyPage();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyEUIPage = poManager.getSurveyEUIPage();
		reportsHeaderPage = poManager.getReportsHederPage();
		participantsDistributionPage = poManager.getParticipantsDistributionPage();
		engageResponsesPage = poManager.getEngageResponsesPage();
		await commonFunctions.navigateTopNavigateSection("Engage");
	});

	test("TC_01_Verify participant deletion from a non-anonymous Engage survey removes them from response reports @Regression @engage_survey @non_anonymous @delete_participants", async ({
		browser,
		thrivePage,
	}) => {
		await allure.description(
			"This test verifies that when a participant is deleted from an Engage survey after completing it, they are removed from response reports while other participants remain visible",
		);

		await allure.step(
			"Create and configure Engage survey with sections and questions",
			async () => {
				surveyName = `Engage Survey ${CommonUtils.generateRandomText(8)}`;
				await surveyPage.createNewSurvey(surveyName);
				cookieValue = await thrivePage.context().cookies();

				const sectionName = "My Section";
				const sectionDescription = "My Section Description";
				await surveyBuildEditPage.addSection(sectionName, sectionDescription);
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: sectionName,
					questionType: "Rating Scale",
					questionName: "How satisfied are you with our service?",
				});
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: sectionName,
					questionType: "Text Input",
					questionName: "Please provide additional feedback",
				});
			},
		);

		await allure.step("Configure survey as non-anonymous", async () => {
			await surveyPage.navigateTopSections("Configure");
			await engageConfigurePage.nonAnonymousSurvey();
		});

		await allure.step(
			"Add multiple participants and launch Engage survey",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPage.addParticipantsInSurvey(
					constants.engageParticipant1Email,
				);
				await engageDistributionPage.addAdditionalParticipants(
					constants.engageParticipant2Email,
				);
				await engageDistributionPage.addAdditionalParticipants(
					constants.engageParticipant3Email,
				);
				await surveyLaunchPage.launchSurvey();
				await surveyLaunchPage.confirmEngageSurveyLaunch();
			},
		);

		await allure.step(
			"Complete survey for all three participants via email URLs",
			async () => {
				let surveyUrl1;
				let surveyUrl2;
				let surveyUrl3;
				// Get survey URL from email for participant 1
				surveyUrl1 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant1Email,
					constants.getEngageEmailBody(
						constants.engageParticipantName,
						surveyName,
					),
				);

				// Attend survey as participant 1
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl1,
				browser,
			});

				// Get survey URL from email for participant 2
				surveyUrl2 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant2Email,
					constants.getEngageEmailBody(
						constants.engageParticipant2,
						surveyName,
					),
				);

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl2,
				browser,
			});

				// Get survey URL from email for participant 3
				surveyUrl3 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant3Email,
					constants.getEngageEmailBody(
						constants.engageParticipant3,
						surveyName,
					),
				);

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl3,
				browser,
			});
			},
		);

		await allure.step(
			"Verify all participants are initially present in reports before deletion",
			async () => {
				await CommonUtils.sleep(30); // wait for receiving the response from the participants
				await surveyPage.navigateTopSections("Reports");
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const participantNames =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Respondent",
					);

				// Verify all three participants are present before deletion
				expect(participantNames).toContain(constants.engageParticipantName);
				expect(participantNames).toContain(constants.engageParticipant2);
				expect(participantNames).toContain(constants.engageParticipant3);
				await reportsHeaderPage.navigateHeaderReportSection("By Question");
				const participantNamesByQuestion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Question",
					);

				// Verify all three participants are present before deletion
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipantName,
				);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipant2,
				);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipant3,
				);
			},
		);

		await allure.step(
			"Delete specific participant from survey distribution",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPage.navigateToInviteOrShortlistTab("invite");
				await participantsDistributionPage.deleteParticipants(
					constants.engageParticipantName,
				);
			},
		);

		await allure.step(
			"Navigate to response reports and verify participant removal",
			async () => {
				await surveyPage.navigateTopSections("Reports");
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const participantNames =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Respondent",
					);

				// Verify deleted participant is not in reports
				expect(participantNames).not.toContain(constants.engageParticipantName);
				// Verify other participants remain in reports
				expect(participantNames).toContain(constants.engageParticipant2);
				expect(participantNames).toContain(constants.engageParticipant3);
				await PwActions.pageRefresh(thrivePage);
				const participantNamesByQuestion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Question",
					);

				expect(participantNamesByQuestion).not.toContain(
					constants.engageParticipantName,
				);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipant2,
				);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipant3,
				);
			},
		);
	});

	test("TC_02_Verify participant deletion from a non-anonymous Pulse survey removes them from response reports @Regression @engage_survey @non_anonymous @delete_participants", async ({
		browser,
		thrivePage,
	}) => {
		await allure.description(
			"This test verifies that when a participant is deleted from a Pulse survey after completing it, they are removed from response reports while other participants remain visible",
		);

		await allure.step(
			"Create and configure Pulse survey with sections and questions",
			async () => {
				surveyName = `My Pulse Survey ${CommonUtils.generateRandomText(13)}`;
				await surveyPage.createNewSurvey(surveyName);
				cookieValue = await thrivePage.context().cookies();

				const sectionName = "My Section";
				const sectionDescription = "My Section Description";
				await surveyBuildEditPage.addSection(sectionName, sectionDescription);
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: sectionName,
					questionType: "Rating Scale",
					questionName: "How satisfied are you with our service?",
				});
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: sectionName,
					questionType: "Text Input",
					questionName: "Please provide additional feedback",
				});
			},
		);

		await allure.step(
			"Configure Pulse survey frequency and set as non-anonymous",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.setFrequencyForMonths(
					new CommonUtils().getCurrentTime(),
				);
				await engageConfigurePage.nonAnonymousSurvey();
			},
		);

		await allure.step(
			"Add multiple participants and launch Pulse survey",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPage.addParticipantsInSurvey(
					constants.engageParticipant1Email,
				);
				await engageDistributionPage.addAdditionalParticipants(
					constants.engageParticipant2Email,
				);
				await engageDistributionPage.addAdditionalParticipants(
					constants.engageParticipant3Email,
				);
				await surveyPage.navigateTopSections("Distribution");
				await surveyLaunchPage.launchPulseSurvey();
				await surveyLaunchPage.confirmEngageSurveyLaunch();
			},
		);

		await allure.step(
			"Wait for Pulse survey to be fully launched and available",
			async () => {
				await CommonUtils.sleep(120); // sleep for 2 minutes to ensure survey is launched
			},
		);

		await allure.step(
			"Complete Pulse survey for all three participants via email URLs",
			async () => {
				let surveyUrl1;
				let surveyUrl2;
				let surveyUrl3;
				// Get survey URL from email for participant 1
				// Wait to ensure unique email retrieval, This will be deprecating soon
				await CommonUtils.sleep(10);

				surveyUrl3 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant3Email,
					constants.getPulseEmailBody(constants.engageParticipant3, surveyName),
				);
				// Wait to ensure unique email retrieval, This will be deprecating soon
				await CommonUtils.sleep(10);

				surveyUrl1 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant1Email,
					constants.getPulseEmailBody(
						constants.engageParticipantName,
						surveyName,
					),
				);
				// Get survey URL from email for participant 2
				// Wait to ensure unique email retrieval, This will be deprecating soon
				await CommonUtils.sleep(10);

				surveyUrl2 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant2Email,
					constants.getPulseEmailBody(constants.engageParticipant2, surveyName),
				);

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl3,
				browser,
			});

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl1,
				browser,
			});

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl2,
				browser,
			});
			},
		);
		await allure.step(
			"Verify all participants are initially present in Pulse survey reports before deletion",
			async () => {
				await CommonUtils.sleep(30); // wait for receiving the response from the participants
				await surveyPage.navigateTopSections("Reports");
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const participantNames =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Respondent",
					);
				expect(participantNames).toContain(constants.engageParticipantName);
				expect(participantNames).toContain(constants.engageParticipant2);
				expect(participantNames).toContain(constants.engageParticipant3);
				await reportsHeaderPage.navigateHeaderReportSection("By Question");
				const participantNamesByQuestion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Question",
					);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipantName,
				);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipant2,
				);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipant3,
				);
			},
		);
		await allure.step(
			"Delete specific participant from Pulse survey distribution",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await PwActions.pageRefresh(thrivePage);
				await engageDistributionPage.navigateToInviteOrShortlistTab("invite");
				await participantsDistributionPage.deleteParticipants(
					constants.engageParticipantName,
				);
			},
		);

		await allure.step(
			"Navigate to response reports and verify participant removal",
			async () => {
				await surveyPage.navigateTopSections("Reports");
				await PwActions.pageRefresh(thrivePage);
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const participantNames =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Respondent",
					);

				// Verify deleted participant is not in reports
				expect(participantNames).not.toContain(constants.engageParticipantName);
				// Verify other participants remain in reports
				expect(participantNames).toContain(constants.engageParticipant2);
				expect(participantNames).toContain(constants.engageParticipant3);
				await PwActions.pageRefresh(thrivePage);
				const participantNamesByQuestion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Question",
					);

				expect(participantNamesByQuestion).not.toContain(
					constants.engageParticipantName,
				);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipant2,
				);
				expect(participantNamesByQuestion).toContain(
					constants.engageParticipant3,
				);
			},
		);
	});

	test("TC_03_Verify participant count in anonymous Engage survey reports @Regression @engage_survey @anonymous @delete_participants", async ({
		browser,
		thrivePage,
	}) => {
		await allure.description(
			"This test verifies the participant count in reports for anonymous Engage surveys without checking individual participant names",
		);

		await allure.step(
			"Create and configure anonymous Engage survey",
			async () => {
				surveyName = `Anonymous Engage Survey ${CommonUtils.generateRandomText(8)}`;
				await surveyPage.createNewSurvey(surveyName);
				cookieValue = await thrivePage.context().cookies();

				const sectionName = "Feedback Section";
				const sectionDescription = "Anonymous feedback section";
				await surveyBuildEditPage.addSection(sectionName, sectionDescription);
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: sectionName,
					questionType: "Rating Scale",
					questionName: "How satisfied are you with our service?",
				});
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: sectionName,
					questionType: "Text Input",
					questionName: "Please provide additional feedback",
				});
			},
		);

		await allure.step(
			"Add participants and launch anonymous Engage survey",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPage.addParticipantsInSurvey(
					constants.engageParticipant1Email,
				);
				await engageDistributionPage.addAdditionalParticipants(
					constants.engageParticipant2Email,
				);
				await engageDistributionPage.addAdditionalParticipants(
					constants.engageParticipant3Email,
				);
				await surveyLaunchPage.launchSurvey();
				await surveyLaunchPage.confirmEngageSurveyLaunch();
			},
		);

		await allure.step(
			"Complete survey for all three participants via email URLs",
			async () => {
				let surveyUrl1;
				let surveyUrl2;
				let surveyUrl3;
				// Get survey URL from email for participant 1
				surveyUrl1 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engage_email,
					constants.getEngageEmailBody(
						constants.engageParticipantName,
						surveyName,
					),
				);

				// Attend survey as participant 1
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl1,
				browser,
			});

				// Get survey URL from email for participant 2
				surveyUrl2 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant2Email,
					constants.getEngageEmailBody(
						constants.engageParticipant2,
						surveyName,
					),
				);

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl2,
				browser,
			});

				// Get survey URL from email for participant 3
				surveyUrl3 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant3Email,
					constants.getEngageEmailBody(
						constants.engageParticipant3,
						surveyName,
					),
				);

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl3,
				browser,
			});
			},
		);

		await allure.step(
			"Verify participant count in anonymous survey reports",
			async () => {
				await CommonUtils.sleep(30); // wait for receiving the response from the participants
				await surveyPage.navigateTopSections("Reports");
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");

				const participantNames =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Respondent",
					);
				const participantCount = participantNames ? participantNames.length : 0;

				// Verify that we have 3 participants in the reports
				expect(participantCount).toBe(3);

				await reportsHeaderPage.navigateHeaderReportSection("By Question");
				const participantNamesByQuestion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Question",
					);
				const participantCountByQuestion = participantNamesByQuestion
					? participantNamesByQuestion.length
					: 0;

				// Verify participant count consistency across different report views
				expect(participantCountByQuestion).toBe(3);
			},
		);

		await allure.step(
			"Delete a participant from anonymous survey distribution",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPage.navigateToInviteOrShortlistTab("invite");
				await participantsDistributionPage.deleteParticipants(
					constants.engageParticipantName,
				);
			},
		);

		await allure.step(
			"Verify participant count is reduced after deletion in anonymous survey",
			async () => {
				await surveyPage.navigateTopSections("Reports");
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");

				const participantNamesAfterDeletion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Respondent",
					);
				const participantCountAfterDeletion = participantNamesAfterDeletion
					? participantNamesAfterDeletion.length
					: 0;

				// Verify that participant count is reduced from 3 to 2
				expect(participantCountAfterDeletion).toBe(2);

				await PwActions.pageRefresh(thrivePage);
				const participantNamesByQuestionAfterDeletion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Question",
					);
				const participantCountByQuestionAfterDeletion =
					participantNamesByQuestionAfterDeletion
						? participantNamesByQuestionAfterDeletion.length
						: 0;

				// Verify participant count consistency across different report views after deletion
				expect(participantCountByQuestionAfterDeletion).toBe(2);
			},
		);
	});

	test("TC_04_Verify participant count in anonymous Pulse survey reports @Regression @engage_survey @anonymous @delete_participants", async ({
		browser,
		thrivePage,
	}) => {
		await allure.description(
			"This test verifies the participant count in reports for anonymous Pulse surveys and validates count reduction after participant deletion",
		);

		await allure.step(
			"Create and configure anonymous Pulse survey",
			async () => {
				surveyName = `Anonymous Pulse Survey ${CommonUtils.generateRandomText(8)}`;
				await surveyPage.createNewSurvey(surveyName);
				cookieValue = await thrivePage.context().cookies();

				const sectionName = "Pulse Feedback Section";
				const sectionDescription = "Anonymous pulse feedback section";
				await surveyBuildEditPage.addSection(sectionName, sectionDescription);
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: sectionName,
					questionType: "Rating Scale",
					questionName: "How satisfied are you with our workplace culture?",
				});
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: sectionName,
					questionType: "Text Input",
					questionName: "What can we improve in the workplace?",
				});
			},
		);

		await allure.step(
			"Configure Pulse survey frequency (keep anonymous)",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.setFrequencyForMonths(
					new CommonUtils().getCurrentTime(),
				);
				// Note: Not disabling anonymity to keep survey anonymous
			},
		);

		await allure.step(
			"Add participants and launch anonymous Pulse survey",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPage.addParticipantsInSurvey(
					constants.engageParticipant1Email,
				);
				await engageDistributionPage.addAdditionalParticipants(
					constants.engageParticipant2Email,
				);
				await engageDistributionPage.addAdditionalParticipants(
					constants.engageParticipant3Email,
				);
				await surveyPage.navigateTopSections("Distribution");
				await surveyLaunchPage.launchPulseSurvey();
				await surveyLaunchPage.confirmEngageSurveyLaunch();
			},
		);

		await allure.step(
			"Wait for Pulse survey to be fully launched and available",
			async () => {
				await CommonUtils.sleep(120); // sleep for 2 minutes to ensure survey is launched
			},
		);

		await allure.step(
			"Complete Pulse survey for all three participants via email URLs",
			async () => {
				let surveyUrl1;
				let surveyUrl2;
				let surveyUrl3;
				// Get survey URL from email for participant 1
				// Wait to ensure unique email retrieval, This will be deprecating soon
				await CommonUtils.sleep(10);

				surveyUrl1 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant1Email,
					constants.getPulseEmailBody(
						constants.engageParticipantName,
						surveyName,
					),
				);

				// Attend survey as participant 1
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl1,
				browser,
			});

				await CommonUtils.sleep(10); // Wait to ensure unique email retrieval, This will be deprecating soon

				// Get survey URL from email for participant 2
				surveyUrl2 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant2Email,
					constants.getPulseEmailBody(constants.engageParticipant2, surveyName),
				);

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl2,
				browser,
			});
				await CommonUtils.sleep(10); // Wait to ensure unique email retrieval, This will be deprecating soon

				// Get survey URL from email for participant 3
				surveyUrl3 = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.engageParticipant3Email,
					constants.getPulseEmailBody(constants.engageParticipant3, surveyName),
				);

			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl3,
				browser,
			});
			},
		);

		await allure.step(
			"Verify participant count in anonymous Pulse survey reports",
			async () => {
				await CommonUtils.sleep(30); // wait for receiving the response from the participants
				await surveyPage.navigateTopSections("Reports");
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");

				const participantNames =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Respondent",
					);
				const participantCount = participantNames ? participantNames.length : 0;

				// Verify that we have 3 participants in the reports
				expect(participantCount).toBe(3);

				await reportsHeaderPage.navigateHeaderReportSection("By Question");
				const participantNamesByQuestion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Question",
					);
				const participantCountByQuestion = participantNamesByQuestion
					? participantNamesByQuestion.length
					: 0;

				// Verify participant count consistency across different report views
				expect(participantCountByQuestion).toBe(3);
			},
		);

		await allure.step(
			"Delete a participant from anonymous Pulse survey distribution",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await PwActions.pageRefresh(thrivePage);
				await engageDistributionPage.navigateToInviteOrShortlistTab("invite");
				await participantsDistributionPage.deleteParticipants(
					constants.engageParticipantName,
				);
			},
		);

		await allure.step(
			"Verify participant count is reduced after deletion in anonymous Pulse survey",
			async () => {
				await surveyPage.navigateTopSections("Reports");
				await PwActions.pageRefresh(thrivePage);
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");

				const participantNamesAfterDeletion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Respondent",
					);
				const participantCountAfterDeletion = participantNamesAfterDeletion
					? participantNamesAfterDeletion.length
					: 0;

				// Verify that participant count is reduced from 3 to 2
				expect(participantCountAfterDeletion).toBe(2);

				await PwActions.pageRefresh(thrivePage);
				const participantNamesByQuestionAfterDeletion =
					await engageResponsesPage.getAllParticipantNamesFromTable(
						"By Question",
					);
				const participantCountByQuestionAfterDeletion =
					participantNamesByQuestionAfterDeletion
						? participantNamesByQuestionAfterDeletion.length
						: 0;

				// Verify participant count consistency across different report views after deletion
				expect(participantCountByQuestionAfterDeletion).toBe(2);
			},
		);
	});
});

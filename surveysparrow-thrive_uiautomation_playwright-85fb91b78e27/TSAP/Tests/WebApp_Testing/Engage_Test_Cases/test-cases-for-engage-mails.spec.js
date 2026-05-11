import { allure } from "allure-playwright";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";

test.describe("Verifying if participants receive survey reminders emails", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let surveyLaunchPage;
	let surveyBuilderPage;
	let engageDistributionPage;
	let time;
	let commonUtils;
	let surveyEUIPage;
	let cookieValue;
	let managerName;
	let employee1Name;
	let employee1Email;
	let employee2Name;
	let employee2Email;
	let participantsDistributionPage;
	let engageConfigurePage;
	let readEmail;
	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonUtils = new CommonUtils();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyPage = poManager.getSurveyPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyBuilderPage = poManager.getSurveyBuilderPage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		time = commonUtils.getCurrentTime();
		surveyEUIPage = poManager.getSurveyEUIPage();
		participantsDistributionPage = poManager.getParticipantsDistributionPage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		readEmail = new ReadEmail();

		managerName = constants.managerName;
		employee1Name = constants.engageParticipant1;
		employee1Email = constants.engageParticipant1Email;
		employee2Name = constants.engageParticipant2;
		employee2Email = constants.engageParticipant2Email;
	});

	test("TC_01_Verifying if invite and manager report ready emails are not sent after turning off mail in anonymous engage survey @regression @engage @mail", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test verifies if invite and manager report ready emails are not sent after turning off mail in anonymous engage survey",
		);
		await allure.step("Navigating to Engage tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
		await allure.step("Creating a Engage survey", async () => {
			await surveyPage.createNewSurvey(`Automation Engage Survey${time}`);
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("add section and questions", async () => {
			await surveyBuilderPage.addMultipleSectionsAndQuestions(
				1,
				1,
				"Rating Scale",
			);
		});
		await allure.step("Inviting participants to the survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(employee1Email);
			await engageDistributionPage.addAdditionalParticipants(employee2Email);
		});
		await allure.step("Launching the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});
		await allure.step("fetch invite email content", async () => {
			const email1 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(employee1Name, EntityIds.surveyName),
			});
			const email2 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(employee2Name, EntityIds.surveyName),
			});
		});
		await allure.step("Sending reminder to the participants", async () => {
			await engageDistributionPage.SendReminder();
			await CommonUtils.sleep(10);
		});
		await allure.step(
			"Verifying if participants receive reminder emails",
			async () => {
				const participantNames = [employee1Name, employee2Name];
				const surveyUrls = [];
				for (const name of participantNames) {
					const url = await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						constants.new_employee_email,
						constants.getEngageEmailReminderBody(name, EntityIds.surveyName),
					);
					surveyUrls.push(url);
				}
				for (const url of surveyUrls) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: url,
					browser,
				});
				}
			},
		);
		await allure.step(
			"Verify Whether the manager got email or not",
			async () => {
				const email = await readEmail.fetch_mail_content_from_gmail({
					subject: constants.managerReportReadyEmailSubject,
					body: constants.getEngageManagerReportEmailBody(
						managerName,
						EntityIds.surveyName,
					),
				});
			},
		);
		await allure.step("Deleting the participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await participantsDistributionPage.deleteParticipants(
				employee1Name,
				"Engage",
			);
			await CommonUtils.sleep(1);
			await participantsDistributionPage.deleteParticipants(
				employee2Name,
				"Engage",
			);
		});
		await allure.step(
			"Go to configure page and turn off send invitation mail and report ready email",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.disableInvitetotakeSurvey();
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.disableReportReadyEmail();
			},
		);
		const reminderSentTime = Date.now();
		const cutoffMinutes =
			Math.floor((Date.now() - reminderSentTime) / 60000) + 1;
		await allure.step("Invite the participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInLiveSurvey(
				employee1Email,
				"Engage",
			);
			await engageDistributionPage.addParticipantsInLiveSurvey(
				employee2Email,
				"Engage",
			);
			await engageDistributionPage.inviteParticipantsFromShortlisted("bulk");
			const emailnew1 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(employee1Name, EntityIds.surveyName),
				shouldReceiveEmail: false,
				maxRetries: 5,
				emailCutoffTimeInMinutes: cutoffMinutes,
			});
			const emailnew2 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(employee2Name, EntityIds.surveyName),
				shouldReceiveEmail: false,
				maxRetries: 5,
				emailCutoffTimeInMinutes: cutoffMinutes,
			});
		});

		await allure.step("Sending reminder to the participants", async () => {
			await engageDistributionPage.SendReminder();
			await CommonUtils.sleep(10);
		});
		await allure.step(
			"Verifying if participants receive reminder emails",
			async () => {
				const participantNames = [employee1Name, employee2Name];
				const surveyUrls = [];
				for (const name of participantNames) {
					const url = await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						constants.new_employee_email,
						constants.getEngageEmailReminderBody(name, EntityIds.surveyName),
						cutoffMinutes,
					);
					surveyUrls.push(url);
				}
				for (const url of surveyUrls) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: url,
					browser,
				});
				}
			},
		);
		await allure.step(
			"Verify Whether the manager not got email after attending the survey",
			async () => {
				const email = await readEmail.fetch_mail_content_from_gmail({
					subject: constants.managerReportReadyEmailSubject,
					body: constants.getEngageManagerReportEmailBody(
						managerName,
						EntityIds.surveyName,
					),
					shouldReceiveEmail: false,
					maxRetries: 5,
					emailCutoffTimeInMinutes: cutoffMinutes,
				});
			},
		);
		await allure.step("navigate to home page", async () => {
			await surveyPage.navigateToSurveyHomePage();
		});
	});
	test("TC_02_Verifying if participants not receive invite and manager report ready emails in after turning off mail in anonymous pulse survey @regression @engage @mail", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test verifies if participants receive survey reminders emails in pulse survey",
		);
		await allure.step("Navigating to Engage tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
		await allure.step("Creating a pulse survey", async () => {
			await surveyPage.createNewSurvey(`Automation Pulse Survey${time}`);
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("add section and questions", async () => {
			await surveyBuilderPage.addMultipleSectionsAndQuestions(
				1,
				1,
				"Rating Scale",
			);
		});
		await allure.step("add frequency in configure", async () => {
			time = commonUtils.getCurrentTime();
			await surveyPage.navigateTopSections("Configure");
			await engageConfigurePage.setFrequencyForMonths(time);
		});
		await allure.step("Inviting participants to the survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(employee1Email);
			await engageDistributionPage.addAdditionalParticipants(employee2Email);
		});
		await allure.step("Launching the survey", async () => {
			await surveyLaunchPage.launchPulseSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await engageDistributionPage.waitForCurrentPulseSurveyToBeLive();
		});
		await allure.step("fetch invite email content", async () => {
			const email1 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getPulseEmailBody(employee1Name, EntityIds.surveyName),
			});
			const email2 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getPulseEmailBody(employee2Name, EntityIds.surveyName),
			});
		});
		await allure.step("Sending reminder to the participants", async () => {
			await engageDistributionPage.SendReminder();
		});
		await allure.step(
			"Verifying if participants receive reminder emails",
			async () => {
				const participants = [
					{ name: employee1Name, email: employee1Email },
					{ name: employee2Name, email: employee2Email },
				];
				const surveyUrls = [];

				for (const participant of participants) {
					const url = await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						participant.email,
						constants.getPulseEmailReminderBody(
							participant.name,
							EntityIds.surveyName,
						),
					);
					await CommonUtils.sleep(2);
					surveyUrls.push(url);
				}

				for (const url of surveyUrls) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: url,
					browser,
				});
				}
			},
		);
		await allure.step(
			"Verify Whether the manager got pulse report email or not",
			async () => {
				const email = await readEmail.fetch_mail_content_from_gmail({
					subject: constants.managerReportReadyEmailSubject,
					body: constants.getPulseManagerReportEmailBody(
						managerName,
						EntityIds.surveyName,
					),
				});
			},
		);
		const pulseReminderSentTime = Date.now();
		const pulseCutoffMinutes =
			Math.floor((Date.now() - pulseReminderSentTime) / 60000) + 1;
		await allure.step(
			"Go to configure page and turn off send invitation mail and report ready email",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.disableInvitetotakeSurvey();
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.disableReportReadyEmail();
				await surveyPage.navigateTopSections("Configure");
				time = commonUtils.getCurrentTime();
				await engageConfigurePage.setFrequencyForMonths(time, "livesurvey");
				await engageDistributionPage.waitForCurrentPulseSurveyToBeLive();
			},
		);
		await allure.step("fetch invite email content not received", async () => {
			const emailnew1 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getPulseEmailBody(employee1Name, EntityIds.surveyName),
				shouldReceiveEmail: false,
				maxRetries: 5,
				emailCutoffTimeInMinutes: pulseCutoffMinutes,
			});
			const emailnew2 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getPulseEmailBody(employee2Name, EntityIds.surveyName),
				shouldReceiveEmail: false,
				maxRetries: 5,
				emailCutoffTimeInMinutes: pulseCutoffMinutes,
			});
		});
		await allure.step("Sending reminder to the participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.SendReminder();
		});
		await allure.step(
			"Verifying if participants receive reminder emails",
			async () => {
				const participants = [
					{ name: employee1Name, email: employee1Email },
					{ name: employee2Name, email: employee2Email },
				];
				const surveyUrls = [];

				for (const participant of participants) {
					await CommonUtils.sleep(10);
					const url = await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						participant.email,
						constants.getPulseEmailReminderBody(
							participant.name,
							EntityIds.surveyName,
						),
						pulseCutoffMinutes,
					);
					surveyUrls.push(url);
				}

				for (const url of surveyUrls) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: url,
					browser,
				});
				}
			},
		);
		await allure.step(
			"Verify Whether the manager not got email after attending the survey",
			async () => {
				const email = await readEmail.fetch_mail_content_from_gmail({
					subject: constants.managerReportReadyEmailSubject,
					body: constants.getPulseManagerReportEmailBody(
						managerName,
						EntityIds.surveyName,
					),
					shouldReceiveEmail: false,
					maxRetries: 5,
					emailCutoffTimeInMinutes: pulseCutoffMinutes,
				});
			},
		);
		await allure.step("navigate to home page", async () => {
			await surveyPage.navigateToSurveyHomePage();
		});
	});
	test("TC_03_Verifying if invite and manager report ready emails are not sent after turning off mail in non-anonymous engage survey @regression @engage @mail ", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test verifies if invite and manager report ready emails are not sent after turning off mail in non-anonymous engage survey",
		);
		await allure.step("Navigating to Engage tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
		await allure.step("Creating a Engage survey", async () => {
			await surveyPage.createNewSurvey(`Automation Engage Survey${time}`);
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("add section and questions", async () => {
			await surveyBuilderPage.addMultipleSectionsAndQuestions(
				1,
				1,
				"Rating Scale",
			);
		});
		await allure.step("Enable non-anonymous toggle in configure", async () => {
			await surveyPage.navigateTopSections("Configure");
			await engageConfigurePage.nonAnonymousSurvey();
		});
		await allure.step("Inviting participants to the survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(employee1Email);
			await engageDistributionPage.addAdditionalParticipants(employee2Email);
		});
		await allure.step("Launching the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});
		await allure.step("fetch invite email content", async () => {
			const email1 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(employee1Name, EntityIds.surveyName),
			});
			const email2 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(employee2Name, EntityIds.surveyName),
			});
		});
		await allure.step("Sending reminder to the participants", async () => {
			await engageDistributionPage.SendReminder();
			await CommonUtils.sleep(10);
		});
		await allure.step(
			"Verifying if participants receive reminder emails",
			async () => {
				const participantNames = [employee1Name, employee2Name];
				const surveyUrls = [];
				for (const name of participantNames) {
					const url = await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						constants.new_employee_email,
						constants.getEngageEmailReminderBody(name, EntityIds.surveyName),
					);
					surveyUrls.push(url);
				}
				for (const url of surveyUrls) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: url,
					browser,
				});
				}
			},
		);

		await allure.step("Deleting the participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await participantsDistributionPage.deleteParticipants(
				employee1Name,
				"Engage",
			);
			await CommonUtils.sleep(1);
			await participantsDistributionPage.deleteParticipants(
				employee2Name,
				"Engage",
			);
		});
		await allure.step(
			"Go to configure page and turn off send invitation mail",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.disableInvitetotakeSurvey();
			},
		);
		const reminderSentTime = Date.now();
		const cutoffMinutes =
			Math.floor((Date.now() - reminderSentTime) / 60000) + 1;
		await allure.step("Invite the participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInLiveSurvey(
				employee1Email,
				"Engage",
			);
			await engageDistributionPage.addParticipantsInLiveSurvey(
				employee2Email,
				"Engage",
			);
			await engageDistributionPage.inviteParticipantsFromShortlisted("bulk");
			const emailnew1 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(employee1Name, EntityIds.surveyName),
				shouldReceiveEmail: false,
				maxRetries: 5,
				emailCutoffTimeInMinutes: cutoffMinutes,
			});
			const emailnew2 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(employee2Name, EntityIds.surveyName),
				shouldReceiveEmail: false,
				maxRetries: 5,
				emailCutoffTimeInMinutes: cutoffMinutes,
			});
		});

		await allure.step("Sending reminder to the participants", async () => {
			await engageDistributionPage.SendReminder();
			await CommonUtils.sleep(10);
		});
		await allure.step(
			"Verifying if participants receive reminder emails",
			async () => {
				const participantNames = [employee1Name, employee2Name];
				const surveyUrls = [];
				for (const name of participantNames) {
					const url = await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						constants.new_employee_email,
						constants.getEngageEmailReminderBody(name, EntityIds.surveyName),
						cutoffMinutes,
					);
					surveyUrls.push(url);
				}
				for (const url of surveyUrls) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: url,
					browser,
				});
				}
			},
		);
		await allure.step("navigate to home page", async () => {
			await surveyPage.navigateToSurveyHomePage();
		});
	});
	test("TC_04_Verifying if invite and manager report ready emails are not sent after turning off mail in non-anonymous pulse survey @regression @engage @mail ", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test verifies if invite and manager report ready emails are not sent after turning off mail in non-anonymous pulse survey",
		);
		await allure.step("Navigating to Engage tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
		await allure.step("Creating a pulse survey", async () => {
			await surveyPage.createNewSurvey(`Automation Pulse Survey${time}`);
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("add section and questions", async () => {
			await surveyBuilderPage.addMultipleSectionsAndQuestions(
				1,
				1,
				"Rating Scale",
			);
		});
		await allure.step("Enable non-anonymous toggle in configure", async () => {
			await surveyPage.navigateTopSections("Configure");
			await engageConfigurePage.nonAnonymousSurvey();
			await surveyPage.navigateTopSections("Configure");
			await engageConfigurePage.setFrequencyForMonths(time);
		});
		await allure.step("Inviting participants to the survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(employee1Email);
			await engageDistributionPage.addAdditionalParticipants(employee2Email);
		});
		await allure.step("Launching the survey", async () => {
			await surveyLaunchPage.launchPulseSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await engageDistributionPage.waitForCurrentPulseSurveyToBeLive();
		});
		await allure.step("fetch invite email content", async () => {
			const email1 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getPulseEmailBody(employee1Name, EntityIds.surveyName),
			});
			const email2 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getPulseEmailBody(employee2Name, EntityIds.surveyName),
			});
		});
		await allure.step("Sending reminder to the participants", async () => {
			await engageDistributionPage.SendReminder();
		});
		await allure.step(
			"Verifying if participants receive reminder emails",
			async () => {
				const participants = [
					{ name: employee1Name, email: employee1Email },
					{ name: employee2Name, email: employee2Email },
				];
				const surveyUrls = [];
				for (const participant of participants) {
					await CommonUtils.sleep(10);
					const url = await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						participant.email,
						constants.getPulseEmailReminderBody(
							participant.name,
							EntityIds.surveyName,
						),
					);
					surveyUrls.push(url);
				}
				for (const url of surveyUrls) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: url,
					browser,
				});
				}
			},
		);
		const pulseReminderSentTime = Date.now();
		const pulseCutoffMinutes =
			Math.floor((Date.now() - pulseReminderSentTime) / 60000) + 1;
		await allure.step(
			"Go to configure page and turn off send invitation mail",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.disableInvitetotakeSurvey();
				await surveyPage.navigateTopSections("Configure");
				time = commonUtils.getCurrentTime();
				await engageConfigurePage.setFrequencyForMonths(time, "livesurvey");
				await engageDistributionPage.waitForCurrentPulseSurveyToBeLive();
			},
		);
		await allure.step("fetch invite email content not received", async () => {
			const emailnew1 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getPulseEmailBody(employee1Name, EntityIds.surveyName),
				shouldReceiveEmail: false,
				maxRetries: 5,
				emailCutoffTimeInMinutes: pulseCutoffMinutes,
			});
			const emailnew2 = await readEmail.fetch_mail_content_from_gmail({
				subject: constants.engage_email_subject,
				body: constants.getPulseEmailBody(employee2Name, EntityIds.surveyName),
				shouldReceiveEmail: false,
				maxRetries: 5,
				emailCutoffTimeInMinutes: pulseCutoffMinutes,
			});
		});
		await allure.step("Sending reminder to the participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.SendReminder();
		});
		await allure.step(
			"Verifying if participants receive reminder emails",
			async () => {
				const participants = [
					{ name: employee1Name, email: employee1Email },
					{ name: employee2Name, email: employee2Email },
				];
				const surveyUrls = [];

				for (const participant of participants) {
					const url = await commonFunctions.open_survey_from_received_email(
						constants.engage_email_reminder_subject,
						participant.email,
						constants.getPulseEmailReminderBody(
							participant.name,
							EntityIds.surveyName,
						),
						pulseCutoffMinutes,
					);
					surveyUrls.push(url);
				}

				for (const url of surveyUrls) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: url,
					browser,
				});
				}
			},
		);
		await allure.step("navigate to home page", async () => {
			await surveyPage.navigateToSurveyHomePage();
		});
	});
});

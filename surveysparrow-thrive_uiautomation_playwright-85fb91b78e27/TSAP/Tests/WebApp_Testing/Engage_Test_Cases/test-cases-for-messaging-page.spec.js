import { allure } from "allure-playwright";
import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { constants } from "../../../Data/Resources/constants.js";
import { envDetails } from "../../../Data/test-data.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

test.describe("Test cases for Engage messaging page", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let engageConfigurePage;
	let engageDistributionPage;
	let surveyMessagingPage;
	let surveyLaunchPage;
	let surveyBuildEditPage;
	let commonutils;
	let time;
	let readEmail;
	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyPage = poManager.getSurveyPage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyMessagingPage = poManager.getSurveyMessagingPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		time = commonutils.getCurrentTime();
		readEmail = new ReadEmail();

		await allure.step("Navigate to Engage section", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test("TC_01 Verify adding and removing header image, custom branding, and variables to Engage messaging templates with email verification @regression @messaging @variables", async ({
		thrivePage,
		browser,
	}) => {
		const surveyName = `Automation Engage Survey ${time}`;
		let cookieValue;
		let surveyUrl; // Declared at test scope to use in both invite and reminder verification

		// Get survey variables from constants
		const surveyVariables = constants.surveyVariables;

		const companyName = CommonUtils.getCompanyNameFromUrl(envDetails.uri);

		await allure.description(
			"This test verifies adding header images, custom branding, and variables ({surveyName}, {surveyURL}, {companyName}, {employeeFirstName}, {employeeFullName}) to Engage messaging templates, validates all elements in emails, then removes them and verifies removal",
		);

		await allure.step("Create a new Engagement survey", async () => {
			await surveyPage.createNewSurvey(surveyName);
		});

		await allure.step(
			"Add a section and question to the Engage survey",
			async () => {
				const newSectionToAdd = CommonUtils.generateRandomText(5);
				const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
				await surveyBuildEditPage.addSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: "Rating Scale",
					questionName: "Rating Scale",
				});
			},
		);

		await allure.step(
			"Add header image to both Engage messaging templates",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await PwActions.waitAndClick(
					thrivePage,
					engageConfigurePage.btnMessage,
				);
				await CommonUtils.sleep(2); // Wait for messaging page to load

				// Loop through all Engage messaging templates and add header image
				for (const template of constants.engageMessagingTemplates) {
					await engageConfigurePage.addHeaderImageToMailContent(
						template,
						surveyName,
					);
				}
			},
		);

		await allure.step(
			"Add custom branding to both Engage messaging templates",
			async () => {
				// Loop through all Engage messaging templates and add custom branding
				for (const template of constants.engageMessagingTemplates) {
					await engageConfigurePage.addCustomBrandingToMailContent(
						template,
						surveyName,
					);
				}
			},
		);

		await allure.step(
			"Add all survey variables to Engage messaging template",
			async () => {
				// Add all variables to the Invite to take survey template
				const variableNames = surveyVariables.map((v) => v.name);
				await engageConfigurePage.addMultipleVariablesToTemplate(
					constants.engageMessagingTemplates[0],
					variableNames,
				);
			},
		);

		await allure.step("Add participant to the Engage survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch the Engage survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step(
			"Verify header image, custom branding, and variables appear in the invitation email",
			async () => {
				const senderEmail = envDetails.senderEmail;
				const receiverEmail = constants.engage_email;
				const emailSubject = constants.engage_email_subject;
				// Use survey name for searching to ensure we find the correct email from this test run
				const editedEmailBodySearch = surveyName;

				// Fetch the header image and branding image URLs from the invitation email (using edited body search since variables were added)
				const inviteImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: receiverEmail,
					subject: emailSubject,
					body: editedEmailBodySearch,
					returnImages: { header: true, branding: true },
				});

				// Verify that header image exists in the invitation email
				const downloadedHeaderImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					inviteImageUrls.header,
					"header_image_invite_1.png",
				);
				await CommonUtils.compareImages(
					downloadedHeaderImagePath,
					constants.Custom_Header_Img,
					60,
				);
				await commonutils.deleteFile(downloadedHeaderImagePath);
				const downloadedBrandingImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					inviteImageUrls.branding,
					"branding_image_invite_1.jpeg",
				);
				await CommonUtils.compareImages(
					downloadedBrandingImagePath,
					constants.Department_cropped_Img,
					60,
				);
				await commonutils.deleteFile(downloadedBrandingImagePath);

				// Fetch email content and survey URL in parallel
				const [emailContent, fetchedSurveyUrl] = await Promise.all([
					readEmail.fetch_mail_content_from_gmail({
						from: senderEmail,
						to: receiverEmail,
						subject: emailSubject,
						body: editedEmailBodySearch,
					}),
					readEmail.fetch_survey_url_from_email({
						from: senderEmail,
						to: receiverEmail,
						subject: emailSubject,
						body: editedEmailBodySearch,
					}),
				]);
				surveyUrl = fetchedSurveyUrl; // Store in outer scope for use in reminder verification

				// Verify survey URL exists
				expect(surveyUrl, "Survey URL should exist in email").not.toBeNull();

				// Verify all variable values appear in the email body
				const expectedEmailValues = [
					surveyName,
					surveyUrl,
					companyName,
					constants.engageParticipant1.split(" ")[0], // Employee first name
					constants.engageParticipant1, // Employee full name
				];
				CommonUtils.verifyStringContainsAll(emailContent, expectedEmailValues);
			},
		);

		await allure.step(
			"Add all survey variables to Engage reminder template",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await PwActions.waitAndClick(
					thrivePage,
					engageConfigurePage.btnMessage,
				);
				await CommonUtils.sleep(2);

				// Add all variables to the Survey reminder template
				const variableNames = surveyVariables.map((v) => v.name);
				await engageConfigurePage.addMultipleVariablesToTemplate(
					constants.engageMessagingTemplates[1],
					variableNames,
				);
			},
		);

		await allure.step("Send reminder email to the participant", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await CommonUtils.sleep(2);
			await engageDistributionPage.SendReminder();
			await CommonUtils.sleep(3); // Wait for reminder email to be sent
		});

		await allure.step(
			"Verify header image, custom branding, and variables appear in the first reminder email",
			async () => {
				const senderEmail = envDetails.senderEmail;
				const receiverEmail = constants.engage_email;
				const reminderSubject = constants.engage_email_reminder_subject;
				// Use survey name for searching to ensure we find the correct email from this test run
				const editedReminderBodySearch = surveyName;

				// Fetch the header image and branding URLs from the reminder email (using edited body search since variables were added)
				const reminderImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: receiverEmail,
					subject: reminderSubject,
					body: editedReminderBodySearch,
					returnImages: { header: true, branding: true },
				});
				const downloadedHeaderImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reminderImageUrls.header,
					"header_image_reminder_1.png",
				);
				await CommonUtils.compareImages(
					downloadedHeaderImagePath,
					constants.Custom_Header_Img,
					60,
				);
				await commonutils.deleteFile(downloadedHeaderImagePath);

				const downloadedBrandingImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reminderImageUrls.branding,
					"branding_image_reminder_1.jpeg",
				);
				await CommonUtils.compareImages(
					downloadedBrandingImagePath,
					constants.Department_cropped_Img,
					60,
				);
				await commonutils.deleteFile(downloadedBrandingImagePath);

				// Fetch reminder email content
				const reminderEmailContent =
					await readEmail.fetch_mail_content_from_gmail({
						from: senderEmail,
						to: receiverEmail,
						subject: reminderSubject,
						body: editedReminderBodySearch,
					});

				// Verify all variable values appear in the reminder email body (using surveyUrl from invite email)
				const expectedReminderEmailValues = [
					surveyName,
					surveyUrl,
					companyName,
					constants.engageParticipant1.split(" ")[0], // Employee first name
					constants.engageParticipant1, // Employee full name
				];
				CommonUtils.verifyStringContainsAll(
					reminderEmailContent,
					expectedReminderEmailValues,
				);
			},
		);

		await allure.step(
			"Add two participants under the same manager",
			async () => {
				await surveyPage.navigateTopSections("Distribution");

				// Add first participant to shortlist
				await engageDistributionPage.addParticipantsInLiveSurvey(
					constants.subjectName,
					surveyName,
				);
				await CommonUtils.sleep(2);

				// Add second participant to shortlist
				await engageDistributionPage.addParticipantsInLiveSurvey(
					constants.subjectName2,
					surveyName,
				);
				await CommonUtils.sleep(2);

				// Invite both participants in bulk
				await engageDistributionPage.inviteParticipantsFromShortlisted("bulk");
			},
		);

		await allure.step("First participant attends the survey", async () => {
			cookieValue = await thrivePage.context().cookies();
			const surveyUrl1 = await readEmail.fetch_survey_url_from_email({
				from: envDetails.senderEmail,
				to: constants.subject_email,
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(constants.subjectName, surveyName),
			});

			const surveyEUIPage = poManager.getSurveyEUIPage();
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl1,
				browser,
			});
			await CommonUtils.sleep(2);
		});

		await allure.step("Second participant attends the survey", async () => {
			const surveyUrl2 = await readEmail.fetch_survey_url_from_email({
				from: envDetails.senderEmail,
				to: constants.subject_email2,
				subject: constants.engage_email_subject,
				body: constants.getEngageEmailBody(constants.subjectName2, surveyName),
			});

			const surveyEUIPage = poManager.getSurveyEUIPage();
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl2,
				browser,
			});
			await CommonUtils.sleep(2); // Wait for report to be generated
		});

		await allure.step(
			"Verify header image and custom branding appear in the manager report ready email",
			async () => {
				const senderEmail = envDetails.senderEmail;
				const receiverEmail = constants.managerEmail;
				const reportReadySubject = constants.managerReportReadyEmailSubject;
				const emailBody = constants.getEngageManagerReportEmailBody(
					constants.managerName,
					surveyName,
				);

				// Fetch the header image and branding URLs from the report ready email
				const reportReadyImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: receiverEmail,
					subject: reportReadySubject,
					body: emailBody,
					returnImages: { header: true, branding: true },
				});

				// Verify that header image exists in the report ready email
				expect(reportReadyImageUrls.header).not.toBeNull();
				const downloadedHeaderImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reportReadyImageUrls.header,
					"header_image_report_ready_1.jpg",
				);
				await CommonUtils.compareImages(
					downloadedHeaderImagePath,
					constants.Custom_Header_Img,
					60,
				);
				await commonutils.deleteFile(downloadedHeaderImagePath);

				// Verify that custom branding image exists in the report ready email
				expect(reportReadyImageUrls.branding).not.toBeNull();
				const downloadedBrandingImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reportReadyImageUrls.branding,
					"branding_image_report_ready_1.png",
				);
				await CommonUtils.compareImages(
					downloadedBrandingImagePath,
					constants.Department_cropped_Img,
					60,
				);
				await commonutils.deleteFile(downloadedBrandingImagePath);
			},
		);

		await allure.step(
			"Remove header image from both Engage messaging templates",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await PwActions.waitAndClick(
					thrivePage,
					engageConfigurePage.btnMessage,
				);
				await CommonUtils.sleep(2);

				// Loop through all Engage messaging templates and remove header image
				for (const template of constants.engageMessagingTemplates) {
					await engageConfigurePage.removeHeaderImageFromMailContent(
						template,
						surveyName,
					);
				}
			},
		);

		await allure.step(
			"Remove custom branding from both Engage messaging templates",
			async () => {
				// Loop through all Engage messaging templates and remove custom branding
				for (const template of constants.engageMessagingTemplates) {
					await engageConfigurePage.removeCustomBrandingFromMailContent(
						template,
						surveyName,
					);
				}
			},
		);

		await allure.step(
			"Add second participant using Add More button",
			async () => {
				await surveyPage.navigateTopSections("Distribution");

				// Add participant to shortlist using existing function
				await engageDistributionPage.addParticipantsInLiveSurvey(
					constants.engageParticipant2Email,
					surveyName,
				);
				await engageDistributionPage.inviteParticipantsFromShortlisted("bulk");
			},
		);

		await allure.step(
			"Verify header image and custom branding are removed from the second invitation email",
			async () => {
				const senderEmail = envDetails.senderEmail;
				const receiverEmail = constants.engageParticipant2Email;
				const emailSubject = constants.engage_email_subject;
				const emailBody = constants.getEngageEmailBody(
					constants.engageParticipant2,
					surveyName,
				);

				// Fetch the email images from the invitation email
				const inviteImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: receiverEmail,
					subject: emailSubject,
					body: emailBody,
					returnImages: { header: true, branding: true },
				});

				// Verify that header image is the default one (not custom departcoverimg)
				const downloadedHeaderImagePath2 = await PwActions.downloadFileFromUrl(
					thrivePage,
					inviteImageUrls.header,
					"default_header_image_invite_2.jpg",
				);
				await CommonUtils.compareImages(
					downloadedHeaderImagePath2,
					constants.Email_Header_Img,
					60,
				);
				await commonutils.deleteFile(downloadedHeaderImagePath2);

				// Verify that custom branding is removed (default branding should be present)
				const hasBrandingImage =
					inviteImageUrls.branding &&
					inviteImageUrls.branding.includes("departcoverimg");
				expect(hasBrandingImage).toBe(false);
			},
		);

		await allure.step(
			"Send reminder email to the second participant",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await CommonUtils.sleep(2);
				await engageDistributionPage.SendReminder();
				await CommonUtils.sleep(3); // Wait for reminder email to be sent
			},
		);

		await allure.step(
			"Verify header image and custom branding are removed from the second reminder email",
			async () => {
				const senderEmail = envDetails.senderEmail;
				const receiverEmail = constants.engageParticipant2Email;
				const reminderSubject = constants.engage_email_reminder_subject;
				const emailBody = constants.getEngageEmailReminderBody(
					constants.engageParticipant2,
					surveyName,
				);

				// Fetch the email images from the reminder email
				const reminderImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: receiverEmail,
					subject: reminderSubject,
					body: emailBody,
					returnImages: { header: true, branding: true },
				});

				// Verify header image is the default one (not custom departcoverimg)
				const downloadedHeaderImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reminderImageUrls.header,
					"default_header_image_reminder_2.jpg",
				);
				await CommonUtils.compareImages(
					downloadedHeaderImagePath,
					constants.Email_Header_Img,
					5,
				);
				await commonutils.deleteFile(downloadedHeaderImagePath);

				// Verify that custom branding is removed (default branding should be present)
				const hasBrandingImage =
					reminderImageUrls.branding &&
					reminderImageUrls.branding.includes("departcoverimg");
				expect(hasBrandingImage).toBe(false);
			},
		);
	});

	test("TC_02 Verify adding and removing header image and custom branding to Pulse messaging templates with email verification @regression @engage", async ({
		thrivePage,
		browser,
	}) => {
		const surveyName = `Automation Pulse Survey ${time}`;
		let cookieValue;

		// Get survey variables from constants
		const surveyVariables = constants.surveyVariables;

		await allure.description(
			"This test verifies adding header images, custom branding, and variables to Pulse messaging templates, validates images and variables in invitation and reminder emails, removes header/branding before attending survey, then participants attend survey, and validates removal in manager report ready email",
		);

		await allure.step("Create a new Pulse survey", async () => {
			await surveyPage.createNewSurvey(surveyName);
		});

		await allure.step(
			"Add a section and question to the Pulse survey",
			async () => {
				const newSectionToAdd = CommonUtils.generateRandomText(5);
				const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
				await surveyBuildEditPage.addSection(
					newSectionToAdd,
					newsectionDescriptionToAdd,
				);
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: "Rating Scale",
					questionName: "Rating Scale",
				});
			},
		);

		await allure.step(
			"Add header image to both Pulse messaging templates",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await PwActions.waitAndClick(
					thrivePage,
					engageConfigurePage.btnMessage,
				); // Wait for messaging page to load

				// Loop through all Pulse messaging templates and add header image
				for (const template of constants.engageMessagingTemplates) {
					await engageConfigurePage.addHeaderImageToMailContent(
						template,
						surveyName,
					);
				}
			},
		);

		await allure.step(
			"Add custom branding to both Pulse messaging templates",
			async () => {
				// Loop through all Pulse messaging templates and add custom branding
				for (const template of constants.engageMessagingTemplates) {
					await engageConfigurePage.addCustomBrandingToMailContent(
						template,
						surveyName,
					);
				}
			},
		);

		await allure.step(
			"Add all survey variables to Pulse invite template",
			async () => {
				const variableNames = surveyVariables.map((v) => v.name);
				await engageConfigurePage.addMultipleVariablesToTemplate(
					constants.engageMessagingTemplates[0], // "Invite to take survey"
					variableNames,
				);
			},
		);

		await allure.step(
			"Configure Pulse survey frequency - REQUIRED BEFORE LAUNCH",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				// Get fresh timestamp to ensure frequency is set in the future
				const currentTime = commonutils.getCurrentTime();
				await engageConfigurePage.setFrequencyForMonths(currentTime);
				await CommonUtils.sleep(3); // Wait for frequency to be configured
			},
		);

		await allure.step(
			"Add two participants under the same manager to the Pulse survey",
			async () => {
				await surveyPage.navigateTopSections("Distribution");

				// Add first participant
				await engageDistributionPage.addParticipantsInSurvey(
					constants.subjectName,
				);

				// Add second participant
				await engageDistributionPage.addAdditionalParticipants(
					constants.subjectName2,
				);
			},
		);

		await allure.step("Launch the Pulse survey", async () => {
			await surveyLaunchPage.launchPulseSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(120); // Wait for Pulse survey to be fully launched (2 minutes)
		});

		await allure.step(
			"Verify header image, custom branding, and variables appear in the invitation emails",
			async () => {
				const senderEmail = envDetails.senderEmail;

				// Verify first participant's invitation email
				const emailSubject = constants.engage_email_subject;
				const emailBody1 = constants.getPulseEmailBody(
					constants.subjectName,
					surveyName,
				);

				const inviteImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: constants.subject_email,
					subject: emailSubject,
					body: emailBody1,
					returnImages: { header: true, branding: true },
				});

				// Verify that header image exists in the invitation email
				expect(inviteImageUrls.header).not.toBeNull();
				const downloadedHeaderImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					inviteImageUrls.header,
					"pulse_header_image_invite.jpg",
				);
				await CommonUtils.compareImages(
					downloadedHeaderImagePath,
					constants.Custom_Header_Img,
					60,
				);
				await commonutils.deleteFile(downloadedHeaderImagePath);

				// Verify that custom branding image exists in the invitation email
				expect(inviteImageUrls.branding).not.toBeNull();
				const downloadedBrandingImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					inviteImageUrls.branding,
					"pulse_branding_image_invite.png",
				);
				await CommonUtils.compareImages(
					downloadedBrandingImagePath,
					constants.Department_cropped_Img,
					60,
				);
				await commonutils.deleteFile(downloadedBrandingImagePath);

				// Fetch email content to verify variables
				const emailContent = await readEmail.fetch_mail_content_from_gmail({
					from: senderEmail,
					to: constants.subject_email,
					subject: emailSubject,
					body: emailBody1,
				});

				// Verify variable values appear in the email body
				const expectedEmailValues = [
					surveyName,
					constants.subjectName.split(" ")[0], // Employee first name
					constants.subjectName, // Employee full name
				];
				CommonUtils.verifyStringContainsAll(emailContent, expectedEmailValues);
			},
		);

		await allure.step(
			"Remove header image from both Pulse messaging templates BEFORE attending survey",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await PwActions.waitAndClick(
					thrivePage,
					engageConfigurePage.btnMessage,
				);
				await CommonUtils.sleep(2);

				// Loop through all Pulse messaging templates and remove header image
				for (const template of constants.engageMessagingTemplates) {
					await engageConfigurePage.removeHeaderImageFromMailContent(
						template,
						surveyName,
					);
					await engageConfigurePage.removeCustomBrandingFromMailContent(
						template,
						surveyName,
					);
				}
			},
		);

		await allure.step(
			"Add all survey variables to Pulse reminder template",
			async () => {
				const variableNames = surveyVariables.map((v) => v.name);
				await engageConfigurePage.addMultipleVariablesToTemplate(
					constants.engageMessagingTemplates[1], // "Survey reminder"
					variableNames,
				);
			},
		);

		await allure.step(
			"Send reminder email to the participants BEFORE attending survey",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await CommonUtils.sleep(1);
				await engageDistributionPage.SendReminder();
				await CommonUtils.sleep(2); // Wait for reminder email to be sent
			},
		);

		await allure.step(
			"Verify header image, custom branding removed and variables appear in the Pulse reminder email",
			async () => {
				const senderEmail = envDetails.senderEmail;
				const receiverEmail = constants.subject_email;
				const reminderSubject = constants.engage_email_reminder_subject;
				const emailBody = constants.getPulseEmailReminderBody(
					constants.subjectName,
					surveyName,
				);

				// Fetch the email images from the reminder email
				const reminderImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: receiverEmail,
					subject: reminderSubject,
					body: emailBody,
					returnImages: { header: true, branding: true },
				});

				// Verify header image is the default one (not custom departcoverimg)
				const downloadedHeaderImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reminderImageUrls.header,
					"pulse_default_header_image_reminder.jpg",
				);
				await CommonUtils.compareImages(
					downloadedHeaderImagePath,
					constants.Email_Header_Img,
					60,
				);
				await commonutils.deleteFile(downloadedHeaderImagePath);

				// Verify that custom branding is removed (default branding should be present)
				const hasBrandingImage =
					reminderImageUrls.branding &&
					reminderImageUrls.branding.includes("departcoverimg");
				expect(hasBrandingImage).toBe(false);

				// Fetch reminder email content to verify variables
				const reminderEmailContent =
					await readEmail.fetch_mail_content_from_gmail({
						from: senderEmail,
						to: receiverEmail,
						subject: reminderSubject,
						body: emailBody,
					});

				// Verify variable values appear in the reminder email body
				const expectedReminderValues = [
					surveyName,
					constants.subjectName.split(" ")[0], // Employee first name
					constants.subjectName, // Employee full name
				];
				CommonUtils.verifyStringContainsAll(
					reminderEmailContent,
					expectedReminderValues,
				);
			},
		);

		await allure.step(
			"First participant attends the Pulse survey",
			async () => {
				cookieValue = await thrivePage.context().cookies();
				const surveyUrl1 = await readEmail.fetch_survey_url_from_email({
					from: envDetails.senderEmail,
					to: constants.subject_email,
					subject: constants.engage_email_subject,
					body: constants.getPulseEmailBody(constants.subjectName, surveyName),
				});

				const surveyEUIPage = poManager.getSurveyEUIPage();
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyUrl1,
					browser,
				});
				await CommonUtils.sleep(2);
			},
		);

		await allure.step(
			"Second participant attends the Pulse survey",
			async () => {
				const surveyUrl2 = await readEmail.fetch_survey_url_from_email({
					from: envDetails.senderEmail,
					to: constants.subject_email2,
					subject: constants.engage_email_subject,
					body: constants.getPulseEmailBody(constants.subjectName2, surveyName),
				});

				const surveyEUIPage = poManager.getSurveyEUIPage();
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyUrl2,
					browser,
				});
				await CommonUtils.sleep(2); // Wait for report to be generated
			},
		);

		await allure.step(
			"Verify default header image and branding (removed custom) appear in the manager Pulse report ready email",
			async () => {
				const senderEmail = envDetails.senderEmail;
				const receiverEmail = constants.managerEmail;
				const reportReadySubject = constants.managerReportReadyEmailSubject;
				const emailBody = constants.getPulseManagerReportEmailBody(
					constants.managerName,
					surveyName,
				);

				// Fetch the header image and branding URLs from the report ready email
				const reportReadyImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: receiverEmail,
					subject: reportReadySubject,
					body: emailBody,
					returnImages: { header: true, branding: true },
				});

				// Verify that header image is the default one (custom was removed)
				const downloadedHeaderImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reportReadyImageUrls.header,
					"pulse_default_header_image_report_ready.jpg",
				);
				await CommonUtils.compareImages(
					downloadedHeaderImagePath,
					constants.Email_Header_Img,
					60,
				);
				await commonutils.deleteFile(downloadedHeaderImagePath);

				// Verify that custom branding is removed (default branding should be present)
				const hasBrandingImage =
					reportReadyImageUrls.branding &&
					reportReadyImageUrls.branding.includes("departcoverimg");
				expect(hasBrandingImage).toBe(false);
			},
		);
		await allure.step("Pause the Pulse survey", async () => {
			await engageConfigurePage.pausePulseSurvey();
		});
	});

	test("TC_03 TEG-12530 verifying whether Apply this change for all templates is working for Custom Branding late @regression @messaging ", async ({
		thrivePage,
		browser,
	}) => {
		const surveyName = `Automation Engage Survey ${time}`;
		let cookieValue;

		await allure.description(
			"This test verifies that the 'Apply this change for all templates' checkbox works correctly for custom branding. It adds custom branding to one template with the checkbox enabled, then verifies branding appears in invite, reminder, and report ready emails.",
		);

		await allure.step("Create a new Engagement survey", async () => {
			await surveyPage.createNewSurvey(surveyName);
		});

		await allure.step(
			"Add a section and question to the Engage survey",
			async () => {
				await surveyBuildEditPage.addSection(
					"Section 1",
					"Section 1 Description",
				);
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: "Section 1",
					questionType: "Rating Scale",
					questionName: "Rating Scale",
				});
			},
		);

		await allure.step(
			"Add custom branding to Engage messaging template with Apply to all templates checkbox",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await PwActions.waitAndClick(
					thrivePage,
					engageConfigurePage.btnMessage,
				);
				await CommonUtils.sleep(2);

				// Add custom branding to first template with "Apply to all templates" checkbox
				await engageConfigurePage.addCustomBrandingToAllTemplates(
					"Invite to take survey",
					surveyName,
				);
			},
		);

		// Define email details once for reuse
		const senderEmail = envDetails.senderEmail;
		const participant1Email = constants.subject_email;
		const participant2Email = constants.subject_email2;
		const emailSubject = constants.engage_email_subject;
		const reminderSubject = constants.engage_email_reminder_subject;

		await allure.step(
			"Add two participants under the same manager to the Engage survey",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPage.addParticipantsInSurvey(participant1Email);
				await CommonUtils.sleep(1);
				await engageDistributionPage.addAdditionalParticipants(
					participant2Email,
				);
			},
		);

		await allure.step("Launch the Engage survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step(
			"Verify custom branding appears in first participant's invitation email",
			async () => {
				const emailBody = constants.getEngageEmailBody(
					constants.subjectName,
					surveyName,
				);

				const inviteImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: participant1Email,
					subject: emailSubject,
					body: emailBody,
					returnImages: { branding: true },
				});

				// Verify that branding image exists in the invitation email
				expect(inviteImageUrls.branding).not.toBeNull();
				const downloadedBrandingImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					inviteImageUrls.branding,
					"branding_image_invite_tc03.jpeg",
				);
				await CommonUtils.compareImages(
					downloadedBrandingImagePath,
					constants.Department_cropped_Img,
					60,
				);
				await commonutils.deleteFile(downloadedBrandingImagePath);
			},
		);

		await allure.step("Send reminder email to participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await CommonUtils.sleep(2);
			await engageDistributionPage.SendReminder();
			await CommonUtils.sleep(3);
		});

		await allure.step(
			"Verify custom branding appears in first participant's reminder email",
			async () => {
				const emailBody = constants.getEngageEmailReminderBody(
					constants.subjectName,
					surveyName,
				);

				const reminderImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: participant1Email,
					subject: reminderSubject,
					body: emailBody,
					returnImages: { branding: true },
				});

				// Verify that branding image exists in the reminder email
				expect(reminderImageUrls.branding).not.toBeNull();
				const downloadedBrandingImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reminderImageUrls.branding,
					"branding_image_reminder_tc03.jpeg",
				);
				await CommonUtils.compareImages(
					downloadedBrandingImagePath,
					constants.Department_cropped_Img,
					60,
				);
				await commonutils.deleteFile(downloadedBrandingImagePath);
			},
		);

		await allure.step("First participant attends the survey", async () => {
			cookieValue = await thrivePage.context().cookies();
			const surveyUrl1 = await readEmail.fetch_survey_url_from_email({
				from: senderEmail,
				to: participant1Email,
				subject: emailSubject,
				body: constants.getEngageEmailBody(constants.subjectName, surveyName),
			});

			const surveyEUIPage = poManager.getSurveyEUIPage();
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl1,
				browser,
			});
			await CommonUtils.sleep(2);
		});

		await allure.step("Second participant attends the survey", async () => {
			const surveyUrl2 = await readEmail.fetch_survey_url_from_email({
				from: senderEmail,
				to: participant2Email,
				subject: emailSubject,
				body: constants.getEngageEmailBody(constants.subjectName2, surveyName),
			});

			const surveyEUIPage = poManager.getSurveyEUIPage();
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl2,
				browser,
			});
			await CommonUtils.sleep(2);
		});

		await allure.step(
			"Verify custom branding appears in the manager report ready email",
			async () => {
				const managerEmail = constants.managerEmail;
				const reportReadySubject = constants.managerReportReadyEmailSubject;
				const emailBody = constants.getEngageManagerReportEmailBody(
					constants.managerName,
					surveyName,
				);

				const reportReadyImageUrls = await readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: managerEmail,
					subject: reportReadySubject,
					body: emailBody,
					returnImages: { branding: true },
				});

				// Verify that branding image exists in the report ready email
				expect(reportReadyImageUrls.branding).not.toBeNull();
				const downloadedBrandingImagePath = await PwActions.downloadFileFromUrl(
					thrivePage,
					reportReadyImageUrls.branding,
					"branding_image_report_ready_tc03.jpeg",
				);
				await CommonUtils.compareImages(
					downloadedBrandingImagePath,
					constants.Department_cropped_Img,
					60,
				);
				await commonutils.deleteFile(downloadedBrandingImagePath);
			},
		);
	});
});

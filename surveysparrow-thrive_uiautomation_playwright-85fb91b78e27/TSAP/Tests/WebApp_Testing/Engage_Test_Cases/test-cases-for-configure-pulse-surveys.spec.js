import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { generateRandomQuestionType } from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EUI } from "../../../Pages/Surveys/Attend_Survey/attend-survey-EUI-page.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";

test.describe("Attend pulse survey", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let surveyLaunch;
	let SurveySharePage;
	let surveyParticipantsPage;
	let surveyBuildEditPage;
	let EngageSurveyConfigure;
	let engageDistributionPage;
	let surveyEUIPage;
	let commonutils;
	let time;
	let cookieValue;
	let survey_url1;
	let survey_url2;
	let surveyStatus;
	let emailContent;
	let configurePage;
	let readEmail;
	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyEUIPage = poManager.getSurveyEUIPage();
		commonFunctions = poManager.getCommonPageFunctions();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		surveyPage = poManager.getSurveyPage();
		time = commonutils.getCurrentTime();
		cookieValue = "";
		configurePage = poManager.getPerformanceConfigurePage();
		readEmail = new ReadEmail();
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

	test("TC_01_Adding Survey cut-off date for an Pulse Survey and user is able to attend the survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		await allure.description(
			"This test Create Non-anonymous Pulse survey manually with Email Share",
		);
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
			},
		);
		await allure.step("Enable non-anonymous toggle in configure", async () => {
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.verifyAvailabilityOfSurveyNotificationOptions();
			await EngageSurveyConfigure.nonAnonymousSurvey();
			await EngageSurveyConfigure.setFrequencyForMonths(time);
		});

		await allure.step("Set frequency in configure page", async () => {
			await EngageSurveyConfigure.cutOffDates(time, "8");
			await EngageSurveyConfigure.proceedSetCutOffDate();
		});

		await allure.step("Share the Pulse survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engage_email,
			);
			await engageDistributionPage.addAdditionalParticipants(
				constants.engageParticipant2Email,
			);
		});

		await allure.step("Launch the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(130);
		});

		await allure.step("Verify the survey is launched", async () => {
			survey_url1 = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getPulseEmailBody(
					constants.engageParticipant1,
					EntityIds.surveyName,
				),
			);
			survey_url2 = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.engageParticipant2Email,
				constants.getPulseEmailBody(
					constants.engageParticipant2,
					EntityIds.surveyName,
				),
			);
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: survey_url1,
				browser,
			});
		});
		await allure.step(
			"Change the cut off date and make the survey completed",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await PwActions.pageRefresh(thrivePage);
				time = commonutils.getCurrentTime();
				await EngageSurveyConfigure.cutOffDates(time, "2");
				await EngageSurveyConfigure.proceedSetCutOffDate();
				await CommonUtils.sleep(130);
				surveyStatus = await surveyPage.getSurveyStatusFromInsideSurvey();
				expect(surveyStatus).toBe("Completed");
				await surveyEUIPage.verifySurveyCutOffTime(
					survey_url2,
					browser,
					cookieValue,
				);
			},
		);
	});

	test("TC_02_Adding Survey cut-off date for an Pulse Survey and user should not be attend the survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const newSectionToAdd = CommonUtils.generateRandomText(5);
		const newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		await allure.description(
			"This test Create Non-anonymous Pulse survey manually with Email Share",
		);
		await allure.step("Creating a Pulse survey", async () => {
			await surveyPage.createNewSurvey(`Pulse Survey Cut off date${time}`);
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
			},
		);
		await allure.step("Enable non-anonymous toggle in configure", async () => {
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.setFrequencyForMonths(time);
		});

		await allure.step("Set frequency in configure page", async () => {
			await EngageSurveyConfigure.cutOffDates(time, "5");
			await EngageSurveyConfigure.proceedSetCutOffDate();
		});

		await allure.step("Share the Pulse survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(300);
		});

		await allure.step("Verify the survey is launched", async () => {
			survey_url1 = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.engageParticipant1Email,
				constants.getPulseEmailBody(
					constants.engageParticipant1,
					EntityIds.surveyName,
				),
			);
			await surveyEUIPage.verifySurveyCutOffTime(
				survey_url1,
				browser,
				cookieValue,
			);
		});
		await allure.step(
			"Change the cut off date and verify the survey is not completed",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await EngageSurveyConfigure.deleteCutOffDate();
				await CommonUtils.sleep(2);
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: survey_url1,
					browser,
				});
			},
		);
	});
	test("TC_03_Verifying the Language Preferences configuration for pulse surveys @Regression", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test Verifying the Language Preferences configuration for pulse surveys",
		);

		await allure.step("Creating a Pulse survey", async () => {
			await surveyPage.createNewSurvey(`pulse survey ${time}`);
			cookieValue = await thrivePage.context().cookies();
		});

		await allure.step(
			"Add sections and questions in the Pulse survey",
			async () => {
				await surveyBuildEditPage.addMultipleSectionsAndQuestions(
					1,
					1,
					"Rating Scale",
				);
			},
		);
		await allure.step("Add Tamil and Malayalam languages", async () => {
			await surveyBuildEditPage.searchAndAddLanguage("Tamil");
			await surveyBuildEditPage.searchAndAddLanguage("Malayalam");
		});
		await allure.step("Set Malayalam as source language", async () => {
			await surveyBuildEditPage.changeSourceLanguage("Malayalam");
		});
		await allure.step(
			"Set Show Surveys to preferred language with translation switching enabled",
			async () => {
				time = commonutils.getCurrentTime();
				await surveyPage.navigateTopSections("Configure");
				await EngageSurveyConfigure.setFrequencyForMonths(time);
				await configurePage.configureShowSurveyInLanguage({
					sourceLanguage: false,
					preferredLanguage: true,
					respondentsCanSwitchBetweenTranslations: true,
				});
				await CommonUtils.sleep(1);
			},
		);

		await allure.step("Set Send Emails to preferred language", async () => {
			await configurePage.configureSettingsSendEmails({
				sourceLanguage: false,
				preferredLanguage: true,
			});
			await CommonUtils.sleep(1);
		});
		await allure.step("Share the Pulse survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInSurvey(
				constants.subject_email,
			);
		});
		await allure.step("Launch the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(130);
		});
		await allure.step(
			"Verify invitation email is sent in respondent's preferred language (Tamil)",
			async () => {
				await allure.step(
					"Fetch subject's invitation email and verify language is Tamil",
					async () => {
						emailContent = await readEmail.fetch_mail_content_from_gmail({
							to: constants.subject_email,
							body: EntityIds.surveyName,
						});
						survey_url1 = await commonFunctions.open_survey_from_received_email(
							"",
							constants.subject_email,
							EntityIds.surveyName,
						);
						const emailBodyLanguage =
							await commonutils.getTextLanguage(emailContent);
						expect(emailBodyLanguage).toBe("Tamil");
					},
				);
			},
		);
		await allure.step(
			"Verify the survey eui page is in Tamil language",
			async () => {
				const page2 = await PwActions.openNewTab(browser);
				await PwActions.goTo(page2, survey_url1);
				await surveyEUIPage.verifyLanguageInEUI(
					page2,
					"Tamil",
					cookieValue,
					constants.subjectName,
					["Don't choose language"],
				);
				await PwActions.closeTab(page2);
			},
		);
		await allure.step(
			"Reconfigure Show Surveys and Send Emails to use source language (Malayalam)",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await configurePage.configureShowSurveyInLanguage({
					sourceLanguage: true,
					preferredLanguage: false,
					respondentsCanSwitchBetweenTranslations: true,
				});
				await configurePage.configureSettingsSendEmails({
					sourceLanguage: true,
					preferredLanguage: false,
				});
				await CommonUtils.sleep(1);
			},
		);
		await allure.step("Add additional participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInLiveSurvey(
				constants.engageParticipant2Email,
				"Pulse",
			);
			await allure.step("Start next round in pulse", async () => {
				await surveyPage.navigateTopSections("Configure");
				time = commonutils.getCurrentTime();
				await EngageSurveyConfigure.setFrequencyForMonths(time, "livesurvey");
				await CommonUtils.sleep(130);
			});
		});
		await allure.step(
			"Verify invitation email is sent in respondent's source language (Malayalam)",
			async () => {
				await allure.step(
					"Fetch subject's invitation email and verify language is Malayalam",
					async () => {
						emailContent = await readEmail.fetch_mail_content_from_gmail({
							to: constants.engageParticipant2Email,
							body: EntityIds.surveyName,
						});
						survey_url1 = await commonFunctions.open_survey_from_received_email(
							"",
							constants.engageParticipant2Email,
							EntityIds.surveyName,
						);
						const emailBodyLanguage =
							await commonutils.getTextLanguage(emailContent);
						expect(emailBodyLanguage).toBe("Malayalam");
					},
				);
			},
		);
		await allure.step(
			"Verify the survey eui page is in Malayalam language",
			async () => {
				const page2 = await PwActions.openNewTab(browser);
				await PwActions.goTo(page2, survey_url1);
				await surveyEUIPage.verifyLanguageInEUI(
					page2,
					"Malayalam",
					cookieValue,
					constants.engageParticipant2,
					["Don't choose language"],
				);
				await PwActions.closeTab(page2);
			},
		);
		await allure.step("Add additional participants", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPage.addParticipantsInLiveSurvey(
				constants.engageParticipant3Email,
				"Pulse",
			);
		});
		await allure.step("Start next round in pulse", async () => {
			await surveyPage.navigateTopSections("Configure");
			time = commonutils.getCurrentTime();
			await EngageSurveyConfigure.setFrequencyForMonths(time, "livesurvey");
			await CommonUtils.sleep(130);
		});
		await allure.step(
			"Verify invitation email is sent in respondent's source language (Malayalam)",
			async () => {
				await allure.step(
					"Fetch subject's invitation email and verify language is Malayalam and change the language to Tamil and attend the survey",
					async () => {
						survey_url1 = await commonFunctions.open_survey_from_received_email(
							"",
							constants.engageParticipant3Email,
							EntityIds.surveyName,
						);
						const page2 = await PwActions.openNewTab(browser);
						await PwActions.goTo(page2, survey_url1);
						await surveyEUIPage.verifyLanguageInEUI(
							page2,
							"Tamil",
							cookieValue,
							constants.engageParticipant3,
						);
						await PwActions.closeTab(page2);
					},
				);
			},
		);
	});
});

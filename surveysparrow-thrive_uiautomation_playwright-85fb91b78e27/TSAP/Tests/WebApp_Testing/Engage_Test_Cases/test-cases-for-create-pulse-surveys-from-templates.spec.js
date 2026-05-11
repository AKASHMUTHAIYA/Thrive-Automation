import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { generateRandomTemplate } from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import { expect } from "@playwright/test";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { envDetails } from "../../../Data/test-data.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

let poManager;
let commonFunctions;
let surveyPage;
let surveyLaunch;
let engageDistributionPagePage;
let EngageSurveyConfigure;
let commonutils;
let time;
let readEmail;
let surveyName;
let SurveyEuiPage;
let surveyUrl;
let cookieValue;
let templatesNames;

test.beforeEach(async ({ thrivePage }) => {
	poManager = new POManager(thrivePage);
	commonutils = new CommonUtils();
	readEmail = new ReadEmail();
	SurveyEuiPage = poManager.getSurveyEUIPage();
	commonFunctions = poManager.getCommonPageFunctions();
	EngageSurveyConfigure = poManager.getEngageConfigurePage();
	surveyPage = poManager.getSurveyPage();
	engageDistributionPagePage = poManager.getEngageDistributionPage();
	surveyLaunch = poManager.getSurveyLaunchPage();
	time = commonutils.getCurrentTime();

	await allure.step("Navigate to Pulse Survey page", async () => {
		await commonFunctions.navigateTopNavigateSection("Engage");
	});

	templatesNames = await surveyPage.getSurveyTemplatesNames("Pulse");
	const template = generateRandomTemplate(templatesNames);
	surveyName = `${template} ${time}`;

	await allure.step("Creating a Pulse Survey from template", async () => {
		await surveyPage.createSurveyFromTemplate(template, surveyName);
	});
	cookieValue = await thrivePage.context().cookies();

	await allure.step(
		"Navigate to Configure Page and set frequency",
		async () => {
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.setFrequencyForMonths(time);
		},
	);
});

test.describe("Verifying the availability of survey templates", async () => {
	test("TC_01_Verifying the availability of Pulse survey templates @Regression ", async () => {
		await allure.step(
			"Verifying the availability of Pulse survey templates",
			async () => {
				expect(templatesNames.length).toBeGreaterThanOrEqual(
					constants.minimumPulseSurveyTemplatesCount,
				);
			},
		);
	});
});
test.describe("Creating Anonymous Pulse Surveys from Templates", () => {
	test.beforeEach(async () => {
		await allure.step("Navigate to Distribution Page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});
	});

	test("TC_02_Creating an Anonymous Pulse survey from templates with Email Share @Regression", async ({
		browser,
	}) => {
		await allure.description(
			"This test creates an Anonymous Pulse survey from templates with Email Share",
		);

		await allure.step("Add participants in the Pulse survey", async () => {
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(180);
		});

		await allure.step(
			"Verify the survey is launched and attend the survey",
			async () => {
				surveyUrl = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.new_employee_email,
					constants.getPulseEmailBody(
						constants.engageParticipantName,
						surveyName,
					),
				);
				await SurveyEuiPage.attendEngagePulseSurvey({
					survey_url: surveyUrl,
					browser,
				});
			},
		);
	});

	test("TC_03_Creating an Anonymous Pulse survey from templates with QR Code Share @Regression", async ({
		browser,
	}) => {
		await allure.description(
			"This test creates an Anonymous Pulse survey from template with QR Code Share",
		);

		await allure.step("Create QR Code for Anonymous Pulse survey", async () => {
			await engageDistributionPagePage.chooseShareType("QR");
			await engageDistributionPagePage.createQRCode("QR Code", "Anonymous");
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch("QR");
			await CommonUtils.sleep(180);
		});

		await allure.step(
			"Verify whether QR Code is present in the email and attend the survey",
			async () => {
				const emailBody = constants.getQREmailBody(
					constants.managerName,
					EntityIds.surveyName,
				);
				expect(
					await readEmail.verifyQRCodeInEmail(
						envDetails.senderEmail,
						constants.subject_email,
						constants.engageQREmailSubject,
						emailBody,
					),
				).toBe(true);
				surveyUrl = await commonFunctions.open_survey_from_received_email(
					constants.engageQREmailSubject,
					constants.subject_email,
					emailBody,
				);
				await SurveyEuiPage.attendEngagePulseSurvey({
					survey_url: surveyUrl,
					browser,
				});
			},
		);
	});
});

test.describe("Creating Non-Anonymous Pulse Surveys from Templates", () => {
	test.beforeEach(async () => {
		await allure.step(
			"Enable non-anonymous toggle in configure Page set and navigate to Distribution Page",
			async () => {
				await EngageSurveyConfigure.nonAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
			},
		);
	});

	test("TC_04_Creating a Non-Anonymous Pulse survey from templates with Email Share @Regression", async ({
		browser,
	}) => {
		await allure.description(
			"This test creates a Non-anonymous Pulse survey with Email Share",
		);

		await allure.step("Add participants in the Pulse survey", async () => {
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(180);
		});

		await allure.step(
			"Verify the survey is launched and attend the survey",
			async () => {
				surveyUrl = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.new_employee_email,
					constants.getPulseEmailBody(
						constants.engageParticipantName,
						surveyName,
					),
				);
				await SurveyEuiPage.attendEngagePulseSurvey({
					survey_url: surveyUrl,
					browser,
				});
			},
		);
	});

	test("TC_05_Creating a Non-Anonymous Pulse survey from templates with QR Code Share @Regression", async ({
		browser,
	}) => {
		await allure.description(
			"This test creates a Non-Anonymous Pulse survey with QR Code Share",
		);

		await allure.step("Share the Pulse survey through QR Code", async () => {
			await engageDistributionPagePage.chooseShareType("QR");
			await engageDistributionPagePage.createQRCode("QR Code", "Non-Anonymous");
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch("QR");
			await CommonUtils.sleep(180);
		});

		await allure.step(
			"Verify whether QR Code is present in the email and attend the survey",
			async () => {
				const emailBody = constants.getQREmailBody(
					constants.managerName,
					EntityIds.surveyName,
				);
				expect(
					await readEmail.verifyQRCodeInEmail(
						envDetails.senderEmail,
						constants.subject_email,
						constants.engageQREmailSubject,
						emailBody,
					),
				).toBe(true);
				surveyUrl = await commonFunctions.open_survey_from_received_email(
					constants.engageQREmailSubject,
					constants.subject_email,
					emailBody,
				);
				await SurveyEuiPage.attendEngagePulseSurvey({
					survey_url: surveyUrl,
					browser,
				});
			},
		);
	});
	test("TC_06_Creating a Non-Anonymous Pulse survey from templates with SMS Share @Regression", async ({
		browser,
	}) => {
		await allure.step(
			"Navigate to Configure Page and Enable non-anonymous toggle and choose SMS share type",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await EngageSurveyConfigure.nonAnonymousSurvey();
				await EngageSurveyConfigure.chooseSmsShareType();
			},
		);
		await allure.step("Share the Pulse survey through SMS", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.subject_email,
			);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.checkSmsTextVisibilityInLaunchModal();
			await surveyLaunch.confirmEngageSurveyLaunch();
		});
	});
	test("TC_07_Creating a Anonymous Pulse survey from templates with SMS Share @Regression", async ({
		browser,
	}) => {
		await allure.step(
			"Navigate to Configure Page and Enable non-anonymous toggle and choose SMS share type",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await EngageSurveyConfigure.chooseSmsShareType();
			},
		);
		await allure.step("Share the Pulse survey through SMS", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.subject_email,
			);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.checkSmsTextVisibilityInLaunchModal();
			await surveyLaunch.confirmEngageSurveyLaunch();
		});
	});
});

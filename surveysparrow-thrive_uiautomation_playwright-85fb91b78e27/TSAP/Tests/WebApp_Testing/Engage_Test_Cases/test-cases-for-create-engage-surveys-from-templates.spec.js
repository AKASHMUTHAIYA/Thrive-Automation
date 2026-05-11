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
let templatesNames;
let surveyUrl;
let cookieValue;
let surveyEUIPage;

test.beforeEach(async ({ thrivePage }) => {
	poManager = new POManager(thrivePage);
	commonutils = new CommonUtils();
	readEmail = new ReadEmail();
	commonFunctions = poManager.getCommonPageFunctions();
	EngageSurveyConfigure = poManager.getEngageConfigurePage();
	surveyEUIPage = poManager.getSurveyEUIPage();
	surveyPage = poManager.getSurveyPage();
	engageDistributionPagePage = poManager.getEngageDistributionPage();
	surveyLaunch = poManager.getSurveyLaunchPage();
	time = commonutils.getCurrentTime();

	await allure.step("Navigate to Engage Survey page", async () => {
		await commonFunctions.navigateTopNavigateSection("Engage");
	});

	await allure.step("Creating a Survey from template", async () => {
		templatesNames = await surveyPage.getSurveyTemplatesNames("Engage");
		const template = generateRandomTemplate(templatesNames);
		surveyName = `${template} ${time}`;
		await surveyPage.createSurveyFromTemplate(template, surveyName);
	});
	cookieValue = await thrivePage.context().cookies();
});

test.describe("Verifying the availability of Engagement survey templates", async () => {
	test("TC_01_Verifying the availability of Engagement survey template @Regression @temp", async () => {
		await allure.step(
			"Verifying the availability of Engagement survey templates",
			async () => {
				expect(
					templatesNames.length,
					"Survey templates count is not as expected",
				).toBeGreaterThanOrEqual(constants.minimumEngageSurveyTemplatesCount);
			},
		);
	});
});

test.describe("Creating Anonymous Engagement Surveys from Templates", () => {
	test.beforeEach(async () => {
		await allure.step("Navigate to Distribution Page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});
	});

	test("TC_02_Creating an Anonymous Engagement survey from templates with Email Share @Regression @productionSanity", async ({
		browser,
	}) => {
		await allure.step("Adding participants in survey", async () => {
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
		});

		await allure.step("Verify the survey is launched", async () => {
			surveyUrl = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getEngageEmailBody(
					constants.engageParticipantName,
					surveyName,
				),
			);
		});

		await allure.step("Attend the survey", async () => {
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl,
				browser,
			});
		});
	});

	test("TC_03_Creating an Anonymous Engagement survey from templates with QR Code Share @Regression ", async ({
		browser,
	}) => {
		await allure.step("Share the Engage survey through QR Code", async () => {
			await engageDistributionPagePage.chooseShareType("QR");
			await engageDistributionPagePage.createQRCode("QR Code", "Anonymous");
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch("QR");
		});

		await allure.step(
			"Verify whether QR Code is present in the email and attend the survey",
			async () => {
				const emailBody = constants.getQREmailBody(
					constants.managerName,
					EntityIds.surveyName,
				);
				surveyUrl = await commonFunctions.open_survey_from_received_email(
					constants.engageQREmailSubject,
					constants.subject_email,
					emailBody,
				);

				expect(
					await readEmail.verifyQRCodeInEmail(
						envDetails.senderEmail,
						constants.subject_email,
						constants.engageQREmailSubject,
						emailBody,
					),
				).toBe(true);
			},
		);

		await allure.step("Attend the survey", async () => {
			await surveyEUIPage.attendEngagePulseSurvey({
				survey_url: surveyUrl,
				browser,
			});
		});
	});
});

test.describe("Creating Non-Anonymous Engagement Surveys from Templates", () => {
	test.beforeEach(async () => {
		await allure.step(
			"Navugae to Configure Page and Enable non-anonymous toggle",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await EngageSurveyConfigure.nonAnonymousSurvey();
			},
		);

		await allure.step("Navigate to Distribution Page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});
	});

	test("TC_04_Creating a Non-Anonymous Engagement survey from templates with Email Share @Regression", async ({
		browser,
	}) => {
		await allure.step("Share the Engage survey", async () => {
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
		});

		await allure.step(
			"Fetch the survey URL and attend the survey",
			async () => {
				surveyUrl = await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.new_employee_email,
					constants.getEngageEmailBody(
						constants.engageParticipantName,
						surveyName,
					),
				);
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyUrl,
					browser,
				});
			},
		);
	});

	test("TC_05_Creating a Non-Anonymous Engagement survey from templates with QR Code Share @Regression", async ({
		browser,
	}) => {
		await allure.step(
			"Creating QR Code for Non-Anonymous Engagement survey",
			async () => {
				await engageDistributionPagePage.chooseShareType("QR");
				await engageDistributionPagePage.createQRCode("Non-Anonymous");
			},
		);

		await allure.step("Launch and verify the survey launch", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch("QR");
		});

		await allure.step(
			"Verify whether the QR Code is present in the email and attend the survey",
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
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyUrl,
					browser,
				});
			},
		);
	});
	test("TC_06_Creating a Non-Anonymous Engagement survey from templates with SMS Share @Regression", async ({
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
		await allure.step("Share the Engage survey through SMS", async () => {
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
	test("TC_07_Creating a Anonymous Engagement survey from templates with SMS Share @Regression", async ({
		browser,
	}) => {
		await allure.step(
			"Navigate to Configure Page and Enable non-anonymous toggle and choose SMS share type",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await EngageSurveyConfigure.chooseSmsShareType();
			},
		);
		await allure.step("Share the Engage survey through SMS", async () => {
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

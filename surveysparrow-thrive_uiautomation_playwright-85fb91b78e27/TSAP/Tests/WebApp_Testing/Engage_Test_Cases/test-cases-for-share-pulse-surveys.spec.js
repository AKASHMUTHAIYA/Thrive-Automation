import { allure } from "allure-playwright";
import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { generateRandomQuestionType } from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { EUI } from "../../../Pages/Surveys/Attend_Survey/attend-survey-EUI-page.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import { envDetails } from "../../../Data/test-data.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

let poManager;
let commonFunctions;
let surveyPage;
let surveyLaunchPage;
let engageDistributionPagePage;
let surveyBuildEditPage;
let EngageSurveyConfigure;
let commonutils;
let time;
let SurveyEuiPage;
let readEmail;
let newSectionToAdd;
let newsectionDescriptionToAdd;
let participantsDistributionPage;

test.beforeEach(async ({ thrivePage }) => {
	poManager = new POManager(thrivePage);
	commonutils = new CommonUtils();
	SurveyEuiPage = new EUI(thrivePage);
	readEmail = new ReadEmail();
	commonFunctions = poManager.getCommonPageFunctions();
	surveyBuildEditPage = poManager.getSurveyBuilderPage();
	EngageSurveyConfigure = poManager.getEngageConfigurePage();
	surveyPage = poManager.getSurveyPage();
	engageDistributionPagePage = poManager.getEngageDistributionPage();
	surveyLaunchPage = poManager.getSurveyLaunchPage();
	participantsDistributionPage = poManager.getParticipantsDistributionPage();
	time = commonutils.getCurrentTime();
	newSectionToAdd = CommonUtils.generateRandomText(5);
	newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);

	await allure.step("User navigates to 'Engage' tab", async () => {
		await commonFunctions.navigateTopNavigateSection("Engage");
	});

	await allure.step("Creating a Pulse survey", async () => {
		await surveyPage.createNewSurvey(`Automation Pulse Survey${time}`);
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

	await allure.step(
		"Navigate to Configure Page and set frequency",
		async () => {
			time = commonutils.getCurrentTime();
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.setFrequencyForMonths(time);
		},
	);
});

test.afterEach(async ({ thrivePage }) => {
	await allure.step("Pause the pulse survey after test", async () => {
		await PwActions.pageRefresh(thrivePage);
		await EngageSurveyConfigure.pausePulseSurvey();
	});
});

test.describe("Creating Anonymous Pulse Surveys", () => {
	test.beforeEach(async () => {
		await allure.step("Navigate to Distribution Page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});
	});

	test("TC_01_Creating Anonymous Pulse survey with Email Share @Regression @productionSanity", async () => {
		await allure.description(
			"This test creates an Anonymous Pulse survey with Email Share",
		);

		await allure.step("Share the Pulse survey", async () => {
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(180);
		});

		await allure.step("Verify the survey is launched", async () => {
			await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getPulseEmailBody(
					constants.engageParticipantName,
					EntityIds.surveyName,
				),
			);
		});
	});

	test("TC_02_Creating Anonymous Pulse survey with QR Code Share @Regression @productionSanity", async () => {
		await allure.description(
			"This test creates an Anonymous Pulse survey with QR Code Share",
		);

		await allure.step("Share the Pulse survey through QR Code", async () => {
			await engageDistributionPagePage.chooseShareType("QR");
			await engageDistributionPagePage.createQRCode("QR Code", "Anonymous");
			await participantsDistributionPage.verifyEmployeeOrQRCode(["QR Code"]);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch("QR");
			await CommonUtils.sleep(180);
		});

		await allure.step(
			"Verify whether QR Code is present in the email",
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
			},
		);
	});
});

test.describe("Creating Non-Anonymous Pulse Surveys", () => {
	test.beforeEach(async () => {
		await allure.step(
			"Enable non-anonymous toggle in configure Page and set frequency",
			async () => {
				await EngageSurveyConfigure.nonAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
			},
		);
	});

	test("TC_03_Creating Non-anonymous Pulse survey with Email Share @Regression", async () => {
		await allure.description(
			"This test creates a Non-anonymous Pulse survey with Email Share",
		);

		await allure.step("Add participants in the Pulse survey", async () => {
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(180);
		});

		await allure.step("Verify the survey is launched", async () => {
			await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getPulseEmailBody(
					constants.engageParticipantName,
					EntityIds.surveyName,
				),
			);
		});
	});

	test("TC_04_Creating Non-Anonymous Pulse survey with QR Code Share @Regression ", async () => {
		await allure.description(
			"This test creates a Non-Anonymous Pulse survey with QR Code Share",
		);

		await allure.step("Share the Pulse survey through QR Code", async () => {
			await engageDistributionPagePage.chooseShareType("QR");
			await engageDistributionPagePage.createQRCode("QR Code", "Non-Anonymous");
			await participantsDistributionPage.verifyEmployeeOrQRCode([
				`QR-${constants.managerName}`,
			]);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch("QR");
			await CommonUtils.sleep(180);
		});

		await allure.step(
			"Verify whether QR Code is present in the email",
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
			},
		);
	});
});

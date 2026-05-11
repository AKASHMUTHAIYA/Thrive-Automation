import { allure } from "allure-playwright";
import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { sharedData } from "../../../Data/Resources/shared-data.js";
import {
	generateRandomEvaluatorRole,
	generateRandomQuestionType,
	generateRandomTemplate,
} from "../../../Data/Resources/random-values.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import { envDetails } from "../../../Data/test-data.js";

let poManager;
let commonFunctions;
let surveyPage;
let surveyLaunch;
let engageDistributionPagePage;
let surveyBuildEditPage;
let EngageSurveyConfigure;
let commonutils;
let time;
let surveyEUIPage;
let newSectionToAdd;
let newsectionDescriptionToAdd;
let readEmail;
let participantsDistributionPage;
let cookieValue;
let sectionNames;
test.beforeEach(async ({ thrivePage }) => {
	poManager = new POManager(thrivePage);
	commonutils = new CommonUtils();
	surveyEUIPage = poManager.getSurveyEUIPage();
	readEmail = new ReadEmail();
	commonFunctions = poManager.getCommonPageFunctions();
	surveyBuildEditPage = poManager.getSurveyBuilderPage();
	EngageSurveyConfigure = poManager.getEngageConfigurePage();
	surveyPage = poManager.getSurveyPage();
	engageDistributionPagePage = poManager.getEngageDistributionPage();
	participantsDistributionPage = poManager.getParticipantsDistributionPage();
	surveyLaunch = poManager.getSurveyLaunchPage();
	time = commonutils.getCurrentTime();
	cookieValue = "";
	sectionNames = [];

	await allure.step("User navigates to 'Engage' tab", async () => {
		await commonFunctions.navigateTopNavigateSection("Engage");
	});

	await allure.step("Creating a Engage survey", async () => {
		await surveyPage.createNewSurvey(`Automation Engage Survey${time}`);
		cookieValue = await thrivePage.context().cookies();
	});

	await allure.step(
		"Add sections and questions in the Engage survey",

		async () => {
			for (let i = 0; i < 2; i++) {
				newSectionToAdd = CommonUtils.generateRandomText(5);
				newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
				await surveyBuildEditPage.addSection(newSectionToAdd);
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: "Rating Scale",
					questionName: "Rating Scale",
				});
				sectionNames.push(newSectionToAdd);
			}
		},
	);
});

test.describe("Creating Anonymous Engagement Surveys", () => {
	test("TC_01_Creating Anonymous Engagement survey manually with Email Share and verify that section display logic is working @Regression", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test Create Anonymous Engagement survey manually with Email Share and verify that section display logic is working",
		);

		await allure.step("Add display logic in the survey", async () => {
			await surveyBuildEditPage.addDisplayLogicInSections(sectionNames);
		});

		await allure.step("Navigate to Distribution Page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});

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
			"Verify the survey is launched and attend the survey",
			async () => {
				const survey_url =
					await commonFunctions.open_survey_from_received_email(
						constants.engage_email_subject,
						constants.new_employee_email,
						constants.getEngageEmailBody(
							constants.engageParticipantName,
							EntityIds.surveyName,
						),
					);
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url,
					browser,
					subjectName: constants.subjectName,
					settings: ["Display Logic"],
				});
			},
		);
	});

	test("TC_02_Creating Anonymous Engagement survey manually with Email Share and verify that question display logic is working @Regression ", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test Create Anonymous Engagement survey manually with Email Share and verify that question display logic is working",
		);

		await allure.step("Add display logic in the survey", async () => {
			await surveyBuildEditPage.addDisplayLogicInQuestions("Rating Scale");
		});

		await allure.step("Navigate to Distribution Page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});

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
			"Verify the survey is launched and attend the survey",
			async () => {
				const survey_url =
					await commonFunctions.open_survey_from_received_email(
						constants.engage_email_subject,
						constants.new_employee_email,
						constants.getEngageEmailBody(
							constants.engageParticipantName,
							EntityIds.surveyName,
						),
					);
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url,
					browser,
					subjectName: constants.subjectName,
					settings: ["Display Logic"],
				});
			},
		);
	});
});

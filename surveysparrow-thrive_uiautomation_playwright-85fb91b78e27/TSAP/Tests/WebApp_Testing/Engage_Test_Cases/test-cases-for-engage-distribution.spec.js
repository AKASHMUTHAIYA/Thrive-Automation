import { test } from "../../../Fixtures/application-setup";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { POManager } from "../../../Pages/POManager";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants";
import { generateRandomQuestionType } from "../../../Data/Resources/random-values";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import { envDetails } from "../../../Data/test-data";
import { generateRandomSmartListName } from "../../../Data/Resources/random-values";
import { generateRandomEmployeeProperty } from "../../../Data/Resources/random-values";

let poManager;
let commonFunctions;
let surveyPage;
let surveyLaunchPage;
let engageDistributionPage;
let surveyBuilderPage;
let commonutils;
let newSectionToAdd;
let newsectionDescriptionToAdd;
let participantsDistributionPage;
let time;
let readEmail;
let surveyEUIPage;
let cookieValue;
let departmentName;
let departmentMemberCount;
let departmentsPage;
let surveyName;
let smartListName;
let smartListMembersCount;
let smartListPage;
let peoplePage;
let qrLink;
let engageConfigurePage;

test.beforeEach(async ({ thrivePage }) => {
	poManager = new POManager(thrivePage);
	readEmail = new ReadEmail();
	commonutils = new CommonUtils();
	surveyPage = poManager.getSurveyPage();
	commonFunctions = poManager.getCommonPageFunctions();
	surveyLaunchPage = poManager.getSurveyLaunchPage();
	engageDistributionPage = poManager.getEngageDistributionPage();
	surveyBuilderPage = poManager.getSurveyBuilderPage();
	participantsDistributionPage = poManager.getParticipantsDistributionPage();
	engageConfigurePage = poManager.getEngageConfigurePage();
	surveyEUIPage = poManager.getSurveyEUIPage();
	time = commonutils.getCurrentTime();
	newSectionToAdd = CommonUtils.generateRandomText(5);
	newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
	departmentName = generateRandomEmployeeProperty().departmentName;
	departmentsPage = poManager.getDepartmentsPage();
	surveyName = `Engage Survey${time}`;
	smartListName = generateRandomSmartListName();
	smartListPage = poManager.getSmartListPage();
	peoplePage = poManager.getPeoplePage();
	await allure.step("Navigates to Engage tab", async () => {
		await commonFunctions.navigateTopNavigateSection("Engage");
	});

	await allure.step("creating Engage survey", async () => {
		await surveyPage.createNewSurvey(surveyName);
	});

	await allure.step(
		"Add section and question in Engagement Survey",
		async () => {
			await surveyBuilderPage.addSection(
				newSectionToAdd,
				newsectionDescriptionToAdd,
			);
			const question = generateRandomQuestionType();
			await surveyBuilderPage.addQuestionInSection({
				sectionName: newSectionToAdd,
				questionType: question,
				questionName: question,
			});
		},
	);
});

test.describe("Surveys Distribution page cases related to Email ", () => {
	test.beforeEach(async ({ thrivePage }) => {
		await allure.step("Navigating to Distribution page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});
	});

	test("TC_01_Shortlisting and inviting the Participants as single, bulk in Live Engagement Survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		const participants = [
			constants.engageParticipant2,
			constants.engageParticipant3,
			constants.engageParticipant4,
		];

		await allure.step("Adding participants in Engagement Survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engageParticipant1,
			);
		});

		await allure.step("Launch and verify survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch("live");
			await surveyPage.navigateTopSections("Distribution");
		});

		await allure.step("Shortlist and verify participants", async () => {
			for (const participant of participants) {
				await engageDistributionPage.addParticipantsInLiveSurvey(
					participant,
					surveyPage.survey_name,
				);
			}
			await participantsDistributionPage.verifyEmployeeOrQRCode(participants);
			await engageDistributionPage.searchEmployee(participants[0]);
		});

		await allure.step(
			"Inviting the participants  as single, bulk and verify participants",
			async () => {
				await engageDistributionPage.inviteParticipantsFromShortlisted(
					"Single",
					participants[0],
				);
				await participantsDistributionPage.navigateToTab("Invited");
				await participantsDistributionPage.verifyEmployeeOrQRCode([
					participants[0],
				]);
				await participantsDistributionPage.navigateToTab("Shortlisted");
				await engageDistributionPage.inviteParticipantsFromShortlisted("Bulk");
				await participantsDistributionPage.navigateToTab("Invited");
				await participantsDistributionPage.verifyEmployeeOrQRCode(participants);
				await engageDistributionPage.searchEmployee(participants[1]);
			},
		);

		await allure.step(
			"Verify whether user received the survey link in email and attend the survey",
			async () => {
				cookieValue = await thrivePage.context().cookies();
				const surveyUrls = await Promise.all(
					participants.map(async (participant) => {
						const emailBody = constants.getEngageEmailBody(
							participant,
							surveyPage.survey_name,
						);
						const surveyUrl = await readEmail.fetch_survey_url_from_email({
							from: envDetails.senderEmail,
							to: constants.subject_email,
							subject: constants.engage_email_subject,
							body: emailBody,
						});
						return surveyUrl;
					}),
				);
				expect(surveyUrls.length).toBe(participants.length);
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyUrls[0],
					browser,
				});
			},
		);
	});

	test("TC_02_add Participants from Department for engage @Regression", async ({
		thrivePage,
	}) => {
		await allure.step("Add Participants from Department", async () => {
			await engageDistributionPage.addParticipantsInSurvey(departmentName);
			await engageDistributionPage.fixAllManagerMissing(constants.managerName);
		});
		await allure.step("Launch the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step("Navigate to survey home page", async () => {
			await surveyPage.navigateToSurveyHomePage();
		});
		await allure.step("Get department members count", async () => {
			await commonFunctions.navigateTopNavigateSection("People");
			await peoplePage.navigateToSections("Departments");
			departmentMemberCount =
				await departmentsPage.getDepartmentMembersCount(departmentName);
		});
		await allure.step("Verify participant count", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			await surveyPage.verifySurveyParticipantsCount(
				surveyName,
				departmentMemberCount,
			);
		});
	});

	test("TC_03_add Participants from Smartlist @Regression", async ({
		thrivePage,
	}) => {
		await allure.step("Add Participants from Smartlist", async () => {
			await engageDistributionPage.addParticipantsInSurvey(smartListName);
			await engageDistributionPage.fixAllManagerMissing(constants.managerName);
			await engageDistributionPage.fixAllDepartmentMissing(departmentName);
		});
		await allure.step("Launch the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});
		await allure.step("Navigate to survey home page", async () => {
			await surveyPage.navigateToSurveyHomePage();
		});
		await allure.step("Get smartlist members count", async () => {
			await commonFunctions.navigateTopNavigateSection("People");
			smartListMembersCount =
				await smartListPage.getSmartListMembersCount(smartListName);
		});
		await allure.step("Verify participant count", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			await surveyPage.verifySurveyParticipantsCount(
				surveyName,
				smartListMembersCount,
			);
		});
	});
});
test.describe("Surveys Distribution page cases related to Non-Anonymous QR Code ", () => {
	let surveyUrl;
	test.beforeEach(async ({ thrivePage }) => {
		await allure.step(
			"Nvigate to configure page and enabble non-anonymous survey",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.nonAnonymousSurvey();
			},
		);
		await allure.step("Navigate to Distribution page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});
		await allure.step("choose share type as QR", async () => {
			await engageDistributionPage.chooseShareType("QR");
		});
	});

	test("TC_04_Downloading and copying the QR code in Non-Anonymous survey @Regression @productionSanity", async ({
		thrivePage,
	}) => {
		await allure.step("Creating QR code in Non-Anonymous survey", async () => {
			await CommonUtils.sleep(2);
			await engageDistributionPage.createQRCode("Non-Anonymous");
		});

		await allure.step("Launching the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch("QR");
		});

		await allure.step("Downloading  and verifying the QR code", async () => {
			surveyUrl = await engageDistributionPage.getQRCodeUrl(
				`QR-${constants.managerName}`,
			);

			expect(surveyUrl, "Survey URL is missing").toBeTruthy();
			expect(
				surveyUrl.startsWith("http"),
				`Invalid URL format: ${surveyUrl}. URL must start with http/https`,
			).toBeTruthy();
		});

		await allure.step("Copying the QR code", async () => {
			qrLink = await engageDistributionPage.copyQRCodeLink(
				`QR-${constants.managerName}`,
			);

			expect(
				qrLink.startsWith("http"),
				`Invalid URL format: ${qrLink}. URL must start with http/https`,
			).toBeTruthy();
		});
	});
});

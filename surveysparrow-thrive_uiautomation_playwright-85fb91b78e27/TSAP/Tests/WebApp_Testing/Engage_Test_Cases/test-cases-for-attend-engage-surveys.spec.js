import { allure } from "allure-playwright";
import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { sharedData } from "../../../Data/Resources/shared-data.js";
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
const qrTitle = "New Title";
const qrHeading = "New Heading";
const qrDescription = "New Description";

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
	newSectionToAdd = CommonUtils.generateRandomText(5);
	newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
	cookieValue = "";

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
			await surveyBuildEditPage.addSection(
				newSectionToAdd,
				newsectionDescriptionToAdd,
			);
			for (const questionType of sharedData.EngageQuestions) {
				await surveyBuildEditPage.addQuestionInSection({
					sectionName: newSectionToAdd,
					questionType: questionType,
					questionName: questionType,
				});
			}
		},
	);
});

test.describe("Creating Anonymous Engagement Surveys", () => {
	test.beforeEach(async () => {
		await allure.step("Navigate to Distribution Page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});
	});

	test("TC_01_Creating Anonymous Engagement survey manually with Email Share and attend the survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test Create Anonymous Engagement survey manually with Email Share",
		);
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
				});
			},
		);
	});

	test("TC_02_Scheduling an Engagement Survey with Email Share and attend the survey @Regression", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test Scheduling an Engagement Survey with Email Share",
		);

		await allure.step("Adding participants in the Engage survey", async () => {
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
		});

		await allure.step("Schedule the survey", async () => {
			await surveyLaunch.scheduleSurvey(time);
			await surveyLaunch.confirmEngageSurveyLaunch(null, "schedule");
		});

		await allure.step(
			"Verify the survey is scheduled  and attend the survey",
			async () => {
				CommonUtils.sleep(75);
				const survey_url =
					await commonFunctions.open_survey_from_received_email(
						constants.engage_email_subject,
						constants.new_employee_email,
						constants.getEngageEmailBody(
							constants.engageParticipant1,
							EntityIds.surveyName,
						),
					);
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url,
					browser,
				});
			},
		);
	});

	test("TC_03_Creating Anonymous Engagement survey with QR Code Share @Regression @smoke @productionSanity ", async ({
		thrivePage,
		browser,
	}) => {
		let totalEmployeesToShare;
		const qrName = "QR Code";

		await allure.description(
			"This test creates an Engagement survey shared with QR Code",
		);

		await allure.step(
			"Share the Engage survey through QR Code and create qr single QR Code and create bulk QR Code - TEG-TC-685, TEG-TC-686, TEG-TC-682, TEG-TC-681, TEG-TC-677- Verify Distribution Options for Anonymous Survey, TEG-TC-409 - Verifying a default QR is generated by selecting QR code for sharing survey, TEG-TC-660 - Verify Editing Title for the QR Code ",
			async () => {
				await engageDistributionPagePage.verifyDistributionOptions(
					"distributionOptions.jpeg",
				);
				await engageDistributionPagePage.chooseShareType("QR");
				await participantsDistributionPage.verifyEmployeeOrQRCode("QR-01");
				totalEmployeesToShare = await engageDistributionPagePage.createQRCode(
					qrName,
					"Anonymous",
				);

				await participantsDistributionPage.verifyEmployeeOrQRCode([qrName]);
				await engageDistributionPagePage.editQrCode(
					qrName,
					qrTitle,
					qrHeading,
					qrDescription,
				);

				await engageDistributionPagePage.verifyEditedQrCode(
					qrTitle,
					qrHeading,
					qrDescription,
				);

				await engageDistributionPagePage.verifyEmployeeIcons(
					totalEmployeesToShare,
				);

				const { totalValues: totalValues2, totalEmployees: totalEmployees2 } =
					await engageDistributionPagePage.createQRCodeInBulk({
						propertyName: "Department",
						propertyValues: ["Manager Team"],
						employeeNames: [
							constants.engageParticipant1,
							constants.engageParticipant2,
						],
					});
				await engageDistributionPagePage.verifyBulkQRCodes(totalValues2);

				cookieValue = await thrivePage.context().cookies();
			},
		);

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch("QR");
		});

		await allure.step(
			"Verify whether QR Code is present in the email and attend the survey TEG-TC-4017",
			async () => {
				const participants = [
					constants.managerName,
					constants.engageParticipant1,
					constants.engageParticipant2,
				];

				for (const participant of participants) {
					const emailBody = constants.getQREmailBody(
						participant,
						EntityIds.surveyName,
					);

					expect(
						await readEmail.verifyQRCodeInEmail(
							envDetails.senderEmail,
							constants.subject_email,
							constants.engageQREmailSubject,
							emailBody,
						),
					).toBeTruthy();
				}

				for (const participant of participants) {
					const emailBody = constants.getQREmailBody(
						participant,
						EntityIds.surveyName,
					);

					const surveyUrl = await readEmail.fetch_survey_url_from_email({
						from: envDetails.senderEmail,
						to: constants.subject_email,
						subject: constants.engageQREmailSubject,
						body: emailBody,
					});

					await surveyEUIPage.attendEngagePulseSurvey({
						survey_url: surveyUrl,
						browser,
					});
				}
			},
		);
	});

	test.describe("Creating Non-Anonymous Engagement Surveys", () => {
		test.beforeEach(async () => {
			await allure.step(
				"Enable non-anonymous toggle in configure Page and navigate to Distribution Page",
				async () => {
					await surveyPage.navigateTopSections("Configure");
					await EngageSurveyConfigure.nonAnonymousSurvey();
					await surveyPage.navigateTopSections("Distribution");
				},
			);
		});

		test("TC_04_Creating Non-anonymous Engagement survey manually with Email Share @Regression", async ({
			thrivePage,
			browser,
		}) => {
			await allure.description(
				"This test Create Non-anonymous Engagement survey manually with Email Share",
			);

			await allure.step(
				"Adding participants in the Engage survey",
				async () => {
					await engageDistributionPagePage.addParticipantsInSurvey(
						constants.engage_email,
					);
				},
			);

			await allure.step(
				"Enable non-anonymous toggle in configure Page and navigate to Distribution Page",
				async () => {
					await surveyPage.navigateTopSections("Configure");
					await EngageSurveyConfigure.nonAnonymousSurvey();
					await surveyPage.navigateTopSections("Distribution");
				},
			);

			await allure.step("Launch the survey", async () => {
				await surveyLaunch.launchSurvey();
				await surveyLaunch.confirmEngageSurveyLaunch();
			});

			await allure.step("Verify the survey is launched", async () => {
				await commonFunctions.open_survey_from_received_email(
					constants.engage_email_subject,
					constants.new_employee_email,
					constants.getEngageEmailBody(
						constants.engageParticipantName,
						EntityIds.surveyName,
					),
				);
			});
		});

		test("TC_05_Creating Non-Anonymous Engagement survey with QR Code Share @Regression @smoke @productionSanity ", async ({
			thrivePage,
			browser,
		}) => {
			await allure.description(
				"This test creates a Non-Anonymous Engagement survey with QR Code Share",
			);

			await allure.step(
				"Share the Engage survey through QR Code, verifying search employee functionality, deleting QR code and verifying deleted QR code TEG-TC-602, TEG-TC-606, TEG-TC-604, TEG-TC-401, TEG-TC-4019",
				async () => {
					await engageDistributionPagePage.chooseShareType("QR");
					await engageDistributionPagePage.createQRCode("Non-Anonymous");
					await engageDistributionPagePage.deleteQRCode(
						`QR-${constants.managerName}`,
					);
					await engageDistributionPagePage.verifyDeletedQRCode(
						`QR-${constants.managerName}`,
					);
					await engageDistributionPagePage.createQRCode("Non-Anonymous");
					await participantsDistributionPage.verifyEmployeeOrQRCode(
						`QR-${constants.managerName}`,
					);

					await engageDistributionPagePage.editQrCode(
						`QR-${constants.managerName}`,
						qrTitle,
						qrHeading,
						qrDescription,
					);
					await engageDistributionPagePage.verifyEditedQrCode(
						qrTitle,
						qrHeading,
						qrDescription,
					);
				},
			);

			await allure.step("Launch and verify the survey", async () => {
				await surveyLaunch.launchSurvey();
				await surveyLaunch.confirmEngageSurveyLaunch("QR");
			});

			await allure.step(
				"Verify whether QR Code is present in the email and take the survey TEG-TC-4018",
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

					const surveyUrl = await readEmail.fetch_survey_url_from_email({
						from: envDetails.senderEmail,
						to: constants.subject_email,
						subject: constants.engageQREmailSubject,
						body: emailBody,
					});
					await surveyEUIPage.attendEngagePulseSurvey({
						survey_url: surveyUrl,
						browser,
					});
				},
			);
		});
	});
});

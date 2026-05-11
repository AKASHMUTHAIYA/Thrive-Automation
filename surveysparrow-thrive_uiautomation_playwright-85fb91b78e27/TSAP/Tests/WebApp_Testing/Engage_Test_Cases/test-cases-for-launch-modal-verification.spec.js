import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";

test.describe("Test cases for verifying Prepare to Launch modal data", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let engageConfigurePage;
	let engageDistributionPage;
	let surveyLaunchPage;
	let EngageSurveyConfigure;
	let surveyBuildEditPage;
	let commonutils;
	let time;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyPage = poManager.getSurveyPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		time = commonutils.getCurrentTime();

		await allure.step("Navigate to Engage section", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
	});

	test("TEG-TC-3443,TEG-TC-3442,TEG-TC-3441 Verify Prepare to launch! Modal data for Non-Anonymous Engagement Survey with Email and Text Share @regression @launchModal @engage @nonanonymous", async ({
		thrivePage,
	}) => {
		const cutoffDays = 7;
		const totalParticipants = 4;
		let textParticipants = totalParticipants;
		let phoneNoMissingCount = 0;

		// Calculate expected dates in format that matches actual display: "24 Dec" (d MMM)
		const launchDate = CommonUtils.generateDateFromToday(0, "d MMM");
		const cutoffDate = CommonUtils.generateDateFromToday(cutoffDays, "d MMM");

		await allure.description(
			"This test verifies the data displayed in the 'Prepare to launch!' modal for Non-Anonymous Engagement Surveys with: " +
				"1. Email Share, " +
				"2. Text Share, " +
				"3. Email & Text Share. " +
				"Dynamically calculates text participants based on phone number availability.",
		);

		await allure.step(
			"SCENARIO 1: Verify Non-Anonymous Engagement Survey with all invite types",
			async () => {
				const surveyName = `Automation Engage NonAnon Email ${time}`;

				await allure.step("Create a new Engagement survey", async () => {
					await surveyPage.createNewSurvey(surveyName);
				});

				await allure.step(
					"Add a section and question to the survey",
					async () => {
						const sectionName = CommonUtils.generateRandomText(5);
						const sectionDescription = CommonUtils.generateRandomText(15);
						await surveyBuildEditPage.addSection(
							sectionName,
							sectionDescription,
						);
						await surveyBuildEditPage.addQuestionInSection({
							sectionName: sectionName,
							questionType: "Rating Scale",
							questionName: "Rate your experience",
						});
					},
				);

				await allure.step(
					"Configure the survey as Non-Anonymous and set cutoff to 7 days",
					async () => {
						await surveyPage.navigateTopSections("Configure");

						await engageConfigurePage.nonAnonymousSurvey();
						const cutoffTime =
							CommonUtils.generateDateFromToday(cutoffDays, "yyyy-MM-dd") +
							" 23:59";
						await engageConfigurePage.cutOffDates(cutoffTime, "0");
					},
				);

				await allure.step("Add four participants to the survey", async () => {
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
					await engageDistributionPage.addAdditionalParticipants(
						constants.engageParticipant4Email,
					);
				});


				await allure.step(
					"Get the phone number missing count from Distribution page",
					async () => {
						await CommonUtils.sleep(3);
						phoneNoMissingCount =
							await engageDistributionPage.getPhoneNoMissingCount();
						textParticipants = totalParticipants - phoneNoMissingCount;
						console.log(`Phone numbers missing: ${phoneNoMissingCount}, Text participants: ${textParticipants}`);
					},
				);

				await allure.step("Open the Launch Survey modal", async () => {
					await surveyLaunchPage.launchSurvey();
				});

				await allure.step("Verify all invite types in the modal", async () => {
					await surveyLaunchPage.selectInviteType("Email");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "email",
						totalParticipants: totalParticipants,
						emailParticipants: totalParticipants,
					});

					// Only verify text invite if there are participants with phone numbers
					if (textParticipants > 0) {
						await surveyLaunchPage.selectInviteType("Text");
						await surveyLaunchPage.verifyInviteText({
							inviteType: "text",
							totalParticipants: totalParticipants,
							textParticipants: textParticipants,
						});
					} else {
						console.log("Skipping Text invite verification - no participants have phone numbers");
					}

					await surveyLaunchPage.selectInviteType("Email & Text");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "emailAndText",
						totalParticipants: totalParticipants,
						emailParticipants: totalParticipants,
						textParticipants: textParticipants,
					});
				});

				await allure.step("Verify Survey Schedule", async () => {
					await surveyLaunchPage.verifySurveySchedule({
						expectedLaunchDate: launchDate,
						expectedCutoffDate: cutoffDate,
					});
				});
				await allure.step(
					"Verify Anonymity Preference is Non-Anonymous (Identifiable)",
					async () => {
						await surveyLaunchPage.verifyAnonymityPreference(false);
					},
				);

				await allure.step(
					"Check confirmation checkboxes and launch the survey",
					async () => {
						await surveyLaunchPage.checkConfirmationAndLaunch();
					},
				);
			},
		);
	});

	test("TEG-TC-3440,TEG-TC-3439,TEG-TC-3438 Verify Prepare to launch! Modal data for Anonymous Engagement Survey with Email and Text Share @regression @launchModal @engage @anonymous", async ({
		thrivePage,
	}) => {
		const cutoffDays = 10;
		const totalParticipants = 2;
		let textParticipants = totalParticipants;
		let phoneNoMissingCount = 0;

		// Calculate expected dates in format that matches actual display: "1 Jan" (d MMM)
		const launchDate = CommonUtils.generateDateFromToday(0, "d MMM");
		const cutoffDate = CommonUtils.generateDateFromToday(cutoffDays, "d MMM");

		await allure.description(
			"This test verifies the data displayed in the 'Prepare to launch!' modal for Anonymous Engagement Surveys with: " +
				"1. Email Share, " +
				"2. Text Share, " +
				"3. Email & Text Share. " +
				"Dynamically calculates text participants based on phone number availability.",
		);
		await allure.step(
			"SCENARIO 1: Verify Anonymous Engagement Survey with all invite types",
			async () => {
				const surveyName = `Automation Engage Anon Email ${time}`;

				await allure.step("Create a new Engagement survey", async () => {
					await surveyPage.createNewSurvey(surveyName);
				});

				await allure.step(
					"Add a section and question to the survey",
					async () => {
						const sectionName = CommonUtils.generateRandomText(5);
						const sectionDescription = CommonUtils.generateRandomText(15);
						await surveyBuildEditPage.addSection(
							sectionName,
							sectionDescription,
						);
						await surveyBuildEditPage.addQuestionInSection({
							sectionName: sectionName,
							questionType: "Rating Scale",
							questionName: "Rate your experience",
						});
					},
				);

				await allure.step(
					"Configure the survey as Anonymous and set cutoff to 10 days",
					async () => {
						await surveyPage.navigateTopSections("Configure");

						// Set cutoff date to 10 days from now
						const cutoffTime =
							CommonUtils.generateDateFromToday(cutoffDays, "yyyy-MM-dd") +
							" 23:59";
						await engageConfigurePage.cutOffDates(cutoffTime, "0");
					},
				);

				await allure.step("Add two participants to the survey", async () => {
					await surveyPage.navigateTopSections("Distribution");
					// Using participants 1 and 2 (checking which ones actually have phone numbers)
					await engageDistributionPage.addParticipantsInSurvey(
						constants.engageParticipant1Email,
					);
					await engageDistributionPage.addAdditionalParticipants(
						constants.engageParticipant2Email,
					);
				});

				await allure.step(
					"Get the phone number missing count from Distribution page",
					async () => {
						await CommonUtils.sleep(3);
						phoneNoMissingCount =
							await engageDistributionPage.getPhoneNoMissingCount();
						textParticipants = totalParticipants - phoneNoMissingCount;
					},
				);

				await allure.step("Open the Launch Survey modal", async () => {
					await surveyLaunchPage.launchSurvey();
				});

				await allure.step("Verify all invite types in the modal", async () => {
					await surveyLaunchPage.selectInviteType("Email");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "email",
						totalParticipants: totalParticipants,
						emailParticipants: totalParticipants,
					});

					if (textParticipants > 0) {
						await surveyLaunchPage.selectInviteType("Text");
						await surveyLaunchPage.verifyInviteText({
							inviteType: "text",
							totalParticipants: totalParticipants,
							textParticipants: textParticipants,
						});
					}

					await surveyLaunchPage.selectInviteType("Email & Text");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "emailAndText",
						totalParticipants: totalParticipants,
						emailParticipants: totalParticipants,
						textParticipants: textParticipants,
					});
				});

				await allure.step("Verify Survey Schedule", async () => {
					await surveyLaunchPage.verifySurveySchedule({
						expectedLaunchDate: launchDate,
						expectedCutoffDate: cutoffDate,
					});
				});

				await allure.step(
					"Verify Anonymity Preference is Anonymous",
					async () => {
						await surveyLaunchPage.verifyAnonymityPreference(true);
					},
				);
				await allure.step(
					"Check confirmation checkboxes and launch the survey",
					async () => {
						await surveyLaunchPage.checkConfirmationAndLaunch();
					},
				);
			},
		);
	});

	test("TEG-TC-3448,TEG-TC-3449,TEG-TC-3447 Verify Prepare to launch! Modal data for Non-Anonymous Pulse Survey with Email and Text Share @regression @launchModal @engage @nonAnonymous", async ({
		thrivePage,
	}) => {
		const cutoffDays = 7;
		const totalParticipants = 4;
		let textParticipants = totalParticipants;
		let phoneNoMissingCount = 0;

		// Variables to store frequency data from Configure page
		let frequencyStarting = "";
		let frequencyEvery = "";
		let frequencyPeriod = "";

		// Calculate expected dates in format that matches actual display: "Dec 31" (MMM dd)
		const cutoffDate = CommonUtils.generateDateFromToday(cutoffDays, "MMM d");

		await allure.description(
			"This test verifies the data displayed in the 'Prepare to launch!' modal for Non-Anonymous Pulse Surveys with: " +
				"1. Email Share, " +
				"2. Text Share, " +
				"3. Email & Text Share. " +
				"Dynamically calculates text participants based on phone number availability.",
		);

		await allure.step(
			"Verify Non-Anonymous Pulse Survey with all invite types",
			async () => {
				const surveyName = `Automation Pulse NonAnon ${time}`;

				await allure.step("Create a new Pulse survey", async () => {
					await surveyPage.createNewSurvey(surveyName);
				});

				await allure.step(
					"Add a section and question to the Pulse survey",
					async () => {
						const sectionName = CommonUtils.generateRandomText(5);
						const sectionDescription = CommonUtils.generateRandomText(15);
						await surveyBuildEditPage.addSection(
							sectionName,
							sectionDescription,
						);
						await surveyBuildEditPage.addQuestionInSection({
							sectionName: sectionName,
							questionType: "Rating Scale",
							questionName: "Rate your experience",
						});
					},
				);

				await allure.step(
					"Configure the Pulse survey as Non-Anonymous, set frequency and cutoff",
					async () => {
						await surveyPage.navigateTopSections("Configure");

						// Set frequency for Pulse survey
						await engageConfigurePage.setFrequencyForMonths(time);

						// Fetch frequency data from Configure page
						const frequencyData = await engageConfigurePage.getFrequencyData();
						frequencyStarting = frequencyData.frequencyStarting;
						frequencyEvery = frequencyData.frequencyEvery;
						frequencyPeriod = frequencyData.frequencyPeriod;
						await engageConfigurePage.nonAnonymousSurvey();

						const cutoffTime =
							CommonUtils.generateDateFromToday(cutoffDays, "yyyy-MM-dd") +
							" 23:59";
						await engageConfigurePage.cutOffDates(cutoffTime, "0");

						await EngageSurveyConfigure.proceedSetCutOffDate();
					},
				);

				await allure.step(
					"Add four participants to the Pulse survey",
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
						await engageDistributionPage.addAdditionalParticipants(
							constants.engageParticipant4Email,
						);
					},
				);

				await allure.step(
					"Get the phone number missing count from Distribution page",
					async () => {
						await CommonUtils.sleep(3);
						phoneNoMissingCount =
							await engageDistributionPage.getPhoneNoMissingCount();
						textParticipants = totalParticipants - phoneNoMissingCount;
					},
				);

				await allure.step("Open the Launch Pulse Survey modal", async () => {
					await surveyLaunchPage.launchPulseSurvey();
				});

				await allure.step("Verify all invite types in the modal", async () => {
					// Verify Email Only invite option
					await surveyLaunchPage.selectInviteType("Email");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "email",
						totalParticipants: totalParticipants,
						emailParticipants: totalParticipants,
					});

					// Verify Text Only invite option (uses dynamic count based on phone availability)
					await surveyLaunchPage.selectInviteType("Text");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "text",
						totalParticipants: totalParticipants,
						textParticipants: textParticipants,
					});

					// Verify Email & Text invite option
					await surveyLaunchPage.selectInviteType("Email & Text");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "emailAndText",
						totalParticipants: totalParticipants,
						emailParticipants: totalParticipants,
						textParticipants: textParticipants,
					});
				});

				await allure.step(
					"Verify Survey Schedule (Frequency and Cutoff Date)",
					async () => {
						await surveyLaunchPage.verifyPulseSurveySchedule({
							expectedCutoffDate: cutoffDate,
							frequencyStarting: frequencyStarting,
							frequencyEvery: frequencyEvery,
							frequencyPeriod: frequencyPeriod,
						});
					},
				);

				await allure.step(
					"Verify Anonymity Preference is Non-Anonymous (Identifiable)",
					async () => {
						await surveyLaunchPage.verifyAnonymityPreference(false);
					},
				);

				await allure.step(
					"Check confirmation checkboxes and launch the Pulse survey",
					async () => {
						await surveyLaunchPage.checkConfirmationAndLaunch();
					},
				);
			},
		);
	});

	test("TEG-TC-3446,TEG-TC-3445,TEG-TC-3444 Verify Prepare to launch! Modal data for Anonymous Pulse Survey with Email and Text Share @regression @launchModal  @engage @Anonymous", async ({
		thrivePage,
	}) => {
		const cutoffDays = 7;
		const totalParticipants = 4;
		let textParticipants = totalParticipants;
		let phoneNoMissingCount = 0;

		// Variables to store frequency data from Configure page
		let frequencyStarting = "";
		let frequencyEvery = "";
		let frequencyPeriod = "";

		// Calculate expected dates in format that matches actual display: "Dec 31" (MMM dd)
		const cutoffDate = CommonUtils.generateDateFromToday(cutoffDays, "MMM d");

		await allure.description(
			"This test verifies the data displayed in the 'Prepare to launch!' modal for Anonymous Pulse Surveys with: " +
				"1. Email Share, " +
				"2. Text Share, " +
				"3. Email & Text Share. " +
				"Dynamically calculates text participants based on phone number availability.",
		);

		await allure.step(
			"Verify Anonymous Pulse Survey with all invite types",
			async () => {
				const surveyName = `Automation Pulse Anon ${time}`;

				await allure.step("Create a new Pulse survey", async () => {
					await surveyPage.createNewSurvey(surveyName);
				});

				await allure.step(
					"Add a section and question to the Pulse survey",
					async () => {
						const sectionName = CommonUtils.generateRandomText(5);
						const sectionDescription = CommonUtils.generateRandomText(15);
						await surveyBuildEditPage.addSection(
							sectionName,
							sectionDescription,
						);
						await surveyBuildEditPage.addQuestionInSection({
							sectionName: sectionName,
							questionType: "Rating Scale",
							questionName: "Rate your experience",
						});
					},
				);

				await allure.step(
					"Configure the Pulse survey as Anonymous, set frequency and cutoff",
					async () => {
						await surveyPage.navigateTopSections("Configure");

						await engageConfigurePage.setFrequencyForMonths(time);
						const frequencyData = await engageConfigurePage.getFrequencyData();
						frequencyStarting = frequencyData.frequencyStarting;
						frequencyEvery = frequencyData.frequencyEvery;
						frequencyPeriod = frequencyData.frequencyPeriod;

						const cutoffTime =
							CommonUtils.generateDateFromToday(cutoffDays, "yyyy-MM-dd") +
							" 23:59";
						await engageConfigurePage.cutOffDates(cutoffTime, "0");

						await EngageSurveyConfigure.proceedSetCutOffDate();
					},
				);

				await allure.step(
					"Add four participants to the Pulse survey",
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
						await engageDistributionPage.addAdditionalParticipants(
							constants.engageParticipant4Email,
						);
					},
				);

				await allure.step(
					"Get the phone number missing count from Distribution page",
					async () => {
						await CommonUtils.sleep(3);
						phoneNoMissingCount =
							await engageDistributionPage.getPhoneNoMissingCount();
						textParticipants = totalParticipants - phoneNoMissingCount;
					},
				);

				await allure.step("Open the Launch Pulse Survey modal", async () => {
					await surveyLaunchPage.launchPulseSurvey();
				});

				await allure.step("Verify all invite types in the modal", async () => {
					// Verify Email Only invite option
					await surveyLaunchPage.selectInviteType("Email");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "email",
						totalParticipants: totalParticipants,
						emailParticipants: totalParticipants,
					});

					// Verify Text Only invite option (uses dynamic count based on phone availability)
					await surveyLaunchPage.selectInviteType("Text");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "text",
						totalParticipants: totalParticipants,
						textParticipants: textParticipants,
					});

					// Verify Email & Text invite option
					await surveyLaunchPage.selectInviteType("Email & Text");
					await surveyLaunchPage.verifyInviteText({
						inviteType: "emailAndText",
						totalParticipants: totalParticipants,
						emailParticipants: totalParticipants,
						textParticipants: textParticipants,
					});
				});

				await allure.step(
					"Verify Survey Schedule (Frequency and Cutoff Date)",
					async () => {
						await surveyLaunchPage.verifyPulseSurveySchedule({
							expectedCutoffDate: cutoffDate,
							frequencyStarting: frequencyStarting,
							frequencyEvery: frequencyEvery,
							frequencyPeriod: frequencyPeriod,
						});
					},
				);

				await allure.step(
					"Verify Anonymity Preference is Anonymous",
					async () => {
						await surveyLaunchPage.verifyAnonymityPreference(true);
					},
				);

				await allure.step(
					"Check confirmation checkboxes and launch the Pulse survey",
					async () => {
						await surveyLaunchPage.checkConfirmationAndLaunch();
					},
				);
			},
		);
	});
});

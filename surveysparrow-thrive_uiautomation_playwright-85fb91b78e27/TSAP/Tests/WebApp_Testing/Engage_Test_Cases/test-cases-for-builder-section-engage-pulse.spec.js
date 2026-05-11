import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";

let poManager;
let commonFunctions;
let surveyPage;
let engageDistributionPage;
let EngageSurveyConfigure;
let surveyBuildEditPage;
let surveyEUIPage;
let surveyLaunchPage;
let cookieValue;
let time;
const sectionTitle1 = "Section 1";
const sectionTitle2 = "Section 2";
const sectionDescription1 = "Section 1 Description";
const sectionDescription2 = "Section 2 Description";
const question1 = "Question 1";
const question2 = "Question 2";
const question3 = "Question 3";
const question4 = "Question 4";

test.beforeEach(async ({ thrivePage }) => {
	poManager = new POManager(thrivePage);
	surveyEUIPage = poManager.getSurveyEUIPage();
	commonFunctions = poManager.getCommonPageFunctions();
	surveyBuildEditPage = poManager.getSurveyBuilderPage();
	EngageSurveyConfigure = poManager.getEngageConfigurePage();
	surveyPage = poManager.getSurveyPage();
	engageDistributionPage = poManager.getEngageDistributionPage();
	surveyLaunchPage = poManager.getSurveyLaunchPage();
	time = new CommonUtils().getCurrentTime();
	cookieValue = "";
	await allure.step("User navigates to 'Engage' tab", async () => {
		await commonFunctions.navigateTopNavigateSection("Engage");
	});
});

test.describe("Builder Section Tests with Soft Assertions", () => {
	test("Builder Section Tests For Engagement Survey TEG-TC-3143, TEG-TC-3145, TEG-TC-3147, TEG-TC-3153, TEG-TC-3151, TEG-TC-3127, TEG-TC-3129, TEG-TC-3155, TEG-TC-3112, TEG-TC-3110, TEG-TC-3115 @Regression", async ({
		thrivePage,
		browser,
	}) => {
		let surveyUrl1;
		let surveyUrl2;
		let imageData = { data: [] };
		const surveyName = `Automation Combined Engage Survey${time}`;
		const questionType1 = "Rating Scale";
		const questionType2 = "Text Input";
		const questionType3 = "MultiChoice";
		const questionType4 = "eNPS";
		let questionsData = {
			data: [],
		};

		const configData = {
			data: [],
		};

		await allure.step("Creating a Engage survey", async () => {
			await surveyPage.createNewSurvey(surveyName);
			cookieValue = await thrivePage.context().cookies();
		});

		await allure.step("Add a new section to the survey", async () => {
			await surveyBuildEditPage.addSection(sectionTitle1, sectionDescription1);
			await surveyBuildEditPage.verifyAddedSection(
				sectionTitle1,
				sectionDescription1,
			);
			await surveyBuildEditPage.addSection(sectionTitle2, sectionDescription2);
			await surveyBuildEditPage.verifyAddedSection(
				sectionTitle2,
				sectionDescription2,
			);
		});

		await allure.step("Add questions to the section", async () => {
			await surveyBuildEditPage.addQuestionInSection({
				sectionName: sectionTitle1,
				questionType: questionType1,
				questionName: question1,
			});
			questionsData.data.push({
				questionType: questionType1,
				questionNumber: 1,
				sectionNumber: 1,
			});
			await surveyBuildEditPage.verifyAddedQuestion({ question: question1 });
			await surveyBuildEditPage.addQuestionInSection({
				sectionName: sectionTitle1,
				questionType: questionType2,
				questionName: question2,
			});
			questionsData.data.push({
				questionType: questionType2,
				questionNumber: 2,
				sectionNumber: 1,
			});
			await surveyBuildEditPage.verifyAddedQuestion({ question: question2 });
			await surveyBuildEditPage.addQuestionInSection({
				sectionName: sectionTitle2,
				questionType: questionType3,
				questionName: question3,
			});
			questionsData.data.push({
				questionType: questionType3,
				questionNumber: 1,
				sectionNumber: 2,
			});
			await surveyBuildEditPage.verifyAddedQuestion({ question: question3 });
			await surveyBuildEditPage.addQuestionInSection({
				sectionName: sectionTitle2,
				questionType: questionType4,
				questionName: question4,
			});
			questionsData.data.push({
				questionType: questionType4,
				questionNumber: 2,
				sectionNumber: 2,
			});
			await surveyBuildEditPage.verifyAddedQuestion({ question: question4 });
		});

		await allure.step(
			"TEG-TC-3155 - Verify Preview in Builder Section - Engagement",
			async () => {
				await allure.step("Open Preview And attend Survey", async () => {
					await surveyBuildEditPage.openSurveyPreview();
					await surveyBuildEditPage.attendPreviewSurvey();
				});
			},
		);
		await allure.step(
			"TEG-TC-9606, TEG-TC-9604, TEG-TC-9602, TEG-TC-9094 - Change the configuration of the question - Engagement",
			async () => {
				for (const {
					questionType,
					questionNumber,
					sectionNumber,
				} of questionsData.data) {
					let settings;

					switch (questionType) {
						case "Rating Scale":
							settings = { scale: 7, type: "Frequency", flag: true };
							break;
						case "Text Input":
							settings = {
								type: "multi line",
								placeholder: "Manually Entered Placeholder",
								flag: true,
							};
							break;
						case "MultiChoice":
							settings = { type: "Multiple Selection", flag: true };
							break;
						case "eNPS":
							settings = {};
							break;
						default:
							settings = {};
							break;
					}

					const result = await surveyBuildEditPage.changeConfiguration(
						questionType,
						settings,
						questionNumber,
						sectionNumber,
					);

					if (result) {
						configData.data.push(result);
					}
				}
				questionsData = null;
			},
		);

		await allure.step(
			"TEG-TC-3153 – Add Survey Intro Image – Engagement , TEG-TC-3151 - Adding Section Intro Image in Engagement survey",
			async () => {
				await allure.step("TEG-TC-3153 - Add Survey Intro Image", async () => {
					await surveyBuildEditPage.navigateToSurveyHeader();
					await surveyBuildEditPage.addImageOnBuilder(
						constants.Custom_Branding_Logo,
					);
					imageData.data.push({
						area: "Survey Intro",
						imagePath: constants.Custom_Branding_Logo,
					});
				});
				await allure.step("TEG-TC-3151 - Add Section Intro Image", async () => {
					await surveyBuildEditPage.addImageOnSectionHeader(
						constants.Custom_Branding_Logo,
						1,
					);
					imageData.data.push({
						area: "Section Header",
						qno: 1,
						imagePath: constants.Custom_Branding_Logo,
					});
				});
			},
		);

		await allure.step(
			"TEG-TC-3127 – Set Question as Mandatory in Engagement Survey",
			async () => {
				await allure.step("Set Question as Mandatory", async () => {
					await surveyBuildEditPage.markQuestionAsMandatoryOrNonMandatory(
						null,
						1,
					);
				});
			},
		);

		await allure.step(
			"TEG-TC-3112 – Search Behavior for Adding Translations – Engagement",
			async () => {
				await allure.step("Adding Language", async () => {
					await surveyBuildEditPage.searchAndAddLanguage("Tamil");
				});
			},
		);

		await allure.step("Navigate to Distribution Page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});

		await allure.step("Adding participants in survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engage_email,
			);
			await engageDistributionPage.addAdditionalParticipants(
				constants.engageParticipant2Email,
			);
		});

		await allure.step("Launch and verify the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step("Verify the survey is launched", async () => {
			surveyUrl1 = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getEngageEmailBody(constants.engageParticipant1, surveyName),
			);
			surveyUrl2 = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getEngageEmailBody(constants.engageParticipant2, surveyName),
			);
		});

		await allure.step(
			"TEG-TC-3153 – Add Survey Intro Image – Engagement , TEG-TC-3151 - Adding Section Intro Image in Engagement survey",
			async () => {
				await allure.step("Verify Survey Intro Image at EUI", async () => {
					await surveyEUIPage.verifyImageInSurvey(
						surveyUrl1,
						browser,
						imageData,
					);
				});
				imageData = null;
			},
		);

		await allure.step(
			"TEG-TC-3127 – Set Question as Mandatory in Engagement Survey",
			async () => {
				await allure.step("Verify Mandatory Question at EUI", async () => {
					await surveyEUIPage.verifyQuestionValidationBehavior(
						surveyUrl1,
						browser,
						1,
						1,
						true,
					);
				});
			},
		);

		await allure.step(
			"TEG-TC-3129 – Set Question as Not Mandatory in Engagement Survey",
			async () => {
				await allure.step("Set Question as Not Mandatory", async () => {
					await surveyBuildEditPage.navigateToSurveyBuilder();
					await surveyBuildEditPage.markQuestionAsMandatoryOrNonMandatory(1, 1);
					await PwActions.pageRefresh(thrivePage);
				});
				await allure.step("Verify Not Mandatory Question at EUI", async () => {
					await surveyEUIPage.verifyQuestionValidationBehavior(
						surveyUrl1,
						browser,
						1,
						1,
						false,
					);
				});
			},
		);

		await allure.step(
			"TEG-TC-9606, TEG-TC-9604, TEG-TC-9602, TEG-TC-9094 - Change the configuration of the question - Engagement",
			async () => {
				for (const question of configData.data) {
					await surveyEUIPage.verifyQuestionConfiguration(
						surveyUrl1,
						browser,
						question,
					);
				}
			},
		);

		await allure.step(
			"TEG-TC-3143 , TEG-TC-3145 , TEG-TC-3147 Rearrange Sections and Questions and Move Question Between Sections in Survey Builder - Engagement",
			async () => {
				await allure.step(
					"TEG-TC-3143 -  Rearrange sections - Engagement",
					async () => {
						const sectionsListBeforeReArrange =
							await surveyBuildEditPage.getSectionsNames();
						if (sectionsListBeforeReArrange.length >= 2) {
							await surveyBuildEditPage.reArrangeSections(
								sectionsListBeforeReArrange[0],
								sectionsListBeforeReArrange[1],
								sectionsListBeforeReArrange,
							);

							const sectionsListAfterReArrange =
								await surveyBuildEditPage.getSectionsNames();
							await surveyBuildEditPage.verifyreArrangedSections(
								sectionsListBeforeReArrange,
								sectionsListAfterReArrange,
								sectionsListBeforeReArrange[0],
								sectionsListBeforeReArrange[1],
							);
						}
					},
				);

				await allure.step(
					"TEG-TC-3145 – Rearrange Questions in a Section – Engagement",
					async () => {
						const questionsListBeforeReArrange =
							await surveyBuildEditPage.getQuestionsNamesInSection(
								sectionTitle1,
							);
						if (questionsListBeforeReArrange.length >= 2) {
							await surveyBuildEditPage.reArrangeQuestions(
								questionsListBeforeReArrange[0],
								questionsListBeforeReArrange[1],
								questionsListBeforeReArrange,
							);
							const questionsListAfterReArrange =
								await surveyBuildEditPage.getQuestionsNamesInSection(
									sectionTitle1,
								);
							await surveyBuildEditPage.verifyreArrangedQuestions(
								questionsListBeforeReArrange,
								questionsListAfterReArrange,
								questionsListBeforeReArrange[0],
								questionsListBeforeReArrange[1],
							);
						}
					},
				);

				await allure.step(
					"TEG-TC-3147 - Move Question Between Sections - Engagement",
					async () => {
						const questionListBeforeMoveSection1 =
							await surveyBuildEditPage.getQuestionsNamesInSection(
								sectionTitle1,
							);
						const questionListBeforeMoveSection2 =
							await surveyBuildEditPage.getQuestionsNamesInSection(
								sectionTitle2,
							);

						if (
							questionListBeforeMoveSection1.length >= 2 &&
							questionListBeforeMoveSection2.length >= 2
						) {
							await surveyBuildEditPage.reArrangeQuestions(
								questionListBeforeMoveSection1[0],
								questionListBeforeMoveSection2[0],
							);

							const questionListAfterMoveSection1 =
								await surveyBuildEditPage.getQuestionsNamesInSection(
									sectionTitle1,
								);
							const questionListAfterMoveSection2 =
								await surveyBuildEditPage.getQuestionsNamesInSection(
									sectionTitle2,
								);

							await surveyBuildEditPage.verifyReArrangedQuestionOrderBetweenSections(
								questionListBeforeMoveSection1,
								questionListBeforeMoveSection2,
								questionListAfterMoveSection1,
								questionListAfterMoveSection2,
								questionListBeforeMoveSection1[0],
								questionListBeforeMoveSection2[0],
							);
						}
					},
				);
			},
		);
		await allure.step(
			"TEG-TC-(Id is not there) - Search Behaviour For Source Language - Engagment",
			async () => {
				await allure.step("Searching and Adding Source Language", async () => {
					await surveyBuildEditPage.changeSourceLanguage("Tamil");
				});
			},
		);
		await allure.step(
			"TEG-TC-3110 – Change Source Language in Engagement Survey",
			async () => {
				await allure.step("Change Source Language", async () => {
					await surveyBuildEditPage.changeToSourceLanguage();
				});
				await allure.step("Verify Content in Language EUI", async () => {
					await surveyEUIPage.verifyWhetherContentIsInSourceLanguage(
						surveyUrl2,
						cookieValue,
						browser,
						"Tamil",
					);
				});
			},
		);
		await allure.step(
			"TEG-TC-3115 - Verify Content in Builder Post Language Change - Engagement",
			async () => {
				await surveyBuildEditPage.verifyContentLanguage("Tamil");
			},
		);
	});

	test("Builder Section Tests For Pulse Survey TEG-TC-3144, TEG-TC-3146, TEG-TC-3148, TEG-TC-3154, TEG-TC-3152, TEG-TC-3128, TEG-TC-3130, TEG-TC-3156, TEG-TC-3114, TEG-TC-3113, TEG-TC-3111, TEG-TC-3116 @Regression", async ({
		thrivePage,
		browser,
	}) => {
		let surveyUrl1;
		let surveyUrl2;
		let imageData = { data: [] };
		const surveyName = `Automation Combined Pulse Survey${time}`;
		const questionType1 = "Rating Scale";
		const questionType2 = "Text Input";
		const questionType3 = "MultiChoice";
		const questionType4 = "eNPS";
		let questionsData = {
			data: [],
		};

		let configData = {
			data: [],
		};

		await allure.step("Creating a Pulse survey", async () => {
			await surveyPage.createNewSurvey(surveyName);
			cookieValue = await thrivePage.context().cookies();
		});

		await allure.step("Add a new section to the survey", async () => {
			await surveyBuildEditPage.addSection(sectionTitle1, sectionDescription1);
			await surveyBuildEditPage.verifyAddedSection(
				sectionTitle1,
				sectionDescription1,
			);
			await surveyBuildEditPage.addSection(sectionTitle2, sectionDescription2);
			await surveyBuildEditPage.verifyAddedSection(
				sectionTitle2,
				sectionDescription2,
			);
		});

		await allure.step("Add questions to the section", async () => {
			await surveyBuildEditPage.addQuestionInSection({
				sectionName: sectionTitle1,
				questionType: questionType1,
				questionName: question1,
			});
			questionsData.data.push({
				questionType: questionType1,
				questionNumber: 1,
				sectionNumber: 1,
			});
			await surveyBuildEditPage.verifyAddedQuestion({ question: question1 });
			await surveyBuildEditPage.addQuestionInSection({
				sectionName: sectionTitle1,
				questionType: questionType2,
				questionName: question2,
			});
			questionsData.data.push({
				questionType: questionType2,
				questionNumber: 2,
				sectionNumber: 1,
			});
			await surveyBuildEditPage.verifyAddedQuestion({ question: question2 });
			await surveyBuildEditPage.addQuestionInSection({
				sectionName: sectionTitle2,
				questionType: questionType3,
				questionName: question3,
			});
			questionsData.data.push({
				questionType: questionType3,
				questionNumber: 1,
				sectionNumber: 2,
			});
			await surveyBuildEditPage.verifyAddedQuestion({ question: question3 });
			await CommonUtils.sleep(2);
			await surveyBuildEditPage.addQuestionInSection({
				sectionName: sectionTitle2,
				questionType: questionType4,
				questionName: question4,
			});
			await PwActions.waitForNetworkIdle(thrivePage, 5000);
			await CommonUtils.sleep(2);
			questionsData.data.push({
				questionType: questionType4,
				questionNumber: 2,
				sectionNumber: 2,
			});
			await surveyBuildEditPage.verifyAddedQuestion({ question: question4 });
		});

		await allure.step(
			"TEG-TC-3156 - Verify Preview in Builder Section - Pulse",
			async () => {
				await allure.step("Open Preview And attend Survey", async () => {
					await surveyBuildEditPage.openSurveyPreview();
					await surveyBuildEditPage.attendPreviewSurvey();
				});
			},
		);
		await allure.step(
			"TEG-TC-9607, TEG-TC-9605, TEG-TC-9603, TEG-TC-9095 - Change the configuration of the question - Pulse",
			async () => {
				for (const {
					questionType,
					questionNumber,
					sectionNumber,
				} of questionsData.data) {
					let settings;

					switch (questionType) {
						case "Rating Scale":
							settings = { scale: 7, type: "Frequency", flag: true };
							break;
						case "Text Input":
							settings = {
								type: "multi line",
								placeholder: "Manually Entered Placeholder",
								flag: true,
							};
							break;
						case "MultiChoice":
							settings = { type: "Multiple Selection", flag: true };
							break;
						case "eNPS":
							settings = {};
							break;
						default:
							settings = {};
							break;
					}

					const result = await surveyBuildEditPage.changeConfiguration(
						questionType,
						settings,
						questionNumber,
						sectionNumber,
					);

					if (result) {
						configData.data.push(result);
					}
				}
				questionsData = null;
			},
		);

		await allure.step(
			"TEG-TC-3154 – Add Survey Intro Image – Pulse , TEG-TC-3152 – Add Section Intro Image – Pulse",
			async () => {
				await allure.step("TEG-TC-3154 - Add Survey Intro Image", async () => {
					await surveyBuildEditPage.navigateToSurveyHeader();
					await surveyBuildEditPage.addImageOnBuilder(
						constants.Custom_Branding_Logo,
					);
					imageData.data.push({
						area: "Survey Intro",
						imagePath: constants.Custom_Branding_Logo,
					});
				});
				await allure.step("TEG-TC-3152 - Add Section Intro Image", async () => {
					await surveyBuildEditPage.addImageOnSectionHeader(
						constants.Custom_Branding_Logo,
						1,
					);
					imageData.data.push({
						area: "Section Header",
						qno: 1,
						imagePath: constants.Custom_Branding_Logo,
					});
				});
			},
		);

		await allure.step(
			"TEG-TC-3128 – Set Question as Mandatory in Pulse Survey",
			async () => {
				await allure.step("Set Question as Mandatory", async () => {
					await surveyBuildEditPage.markQuestionAsMandatoryOrNonMandatory(
						null,
						1,
					);
				});
			},
		);

		await allure.step(
			"TEG-TC-3114 – Search Behavior for Adding Translations – Pulse",
			async () => {
				await allure.step("Adding Language", async () => {
					await surveyBuildEditPage.searchAndAddLanguage("Tamil");
				});
			},
		);

		await allure.step(
			"Adding participants and launching the pulse survey",
			async () => {
				await allure.step(
					"Enable non-anonymous toggle in configure",
					async () => {
						await surveyPage.navigateTopSections("Configure");
						await EngageSurveyConfigure.setFrequencyForMonths(
							new CommonUtils().getCurrentTime(),
						);
					},
				);

				await allure.step("Navigate to Distribution Page", async () => {
					await surveyPage.navigateTopSections("Distribution");
				});
				await allure.step("Adding participants in survey", async () => {
					await engageDistributionPage.addParticipantsInSurvey(
						constants.engage_email,
					);
					await engageDistributionPage.addAdditionalParticipants(
						constants.engageParticipant2Email,
					);
				});
				await allure.step("Launching the survey", async () => {
					await surveyLaunchPage.launchPulseSurvey();
					await surveyLaunchPage.confirmEngageSurveyLaunch();
				});
			},
		);

		await allure.step("Verify the survey is launched", async () => {
			await CommonUtils.sleep(180);
			surveyUrl1 = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getPulseEmailBody(constants.engageParticipant1, surveyName),
			);
			surveyUrl2 = await commonFunctions.open_survey_from_received_email(
				constants.engage_email_subject,
				constants.new_employee_email,
				constants.getPulseEmailBody(constants.engageParticipant2, surveyName),
			);
		});

		await allure.step(
			"TEG-TC-3154 – Add Survey Intro Image – Pulse , TEG-TC-3152 – Add Section Intro Image – Pulse",
			async () => {
				await allure.step("Verify Survey Intro Image at EUI", async () => {
					await surveyEUIPage.verifyImageInSurvey(
						surveyUrl1,
						browser,
						imageData,
					);
					imageData = null;
				});
			},
		);

		await allure.step(
			"TEG-TC-3128 – Set Question as Mandatory in Pulse Survey",
			async () => {
				await allure.step("Verify Mandatory Question at EUI", async () => {
					await surveyEUIPage.verifyQuestionValidationBehavior(
						surveyUrl1,
						browser,
						1,
						1,
						true,
					);
				});
			},
		);

		await allure.step(
			"TEG-TC-3130 – Set Question as Not Mandatory in Pulse Survey",
			async () => {
				await allure.step("Set Question as Not Mandatory", async () => {
					await surveyBuildEditPage.navigateToSurveyBuilder();
					await surveyBuildEditPage.markQuestionAsMandatoryOrNonMandatory(1, 1);
					await PwActions.pageRefresh(thrivePage);
				});
				await allure.step("Verify Not Mandatory Question at EUI", async () => {
					await surveyEUIPage.verifyQuestionValidationBehavior(
						surveyUrl1,
						browser,
						1,
						1,
						false,
					);
				});
			},
		);

		await allure.step(
			"TEG-TC-9607, TEG-TC-9605, TEG-TC-9603, TEG-TC-9095 - Change the configuration of the question - Pulse",
			async () => {
				for (const question of configData.data) {
					await surveyEUIPage.verifyQuestionConfiguration(
						surveyUrl1,
						browser,
						question,
					);
				}
				configData = null;
			},
		);
		await allure.step(
			"TEG-TC-3144, TEG-TC-3146, TEG-TC-3148 - Rearrange Sections and Questions and Move Question Between Sections in Survey Builder - Pulse",
			async () => {
				await allure.step(
					"TEG-TC-3144 -  Rearrange sections - Pulse",
					async () => {
						const sectionsListBeforeReArrange =
							await surveyBuildEditPage.getSectionsNames();
						if (sectionsListBeforeReArrange.length >= 2) {
							await surveyBuildEditPage.reArrangeSections(
								sectionsListBeforeReArrange[0],
								sectionsListBeforeReArrange[1],
								sectionsListBeforeReArrange,
							);

							const sectionsListAfterReArrange =
								await surveyBuildEditPage.getSectionsNames();
							await surveyBuildEditPage.verifyreArrangedSections(
								sectionsListBeforeReArrange,
								sectionsListAfterReArrange,
								sectionsListBeforeReArrange[0],
								sectionsListBeforeReArrange[1],
							);
						}
					},
				);

				await allure.step(
					"TEG-TC-3146 – Rearrange Questions in a Section – Pulse",
					async () => {
						const questionsListBeforeReArrange =
							await surveyBuildEditPage.getQuestionsNamesInSection(
								sectionTitle1,
							);
						if (questionsListBeforeReArrange.length >= 2) {
							await surveyBuildEditPage.reArrangeQuestions(
								questionsListBeforeReArrange[0],
								questionsListBeforeReArrange[1],
								questionsListBeforeReArrange,
							);
							const questionsListAfterReArrange =
								await surveyBuildEditPage.getQuestionsNamesInSection(
									sectionTitle1,
								);
							await surveyBuildEditPage.verifyreArrangedQuestions(
								questionsListBeforeReArrange,
								questionsListAfterReArrange,
								questionsListBeforeReArrange[0],
								questionsListBeforeReArrange[1],
							);
						}
					},
				);

				await allure.step(
					"TEG-TC-3148 - Move Question Between Sections - Pulse",
					async () => {
						const questionListBeforeMoveSection1 =
							await surveyBuildEditPage.getQuestionsNamesInSection(
								sectionTitle1,
							);
						const questionListBeforeMoveSection2 =
							await surveyBuildEditPage.getQuestionsNamesInSection(
								sectionTitle2,
							);

						if (
							questionListBeforeMoveSection1.length >= 2 &&
							questionListBeforeMoveSection2.length >= 2
						) {
							await surveyBuildEditPage.reArrangeQuestions(
								questionListBeforeMoveSection1[0],
								questionListBeforeMoveSection2[0],
							);

							const questionListAfterMoveSection1 =
								await surveyBuildEditPage.getQuestionsNamesInSection(
									sectionTitle1,
								);
							const questionListAfterMoveSection2 =
								await surveyBuildEditPage.getQuestionsNamesInSection(
									sectionTitle2,
								);

							await surveyBuildEditPage.verifyReArrangedQuestionOrderBetweenSections(
								questionListBeforeMoveSection1,
								questionListBeforeMoveSection2,
								questionListAfterMoveSection1,
								questionListAfterMoveSection2,
								questionListBeforeMoveSection1[0],
								questionListBeforeMoveSection2[0],
							);
						}
					},
				);
			},
		);
		await allure.step(
			"TEG-TC-3113 – Search Behavior for Source Language – Pulse",
			async () => {
				await allure.step("Searching and adding source language", async () => {
					await surveyBuildEditPage.changeSourceLanguage("Tamil");
				});
			},
		);
		await allure.step(
			"TEG-TC-3111 – Change Source Language in Pulse Survey",
			async () => {
				await allure.step("Change Source Language", async () => {
					await surveyBuildEditPage.changeToSourceLanguage();
				});
				await allure.step("Verify Content in Language EUI", async () => {
					await surveyEUIPage.verifyWhetherContentIsInSourceLanguage(
						surveyUrl2,
						cookieValue,
						browser,
						"Tamil",
					);
				});
			},
		);
		await allure.step(
			"TEG-TC-3116 - Verify Content in Builder Post Language Change - Pulse",
			async () => {
				await surveyBuildEditPage.verifyContentLanguage("Tamil");
			},
		);
	});
});

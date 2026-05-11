import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants.js";

let poManager;
let commonFunctions;
let commonutils;
let surveyBuildPage;
let engageDistributionPagePage;
let EngageSurveyConfigure;
let surveyPage;
let surveyLaunch;
const sectionName = "Automation Section";
const question = "Rating Scale";
const questionDescription = "Rating Scale";
test.describe("Share engage survey", () => {
	let engageSurveyName = null;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonFunctions = poManager.getCommonPageFunctions();
		engageDistributionPagePage = poManager.getEngageDistributionPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		commonutils = new CommonUtils();
		surveyBuildPage = poManager.getSurveyBuilderPage();
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});

		surveyPage = poManager.getSurveyPage();
		const time = commonutils.getCurrentTime();
		await allure.step("Create a new Engagement Survey", async () => {
			await surveyPage.createNewSurvey(`Automation Engage Survey${time}`);
			engageSurveyName = EntityIds.surveyName;
			await surveyBuildPage.addSection(sectionName, "This is a test section");
			await surveyBuildPage.addQuestionInSection({
				sectionName: sectionName,
				questionType: question,
				questionName: question,
			});
			await surveyBuildPage.waitForQuestionToBeAdded(
				question,
				questionDescription,
			);
		});

		await allure.step(
			"Enable non-anonymous toggle in configure Page and navigate to Distribution Page",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await EngageSurveyConfigure.nonAnonymousSurvey();
			},
		);

		await allure.step("Share the Engage survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
		});
	});

	test("TC_01 User should be able to clone an Engagement Survey with Content, Configuration and Distribution from Survey Home Page @Regression @productionSanity", async ({
		thrivePage,
	}) => {
		await allure.step("Clone the survey", async () => {
			await commonFunctions.navigateToPageUrl("Engage");
			await surveyPage.cloneSurvey(
				engageSurveyName,
				"Content,Configuration,Distribution",
			);
		});

		await allure.step(
			"Verify that the survey has been duplicated",
			async () => {
				await surveyBuildPage.verifySurveyDuplicated(engageSurveyName);
				await surveyBuildPage.verifySurveySectionsAndQuestions(
					sectionName,
					questionDescription,
					question,
				);
				await surveyPage.navigateTopSections("Configure");
				await surveyPage.checknonAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
				await surveyPage.checkDistributionPage(constants.engageParticipant1);
			},
		);
		await allure.step(
			"User should be able to clone an Engagement Survey with Content only from Survey Home Page",
			async () => {
				await surveyPage.navigateToSurveyHomePage();
				await surveyPage.cloneSurvey(engageSurveyName, "Content");
				await surveyBuildPage.verifySurveyDuplicated(engageSurveyName);
				await surveyBuildPage.verifySurveySectionsAndQuestions(
					sectionName,
					questionDescription,
					question,
				);
				await surveyPage.navigateTopSections("Configure");
				await surveyPage.checkAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPagePage.verifyDistributionOptions(
					"distributionOptions.jpeg",
				);
			},
		);
		await allure.step(
			"User should be able to clone an Engagement Survey with Configuration only from Survey Home Page",
			async () => {
				await surveyPage.navigateToSurveyHomePage();
				await surveyPage.cloneSurvey(engageSurveyName, "Configuration");
				await surveyBuildPage.verifySurveyDuplicated(engageSurveyName);
				await surveyBuildPage.verifyBuilderHasNoSectionsAndQuestions();
				await surveyPage.navigateTopSections("Configure");
				await surveyPage.checknonAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPagePage.verifyDistributionOptions(
					"distributionOptions.jpeg",
				);
			},
		);
		await allure.step(
			"User should be able to clone an Engagement Survey with Distribution only from Survey Home Page",
			async () => {
				await surveyPage.navigateToSurveyHomePage();
				await surveyPage.cloneSurvey(engageSurveyName, "Distribution");
				await surveyBuildPage.verifySurveyDuplicated(engageSurveyName);
				await surveyBuildPage.verifyBuilderHasNoSectionsAndQuestions();
				await surveyPage.navigateTopSections("Configure");
				await surveyPage.checkAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
				await surveyPage.checkDistributionPage(constants.engageParticipant1);
			},
		);
	});
});

test.describe("Share pulse survey", () => {
	let pulseSurveyName = null;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonFunctions = poManager.getCommonPageFunctions();
		commonutils = new CommonUtils();
		surveyBuildPage = poManager.getSurveyBuilderPage();
		engageDistributionPagePage = poManager.getEngageDistributionPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		surveyLaunch = poManager.getSurveyLaunchPage();
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});

		surveyPage = poManager.getSurveyPage();
		const time = commonutils.getCurrentTime();
		await allure.step("Create a new Engagement Survey", async () => {
			await surveyPage.createNewSurvey(`Automation Pulse Survey${time}`);
			pulseSurveyName = EntityIds.surveyName;
			await surveyBuildPage.addSection(sectionName, "This is a test section");
			await surveyBuildPage.addQuestionInSection({
				sectionName: sectionName,
				questionType: question,
				questionName: question,
			});
			await surveyBuildPage.waitForQuestionToBeAdded(
				question,
				question,
				questionDescription,
			);
		});

		await allure.step(
			"Enable non-anonymous toggle in configure Page and navigate to Distribution Page",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				await EngageSurveyConfigure.nonAnonymousSurvey();
				await EngageSurveyConfigure.setFrequencyForMonths(time);
			},
		);

		await allure.step("Share the Engage survey", async () => {
			await surveyPage.navigateTopSections("Distribution");
			await engageDistributionPagePage.addParticipantsInSurvey(
				constants.engage_email,
			);
			await surveyLaunch.launchSurvey();
			await surveyLaunch.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(120);
			await PwActions.pageRefresh(thrivePage);
		});
	});

	test("TC_01 User should be able to clone a Pulse Survey with Content, Configuration and Distribution from Survey Home Page @Regression @productionSanity ", async ({
		thrivePage,
	}) => {
		await allure.step("Clone the survey", async () => {
			await commonFunctions.navigateToPageUrl("Engage");
			await surveyPage.cloneSurvey(
				pulseSurveyName,
				"Content,Configuration,Distribution",
			);
		});

		await allure.step(
			"Verify that the survey has been duplicated",
			async () => {
				await surveyBuildPage.verifySurveyDuplicated(pulseSurveyName);
				await surveyBuildPage.verifySurveySectionsAndQuestions(
					sectionName,
					questionDescription,
					question,
				);
				await surveyPage.navigateTopSections("Configure");
				await surveyPage.checknonAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
				await surveyPage.checkDistributionPage(constants.engageParticipant1);
			},
		);
		await allure.step(
			"User should be able to clone a Pulse Survey with Content only from Survey Home Page",
			async () => {
				await surveyPage.navigateToSurveyHomePage();
				await surveyPage.cloneSurvey(pulseSurveyName, "Content");
				await surveyBuildPage.verifySurveyDuplicated(pulseSurveyName);
				await surveyBuildPage.verifySurveySectionsAndQuestions(
					sectionName,
					questionDescription,
					question,
				);
				await surveyPage.navigateTopSections("Configure");
				await surveyPage.checkAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPagePage.verifyDistributionOptions(
					"distributionOptions.jpeg",
				);
			},
		);
		await allure.step(
			"User should be able to clone a Pulse Survey with Configuration only from Survey Home Page",
			async () => {
				await surveyPage.navigateToSurveyHomePage();
				await surveyPage.cloneSurvey(pulseSurveyName, "Configuration");
				await surveyBuildPage.verifySurveyDuplicated(pulseSurveyName);
				await surveyBuildPage.verifyBuilderHasNoSectionsAndQuestions();
				await surveyPage.navigateTopSections("Configure");
				await surveyPage.checknonAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPagePage.verifyDistributionOptions(
					"distributionOptions.jpeg",
				);
			},
		);
		await allure.step(
			"User should be able to clone a Pulse Survey with Distribution only from Survey Home Page",
			async () => {
				await surveyPage.navigateToSurveyHomePage();
				await surveyPage.cloneSurvey(pulseSurveyName, "Distribution");
				await surveyBuildPage.verifySurveyDuplicated(pulseSurveyName);
				await surveyBuildPage.verifyBuilderHasNoSectionsAndQuestions();
				await surveyPage.navigateTopSections("Configure");
				await surveyPage.checkAnonymousSurvey();
				await surveyPage.navigateTopSections("Distribution");
				await surveyPage.checkDistributionPage(constants.engageParticipant1);
			},
		);
	});
});

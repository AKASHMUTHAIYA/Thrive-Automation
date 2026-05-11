import { test } from "../../../Fixtures/application-setup";
import { allure } from "allure-playwright";
import { POManager } from "../../../Pages/POManager";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants";
import { generateRandomQuestionType } from "../../../Data/Resources/random-values";
import { generateRandomEmployeeProperty } from "../../../Data/Resources/random-values";
import { generateRandomSmartListName } from "../../../Data/Resources/random-values";
import PwActions from "playwright-framework/Core/pw-actions.js";

test.describe("Pulse Distribution page cases", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let surveyLaunchPage;
	let engageDistributionPage;
	let surveyBuilderPage;
	let commonutils;
	let newSectionToAdd;
	let newsectionDescriptionToAdd;
	let engageConfigurePage;
	let participantsDistributionPage;
	let time;
	let departmentName;
	let departmentMemberCount;
	let departmentsPage;
	let surveyName;
	let peoplePage;
	let smartListPage;
	let smartListName;
	let smartListMembersCount;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyPage = poManager.getSurveyPage();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyBuilderPage = poManager.getSurveyBuilderPage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		time = commonutils.getCurrentTime();
		participantsDistributionPage = poManager.getParticipantsDistributionPage();
		newSectionToAdd = CommonUtils.generateRandomText(5);
		newsectionDescriptionToAdd = CommonUtils.generateRandomText(15);
		departmentName = generateRandomEmployeeProperty().departmentName;
		departmentsPage = poManager.getDepartmentsPage();
		surveyName = `Pulse Survey${time}`;
		peoplePage = poManager.getPeoplePage();
		smartListPage = poManager.getSmartListPage();
		smartListName = generateRandomSmartListName();
		await allure.step("Navigates to Engage tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
		});
		await allure.step("creating Pulse survey", async () => {
			await surveyPage.createNewSurvey(surveyName);
		});
		await allure.step("Add section and question in Pulse Survey", async () => {
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
		});
		await allure.step(
			"Navigating to Configure page and setting Frequesncy for Pulse survey",
			async () => {
				await surveyPage.navigateTopSections("Configure");
				time = commonutils.getCurrentTime();
				await engageConfigurePage.setFrequencyForMonths(time);
			},
		);
		await allure.step("Navigating to Distribution page", async () => {
			await surveyPage.navigateTopSections("Distribution");
		});
	});

	test.afterEach(async ({ thrivePage }) => {
		await allure.step("Pause the pulse survey after test", async () => {
			await PwActions.pageRefresh(thrivePage);
			await engageConfigurePage.pausePulseSurvey();
		});
	});

	test("TC_01_Shortlisting the Participants in Live Pulse Survey @Regression", async ({
		thrivePage,
	}) => {
		await allure.step("Adding participants in Pulse Survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				constants.engageParticipant1,
			);
		});

		await allure.step("Launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
		});

		await allure.step("Verify the survey is launched", async () => {
			await surveyLaunchPage.confirmEngageSurveyLaunch("live");
		});

		await allure.step(
			"Navigating to invited tab after launching the survey and search the participant in invited tab",
			async () => {
				await engageDistributionPage.searchEmployee(
					constants.engageParticipant1,
				);
			},
		);

		await allure.step(
			"shortlisting the participants in Live Pulse survey and search the participant in Shortlisted tab",
			async () => {
				await CommonUtils.sleep(130);
				await engageDistributionPage.addParticipantsInLiveSurvey(
					constants.engageParticipant2,
					surveyPage.survey_name,
				);
				await engageDistributionPage.searchEmployee(
					constants.engageParticipant2,
				);
			},
		);

		await allure.step(
			"Verifying the shortlisted Participant and search the participant",
			async () => {
				await participantsDistributionPage.verifyEmployeeOrQRCode([
					constants.engageParticipant2,
				]);
				await engageDistributionPage.searchEmployee(
					constants.engageParticipant2,
				);
			},
		);
	});
	test("TC_02_add Participants from Department @Regression", async ({
		thrivePage,
	}) => {
		await allure.step("Add Participants from Department", async () => {
			await engageDistributionPage.addParticipantsInSurvey(departmentName);
			await engageDistributionPage.fixAllManagerMissing(constants.managerName);
		});
		await allure.step("Launch the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await engageDistributionPage.waitForCurrentPulseSurveyToBeLive();
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
			await surveyPage.selectSurveyFromList(surveyName);
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
			await engageDistributionPage.waitForCurrentPulseSurveyToBeLive();
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
			await surveyPage.selectSurveyFromList(surveyName);
		});
	});
});

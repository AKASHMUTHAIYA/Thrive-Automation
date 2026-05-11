import { allure } from "allure-playwright";
import { expect } from "@playwright/test";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { generateRandomEmployeeProperty } from "../../../Data/Resources/random-values.js";
import {
	generateRandomEmployeeNameAndEmail,
	constants,
} from "../../../Data/Resources/constants.js";
import { envDetails } from "../../../Data/test-data.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { SurveyBuilderPage } from "../../../Pages/Surveys/Survey_Builder/survey-builder-page.js";
import { EngageDistributionPage } from "../../../Pages/Engage/Engage_Distribution/engage-distribution-page.js";
import { SurveyLaunchPage } from "../../../Pages/Surveys/Launch/survey-launch-page.js";

test.describe("Add a survey collaborator and verify their functionality", () => {
	test("Add employee manually and send invite in one flow @Regression @surveyCollaborator", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"Creates one employee manually, sends invite immediately, and verifies Active status (and invite email) and adds a collaborator to the pulse survey",
		);

		const pom = new POManager(thrivePage);
		const empPage = pom.getEmployeePage();
		const readEmail = new ReadEmail();
		const commonFunctions = pom.getCommonPageFunctions();
		const surveyPage = pom.getSurveyPage();
		const commonutils = new CommonUtils();
		const time = commonutils.getCurrentTime();

		let signupUrl;
		let page2;

		const { departmentName, managerName, jobtitleName } =
			generateRandomEmployeeProperty();
		const { employeeName, employeeEmail } =
			generateRandomEmployeeNameAndEmail();
		const randomNum = CommonUtils.getRandomIntInclusive(10000, 99999);

		await commonFunctions.navigateTopNavigateSection("People");

		await allure.step("Add employee manually with all details", async () => {
			await empPage.addEmployeeManually(0, {
				name: employeeName,
				employeeEmail: employeeEmail,
				department: departmentName,
				manager: managerName,
				jobtitle: jobtitleName,
				employeeId: String(randomNum),
			});
		});

		await allure.step("Send invite immediately after adding", async () => {
			await empPage.sendInviteAfterImportingSliderOn();
		});

		await allure.step("Verify employee is Active", async () => {
			await empPage.searchEmployees(employeeName, "Active");
			await empPage.verifyEmployeeName(employeeName);
		});

		await allure.step("Verify invite email content", async () => {
			await empPage.verifyEmployeeInviteEmailContent(
				employeeName,
				envDetails.senderEmail,
				constants.new_employee_email,
				constants.new_employee_email_subject,
			);
		});

		await allure.step("Fetch signup URL from invite email", async () => {
			const signupBodyContent =
				constants.getEmailBodyContentForSignupUrl(employeeName);
			signupUrl = await readEmail.fetch_survey_url_from_email({
				from: envDetails.senderEmail,
				to: constants.new_employee_email,
				subject: constants.new_employee_email_subject,
				body: signupBodyContent,
			});
		});

		await allure.step("Create pulse survey and add collaborator", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");

			const surveyName = `pulse survey for collaborator${time}`;
			await surveyPage.createNewSurvey(surveyName);
			await surveyPage.navigateTopSections("Configure");

			const engageConfigurePage = pom.getEngageConfigurePage();
			await engageConfigurePage.setFrequencyForMonths(time);

			await surveyPage.addSurveyCollaborator(employeeName);
		});

		await allure.step(
			"Testing collaborator view and functionality",
			async () => {
				const loginPage = pom.getLoginPage();
				expect(signupUrl).toBeDefined();

				const { page2, password } = await loginPage.setOrResetPassword(
					signupUrl,
					browser,
					"set",
				);
				const pom2 = new POManager(page2);
				expect(password).toBeDefined();

				const collaboratorPage = page2;

				await loginPage.login(collaboratorPage, employeeEmail, password);
				await CommonUtils.sleep(120);
				await PwActions.pageRefresh(collaboratorPage);

				const surveycollaboratorLoginPage = pom2.getLoginPage(collaboratorPage);
				const surveyPage = pom2.getSurveyPage(collaboratorPage);
				const engageConfigurePage =
					pom2.getEngageConfigurePage(collaboratorPage);

				await surveycollaboratorLoginPage.clickOnIWillDoItLater();
				await surveycollaboratorLoginPage.switchToAdmin();

				await surveyPage.verifySurveyInCollaboratorView(EntityIds.surveyName);

				const surveyCount =
					await surveyPage.getTotalSurveysInCollaboratorView();
				expect(surveyCount).toBe(1);

				const surveyOptionsText = await surveyPage.getSurveyOptionsText(
					EntityIds.surveyName,
				);

				expect(surveyOptionsText).toEqual(
					expect.arrayContaining(constants.collaboratorSurveyOptions),
				);

				await surveyPage.isTemplateCardNotPresent();
				await surveyPage.clickOnSurvey(EntityIds.surveyName);

				const surveyBuilderPage = new SurveyBuilderPage(collaboratorPage);
				await surveyBuilderPage.addMultipleSectionsAndQuestions(
					1,
					1,
					"Rating Scale",
				);
				await surveyPage.navigateTopSections("Distribution");

				const engageDistributionPage = new EngageDistributionPage(
					collaboratorPage,
				);
				await engageDistributionPage.addParticipantsInSurvey(
					constants.engage_email,
				);

				const surveyLaunchPage = new SurveyLaunchPage(collaboratorPage);
				await surveyLaunchPage.launchSurvey();
				await surveyLaunchPage.confirmEngageSurveyLaunch();
			},
		);
	});
});

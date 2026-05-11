import { allure } from "allure-playwright";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import {
	constants,
	generateRandomEmployeeNameAndEmail,
} from "../../../Data/Resources/constants.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { LoginPage } from "../../../Pages/login-page.js";

test.describe("User creates exit survey for employees leaving the company", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let engageConfigurePage;
	let surveyLaunchPage;
	let engageDistributionPage;
	let surveyBuildEditPage;
	let EngageSurveyConfigure;
	let commonutils;
	let time;
	let surveyEUIPage;
	let cookieValue;
	let employeesPage;
	let peoplePage;
	let loginPage;
	let reportsHeaderPage;

	test.beforeEach(async ({ thrivePage, browser }) => {
		poManager = new POManager(thrivePage);
		commonutils = new CommonUtils();
		surveyEUIPage = poManager.getSurveyEUIPage();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyPage = poManager.getSurveyPage();
		employeesPage = poManager.getEmployeePage();
		peoplePage = poManager.getPeoplePage();
		time = commonutils.getCurrentTime();
		loginPage = new LoginPage(thrivePage);
		engageConfigurePage = poManager.getEngageConfigurePage();
		reportsHeaderPage = poManager.getReportsHederPage();
		cookieValue = "";
	});

	test("TC_01_User creates exit survey with new employee having past LWD and resolves eligibility conflict @exit-surveys @engage @regression", async ({
		thrivePage,
		browser,
	}) => {
		// Generate random employee details for the first employee (normal flow - no conflicts)
		const {
			employeeName: firstEmployeeName,
			employeeEmail: firstEmployeeEmail,
		} = generateRandomEmployeeNameAndEmail();
		// Generate random employee details for the second employee (with eligibility conflict)
		const {
			employeeName: secondEmployeeName,
			employeeEmail: secondEmployeeEmail,
		} = generateRandomEmployeeNameAndEmail();

		// First employee: Last Working Day 7 days from now (normal flow, no conflicts)
		const firstEmployeeLWD = CommonUtils.generateDateFromToday(7, "yyyy-MM-dd");
		// Second employee: Last Working Day 8 days AGO to create an eligibility conflict
		const pastLastWorkingDay = CommonUtils.generateDateFromToday(
			-8,
			"yyyy-MM-dd",
		);

		await allure.step(
			"User navigates to 'People' section and adds first employee with future last working day (normal flow)",
			async () => {
				await commonFunctions.navigateTopNavigateSection("People");
				await peoplePage.navigateToSections("Employees");

				// Add first employee with last working day set to 7 days from now (future date - normal flow)
				await employeesPage.addEmployeeManually(0, {
					name: firstEmployeeName,
					employeeEmail: firstEmployeeEmail,
					lastWorkingDay: firstEmployeeLWD,
					department: "HR",
					manager: "Evaluator Automation",
					jobtitle: "Designer",
				});
				await employeesPage.sendInviteAfterImportingSliderOn();
			},
		);

		await allure.step(
			"Add second employee with past last working day",
			async () => {
				// Add second employee with last working day set to 8 days AGO (past date)
				await employeesPage.addEmployeeManually(0, {
					name: secondEmployeeName,
					employeeEmail: secondEmployeeEmail,
					lastWorkingDay: pastLastWorkingDay,
					department: "HR",
					manager: "Evaluator Automation",
					jobtitle: "Designer",
				});
				await employeesPage.sendInviteAfterImportingSliderOn();
			},
		);

		await allure.step(
			"Deactivate the second employee to verify the deactivated employee able to attend the exit survey configuration",
			async () => {
				await employeesPage.searchEmployees(secondEmployeeEmail, "Active");
				await employeesPage.deactivateEmployee(secondEmployeeEmail);
			},
		);

		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});

		await allure.step(
			"User creates exit survey with 7 days before last working day configuration",
			async () => {
				await surveyPage.createNewSurvey(`Exit Survey ${time}`);
				await surveyBuildEditPage.addMultipleSectionsAndQuestions(
					1,
					1,
					"Rating Scale",
				);
			},
		);

		await allure.step("User configures the exit survey settings", async () => {
			await surveyPage.navigateTopSections("Configure");
			await surveyPage.scheduleSurveyFromNow(2);
		});

		await allure.step(
			"Enable deactivated employee eligibility and verify exit survey is non-anonymous",
			async () => {
				await engageConfigurePage.verifyDeactivatedEmployeeEligibilityCheckboxDisabled();
				await engageConfigurePage.selectDeactivatedEmployeeEmailType("Email");
				await engageConfigurePage.toggleDeactivatedEmployeeEligibilityCheckbox(
					true,
				);
				await engageConfigurePage.verifyExitSurveyIsNonAnonymousByDefault();
			},
		);

		await allure.step(
			"User adds the first employee (normal flow - no conflicts) as participant",
			async () => {
				await surveyPage.navigateTopSections("Distribution");
				await engageDistributionPage.addParticipantsInSurvey(firstEmployeeName);
			},
		);

		await allure.step(
			"Verify first participant status is 'Invite Pending' (normal flow)",
			async () => {
				await engageDistributionPage.verifyParticipantStatus(
					firstEmployeeName,
					"Invite Pending",
				);
			},
		);

		await allure.step(
			"User adds the second employee (with eligibility conflict) as participant",
			async () => {
				await engageDistributionPage.addAdditionalParticipants(
					secondEmployeeName,
				);
			},
		);

		await allure.step(
			"Verify second participant status is 'Missed' due to past Last Working Day",
			async () => {
				await engageDistributionPage.verifyParticipantStatus(
					secondEmployeeName,
					"Missed",
				);
			},
		);

		await allure.step("Navigate to Eligibility Conflicts section", async () => {
			await engageDistributionPage.navigateToEligibilityConflicts();
		});

		await allure.step(
			"Open second participant side panel and verify schedule input is disabled",
			async () => {
				await engageDistributionPage.openParticipantSidePanel(
					secondEmployeeName,
				);
				await engageDistributionPage.verifyScheduledButtonDisabled();
			},
		);

		await allure.step(
			"Verify Other Info tab shows correct manager details for second employee",
			async () => {
				// Note: Department might be empty for deactivated employees in the side panel
				await engageDistributionPage.verifyOtherInfoDetails({
					department: "HR",
					manager: "Evaluator Automation",
				});
			},
		);

		await allure.step("Navigate back to Data to Fix tab", async () => {
			await engageDistributionPage.navigateToEligibilityConflictsSidePanelTab(
				"Data to Fix",
			);
		});

		await allure.step(
			"Select new Last Working Day 7 days from now and click Update for second employee",
			async () => {
				await engageDistributionPage.updateDateInDatePicker(7);
			},
		);

		await allure.step(
			"Verify second participant status changed to 'Invite Pending'",
			async () => {
				// After clicking Update, the page should show the participant with updated status
				// Refresh the page to ensure we see the latest status
				await PwActions.pageRefresh(thrivePage);
				await commonFunctions.waitTillLoadingElementDisappear(10);
				await engageDistributionPage.verifyParticipantStatus(
					secondEmployeeName,
					"Invite Pending",
				);
			},
		);

		await allure.step("User launches the exit survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step("Employees attend the exit survey", async () => {
			// Wait for the scheduled time to pass and emails to be sent
			await CommonUtils.sleep(130);

			// Create array of employees with their details
			const employees = [
				{
					name: firstEmployeeName,
					email: firstEmployeeEmail,
					scenario: "Attend with default answer mixed values",
				},
				{
					name: secondEmployeeName,
					email: secondEmployeeEmail,
					scenario: "Attend with default answer mixed values",
				},
			];

			// Fetch all survey URLs in parallel using Promise.all
			const surveyURLs = await Promise.all(
				employees.map(async (employee) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.exit_email_subject,
							employee.email,
							constants.getExitEmailBody(employee.name, EntityIds.surveyName),
						);
					return { url: surveyURL, ...employee };
				}),
			);

			// Attend surveys sequentially
			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser: browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}
		});

		await allure.step(
			"Verify survey responses are recorded in Reports",
			async () => {
				await surveyPage.navigateTopSections("Reports");
				await CommonUtils.sleep(5);
				await PwActions.pageRefresh(thrivePage);
			},
		);

		await allure.step("Download and verify the overview report", async () => {
			await commonFunctions.navigateEngageReportsHeader("Overview");
			const { filePath } =
				await commonFunctions.downloadOverviewReport("Engage");
			const { textArray } = await commonutils.extractPdfText(filePath);
			CommonUtils.verifyArrayContainsAllElements(
				textArray,
				constants.exitReportTitles,
			);
		});

		await allure.step("Navigate to and download the heatmap", async () => {
			await commonFunctions.navigateEngageReportsHeader("Heatmap");
			const { filePath } = await commonFunctions.downloadHeatmap("Engage");
			const hasData = await commonutils.csvFileHasData(filePath);
			expect(hasData, "Heatmap CSV file has no data").toBeTruthy();
		});

		await allure.step(
			"Navigate to By Questions tab and download the response report",
			async () => {
				await commonFunctions.navigateEngageReportsHeader("Responses");
				await reportsHeaderPage.navigateHeaderReportSection("By Question");

				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);

		await allure.step(
			"Navigate to By Respondents tab and download the response report",
			async () => {
				await reportsHeaderPage.navigateHeaderReportSection("By Respondent");
				const { filePath } = await commonFunctions.downloadResponses("Engage");
				const hasData = await commonutils.csvFileHasData(filePath);
				expect(hasData, "Response CSV file has no data").toBeTruthy();
			},
		);
	});
});

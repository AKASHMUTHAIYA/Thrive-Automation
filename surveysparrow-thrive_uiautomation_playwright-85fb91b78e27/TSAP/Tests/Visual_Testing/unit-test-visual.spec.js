import { APIActions } from "playwright-framework/Core/API_Actions/api-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import { urlPaths } from "../../Data/Resources/urls.js";
import { envDetails } from "../../Data/test-data.js";
import { test } from "../../Fixtures/application-setup.js";
import { POManager } from "../../Pages/POManager.js";

test.describe("Unit Test", () => {
	test.skip("Unit_Test1", async ({ thrivePage, browser }) => {
		const poManager = new POManager(thrivePage);
		const loginpage = poManager.getLoginPage();
		const dashboardpage = poManager.getDashboardPage();
		const peoplePage = poManager.getPeoplePage();
		const employeepage = poManager.getEmployeePage();
		const departmentpage = poManager.getDepartmentsPage();
		const jobtitlepage = poManager.getJobTitlePage();
		const importspage = poManager.getImportsPage();
		const propertiesPage = poManager.getPropertyPage();
		const managermissingPage = poManager.getManagerMissingPage();
		const smartlistPage = poManager.getSmartListPage();
		const surveyPage = poManager.getSurveyPage();
		const surveybuildeditpage = poManager.getSurveyBuildEditPage();
		const reademail = new ReadEmail();
		const api_action = new APIActions();
		const surveyeuipage = poManager.getSurveyEUIPage();
		const communfunction = poManager.getCommonPageFunctions();
		const suveyparticipantspage = poManager.getSurveyParticipantsPage();
		const reportsheaderpage = poManager.getReportsHederPage();
		const commonutils = new CommonUtils();
		const responsepage = poManager.getResponsePgae();
		const approverPage = poManager.getApproverPage();
		const overviewPage = poManager.getOverviewPage();

		await dashboardpage.verifyPageUI();
	});
});

test.describe("Unit Test", () => {
	test.skip("Unit_Test2", async ({ thrivePage }) => {
		const poManager = new POManager(thrivePage);
		const surveyPage = poManager.getSurveyPage();
		const communfunction = poManager.getCommonPageFunctions();
		await communfunction.navigateTopNavigateSection("Performance");
		await surveyPage.verifyPageUI();
	});
});
test.describe.configure({ mode: "parallel" });

test("Visual Test DashboardPage", async ({ thrivePage }) => {
	const poManager = new POManager(thrivePage);
	const dashboardpage = poManager.getDashboardPage();
	await PwActions.goTo(thrivePage, envDetails.uri + urlPaths.overview);
	await dashboardpage.verifyPageUI();
});

test("Visual Test PerformancePage", async ({ thrivePage }) => {
	const poManager = new POManager(thrivePage);
	const surveypage = poManager.getSurveyPage();
	await PwActions.goTo(thrivePage, envDetails.uri + urlPaths.performance);
	await surveypage.verifyPageUI();
});

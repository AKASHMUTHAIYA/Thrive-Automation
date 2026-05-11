import { LoginPage } from "./login-page.js";
import { DashboardPage } from "./dashboard-page.js";
import { EUI } from "./Surveys/Attend_Survey/attend-survey-EUI-page.js";
import { EmployeesPage } from "./People/employees-page.js";
import { PeoplePage } from "./People/people-page.js";
import { DepartmentsPage } from "./People/departments-page.js";
import { JobTitlePage } from "./People/jobTitle-page.js";
import { ImportsPage } from "./People/imports-page.js";
import { PropertiesPage } from "./People/properties-page.js";
import { ManagerMissingPage } from "./People/manager-missing-page.js";
import { SmartListPage } from "./People/smart-list-page.js";
import { GuestsPage } from "./People/guests-page.js";
import { ApproverPage } from "./Performance/Approver_View/approver-report-page.js";
import { PerformanceConfigurePage } from "./Performance/Performance_Configure/performance-configure-page.js";
import { PerformanceParticipantsPage } from "./Performance/Performance_Participants/performance-participants.js";
import { PerformanceHeatmapPage } from "./Performance/Performance_Reports/performance-heatmap-page.js";
import { PerformanceResponsesPage } from "./Performance/Performance_Reports/performance-responses-page.js";
import { PerformanceOverviewPage } from "./Performance/Performance_Reports/performance-overview-page.js";
import { PerformanceReportsPage } from "./Performance/Performance_Reports/performance-reports-reports-page.js";
import { ReportsHeader } from "./Performance/Performance_Reports/reports-header-page.js";
import { ReportsPdfPage } from "./Performance/Performance_Reports/reports-pdf-page.js";
import { TasksPage } from "./Performance/tasks-page.js";
import { EngageConfigurePage } from "./Engage/Engage_Configure/engage-configure-page.js";
import { EngageDistributionPage } from "./Engage/Engage_Distribution/engage-distribution-page.js";
import { SurveyLaunchPage } from "./Surveys/Launch/survey-launch-page.js";
import { EngageOverviewPage } from "./Engage/Engage_Reports/engage-overview-page.js";
import { EngageHeatmapPage } from "./Engage/Engage_Reports/engage-heatmap-page.js";
import { EngageQuestionsPage } from "./Engage/Engage_Reports/engage-questions-page.js";
import { EngageResponsesPage } from "./Engage/Engage_Reports/engage-responses-page.js";
import { SurveyBuilderPage } from "./Surveys/Survey_Builder/survey-builder-page.js";
import { EngagePPTExportPage } from "./Engage/Engage_Reports/engage-ppt-export-page.js";
import { SurveyPreviewPage } from "./Surveys/Survey_Builder/survey-preview-page.js";
import SurveySettingsPage from "./Surveys/Survey_Builder/survey-settings-page.js";
import { ClustersPage } from "./People/cluster-page.js";
import { CommonPageFunctions } from "../Shared_Functions/common-functions.js";
import { SurveyPage } from "./Surveys/Survey_Listing_Page/survey-page.js";
import { ParticipantsDistributionPage } from "./Surveys/Participants_Distribution/participants-distribution-page.js";
import { PerformanceConfigureReports } from "./Performance/Performance_Configure/performance-configure-reports.js";
import { SurveyMessagingPage } from "./Performance/Performance_Configure/performance-messaging-page.js";
import { ActionablesPage } from "./Actionables/actionables-page.js";
import { EmployeesProfilePage } from "./People/employees-profile-page.js";
import { KudosPage } from "./Kudos/kudos-page.js";
import { EngageManagerView } from "./Engage/Engage_Reports/engage-manager-view.js";
import { EngageManagerOverviewPage } from "./Engage/Engage_Reports/engage-overview-page.js";
import { QuestionsEngagePulseManagerPage } from "./Engage/Engage_Reports/engage-questions-page.js";
import { EngagePulseManagerResponsesPage } from "./Engage/Engage_Reports/engage-responses-page.js";
import { HeatmapEngagePulsePage } from "./Engage/Engage_Reports/engage-heatmap-page.js";
import {
	EngageENPSPage,
	EngagePulseManagerENPSPage,
} from "./Engage/Engage_Reports/engage-eNPS-page.js";
import { ApproverTaskPage } from "./Performance/Approver_View/approver-task-page.js";
import { GlobalActionPlansPage } from "./ActionPlans/global-actionplans.js";
import GoalsCommon from "./Goals/goals-common.js";
import GoalsMyCompanyPage from "./Goals/goals-mycompany-page.js";
import GoalsOverviewPage from "./Goals/goals-overview-page.js";
import GoalsMyGoalsPage from "./Goals/goals-my-goals.js";
import { LogsPage } from "./People/logs-page.js";
import PortalBrandingPage from "./Accounts/portalBranding.js";
import BillingPage from "./Accounts/billing-page.js";
import { AuthenticationPage } from "./Accounts/authentication-page.js";
import { GoalsConfigurations } from "./Goals/goals-configurations.js";
import GoalsCycle from "./Goals/goals-cycle.js";
import { SurveysCommon } from "./Surveys/surveys-common.js";
import { OneOnOnePage } from "./OneOnOne/one-on-one-page.js";
import { IntegrationsPage } from "./Integrations/integrations-page.js";
import { EngageReportsBasePage } from "./Engage/Engage_Reports/engage-reports-page.js";
class POManager {
	constructor(page, request) {
		this.page = page;
		this.request = request;
		this.loginPage = new LoginPage(this.page);
		this.employeesPage = new EmployeesPage(this.page);
		this.dashboardPage = new DashboardPage(this.page);
		this.peoplePage = new PeoplePage(this.page);
		this.departmentsPage = new DepartmentsPage(this.page);
		this.JobTitlePage = new JobTitlePage(this.page);
		this.ImportsPage = new ImportsPage(this.page);
		this.PropertiesPage = new PropertiesPage(this.page);
		this.ManagerMissingPage = new ManagerMissingPage(this.page);
		this.SmartListPage = new SmartListPage(this.page);
		this.GuestsPage = new GuestsPage(this.page);
		this.SurveyBuilderPage = new SurveyBuilderPage(this.page);
		this.EngageDistributionPage = new EngageDistributionPage(this.page);
		this.EngageOverviewPage = new EngageOverviewPage(this.page);
		this.EngageQuestionsPage = new EngageQuestionsPage(this.page);
		this.EngageResponsesPage = new EngageResponsesPage(this.page);
		this.EngageHeatmapPage = new EngageHeatmapPage(this.page);
		this.EngageENPSPage = new EngageENPSPage(this.page);
		this.EngageConfigurePage = new EngageConfigurePage(this.page);
		this.EngageReportsBasePage = new EngageReportsBasePage(this.page);
		this.EngagePPTExportPage = new EngagePPTExportPage(this.page);
		this.SurveyLaunchPage = new SurveyLaunchPage(this.page);
		this.SurveyEUIPage = new EUI(this.page);
		this.CommonPageFunctions = new CommonPageFunctions(this.page);
		this.PerformanceParticipantsPage = new PerformanceParticipantsPage(
			this.page,
		);
		this.PerformanceResponsesPage = new PerformanceResponsesPage(this.page);
		this.PerformanceReportsPage = new PerformanceReportsPage(this.page);
		this.PerformanceOverviewPage = new PerformanceOverviewPage(this.page);
		this.PerformanceConfigurePage = new PerformanceConfigurePage(this.page);
		this.PerformanceHeatmapPage = new PerformanceHeatmapPage(this.page);
		this.SurveyPreviewPage = new SurveyPreviewPage(this.page);
		this.SurveyPage = new SurveyPage(this.page);
		this.ApproverPage = new ApproverPage(this.page);
		this.TasksPage = new TasksPage(this.page);
		this.ReportsHeader = new ReportsHeader(this.page);
		this.ReportsPdfPage = new ReportsPdfPage(this.page);
		this.ParticipantsDistributionPage = new ParticipantsDistributionPage(
			this.page,
		);
		this.PerformanceConfigureReports = new PerformanceConfigureReports(
			this.page,
		);
		this.surveyMessagingPage = new SurveyMessagingPage(this.page);
		this.actionablesPage = new ActionablesPage(this.page);
		this.ClustersPage = new ClustersPage(this.page);
		this.KudosPage = new KudosPage(this.page);
		this.employeesProfilePage = new EmployeesProfilePage(this.page);
		this.EngageManagerView = new EngageManagerView(this.page);
		this.EngageManagerOverviewPage = new EngageManagerOverviewPage(this.page);
		this.EngageManagerQuestionsPage = new QuestionsEngagePulseManagerPage(
			this.page,
		);
		this.EngageManagerResponsesPage = new EngagePulseManagerResponsesPage(
			this.page,
		);
		this.EngageManagerHeatmapPage = new HeatmapEngagePulsePage(this.page);
		this.EngagePulseManagerENPSPage = new EngagePulseManagerENPSPage(this.page);
		this.ApproverTaskPage = new ApproverTaskPage(this.page);
		this.GlobalActionPlansPage = new GlobalActionPlansPage(this.page);
		this.surveySettingsPage = new SurveySettingsPage(this.page);
		this.GoalsOverviewPage = new GoalsOverviewPage(this.page);
		this.GoalsMyCompanyPage = new GoalsMyCompanyPage(this.page);
		this.GoalsCommonPage = new GoalsCommon(this.page);
		this.GoalsMyGoalsPage = new GoalsMyGoalsPage(this.page);
		this.LogsPage = new LogsPage(this.page);
		this.PortalBrandingPage = new PortalBrandingPage(this.page);
		this.BillingPage = new BillingPage(this.page);
		this.AuthenticationPage = new AuthenticationPage(this.page);
		this.GoalsConfigurationsPage = new GoalsConfigurations(this.page);
		this.GoalsCyclePage = new GoalsCycle(this.page);
		this.SurveysCommonPage = new SurveysCommon(this.page);
		this.OneOnOnePage = new OneOnOnePage(this.page);
		this.IntegrationsPage = new IntegrationsPage(this.page);
	}

	getLoginPage() {
		return this.loginPage;
	}

	getDashboardPage() {
		return this.dashboardPage;
	}

	getEmployeePage() {
		return this.employeesPage;
	}

	getDepartmentsPage() {
		return this.departmentsPage;
	}

	getPeoplePage() {
		return this.peoplePage;
	}

	getJobTitlePage() {
		return this.JobTitlePage;
	}

	getImportsPage() {
		return this.ImportsPage;
	}
	getPropertyPage() {
		return this.PropertiesPage;
	}

	getManagerMissingPage() {
		return this.ManagerMissingPage;
	}

	getGuestsPage() {
		return this.GuestsPage;
	}

	getSmartListPage() {
		return this.SmartListPage;
	}

	getSurveyPage() {
		return this.SurveyPage;
	}

	getSurveyBuilderPage() {
		return this.SurveyBuilderPage;
	}

	getSurveyEUIPage() {
		return this.SurveyEUIPage;
	}

	getSurveyLaunchPage() {
		return this.SurveyLaunchPage;
	}

	getCommonPageFunctions() {
		return this.CommonPageFunctions;
	}

	getReportsHederPage() {
		return this.ReportsHeader;
	}

	getPerformanceReportsPage() {
		return this.PerformanceReportsPage;
	}

	getApproverPage() {
		return this.ApproverPage;
	}

	getReportsPdfPage() {
		return this.ReportsPdfPage;
	}
	getSurveyPreviewPage() {
		return this.SurveyPreviewPage;
	}

	getTasksPage() {
		return this.TasksPage;
	}

	getEngageConfigurePage() {
		return this.EngageConfigurePage;
	}

	getSurveysBuilderPage() {
		return this.SurveyBuilderPage;
	}

	getEngageQuestionsPage() {
		return this.EngageQuestionsPage;
	}

	getEngageResponsesPage() {
		return this.EngageResponsesPage;
	}

	getEngageHeatmapPage() {
		return this.EngageHeatmapPage;
	}

	getEngageOverviewPage() {
		return this.EngageOverviewPage;
	}
	getEngagePPTExportPage() {
		return this.EngagePPTExportPage;
	}

	getEngageENPSPage() {
		return this.EngageENPSPage;
	}
	getPerformanceParticipantsPage() {
		return this.PerformanceParticipantsPage;
	}

	getPerformanceConfigurePage() {
		return this.PerformanceConfigurePage;
	}

	getTasksPage() {
		return this.TasksPage;
	}

	getPerformanceHeatmapPage() {
		return this.PerformanceHeatmapPage;
	}

	getPerformanceResponsesPage() {
		return this.PerformanceResponsesPage;
	}

	getPerformanceOverviewPage() {
		return this.PerformanceOverviewPage;
	}

	getPerformanceHeatmapPage() {
		return this.PerformanceHeatmapPage;
	}

	getPerformanceResponsesPage() {
		return this.PerformanceResponsesPage;
	}

	getEngageDistributionPage() {
		return this.EngageDistributionPage;
	}

	getParticipantsDistributionPage() {
		return this.ParticipantsDistributionPage;
	}

	getPerformanceConfigureReports() {
		return this.PerformanceConfigureReports;
	}
	getSurveyMessagingPage() {
		return this.surveyMessagingPage;
	}

	getActionablesPage() {
		return this.actionablesPage;
	}

	getKudosPage() {
		return this.KudosPage;
	}
	getEmployeesProfilePage() {
		return this.employeesProfilePage;
	}
	getEngageManagerView() {
		return this.EngageManagerView;
	}
	getEngageManagerOverviewPage() {
		return this.EngageManagerOverviewPage;
	}
	getEngageManagerQuestionsPage() {
		return this.EngageManagerQuestionsPage;
	}
	getEngageManagerResponsesPage() {
		return this.EngageManagerResponsesPage;
	}
	getEngageManagerHeatmapPage() {
		return this.EngageManagerHeatmapPage;
	}
	getEngagePulseManagerENPSPage() {
		return this.EngagePulseManagerENPSPage;
	}
	getApproverTaskPage() {
		return this.ApproverTaskPage;
	}
	getGlobalActionPlansPage() {
		return this.GlobalActionPlansPage;
	}

	getSurveySettingsPage() {
		return this.surveySettingsPage;
	}
	getGoalsOverviewPage() {
		return this.GoalsOverviewPage;
	}
	getGoalsMyCompanyPage() {
		return this.GoalsMyCompanyPage;
	}
	getGoalsCommonPage() {
		return this.GoalsCommonPage;
	}
	getGoalsMyGoalsPage() {
		return this.GoalsMyGoalsPage;
	}
	getLogsPage() {
		return this.LogsPage;
	}
	getPortalBrandingPage() {
		return this.PortalBrandingPage;
	}
	getBillingPage() {
		return this.BillingPage;
	}
	getAuthenticationPage() {
		return this.AuthenticationPage;
	}
	getGoalsConfigurationsPage() {
		return this.GoalsConfigurationsPage;
	}
	getGoalsCyclePage() {
		return this.GoalsCyclePage;
	}
	getSurveysCommonPage() {
		return this.SurveysCommonPage;
	}
	getOneOnOnePage() {
		return this.OneOnOnePage;
	}
	getClustersPage() {
		return this.ClustersPage;
	}
	getEngageReportsBasePage() {
		return this.EngageReportsBasePage;
	}
	getIntegrationsPage() {
		return this.IntegrationsPage;
	}
}

export { POManager };

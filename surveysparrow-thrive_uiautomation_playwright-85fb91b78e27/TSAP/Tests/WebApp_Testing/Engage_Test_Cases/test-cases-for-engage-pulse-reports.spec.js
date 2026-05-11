import { allure } from "allure-playwright";
import { test } from "../../../Fixtures/application-setup.js";
import { expect } from "@playwright/test";
import { POManager } from "../../../Pages/POManager.js";
import {
	engage_admin_report_data,
	engage_admin_report_data_with_filter,
} from "../../../Data/Resources/predefined_test_data.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../../Data/Resources/constants.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

test.describe("Engage Pulse Reports Cases", () => {
	let poManager;
	let commonFunctions;
	let surveyPage;
	let surveyLaunchPage;
	let engageDistributionPage;
	let surveyBuildEditPage;
	let EngageSurveyConfigure;
	let time;
	let surveyEUIPage;
	let engageOverviewPage;
	let engageHeatmapPage;
	let engageQuestionsPage;
	let engageManagerView;
	let loginPage;
	let commonUtils;
	let clustersPage;
	let cookieValue;
	let engageReportsBasePage;
	const clusterName = `Cluster_${Date.now()}`; //Cluster_1773774954011
	const viewName = `View_${Date.now()}`;
	const getParticipants = () => [
		{
			email: constants.subject_email,
			name: constants.subjectName,
			scenario: "Attend with default answer high values with mix of N/A and 0",
		},
		{
			email: constants.subject_email2,
			name: constants.subjectName2,
			scenario: "Attend with default answer mixed values",
		},
		{
			email: constants.subjectEmail3,
			name: constants.subjectName3,
			scenario: "Attend with default answer mixed values",
		},
		{
			email: constants.subjectEmail4,
			name: constants.subjectName4,
			scenario: "Attend with default answer high values with mix of N/A and 0",
		},
		{
			email: constants.engageParticipant1Email,
			name: constants.engageParticipant1,
			scenario: "Attend with default answer high values",
		},
		{
			email: constants.engageParticipant2Email,
			name: constants.engageParticipant2,
			scenario: "Attend with default answer low values",
		},
		{
			email: constants.engageParticipant3Email,
			name: constants.engageParticipant3,
			scenario: "Attend with default answer low values",
		},
		{
			email: constants.engageParticipant4Email,
			name: constants.engageParticipant4,
			scenario: "Attend with default answer high values",
		},
	];
	const groupsData = [
		{
			cluster: clusterName,
			groupName: "Group 1",
			groupHeads: [constants.managerName],
			groupMembers: [
				constants.subjectName,
				constants.subjectName2,
				constants.subjectName3,
				constants.subjectName4,
			],
		},
		{
			cluster: clusterName,
			groupName: "Group 2",
			groupHeads: [constants.managerName],
			groupMembers: [
				constants.engageParticipant1,
				constants.engageParticipant2,
				constants.engageParticipant3,
				constants.engageParticipant4,
			],
		},
	];

	test.beforeEach(async ({ thrivePage, browser }) => {
		poManager = new POManager(thrivePage);
		commonUtils = new CommonUtils();
		surveyEUIPage = poManager.getSurveyEUIPage();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		EngageSurveyConfigure = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyPage = poManager.getSurveyPage();
		time = commonUtils.getCurrentTime();
		engageOverviewPage = poManager.getEngageOverviewPage();
		engageHeatmapPage = poManager.getEngageHeatmapPage();
		engageQuestionsPage = poManager.getEngageQuestionsPage();
		engageManagerView = poManager.getEngageManagerView();
		loginPage = poManager.getLoginPage();
		clustersPage = poManager.getClustersPage();
		engageReportsBasePage = poManager.getEngageReportsBasePage();
		cookieValue = "";
	});
	test("TC_01_User creates non-anonymous engage survey and adds participants and attends survey @engage @non-anonymous @reports @regression @smoke @engagereport ", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step(
			"Create a cluster that will be used for visibility",
			async () => {
				await commonFunctions.navigateTopNavigateSection("People");
				await clustersPage.navigateToClusters();
				await clustersPage.createCluster({
					clusterName,
					clusterHeadTitle: "Director",
				});
				await clustersPage.createGroupsInCluster(groupsData);
				await CommonUtils.sleep(1);
				const clusterExists =
					await clustersPage.verifyClusterExists(clusterName);
				expect(
					clusterExists,
					`Cluster ${clusterName} should be available for visibility`,
				).toBe(true);
			},
		);
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("User creates engage survey", async () => {
			await surveyPage.createNewSurvey(`Engage Survey ${time}`);
			await surveyBuildEditPage.addMultipleSectionsAndQuestions(
				2,
				2,
				"Rating Scale",
			);
			await surveyPage.navigateTopSections("Configure");
			await EngageSurveyConfigure.addClusterVisibility(clusterName);
			await EngageSurveyConfigure.nonAnonymousSurvey();
			await EngageSurveyConfigure.managerAnonymityToggleTurnOff();
			await EngageSurveyConfigure.managerFiltersTurnOn();
			await surveyPage.navigateTopSections("Distribution");
		});

		const participants = getParticipants();

		await allure.step("User adds participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
		});

		await allure.step("User launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step("Attend the survey", async () => {
			const surveyURLs = await Promise.all(
				participants.map(async (participant) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.engage_email_subject,
							participant.email,
							constants.getEngageEmailBody(
								participant.name,
								EntityIds.surveyName,
							),
						);
					return { url: surveyURL, ...participant };
				}),
			);

			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}
		});

		await allure.step("Navigate to overview tab", async () => {
			await surveyPage.navigateTopSections("Reports");
			await CommonUtils.sleep(20);
			await PwActions.pageRefresh(thrivePage);
			await CommonUtils.sleep(2);
			await engageReportsBasePage.applyEngageFilter({
				groupByName: clusterName,
				filters: [
					{
						filterByKey: "Department",
						filterByValues: ["Engineering"],
					},
				],
			});
			await engageReportsBasePage.saveView(viewName);
			await engageReportsBasePage.shareView(viewName, constants.subjectName);
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data,
				settings: "non-anonymous",
				clusterName,
			});
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data_with_filter,
				settings: "non-anonymous",
				filterBy: [
					{
						groupByName: clusterName,
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
				clusterName,
			});
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data_with_filter,
				settings: "non-anonymous",
				filterBy: [
					{
						groupByName: "Department",
						filters: [
							{
								filterByKey: "Country",
								filterByValues: ["PK"],
							},
							{
								filterByKey: "Gender",
								filterByValues: ["Male"],
							},
						],
					},
					{
						groupByName: "Gender",
						filters: [
							{
								filterByKey: "custom dropdown",
								filterByValues: ["option2"],
							},
						],
					},
					{
						groupByName: clusterName,
						filters: [
							{
								filterByKey: clusterName,
								filterByValues: ["Group 1"],
							},
						],
					},
					{
						groupByName: clusterName,
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
					{
						groupByName: "Manager",
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
				clusterName,
			});
		});
		await allure.step("Navigate to heatmap tab and verify data", async () => {
			await commonFunctions.navigateToTabs("Heatmap");
			await engageHeatmapPage.verifyHeatmapTab({
				expectedData: engage_admin_report_data,
				clusterName,
			});
			await engageHeatmapPage.verifyHeatmapTab({
				expectedData: engage_admin_report_data_with_filter,
				filterBy: [
					{
						groupByName: "Gender",
						filters: [
							{
								filterByKey: "custom dropdown",
								filterByValues: ["option2"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
			});
		});
		await allure.step("Verify Questions tab data", async () => {
			await surveyPage.navigateTopSections("Reports");
			await commonFunctions.navigateToTabs("Questions");
			await engageQuestionsPage.verifyQuestionsTab({
				expectedData: engage_admin_report_data,
				settings: "non-anonymous",
			});
			await engageQuestionsPage.verifyQuestionsTab({
				expectedData: engage_admin_report_data_with_filter,
				settings: "non-anonymous",
				filterBy: [
					{
						groupByName: "Questions",
						filters: [
							{
								filterByKey: "Gender",
								filterByValues: ["Male"],
							},
						],
					},
					{
						groupByName: "Reporting Factors",
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
			});
		});
		await allure.step("Verify Responses tab data", async () => {
			await commonFunctions.navigateToTabs("Responses");
			await engageQuestionsPage.verifyResponsesTab({
				expectedData: engage_admin_report_data,
			});
			await engageQuestionsPage.verifyResponsesTab({
				expectedData: engage_admin_report_data,
				scoreBy: "Percentage Score",
			});
		});

		await loginPage.navigateToHomepageAndSignout();
		await CommonUtils.sleep(1);
		await engageManagerView.loginToManagerViewToSurveyReports(
			EntityIds.surveyName,
			EntityIds.surveyId,
		);
		await engageOverviewPage.verifyOverviewTab({
			expectedData: engage_admin_report_data,
			settings: "non-anonymous",
			viewType: "manager",
			clusterName,
		});
		await engageOverviewPage.verifyOverviewTab({
			expectedData: engage_admin_report_data_with_filter,
			settings: "non-anonymous",
			viewType: "manager",
			filterBy: [
				{
					groupByName: clusterName,
					filters: [
						{
							filterByKey: clusterName,
							filterByValues: ["Group 1"],
						},
					],
				},
			],
			clusterName,
			scoreBy: "Percentage Score",
		});
		await engageOverviewPage.verifyOverviewTab({
			expectedData: engage_admin_report_data_with_filter,
			settings: "non-anonymous",
			viewType: "manager",
			filterBy: [
				{
					groupByName: "Department",
					filters: [
						{
							filterByKey: "Country",
							filterByValues: ["PK"],
						},
					],
				},
				{
					groupByName: "Gender",
					filters: [
						{
							filterByKey: "custom dropdown",
							filterByValues: ["option2"],
						},
					],
				},
				{
					groupByName: clusterName,
					filters: [
						{
							filterByKey: "Department",
							filterByValues: ["Engineering"],
						},
					],
				},
				{
					groupByName: "Manager",
					filters: [
						{
							filterByKey: "Department",
							filterByValues: ["Engineering"],
						},
					],
				},
				{
					groupByName: "Department",
					filters: [
						{
							filterByKey: "Country",
							filterByValues: ["PK", "IN"],
						},
						{
							filterByKey: "Gender",
							filterByValues: ["Male", "Female"],
						},
					],
				},
			],
			scoreBy: "Percentage Score",
			clusterName,
		});
		await PwActions.click(thrivePage, engageManagerView.txtQuestionsTab);
		await engageQuestionsPage.verifyQuestionsTab({
			expectedData: engage_admin_report_data,
			settings: "non-anonymous",
		});
		await engageQuestionsPage.verifyQuestionsTab({
			expectedData: engage_admin_report_data_with_filter,
			settings: "non-anonymous",
			filterBy: [
				{
					groupByName: "Questions",
					filters: [
						{
							filterByKey: "Gender",
							filterByValues: ["Male"],
						},
					],
				},
				{
					groupByName: "Reporting Factors",
					filters: [
						{
							filterByKey: "Department",
							filterByValues: ["Engineering"],
						},
					],
				},
			],
			scoreBy: "Percentage Score",
		});
		await PwActions.click(thrivePage, engageManagerView.txtResponsesTab);
		await engageQuestionsPage.verifyResponsesTab({
			expectedData: engage_admin_report_data,
		});
		await engageQuestionsPage.verifyResponsesTab({
			expectedData: engage_admin_report_data,
			scoreBy: "Percentage Score",
		});
	});
	test("TC_02_User creates non-anonymous pulse survey and adds participants and attends survey @pulse @non-anonymous @reports @regression @engagereport", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("User creates engage survey", async () => {
			await surveyPage.createNewSurvey(`Pulse Survey ${time}`);
			await surveyBuildEditPage.addMultipleSectionsAndQuestions(
				2,
				2,
				"Rating Scale",
			);
			await surveyPage.navigateTopSections("Configure");
			//await EngageSurveyConfigure.addClusterVisibility(clusterName);
			await EngageSurveyConfigure.nonAnonymousSurvey();
			await EngageSurveyConfigure.managerAnonymityToggleTurnOff();
			await EngageSurveyConfigure.managerFiltersTurnOn();
			time = commonUtils.getCurrentTime();
			await EngageSurveyConfigure.setFrequencyForMonths(time);
			await surveyPage.navigateTopSections("Distribution");
		});

		const participants = getParticipants();

		await allure.step("User adds participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
		});

		await allure.step("User launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(130);
		});

		await allure.step("Attend the survey and verify the data", async () => {
			const surveyURLs = await Promise.all(
				participants.map(async (participant) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.engage_email_subject,
							participant.email,
							constants.getPulseEmailBody(
								participant.name,
								EntityIds.surveyName,
							),
						);
					return { url: surveyURL, ...participant };
				}),
			);

			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}

			await allure.step("Navigate to overview tab", async () => {
				await surveyPage.navigateTopSections("Reports");
				await CommonUtils.sleep(20);
				await PwActions.pageRefresh(thrivePage);
				await engageOverviewPage.verifyOverviewTab({
					expectedData: engage_admin_report_data,
					settings: "non-anonymous",
					surveyType: "Pulse",
				});
				await engageOverviewPage.verifyOverviewTab({
					expectedData: engage_admin_report_data_with_filter,
					settings: "non-anonymous",
					surveyType: "Pulse",
					filterBy: [
						{
							groupByName: "Department",
							filters: [
								{
									filterByKey: "Country",
									filterByValues: ["PK"],
								},
							],
						},
						{
							groupByName: "Gender",
							filters: [
								{
									filterByKey: "custom dropdown",
									filterByValues: ["option2"],
								},
							],
						},
						{
							groupByName: "Manager",
							filters: [
								{
									filterByKey: "Department",
									filterByValues: ["Engineering"],
								},
							],
						},
					],
					scoreBy: "Percentage Score",
				});
			});
			await allure.step("Navigate to heatmap tab and verify data", async () => {
				await commonFunctions.navigateToTabs("Heatmap");
				await engageHeatmapPage.verifyHeatmapTab({
					expectedData: engage_admin_report_data,
				});
				await engageHeatmapPage.verifyHeatmapTab({
					expectedData: engage_admin_report_data_with_filter,
					filterBy: [
						{
							groupByName: "Gender",
							filters: [
								{
									filterByKey: "custom dropdown",
									filterByValues: ["option2"],
								},
							],
						},
					],
					scoreBy: "Percentage Score",
				});
			});
			await allure.step("Verify Questions tab data", async () => {
				await surveyPage.navigateTopSections("Reports");
				await commonFunctions.navigateToTabs("Questions");
				await engageQuestionsPage.verifyQuestionsTab({
					expectedData: engage_admin_report_data,
					settings: "non-anonymous",
				});
				await engageQuestionsPage.verifyQuestionsTab({
					expectedData: engage_admin_report_data_with_filter,
					settings: "non-anonymous",
					filterBy: [
						{
							groupByName: "Questions",
							filters: [
								{
									filterByKey: "Gender",
									filterByValues: ["Male"],
								},
							],
						},
						{
							groupByName: "Reporting Factors",
							filters: [
								{
									filterByKey: "Department",
									filterByValues: ["Engineering"],
								},
							],
						},
					],
					scoreBy: "Percentage Score",
				});
			});
			await allure.step("Verify Responses tab data", async () => {
				await commonFunctions.navigateToTabs("Responses");
				await engageQuestionsPage.verifyResponsesTab({
					expectedData: engage_admin_report_data,
				});
				await engageQuestionsPage.verifyResponsesTab({
					expectedData: engage_admin_report_data,
					scoreBy: "Percentage Score",
				});
			});
			await loginPage.navigateToHomepageAndSignout();
			await CommonUtils.sleep(1);
			await engageManagerView.loginToManagerViewToSurveyReports(
				EntityIds.surveyName,
				EntityIds.surveyId,
			);
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data,
				settings: "non-anonymous",
				surveyType: "Pulse",
				viewType: "manager",
			});
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data_with_filter,
				settings: "non-anonymous",
				surveyType: "Pulse",
				viewType: "manager",
				filterBy: [
					{
						groupByName: "Department",
						filters: [
							{
								filterByKey: "Country",
								filterByValues: ["PK"],
							},
						],
					},
					{
						groupByName: "Gender",
						filters: [
							{
								filterByKey: "custom dropdown",
								filterByValues: ["option2"],
							},
						],
					},
					{
						groupByName: "Manager",
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
			});
			await PwActions.click(thrivePage, engageManagerView.txtQuestionsTab);
			await engageQuestionsPage.verifyQuestionsTab({
				expectedData: engage_admin_report_data,
				settings: "non-anonymous",
			});
			await engageQuestionsPage.verifyQuestionsTab({
				expectedData: engage_admin_report_data_with_filter,
				settings: "non-anonymous",
				filterBy: [
					{
						groupByName: "Questions",
						filters: [
							{
								filterByKey: "Gender",
								filterByValues: ["Male"],
							},
						],
					},
					{
						groupByName: "Reporting Factors",
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
			});
			await PwActions.click(thrivePage, engageManagerView.txtResponsesTab);
			await engageQuestionsPage.verifyResponsesTab({
				expectedData: engage_admin_report_data,
			});
			await engageQuestionsPage.verifyResponsesTab({
				expectedData: engage_admin_report_data,
				scoreBy: "Percentage Score",
			});
		});
	});
	test("TC_03_User creates Anonymous engage survey and adds participants and attends survey @engage @anonymous @reports @regression @engagereport", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("User creates engage survey", async () => {
			await surveyPage.createNewSurvey(`Anonymous Engage Survey ${time}`);
			await surveyBuildEditPage.addMultipleSectionsAndQuestions(
				2,
				2,
				"Rating Scale",
			);
			await surveyPage.navigateTopSections("Configure");
			//await EngageSurveyConfigure.addClusterVisibility(clusterName);
			await EngageSurveyConfigure.managerFiltersTurnOn();
			await surveyPage.navigateTopSections("Distribution");
		});

		const participants = getParticipants();

		await allure.step("User adds participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
		});

		await allure.step("User launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});

		await allure.step("Attend the survey", async () => {
			const surveyURLs = await Promise.all(
				participants.map(async (participant) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.engage_email_subject,
							participant.email,
							constants.getEngageEmailBody(
								participant.name,
								EntityIds.surveyName,
							),
						);
					return { url: surveyURL, ...participant };
				}),
			);

			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}
		});
		await allure.step("Navigate to overview tab", async () => {
			await surveyPage.navigateTopSections("Reports");
			await CommonUtils.sleep(20);
			await PwActions.pageRefresh(thrivePage);
			await CommonUtils.sleep(2);
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data,
			});
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data_with_filter,
				filterBy: [
					{
						groupByName: "Department",
						filters: [
							{
								filterByKey: "Country",
								filterByValues: ["PK", "IN"],
							},
							{
								filterByKey: "Gender",
								filterByValues: ["Male", "Female"],
							},
						],
					},
					{
						groupByName: "Department",
						filters: [
							{
								filterByKey: "Country",
								filterByValues: ["PK"],
							},
						],
					},
					{
						groupByName: "Manager",
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
			});
		});
		await allure.step("Navigate to heatmap tab and verify data", async () => {
			await commonFunctions.navigateToTabs("Heatmap");
			await engageHeatmapPage.verifyHeatmapTab({
				expectedData: engage_admin_report_data,
			});
		});
		await engageHeatmapPage.verifyHeatmapTab({
			expectedData: engage_admin_report_data_with_filter,
			filterBy: [
				{
					groupByName: "Gender",
					filters: [
						{
							filterByKey: "custom dropdown",
							filterByValues: ["option2"],
						},
					],
				},
			],
			scoreBy: "Percentage Score",
		});
		await allure.step("Verify Questions tab data", async () => {
			await surveyPage.navigateTopSections("Reports");
			await commonFunctions.navigateToTabs("Questions");
			await engageQuestionsPage.verifyQuestionsTab({
				expectedData: engage_admin_report_data,
			});
			await engageQuestionsPage.verifyQuestionsTab({
				expectedData: engage_admin_report_data_with_filter,
				scoreBy: "Percentage Score",
				filterBy: [
					{
						groupByName: "Questions",
						filters: [
							{
								filterByKey: "Gender",
								filterByValues: ["Male", "Female"],
							},
							{
								filterByKey: "Country",
								filterByValues: ["IN", "PK"],
							},
						],
					},
					{
						groupByName: "Reporting Factors",
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
				],
			});
		});
		await allure.step("Verify Responses tab data", async () => {
			await commonFunctions.navigateToTabs("Responses");
			await engageQuestionsPage.verifyResponsesTab({
				expectedData: engage_admin_report_data,
			});
			await engageQuestionsPage.verifyResponsesTab({
				expectedData: engage_admin_report_data,
				scoreBy: "Percentage Score",
			});
		});
		await allure.step(
			"Navigate to configure and anonymity tab and change threshold and check reports",
			async () => {
				await EngageSurveyConfigure.setAdminThreshold("100");
				await engageOverviewPage.verifyNoDataMessage();
				await EngageSurveyConfigure.setAdminThreshold("2");
			},
		);
		await loginPage.navigateToHomepageAndSignout();
		await CommonUtils.sleep(1);
		await engageManagerView.loginToManagerViewToSurveyReports(
			EntityIds.surveyName,
			EntityIds.surveyId,
		);
		await engageOverviewPage.verifyOverviewTab({
			expectedData: engage_admin_report_data,
			viewType: "manager",
		});
		await engageOverviewPage.verifyOverviewTab({
			expectedData: engage_admin_report_data_with_filter,
			viewType: "manager",
			filterBy: [
				{
					groupByName: "Gender",
					filters: [
						{
							filterByKey: "custom dropdown",
							filterByValues: ["option2"],
						},
					],
				},
				{
					groupByName: "Manager",
					filters: [
						{
							filterByKey: "Department",
							filterByValues: ["Engineering"],
						},
					],
				},
				{
					groupByName: "Department",
					filters: [
						{
							filterByKey: "Country",
							filterByValues: ["PK"],
						},
					],
				},
			],
			scoreBy: "Percentage Score",
		});
		await PwActions.click(thrivePage, engageManagerView.txtQuestionsTab);
		await engageQuestionsPage.verifyQuestionsTab({
			expectedData: engage_admin_report_data,
		});
		await engageQuestionsPage.verifyQuestionsTab({
			expectedData: engage_admin_report_data_with_filter,
			scoreBy: "Percentage Score",
			filterBy: [
				{
					groupByName: "Questions",
					filters: [
						{
							filterByKey: "Gender",
							filterByValues: ["Male"],
						},
					],
				},
				{
					groupByName: "Reporting Factors",
					filters: [
						{
							filterByKey: "Department",
							filterByValues: ["Engineering"],
						},
					],
				},
			],
		});
		await PwActions.click(thrivePage, engageManagerView.txtResponsesTab);
		await engageQuestionsPage.verifyResponsesTab({
			expectedData: engage_admin_report_data,
		});
		await engageQuestionsPage.verifyResponsesTab({
			expectedData: engage_admin_report_data,
			scoreBy: "Percentage Score",
		});
	});
	test("TC_04_User creates anonymous pulse survey and adds participants and attends survey @pulse @anonymous @reports @regression @engagereport", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step("User navigates to 'Engage' tab", async () => {
			await commonFunctions.navigateTopNavigateSection("Engage");
			cookieValue = await thrivePage.context().cookies();
		});
		await allure.step("User creates anonymous pulse survey", async () => {
			await surveyPage.createNewSurvey(`Anonymous Pulse Survey ${time}`);
			await surveyBuildEditPage.addMultipleSectionsAndQuestions(
				2,
				2,
				"Rating Scale",
			);
			await surveyPage.navigateTopSections("Configure");
			time = commonUtils.getCurrentTime();
			await EngageSurveyConfigure.setFrequencyForMonths(time);
			await EngageSurveyConfigure.managerFiltersTurnOn();
			//await EngageSurveyConfigure.addClusterVisibility(clusterName);
			await surveyPage.navigateTopSections("Distribution");
		});

		const participants = getParticipants();

		await allure.step("User adds participants to the survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
		});

		await allure.step("User launches the survey", async () => {
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
			await CommonUtils.sleep(130);
		});

		await allure.step("Attend the survey and verify the data", async () => {
			const surveyURLs = await Promise.all(
				participants.map(async (participant) => {
					const surveyURL =
						await commonFunctions.open_survey_from_received_email(
							constants.engage_email_subject,
							participant.email,
							constants.getPulseEmailBody(
								participant.name,
								EntityIds.surveyName,
							),
						);
					return { url: surveyURL, ...participant };
				}),
			);

			for (const surveyData of surveyURLs) {
				await surveyEUIPage.attendEngagePulseSurvey({
					survey_url: surveyData.url,
					browser,
					subjectName: surveyData.name,
					settings: [surveyData.scenario],
				});
			}
			await allure.step("Navigate to overview tab", async () => {
				await surveyPage.navigateTopSections("Reports");
				await CommonUtils.sleep(20);
				await PwActions.pageRefresh(thrivePage);
				await engageOverviewPage.verifyOverviewTab({
					expectedData: engage_admin_report_data,
					surveyType: "Pulse",
				});
				await engageOverviewPage.verifyOverviewTab({
					expectedData: engage_admin_report_data_with_filter,
					surveyType: "Pulse",
					filterBy: [
						{
							groupByName: "Department",
							filters: [
								{
									filterByKey: "Country",
									filterByValues: ["PK"],
								},
							],
						},
						{
							groupByName: "Gender",
							filters: [
								{
									filterByKey: "custom dropdown",
									filterByValues: ["option2"],
								},
							],
						},
						{
							groupByName: "Manager",
							filters: [
								{
									filterByKey: "Department",
									filterByValues: ["Engineering"],
								},
							],
						},
					],
					scoreBy: "Percentage Score",
				});
			});
			await allure.step("Navigate to heatmap tab and verify data", async () => {
				await commonFunctions.navigateToTabs("Heatmap");
				await engageHeatmapPage.verifyHeatmapTab({
					expectedData: engage_admin_report_data,
				});
				await engageHeatmapPage.verifyHeatmapTab({
					expectedData: engage_admin_report_data_with_filter,
					filterBy: [
						{
							groupByName: "Gender",
							filters: [
								{
									filterByKey: "custom dropdown",
									filterByValues: ["option2"],
								},
							],
						},
					],
					scoreBy: "Percentage Score",
				});
			});
			await allure.step("Verify Questions tab data", async () => {
				await surveyPage.navigateTopSections("Reports");
				await commonFunctions.navigateToTabs("Questions");
				await engageQuestionsPage.verifyQuestionsTab({
					expectedData: engage_admin_report_data,
				});
				await engageQuestionsPage.verifyQuestionsTab({
					expectedData: engage_admin_report_data_with_filter,
					filterBy: [
						{
							groupByName: "Questions",
							filters: [
								{
									filterByKey: "Gender",
									filterByValues: ["Male"],
								},
							],
						},
						{
							groupByName: "Reporting Factors",
							filters: [
								{
									filterByKey: "Department",
									filterByValues: ["Engineering"],
								},
							],
						},
					],
					scoreBy: "Percentage Score",
				});
			});
			await allure.step("Verify Responses tab data", async () => {
				await commonFunctions.navigateToTabs("Responses");
				await engageQuestionsPage.verifyResponsesTab({
					expectedData: engage_admin_report_data,
				});
				await engageQuestionsPage.verifyResponsesTab({
					expectedData: engage_admin_report_data,
					scoreBy: "Percentage Score",
				});
			});
			await allure.step(
				"Navigate to configure and anonymity tab and change threshold and check reports",
				async () => {
					await EngageSurveyConfigure.setAdminThreshold("100");
					await engageOverviewPage.verifyNoDataMessage();
					await EngageSurveyConfigure.setAdminThreshold("2");
				},
			);
			await loginPage.navigateToHomepageAndSignout();
			await CommonUtils.sleep(1);
			await engageManagerView.loginToManagerViewToSurveyReports(
				EntityIds.surveyName,
				EntityIds.surveyId,
			);
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data,
				surveyType: "Pulse",
				viewType: "manager",
			});
			await engageOverviewPage.verifyOverviewTab({
				expectedData: engage_admin_report_data_with_filter,
				surveyType: "Pulse",
				viewType: "manager",
				filterBy: [
					{
						groupByName: "Gender",
						filters: [
							{
								filterByKey: "custom dropdown",
								filterByValues: ["option2"],
							},
						],
					},
					{
						groupByName: "Manager",
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
					{
						groupByName: "Department",
						filters: [
							{
								filterByKey: "Country",
								filterByValues: ["PK"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
			});
			await PwActions.click(thrivePage, engageManagerView.txtQuestionsTab);
			await engageQuestionsPage.verifyQuestionsTab({
				expectedData: engage_admin_report_data,
			});
			await engageQuestionsPage.verifyQuestionsTab({
				expectedData: engage_admin_report_data_with_filter,
				filterBy: [
					{
						groupByName: "Questions",
						filters: [
							{
								filterByKey: "Gender",
								filterByValues: ["Male"],
							},
						],
					},
					{
						groupByName: "Reporting Factors",
						filters: [
							{
								filterByKey: "Department",
								filterByValues: ["Engineering"],
							},
						],
					},
				],
				scoreBy: "Percentage Score",
			});
			await PwActions.click(thrivePage, engageManagerView.txtResponsesTab);
			await engageQuestionsPage.verifyResponsesTab({
				expectedData: engage_admin_report_data,
			});
			await engageQuestionsPage.verifyResponsesTab({
				expectedData: engage_admin_report_data,
				scoreBy: "Percentage Score",
			});
		});
	});
});

import { allure } from "allure-playwright";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { constants, pptExportData } from "../../../Data/Resources/constants.js";
import {
	engage_admin_report_data,
	engage_admin_report_data_with_filter,
} from "../../../Data/Resources/predefined_test_data.js";
import { envDetails } from "../../../Data/test-data.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { expect } from "@playwright/test";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";

const reportData = engage_admin_report_data.Overview;
const filteredData = engage_admin_report_data_with_filter.Overview;
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
test.describe("PPT Export - Engage Anonymous Survey", () => {
	let poManager;
	let commonFunctions;
	let pptExportPage;
	let surveyPage;
	let surveyLaunchPage;
	let surveyBuildEditPage;
	let engageSurveyConfigure;
	let engageDistributionPage;
	let surveyEUIPage;
	let engageOverviewPage;
	let commonUtils;
	let time;
	let readEmail;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		commonFunctions = poManager.getCommonPageFunctions();
		pptExportPage = poManager.getEngagePPTExportPage();
		surveyPage = poManager.getSurveyPage();
		surveyLaunchPage = poManager.getSurveyLaunchPage();
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		engageSurveyConfigure = poManager.getEngageConfigurePage();
		engageDistributionPage = poManager.getEngageDistributionPage();
		surveyEUIPage = poManager.getSurveyEUIPage();
		engageOverviewPage = poManager.getEngageOverviewPage();
		commonUtils = new CommonUtils();
		time = commonUtils.getCurrentTime();
		readEmail = new ReadEmail();
	});

	test("TC_01_to_TC_05_PPT Engage Anonymous: slides UI, global config, default and filtered data @engage @anonymous @ppt @regression  ", async ({
		thrivePage,
		browser,
	}) => {
		await allure.step(
			"Navigate to Engage tab and create anonymous survey",
			async () => {
				await commonFunctions.navigateTopNavigateSection("Engage");
				await surveyPage.createNewSurvey(`Engage Anonymous PPT Survey ${time}`);
				await surveyBuildEditPage.addMultipleSectionsAndQuestions(
					2,
					2,
					"Rating Scale",
				);
				await surveyPage.navigateTopSections("Configure");
				await engageSurveyConfigure.managerFiltersTurnOn();
				await surveyPage.navigateTopSections("Distribution");
			},
		);
		const participants = getParticipants();
		await allure.step("Add participants and launch survey", async () => {
			await engageDistributionPage.addParticipantsInSurvey(
				participants[0].email,
			);
			for (let i = 1; i < participants.length; i++) {
				await engageDistributionPage.addAdditionalParticipants(
					participants[i].email,
				);
			}
			await surveyLaunchPage.launchSurvey();
			await surveyLaunchPage.confirmEngageSurveyLaunch();
		});
		await allure.step("Attend survey as all participants", async () => {
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
		await allure.step(
			"Navigate to Reports and save URL for subsequent tests",
			async () => {
				await surveyPage.navigateTopSections("Reports");
				await CommonUtils.sleep(1);
				await PwActions.pageRefresh(thrivePage);
			},
		);
		await allure.step(
			"Verify export dropdown and Download PPT option are visible",
			async () => {
				await pptExportPage.openPPTConfiguration();
				await pptExportPage.closePPTConfiguration();
				await pptExportPage.openPPTConfiguration();
			},
		);
		await allure.step(
			"Open Configure PPT modal and verify key elements",
			async () => {
				await PwActions.waitTillVisible(
					thrivePage,
					pptExportPage.containerModalHeader,
				);
				expect(
					await pptExportPage.isPreviewVisible(),
					"Preview panel should be visible",
				).toBe(true);
				expect(
					await PwActions.elementIsVisible(thrivePage, pptExportPage.btnSave),
					"Save button should be visible",
				).toBe(true);
				expect(
					await PwActions.elementIsVisible(
						thrivePage,
						pptExportPage.btnDownload,
					),
					"Download button should be visible",
				).toBe(true);
			},
		);
		await allure.step(
			"Verify Introduction is mandatory and cannot be unchecked",
			async () => {
				expect(
					await pptExportPage.isSlideChecked(
						pptExportData.slideNames.INTRODUCTION,
					),
					"Introduction should be checked",
				).toBe(true);
				expect(
					await pptExportPage.isSlideCheckboxDisabled(
						pptExportData.slideNames.INTRODUCTION,
					),
					"Introduction checkbox should be disabled",
				).toBe(true);
			},
		);
		await allure.step(
			"Verify all non-mandatory slides have enabled checkboxes",
			async () => {
				const optionalSlides = pptExportData.defaultSlidesOrder.filter(
					(name) => !pptExportData.mandatorySlides.includes(name),
				);
				for (const slideName of optionalSlides) {
					expect(
						await pptExportPage.isSlideCheckboxDisabled(slideName),
						`${slideName} checkbox should NOT be disabled`,
					).toBe(false);
				}
			},
		);
		await allure.step(
			"Toggle Participation off and on, confirm Introduction stays locked",
			async () => {
				await pptExportPage.toggleSlide(pptExportData.slideNames.PARTICIPATION);
				expect(
					await pptExportPage.isSlideChecked(
						pptExportData.slideNames.PARTICIPATION,
					),
					"Participation should be unchecked after toggle",
				).toBe(false);
				await pptExportPage.toggleSlide(pptExportData.slideNames.PARTICIPATION);
				expect(
					await pptExportPage.isSlideChecked(
						pptExportData.slideNames.PARTICIPATION,
					),
					"Participation should be re-checked",
				).toBe(true);
				expect(
					await pptExportPage.isSlideChecked(
						pptExportData.slideNames.INTRODUCTION,
					),
					"Introduction should still be checked",
				).toBe(true);
				expect(
					await pptExportPage.isSlideCheckboxDisabled(
						pptExportData.slideNames.INTRODUCTION,
					),
					"Introduction should still be disabled",
				).toBe(true);
			},
		);
		let initialSlideCount;
		await allure.step(
			"Duplicate Summary, verify count and copy name",
			async () => {
				initialSlideCount = await pptExportPage.getSlideCount();
				expect(initialSlideCount).toBe(pptExportData.defaultSlidesOrder.length);
				await pptExportPage.duplicateSlide(pptExportData.slideNames.SUMMARY);
				expect(await pptExportPage.getSlideCount()).toBe(initialSlideCount + 1);
				const slideNames = await pptExportPage.getSlideNamesList();
				expect(
					slideNames.some(
						(n) => n === `${pptExportData.slideNames.SUMMARY} - Copy`,
					),
					"Should have 'Summary - Copy' slide",
				).toBe(true);
			},
		);
		await allure.step(
			"Duplicate Overview, delete Trends, verify slide states",
			async () => {
				await pptExportPage.duplicateSlide(pptExportData.slideNames.OVERVIEW);
				expect(await pptExportPage.getSlideCount()).toBe(initialSlideCount + 2);
				await pptExportPage.deleteSlide(pptExportData.slideNames.TRENDS);
				expect(await pptExportPage.getSlideCount()).toBe(initialSlideCount + 1);
				const currentNames = await pptExportPage.getSlideNamesList();
				expect(
					currentNames.includes(pptExportData.slideNames.TRENDS),
					"Trends should be removed",
				).toBe(false);
				expect(
					currentNames.some(
						(n) => n === `${pptExportData.slideNames.OVERVIEW} - Copy`,
					),
					"Should have 'Overview - Copy'",
				).toBe(true);
				expect(
					await pptExportPage.isSlideChecked(
						`${pptExportData.slideNames.OVERVIEW} - Copy`,
					),
					"Overview - Copy should be checked",
				).toBe(true);
			},
		);
		await allure.step("Close PPT modal", async () => {
			await pptExportPage.closePPTConfiguration();
		});

		await allure.step("Open PPT configuration modal", async () => {
			await pptExportPage.openPPTConfiguration();
			await pptExportPage.closePPTConfiguration();
			await pptExportPage.openPPTConfiguration();
		});
		await allure.step(
			"Set global config to Department + Percentage Score",
			async () => {
				await pptExportPage.openGlobalSettings();
				await pptExportPage.selectGlobalGroupBy("Department");
				await pptExportPage.selectGlobalScoreBy("Percentage Score");
				expect((await pptExportPage.getGlobalGroupByValue()).trim()).toBe(
					"Department",
				);
				expect((await pptExportPage.getGlobalScoreByValue()).trim()).toBe(
					"Percentage Score",
				);
				await pptExportPage.goBackToSlides();
			},
		);
		await allure.step(
			"Verify Summary inherited Department + Percentage Score",
			async () => {
				await pptExportPage.configureSlide(pptExportData.slideNames.SUMMARY);
				expect((await pptExportPage.getSlideGroupByValue()).trim()).toBe(
					"Department",
				);
				expect((await pptExportPage.getSlideScoreByValue()).trim()).toBe(
					"Percentage Score",
				);
				await pptExportPage.goBackToSlides();
			},
		);
		await allure.step(
			"Verify Strengths inherited Percentage Score (Group By = Questions for this slide)",
			async () => {
				await pptExportPage.configureSlide(pptExportData.slideNames.STRENGTHS);
				expect((await pptExportPage.getSlideGroupByValue()).trim()).toBe(
					"Questions",
				);
				expect((await pptExportPage.getSlideScoreByValue()).trim()).toBe(
					"Percentage Score",
				);
				await pptExportPage.goBackToSlides();
			},
		);
		await allure.step(
			"Override Demographic Spotlight Group By to Job Title",
			async () => {
				await pptExportPage.configureSlide(
					pptExportData.slideNames.DEMOGRAPHIC_SPOTLIGHT,
				);
				await pptExportPage.selectSlideGroupBy("Job Title");
				expect((await pptExportPage.getSlideGroupByValue()).trim()).toBe(
					"Job Title",
				);
				await pptExportPage.goBackToSlides();
			},
		);
		await allure.step(
			"Verify Summary still uses Department despite Demographic Spotlight override",
			async () => {
				await pptExportPage.configureSlide(pptExportData.slideNames.SUMMARY);
				expect((await pptExportPage.getSlideGroupByValue()).trim()).toBe(
					"Department",
				);
				await pptExportPage.goBackToSlides();
			},
		);
		await allure.step(
			"Switch global Score By to Favourability Score and verify propagation",
			async () => {
				await pptExportPage.openGlobalSettings();
				await pptExportPage.selectGlobalScoreBy("Favourability Score");
				await pptExportPage.goBackToSlides();
				const slidesToCheck = [
					pptExportData.slideNames.SUMMARY,
					pptExportData.slideNames.STRENGTHS,
					pptExportData.slideNames.DEMOGRAPHIC_SPOTLIGHT,
				];
				for (const slideName of slidesToCheck) {
					await pptExportPage.configureSlide(slideName);
					expect(
						(await pptExportPage.getSlideScoreByValue()).trim(),
						`${slideName} should show Favourability Score`,
					).toBe("Favourability Score");
					await pptExportPage.goBackToSlides();
				}
			},
		);
		await allure.step(
			"Duplicate Summary with custom config, verify original unchanged",
			async () => {
				await pptExportPage.duplicateSlide(pptExportData.slideNames.SUMMARY);
				const dupName = `${pptExportData.slideNames.SUMMARY} - Copy`;
				await pptExportPage.configureSlide(dupName);
				await pptExportPage.selectSlideGroupBy("Gender");
				await pptExportPage.selectSlideScoreBy("Percentage Score");
				expect((await pptExportPage.getSlideGroupByValue()).trim()).toBe(
					"Gender",
				);
				expect((await pptExportPage.getSlideScoreByValue()).trim()).toBe(
					"Percentage Score",
				);
				await pptExportPage.goBackToSlides();
				await pptExportPage.configureSlide(pptExportData.slideNames.SUMMARY);
				expect(
					(await pptExportPage.getSlideGroupByValue()).trim(),
					"Original Summary Group By should be unchanged",
				).toBe("Department");
				expect(
					(await pptExportPage.getSlideScoreByValue()).trim(),
					"Original Summary Score By should be unchanged",
				).toBe("Favourability Score");
				await pptExportPage.goBackToSlides();
			},
		);
		await allure.step(
			"Change global Group By to Gender and verify preview updates",
			async () => {
				await pptExportPage.openGlobalSettings();
				await pptExportPage.selectGlobalGroupBy("Gender");
				await pptExportPage.goBackToSlides();
				await CommonUtils.sleep(2);
				expect(
					await pptExportPage.isPreviewVisible(),
					"Preview should remain visible after config change",
				).toBe(true);
				expect(
					await pptExportPage.isSlideInPreview(
						pptExportData.slideNames.SUMMARY,
					),
					"Summary should appear in preview",
				).toBe(true);
			},
		);
		await allure.step("Close PPT modal", async () => {
			await pptExportPage.closePPTConfiguration();
		});

		const summary = reportData.summary;
		const mostEngaged = reportData.most_engaged.department;
		const leastEngaged = reportData.least_engaged.department;
		const deptGroups = reportData.engagement_summary.department;
		await allure.step("Open PPT configuration modal", async () => {
			await pptExportPage.openPPTConfiguration();
			await pptExportPage.closePPTConfiguration();
			await pptExportPage.openPPTConfiguration();
		});
		let previewText;
		await allure.step(
			"Capture preview text and verify default data",
			async () => {
				await CommonUtils.sleep(10);
				previewText = await pptExportPage.getPreviewText();
				expect(previewText, "Preview should have content").toBeTruthy();
				expect(previewText).toContain("Participation");
				expect(previewText).toContain(summary.participation_rate);
				for (const dept of deptGroups) {
					expect(
						previewText,
						`Preview should contain group "${dept.name}"`,
					).toContain(dept.name);
				}
				expect(
					previewText,
					"Preview should contain engagement score",
				).toContain(summary.overall_score);
				expect(previewText).toContain(mostEngaged.name);
				expect(previewText).toContain(mostEngaged.favscore);
				expect(previewText).toContain(leastEngaged.name);
				expect(previewText).toContain(leastEngaged.favscore);
				for (const dept of deptGroups) {
					expect(previewText).toContain(`${dept.responses} responses`);
				}
				const aoiQuestions = [
					"Engage Rating Scale 1.1",
					"Engage Rating Scale 1.2",
					"Engage Rating Scale 2.1",
				];
				for (const q of aoiQuestions) {
					expect(
						previewText,
						`Preview should contain question "${q}"`,
					).toContain(q);
				}
			},
		);
		await allure.step("Click Download to trigger PPT generation", async () => {
			await pptExportPage.clickDownload();
			await pptExportPage.clickDownload();
			await CommonUtils.sleep(5);
		});
		let pptxFileText = null;
		await allure.step("Fetch PPTX attachment from email", async () => {
			pptxFileText = await readEmail.fetchPptxAttachmentFromEmail({
				from: envDetails.senderEmail,
				to: envDetails.adminEmail,
				subject: pptExportData.email.SUBJECT,
				emailCutoffTimeInMinutes: 5,
				maxRetries: 10,
				retryIntervalSeconds: 20,
			});
		});
		await allure.step("Extract PPTX text and verify data matches", async () => {
			expect(pptxFileText.length).toBeGreaterThan(100);
			expect(pptxFileText).toContain(summary.overall_score);
			expect(pptxFileText).toContain(mostEngaged.name);
			expect(pptxFileText).toContain(leastEngaged.name);
			for (const dept of deptGroups) {
				expect(pptxFileText).toContain(dept.name);
			}
			for (const keyword of pptExportData.expectedSlideKeywords) {
				expect(pptxFileText, `PPTX should contain "${keyword}"`).toContain(
					keyword,
				);
			}
		});

		const groupByMap = {
			Department: {
				most: reportData.most_engaged.department,
				least: reportData.least_engaged.department,
				groups: reportData.engagement_summary.department,
			},
			"Job Title": {
				most: reportData.most_engaged.jobtitle,
				least: reportData.least_engaged.jobtitle,
				groups: reportData.engagement_summary.jobtitle,
			},
			Gender: {
				most: reportData.most_engaged.gender,
				least: reportData.least_engaged.gender,
				groups: reportData.engagement_summary.gender,
			},
			Country: {
				most: reportData.most_engaged.country,
				least: reportData.least_engaged.country,
				groups: reportData.engagement_summary.country,
			},
		};
		for (const [groupByOption, expected] of Object.entries(groupByMap)) {
			await allure.step(
				`Switch Group By to "${groupByOption}" and verify preview data`,
				async () => {
					await pptExportPage.openGlobalSettings();
					await pptExportPage.selectGlobalGroupBy(groupByOption);
					await pptExportPage.goBackToSlides();
					await CommonUtils.sleep(3);
					const previewText = await pptExportPage.getPreviewText();
					expect(
						previewText,
						`Preview should have content for "${groupByOption}"`,
					).toBeTruthy();
					expect(previewText).toContain(reportData.summary.overall_score);
					expect(previewText).toContain(reportData.summary.participation_rate);
					expect(previewText).toContain(expected.most.name);
					expect(previewText).toContain(expected.most.favscore);
					expect(previewText).toContain(expected.least.name);
					expect(previewText).toContain(expected.least.favscore);
					for (const group of expected.groups) {
						expect(
							previewText,
							`Preview should contain group "${group.name}"`,
						).toContain(group.name);
					}
				},
			);
		}
		const PPTX_DOWNLOAD_GROUPBY = "Job Title";
		await allure.step(
			`Set Group By to "${PPTX_DOWNLOAD_GROUPBY}" and download PPTX`,
			async () => {
				await pptExportPage.openGlobalSettings();
				await pptExportPage.selectGlobalGroupBy(PPTX_DOWNLOAD_GROUPBY);
				await pptExportPage.goBackToSlides();
				await CommonUtils.sleep(2);
				await pptExportPage.clickDownload();
				await CommonUtils.sleep(5);
			},
		);
		pptxFileText = null;
		await allure.step(
			"Fetch PPTX and verify Job Title data in download",
			async () => {
				pptxFileText = await readEmail.fetchPptxAttachmentFromEmail({
					from: envDetails.senderEmail,
					to: envDetails.adminEmail,
					subject: pptExportData.email.SUBJECT,
					emailCutoffTimeInMinutes: 1,
					maxRetries: 10,
					retryIntervalSeconds: 20,
				});
				expect(pptxFileText).toBeTruthy();
				const jtData = groupByMap[PPTX_DOWNLOAD_GROUPBY];
				for (const group of jtData.groups) {
					expect(pptxFileText).toContain(group.name);
				}
				expect(pptxFileText).toContain(jtData.most.name);
				expect(pptxFileText).toContain(jtData.least.name);
				for (const keyword of pptExportData.expectedSlideKeywords) {
					expect(pptxFileText).toContain(keyword);
				}
			},
		);
		const configCombinations = [
			{
				groupBy: "Department",
				scoreBy: "Favourability Score",
				filter: {
					groupByName: "Department",
					filters: [{ filterByKey: "Country", filterByValues: ["PK"] }],
				},
			},
			{
				groupBy: "Gender",
				scoreBy: "Percentage Score",
				filter: {
					groupByName: "Gender",
					filters: [
						{
							filterByKey: "custom dropdown",
							filterByValues: ["option2"],
						},
					],
				},
			},
			{
				groupBy: "Job Title",
				scoreBy: "Favourability Score",
				filter: null,
			},
			{
				groupBy: "Country",
				scoreBy: "Percentage Score",
				filter: null,
			},
		];
		await pptExportPage.closePPTConfiguration();
		for (const config of configCombinations) {
			const hasFilter = config.filter !== null;
			await allure.step(
				`Verify persistence: ${config.groupBy} / ${config.scoreBy}${hasFilter ? ` + ${config.filter.filters[0].filterByKey}` : ""}`,
				async () => {
					await engageOverviewPage.resetFilter();
					await engageOverviewPage.selectScoreType(config.scoreBy);
					if (hasFilter) {
						await engageOverviewPage.applyEngageFilter(config.filter);
					} else {
						await engageOverviewPage.selectGroupByOption(config.groupBy);
					}
					await CommonUtils.sleep(2);
					await pptExportPage.openPPTConfiguration();
					await pptExportPage.closePPTConfiguration();
					await pptExportPage.openPPTConfiguration();
					await pptExportPage.openGlobalSettings();
					expect(
						(await pptExportPage.getGlobalGroupByValue())?.trim(),
						`PPT Group By should be "${config.groupBy}"`,
					).toBe(config.groupBy);
					expect(
						(await pptExportPage.getGlobalScoreByValue())?.trim(),
						`PPT Score By should be "${config.scoreBy}"`,
					).toBe(config.scoreBy);
					if (hasFilter) {
						const chipTexts = await pptExportPage.getAppliedFilterChipTexts();
						for (const f of config.filter.filters) {
							expect(
								chipTexts.find((t) => t.includes(f.filterByKey)),
								`Filter chip should contain "${f.filterByKey}"`,
							).toBeTruthy();
						}
					} else {
						const chipTexts = await pptExportPage.getAppliedFilterChipTexts();
						expect(
							chipTexts.length,
							"No filter chips when Overview has none",
						).toBe(0);
					}
					await pptExportPage.closePPTConfiguration();
					await CommonUtils.sleep(1);
				},
			);
		}

		const filterCombinations = [
			{
				label: "Department + Country: PK",
				scoreBy: "Percentage Score",
				filter: {
					groupByName: "Department",
					filters: [{ filterByKey: "Country", filterByValues: ["PK"] }],
				},
				expected: {
					overall_score:
						filteredData.department.summary.country.pk.percentage_overall_score,
					participants: filteredData.department.summary.country.pk.participants,
					responses: filteredData.department.summary.country.pk.responses,
					group: filteredData.department.engagement_summary.name,
				},
			},
			{
				label: "Gender + custom dropdown: option2",
				scoreBy: "Percentage Score",
				filter: {
					groupByName: "Gender",
					filters: [
						{
							filterByKey: "custom dropdown",
							filterByValues: ["option2"],
						},
					],
				},
				expected: {
					overall_score:
						filteredData.gender.summary.custom_dropdown.option2
							.percentage_overall_score,
					participants:
						filteredData.gender.summary.custom_dropdown.option2.participants,
					responses:
						filteredData.gender.summary.custom_dropdown.option2.responses,
					group: filteredData.gender.engagement_summary.name,
				},
			},
			{
				label: "Manager + Department: Engineering",
				scoreBy: "Percentage Score",
				filter: {
					groupByName: "Manager",
					filters: [
						{
							filterByKey: "Department",
							filterByValues: ["Engineering"],
						},
					],
				},
				expected: {
					overall_score:
						filteredData.manager.summary.department.engineering
							.percentage_overall_score,
					participants:
						filteredData.manager.summary.department.engineering.participants,
					responses:
						filteredData.manager.summary.department.engineering.responses,
					group: filteredData.manager.engagement_summary.name,
				},
			},
		];
		const DOWNLOAD_INDEX = 0;
		let downloadPreviewText = null;
		for (let i = 0; i < filterCombinations.length; i++) {
			const combo = filterCombinations[i];
			await allure.step(`Apply "${combo.label}" on Overview tab`, async () => {
				await engageOverviewPage.resetFilter();
				await engageOverviewPage.selectScoreType(combo.scoreBy);
				await engageOverviewPage.applyEngageFilter(combo.filter);
				await CommonUtils.sleep(2);
			});
			await allure.step(
				`Verify PPT config and preview for "${combo.label}"`,
				async () => {
					await pptExportPage.openPPTConfiguration();
					await pptExportPage.closePPTConfiguration();
					await pptExportPage.openPPTConfiguration();
					await pptExportPage.openGlobalSettings();
					expect((await pptExportPage.getGlobalGroupByValue())?.trim()).toBe(
						combo.filter.groupByName,
					);
					expect((await pptExportPage.getGlobalScoreByValue())?.trim()).toBe(
						combo.scoreBy,
					);
					const chipTexts = await pptExportPage.getAppliedFilterChipTexts();
					expect(
						chipTexts.find((t) =>
							t.includes(combo.filter.filters[0].filterByKey),
						),
						`Filter chip should contain "${combo.filter.filters[0].filterByKey}"`,
					).toBeTruthy();
					await pptExportPage.goBackToSlides();
					await CommonUtils.sleep(3);
					const previewText = await pptExportPage.getPreviewText();
					expect(previewText, "Preview should have content").toBeTruthy();
					expect(
						previewText,
						`Should show score ${combo.expected.overall_score}`,
					).toContain(combo.expected.overall_score);
					expect(previewText).toContain(combo.expected.participants);
					expect(previewText).toContain(combo.expected.responses);
					expect(previewText).toContain(combo.expected.group);
					if (i === DOWNLOAD_INDEX) {
						downloadPreviewText = previewText;
					}
					await pptExportPage.closePPTConfiguration();
					await CommonUtils.sleep(1);
				},
			);
		}
		const downloadCombo = filterCombinations[DOWNLOAD_INDEX];
		await allure.step(
			`Re-apply "${downloadCombo.label}" and download PPTX`,
			async () => {
				await engageOverviewPage.resetFilter();
				await engageOverviewPage.selectScoreType(downloadCombo.scoreBy);
				await engageOverviewPage.applyEngageFilter(downloadCombo.filter);
				await CommonUtils.sleep(2);
				await pptExportPage.openPPTConfiguration();
				await pptExportPage.closePPTConfiguration();
				await pptExportPage.openPPTConfiguration();
				await pptExportPage.clickDownload();
				await CommonUtils.sleep(5);
			},
		);
		pptxFileText = null;
		await allure.step("Fetch PPTX attachment from email", async () => {
			pptxFileText = await readEmail.fetchPptxAttachmentFromEmail({
				from: envDetails.senderEmail,
				to: envDetails.adminEmail,
				subject: pptExportData.email.SUBJECT,
				emailCutoffTimeInMinutes: 1,
				maxRetries: 10,
				retryIntervalSeconds: 20,
			});
			expect(pptxFileText, "PPTX should be fetched").toBeTruthy();
		});
		await allure.step(
			"Verify filtered data in PPTX matches preview",
			async () => {
				expect(pptxFileText).toBeTruthy();
				const keyPoints = [
					downloadCombo.expected.overall_score,
					downloadCombo.expected.participants,
					downloadCombo.expected.group,
				];
				for (const point of keyPoints) {
					expect(pptxFileText, `PPTX should contain "${point}"`).toContain(
						point,
					);
					expect(
						downloadPreviewText,
						`Preview should contain "${point}"`,
					).toContain(point);
				}
				for (const keyword of pptExportData.expectedSlideKeywords) {
					expect(pptxFileText).toContain(keyword);
				}
			},
		);
	});
});

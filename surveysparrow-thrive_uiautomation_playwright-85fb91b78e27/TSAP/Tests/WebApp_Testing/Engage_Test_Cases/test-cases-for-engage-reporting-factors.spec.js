import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { test } from "../../../Fixtures/application-setup";
import { POManager } from "../../../Pages/POManager";

let poManager;
let surveyBuildEditPage;
let commonFunctions;
let surveyPage;
let engageConfigurePage;
let commonutils;
let time;
let reportingFactors;
let sectionNames;
let questionstobeadded;
let questionstobedeleted;
const questions = {};
const newReportingFactorName = "New Reporting Factor";
const editedReportingFactorName = "New Reporting Factor Edited";

test.describe("Engage Reporting Factors @Regression", () => {
	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		surveyBuildEditPage = poManager.getSurveyBuilderPage();
		commonFunctions = poManager.getCommonPageFunctions();
		surveyPage = poManager.getSurveyPage();
		engageConfigurePage = poManager.getEngageConfigurePage();
		commonutils = new CommonUtils();
		time = commonutils.getCurrentTime();
	});

	test("TC_01_Engage Reporting Factors @Regression", async () => {
		await allure.step(
			"User navigates to 'Engage' tab and creates a new survey",
			async () => {
				await commonFunctions.navigateTopNavigateSection("Engage");
				await surveyPage.createNewSurvey(
					`Reporting Factors Engage Test Survey ${time}`,
				);
			},
		);

		await allure.step(
			"User creates sections and questions and stores section and question names",
			async () => {
				await surveyBuildEditPage.addMultipleSectionsAndQuestions(
					2,
					2,
					"Rating Scale",
				);
				await CommonUtils.sleep(2);
				sectionNames = await surveyBuildEditPage.getSectionsNames();
				for (const sectionName of sectionNames) {
					questions[sectionName] =
						await surveyBuildEditPage.getQuestionsNamesInSection(sectionName);
				}
			},
		);

		await allure.step(
			"User navigates to 'Configure' tab and then to 'Engage Reporting Factors'",
			async () => {
				await CommonUtils.sleep(2);
				await surveyPage.navigateTopSections("Configure");
				await engageConfigurePage.navigateToReportSettings();
				reportingFactors = await engageConfigurePage.getReportingFactors();
			},
		);

		await allure.step("Verify reporting factors and questions", async () => {
			expect(reportingFactors).toEqual(expect.arrayContaining(sectionNames));
			for (const reportingFactor of reportingFactors) {
				await engageConfigurePage.verifyQuestionsInsideReportingFactor(
					reportingFactor,
					questions[reportingFactor],
				);
			}
		});

		await allure.step(
			"User adds a new reporting factor and verifies it",
			async () => {
				await engageConfigurePage.addNewReportingFactor(newReportingFactorName);
				await engageConfigurePage.verifyAddedReportingFactor(
					newReportingFactorName,
				);
			},
		);

		await allure.step(
			"User adds questions to the reporting factor and verifies them",
			async () => {
				questionstobeadded = questions[sectionNames[0]];
				await engageConfigurePage.addOrRemoveQuestionsFromReportingFactor(
					newReportingFactorName,
					questionstobeadded,
				);
				await engageConfigurePage.verifyQuestionsInsideReportingFactor(
					newReportingFactorName,
					questionstobeadded,
				);
			},
		);

		await allure.step(
			"User deletes questions from a Reporting Factor and verifies the remaining questions",
			async () => {
				questionstobedeleted = questionstobeadded[0];
				await engageConfigurePage.addOrRemoveQuestionsFromReportingFactor(
					newReportingFactorName,
					questionstobedeleted,
				);
				questionstobeadded = CommonUtils.filterOutValuesFromArray(
					questionstobeadded,
					questionstobedeleted,
				);
				await engageConfigurePage.verifyQuestionsInsideReportingFactor(
					newReportingFactorName,
					questionstobeadded,
				);
			},
		);

		await allure.step(
			"User edits the reporting factor name and verifies it",
			async () => {
				await engageConfigurePage.editReportingFactorName(
					newReportingFactorName,
					editedReportingFactorName,
				);
				await engageConfigurePage.verifyAddedReportingFactor(
					editedReportingFactorName,
				);
			},
		);

		await allure.step(
			"User deletes the reporting factor and verifies its deletion",
			async () => {
				await engageConfigurePage.deleteReportingFactor(
					editedReportingFactorName,
				);
				await engageConfigurePage.verifyDeletedReportingFactor(
					editedReportingFactorName,
				);
			},
		);
	});
});

import { time } from "console";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { expect } from "@playwright/test";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";
import { constants } from "../../../Data/Resources/constants.js";
import logger from "playwright-framework/Core/logger.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
class ReportsPdfPage {
	constructor(page) {
		this.page = page;
		this.commonutils = new CommonUtils();
		this.communfunction = new CommonPageFunctions(page);
		this.btnReviewReports = "//span[text()='Review']";
		this.btnPdp = "//span[text()='Personal Development Plan']";
		this.txtBtnGeneratePDP =
			"//span[text()='Personal Development Plan']/parent::button";
		this.btnGenWithAi = "//p[text()='Generate with AI']";
		this.btnUpdatePlan = "//span[text()='Update Plan']";
		this.btnUpdate = "//span[text()='Update']";
		this.popupSectionUpdate = "//div[text()='Section has been updated.']";
		this.btnBack = "(//p[text()='Edit Section']//preceding::button)[last()]";
		this.btnEditSection = "//p[text()='Edit Section']";
		this.txtPdp = "//p[text()='Personal Development Plan']";
		this.txtPdpdata = "//strong[text()='Performance Analysis']";
		this.btnConfirmUpdate = "//span[text()='No,Update']";
		this.btnApproveReport = "//span[text()='Approve']";
		this.btnRejectReport = "//span[text()='Reject']";
		this.lblApprovalConfirmation =
			"//div[text()='Report has been approved successfully']";
		this.btnDownloadTeamReportFromInsideReportPage = `//span[text()="Download"]/parent::button`;
		this.btnChangeLanguage = `//p[text()="PAGES"]/parent::div//following-sibling::button`;
		this.webElementsReportContent = `//div[contains(@class,"report-page")]`;
		this.webElementsReportTitles = `//div[@role="navigation"]//div//p`;
		this.btnBackFromReport = `//p[text()="Back"]/preceding-sibling::button`;
		this.btnSectionCompetencySummary = "(//p[text()='Competency Summary'])[1]";
		this.txtOverallScore =
			"//p[normalize-space(.)='Overall Summary']/parent::div/following-sibling::h1";
		this.getScoreOfCompetency = (competencyName) =>
			`//p[normalize-space(.)='Overall Summary']/ancestor::div[@data-testid='flex']/following-sibling::div//p[normalize-space(.)='${competencyName}']/following-sibling::div//p`;
		this.getScoreOfCompetencyGroup = (competencyName) =>
			`//p[normalize-space(.)='${competencyName}']/parent::div/following-sibling::div//h1`;
		this.getRoleBasedScoreForCompetency = (role, competencyName) =>
			`//p[normalize-space(.)='${competencyName}']/parent::div/following-sibling::div//p[normalize-space(.)='${role}']/following-sibling::div//p`;
		this.getScoreOfQuestionBasedOnRole = (question, role) => {
			return (
				`//td[contains(normalize-space(.),'${question}')]` +
				`/following-sibling::td[count(ancestor::table/thead/tr/th[normalize-space()='${role}']/preceding-sibling::th)]` +
				`//p[contains(@class,'progress-text')]`
			);
		};
		this.getScoreOfHiddenStrengths = (competency, role) => {
			const roleIndexMap = {
				Self: 1,
				Others: 2,
			};
			const index = roleIndexMap[role];
			return `((//div[contains(@class,"report-page")])[7]//p[text()="${competency}"]/parent::td/following-sibling::td[${index}]//p)`;
		};
		this.getOpenEndendQuestionFeedbacks = `//p[text()="FEEDBACK"]/following-sibling::div`;
		this.getBenchMarkScoreForCompetency = (competencyName) =>
			`//p[normalize-space()='${competencyName}']/ancestor::div[@data-testid='flex'][1]/following-sibling::div//p[starts-with(normalize-space(),'Benchmark')]/span`;

		// Scale verification locators
		this.getScaleUsedForQuestion = (questionText) =>
			`//td[contains(normalize-space(.),'${questionText}')]//p[contains(text(),"Scale Used")]`;

		// Competency trend locators
		this.btnSectionCompetencyTrend = `(//p[text()='Competency Trend'])[1]`;
		this.getCompetencyTrendScore = (competencyName) =>
			`//p[text()='Competency Trend']/ancestor::div[contains(@class,'report-page')]//p[normalize-space(.)='${competencyName}']/following-sibling::div//p[contains(text(),'/')]`;

		// Feedback per role locators
		this.getFeedbackTextForRole = (role) =>
			`//p[text()='${role.toUpperCase()}']/following-sibling::p`;

		// Empty page data for section
		this.txtEmptySectionData = (sectionName) =>
			`//p[text()="${sectionName}"]/parent::div/following-sibling::div//div//p[text()="Your peer ratings are mostly in line with how you have rated yourself."]`;
	}

	/**
	 * Verifies the report approval status.
	 */
	async verifyReportPdp(page = this.page) {
		if (await PwActions.elementIsVisible(page, this.btnReviewReports)) {
			await PwActions.click(page, this.btnReviewReports);
			await CommonUtils.sleep(5);
		}
		await CommonUtils.sleep(30);
		await PwActions.elementIsVisible(page, this.btnPdp);
		await PwActions.waitTillVisible(page, this.btnPdp, 30000);
		await PwActions.click(page, this.btnPdp);
		await PwActions.click(page, this.btnGenWithAi);
		await PwActions.waitTillVisible(page, this.btnUpdatePlan, 210000);
		await PwActions.click(page, this.btnUpdatePlan);
		await PwActions.click(page, this.btnUpdate);
		await PwActions.elementIsVisible(page, this.popupSectionUpdate);
		let retry = 0;
		while (
			!(await PwActions.elementIsVisible(page, this.txtPdp)) &&
			retry < 5
		) {
			await CommonUtils.sleep(6);
			await PwActions.click(page, this.btnBack);
			await CommonUtils.sleep(6);
			for (let i = 0; i < 4; i++) {
				if (await PwActions.elementIsVisible(page, this.btnConfirmUpdate)) {
					await PwActions.click(page, this.btnConfirmUpdate);
				} else {
					break;
				}
			}
			retry++;
		}
		await PwActions.click(page, this.txtPdp);
		await PwActions.elementIsVisible(page, this.txtPdpdata);
	}

	/**
	 * Function to approve the report from the report page.
	 */

	async approveReportFromReportPage(page = this.page) {
		await PwActions.click(page, this.btnApproveReport);
		await PwActions.waitTillVisible(page, this.lblApprovalConfirmation);
	}

	getSectionLocatorByName(sectionName) {
		return `(//div[contains(@class,"report-page")][.//p[normalize-space(.)='${sectionName}']])[1]`;
	}

	/**
	 * Function to Verify The Report Data
	 * @param {Object} reportData The Report Data
	 * @example
	 */

	/**
	 * Verifies that the report data displayed on the PDF report page matches the expected report data object.
	 * This function checks:
	 *   - The overall summary score and each competency's score in the summary section.
	 *   - Each competency's group scores (Self, Peer, Reportee, Manager, Others).
	 *   - Each question's score for each group (Self, Peer, Reportee, Manager).
	 *
	 * The function expects the UI to display scores as strings, including "N/A" for not applicable values.
	 * It will throw assertion errors if any value does not match.
	 *
	 * @param {Object} reportData - The expected report data to verify against the UI.
	 *
	 * @example
	 * // Example reportData structure:
	 * const reportData = {
	 *   overall_summary: {
	 *     overall_score: 1.9,
	 *     competency_summary: {
	 *       leadership_skills: 1.9,
	 *       communication_skills: 1.4,
	 *       team_skills: 2.4
	 *     }
	 *   },
	 *   competency_summary: {
	 *     leadership_skills: {
	 *       score: 1.9,
	 *       group_scores: {
	 *         self: 0.5,
	 *         peer: 2,
	 *         reportee: 2,
	 *         manager: 2
	 *       },
	 *       questions: [
	 *         {
	 *           question: "Exhibits leadership qualities in their current role at the organization.",
	 *           self: 1,
	 *           peer: 4,
	 *           reportee: 4,
	 *           manager: 4
	 *         },
	 *         {
	 *           question: "Encourages teamwork and collaboration across various teams.",
	 *           self: 0,
	 *           peer: "N/A",
	 *           reportee: "N/A",
	 *           manager: "N/A"
	 *         }
	 *       ]
	 *     }
	 *   }
	 * }
	 */
	async verifyReportData(reportData) {
		await CommonUtils.sleep(5);
		await PwActions.pageRefresh(this.page);
		const competencyDisplayNames = {
			leadership_skills: "Leadership Skills",
			communication_skills: "Communication Skills",
			team_skills: "Team Skills",
		};
		const roles = {
			self: "Self",
			peer: "Peer",
			reportee: "Reportee",
			manager: "Manager",
			custom_role: "Custom Role",
			others: "Others",
		};
		const getDisplayName = (obj, key) => obj[key] || key;

		const checkScore = (actual, expected) => {
			const expectedValue = reportData.normalizedScore
				? `${expected}/${reportData.normalizedScore}`
				: String(expected);
			expect(String(actual), `Score should be ${expectedValue}`).toBe(
				expectedValue,
			);
		};

		// 1. Overall Summary & Competency Summary
		if (reportData.overall_summary?.competency_summary) {
			await PwActions.click(this.page, this.btnSectionCompetencySummary);
			const overallScore = await PwActions.getText(
				this.page,
				this.txtOverallScore,
			);
			checkScore(overallScore, reportData.overall_summary.overall_score);

			for (const [competency, score] of Object.entries(
				reportData.overall_summary.competency_summary,
			)) {
				const competencyName = getDisplayName(
					competencyDisplayNames,
					competency,
				);
				const competencyScore = await PwActions.getText(
					this.page,
					this.getScoreOfCompetency(competencyName),
				);
				expect(competencyScore).toBe(String(score));
			}
		}

		if (reportData.competency_summary) {
			for (const [competency, data] of Object.entries(
				reportData.competency_summary,
			)) {
				const competencyName = getDisplayName(
					competencyDisplayNames,
					competency,
				);

				const scoreElement = await PwActions.getText(
					this.page,
					this.getScoreOfCompetencyGroup(competencyName),
				);
				checkScore(scoreElement, data.score);

				// Group scores
				for (const [group, groupScore] of Object.entries(data.group_scores)) {
					const groupScoreElement = await PwActions.getText(
						this.page,
						this.getRoleBasedScoreForCompetency(roles[group], competencyName),
					);
					expect(groupScoreElement).toBe(String(groupScore));
				}

				for (const questionObj of data.questions) {
					const questionText = questionObj.question;

					const scaleLocator = this.getScaleUsedForQuestion(questionText);
					const scaleText = await PwActions.getText(this.page, scaleLocator);
					const questionScale = EntityIds.getQuestionScale(questionText);
					const expectedScaleSubstring =
						questionScale != null &&
						typeof questionScale === "object" &&
						"stop" in questionScale
							? String(questionScale.stop)
							: String(questionScale);
					expect(
						scaleText,
						`Scale for question "${questionText}" should match`,
					).toContain(expectedScaleSubstring);

					for (const group of [
						"self",
						"peer",
						"reportee",
						"manager",
						"custom_role",
					]) {
						if (questionObj[group] !== undefined) {
							const questionScoreElement = await PwActions.getText(
								this.page,
								this.getScoreOfQuestionBasedOnRole(questionText, roles[group]),
							);
							expect(questionScoreElement).toBe(String(questionObj[group]));
						}
					}
				}
			}
		}

		if (reportData.areas_of_improvement) {
			const baseXpath = this.getSectionLocatorByName("Areas of Improvement");
			for (const competency of reportData.areas_of_improvement) {
				const competencyName = getDisplayName(
					competencyDisplayNames,
					competency,
				);
				await PwActions.verifyElementIsPresent(
					this.page,
					`${baseXpath}//p[text()="${competencyName}"]`,
				);
			}
		}

		if (reportData.hidden_strengths) {
			const baseXpath = this.getSectionLocatorByName("Hidden Strengths");
			for (const [competency, data] of Object.entries(
				reportData.hidden_strengths,
			)) {
				const competencyName = getDisplayName(
					competencyDisplayNames,
					competency,
				);
				await PwActions.verifyElementIsPresent(
					this.page,
					`${baseXpath}//p[text()="${competencyName}"]`,
				);
				for (const [group, score] of Object.entries(data)) {
					const groupScoreElement = await PwActions.getText(
						this.page,
						this.getScoreOfHiddenStrengths(competencyName, roles[group]),
					);
					expect(groupScoreElement).toBe(String(score));
				}
			}
		}

		if (!reportData.blind_spots) {
			await PwActions.waitForElementVisibility(
				this.page,
				this.txtEmptySectionData("Blind Spots"),
			);
		}

		if (!reportData.strengths) {
			await PwActions.waitForElementVisibility(
				this.page,
				"//p[text()='Unfortunately, your peers have given you low ratings across all areas of assessment.']",
			);
		}

		// Verify competency trend if specified
		if (reportData.competency_trend) {
			await PwActions.click(this.page, this.btnSectionCompetencyTrend);
			for (const [competency, trendScore] of Object.entries(
				reportData.competency_trend,
			)) {
				const competencyName = getDisplayName(
					competencyDisplayNames,
					competency,
				);
				const trendLocator = this.getCompetencyTrendScore(competencyName);
				const actualTrendScore = await PwActions.getText(
					this.page,
					trendLocator,
				);
				checkScore(actualTrendScore, trendScore);
			}
		}
	}

	/**
	 * Downloads and validates the team report PDF from inside the report view.
	 * For non-English languages, returns the file path without validation.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {string} [params.language="english"] - Language to verify. Only "english" reports are validated and deleted.
	 * @returns {Promise<void|Object>} Returns file info for non-English languages, void for English.
	 * @example
	 * // Download and verify English report
	 * await reportsPdfPage.downloadReportInsideReport({ page, language: "english" });
	 *
	 * // Download report in another language (returns file path)
	 * const result = await reportsPdfPage.downloadReportInsideReport({ page, language: "tamil" });
	 */
	async downloadReportInsideReport({ page = this.page, language = "english" }) {
		await PwActions.waitForElementVisibility(
			page,
			this.btnDownloadTeamReportFromInsideReportPage,
		);
		const result = await this.communfunction.downloadFileAndReturnPath(
			page,
			this.btnDownloadTeamReportFromInsideReportPage,
			50000,
		);
		await CommonUtils.verifyFileExtension(result.extension, "pdf");
		expect(result.filePath, "File path must not be empty").toBeTruthy();
		if (language.toLowerCase() === "english") {
			await this.commonutils.verifyPdfContent(
				result.filePath,
				constants.performanceReportTitles,
			);
			await this.commonutils.deleteFile(result.filePath);
			logger.info("Successfully downloaded and verified team report");
		} else {
			logger.info(
				`Successfully downloaded team report for language: ${language}`,
			);
			return result;
		}
	}

	/**
	 * Changes the report language and verifies that content is displayed in the selected language.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {string} params.language - The language to change to (e.g., "tamil", "hindi", "spanish").
	 * @returns {Promise<void>}
	 * @example
	 * await reportsPdfPage.changeReportLanguage({ page, language: "tamil" });
	 */
	async changeReportLanguage({ page = this.page, language }) {
		await PwActions.click(page, this.btnChangeLanguage);
		await PwActions.click(page, `//p[text()="${language}"]`);
		await PwActions.waitTillElementDisappear(
			page,
			"(//div[@class='twigs-c-PJLV twigs-c-vxxMQ twigs-c-vxxMQ-imfpdQ-size-md'])[1]",
		);
		const [reportTitlesElements, reportContentElements] = await Promise.all([
			PwActions.getWebElements(page, this.webElementsReportTitles),
			PwActions.getWebElements(page, this.webElementsReportContent),
		]);
		const [reportTitles, reportContents] = await Promise.all([
			PwActions.getElementsText(page, reportTitlesElements),
			Promise.all(reportContentElements.map((element) => element.innerText())),
		]);
		const allTexts = [...reportTitles, ...reportContents].filter((text) =>
			text?.trim(),
		);
		const expectedLanguage = language.toLowerCase();
		const detectedLanguages = await Promise.all(
			allTexts.map((text) => this.commonutils.getTextLanguage(text)),
		);
		detectedLanguages.forEach((detectedLanguage, index) => {
			expect(
				detectedLanguage.toLowerCase(),
				`Text "${allTexts[index]}" is not in ${language} language`,
			).toBe(expectedLanguage);
		});
	}

	/**
	 * Navigates back from the report view.
	 *
	 * @param {import('@playwright/test').Page} [page=this.page] - The Playwright page object to perform actions on.
	 * @returns {Promise<void>}
	 * @example
	 * await reportsPdfPage.backFromReport(page);
	 */
	async backFromReport(page = this.page) {
		await PwActions.click(page, this.btnBackFromReport);
	}

	/**
	 * Changes report language, downloads the report, verifies the language in the PDF, and cleans up.
	 * Optionally navigates back from the report view after verification.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page=this.page] - The Playwright page object.
	 * @param {string} params.language - The language to change to and verify (e.g., "Tamil", "Hindi").
	 * @param {boolean} [params.backFromReport=true] - Whether to navigate back from report after verification. Defaults to true.
	 * @returns {Promise<void>}
	 * @throws {Error} If the downloaded PDF content language doesn't match the expected language.
	 * @example
	 * // Change to Tamil, verify, and navigate back
	 * await reportsPdfPage.changeLanguageAndVerifyPdfContent({ page, language: "Tamil" });
	 *
	 * // Change to Tamil, verify, but don't navigate back
	 * await reportsPdfPage.changeLanguageAndVerifyPdfContent({ page, language: "Tamil", backFromReport: false });
	 */
	async changeLanguageAndVerifyPdfContent({
		page = this.page,
		language,
		backFromReport = true,
	}) {
		await this.changeReportLanguage({ page, language });
		const downloadedFile = await this.downloadReportInsideReport({
			page,
			language,
		});
		const pdfContent = await this.commonutils.extractPdfText(
			downloadedFile.filePath,
		);
		const pdfText = pdfContent.textArray.join(" ");
		await this.commonutils.deleteFile(downloadedFile.filePath);
		const contentLanguage = await this.commonutils.getTextLanguage(pdfText);
		expect(
			contentLanguage.toLowerCase(),
			`Content language is not ${language}`,
		).toBe(language.toLowerCase());
		logger.info(`Successfully verified PDF content is in ${language} language`);
		if (backFromReport) {
			await this.backFromReport(page);
		}
	}

	/**
	 * Verifies the report content titles.
	 *
	 * @param {import('@playwright/test').Page} [page=this.page] - The Playwright page object.
	 * @returns {Promise<void>}
	 * @example
	 * await reportsPdfPage.verifyReportContent(page);
	 */
	async verifyReportContent(page = this.page) {
		await PwActions.waitForNetworkIdle(page, 10000);
		await CommonUtils.sleep(4);
		const [reportTitlesElements, reportContentElements] = await Promise.all([
			PwActions.getWebElements(page, this.webElementsReportTitles),
			PwActions.getWebElements(page, this.webElementsReportContent),
		]);
		const [reportTitles, reportContents] = await Promise.all([
			PwActions.getElementsText(page, reportTitlesElements),
			Promise.all(reportContentElements.map((element) => element.innerText())),
		]);
		const allTexts = [...reportTitles, ...reportContents].filter((text) =>
			text?.trim(),
		);
		for (const expectedTitle of constants.performanceReportTitles) {
			expect(
				allTexts.some(
					(text) =>
						text.trim().toLowerCase() === expectedTitle.trim().toLowerCase(),
				),
				`The expected report title "${expectedTitle}" was not found in the report content.`,
			).toBeTruthy();
		}
	}
	/**
	 * Returns sections config for role-based ARIA snapshot verification
	 * @returns {Array<{section: string, locator: string}>} Array of section configs
	 */
	getRoleBasedReportSections() {
		return [
			{
				section: constants.Performance_Reports_sections.participants,
				locator: this.getSectionLocatorByName("Introduction"),
			},
			{
				section: constants.Performance_Reports_sections.competency_summary,
				locator: this.getSectionLocatorByName("Competency Summary"),
			},
			{
				section: constants.Performance_Reports_sections.detailed_feedback,
				locator: this.getSectionLocatorByName("Detailed Feedback"),
			},
		];
	}

	/**
	 * Returns sections config for goal-based report ARIA snapshot verification
	 * @returns {Array<{section: string, locator: string}>} Array of section configs
	 */
	getGoalBasedReportSections() {
		return [
			{
				section: constants.Performance_Reports_sections.participants,
				locator: this.getSectionLocatorByName("Introduction"),
			},
			{
				section: constants.Performance_Reports_sections.goal_summary,
				locator: this.getSectionLocatorByName("Goal Summary"),
			},
			{
				section: constants.Performance_Reports_sections.detailed_feedback,
				locator: this.getSectionLocatorByName("Detailed Feedback"),
			},
			{
				section: constants.Performance_Reports_sections.competency_summary,
				locator: this.getSectionLocatorByName("Competency Summary"),
			},
			{
				section: constants.Performance_Reports_sections.areas_of_improvement,
				locator: this.getSectionLocatorByName("Areas of Improvement"),
			},
		];
	}

	/**
	 * Returns sections config for self-based report ARIA snapshot verification
	 * @returns {Array<{section: string, locator: string}>} Array of section configs
	 */
	getSelfBasedReportSections() {
		return [
			{
				section: constants.Performance_Reports_sections.participants,
				locator: this.getSectionLocatorByName("Introduction"),
			},
			{
				section: constants.Performance_Reports_sections.competency_summary,
				locator: this.getSectionLocatorByName("Competency Summary"),
			},
			{
				section: constants.Performance_Reports_sections.detailed_feedback,
				locator: this.getSectionLocatorByName("Detailed Feedback"),
			},
			{
				section: constants.Performance_Reports_sections.blind_spots,
				locator: this.getSectionLocatorByName("Blind Spots"),
			},
		];
	}

	/**
	 * Verifies the visibility of evaluator comments in the report.
	 * @param {Object} params - The parameters object
	 * @param {string} params.visibility - The visibility to verify ("Show Roles", "Show Names", "Anonymous").
	 * @param {Array<string>} params.roles - The roles to verify.
	 * @param {Array<string>} params.participants - The participants to verify.
	 * @param {import('@playwright/test').Page} [params.page=this.page] - The Playwright page object.
	 * @returns {Promise<void>}
	 * @throws {Error} If the visibility check fails.
	 * @example
	 * await reportsPdfPage.verifyEvaluatorCommentsVisibility({
	 * 	visibility: "Show Roles",
	 * 	roles: ["PEER", "SELF"],
	 * 	participants: [constants.subjectName, constants.evaluatorName],
	 * });
	 */
	async verifyEvaluatorCommentsVisibility({
		visibility,
		roles = constants.PERFORMANCE_ROLES,
		participants = [],
		page = this.page,
	}) {
		await PwActions.waitForNetworkIdle(page, 10000);
		const feedbackEls = await PwActions.getWebElements(
			page,
			this.getOpenEndendQuestionFeedbacks,
		);
		const openFeedbackText = (
			await Promise.all(feedbackEls.map((el) => el.allInnerTexts()))
		)
			.flat()
			.join(" ")
			.toUpperCase();

		roles = CommonUtils.normalizeArrayToUpperCase(roles);
		participants = CommonUtils.normalizeArrayToUpperCase(participants);

		const assertAllPresent = (items = []) => {
			for (const item of items) {
				if (!openFeedbackText.includes(item)) {
					throw new Error(
						`Visibility check failed: expected feedback to include "${item}" but it was not found. (visibility=${visibility}), The open feedback text is: ${openFeedbackText}`,
					);
				}
			}
		};

		const assertAllAbsent = (items = []) => {
			for (const item of items) {
				if (openFeedbackText.includes(item)) {
					throw new Error(
						`Visibility check failed: expected feedback NOT to include "${item}" but it was found. (visibility=${visibility}), The open feedback text is: ${openFeedbackText}`,
					);
				}
			}
		};

		switch (visibility) {
			case "Show Roles":
				if (roles.length) assertAllPresent(roles);
				if (participants.length) assertAllAbsent(participants);
				break;

			case "Show Names":
				if (participants.length) assertAllPresent(participants);
				if (roles.length) assertAllAbsent(roles);
				break;

			case "Anonymous":
				if (roles.length) assertAllAbsent(roles);
				if (participants.length) assertAllAbsent(participants);
				break;

			default:
				throw new Error(`Unknown visibility mode: ${visibility}`);
		}
	}

	/**
	 * Returns the text content of a specific section in the report.
	 * @param {Object} params - The parameters object
	 * @param {string} params.sectionName - The name of the section to get the content of.
	 * @param {import('@playwright/test').Page} [params.page=this.page] - The Playwright page object.
	 * @returns {Promise<Array<string>>} The text content of the section.
	 * @example
	 * await reportsPdfPage.getReportContentTextForSection({ sectionName: "Introduction" });
	 */

	async getReportContentTextForSection({ sectionName, page = this.page }) {
		const sectionLocator = this.getSectionLocatorByName(sectionName);
		const sectionContent = await PwActions.getAllInnerTexts(
			page,
			sectionLocator,
		);
		return sectionContent;
	}

	/**
	 * Retrieves all scores from the performance report including section scores and question scores.
	 * Collects scores for each section and question across all performance roles.
	 *
	 * @param {Object} params - The parameters object
	 * @param {Page} [params.page=this.page] - The Playwright page object to interact with
	 * @param {string} params.cookieValue - Cookie value used to authenticate API requests for survey details
	 * @returns {Promise<Object>} An object containing all scores structured as:
	 *   - sections: Object with section names as keys, each containing:
	 *     - score: Overall section score
	 *     - roles: Object with role-based scores for the section
	 *   - questions: Object with question text as keys, each containing:
	 *     - roles: Object with role-based scores for the question
	 * @example
	 * const scores = await reportsPdfPage.getAllScoresFromReport({
	 *   page: page,
	 *   cookieValue: 'cookie_value'
	 * });
	 * // Returns: { sections: { "Section 1": { score: "4.5", roles: { "Manager": "4.2" } } }, questions: { "Question 1": { roles: { "Manager": "4.0" } } } }
	 */
	async getAllScoresFromReport({
		page = this.page,
		cookieValue,
		roles = constants.PERFORMANCE_ROLES,
	}) {
		const surveyDetails =
			await this.communfunction.getsurveyAPIDetails(cookieValue);
		const scores = { overallScore: 0, sections: {}, questions: {} };
		const sections = surveyDetails.sections;
		const overallScore = await PwActions.getText(page, this.txtOverallScore);
		scores.overallScore = overallScore;
		await Promise.all(
			sections.map(async (section) => {
				const sectionName = section.name;
				const [sectionScores, ...roleScores] = await Promise.all([
					PwActions.getText(page, this.getScoreOfCompetencyGroup(sectionName)),
					...roles.map(async (role) => {
						const locator = this.getRoleBasedScoreForCompetency(
							role,
							sectionName,
						);
						const isVisible = await PwActions.elementIsVisible(page, locator);
						if (isVisible) {
							const score = await PwActions.getText(page, locator);
							return { role, score };
						}
						return { role, score: null };
					}),
				]);
				scores.sections[sectionName] = {
					score: sectionScores,
					roles: {},
				};
				roleScores.forEach(({ role, score }) => {
					if (score !== null) {
						scores.sections[sectionName].roles[role] = score;
					}
				});
			}),
		);
		for (const section of sections) {
			await Promise.all(
				section.questions.map(async (question) => {
					const questionName = question.txt;
					const roleScores = await Promise.all(
						roles.map(async (role) => {
							const locator = this.getScoreOfQuestionBasedOnRole(
								questionName,
								role,
							);
							const isVisible = await PwActions.elementIsVisible(page, locator);
							if (isVisible) {
								const score = await PwActions.getText(page, locator);
								return { role, score };
							}
							return { role, score: null };
						}),
					);
					scores.questions[questionName] = {
						roles: {},
					};
					roleScores.forEach(({ role, score }) => {
						if (score !== null) {
							scores.questions[questionName].roles[role] = score;
						}
					});
				}),
			);
		}

		return scores;
	}

	/**
	 * Verifies the benchmarks on the report.
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @returns {Promise<void>}
	 * @example
	 * await reportsPdfPage.verifyBenchmarksOnReport({ page });
	 */
	async verifyBenchmarksOnReport({ competencyName, benchmarkValue }) {
		const benchmarkScore = await PwActions.getText(
			this.page,
			this.getBenchMarkScoreForCompetency(competencyName),
		);
		expect(benchmarkScore).toBe(benchmarkValue);
	}

	/**
	 * Verifies that the report content is in the specified language.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page=this.page] - The Playwright page object.
	 * @param {string} params.language - The language to verify (e.g., "Tamil", "Hindi").
	 * @returns {Promise<void>}
	 * @example
	 */
	async verfiyReportLanguage({ page = this.page, language }) {
		const [reportTitlesElements, reportContentElements] = await Promise.all([
			PwActions.getWebElements(page, this.webElementsReportTitles),
			PwActions.getWebElements(page, this.webElementsReportContent),
		]);
		const [reportTitles, reportContents] = await Promise.all([
			PwActions.getElementsText(page, reportTitlesElements),
			Promise.all(reportContentElements.map((element) => element.innerText())),
		]);
		const allTexts = [...reportTitles, ...reportContents].filter((text) =>
			text?.trim(),
		);
		const mergedText = allTexts.join(" ");
		const expectedLanguage = language.toLowerCase();
		const detectedLanguage = await this.commonutils.getTextLanguage(mergedText);
		expect(
			detectedLanguage.toLowerCase(),
			`Report content is not in ${language} language`,
		).toBe(expectedLanguage);
		logger.info(`Successfully verified report is in ${language} language`);
	}
}

export { ReportsPdfPage };

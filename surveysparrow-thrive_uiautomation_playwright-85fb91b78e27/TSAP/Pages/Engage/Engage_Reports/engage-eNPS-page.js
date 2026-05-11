import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { Calculations } from "../../../Shared_Functions/calculations.js";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { EngageManagerView } from "./engage-manager-view.js";
import { EngageReportsBasePage } from "./engage-reports-page.js";
import { expect } from "@playwright/test";

class EngageENPSPage extends EngageReportsBasePage {
	constructor(page) {
		super(page);
		this.page = page;
		this.commonutils = new CommonUtils();
		this.engageManagerView = new EngageManagerView(page);

		this.txtOverallENPSScore =
			"//p[normalize-space()='OVERALL ENPS']/following::p[7]";
		this.txtENPSLabel = "//p[normalize-space()='OVERALL ENPS']";

		this.txtPromotersPercentage =
			"//p[contains(text(), 'Promoters')]/following-sibling::p";
		this.txtPassivesPercentage =
			"//p[contains(text(), 'Passives')]/following-sibling::p";
		this.txtDetractorsPercentage =
			"//p[contains(text(), 'Detractors')]/following-sibling::p";
		this.txtTopDetractorsLabel = "//p[normalize-space()='TOP DETRACTORS']";
		this.txtTopDetractorsDepartmentName =
			"//p[normalize-space()='TOP DETRACTORS']/following::p[1]";
		this.txtTopDetractorsScore =
			"//p[normalize-space()='TOP DETRACTORS']/following::h1[1]";
		this.txtTopDetractorsComparison =
			"//p[normalize-space()='TOP DETRACTORS']/following::p[2]";
		this.txtTopPromotersLabel = "//p[normalize-space()='TOP PROMOTERS']";
		this.txtTopPromotersDepartmentName =
			"//p[normalize-space()='TOP PROMOTERS']/following::p[1]";
		this.txtTopPromotersScore =
			"//p[normalize-space()='TOP PROMOTERS']/following::h1[1]";
		this.txtTopPromotersComparison =
			"//p[normalize-space()='TOP PROMOTERS']/following::p[2]";
	}

	/**
	 * Verifies the eNPS tab data by comparing with expected data
	 * @param {Object} expectedData - The expected engagement admin report data containing enps property
	 * @param {string} [scoreBy="Favourability Score"] - The score type to use for verification
	 * @param {string} [settings="anonymous"] - 'anonymous' or 'non-anonymous'
	 * @example
	 * await engageENPSPage.verifyENPSTab(engage_admin:{enps:{summary:{overall_score:"50", promoters:"50", passives:"30", detractors:"20"}, top_detractors:{department:{name:"Department 1", favscore:"50", favcomparison:"50"}}, top_promoters:{department:{name:"Department 2", favscore:"50", favcomparison:"50"}}, enps_summary:{department:[{name:"Department 1", responses:10, favscore:"50", favcomparison:"50"}, {name:"Department 2", responses:20, favscore:"50", favcomparison:"50"}]}}, "Favourability Score", "anonymous");
	 * @returns {Promise<void>}
	 */
	async verifyENPSTab(expectedData, settings = "anonymous") {
		await CommonUtils.sleep(2);

		const enpsData = expectedData.enps;

		const summary = enpsData.summary;

		const actualOverallScore = await PwActions.getText(
			this.page,
			this.txtOverallENPSScore,
		);

		expect(actualOverallScore.trim()).toBe(summary.overall_score);

		const actualPromotersText = await PwActions.getText(
			this.page,
			this.txtPromotersPercentage,
		);
		const actualPassivesText = await PwActions.getText(
			this.page,
			this.txtPassivesPercentage,
		);
		const actualDetractorsText = await PwActions.getText(
			this.page,
			this.txtDetractorsPercentage,
		);

		expect(CommonUtils.extractByFormat(actualPromotersText, "percentage")).toBe(
			summary.promoters,
		);
		expect(CommonUtils.extractByFormat(actualPassivesText, "percentage")).toBe(
			summary.passives,
		);
		expect(
			CommonUtils.extractByFormat(actualDetractorsText, "percentage"),
		).toBe(summary.detractors);

		const topDetractors = enpsData.top_detractors.department;
		const actualTopDetractorName = await PwActions.getText(
			this.page,
			this.txtTopDetractorsDepartmentName,
		);
		const actualTopDetractorScore = await PwActions.getText(
			this.page,
			this.txtTopDetractorsScore,
		);
		const actualTopDetractorComparison = await PwActions.getText(
			this.page,
			this.txtTopDetractorsComparison,
		);

		expect(actualTopDetractorName.trim()).toBe(topDetractors.name);
		expect(actualTopDetractorScore.trim()).toBe(topDetractors.favscore);
		expect(actualTopDetractorComparison).toContain(topDetractors.favcomparison);

		const topPromoters = enpsData.top_promoters.department;
		const actualTopPromoterName = await PwActions.getText(
			this.page,
			this.txtTopPromotersDepartmentName,
		);
		const actualTopPromoterScore = await PwActions.getText(
			this.page,
			this.txtTopPromotersScore,
		);
		const actualTopPromoterComparison = await PwActions.getText(
			this.page,
			this.txtTopPromotersComparison,
		);

		expect(actualTopPromoterName.trim()).toBe(topPromoters.name);
		expect(actualTopPromoterScore.trim()).toBe(topPromoters.favscore);
		expect(actualTopPromoterComparison).toContain(topPromoters.favcomparison);

		const enpsSummaryDepartments = enpsData.enps_summary.department;

		const enpsSummaryNames = await PwActions.getAllInnerTexts(
			this.page,
			this.webElementsEngagementSummaryNames,
		);

		const [enpsSummaryScores, enpsSummaryComparisons] = await Promise.all([
			PwActions.getAllInnerTexts(
				this.page,
				this.webElementsEngagementSummaryColumn("Score"),
			),
			PwActions.getAllInnerTexts(
				this.page,
				this.webElementsEngagementSummaryColumn("Comparison"),
			),
		]);

		let enpsSummaryResponses;
		if (settings !== "non-anonymous") {
			enpsSummaryResponses = await PwActions.getAllInnerTexts(
				this.page,
				this.webElementsEngagementSummaryColumn("Responses"),
			);
		}

		expect(enpsSummaryNames.length).toBe(enpsSummaryDepartments.length);

		for (const expected of enpsSummaryDepartments) {
			const idx = enpsSummaryNames.findIndex(
				(n) => n?.trim().toLowerCase() === expected.name.trim().toLowerCase(),
			);
			expect(idx).toBeGreaterThanOrEqual(
				0,
				`Department ${expected.name} should be found in the table`,
			);

			if (expected.responses !== undefined && settings !== "non-anonymous") {
				expect(
					CommonUtils.extractByFormat(enpsSummaryResponses[idx], "integer"),
				).toBe(expected.responses.trim());
			}

			expect(
				CommonUtils.extractByFormat(enpsSummaryScores[idx], "decimal"),
			).toBe(expected.favscore);

			expect(enpsSummaryComparisons[idx]).toContain(expected.favcomparison);
		}
	}
}
class EngagePulseManagerENPSPage {
	constructor(page) {
		this.page = page;
		this.commonutils = new CommonUtils();
		this.calculations = new Calculations();
		this.engageManagerView = new EngageManagerView(page);
		this.lblENPS =
			"//p[normalize-space(.)='ENPS']/parent::div/preceding-sibling::p";
	}

	/**
	 * Verifies the eNPS score on the Manager Overview page.
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Usage example in a Playwright test:
	 * const enpsPage = new EngagePulseManagerENPSPage(page);
	 * await enpsPage.verifyENPSScore();
	 */
	async verifyENPSScore() {
		await PwActions.pageRefresh(this.page);
		await CommonUtils.sleep(3);

		const responseData = await this.commonutils.readJsonFileAndConvertToObject(
			`${EntityIds.getsurveyName()} Survey Response.json`,
		);

		expect(
			responseData && responseData["Subject"],
			"Invalid or missing response data",
		).toBeTruthy();

		const enpsScores = Calculations.engagePulseOverallENPS(
			responseData["Subject"],
		);

		const actual_ENPS = await PwActions.getText(this.page, this.lblENPS);

		const calculatedScore = Number(enpsScores.enpsScore).toFixed(1);
		const displayedScore = parseFloat(actual_ENPS).toFixed(1);

		await PwActions.verifyTextExpected(displayedScore, calculatedScore);
	}
}

export { EngageENPSPage, EngagePulseManagerENPSPage };

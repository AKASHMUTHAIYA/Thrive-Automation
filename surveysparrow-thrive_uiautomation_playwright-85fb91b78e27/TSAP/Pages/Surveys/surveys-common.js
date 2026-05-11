import PwActions from "playwright-framework/Core/pw-actions.js";
class SurveysCommon {
	constructor(page) {
		this.page = page;
		this.btnApplyFilterIcon =
			"(//div[@class='twigs-button__icon-container'])[5]/ancestor::button | (//div[@class='twigs-button__icon-container'])[4]/ancestor::button";
		this.getFilterDropDown = (filterName) =>
			`//p[normalize-space(.)="${filterName}"]/ancestor::div[@role='menuitem']`;
		this.chckBoxFilterValue = (filterValue) =>
			`//div[normalize-space()="${filterValue}"]//button`;
		this.btnApplyFilter = "//span[contains(normalize-space(.),'Apply')]";
		this.getRemoveFilter = (filterName) =>
			`//p[normalize-space(.)="${filterName}"]/parent::div/preceding-sibling::button`;
		this.getFilterChip = (filerName) =>
			`//p[contains(normalize-space(.), "${filerName}")]/parent::button`;
		this.btnRemoveFilterChip = (filerName) =>
			`//button[contains(@aria-label,"${filerName}")]`;
	}

	/**
	 * Applies filters to the survey.
	 * @param {Object} params - The parameters object.
	 * @param {import('@playwright/test').Page} [params.page=this.page] - The Playwright page object.
	 * @param {Object} params.filter - The filter object.
	 * @param {string} params.filter.filterName - The name of the filter.
	 * @param {string[]} params.filter.filterValues - The values of the filter.
	 * @example
	 * // Applying filters to the survey
	 * await surveysCommonPage.applyFilters({
	 *   filter: {
	 *     filterName: "Team",
	 *     filterValues: ["Team 1", "Team 2"]
	 *   }
	 * });
	 */
	async applyFilters({ page = this.page, filter = {} }) {
		await PwActions.click(page, this.btnApplyFilterIcon);
		await PwActions.click(page, this.getFilterDropDown(filter.filterName));
		for (const filterValue of filter.filterValues) {
			await PwActions.click(page, this.chckBoxFilterValue(filterValue));
		}
		await PwActions.click(page, this.btnApplyFilter);
	}

	/**
	 * Removes a filter from the survey.
	 * @param {Object} params - The parameters object.
	 * @param {import('@playwright/test').Page} [params.page=this.page] - The Playwright page object.
	 * @param {string} params.filterName - The name of the filter.
	 * @example
	 * // Removing a filter from the survey
	 * await surveysCommonPage.removeFilter({ filterName: "Team" });
	 */
	async removeFilter({ page = this.page, filterName }) {
		await PwActions.waitForElementVisibility(
			page,
			this.getFilterChip(filterName),
		);
		await PwActions.waitForElementVisibility(
			page,
			this.btnRemoveFilterChip(filterName),
		);
		await PwActions.click(page, this.btnRemoveFilterChip(filterName));
		await PwActions.waitTillElementDisappear(
			page,
			this.getFilterChip(filterName),
		);
	}
}
export { SurveysCommon };

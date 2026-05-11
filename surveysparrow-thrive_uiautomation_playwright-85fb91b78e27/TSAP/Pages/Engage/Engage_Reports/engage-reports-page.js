import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

/**
 * Base class for Engage Reports pages containing shared functionality
 * Common functions used across Overview, Heatmap, and Questions pages
 */
class EngageReportsBasePage {
	constructor(page) {
		this.page = page;
		// Common selectors used across all engage report pages
		this.btnGroupBy =
			"//label[normalize-space()='Group By']/following::div[contains(@class,'twigs-select__control')][1]";
		this.btnscoreBy =
			"//label[normalize-space()='Score By']/following::div[contains(@class,'twigs-select__control')][1]";
		this.btnFilter =
			"//*[local-name()='path' and @d='M15.1403 11.8196H20.7972']/ancestor::button";
		this.btnAdditionalFilters =
			"//*[local-name()='path' and @d='M24 16H8']/ancestor::button";
		this.btnApplyFilter = "//span[contains(normalize-space(.),'Apply')]";
		this.btnResetFilter = "//span[contains(normalize-space(.),'Reset')]";
		this.webElementsDrpdwnList = "//div[@role='menuitem']";
		this.optionDrpDownOptions = (option) =>
			`//div[@role='menuitem']//p[normalize-space(.)="${option}"]`;
		this.chkBoxFilterByValue = (filterByValue) =>
			`//div[@data-testid='cascaded-custom-dropdown_flex']//p[normalize-space()='${filterByValue}']/ancestor::div[@data-testid='cascaded-custom-dropdown_flex']//button`;
		this.inputFilterDropdown =
			"//input[@data-testid='cascaded-custom-dropdown_input']";
		this.btnSaveViewOptions =
			"//button[@data-testid='button' and contains(@class,'gSguNF-buxqVs-size-md twigs-c-gSguNF-k')]";
		this.btnSaveAsNewView =
			"//div[@role='menuitem' and normalize-space()='Save as New View']";
		this.inputViewName =
			"//input[@data-testid='save-name-modal_form-input_name']";
		this.btnSaveView = "//button[@data-testid='save-name-modal_button_save']";
		this.btnShareView =
			"//*[local-name()='path' and starts-with(@d,'M12.9695 13.096')]";
		this.drpdownViewAs =
			"//label[text()='View As']/ancestor::div[4]//*[local-name()='svg']";
		this.optionDrpDownViewAs = (viewName) => `//p[text()='${viewName}']`;
		this.inputShareView = "//input[@aria-label='Search by name or email']";
		this.optionDrpDownShareViewMember = (memberName) =>
			`//p[text()='${memberName}']`;
		this.btnShareViewFromTab =
			"//button[@data-testid='share-with-tab-content_button_share']";
		this.webElementsEngagementSummaryNames = `//table//tbody//tr/td[count(//table//thead//th[.//p[normalize-space()='']]/preceding-sibling::th)+1]//p[1]`;

		this.webElementsEngagementSummaryColumn = (columnHeader) =>
			`//table//tbody//tr/td[count(//table//thead//th[.//p[normalize-space()='${columnHeader}']]/preceding-sibling::th)+1]//p[1]`;
	}

	/**
	 * Helper method to select score type from dropdown
	 * @param {string} scoreBy - Score type to select ("Favourability Score" or "Percentage Score")
	 * @returns {Promise<void>}
	 * @example
	 * await page.selectScoreType("Percentage Score");
	 */
	async selectScoreType(scoreBy) {
		await PwActions.click(this.page, this.btnscoreBy);
		await PwActions.click(this.page, this.optionDrpDownOptions(scoreBy));
		await CommonUtils.sleep(2);
	}

	/**
	 * Helper method to apply a filter with groupBy and multiple filterByKey with multiple filterByValues
	 * @param {Object} filter - Filter object containing groupByName and filters array
	 * @param {string} filter.groupByName - The group by option name (e.g., "Department", "Gender")
	 * @param {Array} filter.filters - Array of filter objects with filterByKey and filterByValues
	 * @param {string} filter.filters[].filterByKey - The filter dimension key (e.g., "Custom Dropdown", "Country")
	 * @param {Array<string>} filter.filters[].filterByValues - Array of filter values to select (e.g., ["IN", "PK"])
	 * @returns {Promise<void>}
	 * @example
	 * await page.applyEngageFilter({
	 *   groupByName: "Department",
	 *   filters: [
	 *     {
	 *       filterByKey: "Country",
	 *       filterByValues: ["IN", "PK"]
	 *     },
	 *     {
	 *       filterByKey: "Gender",
	 *       filterByValues: ["Male", "Female"]
	 *     }
	 *   ]
	 * });
	 */
	async applyEngageFilter(filter) {
		await PwActions.click(this.page, this.btnGroupBy);
		await PwActions.click(
			this.page,
			this.optionDrpDownOptions(filter.groupByName),
		);

		const isResetFilterVisible = await PwActions.elementIsVisible(
			this.page,
			this.btnResetFilter,
			2,
		);

		for (
			let filterIndex = 0;
			filterIndex < filter.filters.length;
			filterIndex++
		) {
			const currentFilter = filter.filters[filterIndex];

			if (filterIndex === 0 && !isResetFilterVisible) {
				await PwActions.click(this.page, this.btnFilter);
			} else {
				await PwActions.click(this.page, this.btnAdditionalFilters);
			}

			await PwActions.fill(
				this.page,
				this.inputFilterDropdown,
				currentFilter.filterByKey,
			);
			await PwActions.click(
				this.page,
				this.optionDrpDownOptions(currentFilter.filterByKey),
			);

			for (
				let valueIndex = 0;
				valueIndex < currentFilter.filterByValues.length;
				valueIndex++
			) {
				const filterValue = currentFilter.filterByValues[valueIndex];

				if (valueIndex === 0) {
					await PwActions.fill(
						this.page,
						this.inputFilterDropdown,
						filterValue,
					);
				} else {
					await PwActions.clearAndFill(
						this.page,
						this.inputFilterDropdown,
						filterValue,
					);
				}

				await PwActions.click(this.page, this.chkBoxFilterByValue(filterValue));
			}
			await PwActions.click(this.page, this.btnApplyFilter);
		}
	}

	/**
	 * Helper method to reset any applied filters
	 * removes all engage reports filters
	 * @returns {Promise<void>}
	 * @example
	 * await engageReportsBasePage.resetFilter();
	 */
	async resetFilter() {
		if (await PwActions.elementIsVisible(this.page, this.btnResetFilter)) {
			await PwActions.click(this.page, this.btnResetFilter);
			await CommonUtils.sleep(1);
		}
	}

	/**
	 * Helper method to select a group by option from dropdown
	 * @param {string} option - The group by option to select
	 * @returns {Promise<void>}
	 * @example
	 * await engageReportsBasePage.selectGroupByOption("Department");
	 */
	async selectGroupByOption(option) {
		await PwActions.click(this.page, this.btnGroupBy);
		await PwActions.click(this.page, this.optionDrpDownOptions(option));
		await CommonUtils.sleep(2);
	}

	/**
	 * Helper method to get all group by options from the dropdown
	 * @returns {Promise<string[]>} Array of group by option names
	 * @example
	 * const groupByOptions = await engageReportsBasePage.getGroupByOptions();
	 * console.log(groupByOptions);
	 */
	async getGroupByOptions() {
		await PwActions.click(this.page, this.btnGroupBy);
		const options = await PwActions.getAllInnerTexts(
			this.page,
			this.webElementsDrpdwnList,
		);
		// Close dropdown by clicking first option
		if (options.length > 0) {
			await PwActions.click(this.page, this.btnGroupBy);
		}
		return options;
	}

	/**
	 * Helper method to get score and comparison field names based on scoreBy type
	 * @param {string} scoreBy - Score type ("Favourability Score" or "Percentage Score")
	 * @returns {Object} Object with scoreField and comparisonField
	 * @example
	 * const { scoreField, comparisonField } = page.getScoreFields("Percentage Score");
	 * // Returns: { scoreField: "perscore", comparisonField: "percomparison" }
	 */
	getScoreFields(scoreBy) {
		const isPercentage = scoreBy === "Percentage Score";
		return {
			scoreField: isPercentage ? "perscore" : "favscore",
			comparisonField: isPercentage ? "percomparison" : "favcomparison",
		};
	}

	/**
	 * Helper method to get the expected score value field based on scoreBy type
	 * Used for heatmap where fields are pervalue/favvalue
	 * @param {string} scoreBy - Score type ("Favourability Score" or "Percentage Score")
	 * @returns {string} The field name to use (pervalue or favvalue)
	 * @example
	 * // Usage example in a Playwright test:
	 * const heatmapPage = new EngageHeatmapPage(page);
	 * const scoreValueField = heatmapPage.getScoreValueField("Percentage Score");
	 * expect(scoreValueField).toBe("pervalue");
	 */
	getScoreValueField(scoreBy) {
		return scoreBy === "Percentage Score" ? "pervalue" : "favvalue";
	}

	/**
	 * Helper method to normalize a filter key using extractByFormat
	 * @param {string} key - The key to normalize
	 * @param {Object} keyMap - Optional key map for predefined mappings
	 * @returns {string} Normalized key
	 * @example
	 * // Usage example in a Playwright test:
	 * const heatmapPage = new EngageHeatmapPage(page);
	 * const normalizedKey = heatmapPage.normalizeKey("Custom Dropdown", { Custom Dropdown: "custom_dropdown" });
	 * expect(normalizedKey).toBe("custom_dropdown");
	 */
	normalizeKey(key, keyMap = {}) {
		return keyMap[key] || CommonUtils.extractByFormat(key, "filter_key");
	}

	/**
	 * Helper method to get the loop options based on filterBy parameter
	 * @param {string[]} defaultOptions - Default options to loop through
	 * @param {Array|null} filterBy - Filter array if provided
	 * @returns {string[]} Options to loop through. Filters the defaultOptions and returns the options that are in the filterBy array.
	 * @example
	 * // Usage example in a Playwright test:
	 * const heatmapPage = new EngageHeatmapPage(page);
	 * const options = heatmapPage.getOptionsToLoop(["Department", "Gender"], [{ groupByName: "Gender" }]);
	 * expect(options).toEqual(["Gender"]);
	 */
	getOptionsToLoop(defaultOptions, filterBy) {
		if (filterBy && Array.isArray(filterBy) && filterBy.length > 0) {
			return [...new Set(filterBy.map((filter) => filter.groupByName))];
		}
		return defaultOptions;
	}
	/**
	 * Helper method to save a filters configuration as a new view
	 * @param {string} viewName - The name of the view to save
	 * @returns {Promise<void>}
	 * @example
	 * await engageReportsBasePage.saveView("My View");
	 */

	async saveView(viewName) {
		await PwActions.click(this.page, this.btnSaveViewOptions);
		await PwActions.click(this.page, this.btnSaveAsNewView);
		await PwActions.fill(this.page, this.inputViewName, viewName);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnSaveView);
		await CommonUtils.sleep(2);
	}
	/**
	 * Helper method to share a filters configuration with a member
	 * @param {string} viewName - The name of the view to share
	 * @param {string} memberName - The name of the member to share the view with
	 * @returns {Promise<void>}
	 * @example
	 * await engageReportsBasePage.shareView("My View", "John Doe");
	 */

	async shareView(viewName, memberName) {
		await PwActions.click(this.page, this.drpdownViewAs);
		await PwActions.click(this.page, this.optionDrpDownViewAs(viewName));
		await PwActions.click(this.page, this.btnShareView);
		await PwActions.fill(this.page, this.inputShareView, memberName);
		await PwActions.click(
			this.page,
			this.optionDrpDownShareViewMember(memberName),
		);
		await PwActions.click(this.page, this.btnShareViewFromTab);
		await PwActions.click(this.page, this.btnShareView);

		await CommonUtils.sleep(2);
	}
}

export { EngageReportsBasePage };

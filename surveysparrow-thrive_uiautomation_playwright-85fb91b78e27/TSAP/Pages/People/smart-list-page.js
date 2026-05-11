import PwActions from "playwright-framework/Core/pw-actions.js";
import { expect } from "@playwright/test";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions.js";

class SmartListPage {
	constructor(page) {
		this.page = page;
		this.commonFunctions = new CommonPageFunctions(this.page);

		// Primary locators
		this.btnAddSmartList = "[data-testid='smart-list-icon-button']";
		this.btnAddCondition = "[data-testid='filter_button_add-condition']";
		this.menuDeleteSmartList = "[data-testid='smart-list-delete-button']";
		this.lblSmartListName = (name) =>
			`//a[@data-testid='smart-list-link' and normalize-space()='${name}']`;

		// Condition builder
		this.drpdwnConditionScope = "//div[@data-state='closed']";
		this.menuConditionScope = (scope) =>
			`//div[@role='menu']//div[normalize-space()='${scope}']`;
		this.menuConditionProperty = (property) =>
			`//div[contains(@class,'select__menu-list')]//div[text()='${property}']`;
		this.menuConditionComparison = (comparison) =>
			`//div[contains(@class,'select__menu-list')]//div[text()='${comparison}']`;
		this.inputBoxConditionValue =
			"//p[text()='Search']/ancestor::div[contains(@class,'twigs-select__value-container')]//input";
		this.inputConditionValue = "//input[@placeholder='Enter a value']";
		this.menuConditionValue = (text) =>
			`//div[contains(@class,'select__menu-list')]//div[normalize-space()='${text}']//button`;
		this.btnApplyCondition = "//span[text()='Apply']/parent::button";
		this.btnSaveList = "//button[normalize-space()='Save List']";
		this.inputSmartListName = "//input[@placeholder='Enter a name']";
		this.btnSaveSmartList = "//span[text()='Save']/parent::button";

		// List actions
		this.btnSmartListActions = (smartListName) =>
			`//aside[@data-testid='box']//p[@data-testid='text' and text()='${smartListName}']/following-sibling::button`;
		this.menuEditSmartList =
			"//div[@role='menuitem' and normalize-space()='Edit']";
		this.menuExportSmartListCsv =
			"//div[@role='menuitem']//p[normalize-space()='Export as CSV']";
		this.btnSmartListDetailActions =
			"//main[@data-testid='box']//button[@aria-haspopup='menu']";
		this.toastSmartListDeleteSuccess =
			"//div[text()='Smartlist deleted Successfully']";
		this.lblSmartListMembersCount = (smartListName) =>
			`//p[text()='${smartListName}']`;
		this.webElementsParticipantsTable =
			"//tbody[@class='twigs-c-PJLV twigs-c-PJLV-ikMyFIN-css']";
		this.txtSmartListMembersCount =
			"//main[@data-testid='box']//div[@data-testid='chip']";
	}

	/**
	 * Creates a smart list using one condition and saves it.
	 * @param {object} options
	 * @param {string} [options.conditionScope="all"] - Condition scope value (all/any)
	 * @param {string} [options.conditionProperty="Department"] - Condition property to select
	 * @param {string} options.conditionValue - Condition value to select
	 * @param {string} options.smartListName - Name to save the smart list with
	 * @returns {Promise<void>}
	 * @example
	 * await smartListPage.addOrEditSmartList({
	 *   conditionScope: "all",
	 *   conditionComparison: "is",
	 *   conditionProperty: "Department",
	 *   conditionValue: "Sales",
	 *   smartListName: "SmartList_123",
	 *   isEdit: false,
	 * });
	 */
	async addOrEditSmartList({
		conditionScope = "all",
		conditionProperty = "Department",
		conditionComparison = "is",
		conditionValue,
		smartListName,
		isEdit = false,
	} = {}) {
		if (isEdit) {
			await PwActions.hover(this.page, this.lblSmartListName(smartListName));
			await PwActions.click(this.page, this.btnSmartListActions(smartListName));
			await PwActions.click(this.page, this.menuEditSmartList);
			await PwActions.click(this.page, this.btnAddCondition);
			await PwActions.click(
				this.page,
				this.menuConditionProperty(conditionProperty),
			);
			await PwActions.click(
				this.page,
				this.menuConditionComparison(conditionComparison),
			);
			await PwActions.fill(this.page, this.inputConditionValue, conditionValue);
			await PwActions.waitTillVisible(
				this.page,
				this.menuConditionValue(conditionValue),
				5000,
			);
			await PwActions.click(this.page, this.btnApplyCondition);
		} else {
			await PwActions.click(this.page, this.btnAddSmartList);
			await PwActions.click(this.page, this.drpdwnConditionScope);
			await PwActions.click(this.page, this.menuConditionScope(conditionScope));
			await PwActions.click(this.page, this.btnAddCondition);
			await PwActions.click(
				this.page,
				this.menuConditionProperty(conditionProperty),
			);
			await PwActions.fill(
				this.page,
				this.inputBoxConditionValue,
				conditionValue,
			);
			await PwActions.waitTillVisible(
				this.page,
				this.menuConditionValue(conditionValue),
				5000,
			);
			await PwActions.click(this.page, this.menuConditionValue(conditionValue));
			await PwActions.click(this.page, this.btnApplyCondition);
			await PwActions.waitAndClick(this.page, this.btnSaveList);
			await PwActions.clearAndFill(
				this.page,
				this.inputSmartListName,
				smartListName,
			);
		}
		await PwActions.click(this.page, this.btnSaveSmartList);
	}
	/**
	 * Verifies if a smart list is created and visible in the sidebar.
	 * @param {string} smartListName - The name of the smart list to verify
	 * @returns {Promise<void>}
	 * @example await smartListPage.verifySmartListCreated("SmartList_1");
	 */
	async verifySmartListCreated(smartListName) {
		await this.commonFunctions.navigateToPageUrl("People");
		await PwActions.waitTillVisible(
			this.page,
			this.lblSmartListName(smartListName),
			5000,
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.lblSmartListName(smartListName),
		);
	}

	/**
	 * Deletes a smart list by name and verifies delete success toast.
	 * @param {string} smartListName - Name of the smart list to delete
	 * @returns {Promise<void>}
	 * @example await smartListPage.deleteSmartList("SmartList_2");
	 */
	async deleteSmartList(smartListName) {
		await PwActions.hover(this.page, this.lblSmartListName(smartListName));
		await PwActions.click(this.page, this.btnSmartListActions(smartListName));
		await PwActions.click(this.page, this.menuDeleteSmartList);
		await PwActions.waitTillVisible(
			this.page,
			this.toastSmartListDeleteSuccess,
			5000,
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.toastSmartListDeleteSuccess,
		);
	}

	/**
	 * Exports a smart list as CSV and returns downloaded file details.
	 * @param {string} smartListName - Name of the smart list to export
	 * @returns {Promise<{filePath: string, extension: string}>}
	 * @example
	 * const result = await smartListPage.exportSmartList("SmartList_2");
	 */
	async exportSmartList(smartListName) {
		await PwActions.click(
			this.page,
			this.lblSmartListMembersCount(smartListName),
		);
		await PwActions.waitTillVisible(
			this.page,
			this.btnSmartListDetailActions,
			5000,
		);
		await PwActions.click(this.page, this.btnSmartListDetailActions);
		return this.commonFunctions.downloadFileAndReturnPath(
			this.page,
			this.menuExportSmartListCsv,
			15000,
		);
	}
	/**
	 * Function to get the number of members in a smart list
	 * @param smartListName - The name of the smart list to get the member count for
	 * @returns The number of members in the smart list
	 * @example await smartListPage.getSmartListMembersCount("SmartList_2");
	 */
	async getSmartListMembersCount(smartListName) {
		await PwActions.click(
			this.page,
			this.lblSmartListMembersCount(smartListName),
		);
		await PwActions.waitTillVisible(
			this.page,
			this.webElementsParticipantsTable,
		);
		const membersCount = await PwActions.getText(
			this.page,
			this.txtSmartListMembersCount,
		);
		return membersCount;
	}
}

export { SmartListPage };

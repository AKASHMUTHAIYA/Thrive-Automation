import { expect, test } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";

class ManagerMissingPage {
	constructor(page) {
		this.page = page;
		this.btnBulkAssign = "//span[text()='Bulk Assign']";
		this.txtChooseOrSearchManager =
			"//div[text()='Choose or search manager']//following-sibling::div//input";
		this.btnAssign = "//span[text()='Assign']";
		this.toasterUpadteList = "//span[text()='Update List']";
	}

	/* This function is to perform Bulk Assign to selected employee. Employee details can be provided as list parameter */
	async bulkAssign(employeeName, managerName) {
		this.drpdwnChooseManagerValue = `//div[contains(@class, 'select__option--is-focused') and text()='${managerName}']`;

		for (let i = 0; i < employeeName.length; i++) {
			this.chkboxEmployeeName = `//p[text()='${employeeName[i]}']//ancestor::tr//button[@role='checkbox']`;
			await PwActions.click(this.page, this.chkboxEmployeeName);
		}
		await PwActions.click(this.page, this.btnBulkAssign);
		await PwActions.fill(this.page, this.txtChooseOrSearchManager, managerName);
		await PwActions.click(this.page, this.drpdwnChooseManagerValue);
		await PwActions.click(this.page, this.btnAssign);
	}

	///function to manually choose the manager for employee///
	async chooseManagerForEmployee(employeeName, managerName) {
		this.drpdwnChooseManagerValue = `//p[text()='${employeeName}']/ancestor::tr//div[contains(@class,'select__dropdown-indicator')]`;
		this.txtDropDownValue = `//div[contains(@class,'select__option--is-focused') and text()='${managerName}']`;

		await PwActions.click(this.page, this.drpdwnChooseManagerValue);
		await PwActions.click(this.page, this.txtDropDownValue);
		await PwActions.verifyElementIsPresent(this.page, this.toasterUpadteList);
	}
}

export { ManagerMissingPage };

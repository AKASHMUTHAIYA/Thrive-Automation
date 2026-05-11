// Importing necessary modules using ES6 import syntax
import { expect, test } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
// Defining the PeoplePage class
class PeoplePage {
	constructor(page) {
		this.page = page;
		this.btnAddSmartList =
			"//p[text()='Smart Lists']/following-sibling::button";
		// this.btnEmployees = "//div[text()='Employees']";
		// this.btnDepartments = "//div[text()='Departments']";
	}

	/**
	 * This function is to navigate to different sections in the left panel
	 * @param {string} leftNavigationSection - The section to navigate to
	 */
	async navigateToSections(leftNavigationSection) {
		this.btnLeftNavigationSection = `//div[text()='${leftNavigationSection}']`;
		await PwActions.click(this.page, this.btnLeftNavigationSection);
	}

	/**
	 * This function navigates to the Smart Lists section
	 */
	async navigateToSmartLists() {
		await PwActions.click(this.page, this.btnAddSmartList);
	}
}

// Exporting the PeoplePage class using ES6 export syntax
export { PeoplePage };

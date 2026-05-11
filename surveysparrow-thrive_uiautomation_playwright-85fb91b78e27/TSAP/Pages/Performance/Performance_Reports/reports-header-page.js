import PwActions from "playwright-framework/Core/pw-actions.js";

class ReportsHeader {
	constructor(page) {
		this.page = page;
	}
	/**
	 * Navigates to a specific section in the header report by clicking the corresponding button.
	 * @param {string} section - The name of the section to navigate to. This will be used to identify the button to click.
	 */
	async navigateHeaderReportSection(section) {
		this.btnNavigateHeader = `//button[text()='${section}'] | //div[text()='${section}']`;
		await PwActions.click(this.page, this.btnNavigateHeader);
	}
}

export { ReportsHeader };

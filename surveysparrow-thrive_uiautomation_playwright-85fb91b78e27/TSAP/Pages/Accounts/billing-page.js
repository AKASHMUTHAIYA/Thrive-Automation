import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { constants } from "../../Data/Resources/constants";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";

/**
 * BillingPage class provides page actions and assertions for the Accounts > Billing screen.
 */
class BillingPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils();
		this.commonFunctions = new CommonPageFunctions(this.page);
		// Example selectors (update these as per the actual page)
		this.btnDownloadInvoice = "//button[contains(.,'Download Invoice')]";
		this.tblInvoices = "//table[@data-testid='billing-invoices-table']";
		this.btnUpgrade = "//button[contains(.,'Upgrade')]";
		this.lblPlanName = "//div[@data-testid='current-plan-name']";

		// Dynamic selectors for module billing details
		this.txtDollarSign = (
			moduleName,
		) => `//h6[text()='${moduleName}']/ancestor::div[contains(@class,'plan-card-top')]
       //h1[normalize-space()='$']`;
		this.txtPerMonth = (
			moduleName,
		) => `//h6[text()='${moduleName}']/ancestor::div[contains(@class,'plan-card-top')]
       //p[normalize-space()='per month / employee']`;
		this.txtModulePrice = (
			moduleName,
		) => `//h6[text()='${moduleName}']/ancestor::div[contains(@class,'plan-card-top')]
       //h1[normalize-space()='${constants.billingModulePrice[moduleName]}']`;
		this.txtModuleName = (moduleName) => `//h6[text()='${moduleName}']`;
		this.btnBuyNow = (moduleName) =>
			`//h6[text()='${moduleName}']/ancestor::div[contains(@class,'plan-card')]//button[.//span[normalize-space()='Buy Now']]`;
		this.btnDeleteAccount = "//span[text()='Delete Account']";
		this.btnDeleteAccountConfirm = "//span[text()='Yes, Confirm']";
		this.inputProceed = "//input[@name='unlockDeleteText']";
	}

	/**
	 * Verifies billing details for a specific module including module name, price per month, and Buy Now button
	 * @param {string} moduleName - The name of the module to verify (e.g., "Kudos", "Engage", "Performance", "Goals (OKRs)")
	 * @example
	 * await billingPage.verifyBillingDetailsTrial("Kudos");
	 * await billingPage.verifyBillingDetailsTrial("Engage");
	 */
	async verifyBillingDetailsTrial(moduleName, page = this.page) {
		// Verify module name is present
		await PwActions.waitTillVisible(page, this.txtModuleName(moduleName));
		await PwActions.verifyElementIsPresent(
			page,
			this.txtModuleName(moduleName),
		);

		//Verify dollar sign is present
		await PwActions.verifyElementIsPresent(
			page,
			this.txtDollarSign(moduleName),
		);

		// Verify module price is present
		await PwActions.verifyElementIsPresent(
			page,
			this.txtModulePrice(moduleName),
		);

		//Verify text per month is present
		await PwActions.verifyElementIsPresent(page, this.txtPerMonth(moduleName));

		// Verify Buy Now button is present
		await PwActions.verifyElementIsPresent(page, this.btnBuyNow(moduleName));
	}

	/**
	 * Deletes the account by clicking the Delete Account button, filling the proceed text, and clicking the Yes, Confirm button
	 * @param {Page} page - The page object
	 * @example
	 * await billingPage.deleteAccount();
	 */
	async deleteAccount(page = this.page) {
		await this.commonFunctions.navigateTopNavigateSection("Account", page);
		await this.commonFunctions.navigateToSideBarMenu("General", page);
		await PwActions.click(page, this.btnDeleteAccount);
		await PwActions.fill(page, this.inputProceed, "Proceed");
		await CommonUtils.sleep(2);
		await PwActions.waitAndClick(page, this.btnDeleteAccountConfirm);
		await CommonUtils.sleep(4);
		await PwActions.closeTab(page);
	}
}

export default BillingPage;

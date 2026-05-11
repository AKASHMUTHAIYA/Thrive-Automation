import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";

export class AuthenticationPage {
	constructor(page) {
		this.page = page;
		this.chkBoxEnableCustomMessage =
			"[data-testid='password-policy-form_checkbox_custom-message']";
		this.txtBoxAgreementTitle =
			"[data-testid='password-policy-form_form-input_agreement-title']";
		this.editorAgreementContent =
			"//p[normalize-space()='Content']/following::div[@contenteditable='true'][1]";
		this.btnUpdate = "[data-testid='password-policy-form_button_update']";
		this.lblLoginAgreementSummary =
			"//p[@data-testid='text' and contains(normalize-space(),'By logging in, you acknowledge and agree to the')]";
		this.lblLoginAgreementTitle = (agreementTitle) =>
			`//p[@data-testid='text' and normalize-space()='${agreementTitle}']`;
		this.dialogUserAgreement = "//div[@role='dialog']";
		this.btnAgreeOnUserAgreementModal =
			"//div[@role='dialog']//button[normalize-space()='Agree']";
	}

	/**
	 * Configures the user agreement section in Authentication settings.
	 * It supports enable/disable, title update, and content update in one method.
	 *
	 * @param {object} options - User agreement configuration.
	 * @param {boolean} [options.enabled] - Whether user agreement should be enabled.
	 * @param {string} [options.title] - Agreement title to set.
	 * @param {string} [options.content] - Agreement content to set.
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await authenticationPage.configureUserAgreement({
	 *   enabled: true,
	 *   title: "Terms and Conditions",
	 *   content: "I agree to the workplace policy."
	 * });
	 */
	async configureUserAgreement({ enabled, title, content } = {}) {
		if (enabled !== undefined) {
			await PwActions.setToggleState(
				this.page,
				this.chkBoxEnableCustomMessage,
				enabled ? "on" : "off",
			);
		}

		if (title !== undefined) {
			await PwActions.waitAndFill(this.page, this.txtBoxAgreementTitle, title);
		}

		if (content !== undefined) {
			await PwActions.waitAndClick(this.page, this.editorAgreementContent);
			await PwActions.press(this.page, "Meta+A");
			await PwActions.press(this.page, "Backspace");
			await PwActions.fillWithoutDeletingExistingContent(
				this.page,
				this.editorAgreementContent,
				content,
			);
		}
		await PwActions.waitAndClick(this.page, this.btnUpdate);
		await PwActions.waitForNetworkIdle(this.page, 15000);
		await PwActions.pageRefresh(this.page);
	}

	/**
	 * Verifies user agreement summary text is visible on login page.
	 *
	 * @param {object} options - Verification options.
	 * @param {string} options.title - Expected agreement title in summary.
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await authenticationPage.verifyUserAgreementVisibleOnLoginPage({ title: "Terms" });
	 */
	async verifyUserAgreementVisibleOnLoginPage({ title }) {
		await PwActions.waitTillVisible(this.page, this.lblLoginAgreementSummary);
		const loginAgreementSummary = await PwActions.getText(
			this.page,
			this.lblLoginAgreementSummary,
		);
		await PwActions.verifyTextContains(loginAgreementSummary, title);
	}

	/**
	 * Opens user agreement modal from login page and verifies title and content.
	 *
	 * @param {object} options - Modal verification options.
	 * @param {string} options.title - Expected agreement title.
	 * @param {string} options.content - Expected agreement content.
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await authenticationPage.verifyUserAgreementModalContent({
	 *   title: "Terms",
	 *   content: "Agreement content"
	 * });
	 */
	async verifyUserAgreementModalContent({ title, content }) {
		await PwActions.waitAndClick(this.page, this.lblLoginAgreementTitle(title));
		await PwActions.waitTillVisible(this.page, this.dialogUserAgreement);
		await PwActions.verifyTextContains(
			await PwActions.getText(this.page, this.dialogUserAgreement),
			title,
		);
		await PwActions.verifyTextContains(
			await PwActions.getText(this.page, this.dialogUserAgreement),
			content,
		);
		await PwActions.waitAndClick(this.page, this.btnAgreeOnUserAgreementModal);
	}

	/**
	 * Verifies user agreement summary is not visible on login page.
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await authenticationPage.verifyUserAgreementNotVisibleOnLoginPage();
	 */
	async verifyUserAgreementNotVisibleOnLoginPage() {
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.lblLoginAgreementSummary,
		);
	}
}

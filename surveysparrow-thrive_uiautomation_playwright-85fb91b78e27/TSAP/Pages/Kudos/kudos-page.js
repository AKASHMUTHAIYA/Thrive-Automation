import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

class KudosPage {
	constructor(page) {
		this.page = page;

		// Locators for Kudos navigation and tabs
		this.lnkKudosTab = "//a[text()='Kudos']";
		this.lnkRewards = "//div[text()='Rewards']";
		this.lnkGettingStarted = "//div[text()='Getting Started']";

		// Locators for reward creation
		this.btnNewReward = "//span[text()='New Reward']";
		this.txtBoxRewardName = "//input[@name='name']";
		this.txtBoxRewardPoints = "//input[@name='points']";
		this.txtBoxRewardDescription = "//textarea[@name='description']";
		this.btnSave = "//span[text()='Save']";
		this.btnArchiveReward = "//p[text()='Archive Reward']";
		this.txtRewardCard = (name) => `//p[text()='${name}']`;
		this.txtRewardPoints = (name) =>
			`//p[text()='${name}']/parent::div/following-sibling::p`;
		this.btnDeleteReward = (name) =>
			`//p[text()='${name}']/parent::div/parent::div/parent::div//button`;

		// Locators for kudos granting flow
		this.lblExperienceKudos = "//*[text()='Experience Kudos']";
		this.txtKudosPointValue = "+1";
		this.btnGrant = "//span[text()='Grant']";
		this.popupSuccessMessage = "//h1[text()='Kudos granted Successfully!']";
		this.btnOkGotIt = "//span[text()='Ok, Got it!']";
		this.btnSampleFeedTab = "//button[@role='tab' and text()='Sample Feed']";
		this.txtRecipientNameInSuccess = (employeeName) =>
			`//span[contains(text(),'${employeeName}')]`;
		this.txtEmployeeNameInList = (name) => `//p[text()='${name}']`;
		this.txtKudosPostsMessage = (message) =>
			`//span[@data-twigs-mention="true"]/following-sibling::span[normalize-space()='${message}']`;
		this.txtBtnCustomCard =
			'//span[normalize-space(.)="New Reward"]/parent::button';
	}

	/**
	 * Navigates to the Kudos tab
	 * @returns {Promise<void>}
	 */
	async navigateToKudos() {
		await PwActions.click(this.page, this.lnkKudosTab);
	}

	/**
	 * Navigates to the Rewards section within Kudos
	 * @returns {Promise<void>}
	 */
	async navigateToRewards() {
		await PwActions.click(this.page, this.lnkRewards);
	}

	/**
	 * Navigates to the Getting Started section within Kudos
	 * @returns {Promise<void>}
	 */
	async navigateToGettingStarted() {
		await PwActions.click(this.page, this.lnkGettingStarted);
	}

	/**
	 * Clicks the New Reward button to initiate reward creation
	 * @returns {Promise<void>}
	 */
	async clickNewReward() {
		await PwActions.click(this.page, this.txtBtnCustomCard);
	}

	/**
	 * Creates a new reward with the specified details
	 * @param {string} name - The name of the reward
	 * @param {number} points - The point value of the reward
	 * @param {string} description - The description of the reward
	 * @returns {Promise<void>}
	 */
	async createReward(name, points, description) {
		await this.clickNewReward();
		await PwActions.fill(this.page, this.txtBoxRewardName, name);
		await PwActions.fill(this.page, this.txtBoxRewardPoints, points.toString());
		await PwActions.fill(this.page, this.txtBoxRewardDescription, description);
		await PwActions.click(this.page, this.btnSave);
	}

	/**
	 * Verifies that a reward was created with the expected name and points
	 * @param {string} name - The name of the reward to verify
	 * @param {number} points - The expected point value of the reward
	 * @returns {Promise<boolean>} - True if the reward exists with correct details
	 */
	async verifyRewardCreated(name, points) {
		// Wait for the reward card to appear
		await this.page.waitForSelector(this.txtRewardCard(name));
		await PwActions.waitTillVisible(this.page, this.txtRewardCard(name));

		// Verify reward name exists
		const rewardExists = await this.page.isVisible(this.txtRewardCard(name));
		expect(rewardExists).toBeTruthy();

		// Verify points
		await this.page.waitForSelector(this.txtRewardCard(name));
		await CommonUtils.sleep(1);
		const pointsText = await this.page.textContent(this.txtRewardPoints(name));
		expect(pointsText).toContain(String(`${points} pts`));
		return rewardExists;
	}

	/**
	 * Deletes/archives a reward by name
	 * @param {string} name - The name of the reward to delete
	 * @returns {Promise<void>}
	 */
	async deleteReward(name) {
		// Wait for the reward card to appear
		await this.page.waitForSelector(this.txtRewardCard(name));
		await PwActions.click(this.page, this.btnDeleteReward(name));
		await PwActions.click(this.page, this.btnArchiveReward);
	}

	/**
	 * Enter kudos points and mention symbol to start mentioning an employee
	 * @param {string} userName - Username to mention
	 * @param {string} points - Points to award
	 * @param {string} kudosMessage - Message to add after employee selection
	 * @returns {Promise<void>}
	 */
	async enterKudosPointsMentionAndMessage(userName, points, kudosMessage) {
		await PwActions.click(this.page, this.lblExperienceKudos);
		await PwActions.press(this.page, "Tab");
		await CommonUtils.sleep(2);
		const isMac = process.platform === "darwin";
		await this.page.keyboard.press(isMac ? "Meta+A" : "Control+A");
		await this.page.keyboard.press("Delete");
		await CommonUtils.sleep(2);
		await this.page.keyboard.type(` +${points} @${userName}`);
		await CommonUtils.sleep(2);
		await this.page.keyboard.press("Enter");
		await this.page.keyboard.type(` ${kudosMessage}`);
		await PwActions.click(this.page, this.btnGrant);
	}

	/**
	 * Verify successful kudos grant message appears
	 * @param {string} employeeName - Name of employee that should appear in success message
	 * @returns {Promise<void>}
	 */
	async verifyKudosGrantSuccess(employeeName) {
		await this.page.waitForSelector(this.popupSuccessMessage);
		const successMessageVisible = await this.page.isVisible(
			this.popupSuccessMessage,
		);
		expect(successMessageVisible).toBeTruthy();
		expect(
			this.page.isVisible(this.txtRecipientNameInSuccess(employeeName)),
		).toBeTruthy();
	}

	/**
	 * Click "Ok, Got it!" button to close success dialog
	 * @returns {Promise<void>}
	 */
	async closeSuccessDialog() {
		await PwActions.click(this.page, this.btnOkGotIt);
	}

	/**
	 * Verify kudos appears in sample feed
	 * @param {string} kudosMessage - Kudos message to verify
	 * @returns {Promise<void>}
	 */
	async verifyKudosInFeed(kudosMessage) {
		await this.page.waitForSelector(this.btnSampleFeedTab);
		await PwActions.click(this.page, this.btnSampleFeedTab);
		await PwActions.waitForElementVisibility(
			this.page,
			this.txtKudosPostsMessage(kudosMessage),
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.txtKudosPostsMessage(kudosMessage),
		);
	}
}

export { KudosPage };

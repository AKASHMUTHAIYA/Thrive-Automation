import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import logger from "playwright-framework/Core/logger.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions.js";

/**
 * IntegrationsPage - Page Object Model for Integrations page
 * Handles all integration-related actions (Slack, Google, Microsoft, etc.)
 */
export class IntegrationsPage {
	constructor(page) {
		this.page = page;
		this.commonfunctions = new CommonPageFunctions(page);
		this.btnYesImAdmin = `//button[@data-testid="button" and contains(., "Slack Admin")]`;
		this.chckboxImportAndSendInvites = `//label[text()="After import, send invites to join ThriveSparrow via ThriveSparrow Bot."]/preceding-sibling::button`;
		this.btnSaveSlackConfiguration = `//span[text()="Save configuration"]/parent::button`;
		this.dropdownOptionIntegration =
			'//button[@aria-label="integration"]/following-sibling::div/button';
		this.btnYesProceedWithDisconnect = '//span[text()="Yes, Proceed"]';
		this.btnToggleKudosOnSlack = `//button[@data-testid="integration-info_kudos_switch"]`;
		this.btnToggleImportEmployees =
			'//button[@data-testid="integration-info_import-employees-switch"]';
		this.toasterImportEmployees = '//div[text()="Auto Import updated"]';
		this.txtBoxChannelName = '//input[@id="channel name"]';
		this.btnSaveChannelNameAndProceed = '//span[text()="Save and Continue"]';
		this.radioButtonMembersOption = (option) => `//button[@value="${option}"]`;
		this.txtBoxLookUpForMembers =
			'//div[text()="Look up members"]/following-sibling::div/input';
		this.txtMemberAdded = (member) => `//p[text()="${member}"]`;
		this.btnSaveSettings = '//span[text()="Save Settings"]/parent::button';
		// Locators for integration cards and actions
		this.connectButtonInIntegrationList = (appName) =>
			`//a[contains(@href,"${appName.toLowerCase()}")]/parent::div/following-sibling::div/button[contains(., 'Connect') or contains(., 'connect')]`;
		const integrationAppHeading = (appName) => `//h1[text()="${appName}"]`;
		this.btnOpenIntegrationApp = integrationAppHeading;
		this.integrationCard = integrationAppHeading;

		this.btnConnect = '//span[text()="Connect"]/parent::button';

		this.connectedIndicator = (appName) =>
			`//a[contains(@href,"${appName.toLowerCase()}")]/parent::div/following-sibling::div//span[contains(text(),'Connected')]`;

		// Slack-specific locators (for OAuth flow)
		this.slackWorkspaceName = "//div[contains(@class,'workspace')]//span";

		this.dropdownBtnDisconnect = `//div[@role='menuitem']//p[text()='Disconnect']`;
	}

	/**
	 * Connect an integration by triggering OAuth flow
	 * @param {string} appName - Name of the app to connect (e.g., "Slack", "Google")
	 * @returns {Promise<void>}
	 */
	async connectIntegration({ appName, page = this.page } = {}) {
		logger.info(`Connecting ${appName} integration`);

		const currentUrl = await page.url();
		logger.info(`Current URL before OAuth: ${currentUrl}`);
		const navigationPromise = page
			.waitForURL(new RegExp(`${appName.toLowerCase()}\\.com`, "i"), {
				timeout: 30000,
			})
			.catch((err) => {
				logger.warn(`Did not detect redirect to ${appName}: ${err.message}`);
				return null;
			});
		const btnOpenIntegrationApp = this.btnOpenIntegrationApp(appName);
		await PwActions.waitForElement(page, btnOpenIntegrationApp, 10000);
		await PwActions.click(page, btnOpenIntegrationApp);
		await PwActions.click(page, this.btnConnect);
		await PwActions.click(page, this.btnYesImAdmin);
		logger.info(`${appName} connect button clicked - OAuth flow triggered`);
		await navigationPromise;
		const oauthUrl = await page.url();
		logger.info(`OAuth redirect completed. Current URL: ${oauthUrl}`);
	}

	/**
	 * Disconnect an integration
	 * @param {string} appName - Name of the app to disconnect
	 * @returns {Promise<void>}
	 */
	async disconnectIntegration({ appName, page = this.page } = {}) {
		logger.info(`Disconnecting ${appName} integration`);
		const btnOpenIntegrationApp = this.btnOpenIntegrationApp(appName);
		await PwActions.waitForElement(page, btnOpenIntegrationApp, 10000);
		await PwActions.click(page, btnOpenIntegrationApp);
		await PwActions.click(page, this.dropdownOptionIntegration);
		await PwActions.click(page, this.dropdownBtnDisconnect);
		await PwActions.click(page, this.btnYesProceedWithDisconnect);
		logger.info(`${appName} integration disconnected`);
	}

	/**
	 * Verify integration is connected
	 * @param {string} appName - Name of the app
	 * @param {number} timeout - Timeout in milliseconds
	 * @returns {Promise<void>}
	 * @throws {Error} If integration is not connected within timeout
	 */
	async verifyIntegrationConnected(appName, timeout = 30000) {
		logger.info(`Verifying ${appName} is connected`);
		const connectedIndicator = this.connectedIndicator(appName);
		await PwActions.waitForElement(this.page, connectedIndicator, timeout);
		const isConnected = await PwActions.elementIsVisible(
			this.page,
			connectedIndicator,
			2000,
		);
		if (!isConnected) {
			throw new Error(`${appName} integration is not showing as connected`);
		}
		logger.info(`${appName} integration verified as connected`);
	}

	/**
	 * Verify integration is disconnected
	 * @param {string} appName - Name of the app
	 * @param {number} timeout - Timeout in milliseconds
	 * @returns {Promise<void>}
	 * @throws {Error} If integration is still connected
	 */
	async verifyIntegrationDisconnected(appName, timeout = 30000) {
		logger.info(`Verifying ${appName} is disconnected`);

		const connectBtn = this.connectButtonInIntegrationList(appName);
		await PwActions.waitForElement(this.page, connectBtn, timeout);

		logger.info(`${appName} integration verified as disconnected`);
	}

	/**
	 * Check if integration card is visible
	 * @param {string} appName - Name of the app
	 * @returns {Promise<boolean>} True if card is visible
	 */
	async isIntegrationCardVisible(appName) {
		try {
			const card = this.integrationCard(appName);
			return await PwActions.elementIsVisible(this.page, card, 3000);
		} catch (err) {
			return false;
		}
	}

	/**
	 * Get Slack workspace name (after connection)
	 * @returns {Promise<string>} Workspace name
	 */
	async getSlackWorkspaceName() {
		try {
			const workspaceName = await PwActions.getText(
				this.page,
				this.slackWorkspaceName,
			);
			logger.info(`Slack workspace name: ${workspaceName}`);
			return workspaceName;
		} catch (err) {
			logger.warn(`Could not get Slack workspace name: ${err.message}`);
			return "";
		}
	}

	/**
	 * Complete the Slack configuration
	 * @param {Object} options - Configuration options
	 * @param {boolean} [options.importAndSendInvites=false] - True to import and send invites
	 * @returns {Promise<void>}
	 * @example
	 * await integrationsPage.completeSlackConfiguration({ importAndSendInvites: true });
	 * await integrationsPage.completeSlackConfiguration({ page, importAndSendInvites: true });
	 */
	async completeSlackConfiguration({ page = this.page, options = {} } = {}) {
		const { timeout = 10000 } = options;
		await CommonUtils.sleep(5);
		if (options.importAndSendInvites) {
			await PwActions.click(page, this.chckboxImportAndSendInvites);
		}
		await PwActions.waitForElement(page, this.btnSaveSlackConfiguration, 10000);
		await PwActions.click(page, this.btnSaveSlackConfiguration);
	}

	/**
	 * Set the state of Kudos for Slack.
	 * Skips configuration if already in desired state.
	 * @param {boolean} [state=true] - True to enable, false to disable
	 * @param {Object} [settings={}] - Configuration when enabling. Required for channel and members setup.
	 * @param {string} [settings.channelName] - Slack channel name
	 * @param {string} [settings.membersOption] - "All Members" or "Selected Members"
	 * @param {string[]} [settings.members] - Member names when membersOption is "Selected Members"
	 * @returns {Promise<void>}
	 * @example
	 * await integrationsPage.setKudosStateForSlack(false);
	 * @example
	 * await integrationsPage.setKudosStateForSlack(true, {
	 *   channelName: "general",
	 *   membersOption: "All Members"
	 * });
	 * @example
	 * await integrationsPage.setKudosStateForSlack(true, {
	 *   channelName: "kudos",
	 *   membersOption: "Selected Members",
	 *   members: ["John Doe", "Jane Smith"]
	 * });
	 */
	async setKudosStateForSlack(
		state = true,
		settings = { channelName: null, membersOption: null, members: null },
	) {
		await CommonUtils.sleep(5);
		const currentState = await PwActions.getAttributeValue(
			this.page,
			this.btnToggleKudosOnSlack,
			"data-state",
		);
		const isEnabled = currentState === "checked";
		if (isEnabled === state) {
			logger.info(
				`Kudos is already ${state ? "enabled" : "disabled"} for Slack`,
			);
			return;
		}
		if (state && settings.channelName && settings.membersOption) {
			await PwActions.fill(
				this.page,
				this.txtBoxChannelName,
				settings.channelName,
			);
			await PwActions.click(
				this.page,
				this.radioButtonMembersOption(settings.membersOption),
			);
			await PwActions.click(this.page, this.btnSaveChannelNameAndProceed);
			if (
				settings.membersOption === "Selected Members" &&
				Array.isArray(settings.members)
			) {
				for (const member of settings.members) {
					await PwActions.fill(this.page, this.txtBoxLookUpForMembers, member);
					await PwActions.waitForElement(
						this.page,
						this.txtMemberAdded(member),
						10000,
					);
					await PwActions.click(this.page, this.txtMemberAdded(member));
				}
			}
			await PwActions.click(this.page, this.btnSaveSettings);
		}
		await PwActions.click(this.page, this.btnToggleKudosOnSlack);
	}

	/**
	 * Set the state of Employee Import for Slack
	 * @param {boolean} state - True to enable, false to disable
	 * @returns {Promise<void>}
	 * @example
	 * await integrationsPage.setEmployeeImportState({ page, state: true });
	 * // This will enable Employee Import
	 * await integrationsPage.setEmployeeImportState({ page, state: false });
	 * // This will disable Employee Import
	 */
	async setEmployeeImportState({ state = true, page = this.page } = {}) {
		await CommonUtils.sleep(5);
		const currentState = await PwActions.getAttributeValue(
			page,
			this.btnToggleImportEmployees,
			"data-state",
		);
		const isEnabled = currentState === "checked";
		if (isEnabled === state) {
			logger.info(
				`Employee import is already ${state ? "enabled" : "disabled"} for Slack`,
			);
			return;
		}
		await PwActions.click(page, this.btnToggleImportEmployees);
		await PwActions.waitForElement(page, this.toasterImportEmployees, 10000);
	}
}

export default IntegrationsPage;

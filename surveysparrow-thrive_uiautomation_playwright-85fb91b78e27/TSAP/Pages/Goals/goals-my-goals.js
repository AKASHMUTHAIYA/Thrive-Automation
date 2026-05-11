import PwActions from "playwright-framework/Core/pw-actions.js";
import { envDetails } from "../../Data/test-data";
import { jira_credentials } from "../../Data/Resources/jira-credentials";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
import { APIActions } from "playwright-framework/Core/API_Actions/api-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { expect } from "@playwright/test";
class GoalsMyGoalsPage {
	constructor(page) {
		this.page = page;
		this.commonfunctions = new CommonPageFunctions(page);
		this.apiActions = new APIActions();
		this.btnArchivedGoals = `//div[@data-testid="header_dropdown-menu-item"]//p[normalize-space()="Archived Goals"]`;
		this.btnBulkUnarchive = `//button[@data-testid="selection-toaster_button_archive"]`;
		this.getOkrInList = (okrName) => `//p[text()="${okrName}"]`;
		this.getBtnCheckBoxForOkr = (okrName) =>
			`//p[text()="${okrName}"]/ancestor::td//button`;
		this.drpDownSelectCycleInUnarchiveModal = `(//div[@data-testid="popover-dropdown_dropdown-menu-trigger"])[1]`;
		this.calendarDateInUnarchiveModal = `(//div[@data-testid="popover-dropdown_dropdown-menu-trigger"])[2]`;
		this.getDropdownMenuItem = (itemName) =>
			`//div[@data-testid="goal-cycle-dropdown-menu_dropdown-menu-item"]/p[text()='${itemName}']`;
		this.btnYesProceed = `//span[text()="Yes, Proceed"]/parent::button`;
		this.btnNextInCalendar = `//button[@aria-label="Next"]`;
		this.btnCalendarDate = (randomNumber) =>
			`//button[text()='${randomNumber}' and not(@aria-disabled) ]`;
		this.btnSelectOnCalendar = `//span[text()="Select"]/ancestor::button`;
		this.breadCrumbMyGoals = `//h1[@data-testid="draft-or-archived_heading_goals-view-all-published-button"]`;
		this.toasterUnarchived = (count) =>
			`//div[text()="${count} item unarchived successfully"]`;
		this.btnMoreOption = `//button[@data-testid="header_icon-button_vertical-ellipsis"]`;
		this.btnConfigurations = `//div[@data-testid="header_dropdown-menu-item"]//p[normalize-space()="Configurations"]`;
		this.btnNewDataSource = `//button[@data-testid="data-sources_button_add-data-source"]`;
		this.btnJiraConnection = `//div[@data-testid="new-connection-items_flex_jira"]`;
		this.btnNewConnector = `//button[@data-testid="new-connection-items_button_new-connector"]`;
		this.txtConnectionName = `//input[@data-testid="auth-details_form-input_connection-name"]`;
		this.txtServer = `//input[@data-testid="auth-details_form-input_server"]`;
		this.txtEmail = `//input[@data-testid="auth-details_form-input_email"]`;
		this.txtToken = `//input[@data-testid="auth-details_form-input_token"]`;
		this.toggleSourceAvailableToAll = `//button[@data-testid="auth-details_switch_public-source"]`;
		this.btnSaveJiraConnection = `//button[@data-testid="auth-details_button_next-auth"]`;
		this.txtSearchConnections = `//input[@data-testid="data-sources_input_search"]`;
		this.btnSourceAvailableToAll = `//button[@data-testid="source-available-to-all"]`;
		this.getMoreOptions = (connectionName) =>
			`//p[normalize-space()="${connectionName}"]/parent::div/following-sibling::div/button`;
		this.btnDeleteJiraConnection = `//div[@data-testid="data-sources_dropdown-menu-item_delete"]`;
		this.btnEditJiraConnection = `//div[@data-testid="data-sources_dropdown-menu-item_edit"]`;
		this.btnDeleteDataSource = `//button[@data-testid="comman-confirmation-modal_button_confirm"]`;
		this.breadCrumbMyGoalsFromConfigurations = `//h1[@data-testid="dashboard-configuration_heading_goals-view-all-published-button"]`;
		this.txtBoxConnectionName = `//input[@data-testid="api-setup_form-input_connection-name"]`;
		this.txtBoxURL = `//input[@data-testid="api-setup_form-input_url"]`;
		this.txtBoxHeaderKey = (headerIndex = 1) =>
			`(//input[@data-testid="api-setup_form-input_header-type"])[${headerIndex}]`;
		this.txtBoxHeaderValue = (headerIndex = 1) =>
			`//input[@data-testid="header-value-input-${headerIndex}"]`;
		this.txtBoxBody = `//textarea[@data-testid="api-setup_textarea_body"]`;
		this.dropdownHttpMethod = `//p[text()="HTTP Type"]/following-sibling::div`;
		this.btnTestConnection = `//button[@data-testid="api-setup_button_test-configuration"]`;
		this.txtBoxApiResponse = `//div[@id="test-response-json"]/div/div[2]`;
		this.btnSaveConnector = `//button[@data-testid="api-setup_button_next-api-setup"]`;
		this.toasterConnectorSuccess = `//div[text()="Custom connection created successfully"] | //div[text()="Custom connection updated successfully"]`;
		this.btnAddNewHeaderRow = `//button[@data-testid="api-setup_button_add-headers"]`;
	}

	/**
	 * Navigates to the archived goals.
	 *
	 * @example
	 * // Navigating to the archived goals
	 * await goalsMyGoalsPage.navigateToArchivedGoals();
	 */
	async navigateToArchivedGoals() {
		await PwActions.click(this.page, this.btnMoreOption);
		await PwActions.click(this.page, this.btnArchivedGoals);
	}

	/**
	 * Navigates back from the archived goals.
	 *
	 * @example
	 * // Navigating back from the archived goals
	 * await goalsMyGoalsPage.navigateBackFromArchivedGoals();
	 */
	async navigateBackFromArchivedGoals() {
		await PwActions.click(this.page, this.breadCrumbMyGoals);
	}
	async navigateBackFromConfigurations() {
		await PwActions.click(this.page, this.breadCrumbMyGoalsFromConfigurations);
	}

	/**
	 * Unarchives the given OKRs in bulk.
	 *
	 * @param {Array<string>} okrs - The OKRs to unarchive.
	 * @example
	 * // Unarchiving a single OKR
	 * await goalsMyGoalsPage.bulkUnarchiveOkrs("My New Goal");
	 * @example
	 * // Unarchiving multiple OKRs
	 * await goalsMyGoalsPage.bulkUnarchiveOkrs(["My New Goal", "My New Goal 2"]);
	 */
	async bulkUnarchiveOkrs(okrs) {
		if (!Array.isArray(okrs)) {
			okrs = [okrs];
		}
		await PwActions.scroll(this.page, this.getOkrInList(okrs[0]));
		await PwActions.hover(this.page, this.getOkrInList(okrs[0]));
		await PwActions.click(this.page, this.getBtnCheckBoxForOkr(okrs[0]));
		for (const okr of okrs.slice(1)) {
			await PwActions.scroll(this.page, this.getOkrInList(okr));
			await PwActions.click(this.page, this.getBtnCheckBoxForOkr(okr));
		}
		await PwActions.click(this.page, this.btnBulkUnarchive);
		await PwActions.click(this.page, this.drpDownSelectCycleInUnarchiveModal);
		await this.commonfunctions.getMenuItem(this.page, envDetails.goalCycle);
		await PwActions.jsClick(this.page, this.calendarDateInUnarchiveModal);
		const randomClicks = Math.ceil(Math.random() * 3);
		await Promise.all(
			Array.from({ length: randomClicks }).map(() =>
				PwActions.click(this.page, this.btnNextInCalendar),
			),
		);
		const randomNumber = Math.ceil(Math.random() * 28);
		await PwActions.click(this.page, this.btnCalendarDate(randomNumber));
		await PwActions.click(this.page, this.btnSelectOnCalendar);
		await PwActions.click(this.page, this.btnYesProceed);
		await PwActions.waitForElementVisibility(
			this.page,
			this.toasterUnarchived(okrs.length),
		);
	}
	/**
	 * Navigates to the Configurations section in the Goals module.
	 * Clicks on the More Options button and then selects Configurations.
	 *
	 * @example
	 * // Navigate to configurations page
	 * await goalsMyGoalsPage.navigateToConfigurations();
	 */
	async navigateToConfigurations() {
		await PwActions.click(this.page, this.btnMoreOption);
		await PwActions.click(this.page, this.btnConfigurations);
	}

	/**
	 * Creates a new Jira connection with the specified connection name.
	 * Fills in all required Jira connection details including server URL, email, and token.
	 *
	 * @param {string} connectionName - The name for the new Jira connection
	 *
	 * @example
	 * // Create a new Jira connection named "My Jira Integration"
	 * await goalsMyGoalsPage.createJiraConnection("My Jira Integration");
	 */
	async createJiraConnection(connectionName) {
		await PwActions.click(this.page, this.btnNewDataSource);
		await PwActions.click(this.page, this.btnJiraConnection);
		await PwActions.fill(this.page, this.txtConnectionName, connectionName);
		await PwActions.fill(this.page, this.txtServer, jira_credentials.JIRA_URL);
		await PwActions.fill(this.page, this.txtEmail, jira_credentials.JIRA_EMAIL);
		await PwActions.fill(this.page, this.txtToken, jira_credentials.JIRA_TOKEN);
		await PwActions.click(this.page, this.btnSaveJiraConnection);
	}

	/**
	 * Fills the custom connector form, runs Test Connection, and asserts the JSON shown in the UI
	 * matches the same request replayed via `APIActions` (GET or POST). Then saves and waits for success.
	 * Call from `createCustomConnector` / `editCustomConnector` after the add-or-edit dialog is open.
	 *
	 * @param {object} options
	 * @param {string} options.httpMethod - `GET` or `POST` (other methods throw)
	 * @param {string} options.connectionName - Connector display name
	 * @param {string} options.url - Request URL used for test and replay
	 * @param {Array<{ key: string, value: string }>} [options.headers=[]] - Header rows added before Test Connection
	 * @param {string} [options.body] - JSON string body; required for POST (parsed with `JSON.parse` for replay)
	 * @returns {Promise<void>}
	 * @throws {Error} When the UI response is not valid JSON, the HTTP method is unsupported, or the replay request fails
	 *
	 * @example
	 * await goalsMyGoalsPage.fillAndVerifyConnector({
	 *   httpMethod: "GET",
	 *   connectionName: "Metrics API",
	 *   url: `${envDetails.uri}/api/internal/health`,
	 *   headers: [{ key: "Accept", value: "application/json" }],
	 * });
	 */
	async fillAndVerifyConnector({
		httpMethod,
		connectionName,
		url,
		headers = [],
		body,
	}) {
		await PwActions.fill(this.page, this.txtBoxConnectionName, connectionName);
		await PwActions.fill(this.page, this.txtBoxURL, url);
		await PwActions.click(this.page, this.dropdownHttpMethod);
		await this.commonfunctions.getMenuItem(this.page, httpMethod);

		if (body) {
			await PwActions.fill(this.page, this.txtBoxBody, body);
		}

		for (let index = 0; index < headers.length; index++) {
			const header = headers[index];
			await PwActions.clearAndFill(
				this.page,
				this.txtBoxHeaderKey(index + 1),
				header.key,
			);
			await PwActions.clearAndFill(
				this.page,
				this.txtBoxHeaderValue(index),
				header.value,
			);
			await PwActions.click(this.page, this.btnAddNewHeaderRow);
		}

		await PwActions.click(this.page, this.btnTestConnection);
		await PwActions.waitForElementVisibility(this.page, this.txtBoxApiResponse);

		const apiResponse = await PwActions.getText(
			this.page,
			this.txtBoxApiResponse,
		);
		let uiResponse;
		try {
			uiResponse = JSON.parse(apiResponse);
		} catch (error) {
			throw new Error(
				`Failed to parse API response as JSON: ${error.message}. Response: ${apiResponse}`,
			);
		}

		const httpMethodUpper = httpMethod.toUpperCase();
		const cookieValue = await this.page.context().cookies();
		let apiResponseData;
		try {
			if (httpMethodUpper === "GET") {
				apiResponseData = await this.apiActions.getRequest({
					url,
					cookieValue,
					headers,
				});
			} else if (httpMethodUpper === "POST") {
				apiResponseData = await this.apiActions.postRequest({
					url,
					cookieValue,
					data: JSON.parse(body),
					headers,
				});
			} else {
				throw new Error(`Unsupported HTTP method: ${httpMethod}`);
			}
		} catch (error) {
			throw new Error(
				`API request failed: ${error.message || JSON.stringify(error)}`,
			);
		}

		expect(uiResponse).toEqual(apiResponseData);

		await PwActions.click(this.page, this.btnSaveConnector);
		await PwActions.waitForElementVisibility(
			this.page,
			this.toasterConnectorSuccess,
		);
	}

	/**
	 * Opens Goals Configurations, starts New data source → New connector, then fills and saves the connector
	 * after UI vs API response verification (`fillAndVerifyConnector`).
	 *
	 * @param {object} options
	 * @param {string} options.httpMethod - `GET` or `POST`
	 * @param {string} options.connectionName - New connector name
	 * @param {string} options.url - Request URL
	 * @param {Array<{ key: string, value: string }>} [options.headers=[]] - Optional header rows
	 * @param {string} [options.body] - JSON string for POST body
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await goalsMyGoalsPage.createCustomConnector({
	 *   httpMethod: "GET",
	 *   connectionName: "My Connector",
	 *   url: "https://api.example.com/v1/status",
	 *   headers: [{ key: "Authorization", value: "Bearer token" }],
	 * });
	 */
	async createCustomConnector({
		httpMethod,
		connectionName,
		url,
		headers = [],
		body,
	}) {
		await this.navigateToConfigurations();
		await PwActions.waitForElement(this.page, this.btnNewDataSource);
		await PwActions.click(this.page, this.btnNewDataSource);
		await PwActions.click(this.page, this.btnNewConnector);

		await this.fillAndVerifyConnector({
			httpMethod,
			connectionName,
			url,
			headers,
			body,
		});
	}

	/**
	 * Opens Goals Configurations, searches for an existing connector by name, opens Edit from the row menu,
	 * then applies new method/URL/headers/body and saves after `fillAndVerifyConnector`.
	 *
	 * @param {object} options
	 * @param {string} options.connectionName - Existing connector name to find in the list (uses `searchJiraConnection`)
	 * @param {string} options.httpMethod - `GET` or `POST`
	 * @param {string} options.url - Request URL
	 * @param {Array<{ key: string, value: string }>} [options.headers=[]] - Optional header rows
	 * @param {string} [options.body] - JSON string for POST body
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await goalsMyGoalsPage.editCustomConnector({
	 *   connectionName: "My Connector",
	 *   httpMethod: "POST",
	 *   url: "https://api.example.com/v1/items",
	 *   headers: [{ key: "Content-Type", value: "application/json" }],
	 *   body: JSON.stringify({ name: "John Doe" }),
	 * });
	 */
	async editCustomConnector({
		connectionName,
		httpMethod,
		url,
		headers = [],
		body,
	}) {
		await this.navigateToConfigurations();
		await PwActions.waitForElement(this.page, this.btnNewDataSource);
		await this.searchJiraConnection(connectionName);
		await PwActions.waitForElementVisibility(
			this.page,
			this.getMoreOptions(connectionName),
		);
		await PwActions.click(this.page, this.getMoreOptions(connectionName));
		await PwActions.click(this.page, this.btnEditJiraConnection);

		await this.fillAndVerifyConnector({
			httpMethod,
			connectionName,
			url,
			headers,
			body,
		});
	}
	/**
	 * Searches for a specific Jira connection by name in the connections list.
	 * Fills the search field with the provided connection name to filter results.
	 *
	 * @param {string} connectionName - The name of the Jira connection to search for
	 *
	 * @example
	 * // Search for a Jira connection named "Production Jira"
	 * await goalsMyGoalsPage.searchJiraConnection("Production Jira");
	 */
	async searchJiraConnection(connectionName) {
		await PwActions.fill(this.page, this.txtSearchConnections, connectionName);
	}

	/**
	 * Deletes a specific Jira connection by name.
	 * Waits for the connection to be visible, clicks on more options, and confirms deletion.
	 *
	 * @param {string} connectionName - The name of the Jira connection to delete
	 *
	 * @example
	 * // Delete a Jira connection named "Test Connection"
	 * await goalsMyGoalsPage.deleteJiraConnection("Test Connection");
	 */
	async deleteJiraConnection(connectionName) {
		await PwActions.waitForElementVisibility(
			this.page,
			this.getMoreOptions(connectionName),
		);
		await PwActions.click(this.page, this.getMoreOptions(connectionName));
		await PwActions.click(this.page, this.btnDeleteJiraConnection);
		await PwActions.click(this.page, this.btnDeleteDataSource);
	}
}

export default GoalsMyGoalsPage;

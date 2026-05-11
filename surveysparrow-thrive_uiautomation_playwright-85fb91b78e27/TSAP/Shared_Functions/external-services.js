import fs from "fs";
import { jira_credentials } from "../Data/Resources/jira-credentials.js";
import { APIActions } from "playwright-framework/Core/API_Actions/api-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import logger from "playwright-framework/Core/logger.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

class ExternalServices {
	constructor(page) {
		this.page = page;
		this.apiActions = new APIActions();
	}

	async getJiraIssueCountForJQuery(jqlQuery) {
		if (
			!jira_credentials.JIRA_URL ||
			!jira_credentials.JIRA_EMAIL ||
			!jira_credentials.JIRA_TOKEN
		) {
			throw new Error(
				"Jira credentials not configured. Please save your credentials in settings.",
			);
		}

		const cleanUrl = this.cleanUrl(jira_credentials.JIRA_URL);
		const baseUrl = `${cleanUrl}/rest/api/3/search/jql`;

		let allIssues = [];
		let startAt = 0;
		let pageCount = 0;
		const maxResults = 50;
		const maxPages = 100;
		let result;

		do {
			pageCount++;
			const requestBody = {
				jql: jqlQuery || "order by created DESC",
				nextPageToken: result?.nextPageToken || null,
			};

			try {
				result = await this.apiActions.postRequest({
					url: baseUrl,
					data: requestBody,
					headers: {
						Authorization: this.getAuthHeader(),
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				});
			} catch (err) {
				let errorMessage = `Jira API error: ${err.message}`;
				throw new Error(errorMessage);
			}
			if (result.issues && result.issues.length > 0) {
				allIssues = allIssues.concat(result.issues);
			}

			startAt += maxResults;

			if (pageCount >= maxPages || startAt >= result.total) {
				break;
			}
		} while (result.nextPageToken);

		return allIssues.length;
	}

	/**
	 * Cleans and normalizes the Jira URL
	 * @param {string} url - The Jira URL to clean
	 * @returns {string} Cleaned URL without trailing slash
	 */
	cleanUrl(url) {
		if (!url) return "";
		return url.replace(/\/+$/, "");
	}

	/**
	 * Gets the authorization header for API requests
	 * @returns {string} Base64 encoded authorization header
	 */
	getAuthHeader() {
		const auth = Buffer.from(
			`${jira_credentials.JIRA_EMAIL}:${jira_credentials.JIRA_TOKEN}`,
		).toString("base64");
		return `Basic ${auth}`;
	}

	/**
	 * Get the total number of employees in the Slack organization
	 * @returns {Promise<number>} The total number of employees in the Slack organization
	 * @example
	 * const totalEmployees = await externalServices.getTotalEmployeesCountInSlackOrganization();
	 * console.log(totalEmployees);
	 */
	async getTotalEmployeesCountInSlackOrganization() {
		const apiActions = new APIActions();
		const maxRetries = 3;
		const retryDelaySeconds = 60; // Slack rate limit window

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				const response = await apiActions.getRequest({
					url: "https://slack.com/api/users.list",
					headers: {
						Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
					},
				});
				const members = response.members ?? [];
				const filteredOuBotUsers = members.filter(
					(member) =>
						member.is_bot !== true &&
						member.id !== "USLACKBOT" &&
						member.name !== "ou-bot",
				);
				return filteredOuBotUsers.length;
			} catch (err) {
				const isRateLimited = err.message?.includes("429");
				if (isRateLimited && attempt < maxRetries) {
					await CommonUtils.sleep(retryDelaySeconds);
					continue;
				}
				throw err;
			}
		}
	}
}

/**
 * SessionValidator - Utility for validating OAuth session files
 * Used to verify saved authentication sessions before running tests
 */
export class SessionValidator {
	/**
	 * Validate a session file exists and has correct structure
	 * @param {string} sessionFilePath - Path to the 	session file
	 * @returns {Object} Validation result object
	 */
	static validateSession(sessionFilePath) {
		const result = {
			valid: false,
			exists: false,
			cookieCount: 0,
			expiredCookieCount: 0,
			hasExpiredCookies: false,
			domains: [],
			fileAgeInDays: 0,
			lastModified: null,
			errors: [],
			warnings: [],
			/** @type {Array<Record<string, unknown>>} */
			cookies: [],
		};

		try {
			if (!fs.existsSync(sessionFilePath)) {
				result.errors.push(`Session file not found: ${sessionFilePath}`);
				return result;
			}

			result.exists = true;

			const raw = JSON.parse(fs.readFileSync(sessionFilePath, "utf-8"));
			const cookies = Array.isArray(raw.cookies) ? raw.cookies : [];
			result.cookies = cookies;

			if (!Array.isArray(raw.cookies)) {
				result.errors.push("Missing cookies array");
				return result;
			}

			result.cookieCount = cookies.length;

			if (!cookies.length) {
				result.errors.push("No cookies found");
			}

			const now = Date.now() / 1000;
			const domains = new Set();
			let expired = 0;

			for (const { domain, expires } of cookies) {
				if (domain) domains.add(domain);
				if (expires && expires !== -1 && expires < now) expired++;
			}

			result.domains = [...domains];
			result.expiredCookieCount = expired;
			result.hasExpiredCookies = expired > 0;

			if (expired) result.warnings.push(`${expired} expired cookies`);

			const stats = fs.statSync(sessionFilePath);
			const ageDays = (Date.now() - stats.mtime) / 86400000;

			result.fileAgeInDays = Math.round(ageDays * 10) / 10;
			result.lastModified = stats.mtime;

			if (ageDays > 30)
				result.warnings.push(`Session is ${Math.floor(ageDays)} days old`);

			result.valid = result.errors.length === 0;

			return result;
		} catch (err) {
			result.errors.push(err.message);
			return result;
		}
	}

	/**
	 * Print validation result in a readable format
	 * @param {Object} validationResult - Validation result object
	 */
	static printValidationResult(validationResult) {
		const {
			valid,
			exists,
			cookieCount,
			domains = [],
			errors = [],
			warnings = [],
			fileAgeInDays,
			lastModified,
		} = validationResult;

		logger.info("\n" + "=".repeat(60));
		logger.info("Session Validation Report");
		logger.info("=".repeat(60));

		if (valid) {
			logger.info(`Status: ✓ VALID`);
		} else {
			logger.error(`Status: ✗ INVALID`);
		}
		logger.info(`File Exists: ${exists ? "Yes" : "No"}`);

		if (exists) {
			logger.info(`Cookies: ${cookieCount}`);
			logger.info(`Domains: ${domains.join(", ") || "None"}`);
			logger.info(`File Age: ${fileAgeInDays} days`);
			logger.info(`Last Modified: ${lastModified?.toISOString() || "Unknown"}`);
		}

		if (errors.length) {
			logger.error("\nErrors:");
			errors.forEach((e) => logger.error(`  ✗ ${e}`));
		}

		if (warnings.length) {
			logger.warn("\nWarnings:");
			warnings.forEach((w) => logger.warn(`  ⚠ ${w}`));
		}

		logger.info("=".repeat(60) + "\n");
	}
}

/**
 * OAuthHandler - Utility class for handling OAuth redirect flows
 * Handles Slack OAuth authorization with saved session cookies
 */
export class OAuthHandler {
	static SLACK_DOMAIN_INPUT_SELECTORS = [
		'//input[@data-qa="signin_domain_input"]',
		'//input[@id="domain"]',
	];

	static SLACK_LOGIN_INPUT_SELECTORS = [
		'//input[@data-qa="email_field"]',
		'//input[@type="email"]',
		'//input[@id="email"]',
		'//input[@name="email"]',
	];

	static SLACK_ALLOW_BUTTON_SELECTORS = [
		'//button[@data-qa="allow_button"]',
		'//button[@data-qa="oauth_submit_button"]',
		'//button[contains(text(), "Allow") or contains(text(), "Authorize")]',
		'//button[@type="submit" and contains(@class, "oauth")]',
		'//input[@type="submit" and contains(@value, "Allow")]',
	];

	static CALLBACK_URL_PATTERN = /integrations|account|thrive/i;

	/** Fixed wait (ms) for each Slack OAuth step in {@link completeSlackOAuth}. */
	static SLACK_OAUTH_STEP_MS = 7000;

	constructor(options = {}) {
		this.timeout = options.timeout || 60000;
	}

	/**
	 * @param {import('@playwright/test').Page} page
	 * @param {string} screenshotPath
	 */
	async captureSlackOAuthScreenshot(page, screenshotPath) {
		await page.screenshot({ path: screenshotPath, fullPage: true });
	}

	/**
	 * @param {import('@playwright/test').Page} page
	 */
	async throwIfSlackWorkspaceOrLoginChallengeVisible(page) {
		for (const selector of OAuthHandler.SLACK_DOMAIN_INPUT_SELECTORS) {
			if (await PwActions.elementIsVisible(page, selector, 800)) {
				logger.error("Workspace domain input detected - session is incomplete");
				await this.captureSlackOAuthScreenshot(page, "slack-oauth-error.png");
				throw new Error(
					"Slack session appears incomplete - workspace domain required. Please re-run bootstrap script (test.spec.js).",
				);
			}
		}
		for (const selector of OAuthHandler.SLACK_LOGIN_INPUT_SELECTORS) {
			if (await PwActions.elementIsVisible(page, selector, 800)) {
				logger.error("Email/login input detected - session is incomplete");
				await this.captureSlackOAuthScreenshot(page, "slack-oauth-error.png");
				throw new Error(
					"Slack session appears incomplete - email/password required. Please re-run bootstrap script (test.spec.js).",
				);
			}
		}
	}

	/**
	 * @param {import('@playwright/test').Page} page
	 * @param {number} perSelectorTimeoutMs
	 * @returns {Promise<string|null>}
	 */
	async findVisibleAllowSelector(page, perSelectorTimeoutMs) {
		for (const selector of OAuthHandler.SLACK_ALLOW_BUTTON_SELECTORS) {
			if (
				await PwActions.elementIsVisible(page, selector, perSelectorTimeoutMs)
			) {
				return selector;
			}
		}
		return null;
	}

	/**
	 * Poll until callback, Allow control appears, or deadline (Slack OAuth shell settling).
	 * @param {import('@playwright/test').Page} page
	 * @param {number} maxWaitMs
	 * @param {number} stepMs
	 * @returns {Promise<{ kind: 'callback' } | { kind: 'allow'; selector: string } | { kind: 'pending' }>}
	 */
	async pollSlackOAuthUntilInteractive(page, maxWaitMs, stepMs) {
		const deadline = Date.now() + maxWaitMs;
		while (Date.now() < deadline) {
			const url = await page.url();
			if (this.isCallbackUrl(url)) {
				return { kind: "callback" };
			}
			await this.throwIfSlackWorkspaceOrLoginChallengeVisible(page);
			const selector = await this.findVisibleAllowSelector(page, 250);
			if (selector) {
				return { kind: "allow", selector };
			}
			await CommonUtils.sleep(stepMs / 1000);
		}
		return { kind: "pending" };
	}

	/**
	 * Complete Slack OAuth authorization flow.
	 * Step timeouts use {@link OAuthHandler.SLACK_OAUTH_STEP_MS} (default 7s each).
	 * @param {import('@playwright/test').Page} slackPage - Slack OAuth page with saved session
	 * @returns {Promise<boolean>} Success status
	 */
	async completeSlackOAuth({ slackPage } = {}) {
		const waitMs = OAuthHandler.SLACK_OAUTH_STEP_MS;

		logger.info("Completing Slack OAuth flow");
		try {
			await slackPage.waitForLoadState("domcontentloaded", { timeout: waitMs });
			const currentUrl = await slackPage.url();
			logger.info(`Slack OAuth page loaded: ${currentUrl}`);

			if (this.isCallbackUrl(currentUrl)) {
				logger.info("✓ OAuth auto-completed - already redirected back to app");
				return true;
			}

			if (!currentUrl.includes("slack.com")) {
				logger.warn(`Not on Slack OAuth page. Current URL: ${currentUrl}`);
				return false;
			}

			const poll = await this.pollSlackOAuthUntilInteractive(
				slackPage,
				waitMs,
				200,
			);
			if (poll.kind === "callback") {
				logger.info("✓ OAuth auto-completed during page settle");
				return true;
			}

			let matchedSelector =
				poll.kind === "allow"
					? poll.selector
					: await this.findVisibleAllowSelector(slackPage, waitMs);

			logger.info("Looking for Allow/Authorize button");
			const allowButtonFound = Boolean(matchedSelector);

			if (allowButtonFound && matchedSelector) {
				const maxRetries = 3;
				let redirectSuccess = false;

				for (let attempt = 1; attempt <= maxRetries; attempt++) {
					try {
						logger.info(
							`Clicking Allow button (attempt ${attempt}/${maxRetries})`,
						);
						await PwActions.waitForElement(slackPage, matchedSelector, waitMs);
						await PwActions.click(slackPage, matchedSelector);
						logger.info("✓ Allow button clicked - waiting for redirect");

						await this.waitForOAuthCallbackRedirect(slackPage, {
							oauthProviderUrl: "slack.com",
							callbackUrlPattern: OAuthHandler.CALLBACK_URL_PATTERN,
							timeout: waitMs,
						});

						logger.info("✓ OAuth callback redirect completed");
						redirectSuccess = true;
						break;
					} catch (err) {
						logger.warn(
							`Redirect timeout on attempt ${attempt}: ${err.message}`,
						);
						const urlAfterError = await slackPage.url();
						if (!urlAfterError.includes("slack.com")) {
							logger.info("Already redirected to callback - proceeding");
							redirectSuccess = true;
							break;
						}
						if (attempt < maxRetries) {
							await slackPage
								.waitForURL((u) => !u.href.includes("slack.com"), {
									timeout: waitMs,
								})
								.catch(() => {});
							const urlAfterWait = await slackPage.url();
							if (!urlAfterWait.includes("slack.com")) {
								logger.info("Redirect completed while retrying");
								redirectSuccess = true;
								break;
							}
							await PwActions.waitForTimeout(slackPage, waitMs);
						}
					}
				}
				if (!redirectSuccess) {
					throw new Error(
						`OAuth redirect did not complete after ${maxRetries} attempts. Check Slack OAuth configuration.`,
					);
				}
			}
			if (!allowButtonFound) {
				const updatedUrl = await slackPage.url();
				if (this.isCallbackUrl(updatedUrl)) {
					logger.info("✓ OAuth completed during authorization check");
					return true;
				}
				await this.captureSlackOAuthScreenshot(
					slackPage,
					"slack-oauth-unexpected-state.png",
				);
				const pageContent = await slackPage.content();
				logger.warn(`Page HTML preview: ${pageContent.substring(0, 500)}...`);

				throw new Error(
					`Could not find Allow/Authorize button on Slack OAuth page. Session may be expired or page structure changed. URL: ${updatedUrl}`,
				);
			}
			await slackPage
				.waitForLoadState("load", { timeout: waitMs })
				.catch(() => {
					logger.warn("Page did not fully load after OAuth completion");
				});
			return true;
		} catch (err) {
			logger.error(`Failed to complete Slack OAuth: ${err.message}`);
			throw err;
		}
	}

	/**
	 * Wait for OAuth callback redirect back to the main application
	 * @param {import('@playwright/test').Page} page - The page to monitor for redirect
	 * @param {Object} options - Configuration options
	 * @param {string|RegExp} options.oauthProviderUrl - OAuth provider URL to detect (e.g., "slack.com", "google.com")
	 * @param {RegExp} options.callbackUrlPattern - Regex pattern for callback URL (default: /integrations|account|callback/i)
	 * @param {number} options.timeout - Timeout in milliseconds
	 * @returns {Promise<void>}
	 */
	async waitForOAuthCallbackRedirect(page, options = {}) {
		const {
			timeout = this.timeout,
			oauthProviderUrl = null,
			callbackUrlPattern = /integrations|account|callback/i,
		} = options;

		const currentUrl = await page.url();

		const isOnOAuthProvider = oauthProviderUrl
			? typeof oauthProviderUrl === "string"
				? currentUrl.includes(oauthProviderUrl)
				: oauthProviderUrl.test(currentUrl)
			: false;

		if (isOnOAuthProvider) {
			logger.info(
				`Waiting for callback redirect from OAuth provider to main application`,
			);
			await page.waitForURL(callbackUrlPattern, { timeout });
			logger.info("Redirect back to application detected");
		} else {
			logger.info(
				`Already back on main application - OAuth redirect completed earlier`,
			);
		}

		const finalUrl = await page.url();
		logger.info(`OAuth flow completed. Final URL: ${finalUrl}`);
	}

	/**
	 * Check if URL is a callback/redirect URL (back to main app)
	 * @param {string} url - URL to check
	 * @param {Array<RegExp>} customPatterns - Optional custom patterns to check
	 * @returns {boolean} True if it's a callback URL
	 */
	isCallbackUrl(url, customPatterns = []) {
		const oauthProviderDomains = ["slack.com"];
		const isOnOAuthProvider = oauthProviderDomains.some((domain) =>
			url.includes(domain),
		);
		if (isOnOAuthProvider) {
			return false;
		}
		const defaultCallbackPatterns = [/\/integrations/i];
		const allPatterns = [...defaultCallbackPatterns, ...customPatterns];
		return allPatterns.some((pattern) => pattern.test(url));
	}
}

export default ExternalServices;

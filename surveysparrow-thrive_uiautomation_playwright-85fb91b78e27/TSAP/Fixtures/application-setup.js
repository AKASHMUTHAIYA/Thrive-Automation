import fs from "fs";
import { test as base } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import logger from "playwright-framework/Core/logger.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { POManager } from "../Pages/POManager";
import { EntityIds } from "../Shared_Functions/entityId";
import { envDetails } from "../Data/test-data";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FAILED_TESTS_FILE = path.join(__dirname, "failed_tests.json");
const FAILED_TESTS_BACKUP = path.join(__dirname, "failed_tests.backup.json");
const FILE_LOCK_TIMEOUT_MS = 5000;
const RETRY_DELAY_MS = 100;

// UI Formatting
const UI_PADDING_WIDTH = 41;
const ERROR_BANNER_WIDTH = 80;
const NETWORK_BANNER_WIDTH = 70;
const MAX_STACK_TRACE_LINES = 5;

// HTTP Status
const HTTP_CLIENT_ERROR_THRESHOLD = 400;

// Expected/Acceptable HTTP errors (won't be flagged as failures)
const EXPECTED_ERROR_STATUSES = new Set([
	// Add status codes that are expected in your app
	// 401, // Uncomment if 401 during logout is expected
	// 404, // Uncomment if 404 for non-existent resources is expected
]);

const EXPECTED_ERROR_URL_PATTERNS = [
	// Add URL patterns that can fail without being a problem
	"/api/current-session", // 403 is expected when checking session before login
	"/cdn-cgi/rum", // Cloudflare analytics - often cancelled during navigation
	// '/optional-resource',
	// '/analytics',
];

// ============================================================================
// FILE LOCKING UTILITIES - Prevents race conditions
// ============================================================================
class FileLock {
	constructor(lockFilePath) {
		this.lockFilePath = lockFilePath;
		this.isLocked = false;
	}

	async acquire(timeoutMs = FILE_LOCK_TIMEOUT_MS) {
		const startTime = Date.now();

		while (Date.now() - startTime < timeoutMs) {
			try {
				// Try to create lock file exclusively (fails if exists)
				fs.writeFileSync(this.lockFilePath, process.pid.toString(), {
					flag: "wx",
				});
				this.isLocked = true;
				return true;
			} catch (err) {
				// Lock exists, check if it's stale (process died)
				if (fs.existsSync(this.lockFilePath)) {
					const lockContent = fs.readFileSync(this.lockFilePath, "utf-8");
					const lockPid = parseInt(lockContent);

					// Check if process is still alive
					try {
						process.kill(lockPid, 0); // Signal 0 just checks if process exists
					} catch (e) {
						// Process is dead, remove stale lock
						logger.warn(`Removing stale lock file from PID ${lockPid}`);
						fs.unlinkSync(this.lockFilePath);
						continue;
					}
				}

				// Wait before retry
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
			}
		}

		throw new Error(`Failed to acquire file lock within ${timeoutMs}ms`);
	}

	release() {
		if (this.isLocked && fs.existsSync(this.lockFilePath)) {
			try {
				fs.unlinkSync(this.lockFilePath);
				this.isLocked = false;
			} catch (err) {
				logger.error(`Failed to release lock: ${err.message}`);
			}
		}
	}
}

// ============================================================================
// SAFE FILE OPERATIONS - Atomic writes with backup
// ============================================================================
class SafeFileStorage {
	static readFailedTests() {
		let failedTests = [];

		if (fs.existsSync(FAILED_TESTS_FILE)) {
			try {
				const data = fs.readFileSync(FAILED_TESTS_FILE, "utf-8");
				failedTests = JSON.parse(data);

				// Validate structure
				if (!Array.isArray(failedTests)) {
					throw new Error("Invalid data structure: expected array");
				}
			} catch (err) {
				logger.error(`Failed to read ${FAILED_TESTS_FILE}: ${err.message}`);

				// Try to restore from backup
				if (fs.existsSync(FAILED_TESTS_BACKUP)) {
					logger.warn("Attempting to restore from backup...");
					try {
						const backupData = fs.readFileSync(FAILED_TESTS_BACKUP, "utf-8");
						failedTests = JSON.parse(backupData);
						logger.info("Successfully restored from backup");
					} catch (backupErr) {
						logger.error(`Backup restoration failed: ${backupErr.message}`);
						logger.error("Starting with empty failed tests list");
					}
				} else {
					logger.error(
						"No backup available. Starting with empty failed tests list",
					);
				}
			}
		}

		return failedTests;
	}

	static writeFailedTestsInternal(failedTests) {
		try {
			// Create backup of current file
			if (fs.existsSync(FAILED_TESTS_FILE)) {
				fs.copyFileSync(FAILED_TESTS_FILE, FAILED_TESTS_BACKUP);
			}

			// Write to temp file first (atomic operation)
			const tempFile = FAILED_TESTS_FILE + ".tmp";
			fs.writeFileSync(tempFile, JSON.stringify(failedTests, null, 2), "utf-8");

			// Rename temp to actual file (atomic on POSIX systems)
			fs.renameSync(tempFile, FAILED_TESTS_FILE);

			logger.debug(`Successfully wrote ${failedTests.length} test records`);
		} catch (err) {
			logger.error(`Failed to write failed tests: ${err.message}`);
			throw err;
		}
	}
}

// ============================================================================
// NETWORK FAILURE TRACKER - Smart detection
// ============================================================================
class NetworkFailureTracker {
	constructor() {
		this.failures = [];
		this.count = 0;
	}

	shouldTrackError(url, status) {
		// Skip if status is in expected list
		if (EXPECTED_ERROR_STATUSES.has(status)) {
			return false;
		}

		// Skip if URL matches expected patterns
		if (EXPECTED_ERROR_URL_PATTERNS.some((pattern) => url.includes(pattern))) {
			return false;
		}

		return true;
	}

	async recordHttpError(method, status, statusText, url, response) {
		if (!this.shouldTrackError(url, status)) {
			logger.debug(`Ignoring expected HTTP error: ${status} ${url}`);
			return;
		}

		this.count++;

		// Collect additional diagnostic data for server errors (5xx)
		const isServerError = status >= 500;
		let responseBody = null;
		let responseBodyType = null;
		let responseHeaders = {};
		let requestHeaders = {};

		if (isServerError) {
			try {
				// Try to get response body (might contain error details)
				const contentType = response.headers()["content-type"] || "";
				if (contentType.includes("application/json")) {
					responseBody = await response.json();
					responseBodyType = "json";
				} else if (contentType.includes("text/html")) {
					const text = await response.text();
					// For HTML, just note it's HTML instead of showing the full content
					responseBody = `[HTML Response - ${text.length} chars]`;
					responseBodyType = "html";
				} else {
					const text = await response.text();
					responseBody = text.substring(0, 300); // Limit to 300 chars
					responseBodyType = "text";
				}
			} catch (err) {
				logger.debug(`Could not read response body: ${err.message}`);
				responseBody = "[Could not read response body]";
			}

			// Capture headers for debugging
			responseHeaders = response.headers();
			requestHeaders = response.request().headers();
		}

		const failureData = {
			type: "HTTP_ERROR",
			method,
			status,
			statusText,
			url,
			timestamp: new Date().toISOString(),
			isServerError,
			...(isServerError && {
				responseBody,
				responseBodyType,
				responseHeaders,
				requestHeaders: {
					"content-type": requestHeaders["content-type"],
					authorization: requestHeaders["authorization"]
						? "Bearer ***"
						: undefined,
				},
			}),
		};

		this.failures.push(failureData);

		// Enhanced logging for server errors (immediate notification)
		if (isServerError) {
			logger.error(
				`🚨 ❌ [SERVER ERROR] ${method} ${status} ${statusText} - ${url}`,
			);
			if (responseBody && responseBodyType === "json") {
				logger.error(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);
			} else if (responseBody && responseBodyType !== "html") {
				logger.error(`Response Body: ${responseBody}`);
			}
			if (responseHeaders["x-request-id"]) {
				logger.error(`Request ID: ${responseHeaders["x-request-id"]}`);
			}
		} else {
			logger.warn(
				`🚨 ❌ [HTTP ERROR] ${method} ${status} ${statusText} - ${url}`,
			);
		}
	}

	recordRequestFailed(method, errorText, url, request) {
		// Skip ERR_ABORTED - these are expected during navigation/page close
		if (errorText.includes("ERR_ABORTED")) {
			logger.debug(`Ignoring aborted request: ${method} ${url}`);
			return;
		}

		this.count++;

		// Collect additional data for failed requests
		const timing = request.timing();
		const requestHeaders = request.headers();

		const failureData = {
			type: "REQUEST_FAILED",
			method,
			errorText,
			url,
			timestamp: new Date().toISOString(),
			timing: {
				startTime: timing.startTime,
				domainLookupStart: timing.domainLookupStart,
				domainLookupEnd: timing.domainLookupEnd,
				connectStart: timing.connectStart,
				connectEnd: timing.connectEnd,
				requestStart: timing.requestStart,
				responseStart: timing.responseStart,
			},
			requestHeaders: {
				"content-type": requestHeaders["content-type"],
			},
		};

		this.failures.push(failureData);

		logger.error(`🚨 ❌ [REQUEST FAILED] ${method} ${errorText} - ${url}`);
		logger.error(`Timing: ${JSON.stringify(timing, null, 2)}`);
	}

	getSummary() {
		if (this.count === 0) return null;

		const errorsByType = this.failures.reduce((acc, failure) => {
			acc[failure.type] = (acc[failure.type] || 0) + 1;
			return acc;
		}, {});

		return {
			total: this.count,
			breakdown: errorsByType,
			failures: this.failures,
		};
	}

	logSummary() {
		if (this.count === 0) return;

		logger.warn(
			`\n${"=".repeat(NETWORK_BANNER_WIDTH)}\n⚠️  ⚠️  ⚠️   NETWORK FAILURES DETECTED: ${this.count}   ⚠️  ⚠️  ⚠️\n${"=".repeat(NETWORK_BANNER_WIDTH)}`,
		);

		const summary = this.getSummary();
		logger.warn(`Breakdown: ${JSON.stringify(summary.breakdown, null, 2)}`);

		// Separate server errors (5xx) for visibility
		const serverErrors = this.failures.filter(
			(f) => f.status >= 500 && f.status < 600,
		);

		if (serverErrors.length > 0) {
			const serverBanner = "━".repeat(NETWORK_BANNER_WIDTH);
			logger.error(`\n${serverBanner}`);
			logger.error(
				`🚨 CRITICAL: ${serverErrors.length} SERVER ERROR${serverErrors.length !== 1 ? "S" : ""} DETECTED (5xx)`,
			);
			logger.error(serverBanner);

			for (const error of serverErrors) {
				logger.error(`\n  ${error.method} ${error.status} ${error.statusText}`);
				logger.error(`  📍 URL: ${error.url}`);
				logger.error(`  🕐 Time: ${error.timestamp}`);

				// Show important response headers
				if (error.responseHeaders) {
					const importantHeaders = [
						"content-type",
						"x-request-id",
						"cf-ray",
						"server",
						"retry-after",
					];
					const headerInfo = [];
					for (const header of importantHeaders) {
						if (error.responseHeaders[header]) {
							headerInfo.push(`${header}: ${error.responseHeaders[header]}`);
						}
					}
					if (headerInfo.length > 0) {
						logger.error(`  📋 Headers: ${headerInfo.join(", ")}`);
					}
				}

				// Show body based on type
				if (error.responseBody) {
					if (error.responseBodyType === "json") {
						logger.error(
							`  📄 Response: ${JSON.stringify(error.responseBody, null, 2)}`,
						);
					} else if (error.responseBodyType === "html") {
						logger.error(`  📄 Response: ${error.responseBody}`);
					} else if (error.responseBody.length > 0) {
						const preview =
							error.responseBody.length > 200
								? `${error.responseBody.substring(0, 200)}...`
								: error.responseBody;
						logger.error(`  📄 Response: ${preview}`);
					}
				}
			}
			logger.error(`\n${serverBanner}`);
		}

		logger.warn(`${"=".repeat(NETWORK_BANNER_WIDTH)}\n`);
	}
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function formatViewport(page) {
	const viewport = page.viewportSize();
	if (!viewport) {
		return "Not set (default)".padEnd(UI_PADDING_WIDTH);
	}
	return `${viewport.width}x${viewport.height}`.padEnd(UI_PADDING_WIDTH);
}

function formatTitle(title) {
	const maxLength = UI_PADDING_WIDTH;
	if (title.length > maxLength) {
		return title.substring(0, maxLength - 3) + "...";
	}
	return title.padEnd(maxLength);
}

function formatDuration(durationMs) {
	const minutes = Math.floor(durationMs / 60000);
	const seconds = Math.floor((durationMs % 60000) / 1000);
	return `${minutes}m ${seconds}s`;
}

async function safeGetCurrentUrl(page) {
	try {
		return await PwActions.getCurrentUrl(page);
	} catch (err) {
		logger.warn(`Could not retrieve URL: ${err.message}`);
		return "Page unavailable (crashed/closed)";
	}
}

function safeGetSurveyInfo() {
	try {
		return EntityIds.getsurveyName() || "N/A";
	} catch (err) {
		logger.warn(`Could not retrieve survey info: ${err.message}`);
		return "N/A";
	}
}

// ============================================================================
// MAIN TEST FIXTURE
// ============================================================================
export const test = base.extend({
	thrivePage: async ({ page, browser }, use, testInfo) => {
		const networkTracker = new NetworkFailureTracker();
		let responseListener = null;
		let requestFailedListener = null;

		try {
			// =================================================================
			// SETUP PHASE
			// =================================================================

			EntityIds.clearQuestionScales();

			// Log test environment details
			logger.info(
				"\n┌──────────────── Test Environment Details ────────────────┐",
			);
			logger.info(
				`│ Browser    : ${browser.browserType().name().padEnd(UI_PADDING_WIDTH)}│`,
			);
			logger.info(`│ Viewport   : ${formatViewport(page)}│`);
			logger.info(`│ Test Title : ${formatTitle(testInfo.title)}│`);
			logger.info(
				`│ Test File  : ${formatTitle(testInfo.file.split("/").pop())}│`,
			);
			logger.info(
				`│ Project    : ${testInfo.project.name.padEnd(UI_PADDING_WIDTH)}│`,
			);
			logger.info(
				`│ Retry      : ${testInfo.retry.toString().padEnd(UI_PADDING_WIDTH)}│`,
			);
			logger.info(
				"└─────────────────────────────────────────────────────────┘\n",
			);

			// Validate environment configuration
			if (!envDetails?.uri) {
				logger.error(
					"⚠️  envDetails.uri is not configured! Network tracking will fail.",
				);
			}

			const isApiRequest = (url) => {
				if (!envDetails?.uri) return false;
				return url.startsWith(envDetails.uri);
			};

			// Setup network monitoring with proper cleanup
			responseListener = async (response) => {
				const url = response.url();
				const status = response.status();
				if (!isApiRequest(url) || status < HTTP_CLIENT_ERROR_THRESHOLD) return;

				await networkTracker.recordHttpError(
					response.request().method(),
					status,
					response.statusText(),
					url,
					response,
				);
			};

			requestFailedListener = (request) => {
				const url = request.url();
				if (!isApiRequest(url)) return;

				const errorText = request.failure()?.errorText || "Unknown error";
				networkTracker.recordRequestFailed(
					request.method(),
					errorText,
					url,
					request,
				);
			};

			page.on("response", responseListener);
			page.on("requestfailed", requestFailedListener);

			// Initialize page objects
			const poManager = new POManager(page);
			const loginpage = poManager.getLoginPage();

			// Log test initialization
			logger.info(`Initializing test: ${testInfo.title}`);

			// Login based on test type
			if (testInfo.title.includes("[trial]")) {
				await loginpage.launchAndLoginToTrialAccount();
				logger.info("Logged in to trial account");
			} else {
				await loginpage.launchAndLoginToApplication();
				logger.info("Logged in to application");
			}

			// =================================================================
			// TEST EXECUTION PHASE
			// =================================================================
			await use(page);

			// =================================================================
			// TEARDOWN PHASE
			// =================================================================

			// Remove network listeners BEFORE cleanup to avoid catching navigation aborts
			if (responseListener) {
				page.off("response", responseListener);
				responseListener = null;
			}
			if (requestFailedListener) {
				page.off("requestfailed", requestFailedListener);
				requestFailedListener = null;
			}

			// Log network failures summary (after removing listeners)
			networkTracker.logSummary();

			// Update failed tests tracking
			await updateFailedTestsTracking(testInfo, page, networkTracker);

			// Cleanup
			await loginpage.navigateToHomepageAndSignout();
			await page.close();
		} catch (err) {
			logger.error(`Critical error in test fixture: ${err.message}`);
			logger.error(err.stack);
			throw err;
		} finally {
			// ALWAYS cleanup event listeners to prevent memory leaks
			// (redundant check in case teardown didn't run)
			if (responseListener) {
				try {
					page.off("response", responseListener);
				} catch (err) {
					// Page might be closed, ignore
				}
			}
			if (requestFailedListener) {
				try {
					page.off("requestfailed", requestFailedListener);
				} catch (err) {
					// Page might be closed, ignore
				}
			}
		}
	},
});

// ============================================================================
// FAILED TESTS TRACKING
// ============================================================================
async function updateFailedTestsTracking(testInfo, page, networkTracker) {
	const lock = new FileLock(FAILED_TESTS_FILE + ".lock");
	try {
		// Acquire lock to prevent race conditions during read-modify-write cycle
		await lock.acquire();

		// Read existing failed test data with proper locking
		const failedTests = SafeFileStorage.readFailedTests();

		if (testInfo.status === "failed") {
			await handleTestFailure(testInfo, page, networkTracker, failedTests);
		} else if (testInfo.status === "passed") {
			handleTestSuccess(testInfo, failedTests);
		}

		// Write updated list back to file without re-locking (we hold the lock)
		SafeFileStorage.writeFailedTestsInternal(failedTests);
	} catch (err) {
		logger.error(`Failed to update test tracking: ${err.message}`);
		// Don't throw - test results are more important than tracking
	} finally {
		lock.release();
	}
}

async function handleTestFailure(testInfo, page, networkTracker, failedTests) {
	const failedUrl = await safeGetCurrentUrl(page);
	const surveyInfo = safeGetSurveyInfo();
	const durationStr = formatDuration(testInfo.duration);

	// Log detailed failure information with improved formatting
	const topBanner = "═".repeat(ERROR_BANNER_WIDTH);
	const divider = "─".repeat(ERROR_BANNER_WIDTH);

	logger.error(`\n${topBanner}`);
	logger.error("🔴                     FAILED TEST DETAILS");
	logger.error(topBanner);
	logger.error(`📝 Test         : ${testInfo.title}`);
	logger.error(`⏱️  Duration     : ${durationStr} (${testInfo.duration}ms)`);
	if (surveyInfo && surveyInfo !== "N/A") {
		logger.error(`📊 Survey       : ${surveyInfo}`);
	}
	logger.error(`🌐 Current URL  : ${failedUrl}`);

	// Add network failure summary to failure report (enhanced)
	const networkSummary = networkTracker.getSummary();
	if (networkSummary && networkSummary.total > 0) {
		const breakdownStr = Object.entries(networkSummary.breakdown)
			.map(([type, count]) => `${type}:${count}`)
			.join(", ");
		logger.error(`🚨 Network Fails: ${networkSummary.total} (${breakdownStr})`);

		// Highlight server errors specifically
		const serverErrorCount = networkSummary.breakdown.HTTP_ERROR || 0;
		if (serverErrorCount > 0) {
			logger.error(
				`   ⚠️  ${serverErrorCount} server error${serverErrorCount !== 1 ? "s" : ""} detected (see NETWORK FAILURES section above)`,
			);
		}
	}

	logger.error(divider);
	logger.error("💥                       ERROR DETAILS");
	logger.error(divider);

	// Format error message
	const errorMsg = testInfo.error?.message || "Unknown error";
	const errorLines = errorMsg.split("\n");
	logger.error(`Error: ${errorLines[0]}`);
	for (let i = 1; i < Math.min(errorLines.length, 3); i++) {
		logger.error(`       ${errorLines[i]}`);
	}

	logger.error(divider);
	logger.error("📚                       STACK TRACE");
	logger.error(divider);
	const stack = testInfo.error?.stack || "No stack trace available";
	const stackLines = stack.split("\n").slice(0, MAX_STACK_TRACE_LINES);
	for (const line of stackLines) {
		logger.error(line);
	}

	// Log console errors
	const consoleErrors = testInfo.attachments
		.filter((attachment) => attachment.name.includes("console-error"))
		.map((attachment) => attachment.path);
	if (consoleErrors.length > 0) {
		logger.error(divider);
		logger.error("🖥️                      CONSOLE ERRORS");
		logger.error(divider);
		for (const error of consoleErrors) {
			logger.error(error);
		}
	}

	logger.error(`${topBanner}\n`);

	// Update failed tests list
	const existingFailedTest = failedTests.find(
		(test) => test.testId === testInfo.testId,
	);

	if (!existingFailedTest) {
		const failedDetails = {
			testId: testInfo.testId,
			title: testInfo.title,
			failCount: 1,
			timestamp: new Date().toISOString(),
			url: failedUrl,
			survey: surveyInfo,
			networkFailures: networkSummary?.total || 0,
			passed: false,
		};
		failedTests.push(failedDetails);
		logger.info(`Added new failed test "${testInfo.title}" to list`);
	} else {
		existingFailedTest.failCount = (existingFailedTest.failCount || 0) + 1;
		existingFailedTest.timestamp = new Date().toISOString();
		existingFailedTest.url = failedUrl;
		existingFailedTest.survey = surveyInfo;
		existingFailedTest.networkFailures = networkSummary?.total || 0;
		existingFailedTest.passed = false;
		logger.info(
			`Updated existing failed test "${testInfo.title}", fail count: ${existingFailedTest.failCount}`,
		);
	}
}

function handleTestSuccess(testInfo, failedTests) {
	const existingFailedTest = failedTests.find(
		(test) => test.testId === testInfo.testId,
	);
	if (existingFailedTest) {
		existingFailedTest.passed = true;
		existingFailedTest.lastPassedAt = new Date().toISOString();
		logger.info(`Marked test "${testInfo.title}" as passed`);
	}
}

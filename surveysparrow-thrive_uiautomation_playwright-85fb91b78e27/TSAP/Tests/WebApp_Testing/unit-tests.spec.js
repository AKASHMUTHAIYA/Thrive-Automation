import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";
import { APIActions } from "playwright-framework/Core/API_Actions/api-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { screenshotsDir } from "../../../playwright.config.js";
import { constants } from "../../Data/Resources/constants.js";
import { envDetails } from "../../Data/test-data.js";
import { test } from "../../Fixtures/application-setup.js";
import { POManager } from "../../Pages/POManager.js";
import { Calculations } from "../../Shared_Functions/calculations.js";
import { EntityIds } from "../../Shared_Functions/entityId.js";

/**
 * Helper function to delete a single survey with retry logic
 * @param {Object} survey - Survey object with id and name
 * @param {Page} thrivePage - Playwright page object
 * @param {APIActions} api_action - API actions instance
 * @param {number} maxRetries - Maximum retry attempts (default: 1)
 * @param {number} waitSeconds - Wait time between retries (default: 10)
 * @returns {Promise<Object>} Result object with success status and failure type
 */
async function deleteSurveyWithRetry(
	survey,
	thrivePage,
	api_action,
	maxRetries = 1,
	waitSeconds = 10,
) {
	const cookieValue = await thrivePage.context().cookies();
	const survey_url = `${envDetails.uri}/api/internal/surveys/${survey.id}`;

	// Archive survey first (optional, continue on failure)
	try {
		const survey_response = await api_action.patchRequest({
			url: survey_url,
			cookieValue: cookieValue,
			data: { archived: true },
		});
		if (survey_response.status !== 200) {
			console.log(
				`⚠️ Archive failed for "${survey.name}" (status ${survey_response.status}), continuing...`,
			);
		}
	} catch (error) {
		console.log(
			`⚠️ Archive error for "${survey.name}": ${error.message}, continuing...`,
		);
	}

	// Delete survey with retry logic
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const survey_response_2 = await api_action.deleteRequest({
				url: survey_url,
				cookieValue: cookieValue,
			});

			if (survey_response_2.success === true) {
				return {
					success: true,
					survey: survey.name,
					id: survey.id,
					isCriticalFailure: false,
				};
			}

			if (attempt < maxRetries) {
				console.log(
					`⚠️ Delete failed for "${survey.name}" (status ${survey_response_2.status}), retrying in ${waitSeconds}s...`,
				);
				await CommonUtils.sleep(waitSeconds);
			}
		} catch (error) {
			if (attempt < maxRetries) {
				console.log(
					`⚠️ Delete error for "${survey.name}": ${error.message}, retrying in ${waitSeconds}s...`,
				);
				await CommonUtils.sleep(waitSeconds);
			} else {
				// Determine if this is a critical failure (backend overload) or non-critical
				const errorMessage = error.message || "";
				const isCriticalFailure =
					errorMessage.includes("500") || // Internal server error
					errorMessage.includes("502") || // Bad gateway
					errorMessage.includes("503") || // Service unavailable
					errorMessage.includes("504") || // Gateway timeout
					errorMessage.includes("429") || // Too many requests (rate limiting)
					errorMessage.includes("ECONNREFUSED") || // Connection refused
					errorMessage.includes("ETIMEDOUT") || // Timeout
					errorMessage.includes("ECONNRESET"); // Connection reset

				return {
					success: false,
					survey: survey.name,
					id: survey.id,
					error: error.message || `Status: ${error.status || "unknown"}`,
					isCriticalFailure: isCriticalFailure, // Flag for circuit breaker
				};
			}
		}
	}

	return {
		success: false,
		survey: survey.name,
		id: survey.id,
		error: "Max retries reached",
		isCriticalFailure: true, // Max retries means backend issues
	};
}

/**
 * Helper function to process a segment of surveys with batching
 * @param {Array} surveys - Array of survey objects to delete
 * @param {Page} thrivePage - Playwright page object
 * @param {APIActions} api_action - API actions instance
 * @param {string} segmentName - Name of the segment for logging
 * @param {number} concurrentBatchSize - Number of concurrent deletions per batch
 * @param {number} batchPauseSeconds - Seconds to pause between batches
 * @param {number} maxRetries - Maximum retry attempts per survey
 * @param {number} retryWaitSeconds - Wait time between retries
 * @param {number} startIndex - Starting index for display purposes
 * @returns {Promise<Object>} Results object with metrics
 */
async function deleteSurveysSegment(
	surveys,
	thrivePage,
	api_action,
	segmentName,
	concurrentBatchSize,
	batchPauseSeconds,
	maxRetries,
	retryWaitSeconds,
	startIndex,
) {
	const results = {
		total: surveys.length,
		success: 0,
		failed: 0,
		failedSurveys: [],
		startTime: Date.now(),
		circuitBreakerTriggered: 0,
	};

	// Circuit breaker configuration
	const CIRCUIT_BREAKER_THRESHOLD = 3; // Trigger after 3 consecutive critical failure batches (reduced from 5)
	const CIRCUIT_BREAKER_COOLDOWN_SECONDS = 120; // Wait 2 minutes (120 seconds)
	const CRITICAL_FAILURE_PERCENTAGE = 0.5; // Trigger if >50% of batch are critical failures
	let consecutiveFailures = 0;

	const totalBatches = Math.ceil(surveys.length / concurrentBatchSize);

	for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
		const batchStart = batchIndex * concurrentBatchSize;
		const batchEnd = Math.min(batchStart + concurrentBatchSize, surveys.length);
		const batch = surveys.slice(batchStart, batchEnd);

		console.log(
			`\n[${segmentName}] [BATCH ${batchIndex + 1}/${totalBatches}] Processing surveys ${startIndex + batchStart + 1}-${startIndex + batchEnd}...`,
		);

		// Delete batch concurrently using Promise.allSettled
		const batchResults = await Promise.allSettled(
			batch.map((survey) =>
				deleteSurveyWithRetry(
					survey,
					thrivePage,
					api_action,
					maxRetries,
					retryWaitSeconds,
				),
			),
		);

		// Track failures for circuit breaker (only critical failures)
		let batchCriticalFailures = 0;
		let batchNonCriticalFailures = 0;
		let batchSuccesses = 0;

		// Process batch results
		batchResults.forEach((result, idx) => {
			const survey = batch[idx];
			const globalIndex = startIndex + batchStart + idx + 1;

			if (result.status === "fulfilled") {
				if (result.value.success) {
					results.success++;
					batchSuccesses++;
					console.log(`✓ [${globalIndex}] "${survey.name}"`);
				} else {
					results.failed++;

					// Check if this is a critical failure (backend overload)
					if (result.value.isCriticalFailure) {
						batchCriticalFailures++;
					} else {
						batchNonCriticalFailures++;
					}

					results.failedSurveys.push({
						index: globalIndex,
						name: survey.name,
						id: survey.id,
						error: result.value.error,
						isCritical: result.value.isCriticalFailure,
					});
					console.log(
						`✗ [${globalIndex}] "${survey.name}" - ${result.value.error}`,
					);
				}
			} else {
				// Promise rejected (shouldn't happen with allSettled, but handle it)
				results.failed++;
				batchCriticalFailures++; // Treat promise rejection as critical
				results.failedSurveys.push({
					index: globalIndex,
					name: survey.name,
					id: survey.id,
					error: result.reason?.message || "Promise rejected",
					isCritical: true,
				});
				console.log(
					`✗ [${globalIndex}] "${survey.name}" - Promise rejected: ${result.reason?.message || "unknown"}`,
				);
			}
		});

		// Circuit breaker logic: Only track CRITICAL failures
		const hasCriticalFailures = batchCriticalFailures > 0;
		const hasSuccesses = batchSuccesses > 0;
		const criticalFailureRate = batchCriticalFailures / batch.length;

		// Trigger conditions:
		// 1. Batch has critical failures AND no successes
		// 2. OR more than 50% of batch are critical failures (backend severely degraded)
		if (
			(hasCriticalFailures && !hasSuccesses) ||
			criticalFailureRate > CRITICAL_FAILURE_PERCENTAGE
		) {
			consecutiveFailures++;
			if (criticalFailureRate > CRITICAL_FAILURE_PERCENTAGE) {
				console.log(
					`🔥 [${segmentName}] Batch severely degraded: ${batchCriticalFailures}/${batch.length} (${Math.round(criticalFailureRate * 100)}%) critical failures. Consecutive problem batches: ${consecutiveFailures}/${CIRCUIT_BREAKER_THRESHOLD}`,
				);
			} else {
				console.log(
					`⚠️ [${segmentName}] Batch had ${batchCriticalFailures} critical failures (${batchNonCriticalFailures} non-critical). Consecutive critical failure batches: ${consecutiveFailures}/${CIRCUIT_BREAKER_THRESHOLD}`,
				);
			}
		} else if (
			hasSuccesses &&
			criticalFailureRate <= CRITICAL_FAILURE_PERCENTAGE
		) {
			// Batch is healthy - reset consecutive failure counter
			if (consecutiveFailures > 0) {
				console.log(
					`✓ [${segmentName}] Batch recovered with ${batchSuccesses} successes, ${batchCriticalFailures} critical failures (${Math.round(criticalFailureRate * 100)}%). Resetting failure counter.`,
				);
			}
			consecutiveFailures = 0;
		} else if (batchNonCriticalFailures > 0 && batchCriticalFailures === 0) {
			// Only non-critical failures (e.g., contactIds bug) - don't increment counter
			console.log(
				`ℹ️ [${segmentName}] Batch had only non-critical failures (${batchNonCriticalFailures}). Not counting toward circuit breaker.`,
			);
		}

		// Trigger circuit breaker if threshold reached
		if (consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD) {
			results.circuitBreakerTriggered++;
			console.log(`\n🔴 ========================================`);
			console.log(`🔴 [${segmentName}] CIRCUIT BREAKER TRIGGERED!`);
			console.log(`🔴 ========================================`);
			console.log(
				`🔴 Detected ${consecutiveFailures} consecutive batches with critical failures.`,
			);
			console.log(`🔴 The backend appears to be overwhelmed or down.`);
			console.log(
				`🔴 Pausing for ${CIRCUIT_BREAKER_COOLDOWN_SECONDS} seconds (${Math.floor(CIRCUIT_BREAKER_COOLDOWN_SECONDS / 60)} minutes) to allow recovery...`,
			);
			console.log(`🔴 ========================================\n`);

			await CommonUtils.sleep(CIRCUIT_BREAKER_COOLDOWN_SECONDS);

			console.log(
				`✓ [${segmentName}] Cooldown complete. Resuming deletion...\n`,
			);
			consecutiveFailures = 0; // Reset after cooldown
		}

		console.log(
			`[${segmentName}] [BATCH ${batchIndex + 1}/${totalBatches}] Complete. Success: ${results.success}/${results.total}, Failed: ${results.failed}/${results.total}`,
		);

		// Pause between batches (except after the last batch)
		if (batchIndex < totalBatches - 1) {
			await CommonUtils.sleep(batchPauseSeconds);
		}
	}

	results.endTime = Date.now();
	return results;
}

/**
 * Helper function to log final deletion summary
 * @param {Object} results - Results object from deleteSurveysSegment
 * @param {string} segmentName - Name of the segment for logging
 */
function logFinalSummary(results, segmentName) {
	const durationSeconds = Math.round(
		(results.endTime - results.startTime) / 1000,
	);
	const durationMinutes = Math.floor(durationSeconds / 60);
	const durationSecondsRemainder = durationSeconds % 60;

	console.log("\n\n========================================");
	console.log(`${segmentName} - DELETION COMPLETE`);
	console.log("========================================");
	console.log(`Total surveys in segment: ${results.total}`);
	console.log(
		`Successfully deleted: ${results.success} (${Math.round((results.success / results.total) * 100)}%)`,
	);
	console.log(
		`Failed: ${results.failed} (${Math.round((results.failed / results.total) * 100)}%)`,
	);
	console.log(`Duration: ${durationMinutes}m ${durationSecondsRemainder}s`);
	console.log(
		`Average: ${(durationSeconds / results.total).toFixed(2)}s per survey`,
	);

	if (results.failedSurveys.length > 0) {
		console.log("\n----------------------------------------");
		console.log(`FAILED SURVEYS (${results.failedSurveys.length}):`);
		console.log("----------------------------------------");
		results.failedSurveys.forEach((item) => {
			console.log(`[${item.index}] "${item.name}" (ID: ${item.id})`);
			console.log(`    Error: ${item.error}`);
		});

		// Export failed surveys to JSON for later retry
		const segmentIdentifier = segmentName
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "-");
		const failedSurveysPath = path.join(
			process.cwd(),
			"test-results",
			`failed-surveys-${segmentIdentifier}.json`,
		);
		fs.writeFileSync(
			failedSurveysPath,
			JSON.stringify(results.failedSurveys, null, 2),
		);
		console.log(`\n✓ Failed surveys exported to: ${failedSurveysPath}`);
	}

	console.log("========================================\n");
}

test.describe("Unit Test", () => {
	/**
	 * ============================================
	 * SURVEY DELETION - PARALLEL 4-WAY APPROACH
	 * ============================================
	 *
	 * This test suite provides PARALLEL deletion via 4 test cases that split the survey list into quartiles.
	 * All 4 tests run simultaneously when executed with WORKERS=4, reducing total time by ~75%.
	 *
	 * RUN COMMANDS:
	 *
	 * 1. Run all 4 tests in parallel (RECOMMENDED):
	 *    npm run delete_surveys
	 *    (or) npx cross-env ENV=qa WORKERS=4 npx playwright test --grep @deleteSurveys
	 *
	 * 2. Run individual quartiles:
	 *    npm run delete_surveys_q1  (0-25%)
	 *    npm run delete_surveys_q2  (25-50%)
	 *    npm run delete_surveys_q3  (50-75%)
	 *    npm run delete_surveys_q4  (75-100%)
	 *
	 * PERFORMANCE COMPARISON:
	 * - Single test (old approach):    40-60 minutes for 24k surveys
	 * - Parallel 2-way:                20-30 minutes for 24k surveys (~50% faster)
	 * - Parallel 4-way (this approach): 10-15 minutes for 24k surveys (~75% faster)
	 *
	 * FEATURES:
	 * - Safe batching (10 concurrent requests per batch, 1s pause between batches)
	 * - Promise.allSettled (one failure won't kill the batch)
	 * - Retry logic (1 retry with 10s wait)
	 * - Comprehensive logging and error tracking
	 * - Failed surveys exported to JSON per quartile
	 * - No overlap between test cases (clean quartile boundaries)
	 * - Equal workload distribution (~6k surveys per test for 24k total)
	 *
	 * CONCURRENCY:
	 * - 4 workers × 10 concurrent requests = 40 total concurrent API calls
	 * - Conservative batch pause prevents rate limiting
	 * - Monitor for HTTP 429 errors and increase BATCH_PAUSE_SECONDS if needed
	 *
	 * ============================================
	 */

	/**
	 * QUARTILE 1: First 25% of surveys (0% → 25%)
	 */
	test("Delete_Surveys_Q1_0to25 @deleteSurveys @deleteSurveys_Q1", async ({
		thrivePage,
	}) => {
		const CONCURRENT_BATCH_SIZE = 10;
		const BATCH_PAUSE_SECONDS = 1;
		const MAX_RETRIES = 1;
		const RETRY_WAIT_SECONDS = 10;
		const SEGMENT_NAME = "Q1 (0-25%)";

		const api_action = new APIActions();
		const poManager = new POManager(thrivePage);
		const communfunction = poManager.getCommonPageFunctions();

		console.log("\n========================================");
		console.log(`SURVEY DELETION - ${SEGMENT_NAME}`);
		console.log("========================================");
		console.log(`Batch size: ${CONCURRENT_BATCH_SIZE} concurrent requests`);
		console.log(`Batch pause: ${BATCH_PAUSE_SECONDS}s`);
		console.log(
			`Retry policy: ${MAX_RETRIES} retries with ${RETRY_WAIT_SECONDS}s wait`,
		);
		console.log("========================================\n");

		await communfunction.navigateTopNavigateSection("Performance");
		const cookieValue = await thrivePage.context().cookies();
		const internal_url = `${envDetails.uri}/api/internal/surveys/list`;

		console.log("Fetching survey list...");
		const survey_list = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});

		const totalSurveys = survey_list.length;
		const q1End = Math.floor(totalSurveys * 0.25);
		const segmentSurveys = survey_list.slice(0, q1End);

		console.log(`✓ Found ${totalSurveys} total surveys`);
		console.log(
			`✓ This test will process ${segmentSurveys.length} surveys (indices 0-${q1End - 1})\n`,
		);

		if (segmentSurveys.length === 0) {
			console.log("No surveys to delete in this segment. Exiting.");
			return;
		}

		const results = await deleteSurveysSegment(
			segmentSurveys,
			thrivePage,
			api_action,
			SEGMENT_NAME,
			CONCURRENT_BATCH_SIZE,
			BATCH_PAUSE_SECONDS,
			MAX_RETRIES,
			RETRY_WAIT_SECONDS,
			0,
		);

		logFinalSummary(results, SEGMENT_NAME);
	});

	/**
	 * QUARTILE 2: Second 25% of surveys (25% → 50%)
	 */
	test("Delete_Surveys_Q2_25to50 @deleteSurveys @deleteSurveys_Q2", async ({
		thrivePage,
	}) => {
		const CONCURRENT_BATCH_SIZE = 10;
		const BATCH_PAUSE_SECONDS = 1;
		const MAX_RETRIES = 1;
		const RETRY_WAIT_SECONDS = 10;
		const SEGMENT_NAME = "Q2 (25-50%)";

		const api_action = new APIActions();
		const poManager = new POManager(thrivePage);
		const communfunction = poManager.getCommonPageFunctions();

		console.log("\n========================================");
		console.log(`SURVEY DELETION - ${SEGMENT_NAME}`);
		console.log("========================================");
		console.log(`Batch size: ${CONCURRENT_BATCH_SIZE} concurrent requests`);
		console.log(`Batch pause: ${BATCH_PAUSE_SECONDS}s`);
		console.log(
			`Retry policy: ${MAX_RETRIES} retries with ${RETRY_WAIT_SECONDS}s wait`,
		);
		console.log("========================================\n");

		await communfunction.navigateTopNavigateSection("Performance");
		const cookieValue = await thrivePage.context().cookies();
		const internal_url = `${envDetails.uri}/api/internal/surveys/list`;

		console.log("Fetching survey list...");
		const survey_list = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});

		const totalSurveys = survey_list.length;
		const q1End = Math.floor(totalSurveys * 0.25);
		const q2End = Math.floor(totalSurveys * 0.5);
		const segmentSurveys = survey_list.slice(q1End, q2End);

		console.log(`✓ Found ${totalSurveys} total surveys`);
		console.log(
			`✓ This test will process ${segmentSurveys.length} surveys (indices ${q1End}-${q2End - 1})\n`,
		);

		if (segmentSurveys.length === 0) {
			console.log("No surveys to delete in this segment. Exiting.");
			return;
		}

		const results = await deleteSurveysSegment(
			segmentSurveys,
			thrivePage,
			api_action,
			SEGMENT_NAME,
			CONCURRENT_BATCH_SIZE,
			BATCH_PAUSE_SECONDS,
			MAX_RETRIES,
			RETRY_WAIT_SECONDS,
			q1End,
		);

		logFinalSummary(results, SEGMENT_NAME);
	});

	/**
	 * QUARTILE 3: Third 25% of surveys (50% → 75%)
	 */
	test("Delete_Surveys_Q3_50to75 @deleteSurveys @deleteSurveys_Q3", async ({
		thrivePage,
	}) => {
		const CONCURRENT_BATCH_SIZE = 10;
		const BATCH_PAUSE_SECONDS = 1;
		const MAX_RETRIES = 1;
		const RETRY_WAIT_SECONDS = 10;
		const SEGMENT_NAME = "Q3 (50-75%)";

		const api_action = new APIActions();
		const poManager = new POManager(thrivePage);
		const communfunction = poManager.getCommonPageFunctions();

		console.log("\n========================================");
		console.log(`SURVEY DELETION - ${SEGMENT_NAME}`);
		console.log("========================================");
		console.log(`Batch size: ${CONCURRENT_BATCH_SIZE} concurrent requests`);
		console.log(`Batch pause: ${BATCH_PAUSE_SECONDS}s`);
		console.log(
			`Retry policy: ${MAX_RETRIES} retries with ${RETRY_WAIT_SECONDS}s wait`,
		);
		console.log("========================================\n");

		await communfunction.navigateTopNavigateSection("Performance");
		const cookieValue = await thrivePage.context().cookies();
		const internal_url = `${envDetails.uri}/api/internal/surveys/list`;

		console.log("Fetching survey list...");
		const survey_list = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});

		const totalSurveys = survey_list.length;
		const q2End = Math.floor(totalSurveys * 0.5);
		const q3End = Math.floor(totalSurveys * 0.75);
		const segmentSurveys = survey_list.slice(q2End, q3End);

		console.log(`✓ Found ${totalSurveys} total surveys`);
		console.log(
			`✓ This test will process ${segmentSurveys.length} surveys (indices ${q2End}-${q3End - 1})\n`,
		);

		if (segmentSurveys.length === 0) {
			console.log("No surveys to delete in this segment. Exiting.");
			return;
		}

		const results = await deleteSurveysSegment(
			segmentSurveys,
			thrivePage,
			api_action,
			SEGMENT_NAME,
			CONCURRENT_BATCH_SIZE,
			BATCH_PAUSE_SECONDS,
			MAX_RETRIES,
			RETRY_WAIT_SECONDS,
			q2End,
		);

		logFinalSummary(results, SEGMENT_NAME);
	});

	/**
	 * QUARTILE 4: Last 25% of surveys (75% → 100%)
	 */
	test("Delete_Surveys_Q4_75to100 @deleteSurveys @deleteSurveys_Q4", async ({
		thrivePage,
	}) => {
		const CONCURRENT_BATCH_SIZE = 10;
		const BATCH_PAUSE_SECONDS = 1;
		const MAX_RETRIES = 1;
		const RETRY_WAIT_SECONDS = 10;
		const SEGMENT_NAME = "Q4 (75-100%)";

		const api_action = new APIActions();
		const poManager = new POManager(thrivePage);
		const communfunction = poManager.getCommonPageFunctions();

		console.log("\n========================================");
		console.log(`SURVEY DELETION - ${SEGMENT_NAME}`);
		console.log("========================================");
		console.log(`Batch size: ${CONCURRENT_BATCH_SIZE} concurrent requests`);
		console.log(`Batch pause: ${BATCH_PAUSE_SECONDS}s`);
		console.log(
			`Retry policy: ${MAX_RETRIES} retries with ${RETRY_WAIT_SECONDS}s wait`,
		);
		console.log("========================================\n");

		await communfunction.navigateTopNavigateSection("Performance");
		const cookieValue = await thrivePage.context().cookies();
		const internal_url = `${envDetails.uri}/api/internal/surveys/list`;

		console.log("Fetching survey list...");
		const survey_list = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});

		const totalSurveys = survey_list.length;
		const q3End = Math.floor(totalSurveys * 0.75);
		const segmentSurveys = survey_list.slice(q3End);

		console.log(`✓ Found ${totalSurveys} total surveys`);
		console.log(
			`✓ This test will process ${segmentSurveys.length} surveys (indices ${q3End}-${totalSurveys - 1})\n`,
		);

		if (segmentSurveys.length === 0) {
			console.log("No surveys to delete in this segment. Exiting.");
			return;
		}

		const results = await deleteSurveysSegment(
			segmentSurveys,
			thrivePage,
			api_action,
			SEGMENT_NAME,
			CONCURRENT_BATCH_SIZE,
			BATCH_PAUSE_SECONDS,
			MAX_RETRIES,
			RETRY_WAIT_SECONDS,
			q3End,
		);

		logFinalSummary(results, SEGMENT_NAME);
	});
	// await communfunction.openSurveyAndAttendSurveyForParticipant(
	// 	"Evaluator-Peer",
	// 	cookieValue,
	// 	browser,
	// );
	// const survey_url_2 = await communfunction.open_survey_from_received_email(
	// 	"Please assess Subject Automation",
	// 	"thrive.automation@surveysparrowqa.com",
	// 	`${constants.peerEvaluatorEmailBody} ${surveyPage.survey_name}`,
	// );
	// const page3 = await PwActions.openNewTab(browser);
	// await PwActions.goTo(page3, survey_url_2);
	// await surveyeuipage.attendSurvey({page: page3, cookie: cookieValue, participantName: "Evaluator - Peer", subject: "Evaluator - Peer"});
	// const surveyEvaluatorResponse = surveyeuipage.getResponse();
	// await PwActions.closeTab(page3);
	// await commonutils.addDataToJsonFile(
	// 	`${surveyPage.survey_name} Survey Response.json`,
	// 	surveyEvaluatorResponse,
	// );
	// const survey_url_3 = await communfunction.open_survey_from_received_email(
	// 	"Please assess Subject Automation",
	// 	"thrive.automation@surveysparrowqa.com",
	// 	`${constants.reporteeEvaluatorEmialBody}${surveyPage.survey_name}`,
	// );
	// const page4 = await PwActions.openNewTab(browser);
	// await PwActions.goTo(page4, survey_url_3);
	// await surveyeuipage.attendSurvey({
	// 	page: page4,
	// 	cookie: cookieValue,
	// 	participantName: "Evaluator - Reportee",
	// 	subject: "Evaluator - Reportee",
	// });
	// 	page4,
	// 	cookieValue,
	// 	"Evaluator - Reportee",
	// );
	// const surveyReporteeEvaluatorResponse = surveyeuipage.getResponse();
	// await commonutils.addDataToJsonFile(
	// 	`${surveyPage.survey_name} Survey Response.json`,
	// 	surveyReporteeEvaluatorResponse,
	// );
	// await PwActions.closeTab(page4);
	// // let responseData = await commonutils.readJsonFileAndConvertToObject(surveyPage.survey_name + ' Survey Response.json');
	// // Calculations.performanceOverallScore(responseData);
	// // await loginpage.navigateToHomepageAndSignout()
	// const survey_url_4 = await communfunction.open_survey_from_received_email(
	// 	"Please assess Subject Automation",
	// 	"thrive.automation@surveysparrowqa.com",
	// 	`${constants.managerEvaluatorEmialBody} ${surveyPage.survey_name}`,
	// );
	// const page5 = await PwActions.openNewTab(browser);
	// await PwActions.goTo(page5, survey_url_4);
	// await surveyeuipage.attendSurvey(page5, cookieValue, "Evaluator - Manager");
	// const surveyReporteeManagerResponse = surveyeuipage.getResponse();
	// await commonutils.addDataToJsonFile(
	// 	`${surveyPage.survey_name} Survey Response.json`,
	// 	surveyReporteeEvaluatorResponse,
	// );
	// await PwActions.closeTab(page5);
	// const responseData = await commonutils.readJsonFileAndConvertToObject(
	// 	`${surveyPage.survey_name} Survey Response.json`,
	// );
	// Calculations.performanceOverallScore(responseData);
	// await loginpage.navigateToHomepageAndSignout();
	// await loginpage.login(
	// 	envDetails.approverEmail,
	// 	envDetails.approverPassword,
	// );
	// await communfunction.navigateTopNavigateSection("Performance");
	// await approverPage.navigateToTabs("Reports");
	// await approverPage.approveReport(
	// 	surveyPage.survey_name,
	// 	"Subject Automation",
	// );
	// await loginpage.navigateToHomepageAndSignout();
	// await loginpage.launchAndLoginToApplication();
	// // commonutils.writeDataToJson(surveyEvaluatorResponse)
	// await communfunction.navigateTopNavigateSection("Performance");
	// await surveyPage.selectSurveyFromList(surveyPage.survey_name);
	// await surveyPage.navigateTopSections("Reports");
	// await reportsheaderpage.navigateHeaderReportSection("Overview");
	// await approverPage.navigateToTabs("Overview");
	// await overviewPage.verifyOverallScore();
	// await communfunction.navigateTopNavigateSection('Performance');
	// await surveyPage.selectSurveyFromList(surveyPage.survey_name)
	// await surveyPage.navigateTopSections('Reports');
	// await reportsheaderpage.navigateHeaderReportSection('Responses');
	// await responsepage.verifyResponse('Subject Automation', surveySubjectResponse);
	// await responsepage.verifyResponse('Evaluator Automation', surveyEvaluatorResponse);

	/**
	 * OPTION A (BACKUP): PARALLEL SURVEY DELETION - 4-WAY SPLIT
	 *
	 * Use this approach ONLY if:
	 * 1. Backend bug (contactIds) is fixed
	 * 2. You need faster cleanup (10-15 min vs 40-60 min)
	 * 3. You've confirmed no rate limiting issues in your environment
	 *
	 * Strategy: Divide survey list into 4 segments and delete in parallel to avoid
	 * sequential backend issues and reduce total cleanup time.
	 *
	 * Test 1: Front to Middle (indices 0 → 25%)
	 * Test 2: Middle-Front to Middle (indices 25% → 50%)
	 * Test 3: Middle to Middle-End (indices 50% → 75%)
	 * Test 4: Middle-End to End (indices 75% → 100%)
	 *
	 * Run all: npx cross-env ENV=qa WORKERS=4 npx playwright test unit-tests.spec.js --grep "@deleteSurveys_Parallel"
	 *
	 * WARNING: High risk of rate limiting with 4 parallel workers hitting API simultaneously.
	 * Uncomment these tests if you want to use the parallel approach.
	 */

	/*
	test("Delete_Surveys_Segment_1_Front_To_Middle @deleteSurveys_Parallel", async ({ thrivePage }) => {
		const api_action = new APIActions();
		const poManager = new POManager(thrivePage);
		const communfunction = poManager.getCommonPageFunctions();
		
		await communfunction.navigateTopNavigateSection("Performance");
		const cookieValue = await thrivePage.context().cookies();
		const internal_url = `${envDetails.uri}/api/internal/surveys/list`;
		
		const survey_list = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});
		
		const total = survey_list.length;
		const startIdx = 0;
		const endIdx = Math.floor(total * 0.25);
		const segment = survey_list.slice(startIdx, endIdx);
		
		console.log(`\n[SEGMENT 1] Processing surveys ${startIdx} to ${endIdx} (${segment.length} surveys)`);
		await deleteSurveysSegmentWithBatching(segment, thrivePage, api_action, "SEGMENT 1");
	});

	test("Delete_Surveys_Segment_2_Middle_Front_To_Middle @deleteSurveys_Parallel", async ({ thrivePage }) => {
		const api_action = new APIActions();
		const poManager = new POManager(thrivePage);
		const communfunction = poManager.getCommonPageFunctions();
		
		await communfunction.navigateTopNavigateSection("Performance");
		const cookieValue = await thrivePage.context().cookies();
		const internal_url = `${envDetails.uri}/api/internal/surveys/list`;
		
		const survey_list = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});
		
		const total = survey_list.length;
		const startIdx = Math.floor(total * 0.25);
		const endIdx = Math.floor(total * 0.5);
		const segment = survey_list.slice(startIdx, endIdx);
		
		console.log(`\n[SEGMENT 2] Processing surveys ${startIdx} to ${endIdx} (${segment.length} surveys)`);
		await deleteSurveysSegmentWithBatching(segment, thrivePage, api_action, "SEGMENT 2");
	});

	test("Delete_Surveys_Segment_3_Middle_To_Middle_End @deleteSurveys_Parallel", async ({ thrivePage }) => {
		const api_action = new APIActions();
		const poManager = new POManager(thrivePage);
		const communfunction = poManager.getCommonPageFunctions();
		
		await communfunction.navigateTopNavigateSection("Performance");
		const cookieValue = await thrivePage.context().cookies();
		const internal_url = `${envDetails.uri}/api/internal/surveys/list`;
		
		const survey_list = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});
		
		const total = survey_list.length;
		const startIdx = Math.floor(total * 0.5);
		const endIdx = Math.floor(total * 0.75);
		const segment = survey_list.slice(startIdx, endIdx);
		
		console.log(`\n[SEGMENT 3] Processing surveys ${startIdx} to ${endIdx} (${segment.length} surveys)`);
		await deleteSurveysSegmentWithBatching(segment, thrivePage, api_action, "SEGMENT 3");
	});

	test("Delete_Surveys_Segment_4_Middle_End_To_End @deleteSurveys_Parallel", async ({ thrivePage }) => {
		const api_action = new APIActions();
		const poManager = new POManager(thrivePage);
		const communfunction = poManager.getCommonPageFunctions();
		
		await communfunction.navigateTopNavigateSection("Performance");
		const cookieValue = await thrivePage.context().cookies();
		const internal_url = `${envDetails.uri}/api/internal/surveys/list`;
		
		const survey_list = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
		});
		
		const total = survey_list.length;
		const startIdx = Math.floor(total * 0.75);
		const endIdx = total;
		const segment = survey_list.slice(startIdx, endIdx);
		
		console.log(`\n[SEGMENT 4] Processing surveys ${startIdx} to ${endIdx} (${segment.length} surveys)`);
		await deleteSurveysSegmentWithBatching(segment, thrivePage, api_action, "SEGMENT 4");
	});

	async function deleteSurveysSegmentWithBatching(surveys, thrivePage, api_action, segmentName) {
		const CONCURRENT_BATCH_SIZE = 10;
		const BATCH_PAUSE_SECONDS = 1;
		
		const results = { success: 0, failed: 0, failedSurveys: [] };
		const totalBatches = Math.ceil(surveys.length / CONCURRENT_BATCH_SIZE);
		
		for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
			const batchStart = batchIndex * CONCURRENT_BATCH_SIZE;
			const batchEnd = Math.min(batchStart + CONCURRENT_BATCH_SIZE, surveys.length);
			const batch = surveys.slice(batchStart, batchEnd);
			
			const batchResults = await Promise.allSettled(
				batch.map(survey => deleteSurveyWithRetry(survey, thrivePage, api_action, 1, 10))
			);
			
			batchResults.forEach((result, idx) => {
				if (result.status === 'fulfilled' && result.value.success) {
					results.success++;
					console.log(`[${segmentName}] ✓ "${batch[idx].name}"`);
				} else {
					results.failed++;
					const error = result.status === 'fulfilled' ? result.value.error : result.reason?.message || 'unknown';
					results.failedSurveys.push({ name: batch[idx].name, error });
					console.log(`[${segmentName}] ✗ "${batch[idx].name}" - ${error}`);
				}
			});
			
			if (batchIndex < totalBatches - 1) {
				await CommonUtils.sleep(BATCH_PAUSE_SECONDS);
			}
		}
		
		console.log(`\n[${segmentName}] Complete. Success: ${results.success}, Failed: ${results.failed}`);
		return results;
	}
	*/
	// test("Unit_Test2", async ({ thrivePage , browser}) => {
	//   const poManager = new POManager(thrivePage);
	//   const loginpage = poManager.getLoginPage();
	//   const peoplePage = poManager.getPeoplePage();
	//   const employeepage = poManager.getEmployeePage();
	//   const departmentpage = poManager.getDepartmentsPage();
	//   const jobtitlepage = poManager.getJobTitlePage();
	//   const importspage = poManager.getImportsPage();
	//   const propertiesPage = poManager.getPropertyPage();
	//   const managermissingPage = poManager.getManagerMissingPage();
	//   const smartlistPage = poManager.getSmartListPage();
	//   const surveyPage = poManager.getSurveyPage();
	//   const surveybuildeditpage = poManager.getSurveyBuildEditPage();
	//   const reademail = new ReadEmail();
	//   const api_action = new APIActions();
	//   const surveyeuipage = poManager.getSurveyEUIPage();
	//   const communfunction = poManager.getCommonPageFunctions();
	//   const suveyparticipantspage = poManager.getSurveyParticipantsPage();
	//   const reportsheaderpage = poManager.getReportsHederPage();
	//   const commonutils = new CommonUtils();
	//   const responsepage = poManager.getResponsePgae();
	//   await communfunction.navigateTopNavigateSection('Performance');
	// const time = commonutils.getCurrentTime();
	// });

	/**
	 * ARIA Snapshot Capture Utility
	 *
	 * Purpose: Captures ARIA snapshot of any element and saves it as YAML
	 *
	 * CONFIGURATION:
	 * 1. Set the URL you want to navigate to
	 * 2. Set the XPath locator for the element you want to capture
	 * 3. Set the output YAML filename
	 * 4. Optionally set credentials if different from default
	 *
	 * Run: npx playwright test unit-tests.spec.js --grep "Capture ARIA Snapshot"
	 */
	test("Capture ARIA Snapshot and Save to YAML @snapshot", async ({
		thrivePage,
	}) => {
		// ============================================================
		// CONFIGURATION - EDIT THESE VALUES
		// ============================================================

		// Target URL (the page you want to capture snapshot from)
		const TARGET_URL =
			"https://test-automation-2.s2.engagesparrow.com/configure/perform/74777/reports/subject-report/100613?viewType=ADMIN";

		// XPath locator for the element you want to capture
		const TARGET_XPATH =
			"(//div[contains(@class,'report-page')][.//p[normalize-space(.)='Detailed Feedback']])[1]";

		// Output YAML filename (will be saved in TSAP/Data/YAML_files/)
		const OUTPUT_FILENAME = "captured-aria-snapshot.yaml";

		// Switch to different user if needed (optional)
		// Set to null to use default admin login from fixture
		// Set to constants.goalsEmployee, constants.performanceManager, etc. to switch user
		const SWITCH_TO_USER = null; // e.g., constants.goalsEmployee

		// Wait time after navigation (seconds) - increase if page loads slowly
		const WAIT_AFTER_NAVIGATION = 5;

		// ============================================================
		// END CONFIGURATION
		// ============================================================

		const fs = await import("fs");
		const path = await import("path");
		const yaml = await import("js-yaml");
		const poManager = new POManager(thrivePage);
		const loginPage = poManager.getLoginPage();

		console.log("\n========================================");
		console.log("ARIA SNAPSHOT CAPTURE UTILITY");
		console.log("========================================\n");

		// Step 1: Login (fixture already logged in as admin)
		console.log("Step 1: Checking authentication...");
		if (SWITCH_TO_USER) {
			console.log(`Switching to user: ${SWITCH_TO_USER}`);
			await loginPage.navigateToHomepageAndSignout();
			await loginPage.login(thrivePage, SWITCH_TO_USER, envDetails.password);
		}
		console.log("✓ Authentication ready\n");

		// Step 2: Navigate to target URL
		console.log(`Step 2: Navigating to target URL...`);
		console.log(`URL: ${TARGET_URL}`);
		await PwActions.goTo(thrivePage, TARGET_URL);
		await CommonUtils.sleep(WAIT_AFTER_NAVIGATION);
		console.log("✓ Navigation successful\n");

		// Step 3: Wait for element to be visible
		console.log(`Step 3: Locating element...`);
		console.log(`XPath: ${TARGET_XPATH}`);
		const targetElement = thrivePage.locator(TARGET_XPATH);

		try {
			await targetElement.waitFor({ state: "visible", timeout: 15000 });
			console.log("✓ Element found and visible\n");
		} catch (error) {
			console.error("✗ Element not found or not visible!");
			console.error("Error:", error.message);

			// Take screenshot for debugging
			const screenshotPath = "debug-snapshot-capture.png";
			await thrivePage.screenshot({ path: screenshotPath, fullPage: true });
			console.log(`\nDebug screenshot saved to: ${screenshotPath}`);

			// Check if any similar elements exist
			const count = await thrivePage.locator(TARGET_XPATH).count();
			console.log(`Number of elements matching XPath: ${count}`);

			throw new Error("Target element not found. Check the XPath and URL.");
		}

		// Step 4: Capture ARIA snapshot
		console.log("Step 4: Capturing ARIA snapshot...");
		const ariaSnapshot = await targetElement.ariaSnapshot();
		console.log("✓ Snapshot captured\n");

		// Step 5: Display snapshot in console
		console.log("========================================");
		console.log("CAPTURED ARIA SNAPSHOT:");
		console.log("========================================\n");
		console.log(ariaSnapshot);
		console.log("\n========================================\n");

		// Step 6: Save to YAML file
		const outputDir = path.join(process.cwd(), "TSAP", "Data", "YAML_files");
		const outputPath = path.join(outputDir, OUTPUT_FILENAME);

		// Parse the ARIA snapshot to validate it's proper YAML
		let yamlContent;
		try {
			// Try to parse it as YAML to ensure it's valid
			const parsed = yaml.load(ariaSnapshot);
			// Re-serialize with consistent formatting
			yamlContent = yaml.dump(parsed, {
				indent: 2,
				lineWidth: -1,
				noRefs: true,
				quotingType: "'",
				forceQuotes: false,
			});
		} catch (error) {
			// If it's not valid YAML, save as-is
			console.log("Note: Snapshot is not in YAML format, saving as plain text");
			yamlContent = ariaSnapshot;
		}

		fs.writeFileSync(outputPath, yamlContent, "utf8");
		console.log(`Step 5: Snapshot saved successfully!`);
		console.log(`File location: ${outputPath}\n`);

		// Step 7: Provide usage instructions
		console.log("========================================");
		console.log("NEXT STEPS:");
		console.log("========================================");
		console.log(`1. Open: ${OUTPUT_FILENAME}`);
		console.log(`2. Copy the snapshot content`);
		console.log(`3. Paste it into your Performance_Report_Snapshot.yaml`);
		console.log(
			`4. Replace dynamic values with placeholders like {{GOAL_NAME_1}}`,
		);
		console.log(`5. Use regex patterns like "/.*/" for variable content\n`);

		// Additional info
		console.log("========================================");
		console.log("ELEMENT INFORMATION:");
		console.log("========================================");
		const boundingBox = await targetElement.boundingBox();
		if (boundingBox) {
			console.log(
				`Position: (${Math.round(boundingBox.x)}, ${Math.round(boundingBox.y)})`,
			);
			console.log(
				`Size: ${Math.round(boundingBox.width)}x${Math.round(boundingBox.height)} pixels`,
			);
		}
		const elementText = await targetElement.innerText().catch(() => "N/A");
		console.log(
			`Text content preview: ${elementText.substring(0, 100)}${elementText.length > 100 ? "..." : ""}`,
		);
		console.log("\n========================================\n");
	});

	/**
	 * Baseline Screenshot Capture Utility
	 *
	 * Automates UI screenshot collection for ThriveSparrow visual regression baselining.
	 * Highly configurable: choose target URL, XPath for element or page, folder, filename, full-screen or cropped, and user context.
	 * Adjust TARGET_XPATH, FULL_SCREEN, etc., to quickly update or create new baseline images for any page, UI state, or role.
	 * Use to maintain robust visual test coverage as application UI evolves.
	 *
	 * @example
	 * // Full page screenshot:
	 * const FULL_SCREEN = true; const TARGET_XPATH = null;
	 *
	 * // Specific element:
	 * const FULL_SCREEN = false; const TARGET_XPATH = "//button[text()='Submit']";
	 *
	 * Outputs file to TSAP/Data/Screenshots/<TARGET_FOLDER or root>.
	 */
	test("Baseline_Screenshot_Capture", async ({ thrivePage }) => {
		// ============================================================
		// CONFIGURATION - Modify these values as needed
		// ============================================================

		// Target URL to capture screenshot
		const TARGET_URL =
			"https://test-automation-2.s2.engagesparrow.com/configure/perform/74777/builder/edit";

		// Target element XPath. When FULL_SCREEN is true, set null for full page only.
		// When FULL_SCREEN is false, capture always uses locator.screenshot(): with an
		// XPath here that locator is used; if null, document body is used (set XPath for a tighter crop).
		// TIP: Large blank bands mean the matched node’s layout box is tall (flex/min-height).
		// toHaveScreenshot uses the SAME box for that locator — it does not auto-crop to “content only”.
		// Fix: use a tighter XPath, or set CAPTURE_DESCENDANT_SELECTOR to scope to an inner wrapper.
		// Options for targeting specific chart elements:
		// Horizontal Bar Chart: "//div[@id='456616']//div[@data-testid='box'][contains(@class,'idrQjbA')]"
		// Vertical Bar Chart: "//div[@id='456616']//div[contains(@class,'ikRAtcD')]//div[contains(@class,'ieaPhug')]//div[@data-testid='flex'][contains(@class,'idIWvzD')]"
		// Radar Chart: "//div[@id='456616']//div[contains(@class,'ijeESRr')]//div[contains(@class,'ihPuCCJ')]//div[@data-testid='flex'][contains(@class,'idIWvzD')]"
		// By content text: "//div[@id='view-page']//div[@data-testid='flex'][contains(.,'Team Skills')]"

		const TARGET_XPATH = "//button//span[text() = 'Start Survey']";

		// Optional: Playwright selector relative to TARGET_XPATH (omit when null). Narrows capture to a
		// descendant so you do not screenshot a full-height report-page shell. Verify in the app first.
		const CAPTURE_DESCENDANT_SELECTOR = null;

		// Screenshot filename
		const SCREENSHOT_FILENAME = "Subject-Report-bar-chart-baseline.png";

		// Subfolder under TSAP/Data/Screenshots (from playwright.config). null or "" = save at Screenshots root.
		// Must be a single segment (no /, \, or ..). Folder is created if it does not exist.
		const TARGET_FOLDER = "Engage"; // e.g. "Performance" or "Engage"

		// Overwrite existing file or create numbered version
		// true = overwrite existing file, false = create numbered version (1), (2), etc.
		const OVERWRITE_EXISTING = true;

		// Screenshot options
		// false = always locator.screenshot() (TARGET_XPATH or body if XPath null); options match toHaveScreenshot defaults (scale css, animations, caret)
		// true = full page via page.screenshot({ fullPage: true })
		const FULL_SCREEN = true;

		// Switch to different user if needed (optional)
		const SWITCH_TO_USER = null; // e.g., constants.goalsEmployee

		// Wait time after navigation (seconds)
		const WAIT_AFTER_NAVIGATION = 5;

		// ============================================================
		// END CONFIGURATION
		// ============================================================

		const resolveBaselineOutputDir = (baseDir, folderName) => {
			if (folderName == null || typeof folderName !== "string") {
				return baseDir;
			}
			const trimmed = folderName.trim();
			if (!trimmed) {
				return baseDir;
			}
			if (
				trimmed.includes("..") ||
				trimmed.includes("/") ||
				trimmed.includes("\\")
			) {
				throw new Error(
					`TARGET_FOLDER must be a single folder name (no path separators or ".."): got "${folderName}"`,
				);
			}
			return path.join(baseDir, trimmed);
		};

		const outputDir = resolveBaselineOutputDir(screenshotsDir, TARGET_FOLDER);
		const screenshotPath = path.join(outputDir, SCREENSHOT_FILENAME);

		const poManager = new POManager(thrivePage);
		const loginPage = poManager.getLoginPage();

		console.log("\n========================================");
		console.log("SCREENSHOT CAPTURE UTILITY");
		console.log("========================================");
		console.log(
			`Output directory: ${outputDir}${TARGET_FOLDER?.trim() ? ` (subfolder: ${TARGET_FOLDER.trim()})` : " (Screenshots root)"}`,
		);
		console.log("");

		// Step 1: Login (fixture already logged in as admin)
		console.log("Step 1: Checking authentication...");
		if (SWITCH_TO_USER) {
			console.log(`Switching to user: ${SWITCH_TO_USER}`);
			await loginPage.navigateToHomepageAndSignout();
			await loginPage.login(thrivePage, SWITCH_TO_USER, envDetails.password);
		}
		console.log("✓ Authentication ready\n");

		// Step 2: Navigate to target URL
		console.log(`Step 2: Navigating to target URL...`);
		console.log(`URL: ${TARGET_URL}`);
		await PwActions.goTo(thrivePage, TARGET_URL);
		await CommonUtils.sleep(WAIT_AFTER_NAVIGATION);
		console.log("✓ Navigation successful\n");

		// Step 3: Wait for element (if specified) and perform custom actions
		if (TARGET_XPATH) {
			console.log(`Step 3: Locating element...`);
			console.log(`XPath: ${TARGET_XPATH}`);
			const targetElement = thrivePage.locator(TARGET_XPATH).first();

			await targetElement.waitFor({ state: "visible", timeout: 15000 });
			console.log("✓ Element found and visible");
			await targetElement.scrollIntoViewIfNeeded();
			console.log("✓ Element scrolled into view\n");

			// ============================================================
			// CUSTOM DOM ACTIONS (Add your interactions here if needed)
			// ============================================================
			// Examples:
			// await targetElement.hover();
			// await targetElement.click();
			// await thrivePage.page.waitForTimeout(2000);
			// await thrivePage.page.locator('//button[@id="submit"]').click();
			// ============================================================
		}

		// Step 4: Capture screenshot
		console.log(`Step 4: Capturing screenshot...`);

		let screenshot;
		const locatorScreenshotOptions = {
			animations: "disabled",
			caret: "hide",
			// Align with expect().toHaveScreenshot() — locator.screenshot() alone defaults to "device"
			scale: "css",
		};

		if (FULL_SCREEN) {
			console.log("ℹ Capturing full page screenshot\n");
			screenshot = await thrivePage.screenshot({ fullPage: true });
		} else {
			let captureLocator = TARGET_XPATH
				? thrivePage.locator(TARGET_XPATH).first()
				: thrivePage.locator("body").first();

			if (TARGET_XPATH && CAPTURE_DESCENDANT_SELECTOR) {
				captureLocator = captureLocator
					.locator(CAPTURE_DESCENDANT_SELECTOR)
					.first();
				console.log(
					`ℹ Scoping capture to descendant: ${CAPTURE_DESCENDANT_SELECTOR}\n`,
				);
			}

			if (TARGET_XPATH) {
				console.log("ℹ Capturing TARGET_XPATH via locator.screenshot()\n");
				await captureLocator.waitFor({ state: "attached", timeout: 10000 });
				await captureLocator.scrollIntoViewIfNeeded();
			} else {
				console.log(
					"ℹ FULL_SCREEN is false and TARGET_XPATH is null — using document body via locator.screenshot()\n",
				);
				await captureLocator.waitFor({ state: "visible", timeout: 15000 });
				await captureLocator.scrollIntoViewIfNeeded();
			}

			await CommonUtils.sleep(1);
			screenshot = await captureLocator.screenshot(locatorScreenshotOptions);
		}

		// Ensure output directory exists (creates subfolder under Screenshots if needed)
		fs.mkdirSync(outputDir, { recursive: true });

		// Determine final screenshot path based on OVERWRITE_EXISTING flag
		let finalScreenshotPath = screenshotPath;
		if (!OVERWRITE_EXISTING && fs.existsSync(screenshotPath)) {
			const ext = path.extname(SCREENSHOT_FILENAME);
			const nameWithoutExt = path.basename(SCREENSHOT_FILENAME, ext);
			let counter = 1;

			// Find the next available number
			while (
				fs.existsSync(
					path.join(outputDir, `${nameWithoutExt}(${counter})${ext}`),
				)
			) {
				counter++;
			}

			finalScreenshotPath = path.join(
				outputDir,
				`${nameWithoutExt}(${counter})${ext}`,
			);
			console.log(
				`ℹ File already exists, creating new version: ${nameWithoutExt}(${counter})${ext}\n`,
			);
		} else if (OVERWRITE_EXISTING && fs.existsSync(screenshotPath)) {
			console.log(`ℹ Overwriting existing file: ${SCREENSHOT_FILENAME}\n`);
		}

		// Save screenshot
		fs.writeFileSync(finalScreenshotPath, screenshot);
		const savedFileName = path.basename(finalScreenshotPath);
		console.log("Screenshot captured.");
		console.log(`  Name:     ${savedFileName}`);
		console.log(`  Location: ${finalScreenshotPath}`);
		console.log("");

		console.log("========================================");
		console.log("SCREENSHOT CAPTURE COMPLETE");
		console.log("========================================\n");
	});
	test("Bootstrap Slack Auth Session", async ({ browser }) => {
		const context = await browser.newContext();
		const page = await context.newPage();

		// Open Slack login
		await page.goto("https://slack.com/signin");

		// Pause so you can login manually + solve captcha
		console.log("👉 Login to Slack manually, then resume test");
		await page.pause();

		// Save Slack authenticated session
		await context.storageState({ path: "slackAuth.json" });

		console.log("✅ Slack session saved as slackAuth.json");
	});
});

import { resolve } from "node:path";
import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import { testConfig } from "./testconfig.js";

const testPath = resolve("./TSAP/Tests/WebApp_Testing");
const screenshotsDir = resolve("./TSAP/Data/Screenshots");
dotenv.config();

let ENV = process.env.ENV;

if (!ENV || !["qa", "qa_S2"].includes(ENV)) {
	console.log(
		`Provide the correct environment value like "npx cross-env ENV=qa|qa_S2"`,
	);
}

ENV = "qa";

// Debug environment variables
console.log("Environment variables loaded:");
console.log("WORKERS:", process.env.WORKERS);
console.log("CURRENT_SHARD:", process.env.CURRENT_SHARD);
console.log("TOTAL_SHARDS:", process.env.TOTAL_SHARDS);
console.log("ENV:", process.env.ENV);

// Get sharding configuration from environment
const currentShard = process.env.CURRENT_SHARD
	? parseInt(process.env.CURRENT_SHARD)
	: undefined;
const totalShards = process.env.TOTAL_SHARDS
	? parseInt(process.env.TOTAL_SHARDS)
	: undefined;

export default defineConfig({
	// Configure sharding if both CURRENT_SHARD and TOTAL_SHARDS are set
	shard:
		currentShard && totalShards
			? { current: currentShard, total: totalShards }
			: undefined,
	testDir: resolve("./TSAP/Tests/WebApp_Testing"),
	// Configure snapshot path - all screenshots in single Screenshots folder
	snapshotDir: resolve("./TSAP/Data/Screenshots"),
	snapshotPathTemplate: "{snapshotDir}/{arg}{ext}",
	// globalSetup: resolve("./global-setup"),
	// globalTeardown: resolve("./global-teardown"),
	timeout: (Number.parseInt(process.env.TIMEOUT) || 1800) * 1000,
	expect: {
		timeout: 10000, // Increased expect timeout
		toHaveScreenshot: {
			...(process.env.VISUAL_TEST_MAX_DIFF_PIXELS && {
				maxDiffPixels: Number.parseInt(process.env.VISUAL_TEST_MAX_DIFF_PIXELS),
			}),
			...(process.env.VISUAL_TEST_MAX_RATIO_DIFF_PIXELS && {
				maxDiffPixelRatio: Number.parseFloat(
					process.env.VISUAL_TEST_MAX_RATIO_DIFF_PIXELS,
				),
			}),
		},
	},
	fullyParallel: JSON.parse(process.env.FULL_PARALLEL.toLowerCase()),
	workers: Number.parseInt(process.env.WORKERS, 10),
	retries: Number.parseInt(process.env.RETRY),
	// Add Node.js options to increase memory limit
	metadata: {
		nodeOptions:
			"--max-old-space-size=2048 --optimize-for-size --gc-interval=100",
	},
	globalSetup: resolve("./global-setup"),
	globalTeardown: resolve("./global-teardown"),
	reporter: [
		["dot"], // Changed from "list" to "dot" for minimal output
		[
			"allure-playwright",
			{
				detail: true,
				outputFolder: "my-allure-results",
				suiteTitle: false,
				addSteps: true,
				addConsoleLogs: true,
				addAttachments: true,
				categories: [
					{
						name: "Network/Timeout Issues",
						messageRegex:
							".*(network|timeout|connection|fetch|request|response).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*Network.*",
					},
					{
						name: "Element Issues",
						messageRegex:
							".*(element|selector|locator|not found|not visible|detached).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*Element.*",
					},
					{
						name: "Navigation Issues",
						messageRegex: ".*(navigation|page|route|redirect|404|403).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*Navigation.*",
					},
					{
						name: "Data/State Issues",
						messageRegex:
							".*(data|state|undefined|null|validation|expected|received).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*State.*",
					},
					{
						name: "Authentication Issues",
						messageRegex:
							".*(auth|login|session|token|unauthorized|permission).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*Auth.*",
					},
					{
						name: "Performance Issues",
						messageRegex: ".*(slow|performance|timeout|memory|cpu|load).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*Performance.*",
					},
					{
						name: "API Issues",
						messageRegex: ".*(api|endpoint|service|backend|500|502|503).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*API.*",
					},
					{
						name: "UI Issues",
						messageRegex: ".*(render|display|style|css|layout|visual).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*UI.*",
					},
					{
						name: "Test Setup Issues",
						messageRegex: ".*(setup|fixture|before|after|environment).*",
						matchedStatuses: ["failed"],
						traceRegex: ".*Setup.*",
					},
					{
						name: "Flaky Tests",
						messageRegex: ".*",
						matchedStatuses: ["failed"],
						traceRegex: ".*retry.*",
					},
				],
				reportName: "Thrive UI Automation Test Report",
				labels: [
					{
						name: "epic",
						value: "UI Automation",
					},
					{
						name: "framework",
						value: "Playwright",
					},
				],
				environmentInfo: {
					Environment: process.env.ENVIRONMENT || "qa",
					Browser: process.env.BROWSER || "chromium",
				},
			},
		],
	],
	use: {
		baseURL: testConfig[process.env.ENV],
		actionTimeout: Number.parseInt(process.env.ACTION_TIMEOUT) * 1000,
		navigationTimeout: 120000, // Increased navigation timeout
		launchOptions: {
			slowMo: 2000,
			devtools: false,
			// Add Chrome-specific memory options for Jenkins environment
			args: [
				"--max_old_space_size=4096",
				"--max-old-space-size=4096",
				"--js-flags=--expose-gc --optimize-for-memory",
				"--disable-background-timer-throttling",
				"--disable-backgrounding-occluded-windows",
				"--disable-renderer-backgrounding",
				"--disable-features=TranslateUI",
				"--disable-ipc-flooding-protection",
				"--js-flags=--expose-gc",
				"--single-process",
				"--no-zygote",
				"--disable-dev-shm-usage",
				"--disable-gpu",
				"--no-sandbox",
			],
		},
		trace: "on-first-retry",
	},
	projects: [
		{
			name: process.env.BROWSER, // Dynamically select browser
			use: {
				browserName: process.env.BROWSER.toLowerCase(), // Convert to lowercase for Playwright compatibility
				channel: process.env.BROWSER.toLowerCase(),
				baseURL: testConfig[ENV],
				headless: JSON.parse(process.env.HEADLESS.toLowerCase()),
				viewport: { width: 1512, height: 982 },
				ignoreHTTPSErrors: true,
				acceptDownloads: true,
				screenshot: "only-on-failure",
				video: "off",
				trace: "retain-on-failure",
				permissions: ["local-network-access"],
				launchOptions: {
					slowMo: 0,
					args: [
						"--memory-pressure-off",
						"--disable-background-networking",
						"--disable-default-apps",
					],
				},
				contextOptions: {
					reducedMotion: "reduce",
					forcedColors: "none",
					strictSelectors: false,
				},
			},
		},
	],
});

export { screenshotsDir };

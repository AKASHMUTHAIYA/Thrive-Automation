import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "@playwright/test";
const folderPath = "./my-allure-results";
const dirname = path.dirname(fileURLToPath(import.meta.url));
const log_path = path.join(dirname, "/playwright-actions.log");
export default async () => {
	//clear playwright-actions.log
	fs.writeFileSync(log_path, "");
	//Launch browser and open a new context
	const browser = await chromium.launch({
		headless: true, // Set headless to false to open the browser window
	});
	const context = await browser.newContext();
	try {
		// Start tracing after initializing the context
		await context.tracing.start({
			screenshots: true,
			snapshots: true,
			categories: ["*"],
		});
		// Stop tracing and close the browser at the end of the test
		await context.tracing.stop({
			path: "./test-results/successful-test-trace.zip",
		});
		await browser.close();
	} catch (error) {
		console.error(error.message);
		await context.tracing.stop({
			path: "./test-results/failed-test-trace.zip",
		});
		await browser.close();
		throw error;
	}
};

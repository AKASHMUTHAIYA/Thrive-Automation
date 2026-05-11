import fs from "fs";
import logger from "playwright-framework/Core/logger.js";
import { SessionValidator } from "../Shared_Functions/external-services.js";
import { test as base } from "./application-setup.js";

/**
 * Stable fingerprint for slack.com cookies (values change after OAuth refresh).
 * @param {Array<{ domain?: string; name?: string; value?: string }>} cookies
 */
function fingerprintSlackCookies(cookies) {
	return cookies
		.filter((c) => c.domain && String(c.domain).includes("slack.com"))
		.map((c) => `${c.name}|${c.domain}|${c.value ?? ""}`)
		.sort()
		.join("\n");
}

export const test = base.extend({
	slackAuthPage: async ({ thrivePage }, use, testInfo) => {
		const page = thrivePage;

		const authFilePath = process.env.SLACK_AUTH_FILE || "./slackAuth.json";

		if (!fs.existsSync(authFilePath)) {
			throw new Error(`
SLACK AUTH SESSION NOT FOUND

Missing file: ${authFilePath}

Bootstrap once using:
npx playwright test TSAP/Tests/WebApp_Testing/Core_Test_Cases/test.spec.js

Login to Slack manually when prompted.
Session will be reused for future runs.
`);
		}

		const validation = SessionValidator.validateSession(authFilePath);

		if (!validation.valid) {
			SessionValidator.printValidationResult(validation);
			throw new Error(
				`Invalid Slack session - run bootstrap test first:\n${validation.errors.join("\n")}`,
			);
		}

		logger.info(
			`✓ Loading Slack session: ${validation.cookieCount} cookies, ${validation.fileAgeInDays} days old`,
		);

		validation.warnings.forEach((w) => logger.warn(`Slack session: ${w}`));

		const slackCookies = validation.cookies.filter(
			(c) => c.domain && String(c.domain).includes("slack.com"),
		);

		logger.info(
			`Injecting ${slackCookies.length} Slack cookies into slackAuthPage context`,
		);

		const initialSlackFingerprint = fingerprintSlackCookies(slackCookies);

		await page.context().addCookies(slackCookies);

		try {
			await use(page);
		} finally {
			const shouldPersistSlackSession =
				testInfo.status === "passed" &&
				testInfo.tags.some((t) => /^@?slackSessionPersist$/.test(String(t)));
			if (shouldPersistSlackSession) {
				const currentCookies = await page.context().cookies();
				const currentSlackCookies = currentCookies.filter(
					(c) => c.domain && String(c.domain).includes("slack.com"),
				);
				const currentFingerprint = fingerprintSlackCookies(currentSlackCookies);

				if (currentFingerprint !== initialSlackFingerprint) {
					await page.context().storageState({ path: authFilePath });
					logger.info("✓ Slack session updated - OAuth flow refreshed cookies");
				} else {
					logger.debug("Slack session unchanged - skipping update");
				}
			}
		}
	},
});

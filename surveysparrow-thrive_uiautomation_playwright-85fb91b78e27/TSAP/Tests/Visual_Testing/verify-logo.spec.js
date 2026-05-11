import { expect, test } from "@playwright/test";
import { POManager } from "../../../Pages/POManager";
import { testConfig } from "../../Data/login_data.mjs";

test.describe("TC_VISUAL_Verify Logo", () => {
	test("VISUAL TEST", async ({ page }) => {
		const poManager = new POManager(page);
		const loginpage = poManager.getLoginPage();
		await loginpage.navigateToUrl(testConfig.url);
		await loginpage.validateLogo();
	});
});

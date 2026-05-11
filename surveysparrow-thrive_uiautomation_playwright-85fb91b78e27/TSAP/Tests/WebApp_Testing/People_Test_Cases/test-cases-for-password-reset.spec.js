import { test } from "@playwright/test";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { envDetails } from "../../../Data/test-data.js";
import { POManager } from "../../../Pages/POManager.js";

test.describe("Verifying reset password mail functionality is working", () => {
	let resetPasswordURL;
	let newPassword;

	test("Verify reset password mail is triggering  @Regression @productionSanity", async ({
		page,
		browser,
	}) => {
		await allure.description(
			"This test trigger forgot password mail in the login page and verify the user is able to change his password",
		);

		const poManager = new POManager(page);
		const loginPage = poManager.getLoginPage();

		await allure.step("Navigates to login page", async () => {
			await loginPage.navigateToUrl(envDetails.uri);
		});

		await allure.step(
			"Send Forgot Password Mail and return the URL to change password",
			async () => {
				resetPasswordURL =
					await loginPage.sendForgotPasswordMailandReturnTheURL(
						envDetails.sampleUserMail,
					);
			},
		);

		await allure.step(
			"Navigate to the reset url and set new user password",
			async () => {
				newPassword = await loginPage.setOrResetPassword(
					resetPasswordURL,
					browser,
					"reset",
				);
				expect(newPassword).toBeDefined();
			},
		);
		await allure.step(
			"Login to the application with the new password, validate the logged in user and sign out",
			async () => {
				await loginPage.navigateToUrl(envDetails.uri);
				await loginPage.login(page, envDetails.sampleUserMail, newPassword);
				await loginPage.validateLoggedInUserAndSignOut(
					page,
					envDetails.sampleUserName,
				);
			},
		);
	});
});

import { test, expect } from "@playwright/test";
import { LoginPage } from "../../Pages/login-page.js";

test.describe("Login Functionality - Sample Tests", () => {
	let loginPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		await test.step("Navigate to login page", async () => {
			await page.goto(process.env.BASE_URL || "https://app.thrive.surveysparrow.com/");
		});
	});

	test("TC-001: Valid Login with Correct Credentials", async ({ page }) => {
		await test.step("Enter valid email", async () => {
			await loginPage.enterEmail("test@surveysparrow.com");
		});

		await test.step("Enter valid password", async () => {
			await loginPage.enterPassword("TestPassword123!");
		});

		await test.step("Click login button", async () => {
			await loginPage.clickLoginButton();
		});

		await test.step("Verify successful login - dashboard visible", async () => {
			await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
		});

		await test.step("Verify user is logged in", async () => {
			const dashboardElement = page.locator("[data-testid='dashboard-header']");
			await expect(dashboardElement).toBeVisible();
		});
	});

	test("TC-002: Login with Invalid Credentials Shows Error", async ({ page }) => {
		await test.step("Enter invalid email", async () => {
			await loginPage.enterEmail("invalid@example.com");
		});

		await test.step("Enter invalid password", async () => {
			await loginPage.enterPassword("WrongPassword123");
		});

		await test.step("Click login button", async () => {
			await loginPage.clickLoginButton();
		});

		await test.step("Verify error message appears", async () => {
			const errorMessage = page.locator("[data-testid='error-message']");
			await expect(errorMessage).toBeVisible({ timeout: 5000 });
		});

		await test.step("Verify error message text", async () => {
			const errorMessage = page.locator("[data-testid='error-message']");
			const errorText = await errorMessage.textContent();
			expect(errorText).toContain("Invalid credentials");
		});

		await test.step("Verify still on login page", async () => {
			await expect(page).toHaveURL(/.*login/);
		});
	});
});

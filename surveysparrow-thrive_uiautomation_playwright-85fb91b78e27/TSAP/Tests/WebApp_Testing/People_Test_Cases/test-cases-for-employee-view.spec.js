import { allure } from "allure-playwright";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants.js";
import { envDetails } from "../../../Data/test-data.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";

test.describe("Verifying editing employee profile information from employee view page", () => {
	test("Verify editing employee profile information from employee view page   @productionSanity @Regression", async ({
		page,
	}) => {
		await allure.description(
			"This test verifies the employees details are updated successfully in employee view",
		);
		const poManager = new POManager(page);
		const loginPage = poManager.getLoginPage();
		const empProfilePage = poManager.getEmployeesProfilePage();
		const profileInformation =
			await empProfilePage.generateRandomProfileInformation();

		await allure.step(
			"Navigates to login page and login as employee",
			async () => {
				await loginPage.navigateToUrl(envDetails.uri);
				await loginPage.login(
					page,
					constants.testEmail,
					constants.testPassword,
				);
			},
		);

		await allure.step(
			"Go to edit profile and update employees profile information",
			async () => {
				await PwActions.waitAndClick(page, loginPage.btnProfile);
				await PwActions.waitAndClick(page, loginPage.btnEditProfile);
				await empProfilePage.updateProfileInformation(profileInformation);
			},
		);

		await allure.step(
			"Verify employee profile information is updated",
			async () => {
				await empProfilePage.verifyProfileInformation(profileInformation);
			},
		);
	});

	test("TC_02_Verify employee view Your Team shows Reportees Peers and Department data @Regression @employee_view @your_team", async ({
		thrivePage,
	}) => {
		await allure.description(
			"This test verifies that the Your Team section has Reportees, Peers, and Department tabs with employee data",
		);
		const poManager = new POManager(thrivePage);
		const loginPage = poManager.getLoginPage();
		const empProfilePage = poManager.getEmployeesProfilePage();

		await allure.step(
			"Navigate to login and switch to employee view after login",
			async () => {
				await loginPage.switchToEmployee(thrivePage);
			},
		);

		await allure.step(
			"Navigate to Your Team and verify Reportees Peers and Department data",
			async () => {
				await PwActions.waitAndClick(thrivePage, empProfilePage.lnkYourTeam);
				await empProfilePage.verifyYourTeamSubTabsAndEmployeeData();
			},
		);
	});
});

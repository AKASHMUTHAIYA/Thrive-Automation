import { allure } from "allure-playwright";
import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";


test.beforeEach(async ({ thrivePage }) => {
	const poManager = new POManager(thrivePage);
	const empPage = poManager.getEmployeePage();
	const peoplePage = poManager.getPeoplePage();
	const guestsPage = poManager.getGuestsPage();
	await allure.step("Navigate to people section", async () => {
		await empPage.navigateToTopNavSection("People");
	});
	await peoplePage.navigateToSections("Guests");
});

test.describe("Verify adding Guest Manually and Deactivating Guest", () => {
	test("TC_01_Add Guest Manually and deactivate Guest @Regression @productionSanity @guest", async ({ thrivePage }) => {
		await allure.description(
			"This test attempts to add guest manually with all required details and verify the guest is added successfully"
		);

		const poManager = new POManager(thrivePage);
		const guestsPage = poManager.getGuestsPage();
		const commonfunction = poManager.getCommonPageFunctions();

		// Generate random values for guest
		const randomNum = CommonUtils.getRandomIntInclusive(10000, 99999);
		const guestName = `Guest_${CommonUtils.generateRandomText(5)}`;
		const guestEmail = `guest_${CommonUtils.generateRandomText(5)}@example.com`;
		const secondaryEmail = `secondary_${CommonUtils.generateRandomText(5)}@example.com`;

		await allure.step("Add guest manually with all details", async () => {
			await CommonUtils.sleep(2);
			await guestsPage.addGuestManually(0, {
				name: guestName,
				email: guestEmail,
				secondaryEmail: secondaryEmail
			});
		});

		await allure.step("Verify guest is added successfully", async () => {
			await guestsPage.searchGuest(guestName,"Active");
			await guestsPage.verifyGuestExistence(guestName);
		});

		await allure.step("Deactivate the guest", async () => {
			await guestsPage.deactivateGuest(guestName);
		});

		await allure.step("Verify guest is deactivated", async () => {
			await guestsPage.searchGuest(guestName,"Deactivated");
			await guestsPage.verifyGuestExistence(guestName);
			
		});
	});
});

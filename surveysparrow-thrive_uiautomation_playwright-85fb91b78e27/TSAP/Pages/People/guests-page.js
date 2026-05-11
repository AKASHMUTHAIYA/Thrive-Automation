import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
import { PeoplePage } from "./people-page";
import { EmployeesPage } from "./employees-page";
import { expect } from "@playwright/test";
import logger from "playwright-framework/Core/logger.js";

export class GuestsPage {
	constructor(page) {
		this.page = page;
		this.commonfunction = new CommonPageFunctions(this.page);
		this.commonutils = new CommonUtils();
		this.peoplePage = new PeoplePage(this.page);
		this.employeesPage = new EmployeesPage(this.page);

		// Search and filter elements
		this.txtSearchGuest = "//input[@placeholder='Search guests']";
		this.txtSearchProperty = "//input[@placeholder='Search']";
		this.btnFilterBy = "//div[@role='menuitem']/p";

		// Action buttons
		this.btnSave = "//*[text()='Save Changes' or text()='Save to directory']";
		this.btnCancel = "//button[text()='Cancel']";
		this.tableEdit = (guestName) => `//td//p[text() = '${guestName}']`;
		this.btnDelete = "//button[@aria-label='Delete Guest']";
		this.btnYesProceed =
			"//div[@role='alertdialog']//button//span[text() = 'Yes, Proceed']";
		this.btnSearchGuest = "//button[contains(@aria-label,'Search')]";
		this.btnDeactivate =
			"//button[@data-testid='all-employees_icon-button_activate-deactivate']";
		this.btnAddGuests = "//span[text()='Add Guests']";
		this.btnAddManually = "//div[text()='Add Manually']";

		// Download CSV selectors
		this.btnDownload = "//button[@aria-label='options']";
		this.btnDownloadCSV = "//div[@role='menuitem']/p[text() = 'Export as CSV']";

		// Convert to Employees selectors
		this.btnConvertToEmployees =
			"//button/span[text()= 'Convert to Employees']";
		this.btnProceedMoving =
			"//div[@role = 'dialog']//button//span[text() = 'Proceed Moving']";
		this.toasterConvertedSuccessfully =
			"//li[@role='status']//div[text() = '1 guest users have been moved to Employees successfully.']";

		// Guest list elements
		this.guestCheckbox = (guestName) =>
			`//p[text()='${guestName}']/ancestor::tr//button[@role='checkbox']`;
		this.guestName = (guestName) => `//p[text()='${guestName}']`;

		// Status and toaster messages
		this.toasterSuccessfullyCreated =
			"//div[text()='1 Guests added successfully']";
		this.toasterSuccessfullyDeactivated =
			"//div[text()='Successfully deactivated 1 guest']";
		this.toasterSuccessfullyUpdated = "//div[text()='Successfully Updated']";
		this.txtGuestName = (rowNum) =>
			`//input[@name='employees.${rowNum}.fullName']`;
		this.txtGuestEmail = (rowNum) =>
			`//input[@name='employees.${rowNum}.email']`;
		this.txtGuestSecondaryEmail = (rowNum) =>
			`//input[@name='employees.${rowNum}.secondaryEmail']`;

		this.GuestNameEdit = `//p[text()='Full Name']/ancestor::div[2]/div[2]//input`;
		this.GuestNickNameEdit = `//p[text()='Nick Name']/ancestor::div[2]/div[2]//input`;
		this.GuestSecondaryEmailEdit = `//p[text()='Secondary Email']/ancestor::div[2]/div[2]//input`;
	}

	/**
	 * Navigates to a specific sub-section within the guests page
	 *
	 * @param {string} sectionName - The section to navigate to (e.g., "Active", "Deactivated", "Invite Not Sent")
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.navigateToSubTopSection("Active");
	 */

	async navigateToSubTopSection(sectionName) {
		this.btnSubTopSection = `//div//p[text()='${sectionName}']`;
		await PwActions.click(this.page, this.btnSubTopSection);
	}

	/**
	 * Adds a new guest manually by filling out the guest form with provided details
	 *
	 * @param {number} rowNum - The row number/index for the guest form (typically 0 for single guest)
	 * @param {Object} guestDetails - Object containing guest information
	 * @param {string} guestDetails.name - The full name of the guest
	 * @param {string} guestDetails.email - The primary email address of the guest
	 * @param {string} [guestDetails.secondaryEmail] - Optional secondary email address
	 * @returns {Promise<Object>} Returns the guest details that were added
	 *
	 * @example
	 * await guestsPage.addGuestManually(0, {
	 *     name: "John Doe",
	 *     email: "john.doe@example.com",
	 *     secondaryEmail: "john.secondary@example.com"
	 * });
	 */

	async addGuestManually(rowNum, guestDetails) {
		await PwActions.click(this.page, this.btnAddGuests);
		await PwActions.click(this.page, this.btnAddManually);
		await CommonUtils.sleep(2);
		await PwActions.fill(
			this.page,
			this.txtGuestName(rowNum),
			guestDetails.name,
		);
		await PwActions.fill(
			this.page,
			this.txtGuestEmail(rowNum),
			guestDetails.email,
		);

		if (guestDetails.secondaryEmail) {
			await PwActions.fill(
				this.page,
				this.txtGuestSecondaryEmail(rowNum),
				guestDetails.secondaryEmail,
			);
		}

		await PwActions.click(this.page, this.btnSave);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, this.toasterSuccessfullyCreated);
		return guestDetails;
	}

	/**
	 * Edits an existing guest's details by updating their information.
	 *
	 * @param {string} guestName - The name of the guest to edit.
	 * @param {Object} updatedDetails - An object containing updated guest information.
	 * @param {string} updatedDetails.name - The updated full name for the guest.
	 * @param {string} updatedDetails.nickName - The updated nickname for the guest.
	 * @param {string} updatedDetails.secondaryEmail - The updated secondary email for the guest.
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.editGuest("John Doe", {
	 *   name: "John Doe Edited",
	 *   nickName: "JD",
	 *   secondaryEmail: "john.edited.secondary@example.com"
	 * });
	 */

	async editGuest(guestName, updatedDetails) {
		await this.selectGuest(guestName);
		await CommonUtils.sleep(2);
		await PwActions.waitAndClick(this.page, this.tableEdit(guestName));
		await PwActions.clearAndFill(
			this.page,
			this.GuestNameEdit,
			updatedDetails.name,
		);
		await PwActions.clearAndFill(
			this.page,
			this.GuestNickNameEdit,
			updatedDetails.nickName,
		);
		await PwActions.clearAndFill(
			this.page,
			this.GuestSecondaryEmailEdit,
			updatedDetails.secondaryEmail,
		);
		await PwActions.click(this.page, this.btnSave);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, this.toasterSuccessfullyUpdated);
	}

	/**
	 * Selects a guest by clicking on their checkbox in the guest list
	 *
	 * @param {string} guestName - The name of the guest to select
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.selectGuest("John Doe");
	 */

	async selectGuest(guestName) {
		const guestCheckbox = this.guestCheckbox(guestName);
		await PwActions.click(this.page, guestCheckbox);
	}

	/**
	 * Deactivates a guest by selecting them and clicking the deactivate button
	 *
	 * @param {string} guestName - The name of the guest to deactivate
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.deactivateGuest("John Doe");
	 */

	async deactivateGuest(guestName) {
		await this.selectGuest(guestName);
		await PwActions.click(this.page, this.btnDeactivate);
		await PwActions.click(this.page, this.btnYesProceed);
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(
			this.page,
			this.toasterSuccessfullyDeactivated,
		);
		await PwActions.waitTillElementDisappear(
			this.page,
			this.guestName(guestName),
			15000,
		);
	}

	/**
	 * Searches for a guest by name within a specific section
	 *
	 * @param {string} guestName - The name of the guest to search for
	 * @param {string} sectionName - The section to search in (e.g., "Active", "Deactivated", "Invite Not Sent")
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.searchGuest("John Doe", "Active");
	 */

	async searchGuest(guestName, sectionName) {
		await this.navigateToSubTopSection(sectionName);

		const isSearchButtonAvailable = await PwActions.elementIsVisible(
			this.page,
			this.txtSearchGuest,
		);
		await CommonUtils.sleep(2);
		if (isSearchButtonAvailable) {
			await PwActions.clear(this.page, this.txtSearchGuest);
		} else {
			await PwActions.click(this.page, this.btnSearchGuest);
		}
		await PwActions.fill(this.page, this.txtSearchGuest, guestName);
		await this.commonfunction.search(guestName);
	}

	/**
	 * Clears the search filter to show all guests
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.clearSearch();
	 */

	async clearSearch() {
		const isSearchVisible = await PwActions.elementIsVisible(
			this.page,
			this.txtSearchGuest,
		);
		if (isSearchVisible) {
			await PwActions.clear(this.page, this.txtSearchGuest);
			await CommonUtils.sleep(1);
		}
	}

	/**
	 * Verifies that a guest exists in the current view
	 *
	 * @param {string} guestName - The name of the guest to verify
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.verifyGuestExistence("John Doe");
	 */

	async verifyGuestExistence(guestName) {
		await PwActions.waitTillVisible(this.page, this.guestName(guestName));
		await PwActions.verifyElementIsPresent(
			this.page,
			this.guestName(guestName),
		);
	}

	/**
	 * Converts a guest to an employee
	 *
	 * @param {string} guestName - The name of the guest to convert
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.convertGuestToEmployee("John Doe");
	 */

	async convertGuestToEmployee(guestName) {
		await this.peoplePage.navigateToSections("Guests");
		await this.searchGuest(guestName, "Active");
		await this.selectGuest(guestName);
		await PwActions.waitAndClick(this.page, this.btnConvertToEmployees);
		await PwActions.waitAndClick(this.page, this.btnProceedMoving);
		await PwActions.waitTillVisible(
			this.page,
			this.toasterConvertedSuccessfully,
		);
		await CommonUtils.sleep(2);
	}

	/**
	 * Downloads the guests list as CSV file
	 *
	 * @returns {Promise<string>} - Path to the downloaded CSV file
	 *
	 * @example
	 * const filePath = await guestsPage.downloadGuestsCSV();
	 */

	async downloadGuestsCSV() {
		await PwActions.click(this.page, this.btnDownload);
		await CommonUtils.sleep(2);
		const result = await this.commonfunction.downloadFileAndReturnPath(
			this.page,
			this.btnDownloadCSV,
			30000,
		);
		logger.info(`Downloaded guests CSV to: ${result.filePath}`);
		return result.filePath;
	}

	/**
	 * Verifies guest details in the downloaded CSV file
	 *
	 * @param {string} csvFilePath - Path to the downloaded CSV file
	 * @param {Array<Object>} expectedGuests - Array of guest objects to verify
	 * @param {string} expectedGuests[].name - Expected guest name (Full Name column)
	 * @param {string} expectedGuests[].email - Expected guest email (Email column)
	 * @param {string} [expectedGuests[].secondaryEmail] - Expected secondary email (Secondary Email column)
	 * @param {string} [expectedGuests[].status="INVITED"] - Expected status (Status column)
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await guestsPage.verifyGuestDetailsInCSV(filePath, [
	 *     { name: "John Doe_edited", email: "john@test.com", secondaryEmail: "secondary_john@test.com", status: "INVITED" }
	 * ]);
	 */

	async verifyGuestDetailsInCSV(csvFilePath, expectedGuests) {
		const csvData = await this.commonutils.readCSVFile(csvFilePath);
		const csvRows = csvData.data;

		const expectedColumns = [
			"Full Name",
			"Nick Name",
			"Email",
			"Status",
			"Secondary Email",
		];
		const downloadedColumns = Object.keys(csvRows[0]);
		for (const column of expectedColumns) {
			expect(
				downloadedColumns,
				`Expected column "${column}" not found in downloaded CSV. Found columns: ${downloadedColumns.join(", ")}`,
			).toContain(column);
		}

		for (const expectedGuest of expectedGuests) {
			const matchingRow = csvRows.find(
				(row) =>
					row["Full Name"]?.trim() === expectedGuest.name?.trim() &&
					row["Email"]?.trim() === expectedGuest.email?.trim(),
			);

			expect(
				matchingRow,
				`Guest not found in CSV: ${expectedGuest.name} (${expectedGuest.email})`,
			).toBeTruthy();

			const expectedStatus = expectedGuest.status || "INVITED";
			expect(
				matchingRow["Status"]?.trim().toUpperCase(),
				`Status mismatch for guest ${expectedGuest.name}. Expected: ${expectedStatus}, Found: ${matchingRow["Status"]}`,
			).toBe(expectedStatus.toUpperCase());

			if (expectedGuest.nickName) {
				expect(
					matchingRow["Nick Name"]?.trim(),
					`Nick Name mismatch for guest ${expectedGuest.name}. Expected: ${expectedGuest.nickName}, Found: ${matchingRow["Nick Name"]}`,
				).toBe(expectedGuest.nickName);
			}

			if (expectedGuest.secondaryEmail) {
				expect(
					matchingRow["Secondary Email"]?.trim(),
					`Secondary email mismatch for guest ${expectedGuest.name}. Expected: ${expectedGuest.secondaryEmail}, Found: ${matchingRow["Secondary Email"]}`,
				).toBe(expectedGuest.secondaryEmail);
			}

			logger.info(
				`Verified guest in CSV: ${expectedGuest.name} - Status: ${matchingRow["Status"]}`,
			);
		}

		logger.info(`Successfully verified ${expectedGuests.length} guests in CSV`);
	}
}

import { expect, test } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
class JobTitlePage {
	constructor(page) {
		this.page = page;
		this.commonFunctions = new CommonPageFunctions(page);
		this.btnAddJobTitle = "//span[text()='Add Job Titles']";
		this.txtJobTitle = "//label[text()='Title']/following::textarea";
		this.btnSave = "//span[text()='Save']";
		this.toasterSuccessfullyCreated = "//div[text()='Successfully created']";
		this.txtEditTitle = "//input[@id='title']";
		this.toasterSuccessfullyUpdated = "//div[text()='Successfully updated']";
		this.toasterSuccessfullySent = "//div[text()='Successfully Updated!']";
		this.btnDeleteJobTitle = "//button[@aria-label='Delete Employees']";
		this.btnYesProceed = "//span[text()='Yes, Proceed']";
		this.jobtitlesection = "//a[@href='/configure/directory/designations']";
		this.btnSearchJobTitle = "//button[@aria-label='Search']";
		this.searchInputBox = "//input[@data-testid='input']";
		this.txtMemberAdded = (nameOrEmail) => `//p[text()='${nameOrEmail}']`;
		this.btnRemoveMember = "//button[@aria-label='Remove Members']";
		this.btnAddMembers = "//span[text()='Add Members']";
		this.txtSearchByNameOrEmail =
			"//div[text()='Search by name or email']/following-sibling::div//input";
		this.drpdwnOptionValue = `//div[contains(@class, 'twigs-select__menu-list')]`;
		this.jobTitle = (jobTitle) => `//p[text()='${jobTitle}']`;
		this.btnSendInvite = "//span[text()='Send Invites']";
	}

	/**
	 * Adds a new job title by filling out the job title form
	 *
	 * @param {string} jobTitle - The name of the job title to be added
	 * @returns {Promise<string>} Returns the job title that was added
	 *
	 * @example
	 * await jobTitlePage.addJobTitle("Senior Developer");
	 * // This will create a new job title called "Senior Developer"
	 */
	async addJobTitle(jobTitle) {
		await PwActions.click(this.page, this.btnAddJobTitle);
		await PwActions.fill(this.page, this.txtJobTitle, jobTitle);
		await PwActions.click(this.page, this.btnSave);
		await CommonUtils.sleep(1);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.toasterSuccessfullyCreated,
		);
		return jobTitle;
	}

	/**
	 * Edits an existing job title by updating its name
	 *
	 * @param {string} jobtitle - The current name of the job title to be edited
	 * @param {string} newJobTitle - The new name for the job title
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await jobTitlePage.editJobTitle("Developer", "Senior Developer");
	 * // This will change the job title from "Developer" to "Senior Developer"
	 */
	async editJobTitle(jobtitle, newJobTitle) {
		this.lblJobTitle = `//p[text()='${jobtitle}']/parent::td/following-sibling::td`;
		this.btnEditJobTitle = `//p[text()='${jobtitle}']/ancestor::tr//button[@aria-label = 'Edit designation']`;

		await PwActions.hover(this.page, this.lblJobTitle);
		await PwActions.click(this.page, this.btnEditJobTitle);
		await PwActions.clearAndFill(this.page, this.txtEditTitle, newJobTitle);
		await PwActions.click(this.page, this.btnSave);
		await CommonUtils.sleep(1.5);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.toasterSuccessfullyUpdated,
		);
	}

	/**
	 * Selects a job title by clicking on its checkbox in the job title list
	 *
	 * @param {string} jobtitle - The name of the job title to select
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await jobTitlePage.selectJobTitle("Senior Developer");
	 * // This will click the checkbox next to the "Senior Developer" job title
	 */
	async selectJobTitle(jobtitle) {
		await PwActions.waitForNetworkIdle(this.page, 10000);
		this.chkboxJobTitle = `//p[text()='${jobtitle}']/ancestor::tr//button[@role='checkbox']`;

		await PwActions.click(this.page, this.chkboxJobTitle);
	}

	/**
	 * Deletes one or more job titles by selecting them and confirming the deletion
	 *
	 * @param {...string} jobTitles - The names of the job titles to delete (can pass multiple)
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await jobTitlePage.deleteJobTitle("Senior Developer");
	 * // This will select and delete the "Senior Developer" job title
	 *
	 * @example
	 * await jobTitlePage.deleteJobTitle("Developer", "Manager", "Designer");
	 * // This will select and delete multiple job titles at once
	 */
	async deleteJobTitle(...jobTitles) {
		for (const jobtitle of jobTitles) {
			await this.commonFunctions.search(jobtitle);
			await this.verifyJobTitleExistence(jobtitle);
			await this.selectJobTitle(jobtitle);
		}
		await PwActions.click(this.page, this.btnDeleteJobTitle);
		await PwActions.click(this.page, this.btnYesProceed);
	}

	/**
	 * Verifies if a job title exists in the current view
	 *
	 * @param {string} jobTitle - The name of the job title to verify
	 * @returns {Promise<boolean>} Returns true if the job title is visible, false otherwise
	 *
	 * @example
	 * const exists = await jobTitlePage.verifyJobTitleExistence("Senior Developer");
	 * // Returns true if "Senior Developer" job title is visible on the page
	 */
	async verifyJobTitleExistence(jobTitle) {
		await CommonUtils.sleep(2);
		return await PwActions.elementIsVisible(this.page, this.jobTitle(jobTitle));
	}

	/**
	 * Verifies if a member exists in the job title members list
	 *
	 * @param {string} nameOrEmail - The name or email of the member to verify
	 * @returns {Promise<boolean>} Returns true if the member is visible, false otherwise
	 *
	 * @example
	 * const exists = await jobTitlePage.verifyMemberExistence("john.doe@example.com");
	 * // Returns true if the member with email "john.doe@example.com" is visible in the job title members list
	 */
	async verifyMemberExistence(nameOrEmail) {
		await CommonUtils.sleep(2);
		return await PwActions.elementIsVisible(
			this.page,
			this.txtMemberAdded(nameOrEmail),
		);
	}

	/**
	 * Searches for and adds a member to a specific job title
	 *
	 * @param {string} jobTitle - The name of the job title to search for and add the member to
	 * @param {string} nameOrEmail - The name or email of the member to add
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await jobTitlePage.addMembers("Senior Developer", "john.doe@example.com");
	 * // This will search for "Senior Developer", then add "john.doe@example.com" to it
	 */
	async addMembers(jobTitle, nameOrEmail) {
		await PwActions.waitForNetworkIdle(this.page, 10000);
		await this.commonFunctions.search(jobTitle);
		await PwActions.click(this.page, this.jobTitle(jobTitle));
		await PwActions.click(this.page, this.btnAddMembers);
		await PwActions.fill(this.page, this.txtSearchByNameOrEmail, nameOrEmail);
		await CommonUtils.sleep(3);
		await PwActions.click(this.page, this.drpdwnOptionValue);
		await PwActions.click(this.page, this.btnSave);
		await CommonUtils.sleep(1.5);
	}

	/**
	 * Removes a member from a job title
	 *
	 * @param {string} nameOrEmail - The name or email of the member to remove
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await jobTitlePage.removeMembers("john.doe@example.com");
	 * // This will remove the member with email "john.doe@example.com" from their current job title
	 */
	async removeMembers(nameOrEmail) {
		await PwActions.waitForNetworkIdle(this.page, 10000);
		await this.selectJobTitle(nameOrEmail);
		await PwActions.click(this.page, this.btnRemoveMember);
		await PwActions.click(this.page, this.btnYesProceed);
		await CommonUtils.sleep(1.5);
	}

	/**
	 * Sends an invite to an employee from the job title section
	 *
	 * @param {string} nameOrEmail - The name or email of the employee to send invite to
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await jobTitlePage.sendInviteToEmployee("john.doe@example.com");
	 * // This will send an invite to the employee with email "john.doe@example.com"
	 */
	async sendInviteToEmployee(nameOrEmail) {
		await PwActions.waitForNetworkIdle(this.page, 10000);
		await CommonUtils.sleep(2);
		await this.selectJobTitle(nameOrEmail);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnSendInvite);
		await CommonUtils.sleep(1.5);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.toasterSuccessfullySent,
		);
	}

	/**
	 * Navigates to a subsection within the job title view (e.g., "Active", "Invite Not Sent")
	 *
	 * @param {string} sectionName - The name of the subsection to navigate to
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await jobTitlePage.navigateToSubSection("Active");
	 * // This will navigate to the "Active" subsection
	 */
	async navigateToSubSection(sectionName) {
		this.btnSubSection = `//div//p[text()='${sectionName}']`;
		await PwActions.click(this.page, this.btnSubSection);
	}
}

export { JobTitlePage };

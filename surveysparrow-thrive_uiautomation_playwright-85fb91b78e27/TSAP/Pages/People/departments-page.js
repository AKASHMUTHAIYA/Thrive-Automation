import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
import { POManager } from "../POManager";

export class DepartmentsPage {
	constructor(page) {
		this.page = page;
		this.btnAddDepartment = "//span[text()='Add Department']";
		this.txtDepartmentName = "//input[@name='departmentName']";
		this.btnDeleteDepartment = "//button[@aria-label='Delete Employees']";
		this.btnYesProceed = `//span[text()="Yes, Proceed"]/parent::button`;
		this.txtPurpose = "//textarea[@name='purpose']";
		this.txtDepartmentLead =
			"//div[text()='Search Employees']/following-sibling::div//input";
		this.txtEditDepartmentLead =
			"//label[text()='Department Lead']//ancestor::div[2]/following-sibling::div";
		this.btnDeleteDepartmentLead =
			"//button[@data-testid='add-department-pane_icon-button_delete']";
		this.btnUploadCoverImage = "//span[text()='Upload']/parent::button";
		this.btnSave = "//button[@type='submit']";
		this.drpdwnOptionValue = `//div[contains(@class, 'twigs-select__menu-list')]`;
		this.btnAddMembers = "//span[text()='Add Members']";
		this.txtSearchByNameOrEmail =
			"//div[text()='Search by name or email']/following-sibling::div//input";
		this.lblEmployeeIsAlreadyExist =
			"//div[text()='Employee is already a part of a different department']";
		this.inputCoverImage = "//input[@name='file']";
		this.lblSuccessToaster = "//div[text()='Successfully Created']";
		this.toasterUpdateSucess = "//div[text()='Successfully Updated']";
		this.btnPagination = "//nav[@aria-label='pagination']";
		this.txtDepartmentMembersCount = (department) =>
			`//p[text()='${department}']/ancestor::td[1]/following-sibling::td[1]`;
		this.commonFunctions = new CommonPageFunctions(this.page);
		this.txtInputDepartmentLead = `//div[contains(@class,'twigs-select__placeholder') and normalize-space()='Search Employees']`;
		this.inputDepartmentLead = `//div[text()="Search Employees"]/following-sibling::div//input`;
		this.btnSaveDepartmentChanges = `//button[@data-testid="add-department-pane_button_save"]`;
		this.dropDownEmployeeInDepartmentLead = (departmentLead) =>
			`(//div[contains(@class,"select__menu")]//p[text()="${departmentLead}"])[1]`;
		this.txtDepartmentLeadName =
			"(//label[normalize-space(.)='Department Lead']/ancestor::div[@data-testid='box']   //p[@data-testid='text' and contains(@class,'size-sm')])[1]";
		this.btnDeleteDepartmentLead =
			"//button[@data-testid='add-department-pane_icon-button_delete']";
		this.txtMemberAdded = (employeeName) => `//p[text()='${employeeName}']`;
		this.btnRemoveMember = "//button[@aria-label='Remove Members']";
		this.btnSendInvite = "//span[text()='Send Invites']";
		this.toasterSuccessfullySent = "//div[text()='Successfully Updated!']";
	}

	/**
	 * Sets the department name selector for use in other methods
	 *
	 * @param {string} departmentName - The name of the department to set the selector for
	 * @returns {void}
	 *
	 * @example
	 * departmentsPage.setDepartmentName("Engineering");
	 * // This sets the internal selector for the "Engineering" department
	 */
	setDepartmentName(departmentName) {
		this.departmentName = `//p[text()='${departmentName}']`;
	}

	/**
	 * Selects a department by clicking on its checkbox in the department list
	 *
	 * @param {string} departmentName - The name of the department to select
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await departmentsPage.selectDepartment("Engineering");
	 * // This will click the checkbox next to the "Engineering" department
	 */
	async selectDepartment(departmentName) {
		this.chkboxSelectDepartment = `//p[text()='${departmentName}']/ancestor::td/preceding-sibling::td//button`;
		await PwActions.click(this.page, this.chkboxSelectDepartment);
	}

	/**
	 * Adds a new department with the provided details
	 *
	 * @param {Object} departmentData - Object containing department information
	 * @param {string} departmentData.departmentName - The name of the department (required, min 3 characters)
	 * @param {string} [departmentData.purpose] - Optional purpose/description of the department
	 * @param {string} departmentData.departmentLead - The name or email of the department lead (required)
	 * @param {string} [departmentData.coverImage] - Optional cover image filename
	 * @returns {Promise<string>} Returns the created department name
	 * @throws {Error} Throws error if department name is missing, too short, or already exists
	 * @throws {Error} Throws error if department lead is not provided
	 *
	 * @example
	 * await departmentsPage.addDepartment({
	 *     departmentName: "Engineering",
	 *     purpose: "Software development team",
	 *     departmentLead: "john.doe@example.com",
	 *     coverImage: "engineering-cover.jpg"
	 * });
	 */
	async addDepartment({ departmentName, purpose, departmentLead, coverImage }) {
		const coverImg = `TSAP/Data/Resources/${coverImage}`;

		//handling the error cases
		if (!departmentName || departmentName.length < 3) {
			const errorMessage = !departmentName
				? "Department Name is Required to Create a department"
				: "Department Name Should be more than 3 Characters";
			throw new Error(errorMessage);
		}

		if (!departmentLead) {
			throw new Error("Department Lead is Required");
		}

		const departmentExists =
			await this.verifyDepartmentExistence(departmentName);
		if (departmentExists) {
			throw new Error("Department Name already exists");
		}

		await PwActions.click(this.page, this.btnAddDepartment);
		await PwActions.fill(this.page, this.txtDepartmentName, departmentName); //Filling department name
		await PwActions.fill(this.page, this.txtDepartmentLead, departmentLead); //Filling the department lead
		await this.page.waitForTimeout(1500);
		await PwActions.click(this.page, this.drpdwnOptionValue);

		if (purpose !== undefined) {
			await PwActions.fill(this.page, this.txtPurpose, purpose);
		}

		if (coverImage !== undefined) {
			await PwActions.uploadFile(this.page, this.inputCoverImage, coverImg);
			await this.page.waitForTimeout(1500);
		}
		await PwActions.click(this.page, this.btnSave);
		await CommonUtils.sleep(1.5);
		//await PwActions.verifyElementIsPresent(this.page, this.lblSuccessToaster);
		return departmentName;
	}

	/**
	 * Edits an existing department with new details
	 *
	 * @param {string} departmentName - The current name of the department to edit
	 * @param {Object} editData - Object containing the updated department information
	 * @param {string} [editData.departmentNameToEdit] - The new name for the department
	 * @param {string} [editData.purpose] - Updated purpose/description of the department
	 * @param {string} [editData.departmentLead] - Updated department lead name or email
	 * @param {string} [editData.coverImage] - Updated cover image filename
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await departmentsPage.editDepartment("Engineering", {
	 *     departmentNameToEdit: "Software Engineering",
	 *     purpose: "Advanced software development team",
	 *     departmentLead: "jane.smith@example.com",
	 *     coverImage: "new-engineering-cover.jpg"
	 * });
	 */
	async editDepartment(
		departmentName,
		{ departmentNameToEdit, purpose, departmentLead, coverImage },
	) {
		this.departmentName = `//p[text()='${departmentName}']`;
		this.btnEditDepartmentName = `//p[text()='${departmentName}']/parent::div/following-sibling::div//button[@aria-label='Edit department']`;
		await this.commonFunctions.search(departmentName);
		const coverImg = `TSAP/Data/Resources/${coverImage}`;

		await PwActions.hover(this.page, this.departmentName);
		await PwActions.click(this.page, this.btnEditDepartmentName);

		if (departmentNameToEdit) {
			await PwActions.clearAndFill(
				this.page,
				this.txtDepartmentName,
				departmentNameToEdit,
			);
		}
		if (purpose) {
			await PwActions.clearAndFill(this.page, this.txtPurpose, purpose);
		}

		if (departmentLead !== undefined) {
			await CommonUtils.sleep(2);
			if (
				(await PwActions.elementIsVisible(
					this.page,
					this.txtDepartmentLeadName,
				)) &&
				(await PwActions.getText(this.page, this.txtDepartmentLeadName)) !==
					"Cover Image"
			) {
				await PwActions.hover(this.page, this.txtDepartmentLeadName);
				await PwActions.click(this.page, this.btnDeleteDepartmentLead);
			}
			await PwActions.forceClick(this.page, this.txtInputDepartmentLead);
			await PwActions.fill(this.page, this.inputDepartmentLead, departmentLead);
			await PwActions.click(
				this.page,
				this.dropDownEmployeeInDepartmentLead(departmentLead),
			);
		}

		if (coverImage) {
			await PwActions.uploadFile(this.page, this.inputCoverImage, coverImg);
			await CommonUtils.sleep(1.5);
		}
		await PwActions.click(this.page, this.btnSaveDepartmentChanges);
		await CommonUtils.sleep(1.5);
		await PwActions.verifyElementIsPresent(this.page, this.toasterUpdateSucess);
	}

	/**
	 * Deletes one or more departments by selecting them and confirming the deletion
	 *
	 * @param {...string} departmentNames - The names of the departments to delete
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await departmentsPage.deleteDepartment("Engineering", "Marketing");
	 * // This will select and delete the "Engineering" and "Marketing" departments
	 */
	async deleteDepartment(...departmentNames) {
		for (const departmentName of departmentNames) {
			await this.commonFunctions.search(departmentName);
			await this.verifyDepartmentExistence(departmentName);
			await this.selectDepartment(departmentName);
		}
		await PwActions.click(this.page, this.btnDeleteDepartment);
		await PwActions.click(this.page, this.btnYesProceed);
		await CommonUtils.sleep(1.5);
	}

	/**
	 * Adds a member to a specific department
	 *
	 * @param {string} department - The name of the department to add the member to
	 * @param {string} nameOrEmail - The name or email of the member to add
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await departmentsPage.addMembers("Engineering", "john.doe@example.com");
	 * // This will add the member with email "john.doe@example.com" to the "Engineering" department
	 */
	async addMembers(department, nameOrEmail) {
		this.departmentName = `//p[text()='${department}']`;
		await PwActions.click(this.page, this.departmentName);
		await PwActions.click(this.page, this.btnAddMembers);
		await PwActions.fill(this.page, this.txtSearchByNameOrEmail, nameOrEmail);
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.drpdwnOptionValue);
		await PwActions.click(this.page, this.btnSave);
		await CommonUtils.sleep(1.5);
		await PwActions.elementIsVisible(
			this.page,
			this.txtMemberAdded(nameOrEmail),
		);
	}

	/**
	 * Removes a member from a department
	 *
	 * @param {string} nameOrEmail - The name or email of the member to remove
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await departmentsPage.removeMembers("john.doe@example.com");
	 * // This will remove the member with email "john.doe@example.com" from their current department
	 */
	async removeMembers(nameOrEmail) {
		await this.selectDepartment(nameOrEmail);
		await PwActions.click(this.page, this.btnRemoveMember);
		await PwActions.click(this.page, this.btnYesProceed);
		await CommonUtils.sleep(1.5);
	}

	/**
	 * Verifies if a department exists in the department list
	 *
	 * @param {string} department - The name of the department to verify
	 * @returns {Promise<boolean>} Returns true if the department exists, false otherwise
	 *
	 * @example
	 * const exists = await departmentsPage.verifyDepartmentExistence("Engineering");
	 * // Returns true if "Engineering" department exists in the list
	 */
	async verifyDepartmentExistence(department) {
		this.setDepartmentName(department);
		await this.page.waitForTimeout(2000);
		return await PwActions.elementIsVisible(this.page, this.departmentName);
	}

	/**
	 * Verifies if a member exists in the current department view
	 *
	 * @param {string} nameOrEmail - The name or email of the member to verify
	 * @returns {Promise<boolean>} Returns true if the member exists, false otherwise
	 *
	 * @example
	 * const exists = await departmentsPage.verifyMemberExistence("john.doe@example.com");
	 * // Returns true if the member with email "john.doe@example.com" exists in the current department
	 */
	async verifyMemberExistence(nameOrEmail) {
		await CommonUtils.sleep(2);
		return await PwActions.elementIsVisible(
			this.page,
			this.txtMemberAdded(nameOrEmail),
		);
	}

	/**
	 * Gets the number of members in a specific department
	 *
	 * @param {string} department - The name of the department to get the member count for
	 * @returns {Promise<string>} Returns the number of members in the department as a string
	 *
	 * @example
	 * const memberCount = await departmentsPage.getDepartmentMembersCount("Engineering");
	 * // Returns the number of members in the "Engineering" department
	 */
	async getDepartmentMembersCount(department) {
		await PwActions.waitTillVisible(this.page, this.btnPagination);
		await this.commonFunctions.search(department);
		await CommonUtils.sleep(2);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		const membersCount = await PwActions.getText(
			this.page,
			this.txtDepartmentMembersCount(department),
		);
		return membersCount;
	}

	/**
	 * Sends an invite to an employee from the department section
	 *
	 * @param {string} nameOrEmail - The name or email of the employee to send invite to
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await departmentsPage.sendInviteToEmployee("john.doe@example.com");
	 * // This will send an invite to the employee with email "john.doe@example.com"
	 */
	async sendInviteToEmployee(nameOrEmail) {
		await this.selectDepartment(nameOrEmail);
		await PwActions.click(this.page, this.btnSendInvite);
		await CommonUtils.sleep(1.5);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.toasterSuccessfullySent,
		);
	}

	/**
	 * Navigates to a subsection within the department view (e.g., "Active", "Invite Not Sent")
	 *
	 * @param {string} sectionName - The name of the subsection to navigate to
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await departmentsPage.navigateToSubSection("Active");
	 * // This will navigate to the "Active" subsection
	 */
	async navigateToSubSection(sectionName) {
		this.btnSubSection = `//div//p[text()='${sectionName}']`;
		await PwActions.click(this.page, this.btnSubSection);
	}
}

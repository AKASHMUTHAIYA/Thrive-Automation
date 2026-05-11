import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../Data/Resources/constants.js";
import logger from "playwright-framework/Core/logger.js";
import { generateRandomEmployeeNameAndEmail } from "../../Data/Resources/constants.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions.js";
import { ImportsPage } from "./imports-page.js";
import { generateRandomEmployeeProperty } from "../../Data/Resources/random-values.js";
import { PeoplePage } from "./people-page.js";

class EmployeesPage {
	constructor(page) {
		this.page = page;
		this.commonfunction = new CommonPageFunctions(this.page);
		this.peoplePage = new PeoplePage(this.page);
		this.readEmail = new ReadEmail();
		this.importPage = new ImportsPage(this.page);
		this.btnSearchEmployee = "//button[contains(@aria-label,'Search ')]";
		this.txtSearchEmployee = "//input[@placeholder='Search employees']";
		this.txtSearchproperty = "//input[@placeholder='Search']";
		this.btnFilter = "//button[@aria-label='filter']";
		this.btnFilterBy = `//div[@role='menuitem']/p`;
		this.employeeRow = (employeeName) => `//td[.//p[text()='${employeeName}']]`;
		this.btnAddEmployees = "//span[text()='Add Employees']";
		this.btnAddManually = "//div[text()='Add Manually']";
		this.btnImportFromCSV = "//div[text()='Import from CSV']";
		this.btnDownloadSampleCSV =
			"//a[@data-testid='csv-upload_link_download-sample-csv']";
		this.btnSaveToDirectory = "//button[@form='employee-form']";
		this.txtEditFirstName = "//p[text()='Full Name']/ancestor::div[2]//input";
		this.txtEditNickName = "//p[text()='Nick Name']/ancestor::div[2]//input";
		this.txtEditEmail = "//p[text()='Email ID']/ancestor::div[2]//input";
		this.txtEditSecondaryEmail =
			"//p[text()='Secondary Email']/ancestor::div[2]//input";
		this.btnEditDepartmentDropdown =
			"//p[text()='Department']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.txtEditDepartment =
			"//p[text()='Department']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.drpdwnOptionValue = `//div[contains(@class, 'twigs-select__option--is-focused')]`;
		this.btnEditManagerDropdown =
			"//p[text()='Manager']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.txtEditManager =
			"//p[text()='Manager']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.btnEditJobTitleDropdown =
			"//p[text()='Job Title']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.txtEditJobTitle =
			"//p[text()='Job Title']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.txtEditEmployeeID =
			"//p[text()='Employee ID']/ancestor::div[2]//input";
		this.txtEditContactNumber =
			"//p[text()='Phone Number']/ancestor::div[2]//input";
		this.txtEditGender =
			"//p[text()='Gender']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.txtEditCountry =
			"//p[text()='Country']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.btnGenderDropdownValue =
			"//div[contains(@class,'twigs-select__menu-list')]//div[contains(@class,'twigs-select__option twigs-select__option--is-focused')]";
		this.btnCountryDropdownValue =
			"//div[contains(@class,'twigs-select__menu-list')]//div[contains(@class,'twigs-select__option twigs-select__option--is-focused')]";
		this.txtEditLocation =
			"//p[text()='Location']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.txtEditLanguage =
			"//p[text()='Language']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.btnLanguageDropdownValue =
			"//div[contains(@class,'twigs-select__menu-list')]//div[contains(@class,'twigs-select__option twigs-select__option--is-focused')]";
		this.txtEditDateOfBirth =
			"//p[text()='Date of Birth']/ancestor::div[2]//input";
		this.txtEditDateOfJoining =
			"//p[text()='Date of Joining']/ancestor::div[2]//input";
		this.btnEditSave = "//span[text()='Save']";
		this.btnEditCancel = "//span[text()='Cancel']";
		this.btnDeactivateEmployee =
			"//button[@aria-label='Deactivate Employees'] | //p[text()='Deactivate Employee']";
		this.btnThreeDots =
			"(//button[(@data-state='closed') and contains(@class, 'twigs-c-gSguNF-dpDkBV-cv twigs-c-gSguNF-hmIMsL-cv twigs-c-PJLV PJLV twigs-button')])[2]";
		this.btnYesProceed = "//span[text()='Yes, Proceed']";
		this.uploadOrDrop = "//input[@type='file']";
		this.btnImport = "//span[text()='Import']";
		this.btnSendInviteAfterImporting = "//button[@id='send-invite']";
		this.toasterSuccessfullyUpdated =
			"//li[@data-testid='toast']//div[text()='Successfully Updated']";
		this.lblEmployeeName = "//p[contains(@class,'twigs-c-kbyIfK-ikcOfeK-css')]";
		this.lblEmployeeNameInSidePanal = "//h1[@data-testid='heading']";
		this.lblEmployeeEmailInSidePanal =
			"//h1[@data-testid='heading']/following-sibling::p[contains(@class,'twigs-c-kbyIfK twigs-c-kbyIfK-hzzdKO-size-md twigs-c-kbyIfK-dgasAY')]";
		this.lblDepartmentSidePanel =
			"//p[text()='Department']/ancestor::div[2]/div[2]//div[contains(@class,'twigs-select__single')]";
		this.lblManagerSidePanel =
			"//p[text()='Manager']/ancestor::div[2]/div[2]//div[contains(@class,'twigs-select__single')]";
		this.lblJobTitleSidePanel =
			"//p[text()='Job Title']/ancestor::div[2]/div[2]//div[contains(@class,'twigs-select__single')]";
		this.lblEmployeeIdSidePanel =
			"//p[text()='Employee ID']/ancestor::div[2]//input";
		this.lblPhoneNumberSidePanel =
			"//p[text()='Phone Number']/ancestor::div[2]//input";
		this.lblDateofBirthSidePanel =
			"//p[text()='Date of Birth']/ancestor::div[2]//input";
		this.lblGenderSidePanel =
			"//p[text()='Gender']/ancestor::div[2]//div[contains(@class,'singleValue')]";
		this.lblLocationSidePanel =
			"//p[text()='Location']/ancestor::div[2]//div[contains(@class,'singleValue')]";
		this.lblDateOfJoiningSidePanel =
			"//p[text()='Date of Joining']/ancestor::div[2]//input";
		this.lblLanguageSidePanel =
			"//p[text()='Language']/ancestor::div[2]//div[contains(@class,'singleValue')]";
		this.lblSecondaryEmailSidePanel =
			"//p[text()='Secondary Email']/ancestor::div[2]//input";
		this.lblCountrySidePanel =
			"//p[text()='Country']/ancestor::div[2]//div[contains(@class,'singleValue')]";
		this.lblCustomDropdownValueSidePanel =
			"//p[text()='custom dropdown']/ancestor::div[2]//div[contains(@class,'singleValue')]";
		this.lblCustomNumberSidePanel =
			"//p[text()='custom number']/ancestor::div[2]//input";
		this.lblCustomEmailSidePanel =
			"//p[text()='custom email']/ancestor::div[2]//input";
		this.lblCustomSingleLineTextSidePanel =
			"//p[text()='custom single']/ancestor::div[2]//input";
		this.lblCustomMultiLineTextSidePanel =
			"//p[text()='custom multiline']/ancestor::div[2]//textarea";
		this.lblCustomUrlSidePanel =
			"//p[text()='custom url']/ancestor::div[2]//input";
		this.webelementsAllEmployeeEmails =
			'//td[contains(@class, "twigs-c-kcKocc")]//div/following-sibling::p';
		this.commonUtils = new CommonUtils();
		this.btnSendInvities = "//span[text()='Send Invites']/parent::button";
		this.chkboxEmployeeName = (employeeName) =>
			`//div[@class='twigs-c-PJLV']/p[text()='${employeeName}']/ancestor::td/preceding-sibling::td//button`;
		this.propertyToggleSelector = (propertyName) =>
			`//p[text()='${propertyName}']/ancestor::td/following-sibling::td//button`;
		// NEW UI: Custom fields also use label-based selectors
		this.txtBoxEditCustomDropdownValue =
			"//p[text()='custom dropdown']/ancestor::div[2]//input[@class='twigs-select__input']";
		this.btnEditCustomDropdownValue =
			"//div[contains(@class,'twigs-select__menu-list')]//div[contains(@class,'twigs-select__option twigs-select__option--is-focused')]";
		this.txtBoxEditCustomNumber =
			"//p[text()='custom number']/ancestor::div[2]//input";
		this.txtBoxEditCustomEmail =
			"//p[text()='custom email']/ancestor::div[2]//input";
		this.txtBoxEditCustomSingleLineText =
			"//p[text()='custom single']/ancestor::div[2]//input";
		this.txtBoxEditCustomMultiLineText =
			"//p[text()='custom multiline']/ancestor::div[2]//textarea";
		this.txtBoxEditCustomUrl =
			"//p[text()='custom url']/ancestor::div[2]//input";
		this.btnEditCountryDropdownValue =
			"//div[contains(@class,'twigs-select__menu-list')]//div[contains(@class,'twigs-select__option twigs-select__option--is-focused')]";
		this.btnEditLanguageDropdownValue =
			"//div[contains(@class,'twigs-select__menu-list')]//div[contains(@class,'twigs-select__option twigs-select__option--is-focused')]";
		this.listEmployees =
			'//p[text()="Name"]/ancestor::thead/following-sibling::tbody/tr/td[1]/div';
		this.txtCountDataIssues = (sectionName) =>
			`//div[normalize-space(text())='${sectionName}']/div[@data-testid='chip']//span`;
		this.txtChipCountDataIssues = (sectionName) =>
			`//p[normalize-space()='${sectionName}']/following-sibling::div[@data-testid='chip']//span`;
		this.txtCountEmployeeSection = (subSectionName) =>
			`//button[.//p[normalize-space()='${subSectionName}']]//span[contains(@class,'twigs-chip__content')]`;
		this.btnLastPage =
			"(//nav[@aria-label='pagination']//button[contains(@aria-label,'Page')])[last()]";
		this.btnCloseEmployeeEditModal = `//button[@data-testid="employee-info-pane_icon-button_close"]`;
		this.btnSaveEmployeeEdit = `//button[@data-testid="employee-info-pane_button_save"]`;
		this.txtDataIssueMobileNo = (employeeName) =>
			`//td[.//p[text()='${employeeName}']]/ancestor::tr//input[@placeholder='Mobile No']`;
		this.btnDataIssueUpdate = "//span[text()='Update']/parent::button";
		this.btnDataIssueBulkAssign = "//span[text()='Bulk Assign']/parent::button";
		this.drpdwnBulkAssignDialog =
			"//h1[text()='Bulk Assign']/following::input[@class='twigs-select__input'][1]";
		this.btnBulkAssignDialogAssign =
			"//h1[text()='Bulk Assign']/following::button[.//span[text()='Assign']][1]";
		this.lnkCancelAddEmployee = "//a[text()='Cancel']";
	}

	/**
	 * Returns the XPath selector for an employee's email in the employee list.
	 *
	 * @param {string} employeeEmail - The email address of the employee.
	 * @returns {string} XPath selector for the employee's email cell.
	 *
	 * @example
	 * const selector = employeesPage.elementEmployeeFromList("john.doe@example.com");
	 * // selector: "//p[text()='john.doe@example.com']"
	 */
	async elementEmployeeFromList(employeeEmail) {
		const selectEmployeeFromList = `//td//p[text()='${employeeEmail}']`;
		return selectEmployeeFromList;
	}

	async navigateToTopNavSection(navigationSection) {
		this.btnTopNavigations = `//div//a[text()='${navigationSection}']`;
		await PwActions.click(this.page, this.btnTopNavigations);
	}
	//navigateToSubSection;
	//Invite Not Sent/Active/Deactivated
	async navigateToSubTopSection(sectionName) {
		this.btnSubTopSection = `//div//p[text()='${sectionName}']`;
		await PwActions.click(this.page, this.btnSubTopSection);
	}

	/**
	 * This function searches for an employee in the employee list, it will clear the search field if it is already present.
	 * @param {string} employeeName - The name of the employee to search for.
	 * @param {string} sectionName - The section to navigate to.
	 * */
	async searchEmployees(employeeName, sectionName) {
		await this.navigateToSubTopSection(sectionName);
		const isSearchButtonAvailable = await PwActions.elementIsVisible(
			this.page,
			this.txtSearchEmployee,
		);
		if (isSearchButtonAvailable) {
			await PwActions.clear(this.page, this.txtSearchEmployee);
		} else {
			await PwActions.click(this.page, this.btnSearchEmployee);
		}
		await PwActions.fill(this.page, this.txtSearchEmployee, employeeName);
		await this.commonfunction.search(employeeName);
		await PwActions.waitTillVisible(
			this.page,
			this.employeeRow(employeeName),
			10000,
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.employeeRow(employeeName),
		);
	}

	/**
	 * Searches for an employee using an email (primary or secondary) and verifies the result row by employee name.
	 * @param {string} searchEmail - The email to type into the search box.
	 * @param {string} employeeName - The employee name expected in the result row.
	 * @param {string} sectionName - The section tab to navigate to (e.g. "Active").
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.searchEmployeeByEmailAndVerifyTheEmployeeName({ searchEmail: "secondary@example.com", employeeName: "John Doe", sectionName: "Active" });
	 */
	async searchEmployeeByEmailAndVerifyTheEmployeeName({
		searchEmail,
		employeeName,
		sectionName,
	}) {
		await this.navigateToSubTopSection(sectionName);
		const isSearchButtonAvailable = await PwActions.elementIsVisible(
			this.page,
			this.txtSearchEmployee,
		);
		if (isSearchButtonAvailable) {
			await PwActions.clear(this.page, this.txtSearchEmployee);
		} else {
			await PwActions.click(this.page, this.btnSearchEmployee);
		}
		await PwActions.fill(this.page, this.txtSearchEmployee, searchEmail);
		await this.commonfunction.search(searchEmail);
		await PwActions.waitTillVisible(
			this.page,
			this.employeeRow(employeeName),
			10000,
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.employeeRow(employeeName),
		);
	}

	async getEmployeeName() {
		const name = await PwActions.getText(this.page, this.lblEmployeeName); // Get the text content
		return name.trim();
	}

	/**This function selects the provided filter value from Filter By */
	async selectFilter(filterby) {
		await PwActions.click(this.page, this.btnFilter);
		await PwActions.getElementWithText(this.page, filterby, this.btnFilterBy)
			.click;
	}
	/**function chooce the filter value once user selects the filter. It will click on the provided checkbox */
	async chooseFilter(filterby, filterValue) {
		this.btnFilterChoose = `//p[text()='${filterby}']/parent::div`;
		this.bchkboxFilterChooseValue = `//label[text()='${filterValue}']/preceding-sibling::button`;
		await PwActions.click(this.page, this.btnFilterChoose);
		await PwActions.click(this.page, this.bchkboxFilterChooseValue);
	}

	/**function will click on the checkbox corresponds to the given employee name */
	async selectEmployee(employeeName) {
		await PwActions.click(this.page, this.chkboxEmployeeName(employeeName));
	}

	/**function adds emplyees via add manually option by providing required data
	 * it enter values in the row provided as parameter
	 * @param {number} rowNum - The row number for the employee form fields
	 * @param {Object} employeeData - Employee data object
	 * @param {string} employeeData.name - Employee name
	 * @param {string} employeeData.employeeEmail - Employee email
	 * @param {string} [employeeData.department] - Department name
	 * @param {string} [employeeData.manager] - Manager name
	 * @param {string} [employeeData.jobtitle] - Job title
	 * @param {string} [employeeData.employeeId] - Employee ID
	 * @param {string} [employeeData.lastWorkingDay] - Last working day in YYYY-MM-DD format (for exit survey scenarios)
	 * @param {string} [employeeData.actions] - Actions
	 */
	async addEmployeeManually(
		rowNum,
		{
			name,
			employeeEmail,
			secondaryEmail,
			department,
			manager,
			jobtitle,
			employeeId,
			lastWorkingDay,
			actions,
		},
	) {
		this.txtEmployeeNameField = `//input[@name='employees.${rowNum}.fullName']`;
		this.txtEmployeeEmailField = `//input[@name='employees.${rowNum}.email']`;
		this.txtEmployeeSecondaryEmailField = `//input[@name='employees.${rowNum}.secondaryEmail']`;
		this.btnEmployeeDepartmentField = `//input[@name='employees.${rowNum}.departmentId']/preceding-sibling::div[contains(@class, 'twigs-select__control')]//div[contains(@class,'twigs-select__indicators')]`;
		this.txtEmployeeDepartmentField = `//input[@name='employees.${rowNum}.departmentId']/preceding-sibling::div[contains(@class, 'twigs-select__control')]//input`;
		this.drpdwnDepartmentValue = `//div[text()='${department}']`;
		this.btnEmployeeManagerField = `//input[@name='employees.${rowNum}.managerId']/preceding-sibling::div[contains(@class, 'twigs-select__control')]//div[contains(@class,'twigs-select__indicators')]`;
		this.txtEmployeeManagerField = `//input[@name='employees.${rowNum}.managerId']/preceding-sibling::div[contains(@class, 'twigs-select__control')]//input`;
		this.drpdwnManagerValue = `//div[contains(@class, 'twigs-select__option--is-focused')and(text()='${manager}')]`;
		this.btnEmployeeJobTitleField = `//input[@name='employees.${rowNum}.designationId']/preceding-sibling::div[contains(@class, 'twigs-select__control')]//div[contains(@class,'twigs-select__indicators')]`;
		this.txtEmployeeJobTitleField = `//input[@name='employees.${rowNum}.designationId']/preceding-sibling::div[contains(@class, 'twigs-select__control')]//input`;
		this.drpdwnJobTitleValue = `//div[text()='${jobtitle}']`;
		this.txtEmployeeSecondaryEmailField = `//input[@name='employees.${rowNum}.secondaryEmail']`;
		this.txtEmployeeManagerID = `//input[@name='employees.${rowNum}.employeeId']`;

		// Locators for editing employee with last working day
		this.btnEditEmployeeRow = `//button[@data-testid='employee-row_icon-button'][@aria-label='Edit']`;
		this.txtLastWorkingDay = `//input[@data-testid='input'][@name='lastWorkingDay']`;
		this.btnSaveEmployeeEdit =
			"//button//span[text()='Save' or text()='Save Changes']";

		await PwActions.click(this.page, this.btnAddEmployees);
		await PwActions.click(this.page, this.btnAddManually);
		await PwActions.fill(this.page, this.txtEmployeeNameField, name);
		await PwActions.fill(this.page, this.txtEmployeeEmailField, employeeEmail);

		if (secondaryEmail !== undefined) {
			await PwActions.fill(
				this.page,
				this.txtEmployeeSecondaryEmailField,
				secondaryEmail,
			);
		}
		if (department !== undefined) {
			await PwActions.click(this.page, this.btnEmployeeDepartmentField);
			await PwActions.fill(
				this.page,
				this.txtEmployeeDepartmentField,
				department,
			);
			await PwActions.click(this.page, this.drpdwnDepartmentValue);
		}
		if (manager !== undefined) {
			await PwActions.click(this.page, this.btnEmployeeManagerField);
			await PwActions.fill(this.page, this.txtEmployeeManagerField, manager);
			await PwActions.click(this.page, this.drpdwnManagerValue);
		}

		if (jobtitle !== undefined) {
			await PwActions.click(this.page, this.btnEmployeeJobTitleField);
			await PwActions.fill(this.page, this.txtEmployeeJobTitleField, jobtitle);
			await PwActions.click(this.page, this.drpdwnJobTitleValue);
		}

		if (employeeId !== undefined) {
			await PwActions.fill(this.page, this.txtEmployeeManagerID, employeeId);
		}

		// Handle last working day - click Edit icon, fill date, save
		if (lastWorkingDay !== undefined) {
			await CommonUtils.sleep(1);
			await PwActions.waitTillVisible(
				this.page,
				this.btnEditEmployeeRow,
				10000,
			);
			await PwActions.click(this.page, this.btnEditEmployeeRow);
			await CommonUtils.sleep(1);
			await PwActions.waitTillVisible(this.page, this.txtLastWorkingDay, 10000);
			await PwActions.fill(this.page, this.txtLastWorkingDay, lastWorkingDay);
			await PwActions.click(this.page, this.btnSaveEmployeeEdit);
			await CommonUtils.sleep(1);
		}
	}

	/**function imports the employee details from the CSV file
	 * @param {string} filename - The name of the CSV file to import
	 */
	async importFromCSV(filename) {
		try {
			let filePath;
			if (path.isAbsolute(filename)) {
				filePath = filename;
			} else {
				const dirname = path.dirname(fileURLToPath(import.meta.url));
				filePath = path.join(dirname, `../../../TSAP/Data/Files/${filename}`);
			}
			await PwActions.click(this.page, this.btnAddEmployees);
			await PwActions.click(this.page, this.btnImportFromCSV);
			await PwActions.uploadFile(this.page, this.uploadOrDrop, filePath);
			await CommonUtils.sleep(1.5);
			await PwActions.click(this.page, this.btnImport);
			await CommonUtils.sleep(1.5);
		} catch (error) {
			console.error("Error during CSV import:", error);
			throw error;
		}
	}

	/**
	 * Opens the employee import page from Add Employees and downloads the sample CSV file.
	 *
	 * @param {number} [timeout=30000] - Download timeout in milliseconds.
	 * @returns {Promise<string>} Absolute path of the downloaded sample CSV.
	 *
	 * @example
	 * const filePath = await employeesPage.downloadSampleCSVFromImport();
	 */
	async downloadSampleCSVFromImport(timeout = 30000) {
		await PwActions.click(this.page, this.btnAddEmployees);
		await PwActions.click(this.page, this.btnImportFromCSV);
		const { filePath } = await this.commonfunction.downloadFileAndReturnPath(
			this.page,
			this.btnDownloadSampleCSV,
			timeout,
		);
		return filePath;
	}

	/**function edits the already available employee details from the list */
	async editEmployeeDetails(
		currentEmployeeEmail,
		{
			name,
			nickName,
			employeeEmail,
			department,
			manager,
			jobtitle,
			employeeId,
			contactNumber,
			dateOfBirth,
			gender,
			location,
			//dateOfJoining
			countryName,
			language,
			secondaryEmail,
			//lastworkingdate
			customNumber,
			customEmail,
			customSingleLineText,
			customMultiLineText,
			customUrl,
			customDropdownValueName,
		},
	) {
		await this.searchEmployees(currentEmployeeEmail, constants.active);
		this.receivedEmployeeEmail = `//p[text()='${currentEmployeeEmail}']`;
		this.currentEmployeeName = await PwActions.getText(
			this.page,
			`${this.receivedEmployeeEmail}/preceding-sibling::div//p`,
		);
		this.btnEditEmployeename = `//button[@aria-label='Edit employee details of ${this.currentEmployeeName}']`;
		this.drpdwnEditLocation = `//div[text()='${location}']`;
		await PwActions.hover(this.page, this.receivedEmployeeEmail);
		await PwActions.click(this.page, this.btnEditEmployeename);

		if (name !== undefined) {
			await PwActions.clearAndFill(this.page, this.txtEditFirstName, name);
		}
		if (nickName !== undefined) {
			await PwActions.clearAndFill(this.page, this.txtEditNickName, nickName);
		}

		if (employeeEmail !== undefined) {
			await PwActions.clearAndFill(this.page, this.txtEditEmail, employeeEmail);
		}

		if (secondaryEmail !== undefined) {
			await PwActions.clearAndFill(
				this.page,
				this.txtEditSecondaryEmail,
				secondaryEmail,
			);
		}

		if (department !== undefined) {
			await PwActions.click(this.page, this.btnEditDepartmentDropdown);
			await PwActions.fill(
				this.page,
				this.btnEditDepartmentDropdown,
				department,
			);
			await CommonUtils.sleep(4);
			this.drpdwnOptionValueDepartment = `//div[text()='${department}']`;
			await PwActions.waitForNetworkIdle(this.page, 10000);
			await PwActions.click(this.page, this.drpdwnOptionValueDepartment);
		}

		if (manager !== undefined) {
			await PwActions.click(this.page, this.btnEditManagerDropdown);
			await PwActions.fill(this.page, this.txtEditManager, manager);
			await CommonUtils.sleep(2);
			await PwActions.waitForNetworkIdle(this.page, 10000);
			await PwActions.click(this.page, this.drpdwnOptionValue);
		}

		if (jobtitle !== undefined) {
			await PwActions.click(this.page, this.btnEditJobTitleDropdown);
			await PwActions.fill(this.page, this.txtEditJobTitle, jobtitle);
			await PwActions.click(this.page, this.drpdwnOptionValue);
		}

		if (employeeId !== undefined) {
			await PwActions.clearAndFill(
				this.page,
				this.txtEditEmployeeID,
				employeeId,
			);
		}

		if (contactNumber !== undefined) {
			await PwActions.clearAndFill(
				this.page,
				this.txtEditContactNumber,
				contactNumber,
			);
		}

		if (dateOfBirth !== undefined) {
			await PwActions.fill(this.page, this.txtEditDateOfBirth, dateOfBirth);
		}

		if (countryName !== undefined) {
			await PwActions.fill(this.page, this.txtEditCountry, countryName);
			await PwActions.click(this.page, this.btnCountryDropdownValue);
		}

		if (gender !== undefined) {
			await PwActions.fill(this.page, this.txtEditGender, gender);
			await PwActions.click(this.page, this.btnGenderDropdownValue);
		}

		if (location !== undefined) {
			await PwActions.fill(this.page, this.txtEditLocation, location);
			await PwActions.click(this.page, this.drpdwnEditLocation);
		}
		if (language !== undefined) {
			await PwActions.fill(this.page, this.txtEditLanguage, language);
			await PwActions.click(this.page, this.btnLanguageDropdownValue);
		}
		if (customDropdownValueName !== undefined) {
			await PwActions.fill(
				this.page,
				this.txtBoxEditCustomDropdownValue,
				customDropdownValueName,
			);
			await PwActions.click(this.page, this.btnEditCustomDropdownValue);
		}
		if (customNumber !== undefined) {
			await PwActions.fill(
				this.page,
				this.txtBoxEditCustomNumber,
				customNumber,
			);
		}
		if (customEmail !== undefined) {
			await PwActions.fill(this.page, this.txtBoxEditCustomEmail, customEmail);
		}
		if (customSingleLineText !== undefined) {
			await PwActions.fill(
				this.page,
				this.txtBoxEditCustomSingleLineText,
				customSingleLineText,
			);
		}
		if (customMultiLineText !== undefined) {
			await PwActions.fill(
				this.page,
				this.txtBoxEditCustomMultiLineText,
				customMultiLineText,
			);
		}
		if (customUrl !== undefined) {
			await PwActions.fill(this.page, this.txtBoxEditCustomUrl, customUrl);
		}
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnSaveEmployeeEdit);
	}
	/*This function deactivates an already present employee via edit employee*/
	async deactivateEmployee(employeeName) {
		this.txtEmployeeName = `//p[text()='${employeeName}']`;
		await PwActions.click(this.page, this.txtEmployeeName);
		await CommonUtils.sleep(2);
		await PwActions.waitForNetworkIdle(this.page, 10000);
		await PwActions.click(this.page, this.btnThreeDots);
		await PwActions.click(this.page, this.btnDeactivateEmployee);
		await PwActions.click(this.page, this.btnYesProceed);
	}
	/**
	 * This function activates an employee by searching for them in the deactivated section, selecting them, and clicking the activate button.
	 * @param {string} employeeName - The name of the employee to activate.
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.activateEmployee("John Doe");
	 * // This will search for "John Doe" in the deactivated section, select them, and click the activate button.
	 */
	async activateEmployee(employeeName) {
		await this.searchEmployees(employeeName, "Deactivated");
		await this.selectEmployee(employeeName);
		await PwActions.click(this.page, this.btnDeactivateEmployee);
		await PwActions.click(this.page, this.btnYesProceed);
	}

	/**
	 * This function bulk deactivates employees by searching for them in the active section, selecting them, and clicking the deactivate button.
	 * @param {string[]} employeeNames - The names of the employees to deactivate.
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.bulkDeactivateEmployees(["John Doe", "Jane Doe"]);
	 * // This will search for "John Doe" and "Jane Doe" in the active section, select them, and click the deactivate button.
	 */
	async bulkDeactivateEmployees(employeeNames) {
		for (const employeeName of employeeNames) {
			await this.searchEmployees(employeeName, "Active");
			await this.selectEmployee(employeeName);
		}
		await PwActions.click(this.page, this.btnDeactivateEmployee);
		await PwActions.click(this.page, this.btnYesProceed);
		await CommonUtils.sleep(2);
	}
	/**
	 * Verifies an employee is present in a data issues section by searching and checking the employee row.
	 * @param {string} sectionName - The data issues section name (e.g. "Phone No. Missing").
	 * @param {string} employeeName - The employee name expected in the result row.
	 * @param {string} [searchTerm] - Optional search term. Defaults to employeeName. Use this to search by secondary email, etc.
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.verifySearchInDataIssuesPage("Phone No. Missing", "John Doe");
	 * await employeesPage.verifySearchInDataIssuesPage("Phone No. Missing", "John Doe", "john.secondary@example.com");
	 */
	async verifySearchInDataIssuesPage(sectionName, employeeName, searchTerm) {
		const searchValue = searchTerm ?? employeeName;
		await this.peoplePage.navigateToSections(sectionName);
		await CommonUtils.sleep(2);
		await this.commonfunction.search(searchValue);
		await PwActions.waitTillVisible(
			this.page,
			this.employeeRow(employeeName),
			10000,
		);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.employeeRow(employeeName),
		);
	}

	/**
	 * Fixes a data issue for an employee by filling in the missing value and clicking Update/Bulk Assign.
	 * @param {string} sectionName - The data issues section: "Phone No. Missing", "Department Missing", or "Manager Missing".
	 * @param {string} employeeName - The employee name to fix the data issue for.
	 * @param {string} value - The value to fill in (phone number, department name, or manager name).
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.fixDataIssue({sectionName: "Phone No. Missing", employeeName: "John Doe", value: "+1234567890"});
	 * await employeesPage.fixDataIssue({sectionName: "Department Missing", employeeName: "John Doe", value: "HR"});
	 * await employeesPage.fixDataIssue({sectionName: "Manager Missing", employeeName: "John Doe", value: "Approver Automation"});
	 */
	async fixDataIssue({ sectionName, employeeName, value }) {
		await this.peoplePage.navigateToSections(sectionName);
		await CommonUtils.sleep(2);
		await this.commonfunction.search(employeeName);
		await PwActions.waitTillVisible(
			this.page,
			this.employeeRow(employeeName),
			10000,
		);

		if (sectionName === "Phone No. Missing") {
			await PwActions.fill(
				this.page,
				this.txtDataIssueMobileNo(employeeName),
				value,
			);
			await PwActions.click(this.page, this.btnDataIssueUpdate);
		} else {
			await PwActions.click(this.page, this.chkboxEmployeeName(employeeName));
			await PwActions.click(this.page, this.btnDataIssueBulkAssign);
			await CommonUtils.sleep(1);
			await PwActions.click(this.page, this.drpdwnBulkAssignDialog);
			await PwActions.fill(this.page, this.drpdwnBulkAssignDialog, value);
			await CommonUtils.sleep(2);
			await PwActions.click(this.page, this.drpdwnOptionValue);
			await PwActions.click(this.page, this.btnBulkAssignDialogAssign);
		}
		await CommonUtils.sleep(2);
	}

	async sendInviteAfterImportingSliderOff() {
		await PwActions.click(this.page, this.btnSendInviteAfterImporting);
		await PwActions.click(this.page, this.btnSaveToDirectory);
	}

	async sendInviteAfterImportingSliderOn() {
		await PwActions.click(this.page, this.btnSaveToDirectory);
	}

	/**
	 * Fills the Add Employee form and verifies that the Save button is disabled,
	 * confirming the employee cannot be added. Handles both frontend validation
	 * (button disabled immediately) and server-side validation (button disabled
	 * after save attempt). Cancels the form after verification.
	 *
	 * @param {number} rowNum - Row index in the Add Manually form
	 * @param {Object} employeeData - Employee data to fill (name, employeeEmail, secondaryEmail)
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await employeesPage.attemptAddEmployeeAndVerifyBlocked(0, {
	 *   name: "TestUser", employeeEmail: "dup@test.com", secondaryEmail: "dup@test.com"
	 * });
	 */
	async attemptAddEmployeeAndVerifyBlocked({ rowNum, employeeData }) {
		await this.addEmployeeManually(rowNum, employeeData);
		const isSaveDisabled = await PwActions.isDisabled(
			this.page,
			this.btnSaveToDirectory,
		);
		if (!isSaveDisabled) {
			await PwActions.click(this.page, this.btnSaveToDirectory);
			await CommonUtils.sleep(3);
		}
		await PwActions.verifyElementIsDisabled(this.page, this.btnSaveToDirectory);
		await PwActions.click(this.page, this.lnkCancelAddEmployee);
		await CommonUtils.sleep(1);
	}

	async getEmployeeStatus(employeeEmail) {
		this.txtEmployeeStatus = `//p[text()='${employeeEmail}']/ancestor::td/following-sibling::td[4]//p`;

		this.resultedEmpStatus = await PwActions.getText(
			this.page,
			this.txtEmployeeStatus,
		);
		return this.resultedEmpStatus;
	}

	/**
	 * This function verifies the details of an employee in the participant list by checking various fields such as name, department,
	 * manager, and job title against the provided values. It compares the details displayed on the side panel with the expected values
	 * and performs the verification.
	 *
	 * @param {string} employeeEmail - The email address of the employee to verify.
	 * @param {Object} employeeDetails - An object containing the employee's details to verify.
	 * @param {string} employeeDetails.employeeName - (Optional) The expected name of the employee.
	 * @param {string} employeeDetails.nickName - (Optional) The expected nickname of the employee.
	 * @param {string} employeeDetails.department - (Optional) The expected department of the employee.
	 * @param {string} employeeDetails.manager - (Optional) The expected manager of the employee.
	 * @param {string} employeeDetails.jobtitle - (Optional) The expected job title of the employee.
	 * @param {string} employeeDetails.employeeId - (Optional) The expected employee ID.
	 * @param {string} employeeDetails.contactNumber - (Optional) The expected contact number of the employee.
	 * @param {string} employeeDetails.dateOfBirth - (Optional) The expected date of birth of the employee.
	 * @param {string} employeeDetails.gender - (Optional) The expected gender of the employee.
	 * @param {string} employeeDetails.location - (Optional) The expected location of the employee.
	 * @param {string} employeeDetails.dateOfJoining - (Optional) The expected date of joining of the employee.
	 */
	async verifyEmployeeDetails(
		employeeEmail,
		{
			employeeName,
			nickName,
			department,
			manager,
			jobtitle,
			employeeId,
			contactNumber,
			dateOfBirth,
			gender,
			location,
			dateOfJoining,
			countryName,
			language,
			secondaryEmail,
			customNumber,
			customEmail,
			customSingleLineText,
			customMultiLineText,
			customUrl,
			customDropdownValueName,
		},
	) {
		await PwActions.click(
			this.page,
			await this.elementEmployeeFromList(employeeEmail),
		);
		if (employeeName !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.lblEmployeeNameInSidePanal),
				employeeName,
			);
		}

		if (employeeEmail !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.lblEmployeeEmailInSidePanal),
				employeeEmail,
			);
		}

		if (department !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.lblDepartmentSidePanel),
				department,
			);
		}

		if (manager !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.lblManagerSidePanel),
				manager,
			);
		}

		if (jobtitle !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.lblJobTitleSidePanel),
				jobtitle,
			);
		}

		if (employeeId !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.lblEmployeeIdSidePanel),
				employeeId,
			);
		}

		if (contactNumber !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.lblPhoneNumberSidePanel),
				contactNumber,
			);

			if (dateOfBirth !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblDateofBirthSidePanel),
					dateOfBirth,
				);
			}

			if (gender !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblGenderSidePanel),
					gender,
				);
			}

			if (location !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblLocationSidePanel),
					location,
				);
			}

			if (dateOfJoining !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblDateOfJoiningSidePanel),
					dateOfJoining,
				);
			}
			if (countryName !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblCountrySidePanel),
					countryName,
				);
			}
			if (language !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblLanguageSidePanel),
					language,
				);
			}
			if (secondaryEmail !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblSecondaryEmailSidePanel),
					secondaryEmail,
				);
			}
			if (customNumber !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblCustomNumberSidePanel),
					String(Number(customNumber)),
				);
			}
			if (customEmail !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblCustomEmailSidePanel),
					customEmail,
				);
			}
			if (customSingleLineText !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(
						this.page,
						this.lblCustomSingleLineTextSidePanel,
					),
					customSingleLineText,
				);
			}
			if (customMultiLineText !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(
						this.page,
						this.lblCustomMultiLineTextSidePanel,
					),
					customMultiLineText,
				);
			}
			if (customUrl !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(this.page, this.lblCustomUrlSidePanel),
					customUrl,
				);
			}
			if (customDropdownValueName !== undefined) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(
						this.page,
						this.lblCustomDropdownValueSidePanel,
					),
					customDropdownValueName,
				);
			}
		}
	}

	async verifyEmployeeName(employeeName) {
		const resultedEmpName = await this.getEmployeeName();
		await PwActions.verifyTextExpected(resultedEmpName, employeeName);
	}

	async verifyEmployeeInviteEmailContent(
		employeeName,
		senderEmail,
		receiverEmail,
		senderEmailSubject,
	) {
		logger.info(
			`Checking invite email for ${receiverEmail} with subject: ${senderEmailSubject}`,
		);
		const email_body_name = employeeName; //.replace(/ /, "_");
		const email_body_content = `Greetings,${email_body_name}!`;
		const employee_email_body =
			await this.readEmail.fetch_mail_content_from_gmail({
				subject: senderEmailSubject,
				body: email_body_content,
			});
		await PwActions.verifyTextExpected(
			employee_email_body,
			constants.new_employee_email_body.replace(
				"<employee_name>",
				email_body_name,
			),
		);
		logger.info(`Invite email content verified for ${employeeName}`);
	}
	/**
	 /**
	  * Opens the edit page for the specified employee by their email.
	  * This function hovers over the employee's row in the table and clicks the edit button
	  * to open the employee details in edit mode.
	  * @param {string} employeeEmail - The email address of the employee to edit.
	  * @returns {string} employeeEmail - The email address of the employee whose edit page was opened.
	  * @example
	  *   await employeesPage.openEmployeeEditPage("john.doe@example.com");
	  *   // returns: "john.doe@example.com"
	  */
	async openEmployeeEditPage(employeeEmail) {
		const emailCell = `//p[text()='${employeeEmail}']`;
		const editBtn = `${emailCell}/ancestor::tr//button[contains(@aria-label,'Edit employee details')]`;
		await PwActions.hover(this.page, emailCell);
		await PwActions.waitTillVisible(this.page, editBtn, 10000);
		await PwActions.click(this.page, editBtn);
	}
	/**
	 * Sets a toggle property (such as a custom property) to a desired state ("on" or "off") for an employee property.
	 * This function locates the toggle switch for the given property name and sets it to the specified state.
	 * @param {string} propertyName - The display name of the property whose toggle should be set.
	 * @param {"on"|"off"|true|false} state - The desired state for the property toggle.
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.setPropertyState("Gender", "off");
	 * // This will turn off the "Gender" property toggle if it is currently on.
	 */

	async setPropertyState(propertyName, state) {
		const selector = this.propertyToggleSelector(propertyName);
		await PwActions.setPropertyState(this.page, selector, state);
	}
	/** This function returns email of the employees from the specified tab
	 * @param {string} tab - The tab from which emails need to be retrieved (Active, Invite Not Sent, Deactivated).
	 * @returns {Promise<Array>} A String array of emails.
	 */
	async getAllEmployeeEmails(tab) {
		await this.navigateToSubTopSection(tab);
		return await this.commonfunction.extractSelectedData(
			this.webelementsAllEmployeeEmails,
		);
	}

	/**
	 * This function sends an invite to an employee in the invite not sent section.
	 * @param {string} employeeName - The name of the employee to send the invite to.
	 * */
	async sendInviteToEmployee(employeeName) {
		await this.searchEmployees(employeeName, constants.inviteNotSent);
		await PwActions.waitTillVisible(this.page, this.employeeRow(employeeName));
		await PwActions.click(this.page, this.chkboxEmployeeName(employeeName));
		await PwActions.click(this.page, this.btnSendInvities);
		await this.searchEmployees(employeeName, constants.active);
	}

	/**
	 * This function verify all the employee from the CSV are uploaded are not
	 * @param {Array} csvEmails - Emails of employees from the CSV
	 * @param {Array} afterImportEmails - Emails of employees after import
	 */
	async verifyEmployeesImportedFromCSV(csvEmails, afterImportEmails) {
		for (const email of csvEmails) {
			await CommonUtils.verifyDataPresentInArray(email, afterImportEmails);
		}
	}

	/**
	 * Generates random CSV data for people with n number of rows, including all standard
	 * and custom properties. Returns enriched employee details for verification.
	 * @param {number} numberOfRows - Number of rows to generate
	 * @returns {Promise<{filePath: string, employeeDetails: Array<Object>}>} Generated file path and employee details
	 * @example
	 * const { filePath, employeeDetails } = await employeePage.generateRandomPeopleCSVData(1);
	 * // employeeDetails[0] = { name, email, secondaryEmail, phone, jobtitle, department, ... }
	 */
	async generateRandomPeopleCSVData(numberOfRows) {
		const dirname = path.dirname(fileURLToPath(import.meta.url));
		const filePath = path.join(
			dirname,
			"../../Data/Files/Add_Employee_Manually.csv",
		);
		const data = fs.readFileSync(filePath, "utf8");
		const headers = data.trim().split("\n")[0].split(",");
		const randomData = [];
		const employeeDetails = [];

		for (let i = 0; i < numberOfRows; i++) {
			const { employeeName, employeeEmail, secondaryEmail } =
				generateRandomEmployeeNameAndEmail();

			const empId = `E${CommonUtils.getRandomIntInclusive(100, 999)}`;
			// Generate date in yyyy-MM-dd format — matches both the CSV column and
			// the value shown in the side-panel input field after import
			const dateOfJoining = CommonUtils.getRandomDateBetween(
				new Date(),
				undefined,
				"yyyy-MM-dd",
			);
			const phoneNumber = CommonUtils.generateRandomNumbersWithLength(10);
			const randomPhone = `+91${phoneNumber}`;
			const customDropdownValueName = CommonUtils.generateRandomText(5);
			const {
				departmentName,
				jobtitleName,
				gender,
				location,
				countryName,
				languageName,
				customNumber,
				customEmail,
				customSingleLineText,
				customMultiLineText,
				customUrl,
			} = generateRandomEmployeeProperty();

			// DOB for the CSV row only — not verified since the app doesn't import it
			const dobUpperBound = new Date();
			dobUpperBound.setFullYear(dobUpperBound.getFullYear() - 25);
			const dobLowerBound = new Date();
			dobLowerBound.setFullYear(dobLowerBound.getFullYear() - 50);
			const dateOfBirth = CommonUtils.getRandomDateBetween(
				dobUpperBound,
				dobLowerBound,
				"yyyy-MM-dd",
			);

			const employeeRecord = {
				name: employeeName,
				email: employeeEmail,
				secondaryEmail,
				phone: randomPhone,
				jobtitle: jobtitleName,
				department: departmentName,
				dateOfJoining,
				employeeId: empId,
				gender,
				location,
				countryName,
				language: languageName,
				customNumber,
				customEmail,
				customSingleLineText,
				customMultiLineText,
				// The app normalizes URL fields: lowercases and appends a trailing slash
				customUrl: `${customUrl.toLowerCase()}/`,
				customDropdownValueName,
			};
			employeeDetails.push(employeeRecord);

			const randomRow = [];
			headers.forEach((header) => {
				switch (header.trim()) {
					case "Full Name":
						randomRow.push(employeeName);
						break;
					case "Email":
						randomRow.push(employeeEmail);
						break;
					case "Secondary Email":
						randomRow.push(secondaryEmail);
						break;
					case "Phone":
						randomRow.push(randomPhone);
						break;
					case "Job Title":
						randomRow.push(jobtitleName);
						break;
					case "Manager Email":
						randomRow.push(constants.managerEmail);
						break;
					case "Department":
						randomRow.push(departmentName);
						break;
					case "Is Department Lead":
						randomRow.push("No");
						break;
					case "Date of Joining":
						randomRow.push(dateOfJoining);
						break;
					case "Emp Id":
						randomRow.push(empId);
						break;
					case "Gender":
						randomRow.push(gender);
						break;
					case "Location":
						randomRow.push(location);
						break;
					case "Country":
						randomRow.push(countryName);
						break;
					case "Language":
						randomRow.push(languageName);
						break;
					case "Date of Birth":
						randomRow.push(dateOfBirth);
						break;
					case "custom number":
						randomRow.push(customNumber);
						break;
					case "custom email":
						randomRow.push(customEmail);
						break;
					case "custom single":
						randomRow.push(customSingleLineText);
						break;
					case "custom multiline":
						randomRow.push(customMultiLineText);
						break;
					case "custom url":
						randomRow.push(customUrl);
						break;
					case "custom dropdown":
						randomRow.push(customDropdownValueName);
						break;
					default:
						randomRow.push("");
				}
			});
			randomData.push(randomRow);
		}
		const generatedFilePath = await this.commonUtils.createCSVFile(
			headers,
			randomData,
		);
		return { filePath: generatedFilePath, employeeDetails };
	}

	/**
	 * This function verifies the count and pagination
	 * @param {number} totalCount - The total number of employees
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.verifyCountAndPagination(100);
	 */
	async verifyCountAndPagination(totalCount) {
		//Verify the number of employees present in the first page
		let expectedCount = 15;
		const numberOfEmployees = await PwActions.getWebElementsPage(
			this.page,
			this.listEmployees,
		);

		if (numberOfEmployees.length !== expectedCount) {
			throw new Error(
				`Expected exactly 15 employees in the list, but found ${numberOfEmployees.length}`,
			);
		}

		//Verify the number of employees present in the last page
		await PwActions.jsClick(this.page, this.btnLastPage);
		await CommonUtils.sleep(2);

		const numberOfEmployeesLastPage = await PwActions.getWebElementsPage(
			this.page,
			this.listEmployees,
		);

		if (totalCount % 15 === 0) {
			expectedCount = 15;
		} else {
			expectedCount = totalCount % 15;
		}

		if (expectedCount !== numberOfEmployeesLastPage.length) {
			throw new Error(
				`Number of employees present in the last page does not match the expected count`,
			);
		}

		//verify right number of pages are present
		const numberOfPages = parseInt(
			await PwActions.getText(this.page, this.btnLastPage),
		);
		if (numberOfPages !== Math.ceil(totalCount / 15)) {
			throw new Error(`Number of pages does not match the expected count`);
		}
	}

	/**
	 * Verifies count and pagination in data issues page
	 * @param {string} sectionName - The data issues section name: "Phone No. Missing", "Manager Missing", or "Department Missing"
	 * @param {string} sectionHeading - The data issues section heading: "Phone Number Missing", "Manager Missing", or "Department Missing"
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.verifyCountAndPaginationInDataIssues({ sectionName: "Phone No. Missing", sectionHeading: "Phone Number Missing" });
	 */
	async verifyCountAndPaginationInDataIssues({ sectionName, sectionHeading }) {
		// Navigate to the data issues section
		await this.peoplePage.navigateToSections(sectionName);
		await CommonUtils.sleep(2);

		//Verify the count shown in section name and inside the section matches
		const countDataIssues = parseInt(
			await PwActions.getText(this.page, this.txtCountDataIssues(sectionName)),
		);
		const chipCountDataIssues = parseInt(
			await PwActions.getText(
				this.page,
				this.txtChipCountDataIssues(sectionHeading),
			),
		);

		if (countDataIssues !== chipCountDataIssues) {
			logger.error(
				`Count shown in section name and inside the section does not match`,
			);
		}

		await this.verifyCountAndPagination(countDataIssues);
	}

	/**
	 * This function verifies the count and pagination in the People Directory section
	 * @param {string} subSectionName - The sub section name: "Active", "Invite Not Sent", "Deactivated"
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.verifyCountAndPaginationInPeopleDirectory("Active");
	 */

	async verifyCountAndPaginationInPeopleDirectory(subSectionName) {
		await this.navigateToSubTopSection(subSectionName);
		await CommonUtils.sleep(2);

		const countEmployeeSection = parseInt(
			await PwActions.getText(
				this.page,
				this.txtCountEmployeeSection(subSectionName),
			),
		);

		await this.verifyCountAndPagination(countEmployeeSection);
	}

	/**
	 * This function verifies that deactivating the super admin should not be allowed
	 * @param {string} adminEmail - The email of the super admin
	 * @returns {Promise<void>}
	 * @example
	 * await employeesPage.verifyDeactivateSuperAdminNotAllowed(envDetails.adminEmail);
	 */
	async verifyDeactivateSuperAdminNotAllowed(adminEmail) {
		await this.searchEmployees(adminEmail, "Active");
		await this.deactivateEmployee(adminEmail);
		await PwActions.pageRefresh(this.page);
		await this.searchEmployees(adminEmail, "Active");
	}
}

export { EmployeesPage };

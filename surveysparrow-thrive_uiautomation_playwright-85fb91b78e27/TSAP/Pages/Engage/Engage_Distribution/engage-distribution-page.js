import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
import { ParticipantsDistributionPage } from "../../Surveys/Participants_Distribution/participants-distribution-page";
import { generateRandomName } from "../../../Data/Resources/random-values";
import { constants } from "../../../Data/Resources/constants";
import logger from "playwright-framework/Core/logger.js";

class EngageDistributionPage {
	constructor(page) {
		this.page = page;
		this.commonfunction = new CommonPageFunctions(this.page);
		this.commonutils = new CommonUtils(this.page);
		this.participantsDistributionPage = new ParticipantsDistributionPage(
			this.page,
		);
		this.page = page;
		this.btnAddParticipants = "//span[text()='Add Participants']";
		this.btnInviteParticipants = "//h1[text()='Invite Participants']";
		this.btnGenerateQRCodes = "//h1[text()='Generate QR Codes']";
		this.txtChooseShareType =
			"//h1[text()='How would you like to get started?']";
		this.txtAddEmployee =
			"//div[contains(text(),'Employees')]/following::div//input";
		this.btnSaveandContinue = "//span[contains(text(),'Save ')]";
		this.btnAddMore = "//span[text()='Add More']";
		this.btnShortlist = "//span[text()='Shortlist']";
		this.getWebElementsEmployeeNames = "//tbody//td[2]/descendant::p[1]";
		this.btnManagerMissing = "//div[text()='Manager Missing']";
		this.btnDepartmentMissing = "//div[text()='Department Missing']";
		this.btnDrop =
			"//p[text()='Name']/ancestor::table//button//span[@class='twigs-button__icon-box']";
		this.chckboxSelectAll =
			"//div[@role='menuitemcheckbox'][2]//button | //label[@for='select-all']";
		this.btnBulkAssign = "//span[text()='Bulk Assign']";
		this.txtChooseOrSearchManager =
			"//div[text()='Choose or search manager']//following-sibling::div//input";
		this.txtChooseOrSearchDepartment =
			"//div[text()='Choose or search department']//following-sibling::div//input";
		this.btnAssign = "//span[text()='Assign']";
		this.toasterUpadteList = "//span[text()='Update List']";
		this.drpdownParticipants = (
			ParticipantNameOrEmailOrDepartmentOrSmartlist,
		) =>
			`//p[normalize-space()='${ParticipantNameOrEmailOrDepartmentOrSmartlist}']`;
		this.btnAddAnother = "//div[text()='Add Another']";
		this.btnAddInbulk = "//div[text()='Add in Bulk']";
		this.inputQrTitle =
			"//label[text()='QR Title']/parent::div/parent::div/parent::div/following-sibling::input";
		this.btnChooseProperty = "//p[contains(text(),'Choose')]";
		//this.btnEmployeeProperty = "//div[@type='button']/p[text()='Employees']";
		this.webElementsDepartmentNames =
			"//div[@data-side='bottom']/descendant::p"; // Department wise dropdown while choosing employee in QR Code (Non-Anonymous)
		this.webElementsPropertyNames =
			"//div[@data-side='top']/descendant::div[@data-testid='flex']/p | //div[@class='twigs-c-PJLV twigs-c-PJLV-ihakyQ-css']/descendant::p";
		this.webElementsPropertyValues =
			"//button[@data-state='closed']/p | (//div[@class='twigs-c-PJLV twigs-c-PJLV-iUazGY-css']//label)[position()>1]";
		this.btnAddQR = "//span[contains(normalize-space(),'QR')]";
		this.btnAddQRInCreateModal = "//span[text()='QR']"; //For Non-Anonymous survey
		this.iconShareTo =
			"//button[contains(@class,'twigs-c-gSguNF-hmIMsL-cv twigs-c-PJLV twigs-c-PJLV-ikDmFHT-css twigs-button')]";
		this.webElementsEmployeeNamesInShareQR =
			"//div[contains(@class,'wigs-c-PJLV-ifVGGyF-css')]/descendant::p";
		this.webElementsEmployeeNamesInDeptProperty =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-idlvXt-css']/descendant::p";
		this.btnApply = "//span[text()='Apply']";
		this.toasterSingleQRCreated = "//div[text()='QR Code Created']";
		this.toasterBulkQRCreated = "//div[text()='QR Codes Created']";
		this.inputSearchEmployee = "//input[contains(@placeholder,'Search')]";
		this.btnAllEmployees = "//p[text()='All Employees']";
		this.btnSendInvites = "(//span[text()='Send Invites'])[1]";
		this.btnSnedInvitesInLaunchModal = "(//span[text()='Send Invites'])[2]";
		this.btnInvite = "//button[text()='Invited']";
		this.btnCheckbox =
			"//p[text()='Name']//preceding::button[@role='checkbox']";
		this.btnSendReminder = "//span[text()='Send Reminder']";
		this.txtSendReminderConfirm =
			"//p[text()='Email']//following::span[text()='Send Reminder']";
		this.webElementsParticipantsTable =
			"//tbody[@class='twigs-c-PJLV twigs-c-PJLV-iewUMdQ-css']";
		this.btnSearchEmployee = "//button[@aria-label='Search employees']";
		this.btnSearchQrCode = "//button[@aria-label='Search by QR Title']";
		//this.lblSurveyParticipants = "//div[@aria-label='Survey participants']";
		this.checkboxForEmployee = (employeeName) =>
			`//p[normalize-space()='${employeeName}']/parent::div/parent::div/preceding-sibling::div`; //checkbox of en employee in qr creation modal
		this.checkBoxEmployeeToShare = (employeeName) =>
			`(//p[normalize-space()='${employeeName}']/parent::div/preceding-sibling::div/button)[1]`;
		this.checkBoxPropertyValue = (propertyValue) =>
			`//label[normalize-space()='${propertyValue}']/preceding-sibling::button`;
		this.iconEdit = "//*[name()='path' and contains(@d,'M8.33467 2')]"; // this is the svg element for edit QR code
		this.iconEditQRCode = (qrName) =>
			`//p[text()='${qrName}']/ancestor::tr/descendant::*/*[local-name()='path' and @d="M23.3867 13.4933L18.5067 8.61333"]`; // this is the svg element for edit QR code
		this.btnEclipse =
			"(//tbody//button[contains(@class,'twigs-c-gSguNF-')])[3]"; //class name is not unique
		this.btnEclipseQRCode = (qrName) =>
			`//p[text()='${qrName}']/ancestor::tr/descendant::*/*[local-name()='path' and contains(@d,"15.996 6.33334Z")]`; // this is the svg element for eclipse for a specific QR code
		this.btnCopyLink = "//div[text()='Copy Link']";
		this.btnDownloadQRCode =
			"(//tbody//button[contains(@class,'twigs-c-gSguNF-')])[2]";
		this.inputSearch = "//input[contains(@placeholder,'Search')]";
		this.txtName = (name) => `//p[normalize-space()='${name}']`;
		this.txtQRName = (name) => `//p[normalize-space()='QR-${name}']`;
		this.toasterLinkCopied = "//div[text()='Link copied successfully!']";
		this.drpdownManagerDepartment = (managerDepartmentFixName) =>
			`//div[text()='${managerDepartmentFixName}']`;
		this.txtCountInAddQR = (count) =>
			`(//span[contains(normalize-space(),'${count}')])[1]`;
		this.txtCountInAddQRSingle = "(//span[contains(normalize-space(),'1')])[2]";
		this.txtQRTitlteCount = (count) =>
			`//th[contains(normalize-space(),'${count}')]`;
		this.btnNextPage = "//button[@aria-label='Next page']";
		this.btnPreviousPage = "//button[@aria-label='Previous']";
		this.iconSharedEmployee = "//div[@role='group']/div";
		this.toastershareBeforeLaunch =
			"//div[text()='QR codes will be shared with selected employees after the survey is launched.']";
		this.txtNameUponHover = "//span[@role='tooltip']";
		this.noResultFound = "//p[text()='No result found']";
		this.inputValue = (value) => `//input[@value="${value}"]`;
		this.inputQrHeading = "//label[text()='Heading']/following::input";
		this.inputQrDescription = "//textarea[@name='Description']";
		this.btnUpdate = "//span[normalize-space()='Update']";
		this.icontoCloseModal =
			"//*[name()='svg']/*[local-name()='path' and @d='M10.6667 10.6667L21.3333 21.3333']";
		this.toasterQRUpdated = "//div[text()='QR Code changes updated']";
		this.btnPreview = "//button[text()='Preview']";
		this.btnDeleteQRCode = "//div[normalize-space()='Delete']";
		this.toasterDeleteQRCode = "//div[text()='Deleted Successfully']";
		this.screenshotDistributionOptions =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ijewRJE-css']";
		this.sample = "//div[@class='twigs-c-PJLV twigs-c-PJLV-igwMyPE-css']";

		// Phone No. Missing locator
		this.lblPhoneNoMissingCount =
			"//div[@data-testid='flex'][contains(normalize-space(.),'Phone No. Missing')]//div[@data-testid='chip']/span";

		// Exit Survey - Participant Status and Eligibility Conflicts locators
		this.btnNext =
			"//button[contains(@class,'twigs-calendar__header-nav-button--next')]";
		this.txtParticipantStatus = (participantName) =>
			`//p[normalize-space()='${participantName}']/ancestor::tr//td//p[text()='Missed' or text()='Invite Pending' or text()='Invited']`;
		this.linkEligibilityConflicts =
			"//div[contains(text(),'Eligibility Conflicts')]";
		this.txtParticipantRowInTable = (participantName) =>
			`//td[contains(normalize-space(),'${participantName}')]/ancestor::tr`;
		this.btnCalendarInSidePanel = "//button[contains(@aria-label,'Calendar')]";
		this.btnSelectDateInDatePicker =
			"//button[@data-testid='custom-date-picker_button_apply']";
		this.btnUpdateInSidePanel =
			"//div[@data-testid='drawer']//span[text()='Update']";
		this.tabDataToFix = "//button[contains(text(),'Data to Fix')]";
		this.tabOtherInfo = "//button[contains(text(),'Other Info')]";
		this.inputSchedule = "//input[@placeholder='Select Date']";
		this.txtDepartmentValueInOtherInfo =
			"//p[normalize-space()='Department:']/following-sibling::p[1]";
		this.txtManagerValueInOtherInfo =
			"//p[normalize-space()='Reporting Manager:']/following-sibling::p[1]";
		this.txtJobTitleValueInOtherInfo =
			"//p[normalize-space()='Job Title:']/following-sibling::p[1]";
	}

	/**
	 * Gets the appropriate count locator based on the count value
	 * @param {number} count - The count value to create locator for
	 * @returns {string} - The XPath locator for the count
	 */
	getCountLocator(count) {
		if (count === 1) {
			return this.txtCountInAddQRSingle;
		}
		return this.txtCountInAddQR(count.toString());
	}

	/**
	 * Function to choose share type
	 *
	 * @param {String} EmailOrTextOrQrCode - Type of share to launch the survey
	 */
	async chooseShareType(EmailOrTextOrQrCode) {
		if (EmailOrTextOrQrCode === "Email" || EmailOrTextOrQrCode === "Text") {
			await PwActions.click(this.page, this.btnInviteParticipants);
		} else if (EmailOrTextOrQrCode === "QR") {
			await PwActions.waitTillVisible(
				this.page,
				this.btnGenerateQRCodes,
				10000,
			);
			await CommonUtils.sleep(2);
			await PwActions.click(this.page, this.btnGenerateQRCodes);
		}
	}

	/**
	 * Function to add participants in a survey
	 *
	 * @param {string} ParticipantNameOrEmailOrDepartmentOrSmartlist - Name of the participant or Email or Department wise (EX : Engineering) or Smartlist wise to be added
	 */
	async addParticipantsInSurvey(ParticipantNameOrEmailOrDepartmentOrSmartlist) {
		const drpdownParticipants = this.drpdownParticipants(
			ParticipantNameOrEmailOrDepartmentOrSmartlist,
		);
		await this.chooseShareType("Email");
		await CommonUtils.sleep(2);
		await PwActions.waitTillVisible(this.page, this.btnAddParticipants);
		await PwActions.waitAndClick(this.page, this.btnAddParticipants);
		await PwActions.fill(
			this.page,
			this.txtAddEmployee,
			ParticipantNameOrEmailOrDepartmentOrSmartlist,
		);
		await PwActions.waitAndClick(this.page, drpdownParticipants);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.waitTillVisible(
			this.page,
			this.webElementsParticipantsTable,
		);

		await expect(
			this.commonfunction.waitTillLoadingElementDisappear(5),
		).resolves.not.toThrow(); // Wait for loading spinner to disappear after adding participants
		await PwActions.click(this.page, this.btnSaveandContinue);
		await PwActions.waitForNetworkIdle(this.page, 20000);
		await CommonUtils.sleep(2);
	}

	/**
	 * Function to add additional participants in a survey
	 *
	 * @param {string} ParticipantNameOrEmailOrDepartmentOrSmartlist - Name of the participant or Email or Department wise (EX : Engineering) or Smartlist wise to be added
	 */
	async addAdditionalParticipants(
		ParticipantNameOrEmailOrDepartmentOrSmartlist,
	) {
		const drpdownParticipants = this.drpdownParticipants(
			ParticipantNameOrEmailOrDepartmentOrSmartlist,
		);
		await PwActions.waitAndClick(this.page, this.btnAddMore);
		await PwActions.fill(
			this.page,
			this.txtAddEmployee,
			ParticipantNameOrEmailOrDepartmentOrSmartlist,
		);
		await PwActions.waitAndClick(this.page, drpdownParticipants);
		await PwActions.waitTillVisible(
			this.page,
			this.webElementsParticipantsTable,
		);
		await PwActions.click(this.page, this.btnSaveandContinue);
	}

	/**
	 * Function to add participants in Live Engage or Pulse Survey
	 *
	 * @param {string} ParticipantNameOrEmailOrDepartmentOrSmartlist - Name of the participant or Email or Department wise (EX : Engineering) or Smartlist wise to be added
	 */
	async addParticipantsInLiveSurvey(
		ParticipantNameOrEmailOrDepartmentOrSmartlist,
		surveyName,
	) {
		const surveyType = surveyName.toLowerCase();
		const drpdownParticipants = this.drpdownParticipants(
			ParticipantNameOrEmailOrDepartmentOrSmartlist,
		);
		if (surveyType.includes("pulse")) {
			await CommonUtils.sleep(2);
			await PwActions.pageRefresh(this.page);
			await PwActions.waitTillVisible(
				this.page,
				this.participantsDistributionPage.txtLive,
			);
		}
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(2);
		if (await PwActions.elementIsVisible(this.page, this.btnAddParticipants)) {
			await PwActions.click(this.page, this.btnAddParticipants);
		} else {
			await PwActions.click(this.page, this.btnAddMore);
		}
		await PwActions.fill(
			this.page,
			this.txtAddEmployee,
			ParticipantNameOrEmailOrDepartmentOrSmartlist,
		);
		await PwActions.waitAndClick(this.page, drpdownParticipants);
		await PwActions.click(this.page, this.btnShortlist);
		await CommonUtils.sleep(2);
	}

	/**
	 * Function to fix manager missing
	 * @param managerfixname - The name of the manager to assign
	 */
	async fixAllManagerMissing(managerFixName) {
		await CommonUtils.sleep(1);
		if (await PwActions.elementIsVisible(this.page, this.btnManagerMissing)) {
			await PwActions.click(this.page, this.btnManagerMissing);
			await PwActions.click(this.page, this.btnDrop);
			await PwActions.click(this.page, this.chckboxSelectAll);
			await CommonUtils.sleep(1);
			await PwActions.doubleClick(this.page, this.btnBulkAssign);
			await PwActions.fill(
				this.page,
				this.txtChooseOrSearchManager,
				managerFixName,
			);
			await PwActions.click(
				this.page,
				this.drpdownManagerDepartment(managerFixName),
			);
			await PwActions.click(this.page, this.btnAssign);
		}
	}
	/**
	 * Function to fix department missing
	 * @param depfixname - The name of the department to assign
	 */
	async fixAllDepartmentMissing(depFixName) {
		await CommonUtils.sleep(1);
		if (
			await PwActions.elementIsVisible(this.page, this.btnDepartmentMissing)
		) {
			await PwActions.click(this.page, this.btnDepartmentMissing);
			await PwActions.click(this.page, this.btnDrop);
			await PwActions.click(this.page, this.chckboxSelectAll);
			await CommonUtils.sleep(1);
			await PwActions.doubleClick(this.page, this.btnBulkAssign);
			await PwActions.fill(
				this.page,
				this.txtChooseOrSearchDepartment,
				depFixName,
			);
			await PwActions.click(
				this.page,
				this.drpdownManagerDepartment(depFixName),
			);
			await PwActions.click(this.page, this.btnAssign);
		}
	}

	/**
	 * Function to get property elements and their names
	 * @returns {Promise<string[]>} - Array of property names
	 */
	async getPropertyNames() {
		const propertyElements = await PwActions.getWebElementsPage(
			this.page,
			this.webElementsPropertyNames,
		);
		const propertyNames = await PwActions.getElementsText(
			this.page,
			propertyElements,
		);
		return propertyNames;
	}

	/**
	 * Function to get property values
	 * @returns {Promise<string[]>} - Array of property values
	 */
	async getPropertyValues() {
		const propertyValuesElements = await PwActions.getWebElementsPage(
			this.page,
			this.webElementsPropertyValues,
		);
		const propertyValues = await PwActions.getElementsText(
			this.page,
			propertyValuesElements,
		);
		return propertyValues;
	}

	/* Function to create QR code in Both Anonymous and Non-Anonymous survey
	 * This function will create a QR Code by selecting a random employee by selecting the random department from the dropdown and will share the QR Code to the selected employee from dropdown
	 *  In Non-Anonymous survey, the employee will be selected from the department wise dropdown
	 *
	 * @param {string} qrTitle - Title of the QR code
	 * @param {string} anonymityType - Type of survey (Anonymous or Non-Anonymous)
	 */
	async createQRCode(qrTitle, anonymityType) {
		await CommonUtils.sleep(3);
		let employeeName = constants.managerName;
		const noEmployeeName = "NOEMPLOYEE";
		if (anonymityType === "Anonymous") {
			await PwActions.waitTillVisible(this.page, this.btnAddMore);
			await PwActions.click(this.page, this.btnAddMore);
			await PwActions.click(this.page, this.btnAddAnother);
			await PwActions.fill(this.page, this.inputQrTitle, qrTitle);
			await PwActions.click(this.page, this.btnChooseProperty);
			const propertyNames = await this.getPropertyNames();
			const propertyName = generateRandomName(propertyNames);
			let name = this.txtName(propertyName);
			await PwActions.click(this.page, name);
			const propertyValues = await this.getPropertyValues();
			const propertyValue = generateRandomName(propertyValues);
			let value = this.txtName(propertyValue);
			await PwActions.click(this.page, value);
		} else {
			const addMoreVisible = await PwActions.elementIsVisible(
				this.page,
				this.icontoCloseModal,
			);
			if (addMoreVisible) {
				await PwActions.click(this.page, this.icontoCloseModal);
			}
			await PwActions.waitTillVisible(this.page, this.btnAddMore);
			await PwActions.waitForDOMContentLoaded(this.page, 15000);
			await PwActions.click(this.page, this.btnAddMore);
			await PwActions.waitTillVisible(this.page, this.btnChooseProperty);
			await CommonUtils.sleep(1);
			await PwActions.click(this.page, this.btnChooseProperty);
			await PwActions.click(this.page, this.btnAllEmployees);
			await PwActions.waitTillVisible(this.page, this.inputSearchEmployee);
			await CommonUtils.sleep(2);
			await PwActions.fill(this.page, this.inputSearchEmployee, noEmployeeName);
			await CommonUtils.sleep(3);
			await PwActions.waitTillVisible(this.page, this.noResultFound, 40000);
			await PwActions.clearAndFill(
				this.page,
				this.inputSearchEmployee,
				employeeName,
			);
			await CommonUtils.sleep(3); // Managers are not properly loading in the dropdown. so we are waiting for 3 seconds.
			await PwActions.waitTillVisible(
				this.page,
				this.webElementsEmployeeNamesInDeptProperty,
			);
			await CommonUtils.sleep(2); // Managers are not properly loading in the dropdown. so we are waiting for 3 seconds.
			const employeeCheckbox = this.checkboxForEmployee(employeeName);
			await PwActions.waitTillVisible(this.page, employeeCheckbox);
			await PwActions.click(this.page, employeeCheckbox);
			await PwActions.click(this.page, this.btnApply);
		}
		await this.shareQRCode(employeeName);
		if (anonymityType === "Anonymous") {
			await PwActions.click(this.page, this.btnAddQR);
		} else {
			await PwActions.click(this.page, this.btnAddQRInCreateModal);
		}
		await PwActions.waitTillVisible(this.page, this.iconSharedEmployee);
		await CommonUtils.sleep(1); // we need to wait till toaster dissapears. for time being we are using 1 second. we can remove once the bug is fixed
		//await PwActions.waitTillVisible(this.page, this.toasterSingleQRCreated);	 //we Have bug here for toaster once it is fixed we can uncomment this
		return [employeeName].length;
	}

	/**
	 * Creates QR codes in bulk with optional property and value filtering
	 * @param {string} [propertyName] - Optional property name to filter by
	 * @param {string[]} [propertyValues] - Optional array of property values to select
	 * @param {string[]} [employeeNames] - Optional array of employee names to share with
	 * @returns {Promise<Object>} - Returns object with totalValues array and totalEmployees count
	 *
	 * @example
	 * Create QR codes for a single property with specific values and sharing with specific employees
	 * const result = await engageDistributionPage.createQRCodeInBulk({
	 * 	propertyName: "Department",
	 * 	propertyValues: ["Engineering", "Sales"],
	 * 	employeeNames: ["John Doe", "Jane Smith"]
	 * });
	 *
	 * Create QR codes for a single property with all values and sharing with specific employees
	 * const result = await engageDistributionPage.createQRCodeInBulk({
	 * 	propertyName: "Department",
	 * 	employeeNames: ["John Doe", "Jane Smith"]
	 * });
	 *
	 * Create QR codes for a single property with all values and sharing with no employees
	 * const result = await engageDistributionPage.createQRCodeInBulk({
	 * 	propertyName: "Department"
	 * });
	 */
	async createQRCodeInBulk({
		propertyName = null,
		propertyValues = null,
		employeeNames = null,
	} = {}) {
		let employeenames = employeeNames;
		let actualCount,
			totalValues = [];
		let qrcount = 1;

		await PwActions.click(this.page, this.btnAddMore);
		await PwActions.click(this.page, this.btnAddInbulk);
		await PwActions.click(this.page, this.btnChooseProperty);

		const availablePropertyNames = await this.getPropertyNames();

		if (propertyName) {
			expect(
				availablePropertyNames,
				`Property "${propertyName}" not found in available properties: ${availablePropertyNames.join(", ")}`,
			).toContain(propertyName);

			let name = this.txtName(propertyName);
			await PwActions.click(this.page, name);
			await CommonUtils.sleep(2);
			if (propertyValues) {
				const availablePropertyValues = await this.getPropertyValues();

				for (const value of propertyValues) {
					expect(
						availablePropertyValues,
						`Value "${value}" not found in available values for property "${propertyName}": ${availablePropertyValues.join(", ")}`,
					).toContain(value);

					await PwActions.clearAndFill(
						this.page,
						this.inputSearchEmployee,
						value,
					);
					const valueCheckbox = this.checkBoxPropertyValue(value);
					await PwActions.waitTillVisible(this.page, valueCheckbox);
					await PwActions.click(this.page, valueCheckbox);
					await this.commonfunction.verifyCheckboxChecked(valueCheckbox);
				}

				totalValues = [...propertyValues];

				await PwActions.click(this.page, this.btnApply);
				for (const value of propertyValues) {
					const valueText = this.txtName(value);
					await PwActions.waitTillVisible(this.page, valueText);
					await PwActions.verifyElementIsPresent(this.page, valueText);
				}
			} else {
				totalValues = await this.getPropertyValues();
				await PwActions.click(this.page, this.chckboxSelectAll);
				await this.commonfunction.verifyCheckboxChecked(this.chckboxSelectAll);
				await PwActions.click(this.page, this.btnApply);

				const countLocator = this.getCountLocator(totalValues.length);
				await PwActions.waitTillVisible(this.page, countLocator);
				actualCount = await CommonUtils.extractCountFromText(
					this.page,
					countLocator,
				);
				expect(actualCount).toBe(totalValues.length);
			}
		} else {
			const propertyName = "Country";
			let name = this.txtName(propertyName);
			await PwActions.click(this.page, name);
			totalValues = await this.getPropertyValues();
			await PwActions.click(this.page, this.chckboxSelectAll);
			await this.commonfunction.verifyCheckboxChecked(this.chckboxSelectAll);
			await PwActions.click(this.page, this.btnApply);

			const countLocator = this.getCountLocator(totalValues.length);
			await PwActions.waitTillVisible(this.page, countLocator);
			actualCount = await CommonUtils.extractCountFromText(
				this.page,
				countLocator,
			);
			expect(actualCount).toBe(totalValues.length);
		}

		let totalEmployees = 0;

		if (employeenames) {
			await this.shareQRCode(employeenames);
			totalEmployees = totalValues.length * employeenames.length;
		}

		await PwActions.click(this.page, this.btnAddQR);
		await PwActions.waitTillVisible(this.page, this.toasterBulkQRCreated);
		await PwActions.waitTillElementDisappear(
			this.page,
			this.toasterBulkQRCreated,
		);

		logger.info(`Created QR codes for values: ${totalValues.join(", ")}`);
		return { totalValues, totalEmployees };
	}

	/**
	 * Verifies QR codes created in bulk
	 * @param {Array} totalValues - Array of values to verify
	 * @returns {Promise<boolean>} - Returns true if verification successful, false otherwise
	 */
	async verifyBulkQRCodes(totalValues) {
		let hasMorePages = true;
		let foundQRNames = [];

		expect(totalValues).toBeDefined();

		while (hasMorePages) {
			const employeeNames =
				await this.participantsDistributionPage.getEmployeeNames();

			for (const name of employeeNames) {
				if (name.length > 20) {
					const truncatedName = name.substring(0, 20) + "...";
					const nameLocator = `//p[contains(text(),'${truncatedName}')]`;
					const editIcon = this.iconEditQRCode(truncatedName);
					await PwActions.hover(this.page, nameLocator);
					await PwActions.click(this.page, editIcon);
					const fullName = await PwActions.getText(
						this.page,
						this.inputQrTitle,
					);
					await PwActions.click(this.page, this.icontoCloseModal);
					foundQRNames.push(fullName.replace("QR-", ""));
				} else {
					foundQRNames.push(name.replace("QR-", ""));
				}
			}
			hasMorePages = await this.commonfunction.clickNextOrPreviousPageIfEnabled(
				this.page,
				this.btnPreviousPage,
			);
		}

		const missingValues = totalValues.filter(
			(expected) => !foundQRNames.includes(expected),
		);

		expect(
			missingValues.length,
			`Missing QR codes: ${missingValues.join(", ")}. Found: ${foundQRNames.join(", ")}`,
		).toBe(0);

		logger.info(`✓ Successfully verified ${totalValues.length} QR codes`);
		return true;
	}

	/**
	 * Verifies the total number of employee icons matches expected count
	 * @param {number} expectedEmployeeCount - Expected number of employee icons
	 * @returns {Promise<void>}
	 */
	async verifyEmployeeIcons(expectedEmployeeCount) {
		let qrIcons = [];
		let hasMorePages = true;

		while (hasMorePages) {
			const qrIconsInCurrentPage = await PwActions.getWebElementsPage(
				this.page,
				this.iconSharedEmployee,
			);
			qrIcons.push(...qrIconsInCurrentPage);

			try {
				hasMorePages =
					await this.commonfunction.clickNextOrPreviousPageIfEnabled(
						this.page,
						this.btnNextPage,
					);
			} catch (error) {
				hasMorePages =
					await this.commonfunction.clickNextOrPreviousPageIfEnabled(
						this.page,
						this.btnPreviousPage,
					);
			}
		}

		expect(qrIcons.length).toBe(expectedEmployeeCount);
		logger.info(
			`✓ Verified ${qrIcons.length} employee icons match expected count of ${expectedEmployeeCount}`,
		);
		return Promise.resolve();
	}

	/**
	 * Shares QR code with one or more employees
	 * @param {string|string[]} employeeNames - Single employee name or array of employee names
	 * @returns {Promise<void>}
	 */
	async shareQRCode(employeeNames) {
		const employees = Array.isArray(employeeNames)
			? employeeNames
			: [employeeNames];
		await PwActions.click(this.page, this.iconShareTo);

		for (const employeeName of employees) {
			await PwActions.fill(this.page, this.inputSearchEmployee, employeeName);
			const employeeCheckbox = this.checkBoxEmployeeToShare(employeeName);
			await PwActions.click(this.page, employeeCheckbox);
			await this.commonfunction.verifyCheckboxChecked(employeeCheckbox);
		}

		await PwActions.click(this.page, this.btnApply);
	}

	/**
	 * Function to invite participants from the shortlist based on the invite type in Engagement survey
	 *
	 * @param {string} inviteType - Type of invite to be sent (Single or Bulk)
	 * @param {string} [employeeName] - Name of the employee to invite (required only for Single invite)
	 */
	async inviteParticipantsFromShortlisted(inviteType, employeeName = null) {
		let invite = inviteType.toLowerCase();
		let checkBox;
		let employees = "";

		if (invite === "single") {
			expect(
				employeeName,
				"Employee name is required for single invite",
			).toBeDefined();
			checkBox =
				this.participantsDistributionPage.checkBoxForEmployee(employeeName);
			employees =
				this.participantsDistributionPage.txtEmployeeName(employeeName);
		} else if (invite === "bulk") {
			checkBox = this.participantsDistributionPage.checkBoxSelectAll;
			employees = this.participantsDistributionPage.getWebElementsEmployeeNames;
		}
		await PwActions.click(this.page, checkBox);
		await PwActions.click(this.page, this.btnSendInvites);
		await PwActions.click(this.page, this.btnSnedInvitesInLaunchModal);
		await CommonUtils.sleep(3);
		await PwActions.verifyElementIsNotPresent(this.page, employees);
	}

	/**
	 * Function to download the QR code
	 * @param {string} QRCodeName - Name of the QR code
	 * @returns {Promise<string>} - The path to the downloaded QR code
	 */
	async downloadQRCode(QRCodeName) {
		const name = this.txtName(QRCodeName);
		await CommonUtils.sleep(1.5);
		await PwActions.hover(this.page, name);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(1.5);
		const result = await this.commonfunction.downloadFileAndReturnPath(
			this.page,
			this.btnDownloadQRCode,
		);
		return result.filePath;
	}

	/**
	 * Function to copy the QR code link
	 * @param {string} QRCodeName - Name of the QR code
	 * @returns {Promise<string>} - The URL of the QR code
	 */
	async copyQRCodeLink(QRCodeName) {
		const name = this.txtName(QRCodeName);
		await PwActions.hover(this.page, name);
		await PwActions.click(this.page, this.btnEclipse);
		await PwActions.handleBrowserPermissions(this.page, [
			"clipboard-read",
			"clipboard-write",
		]);
		const qrLink = await PwActions.copyLinkFromClipboard(
			this.page,
			this.btnCopyLink,
		);
		await PwActions.waitTillVisible(this.page, this.toasterLinkCopied);
		return qrLink;
	}

	/**
	 * Function to get the URL from downloaded QR code
	 * @param {string} QRCodeName - Name of the QR code
	 * @returns {Promise<string>} The URL encoded in the QR code
	 */
	async getQRCodeUrl(QRCodeName) {
		const downloadPath = await this.downloadQRCode(QRCodeName);
		const qrUrl = await this.commonutils.decodeQRCodeUrl(downloadPath);
		return qrUrl;
	}

	async SendReminder() {
		await PwActions.pageRefresh(this.page);
		await PwActions.click(this.page, this.btnInvite);
		await PwActions.click(this.page, this.btnCheckbox);
		await PwActions.click(this.page, this.btnSendReminder);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(0.5);
		await PwActions.click(this.page, this.txtSendReminderConfirm);
		await PwActions.click(this.page, this.btnCheckbox);
	}
	/**
	 * Function to wait for the current pulse survey to be live
	 */
	async waitForCurrentPulseSurveyToBeLive() {
		await CommonUtils.sleep(130);
		await PwActions.pageRefresh(this.page);
		await PwActions.waitTillVisible(
			this.page,
			this.participantsDistributionPage.txtLive,
		);
	}

	/**
	 * Function to search for an employee and verify their presence in the distribution list in Engage Distribution page
	 * @param {string} employeeName - The name of the employee to search for
	 */
	async searchEmployee(employeeName) {
		const noParticipant = constants.subjectName;
		await PwActions.waitTillVisible(this.page, this.btnAddMore);
		const searchVisible = await PwActions.elementIsVisible(
			this.page,
			this.btnSearchEmployee,
		);
		if (searchVisible) {
			await PwActions.click(this.page, this.btnSearchEmployee);
		}
		await PwActions.fill(this.page, this.inputSearch, employeeName);
		await CommonUtils.sleep(1);
		await this.participantsDistributionPage.verifyEmployeeOrQRCode([
			employeeName,
		]);
		await PwActions.clearAndFill(this.page, this.inputSearch, noParticipant);
		await CommonUtils.sleep(1);
		await PwActions.verifyElementIsNotPresent(
			this.page,
			this.participantsDistributionPage.txtEmployeeName(noParticipant),
		);
		await PwActions.clear(this.page, this.inputSearch);
	}

	/**
	 * Function to edit the QR code
	 * @param {string} qrName - Name of the QR code to be edited
	 * @param {string} qrTitle - Title of the QR code to modify (mandatory)
	 * @param {string} [qrHeading] - Optional heading of the QR code to modify
	 * @param {string} [qrDescription] - Optional description of the QR code to modify
	 *
	 * @example
	 * // Edit only title
	 * await engageDistributionPage.editQrCode("MyQR", "New Title");
	 *
	 * // Edit title and heading
	 * await engageDistributionPage.editQrCode("MyQR", "New Title", "New Heading");
	 *
	 * // Edit all fields
	 * await engageDistributionPage.editQrCode("MyQR", "New Title", "New Heading", "New Description");
	 */
	async editQrCode(qrName, qrTitle, qrHeading = null, qrDescription = null) {
		const qrcode = this.txtName(qrName);
		const editIcon = this.iconEditQRCode(qrName);
		await PwActions.hover(this.page, qrcode);
		await PwActions.click(this.page, editIcon);

		await PwActions.clearAndFill(this.page, this.inputQrTitle, qrTitle);

		if (
			(qrHeading !== null && qrHeading !== undefined) ||
			(qrDescription !== null && qrDescription !== undefined)
		) {
			await PwActions.click(this.page, this.btnPreview);
		}

		if (qrHeading !== null && qrHeading !== undefined) {
			await PwActions.clearAndFill(this.page, this.inputQrHeading, qrHeading);
		}

		if (qrDescription !== null && qrDescription !== undefined) {
			await PwActions.clearAndFill(
				this.page,
				this.inputQrDescription,
				qrDescription,
			);
		}

		await PwActions.click(this.page, this.btnUpdate);
		await PwActions.waitTillVisible(this.page, this.toasterQRUpdated);
		const qrTitleElement = this.txtName(qrTitle);
		await PwActions.waitTillVisible(this.page, qrTitleElement);
		return Promise.resolve();
	}

	/**
	 * Function to verify the edited QR code
	 * @param {string} qrName - Name of the QR code to be verified
	 * @param {string} qrTitle - Title of the QR code to verify (mandatory)
	 * @param {string} [qrHeading] - Optional heading of the QR code to verify
	 * @param {string} [qrDescription] - Optional description of the QR code to verify
	 *
	 * @example
	 * // Verify only title
	 * await engageDistributionPage.verifyEditedQrCode("MyQR", "New Title");
	 *
	 * // Verify title and heading
	 * await engageDistributionPage.verifyEditedQrCode("MyQR", "New Title", "New Heading");
	 *
	 * // Verify all fields
	 * await engageDistributionPage.verifyEditedQrCode("MyQR", "New Title", "New Heading", "New Description");
	 */
	async verifyEditedQrCode(qrName, qrHeading = null, qrDescription = null) {
		const editIcon = this.iconEditQRCode(qrName);
		const qrcode = this.txtName(qrName);
		await PwActions.hover(this.page, qrcode);
		await PwActions.click(this.page, editIcon);
		const qrNameElement = this.inputValue(qrName);

		await PwActions.verifyElementIsPresent(this.page, qrNameElement);
		if (
			(qrHeading !== null && qrHeading !== undefined) ||
			(qrDescription !== null && qrDescription !== undefined)
		) {
			await PwActions.click(this.page, this.btnPreview);
		}

		if (qrHeading !== null && qrHeading !== undefined) {
			const qrHeadingElement = await PwActions.getText(
				this.page,
				this.inputQrHeading,
			);
			expect(qrHeadingElement).toBe(qrHeading);
		}

		if (qrDescription !== null && qrDescription !== undefined) {
			const qrDescriptionElement = await PwActions.getText(
				this.page,
				this.inputQrDescription,
			);
			expect(qrDescriptionElement).toBe(qrDescription);
		}

		await PwActions.click(this.page, this.icontoCloseModal);
	}

	/**
	 * Function to delete a QR code
	 * @param {string} qrName - Name of the QR code to be deleted
	 * @returns {Promise<void>} - A promise that resolves when the QR code is deleted
	 */
	async deleteQRCode(qrName) {
		const qrcode = this.txtName(qrName);
		await PwActions.hover(this.page, qrcode);
		const deleteIcon = this.btnEclipseQRCode(qrName);
		await PwActions.click(this.page, deleteIcon);
		await PwActions.click(this.page, this.btnDeleteQRCode);
		await PwActions.waitTillVisible(this.page, this.toasterDeleteQRCode);
		return Promise.resolve();
	}

	/**
	 * Function to verify the deleted QR code
	 * @param {string} qrName - Name of the QR code to be verified
	 */
	async verifyDeletedQRCode(qrName) {
		const qrcode = this.txtName(qrName);
		await PwActions.verifyElementIsNotPresent(this.page, qrcode);
	}

	/**
	 * Function to verify the distribution options it verifies if there is anydesign change in the distribution options
	 * @param {string} fileToCompare - The file to compare with the baseline
	 * @example
	 * // Verify distribution options
	 * await engageDistributionPage.verifyDistributionOptions("distributionOptions.jpeg");
	 */
	async verifyDistributionOptions(fileToCompare) {
		const screenshotPath = await PwActions.takeScreenshotAndReturnPath(
			this.page,
			"distributionOptions.jpeg",
			{ elements: [this.screenshotDistributionOptions] },
		);
		const baselinePath = `./TSAP/Data/Screenshots/${fileToCompare}`;

		try {
			await CommonUtils.compareImages(baselinePath, screenshotPath, 7);
			logger.info(
				`Successfully verified distribution options screenshot against baseline: ${fileToCompare}`,
			);
		} catch (error) {
			logger.error(`Screenshots do not match: ${error.message}`);
			throw new Error(
				`Screenshots do not match. Current: ${screenshotPath}, Baseline: ${baselinePath}. Error: ${error.message}`,
			);
		}
	}
	/**
	 * Function to navigate between 'Invite' and 'Shortlist' tabs in the distribution page.
	 * @param {string} buttonType - The type of tab to navigate to ("invite" or "shortlisted").
	 * @example
	 * // Navigate to the Invite tab
	 * await engageDistributionPage.navigateToInviteOrShortlistTab("invite");
	 * // Navigate to the Shortlist tab
	 * await engageDistributionPage.navigateToInviteOrShortlistTab("shortlisted");
	 */

	async navigateToInviteOrShortlistTab(buttonType) {
		if (buttonType === "invite") {
			await PwActions.click(this.page, this.btnInvite);
		} else if (buttonType === "shortlisted") {
			await PwActions.click(this.page, this.btnShortlist);
		} else {
			throw new Error(`Invalid button type: ${buttonType}`);
		}
	}

	/**
	 * Gets the count of participants missing phone numbers
	 * @returns {Promise<number>} - The count of participants missing phone numbers, or 0 if element not found
	 * @example
	 * const missingPhoneCount = await engageDistributionPage.getPhoneNoMissingCount();
	 */
	async getPhoneNoMissingCount() {
		try {
			await CommonUtils.sleep(2);
			const isVisible = await PwActions.elementIsVisible(
				this.page,
				this.lblPhoneNoMissingCount,
			);
			if (isVisible) {
				const countText = await PwActions.getText(
					this.page,
					this.lblPhoneNoMissingCount,
				);
				const count = parseInt(countText, 10);
				logger.info(
					`Phone No. Missing count text: "${countText}", parsed: ${count}`,
				);
				return isNaN(count) ? 0 : count;
			}
			logger.info("Phone No. Missing label not visible, returning 0");
			return 0;
		} catch (error) {
			logger.info(
				`Phone No. Missing element not found, returning 0: ${error.message}`,
			);
			return 0;
		}
	}

	/**
	 * Verifies the status of a participant in the distribution table.
	 * @param {string} participantName - The name of the participant to verify.
	 * @param {string} expectedStatus - The expected status (e.g., "Missed", "Invite Pending", "Invited").
	 * @example
	 * // Verify participant status is "Missed"
	 * await engageDistributionPage.verifyParticipantStatus("John Doe", "Missed");
	 */
	async verifyParticipantStatus(participantName, expectedStatus) {
		const statusLocator = this.txtParticipantStatus(participantName);
		await PwActions.waitTillVisible(this.page, statusLocator, 10000);
		const actualStatus = await PwActions.getText(this.page, statusLocator);
		expect(actualStatus.trim()).toBe(expectedStatus);
		logger.info(
			`Verified participant "${participantName}" has status: ${expectedStatus}`,
		);
	}

	/**
	 * Navigates to the Eligibility Conflicts section in the distribution page.
	 * @example
	 * await engageDistributionPage.navigateToEligibilityConflicts();
	 */
	async navigateToEligibilityConflicts() {
		await PwActions.pageRefresh(this.page);
		await CommonUtils.sleep(2);
		await this.commonfunction.waitTillLoadingElementDisappear(10);

		await PwActions.waitTillVisible(
			this.page,
			this.linkEligibilityConflicts,
			15000,
		);
		await PwActions.click(this.page, this.linkEligibilityConflicts);
		await this.commonfunction.waitTillLoadingElementDisappear(10);
		logger.info("Navigated to Eligibility Conflicts section");
	}

	/**
	 * Opens the side panel for a participant by clicking on their row in the table.
	 * @param {string} participantName - The name of the participant to open side panel for.
	 * @example
	 * await engageDistributionPage.openParticipantSidePanel("John Doe HR");
	 */
	async openParticipantSidePanel(participantName) {
		await CommonUtils.sleep(2);
		await this.commonfunction.waitTillLoadingElementDisappear(10);

		const rowLocator = this.txtParticipantRowInTable(participantName);
		await PwActions.waitTillVisible(this.page, rowLocator, 15000);
		await PwActions.click(this.page, rowLocator);
		await CommonUtils.sleep(1);
		logger.info(`Opened side panel for participant: ${participantName}`);
	}

	/**
	 * Verifies that the scheduled button is disabled in the side panel.
	 * This is used for Exit surveys to verify that the "7th day round on:" section
	 * shows a disabled schedule when no valid last working day is set.
	 * @example
	 * await engageDistributionPage.verifyScheduledButtonDisabled();
	 */
	async verifyScheduledButtonDisabled() {
		await CommonUtils.sleep(2);
		await PwActions.scrollUsingMouseWheel(this.page, 0, 100);
		await CommonUtils.sleep(1);
		const isDisabled = await PwActions.isElementDisabledOrEnabled(
			this.page,
			this.inputSchedule,
		);
		expect(isDisabled).toBeTruthy();
	}

	/**
	 * Selects a date in the date picker by clicking the calendar button,
	 * navigating to the correct month if needed, selecting the date, and clicking "Select".
	 * @param {number} daysFromNow - Number of days from today to select (default: 7).
	 * @example
	 * // Select a date 7 days from now
	 * await engageDistributionPage.updateDateInDatePicker(7);
	 */
	async updateDateInDatePicker(daysFromNow = 7) {
		// Click on calendar button
		await PwActions.waitTillVisible(
			this.page,
			this.btnCalendarInSidePanel,
			10000,
		);
		await PwActions.click(this.page, this.btnCalendarInSidePanel);
		await CommonUtils.sleep(1);

		// Calculate the target date
		const today = new Date();
		const targetDate = new Date();
		targetDate.setDate(targetDate.getDate() + daysFromNow);
		const targetMonth = targetDate.getMonth();
		const targetYear = targetDate.getFullYear();
		const currentMonth = today.getMonth();
		const currentYear = today.getFullYear();

		// Calculate months to navigate
		const monthsToNavigate =
			(targetYear - currentYear) * 12 + (targetMonth - currentMonth);
		logger.info(
			`Need to navigate ${monthsToNavigate} months forward to reach ${targetMonth + 1}/${targetYear}`,
		);

		// Navigate to the correct month if needed (using JavaScript to avoid viewport issues)
		if (monthsToNavigate > 0) {
			for (let i = 0; i < monthsToNavigate; i++) {
				if (await PwActions.elementIsVisible(this.page, this.btnNext)) {
					await PwActions.scroll(this.page, this.btnNext);
					await PwActions.click(this.page, this.btnNext);
					await CommonUtils.sleep(0.5);
				}
			}
		}

		// Format the date for aria-label matching
		// The aria-label format is "Thursday, January 2, 2026" (US format)
		const dateOptions = {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		};
		const formattedDate = targetDate.toLocaleDateString("en-US", dateOptions);
		const dateButtonLocator = `//button[contains(@aria-label,'${formattedDate}')]`;
		await PwActions.waitTillVisible(this.page, dateButtonLocator, 10000);
		await PwActions.click(this.page, dateButtonLocator);
		await PwActions.click(this.page, this.btnSelectDateInDatePicker);
		logger.info(`Selected date ${daysFromNow} days from now: ${formattedDate}`);

		await PwActions.waitTillVisible(
			this.page,
			this.btnUpdateInSidePanel,
			10000,
		);
		await PwActions.click(this.page, this.btnUpdateInSidePanel);
		await this.commonfunction.waitTillLoadingElementDisappear(10);
		logger.info("Clicked Update button in side panel");
	}

	/**
	 * Verifies the employee details in the "Other Info" tab of the side panel.
	 * @param {Object} expectedDetails - Expected employee details.
	 * @param {string} [expectedDetails.department] - Expected department name.
	 * @param {string} [expectedDetails.manager] - Expected reporting manager name.
	 * @param {string} [expectedDetails.jobTitle] - Expected job title.
	 * @example
	 * await engageDistributionPage.verifyOtherInfoDetails({ department: "HR", manager: "Evaluator Automation" });
	 */
	async verifyOtherInfoDetails(expectedDetails) {
		await this.navigateToEligibilityConflictsSidePanelTab("Other Info");
		await CommonUtils.sleep(1);
		if (expectedDetails.department) {
			const actualDepartment = await PwActions.getText(
				this.page,
				this.txtDepartmentValueInOtherInfo,
			);
			expect(actualDepartment.trim()).toBe(expectedDetails.department);
			logger.info(`Verified department: ${expectedDetails.department}`);
		}

		if (expectedDetails.manager) {
			const actualManager = await PwActions.getText(
				this.page,
				this.txtManagerValueInOtherInfo,
			);
			expect(actualManager.trim()).toBe(expectedDetails.manager);
			logger.info(`Verified reporting manager: ${expectedDetails.manager}`);
		}
		if (expectedDetails.jobTitle) {
			const actualJobTitle = await PwActions.getText(
				this.page,
				this.txtJobTitleValueInOtherInfo,
			);
			expect(actualJobTitle.trim()).toBe(expectedDetails.jobTitle);
			logger.info(`Verified job title: ${expectedDetails.jobTitle}`);
		}
	}

	/**
	 * Navigates to the "Other Info" or "Data to Fix" tab in the side panel.
	 * @param {string} tabName - The name of the tab to navigate to ("Other Info" or "Data to Fix").
	 * @example
	 * await engageDistributionPage.navigateToEligibilityConflictsSidePanelTab("Other Info");
	 * await engageDistributionPage.navigateToEligibilityConflictsSidePanelTab("Data to Fix");
	 */
	async navigateToEligibilityConflictsSidePanelTab(tabName) {
		if (tabName === "Other Info") {
			await PwActions.waitTillVisible(this.page, this.tabOtherInfo, 10000);
			await PwActions.click(this.page, this.tabOtherInfo);
			await CommonUtils.sleep(1);
			logger.info("Navigated to Other Info tab");
		} else if (tabName === "Data to Fix") {
			await PwActions.waitTillVisible(this.page, this.tabDataToFix, 10000);
			await PwActions.click(this.page, this.tabDataToFix);
			await CommonUtils.sleep(1);
			logger.info("Navigated to Data to fix tab");
		} else {
			throw new Error(`Invalid tab name: ${tabName}`);
		}
	}
}

export { EngageDistributionPage };

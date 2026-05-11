import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

class ParticipantsDistributionPage {
	constructor(page) {
		this.page = page;
		this.getWebElementsEmployeeNames = "//tbody//td[2]/descendant::p[1]";
		this.getEvaluatorOrApproverNamesElements =
			"//tbody//td[1]/descendant::p[1]";
		this.txtLive = "//p[text()='Live']";
		this.btnShortlisted = "//button[text()='Shortlisted']";
		this.btnInvited = "//button[text()='Invited']";
		this.checkBoxSelectAll = "(//button[@role='checkbox'])[1]";
		this.webElementsCheckBoxes = "//button[@role='checkbox']";
		this.checkBoxForEmployee = (employeeName) =>
			`//p[normalize-space()='${employeeName}']/ancestor::tr//button[@role='checkbox']`;
		this.txtEmployeeName = (employeeName) =>
			`//p[normalize-space()='${employeeName}']`;
		this.btnDeleteParticipant = "//button[@aria-label='Delete participant']";
		this.btnDelete =
			"//button//span[text() ='Yes, Proceed'] | //button//span[text() ='Yes, delete']"; // Button xpath is same for delete function - "Yes, Proceed" for Engage, "Yes, delete" for 360
		this.toastParticipantDeleted =
			"//div[normalize-space(text())='Participant deleted successfully!']";
	}

	/**
	 * Function to get elements for employee names
	 * @returns {Promise<Array>} - Array of employee elements
	 */
	async getEmployeeNamesElements() {
		await PwActions.waitTillVisible(
			this.page,
			this.getWebElementsEmployeeNames,
		);
		const employeElements = await PwActions.getWebElementsPage(
			this.page,
			this.getWebElementsEmployeeNames,
		);
		return employeElements;
	}

	/**
	 * Function to get employee names in Distribution page
	 * @returns {Promise<Array>} - Array of employee names
	 */
	async getEmployeeNames() {
		const employeeElements = await this.getEmployeeNamesElements();
		const employeeNames = await PwActions.getElementsText(
			this.page,
			employeeElements,
		);
		return employeeNames;
	}

	/**
	 * Function to get evaluator or approver names
	 * @returns {Promise<Array>} - Array of evaluator or approver names
	 * @example
	 * await participantsDistributionPage.getEvaluatorOrApproverNames();
	 */
	async getEvaluatorOrApproverNames() {
		const employeeNames = [];
		const employeeElements = await PwActions.getWebElementsPage(
			this.page,
			this.getEvaluatorOrApproverNamesElements,
		);
		for (const element of employeeElements) {
			const text = await PwActions.getElementsText(this.page, [element]);
			employeeNames.push(text[0]);
		}
		return employeeNames;
	}

	/**
	 * Function to verify employee or QR code in Distribution page
	 *
	 * @param {string|Array} employeeNameOrQRCode - Name of the Employee or QR code (can be string or array)
	 */
	async verifyEmployeeOrQRCode(employeeNameOrQRCode, surveyTab) {
		await CommonUtils.sleep(2);
		let employeeNames;
		const tab = (surveyTab || "").toLowerCase();
		if (tab === "evaluators" || tab === "approvers") {
			employeeNames = await this.getEvaluatorOrApproverNames();
		} else {
			employeeNames = await this.getEmployeeNames();
		}
		// Ensure employeeNameOrQRCode is always an array
		const searchArray = Array.isArray(employeeNameOrQRCode)
			? employeeNameOrQRCode
			: [employeeNameOrQRCode];
		CommonUtils.verifyArrayContainsAllElements(employeeNames, searchArray);
	}

	/**
	 * Function to navigate to a specific tab
	 * @param {string} tabName - Name of the tab to navigate to
	 */
	async navigateToTab(tabName) {
		if (tabName === "Shortlisted") {
			await PwActions.click(this.page, this.btnShortlisted);
		} else if (tabName === "Invited") {
			await PwActions.click(this.page, this.btnInvited);
			await CommonUtils.sleep(1); // we need sleep here since it is taking some time to display shortlisted employee , if we wait till visible also won't work for bulk inviting
		}
	}

	/**
	 * This function is to delete the participants from the participants list.
	 * For surveyType "360", it will wait for the participant deleted toast.
	 * For surveyType "engage", it will perform the same deletion steps but skip the toast wait.
	 * @param {string} subjectName - The name of the subject
	 * @param {string} surveyType - The type of the survey ("360" or "engage")
	 * @example
	 * await participantsDistributionPage.deleteParticipants(constants.subjectName, "360");
	 * await participantsDistributionPage.deleteParticipants(constants.subjectName, "engage");
	 */
	async deleteParticipants(subjectName, surveyType) {
		const subjectElement = this.checkBoxForEmployee(subjectName);
		await PwActions.click(this.page, subjectElement);
		await PwActions.click(this.page, this.btnDeleteParticipant);
		await PwActions.click(this.page, this.btnDelete);
		if (surveyType === "360") {
			await PwActions.waitForElementVisibility(
				this.page,
				this.toastParticipantDeleted,
			);
		}
		await CommonUtils.sleep(2);
	}
}

export { ParticipantsDistributionPage };

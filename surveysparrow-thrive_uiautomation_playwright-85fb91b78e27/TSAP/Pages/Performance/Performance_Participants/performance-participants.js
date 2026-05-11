import path from "path";
import fs from "fs";
import { expect } from "@playwright/test";
import { fileURLToPath } from "url";
import logger from "playwright-framework/Core/logger.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions";
import { envDetails } from "../../../Data/test-data";
import { constants } from "../../../Data/Resources/constants";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import { ParticipantsDistributionPage } from "../../Surveys/Participants_Distribution/participants-distribution-page";
import { SurveyPage } from "../../Surveys/Survey_Listing_Page/survey-page";
import { EngageDistributionPage } from "../../Engage/Engage_Distribution/engage-distribution-page";
import { EntityIds } from "../../../Shared_Functions/entityId.js";
import { GuestsPage } from "../../People/guests-page";
import { EmployeesPage } from "../../People/employees-page";
import { PeoplePage } from "../../People/people-page";
class PerformanceParticipantsPage {
	constructor(page) {
		this.page = page;
		this.commonutils = new CommonUtils();
		this.commonPageFunctions = new CommonPageFunctions(this.page);
		this.distributionParticipantsPage = new ParticipantsDistributionPage(
			this.page,
		);
		this.drpdownParticipants = new EngageDistributionPage(this.page);
		this.readEmail = new ReadEmail();
		this.surveyPage = new SurveyPage(this.page);
		this.guestsPage = new GuestsPage(this.page);
		this.employeesPage = new EmployeesPage(this.page);
		this.peoplePage = new PeoplePage(this.page);
		this.btnAddParticipants = "//span[text()='Add Participants']";
		this.btnAddManually = "//p[contains(text(),'Add Manually')]";
		this.btnImportFromCSV = "//p[contains(text(),'Import from CSV')]";
		this.btnAutoGenerate = "//p[contains(text(),'Auto Generate')]";
		this.txtSubject = "//p[text()='Subject']/parent::div//input";
		this.txtEvaluatedBy = "//p[text()='Evaluated by']/parent::div//input";
		this.txtApprovedBy = "//p[text()='Approved by']/parent::div//input";
		this.btnAddToShortlist = "//span[text()='Add to shortlist']";
		this.btnAddEvaluator = "//span[text()='Add Evaluator']";
		this.btnSendInvites = "//span[text()='Send Invites']";
		this.btnSendInvite = "//span[text()='Send Invite']";
		this.btnChooseEvaluatorRole = "//span[text()='Choose role']/parent::button";
		this.btnNewEvaluator = "button:text-is('New Evaluator')"; //--CSS Selector
		this.btnCloseModal = "//button[@aria-label='Close modal']";
		this.btnLaunchSurvey = "//button[@aria-label='Launch survey']";
		this.dropdownLaunchNow = "div:text-is('Launch Now')";
		this.dropdownScheduleLater = "//div[text()='Schedule for later']";
		this.btnLauchNowFinalConfirmation = "//span[text()='Launch Now']";
		this.txtAdditionalEvaluator = "//p[text()='Evaluator']/parent::div//input";
		this.txtAdditionalEvaluatorRole = "//p[text()='Role']/parent::div//input";
		this.btnAdditionalEvaluatorAddEvatuator =
			"(//span[text()='Add Evaluator'])[2]";
		this.lblInviteAddConfirmation = "div:text-is('Invite sent successfully.')";
		this.uploadOrDropParticipants = "//input[@type='file']";
		this.lblSurveyLaunchedConfirmation =
			"//div[text()='Survey has been launched successfully']";
		this.btnDownloadParticipants =
			"//button[contains(@class,'twigs-c-PJLV-ifCtkgv-css PJLV twigs-button')]";
		this.btnDownloadParticipantsAsCsv = "//div[text()='As CSV']";
		this.getWebElementsEmployeeNames = "//tbody//td[2]/descendant::p[1]";
		this.txtEvaluationStatus =
			"//p[text()='Sakthi']/ancestor::div/following-sibling::div/p";
		this.txtEvaluatorsNamesUponHover = "//div[@data-side='top']";
		this.webElementsEvaluatorNamesOfSubject =
			"//p[text()='Evaluator']/parent::div/div[1]/div/div/div/following-sibling::div/p[1]";
		this.btnShortlistParticipants = "//span[text()='Shortlist Participants']";
		this.webElementsEvaluatorStatusForSubject =
			"(//div[@data-testid='box']/child::div[@data-testid='flex']/child::div/p)[position()>3]";
		this.txtNoParticipants = "//h1[text()='No one here, for now.']";
		this.toastShortlistSuccess = "//div[text()='Successfully shortlisted!']";
		this.toastInviteSuccess = "//div[text()='Successfully invited!']";
		this.btnSearchParticipant = "//button[@aria-label='Search Participants']";
		this.btnSendReminderParticipants = "//button[@aria-label='send reminder']";
		this.chkboxRemindApprovers = "//button[@id='evaluators']";
		this.chkboxRemindEvaluators = "//button[@id='approvers']";
		this.chkboxRemindSubjects = "//button[@id='subjects']";
		this.btnSendReminder = "//span[text()='Send Reminder']";
		this.toastInviteSuccessFromShortlist = (count) =>
			`//div[text()='${count} participant has been invited'] | //div[text()='${count} participants have been invited']`;
		this.btnEvaluatorsTab = "//a//div[text()='Evaluators']";
		this.btnApproversTab = "//a//div[text()='Approvers']";
		this.btnSubjectsTab = "//a//div[text()='Subjects']";
		this.webElementsEmployeeNames = "//tbody//td[1]/descendant::p[1]";
		this.btnDownloadSampleParticipantsCSV = "//a[text()='Download sample CSV']";
		this.btnBackButton =
			"//button[contains(@class,'twigs-c-gSguNF twigs-c-gSguNF-buxqVs-size-md')]//span/div";
		this.evaluatorNameElement = (evaluatorName) =>
			`//p[text()="Evaluator"]/following-sibling::div[1]//p[text()="${evaluatorName}"]`;
		this.approverNameElement = (approverName) =>
			`//p[text()="Approver"]/following-sibling::div//p[@data-testid="text" and text()="${approverName}"]`;
		this.btnDelete = "//button//span[text() ='Yes, delete']";
		this.toastParticipantDeleted =
			"//div[normalize-space(text())='Participant deleted successfully!']";
		this.toastChangeApprover = "//div[text()='Approver added successfully']";
		this.btnChangeApprover =
			"//p[normalize-space(text())='Approver']/following-sibling::div//button[@aria-label='Delete collaborator']";
		this.txtAddApprover =
			"//div[contains(@class,'twigs-select__value-container')]//input";
		this.btnAddApprover = "//span[text()='Add Approver']/parent::button";
		this.toastSuccess = "//div[text()='Added Successfully']";
		this.btnSideMenu = (menuName) => `//div[text()='${menuName}']`;
		this.txtEvaluatorName = "//p[text()='Evaluator']/parent::div//input";
		this.inputForSubject = "//p[text()='For Subjects']/parent::div//input";
		this.toastEvaluatorAdded = "//div[text()='Evaluator added successfully']";
		this.btnInviteNow = "//span[text()='Invite Now']/parent::button";
		this.btnBackButtonFromImportLogs =
			"//h1[text()='Logs']/preceding-sibling::button";
		this.btnDeleteParticipant = "//button[@aria-label='Delete participant']";
		this.btnShortlistParticipantsSection = "//button[text()='Shortlisted']";
		this.btnInvitedParticipantsSection = "//button[text()='Invited']";
		this.txtParticipantNameOnAddParticipantsModal = (participantName) =>
			`//p[text()='${participantName}']`;
		this.btnDeleteParticipantOnAddParticipantsModal = (participantName) =>
			`//div[contains(@id, "evaluator-list-item")][.//p[text()="${participantName}"]]//button[@data-testid="delete-button"]`;
		this.lblSubjectCount = (tab) =>
			`//button[text()='${tab}']//div[contains(@data-testid,'all-participants_chip')]`;
		this.lblEntiresCreatedLatestRow = (filename) =>
			`(//td[div//text()='${filename}']/ancestor::tr/td[4])[1]`;
		this.lblErrorCreatedLatestRow = (filename) =>
			`(//td[div//text()='${filename}']/ancestor::tr/td[6])[1]`;
		this.btnReloadImportStatus = (filename) =>
			`(//td[.//text()[normalize-space()='${filename}']]/ancestor::tr/td[7])[1]/div`;

		// Auto setup locators
		this.drpdownAddDepartmentOrSmartList =
			"//div[contains(@class, 'twigs-select__control')]";
		this.inputAddDepartmentOrSmartList =
			"//div[contains(text(),'Add Department or smart list')]/following::div//input";
		this.btnDefineEvaluators = "//div//span[text() = 'Define Evaluators']";
		this.btnAutoGenerateEvaluatorsConditions =
			"//button[@data-testid='auto-generate-evaluators-conditions_button']//span[text() = 'Define Evaluators']";
		this.btnAutoGenerateConfiguration =
			"//button[@data-testid='auto-generate-configuration_button']//span[text() = 'Generate Participants']";
		this.btnContinue =
			"//div[@role='dialog']//div//button//span[text()='Continue']";
		this.btnSpin =
			"//div[@style= 'animation: 1.5s linear 0s infinite normal none running spin;']//span";
		this.btnBulkAssign =
			"//div[contains(@class, 'bulk-action-toolbar')]//button//span[text()='Bulk Assign']";
		this.btnShortlistParticipants =
			"//div//button//span[text()='Shortlist Participants']";
		this.btnYesShortlist =
			"//div[@role='alertdialog']//span[text() = 'Yes, Shortlist']";
		this.btnGoToShortlisted =
			"//ol//li//div//button//span[text()='Go to shortlisted']";
		this.bannerParticipantsAreBeingShortlisted =
			"//div[@style='animation: 1.5s linear 0s infinite normal none running spin;']/following-sibling::p[text()='Participants are being shortlisted.']";
		this.btnSelectAll =
			"//table[@data-testid='common-table_table']//thead//tr//div//button[@data-state='unchecked']";
		this.btnSelectOne = (participantName) =>
			`//p[text() = '${participantName}']/ancestor::tr[1]//button[@role='checkbox']`;
		this.btnYesShortlist =
			"//div[@role='alertdialog']//span[text() = 'Yes, Shortlist']";
		this.btnGoToShortlisted =
			"//ol//li//div//button//span[text()='Go to shortlisted']";

		// Guest Users locators
		this.btnAddGuestUser = (guestEmail) =>
			`//div/p[text()= 'No results found for:']/span[text() ='${guestEmail}']//ancestor::p/following-sibling::button`;

		//p[contains(., 'Creating “')and contains(., '” as a guest')and .//span[normalize-space()='new@new.com']]
		this.txtGuestUserConfirmation = (guestEmail) =>
			`//p[contains(., 'Creating “')and contains(., '” as a guest')and .//span[normalize-space()='${guestEmail}']]`;

		this.inputGuestUserName = (guestEmail) =>
			`//p[contains(., 'Creating “') and contains(., '” as a guest')]//span[normalize-space()='${guestEmail}']/ancestor::div[@role='dialog']//input[@data-testid='select-popover-with-create-guest-option_input_name']`;

		this.btnAddGuestUserConfirmation = `//button[@data-testid = 'select-popover-with-create-guest-option_icon-button_submit']`;

		this.txtGuestUserEmailDropdownSidebar = (guestEmail) =>
			`//div/p[text() = 'Create as a guest user:']/span[text() = '${guestEmail}']`;

		this.inputGuestUserNameSidebar =
			"//div/input[@data-testid = 'modal-select-content_input_guest-name']";

		this.inputEvaluatorName = (evaluatorName) =>
			`//input[normalize-space(@value)='${evaluatorName}']`;
	}

	async getSurveyCheckboxXpath(subject_email) {
		const chkboxSurvey = `//p[text()='${subject_email}']/ancestor::tr//button[@role='checkbox']`;
		return chkboxSurvey;
	}

	async getSurveyFromListXpath(subject_email) {
		const surveyFromList = `//p[text()='${subject_email}']/ancestor::tr`;
		return surveyFromList;
	}

	async getEvaluatorEmailDropdownValue(evaluator_email) {
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await CommonUtils.sleep(2);
		await PwActions.waitForNetworkIdle(this.page, 15000);
		const drpdownEvaluvatorParticipants = `//div[contains(@class,'select__menu-list') or contains(@role,'option')]//p[normalize-space()='${evaluator_email}']`;
		return drpdownEvaluvatorParticipants;
	}

	async getParticipantNameXpathByPrticipantRole(participantRole) {
		const participantName = `//tbody[@class='twigs-c-PJLV']//td[position()=count(//th[text()='${participantRole}']/preceding-sibling::th)+1]`;
		return participantName;
	}

	async getEvaluatorNameXpathByRelation(relation) {
		const evaluatorName = `//tbody[@class='twigs-c-PJLV']//td[2]//p[contains(text(), '${relation}')]/following-sibling::div//p`;
		return evaluatorName;
	}

	/**
	 * This function is to get the evaluation status of a evaluator after clicking on the subject name in distribution page
	 * @param {string} evaluatorName - The name of the Evaluator
	 * @returns {string} - The evaluation status of the Evaluator
	 */
	getEvaluationStatusXpathForEvaluator(evaluatorName) {
		return `//p[text()='${evaluatorName}']/ancestor::div/following-sibling::div/p`;
	}

	/**
	 * Gets the XPath selector for a subject row in the participants table
	 * @param {string} subjectName - The name of the subject
	 * @returns {Promise<string>} - XPath selector for the subject's row
	 */

	async getSubjectRowSelector(subjectName) {
		return `//p[normalize-space()='${subjectName}']/ancestor::tr`;
	}

	/**
	 * This function is to get all evaluator names elements and status elements for subjects in participants page
	 * @returns {Object} - An object containing subject names as keys and arrays of evaluator names and statuses as values
	 */

	async getAllEvaluatorNamesAndStatusElementsForSubjects() {
		const evaluatorData = {};
		const subjectNames =
			await this.distributionParticipantsPage.getEmployeeNames();
		for (const subjectName of subjectNames) {
			evaluatorData[subjectName] = {
				nameElements: [],
				statusElements: [],
			};
			const subjectSelector = await this.getSubjectRowSelector(subjectName);
			await PwActions.click(this.page, subjectSelector);
			const evaluatorNameElements = await PwActions.getWebElementsPage(
				this.page,
				this.webElementsEvaluatorNamesOfSubject,
			);
			const evaluatorStatusElements = await PwActions.getWebElementsPage(
				this.page,
				this.webElementsEvaluatorStatusForSubject,
			);
			evaluatorData[subjectName].nameElements = evaluatorNameElements;
			evaluatorData[subjectName].statusElements = evaluatorStatusElements;
		}
		return evaluatorData;
	}

	/**
	 * Gets all evaluator names and their evaluation statuses for each subject from the participants page.
	 *
	 * @returns {Promise<Object>} An object where:
	 *  - Keys are subject names
	 *  - Values are arrays of objects containing:
	 *  - name {string} The evaluator's name
	 *  - status {string} The evaluation status (e.g., "Pending Evaluation", "Evaluated")
	 */

	async getAllEvaluatorNamesAndStatusForSubjects() {
		const evaluatorDataBySubject =
			await this.getAllEvaluatorNamesAndStatusElementsForSubjects();
		const result = {};
		for (const subjectName in evaluatorDataBySubject) {
			const subjectData = evaluatorDataBySubject[subjectName];
			const evaluatorNames = await PwActions.getElementsText(
				this.page,
				subjectData.nameElements,
			);
			const evaluatorStatuses = await PwActions.getElementsText(
				this.page,
				subjectData.statusElements,
			);
			result[subjectName] = evaluatorNames.map((name, index) => ({
				name: name,
				status: evaluatorStatuses[index],
			}));
		}
		return result;
	}

	/**
	 * Invites a subject from the shortlisted participants as single or bulk in the performance survey
	 * @param {string} inviteType - The type of invite to be sent (single or bulk)
	 * @param {string} [subjectName] - The name of the subject to invite (required only for single invite)
	 */

	async inviteSubjectFromShortlisted(inviteType, subjectName = null) {
		const invite = inviteType.toLowerCase();
		let checkBox, employees, verificationFn;

		expect(["single", "bulk"], "Invalid invite type").toContain(invite);

		if (invite === "single") {
			expect(
				subjectName,
				"Participant name is required for single invite",
			).toBeDefined();
			checkBox =
				this.distributionParticipantsPage.checkBoxForEmployee(subjectName);
			employees =
				this.distributionParticipantsPage.txtEmployeeName(subjectName);
			verificationFn = () =>
				PwActions.verifyElementIsNotPresent(this.page, employees);
		} else if (invite === "bulk") {
			checkBox = this.distributionParticipantsPage.checkBoxSelectAll;
			employees = this.txtNoParticipants;
			verificationFn = () => PwActions.waitTillVisible(this.page, employees);
		}

		const inviteCount =
			await this.distributionParticipantsPage.getEmployeeNamesElements();
		const count = invite === "single" ? 1 : inviteCount.length;
		await PwActions.click(this.page, checkBox);
		await PwActions.click(this.page, this.btnSendInvites);
		const toastMessage = this.toastInviteSuccessFromShortlist(count);
		await PwActions.waitTillVisible(this.page, toastMessage);
		await PwActions.waitTillElementDisappear(this.page, toastMessage);
		await verificationFn();
	}

	/**
	 * Add additional evaluator by choosing the subject and providing evaluator email and role
	 * @param {string} subject_email
	 * @param {string} evaluator_email
	 * @param {string} evaluator_role
	 * @param {string} tab - The tab to add the evaluator to (Invited or Shortlisted)
	 * @example
	 * await performanceParticipantsPage.addAdditionalEvaluator(constants.subject_email, constants.evaluator_email, constants.peer, constants.send_invite);
	 * await performanceParticipantsPage.addAdditionalEvaluator(constants.subject_email, constants.evaluator_email, constants.peer, constants.add_to_shortlist);
	 */

	/**
	 * Adds an additional evaluator to an existing participant (supports both existing users and guest users)
	 * Guest users can be assigned any role (Peer, Manager, Reportee, or Guest)
	 *
	 * @param {string} subject_email - The email of the subject
	 * @param {string} evaluator_email - The email of the evaluator to add
	 * @param {string} evaluator_role - The role to assign (Peer, Manager, Reportee, or Guest)
	 * @param {string} [tab=constants.send_invite] - Tab to work in: "Send Invite" or "Add to Shortlist"
	 * @param {string} [evaluator_name=null] - The name of the evaluator (required for guest users, optional for existing)
	 *
	 * @example
	 * // Add existing user as additional evaluator (backward compatible)
	 * await performanceParticipantsPage.addAdditionalEvaluator(
	 *   "subject@email.com",
	 *   "evaluator@email.com",
	 *   "Peer",
	 *   constants.add_to_shortlist  // 4th param: tab
	 * );
	 *
	 * @example
	 * // Add guest user as additional evaluator (can be any role)
	 * const { name, email } = generateRandomEmployeeNameAndEmail("guest");
	 * await performanceParticipantsPage.addAdditionalEvaluator(
	 *   "subject@email.com",
	 *   email,
	 *   "Manager",
	 *   constants.send_invite,
	 *   name
	 * );
	 */

	async addAdditionalEvaluator(
		subject_email,
		evaluator_email,
		evaluator_role,
		tab = constants.send_invite,
		evaluator_name = null,
	) {
		if (tab === constants.send_invite) {
			await PwActions.click(this.page, this.btnInvitedParticipantsSection);
		} else if (tab === constants.add_to_shortlist) {
			await PwActions.click(this.page, this.btnShortlistParticipantsSection);
		}
		this.dropdwnRole = `//div[contains(@class,'twigs-select__menu-list')]//div[text()='${evaluator_role}']`;

		await PwActions.waitAndClick(
			this.page,
			await this.getSurveyFromListXpath(subject_email),
		);
		await PwActions.click(this.page, this.btnAddEvaluator);
		await PwActions.fill(
			this.page,
			this.txtAdditionalEvaluatorRole,
			evaluator_role,
		);
		await PwActions.click(this.page, this.dropdwnRole);
		await PwActions.fill(
			this.page,
			this.txtAdditionalEvaluator,
			evaluator_email,
		);
		await CommonUtils.sleep(3);
		// Check if guest user (sidebar flow - different from addParticipants modal)
		const isGuestUser = await PwActions.elementIsVisible(
			this.page,
			this.txtGuestUserEmailDropdownSidebar(evaluator_email),
		);

		if (isGuestUser) {
			// Guest user flow: click on guest email option in sidebar dropdown
			logger.info(
				`Adding guest user in sidebar: ${evaluator_name || evaluator_email}`,
			);

			// Wait for the guest user dropdown option to be visible before clicking
			await PwActions.waitTillVisible(
				this.page,
				this.txtGuestUserEmailDropdownSidebar(evaluator_email),
				20000,
			);

			await PwActions.waitAndClick(
				this.page,
				this.txtGuestUserEmailDropdownSidebar(evaluator_email),
			);

			// Fill guest name in sidebar input
			if (evaluator_name) {
				await PwActions.fill(
					this.page,
					this.inputGuestUserNameSidebar,
					evaluator_name,
				);
			}
			await CommonUtils.sleep(1);
		} else {
			await PwActions.waitAndClick(
				this.page,
				await this.getEvaluatorEmailDropdownValue(evaluator_email),
			);
		}
		await PwActions.click(this.page, this.btnAdditionalEvaluatorAddEvatuator);
		await CommonUtils.sleep(1);
		await PwActions.pageRefresh(this.page);
	}

	/**
	 * This function is to import participants via CSV file
	 * @param {string} filename
	 */

	async importParticipantsViaCSV(
		filename,
		inviteNowOrAddToShortlist = constants.send_invite,
	) {
		await PwActions.click(this.page, this.btnAddParticipants);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.click(this.page, this.btnImportFromCSV);
		await CommonUtils.sleep(2);
		const dirname = path.dirname(fileURLToPath(import.meta.url));
		const filePath = path.join(dirname, `../../../Data/Files/${filename}`);
		await PwActions.uploadFile(
			this.page,
			this.uploadOrDropParticipants,
			filePath,
		);
		await this.verifyImportedParticipantsWithUplodedCSV(filename);
		await CommonUtils.sleep(2);
		if (inviteNowOrAddToShortlist === constants.send_invite) {
			await PwActions.click(this.page, this.btnInviteNow);
		} else if (inviteNowOrAddToShortlist === constants.add_to_shortlist) {
			await PwActions.click(this.page, this.btnShortlistParticipants);
		}
		// Wait for import to complete with retry mechanism (26 retries × 30s = ~13 minutes max wait)
		const reloadBtnLocator = this.btnReloadImportStatus(filename);
		const entriesLocator = this.lblEntiresCreatedLatestRow(filename);
		const errorLocator = this.lblErrorCreatedLatestRow(filename);
		for (let retry = 0; retry < 26; retry++) {
			const isReloadVisible = await PwActions.elementIsVisible(
				this.page,
				reloadBtnLocator,
				30,
			);
			if (isReloadVisible) {
				await PwActions.click(this.page, reloadBtnLocator);
			}
			const entriesText = await PwActions.getText(this.page, entriesLocator);
			if (entriesText !== "--") {
				break;
			}
			await CommonUtils.sleep(30);

			const errorText = await PwActions.getText(this.page, errorLocator);
			expect(
				errorText === "" || errorText === "0" || errorText === "-",
			).toBeTruthy();

			if (retry < 25) {
				await PwActions.pageRefresh(this.page);
			}
		}
	}

	/**
	 * This function is to verify the imported participants with the uploaded
	 * CSV file is listed in the participants list table
	 * @param {string} filename
	 */

	async verifyImportedParticipantsWithUplodedCSV(filename) {
		const commonutils = new CommonUtils();
		const dirname = path.dirname(fileURLToPath(import.meta.url));
		const filePath = path.join(dirname, `../../../Data/Files/${filename}`);
		const csv_Data = await commonutils.readCSVFile(filePath);
		csv_Data.data.length;
		for (let i = 0; i < csv_Data.data.length; i++) {
			for (const element in csv_Data.data[i]) {
				let value = undefined;
				if (element === "Approver Name") {
					value = await PwActions.getText(
						this.page,
						await this.getParticipantNameXpathByPrticipantRole("Approver"),
					);
				} else if (element === "Subject Name") {
					value = await PwActions.getText(
						this.page,
						await this.getParticipantNameXpathByPrticipantRole("Subject"),
					);
				} else if (element === "Evaluator Name") {
					const relation = csv_Data.data[i]["Evaluator Relation"];
					value = await PwActions.getText(
						this.page,
						await this.getEvaluatorNameXpathByRelation(relation),
					);
				} else {
					continue;
				}
				await PwActions.verifyTextExpected(csv_Data.data[i][element], value);
			}
		}
	}

	/**
	 * Gets the expected CSV file path for a survey (without downloading)
	 * @param {string} [surveyName=EntityIds.getSurveyName()] - The name of the survey (defaults to current survey from EntityIds)
	 * @returns {string} - Expected path to the CSV file
	 *
	 * @example
	 * // With explicit survey name
	 * const csvPath = performanceParticipantsPage.getDownloadedParticipantFilePath(EntityIds.surveyName);
	 * await commonUtils.deleteFile(csvPath);
	 *
	 * @example
	 * // Using default (current survey)
	 * const csvPath = performanceParticipantsPage.getDownloadedParticipantFilePath();
	 * await commonUtils.deleteFile(csvPath);
	 */
	getDownloadedParticipantFilePath(surveyName = EntityIds.getsurveyName()) {
		return path.join(
			process.cwd(),
			"downloads",
			`${surveyName}_participants.csv`,
		);
	}

	/**
	 * Downloads participants CSV file using Playwright's saveAs API
	 * @param {string} [surveyName=EntityIds.getSurveyName()] - The name of the survey (defaults to current survey from EntityIds)
	 * @returns {Promise<string>} - Path to the downloaded CSV file
	 *
	 * @example
	 * // Download with default survey name
	 * const filePath = await performanceParticipantsPage.downloadParticipantsCSV();
	 *
	 * @example
	 * // Download with specific survey name
	 * const filePath = await performanceParticipantsPage.downloadParticipantsCSV("My Custom Survey");
	 */

	async downloadParticipantsCSV(filename = EntityIds.getsurveyName()) {
		// Generate filename from survey name (no sanitization)
		const downloadsDir = path.join(process.cwd(), "downloads");
		const complete_filename = `${filename}_participants.csv`;
		const filePath = path.join(downloadsDir, complete_filename);

		await this.surveyPage.navigateTopSections("Participants");

		// Download the CSV file using saveAs API
		logger.info(`Downloading participants CSV to: ${filePath}`);
		await CommonUtils.sleep(4);
		await PwActions.click(this.page, this.btnDownloadParticipants);

		const [download] = await Promise.all([
			this.page.waitForEvent("download", { timeout: 30000 }),
			PwActions.click(this.page, this.btnDownloadParticipantsAsCsv),
		]);

		// Save the file with the specified filename
		await download.saveAs(filePath);

		// Verify the file was downloaded
		if (!fs.existsSync(filePath)) {
			throw new Error(`Download failed: File not saved at ${filePath}`);
		}

		logger.info(`Successfully downloaded CSV file: ${filePath}`);
		logger.info("filePath", filePath);
		logger.info("File content: ", fs.readFileSync(filePath, "utf8"));
		return filePath;
	}
	/**
	 * Verifies the downloaded participants CSV file by comparing its contents with the data
	 * displayed on the participants page. This function performs comprehensive validation
	 * including column structure, evaluator counts, names, statuses, and assessment links.
	 *
	 * The function validates:
	 * - CSV file is not empty and contains data
	 * - All required columns are present (Name, Email, Evaluator Name, Evaluator Email,
	 *   Relation, Response State, Assessment Link)
	 * - Evaluator count matches between CSV and UI for each subject
	 * - All evaluators from UI are present in CSV
	 * - Response states match (maps "Pending Evaluation" to "Not Evaluated", others to "Evaluated")
	 * - Assessment links are present and non-empty for all evaluators
	 *
	 * @param {string} downloadedCsvPath - Path to the downloaded CSV file
	 * @returns {Promise<Object>} An object mapping relation types to arrays of evaluator information.
	 *   Structure: `{ [relation: string]: Array<{ evaluatorName: string, evaluatorEmail: string, link: string }> }`
	 *   Only includes relations that have a value in the CSV.
	 * @throws {Error} Throws assertion errors if validation fails at any step
	 */
	async verifyDownloadedParticipantsCSV(downloadedCsvPath) {
		const { data } = await this.commonutils.readCSVFile(downloadedCsvPath);

		expect(data?.length, "CSV file is empty or invalid").toBeGreaterThan(0);

		const expectedColumns = new Set([
			"Name",
			"Email",
			"Evaluator Name",
			"Evaluator Email",
			"Relation",
			"Evaluation Status",
			"Assessment Link",
		]);

		const downloadedColumns = Object.keys(data[0]);
		for (const column of expectedColumns) {
			expect(downloadedColumns, `Missing column "${column}" in CSV`).toContain(
				column,
			);
		}

		/** Map<subjectName, Map<evaluatorName, compactRow>> */
		const csvBySubject = new Map();

		for (const row of data) {
			const subject = row["Name"];
			const evaluator = row["Evaluator Name"];
			if (!subject || !evaluator) continue;

			let subjectMap = csvBySubject.get(subject);
			if (!subjectMap) {
				subjectMap = new Map();
				csvBySubject.set(subject, subjectMap);
			}

			subjectMap.set(evaluator, {
				evaluationStatus: row["Evaluation Status"],
				relation: row["Relation"],
				email: row["Evaluator Email"],
				link: row["Assessment Link"],
			});
		}

		const evaluatorStatusData =
			await this.getAllEvaluatorNamesAndStatusForSubjects();

		const assessmentLinksByRelation = Object.create(null);

		for (const [subjectName, evaluators] of Object.entries(
			evaluatorStatusData,
		)) {
			const csvEvaluators = csvBySubject.get(subjectName);

			expect(
				csvEvaluators?.size ?? 0,
				`Evaluator count mismatch for subject: ${subjectName}`,
			).toBe(evaluators.length);

			const csvEvaluatorSet = new Set(csvEvaluators.keys());

			for (const { name, status } of evaluators) {
				expect(
					csvEvaluatorSet.has(name),
					`Missing evaluator "${name}" in CSV for subject "${subjectName}"`,
				).toBeTruthy();

				const csvRow = csvEvaluators.get(name);

				const expectedResponseStatus =
					status === "Pending Evaluation" ? "Not Evaluated" : "Evaluated";
				expect(
					csvRow.evaluationStatus,
					`Status mismatch for evaluator "${name}"`,
				).toBe(expectedResponseStatus);

				expect(
					csvRow.link,
					`Empty assessment link for evaluator "${name}"`,
				).toBeTruthy();

				if (csvRow.relation) {
					(assessmentLinksByRelation[csvRow.relation] ??= []).push({
						evaluatorName: name,
						evaluatorEmail: csvRow.email,
						link: csvRow.link,
					});
				}
			}
		}

		csvBySubject.clear();
		return assessmentLinksByRelation;
	}

	/**
    This function is to verify email content after survey launch
	* @param {string} surveyName
	* @param {string} senderEmai
	* @param {string} receiverEmail
	* @param {string} emailType
    */

	async verifyEmailContent(surveyName, senderEmail, receiverEmail, emailType) {
		try {
			let expectedBodyConstant;
			let senderEmailSubject;

			if (emailType === "self") {
				senderEmailSubject = constants.self_email_subject;
				expectedBodyConstant = constants.getSelfEmailBody(
					constants.subjectName,
					surveyName,
				);
			} else if (emailType === "evaluator") {
				senderEmailSubject = constants.getEvaluatorEmailSubject(
					constants.subjectName,
				);
				expectedBodyConstant = constants.getevaluatorEmailBody(
					constants.evaluatorName,
					constants.subjectName,
					surveyName,
				);
			} else {
				throw new Error(`Invalid email type: ${emailType}`);
			}
			const emailBody = await this.readEmail.fetch_mail_content_from_gmail({
				subject: senderEmailSubject,
				body: surveyName,
			});
			await PwActions.verifyTextExpected(
				emailBody,
				expectedBodyConstant.replace("<surveyName>", surveyName),
			);
		} catch (error) {
			console.error(
				`Error while verifying ${emailType} email: ${error.message}`,
			);
			throw error;
		}
	}
	/**
	 * Function to verify edited email content by checking email body text and header image.
	 * @param {string} surveyName - The name of the survey for which the email was sent
	 * @param {string} senderEmail - The email address of the sender
	 * @param {string} receiverEmail - The email address of the receiver
	 * @param {string} emailType - The type of email to verify ("self-edited")
	 * @param {string} [editType="variable-removed"] - The type of edit applied ("variable-added" or "variable-removed")
	 *
	 * This function performs the following steps:
	 * 1. Calculates email cutoff time (15 seconds ago) for recent email search
	 * 2. Determines expected email content based on emailType and editType parameters
	 * 3. Sets appropriate email subject, body content, and header image source based on edit type
	 * 4. Fetches the actual email content from Gmail using the readEmail utility
	 * 5. Verifies the email body text matches the expected content (with survey name replacement)
	 * 6. Fetches the email header image source URL from Gmail
	 * 7. Downloads the header image from the URL to a temporary file
	 * 8. Compares the downloaded image with the expected header image to ensure they match
	 * 9. Fetches the email branding image source URL from Gmail
	 * 10. Downloads the branding image from the URL to a temporary file
	 * 11. Compares the downloaded image with the expected branding image to ensure they match
	 * 12. Cleans up by deleting the temporary downloaded image file
	 * 13. Handles errors and provides detailed error logging
	 *
	 * @example
	 * // Verify self-edited email with variable added
	 * await performanceParticipants.VerifyEditedEmailContent(
	 *   "Performance Review 2024",
	 *   "noreply@company.com",
	 *   "employee@example.com",
	 *   "self-edited",
	 *   "variable-added"
	 * );
	 *
	 * // Verify self-edited email with variable removed (default)
	 * await performanceParticipants.VerifyEditedEmailContent(
	 *   "Performance Review 2024",
	 *   "noreply@company.com",
	 *   "employee@example.com",
	 *   "self-edited"
	 * );
	 *
	 * @returns {Promise<void>} No return value
	 */
	async VerifyEditedEmailContent(
		surveyName,
		senderEmail,
		receiverEmail,
		emailType,
		editType = "variable-removed",
	) {
		try {
			let expectedBodyConstant;
			let senderEmailSubject;
			let expectedHeaderImgSrc;
			let expectedBrandingImgSrc;
			const emailCutoffTime = Math.floor((Date.now() - 15 * 1000) / 1000);

			if (emailType === "self-edited" && editType === "variable-added") {
				senderEmailSubject = constants.getSelfEmailSubjectEdited(true);
				expectedBodyConstant = constants.getSelfEmailBodyEdited(
					surveyName,
					true,
				);
				expectedHeaderImgSrc = constants.Custom_Header_Img;
				expectedBrandingImgSrc = constants.Department_cropped_Img;
			} else if (
				emailType === "self-edited" &&
				editType === "variable-removed"
			) {
				senderEmailSubject = constants.getSelfEmailSubjectEdited(false);
				expectedBodyConstant = constants.getSelfEmailBodyEdited(
					surveyName,
					false,
				);
				expectedHeaderImgSrc = constants.Email_Header_Img;
				expectedBrandingImgSrc = "TSAP/Data/Resources/thrive-branding-logo.png";
			} else {
				logger.error(`Invalid email type: ${emailType}`);
			}

			const emailBody = await this.readEmail.fetch_mail_content_from_gmail({
				from: senderEmail,
				to: receiverEmail,
				subject: senderEmailSubject,
				body: expectedBodyConstant,
				emailCutoffTimeInMinutes: emailCutoffTime,
			});

			await PwActions.verifyTextExpected(
				emailBody.replaceAll(" ", ""),
				expectedBodyConstant
					.replace("<surveyName>", surveyName)
					.replaceAll(" ", ""),
			);

			const { header: emailHeaderImgSrc, branding: emailBrandingImgSrc } =
				await this.readEmail.fetch_img_urls_from_gmail({
					from: senderEmail,
					to: receiverEmail,
					subject: senderEmailSubject,
					body: expectedBodyConstant,
					emailCutoffTimeInMinutes: emailCutoffTime,
					returnImages: { header: true, branding: true },
				});

			if (emailHeaderImgSrc) {
				const downloadPath = await PwActions.downloadFileFromUrl(
					this.page,
					emailHeaderImgSrc,
					"fetched_email_header_image.jpg",
					"TSAP/Data/Resources/",
				);
				await CommonUtils.compareImages(downloadPath, expectedHeaderImgSrc);
				await this.commonutils.deleteFile(downloadPath);
			} else {
				throw new Error("Email header image not found");
			}

			if (emailBrandingImgSrc) {
				const downloadPath = await PwActions.downloadFileFromUrl(
					this.page,
					emailBrandingImgSrc,
					"fetched_email_branding_image.jpg",
					"TSAP/Data/Resources/",
				);
				await CommonUtils.compareImages(downloadPath, expectedBrandingImgSrc);
				await this.commonutils.deleteFile(downloadPath);
			} else {
				throw new Error("Email branding image not found");
			}
		} catch (error) {
			console.error(
				`Error while verifying ${emailType} email: ${error.message}`,
			);
			throw error;
		}
	}

	/**
	 * Resets all reminder checkboxes to unchecked state
	 * @example
	 * await performanceParticipantsPage.resetAllReminderCheckboxes();
	 */

	async resetAllReminderCheckboxes() {
		const checkboxes = [
			this.chkboxRemindSubjects,
			this.chkboxRemindApprovers,
			this.chkboxRemindEvaluators,
		];
		for (const checkbox of checkboxes) {
			try {
				const element = this.page.locator(checkbox);
				if (await element.isDisabled()) continue;
				if (await element.isChecked()) {
					await element.click();
				}
			} catch (error) {
				continue;
			}
		}
	}
	/**
	 * This function is to send reminder to participants
	 * @param {Array<string>} roles - Array of roles to send reminder to (e.g., ["approvers", "evaluators", "subjects"])
	 * @example
	 * await performanceParticipantsPage.sendReminderParticipants(["approvers", "evaluators", "subjects"]);
	 * await performanceParticipantsPage.sendReminderParticipants(["approvers", "evaluators"]);
	 * await performanceParticipantsPage.sendReminderParticipants(["subjects"]);
	 * await performanceParticipantsPage.sendReminderParticipants(["approvers"]);
	 * await performanceParticipantsPage.sendReminderParticipants(["evaluators"]);
	 * await performanceParticipantsPage.sendReminderParticipants(["subjects"]);
	 */
	async sendReminderParticipants(
		roles = ["approvers", "evaluators", "subjects"],
	) {
		await PwActions.waitAndClick(this.page, this.btnSendReminderParticipants);
		await this.resetAllReminderCheckboxes();
		const roleCheckboxMap = {
			subjects: this.chkboxRemindSubjects,
			approvers: this.chkboxRemindApprovers,
			evaluators: this.chkboxRemindEvaluators,
		};
		for (const role of roles) {
			const checkbox = roleCheckboxMap[role.toLowerCase()];
			if (checkbox) {
				await PwActions.click(this.page, checkbox);
			}
		}
		await PwActions.click(this.page, this.btnSendReminder);
	}

	/**
	 * Downloads the sample participants CSV file
	 * @returns {string} - Path to the downloaded CSV file
	 * @example
	 * const filePath = await performanceParticipantsPage.downloadSampleParticipantsCSV();
	 * await performanceParticipantsPage.verifySampleParticipantsCSV(filePath);
	 */

	async downloadSampleParticipantsCSV() {
		await PwActions.click(this.page, this.btnAddParticipants);
		await PwActions.click(this.page, this.btnImportFromCSV);
		await CommonUtils.sleep(2);
		const result = await this.commonPageFunctions.downloadFileAndReturnPath(
			this.page,
			this.btnDownloadSampleParticipantsCSV,
		);
		await PwActions.click(this.page, this.btnBackButton);
		return result.filePath;
	}

	/**
	 * Verifies the sample participants CSV file
	 * @param {string} filePath - Path to the downloaded CSV file
	 * @example
	 * const filePath = await performanceParticipantsPage.downloadSampleParticipantsCSV();
	 * await performanceParticipantsPage.verifySampleParticipantsCSV(filePath);
	 */

	async verifySampleParticipantsCSV(filePath) {
		const downloadedCsvData = await this.commonutils.readCSVFile(filePath);
		const expectedColumns = [
			"Subject Name",
			"Subject Email",
			"Evaluator Name",
			"Evaluator Email",
			"Evaluator Relation",
			"Approver Name",
			"Approver Email",
		];
		const downloadedColumns = Object.keys(downloadedCsvData.data[0]);
		for (const column of expectedColumns) {
			expect(
				downloadedColumns,
				`Expected column "${column}" not found in downloaded CSV. Found columns: ${downloadedColumns.join(", ")}`,
			).toContain(column);
		}
		await expect(downloadedCsvData.data.length).toBeGreaterThanOrEqual(4);
	}

	/**
	 * Verifies the send reminder to subjects is disabled
	 * @example
	 * await performanceParticipantsPage.verifySendReminderToSubjectsIsDisabled();
	 */

	async verifySendReminderToSubjectsIsDisabled() {
		await PwActions.waitAndClick(this.page, this.btnSendReminderParticipants);
		await PwActions.isElementDisabledOrEnabled(
			this.page,
			this.chkboxRemindSubjects,
		);
		await this.closeModal();
	}

	/**
	 * This function is to verify the participants received reminder email
	 * @param {Array<Object>} participants - Array of participant objects with subjectName and role properties
	 * @param {string} participant.participant - The name of the participant
	 * @param {string} participant.subjectName - The name of the subject
	 * @param {string} participant.role - The role of the participant
	 * @example
	 * [
	 * 	{participant: "Evaluator Automation", subjectName: "Subject Automation", role: "evaluator"},
	 * 	{participant: "Approver Automation", subjectName: "Subject Automation", role: "approver"},
	 * 	{subjectName: "Subject Automation", role: "subject"},
	 * ]
	 * Let's say we have 3 participants in the participants list
	 * 1. Evaluator Automation
	 * 2. Approver Automation
	 * 3. Subject Automation
	 *
	 * We want to verify the reminder email is received for the evaluator and approver, then call the function with the following parameters
	 * [
	 * 	{participant: "Evaluator Automation", subjectName: "Subject Automation", role: "evaluator"},
	 * 	{participant: "Approver Automation", subjectName: "Subject Automation", role: "approver"},
	 * ]
	 *
	 * This function will open the reminder email.
	 */

	async verifyParticipantsReceivedReminderEmail(participants) {
		const result = {
			evaluatorUrl: null,
			approverUrl: null,
			subjectUrl: null,
		};
		const emailCutoffTime = 2;
		for (const participant of participants) {
			if (participant.role === "evaluator") {
				result.evaluatorUrl =
					await this.commonPageFunctions.open_survey_from_received_email(
						constants.getReminderEmailSubject(participant.subjectName),
						constants.new_employee_email,
						constants.getevaluatorReminderEmailBody(
							participant.participant,
							participant.subjectName,
						),
						emailCutoffTime,
					);
			} else if (participant.role === "approver") {
				result.approverUrl =
					await this.commonPageFunctions.open_survey_from_received_email(
						constants.approverReminderEmailSubject,
						constants.new_employee_email,
						constants.getapproverReminderEmailBody(
							[participant.subjectName],
							participant.participant,
						),
						emailCutoffTime,
					);
			} else if (participant.role === "subject") {
				result.subjectUrl =
					await this.commonPageFunctions.open_survey_from_received_email(
						constants.subjectReminderEmailSubject,
						constants.subject_email,
						constants.getSubjectReminderEmailBody(participant.subjectName),
						emailCutoffTime,
					);
			}
		}
		return result;
	}

	/**
	 * This function is to delete the evaluator from the participants list
	 * @param {Array<Object>} evaluators - Array of evaluator objects with subjectName and evaluatorName properties
	 * @param {string} evaluators[0].subjectName - The name of the subject
	 * @param {string} evaluators[0].evaluatorName - The name of the evaluator
	 * @example
	 * await performanceParticipantsPage.deleteEvaluator([{subjectName: "Subject Automation", evaluatorName: "Evaluator Automation"}]);
	 */

	async deleteEvaluator(evaluators) {
		const subjects = await PwActions.getWebElements(
			this.page,
			this.getWebElementsEmployeeNames,
		);
		let subjectElement = null;
		for (const el of subjects) {
			const text = await el.textContent();
			if (
				text?.trim().toLowerCase() === evaluators[0].subjectName.toLowerCase()
			) {
				subjectElement = el;
				break;
			}
		}
		await subjectElement?.click();
		await PwActions.hover(
			this.page,
			this.evaluatorNameElement(evaluators[0].evaluatorName),
		);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		const deleteButton = `//p[text()[normalize-space()="${evaluators[0].evaluatorName}"]]/ancestor::div[@data-testid="flex"][3]//button[@aria-label="Delete collaborator"]`;
		await PwActions.click(this.page, deleteButton);
		await PwActions.click(this.page, this.btnDelete);
		await PwActions.waitForElementVisibility(
			this.page,
			this.toastParticipantDeleted,
		);
		await PwActions.pageRefresh(this.page);
	}

	/**
	 * This function is to change the approver for an subject
	 * @param {string} subjectName - The name of the subject
	 * @param {string} newApproverName - The name of the new approver
	 * @param {string} oldApproverName - The name of the old approver
	 * @example
	 * await performanceParticipantsPage.changeApprover(constants.subjectName, constants.newApproverName, constants.oldApproverName);
	 */

	async changeApprover(subjectName, newApproverName, oldApproverName) {
		const subjectElement = await this.getSubjectRowSelector(subjectName);
		await PwActions.click(this.page, subjectElement);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.click(this.page, this.approverNameElement(oldApproverName));
		await PwActions.click(this.page, this.btnChangeApprover);
		const approverElement = `//p[text()="${newApproverName}"]/parent::div`;
		await PwActions.fill(this.page, this.txtAddApprover, newApproverName);
		await PwActions.waitAndClick(this.page, approverElement);
		await PwActions.click(this.page, this.btnAddApprover);
		await PwActions.waitTillVisible(this.page, this.toastChangeApprover);
		await PwActions.waitForElementVisibility(
			this.page,
			this.approverNameElement(newApproverName),
		);
		await PwActions.pageRefresh(this.page);
	}

	/**
	 * This function is to navigate to the side menu
	 * @param {string} menuName - The name of the menu to navigate to
	 * @example
	 * await performanceParticipantsPage.navigateToSideMenu("Subjects");
	 */

	async navigateToSideMenu(menuName) {
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.click(this.page, this.btnSideMenu(menuName));
	}

	/**
	 * This function is to close the modal
	 * @example
	 * await performanceParticipantsPage.closeModal();
	 */

	async closeModal() {
		await PwActions.click(this.page, this.btnCloseModal);
	}

	/**
	 * This function is to verify the evaluators for an subject
	 * @param {string} subjectName - The name of the subject
	 * @param {Array<string>} evaluators - The evaluators to verify
	 * @param {boolean} yesOrNo - Whether to verify the evaluators are present or not
	 * @example
	 * if the action has to be performed on the invited tab, then call the function with the following parameters
	 * await performanceParticipantsPage.verifyEvaluatorsForAnSubject(constants.subjectName,[constants.evaluatorName],false) //To verify the evaluators are not present
	 * if the action has to be performed on the shortlisted tab, then call the function with the following parameters
	 * await performanceParticipantsPage.verifyEvaluatorsForAnSubject(constants.subjectName,[constants.evaluatorName]) //To verify the evaluators are present
	 */

	async verifyEvaluatorsForAnSubject(subjectName, evaluators, yesOrNo = true) {
		await PwActions.waitAndClick(
			this.page,
			await this.getSurveyFromListXpath(subjectName),
		);
		await CommonUtils.sleep(3);
		for (const evaluator of evaluators) {
			if (yesOrNo) {
				await PwActions.waitForDOMContentLoaded(this.page, 15000);
				expect(
					await PwActions.elementIsVisible(
						this.page,
						this.evaluatorNameElement(evaluator),
					),
				).toBeTruthy();
			} else {
				expect(
					await PwActions.elementIsVisible(
						this.page,
						this.evaluatorNameElement(evaluator),
					),
				).toBeFalsy();
			}
		}
		await PwActions.pageRefresh(this.page);
	}

	/**
	 * This function is to add evaluators for an subject
	 * @param {string} subjectName - The name of the subject
	 * @param {string} evaluatorName - The name of the evaluator to add
	 * @param {string} evaluatorRole - The role of the evaluator to add
	 * @param {string} tab - The tab to add the evaluator to (Invited or Shortlisted)
	 * @example
	 * if the action has to be performed on the invited tab, then call the function with the following parameters
	 * await performanceParticipantsPage.addEvaluatorsForAnSubject(constants.subjectName,constants.evaluatorName,constants.peer);
	 * if the action has to be performed on the shortlisted tab, then call the function with the following parameters
	 * await performanceParticipantsPage.addEvaluatorsForAnSubject(constants.subjectName,constants.evaluatorName,constants.peer);
	 */
	async addEvaluatorsForAnSubject(subjectName, evaluatorName, evaluatorRole) {
		this.dropdownEvaluatorRole = `//div[@data-side='bottom']//div[text()='${evaluatorRole}']`;
		await PwActions.waitAndClick(this.page, this.btnAddParticipants);
		await PwActions.click(this.page, this.btnAddManually);
		await PwActions.click(this.page, this.btnNewEvaluator);
		await PwActions.waitAndFill(
			this.page,
			this.txtEvaluatorName,
			evaluatorName,
		);
		await PwActions.waitAndClick(this.page, `//p[text()='${evaluatorName}']`);
		await PwActions.waitAndFill(this.page, this.inputForSubject, subjectName);
		await PwActions.waitAndClick(
			this.page,
			`//div[contains(@id,"react-select")]//p[text()='${subjectName}']`,
		);
		await PwActions.click(this.page, this.btnChooseEvaluatorRole);
		await PwActions.click(this.page, this.dropdownEvaluatorRole);
		await PwActions.click(this.page, this.btnAddEvaluator);
		await PwActions.waitTillVisible(this.page, this.toastEvaluatorAdded);
	}

	/**
	 * Adds participants to a 360 survey with support for both existing users and guest users.
	 * Note: Guest users can be assigned ANY role (Peer, Manager, Reportee, or Guest). Role is not restricted for guest users.
	 *
	 * @param {string} subjectName - The name of the subject being evaluated
	 * @param {Array<Object>} evaluatorDetails - Array of evaluator objects
	 * @param {string} [evaluatorDetails[].evaluatorName] - The name of the evaluator (for existing users, or guest users if guestName not provided)
	 * @param {string} [evaluatorDetails[].evaluatorEmail] - The email of the evaluator (required for guest users)
	 * @param {string} [evaluatorDetails[].guestName] - The name for guest user (required for guest users, optional for existing)
	 * @param {boolean} [evaluatorDetails[].isGuest] - Set to true for guest users; if omitted or false, treats as existing user
	 * @param {string} evaluatorDetails[].evaluatorRole - The role to assign (Peer, Manager, Reportee, or Guest)
	 * @param {string} approverName - The name of the approver
	 * @param {string} addtolist_or_sendinvite - Action type: "Add to Shortlist" or "Send Invite"
	 *
	 * @example
	 * // Add existing users only
	 * await performanceParticipantsPage.addParticipants(
	 *   "Subject Name",
	 *   [
	 *     { evaluatorName: "Evaluator Automation", evaluatorRole: "Peer" },
	 *     { evaluatorName: "Manager New", evaluatorRole: "Manager" }
	 *   ],
	 *   "Approver Automation",
	 *   constants.send_invite
	 * );
	 *
	 * @example
	 * // Add guest users only (using isGuest: true, must provide evaluatorEmail and guestName)
	 * await performanceParticipantsPage.addParticipants(
	 *   "Subject Name",
	 *   [
	 *     { evaluatorEmail: "guest@email.com", guestName: "Guest User", evaluatorRole: "Peer", isGuest: true }
	 *   ],
	 *   "Approver Automation",
	 *   constants.send_invite
	 * );
	 *
	 * @example
	 * // Add mix of existing user and guest user (with recent changes support)
	 * await performanceParticipantsPage.addParticipants(
	 *   "Subject Name",
	 *   [
	 *     { evaluatorName: "Evaluator One", evaluatorRole: "Peer" }, // existing user
	 *     { evaluatorEmail: "guest2@email.com", guestName: "Guest Two", evaluatorRole: "Manager", isGuest: true }
	 *   ],
	 *   "Approver Automation",
	 *   constants.add_to_shortlist
	 * );
	 */

	async addParticipants(subjectName, evaluatorDetails, approverName, action) {
		const shouldClickAdd = evaluatorDetails.length > 1;
		const subjectOption = `//p[text()='${subjectName}']`;
		const approverOption = `//div[@class='twigs-select__menu css-iouw0n-menu']//p[normalize-space()='${approverName}']`;
		await PwActions.waitAndClick(this.page, this.btnAddParticipants);
		await PwActions.waitAndClick(this.page, this.btnAddManually);
		await PwActions.waitAndFill(this.page, this.txtSubject, subjectName);
		await PwActions.waitAndClick(this.page, subjectOption);
		await PwActions.waitAndClick(this.page, this.txtEvaluatedBy);
		for (const evaluator of evaluatorDetails) {
			const evaluatorKey = evaluator.evaluatorEmail ?? evaluator.evaluatorName;
			const roleOption = `//div[@data-side='bottom']//div[text()='${evaluator.evaluatorRole}']`;
			await PwActions.waitAndFill(this.page, this.txtEvaluatedBy, evaluatorKey);
			if (evaluator.isGuest) {
				logger.info(`Adding guest user: ${evaluatorKey}`);
				await PwActions.forceClick(
					this.page,
					this.inputEvaluatorName(evaluator.evaluatorName),
				);
				await PwActions.waitAndClick(
					this.page,
					this.btnAddGuestUser(evaluatorKey),
				);
				await PwActions.waitTillVisible(
					this.page,
					this.txtGuestUserConfirmation(evaluatorKey),
				);
				await PwActions.waitAndFill(
					this.page,
					this.inputGuestUserName(evaluatorKey),
					evaluator.guestName ?? evaluator.evaluatorName,
				);
				await PwActions.waitAndClick(
					this.page,
					this.btnAddGuestUserConfirmation,
				);
			} else {
				const dropdownValue = await this.getEvaluatorEmailDropdownValue(
					evaluator.evaluatorName,
				);
				const visible = await PwActions.elementIsVisible(
					this.page,
					dropdownValue,
				);
				if (!visible) {
					await PwActions.forceClick(
						this.page,
						this.inputEvaluatorName(evaluator.evaluatorName),
					);
				}
				await CommonUtils.sleep(4);
				await PwActions.waitForNetworkIdle(this.page, 15000);
				await PwActions.waitAndClick(this.page, dropdownValue);
			}
			if (shouldClickAdd) {
				await PwActions.waitAndClick(this.page, this.btnAddEvaluator);
			}
			await PwActions.waitAndClick(this.page, this.btnChooseEvaluatorRole);
			await PwActions.waitAndClick(this.page, roleOption);
			if (evaluator.options) {
				const participantRow = this.txtParticipantNameOnAddParticipantsModal(
					evaluator.evaluatorName,
				);
				await PwActions.hover(this.page, participantRow);
				await PwActions.waitAndClick(
					this.page,
					this.btnDeleteParticipantOnAddParticipantsModal(
						evaluator.evaluatorName,
					),
				);
				await PwActions.verifyElementIsNotPresent(this.page, participantRow);
			}
		}
		await PwActions.waitAndFill(this.page, this.txtApprovedBy, approverName);
		await PwActions.waitAndClick(this.page, approverOption);
		if (action === "Add to Shortlist") {
			await PwActions.waitAndClick(this.page, this.btnAddToShortlist);
			await PwActions.waitTillVisible(this.page, this.toastShortlistSuccess);
		} else {
			await PwActions.waitAndClick(this.page, this.btnSendInvite);
			await PwActions.waitTillVisible(this.page, this.toastInviteSuccess);
		}
	}

	/**
	 * This function is to go back from the import logs page
	 * @example
	 * await performanceParticipantsPage.goBackFromImportLogs();
	 */

	async goBackFromImportLogs() {
		await PwActions.click(this.page, this.btnBackButtonFromImportLogs);
	}

	/**
	 * This function is to verify the presence of a participant in the participants list
	 * @param {string} subjectName - The name of the subject
	 * @param {boolean} shouldBePresent - Whether the participant should be present (true) or absent (false)
	 * @example
	 * await performanceParticipantsPage.verifyParticipant(constants.subjectName, true);
	 * await performanceParticipantsPage.verifyParticipant(constants.subjectName, false);
	 */

	async verifyParticipant(subjectName, shouldBePresent = true) {
		const subjectElement = await this.getSubjectRowSelector(subjectName);
		const isVisible = await PwActions.elementIsVisible(
			this.page,
			subjectElement,
		);
		if (shouldBePresent) {
			expect(
				isVisible,
				`Expected participant '${subjectName}' to be present, but it was not found`,
			).toBeTruthy();
		} else {
			expect(
				isVisible,
				`Expected participant '${subjectName}' to be absent, but it was found`,
			).toBeFalsy();
		}
	}

	/**
	 * This function is to verify the count of subjects in the participants list
	 * @param {string} tab - The tab to verify the subjects from
	 * @param {number} count - The count of subjects to verify
	 * @example
	 * await performanceParticipantsPage.verifySubjectCountInTab(constants.send_invite,1);
	 * await performanceParticipantsPage.verifySubjectCountInTab(constants.add_to_shortlist,1);
	 */

	async verifySubjectCountInTab(tab, count) {
		let subjectsCountElement;
		if (tab === constants.send_invite) {
			await PwActions.click(this.page, this.btnInvitedParticipantsSection);
			subjectsCountElement = this.lblSubjectCount("Invited");
		} else if (tab === constants.add_to_shortlist) {
			await PwActions.click(this.page, this.btnShortlistParticipantsSection);
			subjectsCountElement = this.lblSubjectCount("Shortlisted");
		}
		const subjectsCount = await PwActions.getText(
			this.page,
			subjectsCountElement,
		);
		expect(Number.parseInt(subjectsCount)).toBe(count);
	}

	/**
	 * This function is to group the subject from CSV File
	 * @param {string} importCsv - The path to the import CSV file
	 * @example
	 * await performanceParticipantsPage.groupSubjectsFromCsv(importCsvRoute);
	 * @returns {Array<Object>} - The grouped subject data
	 *
	 */

	async groupSubjectsFromCsv(importCsv) {
		const { data } = await this.commonutils.readCSVFile(importCsv);
		const subjectMap = new Map();
		const subjectGroupedData = [];
		for (const row of data) {
			const {
				"Subject Name": subjectName,
				"Subject Email": subjectEmail,
				"Evaluator Name": evaluatorName,
				"Evaluator Email": evaluatorEmail,
				"Evaluator Relation": evaluatorRelation,
				"Approver Name": approverName,
				"Approver Email": approverEmail,
			} = row;
			const key = `${subjectName}|${subjectEmail}`;
			let existingSubject = subjectMap.get(key);

			if (!existingSubject) {
				existingSubject = {
					subjectDetails: {
						subjectName,
						subjectEmail,
						evaluator: [],
						approver: [],
					},
				};
				subjectMap.set(key, existingSubject);
				subjectGroupedData.push(existingSubject);
			}
			if (evaluatorName && evaluatorEmail) {
				const exists = existingSubject.subjectDetails.evaluator.some(
					(e) => e.name === evaluatorName && e.email === evaluatorEmail,
				);
				if (!exists) {
					existingSubject.subjectDetails.evaluator.push({
						name: evaluatorName,
						email: evaluatorEmail,
						relation: evaluatorRelation,
					});
				}
			}
			if (approverName && approverEmail) {
				const exists = existingSubject.subjectDetails.approver.some(
					(a) => a.name === approverName && a.email === approverEmail,
				);
				if (!exists) {
					existingSubject.subjectDetails.approver.push({
						name: approverName,
						email: approverEmail,
					});
				}
			}
		}
		return subjectGroupedData;
	}

	/**
	 * This function is to verify the imported participants received invite email
	 * @param {string} importCsv - The path to the import CSV file
	 * @param {string} surveyName - The name of the survey
	 * @example
	 * await performanceParticipantsPage.verifyImportedParticipantsReceivedInviteEmail(importCsvRoute, EntityIds.surveyName,true,true);
	 */

	async verifyImportedParticipantsReceivedInviteEmail(
		importCsv,
		surveyName,
		selfAssessment = true,
		approvalFromApprover = false,
		emailCuttOffTime = constants.emailFetchCutoffTimeInMinutes,
	) {
		const subjectGroupedData = await this.groupSubjectsFromCsv(importCsv);
		const emailPromises = [];
		const approverToSubjectsMap = new Map();
		for (const subject of subjectGroupedData) {
			const { subjectDetails } = subject;

			// Building self-assessment emails only if self-assessment is true
			if (selfAssessment) {
				emailPromises.push(
					this.commonPageFunctions.open_survey_from_received_email(
						constants.self_email_subject,
						constants.new_employee_email,
						constants.getSelfEmailBody(subjectDetails.subjectName, surveyName),
						emailCuttOffTime,
					),
				);
			}

			// Generating approver to subjects map only if approval from approver is true
			if (approvalFromApprover) {
				for (const { name } of subjectDetails.approver || []) {
					if (name) {
						if (!approverToSubjectsMap.has(name)) {
							approverToSubjectsMap.set(name, []);
						}
						approverToSubjectsMap.get(name).push(subjectDetails.subjectName);
					}
				}
			}

			// Building evaluator emails only if approval from approver is false
			if (!approvalFromApprover) {
				for (const evaluator of subjectDetails.evaluator || []) {
					emailPromises.push(
						this.commonPageFunctions.open_survey_from_received_email(
							constants.getEvaluatorEmailSubject(subjectDetails.subjectName),
							constants.new_employee_email,
							constants.getevaluatorEmailBody(
								evaluator.name,
								subjectDetails.subjectName,
								surveyName,
							),
							emailCuttOffTime,
						),
					);
				}
			}
		}

		// Building approver emails only if approval from approver is true
		if (approvalFromApprover) {
			for (const [approver, subjects] of approverToSubjectsMap) {
				emailPromises.push(
					this.commonPageFunctions.open_survey_from_received_email(
						constants.approverReminderEmailSubject,
						constants.new_employee_email,
						constants.getapproverReminderEmailBody(subjects, approver),
						emailCuttOffTime,
					),
				);
			}
		}
		// Executing all emails in parallel
		await Promise.all(emailPromises);
	}

	/**
	 * Parses participants CSV rows into survey link objects for EUI attendance.
	 *
	 * @param {{ data: Array<Record<string, string>> }} csvData - Parsed CSV from `readCSVFile`.
	 * @returns {Array<{
	 *   subjectName: string,
	 *   subjectEmail: string,
	 *   evaluatorName: string,
	 *   evaluatorEmail: string,
	 *   surveyUrl: string,
	 *   evaluatorRole: string,
	 *   mappedRole: string
	 * }>}
	 * @example
	 * const links = performanceParticipantsPage.getParticipantsSurveyLinkFromCSV(csvData);
	 */
	getParticipantsSurveyLinkFromCSV(csvData) {
		const csvDataArray = csvData.data;
		const surveyLinks = [];
		for (const data of csvDataArray) {
			const relation = (data["Relation"] || data.Relation)?.trim();
			let mappedRole = "Subject";
			if (relation) {
				const roleMapping = {
					Peer: "Evaluator-Peer",
					Manager: "Evaluator-Manager",
					Reportee: "Evaluator-Reportee",
					Self: "Subject",
				};
				mappedRole = roleMapping[relation] || "Subject";
			}

			surveyLinks.push({
				subjectName: (data["Name"] || data.name)?.trim(),
				subjectEmail: (data["Email"] || data.email)?.trim(),
				evaluatorName: (data["Evaluator Name"] || data.evaluatorName)?.trim(),
				evaluatorEmail: (
					data["Evaluator Email"] || data.evaluatorEmail
				)?.trim(),
				surveyUrl: (data["Assessment Link"] || data.surveyUrl)?.trim(),
				evaluatorRole: relation,
				mappedRole: mappedRole,
			});
		}
		return surveyLinks;
	}

	/**
	 * Gets the survey link for a specific subject-evaluator pair from CSV data
	 * Downloads CSV if needed and navigates to participants page if required
	 *
	 * @param {Object} params - Named parameters object
	 * @param {string} params.subjectEmailOrName - The email or name of the subject
	 * @param {string} params.evaluatorEmailOrName - The email or name of the evaluator
	 * @param {string} [params.surveyName=EntityIds.getsurveyName()] - The name of the survey (defaults to current survey from EntityIds)
	 * @returns {Promise<string|null>} The survey URL for the matching pair, or null if not found
	 *
	 * @example
	 * // Get survey link for a specific subject-evaluator pair using names
	 * const surveyLink = await performanceParticipantsPage.getParticipantSurveyLinkFromCSV({
	 *   subjectEmailOrName: "Subject Automation 1",
	 *   evaluatorEmailOrName: "Evaluator Automation"
	 * });
	 * // Returns: "https://survey.url/assessment-link" or null if not found
	 *
	 * @example
	 * // Get survey link using email addresses
	 * const surveyLink = await performanceParticipantsPage.getParticipantSurveyLinkFromCSV({
	 *   subjectEmailOrName: "subject@email.com",
	 *   evaluatorEmailOrName: "evaluator@email.com"
	 * });
	 */
	async getParticipantSurveyLinkFromCSV({
		subjectEmailOrName,
		evaluatorEmailOrName,
	}) {
		if (!EntityIds.getsurveyId()) {
			throw new Error(
				"Survey ID is not set. Please ensure you're working with a survey.",
			);
		}
		const expectedUrl = `${envDetails.uri}/configure/perform/${EntityIds.getsurveyId()}/participants?type=subjects`;
		const currentUrl = await PwActions.getCurrentUrl(this.page);
		let filePath = this.getDownloadedParticipantFilePath(
			EntityIds.getsurveyName(),
		);
		let csvData;
		if (fs.existsSync(filePath)) {
			logger.info(`CSV file already exists at: ${filePath}, skipping download`);
		} else {
			logger.info(
				`Downloading participants CSV for survey: ${EntityIds.getsurveyName()}`,
			);
			if (
				!currentUrl.includes(
					`/configure/perform/${EntityIds.getsurveyId()}/participants`,
				)
			) {
				logger.info(
					`Current URL doesn't match expected pattern. Navigating to: ${expectedUrl}`,
				);
				await PwActions.goTo(this.page, expectedUrl);
				await PwActions.waitForCompletePageLoad(this.page);
				await PwActions.waitForElement(this.page, this.btnDownloadParticipants);
			}
			try {
				filePath = await this.downloadParticipantsCSV(
					EntityIds.getsurveyName(),
				);
				logger.info(`CSV file ready at: ${filePath}`);
			} catch (error) {
				logger.error(`Failed to download CSV: ${error.message}`);
				throw new Error(
					`Could not download participants CSV for survey "${EntityIds.getsurveyName()}": ${error.message}`,
				);
			}
		}
		try {
			csvData = await this.commonutils.readCSVFile(filePath);
		} catch (error) {
			logger.error(`Failed to read CSV file: ${error.message}`);
			throw new Error(
				`Could not read CSV file at ${filePath}: ${error.message}`,
			);
		}
		const allLinks = this.getParticipantsSurveyLinkFromCSV(csvData);
		const csvDataArray = csvData.data;
		const normalizedSubject = subjectEmailOrName?.toLowerCase().trim();
		const normalizedEvaluator = evaluatorEmailOrName?.toLowerCase().trim();

		const matchingLink = allLinks.find((link, index) => {
			const data = csvDataArray[index];
			const subjectName = (link.subjectName || "").toLowerCase().trim();
			const subjectEmail = (data["Email"] || data.email || "")
				.toLowerCase()
				.trim();
			const evaluatorName = (link.evaluatorName || "").toLowerCase().trim();
			const evaluatorEmail = (
				data["Evaluator Email"] ||
				data.evaluatorEmail ||
				""
			)
				.toLowerCase()
				.trim();
			const subjectMatches =
				subjectName === normalizedSubject || subjectEmail === normalizedSubject;
			const evaluatorMatches =
				evaluatorName === normalizedEvaluator ||
				evaluatorEmail === normalizedEvaluator;

			return subjectMatches && evaluatorMatches;
		});
		return matchingLink ? matchingLink.surveyUrl : null;
	}

	/**
	 * Auto-generates participants for a given department and participant name.
	 *
	 * @param {string} DepartmentName - The name of the department to add participants from.
	 * @param {string} participantName - The name of the participant to select, or "selectall" to select all.
	 *
	 * @example
	 * // To auto-generate participants for the "Engineering" department and select all:
	 * await performanceParticipantsPage.autoGenerateParticipants("Engineering", "selectall");
	 *
	 * @example
	 * // To auto-generate participants for the "HR" department and select a specific participant:
	 * await performanceParticipantsPage.autoGenerateParticipants("HR", "John Doe");
	 */

	async autoGenerateParticipants(DepartmentName, participantName) {
		await PwActions.click(this.page, this.btnAddParticipants);
		await PwActions.click(this.page, this.btnAutoGenerate);
		await PwActions.click(this.page, this.drpdownAddDepartmentOrSmartList);
		await PwActions.fill(
			this.page,
			this.inputAddDepartmentOrSmartList,
			DepartmentName,
		);
		await PwActions.waitAndClick(
			this.page,
			this.drpdownParticipants.drpdownParticipants(DepartmentName),
		);
		await CommonUtils.sleep(3);
		await PwActions.click(this.page, this.btnAutoGenerateEvaluatorsConditions);
		await CommonUtils.sleep(3);
		await PwActions.click(this.page, this.btnAutoGenerateConfiguration);
		await PwActions.click(this.page, this.btnContinue);
		await PwActions.waitTillElementDisappear(this.page, this.btnSpin);
		if (participantName === "selectall") {
			await PwActions.toggleCheckBox(this.page, true, this.btnSelectAll);
		} else {
			await PwActions.toggleCheckBox(
				this.page,
				true,
				this.btnSelectOne(participantName),
			);
		}
		await expect(this.page.locator(this.btnBulkAssign)).toBeVisible();
		await PwActions.click(this.page, this.btnShortlistParticipants);
		await PwActions.click(this.page, this.btnYesShortlist);
		await PwActions.click(this.page, this.btnGoToShortlisted);
		await PwActions.pageRefresh(this.page);
		await CommonUtils.sleep(5);
	}

	/**
	 * Waits for the autosetup shortlisting to complete for a given participant .
	 *
	 * @param {string} participantName - The name of the participant to wait for in the shortlist.
	 * @returns {Promise<void>}
	 * @example
	 * await performanceParticipantsPage.waitForAutosetupShortlisting(constants.subjectName2);
	 */

	async waitForAutosetupShortlisting(participantName) {
		await PwActions.pageRefresh(this.page);
		await PwActions.waitForNetworkIdle(this.page, 20000);
		await PwActions.verifyElementIsPresent(
			this.page,
			await this.getSubjectRowSelector(participantName),
		);
	}
}

export { PerformanceParticipantsPage };

import PwActions from "playwright-framework/Core/pw-actions.js";
import { SurveyPage } from "../Surveys/Survey_Listing_Page/survey-page";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
import { expect } from "@playwright/test";
import { LoginPage } from "../login-page.js";
import { envDetails } from "../../Data/test-data.js";
import logger from "playwright-framework/Core/logger.js";

class GlobalActionPlansPage {
	constructor(page) {
		this.page = page;
		this.surveyPage = new SurveyPage(this.page);
		this.commonUtils = new CommonUtils();
		this.commonfunction = new CommonPageFunctions(this.page);
		this.loginpage = new LoginPage(page);
		this.btnActionPlans =
			"//button//span[contains(text(),'Action')] | //button//span//div[contains(text(),'Action')]";
		this.txtTotalActionPlans =
			"//p[contains(text(),'Total')]//parent::div//p[2]";
		this.btnActionPlanWhenAlreadyExists =
			'//button//span[contains(text(),"Action Plan")] | //button//div[contains(text(),"Action Plan")] ';
		this.btnAddNew = "//button//span[contains(text(),'Add New')]";
		this.inputActionPlanTitle = "//input[@placeholder='Title']";
		this.btnAssigneeUnassigned = "//div//p[text()='Unassigned']";
		this.btnAssigneeProfile = "//img[contains(@src,'employeeprofile')]";
		this.btnDueDate = "//div//p[text()='Due by']";
		this.btnCalendarDate = (randomNumber) =>
			`//button[text()='${randomNumber}' and not(@aria-disabled) ]`;
		this.btnSave = "//button//span[text()='Save']";
		this.btnPublish = "//p[text()='Save and Publish']";
		this.txtAssigneeList =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ieLcpFh-css']//button//p[1]";
		this.inputAssignee = "//input[@placeholder='Create action plan for']";
		this.btnAssigneeName = (assigneeName) =>
			`//button//p[text()='${assigneeName}']`;
		this.btnNextMonth =
			"//*[name()='svg']/*[local-name() ='path' and @d='M13.3334 21.3333L18.6667 16L13.3334 10.6667']";
		this.inputDescription =
			'//div[text()="Add Description"]/preceding-sibling::div//div[@role="textbox"]';
		this.inputChecklistItem =
			'//div[text()="Add a checklist item"]/preceding-sibling::div//div[@contenteditable="true"]';
		this.chkboxChecklistItem = (checklistItemTitle) =>
			`//span[text()="${checklistItemTitle}"]/preceding-sibling::div//button`;
		this.btnExportActionPlansAsCSV =
			'//span[text()="Add New"]/ancestor::button/parent::div/preceding-sibling::div[1]//button';
		this.inputSearchActionPlan =
			"//input[@data-testid='action-plan-filter-wrapper_input_search']";
		this.btnActionPlan = (actionPlanTitle) =>
			`//p[@data-testid='text' and normalize-space()='${actionPlanTitle}']/ancestor::div[contains(@class,'idhzjXW')][1]`;
		this.btnChecklistCheckboxInEditor = (itemTitle) =>
			`//p[@data-testid='text' and normalize-space()='${itemTitle}']/ancestor::div[.//button[contains(@data-testid,'checklist-editor_checkbox')]][1]//button[contains(@data-testid,'checklist-editor_checkbox')]`;
		this.btnCloseActionPlanListModal =
			'//span[text()="Add New"]/ancestor::button/parent::div/parent::div/following-sibling::div//button';
	}

	/**
	 * Creates an action plan from the current Performance/Engage reports context.
	 *
	 * @param {object} options
	 * @param {object} options.actionPlanData
	 * @param {string} options.actionPlanData.title - Action plan title
	 * @param {string} options.actionPlanData.assigneeName - Assignee display name
	 * @param {string} [options.actionPlanData.description] - Description (omit filling when empty string)
	 * @param {Array<{title: string, status: 'completed' | 'not started'}>} [options.actionPlanData.checklist] - Checklist rows to add, save, and publish
	 * @returns {Promise<object>} The same `actionPlanData` reference after create/publish (when checklist is non-empty)
	 * @example
	 * const actionPlanData = await globalActionPlansPage.createActionPlan({
	 *   actionPlanData: constants.getActionPlanCreatePayload({
	 *     title: actionPlanTitle,
	 *     assigneeName: constants.engageParticipant1,
	 *     source: surveyName,
	 *     description: "",
	 *     scenario: "single_checklist_completed",
	 *   }),
	 * });
	 * // actionPlanData → { title, assigneeName, assigneeEmail, creatorEmail, description?, checklist, source? }
	 */
	async createActionPlan({ actionPlanData = {} }) {
		const { title, assigneeName, checklist = [], description } = actionPlanData;
		const txtActionPlanButton = await PwActions.getText(
			this.page,
			this.btnActionPlans,
		);
		if (
			txtActionPlanButton !== "Action Plans" &&
			txtActionPlanButton !== "Create Action Plan"
		) {
			await PwActions.click(this.page, this.btnActionPlanWhenAlreadyExists);
			await PwActions.click(this.page, this.btnAddNew);
		} else {
			await PwActions.click(this.page, this.btnActionPlans);
		}
		await PwActions.fill(this.page, this.inputActionPlanTitle, title);
		if (description) {
			await PwActions.fill(this.page, this.inputDescription, description);
		}
		await PwActions.click(this.page, this.btnAssigneeUnassigned);
		await PwActions.waitTillVisible(this.page, this.txtAssigneeList, 50000);
		await PwActions.click(this.page, this.inputAssignee);
		await PwActions.fill(this.page, this.inputAssignee, assigneeName);
		await PwActions.waitTillVisible(
			this.page,
			this.btnAssigneeName(assigneeName),
		);
		await PwActions.click(this.page, this.btnAssigneeName(assigneeName));
		await PwActions.click(this.page, this.btnDueDate);
		const randomClicks = Math.ceil(Math.random() * 3);
		for (let clickCount = 0; clickCount < randomClicks; clickCount++) {
			await PwActions.click(this.page, this.btnNextMonth);
		}
		const randomNumber = Math.ceil(Math.random() * 28);
		await PwActions.click(this.page, this.btnCalendarDate(randomNumber));
		if (checklist.length > 0) {
			for (const checklistItem of checklist) {
				await PwActions.click(this.page, this.inputChecklistItem);
				await PwActions.fill(
					this.page,
					this.inputChecklistItem,
					checklistItem.title,
				);
				await PwActions.press(this.page, "Enter");
				await CommonUtils.sleep(2);
			}
			for (const checklistItem of checklist) {
				if (checklistItem.status === "completed") {
					await PwActions.click(
						this.page,
						this.chkboxChecklistItem(checklistItem.title),
					);
				}
			}
			await PwActions.click(this.page, this.btnSave);
			await PwActions.click(this.page, this.btnPublish);
		}
		return actionPlanData;
	}

	/**
	 * Opens a new browser tab, logs in as the assignee, navigates to global Action Plans,
	 * opens the plan by title, aligns checklist item checkboxes with `checklist[].status`,
	 * then saves and publishes. Mirrors the multi-tab pattern used by `updateGoal`.
	 *
	 * @param {object} options
	 * @param {object} options.actionPlanData - Must include `title`; `checklist` drives checkbox updates.
	 * @param {string} options.actionPlanData.title - Action plan title to search and open.
	 * @param {Array<{ title: string, status: 'completed' | 'not started' }>} [options.actionPlanData.checklist=[]]
	 * @param {{ email: string, password: string }} options.assigneeCredential
	 * @param {import('@playwright/test').Browser} options.browser
	 * @returns {Promise<object>} The same `actionPlanData` reference passed in (checklist matches requested statuses after publish).
	 * @example
	 * const updated = await actionPlansPage.updateActionPlan({
	 *   actionPlanData: { title, checklist: toggledChecklist },
	 *   assigneeCredential: { email: envDetails.goalsUserEmail, password: envDetails.goalsPassword },
	 *   browser,
	 * });
	 * // updated.checklist === toggledChecklist
	 */
	async updateActionPlan({ actionPlanData, assigneeCredential, browser }) {
		const { title, checklist = [] } = actionPlanData ?? {};
		if (!title) throw new Error("actionPlanData.title is required");
		if (!assigneeCredential?.email || !assigneeCredential?.password)
			throw new Error("assigneeCredential with email and password is required");
		if (!browser) throw new Error("browser instance is required");
		if (checklist.length === 0)
			throw new Error(
				"actionPlanData.checklist must contain at least one item",
			);
		const baseUrl = `${envDetails.uri}`;
		const updatePage = await PwActions.openNewTab(browser);

		try {
			await PwActions.goTo(updatePage, baseUrl);
			await this.loginpage.login(
				updatePage,
				assigneeCredential.email,
				assigneeCredential.password,
			);
			await PwActions.goTo(updatePage, envDetails.uri + "/action-plans");
			await PwActions.waitForNetworkIdle(updatePage, 15000);

			await PwActions.fill(updatePage, this.inputSearchActionPlan, title);
			await PwActions.waitTillVisible(
				updatePage,
				this.btnActionPlan(title),
				20000,
			);
			await PwActions.click(updatePage, this.btnActionPlan(title));
			for (const item of checklist) {
				const checkboxXpath = this.btnChecklistCheckboxInEditor(item.title);
				await PwActions.waitTillVisible(updatePage, checkboxXpath, 15000);
				const dataState = await PwActions.getAttributeValue(
					updatePage,
					checkboxXpath,
					"data-state",
				);
				const shouldToggle =
					(item.status === "completed") !== (dataState === "checked");

				if (shouldToggle) {
					await PwActions.click(updatePage, checkboxXpath);
					await PwActions.waitTillVisible(updatePage, checkboxXpath, 5000);
				}
			}
			logger.info(`updateActionPlan: checklist updated for "${title}"`);
		} finally {
			await PwActions.closeTab(updatePage);
		}

		return actionPlanData;
	}

	/**
	 * Exports action plans as CSV and verifies the data against expected action plans
	 * @param {object} options - The options for exporting and verifying action plans
	 * @param {Array<{
	 *   title: string,
	 *   assigneeName: string,
	 *   assigneeEmail: string,
	 *   creatorEmail: string,
	 *   description: string,
	 *   source?: string,
	 *   checklist: Array<{title: string, status: 'completed' | 'not started'}>
	 * }>} options.expectedActionPlans - The expected action plans to verify. `source` is optional; when omitted, the CSV **Source** column is not asserted.
	 * @example
	 * await actionPlansPage.exportAndVerifyActionPlansAsCSV({
	 *   expectedActionPlans: [actionPlanData],
	 * });
	 */
	async exportAndVerifyActionPlansAsCSV({ expectedActionPlans = [] }) {
		await PwActions.click(this.page, this.btnActionPlans);
		const { filePath } = await this.commonfunction.downloadFileAndReturnPath(
			this.page,
			this.btnExportActionPlansAsCSV,
		);
		const { data: csvData } = await this.commonUtils.readCSVFile(filePath);

		const actionPlanRows = csvData.filter(
			(row) => row["Type"] === "Action Plan",
		);
		const checklistRows = csvData.filter(
			(row) => row["Type"] === "Checklist Item",
		);

		for (const {
			title,
			assigneeName,
			assigneeEmail,
			creatorEmail,
			description,
			source,
			checklist = [],
		} of expectedActionPlans) {
			const actionPlanRow = actionPlanRows.find(
				(row) => row["Item Name"].trim() === title.trim(),
			);
			expect(
				actionPlanRow,
				`Action plan "${title}" not found in CSV`,
			).toBeTruthy();
			expect(
				actionPlanRow["State"],
				`Action plan "${title}" state should be Published`,
			).toBe("Published");
			expect(
				actionPlanRow["Description"],
				`Action plan "${title}" description mismatch`,
			).toBe(description);
			if (source !== undefined && source !== null && source !== "") {
				expect(
					actionPlanRow["Source"],
					`Action plan "${title}" source mismatch`,
				).toBe(source);
			}
			expect(
				actionPlanRow["Assignee"],
				`Action plan "${title}" assignee email should be ${assigneeEmail}`,
			).toBe(assigneeEmail);
			expect(
				actionPlanRow["Created By"],
				`Action plan "${title}" creator email should be ${creatorEmail}`,
			).toBe(creatorEmail);

			if (checklist.length > 0) {
				const completedCount = checklist.filter(
					(i) => i.status === "completed",
				).length;
				const expectedProgress = String(
					Math.round((completedCount / checklist.length) * 100),
				);
				expect(
					actionPlanRow["Progress"],
					`Action plan "${title}" progress should reflect checklist completion (${expectedProgress}%)`,
				).toBe(expectedProgress);

				const itemRows = checklistRows.filter(
					(row) => row["Parent ID"] === actionPlanRow["ID"],
				);
				expect(
					itemRows.length,
					`Action plan "${title}" should have ${checklist.length} checklist rows in CSV`,
				).toBe(checklist.length);

				const itemRowsByTitle = Object.fromEntries(
					itemRows.map((row) => [row["Item Name"].trim().toLowerCase(), row]),
				);

				for (const { title: itemTitle, status } of checklist) {
					const itemRow = itemRowsByTitle[itemTitle.trim().toLowerCase()];
					expect(
						itemRow,
						`Checklist item "${itemTitle}" not found in CSV for action plan "${title}"`,
					).toBeTruthy();
					expect(
						itemRow["Status"],
						`Checklist item "${itemTitle}" status mismatch`,
					).toBe(status === "completed" ? "Completed" : "Not Started");
					expect(
						itemRow["Assignee"],
						`Checklist item "${itemTitle}" assignee should be ${assigneeEmail}`,
					).toBe(assigneeEmail);
					expect(
						itemRow["Created By"],
						`Checklist item "${itemTitle}" creator should be ${creatorEmail}`,
					).toBe(creatorEmail);
				}
			}
		}
		await this.closeActionPlanListModal();
	}

	/**
	 * Closes the action plan list modal if it is visible
	 * @returns {Promise<void>}
	 * @example
	 * await globalActionPlansPage.closeActionPlanListModal();
	 */
	async closeActionPlanListModal() {
		if (
			await PwActions.elementIsVisible(
				this.page,
				this.btnCloseActionPlanListModal,
			)
		) {
			await PwActions.click(this.page, this.btnCloseActionPlanListModal);
		}
	}
}

export { GlobalActionPlansPage };

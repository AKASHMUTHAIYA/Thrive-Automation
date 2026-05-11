import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
import GoalsCommon from "./goals-common.js";

class GoalsCycle {
	constructor(page) {
		this.page = page;
		this.btnNewGoalCycle = `//button[@data-testid="components_button_new-cycle"]`;
		this.txtInputGoalCycleName = `//input[@data-testid="create-goal-cycle-modal_form-input_title"]`;
		this.btnCalendarStartDate = `//div[@data-testid="create-goal-cycle-modal_date-picker_start-date"]//button`;
		this.btnCalendarEndDate = `//div[@data-testid="create-goal-cycle-modal_date-picker"]//button`;
		this.chckBoxMakeDefaultActive = `//button[@data-testid="create-goal-cycle-modal_checkbox"]`;
		this.btnSaveGoalCycle = `//button[@data-testid="create-goal-cycle-modal_button_save"]`;
		this.getGoalCycleInList = (goalCycleName) =>
			`//table[@data-testid="goal-cycle-table_table"]//tr//td[normalize-space(.)="${goalCycleName}"]`;
		this.getMenuButtonForGoalCycle = (goalCycleName) =>
			`//tr[.//td[normalize-space(.)='${goalCycleName}']]//button[@data-testid='goal-cycle-table_icon-button_dropdown-menu']`;
		this.dropdownMenuItemForArchive = `//div[@data-testid="goal-cycle-table_dropdown-menu-item_archive"]`;
		this.radioBtnArchieveAllGoals =
			"//label[text()='Archive all Goals']/parent::div/parent::div/preceding-sibling::div//button";
		this.btnYesConfirm = "//span[text()='Confirm']";
		this.commonfunctions = new CommonPageFunctions(page);
		this.goalsCommonPage = new GoalsCommon(page);
	}

	/*
	 * Creates a new goal cycle with the given name.
	 * @param {Page} page - The page instance.
	 * @param {string} goalCycleName - The name of the goal cycle.
	 * @returns {Promise<void>} - Returns true if the goal cycle is created successfully.
	 * @example
	 * await goalsCycle.createGoalCycle(page, "Test Goal Cycle");
	 */
	async createGoalCycle(goalCycleName) {
		const { page } = this;
		await PwActions.click(page, this.btnNewGoalCycle);
		await PwActions.fill(page, this.txtInputGoalCycleName, goalCycleName);
		await PwActions.click(page, this.btnCalendarEndDate);
		await this.commonfunctions.chooseRandomDateOnCalendar({ page: page });
		await PwActions.click(page, this.btnSaveGoalCycle);
	}

	async archiveGoalCycle({ goalCycleName, settings = {} }) {
		const { page } = this;
		await this.commonfunctions.navigateTopNavigateSection("Goals");
		await this.goalsCommonPage.navigateToSideBarMenu({
			menuName: "Goal Cycle",
		});
		await PwActions.hover(page, this.getGoalCycleInList(goalCycleName));
		await PwActions.forceClick(
			page,
			this.getMenuButtonForGoalCycle(goalCycleName),
		);
		await PwActions.click(page, this.dropdownMenuItemForArchive);
		if (settings.archiveAllGoals) {
			await PwActions.click(page, this.radioBtnArchieveAllGoals);
			await PwActions.click(page, this.btnYesConfirm);
		}
	}
}

export default GoalsCycle;

import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

export class GoalsConfigurations {
	constructor(page) {
		this.page = page;
		this.commonFunctions = new CommonPageFunctions(page);
		this.chkBoxAllowManagerToCreateTeamGoal = `//button[@data-testid="goal-creation_checkbox_managers-description"]`;
		this.chkBoxAllowDeptHeadToCreateDeptGoal = `//button[@data-testid="goal-creation_checkbox_dept-heads-description"]`;
		this.chkBoxAllowEmployeeToCreateGoal = `//button[@data-testid="goal-creation_checkbox_individuals-description"]`;
		this.txtInputGoalWriter = `//h1[normalize-space()="Goal Writer"]/following-sibling::div//input`;
		this.getGoalWriterInList = (employeeName) =>
			`//div[@data-testid="goal-writer_flex_custom-option"]//p[text()="${employeeName}"]`;
		this.btnRemoveForGoalWriter = (employeeName) =>
			`//div[@data-testid="goal-writer_chip"]/span[text()="${employeeName}"]//div[@data-testid="goal-writer_box_chip-right-element"]`;
	}

	/**
	 * Configures goal creation permissions.
	 *
	 * @param {object} permission - The permission object.
	 * @param {boolean} permission.allowManagerToCreateTeamGoal - Whether to allow manager to create team goal.
	 * @param {boolean} permission.allowDeptHeadToCreateDeptGoal - Whether to allow dept head to create dept goal.
	 * @param {boolean} permission.allowEmployeeToCreateGoal - Whether to allow employee to create goal.
	 * @returns {promise} - A promise that resolves when the goal creation permissions are configured.
	 * @example
	 * await goalsConfigurations.configureGoalCreationPermissions({
	 *   allowManagerToCreateTeamGoal: true,
	 *   allowDeptHeadToCreateDeptGoal: true,
	 *   allowEmployeeToCreateGoal: true,
	 * });
	 * @example
	 * await goalsConfigurations.configureGoalCreationPermissions({
	 *   allowManagerToCreateTeamGoal: false,
	 *   allowDeptHeadToCreateDeptGoal: false,
	 *   allowEmployeeToCreateGoal: false,
	 * });
	 */
	async configureGoalCreationPermissions(permission) {
		const permissionMap = {
			allowManagerToCreateTeamGoal: this.chkBoxAllowManagerToCreateTeamGoal,
			allowDeptHeadToCreateDeptGoal: this.chkBoxAllowDeptHeadToCreateDeptGoal,
			allowEmployeeToCreateGoal: this.chkBoxAllowEmployeeToCreateGoal,
		};
		await PwActions.pageRefresh(this.page);
		for (const key in permission) {
			if (permissionMap[key] !== undefined) {
				const selector = permissionMap[key];
				const desiredState = !!permission[key];
				const currentState = await PwActions.isElementChecked(
					this.page,
					selector,
				);
				if (currentState !== desiredState) {
					await CommonUtils.sleep(2);
					await PwActions.clickAndSyncWithApi(
						this.page,
						selector,
						"/api/okrs/settings",
					);
				}
			}
		}
	}

	/**
	 * Adds a goal writer.
	 * @param {string} employee - The employee name.
	 * @returns {promise} - A promise that resolves when the goal writer is added.
	 * @example
	 * await goalsConfigurations.addGoalWriters("John Doe");
	 */
	async addGoalWriters(employee) {
		await PwActions.fill(this.page, this.txtInputGoalWriter, employee);
		await PwActions.click(this.page, this.getGoalWriterInList(employee));
	}

	/**
	 * Removes a goal writer.
	 * @param {string} employee - The employee name.
	 * @returns {promise} - A promise that resolves when the goal writer is removed.
	 * @example
	 * await goalsConfigurations.removeGoalWriters("John Doe");
	 */
	async removeGoalWriters(employee) {
		await PwActions.click(this.page, this.btnRemoveForGoalWriter(employee));
	}
}

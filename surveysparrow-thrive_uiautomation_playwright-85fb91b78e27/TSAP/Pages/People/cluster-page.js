import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions.js";
import { PeoplePage } from "./people-page.js";
import { EmployeesPage } from "./employees-page.js";

export class ClustersPage {
	constructor(page) {
		this.page = page;
		this.peoplePage = new PeoplePage(this.page);
		this.employeesPage = new EmployeesPage(this.page);
		this.commonFunctions = new CommonPageFunctions(this.page);

		// Header Actions
		this.btnArchiveFolder =
			"//button[@data-testid='components_icon-button_archive']";
		this.btnBackFromArchive =
			"//button[@data-testid='components_icon-button_back']";
		this.btnSearchClusters =
			"//button[@aria-label='Search clusters and groups']";
		this.btnCreateNew = "//button[.//span[text()='Create New']]";
		this.menuItemCreateCluster =
			"//div[@role='menuitem'][.//p[text()='Create Cluster']]";
		this.menuItemCreateGroup =
			"//div[@role='menuitem'][.//p[text()='Create Group']]";
		this.btnModalClose =
			"//button[contains(@data-testid,'modal_icon-button_close')]";

		// Cluster/Group Dialog
		this.inputClusterName = "//input[@name='name']";
		this.inputChooseCluster =
			"//div[text()='Search Cluster and Groups']//parent::div//input";
		this.inputClusterHeadTitle = "//input[@name='headTitle']";
		this.inputGroupName = "//input[@name='name']";
		this.inputGroupHead =
			"//label[text()='Group Head(s)']//ancestor::div[4]//input";
		this.inputAddGroupMembers =
			"//label[text()='Group Members']//ancestor::div[4]//input";
		this.btnSaveAndAddGroup =
			"//button[@data-testid='create-cluster-modal_button_save-and-add-group']";
		this.btnDisabledSaveAndAddGroup =
			"//button[@data-testid='create-cluster-modal_button_save-and-add-group'][@disabled]";
		this.btnSaveCluster =
			"//button[@data-testid='create-cluster-modal_button_save-cluster']";
		this.btnDisabledSaveCluster =
			"//button[@data-testid='create-cluster-modal_button_save-cluster'][@disabled]";
		this.btnCancel = "//button[.//span[text()='Cancel']]";
		this.btnSaveGroup =
			"//button[@data-testid='add-group-modal_button_add-group']";
		this.btnDisabledSaveGroup =
			"//button[@data-testid='add-group-modal_button_add-group'][@disabled]";
		this.btnSaveAndAddMore =
			"//button[@data-testid='add-group-modal_button_save-and-add-more']";
		this.btnCloseEmployeeInfoPanel =
			"//button[@data-testid='employee-info-pane_icon-button_close']";

		this.lblDialogTitle = "//h1[@data-testid='text']";
		this.btnUpdateCluster =
			"//button[@data-testid='create-cluster-modal_button_update']";

		// Cluster Table
		this.lblClustersHeading = "//p[text()='Clusters']";
		this.lblArchivedLabel = "//p[text()='Archived']";
		this.tblClusters = "//table";

		// Selection Toolbar
		this.lblSelectedCount = "//p[contains(text(),'Selected')]";
		this.btnArchive = "//button[.//p[text()='Archive']]";
		this.btnUnarchive = "//button[@data-testid='selection-toaster_button_cta']";
		this.btnCloseToolbar = "//button[@aria-label='Close']";

		// Group Detail Page
		this.btnAddMembers =
			"//button[@data-testid='groups_button_add-members-btn']";
		this.tabActive = "//button[@role='tab'][contains(.,'Active')]";
		this.tblMembers = "//table";

		// Add Members Modal
		this.txtSearchMembers =
			"//div[contains(@class,'twigs-select__control')]//input";
		this.btnAddMembersSubmit =
			"//button[@data-testid='add-members-modal_button_add']";
		this.btnAddMembersCancel = "//button[.//span[text()='Cancel']]";

		// Employee Profile - Clusters & Groups Tab
		this.tabClustersAndGroups =
			"//button[@role='tab'][text()='Clusters & Groups']";

		// Toasters
		this.toasterSuccess = "//div[contains(text(),'Successfully')]";
		this.toasterError = "//div[@role='alert']";
		this.toasterDuplicateName = "//div[contains(text(),'name already exist')]";

		// Dynamic Selectors
		this.getClusterRow = (clusterName) =>
			`//tr[.//p[contains(text(),'${clusterName}')]]`;
		this.getClusterCheckbox = (clusterName) =>
			`//tr[.//p[contains(text(),'${clusterName}')]]//button[@role='checkbox']`;
		this.getClusterExpandArrow = (clusterName) =>
			`(//tr[.//p[contains(text(),'${clusterName}')]]//*[name()='svg'])[1]`;
		this.getClusterEditIcon = (clusterName) =>
			`//tr[.//p[contains(text(),'${clusterName}')]]//button[contains(@data-testid,'cluster-row_icon-button_rename')]`;
		this.getGroupRow = (groupName) => `//tr[.//p[text()='${groupName}']]`;
		this.getGroupCheckbox = (groupName) =>
			`//tr[.//p[text()='${groupName}']]//button[@role='checkbox']`;
		this.getGroupEditIcon = (groupName) =>
			`//tr[.//p[text()='${groupName}']]//button[@data-testid="group-row_icon-button_rename"]`;
		this.getGroupHeadColumn = (groupName) =>
			`//tr[.//p[text()='${groupName}']]//td[2]//p`;
		this.getMemberCountColumn = (groupName) =>
			`//tr[.//p[text()='${groupName}']]//td[3]//p`;
		this.getDropdownOption = (optionText) =>
			`(//div[contains(@class,'twigs-select__menu')]//p[text()='${optionText}'])[1]`;
		this.getMemberRow = (memberName) => `//tr[.//p[text()='${memberName}']]`;
		this.getActiveTabCount = "//button[@role='tab'][contains(.,'Active')]//p";
		this.btnAddGroups = "//tr[.//p[text()='Add Groups']]";
		this.getClusterGroupHeadTitle = (clusterName) =>
			`//tr[.//p[contains(text(),'${clusterName}')]]/td[2]//p`;
		this.getClusterMemberCount = (clusterName) =>
			`//tr[.//p[contains(text(),'${clusterName}')]]/td[3]//p`;
		this.getClusterGroupsInProfile = (clusterName) =>
			`//p[text()='${clusterName}']/following-sibling::div//input`;
		this.btnClusterPopUpGotIt =
			"//button[@data-testid='sidebar-contents_button_clusters-hovercard-got-it']";
	}

	/**
	 * Navigates to the Clusters page
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.navigateToClusters();
	 */
	async navigateToClusters() {
		await this.peoplePage.navigateToSections("Clusters");
		if (
			await PwActions.elementIsVisible(this.page, this.btnClusterPopUpGotIt)
		) {
			await PwActions.click(this.page, this.btnClusterPopUpGotIt);
		}

		await PwActions.waitForNetworkIdle(this.page);
	}

	/**
	 * Creates a new cluster with the specified name and group head title
	 *
	 * @param {Object} options - Cluster creation options
	 * @param {string} options.clusterName - Name of the cluster (required)
	 * @param {string} [options.clusterHeadTitle="Director"] - Title for cluster heads
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.createCluster({ clusterName: "Division_123", clusterHeadTitle: "VP" });
	 */
	async createCluster({ clusterName, clusterHeadTitle = "Director" } = {}) {
		await PwActions.click(this.page, this.btnCreateNew);
		await PwActions.click(this.page, this.menuItemCreateCluster);
		await PwActions.fill(this.page, this.inputClusterName, clusterName);
		await PwActions.fill(
			this.page,
			this.inputClusterHeadTitle,
			clusterHeadTitle,
		);
		await PwActions.click(this.page, this.btnSaveCluster);
	}

	/**
	 * Creates a new group within an expanded cluster
	 *
	 * @param {Object} options - Group creation options
	 * @param {string} options.groupName - Name of the group (required)
	 * @param {string[]} [options.groupHeads=[]] - Array of group head names
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.createGroup({ groupName: "Engineering_123", groupHeads: ["Alex Osprey"] });
	 */
	async createGroup({ groupName, groupHeads = [] } = {}) {
		await PwActions.click(this.page, this.btnAddGroups);
		await PwActions.fill(this.page, this.inputGroupName, groupName);

		for (const head of groupHeads) {
			await PwActions.click(this.page, this.inputGroupHead);
			await PwActions.fill(this.page, this.inputGroupHead, head);
			await PwActions.waitForNetworkIdle(this.page);
			await CommonUtils.sleep(1);
			await PwActions.waitTillVisible(this.page, this.getDropdownOption(head));

			await PwActions.click(this.page, this.getDropdownOption(head));
		}

		await PwActions.click(this.page, this.btnSaveGroup);
	}

	/**
	 * Expands a cluster to show its groups
	 *
	 * @param {string} clusterName - Name of the cluster to expand
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.expandCluster("Division_123");
	 */
	async expandCluster(clusterName) {
		await CommonUtils.sleep(2);
		if (
			await PwActions.elementIsVisible(this.page, this.btnClusterPopUpGotIt)
		) {
			await PwActions.click(this.page, this.btnClusterPopUpGotIt);
		}
		const expandArrow = this.getClusterExpandArrow(clusterName);
		await PwActions.click(this.page, expandArrow);
		await CommonUtils.sleep(1);
	}

	/**
	 * Opens a group's detail page by clicking on its row
	 *
	 * @param {string} groupName - Name of the group to open
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.openGroup("Engineering_123");
	 */
	async openGroup(groupName) {
		await PwActions.click(this.page, this.getGroupRow(groupName));
		await PwActions.waitForNetworkIdle(this.page);
	}

	/**
	 * Adds members to the currently open group
	 *
	 * @param {string[]} memberNames - Array of member names to add
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.addMembersToGroup(["Jones Eagle", "Noah Albatross"]);
	 */
	async addMembersToGroup(memberNames) {
		//await this.openGroup(groupName);
		for (const member of memberNames) {
			await PwActions.click(this.page, this.btnAddMembers);
			await PwActions.click(this.page, this.txtSearchMembers);
			await PwActions.fill(this.page, this.txtSearchMembers, member);
			await CommonUtils.sleep(1.5);
			await PwActions.click(this.page, this.getDropdownOption(member));
			await PwActions.click(this.page, this.btnAddMembersSubmit);
		}
	}

	/**
	 * Edits a cluster's name and/or group head title
	 *
	 * @param {string} currentClusterName - Current name of the cluster
	 * @param {Object} options - Edit options
	 * @param {string} [options.newClusterName] - New name for the cluster
	 * @param {string} [options.newGroupHeadTitle] - New group head title
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.editCluster("Division_123", { newClusterName: "Division_Edited", newGroupHeadTitle: "VP" });
	 */
	async editCluster(
		currentClusterName,
		{ newClusterName, newGroupHeadTitle } = {},
	) {
		await PwActions.hover(this.page, this.getClusterRow(currentClusterName));
		await PwActions.click(
			this.page,
			this.getClusterEditIcon(currentClusterName),
		);

		if (newClusterName) {
			await PwActions.clearAndFill(
				this.page,
				this.inputClusterName,
				newClusterName,
			);
		}
		if (newGroupHeadTitle) {
			await PwActions.clearAndFill(
				this.page,
				this.inputClusterHeadTitle,
				newGroupHeadTitle,
			);
		}

		await PwActions.click(this.page, this.btnUpdateCluster);
	}

	/**
	 * Edits a group's name and/or group heads
	 *
	 * @param {string} currentGroupName - Current name of the group
	 * @param {Object} options - Edit options
	 * @param {string} [options.newGroupName] - New name for the group
	 * @param {string[]} [options.newGroupHeads] - New group heads (replaces existing)
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.editGroup("Engineering_123", { newGroupName: "Engineering_Edited", newGroupHeads: ["Lucas Hawk"] });
	 */
	async editGroup(currentGroupName, { newGroupName, newGroupHeads } = {}) {
		await PwActions.hover(this.page, this.getGroupRow(currentGroupName));
		await PwActions.click(this.page, this.getGroupEditIcon(currentGroupName));

		if (newGroupName) {
			await PwActions.clearAndFill(
				this.page,
				this.inputGroupName,
				newGroupName,
			);
		}

		if (newGroupHeads && newGroupHeads.length > 0) {
			for (const head of newGroupHeads) {
				await PwActions.click(this.page, this.inputGroupHead);
				await PwActions.fill(this.page, this.inputGroupHead, head);
				await CommonUtils.sleep(1);
				await PwActions.click(this.page, this.getDropdownOption(head));
			}
		}

		await PwActions.click(this.page, this.btnSaveGroup);
		await CommonUtils.sleep(2);
	}

	/**
	 * Archives a cluster or group by selecting its checkbox and clicking Archive
	 *
	 * @param {string} name - Name of the cluster or group to archive
	 * @param {string} [type="cluster"] - Type: "cluster" or "group"
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.archiveItem("Division_123", "cluster");
	 * await clustersPage.archiveItem("Engineering_123", "group");
	 */
	async archiveItem(name, type = "cluster") {
		const checkboxSelector =
			type === "cluster"
				? this.getClusterCheckbox(name)
				: this.getGroupCheckbox(name);

		await PwActions.click(this.page, checkboxSelector);
		await PwActions.waitTillVisible(this.page, this.btnArchive);
		await PwActions.click(this.page, this.btnArchive);
	}

	/**
	 * Opens the archived items view
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.openArchivedView();
	 */
	async openArchivedView() {
		await PwActions.click(this.page, this.btnArchiveFolder);
		await CommonUtils.sleep(1);
	}

	/**
	 * Returns to the active clusters view from archived view
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.returnToActiveView();
	 */
	async returnToActiveView() {
		await PwActions.click(this.page, this.btnBackFromArchive);
		await CommonUtils.sleep(1);
	}

	/**
	 * Unarchives a cluster (must be in archived view)
	 *
	 * @param {string} clusterName - Name of the cluster to unarchive
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.unarchiveCluster("Division_123");
	 */
	async unarchiveCluster(clusterName) {
		await PwActions.click(this.page, this.getClusterCheckbox(clusterName));
		await PwActions.waitTillVisible(this.page, this.btnUnarchive);
		await PwActions.click(this.page, this.btnUnarchive);
	}

	/**
	 * Verifies if a cluster exists in the current view
	 *
	 * @param {string} clusterName - Name of the cluster to verify
	 * @returns {Promise<boolean>} True if cluster exists
	 *
	 * @example
	 * const exists = await clustersPage.verifyClusterExists("Division_123");
	 */
	async verifyClusterExists(clusterName) {
		await CommonUtils.sleep(2);
		return await PwActions.elementIsVisible(
			this.page,
			this.getClusterRow(clusterName),
		);
	}

	/**
	 * Verifies if a group exists in the current view
	 *
	 * @param {string} groupName - Name of the group to verify
	 * @returns {Promise<boolean>} True if group exists
	 *
	 * @example
	 * const exists = await clustersPage.verifyGroupExists("Engineering_123");
	 */
	async verifyGroupExists(groupName) {
		await CommonUtils.sleep(2);
		return await PwActions.elementIsVisible(
			this.page,
			this.getGroupRow(groupName),
		);
	}

	/**
	 * Gets the member count for a group from the table
	 *
	 * @param {string} groupName - Name of the group
	 * @returns {Promise<string>} Member count as string
	 *
	 * @example
	 * const count = await clustersPage.getGroupMemberCount("Engineering_123");
	 */
	async getGroupMemberCount(groupName) {
		return await PwActions.getText(
			this.page,
			this.getMemberCountColumn(groupName),
		);
	}

	/**
	 * Gets the active member count from the group detail page tab
	 *
	 * @returns {Promise<string>} Active member count
	 *
	 * @example
	 * const count = await clustersPage.getActiveMemberCount();
	 */
	async getActiveMemberCount() {
		await CommonUtils.sleep(2);
		const tabText = await PwActions.getText(this.page, this.tabActive);
		const match = tabText.match(/\d+/);
		return match ? match[0] : "0";
	}

	/**
	 * Verifies if a member exists in the group detail page
	 *
	 * @param {string} memberName - Name of the member to verify
	 * @returns {Promise<boolean>} True if member exists
	 *
	 * @example
	 * const exists = await clustersPage.verifyMemberExists("Lucas Hawk");
	 */
	async verifyMemberExists(memberName) {
		await CommonUtils.sleep(1);
		return await PwActions.elementIsVisible(
			this.page,
			this.getMemberRow(memberName),
		);
	}

	/**
	 * Gets the group head title column value for a cluster
	 *
	 * @param {string} clusterName - Name of the cluster
	 * @returns {Promise<string>} Group head title
	 *
	 * @example
	 * const title = await clustersPage.getClusterGroupHeadTitle("Division_123");
	 */
	async getClusterGroupHeadTitleValue(clusterName) {
		return await PwActions.getText(
			this.page,
			this.getClusterGroupHeadTitle(clusterName),
		);
	}

	/**
	 * Gets the group head names for a group from the table
	 *
	 * @param {string} groupName - Name of the group
	 * @returns {Promise<string>} Group head names
	 *
	 * @example
	 * const heads = await clustersPage.getGroupHeadNames("Engineering_123");
	 */
	async getGroupHeadNames(groupName) {
		await CommonUtils.sleep(1);
		return await PwActions.getText(
			this.page,
			this.getGroupHeadColumn(groupName),
		);
	}

	/**
	 * Verifies the archived view is active
	 *
	 * @returns {Promise<boolean>} True if archived label is visible
	 *
	 * @example
	 * const isArchived = await clustersPage.verifyArchivedViewActive();
	 */
	async verifyArchivedViewActive() {
		return await PwActions.elementIsVisible(this.page, this.lblArchivedLabel);
	}

	/**
	 * Checks if the archive folder button is visible (indicates archived items exist)
	 *
	 * @returns {Promise<boolean>} True if archive button is visible
	 *
	 * @example
	 * const hasArchived = await clustersPage.isArchiveFolderVisible();
	 */
	async isArchiveFolderVisible() {
		return await PwActions.elementIsVisible(this.page, this.btnArchiveFolder);
	}

	/**
	 * Clicks the Clusters & Groups tab on an employee profile
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.clickClustersAndGroupsTab();
	 */
	async clickClustersAndGroupsTab() {
		await PwActions.click(this.page, this.tabClustersAndGroups);
		await CommonUtils.sleep(1);
	}

	/**
	 * Gets the groups listed under a cluster in the employee profile
	 *
	 * @param {string} clusterName - Name of the cluster
	 * @returns {Promise<string>} Groups text
	 *
	 * @example
	 * const groups = await clustersPage.getEmployeeClusterGroups("Division_123");
	 */
	async getEmployeeClusterGroups(clusterName) {
		return await PwActions.getText(
			this.page,
			this.getClusterGroupsInProfile(clusterName),
		);
	}

	async closeEmployeeInfoPanel() {
		await PwActions.click(this.page, this.btnCloseEmployeeInfoPanel);
	}

	/**
	 * Attempts to create a cluster with validation - used for testing empty/duplicate names
	 *
	 * @param {Object} options - Cluster creation options
	 * @param {string} [options.clusterName=""] - Name of the cluster
	 * @param {string} [options.groupHeadTitle="Test"] - Group head title
	 * @returns {Promise<boolean>} True if dialog is still open (validation failed)
	 *
	 * @example
	 * const validationFailed = await clustersPage.attemptCreateClusterWithValidation({ clusterName: "" });
	 */
	async attemptCreateClusterWithValidation({
		clusterName = "",
		groupHeadTitle = "Test",
	} = {}) {
		await PwActions.click(this.page, this.btnCreateNew);
		await PwActions.click(this.page, this.menuItemCreateCluster);

		if (clusterName) {
			await PwActions.fill(this.page, this.inputClusterName, clusterName);
		}
		if (groupHeadTitle) {
			await PwActions.fill(
				this.page,
				this.inputClusterHeadTitle,
				groupHeadTitle,
			);
		}

		const isSaveClusterDisabled = await PwActions.elementIsVisible(
			this.page,
			this.btnDisabledSaveCluster,
		);
		const isSaveAndAddGroupDisabled = await PwActions.elementIsVisible(
			this.page,
			this.btnDisabledSaveAndAddGroup,
		);
		let buttonsDisabled = isSaveClusterDisabled || isSaveAndAddGroupDisabled;
		if (!buttonsDisabled) {
			await PwActions.click(this.page, this.btnSaveCluster);
			await PwActions.waitTillVisible(this.page, this.toasterDuplicateName);
			buttonsDisabled = true;
		}
		await PwActions.click(this.page, this.btnModalClose);
		return buttonsDisabled;
	}

	/**
	 * Opens an employee's profile by clicking on their row in the employees list
	 *
	 * @param {string} employeeName - Name of the employee
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await clustersPage.openEmployeeProfile("Lucas Hawk");
	 */
	async openEmployeeProfile(employeeName) {
		const employeeRow = this.employeesPage.employeeRow(employeeName);
		await PwActions.click(this.page, employeeRow);
		await PwActions.waitForNetworkIdle(this.page);
	}

	/**
	 * Verifies if an employee exists in the employees list
	 *
	 * @param {string} employeeName - Name of the employee
	 * @returns {Promise<boolean>} True if employee exists
	 *
	 * @example
	 * const exists = await clustersPage.verifyEmployeeInList("Lucas Hawk");
	 */
	async verifyEmployeeInList(employeeName) {
		const employeeRow = this.employeesPage.employeeRow(employeeName);
		await CommonUtils.sleep(2);
		return await PwActions.elementIsVisible(this.page, employeeRow);
	}

	/**
	 * Attempts to create a group with validation - used for testing empty names
	 *
	 * @param {Object} options - Group creation options
	 * @param {string} [options.groupName=""] - Name of the group
	 * @returns {Promise<boolean>} True if dialog is still open (validation failed)
	 *
	 * @example
	 * const validationFailed = await clustersPage.attemptCreateGroupWithValidation({ groupName: "" });
	 */
	async attemptCreateGroupWithValidation({ clusterName, groupName = "" } = {}) {
		await PwActions.click(this.page, this.btnCreateNew);
		await PwActions.click(this.page, this.menuItemCreateGroup);
		await PwActions.click(this.page, this.inputChooseCluster);
		await PwActions.fill(this.page, this.inputChooseCluster, clusterName);
		await CommonUtils.sleep(1);
		await PwActions.click(this.page, this.getDropdownOption(clusterName));
		const isSaveGroupDisabled = await PwActions.elementIsVisible(
			this.page,
			this.btnDisabledSaveGroup,
		);
		if (groupName) {
			await PwActions.click(this.page, this.inputGroupName);
			await PwActions.fill(this.page, this.inputGroupName, groupName);
			await PwActions.click(this.page, this.btnSaveGroup);
			await PwActions.waitTillVisible(this.page, this.toasterDuplicateName);
			return true;
		}
		return isSaveGroupDisabled;
	}

	async createGroupsInCluster(groupsData) {
		for (const group of groupsData) {
			await PwActions.click(this.page, this.btnCreateNew);
			await PwActions.click(this.page, this.menuItemCreateGroup);
			await PwActions.click(this.page, this.inputChooseCluster);
			await PwActions.fill(this.page, this.inputChooseCluster, group.cluster);
			await CommonUtils.sleep(1);
			await PwActions.click(this.page, this.getDropdownOption(group.cluster));
			await PwActions.click(this.page, this.inputGroupName);
			await PwActions.fill(this.page, this.inputGroupName, group.groupName);
			for (const head of group.groupHeads) {
				await PwActions.click(this.page, this.inputGroupHead);
				await PwActions.fill(this.page, this.inputGroupHead, head);
				await CommonUtils.sleep(1);
				await PwActions.click(this.page, this.getDropdownOption(head));
			}
			for (const member of group.groupMembers) {
				await PwActions.click(this.page, this.inputAddGroupMembers);
				await PwActions.fill(this.page, this.inputAddGroupMembers, member);
				await CommonUtils.sleep(1);
				await PwActions.click(this.page, this.getDropdownOption(member));
			}
			await PwActions.click(this.page, this.btnSaveGroup);
		}
	}
}

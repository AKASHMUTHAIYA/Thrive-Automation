import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../Data/Resources/constants";
import logger from "playwright-framework/Core/logger.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions";
import { envDetails } from "../../Data/test-data.js";
import { env } from "process";
import { LoginPage } from "../login-page.js";
import { expect } from "@playwright/test";
import { jiraJQL } from "../../Data/Resources/constants";
import ExternalServices from "../../Shared_Functions/external-services";

class GoalsCommon {
	constructor(page) {
		this.page = page;
		this.externalServices = new ExternalServices(page);
		this.commonfunctions = new CommonPageFunctions(page);
		this.loginpage = new LoginPage(page);
		this.btnNewGoal = `//span[text()="New Goal"]/parent::button`;
		this.btnDropDownNewGoal = `//button[span[text()="New Goal"]]/following::div[1]//button`;
		this.btnNewTask = `//p[text()="Tasks"]`;
		this.inputGoalName = `//div[@data-testid="title-input_box"]//div[@contenteditable='true']`;
		this.inputGoalDescription = `//div[@data-testid="expandable-description-wrapper_box"]//div[@contenteditable="true"]`;
		this.btnGoalOwner = `//p[text()="Owner"]/ancestor::button`;
		this.btnDueBy = `//p[text()="Due by"]/ancestor::button`;
		this.btnVisibility = `//p[text()="Visibility"]/ancestor::button`;
		this.btnCycle = `//p[text()="Cycle"]/ancestor::button`;
		this.inputOnwerDropdown = `//input[@data-testid="owner-dropdown_input"]`;
		this.getOwner = (ownerName) =>
			`//div[@data-testid="owner-dropdown_flex_item"]//p[text()='${ownerName}'] | //div[@data-testid="owner-dropdown_flex"]//p[text()='${ownerName}']`;
		this.getVisibilityDropDown = (visibility) =>
			`//div[@data-testid="visibility-dropdown_dropdown-menu-item"]//p[text()="${visibility}"]`;
		this.getCycleDropDown = (cycle) =>
			`//div[@data-testid="cycle-dropdown_dropdown-menu-item"]//p[text()="${cycle}"]`;
		this.getBtnParentGoal = (parentGoal) =>
			`//div[@data-testid="goal-row_flex"]//p[text()="${parentGoal}"]`;
		this.btnSave = `//button[@data-testid="save-and-publish-button_button_save"]`;
		this.btnSaveTask = `//button[@data-testid="create-access-control-wrapper_button_save"]`;
		this.btnPublish = `//div[@data-testid="save-and-publish-button_dropdown-menu-item_publish"]`;
		this.btnPublishTask = `//div[@data-testid="create-access-control-wrapper_dropdown-menu-item_publish"]`;
		this.btnSaveAsDraft = `//div[@data-testid="save-and-publish-button_dropdown-menu-item_save-draft"]`;
		this.btnSaveAsDraftTask = `//div[@data-testid="create-access-control-wrapper_dropdown-menu-item_save-as-draft"]`;
		this.btnAlignParent = `//button[@data-testid="align-parent_box"]`;
		this.btnAddSupportingGoal = `//button[@data-testid="add-supporting-item_text_goal"]`;
		this.btnAddSupportingTask = `//button[@data-testid="add-supporting-item_text_task"]`;
		this.inputSupportingGoalOrTaskName = `//input[@placeholder="Enter Goal or Task title..."]`;
		this.btnGoalLevelInlineCreation = `//button[@data-testid='goal-level-dropdown_button']`;
		this.getBtnGoalLevel = (goalLevel) =>
			`//div[@data-testid="goal-level-dropdown_dropdown-menu-item"]//p[text()="${goalLevel}"]`;
		this.btnDueDateEditor = `//button[@data-testid="okr-editor_icon-button_due-by-popover"]`;
		this.btnSaveButtonInlineCreator = `//button[@data-testid="okr-editor_icon-button_save"]`;
		this.btnBrowseGoalsInline = `//button[@data-testid="okr-editor_icon-button_browse-goals"]`;
		this.inputSearchGoalInsertModal = `//input[@data-testid="alignment-modal_form-input_search"]`;
		this.getGoalInInsertModal = (goalName) =>
			`//div[@data-testid="goal-row_flex"]//p[text()="${goalName}"]`;
		this.btnInsertGoal = `//button[@data-testid="alignment-modal_button_insert"]`;
		this.btnGoalOwnerInSupportingItem = `//div[@type='button'][.//span[contains(@class,"rounded-full twigs")]//img[contains(@src,"employeeprofilepictures")]]`;
		this.inputOwnerInSupportingItem = `//input[@data-testid="assign-to-popover_input"]`;
		this.getOwnerInSupportingItem = (ownerName) =>
			`//div[@role="separator"]/following-sibling::div//p[text()="${ownerName}"]`;
		this.btnNextInCalendar = `//button[@aria-label="Next"]`;
		this.btnCalendarDate = (randomNumber) =>
			`//button[text()='${randomNumber}' and not(@aria-disabled) ]`;
		this.btnSelectOnCalendar = `//span[text()="Select"]/ancestor::button`;
		this.btnGlobalSearch = `//button[@data-testid="button"][.//p[normalize-space(.)="Search Goals..."]]`;
		this.inputGlobalSearch = `//input[@data-testid="spotlight-search-modal_form-input"]`;
		this.getOptionInGlobalSearch = (value) =>
			`//p[normalize-space()="${value}"]/ancestor::div[contains(@data-testid,"spotlight-search-modal_flex_search-result")]`;
		this.txtGoalNameInSidePanel = `//h1[@data-testid="goal-editor-view_heading"]`;
		this.txtGoalOwnerName = `//p[text()="Owner"]/following-sibling::div/p`;
		this.txtTaskNameInSidePanel = `//div[@data-testid='task-tab-content_box_rich-text']`;
		this.txtGoalVisibility = `//p[text()="Visibility"]/following-sibling::div//p`;
		this.txtGoalCycle = `//p[text()="Cycle"]/following-sibling::div//p`;
		this.btnGoalLevelInSidePanel = `//button[@data-testid="box"]//p[contains(normalize-space(.),"Goal")]`;
		this.txtGoalLevel = `//div[@id="tabpanel-goal"]//button//p[contains(text(),"Goal")]`;
		this.getSupportingItemInSidePanel = (itemName) =>
			`//div[@data-testid="tabpanel-goal"]//p[text()="${itemName}"]`;
		this.getSupportingItemOwnerInSidePanel = (itemName) =>
			`//div[@data-testid="goal-and-task-row_flex"]//p[text()="${itemName}"]/parent::div/following-sibling::div//img`;
		this.tooltipOwnerName = `(//div[@data-testid="goal-and-task-row_tooltip_assignee"]//p)[2]`;
		this.btnMetricTypeInlineCreation = `//button[@data-testid="okr-editor_icon-button_metric-trigger"]`;
		this.btnParentGoal = `//button[@data-testid="align-parent_box"]`;
		this.getBtnParentGoal = (parentGoal) =>
			`//div[@data-testid="goal-row_flex"]//p[text()="${parentGoal}"]`;
		this.txtGoalParentGoal = `//p[text()="Aligned to:"]/following-sibling::div//p`;
		this.btnCloseSidePanel = `//button[@data-testid="tabs-content_icon-button"]`;
		this.btnCloseGroupSidePanel = `//button[@data-testid="group-side-panel_icon-button_close"]`;
		this.getGroupSidePanelEntityName = (entityName) =>
			`//button[@data-testid="group-side-panel_icon-button_close"]/following::p[normalize-space()="${entityName}"][1]`;
		this.btnParticipants = `//div[@data-testid="add-participants_flex"]`;
		this.inputParticipants = `//p[contains(text(),"Find by name or email")]/ancestor::div/following-sibling::div//input`;
		this.btnInviteWithRestrictionTeam =
			"//p[text()='Team']/parent::div/following-sibling::div";
		this.btnInviteWithRestrictionDepartment =
			"(//p[text()='Invited with Restrictions']/parent::div/following-sibling::div/div)[1]";
		this.chkBoxDepartmentInInviteWithRestriction = (departmentName) =>
			`//div[@data-testid="invited-with-restrictions_box"]//p[text()='${departmentName}']`;
		this.chkBoxTeamName = (teamName) =>
			`//p[text()='${teamName}']/parent::div[@data-testid="invited-with-restrictions_box"]/div`;
		this.getParticipantInList = (participantName) =>
			`//div[contains(@class,'menu-list')]//p[text()="${participantName}"]`;
		this.getParticipantrole = (participantName) =>
			`//p[text()="${participantName}"]/ancestor::div/following-sibling::div//button[@data-testid="participant-type-dropdown_button"]`;
		this.getRoleInList = (role) =>
			`//p[text()="${role}"]/ancestor::div[@data-testid="participant-type-dropdown_dropdown-menu-item"]`;
		this.txtParticipantName = (role, participantName) =>
			`//button[@data-testid="participant-type-dropdown_button"]//span[text()="${role}"]/ancestor::div//div/following-sibling::p[text()="${participantName}"]`;
		this.btnBulkDelete = `//button[@data-testid="selection-toaster_icon-button_delete"]`;
		this.btnSideBarMenu = (menuName) => `//div[text()='${menuName}']`;
		this.btnGroup = (groupName) => {
			if (groupName === "owned and shared") {
				groupName = "OWNED_AND_SHARED";
			} else if (groupName === "created") {
				groupName = "CREATED";
			}
			return `//button[@data-testid="button-group_${groupName}"]`;
		};
		this.btnListView = `//button[@data-testid="header_icon-button-LIST_VIEW"]`;
		this.btnCascadeView = `//button[@data-testid="header_icon-button-CASCADED_VIEW"]`;
		this.btnTreeView = `//button[@data-testid="header_icon-button-TREE_VIEW"]`;
		this.btnDelete = `//span[text()="Yes, Delete"]/parent::button`;
		this.btnBulkArchive = `//button[@data-testid="selection-toaster_button_archive"]`;
		this.getBtnCheckBoxForOkr = (okrName) =>
			`//p[text()="${okrName}"]/ancestor::td//button[@role='checkbox']`;
		this.getOkrInList = (okrName) => `//p[text()="${okrName}"]`;
		this.toasterArchived = (count) =>
			`//div[text()="${count} item archived successfully"]`;
		this.toasterDeleted = (count) =>
			`//div[text()="${count} item deleted successfully"]`;
		this.toasterGoalPublished = `//div[text()='Goal Published!']`;
		this.btnMetricTypeDecision = `(//p[text()="Metric:"]/parent::div/following-sibling::div//div[@class="twigs-c-PJLV twigs-c-PJLV-idhzjXW-css"]//div[contains(@class,"twigs-c-PJLV")])[1]`;
		this.btnMetricTypePercentage = `//button[@value="PERCENTAGE"]`;
		this.btnMetricTypeNumber = `//button[@value="NUMBER"]`;
		this.btnMetricTypeCurrency = `//button[@value="CURRENCY"]`;
		this.inputFromValue = `//input[@data-testid="progress-metric_input_start-value"]`;
		this.inputToValue = `//input[@data-testid="progress-metric_input_target-value"]`;
		this.btnSaveMetric = `//button[@data-testid="progress-metric_button_save"]`;
		this.dropDownCurrencyUnit = `//label[normalize-space(.)="Currency captured in:"]/ancestor::div//div//div[contains(@class,"dropdown-indicator-right")]`;
		this.inputSearchCurrencyUnit = `//label[normalize-space(.)="Currency captured in:"]//following::input[contains(@class, "twigs-select__input")][1]`;
		this.getCurrencyUnit = (currencyUnit) => `//div[text()="${currencyUnit}"]`;
		this.txtBoxQuickAdd = `//div[contains(@id,"okr-editor-box")]//input`;
		this.getAppliedFilter = (filterType, filterValue) =>
			`//p[text()="${filterType}"]/following-sibling::div//p | //p[text()="${filterType}"]/following-sibling::div//p[normalize-space()="${filterValue} & Team"]`;
		this.containerForListScroll =
			'//table[@data-testid="goal-table_table_cascading"]/parent::div';
		this.rowSelectorForListScroll =
			'//table[@data-testid="goal-table_table_cascading"]//tr';
		this.btnQuickAddGoal = `//span[@data-testid="components_text_add-goal"]`;
		this.btnQuickAddTask = `//span[@data-testid="components_text_add-task"]`;
		this.btntypeSelector = `//div[contains(@id,"okr-editor-box")]//button[contains(@class, "default-focus-outline")]`;
		this.getBtnTypeSelector = (type) =>
			`//div[text()="Change"]/parent::div//following-sibling::div[@role="menuitem"]//p[text()="${type}"]`;
		this.btnVisibilityInline = `(//button[@data-testid="goal-level-dropdown_button"]/parent::div/following-sibling::div)[3]`;
		this.getVisibilityDropDownInline = (visibility) =>
			`//p[text()="${visibility}"]/ancestor::div[@role="menuitem"]`;
		this.btnPublishQuickAdd = `//button[@data-testid="header_button_publish"]`;
		this.btnCycleSelectorInCalendar = `//p[text()="Y 2025"]/parent::div/parent::button`;
		this.getCycleSelectorInCalendar = (cycle) =>
			`//div[contains(@data-testid,"due-by-popover_dropdown-menu-item_goal-cycle")]//p[text()="${cycle}"]`;
		this.btnAlignParentInlineEditor =
			'//button[@data-testid="okr-editor_button_parent-alignment"]';
		this.txtInputSearchGoalInsertModalInlineEditor = `//input[@data-testid='alignment-modal_form-input_search']`;
		this.toasterPageRefresh = `//div[@data-testid="refresh-toaster_flex"]`;
		this.btnRefreshPageOnToaster = `//button[@data-testid="refresh-toaster_button_refresh"]`;
		this.btnPostCommentBox = `//div[@id="custom-editor-comment-main-post-avatar"]`;
		this.inputCommentBox = `//div[@id="custom-editor-comment-main-post-avatar"]//div[@contenteditable="true"]`;
		this.getMentionedUser = (userName) =>
			`//div[@aria-label="Typeahead menu"]//div//p[text()="${userName}"]`;
		this.toasterCommentPosted = `//div[text()="Comment has been created!"]`;
		this.getCommentInList = (comment) =>
			`//div[contains(@id,"comment")]//span[normalize-space()="${comment}"]`;
		this.btnReplyComment = `(//div[contains(@class,"show_comment_row_icons")]//button)[1]`;
		this.btnReactComment = `(//div[contains(@class,"show_comment_row_icons")]//button)[2]`;
		this.btnMoreOptionsComment = `(//div[contains(@class,"show_comment_row_icons")]//button)[3]`;
		this.inputCommentBoxReplyOnEdit = `(//div[contains(@class,"avatar-editor-container")]//div[@contenteditable="true"])[2]`;
		this.btnPostComment = `//span[text()="Post"]/parent::button`;
		this.getMentionedUserInComment = (commmentMessage, mentionedUser) =>
			`//span[normalize-space()="${commmentMessage}"]/following-sibling::span[contains(@class,"thrive-mention") and text()="@${mentionedUser}"]`;
		this.toasterCommentEdited = `//div[text()="Comment has been updated!"]`;
		this.btnAddAsWatcher = `//span[normalize-space(.)="Add as watcher?"]`;
		this.getAppliedFilter = (filterType, filterValue) =>
			`//p[text()="${filterType}"]/following-sibling::div//p | //p[text()="${filterType}"]/following-sibling::div//p[normalize-space()="${filterValue} & Team"]`;
		this.containerForListScroll =
			'//table[@data-testid="goal-table_table_cascading"]/parent::div';
		this.rowSelectorForListScroll =
			'//table[@data-testid="goal-table_table_cascading"]//tr';
		this.tabActivity = `//div[contains(@data-testid,"tab-activity")]`;
		this.tabPanelActivity = `//div[contains(@id,"tabpanel-activity")]`;
		this.activityLogEntry = `//div[contains(@id,"tabpanel-activity")]//div[@data-testid="box" and contains(@class,"twigs-c-PJLV-ihujtI-css")]`;
		this.groupedLogExpandButton = (summaryText) =>
			`//div[@data-testid="grouped-item_flex" and contains(normalize-space(@aria-label), normalize-space("${summaryText}"))]`;
		this.expandedGroupedItems = (parentSummaryText) =>
			`//div[@data-testid="grouped-item_flex" and contains(@aria-label,"${parentSummaryText}")]/following-sibling::div/div`;
		this.btnExpandGoalInLine = (goalName) =>
			`//p[normalize-space()="${goalName}"]/preceding-sibling::div//button[contains(@data-testid,"title-wrapper_chevron")]`;
		this.btnAddGoalInline = `//button[@data-testid="inline-add-row_text_goal"]`;
		this.btnAddTaskInline = `//button[@data-testid="inline-add-row_text_task"]`;
		this.txtBoxActiveInputLine = `//table[@data-testid="goal-table_table_cascading"]//input`;
		this.goalTitle = `//h1[@data-testid="goal-editor-view_heading"]`;
		this.btnSelfAssignMenuItem = `//div[@data-testid="owner-dropdown_flex"]`;
		this.btnMoreOptionforActiveEditor = `//div[contains(@id,"okr-editor-box")]//button[@aria-label="More Options"]`;
		this.btnExpandQuickAdd = `//button[@data-testid="header_icon-button_expand-shrink"]`;
		this.btnAddAnotherItem = `//div[contains(@data-testid,"add-another-btn")]`;
		this.btnStatusSidePanel = `//div[contains(@class,"status-indicator")]//p`;
		this.webElementsForStatusSidePanel = `//p[text()="STATUS"]/parent::div/following-sibling::div//p`;
		this.btnUpdatePencilButtonForOkrs = (itemName) =>
			`//p[text()="${itemName}"]/ancestor::td/following-sibling::td//button[@data-testid="okr-progress_icon-button"] | //p[text()="${itemName}"]/ancestor::div[@data-testid="goal-and-task-row_flex"]//button[@data-testid="okr-progress_icon-button"]`;
		this.btnMarkAsDone = `//button[@data-testid="decision-status-button_button"]`;
		this.webElementsForProgressStatusPopover = `//button[@data-testid="progress-status-popover_button_status"]`;
		this.txtInputCurrentValue = `//input[@data-testid="progress-status-popover_form-input"]`;
		this.btnStatusPopOverDone = `//button[@data-testid="progress-status-popover_button_done"]`;
		this.txtSupportingItemProgress = (itemName) =>
			`//div[@data-testid="goal-and-task-row_flex"][.//p[text()="${itemName}"]]//p[@data-testid="text" and contains(normalize-space(.), '%')]`;
		this.txtSupportingItemStatus = (itemName) =>
			`//p[@data-testid="goal-and-task-row_ellipsis-text" and normalize-space(text())="${itemName}"]/ancestor::div[@data-testid="goal-and-task-row_flex"]//p[@data-testid="text" and (normalize-space(text())="Not Started" or normalize-space(text())="On Track" or normalize-space(text())="At Risk" or normalize-space(text())="Completed" or normalize-space(text())="Delayed")]`;
		this.btnTxtGoalProgress = `//button[@data-testid="goal-editor-view_button_progression"]//p`;
		this.btnUpdatePencilButtonForOkrsInListing = (itemName) =>
			`//p[text()="${itemName}"]/ancestor::tr//td//button[@data-testid="okr-progress_icon-button"]`;
		this.dropDownForStatusInBulkCheckIn = (itemName) =>
			`//p[text()="${itemName}"]/preceding-sibling::button[@data-testid="bulk-check-in_button_status"]`;
		this.btnMarkAsDoneInBulkCheckIn = (itemName) =>
			`//p[text()="${itemName}"]/parent::div/following-sibling::button[@data-testid="decision-status-button_button"]`;
		this.inputCurrentValueInBulkCheckIn = (itemName) =>
			`//p[text()="${itemName}"]/parent::div/following-sibling::div//input[@data-testid="bulk-check-in-metric-input_input"]`;
		this.btnCheckInSidePanel = `//span[normalize-space(.)="Check In"]`;
		this.webElementsForStatusInBulkCheckIn = `//div[@role="menuitem"]//p`;
		this.btnUpdateCheckIn = `//button[@data-testid="bulk-check-in_button_update"]`;
		this.btnCheckInForOkrInListing = `//button[@data-testid="progress-status-popover_text_check-in"]`;
		this.txtStatusForOkrInListing = (itemName) =>
			`//p[text()="${itemName}"]/ancestor::td/following-sibling::td//button[@data-testid="okr-progress_icon-button"]/preceding-sibling::div//p[normalize-space(.)="Not Started" or normalize-space(.)="On Track" or normalize-space(.)="Delayed" or normalize-space(.)="At Risk" or normalize-space(.)="Completed"]`;
		this.btnGoalActionsDropdown = `//button[@data-testid="goal-actions-dropdown_dropdown-menu-trigger"]`;
		this.btnDeleteGoalMenuItem = `//div[@data-testid="goal-actions-dropdown_dropdown-menu-item" and text()="Delete Goal"]`;
		this.btnSendReminderMenuItem = `//div[@data-testid="goal-actions-dropdown_dropdown-menu-item" and text()="Send Reminder"]`;
		this.btnArchiveGoalMenuItem = `//div[@data-testid="goal-actions-dropdown_dropdown-menu-item" and text()="Archive Goal"]`;
		this.toasterGoalDeleted = `//div[text()="Goal deleted successfully"]`;
		this.toasterReminderSent = `//div[text()="Reminder sent successfully!"]`;
		this.toasterGoalArchived = `//div[text()="Goal archived successfully"]`;
		this.btnGoalLevelSelector = `//button[contains(@aria-label,"Select GOAL level")]`;
		this.btnGoalLevelDropdownItem = `//div[@data-testid="goal-level-dropdown_dropdown-menu-item"]`;
		this.btnOkrStatusInSidePanel = `//div[@id="tabpanel-goal"]//p[text()="Not Started"]/ancestor::button`;
		this.btnOkrStatusDropdownValue = `//div[@role="menuitem"]//p[text()="On Track"]`;
		this.inputTaskTitleInlineEditor = `//input[@data-testid='okr-title-editor_input']`;
		this.btnSaveInlineEditor = `//button[@data-testid="okr-editor_icon-button_save"]`;
		this.btnGoalParticipantsDropdownItem = (participantName) =>
			`//div[contains(@class,'menu-list')]//p[text()="${participantName}"]`;
		this.btnMetricTypeInSidePanel = `//p[normalize-space(text())='Measured In']/following-sibling::div//button`;
		this.btnDecisionMetricType = `//p[normalize-space(text())='Decision']/ancestor::div[@role='menuitem']`;
		this.btnNumberMetricType = `//p[normalize-space(text())='Number']/ancestor::div[@role='menuitem']`;
		this.btnPercentageMetricType = `//p[normalize-space(text())='Percentage']/ancestor::div[@role='menuitem']`;
		this.btnCurrencyMetricType = `//p[normalize-space(text())='Currency']/ancestor::div[@role='menuitem']`;
		this.btnAddInitiative = `//span[normalize-space(text())='Add Initiative']`;
		this.txtInitiative = (row) => `//input[@id="initiative-input-${row}"]`;
		this.txtBoxStartValue = `//p[normalize-space(text())='Started At:']/following-sibling::div//input`;
		this.txtBoxTargetValue = `//p[normalize-space(text())='Target:']/following-sibling::div//input`;
		this.txtBoxCurrentValue = `//p[contains(text(),'Currently At:')]/parent::div//input[@data-testid="metric-input_input"]`;
		this.btnCurrencyType = `//p[contains(text(),"Started")]/following-sibling::div//div[@type="button"]`;
		this.txtBoxSearchCurrency = `//input[contains(@placeholder, 'Search by Country')]`;
		this.getCurrencyType = (currency) => `//p[text()="${currency}"]`;
		this.btnDraft = `//a[normalize-space(text())='Drafts']`;
		this.txtBoxSearch = `//input[@data-testid="goal-filter-wrapper_input_search"]`;
		this.getGoalFromList = (value) => `//p[text()="${value}"]/parent::div`;
		this.getFilterChipInAlignModal = (value) =>
			`//p[text()="Choose Alignment" or text()="Insert Supporting Goal"]/ancestor::div//p[text()="${value}"]`;
		this.toastGoalDrafted = `//div[text()="Goal Drafted!"]`;
		this.btnMyGoalsBreadcrumb = `//h1[@data-testid="draft-or-archived_heading_goals-view-all-published-button"]`;
		this.lblnoDraftGoalsHeading = `//h1[@data-testid="heading" and text()="No Goals in draft!"]`;
		this.btnTreeViewSearch = `//button[@data-testid="goal-tree-access-bar_icon-button_search"]`;
		this.inputTreeViewSearch = `//input[@data-testid="search-bar-content_input_search-bar"]`;
		this.getGoalFromTreeView = (value) =>
			`//button[@data-testid="goal-node_text_goal-node" and normalize-space(.)="${value}"]`;
		this.loaderTreeView = `//div[@data-testid="line-loader"]`;
		this.toastWatcherAdded = `//div[text()="Watcher added successfully"]`;
		this.btnMyTaskFilter = `//button[@data-testid="components_switch_listing-show-only-my-tasks"]`;
		this.taskIcon = `//*[name()='path' and starts-with(@d, 'M13.3184 5.32951')]`;
		this.goalIcon = `//*[name()='path' and starts-with(@d, 'M9.82097 2.84961')]`;
		this.goalownerprofileicon = `//span[contains(@class,"rounded-full")]`;
		this.btnEachGoalOwnerProfileIcon = (index) =>
			`(//span[contains(@class,"rounded-full")])[${index}]`;
		this.goalownerpopover = `//div[@data-align="center"]/div//p[normalize-space(.)="Goal Owner"]/following-sibling::p`;
		this.btnimportLogs = `//button[@data-testid="goal-filter-wrapper_icon-button_import-logs"]`;
		this.lblnoResultsInGobalSearch = `//p[text()="No results found! Try using different keywords"]`;
		this.btnAddConnections = `//p[contains(normalize-space(),"Measured In")]/parent::div/following-sibling::div`;
		this.txtSearchConnections = `//input[@data-testid="connection-list_input_search"]`;
		this.btnsearchOptions = (connectionName) =>
			`//div[@data-testid="connection-list_flex_container"]//child::p[normalize-space()="${connectionName}"]`;
		this.txtCountWorkItems = `//input[@data-testid="sync-settings_form-input_count-jql"]`;
		this.txtTotalWorkItems = `//input[@data-testid="sync-settings_form-input_total-work-items-jql"]`;
		this.btnIssueCount = `//button[@data-testid="sync-settings_radio_issue-count"]`;
		this.btnSaveSyncSettings = `//button[@data-testid="sync-settings_button_save-sync"]`;
		this.txtissuecount = (issueCount) =>
			`//input[@data-testid="sync-settings_form-input_count-jql"]/following-sibling::div/p[contains(text(),'${issueCount}')]`;
		this.btnIssueCompletion = `//button[@data-testid="sync-settings_radio_issue-completion"]`;
		this.txtTotalWorkItemCount = (totalcount) =>
			`//input[@data-testid="sync-settings_form-input_total-work-items-jql"]/following-sibling::div/p[contains(text(),'${totalcount}')]`;
		this.txtcurrentvalue = (currentvalue) =>
			currentvalue
				? `//p[contains(text(),'Currently At:')]/parent::div//input[@data-testid="metric-input_input" and @value ='${currentvalue}']`
				: `//p[contains(text(),'Currently At:')]/parent::div//input[@data-testid="metric-input_input"]`;
		this.txtTaskNameInSidePanel = `//div[@data-testid="task-tab-content_box_rich-text"]`;
		this.btnTaskAlignOptions = `//p[normalize-space()='Aligned to:']/ancestor::div[2]/following-sibling::div`;
		this.btnTaskRealign = (option) =>
			`//p[text()='${option}']/parent::div[@data-testid="parent-goal-alignment_dropdown-menu-item"]`;
		this.btnMoreOptionsInTaskSidePanel = `//div[@data-testid="tabpanel-task"]//button[@aria-label="More Option"]`;
		this.btnActionInTaskSidePanel = (action) =>
			`//div[@data-testid="task-access-control-wrapper_dropdown-menu-item" and text()='${action}']`;
		this.btnTaskStatus = `//p[text()="Not Started"]/ancestor::button`;
		this.txtTaskCurrentValue = (taskName) =>
			`//p[text()="${taskName}"]/parent::div/following-sibling::div//p[text()="now at"]/following-sibling::p`;
		this.btnGoalCycleFilter = `//p[text()="Goal Cycle"]/following-sibling::button`;
		this.inputFilterValueSearch = `//input[contains(@data-testid,"filter-options-menu_input")]`;
		this.chkBoxFilterValue = (value) =>
			`//p[text()="${value}"]/preceding-sibling::div/button`;
		this.btnApplyFilter = `//button[contains(@data-testid,"filter-options-menu_apply_button")]`;
		this.btnAddFilter = `//button[@aria-label="Add Filter"]`;
		this.btnBulkStatus = `//div[@data-testid="selection-toaster_status-dropdown"]`;
		this.getBulkStatusDropDown = (status) =>
			`//div[contains(@data-testid,"status-dropdown-item")]//p[text()="${status}"]`;
		this.toasterUpdatedSucessfully = `//div[contains(text(),"items status updated successfully")]`;
		this.radioButtonPercentage = `//button[@data-testid="select-key_radio_percentage"]`;
		this.radioButtonCount = `//button[@data-testid="select-key_radio_number"]`;
		this.btnKeyOnResponse = (key) =>
			`//span[@data-testid='json-viewer_text_key' and contains(normalize-space(), '${key}')]`;
		this.txtValueForkey = (key) =>
			`//span[@data-testid='json-viewer_text_key' and contains(normalize-space(), '${key}')]//following-sibling::span[@data-testid="json-viewer_text_number-value"]`;
		this.txtBoxInputPartKey = `//label[text()="Part Data key"]/ancestor::div/input`;
		this.txtBoxInputTotalDataKey = `//label[text()="Total Data key"]/ancestor::div/input`;
		this.btnSaveButtonForCustomConnector = `//button[@data-testid="select-key_button_save-sync"]`;
		this.dropDownDataSourceForTask =
			'//button[@data-testid="key-result-data-source_icon-button_chevron-down"]';
		this.btnEditDataSourceForTask =
			'//button[@data-testid="existing-data-source_icon-button_edit"]';
		this.btnUnlinkDataSourceForTask =
			'//button[@data-testid="existing-data-source_icon-button_unlink"]';
		this.btnYesRemoveConnection = '//span[text()="Yes, Remove"]/parent::button';
		this.btnExpandParentChildRelationShip = (parentGoalName) =>
			`//p[text()="${parentGoalName}"]/preceding-sibling::div//button`;
		this.toasterBulkStatusChanged = (totalItems) =>
			`//div[text()="${totalItems} items status updated successfully"]`;
		this.toasterBulkStatusChangeError = `//div[text()="Cannot update status of Tasks for completed Goal"]`;
		this.txtModalRestriction = '//p[text()="Status Update Restriction"]';
		this.btnCancelButtonInModalRestriction =
			'//button[@data-testid="bulk-operation-permission-error-modal_button_cancel"]';
		this.btnCloseBulkSelection =
			'//button[@data-testid="selection-toaster_icon-button_close"]';
		this.btnMoreOptionForGoalInListing = (goalName) =>
			`//p[text()="${goalName}"]/ancestor::tr//td//button[@data-testid="more-options-wrapper_icon-button"]`;
		this.btnYesProceed = `//span[text()="Yes, Proceed"]/parent::button`;
		this.btnOptionsInMoreOptions = (option) => `//div[text()="${option}"]`;
		this.btnCycleFilterInSidePanel =
			'//div[@data-testid="tabpanel-goals"]//p[text()="Goal Cycle"]/following-sibling::button';
		this.btnAddFilterInSidePanel = `//div[@data-testid="tabpanel-goals"]//button[@aria-label="Add Filter"]`;
		this.txtNoGoalsFoundInSidePanel = '//h1[text()="No Goals found"]';
		this.btnCloseGroupSidePanel =
			'//button[@data-testid="group-side-panel_icon-button_close"]';
		this.dropdownGroupBy = '//p[text()="Group by"]/following-sibling::button';
		this.getGroupSidePanelEntityInListing = (entityName) =>
			`//div[contains(@data-testid,"group-header")]//p[text()="${entityName}"]`;
		this.txtSidePanelValues = (value) =>
			`//p[text()="${value}"]/parent::div//p[@data-testid="group-details_ellipsis-text"]`;
		this.txtCountTotalDepartmentMembers = (count) =>
			`//p[text()="Total Department Members: ${count}"]`;
		this.btnDepartmentOrTeamMembers =
			'//p[text()="Department members"]/following-sibling::div | //p[text()="Team members"]/following-sibling::div';
		this.txtDepartmentOrTeamMember = (member) =>
			`//div[@data-testid="employee-list-modal_dialog-content"]//p[text()="${member}"]`;
		this.btnSectionInSidePanel = (sectionName) =>
			`//button[text()="${sectionName}"]`;
		this.btnSidepanelGoalsTab = (tabLabel) => `//button[text()="${tabLabel}"]`;
		this.getEntityGroupInSidePanel = (entityName) =>
			`//div[contains(@data-testid,"group-header")]//p[text()="${entityName}"]`;
		this.txtGoalInSidePanel = (goalName) =>
			`//div[@data-testid="tabpanel-goals"]//p[text()="${goalName}"]`;
		this.btnCloseEmployeeListModal =
			'//button[@data-testid="employee-list-modal_icon-button"]';
		this.txtAlignedGoalsTasksEmployeeName = (employeeName) =>
			`(//p[contains(text(),'Goals Aligned')]//parent::div//p[text()='${employeeName}']//ancestor::div[3]//p)[1]`;
		this.txtAlignedGoalsCount = (employeeName) =>
			`(//p[contains(text(),'Goals Aligned')]//parent::div//p[text()='${employeeName}']//ancestor::div[3]//p)[2]`;
		this.txtAlignedTasksCount = (employeeName) =>
			`(//p[contains(text(),'Goals Aligned')]//parent::div//p[text()='${employeeName}']//ancestor::div[3]//p)[3]`;
		this.btnAlignedGoalsModalClose =
			'//button[@data-testid="aligned-okr-list-modal_icon-button"]';
		this.btnAlignedTasksModalClose =
			'//button[@data-testid="tasks-list-modal_icon-button"]';
		this.txtAlignedGoalNameInsideModal = (goalName) =>
			`//div[@data-testid="aligned-okr-list-modal_dialog-content"]//p[text()="${goalName}"]`;
		this.txtAlignedTaskNameInsideModal = (taskName) =>
			`//div[@data-testid="tasks-list-modal_dialog-content"]//p[text()="${taskName}"]`;
	}

	/**
	 * Returns the goal permission element access map with actions
	 * @returns {Object} The permission element access map with selectors and actions
	 * @example
	 * const accessMap = goalsCommonPage.getGoalPermissionElementAccessMap();
	 * const action = accessMap['goalName'].actions['canEdit'];
	 * await action(page, 'New Goal Name');
	 *
	 * // Example return structure:
	 * {
	 *   goalName: {
	 *     actions: {
	 *       canEdit: async (page, value) => { ... },
	 *       "canView || canUpdate": async (page) => { ... }
	 *     }
	 *   },
	 *   goalDescription: {
	 *     actions: {
	 *       canEdit: async (page, value) => { ... },
	 *       "canView || canUpdate": async (page) => { ... }
	 *     }
	 *   },
	 *   goalOwner: {
	 *     actions: {
	 *       canEdit: async (page, owner = null) => { ... },
	 *       "canView || canUpdate": async (page) => { ... }
	 *     }
	 *   },
	 *   dueBy: { actions: { ... } },
	 *   visibility: { actions: { ... } },
	 *   cycle: { actions: { ... } },
	 *   alignParent: { actions: { ... } },
	 *   okrStatus: { actions: { ... } },
	 *   deleteGoal: { actions: { ... } },
	 *   sendReminder: { actions: { ... } },
	 *   goalLevel: { actions: { ... } },
	 *   archiveGoal: { actions: { ... } },
	 *   task: { actions: { ... } },
	 *   goalParticipants: { actions: { ... } }
	 * }
	 */
	getGoalPermissionElementAccessMap() {
		return {
			goalName: {
				actions: {
					canEdit: async (page, value) => {
						await PwActions.click(page, this.txtGoalNameInSidePanel);
						await PwActions.fill(page, this.inputGoalName, value);
						return true;
					},
					"canView || canUpdate": async (page) => {
						await PwActions.click(page, this.txtGoalNameInSidePanel);
						return !(await PwActions.elementIsVisible(
							page,
							this.inputGoalName,
						));
					},
				},
			},
			goalDescription: {
				actions: {
					canEdit: async (page, value) => {
						await PwActions.fill(page, this.inputGoalDescription, value);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.inputGoalDescription,
						));
					},
				},
			},
			goalOwner: {
				actions: {
					canEdit: async (page, owner = null) => {
						await PwActions.click(page, this.btnGoalOwner);
						await PwActions.elementIsVisible(page, this.inputOnwerDropdown);
						if (owner) {
							await PwActions.fill(page, this.inputOnwerDropdown, owner);
							await PwActions.click(page, this.getOwner(owner));
						} else {
							await PwActions.click(page, this.btnSelfAssignMenuItem);
						}
						return true;
					},
					"canView || canUpdate": async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnGoalOwner,
						);
					},
				},
			},
			dueBy: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnDueBy);
						const randomClicks = Math.ceil(Math.random() * 3);
						for (let i = 0; i < randomClicks; i++) {
							await PwActions.click(page, this.btnNextInCalendar);
						}
						const randomNumber = Math.ceil(Math.random() * 28);
						await PwActions.click(page, this.btnCalendarDate(randomNumber));
						await PwActions.click(page, this.btnSelectOnCalendar);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnDueBy,
						);
					},
				},
			},
			visibility: {
				actions: {
					canEdit: async (page, option = "Public") => {
						await PwActions.click(page, this.btnVisibility);
						await PwActions.click(page, this.getVisibilityDropDown(option));
						return true;
					},
					"canView || canUpdate": async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnVisibility,
						);
					},
				},
			},
			cycle: {
				actions: {
					canEdit: async (page, option) => {
						await PwActions.click(page, this.btnCycle);
						await PwActions.click(page, this.getCycleDropDown(option));
						return true;
					},
					"canView || canUpdate": async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnCycle,
						);
					},
				},
			},
			alignParent: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnAlignParent);
						await PwActions.click(
							page,
							`(//div[@data-testid="goal-row_flex"])[1]`,
						);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnAlignParent,
						));
					},
				},
			},
			okrStatus: {
				actions: {
					"canEdit || canUpdate": async (page) => {
						await PwActions.click(page, this.btnOkrStatusInSidePanel);
						await PwActions.click(page, this.btnOkrStatusDropdownValue);
						return true;
					},
					canView: async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnOkrStatusInSidePanel,
						);
					},
				},
			},
			deleteGoal: {
				actions: {
					canDelete: async (page) => {
						await PwActions.click(page, this.btnGoalActionsDropdown);
						await PwActions.click(page, this.btnDeleteGoalMenuItem);
						await PwActions.click(page, this.btnDelete);
						await PwActions.waitForElementVisibility(
							page,
							this.toasterGoalDeleted,
						);
						return true;
					},
					"canView || canEdit || canUpdate || canDelete": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnGoalActionsDropdown,
						));
					},
				},
			},
			sendReminder: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnGoalActionsDropdown);
						await PwActions.click(page, this.btnSendReminderMenuItem);
						await PwActions.waitForElementVisibility(
							page,
							this.toasterReminderSent,
						);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnGoalActionsDropdown,
						));
					},
				},
			},
			goalLevel: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnGoalLevelSelector);
						const randomLevel = CommonUtils.getRandomElement(
							await PwActions.getWebElements(
								page,
								this.btnGoalLevelDropdownItem,
							),
						);
						await randomLevel.click();
						return true;
					},
					"canView || canUpdate": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnGoalLevelSelector,
						));
					},
				},
			},
			archiveGoal: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnGoalActionsDropdown);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnGoalActionsDropdown,
						));
					},
				},
			},
			task: {
				actions: {
					"canEdit || canUpdate": async (page) => {
						await PwActions.click(page, this.btnAddSupportingTask);
						await PwActions.fill(
							page,
							this.inputTaskTitleInlineEditor,
							"Test Task",
						);
						await PwActions.click(page, this.btnSaveInlineEditor);
						return true;
					},
					canView: async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnAddSupportingTask,
						));
					},
				},
			},
			goalParticipants: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnParticipants);
						await PwActions.fill(
							page,
							this.inputParticipants,
							"Subject Automation 1",
						);
						await PwActions.click(
							page,
							this.btnGoalParticipantsDropdownItem("Subject Automation 1"),
						);
						return true;
					},
					"canView || canUpdate": async (page) => {
						await PwActions.click(page, this.btnParticipants);
						return !(await PwActions.elementIsVisible(
							page,
							this.inputParticipants,
						));
					},
				},
			},
		};
	}

	/**
	 * Returns the task permission element access map with actions
	 * @returns {Object} The permission element access map with selectors and actions for tasks
	 * @example
	 * const accessMap = goalsCommonPage.getTaskPermissionElementAccessMap();
	 * const action = accessMap['taskName'].actions['canEdit'];
	 * await action(page, 'New Task Name');
	 *
	 * // Example return structure:
	 * {
	 *   taskName: {
	 *     actions: {
	 *       canEdit: async (page, value) => { ... },
	 *       "canView || canUpdate": async (page) => { ... }
	 *     }
	 *   },
	 *   taskDescription: {
	 *     actions: {
	 *       canEdit: async (page, value) => { ... },
	 *       "canView || canUpdate": async (page) => { ... }
	 *     }
	 *   },
	 *   taskOwner: {
	 *     actions: {
	 *       canEdit: async (page, owner = null) => { ... },
	 *       "canView || canUpdate": async (page) => { ... }
	 *     }
	 *   },
	 *   dueBy: { actions: { ... } },
	 *   visibility: { actions: { ... } },
	 *   cycle: { actions: { ... } },
	 *   metric: {
	 *     actions: {
	 *       canEdit: async (page, option = "Number") => { ... },
	 *       canView: async (page, option = "Number") => { ... },
	 *       canUpdate: async (page, option = "Number") => { ... }
	 *     }
	 *   },
	 *   alignParent: { actions: { ... } },
	 *   taskStatus: {
	 *     actions: {
	 *       "canEdit || canUpdate": async (page) => { ... },
	 *       canView: async (page) => { ... }
	 *     }
	 *   },
	 *   taskParticipants: { actions: { ... } },
	 *   taskInitiative: {
	 *     actions: {
	 *       "canEdit || canUpdate": async (page) => { ... },
	 *       canView: async (page) => { ... }
	 *     }
	 *   },
	 *   taskIntegration: {
	 *     actions: {
	 *       "canEdit || canUpdate": async (page) => { ... },
	 *       canView: async (page) => { ... }
	 *     }
	 *   },
	 *   archiveTask: { actions: { ... } },
	 *   deleteTask: {
	 *     actions: {
	 *       canDelete: async (page) => { ... },
	 *       "canView || canUpdate": async (page) => { ... }
	 *     }
	 *   }
	 * }
	 */
	getTaskPermissionElementAccessMap() {
		return {
			taskName: {
				actions: {
					canEdit: async (page, value) => {
						await PwActions.click(page, this.txtTaskNameInSidePanel);
						await PwActions.fill(page, this.inputGoalName, value);
						return true;
					},
					"canView || canUpdate": async (page) => {
						await PwActions.click(page, this.txtTaskNameInSidePanel);
						return !(await PwActions.elementIsVisible(
							page,
							this.inputGoalName,
						));
					},
				},
			},
			taskDescription: {
				actions: {
					canEdit: async (page, value) => {
						await PwActions.fill(page, this.inputGoalDescription, value);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.inputGoalDescription,
						));
					},
				},
			},
			taskOwner: {
				actions: {
					canEdit: async (page, owner = null) => {
						await PwActions.click(page, this.btnGoalOwner);
						await PwActions.elementIsVisible(page, this.inputOnwerDropdown);
						if (owner) {
							await PwActions.fill(page, this.inputOnwerDropdown, owner);
							await PwActions.click(page, this.getOwner(owner));
						} else {
							await PwActions.click(page, this.btnSelfAssignMenuItem);
						}
						return true;
					},
					"canView || canUpdate": async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnGoalOwner,
						);
					},
				},
			},
			dueBy: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnDueBy);
						const randomClicks = Math.ceil(Math.random() * 3);
						for (let i = 0; i < randomClicks; i++) {
							await PwActions.click(page, this.btnNextInCalendar);
						}
						const randomNumber = Math.ceil(Math.random() * 28);
						await PwActions.click(page, this.btnCalendarDate(randomNumber));
						await PwActions.click(page, this.btnSelectOnCalendar);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnDueBy,
						);
					},
				},
			},
			visibility: {
				actions: {
					canEdit: async (page, option = "Public") => {
						await PwActions.click(page, this.btnVisibility);
						await PwActions.click(page, this.getVisibilityDropDown(option));
						return true;
					},
					"canView || canUpdate": async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnVisibility,
						);
					},
				},
			},
			cycle: {
				actions: {
					canEdit: async (page, option) => {
						await PwActions.click(page, this.btnCycle);
						await PwActions.click(page, this.getCycleDropDown(option));
						return true;
					},
					"canView || canUpdate": async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnCycle,
						);
					},
				},
			},
			metric: {
				actions: {
					canEdit: async (page, option = "Number") => {
						// Select metric type
						await PwActions.click(page, this.btnMetricTypeInSidePanel);
						const metricTypeMap = {
							Decision: this.btnDecisionMetricType,
							Number: this.btnNumberMetricType,
							Percentage: this.btnPercentageMetricType,
							Currency: this.btnCurrencyMetricType,
						};
						const metricType = metricTypeMap[option];
						if (metricType) {
							await PwActions.click(page, metricType);
						}

						// Handle Decision vs numeric metrics
						if (option === "Decision") {
							await PwActions.click(page, this.btnMarkAsDone);
							return true;
						}

						// Generate and fill random values for numeric metrics
						const start = Math.floor(Math.random() * 50);
						const current = start + Math.floor(Math.random() * 50) + 1;
						const target = current + Math.floor(Math.random() * 100);

						await Promise.all([
							PwActions.clearAndFill(
								page,
								this.txtBoxStartValue,
								String(start),
							),
							PwActions.clearAndFill(
								page,
								this.txtBoxCurrentValue,
								String(current),
							),
							PwActions.clearAndFill(
								page,
								this.txtBoxTargetValue,
								String(target),
							),
						]);

						return true;
					},
					canView: async (page, option = "Number") => {
						await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnMetricTypeInSidePanel,
						);

						if (option === "Decision") {
							await PwActions.isElementDisabledOrEnabled(
								page,
								this.btnMarkAsDone,
							);
							return true;
						}

						// Check all numeric metric fields
						await Promise.all([
							PwActions.isElementDisabledOrEnabled(page, this.txtBoxStartValue),
							PwActions.isElementDisabledOrEnabled(
								page,
								this.txtBoxCurrentValue,
							),
							PwActions.isElementDisabledOrEnabled(
								page,
								this.txtBoxTargetValue,
							),
						]);

						return true;
					},
					canUpdate: async (page, option = "Number") => {
						await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnMetricTypeInSidePanel,
						);

						if (option === "Decision") {
							await PwActions.click(page, this.btnMarkAsDone);
							return true;
						}

						// Check start and target fields, then update current value
						await Promise.all([
							PwActions.isElementDisabledOrEnabled(page, this.txtBoxStartValue),
							PwActions.isElementDisabledOrEnabled(
								page,
								this.txtBoxTargetValue,
							),
						]);

						// Fill current value with random number
						const randomCurrentValue = Math.floor(Math.random() * 101);
						await PwActions.clearAndFill(
							page,
							this.txtBoxCurrentValue,
							String(randomCurrentValue),
						);

						return true;
					},
				},
			},
			alignParent: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnTaskAlignOptions);
						await PwActions.click(page, this.btnTaskRealign("Re-Align"));
						await PwActions.click(
							page,
							`(//div[@data-testid="goal-row_flex"])[1]`,
						);
						return true;
					},
					"canView || canUpdate": async (page) => {
						await PwActions.click(page, this.btnTaskAlignOptions);
						const isvisible = !(await PwActions.elementIsVisible(
							page,
							this.btnTaskRealign("Re-Align"),
						));
						await PwActions.forceClick(page, this.btnTaskAlignOptions);
						return isvisible;
					},
				},
			},
			taskStatus: {
				actions: {
					"canEdit || canUpdate": async (page) => {
						await PwActions.click(page, this.btnTaskStatus);
						await PwActions.click(page, this.btnOkrStatusDropdownValue);
						return true;
					},
					canView: async (page) => {
						return await PwActions.isElementDisabledOrEnabled(
							page,
							this.btnTaskStatus,
						);
					},
				},
			},
			deleteTask: {
				actions: {
					canDelete: async (page) => {
						await PwActions.click(page, this.btnMoreOptionsInTaskSidePanel);
						await PwActions.click(
							page,
							this.btnActionInTaskSidePanel("Delete Task"),
						);
						await PwActions.click(page, this.btnDelete);
						await PwActions.waitForElementVisibility(
							page,
							this.toasterGoalDeleted,
						);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnMoreOptionsInTaskSidePanel,
						));
					},
				},
			},
			archiveTask: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnMoreOptionsInTaskSidePanel);
						await PwActions.click(
							page,
							this.btnActionInTaskSidePanel("Archive Task"),
						);
						return true;
					},
					"canView || canUpdate": async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnMoreOptionsInTaskSidePanel,
						));
					},
				},
			},
			taskParticipants: {
				actions: {
					canEdit: async (page) => {
						await PwActions.click(page, this.btnParticipants);
						await PwActions.fill(
							page,
							this.inputParticipants,
							"Subject Automation 1",
						);
						await PwActions.click(
							page,
							this.btnGoalParticipantsDropdownItem("Subject Automation 1"),
						);
						return true;
					},
					"canView || canUpdate": async (page) => {
						await PwActions.click(page, this.btnParticipants);
						return !(await PwActions.elementIsVisible(
							page,
							this.inputParticipants,
						));
					},
				},
			},
			taskInitiative: {
				actions: {
					"canEdit || canUpdate": async (page) => {
						await PwActions.click(page, this.btnAddInitiative);
						const randomInitiative = `Initiative ${Math.floor(Math.random() * 1000)}`;
						await PwActions.fill(page, this.txtInitiative(0), randomInitiative);
						await PwActions.press(page, "Enter");
						return true;
					},
					canView: async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnAddInitiative,
						));
					},
				},
			},
			taskIntegration: {
				actions: {
					"canEdit || canUpdate": async (page) => {
						await CommonUtils.sleep(10);
						await PwActions.waitForElementVisibility(
							page,
							this.btnAddConnections,
						);
						await PwActions.click(page, this.btnAddConnections);
						await PwActions.waitForElementVisibility(
							page,
							this.txtSearchConnections,
						);
						const firstConnection = `(//div[@data-testid="connection-list_flex_container"]//p)[1]`;
						await PwActions.waitForElementVisibility(page, firstConnection);
						await PwActions.click(page, firstConnection);
						await PwActions.click(page, this.btnIssueCount);
						await PwActions.fill(page, this.txtCountWorkItems, jiraJQL.query1);
						await CommonUtils.sleep(2);
						await PwActions.click(page, this.btnSaveSyncSettings);

						return true;
					},
					canView: async (page) => {
						return !(await PwActions.elementIsVisible(
							page,
							this.btnAddConnections,
						));
					},
				},
			},
		};
	}
	/**
	 * Creates a new goal using the side panel, filling in all provided details and supporting items.
	 *
	 * This function automates the process of creating a goal, including setting its name, description,
	 * owner, visibility, cycle, level, parent goal, supporting items (goals or tasks), and participants.
	 * It also supports saving the goal as a draft or publishing it directly.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {Object} params.goalData - The goal details.
	 * @param {string} params.goalData.goalName - The name of the goal. (Mandatory)
	 * @param {string} [params.goalData.goalDescription] - The description of the goal. (Optional)
	 * @param {string} [params.goalData.owner] - The owner of the goal. (Optional)
	 * @param {string} [params.goalData.visibility] - The visibility of the goal (e.g., "Public", "Private", "Restricted"). (Optional)
	 * @param {string} [params.goalData.cycle] - The cycle to which the goal belongs. (Optional)
	 * @param {Array<Object>} [params.goalData.supportingItem] - List of supporting items (goals or tasks) to align with. (Optional)
	 * @param {string} [params.goalData.goalLevel] - The level of the goal (e.g., "Org", "Individual"). (Optional)
	 * @param {string} [params.goalData.level] - Same as goalLevel; used by `getGoalCreatePayload()` payloads. (Optional)
	 * @param {string} [params.goalData.parentGoal] - The parent goal to align with. (Optional)
	 * @param {Array<Object>} [params.goalData.participants] - List of participants with their roles and owners. (Optional)
	 * @param {string} [params.action="publish"] - Whether to "publish" the goal or "draft" it. Defaults to "publish".
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Creating a new goal with only the mandatory field
	 * await goalsCommonPage.createGoal({
	 *   goalData: { goalName: "My New Goal" }
	 * });
	 *
	 * @example
	 * // Creating a new goal with all optional fields and saving as draft
	 * await goalsCommonPage.createGoal({
	 *   goalData: {
	 *     goalName: "My New Goal",
	 *     goalDescription: "Description here",
	 *     owner: "John Doe",
	 *     visibility: "Public",
	 *     cycle: "Test Automation Y 2024",
	 *     supportingItem: [
	 *       { type: "GOAL", title: "Support Goal", owner: "Jane Smith" }
	 *     ],
	 *     goalLevel: "Org",
	 *     parentGoal: "Company Growth 2025",
	 *     participants: [
	 *       { role: "Contributor", owner: "David Kim" },
	 *       { role: "Reviewer", owner: "Eve Miller" }
	 *     ]
	 *   },
	 *   action: "draft"
	 * });
	 */
	async createGoal({ page = this.page, goalData, action = "publish" }) {
		const {
			goalName,
			goalDescription,
			owner,
			visibility,
			cycle,
			supportingItem,
			goalLevel,
			level,
			parentGoal,
			participants,
		} = goalData;

		await CommonUtils.sleep(2);
		await PwActions.click(page, this.btnNewGoal);

		const fillIfPresent = async (selector, value) => {
			if (value) await PwActions.fill(page, selector, value);
		};

		await CommonUtils.sleep(2);
		await fillIfPresent(this.inputGoalName, goalName);
		await fillIfPresent(this.inputGoalDescription, goalDescription);

		if (owner) {
			await PwActions.click(page, this.btnGoalOwner);
			await PwActions.fill(page, this.inputOnwerDropdown, owner);
			await PwActions.click(page, this.getOwner(owner));
		}

		if (visibility) {
			await PwActions.click(page, this.btnVisibility);
			await PwActions.click(page, this.getVisibilityDropDown(visibility));
			if (visibility.toLowerCase() == "restricted") {
				await PwActions.forceClick(page, this.btnVisibility);

				if (goalData.restrictedTeam) {
					await CommonUtils.sleep(1);
					await PwActions.click(page, this.btnParticipants);
					await PwActions.click(page, this.btnInviteWithRestrictionTeam);
					await PwActions.click(
						page,
						this.chkBoxTeamName(goalData.restrictedTeam),
					);
					await PwActions.click(page, this.btnInviteWithRestrictionDepartment);
					await PwActions.click(
						page,
						this.chkBoxDepartmentInInviteWithRestriction("None"),
					);
				}
			}
		}

		if (cycle) {
			await PwActions.click(page, this.btnCycle);
			await PwActions.click(page, this.getCycleDropDown(cycle));
		}

		if (goalLevel || level) {
			await PwActions.click(page, this.btnGoalLevelInSidePanel);
			await PwActions.click(page, this.getBtnGoalLevel(goalLevel || level));
		}

		if (parentGoal) {
			await PwActions.click(page, this.btnParentGoal);
			await PwActions.click(page, this.getFilterChipInAlignModal("Goal Cycle"));
			await this.commonfunctions.getMenuItem(page, "All");
			await PwActions.fill(page, this.inputSearchGoalInsertModal, parentGoal);
			await PwActions.click(page, this.getBtnParentGoal(parentGoal));
		}

		if (Array.isArray(supportingItem) && supportingItem.length > 0) {
			for (const item of supportingItem) {
				if (item.type === "GOAL") {
					await PwActions.click(page, this.btnAddSupportingGoal);
				} else if (item.type === "TASK") {
					await PwActions.click(page, this.btnAddSupportingTask);
					await PwActions.click(page, this.btnMetricTypeInlineCreation);

					const metricTypeMap = {
						Percentage: this.btnMetricTypePercentage,
						Number: this.btnMetricTypeNumber,
						Currency: this.btnMetricTypeCurrency,
					};

					if (item.metric && metricTypeMap[item.metric]) {
						await PwActions.click(page, metricTypeMap[item.metric]);
						await PwActions.fill(
							page,
							this.inputFromValue,
							String(item.startValue),
						);
						await PwActions.fill(
							page,
							this.inputToValue,
							String(item.targetValue),
						);
					}

					if (item.unit) {
						await PwActions.forceClick(page, this.dropDownCurrencyUnit);
						await PwActions.fill(page, this.inputSearchCurrencyUnit, item.unit);
						await PwActions.jsClick(page, this.getCurrencyUnit(item.unit));
						await PwActions.forceClick(page, this.getCurrencyUnit(item.unit));
					}
					await PwActions.jsClick(page, this.btnSaveMetric);
				}

				if (item.owner) {
					await PwActions.click(page, this.btnGoalOwnerInSupportingItem);
					await PwActions.fill(
						page,
						this.inputOwnerInSupportingItem,
						item.owner,
					);
					await PwActions.click(
						page,
						this.getOwnerInSupportingItem(item.owner),
					);
				}

				if (item.toBrowse) {
					await PwActions.click(page, this.btnBrowseGoalsInline);
					await PwActions.click(
						page,
						this.getFilterChipInAlignModal("Goal Cycle"),
					);
					await this.commonfunctions.getMenuItem(page, "All");
					await PwActions.fill(
						page,
						this.inputSearchGoalInsertModal,
						item.title,
					);
					await PwActions.click(page, this.getGoalInInsertModal(item.title));
					await PwActions.click(page, this.btnInsertGoal);
				} else {
					await PwActions.fill(
						page,
						this.inputSupportingGoalOrTaskName,
						item.title,
					);
					if (item.level) {
						await PwActions.click(page, this.btnGoalLevelInlineCreation);
						await PwActions.click(page, this.getBtnGoalLevel(item.level));
					}
					await PwActions.forceClick(page, this.btnSaveButtonInlineCreator);
				}
			}
		}
		await CommonUtils.sleep(2);
		await PwActions.click(page, this.btnDueBy);
		const randomClicks = Math.ceil(Math.random() * 3);
		await Promise.all(
			Array.from({ length: randomClicks }).map(() =>
				PwActions.click(page, this.btnNextInCalendar),
			),
		);
		const randomNumber = Math.ceil(Math.random() * 28);
		await PwActions.click(page, this.btnCalendarDate(randomNumber));
		await PwActions.click(page, this.btnSelectOnCalendar);

		if (Array.isArray(participants) && participants.length > 0) {
			await PwActions.click(page, this.btnParticipants);
			for (const { owner: participantOwner, role } of participants) {
				await PwActions.fill(page, this.inputParticipants, participantOwner);
				await PwActions.click(
					page,
					this.getParticipantInList(participantOwner),
				);
				await PwActions.click(page, this.getParticipantrole(participantOwner));
				await PwActions.click(page, this.getRoleInList(role));
				await PwActions.click(page, this.inputParticipants);
			}
		}
		await PwActions.waitForNetworkIdle(page, 10000);
		await CommonUtils.sleep(2);
		await PwActions.click(page, this.btnSave);
		if (action === "publish") {
			await PwActions.click(page, this.btnPublish);
			await PwActions.waitForElementVisibility(page, this.toasterGoalPublished);
		} else {
			await PwActions.click(page, this.btnSaveAsDraft);
			await PwActions.waitForElementVisibility(page, this.toastGoalDrafted);
		}
		await CommonUtils.sleep(10);
	}

	/**
	 * Performs a global search for goal and filters.
	 *
	 * @param {string} value - The value to search for.
	 *
	 * @example
	 * Performing a global search for a goal
	 * await goalsCommonPage.globalSearch("My New Goal");
	 */
	async globalSearch({ page = this.page, value, type = "goal" }) {
		await CommonUtils.sleep(2);
		await PwActions.pageRefresh(page);
		await PwActions.waitForElement(page, this.btnGlobalSearch);
		await PwActions.click(page, this.btnGlobalSearch);
		await PwActions.fill(page, this.inputGlobalSearch, value);
		if (type === "team") {
			await PwActions.waitForElement(
				page,
				this.getOptionInGlobalSearch(value + "'s Team"),
			);
			await PwActions.click(
				page,
				this.getOptionInGlobalSearch(value + "'s Team"),
			);
		} else {
			await PwActions.waitForElement(page, this.getOptionInGlobalSearch(value));
			await PwActions.click(page, this.getOptionInGlobalSearch(value));
		}
	}
	/**
	 * Verifies if a goal or item is visible in the global search functionality.
	 *
	 * This function performs a global search for a specific value and checks if it appears
	 * in the search results. It's commonly used to verify visibility permissions and search
	 * functionality for goals and other items.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {string} params.value - The search term/value to look for in global search.
	 * @param {string} [params.type="goal"] - The type of item being searched (e.g., "goal", "task"). Defaults to "goal".
	 * @returns {Promise<boolean>} Returns true if the item is found in search results, false if not found or search is empty.
	 *
	 * @example
	 * // Verify if a goal is visible in global search
	 * const isVisible = await goalsCommonPage.verifyGlobalSearch({
	 *   value: "My Goal Name"
	 * });
	 *
	 * @example
	 * // Verify if a goal is visible in global search on a specific page
	 * const isVisible = await goalsCommonPage.verifyGlobalSearch({
	 *   page: customPage,
	 *   value: "My Goal Name",
	 *   type: "goal"
	 * });
	 *
	 * @example
	 * // Verify if a task is visible in global search
	 * const isVisible = await goalsCommonPage.verifyGlobalSearch({
	 *   value: "My Task Name",
	 *   type: "task"
	 * });
	 */
	async verifyGlobalSearch({ page = this.page, value, type = "goal" }) {
		await PwActions.pageRefresh(page);
		await PwActions.waitForElement(page, this.btnGlobalSearch);
		await PwActions.click(page, this.btnGlobalSearch);
		await PwActions.fill(page, this.inputGlobalSearch, value);
		await PwActions.waitForElement(page, this.lblnoResultsInGobalSearch);
		const isEmpty = await PwActions.elementIsVisible(
			page,
			this.lblnoResultsInGobalSearch,
		);
		if (isEmpty) {
			return false;
		}
		return true;
	}
	/**
	 * Verifies the details of a goal.
	 *
	 * @param {Object} goalData - The goal details.
	 * @param {string} goalData.goalName - The name of the goal. (Mandatory)
	 * @param {string} [goalData.goalDescription] - The description of the goal. (Optional)
	 * @param {string} [goalData.owner] - The owner of the goal. (Optional)
	 * @param {string} [goalData.visibility] - The visibility of the goal (e.g., "Public", "Private", "Restricted"). (Optional)
	 * @param {string} [goalData.cycle] - The cycle to which the goal belongs. (Optional)
	 * @param {string} [goalData.goalLevel] - The level of the goal (e.g., "Org", "Individual"). (Optional)
	 * @param {Array<Object>} [goalData.supportingItem] - List of supporting items (goals or tasks) to align with. (Optional)
	 * @param {Array<Object>} [goalData.participants] - List of participants with their roles and owners. (Optional)
	 * @param {string} [goalData.parentGoal] - The parent goal to align with. (Optional)
	 *
	 * @example
	 * // Verifying the details of a goal
	 * await goalsCommonPage.verifyGoalDetails({
	 *   goalName: "My New Goal",
	 *   goalDescription: "Description here",
	 *   owner: "John Doe",
	 *   visibility: "Public",
	 *   cycle: "Test Automation Y 2024",
	 *   goalLevel: "Org",
	 *   supportingItem: [
	 *     { type: "GOAL", title: "Support Goal", owner: "Jane Smith" }
	 *   ],
	 *   participants: [
	 *     { role: "Manager", owner: "Manager Name" }
	 *   ],
	 *   parentGoal: "Parent Goal Name"
	 * });
	 */
	async verifyGoalDetails(goalData, state = "published") {
		const {
			goalName,
			goalDescription,
			owner,
			visibility,
			cycle,
			goalLevel,
			supportingItem,
			participants,
			parentGoal,
			status,
		} = goalData;

		const goalLevelMapping = {
			Org: "Org. Goal",
			Department: "Dept. Goal",
			Team: "Team Goal",
			Individual: "Indv. Goal",
		};

		const verifications = [
			[goalLevel, this.btnGoalLevelInSidePanel, goalLevelMapping],
			[goalName, this.txtGoalNameInSidePanel],
			[goalDescription, this.inputGoalDescription],
			[owner, this.txtGoalOwnerName],
			[visibility, this.txtGoalVisibility],
			[cycle, this.txtGoalCycle],
			[parentGoal, this.txtGoalParentGoal],
		];

		// Status verification only for published goals
		if (state === "published" && status) {
			verifications.push([status, this.btnStatusSidePanel]);
		}

		const performVerification = async () => {
			for (const [value, locator, mapping] of verifications) {
				if (value) {
					let expected = mapping ? mapping[value] : value;
					try {
						if (expected === "Not Started") expected = "On Track";
						await PwActions.verifyTextExpected(
							await PwActions.getText(this.page, locator),
							expected,
						);
					} catch {
						await PwActions.verifyTextExpected(
							await PwActions.getText(this.page, locator),
							"Not Started",
						);
					}
				}
			}

			// Only perform progress-related checks for published goals
			if (state === "published") {
				let goalProgress = 0;
				const hasSupportingItems =
					supportingItem &&
					Array.isArray(supportingItem) &&
					supportingItem.length > 0;

				if (hasSupportingItems) {
					for (const item of supportingItem) {
						if (item?.title) {
							await PwActions.verifyElementIsPresent(
								this.page,
								this.getSupportingItemInSidePanel(item.title),
							);
						}

						logger.info(
							"Verifying The Current Value of the Supporting Item for the Item: ",
							item.title,
						);

						const isTask = item.metric !== "Decision" && item.type !== "GOAL";
						const isGoal = item.type === "GOAL";
						if (isTask) {
							let currentValueFromUI = await PwActions.getText(
								this.page,
								this.txtTaskCurrentValue(item.title),
							);
							// Clean the UI value (remove %, any 3-letter currency/language codes, trim whitespace)
							currentValueFromUI = currentValueFromUI
								.replace(/%/g, "")
								.replace(/\b[A-Z]{3}\b/g, "")
								.trim();
							const parsedCurrentValue =
								CommonUtils.parseNumberWithSuffix(currentValueFromUI);
							if (item.metric === "Currency") {
								if (
									typeof item.currentValue === "number" &&
									item.currentValue >= 1000
								) {
									const roundedCurrentValue =
										Math.round(item.currentValue / 100) * 100;
									const roundedParsed =
										Math.round(Number(parsedCurrentValue) / 100) * 100;
									expect(roundedParsed).toBe(roundedCurrentValue);
								} else {
									expect(parsedCurrentValue).toBe(item.currentValue);
								}
							}
						} else if (isGoal) {
							const supportGoalCurrentProgress = await PwActions.getText(
								this.page,
								this.txtSupportingItemProgress(item.title),
							);
							goalProgress += CommonUtils.normalizeScore(
								supportGoalCurrentProgress,
							);
						}
						const { itemProgress: calculatedProgress, expectedProgress } =
							this.calculateSupportingItemProgress(item);
						let itemProgress = calculatedProgress;
						goalProgress += itemProgress;
						logger.info(
							`Adding to goal progress: ${itemProgress}% (Total so far: ${goalProgress}%)`,
						);

						// Supporting item status verification only in published state
						if (item?.status) {
							const statusToVerify =
								item.status === "Not Started" ? "On Track" : item.status;
							await PwActions.verifyTextExpected(
								await PwActions.getText(
									this.page,
									this.txtSupportingItemStatus(item.title),
								),
								statusToVerify,
							);
						}
					}

					logger.info(
						`Raw goal progress sum: ${goalProgress}%, Supporting items count: ${supportingItem.length}`,
					);

					const goalProgressFormatted = this.calculateGoalProgress(
						goalProgress,
						supportingItem.length,
					);
					logger.info(`Calculated goal progress: ${goalProgressFormatted}%`);

					const actualGoalProgressText = await PwActions.getText(
						this.page,
						this.btnTxtGoalProgress,
					);
					const actualGoalProgress = CommonUtils.normalizeScore(
						String(actualGoalProgressText),
					);

					logger.info(
						`Goal progress verification - Expected: ${goalProgressFormatted}%, Actual: ${actualGoalProgress}%`,
					);

					await PwActions.verifyTextExpected(
						String(goalProgressFormatted),
						String(actualGoalProgress),
					);
				}
			}

			if (
				participants &&
				Array.isArray(participants) &&
				participants.length > 0
			) {
				await PwActions.click(this.page, this.btnParticipants);
				for (const { role, owner: participantOwner } of participants) {
					await PwActions.verifyElementIsPresent(
						this.page,
						this.txtParticipantName(role, participantOwner),
					);
				}
			}

			await PwActions.click(this.page, this.btnCloseSidePanel);
		};

		try {
			await performVerification();
		} catch (error) {
			logger.info(
				`Verification failed for goal "${goalName}". Retrying with global search...`,
			);
			try {
				await PwActions.click(this.page, this.btnCloseSidePanel);
			} catch {}
			if (state === "published") {
				await this.globalSearch({ page: this.page, value: goalName });
				await performVerification();
				logger.info(`Verification succeeded on retry for goal "${goalName}"`);
			}
		}
	}

	/**
	 * Calculates the current progress of a supporting item based on its data.
	 *
	 * @param {Object} item - The supporting item data.
	 * @param {string} [item.metric] - The type of metric (e.g., "Number", "Percentage", "Decision").
	 * @param {number} [item.currentValue] - The current value of the metric.
	 * @param {number} [item.startValue] - The starting value of the metric.
	 * @param {number} [item.targetValue] - The target (goal) value of the metric.
	 * @param {string} [item.status] - The current status ("Completed" or other for 'Decision' metrics).
	 * @param {string} [item.title] - Title or name of the supporting item, for logging context.
	 *
	 * @returns {{ itemProgress: number, expectedProgress: number|null }}
	 *   An object with:
	 *     - itemProgress: {number} The calculated progress percentage of the supporting item.
	 *     - expectedProgress: {number|null} The expected progress (percent) if metric-based, or 100 for completed 'Decision' tasks, otherwise null.
	 *
	 * @example
	 * // Example 1: Numeric metric (progress calculation)
	 * const item = {
	 *   title: "Increase sales", metric: "Number", startValue: 10, currentValue: 60, targetValue: 110
	 * };
	 * const { itemProgress, expectedProgress } = goalsCommonPage.calculateSupportingItemProgress(item);
	 * // itemProgress === 50, expectedProgress === 50
	 *
	 * @example
	 * // Example 2: Decision metric (status-based)
	 * const item = {
	 *   title: "Submit report", metric: "Decision", status: "Completed"
	 * };
	 * const { itemProgress, expectedProgress } = goalsCommonPage.calculateSupportingItemProgress(item);
	 * // itemProgress === 100, expectedProgress === 100
	 *
	 * @example
	 * // Example 3: No metric or incomplete data
	 * const item = { title: "Draft document" };
	 * const { itemProgress, expectedProgress } = goalsCommonPage.calculateSupportingItemProgress(item);
	 * // itemProgress === 0, expectedProgress === null
	 */
	calculateSupportingItemProgress(item) {
		let itemProgress = 0;
		let expectedProgress = null;

		if (
			item?.metric &&
			item?.currentValue !== undefined &&
			item?.targetValue !== undefined &&
			item?.startValue !== undefined
		) {
			expectedProgress =
				((item.currentValue - item.startValue) /
					(item.targetValue - item.startValue)) *
				100;
			expectedProgress = Number.parseFloat(expectedProgress.toFixed(2));
			itemProgress = expectedProgress;
			logger.info(
				`TASK with metric - Item: ${item.title}, Expected: ${expectedProgress}%, Actual: ${itemProgress}%`,
			);
		} else if (item?.metric === "Decision" && item.status) {
			expectedProgress = 100;
			itemProgress = 100;
			logger.info(
				`Decision TASK - Item: ${item.title}, Progress: ${itemProgress}%`,
			);
		}

		return { itemProgress, expectedProgress };
	}

	/**
	 * Calculates the goal's overall progress as a percentage string.
	 *
	 * @param {number} totalProgress - The total sum of all supporting items' progress (each out of 100).
	 * @param {number} supportingItemCount - The number of supporting items included.
	 * @returns {string} The overall goal progress as a percentage (e.g., "53.33").
	 * @example
	 * // If you have 3 supporting items with progress 60, 80, and 90:
	 * const totalProgress = 60 + 80 + 90; // 230
	 * const supportingItemCount = 3;
	 * const progress = goalsCommonPage.calculateGoalProgress(totalProgress, supportingItemCount);
	 * // progress === "76.67"
	 *
	 * // If there are no supporting items:
	 * const progress = goalsCommonPage.calculateGoalProgress(0, 0);
	 * // progress === "0"
	 */
	calculateGoalProgress(totalProgress, supportingItemCount) {
		if (supportingItemCount === 0) return "0";

		const goalProgress = (totalProgress / (supportingItemCount * 100)) * 100;
		logger.info(`Calculated goal progress: ${goalProgress}%`);

		return Number.parseFloat(goalProgress.toFixed(2)).toString();
	}

	/**
	 * Deletes the given OKRs in bulk.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {Array<string>|string} params.okrs - The OKRs to delete. Can be a single string or array of strings.
	 * @returns {Promise<void>}
	 * @example
	 * // Deleting a single OKR
	 * await goalsCommonPage.bulkDeleteOkrs({ okrs: "My New Goal" });
	 * @example
	 * // Deleting multiple OKRs
	 * await goalsCommonPage.bulkDeleteOkrs({ okrs: ["My New Goal", "My New Goal 2"] });
	 * @example
	 * // Deleting OKRs with custom page
	 * await goalsCommonPage.bulkDeleteOkrs({ page: customPage, okrs: ["Goal 1", "Goal 2"] });
	 */
	async bulkDeleteOkrs({ page = this.page, okrs }) {
		if (!Array.isArray(okrs)) {
			okrs = [okrs];
		}
		okrs = Array.from(new Set(okrs));
		await PwActions.scroll(page, this.getOkrInList(okrs[0]));
		await PwActions.hover(page, this.getOkrInList(okrs[0]));
		await PwActions.click(page, this.getBtnCheckBoxForOkr(okrs[0]));
		if (okrs.length > 1) {
			for (const okr of okrs.slice(1)) {
				await PwActions.click(page, this.getBtnCheckBoxForOkr(okr));
			}
		}
		await CommonUtils.sleep(3);
		await PwActions.click(page, this.btnBulkDelete);
		await PwActions.click(page, this.btnDelete);
		await PwActions.waitForElementVisibility(
			page,
			this.toasterDeleted(okrs.length),
			25000,
		);
	}

	/**
	 *
	 * @param {Array<string>} okrs - The OKRs to archive.
	 * @example
	 * // Archiving a single OKR
	 * await goalsCommonPage.bulkArchiveOkrs("My New Goal");
	 * @example
	 * // Archiving multiple OKRs
	 * await goalsCommonPage.bulkArchiveOkrs(["My New Goal", "My New Goal 2"]);
	 *
	 */
	async bulkArchiveOkrs(okrs) {
		if (!Array.isArray(okrs)) {
			okrs = [okrs];
		}
		await PwActions.scroll(this.page, this.getOkrInList(okrs[0]));
		await PwActions.hover(this.page, this.getOkrInList(okrs[0]));
		await PwActions.click(this.page, this.getBtnCheckBoxForOkr(okrs[0]));
		for (const okr of okrs.slice(1)) {
			await PwActions.scroll(this.page, this.getOkrInList(okr));
			await PwActions.click(this.page, this.getBtnCheckBoxForOkr(okr));
		}
		await CommonUtils.sleep(3);
		await PwActions.click(this.page, this.btnBulkArchive);
		await PwActions.waitForElementVisibility(
			this.page,
			this.toasterArchived(okrs.length),
		);
	}
	/**
	 * Navigates to the given side bar menu.
	 *
	 * @param {string} menuName - The name of the side bar menu to navigate to.
	 * @example
	 * // Navigating to the My Goals side bar menu
	 * await goalsCommonPage.navigateToSideBarMenu("My Goals");
	 */
	async navigateToSideBarMenu({ page = this.page, menuName }) {
		await PwActions.click(page, this.btnSideBarMenu(menuName));
	}
	/**
	 * Navigates to the created OKRs section.
	 *
	 * @param {Object} [params] - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @returns {Promise<void>}
	 * @example
	 * // Navigating to the created OKRs
	 * await goalsCommonPage.navigateToCreatedOkrs();
	 * @example
	 * // Navigating to the created OKRs with custom page
	 * await goalsCommonPage.navigateToCreatedOkrs({ page: customPage });
	 */
	async navigateToCreatedOkrs({ page = this.page } = {}) {
		await this.navigateToSideBarMenu({ page: page, menuName: "My Goals" });
		await PwActions.click(page, this.btnGroup("CREATED"));
	}

	async navigateToOwnedOkrs() {
		await this.navigateToSideBarMenu({ menuName: "My Goals" });
		await PwActions.click(this.page, this.btnGroup("owned and shared"));
	}
	/**
	 * Verifies the goal published email.
	 *
	 * @param {string} goalOwner - The owner name of the goal.
	 * @param {string} goalName - The name of the goal.
	 * @returns {Promise<string>} - The email link.
	 * @example
	 * // Verifying the goal published email
	 * await goalsCommonPage.verifyUserReceivedGoalPublishedEmail("John Doe", "Goal 1");
	 */
	async verifyUserReceivedGoalPublishedEmail(goalOwner, goalName) {
		const emailLink =
			await this.commonfunctions.open_survey_from_received_email(
				constants.goalPublishedEmailSubject,
				constants.new_employee_email,
				constants.getGoalPublishedEmailBody(goalOwner, goalName),
			);
		return emailLink;
	}

	/**
	 * Verifies the task assigned email.
	 *
	 * @param {string} ownerName - The owner name of the task.
	 * @param {string} taskName - The name of the task.
	 * @returns {Promise<string>} - The email link.
	 * @example
	 * // Verifying the task assigned email
	 * await goalsCommonPage.verifyUserReceivedTaskAssignedEmail("John Doe", "Task 1");
	 */
	async verifyUserReceivedTaskAssignedEmail(ownerName, taskName) {
		const emailLink =
			await this.commonfunctions.open_survey_from_received_email(
				constants.taskAssignedEmailSubject,
				constants.new_employee_email,
				constants.getTaskAssignedEmailBody(ownerName, taskName),
			);
		return emailLink;
	}

	/**
	 * Creates a new Task in the Goals module.
	 *
	 * @param {Object} taskData - The data for the task to be created. Example:
	 * {
	 *   "taskName": "Prepare Q2 Report",
	 *   "taskDescription": "Compile and analyze Q2 financial data",
	 *   "taskOwner": "Jane Smith",
	 *   "metric": { "type": "Number", "start": 0, "target": 100 },
	 *   "parent": "Q2 Company Goals",
	 *   "initiative": ["Initiative 1", "Initiative 2"],
	 *   "participants": ["John Doe", "Alice Lee"]
	 * }
	 * @param {string} action - "publish" to publish the task, anything else to save as draft (e.g., "publish" or "draft")
	 *
	 * This function automates the UI steps to create a new task, filling in all provided fields,
	 * handling different metric types, adding initiatives and participants, and finally either
	 * publishing or saving the task as a draft.
	 *
	 * @example
	 * await goalsCommonPage.createTask({
	 *   "taskName": "Prepare Q2 Report",
	 *   "taskDescription": "Compile and analyze Q2 financial data",
	 *   "taskOwner": "Jane Smith",
	 *   "metric": { "type": "Number", "start": 0, "target": 100 },
	 *   "parent": "Q2 Company Goals",
	 *   "initiative": ["Initiative 1", "Initiative 2"],
	 *   "participants": ["John Doe", "Alice Lee"]
	 * }, "publish");
	 *
	 * @returns {Promise<Object>} Example: { "success": true, "taskName": "Prepare Q2 Report" }
	 */
	async createTask(taskData, action = "publish") {
		const {
			taskName,
			taskDescription,
			taskOwner,
			metric,
			parent,
			initiative,
			participants,
			settings,
		} = taskData;
		const { page } = this;
		let partDataValue;
		let totalDataValue;

		// Open the "New Task" form
		await PwActions.click(page, this.btnDropDownNewGoal);
		await PwActions.click(page, this.btnNewTask);

		// Fill in basic task details
		await PwActions.fill(page, this.inputGoalName, taskName);
		await PwActions.fill(page, this.inputGoalDescription, taskDescription);

		// Select task owner if provided
		if (taskOwner) {
			await PwActions.click(page, this.btnGoalOwner);
			await PwActions.fill(page, this.inputOnwerDropdown, taskOwner);
			await PwActions.click(page, this.getOwner(taskOwner));
		}

		if (metric) {
			await PwActions.click(page, this.btnMetricTypeInSidePanel);
			const metricTypeMap = {
				Decision: this.btnDecisionMetricType,
				Number: this.btnNumberMetricType,
				Percentage: this.btnPercentageMetricType,
				Currency: this.btnCurrencyMetricType,
			};
			const metricType = metricTypeMap[metric.type];
			if (metricType) {
				await PwActions.click(page, metricType);
			}
			if (["Number", "Percentage", "Currency"].includes(metric.type)) {
				if (settings?.connectionName) {
					await CommonUtils.sleep(10);
					await PwActions.waitForElementVisibility(
						page,
						this.btnAddConnections,
					);
					await PwActions.click(page, this.btnAddConnections);
					await PwActions.fill(
						page,
						this.txtSearchConnections,
						settings.connectionName,
					);
					await PwActions.click(
						page,
						this.btnsearchOptions(settings.connectionName),
					);
					if (settings.jiraConnection) {
						if (settings.conditionType === "Issue count") {
							await PwActions.click(page, this.btnIssueCount);
							await PwActions.fill(
								page,
								this.txtCountWorkItems,
								settings.jiraJQL[0],
							);
							taskData.currentvalue = String(
								await this.externalServices.getJiraIssueCountForJQuery(
									settings.jiraJQL[0],
								),
							);
							await PwActions.waitForElementVisibility(
								page,
								this.txtissuecount(taskData.currentvalue),
							);
						} else {
							await PwActions.click(page, this.btnIssueCompletion);
							await PwActions.fill(
								page,
								this.txtCountWorkItems,
								settings.jiraJQL[0],
							);
							await PwActions.fill(
								page,
								this.txtTotalWorkItems,
								settings.jiraJQL[1],
							);
							const issueCount =
								await this.externalServices.getJiraIssueCountForJQuery(
									settings.jiraJQL[0],
								);
							const totalWorkItems =
								await this.externalServices.getJiraIssueCountForJQuery(
									settings.jiraJQL[1],
								);
							taskData.currentvalue = String(
								(issueCount / totalWorkItems) * 100,
							);
							await PwActions.waitForElementVisibility(
								page,
								this.txtTotalWorkItemCount(totalWorkItems),
							);
							await PwActions.waitForElementVisibility(
								page,
								this.txtissuecount(issueCount),
							);
						}
						await PwActions.click(page, this.btnSaveSyncSettings);
					}
					if (settings.apiConnection) {
						const radioButton =
							settings.conditionType === "Percentage"
								? this.radioButtonPercentage
								: this.radioButtonCount;
						await PwActions.click(page, radioButton);
						let clipboardValue = await PwActions.copyLinkFromClipboard(
							page,
							this.btnKeyOnResponse(settings.keyToMatch.partDataKey),
						);
						await PwActions.fill(page, this.txtBoxInputPartKey, clipboardValue);
						partDataValue = await PwActions.getText(
							page,
							this.txtValueForkey(settings.keyToMatch.partDataKey),
						);
						taskData.currentvalue = partDataValue;
						if (settings.conditionType === "Percentage") {
							totalDataValue = await PwActions.getText(
								page,
								this.txtValueForkey(settings.keyToMatch.totalDataKey),
							);
							clipboardValue = await PwActions.copyLinkFromClipboard(
								page,
								this.btnKeyOnResponse(settings.keyToMatch.totalDataKey),
							);
							await PwActions.fill(
								page,
								this.txtBoxInputTotalDataKey,
								clipboardValue,
							);
							taskData.currentvalue = String(
								Math.floor((partDataValue / totalDataValue) * 100),
							);
						}
						await PwActions.click(page, this.btnSaveButtonForCustomConnector);
					}
				}
				if (metric.start) {
					await PwActions.clearAndFill(
						page,
						this.txtBoxStartValue,
						metric.start,
					);
				}
				if (metric.target) {
					await PwActions.clearAndFill(
						page,
						this.txtBoxTargetValue,
						metric.target,
					);
				}
			}
			if (metric.type === "Currency" && metric.currency) {
				await PwActions.click(page, this.btnCurrencyType);
				await PwActions.fill(page, this.txtBoxSearchCurrency, metric.currency);
				await PwActions.click(page, this.getCurrencyType(metric.currency));
			}
		}

		// Select parent goal if provided
		if (parent) {
			await PwActions.click(page, this.btnParentGoal);
			await PwActions.click(page, this.getFilterChipInAlignModal("Goal Cycle"));
			await this.commonfunctions.getMenuItem(page, "All");
			await PwActions.fill(page, this.inputSearchGoalInsertModal, parent);
			await PwActions.click(page, this.getBtnParentGoal(parent));
		}

		// Add initiatives if provided
		if (Array.isArray(initiative) && initiative.length > 0) {
			await CommonUtils.sleep(2);
			await PwActions.click(page, this.btnAddInitiative);
			let row = 0;
			for (const item of initiative) {
				await PwActions.fill(page, this.txtInitiative(row), item);
				row++;
				await PwActions.press(page, "Enter");
			}
		}

		// Add participants if provided
		if (Array.isArray(participants) && participants.length > 0) {
			await CommonUtils.sleep(2);
			await PwActions.click(page, this.btnParticipants);
			for (const participantName of participants) {
				await PwActions.fill(page, this.inputParticipants, participantName);
				await PwActions.click(page, this.getParticipantInList(participantName));
			}
		}

		// Save or publish the task
		await PwActions.click(page, this.btnSaveTask);
		if (action === "publish") {
			await PwActions.click(page, this.btnPublishTask);
		} else {
			await PwActions.click(page, this.btnSaveAsDraftTask);
		}
		return taskData;
	}

	/**
	 * Verifies the details of a task.
	 *
	 * @param {Object} taskData - The task details.
	 * @param {string} taskData.taskName - The name of the task. (Mandatory)
	 * @param {string} [taskData.taskDescription] - The description of the task. (Optional)
	 * @param {string} [taskData.taskOwner] - The owner of the task. (Optional)
	 * @param {Object|string} [taskData.metric] - The metric type or object (e.g., { type: "Number" } or "Number"). (Optional)
	 * @param {string} [taskData.parent] - The parent goal to align with. (Optional)
	 * @param {string} [taskData.visibility] - The visibility of the task (e.g., "Public", "Private", "Restricted"). (Optional)
	 * @param {string} [taskData.cycle] - The cycle to which the task belongs. (Optional)
	 * @param {Array<string>} [taskData.initiative] - List of initiatives for the task. (Optional)
	 * @param {Array<string>} [taskData.participants] - List of participants for the task. (Optional)
	 *
	 * @example
	 * // Verifying the details of a task
	 * await goalsCommonPage.verifyTaskDetails({
	 *   taskName: "Task 1",
	 *   taskDescription: "Description",
	 *   taskOwner: "John",
	 *   metric: { type: "Number" },
	 *   parent: "Parent Goal",
	 *   visibility: "Private",
	 *   cycle: "Q1 2024",
	 *   initiative: ["Initiative 1"],
	 *   participants: ["Alice", "Bob"]
	 * });
	 *
	 * @returns {Promise<void>} Returns a promise that resolves when all verifications are complete.
	 */
	async verifyTaskDetails(taskData) {
		const {
			taskName,
			taskDescription,
			taskOwner,
			metric,
			parent,
			visibility,
			cycle,
			initiative,
			participants,
			settings,
			currentvalue,
		} = taskData;
		const { page } = this;

		// List of fields to verify: [expected value, locator]
		const verifications = [
			[taskName, this.txtTaskNameInSidePanel],
			[taskDescription, this.inputGoalDescription],
			[taskOwner, this.txtGoalOwnerName],
			[parent, this.txtGoalParentGoal],
			[visibility, this.txtGoalVisibility],
			[cycle, this.txtGoalCycle],
		];

		// Verify each field if value is provided
		for (const [value, locator] of verifications) {
			if (value) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(page, locator),
					value,
				);
			}
		}

		// Verify metric type if provided
		if (metric) {
			if (typeof metric === "object" && metric.type) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(page, this.btnMetricTypeInSidePanel),
					metric.type,
				);
			} else if (typeof metric === "string") {
				await PwActions.verifyTextExpected(
					await PwActions.getText(page, this.btnMetricTypeInSidePanel),
					metric,
				);
			}
		}

		// Verify initiatives if provided
		if (initiative && Array.isArray(initiative)) {
			for (let i = 0; i < initiative.length; i++) {
				const initiativeValue = initiative[i];
				if (initiativeValue) {
					await PwActions.verifyTextExpected(
						await PwActions.getText(page, this.txtInitiative(i)),
						initiativeValue,
					);
				}
			}
		}

		// Verify participants with role "Contributor"
		if (
			participants &&
			Array.isArray(participants) &&
			participants.length > 0
		) {
			for (const { role, owner: participantOwner } of participants) {
				if (role === "Contributor") {
					await PwActions.verifyElementIsPresent(
						page,
						this.txtParticipantName(role, participantOwner),
					);
				}
			}
		}

		// Close the side panel after verification
		if (currentvalue) {
			let uivalue = await PwActions.getText(page, this.txtcurrentvalue());
			let parsedvalue = CommonUtils.parseNumberWithSuffix(uivalue);
			if (currentvalue > 999) {
				let roundedvalue = Math.round(currentvalue / 50) * 50;
				let roundedParsed = Math.round(Number(parsedvalue) / 50) * 50;
				expect(String(roundedParsed)).toBe(String(roundedvalue));
			} else {
				expect(String(uivalue)).toBe(String(currentvalue));
			}
			if (settings) {
				expect(
					await PwActions.isElementDisabledOrEnabled(
						page,
						this.txtcurrentvalue(uivalue),
					),
				).toBe(true);
			}
		}
		await PwActions.click(page, this.btnCloseSidePanel);
	}

	/**
	 * Navigates to a given menu in the sidebar.
	 * @param {string} menuName - The name of the sidebar menu to navigate to.
	 */
	async navigateToSideBarMenu({ page = this.page, menuName }) {
		await PwActions.click(page, this.btnSideBarMenu(menuName));
	}

	/**
	 * Navigates to the "Drafts" section in the UI.
	 */
	async navigateToDrafts() {
		await PwActions.click(this.page, this.btnDraft);
	}

	/**
	 * Searches for a draft goal or task by name.
	 *
	 * @param {string} value - The name of the goal/task to search for.
	 * @param {boolean} [toBeVisible=true] - If true, expects the goal/task to be present and opens it. If false, expects no results and verifies the "no drafts" heading.
	 *
	 * @example
	 * // Example 1: Searching for a draft goal that exists
	 * // Input:
	 * // {
	 * //   "value": "Q2 Report",
	 * //   "toBeVisible": true
	 * // }
	 * // This will search for "Q2 Report", expect it to appear in the list, then open and close it.
	 * await goalsCommonPage.listSearch("Q2 Report", true);
	 *
	 * @example
	 * // Example 2: Searching for a draft goal that does NOT exist
	 * // Input:
	 * // {
	 * //   "value": "Nonexistent Goal",
	 * //   "toBeVisible": false
	 * // }
	 * // This will search for "Nonexistent Goal", expect "No Draft Goals" heading to be visible.
	 * await goalsCommonPage.listSearch("Nonexistent Goal", false);
	 */
	async listSearch(value, toBeVisible = true) {
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		// Check if side panel is open and close it
		if (await PwActions.elementIsVisible(this.page, this.btnCloseSidePanel)) {
			await PwActions.click(this.page, this.btnCloseSidePanel);
		}

		await PwActions.click(this.page, this.txtBoxSearch);
		await PwActions.fill(this.page, this.txtBoxSearch, value);

		if (toBeVisible) {
			await PwActions.waitForElementVisibility(
				this.page,
				this.getGoalFromList(value),
			);
			await PwActions.verifyElementIsPresent(
				this.page,
				this.getGoalFromList(value),
			);
			await PwActions.click(this.page, this.getGoalFromList(value));
		} else {
			await PwActions.waitTillVisible(this.page, this.lblnoDraftGoalsHeading);
			await PwActions.verifyElementIsPresent(
				this.page,
				this.lblnoDraftGoalsHeading,
			);
		}
	}

	/**
	 * Navigates to the "My Goals" section in the UI.
	 */
	async goToMyGoals() {
		await PwActions.click(this.page, this.btnMyGoalsBreadcrumb);
	}
	/**
	 * Verifies that the group side panel is opened with the correct entity name after a global search.
	 * For team, department, and employee/owner searches, clicking the result opens a side panel
	 * instead of applying a filter.
	 *
	 * @param {Object} params - The parameters object
	 * @param {string} params.entityName - The name of the entity (team, department, or employee) expected in the side panel.
	 * @returns {Promise<void>}
	 * @example
	 * // Verify team side panel
	 * await goalsCommonPage.verifyGroupSidePanelOpened({ entityName: "Subject Automation 1's Team" });
	 * @example
	 * // Verify department side panel
	 * await goalsCommonPage.verifyGroupSidePanelOpened({ entityName: "Engineering" });
	 * @example
	 * // Verify employee side panel
	 * await goalsCommonPage.verifyGroupSidePanelOpened({ entityName: "Subject Automation 1" });
	 */
	async verifyGroupSidePanelOpened({ entityName }) {
		await PwActions.waitForElementVisibility(
			this.page,
			this.getGroupSidePanelEntityName(entityName),
		);
		await PwActions.verifyTextExpected(
			await PwActions.getText(
				this.page,
				this.getGroupSidePanelEntityName(entityName),
			),
			entityName,
		);
		await PwActions.waitForElementVisibility(
			this.page,
			this.btnCloseGroupSidePanel,
		);
		await PwActions.click(this.page, this.btnCloseGroupSidePanel);
	}
	/**
	 * Switches to the given view type.
	 *
	 * @param {Object} params - The parameters object
	 * @param {import('@playwright/test').Page} [params.page] - The Playwright page object. Defaults to this.page.
	 * @param {string} params.viewtype - The view type to switch to. Valid values: "list", "tree", "cascade".
	 * @returns {Promise<void>}
	 * @example
	 * // Switching to the list view
	 * await goalsCommonPage.switchToViewtype({ viewtype: "list" });
	 * @example
	 * // Switching to the tree view
	 * await goalsCommonPage.switchToViewtype({ viewtype: "tree" });
	 * @example
	 * // Switching to the cascade view with custom page
	 * await goalsCommonPage.switchToViewtype({ page: customPage, viewtype: "cascade" });
	 */
	async switchToViewtype({ page = this.page, viewtype }) {
		switch (viewtype) {
			case "list":
				await PwActions.click(page, this.btnListView);
				break;
			case "tree":
				await PwActions.click(page, this.btnTreeView);
				await PwActions.waitForElementVisibility(page, this.loaderTreeView);
				await PwActions.waitTillElementDisappear(
					page,
					this.loaderTreeView,
					20000,
				);
				break;
			case "cascade":
				await PwActions.click(page, this.btnCascadeView);
				break;
		}
	}
	/**
	 * Searches for a goal in the tree view and selects it.
	 *
	 * This function automates the process of searching for a goal by its name (or value)
	 * in the tree view of the Goals page. It performs the following steps:
	 * 1. Clicks on the tree view search button to activate the search input.
	 * 2. Fills the search input with the provided value.
	 * 3. Clicks on the goal from the search results list.
	 * 4. Clicks on the goal in the tree view to select or expand it.
	 *
	 * @param {string} value - The name or value of the goal to search for.
	 *
	 * @example
	 * // Search and select a goal named "example goal"
	 * await goalsCommonPage.treeViewSearch("example goal");
	 */
	async treeViewSearch(value) {
		await PwActions.jsClick(this.page, this.btnTreeViewSearch);
		await PwActions.fill(this.page, this.inputTreeViewSearch, value);
		await PwActions.click(this.page, this.getGoalFromList(value));
		await PwActions.waitForElementVisibility(
			this.page,
			this.getGoalFromTreeView(value),
		);
		await PwActions.click(this.page, this.getGoalFromTreeView(value));
		await PwActions.click(this.page, this.btnCloseSidePanel);
	}

	/**
	 * Creates goals and tasks using the Quick Add dialog with hierarchical support.
	 * Automates goal creation, handles nested children, key results, and all metadata.
	 *
	 * @param {Array} quickAddPayload - Payload from constants.getQuickAddPayload()
	 * @throws {Error} When quickAddPayload is not an array
	 *
	 * @example
	 * // Simple goal creation
	 * const payload = constants.getQuickAddPayload({
	 *   scenario: "only_goal_no_krs",
	 *   goalLevel: "Org",
	 *   visibility: "Public",
	 *   owner: constants.subjectName
	 * });
	 * await goalsCommonPage.quickAddGoal(payload);
	 *
	 * @example
	 * // Complex hierarchical goals with children and KRs
	 * const payload = constants.getQuickAddPayload({
	 *   scenario: "goal_with_children_and_krs",
	 *   goalLevel: "Department",
	 *   visibility: "Private",
	 *   owner: constants.subjectName,
	 *   maxChildren: 2,
	 *   maxKRs: 3
	 * });
	 * await goalsCommonPage.quickAddGoal(payload);
	 *
	 * @see constants.getQuickAddPayload() - Use this to generate proper payloads
	 * @see Scenarios: "only_goal_no_krs", "only_goal_with_krs", "goal_with_children",
	 *      "goal_with_children_and_krs", "goal_with_fixed_structure", "goal_with_imported_parent",
	 *      "goal_with_imported_child", "task_with_imported_parent", "multiple_goals_random"
	 */
	async quickAddGoal(quickAddPayload) {
		await CommonUtils.sleep(2);
		if (!Array.isArray(quickAddPayload)) {
			throw new Error("quickAddPayload must be an array");
		}

		const { page } = this;

		const metricTypeButtons = {
			Percentage: this.btnMetricTypePercentage,
			Number: this.btnMetricTypeNumber,
			Currency: this.btnMetricTypeCurrency,
			Decision: this.btnMetricTypeDecision,
		};

		await PwActions.click(page, this.btnQuickAddGoal);
		await PwActions.click(page, this.btnExpandQuickAdd);

		const unalign = async () => {
			await CommonUtils.sleep(2);
			await PwActions.click(page, this.txtBoxQuickAdd);
			await PwActions.press(page, "Shift+Backspace");
			await CommonUtils.sleep(2);
		};

		const processItem = async (item) => {
			if (item.type === "GOAL" && item.toBrowse) {
				await PwActions.click(page, this.btnBrowseGoalsInline);
				await PwActions.fill(
					page,
					this.txtInputSearchGoalInsertModalInlineEditor,
					item.title,
				);
				await PwActions.click(page, this.getBtnParentGoal(item.title));
				await PwActions.click(page, this.btnInsertGoal);
				await CommonUtils.sleep(1.5);
				await PwActions.click(page, this.btnAddAnotherItem);
				return;
			}

			if (item.type) {
				await PwActions.click(page, this.btntypeSelector);
				const typeLabel = item.type === "TASK" ? "Task" : "Goal";
				await PwActions.click(page, this.getBtnTypeSelector(typeLabel));
			}

			const title = item.goalName || item.title || "Untitled";
			await PwActions.fill(page, this.txtBoxQuickAdd, title);

			if (item.owner) {
				await PwActions.click(page, this.btnGoalOwnerInSupportingItem);
				await PwActions.fill(page, this.inputOwnerInSupportingItem, item.owner);
				await PwActions.click(page, this.getOwnerInSupportingItem(item.owner));
			}

			if (item.type === "GOAL") {
				if (item.goalLevel) {
					await PwActions.click(page, this.btnGoalLevelInlineCreation);
					await PwActions.click(page, this.getBtnGoalLevel(item.goalLevel));
				}
				if (item.visibility) {
					await PwActions.click(page, this.btnVisibilityInline);
					await PwActions.click(
						page,
						this.getVisibilityDropDownInline(item.visibility),
					);
				}
			}

			await PwActions.click(page, this.btnDueDateEditor);
			if (item.type === "GOAL") {
				await PwActions.click(page, this.btnCycleSelectorInCalendar);
				await CommonUtils.sleep(3);
				await PwActions.click(
					page,
					this.getCycleSelectorInCalendar(envDetails.goalCycle),
				);
			}

			await this.commonfunctions.chooseRandomDateOnCalendar({ page: page });
			if (
				item.type === "TASK" &&
				item.metric &&
				metricTypeButtons[item.metric] &&
				item.metric !== "Decision"
			) {
				await PwActions.click(page, this.btnMetricTypeInlineCreation);
				await PwActions.click(page, metricTypeButtons[item.metric]);

				if (item.startValue !== undefined) {
					await PwActions.fill(
						page,
						this.inputFromValue,
						String(item.startValue),
					);
				}
				if (item.targetValue !== undefined) {
					await PwActions.fill(
						page,
						this.inputToValue,
						String(item.targetValue),
					);
				}

				if (item.metric === "Currency" && item.unit) {
					await PwActions.forceClick(page, this.dropDownCurrencyUnit);
					await PwActions.fill(page, this.inputSearchCurrencyUnit, item.unit);
					await PwActions.click(page, this.getCurrencyUnit(item.unit));
				}

				await PwActions.click(page, this.btnSaveMetric);
			}

			if (item.parentGoal) {
				await PwActions.click(page, this.btnAlignParentInlineEditor);
				await PwActions.fill(
					page,
					this.txtInputSearchGoalInsertModalInlineEditor,
					item.parentGoal.title,
				);
				await PwActions.click(
					page,
					this.getBtnParentGoal(item.parentGoal.title),
				);
			}

			await PwActions.waitAndClick(page, this.btnSaveButtonInlineCreator);
			await CommonUtils.sleep(3);

			if (Array.isArray(item.keyResults) && item.keyResults.length > 0) {
				await PwActions.press(page, "Tab");
				for (const keyResult of item.keyResults) {
					await processItem(keyResult);
				}
				await CommonUtils.sleep(3);
				await unalign();
			}

			if (Array.isArray(item.children) && !item.children.toBrowse) {
				await PwActions.press(page, "Tab");
				for (const child of item.children) {
					await processItem(child);
				}
				if (item.children.length > 0) {
					await unalign();
					await CommonUtils.sleep(2);
				}
			}
		};

		for (const topLevelGoal of quickAddPayload) {
			await processItem(topLevelGoal);
			await PwActions.press(page, "Meta+Enter");
			await CommonUtils.sleep(2);
		}
		await PwActions.press(page, "Meta+Escape");
		await PwActions.click(page, this.btnPublishQuickAdd);

		logger.info(
			`Successfully created ${quickAddPayload.length} goals/tasks with their hierarchical structure using Quick Add`,
		);
	}

	/**
	 * Creates a comment on a goal or task, optionally mentioning a user and adding them as a watcher.
	 *
	 * @param {Object} params - The comment parameters.
	 * @param {string} params.commentMessage - The comment text to post.
	 * @param {string} params.goalOrTaskName - The name of the goal or task to comment on.
	 * @param {string} [params.mentionedUser] - The username to mention in the comment.
	 * @param {boolean} [params.addAsWatcher] - Whether to add the mentioned user as a watcher if they lack visibility.
	 * @example
	 * // Post a comment and mention a user, adding them as watcher
	 * await goalsCommonPage.createComment({
	 *   commentMessage: "Great progress!",
	 *   goalOrTaskName: "Q2 Sales Goal",
	 *   mentionedUser: "john.doe",
	 *   addAsWatcher: true
	 * });
	 * @example
	 * // Post a simple comment without mentioning anyone
	 * await goalsCommonPage.createComment({
	 *   commentMessage: "Let's keep up the good work.",
	 *   goalOrTaskName: "Q2 Sales Goal"
	 * });
	 */
	async createComment({
		commentMessage,
		goalOrTaskName,
		mentionedUser,
		addAsWatcher,
	}) {
		await this.globalSearch({ value: goalOrTaskName });
		await PwActions.click(this.page, this.btnPostCommentBox);
		if (commentMessage) {
			await PwActions.fill(this.page, this.inputCommentBox, commentMessage);
		}
		if (mentionedUser) {
			await CommonUtils.sleep(2);
			await PwActions.clearAndFill(
				this.page,
				this.inputCommentBox,
				commentMessage + " @" + mentionedUser,
			);
			await PwActions.click(this.page, this.getMentionedUser(mentionedUser));
			await PwActions.waitForElement(this.page, this.btnAddAsWatcher);
			if (
				addAsWatcher &&
				(await PwActions.elementIsVisible(this.page, this.btnAddAsWatcher))
			) {
				await PwActions.jsClick(this.page, this.btnAddAsWatcher);
				await PwActions.waitForElementVisibility(
					this.page,
					this.toastWatcherAdded,
				);
			} else {
				addAsWatcher = false;
			}
		}
		await PwActions.click(this.page, this.btnPostComment);
		await PwActions.waitForDOMContentLoaded(this.page, 15000);
		await PwActions.waitForElementVisibility(
			this.page,
			this.toasterCommentPosted,
		);
		if (addAsWatcher) {
			await CommonUtils.sleep(2);
			await PwActions.click(this.page, this.btnParticipants);
			await CommonUtils.sleep(2);
			await PwActions.verifyElementIsPresent(
				this.page,
				this.txtParticipantName("Watcher", mentionedUser),
			);
		}
		await CommonUtils.sleep(2);
		await PwActions.click(this.page, this.btnCloseSidePanel);
	}

	/**
	 * Verifies that a comment is present on a goal or task, and optionally checks for a mentioned user.
	 *
	 * @param {Object} params - The verification parameters.
	 * @param {string} params.comment - The comment text to verify.
	 * @param {string} params.goalOrTaskName - The name of the goal or task.
	 * @param {string} [params.mentionedUser] - The username expected to be mentioned in the comment.
	 * @example
	 * // Verify a comment and mentioned user
	 * await goalsCommonPage.verifyCommentIsPresent({
	 *   comment: "Great progress!",
	 *   goalOrTaskName: "Q2 Sales Goal",
	 *   mentionedUser: "john.doe"
	 * });
	 * @example
	 * // Verify a comment without a mention
	 * await goalsCommonPage.verifyCommentIsPresent({
	 *   comment: "Let's keep up the good work.",
	 *   goalOrTaskName: "Q2 Sales Goal"
	 * });
	 */
	async verifyCommentIsPresent({ comment, goalOrTaskName, mentionedUser }) {
		await this.globalSearch({ value: goalOrTaskName });
		await CommonUtils.sleep(3);
		await PwActions.verifyElementIsPresent(
			this.page,
			this.getCommentInList(comment),
		);
		if (mentionedUser) {
			await PwActions.verifyElementIsPresent(
				this.page,
				this.getMentionedUserInComment(comment, mentionedUser),
			);
		}
		await PwActions.click(this.page, this.btnCloseSidePanel);
	}

	/**
	 * Replies to a comment on a goal or task, optionally mentioning a user.
	 *
	 * @param {Object} params - The reply parameters.
	 * @param {string} params.mainComment - The main comment to reply to.
	 * @param {string} params.replyMessage - The reply text.
	 * @param {string} params.goalOrTaskName - The name of the goal or task.
	 * @param {string} [params.mentionedUser] - The username to mention in the reply.
	 * @example
	 * // Reply to a comment and mention a user
	 * await goalsCommonPage.replyToComment({
	 *   mainComment: "Great progress!",
	 *   replyMessage: "Thanks @john.doe!",
	 *   goalOrTaskName: "Q2 Sales Goal",
	 *   mentionedUser: "john.doe"
	 * });
	 * @example
	 * // Reply to a comment without mentioning anyone
	 * await goalsCommonPage.replyToComment({
	 *   mainComment: "Great progress!",
	 *   replyMessage: "Thank you!",
	 *   goalOrTaskName: "Q2 Sales Goal"
	 * });
	 */
	async replyToComment({
		mainComment,
		replyMessage,
		goalOrTaskName,
		mentionedUser,
	}) {
		await this.globalSearch({ value: goalOrTaskName });
		await CommonUtils.sleep(3);
		await PwActions.hover(this.page, this.getCommentInList(mainComment));
		await PwActions.click(this.page, this.btnReplyComment);
		if (replyMessage) {
			await PwActions.fill(
				this.page,
				this.inputCommentBoxReplyOnEdit,
				replyMessage,
			);
		}
		if (mentionedUser) {
			await CommonUtils.sleep(2);
			await PwActions.clearAndFill(
				this.page,
				this.inputCommentBoxReplyOnEdit,
				replyMessage + " @" + mentionedUser,
			);
			await PwActions.click(this.page, this.getMentionedUser(mentionedUser));
		}
		await PwActions.click(this.page, this.btnPostComment);
		await PwActions.waitForElementVisibility(
			this.page,
			this.toasterCommentPosted,
		);
		await PwActions.click(this.page, this.btnCloseSidePanel);
	}

	/**
	 * Edits an existing comment on a goal or task, optionally mentioning a user in the edited comment.
	 *
	 * @param {Object} params - The edit parameters.
	 * @param {string} params.comment - The original comment text to edit.
	 * @param {string} params.editedComment - The new comment text.
	 * @param {string} params.goalOrTaskName - The name of the goal or task.
	 * @param {string} [params.mentionedUser] - The username to mention in the edited comment.
	 * @example
	 * // Edit a comment and mention a user
	 * await goalsCommonPage.editComment({
	 *   comment: "Great progress!",
	 *   editedComment: "Great progress! @john.doe",
	 *   goalOrTaskName: "Q2 Sales Goal",
	 *   mentionedUser: "john.doe"
	 * });
	 * @example
	 * // Edit a comment without mentioning anyone
	 * await goalsCommonPage.editComment({
	 *   comment: "Let's keep up the good work.",
	 *   editedComment: "Let's keep up the great work.",
	 *   goalOrTaskName: "Q2 Sales Goal"
	 * });
	 */
	async editComment({ comment, editedComment, goalOrTaskName, mentionedUser }) {
		await this.globalSearch({ value: goalOrTaskName });
		await CommonUtils.sleep(3);
		await PwActions.hover(this.page, this.getCommentInList(comment));
		await PwActions.click(this.page, this.btnMoreOptionsComment);
		await this.commonfunctions.getMenuItem(this.page, "Edit Comment");
		await CommonUtils.sleep(1);
		await PwActions.fill(
			this.page,
			this.inputCommentBoxReplyOnEdit,
			editedComment,
		);
		if (mentionedUser) {
			await CommonUtils.sleep(2);
			await PwActions.clearAndFill(
				this.page,
				this.inputCommentBoxReplyOnEdit,
				editedComment + " @" + mentionedUser,
			);
			await PwActions.click(this.page, this.getMentionedUser(mentionedUser));
		}
		await PwActions.click(this.page, this.btnPostComment);
		await PwActions.waitForElementVisibility(
			this.page,
			this.toasterCommentEdited,
		);
		await PwActions.click(this.page, this.btnCloseSidePanel);
	}

	/**
	 * Verifies audit log entries in the Activity tab for a goal.
	 * Opens the goal's side panel, navigates to Activity tab, and verifies expected logs in strict order.
	 * Supports both simple log entries (strings) and grouped log entries (objects with sub-items).
	 *
	 * @param {object} options
	 * @param {string} options.goalName - Name of the goal to verify logs for
	 * @param {boolean} [options.alreadyOpen=false] - If true, assumes side panel is already open
	 * @param {Array<string|object>} options.expectedLogs - Array of expected log entries in order (newest first)
	 *   - String: simple log entry text (e.g., "Eswar deleted an aligned task")
	 *   - Object: grouped log with format { "summary text": { updates: ["item1", "item2"], fallbackMatchUpdatesInAnyEntry?: boolean } }
	 *     When `fallbackMatchUpdatesInAnyEntry` is true, if the summary text is not found on the expected log row, each `updates` string is searched across all activity entries (handles UI showing separate lines instead of a grouped header).
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // After creating a goal with supporting items
	 * await goalsCommonPage.verifyAuditLogs({
	 *   goalName: "Q1 Revenue Goal",
	 *   alreadyOpen: true,
	 *   expectedLogs: [
	 *     {
	 *       "Eswar made 3 updates": {
	 *         updates: ["created Goal", "aligned Task", "aligned 1"]
	 *       }
	 *     }
	 *   ]
	 * });
	 *
	 * @example
	 * // After updating goal status
	 * await goalsCommonPage.verifyAuditLogs({
	 *   goalName: "Q1 Revenue Goal",
	 *   expectedLogs: [
	 *     "Eswar updated current Objective status to \"On Track\""
	 *   ]
	 * });
	 *
	 * @example
	 * // Multiple actions with mixed log types
	 * await goalsCommonPage.verifyAuditLogs({
	 *   goalName: "Q1 Revenue Goal",
	 *   expectedLogs: [
	 *     "Eswar checked in",
	 *     "Eswar deleted an aligned task",
	 *     {
	 *       "Eswar made 2 updates": {
	 *         updates: ["updated Goal description", "added a participant"]
	 *       }
	 *     }
	 *   ]
	 * });
	 *
	 * @example
	 * // Grouped summary optional: match each update on any activity row if grouped header missing
	 * await goalsCommonPage.verifyAuditLogs({
	 *   goalName: "Q1 Revenue Goal",
	 *   expectedLogs: [
	 *     {
	 *       "made 2 updates": {
	 *         updates: ['System unaligned "Child"', 'Eswar archived "Child"'],
	 *         fallbackMatchUpdatesInAnyEntry: true,
	 *       },
	 *     },
	 *   ],
	 * });
	 */
	async verifyAuditLogs({ goalName, alreadyOpen = false, expectedLogs }) {
		const { page } = this;
		await PwActions.pageRefresh(page);
		const normalizeText = (text) => {
			return text
				.replace(/\s+/g, "")
				.replace(/[",'\[\]]/g, "")
				.toLowerCase();
		};

		if (!alreadyOpen) {
			await this.globalSearch({ value: goalName });
		}
		await CommonUtils.sleep(10);
		await PwActions.pageRefresh(page);
		await PwActions.click(page, this.tabActivity);
		await PwActions.waitTillVisible(page, this.tabPanelActivity);
		await CommonUtils.sleep(10);

		const allLogElements = await PwActions.getWebElementsPage(
			page,
			this.activityLogEntry,
		);

		if (allLogElements.length === 0) {
			throw new Error(`No activity logs found for goal "${goalName}"`);
		}

		logger.info(
			`Found ${allLogElements.length} activity log entries for goal "${goalName}"`,
		);

		for (let i = 0; i < expectedLogs.length; i++) {
			const expectedLog = expectedLogs[i];

			if (typeof expectedLog === "string") {
				const actualText = await allLogElements[i].textContent();
				const normalizedActual = normalizeText(actualText);
				const normalizedExpected = normalizeText(expectedLog);

				try {
					await PwActions.verifyTextContains(
						normalizedActual,
						normalizedExpected,
					);
					logger.info(
						`✓ Verified simple log at position ${i}: "${expectedLog}"`,
					);
				} catch (error) {
					throw new Error(
						`Log entry at position ${i} does not match.\n` +
							`Expected (normalized): "${normalizedExpected}"\n` +
							`Actual (normalized): "${normalizedActual}"\n` +
							`Actual (raw): "${actualText}"`,
					);
				}
			} else if (typeof expectedLog === "object") {
				const summaryText = Object.keys(expectedLog)[0];
				const groupConfig = expectedLog[summaryText];
				const { updates, fallbackMatchUpdatesInAnyEntry = false } = groupConfig;

				const actualText = await allLogElements[i].textContent();
				const normalizedActual = normalizeText(actualText);
				const normalizedExpected = normalizeText(summaryText);

				let summaryMatched = false;
				try {
					await PwActions.verifyTextContains(
						normalizedActual,
						normalizedExpected,
					);
					summaryMatched = true;
					logger.info(
						`✓ Verified grouped log summary at position ${i}: "${summaryText}"`,
					);
				} catch (error) {
					if (!fallbackMatchUpdatesInAnyEntry) {
						throw new Error(
							`Grouped log summary at position ${i} does not match.\n` +
								`Expected (normalized): "${normalizedExpected}"\n` +
								`Actual (normalized): "${normalizedActual}"\n` +
								`Actual (raw): "${actualText}"`,
						);
					}
					logger.info(
						`Grouped summary "${summaryText}" not at position ${i}; using fallback: match each update in any activity entry`,
					);
				}

				const verifyUpdatesAcrossAllEntries = async () => {
					const allNormalizedTexts = [];
					for (const el of allLogElements) {
						const t = await el.textContent();
						allNormalizedTexts.push(normalizeText(t));
					}
					for (const expectedSubItem of updates) {
						const normalizedExpectedSub = normalizeText(expectedSubItem);
						let found = false;
						for (const actualNormalized of allNormalizedTexts) {
							try {
								await PwActions.verifyTextContains(
									actualNormalized,
									normalizedExpectedSub,
								);
								found = true;
								break;
							} catch {
								continue;
							}
						}
						if (!found) {
							throw new Error(
								`Fallback: sub-item "${expectedSubItem}" not found in any activity log entry.\n` +
									`Expected (normalized): "${normalizedExpectedSub}"`,
							);
						}
						logger.info(
							`  ✓ Verified sub-item (loose, any entry): "${expectedSubItem}"`,
						);
					}
				};

				if (!summaryMatched) {
					await verifyUpdatesAcrossAllEntries();
					continue;
				}

				await PwActions.click(page, this.groupedLogExpandButton(summaryText));
				await CommonUtils.sleep(1);

				const expandedItems = await PwActions.getWebElementsPage(
					page,
					this.expandedGroupedItems(summaryText),
				);

				if (expandedItems.length < updates.length) {
					if (fallbackMatchUpdatesInAnyEntry) {
						logger.info(
							`Grouped expand returned ${expandedItems.length} sub-items (expected ${updates.length}); falling back to any-entry match`,
						);
						await verifyUpdatesAcrossAllEntries();
						continue;
					}
					throw new Error(
						`Expected ${updates.length} sub-items in grouped log, but found ${expandedItems.length}`,
					);
				}

				const actualSubItemTexts = await PwActions.getElementsText(
					page,
					expandedItems,
				);
				const normalizedActualSubItems = actualSubItemTexts.map(normalizeText);

				let groupedSubItemsOk = true;
				const missingAfterGrouped = [];

				for (const expectedSubItem of updates) {
					const normalizedExpectedSub = normalizeText(expectedSubItem);
					let found = false;

					for (const actualNormalized of normalizedActualSubItems) {
						try {
							await PwActions.verifyTextContains(
								actualNormalized,
								normalizedExpectedSub,
							);
							found = true;
							break;
						} catch (error) {
							continue;
						}
					}

					if (!found) {
						groupedSubItemsOk = false;
						missingAfterGrouped.push(expectedSubItem);
					} else {
						logger.info(`  ✓ Verified sub-item: "${expectedSubItem}"`);
					}
				}

				if (!groupedSubItemsOk) {
					if (fallbackMatchUpdatesInAnyEntry) {
						logger.info(
							`Some sub-items missing under grouped expand (${missingAfterGrouped.join("; ")}); falling back to any-entry match`,
						);
						await verifyUpdatesAcrossAllEntries();
					} else {
						const normalizedExpectedSub = normalizeText(missingAfterGrouped[0]);
						throw new Error(
							`Sub-item "${missingAfterGrouped[0]}" not found in grouped log.\n` +
								`Expected (normalized): "${normalizedExpectedSub}"\n` +
								`Available sub-items (raw): ${JSON.stringify(actualSubItemTexts, null, 2)}`,
						);
					}
				}
			}
		}

		logger.info(
			`✅ All ${expectedLogs.length} audit log entries verified successfully for goal "${goalName}"`,
		);
		await PwActions.click(page, this.btnCloseSidePanel);
	}

	/**
	 *
	 * @param {Array<Object>} inlineCreatePayload - The payload which we get from constants.getGoalCreatePayload()
	 * This function is used to create a goal/task inline in the goal table.
	 * It is used to create a goal/task inline in the goal table.
	 * @example
	 * const inlineCreatePayload = constants.getGoalCreatePayload("goal_with_children_and_krs", "John Doe", "Parent Goal", "Imported Child Goal");
	 * await goalsCommonPage.createGoalInline(inlineCreatePayload);
	 *
	 * @see constants.getGoalCreatePayload() - Use this to generate proper payloads
	 * @see Scenarios: "goal_with_children_and_krs"
	 */
	async createGoalInline(inlineCreatePayload) {
		await PwActions.pageRefresh(this.page);
		if (!inlineCreatePayload.parentGoal) {
			throw new Error("Parent goal is required for inline creation");
		}
		const { page } = this;
		await PwActions.click(
			page,
			this.btnExpandGoalInLine(inlineCreatePayload.parentGoal),
		);
		if (inlineCreatePayload.type === "GOAL") {
			await PwActions.click(page, this.btnAddGoalInline);
			if (inlineCreatePayload.level) {
				await PwActions.click(page, this.btnGoalLevelInlineCreation);
				await PwActions.click(
					page,
					this.getBtnGoalLevel(inlineCreatePayload.level),
				);
			}
		} else if (inlineCreatePayload.type === "TASK") {
			await PwActions.click(page, this.btnAddTaskInline);
		}
		await PwActions.fill(
			page,
			this.txtBoxActiveInputLine,
			inlineCreatePayload.goalName,
		);
		if (inlineCreatePayload.owner) {
			await PwActions.click(page, this.btnGoalOwnerInSupportingItem);
			await PwActions.fill(
				page,
				this.inputOwnerInSupportingItem,
				inlineCreatePayload.owner,
			);
			await PwActions.click(
				page,
				this.getOwnerInSupportingItem(inlineCreatePayload.owner),
			);
		}
		if (inlineCreatePayload.visibility) {
			await PwActions.click(page, this.btnVisibilityInline);
			await PwActions.click(
				page,
				this.getVisibilityDropDownInline(inlineCreatePayload.visibility),
			);
		}
		await PwActions.click(page, this.btnDueDateEditor);
		const randomClicks = Math.ceil(Math.random() * 3);
		await Promise.all(
			Array.from({ length: randomClicks }).map(() =>
				PwActions.click(page, this.btnNextInCalendar),
			),
		);
		const randomNumber = Math.ceil(Math.random() * 28);
		await PwActions.click(page, this.btnCalendarDate(randomNumber));
		await PwActions.click(page, this.btnSelectOnCalendar);
		await PwActions.click(page, this.btnSaveButtonInlineCreator);
	}
	/**
	 * Updates the goal with random data.
	 * @param {Object} goalData - The goal details (not used, random data will be applied).
	 * @param {Object} browser - The browser instance.
	 * @example
	 * const goalData = constants.getGoalCreatePayload("only_goal", "John Doe");
	 * const updatedGoalData = await goalsCommonPage.updateGoal(goalData, browser);
	 *
	 * @see constants.getGoalCreatePayload() - Use this to generate proper payloads
	 * @returns {Promise<Object>} The returned object will contain the updated goal details,
	 *   such as:
	 *   {
	 *     goalName: string,             // The name of the goal
	 *     goalDescription: string,      // Updated or original goal description
	 *     owner: string,                // Owner of the goal (if present)
	 *     visibility: string,           // Visibility setting (e.g., "Public", "Private", etc.)
	 *     cycle: string,                // Goal cycle (if present)
	 *     supportingItem: Array<Object>,// Updated supporting items with progress/status, if any
	 *     goalLevel: string,            // Goal level (optional)
	 *     parentGoal: string,           // Parent goal (optional)
	 *     participants: Array<Object>,  // Participants with their roles and owners (optional)
	 *     status: string,               // The randomly assigned goal status after update
	 *     ...other goalData fields      // Any other fields passed or updated
	 *   }
	 */
	async updateGoal(goalData, browser) {
		if (!goalData?.goalName) {
			throw new Error(
				"Goal data with goalName is required for updating the goal",
			);
		}
		let updatePage = null;
		updatePage = await PwActions.openNewTab(browser);
		await PwActions.goTo(updatePage, envDetails.url);
		await this.loginpage.login(
			updatePage,
			envDetails.goalsUserEmail,
			envDetails.goalsPassword,
		);

		await this.commonfunctions.navigateTopNavigateSection("Goals", updatePage);
		await PwActions.click(updatePage, this.btnGlobalSearch);
		await PwActions.fill(updatePage, this.inputGlobalSearch, goalData.goalName);
		await PwActions.click(
			updatePage,
			this.getOptionInGlobalSearch(goalData.goalName),
		);
		await PwActions.click(updatePage, this.btnStatusSidePanel);
		const statusElements = await PwActions.getWebElements(
			updatePage,
			this.webElementsForStatusSidePanel,
		);
		const statusOptions = await Promise.all(
			statusElements.map(async (el) => ({
				element: el,
				text: (await el.textContent()).trim(),
			})),
		);

		const availableStatuses = statusOptions.filter(
			(item) => item.text !== "Completed",
		);
		const selectedStatus = CommonUtils.getRandomElement(availableStatuses);
		goalData.status = selectedStatus.text;
		await selectedStatus.element.click();
		if (goalData.supportingItem?.length > 0) {
			for (const item of goalData.supportingItem) {
				await PwActions.hover(
					updatePage,
					this.getSupportingItemInSidePanel(item.title),
				);
				await PwActions.click(
					updatePage,
					this.btnUpdatePencilButtonForOkrs(item.title),
				);
				if (item.type === "TASK") {
					if (item.metric === "Decision") {
						await PwActions.click(updatePage, this.btnMarkAsDone);
					} else {
						item.currentValue = CommonUtils.getRandomIntInclusive(
							item.startValue,
							item.targetValue,
						);
						await PwActions.fill(
							updatePage,
							this.txtInputCurrentValue,
							String(item.currentValue),
						);
					}
				}
				const progressStatusElements = await PwActions.getWebElements(
					updatePage,
					this.webElementsForProgressStatusPopover,
				);
				const statusOptions = await Promise.all(
					progressStatusElements.map(async (el) => ({
						element: el,
						text: (await el.textContent()).trim(),
					})),
				);

				const availableStatuses = statusOptions.filter(
					(item) => item.text !== "Not Started",
				);
				const selectedProgressStatus =
					CommonUtils.getRandomElement(availableStatuses);
				item.status = selectedProgressStatus.text;
				await selectedProgressStatus.element.click();

				await PwActions.click(updatePage, this.btnStatusPopOverDone);
			}
		}
		await PwActions.closeTab(updatePage);
		return goalData;
	}
	/**
	 * Checks in (updates progress/status for) one or more goals.
	 *
	 * This function performs check-in operations on the specified goals, updating their statuses and progress values as appropriate.
	 *
	 * @param {Object} options - The options object.
	 * @param {Object} options.goalData - The goal details to check in.
	 * @param {string} [options.checkInType="sidePanel"] - The type of check-in to perform (e.g., "sidePanel", "listing").
	 * @param {Object} [options.assigneeCredential] - The assignee credential to use for performing the check-in.
	 * @param {Object} browser - The browser instance to use for automation.
	 *
	 * @example
	 * const goalData = constants.getGoalCreatePayload("only_goal", "John Doe");
	 * await goalsCommonPage.checkInGoals({ goalData }, browser);
	 *
	 * @see constants.getGoalCreatePayload() - Used to generate example test goal payloads.
	 * @returns {Promise<Object>} The updated goal details, containing all original fields plus any changes made during check-in,
	 *   such as:
	 *   {
	 *     goalName: string,
	 *     goalDescription: string,
	 *     owner: string,
	 *     visibility: string,
	 *     cycle: string,
	 *     supportingItem: Array<Object>,
	 *     goalLevel?: string,
	 *     parentGoal?: string,
	 *     participants?: Array<Object>,
	 *     status: string, // The updated status after check-in
	 *     // ...other original or updated goalData fields
	 *   }
	 */
	async checkInGoals(
		{ goalData, checkInType = "sidePanel", assigneeCredential },
		browser,
	) {
		if (!goalData) {
			throw new Error("Goal data is required for check-in");
		}
		let checkInPage = null;
		checkInPage = await PwActions.openNewTab(browser);
		await PwActions.goTo(checkInPage, envDetails.url);
		await this.loginpage.login(
			checkInPage,
			assigneeCredential.email,
			assigneeCredential.password,
		);
		await CommonUtils.sleep(2);
		await this.commonfunctions.navigateTopNavigateSection("Goals", checkInPage);
		if (checkInType === "sidePanel") {
			await this.globalSearch({ page: checkInPage, value: goalData.goalName });
			await PwActions.click(checkInPage, this.btnCheckInSidePanel);
		} else {
			await PwActions.hover(
				checkInPage,
				this.txtStatusForOkrInListing(goalData.goalName),
			);
			await PwActions.click(
				checkInPage,
				this.btnUpdatePencilButtonForOkrs(goalData.goalName),
			);
			await PwActions.click(checkInPage, this.btnCheckInForOkrInListing);
		}
		for (const item of goalData.supportingItem) {
			if (item.type === "TASK") {
				if (item.metric === "Decision") {
					await PwActions.click(
						checkInPage,
						this.btnMarkAsDoneInBulkCheckIn(item.title),
					);
					item.status = "Completed";
				} else {
					item.currentValue = CommonUtils.getRandomIntInclusive(
						item.startValue,
						item.targetValue,
					);
					await PwActions.fill(
						checkInPage,
						this.inputCurrentValueInBulkCheckIn(item.title),
						String(item.currentValue),
					);
					await PwActions.click(
						checkInPage,
						this.dropDownForStatusInBulkCheckIn(item.title),
					);
					const statusElements = await PwActions.getWebElements(
						checkInPage,
						this.webElementsForStatusInBulkCheckIn,
					);
					const statusOptions = await Promise.all(
						statusElements.map(async (el) => ({
							element: el,
							text: (await el.textContent()).trim(),
						})),
					);

					const availableStatuses = statusOptions.filter(
						(option) =>
							option.text !== "Not Started" && option.text !== "Completed",
					);
					const selectedStatus =
						CommonUtils.getRandomElement(availableStatuses);
					item.status = selectedStatus.text;
					await selectedStatus.element.click();
				}
			}
		}
		await PwActions.click(checkInPage, this.btnUpdateCheckIn);
		return goalData;
	}

	/**
	 * Executes actions on goals for multiple users without permission validation.
	 * Directly performs actions on goal elements for testing purposes.
	 * @param {object} params - Parameters object
	 * @param {string} params.goalName - Name of the goal to execute actions on
	 * @param {Array} params.userDetailsArray - Array of user details
	 * @param {object} params.browser - Playwright browser instance
	 * @example
	 * // Verifying access on goal
	 * await goalsCommonPage.verifyAccessOnGoal({ goalName: "My New Goal", userDetailsArray: [okrPermissionsOfRoles.goal_manager], browser: browser });
	 */
	/**
	 * Unified function to verify access permissions on a goal or task for multiple users
	 * @param {Object} options - Configuration object
	 * @param {string} options.itemName - The name of the goal or task to verify access for
	 * @param {string} [options.itemType="goal"] - Type of item: "goal" or "task"
	 * @param {Array<Object>} options.userDetailsArray - Array of user details with permissions
	 * @param {Object} options.browser - Playwright browser instance
	 * @example
	 * // Verify goal access
	 * await goalsCommonPage.verifyAccess({
	 *   itemName: "My Goal",
	 *   itemType: "goal",
	 *   userDetailsArray: [
	 *     { role: "Creator", goalPermissions: { canView: true, canEdit: true } }
	 *   ],
	 *   browser: browser
	 * });
	 * @example
	 * // Verify task access
	 * await goalsCommonPage.verifyAccess({
	 *   itemName: "My Task",
	 *   itemType: "task",
	 *   userDetailsArray: [
	 *     { role: "Creator", taskPermissions: { canView: true, canEdit: true } }
	 *   ],
	 *   browser: browser
	 * });
	 */
	async verifyAccess({
		itemName,
		itemType = "goal",
		userDetailsArray = [],
		browser,
	}) {
		const executeUserActions = async (userDetails) => {
			const verificationPage = await PwActions.openNewTab(browser);
			try {
				await PwActions.goTo(verificationPage, envDetails.url);
				await this.loginpage.login(
					verificationPage,
					envDetails.goalsUserEmail,
					envDetails.goalsPassword,
				);
				await this.commonfunctions.navigateTopNavigateSection(
					"Goals",
					verificationPage,
				);

				// Determine permissions based on item type
				let userPermissions;
				if (itemType === "goal") {
					// Combine goal and task permissions for goals
					userPermissions = {
						canView: !!(
							userDetails.goalPermissions?.canView ||
							userDetails.taskPermissions?.canView
						),
						canEdit: !!(
							userDetails.goalPermissions?.canEdit ||
							userDetails.taskPermissions?.canEdit
						),
						canUpdate: !!(
							userDetails.goalPermissions?.canUpdate ||
							userDetails.taskPermissions?.canUpdate
						),
						canDelete: !!(
							userDetails.goalPermissions?.canDelete ||
							userDetails.taskPermissions?.canDelete
						),
					};
				} else {
					// Use task permissions only for tasks
					userPermissions = {
						canView: !!userDetails.taskPermissions?.canView,
						canEdit: !!userDetails.taskPermissions?.canEdit,
						canUpdate: !!userDetails.taskPermissions?.canUpdate,
						canDelete: !!userDetails.taskPermissions?.canDelete,
					};
				}

				const userRole = userDetails.role || userDetails.roleName || "User";
				logger.info(
					`Validating access for ${userRole} on ${itemType}: ${itemName}`,
				);

				// Check item visibility in search
				await PwActions.click(verificationPage, this.btnGlobalSearch);
				await PwActions.fill(
					verificationPage,
					this.inputGlobalSearch,
					itemName,
				);
				const itemSelector = this.getOptionInGlobalSearch(itemName);
				await PwActions.waitForElementVisibility(
					verificationPage,
					itemSelector,
				);
				const isItemPresent = await PwActions.elementIsVisible(
					verificationPage,
					itemSelector,
				);

				if (userPermissions.canView) {
					if (!isItemPresent) {
						throw new Error(
							`[${userRole}] ${itemType} "${itemName}" should be visible but was not found`,
						);
					}
					logger.info(`[${userRole}] ${itemType} visibility check passed`);
					await PwActions.click(verificationPage, itemSelector);
				} else {
					if (isItemPresent) {
						throw new Error(
							`[${userRole}] ${itemType} "${itemName}" should NOT be visible but was found`,
						);
					}
					logger.info(
						`[${userRole}] ${itemType} restriction check passed - not visible as expected`,
					);
					return;
				}

				// Get elements to validate based on item type
				const elementsToValidate =
					itemType === "goal"
						? [
								"goalName",
								"goalDescription",
								"dueBy",
								"visibility",
								"cycle",
								"alignParent",
								"okrStatus",
								"archiveGoal",
								"goalLevel",
								"sendReminder",
								"goalOwner",
								"task",
								"goalParticipants",
								"deleteGoal",
							]
						: [
								"taskName",
								"taskDescription",
								"taskOwner",
								"dueBy",
								"visibility",
								"cycle",
								"metric",
								"alignParent",
								"taskStatus",
								"taskParticipants",
								"taskInitiative",
								"taskIntegration",
								"archiveTask",
								"deleteTask",
							];

				let actionsExecuted = 0;
				let totalActions = 0;

				for (const locatorKey of elementsToValidate) {
					try {
						logger.info(
							`[${userRole}] Executing direct action for ${locatorKey}`,
						);
						const result = await this.executePermissionBasedAction(
							verificationPage,
							locatorKey,
							userPermissions,
							userRole,
							itemType, // Pass item type to the execution function
						);
						logger.info(
							`[${userRole}] Result of action for ${locatorKey}: ${result}`,
						);
						if (result === true || result === false) {
							expect(result).toBe(true);
						}
						await CommonUtils.sleep(1);
						actionsExecuted++;
						totalActions++;
					} catch (error) {
						logger.error(
							`[${userRole}] Error executing action for ${locatorKey}: ${error.message}`,
						);
						throw error;
					}
				}
				logger.info(
					`[${userRole}] Action execution completed: ${actionsExecuted}/${totalActions} actions executed successfully`,
				);
			} catch (error) {
				const roleKey =
					userDetails.role || userDetails.roleName || "Unknown Role";
				logger.error(
					`Error executing actions on ${itemType} ${itemName} for role ${roleKey}: ${error.message}`,
				);
				throw error;
			} finally {
				await verificationPage.close();
			}
		};

		for (const userDetails of userDetailsArray) {
			await executeUserActions(userDetails);
		}
	}

	/**
	 * Verifies access permissions on a goal for multiple users
	 * @param {Object} options - Configuration object
	 * @param {string} options.goalName - The name of the goal to verify access for
	 * @param {Array<Object>} options.userDetailsArray - Array of user details with permissions
	 * @param {Object} options.browser - Playwright browser instance
	 * @example
	 * await goalsCommonPage.verifyAccessOnGoal({
	 *   goalName: "My Goal",
	 *   userDetailsArray: [
	 *     { role: "Creator", goalPermissions: { canView: true, canEdit: true } },
	 *     { role: "Viewer", goalPermissions: { canView: true, canEdit: false } }
	 *   ],
	 *   browser: browser
	 * });
	 */
	async verifyAccessOnGoal({ goalName, userDetailsArray = [], browser }) {
		return this.verifyAccess({
			itemName: goalName,
			itemType: "goal",
			userDetailsArray,
			browser,
		});
	}

	/**
	 * Verifies access permissions on a task for multiple users
	 * @param {Object} options - Configuration object
	 * @param {string} options.taskName - The name of the task to verify access for
	 * @param {Array<Object>} options.userDetailsArray - Array of user details with permissions
	 * @param {Object} options.browser - Playwright browser instance
	 * @example
	 * await goalsCommonPage.verifyAccessOnTask({
	 *   taskName: "My Task",
	 *   userDetailsArray: [
	 *     { role: "Creator", taskPermissions: { canView: true, canEdit: true } },
	 *     { role: "Viewer", taskPermissions: { canView: true, canEdit: false } }
	 *   ],
	 *   browser: browser
	 * });
	 */
	async verifyAccessOnTask({ taskName, userDetailsArray = [], browser }) {
		return this.verifyAccess({
			itemName: taskName,
			itemType: "task",
			userDetailsArray,
			browser,
		});
	}

	/**
	 * Unified function to execute permission-based actions for goals or tasks
	 * @param {Object} page - Playwright page object
	 * @param {string} locatorKey - Element key
	 * @param {Object} userPermissions - User permission object with canView, canEdit, canUpdate, canDelete flags
	 * @param {string} [userRole="User"] - User role for logging
	 * @param {string} [itemType="goal"] - Type of item: "goal" or "task"
	 * @returns {Promise<boolean>} Result of the action execution
	 * @example
	 * // Executing permission-based action for goalName
	 * await goalsCommonPage.executePermissionBasedAction(page, "goalName", { canView: true, canEdit: true, canUpdate: true }, "Manager", "goal");
	 * @example
	 * // Executing permission-based action for taskName
	 * await goalsCommonPage.executePermissionBasedAction(page, "taskName", { canView: true, canEdit: true, canUpdate: true }, "Manager", "task");
	 */
	async executePermissionBasedAction(
		page,
		locatorKey,
		userPermissions,
		userRole = "User",
		itemType = "goal",
	) {
		// Get the appropriate permission element access map
		const permissionElementAccessMap =
			itemType === "goal"
				? this.getGoalPermissionElementAccessMap()
				: this.getTaskPermissionElementAccessMap();

		const config = permissionElementAccessMap[locatorKey];

		if (!config || !config.actions) {
			throw new Error(`No actions defined for ${locatorKey}`);
		}

		try {
			logger.info(
				`[${userRole}] Executing permission-based action for ${locatorKey} on ${itemType}`,
			);

			const hasEditPermission = (perms) => perms.canEdit;
			const hasViewPermission = (perms) => perms.canView;
			const hasUpdatePermission = (perms) => perms.canUpdate;
			const hasDeletePermission = (perms) => perms.canDelete;
			const hasEditOrUpdatePermission = (perms) =>
				perms.canEdit || perms.canUpdate;
			const hasViewOrUpdatePermission = (perms) =>
				perms.canView || perms.canUpdate;
			const hasAnyPermission = (perms) =>
				perms.canView || perms.canEdit || perms.canUpdate || perms.canDelete;

			// Define permission mappings based on item type
			const permissionMappings = {
				// Goal-specific mappings
				okrStatus: [
					{
						actionKey: "canEdit || canUpdate",
						check: hasEditOrUpdatePermission,
						description: "Update status (Editor or Updater role)",
					},
					{
						actionKey: "canView",
						check: hasViewPermission,
						description: "View status only (Viewer role)",
					},
				],
				deleteGoal: [
					{
						actionKey: "canDelete",
						check: hasDeletePermission,
						description: "Delete goal (requires Delete permission)",
					},
					{
						actionKey: "canView || canEdit || canUpdate || canDelete",
						check: hasAnyPermission,
						description:
							"Check if actions dropdown is visible (any permission)",
					},
				],
				task: [
					{
						actionKey: "canEdit || canUpdate",
						check: hasEditOrUpdatePermission,
						description: "Add/manage tasks (Editor or Updater role)",
					},
					{
						actionKey: "canView",
						check: hasViewPermission,
						description: "View tasks only (Viewer role)",
					},
				],
				// Task-specific mappings
				metric: [
					{
						actionKey: "canEdit",
						check: hasEditPermission,
						description: "Edit metric (Editor role)",
					},
					{
						actionKey: "canUpdate",
						check: hasUpdatePermission,
						description: "Update metric (Updater role)",
					},
					{
						actionKey: "canView",
						check: hasViewPermission,
						description: "View metric only (Viewer role)",
					},
				],
				deleteTask: [
					{
						actionKey: "canDelete",
						check: hasDeletePermission,
						description: "Delete task (requires Delete permission)",
					},
					{
						actionKey: "canView || canUpdate",
						check: hasViewOrUpdatePermission,
						description:
							"Check if actions dropdown is visible (Viewer/Updater permission)",
					},
				],
				taskInitiative: [
					{
						actionKey: "canEdit || canUpdate",
						check: hasEditOrUpdatePermission,
						description: "Add/manage initiatives (Editor or Updater role)",
					},
					{
						actionKey: "canView",
						check: hasViewPermission,
						description: "View initiatives only (Viewer role)",
					},
				],
				taskIntegration: [
					{
						actionKey: "canEdit || canUpdate",
						check: hasEditOrUpdatePermission,
						description: "Add/manage integrations (Editor or Updater role)",
					},
					{
						actionKey: "canView",
						check: hasViewPermission,
						description: "View integrations only (Viewer role)",
					},
				],
				taskStatus: [
					{
						actionKey: "canEdit || canUpdate",
						check: hasEditOrUpdatePermission,
						description: "Edit/update task status (Editor or Updater role)",
					},
					{
						actionKey: "canView",
						check: hasViewPermission,
						description: "View task status only (Viewer role)",
					},
				],
				// Default mapping
				default: [
					{
						actionKey: "canEdit",
						check: hasEditPermission,
						description: "Full edit access (Editor role)",
					},
					{
						actionKey: "canView || canUpdate",
						check: hasViewOrUpdatePermission,
						description: "View or limited update access (Viewer/Updater role)",
					},
				],
			};

			const mapping =
				permissionMappings[locatorKey] || permissionMappings.default;
			let actionToCall = null;
			let actionKey = null;
			for (const mappingItem of mapping) {
				const hasRequiredPermission = mappingItem.check(userPermissions);
				const actionExists = config.actions[mappingItem.actionKey];

				if (hasRequiredPermission && actionExists) {
					actionToCall = config.actions[mappingItem.actionKey];
					actionKey = mappingItem.actionKey;
					logger.info(
						`[${userRole}] Matched permission: ${mappingItem.description}`,
					);
					break;
				}
			}

			if (!actionToCall) {
				throw new Error(
					`No suitable action found for ${locatorKey} with permissions: ${JSON.stringify(userPermissions)}`,
				);
			}

			logger.info(`[${userRole}] Using action: ${actionKey} for ${locatorKey}`);

			// Define arguments for canEdit actions based on item type
			const canEditArguments =
				itemType === "goal"
					? {
							goalName: `Test GoalName for ${userRole}`,
							goalDescription: `Test GoalDescription for ${userRole}`,
							goalOwner: null,
							visibility: "Public",
							cycle: envDetails.goalCycle,
						}
					: {
							taskName: `Test TaskName for ${userRole}`,
							taskDescription: `Test TaskDescription for ${userRole}`,
							taskOwner: null,
							cycle: envDetails.goalCycle,
							metric: "Number",
						};

			// Determine the arguments to pass to the action
			const args = [page];
			if (
				actionKey === "canEdit" &&
				canEditArguments.hasOwnProperty(locatorKey)
			) {
				args.push(canEditArguments[locatorKey]);
			} else if (actionKey === "canUpdate" && locatorKey === "metric") {
				args.push("Number");
			} else if (actionKey === "canView" && locatorKey === "metric") {
				args.push("Number");
			}

			// Execute the action with the determined arguments
			const result = await actionToCall(...args);

			logger.info(
				`[${userRole}] Successfully executed ${actionKey} action for ${locatorKey}`,
			);
			return result;
		} catch (error) {
			logger.error(
				`[${userRole}] Failed to execute permission-based action for ${locatorKey}: ${error.message}`,
			);
			throw error;
		}
	}

	/**
	 * Verifies the permission for goal creation by logging in as multiple users
	 * and checking the UI based on the permission object.
	 * Utilizes PwActions, LoginPage, and CommonUtils utilities.
	 * @param {object} options - Configuration object
	 * @param {object} [options.permission] - The permission object (optional for admin roles).
	 * @param {boolean} [options.permission.allowEmployeeToCreateGoal] - Whether to allow employee to create goal.
	 * @param {boolean} [options.permission.allowManagerToCreateTeamGoal] - Whether to allow manager to create team goal.
	 * @param {boolean} [options.permission.allowDeptHeadToCreateDeptGoal] - Whether to allow dept head to create dept goal.
	 * @param {Array<object>} options.userDetailsArray - Array of user details for login (role, email, password, etc.)
	 * @param {object} options.browser - Playwright browser instance
	 * @example
	 * await goalsCommonPage.verifyPermissionForGoalCreation({
	 *   permission: {
	 *     allowManagerToCreateTeamGoal: true,
	 *     allowDeptHeadToCreateDeptGoal: true,
	 *     allowEmployeeToCreateGoal: true,
	 *   },
	 *   userDetailsArray: [...],
	 *   browser: ...,
	 * });
	 * @example
	 * await goalsCommonPage.verifyPermissionForGoalCreation({
	 *   permission: {
	 *     allowManagerToCreateTeamGoal: false,
	 *     allowDeptHeadToCreateDeptGoal: false,
	 *     allowEmployeeToCreateGoal: false,
	 *   },
	 *   userDetailsArray: [...],
	 *   browser: ...,
	 * });
	 */
	async verifyPermissionForGoalCreation({
		permission = {},
		userDetailsArray = [],
		browser,
	}) {
		const {
			allowEmployeeToCreateGoal,
			allowManagerToCreateTeamGoal,
			allowDeptHeadToCreateDeptGoal,
		} = permission;

		const ADMIN_ROLES = new Set([
			"Super Admin",
			"Admin",
			"HRBP",
			"Goal Admin",
			"Goal Writer",
		]);

		const validateUserPermissions = async (userDetails) => {
			const { role = "User", username, password } = userDetails;
			const verificationPage = await PwActions.openNewTab(browser);

			await PwActions.goTo(verificationPage, envDetails.uri);
			await this.loginpage.login(verificationPage, username, password);
			await this.commonfunctions.navigateTopNavigateSection(
				"Goals",
				verificationPage,
			);
			await CommonUtils.sleep(5);

			const newGoalVisible = await PwActions.elementIsVisible(
				verificationPage,
				this.btnNewGoal,
			);

			if (allowEmployeeToCreateGoal === false && role === "Employee") {
				if (newGoalVisible) {
					await PwActions.closeTab(verificationPage);
					throw new Error(
						`[Employee] The "New Goal" button should NOT be visible when allowEmployeeToCreateGoal is false`,
					);
				}
				await PwActions.closeTab(verificationPage);
				return;
			}

			if (!newGoalVisible) {
				await PwActions.closeTab(verificationPage);
				throw new Error(
					`[${role}] The "New Goal" button should be visible when employee can create goals`,
				);
			}

			await PwActions.click(verificationPage, this.btnNewGoal);
			await PwActions.click(verificationPage, this.btnGoalLevelInSidePanel);

			const [orgVisible, teamVisible, deptVisible, individualVisible] =
				await Promise.all([
					PwActions.elementIsVisible(
						verificationPage,
						this.getBtnGoalLevel("Org"),
					),
					PwActions.elementIsVisible(
						verificationPage,
						this.getBtnGoalLevel("Team"),
					),
					PwActions.elementIsVisible(
						verificationPage,
						this.getBtnGoalLevel("Department"),
					),
					PwActions.elementIsVisible(
						verificationPage,
						this.getBtnGoalLevel("Individual"),
					),
				]);

			const assertVisibility = (visible, expected, level, reason = "") => {
				if (visible !== expected) {
					const action = expected ? "should" : "should NOT";
					const reasonText = reason ? ` ${reason}` : "";
					throw new Error(
						`[${role}] ${level} goal level ${action} be visible${reasonText}`,
					);
				}
			};

			if (ADMIN_ROLES.has(role)) {
				assertVisibility(orgVisible, true, "Org");
				assertVisibility(teamVisible, true, "Team");
				assertVisibility(deptVisible, true, "Department");
				assertVisibility(individualVisible, true, "Individual");
			} else if (role === "Manager") {
				assertVisibility(orgVisible, false, "Org");
				assertVisibility(
					teamVisible,
					allowManagerToCreateTeamGoal,
					"Team",
					allowManagerToCreateTeamGoal
						? "when allowManagerToCreateTeamGoal is true"
						: "when allowManagerToCreateTeamGoal is false",
				);
				assertVisibility(individualVisible, true, "Individual", "for Manager");
			} else if (role === "Department Head") {
				assertVisibility(
					deptVisible,
					allowDeptHeadToCreateDeptGoal,
					"Department",
					allowDeptHeadToCreateDeptGoal
						? "when allowDeptHeadToCreateDeptGoal is true"
						: "when allowDeptHeadToCreateDeptGoal is false",
				);
				assertVisibility(
					individualVisible,
					true,
					"Individual",
					"for Department Head",
				);
			} else if (role === "Employee" && allowEmployeeToCreateGoal !== false) {
				assertVisibility(teamVisible, false, "Team", "for Employee");
				assertVisibility(deptVisible, false, "Department", "for Employee");
				assertVisibility(
					individualVisible,
					true,
					"Individual",
					"when allowEmployeeToCreateGoal is true",
				);
			}

			await PwActions.closeTab(verificationPage);
		};
		for (const userDetails of userDetailsArray) {
			await validateUserPermissions(userDetails);
		}
	}

	/**
	 * Verifies the task/goal filter toggle functionality and validates that only the expected items are displayed.
	 *
	 * This method toggles between showing only tasks or only goals based on the enableTaskFilter parameter,
	 * then verifies that the correct icons are displayed in the list. When filtering for tasks only,
	 * it also ensures no goal icons are present.
	 *
	 * @async
	 * @param {Object} options - Configuration options for the verification
	 * @param {import('playwright').Page} [options.page=this.page] - The Playwright page object to interact with
	 * @param {boolean} [options.enableTaskFilter=true] - Whether to enable task filter (true) or goal filter (false)
	 * @throws {Error} Throws an error if goal icons are found when only tasks should be displayed
	 * @returns {Promise<void>} A promise that resolves when verification is complete
	 *
	 * @example
	 * // Verify only tasks are shown
	 * await goalsPage.verifyOnlyTasksToggle({ enableTaskFilter: true });
	 *
	 * @example
	 * // Verify only goals are shown
	 * await goalsPage.verifyOnlyTasksToggle({ enableTaskFilter: false });
	 */
	async verifyOnlyTasksToggle({ page = this.page, enableTaskFilter = true }) {
		const iconSelector = enableTaskFilter ? this.taskIcon : this.goalIcon;
		const currentState = await PwActions.getAttributeValue(
			page,
			this.btnMyTaskFilter,
			"data-state",
		);
		const isCurrentlyEnabled = currentState === "checked";
		if (isCurrentlyEnabled !== enableTaskFilter) {
			await PwActions.click(page, this.btnMyTaskFilter);
		}
		await PwActions.waitForElementVisibility(page, `(${iconSelector})[1]`);
		const iconElements = await PwActions.getWebElements(page, iconSelector);
		const iconsToCheck = iconElements.slice(0, 10);
		let iconIndex = 0;
		for (const icon of iconsToCheck) {
			iconIndex++;
			await icon.scrollIntoViewIfNeeded();
			await PwActions.verifyElementIsPresent(
				page,
				`(${iconSelector})[${iconIndex}]`,
			);
		}
		if (iconSelector === this.taskIcon) {
			const goalIconElements = await PwActions.getWebElements(
				page,
				this.goalIcon,
			);
			if (goalIconElements.length > 1) {
				throw new Error(
					"Goal icon is present in the list when only tasks should be shown.",
				);
			}
		}
	}

	/**
	 * Verifies that goal owner profile icons display the correct owner name when hovered.
	 *
	 * This method iterates through up to 10 goal owner profile icons, hovers over each one
	 * to display the popover tooltip, and verifies that the displayed name matches the
	 * expected goal owner name. It navigates to the Goals section before checking each profile.
	 *
	 * @async
	 * @param {Object} options - Configuration options for the verification
	 * @param {import('playwright').Page} [options.page=this.page] - The Playwright page object to interact with
	 * @param {string} options.goalOwnerName - The expected name of the goal owner to verify against
	 * @throws {Error} Throws an error if any profile popover displays a name different from the expected goalOwnerName
	 * @returns {Promise<void>} A promise that resolves when all profile verifications are complete
	 *
	 * @example
	 * // Verify all goal owner profiles show "John Doe" as the owner
	 * await goalsPage.verifyGoalOwner({ goalOwnerName: "John Doe" });
	 *
	 * @example
	 * // Verify goal owner with custom page context
	 * await goalsPage.verifyGoalOwner({
	 *   page: customPage,
	 *   goalOwnerName: "Jane Smith"
	 * });
	 */
	async verifyGoalOwner({ page = this.page, goalOwnerName }) {
		const profileIcons = await PwActions.getWebElements(
			page,
			this.goalownerprofileicon,
		);

		const profilesToCheck = profileIcons.slice(0, 10);

		let profileIndex = 0;
		for (const profile of profilesToCheck) {
			profileIndex++;
			await PwActions.click(page, this.btnGroup("owned and shared"));
			await profile.scrollIntoViewIfNeeded();
			await PwActions.hover(
				page,
				this.btnEachGoalOwnerProfileIcon(profileIndex),
			);
			await PwActions.waitForElementVisibility(page, this.goalownerpopover);
			const popoverText = await PwActions.getText(page, this.goalownerpopover);
			if (popoverText !== goalOwnerName) {
				throw new Error(
					`Expected name: ${goalOwnerName}, but got: ${popoverText}`,
				);
			}
			await CommonUtils.sleep(2);
		}
	}

	/**
	 * Closes the side panel if it is visible
	 * @returns {Promise<void>}
	 * @example
	 * await goalsCommonPage.closeSidePanel();
	 */
	async closeSidePanel() {
		if (await PwActions.elementIsVisible(this.page, this.btnCloseSidePanel)) {
			await PwActions.click(this.page, this.btnCloseSidePanel);
			logger.info("Side panel closed successfully");
		} else {
			logger.info("Side panel is not visible, skipping close action");
		}
	}

	/**
	 * Applies filters to the Goals list page.
	 *
	 * This function supports multiple filters passed as an array of objects.
	 * The "Goal Cycle" filter is treated as a special case and is applied
	 * separately from the rest of the filters.
	 *
	 * Each filter object should define:
	 * - `type`  : The filter category name as displayed in the UI
	 * - `value` : One or more values to be selected for the filter
	 *
	 * @async
	 * @function applyFiltersOnGoalsList
	 *
	 * @param {Array<Object>} filters - List of filters to apply.
	 * @param {string} filters[].type - Filter type (e.g., "Goal Cycle", "Owner", "Status").
	 * @param {string|string[]} filters[].value - Value(s) to select for the filter.
	 *                                            Can be a single string or an array of strings.
	 *
	 * @example
	 * // Apply Goal Cycle along with multiple filters
	 * await applyFiltersOnGoalsList([
	 *   { type: "Goal Cycle", value: "Q1 2025" },
	 *   { type: "Owner", value: ["John Doe", "Jane Smith"] },
	 *   { type: "Status", value: "Active" }
	 * ]);
	 *
	 * @throws {Error} Throws an error if a filter type or value cannot be applied
	 *                 due to UI interaction failures.
	 */
	async applyFiltersOnGoalsList(filters) {
		const goalCycleFilter = filters.find((f) => f.type === "Goal Cycle");
		if (goalCycleFilter) {
			await PwActions.click(this.page, this.btnGoalCycleFilter);
			await this.commonfunctions.getMenuItem(this.page, goalCycleFilter.value);
		}
		const remainingFilters = filters.filter((f) => f.type !== "Goal Cycle");
		for (const { type, value } of remainingFilters) {
			await PwActions.click(this.page, this.btnAddFilter);
			await this.commonfunctions.getMenuItem(this.page, type);

			const isSearchVisible = await PwActions.elementIsVisible(
				this.page,
				this.inputFilterValueSearch,
			);
			for (const val of value) {
				if (isSearchVisible) {
					await PwActions.clearAndFill(
						this.page,
						this.inputFilterValueSearch,
						val,
					);
				}
				await PwActions.click(this.page, this.chkBoxFilterValue(val));
			}
			await PwActions.click(this.page, this.btnApplyFilter);
		}
	}

	/**
	 * function to change goal Status
	 * @param {string} goalName - The name of the goal to change the status of
	 * @param {string} status - The status to change the goal to
	 * @returns {Promise<void>}
	 * @example
	 * await goalsCommonPage.changeGoalStatus("Goal 1", "Not Started");
	 */
	async changeGoalStatus(goalName, status) {
		await PwActions.clearAndFill(this.page, this.txtBoxSearch, goalName);
		await PwActions.hover(this.page, this.getOkrInList(goalName));
		await PwActions.jsClick(this.page, this.getBtnCheckBoxForOkr(goalName));
		await PwActions.click(this.page, this.btnBulkStatus);
		await CommonUtils.sleep(2);
		const isVisible = await PwActions.elementIsVisible(
			this.page,
			this.getBulkStatusDropDown(status),
		);
		if (!isVisible) {
			throw new Error(
				`Status ${status} is not visible in the bulk status dropdown`,
			);
		}
		await PwActions.jsClick(this.page, this.getBulkStatusDropDown(status));
		await PwActions.waitTillVisible(this.page, this.toasterUpdatedSucessfully);
	}

	/**
	 * Edits the connected data source value for a task.
	 *
	 * @param {Object} options - The options for editing the connected data source
	 * @param {string} options.taskName - The name of the task to edit the data source for
	 * @param {Object} options.connectionData - The connection data to use
	 * @param {string} options.connectionData.conditionType - The condition type to use ("count" or "Percentage")
	 * @param {Object} options.connectionData.keyToMatch - The key to match for the data source
	 * @param {string} options.connectionData.keyToMatch.partDataKey - The part data key to match
	 * @param {string} [options.connectionData.keyToMatch.totalDataKey] - The total data key to match (only for "Percentage")
	 * @param {string} [options.connectionData.currentvalue] - The current value of the data source (set automatically)
	 * @returns {Promise<void>}
	 * @example
	 * // Count condition type — only partDataKey is used
	 * await goalsCommonPage.editConnectedDataSourceValueForTask({
	 *   taskName: "My Task",
	 *   connectionData: {
	 *     conditionType: "count",
	 *     keyToMatch: { partDataKey: "partData" }
	 *   }
	 * });
	 * @example
	 * // Percentage condition type — both partDataKey and totalDataKey are used
	 * await goalsCommonPage.editConnectedDataSourceValueForTask({
	 *   taskName: "My Task",
	 *   connectionData: {
	 *     conditionType: "Percentage",
	 *     keyToMatch: { partDataKey: "partData", totalDataKey: "totalData" }
	 *   }
	 * });
	 */
	async editConnectedDataSourceValueForTask({ taskData, connectionData }) {
		await this.commonfunctions.navigateTopNavigateSection("Goals");
		await this.globalSearch({ value: taskData.taskName });
		await PwActions.waitForElementVisibility(
			this.page,
			this.dropDownDataSourceForTask,
		);
		await PwActions.click(this.page, this.dropDownDataSourceForTask);
		await PwActions.waitForElementVisibility(
			this.page,
			this.btnEditDataSourceForTask,
		);
		await PwActions.click(this.page, this.btnEditDataSourceForTask);
		const radioButton =
			connectionData.conditionType === "Percentage"
				? this.radioButtonPercentage
				: this.radioButtonCount;
		await PwActions.click(this.page, radioButton);
		let clipboardValue = await PwActions.copyLinkFromClipboard(
			this.page,
			this.btnKeyOnResponse(connectionData.keyToMatch.partDataKey),
		);
		await PwActions.fill(this.page, this.txtBoxInputPartKey, clipboardValue);
		let partDataValue = await PwActions.getText(
			this.page,
			this.txtValueForkey(connectionData.keyToMatch.partDataKey),
		);
		taskData.currentvalue = partDataValue;
		if (connectionData.conditionType === "Percentage") {
			clipboardValue = await PwActions.copyLinkFromClipboard(
				this.page,
				this.btnKeyOnResponse(connectionData.keyToMatch.totalDataKey),
			);
			await PwActions.fill(
				this.page,
				this.txtBoxInputTotalDataKey,
				clipboardValue,
			);
			let totalDataValue = await PwActions.getText(
				this.page,
				this.txtValueForkey(connectionData.keyToMatch.totalDataKey),
			);
			taskData.currentvalue = String(
				Math.floor((partDataValue / totalDataValue) * 100),
			);
		}
		await PwActions.click(this.page, this.btnSaveButtonForCustomConnector);
		return taskData;
	}

	/**
	 * Unlinks the API connection from a task and removes the settings key from the task data.
	 *
	 * @param {Object} options - The options for unlinking the API connection
	 * @param {Object} options.taskData - The task data to unlink the API connection from
	 * @param {string} options.taskData.taskName - The name of the task to unlink the API connection from
	 * @param {Object} options.taskData.settings - The settings key to remove from the task data (removed automatically on unlink)
	 * @returns {Promise<Object>} The task data without the settings key
	 * @example
	 * const taskData = await goalsCommonPage.unlinkAPIConnectionFromTask({
	 *   taskData: {
	 *     taskName: "My Task",
	 *     settings: {
	 *       conditionType: "Percentage",
	 *       keyToMatch: { partDataKey: "partData", totalDataKey: "totalData" }
	 *     }
	 *   }
	 * });
	 * // taskData.settings is now removed
	 */
	async unlinkAPIConnectionFromTask({ taskData }) {
		await this.commonfunctions.navigateTopNavigateSection("Goals");
		await this.globalSearch({ value: taskData.taskName });
		await PwActions.waitForElementVisibility(
			this.page,
			this.dropDownDataSourceForTask,
		);
		await PwActions.click(this.page, this.dropDownDataSourceForTask);
		await PwActions.waitForElementVisibility(
			this.page,
			this.btnUnlinkDataSourceForTask,
		);
		await PwActions.click(this.page, this.btnUnlinkDataSourceForTask);
		await PwActions.click(this.page, this.btnYesRemoveConnection);
		const { settings, ...taskDataWithoutSettings } = taskData;
		return taskDataWithoutSettings;
	}

	/**
	 * Expands the parent child relationship for a given goal name
	 * @param {string} parentGoalName - The name of the parent goal to expand
	 * @returns {Promise<void>}
	 * @example
	 * await goalsCommonPage.expandParentChildRelationShip("Parent Goal");
	 */

	async expandParentChildRelationShip(parentGoalName) {
		await PwActions.waitForElementVisibility(
			this.page,
			this.btnExpandParentChildRelationShip(parentGoalName),
		);
		await PwActions.click(
			this.page,
			this.btnExpandParentChildRelationShip(parentGoalName),
		);
	}

	/**
	 * Selects multiple OKRs/tasks and performs a bulk status change.
	 *
	 * Handles three possible outcomes:
	 * - **Success**: Waits for a success toaster confirming the update.
	 * - **Modal error**: Some or all items are restricted (e.g. "Status Update Restriction" dialog appears).
	 * - **Toaster error**: All items are blocked (e.g. child task locked because parent is Completed).
	 *
	 * @param {Object} options - Configuration for the bulk status change.
	 * @param {Array<string> | string} options.okrs - One or more goal/task names to update.
	 *   Duplicates are removed automatically.
	 * @param {string} options.status - The target status to apply.
	 *   Accepted values: "Not Started" | "At Risk" | "In Progress" | "On Track" | "Completed"
	 * @param {false | 'toaster' | 'modal'} [options.expectError=false] - Expected error behavior after applying the status.
	 *   - `false`     → Expects a success toaster: "{n} status(es) updated successfully"
	 *   - `'toaster'` → Expects an error toaster: all selected items are blocked (e.g. locked child tasks)
	 *   - `'modal'`   → Expects a "Status Update Restriction" modal: some/all items cannot be updated
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Success — bulk update two tasks to "At Risk"
	 * await goalsCommonPage.bulkStatusChange({
	 *     okrs: [task1Title, task2Title],
	 *     status: "At Risk",
	 * });
	 *
	 * @example
	 * // Success — single item (string also accepted)
	 * await goalsCommonPage.bulkStatusChange({
	 *     okrs: goalData1.goalName,
	 *     status: "On Track",
	 * });
	 *
	 * @example
	 * // Modal error — changing to "Not Started" when progress > 0%
	 * // Shows "Status Update Restriction" dialog listing each blocked item with a reason
	 * await goalsCommonPage.bulkStatusChange({
	 *     okrs: [parentGoalName, childTaskName],
	 *     status: "Not Started",
	 *     expectError: 'modal',
	 * });
	 *
	 * @example
	 * // Toaster error — child task is locked because parent goal is Completed
	 * // Shows an error toaster instead of the restriction modal
	 * await goalsCommonPage.bulkStatusChange({
	 *     okrs: [parentGoalName, childTaskName],
	 *     status: "Completed",
	 *     expectError: 'toaster',
	 * });
	 */
	async bulkStatusChange({ okrs = [], status, expectError = false }) {
		if (!Array.isArray(okrs)) {
			okrs = [okrs];
		}
		okrs = Array.from(new Set(okrs));

		await PwActions.hover(this.page, this.getOkrInList(okrs[0]));
		await PwActions.click(this.page, this.getBtnCheckBoxForOkr(okrs[0]));

		if (okrs.length > 1) {
			for (const okr of okrs.slice(1)) {
				await PwActions.hover(this.page, this.getOkrInList(okr));
				await PwActions.click(this.page, this.getBtnCheckBoxForOkr(okr));
			}
		}

		await PwActions.click(this.page, this.btnBulkStatus);
		await PwActions.waitForElementVisibility(
			this.page,
			this.getBulkStatusDropDown(status),
		);
		await PwActions.click(this.page, this.getBulkStatusDropDown(status));

		switch (expectError) {
			case "toaster":
				await PwActions.waitForElementVisibility(
					this.page,
					this.toasterBulkStatusChangeError,
				);
				await PwActions.click(this.page, this.btnCloseBulkSelection);
				break;

			case "modal":
				await PwActions.waitForElementVisibility(
					this.page,
					this.txtModalRestriction,
				);
				await PwActions.click(
					this.page,
					this.btnCancelButtonInModalRestriction,
				);
				await PwActions.click(this.page, this.btnCloseBulkSelection);
				break;

			default:
				await PwActions.waitForElementVisibility(
					this.page,
					this.toasterBulkStatusChanged(okrs.length),
				);
		}
	}

	/**
	 * Deletes an OKR by name.
	 *
	 * @param {object} params
	 * @param {string} params.okrName - The name of the OKR to delete
	 * @returns {Promise<void>}
	 * @example
	 * await goalsCommonPage.deleteOkr({ okrName: "My New Goal" });
	 */
	async deleteOkr({ okrName }) {
		await PwActions.clearAndFill(this.page, this.txtBoxSearch, okrName);
		await PwActions.click(
			this.page,
			this.btnMoreOptionForGoalInListing(okrName),
		);
		await PwActions.click(this.page, this.btnOptionsInMoreOptions("Delete"));
		await PwActions.click(this.page, this.btnDelete);
	}

	/**
	 * Archives an OKR by name.
	 *
	 * @param {object} params
	 * @param {string} params.okrName - The name of the OKR to archive
	 * @returns {Promise<void>}
	 * @example
	 * await goalsCommonPage.archiveOkr({ okrName: "My New Goal" });
	 */
	async archiveOkr({ okrName }) {
		await PwActions.clearAndFill(this.page, this.txtBoxSearch, okrName);
		await PwActions.click(
			this.page,
			this.btnMoreOptionForGoalInListing(okrName),
		);
		await PwActions.click(this.page, this.btnOptionsInMoreOptions("Archive"));
		await PwActions.click(this.page, this.btnYesProceed);
	}

	/**
	 * Applies filters to the Goals list page.
	 *
	 * This function supports multiple filters passed as an array of objects.
	 * The "Goal Cycle" filter is treated as a special case and is applied
	 * separately from the rest of the filters.
	 *
	 * Each filter object should define:
	 * - `type`  : The filter category name as displayed in the UI
	 * - `value` : One or more values to be selected for the filter
	 *
	 * @async
	 * @function applyFiltersOnGoalsList
	 *
	 * @param {Array<Object>} filters - List of filters to apply.
	 * @param {string} filters[].type - Filter type (e.g., "Goal Cycle", "Owner", "Status").
	 * @param {string|string[]} filters[].value - Value(s) to select for the filter.
	 *                                            Can be a single string or an array of strings.
	 *
	 * @example
	 * // Apply Goal Cycle along with multiple filters
	 * await applyFiltersOnGoalsList([
	 *   { type: "Goal Cycle", value: "Q1 2025" },
	 *   { type: "Owner", value: ["John Doe", "Jane Smith"] },
	 *   { type: "Status", value: "Active" }
	 * ]);
	 *
	 * @throws {Error} Throws an error if a filter type or value cannot be applied
	 *                 due to UI interaction failures.
	 */
	async applyFiltersOnSidePanel({ filters = [] }) {
		const goalCycleFilter = filters.find((f) => f.type === "Goal Cycle");
		if (goalCycleFilter) {
			await PwActions.click(this.page, this.btnCycleFilterInSidePanel);
			await this.commonfunctions.getMenuItem(this.page, goalCycleFilter.value);
		}
		const remainingFilters = filters.filter((f) => f.type !== "Goal Cycle");
		for (const { type, value } of remainingFilters) {
			await PwActions.click(this.page, this.btnAddFilterInSidePanel);
			await this.commonfunctions.getMenuItem(this.page, type);

			const isSearchVisible = await PwActions.elementIsVisible(
				this.page,
				this.inputFilterValueSearch,
			);
			for (const val of value) {
				if (isSearchVisible) {
					await PwActions.clearAndFill(
						this.page,
						this.inputFilterValueSearch,
						val,
					);
				}
				await PwActions.click(this.page, this.chkBoxFilterValue(val));
			}
			await PwActions.click(this.page, this.btnApplyFilter);
		}
	}

	/**
	 * Verifies that the side panel is in an empty state after applying filters.
	 * Opens the contextual side panel via Global Search (`globalSearch`), not from the Goals listing.
	 * @param {Object} params
	 * @param {Array<Object>} params.filters - The filters to apply.
	 * @param {string} params.entityName - The name of the entity to search for.
	 * @param {string} [params.type="owner"] - The type of entity to search for.
	 * @returns {Promise<void>}
	 * @example
	 * await goalsCommonPage.verifySidePanelIsInEmptyState({
	 *   filters: [{ type: "Goal Cycle", value: "Q1 2025" }],
	 *   entityName: "John Doe",
	 *   type: "owner"
	 * });
	 */
	async verifySidePanelIsInEmptyState({ filters, entityName, type = "owner" }) {
		await this.globalSearch({ value: entityName, type });
		await CommonUtils.sleep(2);
		await this.applyFiltersOnSidePanel({ filters });
		await PwActions.waitForElementVisibility(
			this.page,
			this.txtNoGoalsFoundInSidePanel,
		);
		await PwActions.click(this.page, this.btnCloseGroupSidePanel);
	}

	/**
	 * Groups the side panel by the given type.
	 * @param {Object} params
	 * @param {string} params.type - The type to group by.
	 * @returns {Promise<void>}
	 * @example
	 * await goalsCommonPage.groupBy({ type: "owner" });
	 */
	async groupBy({ type }) {
		await PwActions.click(this.page, this.dropdownGroupBy);
		await this.commonfunctions.getMenuItem(this.page, type);
		await CommonUtils.sleep(2);
	}

	/**
	 * Opens the side panel from the listing.
	 * @param {Object} params
	 * @param {string} params.tab - The tab to open the side panel from.
	 * @param {string} params.entityName - The name of the entity to search for.
	 * @param {string} params.groupByType - The type to group by.
	 * @returns {Promise<void>}
	 * @example
	 * await goalsCommonPage.openSidePanelFromListing({ tab: "My Goals", entityName: "John Doe", groupByType: "owner" });
	 */
	async openSidePanelFromListing({ tab, entityName, groupByType }) {
		await this.navigateToSideBarMenu({ menuName: tab });
		await this.groupBy({ type: groupByType });
		await PwActions.click(
			this.page,
			this.getGroupSidePanelEntityInListing(entityName),
		);
		await PwActions.waitForElementVisibility(
			this.page,
			this.btnCloseGroupSidePanel,
		);
		await PwActions.waitForElementVisibility(
			this.page,
			this.getGroupSidePanelEntityName(entityName),
		);
	}

	/**
	 * Verifies the data in the side panel.
	 * @param {Object} params
	 * @param {string} params.tab - The tab to open the side panel from.
	 * @param {string} params.entityName - The name of the entity to search for.
	 * @param {string} params.groupByType - The type to group by.
	 * @param {Array<Object>} params.data - The data to verify.
	 * @returns {Promise<void>}
	 */
	async verifySidePanelData({
		tab,
		entityName,
		groupByType,
		data,
		filters,
		alignedGoals,
		alignedTasks,
	}) {
		await this.openSidePanelFromListing({ tab, entityName, groupByType });
		if (filters) {
			await this.applyFiltersOnSidePanel({ filters });
		}
		const {
			lead,
			totalDepartmentMembers,
			members,
			goals,
			respectiveGoals,
			headsGoals,
		} = data;
		if (lead) {
			let valuesToCheck = [];
			if (groupByType === "Team") {
				valuesToCheck = [{ label: "Manager", expected: lead }];
			}

			if (groupByType === "Employees") {
				valuesToCheck = [
					{ label: "Job Title", expected: "Job 1" },
					{ label: "Department", expected: "Manager Team" },
					{ label: "Head of", expected: "Engineering" },
					{ label: "Manager", expected: "Manager New" },
				];
			}
			if (groupByType === "Department") {
				valuesToCheck = [{ label: "Department Head", expected: lead }];
			}

			for (const item of valuesToCheck) {
				await PwActions.verifyTextExpected(
					await PwActions.getText(
						this.page,
						this.txtSidePanelValues(item.label),
					),
					item.expected,
				);
			}
		}
		if (totalDepartmentMembers) {
			const countStr = String(totalDepartmentMembers);
			const expectedTotalLine = `Total Department Members: ${countStr}`;
			const actualTotalLine = await PwActions.getText(
				this.page,
				this.txtCountTotalDepartmentMembers(countStr),
			);
			await PwActions.verifyTextExpected(actualTotalLine, expectedTotalLine);
			if (Array.isArray(members)) {
				await PwActions.verifyTextExpected(String(members.length), countStr);
			}
		}
		if (members) {
			await PwActions.click(this.page, this.btnDepartmentOrTeamMembers);
			for (const member of members) {
				await PwActions.waitForElementVisibility(
					this.page,
					this.txtDepartmentOrTeamMember(member),
				);
			}
			await PwActions.click(this.page, this.btnCloseEmployeeListModal);
		}
		if (goals) {
			if (groupByType === "Departments") {
				await PwActions.click(
					this.page,
					this.btnSidepanelGoalsTab("Dept Members"),
				);
			}
			if (groupByType === "Teams") {
				await PwActions.click(
					this.page,
					this.btnSidepanelGoalsTab("Reportee Goals"),
				);
			}
			if (groupByType === "Employees") {
				await PwActions.click(
					this.page,
					this.btnSidepanelGoalsTab("Reportees Goals"),
				);
			}
			for (const [entityName, goalName] of Object.entries(goals)) {
				await PwActions.waitForElementVisibility(
					this.page,
					this.getEntityGroupInSidePanel(entityName),
				);
				for (const goal of goalName) {
					await PwActions.waitForElementVisibility(
						this.page,
						this.txtGoalInSidePanel(goal),
					);
				}
			}
		}
		if (respectiveGoals) {
			if (groupByType === "Departments") {
				await PwActions.click(
					this.page,
					this.btnSidepanelGoalsTab("Department Level Goals"),
				);
			}
			if (groupByType === "Teams") {
				await PwActions.click(
					this.page,
					this.btnSidepanelGoalsTab("Team Level Goals"),
				);
			}
			if (groupByType === "Employees") {
				await PwActions.click(
					this.page,
					this.btnSidepanelGoalsTab("Own Goals"),
				);
			}
			for (const goal of respectiveGoals) {
				await PwActions.waitForElementVisibility(
					this.page,
					this.txtGoalInSidePanel(goal),
				);
			}
		}
		if (headsGoals) {
			if (groupByType === "Department") {
				await PwActions.click(
					this.page,
					this.btnSidepanelGoalsTab("Dept Head's Goals"),
				);
			}
			if (groupByType === "Employees") {
				await PwActions.click(
					this.page,
					this.btnSidepanelGoalsTab("Dept Goals"),
				);
			}
			for (const goal of headsGoals) {
				await PwActions.waitForElementVisibility(
					this.page,
					this.txtGoalInSidePanel(goal),
				);
			}
		}
		if (alignedGoals) {
			await PwActions.click(this.page, this.btnSidepanelGoalsTab("Own Goals"));
			for (const [employeeName, goalName] of Object.entries(alignedGoals)) {
				await PwActions.waitForElementVisibility(
					this.page,
					this.txtAlignedGoalsTasksEmployeeName(employeeName),
				);
				await PwActions.verifyTextExpected(
					await PwActions.getText(
						this.page,
						this.txtAlignedGoalsCount(employeeName),
					),
					"1",
				);
				await PwActions.click(
					this.page,
					this.txtAlignedGoalsCount(employeeName),
				);
				const alignedGoalNames = Array.isArray(goalName)
					? goalName
					: [goalName];
				for (const alignedGoalName of alignedGoalNames) {
					await PwActions.waitForElementVisibility(
						this.page,
						this.txtAlignedGoalNameInsideModal(alignedGoalName),
					);
				}
				await PwActions.click(this.page, this.btnAlignedGoalsModalClose);
			}
		}
		if (alignedTasks) {
			await PwActions.click(this.page, this.btnSidepanelGoalsTab("Own Goals"));
			for (const [employeeName, taskName] of Object.entries(alignedTasks)) {
				await PwActions.waitForElementVisibility(
					this.page,
					this.txtAlignedGoalsTasksEmployeeName(employeeName),
				);
				await PwActions.verifyTextExpected(
					await PwActions.getText(
						this.page,
						this.txtAlignedTasksCount(employeeName),
					),
					"1",
				);
				await PwActions.click(
					this.page,
					this.txtAlignedTasksCount(employeeName),
				);
				const alignedTaskNames = Array.isArray(taskName)
					? taskName
					: [taskName];
				for (const alignedTaskName of alignedTaskNames) {
					await PwActions.waitForElementVisibility(
						this.page,
						this.txtAlignedTaskNameInsideModal(alignedTaskName),
					);
				}
				await PwActions.click(this.page, this.btnAlignedTasksModalClose);
			}
		}
	}
}

export default GoalsCommon;

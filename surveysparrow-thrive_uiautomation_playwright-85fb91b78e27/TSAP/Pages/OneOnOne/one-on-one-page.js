import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../Data/Resources/constants.js";
import logger from "playwright-framework/Core/logger.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions.js";
import { envDetails } from "../../Data/test-data.js";
import { allure } from "allure-playwright";
import { LoginPage } from "../login-page.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
export class OneOnOnePage {
	/**
	 * Creates an instance of OneOnOnePage
	 * @param {import('playwright').Page} page - Playwright page object
	 */
	constructor(page) {
		this.page = page;
		this.readEmail = new ReadEmail(page);
		this.commonutils = new CommonUtils();
		this.commonFunctions = new CommonPageFunctions(page);
		this.loginpage = new LoginPage(page);
		this.btnNewOneAndOne = `//button[@data-testid="header_button_new-meeting"]`;
		this.inputSearchEmployee = `//p[text()="Set up a 1:1 with"]/following-sibling::div//input`;
		this.btnManual = `//button[@data-testid="create-modal_radio_manual"]`;
		this.btnCalendarSync = `//button[@data-testid="create-modal_radio_calendar-sync"]`;
		this.inputMeetingTitle = `//input[@data-testid="create-modal_form-input_meeting-title"]`;
		this.btnStartDate = `//*[text()='Start Date']/ancestor::div[3]//input[@data-testid="date-picker_input"]`;
		this.btnStartTime = `//label[.='Start Time']/ancestor::div[2]/following-sibling::div/div`;
		this.btnEndTime = `//label[.='End Time']/ancestor::div[2]/following-sibling::div/div`;
		this.chckBoxSyncToCalendar = `//button[@data-testid="create-modal_checkbox_sync-calendar"]`;
		this.btnConnectGoogleCalendar = `//button[@data-testid="calendar-provider-button_GOOGLE_CALENDAR"]//button[@data-testid="calendar-provider-button_button_connect"]`;
		this.btnNextStep = `//button[@data-testid="create-modal_button_submit"]`;
		this.txtAgendaTemplate = `//label[text()="Agenda Template"]/ancestor::div[3]/following-sibling::div//input`;
		this.txtdropdown = (selector) =>
			`//label[normalize-space(.)='${selector}']/ancestor::div[2]/following-sibling::div//input`;
		this.getOptionInDropdown = (option) => `//div[text()="${option}"]`;
		this.btnSaveConnection = `//button[@data-testid="create-modal_button_submit"]`;
		this.btnactionitems = `//button[@data-testid="create-modal_switch_action-items"]`;
		this.btnPreviousPointsOfMeeting = `//button[@data-testid="create-modal_switch_talking-points"]`;
		this.btnAddActionItem = (row) =>
			`//textarea[@data-testid="template-checklist-items_${row}_textarea"]`;
		this.getEmployeeNameInDropdown = (name) =>
			`//div[contains(@id,"option")]//p[text()='${name}']`;
		this.txtSearchAllOneOnOnes = `//input[@data-testid="meetings-filter-wrapper_input_search"]`;
		this.btnAllOneOnOneMoreActions = `//button[@data-testid="all-meetings-dropdown_icon-button_trigger"]`;
		this.btnMoreActionsMenu = (action) =>
			`//div[@data-testid="all-meetings-dropdown_dropdown-menu-item" and normalize-space(.)='${action}']`;
		this.btnArchiveConfirmationModal = `//button[@data-testid="comman-confirmation-modal_button_confirm"]`;
		this.inputSearchEmployeeEdit = `//p[text()="Edit 1:1 with"]/following-sibling::div//input`;
		this.txtMeetingTitleEdit = `//input[@data-testid="edit-modal_form-input_meeting-title"]`;
		this.btnNextInEditModal = `//button[@data-testid="edit-modal_button_submit"]`;
		this.txtReasonForCancellation = `//textarea[@data-testid="cancel-modal_textarea_reason"]`;
		this.btnCancelConfirmationModal = `//button[@data-testid="custom-meetings-modal_button_confirm"]`;
	}
	/**
	 * Creates or edits a 1:1 meeting based on the mode parameter
	 * @param {Object} options - The options object
	 * @param {Object} options.meetingDetails - Meeting details object
	 * @param {string} options.meetingDetails.meetingTitle - Title of the meeting
	 * @param {string} [options.meetingDetails.editMeetingTitle] - New title when editing a meeting
	 * @param {string} options.meetingDetails.startTime - Start time (e.g., "08:00 AM")
	 * @param {string} options.meetingDetails.endTime - End time (e.g., "09:00 AM")
	 * @param {string} options.meetingDetails.participantName - Name of the participant
	 * @param {string} options.meetingDetails.participantEmail - Email of the participant
	 * @param {string} options.meetingDetails.creatorEmail - Email of the meeting creator
	 * @param {string} [options.meetingDetails.frequency] - Meeting frequency (e.g., "Once", "Weekly")
	 * @param {boolean} [options.meetingDetails.syncToCalendar] - Whether to sync to Google Calendar
	 * @param {string} [options.meetingDetails.agendaTemplate] - Agenda template name
	 * @param {string[]} [options.meetingDetails.talkingPoints] - Array of talking points
	 * @param {boolean} [options.meetingDetails.actionitems] - Enable action items toggle
	 * @param {boolean} [options.meetingDetails.previousPointsOfMeeting] - Enable previous points toggle
	 * @param {string} [options.mode='create'] - Mode: 'create' or 'edit'
	 * @returns {Promise<Object|undefined>} Returns meeting details object when creating, undefined when editing
	 * @example
	 * // Create a new meeting
	 * const createdMeeting = await oneOnOnePage.createOrEditOneOnOne({
	 *   meetingDetails: {
	 *     participantName: "John Doe",
	 *     participantEmail: "john@example.com",
	 *     creatorEmail: "creator@example.com",
	 *     meetingTitle: "Weekly Sync",
	 *     startTime: "08:00 AM",
	 *     endTime: "09:00 AM",
	 *     frequency: "Weekly",
	 *     syncToCalendar: true,
	 *     agendaTemplate: "1:1 Work-Life Balance Agenda Checklist",
	 *     talkingPoints: ["Discuss goals", "Review progress"],
	 *     actionitems: true,
	 *     previousPointsOfMeeting: false
	 *   }
	 * });
	 *
	 * @example
	 * // Edit an existing meeting
	 * await oneOnOnePage.createOrEditOneOnOne({
	 *   meetingDetails: {
	 *     meetingTitle: "Weekly Sync",
	 *     editMeetingTitle: "Updated Weekly Sync",
	 *     startTime: "01:00 PM",
	 *     endTime: "02:00 PM",
	 *     frequency: "Once"
	 *   },
	 *   mode: "edit"
	 * });
	 */
	async createOrEditOneOnOne({ meetingDetails, mode = "create" }) {
		const {
			meetingTitle,
			editMeetingTitle,
			startTime,
			endTime,
			participantName,
			frequency,
			syncToCalendar,
			agendaTemplate,
			talkingPoints,
			actionitems,
			previousPointsOfMeeting,
			participantEmail,
			creatorEmail,
		} = meetingDetails;

		const isEdit = mode === "edit";

		// Initial setup differs between create and edit
		if (isEdit) {
			await this.commonFunctions.navigateToSideBarMenu("All 1:1s");
			await PwActions.fill(this.page, this.txtSearchAllOneOnOnes, meetingTitle);
			await PwActions.click(this.page, this.btnAllOneOnOneMoreActions);
			await PwActions.click(this.page, this.btnMoreActionsMenu("Edit"));
			await PwActions.fill(
				this.page,
				this.txtMeetingTitleEdit,
				editMeetingTitle,
			);
		} else {
			await PwActions.click(this.page, this.btnNewOneAndOne);
			await PwActions.waitForDOMContentLoaded(this.page, 20000);
			await CommonUtils.sleep(2);
			await PwActions.waitForNetworkIdle(this.page, 5000);
			await PwActions.fill(
				this.page,
				this.inputSearchEmployee,
				participantName,
			);
			await PwActions.waitForElementVisibility(
				this.page,
				this.getEmployeeNameInDropdown(participantName),
			);
			await PwActions.click(
				this.page,
				this.getEmployeeNameInDropdown(participantName),
			);
			await PwActions.click(this.page, this.btnManual);
			await PwActions.fill(this.page, this.inputMeetingTitle, meetingTitle);
		}

		// Common date and time selection
		await PwActions.click(this.page, this.btnStartDate);
		await this.commonFunctions.chooseRandomDateOnCalendar({
			page: this.page,
			monthsFromNow: 1,
		});
		await PwActions.click(this.page, this.btnStartTime);
		await PwActions.fill(this.page, this.txtdropdown("Start Time"), startTime);
		await PwActions.click(this.page, this.getOptionInDropdown(startTime));
		await PwActions.click(this.page, this.btnEndTime);
		await PwActions.fill(this.page, this.txtdropdown("End Time"), endTime);
		await PwActions.click(this.page, this.getOptionInDropdown(endTime));

		if (frequency) {
			await PwActions.fill(this.page, this.txtdropdown("Frequency"), frequency);
			await PwActions.click(this.page, this.getOptionInDropdown(frequency));
		}
		if (syncToCalendar) {
			await PwActions.click(this.page, this.chckBoxSyncToCalendar);
		}

		// Next step button differs between create and edit
		const btnNextStep = isEdit ? this.btnNextInEditModal : this.btnNextStep;
		await PwActions.click(this.page, btnNextStep);

		if (agendaTemplate) {
			await PwActions.click(this.page, this.txtAgendaTemplate);
			await PwActions.fill(this.page, this.txtAgendaTemplate, agendaTemplate);
			await PwActions.click(
				this.page,
				this.getOptionInDropdown(agendaTemplate),
			);
		}

		if (Array.isArray(talkingPoints) && talkingPoints.length > 0) {
			let row = 0;
			if (agendaTemplate) {
				row = isEdit ? 3 : 4;
				if (isEdit) {
					await PwActions.focus(this.page, this.btnAddActionItem(row));
					await PwActions.press(this.page, "Enter");
					row++;
				}
			}
			for (const item of talkingPoints) {
				await PwActions.fill(this.page, this.btnAddActionItem(row), item);
				await PwActions.press(this.page, "Enter");
				row++;
			}
		}

		if (actionitems) {
			await PwActions.click(this.page, this.btnactionitems);
		}
		if (previousPointsOfMeeting) {
			await PwActions.click(this.page, this.btnPreviousPointsOfMeeting);
		}

		// Save button differs between create and edit
		const btnSave = isEdit ? this.btnNextInEditModal : this.btnSaveConnection;
		await PwActions.click(this.page, btnSave);

		// Return meeting details for create mode
		if (!isEdit) {
			return {
				meetingTitle,
				startTime,
				endTime,
				participantName,
				frequency,
				syncToCalendar,
				agendaTemplate,
				talkingPoints,
				actionitems,
				previousPointsOfMeeting,
				participantEmail,
				creatorEmail,
			};
		}
	}
	/**
	 * Verifies that a 1:1 meeting was successfully created/edited by checking Google Calendar
	 * @param {Object} meetingDetails - Meeting details to verify
	 * @param {string} meetingDetails.meetingTitle - Original title of the meeting
	 * @param {string} [meetingDetails.editMeetingTitle] - Edited title (used for search if provided)
	 * @param {string} meetingDetails.startTime - Expected start time (e.g., "08:00 AM")
	 * @param {string} meetingDetails.endTime - Expected end time (e.g., "09:00 AM")
	 * @param {string} meetingDetails.participantEmail - Email of the participant
	 * @param {string} meetingDetails.creatorEmail - Email of the meeting creator
	 * @throws {Error} If calendar event is not found after max retries
	 * @example
	 * // Verify a newly created meeting
	 * await oneOnOnePage.verifyOneOnOneMeetingCreated({
	 *   meetingTitle: "Weekly Sync",
	 *   startTime: "08:00 AM",
	 *   endTime: "09:00 AM",
	 *   participantEmail: "john@example.com",
	 *   creatorEmail: "creator@example.com"
	 * });
	 *
	 * @example
	 * // Verify an edited meeting (searches by editMeetingTitle)
	 * await oneOnOnePage.verifyOneOnOneMeetingCreated({
	 *   meetingTitle: "Old Title",
	 *   editMeetingTitle: "New Title",
	 *   startTime: "01:00 PM",
	 *   endTime: "02:00 PM",
	 *   participantEmail: "john@example.com",
	 *   creatorEmail: "creator@example.com"
	 * });
	 */
	async verifyOneOnOneMeetingCreated(meetingDetails) {
		const {
			meetingTitle,
			editMeetingTitle,
			startTime,
			endTime,
			participantEmail,
			creatorEmail,
		} = meetingDetails;

		// Retry logic to wait for calendar sync
		let events = [];
		let retryCount = 0;
		const maxRetries = 10;

		const searchTitle = editMeetingTitle ? editMeetingTitle : meetingTitle;
		logger.info(`Searching for calendar event with title: "${searchTitle}"`);

		while (retryCount < maxRetries) {
			events = await this.readEmail.searchCalendarEvents({
				query: searchTitle,
			});

			if (events && events.length > 0) {
				logger.info(
					`Found ${events.length} calendar event(s) matching "${searchTitle}"`,
				);
				break;
			}

			retryCount++;
			logger.info(
				`Attempt ${retryCount}/${maxRetries}: Calendar event not found yet. Waiting 5 seconds before retry...`,
			);
			await CommonUtils.sleep(5);
		}

		if (!events || events.length === 0) {
			throw new Error(
				`Calendar event with title "${searchTitle}" not found after ${maxRetries} attempts. The meeting may not have synced to Google Calendar.`,
			);
		}

		const eventDetails = await this.readEmail.getEventDetails({
			eventId: events[0].id,
		});
		eventDetails.startTime = CommonUtils.convertTime(
			eventDetails.startTime,
			"to12Hour",
		);
		eventDetails.endTime = CommonUtils.convertTime(
			eventDetails.endTime,
			"to12Hour",
		);

		logger.info(
			`Verifying calendar event details for "${eventDetails.meetingTitle}"`,
		);

		CommonUtils.verifyArrayContainsAllElements(
			[searchTitle, participantEmail, creatorEmail, startTime, endTime],
			[
				eventDetails.meetingTitle,
				eventDetails.attendeesEmail[1],
				eventDetails.creatorEmail,
				eventDetails.startTime,
				eventDetails.endTime,
			],
		);

		logger.info("Calendar event verification successful!");
	}

	/**
	 * Verifies that a 1:1 meeting does NOT exist in Google Calendar
	 * Useful for verifying meeting cancellation or deletion
	 * @param {Object} meetingDetails - Meeting details to verify absence of
	 * @param {string} meetingDetails.meetingTitle - Original title of the meeting
	 * @param {string} [meetingDetails.editMeetingTitle] - Edited title (used for search if provided)
	 * @throws {Error} If calendar event is found when it should not exist
	 * @example
	 * // Verify a cancelled meeting is no longer in calendar
	 * await oneOnOnePage.verifyOneOnOneMeetingNotPresent({
	 *   meetingTitle: "Weekly Sync"
	 * });
	 *
	 * @example
	 * // Verify with edited title
	 * await oneOnOnePage.verifyOneOnOneMeetingNotPresent({
	 *   meetingTitle: "Old Title",
	 *   editMeetingTitle: "New Title"
	 * });
	 */
	async verifyOneOnOneMeetingNotPresent(meetingDetails) {
		const { meetingTitle, editMeetingTitle } = meetingDetails;

		// Retry logic to wait for calendar sync (deletion may take time)
		let events = [];
		let retryCount = 0;
		const maxRetries = 5;

		const searchTitle = editMeetingTitle ? editMeetingTitle : meetingTitle;
		logger.info(
			`Verifying calendar event with title "${searchTitle}" does NOT exist`,
		);

		while (retryCount < maxRetries) {
			events = await this.readEmail.searchCalendarEvents({
				query: searchTitle,
			});

			if (!events || events.length === 0) {
				logger.info(
					`Confirmed: No calendar event found with title "${searchTitle}"`,
				);
				return;
			}

			retryCount++;
			logger.info(
				`Attempt ${retryCount}/${maxRetries}: Calendar event still found. Waiting 5 seconds for deletion to sync...`,
			);
			await CommonUtils.sleep(5);
		}

		throw new Error(
			`Calendar event with title "${searchTitle}" still exists after ${maxRetries} attempts. Expected the meeting to be removed from Google Calendar.`,
		);
	}

	/**
	 * Archives or cancels an existing 1:1 meeting
	 * @param {Object} options - The options object
	 * @param {string} options.meetingTitle - Title of the meeting to archive/cancel
	 * @param {string} options.mode - Action mode: "Archive" or "Cancel"
	 * @example
	 * // Cancel a meeting
	 * await oneOnOnePage.archiveOrCancelOneOnOneMeeting({
	 *   meetingTitle: "Weekly Sync",
	 *   mode: "Cancel"
	 * });
	 *
	 * @example
	 * // Archive a meeting
	 * await oneOnOnePage.archiveOrCancelOneOnOneMeeting({
	 *   meetingTitle: "Weekly Sync",
	 *   mode: "Archive"
	 * });
	 */
	async archiveOrCancelOneOnOneMeeting({ meetingTitle, mode }) {
		await this.commonFunctions.navigateToSideBarMenu("All 1:1s");
		await PwActions.fill(this.page, this.txtSearchAllOneOnOnes, meetingTitle);
		await PwActions.click(this.page, this.btnAllOneOnOneMoreActions);
		await PwActions.click(this.page, this.btnMoreActionsMenu(mode));
		if (mode === "Archive") {
			await PwActions.click(this.page, this.btnArchiveConfirmationModal);
		} else {
			await PwActions.fill(
				this.page,
				this.txtReasonForCancellation,
				"Test Reason",
			);
			await PwActions.click(this.page, this.btnCancelConfirmationModal);
		}
	}
}

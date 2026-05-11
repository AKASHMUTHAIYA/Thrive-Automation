import { expect, test } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { APIActions } from "playwright-framework/Core/API_Actions/api-actions.js";
import { constants } from "../Data/Resources/constants.js";
import { urlPaths } from "../Data/Resources/urls.js";
import { envDetails } from "../Data/test-data.js";
import { TasksPage } from "../Pages/Performance/tasks-page.js";
import { LoginPage } from "../Pages/login-page.js";
import { EntityIds } from "./entityId.js";
import { PerformanceHeatmapPage } from "../Pages/Performance/Performance_Reports/performance-heatmap-page.js";
import logger from "playwright-framework/Core/logger.js";
import path from "path";
import fs from "fs";

export class CommonPageFunctions {
	constructor(page) {
		this.page = page;
		this._surveyeuipage = null;
		this.btnSearchEmployee = "//button[contains(@aria-label,'Search')]";
		this.txtSearchbox = "//input[contains(@placeholder,'Search')]";
		this.readEmail = new ReadEmail();
		this.commonutils = new CommonUtils();
		this.apiActions = new APIActions();
		this.performanceHeatmapPage = new PerformanceHeatmapPage(this.page);
		this.taskPage = new TasksPage();
		this.senderEmail = envDetails.senderEmail;
		this.loadingElement =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ikdnKCW-css']//div[@class='twigs-c-PJLV twigs-c-vxxMQ twigs-c-vxxMQ-imfpdQ-size-md']";
		this.btnNextPage = '//button[@aria-label="Next"]';
		this.lblLatestEntiresCreated =
			"//table//tr[1]//td[contains(@class,'twigs-c-bHEcnO')][4]";
		this.lblLatestUpdated =
			"//table//tr[1]//td[contains(@class,'twigs-c-bHEcnO')][5]";
		this.lblLatestError =
			"//table//tr[1]//td[contains(@class,'twigs-c-bHEcnO')][6]";
		this.btnDownloadInEngageReports =
			"//button[@data-testid='index_icon-button_download'] | //button[@data-testid='document-export-dropdown_icon-button']"; // we can use this button across all the tabs in the reports section
		this.btnDownloadIn360Reports = `(//button[@data-testid='button' and @aria-haspopup='menu'])[1]`; // same in both overview and heatmap in 360 reports
		this.btnDownloadOverviewIn360Reports = `//span[normalize-space(.)="Action Plans"]/parent::button/parent::div/following-sibling::div//button`;
		this.btnDownloadResponses =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-icrtaVg-css']/following-sibling::button";
		this.btnDownloadCSV = "//div[@role='menuitem']//p[text()='CSV']";
		this.btnReportsHeader = (section) => `//div[text()='${section}']`;
		this.getMenuItemSelector = (value) =>
			`//div[@role="menuitem"]//p[text()="${value}"]`;
		this.btnGetDownloadType = (downloadType) =>
			`//div[@role='menuitem']//div[contains(text(),'${downloadType}')]`;
		this.btnSideBarMenu = (menuName) => `//div[text()='${menuName}']`;
		this.btnNextInCalendar = `//button[@aria-label="Next"]`;
		this.btnCalendarDate = (randomNumber) =>
			`//button[text()='${randomNumber}' and not(@aria-disabled) ]`;
		this.btnSelectOnCalendar = `//span[text()="Select"]/ancestor::button`;
		this.txttooltip = `//span[@role="tooltip"]`;
		this.imgSparrowDeskChatbotPopupLogo =
			"//img[contains(@src,'chatbot') or contains(@src,'sparrowdesk')]";
		this.btnSparrowDeskIcon = "//div[@class='chat-widget-launcher--img']";
		this.iframeSparrowDesk = "//iframe[@id='sd-launcher']";
		this.iframeSparrowDeskChatbot = "//iframe[@id='sd-canvas']";
		this.elementFeaturePopup = `//div[@data-testid="new-feature-modal_dialog-content"]`;
		this.btnCloseFeaturePopup = `//button[@data-testid="new-feature-modal_icon-button_close"]`;
		this.btnNavigateBack =
			"//button[contains(@class,'twigs-c-gSguNF-hmIMsL-cv')]";
	}

	async getSurveyEuiPage() {
		if (!this._surveyeuipage) {
			const { EUI } = await import(
				"../Pages/Surveys/Attend_Survey/attend-survey-EUI-page.js"
			);
			this._surveyeuipage = new EUI(this.page, this);
		}
		return this._surveyeuipage;
	}

	async search(search_value) {
		if (await PwActions.elementIsVisible(this.page, this.btnSearchEmployee)) {
			await PwActions.click(this.page, this.btnSearchEmployee);
		}
		await PwActions.focus(this.page, this.txtSearchbox);
		await PwActions.clearAndFill(this.page, this.txtSearchbox, search_value);
	}

	/**
	 * Function to get Survey URL from Email
	 *
	 * @param {string} to - Receiver Email
	 * @param {string} subject - Receiver Email Subject
	 * @param {string} body - Receiver Email Body
	 * @param {number} emailCutoffTime - Email cutoff time in seconds before the current time, by default is constants.emailFetchCutoffTime which is 2 minutes
	 * @returns {Promise<string>}
	 */
	async open_survey_from_received_email(
		subject,
		to,
		body,
		emailCutoffTime = constants.emailFetchCutoffTimeInMinutes,
	) {
		const url = await this.readEmail.fetch_survey_url_from_email({
			to: to,
			subject: subject,
			body: body,
			emailCutoffTimeInMinutes: emailCutoffTime,
		});
		return url;
	}

	/** This function is to navigate to different section in the Top navigation section */
	async navigateTopNavigateSection(topNavigationSection, page = this.page) {
		this.btnTopNavigations = `//a[text()='${topNavigationSection}']`;
		await PwActions.click(page, this.btnTopNavigations);
	}

	async navigateToTabs(tab, page = this.page) {
		const btnTopNavigationTab = `//button[text()='${tab}'] | //div[text()='${tab}']`;
		await PwActions.waitTillVisible(page, btnTopNavigationTab);
		await PwActions.click(page, btnTopNavigationTab);
	}

	/**
	 * Verifies that a property (by label) is NOT enabled/visible in the UI.
	 * Reusable across pages where properties are rendered as labels.
	 * @param {string} propertyLabel
	 */
	async verifyIsPropertynotEnabled(propertyLabel) {
		this.btnPropertyValue = `//label[text()='${propertyLabel}']`;
		await PwActions.verifyElementIsNotPresent(this.page, this.btnPropertyValue);
	}

	async waitTillLoadingElementDisappear(time, page = this.page) {
		await PwActions.waitTillElementDisappear(
			page,
			this.loadingElement,
			time * 1000,
		);
	}

	async waitTillLoadingElementAppear(time) {
		await PwActions.waitTillVisible(
			this.page,
			this.loadingElement,
			time * 1000,
		);
	}

	/**
	 * Opens a survey and attends it for a specified participant.
	 *
	 * @param {Object} params - The parameters for attending the survey.
	 * @param {string} params.participant - The participant type (e.g., "Subject", "Evaluator-Peer", "Evaluator-Manager", "Evaluator-Reportee").
	 * @param {Browser} params.browser - The browser instance to use for opening a new tab.
	 * @param {string} [params.subject="Subject"] - The subject identifier (e.g., "Subject", "Subject2", etc.).
	 * @param {string|Array<string>} [params.settings=[]] - Additional settings for attending the survey. Can be a string or array of strings.
	 */
	async openSurveyAndAttendSurveyForParticipant({
		participant,
		browser,
		subject = "Subject",
		settings = [],
	}) {
		// Normalize settings to always be an array
		let settingsArray = [];
		if (Array.isArray(settings)) {
			settingsArray = settings;
		} else if (typeof settings === "string" && settings !== "") {
			settingsArray = [settings];
		}

		const surveyEuiPage = await this.getSurveyEuiPage();
		await CommonUtils.sleep(10);
		let page2 = null;
		let survey_url = "";
		let email;
		if (participant === "Subject" || participant === "Subject2") {
			if (subject === "Subject") {
				subject = constants.subjectName;
				email = constants.subject_email;
			} else if (subject === "Subject2") {
				subject = constants.subjectName2;
				email = constants.subject_email2;
			} else if (subject === "Subject3") {
				subject = constants.subjectName3;
				email = constants.subjectEmail3;
			} else if (subject === "Subject4") {
				subject = constants.subjectName4;
				email = constants.subjectEmail4;
			} else if (subject === "Subject5") {
				subject = constants.subjectName5;
				email = constants.subjectEmail5;
			} else if (subject === "Subject6") {
			} else if (subject === "Subject6") {
				subject = constants.subjectName6;
				email = constants.subjectEmail6;
			}
			survey_url = await this.open_survey_from_received_email(
				constants.self_email_subject,
				email,
				constants.getSelfEmailBody(subject, EntityIds.surveyName),
			);
			page2 = await PwActions.openNewTab(browser);
			await PwActions.goTo(page2, survey_url);
			await surveyEuiPage.attendSurvey({
				page: page2,
				participantName: participant,
				subject: subject,
				settings: settingsArray,
			});
		} else {
			const participantMapping = {
				"Evaluator-Peer": constants.evaluatorName,
				"Evaluator-Reportee": constants.reporteeName,
				"Evaluator-Manager": constants.managerName,
			};

			if (participantMapping[participant]) {
				if (subject === "Subject") {
					subject = constants.subjectName;
				} else {
					subject = constants.subjectName2;
				}
				survey_url = await this.open_survey_from_received_email(
					constants.getEvaluatorEmailSubject(constants.subjectName),
					constants.subject_email,
					constants.getevaluatorEmailBody(
						participantMapping[participant],
						constants.subjectName,
						EntityIds.surveyName,
					),
				);
			} else {
				console.error(`Unknown participant type: ${participant}`);
			}
			const page3 = await PwActions.openNewTab(browser);
			await PwActions.goTo(page3, survey_url);
			page2 = await this.loginAndNavigateToSurveyPage(
				page3,
				participant,
				subject,
			);
			await surveyEuiPage.attendSurvey({
				page: page2,
				participantName: participant,
				subject: subject,
				settings: settingsArray,
			});
			await PwActions.closeTab(page3);
		}
		const surveyReporteeEvaluatorResponse = await surveyEuiPage.getResponse();
		await this.commonutils.addDataToJsonFile(
			`${EntityIds.surveyName} Survey Response.json`,
			surveyReporteeEvaluatorResponse,
		);
		await PwActions.closeTab(page2);
	}

	async openSurveyLinkInNewTab(participant, browser) {
		let survey_url = "";
		if (participant === "Subject") {
			survey_url = await this.open_survey_from_received_email(
				constants.self_email_subject,
				constants.subject_email,
				constants.getSelfEmailBody(constants.subjectName, EntityIds.surveyName),
			);
		} else if (participant === "Evaluator-Peer") {
			survey_url = await this.open_survey_from_received_email(
				constants.getEvaluatorEmailSubject(constants.subjectName),
				constants.subject_email,
				await constants.getevaluatorEmailBody(
					constants.evaluatorName,
					subject,
					EntityIds.surveyName,
				),
			);
			constants.getevaluatorEmailBody(
				participantMapping[participant],
				constants.subjectName,
				EntityIds.surveyName,
			);
		} else if (participant === "Evaluator-Manager") {
			survey_url = await this.open_survey_from_received_email(
				constants.getEvaluatorEmailSubject(constants.subjectName),
				constants.subject_email,
				await constants.getevaluatorEmailBody(
					constants.reporteeName,
					constants.subject_email,
					EntityIds.surveyName,
				),
			);
			constants.getevaluatorEmailBody(
				participantMapping[participant],
				constants.subjectName,
				EntityIds.surveyName,
			);
		} else if (participant === "Evaluator-Reportee") {
			survey_url = await this.open_survey_from_received_email(
				constants.getEvaluatorEmailSubject(constants.subjectName),
				constants.subject_email,
				await constants.getevaluatorEmailBody(
					constants.managerName,
					constants.subject_email,
					EntityIds.surveyName,
				),
			);
			constants.getevaluatorEmailBody(
				participantMapping[participant],
				constants.subjectName,
				EntityIds.surveyName,
			);
		}
		const page2 = await PwActions.openNewTab(browser);
		await PwActions.goTo(page2, survey_url);
		return page2;
	}
	/**
	 * This function retrieves all the  specific data for the page.
	 * @param {string} locator - The locator of employees detail which has to be retrieved.
	 * @returns {Promise<Array>} - An array of all Selected data details based on the provided parameter.
	 */
	async extractSelectedData(locator) {
		const allExtractedData = [];
		let isDisabled;
		do {
			const pageWiseData = [];
			await CommonUtils.sleep(2.5);
			isDisabled = await this.page.locator(this.btnNextPage).isDisabled();
			const allDatasElements = await PwActions.getWebElementsPage(
				this.page,
				locator,
			);
			for (const allData of allDatasElements) {
				const allDataTxt = await allData.textContent();
				pageWiseData.push(allDataTxt);
			}
			allExtractedData.push(...pageWiseData);
			if (!isDisabled) {
				await PwActions.jsClick(this.page, this.btnNextPage);
			}
		} while (!isDisabled);
		return allExtractedData;
	}

	/**function to get the number of entries created, updated and errors from the last import.
	 * @returns {Promise<{entries: number, updated: number, errors: number}>}	Returns the number of entries created, updated and errors.
	 */
	async getLatestImportEntries() {
		let entries = 0;
		let updated = 0;
		let errors = 0;
		let count = 0;

		while (count < 5) {
			const entriesText = await PwActions.getText(
				this.page,
				this.lblLatestEntiresCreated,
			);
			const updatedText = await PwActions.getText(
				this.page,
				this.lblLatestUpdated,
			);
			const errorsText = await PwActions.getText(
				this.page,
				this.lblLatestError,
			);
			entries = entriesText === "-" ? 0 : Number.parseInt(entriesText) || 0;
			updated = updatedText === "-" ? 0 : Number.parseInt(updatedText) || 0;
			errors = errorsText === "-" ? 0 : Number.parseInt(errorsText) || 0;

			if (entries > 0 || updated > 0 || errors > 0) {
				break;
			}

			await PwActions.pageRefresh(this.page);
			await CommonUtils.sleep(2); // Add a small delay between refreshes
			count++;
		}

		return { entries, updated, errors };
	}

	/**
	 * This function opens the survey from the email received by evaluator and attends the survey which is created from survey Template.
	 *
	 * @param {string} surveyName - The name of the survey
	 * @param {string} evaluatorRole - evaluator role
	 * @param {string} cookieValue - The cookie value to authenticate and fetch the survey data via API.
	 * @param {object} browser - the browser instance
	 */
	async attendSurveyThroughTemplate(
		surveyName,
		evaluatorRole,
		cookieValue,
		browser,
	) {
		let survey_url = "";
		survey_url = await this.open_survey_from_received_email(
			constants.self_email_subject,
			constants.subject_email,
			EntityIds.surveyName,
		);
		const page2 = await PwActions.openNewTab(browser);
		await PwActions.goTo(page2, survey_url);
		const surveyEuiPage = await this.getSurveyEuiPage();
		await surveyEuiPage.attendSurvey({
			page: page2,
			participantName: evaluatorRole,
			subject: constants.subjectName,
		});
	}

	/**
	 * Sets the date and time on the page.
	 *
	 * @param {object} page - The Playwright page object.
	 * @param {string} date - The date to set.
	 * @param {string} time - The time to set.
	 */

	async setDateAndTime(page, date, time) {
		const shortMonthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = shortMonthNames[currentDate.getMonth()];
		this.btnYear = `//span[text()='${currentYear}']`;
		this.btnMonth = `//button[not(@aria-expanded)]//span[contains(text(),'${currentMonth}')]`;
		await PwActions.click(page, this.btnYear);
		let [day, month, year] = date.split("-");
		day = day.startsWith("0") ? day.slice(1) : day;
		const [hr, min, tp] = time.match(/(\d+):(\d+)\s*(AM|PM)/).slice(1);
		const Month = shortMonthNames[Number.parseInt(month, 10) - 1];
		this.btnChooseYear = `//span[text()='${year}']`;
		this.btnChooseMonth = `//button[not(@aria-expanded)]//span[contains(text(),'${Month}')]`;
		this.btnChooseDay = `//button[text()='${day}' and not(contains(@class, 'isHidden-true'))]`;
		this.btnNextPage = "(//p[text()='Choose Year']//following::button)[1]";
		this.btnHour = "//div[@aria-label='hour']/p";
		this.btnMin = "//div[@aria-label='minute']/p";
		this.btnTp = "//div[@aria-label='AM/PM']/p"; // class name is not unique
		this.btnSave = "(//span[text()='Save'] | //span[text()='Done'])[last()]";
		let elementVisible = false;

		let retryCount = 0;
		const maxRetries = 10;
		while (!elementVisible && retryCount < maxRetries) {
			try {
				elementVisible = await PwActions.elementIsVisible(
					page,
					this.btnChooseYear,
				);

				if (elementVisible) {
					await PwActions.click(page, this.btnChooseYear);
				} else {
					await PwActions.click(page, this.btnNextPage);
				}
			} catch (error) {
				console.log("Error occurred, retrying...");
			}
			retryCount++;
		}
		await PwActions.click(page, this.btnMonth);
		await PwActions.click(page, this.btnChooseMonth);
		await PwActions.click(page, this.btnChooseDay);
		await PwActions.fill(page, this.btnHour, hr.toString());
		await PwActions.fill(page, this.btnMin, min.toString());
		await PwActions.fill(page, this.btnTp, tp.toString());
		await PwActions.click(page, this.btnSave);
		if (await PwActions.elementIsVisible(page, this.btnSave)) {
			await PwActions.waitAndClick(page, this.btnSave);
		}
	}

	/**
	 * Converts a given date-time input into a formatted date and time string.
	 *
	 * @param {string} input - The date-time input to be converted.
	 */

	async convertDateTime(input) {
		const date = new Date(input);

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const year = date.getFullYear();
		const formattedDate = `${day}-${month}-${year}`;
		let hours = date.getHours();
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const ampm = hours >= 12 ? "PM" : "AM";

		hours = hours % 12 || 12; // Convert 0 to 12 for midnight
		const formattedTime = `${hours}:${minutes} ${ampm}`;

		return {
			date: formattedDate,
			time: formattedTime,
		};
	}

	/**
	 * Function to get the current week number and day of the week from the given date.
	 *
	 * @param {string} dateString - The date string to get the week number and day from.
	 */

	async getWeekAndDay(dateString) {
		const date = new Date(dateString);

		// Calculate the day of the year
		const startOfYear = new Date(date.getFullYear(), 0, 1);
		const dayOfYear =
			Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + 1;

		const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
		const year = date.getFullYear();
		const month = date.getMonth();
		const targetDay = date.getDay();
		const targetDate = date.getDate();
		let weekValue = 0;
		for (let day = 1; day <= 31; day++) {
			const checkDate = new Date(year, month, day);
			if (checkDate.getMonth() !== month) break;
			if (checkDate.getDay() === targetDay) {
				weekValue++;
				if (day === targetDate) {
					break;
				}
			}
		}
		return { weekValue, dayOfWeek };
	}

	/**
	 function to convert integers into their ordinal equivalents
	*/

	async numberToOrdinalWord(num) {
		const ordinalWords = [
			"Zeroth",
			"First",
			"Second",
			"Third",
			"Fourth",
			"Fifth",
			"Sixth",
			"Seventh",
			"Eighth",
			"Ninth",
			"Tenth",
			"Eleventh",
			"Twelfth",
			"Thirteenth",
			"Fourteenth",
			"Fifteenth",
			"Sixteenth",
			"Seventeenth",
			"Eighteenth",
			"Nineteenth",
		];

		const tensWords = [
			"",
			"",
			"Twentieth",
			"Thirtieth",
			"Fortieth",
			"Fiftieth",
			"Sixtieth",
			"Seventieth",
			"Eightieth",
			"Ninetieth",
		];

		if (num < 20) {
			return String(ordinalWords[num]);
		}

		const tens = Math.floor(num / 10);
		const ones = num % 10;

		if (ones === 0) {
			return String(tensWords[tens]); // Exact tens like 20th, 30th
		} else {
			return String(`${tensWords[tens].slice(0, -2)}-${ordinalWords[ones]}`);
		}
	}

	/**
	 function to add minutes to a given time
	 */
	async addMinutesToTime(time, minutesToAdd) {
		let [timePart, modifier] = time.split(" ");
		let [hours, minutes] = timePart.split(":").map(Number);

		if (modifier === "PM" && hours < 12) {
			hours += 12;
		}
		if (modifier === "AM" && hours === 12) {
			hours = 0;
		}

		minutes += Number.parseInt(minutesToAdd, 10);

		hours += Math.floor(minutes / 60);
		minutes = minutes % 60;

		hours = hours % 24;

		modifier = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12;

		minutes = minutes < 10 ? "0" + minutes : minutes;

		return `${hours}:${minutes} ${modifier}`;
	}

	/**
	 * Function to verify a checkbox is checked.
	 *
	 * @param {string} checkboxLabel - The label of the checkbox to verify.
	 */
	async verifyCheckboxChecked(checkboxtoggle, page = this.page) {
		const isChecked = await page.isChecked(checkboxtoggle);
		expect(isChecked).toBe(true);
	}

	/**
	 * Function to verify a checkbox is unchecked.
	 *
	 * @param {string} checkboxLabel - The label of the checkbox to verify.
	 */
	async verifyCheckboxUnchecked(checkboxLabel, page = this.page) {
		await PwActions.waitForNetworkIdle(page, 15000);
		await CommonUtils.sleep(2);
		const isUnchecked = await page.isChecked(checkboxLabel);
		expect(isUnchecked).toBe(false);
	}

	/**
	 * Unchecks a toggle switch.
	 *
	 * @param {object} page - The Playwright page object.
	 * @param {string} selector - The selector of the toggle switch to uncheck.
	 */

	async uncheckToggle(page, selector) {
		await PwActions.toggleCheckBox(page, false, selector);
	}

	async loginAndNavigateToSurveyPage(page, participant, subject) {
		let username = "";
		const password = "Test@1234";

		if (participant === "Evaluator-Peer") {
			username = constants.evaluator_email;
		} else if (participant === "Evaluator-Reportee") {
			username = constants.reportee_evaluator_email;
		} else if (participant === "Evaluator-Manager") {
			username = constants.manager_evaluator_email;
		}

		this.loginpage = new LoginPage(page);
		await this.loginpage.login(page, username, password);
		this.commonfunction = new CommonPageFunctions(page);
		await this.commonfunction.navigateTopNavigateSection("Performance");
		await this.commonfunction.navigateToTabs("Tasks");
		this.taskPage = new TasksPage(page);
		await this.taskPage.selectSurvey(EntityIds.surveyName);
		const [newPage] = await Promise.all([
			page.context().waitForEvent("page"),
			await this.taskPage.evaluateSubject(subject),
		]);
		return newPage;
	}

	/**
	 * This function downloads a file and returns the path and extension of the downloaded file.
	 * @param {Page} page - The Playwright page object.
	 * @param {string} selector - The selector of the element that triggers the download.
	 * @param {number} [timeout=30000] - Optional timeout in milliseconds (default 30 seconds)
	 * @returns {Promise<{filePath: string, extension: string}>} Object containing the download path and file extension
	 */
	async downloadFileAndReturnPath(page, selector, timeout = 30000) {
		const [download] = await Promise.all([
			page.waitForEvent("download", { timeout }),
			PwActions.click(page, selector),
		]);

		// Create downloads directory if it doesn't exist
		const downloadsDir = path.join(process.cwd(), "downloads");
		if (!fs.existsSync(downloadsDir)) {
			fs.mkdirSync(downloadsDir, { recursive: true });
		}

		const suggestedFilename = download.suggestedFilename();
		const extension = suggestedFilename.split(".").pop().toLowerCase();

		// Save the file to the downloads directory
		const filePath = path.join(downloadsDir, suggestedFilename);
		await download.saveAs(filePath);
		expect(
			fs.existsSync(filePath),
			"Download failed: File not saved",
		).toBeTruthy();

		return {
			filePath,
			extension,
		};
	}

	/**
	 * Function to navigate to the reports header section
	 * @param {string} sectionName - The name of the section to navigate to
	 */
	async navigateEngageReportsHeader(sectionName) {
		const section = this.btnReportsHeader(sectionName);
		await PwActions.click(this.page, section);
	}

	/**
	 * Navigates to the specified page URL based on the page name.
	 *
	 * This function constructs the URL for the specified page name by appending the appropriate path
	 * to the base URI from the environment details and navigates to the resulting URL.
	 * @param {string} pageName - The name of the page to navigate to (e.g., "Performance", "Engage").
	 * @returns {Promise<void>} - A promise that resolves when the navigation is complete.
	 */
	async navigateToPageUrl(pageName) {
		let url = "";
		if (pageName === "Performance") {
			url = envDetails.uri + urlPaths.performance;
		} else if (pageName === "Engage") {
			url = envDetails.uri + urlPaths.engage;
		} else if (pageName === "People") {
			url = envDetails.uri + urlPaths.peopleEmployee;
		}
		await PwActions.goTo(this.page, url);
	}

	/**
	 * Note : This function can be used only after survey is attended as it extracts questions from the survey json data which is available only after survey is attended.
	 * This function extracts section wise questions from the json data.
	 * @param {object} jsonData - The json data to extract section wise questions from.
	 * @returns {array} result - An array of section wise questions.
	 */
	async extractSectionWiseQuestions(jsonData) {
		const result = [];
		const uniqueQuestions = new Set();
		let sectionIndex = 1;

		// Extract the first evaluator's data only (avoiding duplicate processing for different roles)
		const totalSections = Object.values(jsonData)[0];
		expect(totalSections, "No sections found in the survey").not.toBeNull();
		for (const sections of Object.values(totalSections)) {
			for (const [section, questions] of Object.entries(sections)) {
				const sectionData = { section: section, questions: [] };
				expect(
					sectionData,
					`No Data found in this section - ${section}`,
				).not.toBeNull();
				let questionIndex = 1;

				for (const question of Object.keys(questions)) {
					if (!uniqueQuestions.has(question)) {
						uniqueQuestions.add(question);
						sectionData.questions.push({
							number: `${sectionIndex}.${questionIndex}`,
							text: question,
						});
						questionIndex++;
					}
				}
				if (sectionData.questions.length > 0) {
					result.push(sectionData);
					sectionIndex++; // Increment section index after processing each section
				}
			}
		}
		return result;
	}

	/**
	 * Note : This function can be used only after survey is attended as it extracts questions from the survey json data which is available only after survey is attended.
	 * This function extracts questions from the survey json data.
	 * @param {object} jsonData - The json data to extract questions from.
	 * @returns {Promise<array>} result - An array of questions.
	 */
	async getQuestionsFromSurvey(jsonData) {
		const sections = await this.extractSectionWiseQuestions(jsonData);
		expect(sections, "No sections found in the survey").not.toBeNull();
		const result = [];
		let sectionIndex = 1;
		for (const section of sections) {
			for (const q of section.questions) {
				expect(q, "No question found in the survey").not.toBeNull();
				result.push(q.number + " - " + q.text);
			}
			sectionIndex++;
		}
		return result;
	}

	/**
	 * Function to download the overview report in Engage and 360 reports
	 * @param {string} surveyType - The type of survey to download the report for (Engage or 360)
	 * @returns {Promise<string>} - Path to the downloaded PDF file
	 */
	async downloadOverviewReport(surveyType) {
		const survey = surveyType.toLowerCase();
		let downloadResult = {};
		await PwActions.pageRefresh(this.page);
		expect(["engage", "performance"], "Invalid survey type").toContain(survey);

		const btnDownloadReport =
			survey === "engage"
				? this.btnDownloadInEngageReports
				: this.btnDownloadOverviewIn360Reports;

		await PwActions.waitTillVisible(this.page, btnDownloadReport, 30000);
		if (survey === "engage") {
			// For Engage, click the download button, then select PDF to download
			await PwActions.click(this.page, btnDownloadReport);
			await PwActions.waitForElementVisibility(
				this.page,
				this.btnGetDownloadType("PPT"),
				30000,
			);

			downloadResult = await this.downloadFileAndReturnPath(
				this.page,
				this.btnGetDownloadType("PDF"),
				50000,
			);
		} else {
			// For Performance, just download directly
			downloadResult = await this.downloadFileAndReturnPath(
				this.page,
				btnDownloadReport,
				50000,
			);
		}

		//await CommonUtils.verifyFileExtension(downloadResult.extension, "pdf"); commneted since we have bug in verifyFileExtension
		return { filePath: downloadResult.filePath };
	}

	/**
	 * Function to download the heatmap report in Engage and 360 reports
	 * @param {string} surveyType - The type of survey to download the report for (Engage or 360)
	 * @returns {Promise<string>} - Path to the downloaded CSV file
	 */
	async downloadHeatmap(surveyType, page = this.page) {
		const survey = surveyType.toLowerCase();
		expect(["engage", "performance"], "Invalid survey type").toContain(survey);
		let downloadResult = {};
		const btnDownloadCsv =
			survey === "engage"
				? this.btnDownloadInEngageReports
				: this.btnDownloadIn360Reports;

		await PwActions.waitTillVisible(page, btnDownloadCsv);

		if (survey === "performance") {
			await PwActions.click(page, btnDownloadCsv);
			const btnExportAsExcel = this.performanceHeatmapPage.btnExportAsExcel;
			await PwActions.waitTillVisible(page, btnExportAsExcel, 30000);
			downloadResult = await this.downloadFileAndReturnPath(
				page,
				btnExportAsExcel,
				50000,
			);
		} else {
			downloadResult = await this.downloadFileAndReturnPath(
				page,
				btnDownloadCsv,
				50000,
			);
		}
		//await CommonUtils.verifyFileExtension(downloadResult.extension, "csv"); commneted since we have bug in verifyFileExtension
		return { filePath: downloadResult.filePath };
	}

	/**
	 * Function to download the responses report in Engage and 360 reports
	 * @param {string} surveyType - The type of survey (Engage or Performance)
	 * @returns {Promise<{filePath: string, extension: string}>} Object containing download path and file extension
	 */
	async downloadResponses(surveyType, page = this.page) {
		const survey = surveyType.toLowerCase();
		expect(["engage", "performance"], "Invalid survey type").toContain(survey);
		const btnDownload =
			survey === "engage"
				? this.btnDownloadInEngageReports
				: this.btnDownloadResponses;

		await PwActions.waitTillVisible(page, btnDownload, 30000);
		let downloadResult = {};

		if (survey === "performance") {
			await PwActions.click(page, btnDownload);
			downloadResult = await this.downloadFileAndReturnPath(
				page,
				this.btnDownloadCSV,
				50000,
			);
		} else {
			downloadResult = await this.downloadFileAndReturnPath(
				page,
				btnDownload,
				50000,
			);
		}
		//await CommonUtils.verifyFileExtension(downloadResult.extension, "csv"); commneted since we have bug in verifyFileExtension

		return { filePath: downloadResult.filePath };
	}

	/**
	 * Loads all data from an infinite scroll list by scrolling until no more data is returned from the API.
	 * Useful for tables or lists that load more items as you scroll, fetching data from the backend.
	 * Stops scrolling when maximum rows limit is reached or no more data is available.
	 * @param {Object} params - The parameters object
	 * @param {Page} params.page - Playwright page instance
	 * @param {string} params.apiUrl - The API URL to fetch data from
	 * @param {string} params.containerSelector - Selector for the scrollable container
	 * @param {string} params.rowSelector - Selector for the table/list rows
	 * @param {number} [params.maxTries=3] - Maximum number of attempts to check for new data before stopping
	 * @param {number} [params.maximumRows=70] - Maximum number of rows to load before stopping scroll
	 * @returns {Promise<number>} - The total number of rows loaded
	 * @example
	 * // Loading all data from an infinite scroll list
	 * await commonFunctions.loadAllDataFromInfiniteScroll({
	 *   page: page,
	 *   apiUrl: constants.getOkrsApiEndpoint,
	 *   containerSelector: "//div[@data-testid='container']",
	 *   rowSelector: "//div[@data-testid='row']",
	 *   maxTries: 3,
	 *   maximumRows: 70
	 * });
	 */
	async loadAllDataFromInfiniteScroll({
		page,
		apiUrl,
		containerSelector,
		rowSelector,
		maxTries = 3,
		maximumRows = 150,
	}) {
		const getRowCount = async () =>
			await PwActions.performAction(async () =>
				PwActions.getWebElements(page, rowSelector).then((els) => els.length),
			);
		let prevCount = -1;
		let newCount = await getRowCount();
		let tries = 0;
		logger.info("Starting infinite scroll data load...");
		while (tries < maxTries) {
			prevCount = newCount;

			// Check if maximum rows limit is reached
			if (newCount >= maximumRows) {
				logger.info(
					`Maximum rows limit (${maximumRows}) reached. Stopping scroll.`,
				);
				break;
			}

			await page.locator(containerSelector).evaluate((el) => {
				el.scrollTo(0, el.scrollHeight);
			});
			try {
				const response = await page.waitForResponse(
					(res) => res.url().includes(apiUrl) && res.status() === 201,
					{ timeout: 5000 },
				);

				const data = await response.json().catch(() => null);
				if (!data?.data?.length) {
					logger.info("No more data available");
					break;
				}
			} catch {
				logger.info("No API call detected");
			}

			newCount = await getRowCount();
			logger.info(`Rows loaded: ${newCount} (previous: ${prevCount})`);

			if (newCount === prevCount) {
				tries++;
				logger.info(`No new rows detected, attempt ${tries}/${maxTries}`);
			} else {
				tries = 0;
			}
		}
		logger.info(`✅ Finished loading. Total rows: ${newCount}`);
		return newCount;
	}

	/**
	 * Verifies that a downloaded CSV file contains data by checking if it has rows.
	 * Uses expect assertions for error handling.
	 * @param {string} filePath - Path to the downloaded CSV file
	 * @returns {Promise<boolean>} - Returns true if CSV has rows, throws error if empty
	 */
	async verifyDownloadedCSV(filePath) {
		try {
			const csvContent = fs.readFileSync(filePath, "utf-8");
			const rows = csvContent.split("\n").filter((row) => row.trim());
			expect(
				rows.length,
				"CSV file is empty or contains only headers",
			).toBeGreaterThan(1);
			logger.info(`CSV file contains ${rows.length - 1} data rows`);
			return true;
		} catch (error) {
			logger.error(`Error verifying CSV file: ${error.message}`);
			throw error;
		}
	}
	/**
	 * Clicks a sidebar menu by its name.
	 * @example
	 * // Navigates to the "Account" sidebar menu
	 * await commonPageFunctions.navigateToSideBarMenu("Account");
	 * @param {string} menuName - The name of the sidebar menu to navigate to.
	 * @returns {Promise<void>}
	 */
	async navigateToSideBarMenu(menuName, page = this.page) {
		await PwActions.click(page, this.btnSideBarMenu(menuName));
	}
	/**
	 * Function to get a menu item from the menu
	 * @param {Page} page - Playwright page instance
	 * @param {string} value - The value of the menu item to get
	 * @returns {Promise<void>} - Returns true if the menu item is found and clicked
	 * @example
	 * // Getting a menu item from the menu
	 * await commonFunctions.getMenuItem(page, "CSV");
	 */
	async getMenuItem(page, value) {
		await PwActions.click(
			page,
			`//div[@role="menuitem"]/p[text()="${value}"] | //div[@role="menuitem" and normalize-space(text())="${value}"]`,
		);
	}
	async chooseRandomDateOnCalendar({ page, monthsFromNow = null }) {
		const randomClicks = monthsFromNow
			? monthsFromNow
			: CommonUtils.getRandomIntInclusive(1, 3);
		await Promise.all(
			Array.from({ length: randomClicks }).map(() =>
				PwActions.click(page, this.btnNextInCalendar),
			),
		);
		const randomNumber = CommonUtils.getRandomIntInclusive(1, 28);
		await PwActions.click(page, this.btnCalendarDate(randomNumber));
		if (await PwActions.elementIsVisible(page, this.btnSelectOnCalendar)) {
			await PwActions.click(page, this.btnSelectOnCalendar);
		}
	}
	async getsurveyAPIDetails(cookie) {
		this.survey_id = EntityIds.getsurveyId();
		const internal_url = `${envDetails.uri}/api/internal/surveys/${this.survey_id}`;
		const cookieValue = cookie;
		const api_action = new APIActions();
		const api_data = await api_action.getRequest({
			url: internal_url,
			cookieValue: cookieValue,
			headers: [],
		});
		return api_data;
	}
	/**
	 * Hovers over the tooltip element and retrieves the tooltip text.
	 * @param {Page} page - Playwright page instance
	 * @param {string} selector - The selector of the tooltip element
	 * @param {string} expectedText - The expected text of the tooltip
	 * @returns {Promise<void>} No return value.
	 * @example
	 * // Get tooltip text for Favicon
	 * await commonFunctions.verifyTooltipText({ page: this.page, selector: this.btnTooltip("Favicon"), expectedText: "Upload a .jpg or .png file of atleast 40x40px dimensions." });
	 */
	async verifyTooltipText({ page = this.page, selector, expectedText }) {
		await PwActions.hover(page, selector);
		const tooltipText = await PwActions.getText(page, this.txttooltip);
		await PwActions.verifyTextExpected(tooltipText, expectedText);
	}

	/**
	 * Closes the SparrowDesk chatbot popup if it is visible.
	 * The chatbot content is inside an iframe, so we need to switch context first.
	 * @param {Page} page - Playwright page instance (optional, defaults to this.page)
	 * @returns {Promise<void>}
	 * @example
	 * // Close chatbot popup
	 * await commonFunctions.closeSparrowDeskPopup(page);
	 */
	async closeSparrowDeskPopup(page = this.page) {
		try {
			await PwActions.waitForNetworkIdle(page, 5000);
			const sparrowDeskChatbotFrame = await PwActions.switchToFrame(
				page,
				this.iframeSparrowDeskChatbot,
			);
			await PwActions.waitForElement(
				sparrowDeskChatbotFrame,
				this.imgSparrowDeskChatbotPopupLogo,
				3000,
			);
			const isActuallyVisible = await PwActions.elementIsVisible(
				sparrowDeskChatbotFrame,
				this.imgSparrowDeskChatbotPopupLogo,
				1,
			);

			if (isActuallyVisible) {
				logger.info(
					"SparrowDesk chatbot popup is visible, proceeding to close",
				);
				const sparrowDeskFrame = await PwActions.switchToFrame(
					page,
					this.iframeSparrowDesk,
				);
				await PwActions.click(sparrowDeskFrame, this.btnSparrowDeskIcon);
				await PwActions.click(sparrowDeskFrame, this.btnSparrowDeskIcon);
				await PwActions.pageRefresh(page);
				logger.info("SparrowDesk chatbot popup closed successfully");
			} else {
				await PwActions.switchToDefaultContent(page);
				logger.info(
					"SparrowDesk chatbot popup logo not visible, skipping close action",
				);
			}
		} catch (error) {
			logger.info("SparrowDesk chatbot popup not found or already closed");
		}
	}

	/**
	 * Checks if next page button is enabled and clicks it
	 * @param {Object} page - Playwright page object
	 * @param {string} nextOrPreviousPageLocator - Locator for the next or previous page button
	 * @returns {Promise<boolean>} - Returns true if next page was clicked, false if disabled
	 */
	async clickNextOrPreviousPageIfEnabled(page, nextOrPreviousPageLocator) {
		return await PwActions.performAction(async () => {
			const button = await page.locator(nextOrPreviousPageLocator);
			const isEnabled = await button.isEnabled();
			if (isEnabled) {
				await PwActions.click(page, nextOrPreviousPageLocator);
				return true;
			}
			return false;
		});
	}

	/**
	 * Navigates back to the previous page.
	 * @param {Page} page - Playwright page instance
	 * @param {string} selector - The selector of the back button
	 * @returns {Promise<void>}
	 */
	async navigateBack(page = this.page, selector = this.btnNavigateBack) {
		await PwActions.click(page, selector);
	}

	/**
	 * Closes the feature popup if it is present.
	 * @param {Page} page - Playwright page instance
	 * @returns {Promise<void>}
	 * @example
	 * // Close the feature popup if it is present
	 * await commonFunctions.closeFeaturePopupIfPresent();
	 */
	async closeFeaturePopupIfPresent(page = this.page) {
		await PwActions.waitForNetworkIdle(page, 15000);
		if (await PwActions.elementIsVisible(page, this.elementFeaturePopup)) {
			await PwActions.click(page, this.btnCloseFeaturePopup);
		}
	}
}

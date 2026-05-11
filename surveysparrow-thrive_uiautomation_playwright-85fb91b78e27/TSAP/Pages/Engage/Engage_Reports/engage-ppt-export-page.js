import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { pptExportData } from "../../../Data/Resources/constants.js";
import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";
/**
 * Page Object for Engage PPT Export functionality.
 * Handles PPT configuration modal, slide selection, global/per-slide config,
 * duplication, deletion, reorder, and export operations.
 */
class EngagePPTExportPage {
	constructor(page) {
		this.page = page;
		// Export Dropdown Elements
		this.btnExportDropdown =
			"//button[@data-testid='document-export-dropdown_icon-button']";
		this.menuItemDownloadPDF =
			"//div[@role='menuitem'][normalize-space()='Download PDF']";
		this.menuItemDownloadPPT =
			"//div[@role='menuitem'][normalize-space()='Download PPT']";
		// Modal Elements
		this.modalOverlay =
			"//div[@data-state='open'][contains(@class, 'dialog__overlay')]";
		this.containerModalHeader = "//div//p[normalize-space()='Configure PPT']";
		this.btnClose =
			"//button[@data-testid='configure-ppt-modal-content_icon-button_close']";
		this.btnSave =
			"//button[@data-testid='configure-ppt-modal-content_button_save']";
		this.btnDownload =
			"//button[@data-testid='configure-ppt-modal-content_button_download']";
		// Slide List
		this.containerSlideItems = "//div[@data-testid='slide-item_flex']";
		this.btnAddSlides =
			"//button[@data-testid='button'][normalize-space()='Add Slides']";
		// Settings link
		this.lnkSettings =
			"//div[@data-testid='flex'][normalize-space()='Settings']";
		// Preview
		this.containerPreview = "//div[@id='document-export-slides-container']";
		this.btnZoomIn = "//button[@aria-label='Zoom In']";
		this.btnZoomOut = "//button[@aria-label='Zoom Out']";
		// Back button (inside configure-slide / settings panels)
		this.btnBackToSlides =
			"//button[@data-testid='configure-ppt-modal-content_icon-button_back-button']";
		// Slide Options Menu Items
		this.menuItemConfigureSlide =
			"//div[@data-testid='slide-item_dropdown-menu-item_configure-slide']";
		this.menuItemDuplicateSlide =
			"//div[@data-testid='slide-item_dropdown-menu-item_duplicate-slide']";
		this.menuItemDeleteSlide =
			"//div[@data-testid='slide-item_dropdown-menu-item_delete-slide']";
		// Dynamic dropdown selector for settings (Global & Per-slide config)
		// Usage: this.getSettingsDropdown('Group By'), this.getSettingsDropdown('Score By')
		this.getSettingsDropdown = (labelName) =>
			`//div[@role='dialog']//label[normalize-space()='${labelName}']/ancestor::div[@data-testid='box']//input`;
		// Settings Panel dropdowns (works for both Global Settings & Per-slide config)
		this.drpdwnScoreBy = this.getSettingsDropdown("Score By");
		this.drpdwnGroupBy = this.getSettingsDropdown("Group By");
		this.drpdwnCompareWith = this.getSettingsDropdown("Compare With");
		this.lblBrandSettings = "//p[normalize-space()='BRAND SETTINGS']";
		// Filters section (Global & Per-slide config)
		this.lblFilters = "//div[@role='dialog']//p[normalize-space()='Filters']";
		this.btnAddFilter =
			"//div[@role='dialog']//p[normalize-space()='Filters']/ancestor::div[@data-testid='flex']/following-sibling::div//button";
		this.filterChipTexts =
			"//div[@role='dialog']//p[normalize-space()='Filters']/parent::div/following-sibling::div//p";
		this.filterMenuItems = "//div[@role='menuitem']";
		this.getFilterMenuItem = (filterName) =>
			`//div[@role='menuitem']//p[normalize-space()='${filterName}']`;
		this.filterValueCheckbox = (value) =>
			`//div[@data-testid='cascaded-custom-dropdown_flex']//p[normalize-space()='${value}']/ancestor::div[@data-testid='cascaded-custom-dropdown_flex']//button`;
		this.inputFilterDropdown =
			"//input[@data-testid='cascaded-custom-dropdown_input']";
		this.btnApplyFilter = "//span[contains(normalize-space(.),'Apply')]";
		this.btnResetFilter =
			"//div[@role='dialog']//span[contains(normalize-space(.),'Reset')]";
		// Per-slide Title and Description
		this.txtBoxSlideTitle =
			"//p[normalize-space()='Title']/following::input[1]";
		this.txtBoxSlideDescription =
			"//p[normalize-space()='Description']/following::textarea[1]";
		this.txtPptLoader = "(//p[contains(text(),'Loading data')])[1]";
		// Reusable dropdown option selector (twigs-select options)
		this.getSelectOption = (optionText) =>
			`//div[contains(@class,'select__option')][normalize-space()='${optionText}']`;
		// Read currently selected value from a dropdown by label name
		this.getSelectedDropdownValue = (labelName) =>
			`//div[@role='dialog']//label[normalize-space()='${labelName}']/ancestor::div[@data-testid='box']//input/ancestor::div[1] /preceding-sibling::div[1]`;
		// Dynamic selectors for slides
		this.getSlideByName = (slideName) =>
			`//div[@data-testid='slide-item_flex']//p[@data-testid='text'][normalize-space()='${slideName}']`;
		this.getSlideCheckbox = (slideName) =>
			`//div[@data-testid='slide-item_flex'][.//*[normalize-space()='${slideName}']]//button[@role='checkbox']`;
		this.getSlideOptionsMenu = (slideName) =>
			`//div[@data-testid='slide-item_flex'][.//*[normalize-space()='${slideName}']]//button[@aria-haspopup='menu']`;
		this.getSlideDragHandle = (slideName) =>
			`(//div[@data-testid='slide-item_flex'][.//*[normalize-space()='${slideName}']]//div//*[name()='svg'])[1]`;
		// Dynamic selector for preview slide heading
		this.getPreviewSlideHeading = (slideName) =>
			`${this.containerPreview}//h1[normalize-space()='${slideName}']`;
	}
	// ── Modal Lifecycle ──────────────────────────────────────────────
	/**
	 * Opens the PPT configuration modal from the report page.
	 * @returns {Promise<void>}
	 */
	async openPPTConfiguration() {
		await PwActions.waitTillVisible(this.page, this.btnExportDropdown);
		await PwActions.click(this.page, this.btnExportDropdown);
		await PwActions.waitTillVisible(this.page, this.menuItemDownloadPPT);
		await PwActions.click(this.page, this.menuItemDownloadPPT);
		await PwActions.waitTillVisible(this.page, this.modalOverlay);
		await PwActions.waitTillVisible(this.page, this.containerModalHeader);
	}
	/**
	 * @returns {Promise<boolean>} true if the Configure PPT modal is open
	 */
	async isPPTConfigModalOpen() {
		return await PwActions.elementIsVisible(
			this.page,
			this.containerModalHeader,
		);
	}
	/**
	 * Closes the PPT configuration modal via the X button.
	 * @returns {Promise<void>}
	 */
	async closePPTConfiguration() {
		await PwActions.click(this.page, this.btnClose);
		await PwActions.waitTillElementDisappear(this.page, this.modalOverlay);
	}
	// ── Slide Queries ────────────────────────────────────────────────
	/**
	 * @param {string} slideName
	 * @returns {Promise<boolean>} true if the slide is listed in the config panel
	 */
	async isSlideVisible(slideName) {
		return await PwActions.elementIsVisible(
			this.page,
			this.getSlideByName(slideName),
		);
	}
	/**
	 * @param {string} slideName
	 * @returns {Promise<boolean>} true if the slide checkbox is checked
	 */
	async isSlideChecked(slideName) {
		const ariaChecked = await PwActions.getAttributeValue(
			this.page,
			this.getSlideCheckbox(slideName),
			"aria-checked",
		);
		return ariaChecked === "true";
	}
	/**
	 * Checks whether the slide checkbox is disabled (mandatory slides like Introduction).
	 * @param {string} slideName
	 * @returns {Promise<boolean>}
	 */
	async isSlideCheckboxDisabled(slideName) {
		const disabledLocator = `//div[@data-testid='slide-item_flex'][.//*[normalize-space()='${slideName}']]//button[@data-disabled and @disabled and @value='on']`;
		return await PwActions.elementIsVisible(this.page, disabledLocator);
	}
	/**
	 * Toggles the checkbox for a slide.
	 * @param {string} slideName
	 * @returns {Promise<void>}
	 */
	async toggleSlide(slideName) {
		await PwActions.click(this.page, this.getSlideCheckbox(slideName));
	}
	/**
	 * Returns the "From: <source>" text for a slide.
	 * @param {string} slideName
	 * @returns {Promise<string>}
	 */
	async getSlideSourceText(slideName) {
		const sourceLocator = `//div[@data-testid='slide-item_flex'][.//*[normalize-space()='${slideName}']]//p[contains(text(), 'From:')]`;
		return await PwActions.getText(this.page, sourceLocator);
	}
	/**
	 * Returns the total number of slide items in the configuration list.
	 * @returns {Promise<number>}
	 */
	async getSlideCount() {
		const elements = await PwActions.getWebElements(
			this.page,
			this.containerSlideItems,
		);
		return elements.length;
	}
	/**
	 * Returns an ordered array of all slide names currently in the list.
	 * @returns {Promise<string[]>}
	 */
	async getSlideNamesList() {
		const nameLocator = `${this.containerSlideItems}//p[@data-testid='text'][1]`;
		const elements = await PwActions.getWebElements(this.page, nameLocator);
		const names = [];
		for (const el of elements) {
			const text = await el.innerText();
			names.push(text.trim());
		}
		return names;
	}
	/**
	 * Gets all visible slide names by iterating `pptExportData.slideNames`.
	 * @returns {Promise<string[]>}
	 */
	async getAllVisibleSlides() {
		const visibleSlides = [];
		for (const slideName of Object.values(pptExportData.slideNames)) {
			if (await this.isSlideVisible(slideName)) {
				visibleSlides.push(slideName);
			}
		}
		return visibleSlides;
	}
	/**
	 * Gets all checked slide names by iterating `pptExportData.slideNames`.
	 * @returns {Promise<string[]>}
	 */
	async getAllCheckedSlides() {
		const checkedSlides = [];
		for (const slideName of Object.values(pptExportData.slideNames)) {
			if (
				(await this.isSlideVisible(slideName)) &&
				(await this.isSlideChecked(slideName))
			) {
				checkedSlides.push(slideName);
			}
		}
		return checkedSlides;
	}
	/**
	 * Unchecks all optional slides (keeps mandatory ones like Introduction).
	 * @returns {Promise<void>}
	 */
	async uncheckAllOptionalSlides() {
		const mandatorySlides = pptExportData.mandatorySlides;
		for (const slideName of Object.values(pptExportData.slideNames)) {
			if (!mandatorySlides.includes(slideName)) {
				if (await this.isSlideChecked(slideName)) {
					await this.toggleSlide(slideName);
				}
			}
		}
	}
	/**
	 * Checks all slides that are currently unchecked and not disabled.
	 * @returns {Promise<void>}
	 */
	async checkAllSlides() {
		for (const slideName of Object.values(pptExportData.slideNames)) {
			const isChecked = await this.isSlideChecked(slideName);
			const isDisabled = await this.isSlideCheckboxDisabled(slideName);
			if (!isChecked && !isDisabled) {
				await this.toggleSlide(slideName);
			}
		}
	}
	// ── Slide Options Menu Actions ───────────────────────────────────
	/**
	 * Opens the three-dot options menu for a specific slide.
	 * @param {string} slideName
	 * @returns {Promise<void>}
	 */
	async openSlideOptionsMenu(slideName) {
		await PwActions.click(this.page, this.getSlideOptionsMenu(slideName));
		await PwActions.waitTillVisible(this.page, this.menuItemConfigureSlide);
	}
	/**
	 * Opens the per-slide configuration panel for the given slide.
	 * @param {string} slideName
	 * @returns {Promise<void>}
	 */
	async configureSlide(slideName) {
		await this.openSlideOptionsMenu(slideName);
		await PwActions.click(this.page, this.menuItemConfigureSlide);
		await PwActions.waitTillVisible(this.page, this.btnBackToSlides);
	}
	/**
	 * Duplicates the given slide via its options menu.
	 * @param {string} slideName
	 * @returns {Promise<void>}
	 */
	async duplicateSlide(slideName) {
		await this.openSlideOptionsMenu(slideName);
		await PwActions.click(this.page, this.menuItemDuplicateSlide);
		await CommonUtils.sleep(1);
	}
	/**
	 * Deletes the given slide via its options menu.
	 * @param {string} slideName
	 * @returns {Promise<void>}
	 */
	async deleteSlide(slideName) {
		await this.openSlideOptionsMenu(slideName);
		await PwActions.click(this.page, this.menuItemDeleteSlide);
		await CommonUtils.sleep(1);
	}
	// ── Navigation ───────────────────────────────────────────────────
	/**
	 * Opens the Global Settings panel from the slide list view.
	 * @returns {Promise<void>}
	 */
	async openGlobalSettings() {
		await PwActions.click(this.page, this.lnkSettings);
		await PwActions.waitTillVisible(this.page, this.drpdwnScoreBy);
		await CommonUtils.sleep(2);
	}
	/**
	 * Navigates back from Settings / per-slide config to the slide list.
	 * @returns {Promise<void>}
	 */
	async goBackToSlides() {
		await PwActions.click(this.page, this.btnBackToSlides);
		await PwActions.waitTillVisible(this.page, this.containerSlideItems);
	}
	// ── Global Settings Interactions ─────────────────────────────────
	/**
	 * Selects a Score By value in the Global Settings panel.
	 * @param {string} scoreType - e.g. "Favourability Score" or "Percentage Score"
	 * @returns {Promise<void>}
	 */
	async selectGlobalScoreBy(scoreType) {
		await PwActions.click(this.page, this.drpdwnScoreBy);
		await PwActions.click(this.page, this.getSelectOption(scoreType));
		await CommonUtils.sleep(1);
	}
	/**
	 * Selects a Group By value in the Global Settings panel.
	 * @param {string} groupByOption - e.g. "Department"
	 * @returns {Promise<void>}
	 */
	async selectGlobalGroupBy(groupByOption) {
		await PwActions.click(this.page, this.drpdwnGroupBy);
		await PwActions.click(this.page, this.getSelectOption(groupByOption));
		await CommonUtils.sleep(1);
	}
	/**
	 * Reads the currently selected Score By value from Global Settings.
	 * @returns {Promise<string>}
	 */
	async getGlobalScoreByValue() {
		return await PwActions.getText(
			this.page,
			this.getSelectedDropdownValue("Score By"),
		);
	}
	/**
	 * Reads the currently selected Group By value from Global Settings.
	 * @returns {Promise<string>}
	 */
	async getGlobalGroupByValue() {
		return await PwActions.getText(
			this.page,
			this.getSelectedDropdownValue("Group By"),
		);
	}
	// ── Global Filter Interactions ───────────────────────────────────
	/**
	 * Returns all applied filter chip texts as an array.
	 * Each chip renders two <p> tags: key (e.g. "Department:") and value (e.g. "Engineerin...").
	 * Returns empty array when no filters are applied.
	 * @returns {Promise<string[]>}
	 */
	async getAppliedFilterChipTexts() {
		const elements = await PwActions.getWebElements(
			this.page,
			this.filterChipTexts,
		);
		const texts = [];
		for (const el of elements) {
			const text = await el.innerText();
			texts.push(text.trim());
		}
		return texts;
	}
	/**
	 * Checks whether a Reset button is visible inside the PPT settings filter area.
	 * @returns {Promise<boolean>}
	 */
	async isFilterApplied() {
		return await PwActions.elementIsVisible(this.page, this.btnResetFilter, 2);
	}
	/**
	 * Applies a filter in the PPT global / per-slide settings panel.
	 * Mirrors the cascaded dropdown flow used on the report page.
	 * @param {string} filterKey - Filter dimension name (e.g. "Country")
	 * @param {string[]} filterValues - Values to check (e.g. ["PK"])
	 * @returns {Promise<void>}
	 */
	async applyPPTFilter(filterKey, filterValues) {
		await PwActions.click(this.page, this.btnAddFilter);
		await PwActions.click(this.page, this.getFilterMenuItem(filterKey));
		await PwActions.fill(this.page, this.inputFilterDropdown, filterValues[0]);
		await PwActions.click(this.page, this.filterValueCheckbox(filterValues[0]));
		for (let i = 1; i < filterValues.length; i++) {
			await PwActions.clearAndFill(
				this.page,
				this.inputFilterDropdown,
				filterValues[i],
			);
			await PwActions.click(
				this.page,
				this.filterValueCheckbox(filterValues[i]),
			);
		}
		await PwActions.click(this.page, this.btnApplyFilter);
		await CommonUtils.sleep(1);
	}
	/**
	 * Resets any applied filters in the PPT settings panel.
	 * @returns {Promise<void>}
	 */
	async resetPPTFilter() {
		if (await this.isFilterApplied()) {
			await PwActions.click(this.page, this.btnResetFilter);
			await CommonUtils.sleep(1);
		}
	}
	// ── Per-Slide Config Interactions ────────────────────────────────
	/**
	 * Selects a Score By value in the per-slide configuration panel.
	 * Must be on the per-slide config panel already (call configureSlide first).
	 * @param {string} scoreType
	 * @returns {Promise<void>}
	 */
	async selectSlideScoreBy(scoreType) {
		await PwActions.click(this.page, this.drpdwnScoreBy);
		await PwActions.click(this.page, this.getSelectOption(scoreType));
		await CommonUtils.sleep(1);
	}
	/**
	 * Selects a Group By value in the per-slide configuration panel.
	 * @param {string} groupByOption
	 * @returns {Promise<void>}
	 */
	async selectSlideGroupBy(groupByOption) {
		await PwActions.click(this.page, this.drpdwnGroupBy);
		await PwActions.click(this.page, this.getSelectOption(groupByOption));
		await CommonUtils.sleep(1);
	}
	/**
	 * Reads the currently selected Score By value from per-slide config.
	 * @returns {Promise<string>}
	 */
	async getSlideScoreByValue() {
		return await PwActions.getText(
			this.page,
			this.getSelectedDropdownValue("Score By"),
		);
	}
	/**
	 * Reads the currently selected Group By value from per-slide config.
	 * @returns {Promise<string>}
	 */
	async getSlideGroupByValue() {
		await PwActions.waitTillVisible(
			this.page,
			this.getSelectedDropdownValue("Group By"),
		);
		return await PwActions.getText(
			this.page,
			this.getSelectedDropdownValue("Group By"),
		);
	}
	/**
	 * Reads the current slide title from the per-slide config panel.
	 * @returns {Promise<string>}
	 */
	async getSlideTitle() {
		return await PwActions.getAttributeValue(
			this.page,
			this.txtBoxSlideTitle,
			"value",
		);
	}
	// ── Preview ──────────────────────────────────────────────────────
	/**
	 * @returns {Promise<boolean>} true if the preview panel is visible
	 */
	async isPreviewVisible() {
		await this.waitTillPptLoaderDisappear();
		return await PwActions.elementIsVisible(this.page, this.containerPreview);
	}
	/**
	 * Checks if a slide heading is visible in the preview panel.
	 * @param {string} slideName
	 * @returns {Promise<boolean>}
	 */
	async isSlideInPreview(slideName) {
		await this.waitTillPptLoaderDisappear();
		return await PwActions.elementIsVisible(
			this.page,
			this.getPreviewSlideHeading(slideName),
		);
	}
	/**
	 * Returns the full text content of the preview panel.
	 * @returns {Promise<string>}
	 */
	async getPreviewText() {
		await this.waitTillPptLoaderDisappear();
		await CommonUtils.sleep(3);
		return await PwActions.getText(this.page, this.containerPreview);
	}
	/**
	 * Scrolls to and returns the text of a specific slide section in the preview.
	 * Clicks the slide in the left panel first to scroll the preview.
	 * @param {string} slideName
	 * @returns {Promise<string>}
	 */
	async getSlidePreviewText(slideName) {
		const slideSelector = this.getSlideByName(slideName);
		await PwActions.click(this.page, slideSelector);
		await CommonUtils.sleep(1);
		const slideContentLocator = `${this.containerPreview}//div[.//h1[normalize-space()='${slideName}']]`;
		return await PwActions.getText(this.page, slideContentLocator);
	}
	/**
	 * Zooms in on the preview.
	 * @returns {Promise<void>}
	 */
	async zoomIn() {
		await PwActions.click(this.page, this.btnZoomIn);
	}
	/**
	 * Zooms out on the preview.
	 * @returns {Promise<void>}
	 */
	async zoomOut() {
		await PwActions.click(this.page, this.btnZoomOut);
	}
	// ── Save / Download ──────────────────────────────────────────────
	/**
	 * Clicks the Save button in the modal header.
	 * @returns {Promise<void>}
	 */
	async clickSave() {
		await PwActions.click(this.page, this.btnSave);
	}
	/**
	 * Clicks the Download button in the modal header.
	 * @returns {Promise<void>}
	 */
	async clickDownload() {
		await PwActions.click(this.page, this.btnDownload);
	}
	/**
	 * Downloads the PPT file by clicking Download and capturing the browser download event.
	 * @param {Object} page - Playwright page object (needed for waitForEvent)
	 * @param {number} timeout - Max wait time in ms for download to start
	 * @returns {Promise<{filePath: string, extension: string}>}
	 */
	async downloadPPTFile(page, timeout = 60000) {
		const [download] = await Promise.all([
			page.waitForEvent("download", { timeout }),
			PwActions.click(page, this.btnDownload),
		]);
		const downloadsDir = path.join(process.cwd(), "downloads");
		if (!fs.existsSync(downloadsDir)) {
			fs.mkdirSync(downloadsDir, { recursive: true });
		}
		const suggestedFilename = download.suggestedFilename();
		const extension = suggestedFilename.split(".").pop().toLowerCase();
		const filePath = path.join(downloadsDir, suggestedFilename);
		await download.saveAs(filePath);
		expect(
			fs.existsSync(filePath),
			"PPT download failed: file not saved",
		).toBeTruthy();
		return { filePath, extension };
	}

	async waitTillPptLoaderDisappear() {
		await PwActions.waitTillElementDisappear(
			this.page,
			this.txtPptLoader,
			10000,
		);
	}
}
export { EngagePPTExportPage };

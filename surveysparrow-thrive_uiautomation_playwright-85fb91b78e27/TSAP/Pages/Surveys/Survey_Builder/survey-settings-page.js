import PwActions from "playwright-framework/Core/pw-actions.js";
import { POManager } from "../../POManager";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

class SurveySettingsPage {
	constructor(page) {
		this.page = page;
		this.commonutils = new CommonUtils();
		this.chkboxIncludeZero = `//button[@id="include-zero"]`;
		this.chkboxIncludeNA = `//button[@id="include-na"]`;
		this.btnEditRatingScale = `//button[@data-testid="survey-defaults_icon-button_edit-scale"]`;
		this.btnUpdateRatingScale = `//button[@data-testid="edit-scale-modal_button_save-update"]`;
		this.inputLabelForScaleValue = (scaleValue) =>
			`//p[text()="${scaleValue}"]/parent::div/following-sibling::input`;
		this.btnOverrideChanges = `//button[@data-testid="comman-confirmation-modal_button_confirm"]`;
	}
	/**
	 * This function is used to add or remove zero and NA to/from the survey settings
	 * @param {boolean} includeZero - if true, zero will be included; if false, excluded
	 * @param {boolean} includeNA - if true, NA will be included; if false, remove
	 * @param {boolean} isAdd - if true, add (check); if false, remove (uncheck)
	 */
	async addOrRemoveZeroAndNA(includeZero, includeNA, isAdd) {
		await PwActions.click(this.page, this.btnEditRatingScale);
		const options = [
			{ value: includeZero, selector: this.chkboxIncludeZero },
			{ value: includeNA, selector: this.chkboxIncludeNA },
		];

		for (const { value, selector } of options) {
			const isChecked = await PwActions.isElementChecked(this.page, selector);
			if (isAdd) {
				if (value && !isChecked) {
					await PwActions.click(this.page, selector);
				}
			} else {
				if (!value && isChecked) {
					await PwActions.click(this.page, selector);
				}
			}
		}
		if (includeZero) {
			await PwActions.fill(this.page, this.inputLabelForScaleValue(0), "0");
		}
		await PwActions.click(this.page, this.btnUpdateRatingScale);
		await PwActions.waitForElement(this.page, this.btnOverrideChanges);
		if (await PwActions.elementIsVisible(this.page, this.btnOverrideChanges)) {
			await PwActions.click(this.page, this.btnOverrideChanges);
		}
	}
}

export default SurveySettingsPage;

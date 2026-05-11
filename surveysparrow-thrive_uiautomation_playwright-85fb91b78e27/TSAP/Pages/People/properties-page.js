import { expect, test } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { CommonPageFunctions } from "../../Shared_Functions/common-functions.js";

class PropertiesPage {
	constructor(page) {
		this.page = page;
		this.commonfunction = new CommonPageFunctions(this.page);
		this.btnNewProperty = "//span[text()='New Property']";
		this.txtDisplayLabel =
			"//label[text()='Display Label']/ancestor::div[3]/following-sibling::input";
		this.txtHintText =
			"//label[text()='Hint Text (optional)']/ancestor::div[3]/following-sibling::input";
		this.btnSaveProperty = "//span[text()='Save Property']";
		this.btnEditProperty = "//button[@aria-label='Edit property']";
	}

	// Function to add new property in the property list
	async addNewProperty(propertValue, displayLabel, hintText) {
		this.btnPropertyValue = `//p[text()='${propertValue}']`;
		this.lblAddedPropertyDisplayLabel = `//p[text()='${displayLabel}']`;
		this.lblAddedPropertyInternalName = `//p[text()='${displayLabel}']/ancestor::tr//div[@data-testid='chip']`;

		await PwActions.click(this.page, this.btnNewProperty);
		await PwActions.click(this.page, this.btnPropertyValue);
		await PwActions.fill(this.page, this.txtDisplayLabel, displayLabel);
		await PwActions.fill(this.page, this.txtHintText, hintText);
		await PwActions.click(this.page, this.btnSaveProperty);
	}

	/**
	 * Gets the display label of a property from the properties list.
	 * This function locates the property row by its display label and returns the text content.
	 * @param {string} displayLabel - The display label of the property to retrieve.
	 * @returns {Promise<string>} The display label text of the property.
	 * @example
	 *   const label = await propertiesPage.getPropertyDisplayLabel("Gender");
	 *   // returns: "Gender"
	 */
	async searchProperty(propertyLabel) {
		await this.commonfunction.search(propertyLabel);
	}

	// Function to edit the existing property
	async editProperty(
		currentDisplayLabel,
		newdisplayLabel,
		hintText = undefined,
	) {
		this.blblPropertyValue = `//p[text()='${currentDisplayLabel}']`;

		await PwActions.hover(this.page, this.blblPropertyValue);
		await PwActions.click(this.page, this.btnEditProperty);
		await PwActions.clearAndFill(
			this.page,
			this.txtDisplayLabel,
			newdisplayLabel,
		);
		if (hintText !== undefined) {
			await PwActions.clearAndFill(this.page, this.txtHintText, hintText);
		}
		await PwActions.click(this.page, this.btnSaveProperty);
	}

	// Function to enable or disable actions toggle based on the state provided as parameter
	async enableOrDisableActions(propertyName, state) {
		this.toggleActions = `//p[text()='${propertyName}']/ancestor::tr//button[@role='switch']`;
		if (state === "Enable") {
			if (
				(await PwActions.getAttributeVale(
					this.page,
					this.toggleActions,
					"data-state",
				)) === "unchecked"
			) {
				await PwActions.click(this.page, this.toggleActions);
			}
		} else if (state === "Disable") {
			if (
				(await PwActions.getAttributeVale(
					this.page,
					this.toggleActions,
					"data-state",
				)) === "checked"
			) {
				await PwActions.click(this.page, this.toggleActions);
			}
		}
	}
}

export { PropertiesPage };

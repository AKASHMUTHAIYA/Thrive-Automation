import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
class PortalBrandingPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils();
		this.btnUploadCompanyLogo = (brandingType) =>
			`//p[normalize-space()="${brandingType}"]/parent::div/following-sibling::div//input`;
		this.btnsave = `//span[text()="Save"]/parent::button`;
		this.imgCompanyUploadedLogo = `//nav[@data-testid="grid"]//img[contains(@src,"COMPANY_BRANDING")]`;
		this.imgCompanyUploadedFaviconInHead = `//head//link[@rel="shortcut icon" and contains(@href,"COMPANY_BRANDING")]`;
		this.imgCompanyDefaultFaviconInHead = `//head//link[@rel="shortcut icon" and contains(@href,"favicon.ico")]`;
		this.btnremovelogo = (brandingType) =>
			`//p[text()="${brandingType}"]/parent::div/following-sibling::div//input/following-sibling::button`;
		this.uploadedImage = (brandingType) =>
			`//p[text()="${brandingType}"]/parent::div/following-sibling::div//input[@data-testid="file-upload_input_plain"]`;
		this.btnTooltip = (brandingType) =>
			`//p[text()="${brandingType}"]/following-sibling::span`;
		this.txttooltip = `//span[@role="tooltip"]`;
	}

	/**
	 * Uploads a company logo or favicon to the portal branding.
	 * @param {string} brandingType - The type of branding to upload (Logo or Favicon).
	 * @param {string} filePath - The path to the file to upload.
	 * @returns {Promise<void>} No return value.
	 * @example
	 * // Upload a company logo
	 * await portalBrandingPage.uploadCompanyLogo("Logo", "TSAP/Data/Resources/custom-branding-logo.png");
	 * // Upload a favicon
	 * await portalBrandingPage.uploadCompanyLogo("Favicon", "TSAP/Data/Resources/custom-branding-favicon.png");
	 */
	async uploadCompanyLogo(brandingType, filePath) {
		let link;
		let imagepath;
		await PwActions.uploadFile(
			this.page,
			this.btnUploadCompanyLogo(brandingType),
			filePath,
		);
		await PwActions.click(this.page, this.btnsave);
		if (brandingType === "Logo") {
			await CommonUtils.sleep(2);
			link = await PwActions.getAttributeValue(
				this.page,
				this.imgCompanyUploadedLogo,
				"src",
			);
		} else if (brandingType === "Favicon") {
			await CommonUtils.sleep(3);
			await PwActions.pageRefresh(this.page);
			await CommonUtils.sleep(2);
			link = await PwActions.getAttributeValue(
				this.page,
				this.imgCompanyUploadedFaviconInHead,
				"href",
			);
		}
		imagepath = await PwActions.downloadFileFromUrl(this.page, link);
		await CommonUtils.compareImages(filePath, imagepath, 60);
		await this.commonUtils.deleteFile(imagepath);
	}
	/**
	 * Removes a company logo or favicon from the portal branding.
	 * @param {string} brandingType - The type of branding to remove (Logo or Favicon).
	 * @returns {Promise<void>} No return value.
	 * @example
	 * // Remove a company logo
	 * await portalBrandingPage.removeCompanyLogo("Logo");
	 * // Remove a favicon
	 * await portalBrandingPage.removeCompanyLogo("Favicon");
	 */
	async removeCompanyLogo(brandingType) {
		await PwActions.click(this.page, this.btnremovelogo(brandingType));
		await CommonUtils.sleep(3);
		await PwActions.pageRefresh(this.page);
		await CommonUtils.sleep(2);
		await PwActions.waitForNetworkIdle(this.page, 10000);
		if (brandingType === "Favicon") {
			await PwActions.verifyElementExistsInDom(
				this.page,
				this.imgCompanyDefaultFaviconInHead,
				10000,
			);
		} else {
			await PwActions.verifyElementIsNotPresent(
				this.page,
				this.imgCompanyUploadedLogo,
			);
		}
	}
}

export default PortalBrandingPage;

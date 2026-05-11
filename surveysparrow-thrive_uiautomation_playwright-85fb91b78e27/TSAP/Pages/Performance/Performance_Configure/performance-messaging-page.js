import fs from "fs";
import { expect } from "playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants";
import { envDetails } from "../../../Data/test-data";
import { SurveyPage } from "../../Surveys/Survey_Listing_Page/survey-page.js";

class SurveyMessagingPage {
	constructor(page) {
		this.page = page;
		this.btnEditTemplate =
			"//*[name()='svg']/*[local-name()='path' and @d='M23.3867 13.4933L18.5067 8.61333']/ancestor::button";
		this.toggleAddReportToPDF =
			"//p[text()='Attach Report PDF in email']/following-sibling::button";
		this.btnApplyChanges = "//button//span[text()='Apply Changes']";
		this.inputHeaderImage = "(//input[@name='file'])[1]";
		this.btnEmailTemplatesList = (templateName) =>
			`(//p[text()='${templateName}'])[1]`;
		this.toastSuccess = "//div[text()='Email Template updated successfully']";
		this.readEmail = new ReadEmail();
		this.commonUtils = new CommonUtils();
		this.surveyPage = new SurveyPage(page);
		this.inputEmailSubject =
			"//label[text()='Email Subject']/ancestor::div[3]/following-sibling::input";
		this.inputEmailTitle =
			"//label[text()='Title']/ancestor::div[3]/following-sibling::input";
		this.inputEmailContent =
			"//div[@class='template-text' and @contenteditable='true']";
		this.btnAddVariable =
			"//label[text()='Body']//ancestor::div[2]/following-sibling::div/div/button[6]";
		this.btnRemoveHeaderImage =
			"//label[text()='Header image']/ancestor::div[2]/following-sibling::div/div[2]/button";
		this.btnRemoveBrandingImage =
			"//p[text()='Logo']//ancestor::div[1]/following-sibling::button";
		this.radioBtnDefault = "//button[@value='default']";
		this.dropdownVariable = (variableName) =>
			`//div[contains(@id,'typeahead-item-')]//p[@data-testid='text' and text()='${variableName}']`;
	}

	async addReportPDFToReportReadyEmailTemplate() {
		await PwActions.click(
			this.page,
			this.btnEmailTemplatesList("Report Ready Email"),
		);
		await PwActions.click(this.page, this.btnEditTemplate);
		await PwActions.waitTillVisible(this.page, this.toggleAddReportToPDF);
		await PwActions.click(this.page, this.toggleAddReportToPDF);
		await PwActions.waitAndClick(this.page, this.btnApplyChanges);
		await PwActions.waitTillVisible(this.page, this.toastSuccess);
	}

	/**
	 * This function is to verify the Report Ready Email with PDF attachment
	 * @param {string} senderEmail - Sender Email
	 * @param {string} receiverEmail - Receiver Email
	 * @param {string} subjectName - Subject Name
	 */
	async verifyReportReadyEmailWithPDF(senderEmail, receiverEmail, subjectName) {
		const expectedBodyContent = constants.getReportReadyEmailBody(subjectName);
		try {
			const emailBody = await this.readEmail.fetch_mail_content_from_gmail({
				from: senderEmail,
				to: receiverEmail,
				subject: constants.report_ready_email_subject,
				body: expectedBodyContent,
			});
			await PwActions.verifyTextExpected(
				emailBody.replaceAll(" ", ""),
				expectedBodyContent.replaceAll(" ", ""),
			);

			const pdfPath = await this.readEmail.fetchPdfAttachment(
				senderEmail,
				receiverEmail,
				constants.report_ready_email_subject,
				expectedBodyContent,
			);

			expect(pdfPath).not.toBeNull();
			const fileExists = await this.commonUtils.verifyFileExists(pdfPath);
			expect(fileExists).toBe(true);
			fs.unlinkSync(pdfPath);
		} catch (error) {
			console.error(
				`Error while verifying Report Ready Email: ${error.message}`,
			);
			throw error;
		}
	}
	/**
	 * Function to verify that applying changes to all templates in the Messaging page correctly updates the branding image across all performance survey templates.
	 *
	 * This function performs the following steps:
	 * 1. Defines the sample image file path for testing (departcoverimg.jpeg)
	 * 2. Clicks the edit template button to open the template editor
	 * 3. Uploads the custom branding image using the survey page utility
	 * 4. Applies the changes to all templates
	 * 5. Waits for and verifies the success toast message appears and disappears
	 * 6. Retrieves the image source URL from the "Choose Evaluators" template
	 * 7. Downloads the base64 image to a temporary file for comparison
	 * 8. Compares the uploaded image with the downloaded image to ensure they match
	 * 9. Deletes the temporary downloaded file to clean up
	 * 10. Iterates through all performance survey templates to verify they have the same image URL
	 * 11. Asserts that each template's image URL matches the uploaded image URL
	 *
	 * @example
	 * // Verify branding image is applied to all templates
	 * await surveyMessagingPage.verifyApplyingChangesToAllInTheMessagingPage();
	 *
	 * @returns {Promise<void>} No return value
	 */

	async verifyApplyingChangesToAllInTheMessagingPage() {
		const sampleImageFilePath = constants.Custom_Branding_Logo;
		const croppedImageFilePath = constants.Department_cropped_Img;
		await PwActions.click(this.page, this.btnEditTemplate);

		await this.surveyPage.uploadCustomBrandingImage(sampleImageFilePath, true);

		await PwActions.click(this.page, this.btnApplyChanges);
		await PwActions.waitTillVisible(this.page, this.toastSuccess);
		await PwActions.waitTillElementDisappear(this.page, this.toastSuccess);

		const url = await PwActions.getImageSrcByAlt(
			this.page,
			"Choose Evaluators",
			2,
		);
		const downloadPath = await PwActions.downloadBase64ImageToPath(
			this.page,
			url,
			"downloaded_branding_image.jpg",
			"TSAP/Data/Resources/",
		);
		await CommonUtils.compareImages(croppedImageFilePath, downloadPath, 0);
		await this.commonUtils.deleteFile(downloadPath);

		for (const template of constants.performanceSurveyTemplates) {
			await PwActions.waitAndClick(
				this.page,
				this.btnEmailTemplatesList(template),
			);
			const fetchedUrl = await PwActions.getImageSrcByAlt(
				this.page,
				template,
				2,
			);
			expect(fetchedUrl).toEqual(url);
		}
	}

	/**
	 * Function to add a variable to the email body content using the variable dropdown.
	 * @param {string} variableName - The name of the variable to add to the email body
	 *
	 * This function performs the following steps:
	 * 1. Clicks the "Add Variable" button to open the variable selection dropdown
	 * 2. Waits for the dropdown to be visible and clickable
	 * 3. Clicks on the specific variable from the dropdown menu based on the provided variable name
	 * 4. The variable is then inserted into the email body content at the current cursor position
	 *
	 * @example
	 * // Add Employee Full Name variable to email body
	 * await surveyMessagingPage.addVariableToMailBody("Employee Full Name");
	 *
	 * // Add Manager Name variable to email body
	 * await surveyMessagingPage.addVariableToMailBody("Manager Name");
	 *
	 * // Add Department variable to email body
	 * await surveyMessagingPage.addVariableToMailBody("Department");
	 *
	 * @returns {Promise<void>} No return value
	 */
	async addVariableToMailBody(variableName) {
		await PwActions.waitAndClick(this.page, this.btnAddVariable);
		await PwActions.waitAndClick(
			this.page,
			this.dropdownVariable(variableName),
		);
	}

	/**
	 * Function to edit email template content by adding a variable and header image.
	 * @param {string} template - The name of the email template to edit
	 * @param {string} surveyName - The name of the survey for which the template is being customized
	 *
	 * This function performs the following steps:
	 * 1. Clicks on the specified email template from the templates list
	 * 2. Opens the template editor by clicking the edit button
	 * 3. Modifies the email subject by appending "{employee.fullName}" variable
	 * 4. Modifies the email title by appending "{employee.fullName}" variable
	 * 5. Updates the email body content with the survey-specific content
	 * 6. Adds the "Employee Full Name" variable to the email body using the variable dropdown
	 * 7. Uploads a header image file (departcoverimg.jpeg) to the template
	 * 8. Uploads a custom branding image file (custom-branding-logo.png) to the template
	 * 9. Waits for the file upload to complete (5 seconds)
	 * 9. Applies all changes to the template
	 * 10. Verifies the success toast message appears and disappears
	 *
	 * @example
	 * // Add variable and header image to a self-assessment template
	 * await surveyMessagingPage.addVariableToMailContent(
	 *   "Self Assessment Email",
	 *   "Performance Review 2024"
	 * );
	 *
	 * // Add variable and header image to a 360 feedback template
	 * await surveyMessagingPage.addVariableToMailContent(
	 *   "360 Feedback Email",
	 *   "Leadership Assessment"
	 * );
	 *
	 * @returns {Promise<void>} No return value
	 */
	async addVariableToMailContent(template, surveyName) {
		await PwActions.click(this.page, this.btnEmailTemplatesList(template));
		await PwActions.click(this.page, this.btnEditTemplate);

		const subjectEdited =
			constants.getSelfEmailSubjectEdited() + " {employee.fullName}";
		const titleEdited = constants.getSelfTitleEdited() + " {employee.fullName}";
		const bodyEdited = constants.getSelfBodyWithoutTitleEdited(surveyName);
		await PwActions.clearAndFill(
			this.page,
			this.inputEmailSubject,
			subjectEdited,
		);
		await PwActions.clearAndFill(this.page, this.inputEmailTitle, titleEdited);
		await PwActions.clearAndFill(this.page, this.inputEmailContent, bodyEdited);
		await this.addVariableToMailBody("Employee Full Name");

		//adding header image
		await PwActions.uploadFile(
			this.page,
			this.inputHeaderImage,
			constants.Custom_Header_Img,
		);
		await CommonUtils.sleep(5); // added sleep to wait for the file to be uploaded

		//uploading custom branding image
		await this.surveyPage.uploadCustomBrandingImage(
			constants.Custom_Branding_Logo,
			false,
		);
		await CommonUtils.sleep(2); // added sleep to wait for the file to be uploaded

		await PwActions.waitTillVisible(this.page, this.btnApplyChanges);
		await PwActions.waitAndClick(this.page, this.btnApplyChanges);
		await PwActions.waitTillVisible(this.page, this.toastSuccess);
		await PwActions.waitTillElementDisappear(this.page, this.toastSuccess);
	}

	/**
	 * Function to edit email template content by removing variables and header image.
	 * @param {string} template - The name of the email template to edit
	 * @param {string} surveyName - The name of the survey for which the template is being customized
	 *
	 * This function performs the following steps:
	 * 1. Clicks on the specified email template from the templates list
	 * 2. Opens the template editor by clicking the edit button
	 * 3. Resets the email subject to the original edited version (without variables)
	 * 4. Resets the email title to the original edited version (without variables)
	 * 5. Resets the email body content to the original survey-specific content (without variables)
	 * 6. Removes the header image if it is present by clicking the remove button
	 * 7. Removes the custom branding image if it is present by clicking the remove button
	 * 8. Waits for the image removal to complete (2 seconds)
	 * 9. Applies all changes to the template
	 * 10. Verifies the success toast message appears and disappears
	 *
	 * @example
	 * // Remove variable and header image from a self-assessment template
	 * await surveyMessagingPage.removeVariableFromMailContent(
	 *   "Self Assessment Email",
	 *   "Performance Review 2024"
	 * );
	 *
	 * // Remove variable and header image from a 360 feedback template
	 * await surveyMessagingPage.removeVariableFromMailContent(
	 *   "360 Feedback Email",
	 *   "Leadership Assessment"
	 * );
	 *
	 * @returns {Promise<void>} No return value
	 */
	async removeVariableFromMailContent(template, surveyName) {
		await PwActions.click(this.page, this.btnEmailTemplatesList(template));
		await PwActions.click(this.page, this.btnEditTemplate);
		await PwActions.clearAndFill(
			this.page,
			this.inputEmailSubject,
			constants.getSelfEmailSubjectEdited(),
		);
		await PwActions.clearAndFill(
			this.page,
			this.inputEmailTitle,
			constants.getSelfTitleEdited(),
		);
		await PwActions.clearAndFill(
			this.page,
			this.inputEmailContent,
			constants.getSelfBodyWithoutTitleEdited(surveyName),
		);

		//removing header image if it is present
		await PwActions.waitAndClick(this.page, this.btnRemoveHeaderImage);
		await CommonUtils.sleep(2); // added sleep to wait for the file to be removed

		//removing custom branding image and setting default branding
		await PwActions.waitAndClick(this.page, this.radioBtnDefault);
		await CommonUtils.sleep(2); // added sleep to wait for the file to be removed

		await PwActions.waitAndClick(this.page, this.btnApplyChanges);
		await PwActions.waitTillVisible(this.page, this.toastSuccess);
		await PwActions.waitTillElementDisappear(this.page, this.toastSuccess);
	}
}

export { SurveyMessagingPage };

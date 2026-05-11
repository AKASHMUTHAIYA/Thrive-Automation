import { expect } from "@playwright/test";
import PwActions from "playwright-framework/Core/pw-actions.js";

class ActionablesPage {
    constructor(page) {
        this.page = page;
        this.btnActionables = "//div[contains(text(), 'Actionables')]";
        this.getTakeSurveyButton = (surveyName) => `//b[text()='${surveyName}']/parent::p/parent::div/parent::div/parent::div//a`;
        this.headerActionables = "//h1[text()='Actionables']";
    }

    /**
     * Navigate to the Actionables section in the application.
     * Clicks on the Actionables button and waits for the header to be visible
     * to confirm successful navigation to the Actionables page.
     * 
     * @example
     * // Navigate to the Actionables section
     * await actionablesPage.navigateToActionables();
     */
    async navigateToActionables() {
        await PwActions.waitAndClick(this.page, this.btnActionables);
        // Wait for the Actionables header to be visible to confirm navigation
        await PwActions.waitForElement(this.page, this.headerActionables);
    }

    /**
     * Clicks the Take Survey button for a specific survey and returns the survey URL.
     * This function handles the complete workflow of opening a survey in a new tab
     * and retrieving its URL for further processing or verification.
     * 
     * @param {string} surveyName - The name of the survey to take (e.g., "Employee Satisfaction Survey", "Quarterly Feedback")
     * @returns {Promise<string>} The URL of the survey page that opens in a new tab
     * 
     * @example
     * // Take a customer satisfaction survey and get its URL
     * const surveyUrl = await actionablesPage.clickTakeSurveyAndReturnSurveyUrl("Customer Satisfaction Survey");
     */
    async clickTakeSurveyAndReturnSurveyUrl(surveyName) {
        const pagePromise = this.page.context().waitForEvent('page');
        await PwActions.waitAndClick(this.page, this.getTakeSurveyButton(surveyName));
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        const surveyUrl = newPage.url();
        
        return surveyUrl;
    }

    /**
     * Verifies that the Take Survey button is not present for a specific survey.
     * This function is typically used to confirm that a survey is no longer available
     * for taking, either because it has been completed or is no longer active.
     * 
     * @param {string} surveyName - The name of the survey to check (e.g., "Expired Survey", "Completed Survey")
     * 
     * @example
     * // Verify that a completed survey button is not visible
     * await actionablesPage.verifyTakeSurveyButtonNotPresent("Annual Review Survey");
     * 
     */
    async verifyTakeSurveyButtonNotPresent(surveyName) {
        await this.page.reload();
        await PwActions.waitForDOMContentLoaded(this.page, 15000);
        await PwActions.waitForElement(this.page, this.getTakeSurveyButton(surveyName));
        const isVisible = await PwActions.elementIsVisible(this.page, this.getTakeSurveyButton(surveyName));

        expect(isVisible).toBeFalsy();
    }
}

export { ActionablesPage };

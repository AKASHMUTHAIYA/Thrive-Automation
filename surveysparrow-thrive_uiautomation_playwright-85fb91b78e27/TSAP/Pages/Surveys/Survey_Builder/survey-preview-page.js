import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants";
import { EUI } from "../Attend_Survey/attend-survey-EUI-page";

class SurveyPreviewPage {
	constructor(page) {
		this.page = page;
		this.previewStart = "//button[@data-qa='welcome_cta_button']";
		this.previewFrame = "//iframe[@id='responsive-preview-iframe']";
		this.previewSubmit = "//button[@data-qa='submit_button']";
		this.eui = new EUI(page);
		this.previewQuestionArea =
			"//div[@class='ss_cl_survey_qstn_item active']/div";
		this.previewSectionName =
			"//div[@class='ss-spf-question-container ss-spf-section-container']//h1";
		this.previewSectionDescription =
			"//div[@class='ss-spf-question-container ss-spf-section-container']//h3";
		this.thankyouPage = "//div[@class='ss-completed-thankyou-contents']";
	}
}
export { SurveyPreviewPage };

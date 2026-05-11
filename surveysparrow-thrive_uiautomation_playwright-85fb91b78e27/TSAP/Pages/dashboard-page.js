import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

class DashboardPage {
	constructor(page) {
		this.page = page;
		this.containerWelcomeScreen =
			"//div[@data-testid = 'box' and @class='twigs-c-PJLV twigs-c-jQxwKe']";
		this.lblThriveSparrowTitle =
			"//div[@data-testid='box' and @class='twigs-c-PJLV']//p[text()='ThriveSparrow']";
		this.imgThriveSparrowIcon =
			"//div[@class='twigs-c-PJLV twigs-c-PJLV-ikMjLFm-css']//*[name()='svg'][1]";
	}

	/** Visual Testing **/
	async verifyPageUI() {
		await PwActions.waitTillVisible(this.page, this.imgThriveSparrowIcon);
		await CommonUtils.sleep(1);
		await PwActions.visualTestComparison(this.page, "DashboardPage.png", [
			this.containerWelcomeScreen,
			this.lblThriveSparrowTitle,
		]);
	}
}

export { DashboardPage };

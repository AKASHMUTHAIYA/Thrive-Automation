import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../Data/Resources/constants.js";
import { testdata } from "../Data/login-data.js";
import { envDetails } from "../Data/test-data.js";
import { generateRandomEmployeeNameAndEmail } from "../Data/Resources/constants.js";
import { EntityIds } from "../Shared_Functions/entityId.js";
import { CommonPageFunctions } from "../Shared_Functions/common-functions.js";

class LoginPage {
	constructor(page) {
		this.readEmail = new ReadEmail();
		this.commonFunctions = new CommonPageFunctions(this.page);
		this.page = page;
		this.commonFunctions = new CommonPageFunctions(page);
		this.loginbtn = "//button[normalize-space()='Login']";
		this.emailField = '//input[@type="email"]';
		this.inputPassword = "//input[@name='password']";
		this.logo = "//*[@id='root']/div[3]/nav/div[1]/div/svg";
		this.btnSwitchToEmployee =
			"(//span[contains(text(), 'Switch to Employee')])[1] | //nav//button";
		this.btnSwitchToEmployeeIcon =
			"//button[contains(@class,'twigs-c-gSguNF-bUvFAs-variant-solid twigs-c-gSguNF-lbVYmC-isIcon-true')]";

		this.btnSwitchtoAdmin = "//span[text()='Admin']";
		this.tabLocators = {
			people: "//a[text()='People']",
			engage: "//a[text()='Engage']",
			performance: "//a[text()='Performance']",
			feedback: "//a[text()='Feedback']",
			kudos: "//a[text()='Kudos']",
			integrate: "//a[text()='Integrate']",
			account: "//a[text()='Account']",
			goals: "//a[text()='Goals']",
			"1:1": "//a[text()='1:1']",
		};
		this.btnProfile = "//span[contains(@class, 'lhtpmg-rounded-md ')]";
		this.logoutbtn = '[role="link"][name=" Logout"]';
		this.btnEditProfile = "//div[text()='Edit Profile']";
		this.btnSignOut = "//div[text()='Sign out']";
		this.inputUserName = "//input[@name='username']";
		this.inputCompanyName = "//input[@name='companyName']";
		this.inputDomain = "//input[@placeholder='Your domain' and @value]";
		this.btnSignUp = "//span[text()='Sign Up']";
		this.txtInfoMessage = "//p[text()='User with given email already exists']";
		this.btnContinue = "//span[text()='Continue']";
		this.btnInviteTeamLater = "//p[contains(text(),'invite my team later')]";
		this.inputAdminEmail = "(//input[@placeholder='Enter email'])[1]";
		this.inputEmpEmail1 = "(//input[@placeholder='Enter email'])[2]";
		this.inputEmpEmail2 = "(//input[@placeholder='Enter email'])[3]";
		this.btnModuleName = (moduleName) => `//span[text()='${moduleName}']`;
		this.checkboxModuleName = (moduleName) =>
			`//span[text()='${moduleName}']/ancestor::div/button[@role='checkbox']`;
		this.btnSetupGoals = "//span[text()='Setup Goals']";
		this.txtWelcomeModal = (empName) =>
			`//h1[text()='Welcome aboard, ${empName}!']`;
		this.btnForgotPassword = '//span[text()="Forgot Password?"]';
		this.btnRecover = '//span[text()="Recover"]';
		this.inputForgotPasswordMail = '//input[@placeholder="Registered email"]';
		this.toasterRecoverSuccess =
			'//div[text()="Password reset link sent to your email"]';
		this.toasterRecoverFailed = '//div[text()="Reset password limit exceeded"]';
		this.inputConfirmPassword = '//input[@name="confirmPassword"]';
		this.btnSetPassword = '//span[text()="Set Password"]';
		this.btnResetPassword = '//span[text()="Reset"]';
		this.lblEmployeeName = (employeeName) => `//h1[text()='${employeeName}']`;
		this.iWillDoItLater = "//span[contains(text(),'do it later')]";
		this.btnScheduleYourFirstOneOnOne =
			"//span[text()='Schedule your first 1:1 now']";
		this.btnCloseScheduleYourFirstOneOnOne = "//button[@aria-label='Close']";
		this.btnCloseSetupGoals =
			"//span[text()='Setup Goals']/ancestor::p/following-sibling::div/button";
	}

	async navigateToUrl(url, page = this.page) {
		await PwActions.waitForNetworkIdle(page, 15000);
		await PwActions.goTo(page, url);
	}

	async login(page, username, password) {
		await PwActions.waitTillVisible(page, this.emailField);
		await PwActions.fill(page, this.emailField, username);
		await PwActions.fill(page, this.inputPassword, password);
		await PwActions.click(page, this.loginbtn);
		await PwActions.waitForDOMContentLoaded(page, 15000);
		await PwActions.waitForNetworkIdle(page, 15000);
		await CommonUtils.sleep(2);
		const isbtnScheduleYourFirstOneOnOneVisible =
			await PwActions.elementIsVisible(page, this.btnScheduleYourFirstOneOnOne);
		if (isbtnScheduleYourFirstOneOnOneVisible) {
			await CommonUtils.sleep(3);
			await PwActions.click(page, this.btnScheduleYourFirstOneOnOne);
			await CommonUtils.sleep(1.5);
			await PwActions.click(page, this.btnCloseScheduleYourFirstOneOnOne);
		}
		await this.commonFunctions.closeSparrowDeskPopup(page);
		await this.commonFunctions.closeFeaturePopupIfPresent(page);
		await this.commonFunctions.closeFeaturePopupIfPresent(page);
		if (username === envDetails.adminEmail) {
			EntityIds.setCookie(await page.context().cookies());
		}
	}

	/**
	 * Switches the current view from admin/manager to employee perspective
	 * @param {Object} [page] - Optional page object. If not provided, uses this.page
	 * @returns {Promise<void>} Returns a promise that resolves when the view switch is complete
	 */
	async switchToEmployee(page = this.page) {
		await PwActions.click(page, this.btnSwitchToEmployee);
		await CommonUtils.sleep(2);
		const isbtnScheduleYourFirstOneOnOneVisible =
			await PwActions.elementIsVisible(page, this.btnScheduleYourFirstOneOnOne);
		if (isbtnScheduleYourFirstOneOnOneVisible) {
			await CommonUtils.sleep(3);
			await PwActions.click(page, this.btnScheduleYourFirstOneOnOne);
			await CommonUtils.sleep(1.5);
			await PwActions.click(page, this.btnCloseScheduleYourFirstOneOnOne);
		}
	}

	/**
	 * Switches the current view from admin/manager to employee perspective
	 * @param {Object} [page] - Optional page object. If not provided, uses this.page
	 * @returns {Promise<void>} Returns a promise that resolves when the view switch is complete
	 */
	async switchToEmployeeViewByClickingIcon(page = this.page) {
		await PwActions.click(page, this.btnSwitchToEmployeeIcon);
		await CommonUtils.sleep(2);
		const isbtnScheduleYourFirstOneOnOneVisible =
			await PwActions.elementIsVisible(page, this.btnScheduleYourFirstOneOnOne);
		if (isbtnScheduleYourFirstOneOnOneVisible) {
			await CommonUtils.sleep(3);
			await PwActions.click(page, this.btnScheduleYourFirstOneOnOne);
			await CommonUtils.sleep(1.5);
			await PwActions.click(page, this.btnCloseScheduleYourFirstOneOnOne);
		}
	}

	/**
	 * Switches the current view to admin perspective
	 * @returns {Promise<void>} Returns a promise that resolves when the view switch is complete
	 */
	async switchToAdmin(page = this.page) {
		await PwActions.waitAndClick(page, this.btnSwitchtoAdmin);
	}

	async navigateToAdminTabs(tab) {
		const tabLocator = this.tabLocators[tab.toLowerCase()];
		if (!tabLocator) {
			throw new Error(`Invalid tab: ${tab}`);
		}

		await PwActions.click(this.page, tabLocator);
	}

	async launchAndLoginToApplication() {
		await this.navigateToUrl(envDetails.url);
		await this.login(this.page, envDetails.adminEmail, envDetails.password);
	}

	async launchAndLoginToTrialAccount() {
		await this.navigateToUrl(envDetails.uriTrial);
		await this.login(
			this.page,
			envDetails.usernameTrial,
			envDetails.passwordTrial,
		);
	}

	async logOut(page = this.page) {
		await PwActions.click(page, this.logoutbtn);
	}

	async signOut(page = this.page) {
		await PwActions.waitForNetworkIdle(this.page, 10000);
		await PwActions.waitAndClick(page, this.btnProfile);
		await PwActions.waitAndClick(page, this.btnSignOut);
	}

	async navigateToHomepageAndSignout(page = this.page) {
		const urlDomain = await CommonUtils.getCurrentUrlDomain(page);
		const homepageurl = `https://${urlDomain}/login`;
		await this.navigateToUrl(homepageurl, page);
		await this.signOut(page);
	}

	async waitForSomeTime(timeInSeconds) {
		await new Promise((resolve) => setTimeout(resolve, timeInSeconds * 1000));
	}

	async validateLogo() {
		await PwActions.visualTestComparison(this.page, "LoginPage.png");
	}

	/**
	 * Navigate to the application homepage
	 * Gets the current domain and navigates to the login page of that domain
	 * @returns {Promise<void>} Returns a promise that resolves when navigation is complete
	 */
	async navigateToHomepage() {
		const urlDomain = await CommonUtils.getCurrentUrlDomain(this.page);
		const homepageurl = `https://${urlDomain}/login`;
		await this.navigateToUrl(homepageurl);
	}

	/**
	 * Creates a new account and returns the final email address
	 * @param {string} employeeName - The name of the employee
	 * @param {string} employeeEmail - The email address of the employee
	 * @param {string} password - The password for the employee
	 * @param {string} domainName - Account domain name
	 * @returns {Promise<string>} - Returns the final email address of the created account
	 */
	async createNewAccount(employeeName, employeeEmail, password, domainName) {
		await this.navigateToUrl(envDetails.signupUrl);
		let isUserExists = true;
		let newEmail;
		await PwActions.fill(this.page, this.inputUserName, employeeName);
		await PwActions.fill(this.page, this.emailField, employeeEmail);
		await PwActions.fill(this.page, this.inputPassword, password);
		await PwActions.fill(this.page, this.inputCompanyName, employeeName);
		await PwActions.fill(this.page, this.inputDomain, domainName);
		await PwActions.click(this.page, this.btnSignUp);
		let finalEmail = employeeEmail;
		while (isUserExists) {
			const emailAlreadyExists = await PwActions.elementIsVisible(
				this.page,
				this.txtInfoMessage,
			);
			if (!emailAlreadyExists) {
				isUserExists = false;
			} else {
				({ employeeEmail: newEmail } = generateRandomEmployeeNameAndEmail());
				await PwActions.fill(this.page, this.emailField, newEmail);
				await PwActions.click(this.page, this.btnSignUp);
				finalEmail = newEmail;
			}
		}
		return finalEmail;
	}

	/**
	 * Selects a module from the module list
	 * @param {string} moduleName - The name of the module to select
	 */
	async selectModule(moduleName) {
		if (moduleName) {
			const moduleNameToLower = moduleName.toLowerCase();
			await PwActions.click(this.page, this.btnModuleName(moduleNameToLower));
		}
		await PwActions.click(this.page, this.btnContinue);
	}

	/**
	 * Invites team members by filling in their email addresses
	 * @param {Object} params - The parameters object
	 * @param {string} [params.adminEmail] - Email address for admin
	 * @param {string} [params.empEmail1] - Email address for first employee
	 * @param {string} [params.empEmail2] - Email address for second employee
	 */
	async inviteTeam({ adminEmail, empEmail1, empEmail2 } = {}) {
		const hasAnyEmail = adminEmail || empEmail1 || empEmail2;
		if (adminEmail) {
			await PwActions.fill(this.page, this.inputAdminEmail, adminEmail);
		}
		if (empEmail1) {
			await PwActions.fill(this.page, this.inputEmpEmail1, empEmail1);
		}
		if (empEmail2) {
			await PwActions.fill(this.page, this.inputEmpEmail2, empEmail2);
		}
		if (hasAnyEmail) {
			await PwActions.click(this.page, this.btnContinue);
		} else {
			await PwActions.forceClick(this.page, this.btnInviteTeamLater);
		}
	}

	/**
	 * Verifies the email verification process and logs in to the application
	 * @param {string} empName - The name of the employee
	 * @param {string} employeeEmail - The email address of the employee
	 * @param {string} password - The password for the employee
	 * @param {string} domainName - The domain name for the employee
	 * @param {Object} browser - The browser object
	 * @returns {Promise<string>} - Returns the verification email URL
	 */
	async verifyEmailVerification(
		empName,
		employeeEmail,
		password,
		domainName,
		browser,
	) {
		const getOnboardEmailBody = constants.getOnboardEmailBody(empName);
		const senderEmail = constants.getSenderEmail(domainName);
		const verifyEmailSubject = constants.verifyEmailSubject;
		const btnVerifyEmail = await this.readEmail.fetch_survey_url_from_email({
			from: senderEmail,
			to: constants.subject_email,
			subject: verifyEmailSubject,
			body: getOnboardEmailBody,
		});
		expect(btnVerifyEmail).toBeDefined();
		const verifyPage = await PwActions.openNewTab(browser);
		await PwActions.goTo(verifyPage, btnVerifyEmail);
		await this.login(verifyPage, employeeEmail, password);
		await this.commonFunctions.closeFeaturePopupIfPresent(verifyPage);
		if (await PwActions.elementIsVisible(verifyPage, this.btnSetupGoals))
			await PwActions.waitTillVisible(verifyPage, this.btnSetupGoals);
		await PwActions.click(verifyPage, this.btnCloseSetupGoals);
		await this.switchToEmployeeViewByClickingIcon(verifyPage);
		await PwActions.click(verifyPage, this.tabLocators.performance);
		const tabsToVerify = ["engage", "performance", "feedback", "kudos", "1:1"];
		for (const tabName of tabsToVerify) {
			const locator = this.tabLocators[tabName];
			expect(
				await PwActions.elementIsVisible(verifyPage, locator),
				`${tabName} tab should be visible`,
			).toBe(true);
		}
		await this.switchToAdmin(verifyPage);
		return verifyPage;
	}

	/**
	 * Verifies the welcome email and logs in to the application
	 * @param {string} empName - The name of the employee
	 * @param {string} domainName - The domain name for the employee
	 */
	async verifyWelcomeEmail(empName, domainName) {
		const senderEmail = constants.getSenderEmail(domainName);
		const welcomeEmailSubject = constants.signupWelcomeEmailSubject;
		const getWelcomeEmailBody = constants.getSignupWelcomeEmailBody(empName);
		const welcomeEmail = await this.readEmail.fetch_mail_content_from_gmail({
			body: getWelcomeEmailBody,
		});
		expect(welcomeEmail).toBeDefined();
	}

	/**
	 * Logs in to the approval portal with default credentials.
	 */
	async loginToApprovalPortal() {
		await this.login(
			this.page,
			envDetails.approverEmail,
			envDetails.approverPassword,
		);
	}

	/**
	 * This function verifies the employee login by comparing the employee name in the home page.
	 *
	 * @param {page} page - The page instance.
	 * @param {string} employeeName - The name of the employee.
	 * */

	async validateLoggedInUserAndSignOut(page, employeeName) {
		await PwActions.waitTillVisible(page, this.lblEmployeeName(employeeName));
		await PwActions.verifyElementIsPresent(
			page,
			this.lblEmployeeName(employeeName),
		);
		await PwActions.waitForDOMContentLoaded(page, 15000);
		await CommonUtils.sleep(2);
		const isIWillDoItLaterVisible = await PwActions.elementIsVisible(
			page,
			this.iWillDoItLater,
		);
		if (isIWillDoItLaterVisible) {
			await PwActions.click(page, this.iWillDoItLater);
		}
		const isbtnScheduleYourFirstOneOnOneVisible =
			await PwActions.elementIsVisible(page, this.btnScheduleYourFirstOneOnOne);
		if (isbtnScheduleYourFirstOneOnOneVisible) {
			await CommonUtils.sleep(3);
			await PwActions.click(page, this.btnScheduleYourFirstOneOnOne);
			await CommonUtils.sleep(1.5);
			await PwActions.click(page, this.btnCloseScheduleYourFirstOneOnOne);
		}
		await PwActions.waitAndClick(page, this.btnProfile);
		await PwActions.waitAndClick(page, this.btnSignOut);
	}

	/**
	 * This function sends a res password email and returns the reset password URL.
	 *
	 * @param {string} resetPasswordUserMail - The email address to send the reset password link to.
	 * @returns {Promise<string>} The reset password URL extracted from the email.
	 */
	async sendForgotPasswordMailandReturnTheURL(resetPasswordUserMail) {
		await PwActions.waitAndClick(this.page, this.btnForgotPassword);
		await PwActions.waitAndFill(
			this.page,
			this.inputForgotPasswordMail,
			resetPasswordUserMail,
		);
		await PwActions.click(this.page, this.btnRecover);
		await CommonUtils.sleep(1);
		const isToasterVisible = await PwActions.elementIsVisible(
			this.page,
			this.toasterRecoverFailed,
		);
		if (isToasterVisible) {
			throw new Error("Reset password limit exceeded");
		}
		await PwActions.waitTillVisible(this.page, this.toasterRecoverSuccess);
		const emailBody = constants.getResetPasswordEmailBody(
			constants.resetPasswordUsername,
		);
		const ResetPasswordURL = await this.readEmail.fetch_survey_url_from_email({
			subject: constants.resetPasswordMailSubject,
			body: emailBody,
		});
		return ResetPasswordURL;
	}

	/**
	 * This function verifies the setup password and returns the password if reset password is true
	 * or return the page2 instance and password if setup password is true
	 *
	 * @param {string} signupUrl - The URL of the signup page.
	 * @param {import('playwright').Browser} browser - The browser instance.
	 * @param {Boolean} setupPassword - True if password is to be set, false if password is to be reset.
	 * @param {Boolean} resetPassword - True if password is to be reset, false if password is to be set.
	 * */

	async setOrResetPassword(signupUrl, browser, setOrResetPassword) {
		const passwordType = setOrResetPassword.toLowerCase();
		expect(["set", "reset"]).toContain(passwordType);
		const page2 = await PwActions.openNewTab(browser);
		await PwActions.goTo(page2, signupUrl);
		const password = CommonUtils.generateRandomNumbersWithLength(9);
		await PwActions.fill(page2, this.inputPassword, password);
		await PwActions.fill(page2, this.inputConfirmPassword, password);

		if (passwordType === "set") {
			await PwActions.click(page2, this.btnSetPassword);
		} else if (passwordType === "reset") {
			await PwActions.click(page2, this.btnResetPassword);
			await PwActions.closeTab(page2);
			return password;
		}

		return { page2, password };
	}

	/**
	 * This function clicks on the "I will do it later" button.
	 * @returns {Promise<void>}
	 */

	async clickOnIWillDoItLater() {
		await CommonUtils.sleep(2);
		const isIWillDoItLaterVisible = await PwActions.elementIsVisible(
			this.page,
			this.iWillDoItLater,
		);
		if (isIWillDoItLaterVisible) {
			await PwActions.click(this.page, this.iWillDoItLater);
		}
	}
}

export { LoginPage };

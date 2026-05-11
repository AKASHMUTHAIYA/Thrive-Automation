import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import PwActions from "playwright-framework/Core/pw-actions.js";

class EmployeesProfilePage {
	constructor(page) {
		this.page = page;
		this.inputFullName = "//input[@name='fullName']";
		this.inputScreenName = "//input[@name='nickName']";
		this.inputAboutMe = "//textarea[@name='aboutMe']";
		this.inputJobDescription = "//input[@name='jobDescription']";
		this.inputPersonalWebsite = "//input[@name='personalWebsiteUrl']";
		this.inputLinkedinProfile = "//input[@name='linkedInProfileUrl']";
		this.inputLanguage =
			"//p[text()='Language']/following::input[@id='react-select-2-input'][1]";
		this.inputCountry =
			"//p[text()='Country']/following::input[@id='react-select-3-input'][1]";
		this.btnUpdate = "//span[text()='Update']";
		this.listDropdown = "//div[contains(@class, 'twigs-select__option')]";
		this.toasterUpdateSuccess = "//div[text()='Profile updated successfully']";
		this.lnkYourTeam =
			"//a[@href='/your-team' and normalize-space()='Your Team']";
		this.tabReportees =
			"//button[@role='tab' and normalize-space()='Reportees']";
		this.tabPeers = "//button[@role='tab' and normalize-space()='Peers']";
		this.tabDepartment =
			"//button[@role='tab' and normalize-space()='Department']";
		this.lstReporteesEmployees = "//div[@role='tabpanel'][1]//h1";
		this.lstPeersEmployees = "//div[@role='tabpanel'][2]//h1";
		this.lstDepartmentEmployees = "//div[@role='tabpanel'][3]//h1";
	}

	/**
	 * Updates the employee profile information with provided data and random selections for language and country.
	 *
	 * @param {Object} profileData - Object containing profile information to update
	 * @param {string} [profileData.name] - Employee's full name
	 * @param {string} [profileData.screenName] - Employee's screen name/nickname
	 * @param {string} [profileData.aboutMe] - About me description
	 * @param {string} [profileData.jobDescription] - Job description
	 * @param {string} [profileData.personalWebsite] - Personal website URL
	 * @param {string} [profileData.linkedinProfile] - LinkedIn profile URL
	 */
	async updateProfileInformation({
		name,
		screenName,
		aboutMe,
		jobDescription,
		personalWebsite,
		linkedinProfile,
	}) {
		if (name !== undefined) {
			await PwActions.clearAndFill(this.page, this.inputFullName, name);
		}

		if (screenName !== undefined) {
			await PwActions.clearAndFill(this.page, this.inputScreenName, screenName);
		}

		if (aboutMe !== undefined) {
			await PwActions.clearAndFill(this.page, this.inputAboutMe, aboutMe);
		}

		if (jobDescription !== undefined) {
			await PwActions.clearAndFill(
				this.page,
				this.inputJobDescription,
				jobDescription,
			);
		}

		if (personalWebsite !== undefined) {
			await PwActions.clearAndFill(
				this.page,
				this.inputPersonalWebsite,
				personalWebsite,
			);
		}

		if (linkedinProfile !== undefined) {
			await PwActions.clearAndFill(
				this.page,
				this.inputLinkedinProfile,
				linkedinProfile,
			);
		}

		//Selecting a random language from the dropdown list

		await PwActions.click(this.page, this.inputLanguage);

		const languageListElements = await PwActions.getWebElementsPage(
			this.page,
			this.listDropdown,
		);
		const languageListTexts = await PwActions.getElementsText(
			this.page,
			languageListElements,
		);
		const language = await CommonUtils.getRandomElement(languageListTexts);
		this.receivedOptionLanguage = `//div[text()='${language}']`;

		await PwActions.fill(this.page, this.inputLanguage, language);
		await PwActions.click(this.page, this.receivedOptionLanguage);

		//Selecting a random country from the dropdown list

		await PwActions.click(this.page, this.inputCountry);
		const countryListElements = await PwActions.getWebElementsPage(
			this.page,
			this.listDropdown,
		);
		const countryListTexts = await PwActions.getElementsText(
			this.page,
			countryListElements,
		);
		const country = await CommonUtils.getRandomElement(countryListTexts);
		this.receivedOptionCountry = `//div[text()='${country}']`;

		await PwActions.fill(this.page, this.inputCountry, country);
		await PwActions.click(this.page, this.receivedOptionCountry);

		await PwActions.waitAndClick(this.page, this.btnUpdate);
		await PwActions.waitTillVisible(this.page, this.toasterUpdateSuccess);
	}

	/**
	 * Verifies that the employee profile information matches the expected values.
	 *
	 * @param {Object} expectedProfileData - Object containing expected profile information to verify
	 * @param {string} [expectedProfileData.name] - Expected full name
	 * @param {string} [expectedProfileData.screenName] - Expected screen name
	 * @param {string} [expectedProfileData.aboutMe] - Expected about me text
	 * @param {string} [expectedProfileData.jobDescription] - Expected job description
	 * @param {string} [expectedProfileData.personalWebsite] - Expected personal website URL
	 * @param {string} [expectedProfileData.linkedinProfile] - Expected LinkedIn profile URL
	 * @param {string} [expectedProfileData.language] - Expected selected language
	 * @param {string} [expectedProfileData.country] - Expected selected country
	 */
	async verifyProfileInformation({
		name,
		screenName,
		aboutMe,
		jobDescription,
		personalWebsite,
		linkedinProfile,
		language,
		country,
	}) {
		this.selectedLanguage = `//div[text()='${language}']`;
		this.selectedCountry = `//div[text()='${country}']`;

		if (name !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.inputFullName),
				name,
			);
		}

		if (screenName !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.inputScreenName),
				screenName,
			);
		}

		if (aboutMe !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.inputAboutMe),
				aboutMe,
			);
		}

		if (jobDescription !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.inputJobDescription),
				jobDescription,
			);
		}

		if (personalWebsite !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.inputPersonalWebsite),
				personalWebsite,
			);
		}

		if (linkedinProfile !== undefined) {
			await PwActions.verifyTextExpected(
				await PwActions.getText(this.page, this.inputLinkedinProfile),
				linkedinProfile,
			);
		}

		if (language !== undefined) {
			await PwActions.verifyElementIsPresent(this.page, this.selectedLanguage);
		}

		if (country !== undefined) {
			await PwActions.verifyElementIsPresent(this.page, this.selectedCountry);
		}
	}

	/**
	 * Generates random profile information to update the employee profile information
	 *
	 * @returns {Promise<Object>} An object containing randomly generated profile information with the following properties:
	 * @returns {Promise<string>} .name - Randomly generated full name
	 * @returns {Promise<string>} .screenName - Randomly generated screen name
	 * @returns {Promise<string>} .aboutMe - Randomly generated about me text
	 * @returns {Promise<string>} .jobDescription - Randomly generated job description
	 * @returns {Promise<string>} .personalWebsite - Randomly generated personal website URL
	 * @returns {Promise<string>} .linkedinProfile - Randomly generated LinkedIn profile URL
	 */
	async generateRandomProfileInformation() {
		const name = CommonUtils.generateRandomText(6);
		const screenName = CommonUtils.generateRandomText(6);
		const aboutMe = CommonUtils.generateRandomText(20);
		const jobDescription = CommonUtils.generateRandomText(20);
		const personalWebsite = `https://${CommonUtils.generateRandomText(6)}.com`;
		const linkedinProfile = `https://www.linkedin.com/in/${CommonUtils.generateRandomText(6)}`;

		return {
			name,
			screenName,
			aboutMe,
			jobDescription,
			personalWebsite,
			linkedinProfile,
		};
	}

	/**
	 * Verifies "Your Team" page has Reportees, Peers, and Department tabs
	 * and each tab displays at least one employee entry.
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await employeesProfilePage.verifyYourTeamSubTabsAndEmployeeData();
	 */
	async verifyYourTeamSubTabsAndEmployeeData() {
		await PwActions.waitTillVisible(this.page, this.tabReportees);
		await PwActions.verifyElementIsPresent(this.page, this.tabReportees);
		await PwActions.verifyElementIsPresent(this.page, this.tabPeers);
		await PwActions.verifyElementIsPresent(this.page, this.tabDepartment);

		const reportees = await PwActions.getWebElementsPage(
			this.page,
			this.lstReporteesEmployees,
		);
		if (reportees.length === 0) {
			throw new Error(
				"Reportees tab should show at least one employee in Your Team view",
			);
		}

		await PwActions.waitAndClick(this.page, this.tabPeers);
		await PwActions.waitTillVisible(this.page, this.lstPeersEmployees);
		const peers = await PwActions.getWebElementsPage(
			this.page,
			this.lstPeersEmployees,
		);
		if (peers.length === 0) {
			throw new Error(
				"Peers tab should show at least one employee in Your Team view",
			);
		}

		await PwActions.waitAndClick(this.page, this.tabDepartment);
		await PwActions.waitTillVisible(this.page, this.lstDepartmentEmployees);
		const departmentEmployees = await PwActions.getWebElementsPage(
			this.page,
			this.lstDepartmentEmployees,
		);
		if (departmentEmployees.length === 0) {
			throw new Error(
				"Department tab should show at least one employee in Your Team view",
			);
		}
	}
}

export { EmployeesProfilePage };

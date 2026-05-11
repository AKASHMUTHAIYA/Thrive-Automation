import { allure } from "allure-playwright";
import { expect } from "playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";


test.describe(" Verify the functionality of creating, editing, deleting and bulk deleting job titles manually and adding and removing employee to job title", () => {
	test("TC_01_Creating, Editing, Deleting and Bulk Deleting Job Titles and Adding and Removing Employee to Job Title @Regression @jobtitle", async ({ thrivePage }) => {
		await allure.description("Adding a new job title");
		const poManager = new POManager(thrivePage);
		const communFunction = poManager.getCommonPageFunctions();
		const jobtitlepage = poManager.getJobTitlePage();
		const PeoplePage = poManager.getPeoplePage();
		const empPage = poManager.getEmployeePage();

		await communFunction.navigateTopNavigateSection("People");
		await PeoplePage.navigateToSections("Job Titles");

		const jobTitle = CommonUtils.generateRandomText(7);
		const jobTitle2 = CommonUtils.generateRandomText(7);
		const jobTitle3 = CommonUtils.generateRandomText(7);
		const editJobTitle = CommonUtils.generateRandomText(7);

		await allure.step("Adding a new job title", async () => {
			await jobtitlepage.addJobTitle(jobTitle);
		});

		await allure.step("Verifying the job title is added in the UI", async () => {
			await communFunction.search(jobTitle);
			await jobtitlepage.verifyJobTitleExistence(jobTitle);
		});

		await allure.step("Verifying adding and removing employee to job title", async () => {

			let newEmployeeName = CommonUtils.generateRandomText(5).toLowerCase();
			let newEmployeeEmail = newEmployeeName + "@dummydept.com";

			await allure.step("Creating employee without department & job title", async () => {
                await PeoplePage.navigateToSections("Employees");
			
				await empPage.addEmployeeManually(0, {
				name: newEmployeeName,
				employeeEmail: newEmployeeEmail,
			});
				await empPage.sendInviteAfterImportingSliderOff();
			});

			await allure.step(" Verifying adding employee to job title", async () => {
				await PeoplePage.navigateToSections("Job Titles");
				await jobtitlepage.addMembers(jobTitle, newEmployeeName);
			});

			await allure.step("Verifying employee is added to job title", async () => {
				await jobtitlepage.navigateToSubSection("Invite Not Sent");
				await jobtitlepage.verifyMemberExistence(newEmployeeEmail);
			});

			await allure.step("Verify sending invite from job title section", async () => {
				await jobtitlepage.sendInviteToEmployee(newEmployeeEmail);
			});

			await allure.step("Verify employee is added to job title", async () => {
				await jobtitlepage.navigateToSubSection("Active");
				await jobtitlepage.verifyMemberExistence(newEmployeeEmail);
			});

			await allure.step("Verifying removing employee from job title", async () => {
				await jobtitlepage.removeMembers(newEmployeeName);
			});

			await allure.step("Verifying employee is removed from job title", async () => {
				await PeoplePage.navigateToSections("Job Titles");
				await communFunction.search(jobTitle);
				const bool = await jobtitlepage.verifyMemberExistence(newEmployeeEmail);
				expect(bool).toBe(false);
			});
		});


		await allure.step("Editing the job title", async () => {
			await jobtitlepage.editJobTitle(jobTitle, editJobTitle);
		});

		await allure.step("Verifying the job title is edited in the UI", async () => {
			await communFunction.search(editJobTitle);
			await jobtitlepage.verifyJobTitleExistence(editJobTitle);
		});

		await allure.step("Deleting the job title", async () => {
			await jobtitlepage.deleteJobTitle(editJobTitle);
		});

		await allure.step("Verifying the job title is deleted in the UI", async () => {
			const bool = await jobtitlepage.verifyJobTitleExistence(editJobTitle);
			expect(bool).toBe(false);
		});

		await allure.step("Creating two more job titles for verifying bulk delete", async () => {
			await jobtitlepage.addJobTitle(jobTitle2);
			await communFunction.search(jobTitle2);
			await jobtitlepage.verifyJobTitleExistence(jobTitle2);
			await jobtitlepage.addJobTitle(jobTitle3);
			await communFunction.search(jobTitle3);
			await jobtitlepage.verifyJobTitleExistence(jobTitle3);
		});

		await allure.step("Deleting the job titles", async () => {
			await jobtitlepage.deleteJobTitle(jobTitle2, jobTitle3);
		});

		await allure.step("Verifying first job title deletion in the UI", async () => {
			await communFunction.search(jobTitle2);
			const bool = await jobtitlepage.verifyJobTitleExistence(jobTitle2);
			expect(bool).toBe(false);
		});

		await allure.step("Verifying second job title deletion in the UI", async () => {
			await communFunction.search(jobTitle3);
			const bool = await jobtitlepage.verifyJobTitleExistence(jobTitle3);
			expect(bool).toBe(false);
		});
	});
});

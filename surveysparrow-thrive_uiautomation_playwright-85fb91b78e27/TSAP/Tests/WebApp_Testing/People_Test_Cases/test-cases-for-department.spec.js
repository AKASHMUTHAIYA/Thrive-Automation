import { allure } from "allure-playwright";
import { expect } from "playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { emptyDir } from "fs-extra";

test.describe(" Verify the functionality of creating, editing, deleting and bulk deleting departments manually and adding and removing employee to department", () => {
	test("TC_01_Creating, Editing, Deleting and Bulk Deleting Departments and Adding and Removing Employee to Department @Regression @department", async ({
		thrivePage,
	}) => {
		await allure.description("Adding a new Department in the organization");

		const poManager = new POManager(thrivePage);
		const commonFunction = poManager.getCommonPageFunctions();
		const departmentPage = poManager.getDepartmentsPage();
		const peoplePage = poManager.getPeoplePage();
		const empPage = poManager.getEmployeePage();

		await commonFunction.navigateTopNavigateSection("People");
		await peoplePage.navigateToSections("Departments");
		let newDepartmentName=CommonUtils.generateRandomText(5);
		let newDepartmentName2=CommonUtils.generateRandomText(5);
		let newDepartmentName3=CommonUtils.generateRandomText(5);
		let editDepartmentName=CommonUtils.generateRandomText(5);


		await allure.step("Creating a new department", async () => {
			const departmentName = await departmentPage.addDepartment({
				departmentName: newDepartmentName,
				purpose: "Test case for adding a new department",
				departmentLead: "Lucas Hawk",
				coverImage: "departcoverimg.jpeg",
			});

			await allure.step("Verifying department creation", async () => {
				await commonFunction.search(departmentName);
				const bool =
					await departmentPage.verifyDepartmentExistence(departmentName);
				expect(bool).toBeTruthy();
			});
		});


		await allure.step("Verifying adding and removing employee to department", async () => {

			let newEmployeeName = CommonUtils.generateRandomText(5).toLowerCase();
			let newEmployeeEmail = newEmployeeName + "@dummydept.com";

			await allure.step("Creating employee without department & job title", async () => {
                await peoplePage.navigateToSections("Employees");

				await empPage.addEmployeeManually(0, {
				name: newEmployeeName,
				employeeEmail: newEmployeeEmail,
			});
				await empPage.sendInviteAfterImportingSliderOff();
			});

			await allure.step(" Verifying adding employee to department", async () => {
				await peoplePage.navigateToSections("Departments");
				await departmentPage.addMembers(newDepartmentName, newEmployeeEmail);
			});

			await allure.step("Verifying employee is added to department", async () => {
				await departmentPage.navigateToSubSection("Invite Not Sent");
				await departmentPage.verifyMemberExistence(newEmployeeEmail);
			});

			await allure.step("Verify sending invite from department section", async () => {
				await departmentPage.sendInviteToEmployee(newEmployeeEmail);
			});

			await allure.step("Verify employee is added to department", async () => {
				await departmentPage.navigateToSubSection("Active");
				await departmentPage.verifyMemberExistence(newEmployeeEmail);
			});

			await allure.step("Verifying removing employee	 from department", async () => {
				await departmentPage.removeMembers(newEmployeeEmail);
	
				await allure.step("Verifying employee is removed from department", async () => {
					await peoplePage.navigateToSections("Departments");
					await commonFunction.search(newDepartmentName);
					const bool = await departmentPage.verifyMemberExistence(newEmployeeEmail);
					expect(bool).toBe(false);
				});
			});
		});


		await allure.step("Editing the department", async () => {
			await departmentPage.editDepartment(newDepartmentName, {
				departmentNameToEdit: editDepartmentName,
				purpose: "Test case for editing a department",
				departmentLead: "Ali Falcon",
				coverImage: "email-header.png",
			});
		});

		await allure.step("Verifying department editing", async () => {
			await commonFunction.search(editDepartmentName);
			const bool =
				await departmentPage.verifyDepartmentExistence(editDepartmentName);
			expect(bool).toBeTruthy();
		});

		await allure.step("Deleting the department", async () => {
			await departmentPage.deleteDepartment(editDepartmentName);
		});

		await allure.step("Verifying department deletion", async () => {
			await commonFunction.search(editDepartmentName);
			const bool = await departmentPage.verifyDepartmentExistence(editDepartmentName);
			expect(bool).toBe(false);
		});


		await allure.step("Creating two more department for verifying bulk delete", async () => {

			const departmentName2 = await departmentPage.addDepartment({
				departmentName: newDepartmentName2,
				purpose: "Test case for adding a new department",
				departmentLead: "Lucas Hawk",
			});
			await commonFunction.search(departmentName2);
			await departmentPage.verifyDepartmentExistence(departmentName2);

			const departmentName3 = await departmentPage.addDepartment({
				departmentName: newDepartmentName3,
				purpose: "Test case for adding a new department",
				departmentLead: "Lucas Hawk",
			});
			await commonFunction.search(departmentName3);
			await departmentPage.verifyDepartmentExistence(departmentName3);
		});

		await allure.step("Deleting the departments", async () => {
			await departmentPage.deleteDepartment(newDepartmentName2, newDepartmentName3);
		});

		await allure.step("Verifying first department deletion", async () => {
			const bool = await departmentPage.verifyDepartmentExistence(newDepartmentName2);
			expect(bool).toBe(false);
		});

		await allure.step("Verifying second department deletion", async () => {
			const bool = await departmentPage.verifyDepartmentExistence(newDepartmentName3);
			expect(bool).toBe(false);
		});
	});
});

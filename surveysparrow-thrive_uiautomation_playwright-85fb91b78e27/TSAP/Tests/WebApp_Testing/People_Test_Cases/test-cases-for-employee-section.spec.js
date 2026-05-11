import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { Common } from "googleapis";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { ReadEmail } from "playwright-framework/Core/Utils/read-email.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import {
	constants,
	generateRandomEmployeeNameAndEmail,
} from "../../../Data/Resources/constants.js";
import { generateRandomEmployeeProperty } from "../../../Data/Resources/random-values.js";
import { envDetails } from "../../../Data/test-data.js";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";
import { PeoplePage } from "../../../Pages/People/people-page.js";

const employeeDetails = {};
test.beforeEach(async ({ thrivePage }) => {
	const poManager = new POManager(thrivePage);
	const empPage = poManager.getEmployeePage();
	const loginPage = poManager.getLoginPage();

	await allure.step("Navigate to people section", async () => {
		await empPage.navigateToTopNavSection("People");
	});
});

test.describe("Add Employee Manually", () => {
	test("TC_01_Add Employee Manually with Invite Not Send @Regression", async ({
		thrivePage,
	}) => {
		await allure.description(
			"This test attempts to add employee manully without sending invite and check the employee in Invite Not Sent",
		);

		const poManager = new POManager(thrivePage);
		const empPage = poManager.getEmployeePage();
		const commonfunction = new CommonPageFunctions(thrivePage);

		//generating random department/manager/jobtitle using function
		const { departmentName, managerName, jobtitleName } =
			generateRandomEmployeeProperty();

		const { employeeName, employeeEmail } =
			generateRandomEmployeeNameAndEmail();
		const randomNum = CommonUtils.getRandomIntInclusive(10000, 99999);

		await allure.step("Adding employee manually with all details", async () => {
			await empPage.addEmployeeManually(0, {
				name: employeeName,
				employeeEmail: employeeEmail,
				department: departmentName,
				manager: managerName,
				jobtitle: jobtitleName,
				employeeId: String(randomNum),
			});
		});

		await allure.step(
			"Turen off the slider to send invite after adding employee to people",
			async () => {
				await empPage.sendInviteAfterImportingSliderOff();
			},
		);

		await allure.step(
			"Verify employee is added and in onboarded state",
			async () => {
				await empPage.searchEmployees(employeeName, "Invite Not Sent");
				await CommonUtils.sleep(2);
				await commonfunction.waitTillLoadingElementDisappear(20);
				const resultedEmpName = await empPage.getEmployeeName();
				await PwActions.verifyTextExpected(resultedEmpName, employeeName);
			},
		);

		await allure.step("Deactivate added employee", async () => {
			await empPage.deactivateEmployee(employeeEmail);
		});

		await allure.step(
			"Verify deactivated employee is listed in Deactivated tab",
			async () => {
				await empPage.navigateToSubTopSection("Deactivated");
				await commonfunction.search(employeeEmail);
				await empPage.verifyEmployeeName(employeeName);
			},
		);
	});

	test("TC_04_Add Employee Manually using CSV and verify the signup email is sent @Regression @productionSanity", async ({
		thrivePage,
		browser,
	}) => {
		await allure.description(
			"This test imports an employee via CSV with all property types (standard fields + gender, location, country, language, DOB, all custom fields), verifies all properties in the admin edit pane, sends invite, verifies signup email, and deactivates",
		);
		const poManager = new POManager(thrivePage);
		const employeePage = poManager.getEmployeePage();
		const peoplePage = poManager.getPeoplePage();
		const communFunction = poManager.getCommonPageFunctions();
		const commonUtils = new CommonUtils();
		const loginPage = poManager.getLoginPage();
		const readEmail = new ReadEmail();

		await allure.step(
			"Check and enable Gender property if disabled",
			async () => {
				await peoplePage.navigateToSections("Properties");
				await communFunction.search("Gender");
				await CommonUtils.sleep(2);
				const genderToggle = await PwActions.getAttributeValue(
					thrivePage,
					"//p[text()='Gender']/ancestor::td/following-sibling::td//button",
					"data-state",
				);
				if (genderToggle === "unchecked") {
					await employeePage.setPropertyState("Gender", "on");
					await CommonUtils.sleep(1);
				}
				await peoplePage.navigateToSections("Employees");
			},
		);

		const { filePath, employeeDetails } =
			await employeePage.generateRandomPeopleCSVData(1);

		await allure.step("Generate CSV data and import employees", async () => {
			await communFunction.navigateTopNavigateSection("People");
			await employeePage.importFromCSV(filePath);
			await CommonUtils.sleep(120);
			const { entries, updated, errors } =
				await communFunction.getLatestImportEntries();
			if (errors > 0 || updated > 0) {
				throw new Error(
					`Some employees already exist or errors in CSV — Updated: ${updated}, Errors: ${errors}`,
				);
			}
			expect(entries).toBe(employeeDetails.length);
			await communFunction.navigateTopNavigateSection("People");
		});

		await allure.step(
			"Verify imported employees appear in Invite Not Sent tab",
			async () => {
				await peoplePage.navigateToSections("Employees");
				for (const { name } of employeeDetails) {
					await employeePage.searchEmployees(name, constants.inviteNotSent);
				}
			},
		);

		await allure.step(
			"Verify all employee properties in the admin edit pane after CSV import",
			async () => {
				for (const emp of employeeDetails) {
					await employeePage.searchEmployees(
						emp.email,
						constants.inviteNotSent,
					);
					await communFunction.waitTillLoadingElementDisappear(20);
					await employeePage.verifyEmployeeDetails(emp.email, {
						employeeName: emp.name,
						department: emp.department,
						manager: constants.managerName,
						jobtitle: emp.jobtitle,
						employeeId: emp.employeeId,
						contactNumber: emp.phone,
						secondaryEmail: emp.secondaryEmail,
						dateOfJoining: emp.dateOfJoining,
						gender: emp.gender,
						location: emp.location,
						countryName: emp.countryName,
						language: emp.language,
						customDropdownValueName: emp.customDropdownValueName,
						customNumber: emp.customNumber,
						customEmail: emp.customEmail,
						customSingleLineText: emp.customSingleLineText,
						customMultiLineText: emp.customMultiLineText,
						customUrl: emp.customUrl,
					});
					await PwActions.click(
						thrivePage,
						employeePage.btnCloseEmployeeEditModal,
					);
				}
			},
		);

		await allure.step(
			"Send invite to each employee and verify Active status",
			async () => {
				for (const { name } of employeeDetails) {
					await employeePage.sendInviteToEmployee(name);
				}
			},
		);

		await allure.step(
			"Verify invite email received, set password, and login as employee",
			async () => {
				const verificationPromises = employeeDetails.map(
					async ({ name, email }) => {
						await employeePage.verifyEmployeeInviteEmailContent(
							name,
							envDetails.senderEmail,
							constants.new_employee_email,
							constants.new_employee_email_subject,
						);
						const signupBodyContent =
							await constants.getEmailBodyContentForSignupUrl(name);
						const signupUrl = await readEmail.fetch_survey_url_from_email({
							subject: constants.new_employee_email_subject,
							body: signupBodyContent,
						});
						const { page2, password } = await loginPage.setOrResetPassword(
							signupUrl,
							browser,
							"set",
						);
						expect(password).toBeDefined();
						await loginPage.login(page2, email, password);
						await loginPage.validateLoggedInUserAndSignOut(page2, name);
						await PwActions.closeTab(page2);
					},
				);
				await Promise.all(verificationPromises);
			},
		);

		await allure.step("Deactivate added employees for cleanup", async () => {
			await peoplePage.navigateToSections("Employees");
			for (const { email } of employeeDetails) {
				await employeePage.searchEmployees(email, "Active");
				await communFunction.waitTillLoadingElementDisappear(20);
				await employeePage.deactivateEmployee(email);
			}
		});

		await allure.step(
			"Verify deactivated employees appear in Deactivated tab",
			async () => {
				await employeePage.navigateToSubTopSection("Deactivated");
				for (const { name } of employeeDetails) {
					await communFunction.search(name);
					await employeePage.verifyEmployeeName(name);
				}
			},
		);

		await commonUtils.deleteFile(filePath);
	});
});

test("TC_02_Add Employee Manually Invited and Edit @Regression", async ({
	thrivePage,
}) => {
	await allure.description(
		"This test adds an employee manually with sending invite, edits the newly created employee, and verifies the changes",
	);

	const poManager = new POManager(thrivePage);
	const commonfunction = new CommonPageFunctions(thrivePage);
	const empPage = poManager.getEmployeePage();
	const peoplePage = poManager.getPeoplePage();
	const senderEmail = envDetails.senderEmail;
	const receiverEmail = constants.new_employee_email;
	const senderEmailSubject = constants.new_employee_email_subject;

	//generating random department/manager/jobtitle using function
	const { departmentName, managerName, jobtitleName } =
		generateRandomEmployeeProperty();

	const { employeeName, employeeEmail } = generateRandomEmployeeNameAndEmail();
	//generating random number to add with email")
	const randomNum = CommonUtils.getRandomIntInclusive(10000, 99999);
	// Ensure Gender property is enabled before starting the test
	await allure.step(
		"Check and enable Gender property if disabled",
		async () => {
			await peoplePage.navigateToSections("Properties");
			await commonfunction.search("Gender");
			await CommonUtils.sleep(2);

			const genderToggle = await PwActions.getAttributeValue(
				thrivePage,
				"//p[text()='Gender']/ancestor::td/following-sibling::td//button",
				"data-state",
			);

			if (genderToggle === "unchecked") {
				await empPage.setPropertyState("Gender", "on");
				await CommonUtils.sleep(1);
			}

			await peoplePage.navigateToSections("Employees");
		},
	);

	await allure.step("Add employee manually with all details", async () => {
		await empPage.addEmployeeManually(0, {
			name: employeeName,
			employeeEmail: employeeEmail,
			department: departmentName,
			manager: managerName,
			jobtitle: jobtitleName,
			employeeId: String(randomNum),
		});
	});

	await allure.step(
		"Turn on the slider to send invite after adding employee to people",
		async () => {
			await empPage.sendInviteAfterImportingSliderOn();
		},
	);

	await allure.step(
		"Verify employee is added and in Active state",
		async () => {
			await empPage.searchEmployees(employeeName, "Active");
			await commonfunction.waitTillLoadingElementDisappear(10);
			await CommonUtils.sleep(2);
			await empPage.verifyEmployeeName(employeeName);
		},
	);

	await allure.step(
		"Verify employee invite email is received and has expected content",
		async () => {
			await empPage.verifyEmployeeInviteEmailContent(
				employeeName,
				senderEmail,
				receiverEmail,
				senderEmailSubject,
			);
		},
	);

	// Now edit the newly created employee
	const editedName = `${employeeName} Edited`;
	const nickName = `${employeeName.split(" ")[0]} Nick`;
	const newDepartment = generateRandomEmployeeProperty().departmentName;
	const newManager = generateRandomEmployeeProperty().managerName;
	const newJobtitle = generateRandomEmployeeProperty().jobtitleName;
	const newEmployeeId = String(CommonUtils.getRandomIntInclusive(10000, 99999));
	const contactNumber = `+1${CommonUtils.getRandomIntInclusive(1000000000, 9999999999)}`;
	const gender = constants.defaultGender;
	const location = constants.defaultLocation;
	const {
		countryName,
		language,
		dateOfJoining,
		phoneNumber,
		customNumber,
		customEmail,
		customSingleLineText,
		customMultiLineText,
		customUrl,
		customDropdownValueName,
	} = generateRandomEmployeeProperty();

	await allure.step("Search and edit the newly created employee", async () => {
		await empPage.searchEmployees(employeeEmail, "Active");
		await commonfunction.waitTillLoadingElementDisappear(20);
	});

	await allure.step("Edit employee details and save", async () => {
		await empPage.editEmployeeDetails(employeeEmail, {
			name: editedName,
			nickName,
			department: newDepartment,
			manager: newManager,
			jobtitle: newJobtitle,
			employeeId: newEmployeeId,
			contactNumber,
			gender,
			location,
			dateOfJoining,
			countryName,
			language,
			customNumber,
			customEmail,
			customSingleLineText,
			customMultiLineText,
			customUrl,
			customDropdownValueName,
		});
	});

	await allure.step("Verify edited employee details", async () => {
		await empPage.verifyEmployeeDetails(employeeEmail, {
			name: editedName,
			nickName,
			employeeEmail,
			department: newDepartment,
			manager: newManager,
			jobtitle: newJobtitle,
			employeeId: newEmployeeId,
			contactNumber,
			gender,
			location,
			dateOfJoining,
			countryName,
			language,
			customNumber,
			customEmail,
			customSingleLineText,
			customMultiLineText,
			customUrl,
			customDropdownValueName,
		});
	});

	// Disable Gender property at the end for next test run
	await allure.step("Disable Gender property for next test run", async () => {
		await PwActions.pageRefresh(thrivePage);
		await peoplePage.navigateToSections("Properties");
		await commonfunction.search("Gender");
		await CommonUtils.sleep(2);
		await empPage.setPropertyState("Gender", "off");
	});

	// Deactivate the created employee for cleanup
	await allure.step("Deactivate the created employee", async () => {
		await peoplePage.navigateToSections("Employees");
		await empPage.searchEmployees(employeeEmail, "Active");
		await commonfunction.waitTillLoadingElementDisappear(20);
		await empPage.deactivateEmployee(employeeEmail);
	});
});

test("TC_06_Verify custom property is not available in employee edit page @custom_property @Regression", async ({
	thrivePage,
}) => {
	await allure.description(
		"This test attempts to verify custom property is not available in employee edit page",
	);
	const poManager = new POManager(thrivePage);
	const empPage = poManager.getEmployeePage();
	const propertiesPage = poManager.getPropertyPage();
	const employeeEmail = constants.manager_evaluator_email;
	const peoplePage = poManager.getPeoplePage();
	const commonfunction = new CommonPageFunctions(thrivePage);
	await allure.step("Navigate to Properties section", async () => {
		await peoplePage.navigateToSections("Properties");
		const randomNum = CommonUtils.getRandomIntInclusive(10000, 99999);
		const propertyLabel = `Create property ${randomNum}`;
		await propertiesPage.addNewProperty(
			"Single Line Text",
			propertyLabel,
			"Custom property hint text",
		);
		const internalName = propertyLabel.toLowerCase().replace(/ /g, "_");
		await propertiesPage.searchProperty(internalName);
		await empPage.setPropertyState(propertyLabel, "off");
		await peoplePage.navigateToSections("Employees");
		await empPage.searchEmployees(employeeEmail, "Active");
		await empPage.openEmployeeEditPage(employeeEmail);
		await commonfunction.verifyIsPropertynotEnabled(propertyLabel);
	});
	await allure.step("Enable Gender property for next test run", async () => {
		await PwActions.pageRefresh(thrivePage);
		await peoplePage.navigateToSections("Properties");
		await commonfunction.search("Gender");
		await CommonUtils.sleep(2);
		await empPage.setPropertyState("Gender", "on");
	});
});
test("[trial]TC_05_Adding employess more than Quota limit @quota @Regression", async ({
	thrivePage,
}) => {
	const poManager = new POManager(thrivePage);
	const employeesPage = poManager.getEmployeePage();
	const importPage = poManager.getImportsPage();
	const commonPageFunctions = poManager.getCommonPageFunctions();
	await allure.step(
		"Adding employess more than Quote limit using CSV",
		async () => {
			await commonPageFunctions.navigateTopNavigateSection("People");
			await employeesPage.importFromCSV("Add_Employee_Manually.csv");
		},
	);
	await allure.step("Reloading the import status", async () => {
		await importPage.reloadImportStatusUntilErrorFile(12, 5);
	});
	await allure.step(
		"Downloading the Error file and checking the error message",
		async () => {
			await CommonUtils.sleep(10);
			await PwActions.pageRefresh(thrivePage);
			const { filePath } = await commonPageFunctions.downloadFileAndReturnPath(
				thrivePage,
				importPage.btn_DownloadLatestError,
			);
			const CSV_data = await CommonUtils.getColumnFromCsv(
				filePath,
				" Error Message",
			);
			await CommonUtils.containsSubstring(
				CSV_data,
				"Create Employee limit exceeded for 'TRIAL' plan",
			);
		},
	);
});

test("TC 07 verify bulk deactivating employees, activation of a employee and super admin not allowed to deactivate @Regression @people @employees @deactivate", async ({
	thrivePage,
}) => {
	await allure.description(
		"This test attempts to verify bulk deactivating employees, activation of a employee and super admin not allowed to deactivat and also verify count, pagination and search functionality in data issues page",
	);
	const poManager = new POManager(thrivePage);
	const employeesPage = poManager.getEmployeePage();
	const peoplePage = poManager.getPeoplePage();
	const commonfunction = new CommonPageFunctions(thrivePage);
	await allure.step("Navigate to People section", async () => {
		await peoplePage.navigateToSections("Employees");
	});

	const {
		employeeName: employeeName1,
		employeeEmail: employeeEmail1,
		secondaryEmail: secondaryEmail1,
	} = generateRandomEmployeeNameAndEmail();
	const {
		employeeName: employeeName2,
		employeeEmail: employeeEmail2,
		secondaryEmail: secondaryEmail2,
	} = generateRandomEmployeeNameAndEmail();

	await allure.step("Add two employees manually", async () => {
		await employeesPage.addEmployeeManually(0, {
			name: employeeName1,
			employeeEmail: employeeEmail1,
			secondaryEmail: secondaryEmail1,
		});
		await employeesPage.sendInviteAfterImportingSliderOn();
	});

	await allure.step(
		"Verify employee is added and in Active state",
		async () => {
			await employeesPage.searchEmployees(employeeName1, "Active");
			await commonfunction.waitTillLoadingElementDisappear(10);
			await CommonUtils.sleep(2);
			await employeesPage.verifyEmployeeName(employeeName1);
		},
	);

	await allure.step("Add second employee with secondary email", async () => {
		await employeesPage.addEmployeeManually(1, {
			name: employeeName2,
			employeeEmail: employeeEmail2,
			secondaryEmail: secondaryEmail2,
		});
		await employeesPage.sendInviteAfterImportingSliderOn();
	});

	await allure.step(
		"Verify employee is added and in Active state",
		async () => {
			await employeesPage.searchEmployees(employeeName2, "Active");
			await commonfunction.waitTillLoadingElementDisappear(10);
			await CommonUtils.sleep(2);
			await employeesPage.verifyEmployeeName(employeeName2);
		},
	);

	await allure.step(
		"Verify search by secondary email returns the employee",
		async () => {
			await employeesPage.searchEmployeeByEmailAndVerifyTheEmployeeName({
				searchEmail: secondaryEmail2,
				employeeName: employeeName2,
				sectionName: "Active",
			});
		},
	);

	await allure.step("Bulk deactivate employees", async () => {
		await employeesPage.bulkDeactivateEmployees([employeeName1, employeeName2]);
	});

	await allure.step("Verify employees are deactivated", async () => {
		await employeesPage.searchEmployees(employeeName1, "Deactivated");
		await employeesPage.verifyEmployeeName(employeeName1);
		await employeesPage.searchEmployees(employeeName2, "Deactivated");
		await employeesPage.verifyEmployeeName(employeeName2);
	});

	await allure.step("Activate the employees", async () => {
		await employeesPage.activateEmployee(employeeName1);
	});

	await allure.step("Verify employees are activated", async () => {
		await employeesPage.searchEmployees(employeeName1, "Active");
		await employeesPage.verifyEmployeeName(employeeName1);
	});

	await allure.step(
		"Verify deactivating super admin should not be allowed",
		async () => {
			await employeesPage.verifyDeactivateSuperAdminNotAllowed(
				envDetails.adminEmail,
			);
		},

		//TODO: verify deactivate super admin not allowed by an admin
	);

	await allure.step(
		"Verify Count, Pagination and search functionality in data issues page",
		async () => {
			await employeesPage.verifyCountAndPaginationInDataIssues({
				sectionName: "Phone No. Missing",
				sectionHeading: "Phone Number Missing",
			});

			await employeesPage.verifyCountAndPaginationInDataIssues({
				sectionName: "Department Missing",
				sectionHeading: "Department Missing",
			});

			await employeesPage.verifyCountAndPaginationInDataIssues({
				sectionName: "Manager Missing",
				sectionHeading: "Manager Missing",
			});

			await employeesPage.verifySearchInDataIssuesPage(
				"Phone No. Missing",
				employeeName1,
			);
			await employeesPage.verifySearchInDataIssuesPage(
				"Department Missing",
				employeeName1,
			);
			await employeesPage.verifySearchInDataIssuesPage(
				"Manager Missing",
				employeeName1,
			);
		},
	);

	await allure.step(
		"Verify search by secondary email in data issues sections",
		async () => {
			await employeesPage.verifySearchInDataIssuesPage(
				"Phone No. Missing",
				employeeName1,
				secondaryEmail1,
			);
			await employeesPage.verifySearchInDataIssuesPage(
				"Manager Missing",
				employeeName1,
				secondaryEmail1,
			);
			await employeesPage.verifySearchInDataIssuesPage(
				"Department Missing",
				employeeName1,
				secondaryEmail1,
			);
		},
	);

	const { departmentName, managerName, phoneNumber } =
		generateRandomEmployeeProperty();

	await allure.step("Fix all three data issues for the employee", async () => {
		await employeesPage.fixDataIssue({
			sectionName: "Phone No. Missing",
			employeeName: employeeName1,
			value: phoneNumber,
		});
		await employeesPage.fixDataIssue({
			sectionName: "Department Missing",
			employeeName: employeeName1,
			value: departmentName,
		});
		await employeesPage.fixDataIssue({
			sectionName: "Manager Missing",
			employeeName: employeeName1,
			value: managerName,
		});
	});

	await allure.step(
		"Verify employee is no longer in data issues sections",
		async () => {
			await employeesPage.peoplePage.navigateToSections("Phone No. Missing");
			await CommonUtils.sleep(2);
			await employeesPage.commonfunction.search(employeeName1);
			await PwActions.verifyElementIsNotPresent(
				thrivePage,
				employeesPage.employeeRow(employeeName1),
			);

			await employeesPage.peoplePage.navigateToSections("Department Missing");
			await CommonUtils.sleep(2);
			await employeesPage.commonfunction.search(employeeName1);
			await PwActions.verifyElementIsNotPresent(
				thrivePage,
				employeesPage.employeeRow(employeeName1),
			);

			await employeesPage.peoplePage.navigateToSections("Manager Missing");
			await CommonUtils.sleep(2);
			await employeesPage.commonfunction.search(employeeName1);
			await PwActions.verifyElementIsNotPresent(
				thrivePage,
				employeesPage.employeeRow(employeeName1),
			);
		},
	);

	await allure.step("Deactivate the employees", async () => {
		await peoplePage.navigateToSections("Employees");
		await employeesPage.searchEmployees(employeeName1, "Active");
		await employeesPage.deactivateEmployee(employeeName1);
	});
});

test("TC_08 Verify count and pagination in People Directory @Regression @people @employees", async ({
	thrivePage,
}) => {
	await allure.description(
		"This test attempts to verify count and pagination in People Directory for Active, Invite Not Sent and Deactivated employees",
	);
	const poManager = new POManager(thrivePage);
	const employeesPage = poManager.getEmployeePage();
	const peoplePage = poManager.getPeoplePage();

	await allure.step("Navigate to People Directory section", async () => {
		await peoplePage.navigateToSections("Employees");
	});

	await allure.step(
		"Verify count and pagination in People Directory",
		async () => {
			await employeesPage.verifyCountAndPaginationInPeopleDirectory("Active");
			await employeesPage.verifyCountAndPaginationInPeopleDirectory(
				"Invite Not Sent",
			);
			await employeesPage.verifyCountAndPaginationInPeopleDirectory(
				"Deactivated",
			);
		},
	);
});

test("TC_09_Verify secondary email restrictions when adding employee @Regression @people @employees @secondary_email @email_validation", async ({
	thrivePage,
}) => {
	await allure.description(
		"This test verifies that primary and secondary email cannot be the same, and existing primary/secondary emails cannot be reused as a new employee's primary or secondary email",
	);
	const poManager = new POManager(thrivePage);
	const employeesPage = poManager.getEmployeePage();
	const peoplePage = poManager.getPeoplePage();
	const commonfunction = new CommonPageFunctions(thrivePage);

	await allure.step("Navigate to Employees section", async () => {
		await peoplePage.navigateToSections("Employees");
	});

	const { employeeName, employeeEmail, secondaryEmail } =
		generateRandomEmployeeNameAndEmail();

	await allure.step(
		"Add an employee with primary and secondary email",
		async () => {
			await employeesPage.addEmployeeManually(0, {
				name: employeeName,
				employeeEmail: employeeEmail,
				secondaryEmail: secondaryEmail,
			});
			await employeesPage.sendInviteAfterImportingSliderOn();
		},
	);

	await allure.step(
		"Verify the employee is created in Active section",
		async () => {
			await employeesPage.searchEmployees(employeeName, "Active");
			await commonfunction.waitTillLoadingElementDisappear(10);
			await CommonUtils.sleep(2);
			await employeesPage.verifyEmployeeName(employeeName);
		},
	);

	const {
		employeeName: newEmpName,
		employeeEmail: newPrimaryEmail,
		secondaryEmail: newSecondaryEmail,
	} = generateRandomEmployeeNameAndEmail();

	await allure.step(
		"Verify same primary and secondary email blocks save",
		async () => {
			await employeesPage.attemptAddEmployeeAndVerifyBlocked({
				rowNum: 0,
				employeeData: {
					name: newEmpName,
					employeeEmail: newPrimaryEmail,
					secondaryEmail: newPrimaryEmail,
				},
			});
		},
	);

	await allure.step(
		"Verify existing primary email cannot be used as new employee primary email",
		async () => {
			await employeesPage.attemptAddEmployeeAndVerifyBlocked({
				rowNum: 0,
				employeeData: {
					name: newEmpName,
					employeeEmail: employeeEmail,
					secondaryEmail: newSecondaryEmail,
				},
			});
		},
	);

	await allure.step(
		"Verify existing secondary email cannot be used as new employee primary email",
		async () => {
			await employeesPage.attemptAddEmployeeAndVerifyBlocked({
				rowNum: 0,
				employeeData: {
					name: newEmpName,
					employeeEmail: secondaryEmail,
					secondaryEmail: newSecondaryEmail,
				},
			});
		},
	);

	await allure.step(
		"Verify existing primary email cannot be used as new employee secondary email",
		async () => {
			await employeesPage.attemptAddEmployeeAndVerifyBlocked({
				rowNum: 0,
				employeeData: {
					name: newEmpName,
					employeeEmail: newPrimaryEmail,
					secondaryEmail: employeeEmail,
				},
			});
		},
	);

	await allure.step(
		"Verify existing secondary email cannot be used as new employee secondary email",
		async () => {
			await employeesPage.attemptAddEmployeeAndVerifyBlocked({
				rowNum: 0,
				employeeData: {
					name: newEmpName,
					employeeEmail: newPrimaryEmail,
					secondaryEmail: secondaryEmail,
				},
			});
		},
	);

	await allure.step("Deactivate the employee for cleanup", async () => {
		await peoplePage.navigateToSections("Employees");
		await employeesPage.searchEmployees(employeeName, "Active");
		await employeesPage.deactivateEmployee(employeeName);
	});
});

test("TC_10_Verify sample CSV can be downloaded from employee import @Regression @people @employees", async ({
	thrivePage,
}) => {
	await allure.description(
		"This test verifies sample CSV download from Add Employees > Import from CSV, validates the file has data rows, and deletes the downloaded file",
	);
	const poManager = new POManager(thrivePage);
	const employeesPage = poManager.getEmployeePage();
	const peoplePage = poManager.getPeoplePage();
	const commonfunction = new CommonPageFunctions(thrivePage);
	const commonUtils = new CommonUtils();
	let downloadedFilePath;

	await allure.step("Navigate to Employees section", async () => {
		await peoplePage.navigateToSections("Employees");
	});

	await allure.step("Download sample CSV from import flow", async () => {
		downloadedFilePath = await employeesPage.downloadSampleCSVFromImport();
		expect(
			downloadedFilePath.toLowerCase().endsWith(".csv"),
			`Expected downloaded file to be a CSV, but got: ${downloadedFilePath}`,
		).toBeTruthy();
	});

	await allure.step("Verify downloaded sample CSV has data rows", async () => {
		await commonfunction.verifyDownloadedCSV(downloadedFilePath);
	});

	await allure.step("Delete downloaded sample CSV file", async () => {
		await commonUtils.deleteFile(downloadedFilePath);
	});
});

test("TC_11_Verify newly added employee is available as subject in performance survey @Regression @people @performance", async ({
	thrivePage,
}) => {
	await allure.description(
		"This test creates a new employee from People module and verifies the employee is synced with Thrive SS database",
	);
	const poManager = new POManager(thrivePage);
	const employeesPage = poManager.getEmployeePage();
	const peoplePage = poManager.getPeoplePage();
	const surveyPage = poManager.getSurveyPage();
	const surveyLaunchPage = poManager.getSurveyLaunchPage();
	const performanceParticipantsPage =
		poManager.getPerformanceParticipantsPage();
	const commonFunctions = poManager.getCommonPageFunctions();
	const commonUtils = new CommonUtils();
	const surveyName = `Automation Survey Employee Sync ${Date.now()}`;
	const { employeeName, employeeEmail } = generateRandomEmployeeNameAndEmail();
	let participantCsvPath = "";

	await allure.step("Add a new employee from People module", async () => {
		await peoplePage.navigateToSections("Employees");
		await employeesPage.addEmployeeManually(0, {
			name: employeeName,
			employeeEmail: employeeEmail,
		});
		await employeesPage.sendInviteAfterImportingSliderOn();
		await employeesPage.searchEmployees(employeeEmail, "Active");
		await employeesPage.verifyEmployeeName(employeeName);
	});

	await allure.step(
		"Create Performance survey and add the newly created employee as subject",
		async () => {
			await commonFunctions.navigateTopNavigateSection("Performance");
			await surveyPage.createNewSurvey(surveyName);
			await surveyPage.navigateTopSections("Participants");
			await performanceParticipantsPage.addParticipants(
				employeeEmail,
				[{ evaluatorName: constants.evaluator_email, evaluatorRole: "Peer" }],
				constants.approver_email,
				constants.add_to_shortlist,
			);
		},
	);

	await allure.step("Launch the survey", async () => {
		await surveyLaunchPage.launchSurvey();
		await surveyLaunchPage.confirmPerformanceSurveyLaunch();
	});

	await allure.step(
		"Verify the newly added employee is available in Performance participants",
		async () => {
			participantCsvPath =
				await performanceParticipantsPage.downloadParticipantsCSV();
			const participantsCsvData =
				await commonUtils.readCSVFile(participantCsvPath);
			const participants =
				performanceParticipantsPage.getParticipantsSurveyLinkFromCSV(
					participantsCsvData,
				);
			const syncedSubject = participants.find(
				(participant) =>
					participant.subjectEmail?.toLowerCase() ===
					employeeEmail.toLowerCase(),
			);
			expect(
				syncedSubject,
				`Newly created employee '${employeeEmail}' should be available as subject in Performance participants`,
			).toBeDefined();
		},
	);

	await allure.step("Cleanup created employee and downloaded CSV", async () => {
		await commonUtils.deleteFile(participantCsvPath);
		await commonFunctions.navigateToPageUrl("People");
		await commonFunctions.navigateTopNavigateSection("People");
		await peoplePage.navigateToSections("Employees");
		await employeesPage.searchEmployees(employeeEmail, "Active");
		await employeesPage.deactivateEmployee(employeeEmail);
	});
});

test.describe("Verifying Smart List functionalities", () => {
	test("TC_12_Verify create edit export and delete a smart list @smartlist @crud @Regression", async ({
		thrivePage,
	}) => {
		await allure.description(
			"Verify create edit export and delete a smart list",
		);

		const poManager = new POManager(thrivePage);
		const peoplePage = poManager.getPeoplePage();
		const empPage = poManager.getEmployeePage();
		const smartListPage = poManager.getSmartListPage();
		const commonFunctions = poManager.getCommonPageFunctions();
		const commonUtils = new CommonUtils();

		const listName = `SmartList_${Date.now()}`;
		let exportedFileDetails;

		const { employeeName, employeeEmail, secondaryEmail } =
			generateRandomEmployeeNameAndEmail();

		await allure.step("Add a new employee manually", async () => {
			await peoplePage.navigateToSections("Employees");
			await empPage.addEmployeeManually(0, {
				name: employeeName,
				employeeEmail: employeeEmail,
				secondaryEmail: secondaryEmail,
				department: constants.department_sales,
			});

			await empPage.sendInviteAfterImportingSliderOn();
			await empPage.searchEmployees(employeeEmail, "Active");
			await empPage.verifyEmployeeName(employeeName);
		});

		await allure.step(
			"Navigate to Smart Lists and create new smart list",
			async () => {
				await smartListPage.addOrEditSmartList({
					conditionScope: "all",
					conditionProperty: "Department",
					conditionValue: constants.department_sales,
					smartListName: listName,
					isEdit: false,
				});
				await smartListPage.verifySmartListCreated(listName);
			},
		);

		await allure.step("Edit list and rename smart list", async () => {
			await smartListPage.addOrEditSmartList({
				conditionScope: "all",
				conditionProperty: "Secondary Email",
				conditionComparison: "is",
				conditionValue: secondaryEmail,
				smartListName: listName,
				isEdit: true,
			});
			await smartListPage.verifySmartListCreated(listName);
		});

		await allure.step("Export smart list as CSV", async () => {
			exportedFileDetails = await smartListPage.exportSmartList(listName);

			expect(
				exportedFileDetails.filePath,
				"Exported CSV file path should be returned",
			).toBeTruthy();

			expect(
				exportedFileDetails.extension,
				"Exported file should have CSV extension",
			).toBe("csv");
		});

		await allure.step(
			"Delete smart list and verify success toaster",
			async () => {
				await commonFunctions.navigateToPageUrl("People");
				await smartListPage.deleteSmartList(listName);
			},
		);

		await allure.step("Cleanup exported CSV file", async () => {
			await commonUtils.deleteFile(exportedFileDetails.filePath);
		});

		await allure.step("Deactivate the employee for cleanup", async () => {
			await peoplePage.navigateToSections("Employees");
			await empPage.searchEmployees(employeeEmail, "Active");
			await empPage.deactivateEmployee(employeeEmail);
		});
	});
});

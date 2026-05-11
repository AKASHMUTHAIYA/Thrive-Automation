import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

function getRandomElement(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
function generateRandomEmployeeProperty() {
	const department = ["HR"];
	const manager = [
		"Approver Automation",
		"Reportee Automation",
		"Subject Automation 1",
		"Evaluator Automation",
	];
	const jobtitle = [
		"Team Lead",
		"Product Manager",
		"Designer",
		"Product Developer",
		"Tester",
		"Product Brand Administrator",
		"Lead Security Executive",
		"District Design Executive",
		"Corporate Web Administrator",
		"Internal Assurance Coordinator",
		"Principal Creative Executive",
		"Investor Program Assistant",
		"Dynamic Brand Engineer",
		"National Accounts Administrator",
		"Lead Revenue Supervisor",
		"Dynamic Response Engineer",
		"International Creative Associate",
		"Legacy Branding Designer",
		"International Configuration Planner",
		"Senior Group Liaison",
		"Legacy Directives Designer",
		"Senior Accounts Producer",
		"International Functionality Associate",
	];

	const country = [
		"India",
		"United States",
		"United Kingdom",
		"Canada",
		"Australia",
	];
	const language = ["English", "Hindi", "Marathi", "Telugu", "Kannada"];
	const customDropdownValue = ["option1", "option2", "option3", "option4"];
	const genderOptions = ["Male", "Female", "Other"];
	const locationOptions = [
		"Chennai",
		"Mumbai",
		"Delhi",
		"Bangalore",
		"Hyderabad",
	];

	const departmentName = getRandomElement(department);
	const managerName = getRandomElement(manager);
	const jobtitleName = getRandomElement(jobtitle);
	const countryName = getRandomElement(country);
	const languageName = getRandomElement(language);
	const customDropdownValueName = getRandomElement(customDropdownValue);
	const gender = getRandomElement(genderOptions);
	const location = getRandomElement(locationOptions);
	const phoneNumber = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
	const customNumber = CommonUtils.generateRandomNumbersWithLength(4);
	const customEmail = CommonUtils.generateRandomEmail();
	const customSingleLineText = CommonUtils.generateRandomText(10);
	const customMultiLineText = CommonUtils.generateRandomText(10);
	const customUrl = `https://${CommonUtils.generateRandomText(10)}.com`;
	const dateOfJoining = CommonUtils.getRandomDateBetween(new Date());

	return {
		departmentName,
		managerName,
		jobtitleName,
		countryName,
		languageName,
		customDropdownValueName,
		gender,
		location,
		phoneNumber,
		customNumber,
		customEmail,
		customSingleLineText,
		customMultiLineText,
		customUrl,
	};
}
export { generateRandomEmployeeProperty };

/**
 * Generating a random survey template name from all the Survey Templates
 *
 * @param {Array} templateNames - All Survey Templates Names
 */
function generateRandomTemplate(templateNames) {
	const filteredTemplates = templateNames.filter(
		(template) =>
			!template.toLowerCase().includes("work") &&
			!template.toLowerCase().startsWith("hr") &&
			!template.toLowerCase().includes("onboarding"),
	);

	const templateName = getRandomElement(filteredTemplates);
	return templateName;
}
export { generateRandomTemplate };

//Function to generate random Question type
function generateRandomQuestionType() {
	const question = ["Rating Scale", "Text Input"];
	const questionType = getRandomElement(question);
	return questionType;
}
export { generateRandomQuestionType };

//Function to generate random Question type
function generateRandomQuestionTypeEngage() {
	const question = [
		"Rating Scale",
		"Text Input",
		"Yes/No",
		"eNPS",
		"MultiChoice",
	];
	const questionType = getRandomElement(question);
	return questionType;
}
export { generateRandomQuestionTypeEngage };

//function to generate random Evaluator Role
function generateRandomEvaluatorRole() {
	const roles = ["Peer", "Reportee", "Manager"];
	const role = getRandomElement(roles);
	return role;
}
export { generateRandomEvaluatorRole };

/**
 * Generates a random name from an array of available names.
 *
 * @param {Array} names - Array of names (e.g., surveys, sections, questions, Question Banks etc..).
 * @returns {string} Randomly selected name from the array.
 */
function generateRandomName(names) {
	const randomName = getRandomElement(names);
	return randomName;
}
export { generateRandomName };

/**
 * Generates a random smart list name from an array of available smart list names.
 *
 * @returns {string} Randomly selected smart list name from the array.
 */
function generateRandomSmartListName() {
	const smartListNames = ["Smart List 1", "Smart List 2", "Smart List 3"];
	const smartListName = getRandomElement(smartListNames);
	return smartListName;
}
export { generateRandomSmartListName };

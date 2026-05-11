import { test } from "../../../Fixtures/application-setup";
import { POManager } from "../../../Pages/POManager.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { kudosUserName } from "../../../Data/Resources/constants.js";

test.describe("Kudos Granting Tests", () => {
	let poManager;
	let KudosPage;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		KudosPage = poManager.getKudosPage();
	});

	test("Grant kudos to an employee with random points @Regression @temp", async () => {
		// Test data
		const kudosMessage = CommonUtils.generateRandomText(10);
		const pointValue = CommonUtils.getRandomIntInclusive(1, 3).toString();

		await KudosPage.navigateToKudos();
		await KudosPage.navigateToGettingStarted();
		await KudosPage.enterKudosPointsMentionAndMessage(
			kudosUserName[process.env.ENVIRONMENT],
			pointValue,
			kudosMessage,
		);
		await KudosPage.verifyKudosGrantSuccess(
			kudosUserName[process.env.ENVIRONMENT],
		);
		await KudosPage.closeSuccessDialog();
		await KudosPage.verifyKudosInFeed(kudosMessage);
	});
});

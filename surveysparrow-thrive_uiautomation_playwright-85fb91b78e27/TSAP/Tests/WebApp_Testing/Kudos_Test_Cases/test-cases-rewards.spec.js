import { test } from "../../../Fixtures/application-setup";
import { expect } from "@playwright/test";
import { POManager } from "../../../Pages/POManager.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

test.describe("Kudos Rewards Tests", () => {
	let poManager;
	let KudosPage;

	test.beforeEach(async ({ thrivePage }) => {
		poManager = new POManager(thrivePage);
		KudosPage = poManager.getKudosPage();
	});

	test("Create new reward and verify @Regression", async () => {
		// Test data
		const rewardName = CommonUtils.generateRandomText(5);
		const rewardPoints = CommonUtils.getRandomIntInclusive(1, 3);
		const rewardDescription = "This is a test automation reward description";

		// Navigate to Kudos and then to Rewards
		await KudosPage.navigateToKudos();
		await KudosPage.navigateToRewards();

		// Create new reward
		await KudosPage.createReward(rewardName, rewardPoints, rewardDescription);

		// Verify reward creation
		const isRewardCreated = await KudosPage.verifyRewardCreated(
			rewardName,
			rewardPoints,
		);
		expect(isRewardCreated).toBeTruthy();
		await KudosPage.deleteReward(rewardName);
	});
});

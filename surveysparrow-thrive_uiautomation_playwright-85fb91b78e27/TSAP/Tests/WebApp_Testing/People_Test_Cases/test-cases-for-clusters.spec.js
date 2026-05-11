import { allure } from "allure-playwright";
import { expect } from "playwright/test";
import { test } from "../../../Fixtures/application-setup.js";
import { POManager } from "../../../Pages/POManager.js";
import PwActions from "playwright-framework/Core/pw-actions.js";
import { constants } from "../../../Data/Resources/constants.js";

test.describe("Clusters & Groups - Create, Edit, Archive, and Member Management", () => {
	test("TC_01_Create_Cluster_Groups_Add_Members_Multiple_Heads_No_Head @regression @clusters @people @core ", async ({
		thrivePage,
	}) => {
		await allure.description(
			"TC_01: Create cluster and groups. TC_02: Add members to group. TC_05: Multiple group heads. TC_08: Group without head.",
		);

		const poManager = new POManager(thrivePage);
		const clustersPage = poManager.getClustersPage();
		const commonFunction = poManager.getCommonPageFunctions();
		const peoplePage = poManager.getPeoplePage();

		const timestamp = Date.now();
		const clusterName = `Division_${timestamp}`;
		const engineeringGroup = `Engineering_${timestamp}`;
		const salesGroup = `Sales_${timestamp}`;
		const multiHeadGroup = `MultiHead_Group_${timestamp}`;
		const noHeadGroup = `NoHead_Group_${timestamp}`;

		await allure.step("Navigate to Clusters page", async () => {
			await commonFunction.navigateTopNavigateSection("People");
			await peoplePage.navigateToSections("Clusters");
		});

		await allure.step("TC_01: Create a new cluster", async () => {
			await clustersPage.createCluster({
				clusterName: clusterName,
				groupHeadTitle: "Director",
			});

			const clusterExists = await clustersPage.verifyClusterExists(clusterName);
			expect(clusterExists, `Cluster ${clusterName} should be created`).toBe(
				true,
			);
		});

		await allure.step(
			"TC_01: Expand cluster and create Engineering group",
			async () => {
				await clustersPage.expandCluster(clusterName);
				await clustersPage.createGroup({
					groupName: engineeringGroup,
					groupHeads: [constants.subjectEmail6],
				});

				const groupExists =
					await clustersPage.verifyGroupExists(engineeringGroup);
				expect(groupExists, `Group ${engineeringGroup} should be created`).toBe(
					true,
				);

				const memberCount =
					await clustersPage.getGroupMemberCount(engineeringGroup);
				expect(memberCount, "Initial member count should be 0").toBe("0");
			},
		);

		await allure.step("TC_01: Create Sales group", async () => {
			await clustersPage.createGroup({
				groupName: salesGroup,
				groupHeads: [constants.subjectEmail6],
			});

			const groupExists = await clustersPage.verifyGroupExists(salesGroup);
			expect(groupExists, `Group ${salesGroup} should be created`).toBe(true);
		});

		await allure.step(
			"TC_02: Open Engineering group and add members",
			async () => {
				await clustersPage.openGroup(engineeringGroup);

				let activeCount = await clustersPage.getActiveMemberCount();
				expect(activeCount, "Initial active count should be 0").toBe("0");

				await clustersPage.addMembersToGroup([constants.managerEmail]);
				activeCount = await clustersPage.getActiveMemberCount();
				expect(
					activeCount,
					"Active count should be 1 after adding Jones Eagle",
				).toBe("1");

				const memberExists = await clustersPage.verifyMemberExists(
					constants.managerEmail,
				);
				expect(
					memberExists,
					"Manager New should be visible in members list",
				).toBe(true);
			},
		);

		await allure.step(
			"TC_02: Add more members including group head",
			async () => {
				await clustersPage.addMembersToGroup([
					constants.reportee_evaluator_email,
				]);
				let activeCount = await clustersPage.getActiveMemberCount();
				expect(activeCount, "Active count should be 2").toBe("2");

				await clustersPage.addMembersToGroup([
					constants.teamAnalyticEmployeeEmail,
				]);
				activeCount = await clustersPage.getActiveMemberCount();
				expect(
					activeCount,
					"Active count should be 3 after adding group head",
				).toBe("3");

				const teamAnalyticEmployeeExists =
					await clustersPage.verifyMemberExists(
						constants.teamAnalyticEmployeeEmail,
					);
				expect(
					teamAnalyticEmployeeExists,
					"Team Analytics should be visible in members list",
				).toBe(true);
			},
		);

		await allure.step(
			"TC_02: Navigate back and verify member count in cluster view",
			async () => {
				await clustersPage.navigateToClusters();
				await clustersPage.expandCluster(clusterName);

				const memberCount =
					await clustersPage.getGroupMemberCount(engineeringGroup);
				expect(memberCount, "Engineering group should show 3 members").toBe(
					"3",
				);
			},
		);

		await allure.step(
			"TC_05: Create group with multiple group heads",
			async () => {
				await clustersPage.createGroup({
					groupName: multiHeadGroup,
					groupHeads: [
						constants.subjectEmail6,
						constants.reportee_evaluator_email,
						constants.teamAnalyticEmployeeEmail,
					],
				});

				const groupExists =
					await clustersPage.verifyGroupExists(multiHeadGroup);
				expect(groupExists, `Group ${multiHeadGroup} should be created`).toBe(
					true,
				);

				const groupHeads = await clustersPage.getGroupHeadNames(multiHeadGroup);
				expect(
					groupHeads.includes(constants.subjectName6) &&
						groupHeads.includes("+"),
					"Multiple group heads should be displayed with +N indicator",
				).toBe(true);

				const memberCount =
					await clustersPage.getGroupMemberCount(multiHeadGroup);
				expect(
					memberCount,
					"Member count should be 0 (group heads not auto-added)",
				).toBe("0");
			},
		);

		await allure.step("TC_08: Create group without group head", async () => {
			await clustersPage.createGroup({
				groupName: noHeadGroup,
				groupHeads: [],
			});

			const groupExists = await clustersPage.verifyGroupExists(noHeadGroup);
			expect(
				groupExists,
				`Group ${noHeadGroup} should be created without head`,
			).toBe(true);

			const memberCount = await clustersPage.getGroupMemberCount(noHeadGroup);
			expect(memberCount, "Member count should be 0").toBe("0");
		});
	});

	test("TC_02_Edit_Cluster_Group_Validation @regression @clusters @people @core ", async ({
		thrivePage,
	}) => {
		await allure.description(
			"TC_04: Edit cluster name and group head title. TC_07: Validation for empty and duplicate names.",
		);

		const poManager = new POManager(thrivePage);
		const clustersPage = poManager.getClustersPage();
		const commonFunction = poManager.getCommonPageFunctions();
		const peoplePage = poManager.getPeoplePage();

		const timestamp = Date.now();
		const clusterName = `Division_${timestamp}`;
		const editedClusterName = `Division_Edited_${timestamp}`;
		const engineeringGroup = `Engineering_${timestamp}`;
		const editedGroupName = `Engineering_Edited_${timestamp}`;

		await allure.step(
			"Navigate to Clusters and create test cluster",
			async () => {
				await commonFunction.navigateTopNavigateSection("People");
				await peoplePage.navigateToSections("Clusters");

				await clustersPage.createCluster({
					clusterName: clusterName,
					groupHeadTitle: "Director",
				});
				await clustersPage.expandCluster(clusterName);
				await clustersPage.createGroup({
					groupName: engineeringGroup,
					groupHeads: [constants.subjectEmail6],
				});
			},
		);

		await allure.step(
			"TC_04: Edit cluster name and group head title",
			async () => {
				await clustersPage.editCluster(clusterName, {
					newClusterName: editedClusterName,
					newGroupHeadTitle: "VP",
				});

				const clusterExists =
					await clustersPage.verifyClusterExists(editedClusterName);
				expect(
					clusterExists,
					`Cluster should be renamed to ${editedClusterName}`,
				).toBe(true);

				const groupHeadTitle =
					await clustersPage.getClusterGroupHeadTitleValue(editedClusterName);
				expect(groupHeadTitle, "Group head title should be VP").toBe("VP");
			},
		);

		await allure.step("TC_04: Edit group name", async () => {
			//await clustersPage.expandCluster(editedClusterName);
			await clustersPage.editGroup(engineeringGroup, {
				newGroupName: editedGroupName,
			});

			const groupExists = await clustersPage.verifyGroupExists(editedGroupName);
			expect(groupExists, `Group should be renamed to ${editedGroupName}`).toBe(
				true,
			);
		});

		await allure.step("TC_04: Change group head", async () => {
			await clustersPage.editGroup(editedGroupName, {
				newGroupHeads: [constants.teamAnalyticEmployeeEmail],
			});

			const groupHeads = await clustersPage.getGroupHeadNames(editedGroupName);
			expect(
				groupHeads.includes(constants.teamAnalyticEmployeeName),
				"Group head should be Lucas Hawk",
			).toBe(true);
		});

		await allure.step(
			"TC_07: Validate empty cluster name is rejected",
			async () => {
				const validationFailed =
					await clustersPage.attemptCreateClusterWithValidation({
						clusterName: "",
						groupHeadTitle: "Test",
					});
				expect(validationFailed, "Empty cluster name should be rejected").toBe(
					true,
				);
			},
		);

		await allure.step(
			"TC_07: Validate duplicate cluster name is rejected",
			async () => {
				const validationFailed =
					await clustersPage.attemptCreateClusterWithValidation({
						clusterName: editedClusterName,
						groupHeadTitle: "Test",
					});
				expect(
					validationFailed,
					"Duplicate cluster name should be rejected",
				).toBe(true);
			},
		);

		await allure.step(
			"TC_07: Validate empty group name is rejected",
			async () => {
				const validationFailed =
					await clustersPage.attemptCreateGroupWithValidation({
						clusterName: editedClusterName,
						groupName: "",
					});
				expect(validationFailed, "Empty group name should be rejected").toBe(
					true,
				);
			},
		);
	});

	test("TC_03_Multi_Cluster_Membership_Archive_Unarchive @regression @clusters @people @core ", async ({
		thrivePage,
	}) => {
		await allure.description(
			"TC_03: Employee in multiple groups/clusters. TC_10: Archive group and cluster. TC_11: View archived and unarchive.",
		);

		const poManager = new POManager(thrivePage);
		const clustersPage = poManager.getClustersPage();
		const commonFunction = poManager.getCommonPageFunctions();
		const peoplePage = poManager.getPeoplePage();

		const timestamp = Date.now();
		const clusterName = `Division_${timestamp}`;
		const editedClusterName = `Division_Edited_${timestamp}`;
		const engineeringGroup = `Engineering_${timestamp}`;
		const salesGroup = `Sales_${timestamp}`;
		const multiHeadGroup = `MultiHead_Group_${timestamp}`;
		const noHeadGroup = `NoHead_Group_${timestamp}`;

		await allure.step(
			"Setup: Create cluster with multiple groups",
			async () => {
				await commonFunction.navigateTopNavigateSection("People");
				await peoplePage.navigateToSections("Clusters");

				await clustersPage.createCluster({
					clusterName: clusterName,
					groupHeadTitle: "Director",
				});
				await clustersPage.expandCluster(clusterName);

				await clustersPage.createGroup({
					groupName: engineeringGroup,
					groupHeads: [constants.teamAnalyticEmployeeEmail],
				});
				await clustersPage.createGroup({
					groupName: salesGroup,
					groupHeads: [constants.subjectEmail6],
				});
				await clustersPage.createGroup({
					groupName: multiHeadGroup,
					groupHeads: [
						constants.subjectEmail6,
						constants.reportee_evaluator_email,
					],
				});
				await clustersPage.createGroup({
					groupName: noHeadGroup,
					groupHeads: [],
				});
			},
		);

		await allure.step("Setup: Add members to Engineering group", async () => {
			await clustersPage.openGroup(engineeringGroup);
			await clustersPage.addMembersToGroup([
				constants.managerEmail,
				constants.reportee_evaluator_email,
				constants.teamAnalyticEmployeeEmail,
			]);
			await clustersPage.navigateToClusters();
		});

		await allure.step("Setup: Edit cluster name", async () => {
			await clustersPage.editCluster(clusterName, {
				newClusterName: editedClusterName,
				newGroupHeadTitle: "VP",
			});
		});

		await allure.step(
			"TC_03: Add Lucas Hawk to Sales group (same cluster, different group)",
			async () => {
				await clustersPage.expandCluster(editedClusterName);
				await clustersPage.openGroup(salesGroup);
				await clustersPage.addMembersToGroup([
					constants.teamAnalyticEmployeeEmail,
				]);

				const memberExists = await clustersPage.verifyMemberExists(
					constants.teamAnalyticEmployeeEmail,
				);
				expect(memberExists, "Team Analytics should be in Sales group").toBe(
					true,
				);
				await clustersPage.navigateToClusters();
			},
		);

		await allure.step(
			"TC_03: Verify employee profile shows all cluster memberships",
			async () => {
				await commonFunction.navigateTopNavigateSection("People");
				await peoplePage.navigateToSections("Employees");
				await commonFunction.search(constants.teamAnalyticEmployeeEmail);
				await clustersPage.openEmployeeProfile(
					constants.teamAnalyticEmployeeEmail,
				);
				await clustersPage.clickClustersAndGroupsTab();

				const divisionGroups =
					await clustersPage.getEmployeeClusterGroups(editedClusterName);
				expect(
					divisionGroups.includes(salesGroup) ||
						divisionGroups.includes(engineeringGroup),
					"Lucas Hawk should be in Division cluster groups",
				).toBe(true);
			},
		);

		await allure.step("TC_10: Archive Engineering group", async () => {
			await clustersPage.closeEmployeeInfoPanel();
			await peoplePage.navigateToSections("Clusters");
			await clustersPage.expandCluster(editedClusterName);
			await clustersPage.archiveItem(engineeringGroup, "group");

			const groupExists =
				await clustersPage.verifyGroupExists(engineeringGroup);
			expect(
				groupExists,
				"Engineering group should be archived (not visible)",
			).toBe(false);
		});

		await allure.step(
			"TC_10: Verify members not deleted after archiving group",
			async () => {
				await commonFunction.navigateTopNavigateSection("People");
				await peoplePage.navigateToSections("Employees");
				await commonFunction.search(constants.teamAnalyticEmployeeName);

				const employeeExists = await clustersPage.verifyEmployeeInList(
					constants.teamAnalyticEmployeeName,
				);
				expect(
					employeeExists,
					"Lucas Hawk should still exist as employee",
				).toBe(true);
			},
		);

		await allure.step("TC_10: Archive entire cluster", async () => {
			await clustersPage.navigateToClusters();
			await clustersPage.archiveItem(editedClusterName, "cluster");

			const clusterExists =
				await clustersPage.verifyClusterExists(editedClusterName);
			expect(clusterExists, "Cluster should be archived (not visible)").toBe(
				false,
			);
		});

		await allure.step(
			"TC_11: Open archived view and verify cluster is there",
			async () => {
				await clustersPage.openArchivedView();

				const isArchivedView = await clustersPage.verifyArchivedViewActive();
				expect(isArchivedView, "Should be in archived view").toBe(true);

				const clusterExists =
					await clustersPage.verifyClusterExists(editedClusterName);
				expect(clusterExists, "Archived cluster should be visible").toBe(true);
			},
		);

		await allure.step(
			"TC_11: Expand archived cluster and verify groups",
			async () => {
				await clustersPage.expandCluster(editedClusterName);

				const salesExists = await clustersPage.verifyGroupExists(salesGroup);
				expect(salesExists, "Sales group should be in archived cluster").toBe(
					true,
				);

				const multiHeadExists =
					await clustersPage.verifyGroupExists(multiHeadGroup);
				expect(
					multiHeadExists,
					"MultiHead group should be in archived cluster",
				).toBe(true);

				const noHeadExists = await clustersPage.verifyGroupExists(noHeadGroup);
				expect(noHeadExists, "NoHead group should be in archived cluster").toBe(
					true,
				);

				const engineeringExists =
					await clustersPage.verifyGroupExists(engineeringGroup);
				expect(
					engineeringExists,
					"Engineering group should be in archived cluster",
				).toBe(true);
			},
		);

		await allure.step("TC_11: Unarchive cluster", async () => {
			await clustersPage.unarchiveCluster(editedClusterName);

			const clusterStillInArchive =
				await clustersPage.verifyClusterExists(editedClusterName);
			expect(
				clusterStillInArchive,
				"Cluster should no longer be in archived view",
			).toBe(false);
		});

		await allure.step(
			"TC_11: Return to active view and verify cluster restored",
			async () => {
				await clustersPage.returnToActiveView();

				const clusterExists =
					await clustersPage.verifyClusterExists(editedClusterName);
				expect(clusterExists, "Cluster should be restored to active view").toBe(
					true,
				);

				await clustersPage.expandCluster(editedClusterName);

				const salesExists = await clustersPage.verifyGroupExists(salesGroup);
				expect(salesExists, "Sales group should be restored").toBe(true);

				const multiHeadExists =
					await clustersPage.verifyGroupExists(multiHeadGroup);
				expect(multiHeadExists, "MultiHead group should be restored").toBe(
					true,
				);
			},
		);
	});
});

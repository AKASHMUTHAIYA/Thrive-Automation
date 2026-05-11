import { test } from "@playwright/test";
import { testdata } from "../../Data/login-data.js";
//import PwActions from "playwright-framework/Core/pw-actions.js";

// test.describe("Smoke Suite", () => {
//   test("TC_01 Login User with correct email and password", async ({ page }) => {
//     const poManager = new POManager(page);
//     const loginpage = poManager.getLoginPage();
//     await loginpage.navigateToUrl(testdata.url);
//     await loginpage.validateLogin(testdata.username, testdata.password);
//     await loginpage.navigateToAdminTabs("people");
//   });

//   test("TC_02 Logout", async ({ page }) => {
//     const poManager = new POManager(page);
//     const loginpage = poManager.getLoginPage();
//     await loginpage.navigateToUrl(testdata.url);
//     await loginpage.validateLogin(testdata.username, testdata.password);
//     await loginpage.logOut();
//   });
// });

# Test Rules

## thrivePage Fixture

The `thrivePage` fixture from `TSAP/Fixtures/application-setup.js` provides auto-login before each test, auto-logout after, network monitoring (HTTP 4xx/5xx), failed test tracking, and screenshot/trace on failure.

**`thrivePage` IS the Playwright `page` object.** Pass it directly to POManager.

```javascript
import { test } from "../../Fixtures/application-setup.js";
import { POManager } from "../../Pages/POManager.js";

test("TC_01_Verify survey creation works @Regression", async ({ thrivePage }) => {
  const poManager = new POManager(thrivePage);
  const surveyPage = poManager.getSurveyPage();
  await surveyPage.createSurvey(`Survey_${Date.now()}`);
});
```

For tests without authentication, use `import { test as baseTest } from "@playwright/test"`.

---

## Standard Test Template

```javascript
import { test } from "../../Fixtures/application-setup.js";
import { POManager } from "../../Pages/POManager.js";
import { allure } from "allure-playwright";

test("TC_01_Verify admin can create and launch a pulse survey @Regression", async ({ thrivePage }) => {
  const poManager = new POManager(thrivePage);
  const surveyPage = poManager.getSurveyPage();
  const surveyName = `Pulse_Survey_${Date.now()}`;

  await allure.step("Step 1: Create pulse survey", async () => {
    await surveyPage.navigateToSurveys();
    await surveyPage.createSurvey(surveyName, "Pulse");
  });

  await allure.step("Step 2: Verify creation", async () => {
    await expect(
      thrivePage.locator(`//h1[text()='${surveyName}']`),
      `Survey "${surveyName}" should be visible after creation`
    ).toBeVisible();
  });
});
```

---

## Test Naming Convention

Format: `TC_[Number]_Verify [human-readable sentence] @Tag1 @Tag2`

```javascript
// GOOD — descriptive sentence
test("TC_01_Verify admin can initiate a conversation from a pulse survey text response @Regression", ...);
test("TC_02_Verify non-anonymous engage survey shows participant names in Responses tab @Regression", ...);

// BAD — underscore-joined tokens, no "Verify"
test("Test_2_1_Create_Survey @Regression", ...);
test("TC_01_Admin_Initiates_Conversation @Regression", ...);
```

Rules: start with `TC_XX_`, follow with "Verify", natural words (not underscores), include who/what/outcome.

---

## Assertions with Descriptive Messages

```javascript
// GOOD
await expect(result, "User should be logged in after valid credentials").toBe(true);

// BAD — no context on failure
await expect(result).toBe(true);
```

---

## Allure Step Reporting

Wrap every logical action group in `allure.step()`. Use descriptive names.

```javascript
import { allure } from "allure-playwright";

await allure.step("Create survey with 5 questions", async () => { /* ... */ });
await allure.step("Verify employee appears in directory", async () => { /* ... */ });

// BAD: allure.step("Step 1", ...) or allure.step("Click button", ...)
```

Attach data for debugging:
```javascript
allure.attachment("Survey Config", JSON.stringify(data, null, 2), "application/json");
```

---

## Test Data Isolation

**CRITICAL: Always generate unique data — tests run in parallel.**

```javascript
import { faker } from "@faker-js/faker";

// GOOD: unique per execution
const surveyName = `Survey_${Date.now()}`;
const email = `test_${Date.now()}_${faker.string.alphanumeric(4)}@example.com`;

// BAD: hardcoded — causes collisions
const surveyName = "Test Survey";
```

### Constants vs Dynamic Data

| Use For | Source |
|---|---|
| Static values (error messages, email subjects) | `import { constants } from "../../Data/Resources/constants.js"` |
| Environment-specific (URLs, creds) | `import { envDetails } from "../../Data/test-data.js"` |
| Test entities (names, emails) | `Date.now()` + faker |

---

## EntityIds for State Sharing

Share data between test steps or page objects:

```javascript
import { EntityIds } from "../../Shared_Functions/entityId.js";

EntityIds.setsurveyId(surveyId);    // set
const id = EntityIds.getsurveyId(); // get
EntityIds.setCookie(await thrivePage.context().cookies());
```

---

## Test Lifecycle Hooks

```javascript
test.describe("Employee Management", () => {
  test.beforeEach(async ({ thrivePage }) => {
    const poManager = new POManager(thrivePage);
    await poManager.getPeoplePage().navigateToPeople();
  });

  test("TC_01_Verify employee creation @Regression", async ({ thrivePage }) => { /* ... */ });
});
```

---

## Multi-Tab / File / Visual Patterns

```javascript
// Multi-tab: open new tab, interact, close
const newTab = await PwActions.openNewTab(browser);
await PwActions.goTo(newTab, surveyUrl);
await PwActions.closeTab(newTab);

// Upload: use CommonUtils.getDataDirectory() for path
await PwActions.uploadFile(page, locator, `${CommonUtils.getDataDirectory()}/Files/sample.csv`);

// Visual testing: ALWAYS use this — NEVER expect(page).toHaveScreenshot()
await PwActions.visualTestComparison(thrivePage, "dashboard.png", [maskedElements]);
```

---

## Test Consolidation Rule

**Always club steps that can run in the same browser session into a single test case.**

If a scenario can be completed without switching users or starting a new browser session, it **must** be written as one test. Splitting it into multiple tests only to make each one shorter is an anti-pattern — it inflates execution time and makes `EntityIds` state-sharing fragile.

```javascript
// GOOD — one test, sequential steps, single session
test("TC_01_Verify admin can initiate conversation add participants and remove participant @Regression", async ({ thrivePage }) => {
  await allure.step("Step 1 — Create survey and attend", async () => { /* ... */ });
  await allure.step("Step 2 — Initiate conversation and add participants", async () => { /* ... */ });
  await allure.step("Step 3 — Remove participant and verify", async () => { /* ... */ });
});

// BAD — three separate tests that chain state via EntityIds
test("TC_01_Verify survey is created @Regression", async () => { /* ... */ });
test("TC_02_Verify conversation is initiated @Regression", async () => { /* ... */ }); // depends on TC_01 state
test("TC_03_Verify participant removed @Regression", async () => { /* ... */ });        // depends on TC_02 state
```

**When to use multiple tests (acceptable):**
- Steps require logging in as a different user mid-flow AND that login cannot be avoided
- The two scenarios test independent features that have no shared setup state
- A `beforeEach` hook can fully set up the state each test needs independently

**When clubbing is mandatory:**
- All steps run as the same admin/user
- Steps share a single survey, conversation, or entity created earlier in the same flow
- The combined test takes less than the Playwright default timeout (30 s per step)

---

## Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| `import { test } from "@playwright/test"` | Use `import { test } from "../../Fixtures/application-setup.js"` |
| `new SurveyPage(thrivePage)` | Use `poManager.getSurveyPage()` |
| `expect(result).toBe(true)` (no message) | Add descriptive failure message |
| Hardcoded entity names | Use `Date.now()` or faker |
| No Allure steps | Wrap logical groups in `allure.step()` |
| `expect(page).toHaveScreenshot()` | Use `PwActions.visualTestComparison()` |
| Splitting one flow into multiple chained tests | Club into a single test with nested `allure.step()` |
| Writing a test without reading same-module examples first | Always complete Phase 0 before coding |
| Handing off a test without running it | Always run with `npx cross-env ENV=qa npx playwright test … --headed` |

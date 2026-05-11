# Fixtures — Test Setup and Teardown

The `application-setup.js` fixture provides the `thrivePage` object used by all tests.

## thrivePage Fixture

`thrivePage` IS the Playwright `page` object with automatic setup/teardown:

| Phase | What Happens |
|---|---|
| **Before each test** | Auto-login (standard or trial account based on `[trial]` in test name) |
| **During test** | Network monitoring — tracks HTTP 4xx/5xx errors and failed requests |
| **On failure** | Captures screenshot, video, trace file, console errors, network failures |
| **After each test** | Auto-logout, saves failures to `failed_tests.json` |

### Usage

```javascript
import { test } from "../../Fixtures/application-setup.js";

test("TC_01_Verify feature works @Regression", async ({ thrivePage }) => {
  // thrivePage is already logged in — use it directly
  const poManager = new POManager(thrivePage);
});
```

### Trial Account Tests

Add `[trial]` anywhere in the test name — the fixture auto-detects it and logs in with trial credentials:

```javascript
test("TC_01_Verify trial account limitations [trial] @Regression", async ({ thrivePage }) => {
  // Logged in as trial user
});
```

### Tests Without Authentication

```javascript
import { test as baseTest } from "@playwright/test";

baseTest("TC_01_Verify public page", async ({ page }) => {
  // No auto-login, raw Playwright page
});
```

## Failed Test Tracking

Failures are saved to `TSAP/Fixtures/failed_tests.json` with test ID, title, fail count, URL, network failures, and timestamp.

```bash
npm run rerun-last-failed-test    # Rerun only failed tests with --retries=3
```

## Network Monitoring

The fixture auto-monitors HTTP errors (4xx/5xx) and failed requests during each test. Expected errors (e.g., `ERR_ABORTED` during navigation, `/api/current-session` 403 before login) are filtered out.

## Failure Artifacts

On test failure, the framework captures:
- **Screenshot** — visual state at failure point
- **Video** — full test execution recording
- **Trace** — Playwright trace file (view at https://trace.playwright.dev/)
- **Logger output** — Winston logs from PwActions
- **Network failures** — HTTP 4xx/5xx errors during the test

Artifacts are saved to `test-results/<test-name>/`.

## Folder Structure

```
Fixtures/
├── application-setup.js      # thrivePage fixture definition
├── failed_tests.json         # Auto-updated failed test tracker
└── failed_tests.backup.json  # Backup of previous failures
```

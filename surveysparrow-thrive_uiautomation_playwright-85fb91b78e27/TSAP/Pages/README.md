# Pages — Page Object Model

All page objects live here, organized by application module. Every UI interaction is encapsulated in a page object and accessed through **POManager**.

## Folder Structure

```
Pages/
├── POManager.js              # Central registry — ALWAYS use this to get page objects
├── login-page.js             # Login, logout, module navigation, employee switching
├── dashboard-page.js         # Dashboard page
├── Accounts/                 # Portal branding, billing, authentication settings
├── ActionPlans/              # Action plan management
├── Actionables/              # Actionable items
├── Engage/                   # Pulse/eNPS survey pages
│   ├── Engage_Configure/     # Survey configuration (anonymity, settings)
│   ├── Engage_Distribution/  # Participant management, distribution
│   └── Engage_Reports/       # Report pages (overview, heatmap, responses)
├── Goals/                    # OKR creation, cycles, tracking
├── Kudos/                    # Awards, recognition, points
├── OneOnOne/                 # 1:1 check-ins, agenda, action items
├── People/                   # Employee directory, departments, profiles
├── Performance/              # 360-degree feedback
│   ├── Approver_View/        # Report approval workflow
│   ├── Performance_Configure/# Survey setup, scales, roles
│   ├── Performance_Participants/ # Participant management
│   ├── Performance_Reports/  # Heatmap, responses, PDF export
│   └── Team_Analytics/       # Team-level analytics
└── Surveys/                  # Shared survey components
    ├── Attend_Survey/        # Survey attendance (EUI)
    ├── Launch/               # Survey launch flow
    ├── Participants_Distribution/ # Participant distribution
    ├── Survey_Builder/       # Question builder
    └── Survey_Listing_Page/  # Survey list and actions
```

## POManager — Single Entry Point

**ALWAYS** use `POManager` to get page objects. **NEVER** instantiate page classes directly.

Constructor accepts `page` (required) and `request` (optional, for API-based helpers):

```javascript
import { POManager } from "../../Pages/POManager.js";
const poManager = new POManager(thrivePage);          // standard usage
const poManager = new POManager(thrivePage, request);  // when API request context is needed
const surveyPage = poManager.getSurveyPage();

// NEVER: const surveyPage = new SurveyPage(thrivePage);
```

## Page Object Template

```javascript
import PwActions from "playwright-framework/Core/pw-actions.js";
import { expect } from "@playwright/test";
import { envDetails } from "../../Data/test-data.js";

export class FeaturePage {
  constructor(page) {
    this.page = page;

    // Static locators (see locator-rules.md for naming/strategy)
    this.btnCreate = "[data-testid='create-btn']";
    this.txtBoxName = "//input[@name='featureName']";

    // Dynamic locators — arrow functions, MUST call with parentheses
    this.btnAction = (name) =>
      `//p[text()='${name}']/ancestor::tr//button[@data-testid='actions-btn']`;
  }

  /** @returns {Promise<void>} @example await featurePage.navigateToFeature(); */
  async navigateToFeature() {
    await PwActions.goTo(this.page, `${envDetails.url}/feature-path`);
    await PwActions.waitForNetworkIdle(this.page, 15000);
  }

  /** @returns {Promise<void>} @example await featurePage.createItem("My Item"); */
  async createItem(name) {
    await PwActions.click(this.page, this.btnCreate);
    await PwActions.fill(this.page, this.txtBoxName, name);
  }
}
```

## Method Patterns

| Type | Purpose | Example Signature |
|---|---|---|
| Navigation | Move to page/tab/section | `async navigateToSurveys()` |
| Atomic | Single UI interaction | `async clickCreateButton()` |
| Compound | Multi-step workflow | `async createAndLaunchSurvey({ name, type })` |
| Verification | Assert state | `async verifySurveyCreated(name)` |
| Getter | Return a value, no side effects | `async getSurveyIdFromUrl()` |

## Adding a New Page Object

1. **Create class** in `TSAP/Pages/{Module}/feature-page.js` using the template above
2. **Register in POManager** — add import + getter method in `POManager.js`
3. **Use in tests** — `const page = poManager.getFeaturePage()`

## Browser MCP for Locator Generation (MANDATORY)

**NEVER write new locators or page objects without first inspecting the live app via Playwright MCP.** This is a hard blocker — not a suggestion. If you skip this step, every locator you write is unverified and likely wrong.

**Required steps before writing ANY new locator:**

1. `browser_navigate(url)` → `browser_wait_for(time: 2)` → `browser_snapshot()`
2. Extract `data-testid`, `role`, `aria-label`, text from the snapshot
3. Translate to durable XPath/CSS using priority strategy in `locator-rules.md`
4. Click through the full flow, re-snapshot after each state change
5. **Never** copy raw `[ref=…]` values into page objects — they are session-scoped
6. **Never** write pipe-separated (`|`) fallback locators — each must be a single verified selector

**If the app is unreachable**, STOP and ask the user for credentials or a working URL. Do NOT guess locators.

## Figma for Locator Hints

When a Figma URL is provided, use `user-twigs-ai-mcp`:
1. `get_figma_screenshot(figmaUrl)` for visual overview
2. `get_figma_json(fileKey, nodeId)` for component hierarchy
3. Map Figma element names to locators using priority strategy in `locator-rules.md`
4. Always verify against the live app — Figma may differ from implementation

## Related Files

- `locator-rules.md` — Locator priority P1-P6.1, naming prefixes, anti-patterns
- `function-rules.md` — Function naming, options objects, JSDoc, anti-patterns
- `pwactions-reference.md` — PwActions API methods (click, input, wait, query, navigation)

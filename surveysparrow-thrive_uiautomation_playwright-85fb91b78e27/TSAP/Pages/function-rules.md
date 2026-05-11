# Function Rules

## Naming — Verb Prefix + camelCase

| Prefix | Purpose | Example |
|---|---|---|
| `navigate*` | Move to page/tab/section | `navigateToKudos`, `navigateToSideBarMenu` |
| `create*` | Create a new entity | `createAward`, `createSurvey` |
| `add*` | Add item inside existing entity | `addSection`, `addParticipantsInSurvey` |
| `configure*` | Apply configuration settings | `configureSettingsCheckReports360` |
| `verify*` | Assert / validate state | `verifyAwardCreated`, `verifyParticipantInConversation` |
| `get*` | Return a value — no side effects | `getSurveyIdFromUrl`, `getSectionsNames` |
| `edit*` / `delete*` | Modify or remove entity | `editSectionEngage`, `deleteReward` |
| `open*` / `download*` | Open dialog or trigger download | `openSurveyPreview`, `downloadOverviewReport` |
| `enable*` / `disable*` | Toggle feature on/off | `enableOrDisableAwardConfiguration` |
| `launch*` | Launch survey or workflow | `launchSurvey`, `confirmEngageSurveyLaunch` |
| `attend*` | Attend / submit survey | `attendEngagePulseSurvey` |
| `click*` | Simple named click | `clickNewReward`, `clickSubmit` |

Name should read as a sentence: `verifyParticipantRemovedInActivity`.

---

## Options Object — Never Positional Args for 2+ Parameters

```javascript
// BAD: positional — order-dependent, all mandatory
async createAward(awardName, description, points, givers, approverConfig) {}

// GOOD: options object — readable, flexible, defaults
async createAward({
    awardName,
    description = "",
    points = 0,
    approverConfig = null,
} = {}) {
    if (description) await PwActions.fill(this.page, this.txtBoxDescription, description);
    if (approverConfig) await this.configureApprover(approverConfig);
}
```

Single-parameter functions may use a plain argument: `async navigateToTabs(tabName) {}`

---

## Defaults and Guards

Every optional field must have a default. Check before acting:

```javascript
async configureSettings({ SelfEvaluation, ChooseEvaluators } = {}) {
    if (SelfEvaluation !== undefined)
        await PwActions.toggleCheckBox(this.page, SelfEvaluation, this.chkBoxSelfEvaluation);
}
```

Destructure at the signature — never `options.field` inline.

---

## JSDoc — Required on All Functions

Every function must have: **description**, **`@param`**, **`@returns`**, **`@example`**.

```javascript
/**
 * Creates a new award with the specified configuration.
 * Only passed fields are applied — undefined fields are skipped.
 *
 * @param {object}   options
 * @param {string}   options.awardName        - Award name (required)
 * @param {string}   [options.description=""] - Award description
 * @param {number}   [options.points=0]       - Points value
 * @returns {Promise<void>}
 *
 * @example
 * await awardsPage.createAward({ awardName: "Star Award", points: 150 });
 */
```

---

## Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| `async fn(a, b, c, d, e)` — positional | `async fn({ a, b = "", c = 0 } = {})` |
| `options.field` accessed inline | Destructure in signature |
| No JSDoc or missing `@example` | Add all four parts |
| `await this.page.click(…)` directly | Use `await PwActions.click(this.page, …)` |
| New function for a minor variant | Add optional field to existing function |
| Verb-less name: `surveyCreation()` | Use verb prefix: `createSurvey()` |
| `await page.waitForTimeout(5000)` | Use `PwActions.waitForNetworkIdle(page, 5000)` |

---

## Pre-Commit Checklist

- [ ] Searched for existing function in current file → feature folder → `common-functions.js`?
- [ ] Name follows verb prefix convention?
- [ ] 2+ params → options object with defaults?
- [ ] Optional fields guarded (`if (field !== undefined)`)?
- [ ] JSDoc with description, `@param`, `@returns`, `@example`?
- [ ] All interactions use `PwActions` — no raw Playwright? (See `pwactions-reference.md` for API)

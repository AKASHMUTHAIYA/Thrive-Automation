# Locator Rules

## Priority Strategy — Use the Highest Available

```
P1. data-testid    → [data-testid='submit-btn']
P2. ARIA role/label → //button[@aria-label='Submit']
P3. Label-based    → //label[text()='Email']/following-sibling::input
P4. Text-based     → //button[text()='Submit']
P5. CSS attributes → //input[@name='surveyName']
P6. Relational XPath → //p[text()='Name']/ancestor::tr//td[last()]//button
P6.1 SVG/Icon     → //*[name()='svg']/*[name()='path' and @d='...']/ancestor::button
```

### P1 — `data-testid` (always check first)

```javascript
this.btnSubmit  = `[data-testid="submit-btn"]`;
this.btnDelete  = (name) => `//p[text()="${name}"]/ancestor::td/following-sibling::td//button[@data-testid="delete-btn"]`;
```

Value must be **unique and semantic**. Never use layout suffixes (`_flex`, `_box`, `_grid`). Never use `contains()` on testid.

### P2 — Role-Based / ARIA

```javascript
this.menuItemCSV  = `//div[@role="menuitem"]//p[text()="CSV"]`;
this.btnSubmit    = `//button[@aria-label="Submit survey"]`;
```

### P3 — Label-Based

```javascript
this.txtForProp = (label) => `//label[text()="${label}"]/following-sibling::input`;
```

### P4 — Text-Based (brittle to copy changes)

```javascript
this.btnCreateNew = `//span[text()="Create new"]`;
```

Prefer `text()` (exact) over `contains(text(), …)`. Use the most specific HTML tag.

### P5 — CSS Attributes (`id`, `name`, `placeholder` — never hash classes)

```javascript
this.txtBoxSurvey = `//input[@name="surveyName"]`;
```

### P6 — Relational XPath

```javascript
this.btnSurveyAction = (name) => `//p[text()="${name}"]/ancestor::tr//td[last()]//button`;
```

Use `[last()]` not `[6]`. Prefer `following-sibling::` over `following::`. Prefer `parent::` over `ancestor::div[5]`.

### P6.1 — SVG / Icon

```javascript
this.icnClose = `//*[name()='svg']/*[name()='path' and @d='M16 22.6667V4']/ancestor::button`;
```

Use `name()='svg'` for namespace. Traverse to clickable ancestor.

---

## Naming Prefix Table

| Prefix | Element | Example |
|---|---|---|
| `btn` | Button | `btnSubmit`, `btnCreateSurvey` |
| `lnk` | Link / Anchor | `lnkHomePage`, `lnkLogout` |
| `txtBox` | Text input | `txtBoxEmail`, `txtBoxSurveyName` |
| `drpdwn` | Dropdown / Select | `drpdwnCountry`, `drpdwnType` |
| `lbl` | Label / Text | `lblUserName`, `lblStatus` |
| `chkBox` | Checkbox | `chkBoxAgree`, `chkBoxSelectAll` |
| `icn` | Icon (SVG) | `icnClose`, `icnEdit` |
| `tab` | Tab | `tabOverview`, `tabResponses` |
| `menu` | Menu item | `menuItemCSV`, `menuExport` |
| `card` | Card | `cardSurvey`, `cardEngagement` |
| `dialog` | Modal / Dialog | `dialogConfirm` |
| `toast` | Notification | `toastSuccess`, `toastError` |
| `img` | Image | `imgLogo`, `imgAvatar` |
| `table` / `row` / `cell` | Table elements | `tableResults`, `rowEmployee` |
| `container` | Generic div | `containerResults` |
| `hvr` | Hover trigger | `hvrTooltip` |

All names: **camelCase after prefix** — `btnSubmit` not `btn_submit`.

---

## Dynamic Locators

Arrow functions in the constructor. **Always invoke with `()` at call site.**

```javascript
constructor(page) {
  this.btnAction = (surveyName) =>
    `//p[text()='${surveyName}']/ancestor::tr//button[@data-testid='actions-btn']`;
}

// CORRECT: await PwActions.click(this.page, this.btnAction("My Survey"));
// WRONG:   await PwActions.click(this.page, this.btnAction); ← passes reference, not value
```

---

## XPath Best Practices

- Exact text: `//button[text()='Submit']` (preferred over `contains`)
- Normalize spaces: `//button[normalize-space()='Submit']`
- Multiple conditions: `//input[@type='email' and @name='username']`
- Scoped search: `//div[@data-testid='survey-card']//button[text()='Edit']`
- Last-cell: `//p[text()='Name']/ancestor::tr//td[last()]//button`

---

## Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| Positional index `(//input)[1]` | Anchor with parent `data-testid` |
| Absolute DOM path `//*[@id="root"]/div[3]/nav/div[1]` | Use testid or role |
| Hash class names `twigs-c-PJLV-ifDduug-css` | Use testid or role |
| Layout testid suffix `survey-card_flex` | Semantic only: `survey-card` |
| `contains()` on testid | Exact match or parent testid |
| Deep ancestor index `ancestor::div[5]` | Anchor closer with testid or `parent::` |
| Inline locator in spec file | Define in page object constructor |
| Volatile text `Created 3 minutes ago` | Anchor on stable structure |

---

## Browser Verification (MANDATORY)

**NEVER write new locators without first inspecting the live app via Playwright MCP.**

This is a hard gate — not optional. Placeholder locators with fallback pipes (`|`) or guessed selectors are a rule violation.

**Required workflow before ANY new locator is written:**
1. `browser_navigate(url)` to the relevant page
2. `browser_wait_for(time: 2)` → `browser_snapshot()` to capture the DOM
3. Extract `data-testid`, `role`, `aria-label`, text content from the snapshot
4. Translate to durable XPath/CSS using the priority strategy (P1–P6.1)
5. Click through the flow, re-snapshot after each state change
6. Repeat for every distinct UI state the locator must handle

**If the app is unreachable** (credentials missing, environment down), STOP and ask the user — do NOT invent locators.

```javascript
// GOOD — locator verified via browser_snapshot()
this.btnStartConversation = "[data-testid='start-conversation-btn']";

// BAD — guessed with pipe fallbacks, never verified
this.btnStartConversation = "//span[text()='Start Conversation'] | //button[contains(@data-testid, 'start-conversation')]";
```

---

## Pre-Commit Checklist

- [ ] **Every new locator verified against live app via `browser_snapshot()`?** (MANDATORY — no exceptions)
- [ ] Checked for existing locator in current file, `common-functions.js`, related page objects?
- [ ] Correct prefix used? (see table above)
- [ ] Highest available priority strategy used (P1 → P6.1)?
- [ ] No positional indices, hash classes, layout testid suffixes, or absolute DOM paths?
- [ ] Dynamic locator invoked with `()` at every call site?
- [ ] Locator defined in page object constructor — not inline in spec?
- [ ] No pipe (`|`) fallback locators — each locator must be a single verified selector?

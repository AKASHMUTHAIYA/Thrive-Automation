# Tests — Spec Files

All E2E test specs live under `WebApp_Testing/`, organized by application module.

## Folder Structure

```
Tests/
├── test-rules.md                     # Coding rules for test specs — READ FIRST
├── WebApp_Testing/
│   ├── 360_Test_Cases/               # Performance/360 feedback tests
│   ├── 1:1_Test_Cases/               # OneOnOne check-in tests
│   ├── Action_Plans_Cases/           # Action plan tests
│   ├── Actionables/                  # Actionable items tests
│   ├── Core_Test_Cases/              # Login, core platform tests
│   ├── Engage_Test_Cases/            # Pulse/eNPS survey tests + reports
│   ├── Goals_Test_Cases/             # OKR and goal cycle tests
│   ├── Kudos_Test_Cases/             # Awards and recognition tests
│   ├── People_Test_Cases/            # Employee directory tests
│   └── Survey_List_Test_Cases/       # Survey listing tests
└── Visual_Testing/                   # Visual regression tests
```

Each module folder has a `README.md` with product context and common test patterns.

---

## Test Generation Workflow

Follow this when asked to "write a test", "automate this ticket", or "create a test case".

### Phase 0: Pre-Development Analysis (MANDATORY — HARD GATE)

**DO NOT write a single line of test code until all four steps below are done.**

1. **Identify the target module** (Engage, Performance, Goals, People, etc.)
2. **Read existing spec files from THAT SAME MODULE** — do this in two passes:
   - **Pass 1 — Inventory**: List every spec file in the module folder. Read the module `README.md` to understand all features and page objects available.
   - **Pass 2 — Deep read**: Read the spec file(s) that are closest in feature/flow to what you are writing. If a spec covering the same page object or workflow exists, read it fully. If none matches closely, read all specs in the folder until you understand the `beforeEach` setup pattern, page object getters used, `allure.step` naming style, how survey URLs are obtained, and how user accounts are switched.
   - Module mapping:
     - Engage test → `Engage_Test_Cases/`
     - Performance test → `360_Test_Cases/`
     - Goals test → `Goals_Test_Cases/`
     - People test → `People_Test_Cases/`
     - …and so on. **Never substitute a file from a different module.**
   - Stop only when you can answer: _"What `beforeEach` pattern does this module use? Which page object getters are called? How are participants added and surveys attended?"_
3. **Document reusable methods**: survey creation, configuration, distribution, attendance, verification
4. **Plan test consolidation**: decide how many test cases are needed. If the full scenario can run in one session without switching users mid-flow — it **must** be a single test case. Never split into multiple tests just to make them shorter.

**DO NOT proceed to Phase 1 until Phase 0 is complete.**

### Phase 1: Context Gathering

- Analyze the request — feature, module, user role, expected outcome
- **Jira ticket mentioned?** Fetch with `jira_get_issue` → scan for PRD/Figma links → read both
- **Figma URL?** Fetch screenshot → extract UI structure for locators
- Map to the correct application module

### Phase 2: Exploration

- Use `user-playwright-browser_*` MCP to navigate the live app
- Walk through the test flow step-by-step using `browser_snapshot()`
- Verify locators match the live DOM

### Phase 3: Gap Analysis

```
Read TSAP/Pages/POManager.js
├─ Getter exists for this feature?
│   ├─ YES → Read that page object
│   │   ├─ Needed method exists? → Reuse
│   │   └─ Missing? → Add to existing page object
│   └─ NO → Create new page object + register in POManager
```

```
Search TSAP/Tests/WebApp_Testing/{Module}_Test_Cases/
├─ Spec file for this feature exists?
│   ├─ YES → Add test to existing file
│   └─ NO → Create new: test-cases-for-{feature}.spec.js
```

### Phase 4: Code Generation

1. Update page objects if needed (follow `TSAP/Pages/locator-rules.md` and `function-rules.md`)
2. Write test spec (follow `TSAP/Tests/test-rules.md`)

### Phase 5: Validation (MANDATORY — HARD GATE)

**Every generated test MUST be executed and confirmed passing before the task is considered complete. This is not optional.**

```bash
npx cross-env ENV=qa npx playwright test path/to/new-test.spec.js --headed
```

Follow this loop — repeat until the test passes:

1. **Run** the test using the command above against the S2 QA environment.
2. **Read the output** — look for selector timeouts, element-not-found errors, assertion failures, or network errors.
3. **If it fails** — identify the root cause (wrong locator, missing wait, incorrect method call, wrong URL, etc.), fix the code, then **go back to step 1**.
4. **If it passes** — the task is complete. Report the passing run to the user.

**Never hand off a test that has not been executed and confirmed green at least once.**

---

## Jira Integration

When a Jira ticket ID is mentioned:
1. `jira_get_issue("PROJ-123")` — get summary, description, AC
2. Scan description for **PRD link** (Confluence) and **Figma link**
3. Read PRD: `confluence_search()` → `confluence_get_page(page_id)` — extract AC, edge cases, feature flags
4. Read Figma: `get_figma_screenshot(figmaUrl)` — extract UI flow, CTA labels
5. Combine all three sources before writing test code

**Rule:** Jira alone is never enough. PRD has edge cases Jira doesn't. Figma has exact UI labels.

---

## Output Checklist

- [ ] Phase 0 done: read same-module spec files and module README before writing any code?
- [ ] Page objects: new locators/methods added? Registered in POManager?
- [ ] Using `thrivePage` from `application-setup.js` (not `@playwright/test`)?
- [ ] POManager: `poManager.getXxxPage()` (not `new XxxPage()`)?
- [ ] PwActions: all interactions use `PwActions.*()`, not raw Playwright?
- [ ] Test data: all entity names use `Date.now()` or faker?
- [ ] Allure steps: every logical action group wrapped?
- [ ] Assertions: all `expect()` calls have descriptive messages?
- [ ] Tags: `@Regression` (and `@smoke` if critical)?
- [ ] Test consolidation: could steps be merged into one test? If yes, merged?
- [ ] **Test executed with `npx cross-env ENV=qa npx playwright test … --headed` and confirmed passing?**

## Related Files

- `test-rules.md` — Test structure, fixture, assertions, data, reporting rules
- Each module's `README.md` — Product context and common patterns

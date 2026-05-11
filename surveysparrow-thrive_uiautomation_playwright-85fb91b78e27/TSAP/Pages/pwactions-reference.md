# PwActions API Reference

**NEVER use raw Playwright methods. ALWAYS use the static `PwActions` wrapper.**

```javascript
import PwActions from "playwright-framework/Core/pw-actions.js";
```

## Click Actions

| Method | Use Case |
|---|---|
| `PwActions.click(page, locator)` | Standard click with auto-wait |
| `PwActions.waitAndClick(page, locator)` | Wait for visibility, then click |
| `PwActions.jsClick(page, locator)` | JS click — bypass overlays |
| `PwActions.hover(page, locator)` | Hover to trigger tooltips/dropdowns |

## Input Actions

| Method | Use Case |
|---|---|
| `PwActions.fill(page, locator, text)` | Fill input (clears first) |
| `PwActions.clearAndFill(page, locator, text)` | Explicit clear + fill |
| `PwActions.selectOption(page, locator, value)` | Select dropdown option |
| `PwActions.toggleCheckBox(page, state, locator)` | Set checkbox on/off (boolean state) |
| `PwActions.setToggleState(page, locator, state)` | Set toggle switch on/off (string: `"on"`/`"off"`, checks `data-state`) |
| `PwActions.uploadFile(page, locator, filePath)` | Upload file |

## Wait Actions

| Method | Use Case |
|---|---|
| `PwActions.waitTillVisible(page, locator, timeout?)` | Wait for element visible (default 30s) |
| `PwActions.waitTillElementDisappear(page, locator, timeout?)` | Wait for element gone |
| `PwActions.waitForNetworkIdle(page, timeout?)` | Wait for network to settle |
| `PwActions.waitForDOMContentLoaded(page, timeout?)` | Wait for DOM loaded |

## Query Actions

| Method | Use Case |
|---|---|
| `PwActions.getText(page, locator)` | Get visible text |
| `PwActions.getAllTextContents(page, locator)` | Get text from all matches (array) |
| `PwActions.elementIsVisible(page, locator)` | Check visibility (boolean) |
| `PwActions.getLocator(page, locator)` | Get Playwright locator for `expect()` |

## Navigation

| Method | Use Case |
|---|---|
| `PwActions.goTo(page, url)` | Navigate to URL |
| `PwActions.pageRefresh(page)` | Refresh page |
| `PwActions.openNewTab(browser)` | New tab (returns page) |
| `PwActions.closeTab(page)` | Close tab |
| `PwActions.visualTestComparison(page, filename, maskedElements?)` | Visual regression |

---

## toggleCheckBox vs setToggleState

These are **two different methods** — pick the right one:

| Method | Element Type | State Format | Parameter Order |
|---|---|---|---|
| `toggleCheckBox` | Checkbox (`<input type="checkbox">`) | Boolean: `true` / `false` | `(page, state, locator)` |
| `setToggleState` | Toggle switch (with `data-state` attr) | String: `"on"` / `"off"` | `(page, locator, state)` |

```javascript
// Checkbox — boolean state, locator is THIRD
await PwActions.toggleCheckBox(this.page, true, this.chkBoxSelfEvaluation);

// Toggle switch — string state, locator is SECOND
await PwActions.setToggleState(this.page, this.btnToggleLogo, "on");
```

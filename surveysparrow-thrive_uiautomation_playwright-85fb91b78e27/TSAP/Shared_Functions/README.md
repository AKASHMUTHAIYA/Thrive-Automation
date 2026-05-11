# Shared Functions — Cross-Page Utilities

Reusable functions that span multiple page objects or modules. If logic is used across 2+ page objects, it belongs here.

## Folder Structure

```
Shared_Functions/
├── common-functions.js       # Navigation, downloads, sidebar, popups, search
├── entityId.js               # State sharing between test steps (EntityIds)
├── calculations.js           # Numeric calculations (scores, averages)
└── external-services.js      # External integrations (Jira linking)
```

## common-functions.js — Key Methods

The `CommonPageFunctions` class is available via POManager:

```javascript
const commonFunctions = poManager.getCommonPageFunctions();
```

### Navigation

```javascript
await commonFunctions.navigateToTabs(tabName);
await commonFunctions.navigateToSideBarMenu(menuName);
await commonFunctions.navigateToReportsSection(sectionName);
```

### UI Utilities

```javascript
await commonFunctions.search("John Doe");
await commonFunctions.closeSparrowDeskPopup(page);
await commonFunctions.closeFeaturePopupIfPresent(page);
await commonFunctions.chooseRandomDateOnCalendar({ page });
```

### Downloads

```javascript
await commonFunctions.downloadFile(entityName, format);
const filePath = await commonFunctions.downloadFileAndReturnPath(page, selector, timeout);
```

### Data Loading

```javascript
await commonFunctions.loadAllDataFromInfiniteScroll({
    page, apiUrl, containerSelector, rowSelector, maxTries: 3, maximumRows: 150,
});
```

## entityId.js — EntityIds

Singleton for sharing state between test steps within a single test:

```javascript
import { EntityIds } from "../../Shared_Functions/entityId.js";

EntityIds.setsurveyId(id);               EntityIds.getsurveyId();
EntityIds.setsurveyName(name);           EntityIds.getsurveyName();
EntityIds.setCookie(cookies);            EntityIds.getCookie();
EntityIds.setSurveyBuilderUrl(url);      EntityIds.getSurveyBuilderUrl();
```

## When to Add Here vs Page Object

| Condition | Location |
|---|---|
| Used by 2+ page objects or modules | `common-functions.js` |
| Specific to one feature/page | That page object file |
| Pure calculation (no page interaction) | `calculations.js` |
| External service integration | `external-services.js` |

## Rules

- Follow function naming and options-object conventions from `TSAP/Pages/function-rules.md`
- All functions must have JSDoc with `@param`, `@returns`, `@example`
- Use `PwActions` for all page interactions — never raw Playwright
- Before adding a new function, check if an existing one can be extended with an optional parameter

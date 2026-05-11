# Data — Environment Config, Constants, and Test Data

All environment configuration, shared constants, test credentials, and static test data files live here.

## Folder Structure

```
Data/
├── Environment.json          # Per-environment config (URLs, credentials, feature flags)
├── test-data.js              # Exports `envDetails` object from Environment.json
├── login-data.js             # Login credentials helper
├── Resources/
│   ├── constants.js          # Shared constants, helper functions (email subjects, error messages)
│   ├── urls.js               # URL paths and endpoints
│   ├── shared-data.js        # Shared test data across modules
│   ├── random-values.js      # Random value generators (employee properties)
│   ├── predefined_test_data.js # Pre-defined test data sets
│   ├── languages.js          # Multilingual survey test data
│   ├── email-credentials.js  # Email service credentials
│   ├── jira-credentials.js   # Jira integration credentials
│   └── refresh-gmail-token.js # Gmail OAuth token refresh utility
├── Files/                    # Static files for upload tests (CSV, JSON, images)
├── Screenshots/              # Baseline screenshots for visual testing
└── YAML_files/               # Complex test scenario data in YAML format
```

## Key Exports

### `envDetails` — Environment Configuration

```javascript
import { envDetails } from "../../Data/test-data.js";

const baseUrl = envDetails.url;           // e.g., "https://app.thrivesparrow.com"
const adminEmail = envDetails.adminEmail;
const emailDomain = envDetails.emailDomain;
```

### `constants` — Shared Static Values

```javascript
import { constants } from "../../Data/Resources/constants.js";

const subject = constants.verifyEmailSubject;
const error = constants.invalidLoginError;
```

Use constants for **static values only** (error messages, email subjects, system defaults). Never use constants for entity names that need to be unique.

### `generateRandomEmployeeNameAndEmail()` — Dynamic Data

```javascript
import { generateRandomEmployeeNameAndEmail } from "../../Data/Resources/constants.js";

const { employeeName, employeeEmail } = generateRandomEmployeeNameAndEmail();
```

## EntityIds — State Sharing Between Test Steps

```javascript
import { EntityIds } from "../../Shared_Functions/entityId.js";

EntityIds.setsurveyId(id);               EntityIds.getsurveyId();
EntityIds.setsurveyName(name);           EntityIds.getsurveyName();
EntityIds.setCookie(cookies);            EntityIds.getCookie();
EntityIds.setSurveyBuilderUrl(url);      EntityIds.getSurveyBuilderUrl();
```

## YAML Test Data

```javascript
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

const yamlPath = `${CommonUtils.getDataDirectory()}/YAML_files/survey_data.yaml`;
const data = CommonUtils.readYAMLFile(yamlPath);
const surveyName = `${data.name}_${Date.now()}`; // Always make YAML data unique
```

## Rules

- **Dynamic data for entities** — always `Date.now()` or faker, never hardcoded names
- **Constants for static values** — error messages, email subjects, system defaults
- **Environment data for URLs/creds** — never hardcode URLs or passwords
- **YAML data still needs uniqueness** — append `_${Date.now()}` to names from YAML

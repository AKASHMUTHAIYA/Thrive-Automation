# Engage Test Cases — Product Context

## What Engage Covers

The **Engage** module handles employee engagement surveys — Pulse, eNPS, and Exit surveys. It includes the full lifecycle: creation, question building, configuration (anonymity, reminders), participant distribution, launch, survey attendance, and multi-faceted reports.

| Feature | URL Path | Description |
|---|---|---|
| Survey List | `/engage/surveys` | View, create, duplicate, delete surveys |
| Survey Builder | `/engage/surveys/{id}/builder` | Add sections, questions (rating, text, NPS, MCQ) |
| Configure | `/engage/surveys/{id}/configure` | Anonymity, reminders, scheduling, access |
| Distribution | `/engage/surveys/{id}/distribution` | Add participants by email, department, CSV |
| Launch | `/engage/surveys/{id}/launch` | Launch survey, send invitations |
| Reports | `/engage/surveys/{id}/reports` | Overview, heatmap, questions, responses, eNPS, action plans |
| Conversations | `/engage/conversations` | Admin-initiated conversations from survey responses |

## Key Page Objects

| POManager getter | Page Object | Purpose |
|---|---|---|
| `getSurveyPage()` | Survey listing | Create, duplicate, delete surveys |
| `getSurveyBuilderPage()` | Survey builder | Add sections and questions |
| `getEngageConfigurePage()` | Engage configure | Anonymity, settings |
| `getEngageDistributionPage()` | Distribution | Add participants |
| `getSurveyLaunchPage()` | Launch | Launch survey |
| `getSurveyEUIPage()` | Attend survey (EUI) | Attend as participant |
| `getEngageOverviewPage()` | Reports overview | Verify report data |
| `getEngageQuestionsPage()` | Reports questions | Question-level report data |
| `getEngageResponsesPage()` | Reports responses | Individual response data |
| `getEngageHeatmapPage()` | Reports heatmap | Heatmap visualization |
| `getEngageManagerView()` | Manager view | Manager-specific report view |

## Common Test Patterns

```javascript
// Survey creation — keyword in name is REQUIRED for type selection
const surveyName = `Automation Pulse Survey ${Date.now()}`; // "pulse" triggers Pulse type
await surveyPage.createNewSurvey(surveyName);

// Add questions
await surveyBuilderPage.addQuestion("Rating", "How satisfied are you?");
await surveyBuilderPage.addMultipleSectionsAndQuestions(sections, questions, type);

// Configure anonymity
await engageConfigurePage.nonAnonymousSurvey();   // or .anonymousSurvey()

// Distribution
await engageDistributionPage.addParticipantsInSurvey(email);

// Launch
await surveyLaunchPage.launchSurvey();
await surveyLaunchPage.confirmEngageSurveyLaunch();

// Attend
await surveyEUIPage.attendEngagePulseSurvey({ survey_url, browser, subjectName });
```

### `createNewSurvey` Keyword Requirement

`createNewSurvey(surveyName)` detects survey type by keyword in the name (case-insensitive `.includes()`). If no keyword matches, the type card is never clicked and the test times out.

| Survey type | Required keyword in name | Example |
|---|---|---|
| Engagement | `"engage"` | `Automation Engage Survey ${Date.now()}` |
| Pulse | `"pulse"` | `Automation Pulse Survey ${Date.now()}` |
| Exit | `"exit"` | `Automation Exit Survey ${Date.now()}` |

## Subfolder

```
Engage_Test_Cases/
└── Test_Cases_For_Reports/   # Report-specific test cases (overview, heatmap, responses)
```

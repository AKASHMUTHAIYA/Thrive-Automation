# People Test Cases — Product Context

## What People Covers

The **People** module is the employee directory and HR data hub. It manages employees, departments, job titles, smart lists, guests, manager assignments, imports (CSV/HRIS), custom properties, and employee profiles.

| Feature | URL Path | Description |
|---|---|---|
| Directory | `/people` | Employee list, search, filters |
| Departments | `/people/departments` | Department management |
| Job Titles | `/people/job-titles` | Job title management |
| Smart Lists | `/people/smart-lists` | Dynamic employee segments |
| Guests | `/people/guests` | Guest user management |
| Import | `/people/import` | CSV/HRIS employee import |
| Employee Profile | `/people/{id}` | Individual employee details |

## Key Page Objects

| POManager getter | Page Object | Purpose |
|---|---|---|
| `getPeoplePage()` | People | Employee CRUD, search, filters |
| `getImportsPage()` | Import | CSV upload, field mapping |
| `getEmployeesProfilePage()` | Profile | View/edit employee details |
| `getDepartmentsPage()` | Departments | Department management |
| `getJobTitlePage()` | Job Titles | Job title management |
| `getSmartListPage()` | Smart Lists | Dynamic employee segments |
| `getGuestsPage()` | Guests | Guest user management |
| `getManagerMissingPage()` | Manager Missing | Employees without managers |

## Common Test Patterns

```javascript
// Create employee
const employeeData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `test_${Date.now()}@example.com`,
    department: "Engineering",
};
await peoplePage.createEmployee(employeeData);

// Search and verify
await peoplePage.searchEmployee(employeeData.firstName);
await peoplePage.verifyEmployeeVisible(employeeData.firstName);

// Import via CSV
await peopleImportPage.uploadCSV(filePath);
await peopleImportPage.mapFields();
await peopleImportPage.confirmImport();

// Assign manager
await peoplePage.assignManager(employeeName, managerName);
```

## Key Characteristics

- Employee data feeds into all other modules (Engage participants, Goal assignees, etc.)
- **Smart lists** are dynamic filters used as participant groups in surveys
- **Custom properties** extend employee profiles with org-specific fields
- CSV import requires **field mapping** step

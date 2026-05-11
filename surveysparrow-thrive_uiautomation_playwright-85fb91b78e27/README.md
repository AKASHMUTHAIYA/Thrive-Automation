# Playwright_JS_POM

👨‍💻 Automated end-to-end testing using Playwright, Page Object Model (POM) framework, and JavaScript for web applications.

🧰 **Technologies**

Playwright

JavaScript


🚀 Features

🔍 **Visual Comparison Testing**:
🔍 **Visual Comparison Testing**:
Compare screenshots of the expected and actual states of the web pages being tested to ensure that UI changes do not introduce unexpected visual regressions.

✅ **Functional Testing**:
Ensure that the web application being tested meets the functional requirements using POM framework to organize test code.

🛠️ **Usage**

To run the tests:

1. Clone the repository:
    git clone git@bitbucket.org:surveysparrow/thrive_uiautomation_playwright.git

2. Install dependencies using npm install.

3. Run the tests using npm run test.

# Framework

# Core: 
**Core** is the UI Automation framework which can be used for any product that gets created under the sparrow.

*API Actions*: APIs can streamline UI automation by handling time-consuming tasks efficiently. All API calls and actions are organized within the api_actions.js file.
*CommonUtils.js*: Common reusable utility functions are written in this file
*Logger.js*: Log files provides details about the test and actions performed. Framework uses winston library to log the actions performed. 
*PWActions.js*: Customised Playwright actions and assertions helps in maintainability and identifying errors. This also helps in logging actions in logger file. PwAction Functions can be called in page classes to execute actions in webPage.

# TSAP
 TSAP is the Test Automation project for ThriveSparrow which has all the test related details which needs to run the tests.

**Data** - > Files: This folder is to store all test files that needs to be upload and download
         Resources: This folder is to store js files to read test data constants 
         Environment.json : This file is to add all environments and its details. 
         testdata.js : This file fetches environment details from Environment.json corresponding to the environment provided in .env file. This details can be used to run tests in required environment

**fixtures**: Playwright fixtures can be used to create reusable functions that can be called in test methods. applicationSetup.js contains thrivepage fixture which performs application login and logut before and after each test.

**pages**: The TSAP project is built on the Page Object Model design pattern, where each web page is represented by a class containing both the web element locators and the actions that can be performed on that page. Page classes are again separated based on different modules in Thrivesparrow. These page classes can be called in test through POManager.js file

**Shared_Function**: Apart from the functions in page classes some of the actions are shared. All such actions which is common in applications is written in *common-functions.js*. *entityid.js* contains getter and setter functions to access properties from pgae class functions.

**tests** : This folder contains all the automation test cases for Thrivesparrow. Regression test cases are organized in the WebAppTesting folder, while visual test cases are located in the VisualTesting folder. Tests for individual pages are added to separate JavaScript files, and all tests are defined using the Playwright Test module. Below is the format followed for creating a test case:
     test("Test_2_1", async ({ thrivePage , browser}) => {
          *test here*
     })
    "test": This is a function provided by the Playwright Test framework to define a test case.
    "Test_2_1": This is the name of the test case.
    "thrivePage": This is the custom fixture which has login and logut function which runs before and after each test.
    "browser": This is the browser instance provided by Playwright, which can be used to interact with browser-level APIs, open new pages, etc.
Necessary page classes can be imported via the POMnager.js file, and the functions within these classes can be used as test steps within the test methods.

**VisualTestData**: Screenshots for visual testing is stored in this folder

**Utils**: Application related utilities are included in this folder. 
         Read_Email.js contains functions to fetch emails from mailboxes.


**.env**: This files stores run time variables 
**global-setup.js**: Contains code that executes before starting test suite
**global-teardown.js**: Contains code that executes after completing the test suite

**To Run Test**
 
 Test can run through terminal or by running the script in package.json file. 
 Below command can be use to run test in terminal
        npx cross-env ENV=qa npx playwright test --project=Chrome TC_02_Test_02.spec.js

*cross-env*: Package that allows to set environment variables across different operating  systems.
*ENV=qa*: Set environment variable to qa. 
*npx playwright test*: This is the command to run tests using Playwright. It will search all the tests inside file with spec.js extension.
*--project=*: this selects the project from playwright.config.mjs file. Details like browser can be provided in the the project section
*TC_02_Test_02.spec.js*: Test file name

**Parallel Run**
Playwright tests can be run in parallel. It runs several worker processes that run at the same time. To achieve this, set fullyParallel to true and specify the desired number of parallel workers in the playwright.config.js file. In the framework these details can be provided in .env file

**Retries**
Failed tests can be rerun by providing retries count in playwright.config.js file through .env file

**Reporting**
Allure is the reporting tool used in this project. It generates detailed reports that include the status of test cases (Passed, Failed, or Skipped). For failed test cases, Allure provides additional details such as logger information, screenshots, videos, and trace files. The report files are generated in the my-allure-results folder. Below are the commands to generate and view the Allure report:

view: allure serve *report folder path*
generate: allure generate *report folder path*

To get test trace: Playwright generates traces of the test with details logs, console, network outputs. This tarces can be found in allure report as zip file. To view this traces follow below steps:
1. Download traces.zip file
2. OPen <https://trace.playwright.dev/> in browser
3. Drop the downloaded zip file there.


**Locators**
Locators are used to identify webElements in a webpage. There are 8 locators helps to get the required element. In the framwork prefer ID, CSS, Xpath to identify locators
ID: Ids are always unique and easy to identify. If Id is present it is always a good practice to choose it.
CSS Selector: CSS Seletors are simple and more faster. Apart from common CSS Selectors Playwright includes a number of CSS pseudo-classes to match elements by their text content. Please refer <https://playwright.dev/docs/other-locators>. For direct elements or elements to traverse forward, preffer to chose CSS Selector
Xpath: Xpath is used to identify complex elements as xpath can travel in any direction in DOM by use of parent, sibling functions.

**Read Email**
Emails from Gmail accounts are read using the Gmail API with OAuth2 authentication. The framework uses Client ID and Client Secret generated from Google Cloud Console, along with a refresh token for authentication.

**Refreshing Gmail OAuth Token:**
If you encounter an `invalid_grant` error (typically after changing your email password), you need to generate a new refresh token. Follow these steps:

1. Run the automated token refresh script:
   ```bash
   node TSAP/Data/Resources/refresh-gmail-token.js
   ```

2. The script will display an authorization URL. Copy and open it in your browser.

3. Log in with your Gmail account and authorize the application.

4. Copy the authorization code provided by Google and paste it into the terminal.

5. The script will automatically update the `email-credentials.js` file with the new refresh token.

6. Your tests should now work again!

**Note:** The refresh token must be regenerated whenever the email password is changed or the token is revoked.

### Naming WebElements/Locators

* for buttons:  `btnCancel`
* for links: `lnkHomePage`
* for textbox/input box: `txtBoxUserName`
* for images: `imgLogo`
* for dropdown :  `drpdwnCountries` 
* for text content: `txtMessage`
* for label: `lbl`
* for hover : `hvr`
* for drag: `draggable` 
* for drop: `droppable`, 
* for upload: `upload` , 
* for icons: `icn`, 
* for webelements: `webelements`
* for container: `container`
* for popup: `popup`

Note: To remove .DS_Store run below command
find . -name ".DS_Store" -delete

**Refrences**
Javascript: <https://devdocs.io/javascript/>
            <https://www.youtube.com/watch?v=jS4aFq5-91M>

PlayWright: <https://playwright.dev/>

Allure: <https://allurereport.org/>
        <https://allurereport.org/docs/playwright/>
Gmail-Getter: <https://github.com/bormando/gmail-getter?tab=readme-ov-file>













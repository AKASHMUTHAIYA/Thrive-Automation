import PwActions from "playwright-framework/Core/pw-actions.js";
import { expect } from "@playwright/test";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { generateRandomName } from "../../../Data/Resources/random-values.js";
import { constants } from "../../../Data/Resources/constants.js";
import { CommonPageFunctions } from "../../../Shared_Functions/common-functions.js";
import { PerformanceReportsPage } from "../Performance_Reports/performance-reports-reports-page.js";

export class PerformanceConfigureReports {
		constructor(page) {
			this.page = page;
			this.commonFunctions = new CommonPageFunctions(page);
			this.commonUtils = new CommonUtils(page);
			this.performanceReportsPage = new PerformanceReportsPage(page);
			this.webElementsAllSections =
				"//p[contains(@class,'twigs-c-kbyIfK-icTZsMN-css')]";
			this.inputSectionTitle =
				"//label[text()='Section Title']/ancestor::div[3]/following-sibling::input";
			this.inputSectionDescription =
				"//label[text()='Description']/ancestor::div[3]/following-sibling::textarea";
			this.btnSave = "//span[text()='Save']";
			this.btnCancel = "//span[text()='Cancel']";
			this.btnAdd = "//span[text()='Add']";
			this.webElementsCustomWidgets =
				"//p[text()='CUSTOM']/parent::div/child::div/descendant::p";
			this.btnAddDimension = "//p[text()='Add dimension']";
			this.btnRoles = "//p[text()='Roles']";
			this.btnCompetency = "//p[text()='Competency']";
			this.btnQuestions = "//p[text()='Questions']";
			this.webElementsAllDimensionsParameters =
				"//div[contains(@class,'twigs-c-PJLV twigs-c-PJLV-ilctIFO-css')]/p";
			this.webElementsDimensionParametersOptions =
				"//div[@class='twigs-c-PJLV twigs-c-PJLV-iiZtCyr-css']/descendant::label";
			this.webElementsTextOptions =
				"//div[contains(@class,'twigs-c-PJLV-ibWQJpO-css')]/descendant::p";
			this.inputTextCustomWidget = "(//div[@role='textbox'])[1]";
			this.txtCustomWidgetInReports =
				"//p[contains(@class,'twigs-c-PJLV-iZtCyr-css')]";
			this.imgCustomWidget = "//div[contains(@class,'image-block-wrapper')]";
			this.btnUploadImage = "//p[text()='Upload Image']";
			this.btnApply = "//span[text()='Apply']";
			this.inputUploadImage =
				"//div[contains(@class,'twigs-c-PJLV-ifjXvaF-css')]";
			this.btnSaveImage = "(//button//span[text()='Save'])[2]";
			this.btnAddParameters = "//p[text()='Add parameters']";
			this.btnSaveBlock = "//span[text()='Save Block']";
			this.imgBarRadarChart = "//div[@class='recharts-wrapper']";
			this.imgCustomChartinReports = "(//div[@class='recharts-wrapper'])[1]";
			this.btnBack =
				"//button[contains(@class,'twigs-c-gSguNF-hmIMsL-cv twigs-c-PJLV twigs-button')]";
			this.toasterSectionUpdatedSuccessfully =
				"//div[text()='Section updated successfully!']";
			this.toasterBlockAddedSuccessfully =
				"//div[text()='Block added successfully']";
			this.txtNodata = "//p[text()='Looks like there is no data!']";
			this.btnCloseSpotCheck = "//button[@aria-label='Close Spotcheck']";
			this.getBtnReportType = (reportType) =>
				`//button[text()="${reportType}"]`;
			this.txtReportName = `//span[text()="Subject Report"]`;
			this.txtGroupReportName = `//span[text()="Group Report"]`;
			this.btnDownloadSampleReport = `//button[@data-testid="reports_icon-button_download"]`;
			this.btnNewSection = `//div[text()="New Section"]/ancestor::button`;
			this.txtChooseAlignment = `//p[text()="Content Alignment:"]`;
			this.webElementsWidgets = `//div[@data-testid="widget-list-item_flex"]`;
			this.btnNavigateBack =
				"//button[contains(@class,'twigs-c-gSguNF-hmIMsL-cv')]";
			this.btnBarChartHorizontal = `//p[text()='Bar Chart (H)']`;
			this.btnBarChartVertical = `//p[text()='Bar Chart (V)']`;
			this.btnRadarChart = `//p[text()='Radar Chart']`;
			this.btnViewAll = `//button//span[text()='View All']`;
			this.selectWidgetFromList = (widgetName) =>
				`//div//h1[text()='Content Blocks']//following::div//img[@alt='${widgetName}']`;
			this.btnAdvanced = `//h3//button[text()= 'Advanced']`;
			this.checkboxReorderChartDimension = `//p[@data-testid='text'][text()='Reorder the chart dimension']//preceding::button[@role="checkbox"][1]`;
			this.chartDimensionItemsContainer = `//p[text()='Reorder the chart dimension']//following::div[1]`;
			this.chartDimensionItems = `//p[text()='Reorder the chart dimension']//following::div[1]//p`;
			this.getChartDimensionItem = (name) =>
				`//p[text()='Reorder the chart dimension']//following::p[text()='${name}']//parent::div//div`;
		}

		/**
		 * Gets the xpath for the edit (pencil) icon of a specific section
		 * @param {string} sectionName - The name of the section (e.g., 'Introduction', 'Competency Summary')
		 * @returns {string} The xpath for the pencil icon of the specified section
		 */
		getSectionEditIconXpath(sectionName) {
			return `//p[text()='${sectionName}']/ancestor::div[contains(@class,'twigs-c-PJLV-igrSnLq-css')]/following-sibling::div/button[1]`;
		}

		/**
		 * Gets the xpath for a competency or custom widget
		 * @param {string} competencyNameOrCustomWidgetName - The name of the competency or custom widget
		 * @returns {string} The xpath for the competency custom widget
		 */
		getCompetencyCustomWidgetXpath(competencyNameOrCustomWidgetName) {
			return `(//p[text()='${competencyNameOrCustomWidgetName}'])[1]`;
		}

		/**
		 * Gets the xpath for a parameter or dimension
		 * @param {string} parameterOrDimensionName - The name of the parameter or dimension
		 * @returns {string} The xpath for the parameter or dimension
		 */
		getParameterDimensionXpath(parameterOrDimensionName) {
			return `//label[text()='${parameterOrDimensionName}']`;
		}

		/**
		 * Gets the xpath for the radar,bar chart
		 * @param {string} competencyName - The name of the competency
		 * @returns {string} The xpath for the radar bar chart
		 */
		getRadarBarChartXpath(competencyName) {
			return `//p[text()='${competencyName}']/ancestor::div[contains(@class,'twigs-c-PJLV-ibdYrvH-css')]/descendant::div[@class='recharts-wrapper'][last()]`;
		}

		/**
		 * Function to get all the Custom Widget Names
		 *
		 * @returns {Promise<array>} customWidgetNames - an array of all custom widget names
		 */

		async getCustomWidgetNames() {
			try {
				const customWidgets = await PwActions.getWebElementsPage(
					this.page,
					this.webElementsCustomWidgets,
				);
				const customWidgetNames = await PwActions.getElementsText(
					this.page,
					customWidgets,
				);
				return customWidgetNames;
			} catch (error) {
				console.error(`Failed to get custom widget names: ${error.message}`);
				throw error;
			}
		}

		/**
		 * Edits a random section's title and description
		 * @param {string} newTitle - The new title for the section
		 * @param {string} newDescription - The new description for the section
		 */

		async editSectionInReports(newTitle, newDescription) {
			try {
				if (!newTitle) {
					throw new Error("Title is required");
				}
				const sections = await PwActions.getWebElementsPage(
					this.page,
					this.webElementsAllSections,
				);
				const sectionNames = await PwActions.getElementsText(
					this.page,
					sections,
				);
				const sectionName = generateRandomName(sectionNames);
				const sectionXpath = this.getCompetencyCustomWidgetXpath(sectionName);
				await PwActions.hover(this.page, sectionXpath);
				const editIconXpath = this.getSectionEditIconXpath(sectionName);
				await PwActions.hover(this.page, sectionXpath);
				await PwActions.click(this.page, editIconXpath);
				await PwActions.clearAndFill(
					this.page,
					this.inputSectionTitle,
					newTitle,
				);
				if (newDescription) {
					await PwActions.clearAndFill(
						this.page,
						this.inputSectionDescription,
						newDescription,
					);
				}
				await PwActions.click(this.page, this.btnSave);
				await PwActions.waitTillVisible(
					this.page,
					this.toasterSectionUpdatedSuccessfully,
				);
				await PwActions.click(this.page, this.btnBack);
			} catch (error) {
				console.error(`Failed to edit section in reports: ${error.message}`);
				throw error;
			}
		}

		/**
		 * Verifies that the edited section is present and has the correct title and description
		 * @param {string} newSectionName - The new name of the section
		 * @param {string} newDescription - The new description of the section
		 */

		async verifyEditedSectionInReports(newSectionName, newDescription) {
			try {
				expect(newSectionName, "New section name is required").toBeTruthy();
				const sectionXpath =
					this.getCompetencyCustomWidgetXpath(newSectionName);
				await PwActions.waitTillVisible(this.page, sectionXpath);
				const editIconXpath = this.getSectionEditIconXpath(newSectionName);
				await PwActions.hover(this.page, sectionXpath);
				await PwActions.click(this.page, editIconXpath);
				const sectionTitle = await PwActions.getText(
					this.page,
					this.inputSectionTitle,
				);
				const sectionDescription = await PwActions.getText(
					this.page,
					this.inputSectionDescription,
				);
				await PwActions.verifyTextExpected(sectionTitle, newSectionName);
				await PwActions.verifyTextExpected(sectionDescription, newDescription);
			} catch (error) {
				console.error(`Failed to verify edited section: ${error.message}`);
				throw error;
			}
		}

		/**
		 * Configures dimension and parameter for a chart widget
		 * @param {Object} options
		 * @param {string} [options.dimension] - Dimension name (e.g., 'Competency', 'Roles', 'Questions'). Random if not provided.
		 * @param {string|string[]} [options.dimensionOption] - Single option or array of options. Random if not provided.
		 * @param {string} [options.parameter] - Parameter name (e.g., 'Overall Score', 'Roles Score'). Random if not provided.
		 * @param {string|string[]} [options.parameterOption] - Single option or array of options. Random if not provided.
		 * @param {Object} [options.advancedSettings=null] - Advanced settings configuration (future use)
		 * @returns {Promise<{dimension: string, dimensionOption: string|string[], parameter: string, parameterOption: string|string[]|null}>}
		 */

		async configureChartDimensionAndParameter({
			dimension,
			dimensionOption,
			parameter,
			parameterOption,
		} = {}) {
			await PwActions.click(this.page, this.btnAddDimension);

			const dimensions = await PwActions.getWebElementsPage(
				this.page,
				this.webElementsAllDimensionsParameters,
			);
			const dimensionNames = await PwActions.getElementsText(
				this.page,
				dimensions,
			);
			const selectedDimension = dimension || generateRandomName(dimensionNames);
			const dimensionXpath =
				this.getCompetencyCustomWidgetXpath(selectedDimension);
			await PwActions.click(this.page, dimensionXpath);

			const dimensionOptions = await PwActions.getWebElementsPage(
				this.page,
				this.webElementsDimensionParametersOptions,
			);
			const dimensionOptionsNames = await PwActions.getElementsText(
				this.page,
				dimensionOptions,
			);

			let selectedDimensionOptions;
			if (dimensionOption) {
				selectedDimensionOptions = Array.isArray(dimensionOption)
					? dimensionOption
					: [dimensionOption];
			} else {
				selectedDimensionOptions = [generateRandomName(dimensionOptionsNames)];
			}

			for (const option of selectedDimensionOptions) {
				const optionXpath = this.getParameterDimensionXpath(option);
				await CommonUtils.sleep(2);
				await PwActions.click(this.page, optionXpath);
			}
			await PwActions.click(this.page, this.btnApply);

			await PwActions.click(this.page, this.btnAddParameters);
			const parameters = await PwActions.getWebElementsPage(
				this.page,
				this.webElementsAllDimensionsParameters,
			);
			const parameterNames = await PwActions.getElementsText(
				this.page,
				parameters,
			);
			const selectedParameter = parameter || generateRandomName(parameterNames);
			if (!selectedParameter) {
				throw new Error("Failed to select parameter name");
			}

			let selectedParameterOptions = null;
			const scoreParameters = [
				"Roles Score",
				"Questions Score",
				"Competency Score",
				"Team Average",
				"Department Average",
				"Benchmark",
				"Group Average",
			];

			if (scoreParameters.includes(selectedParameter)) {
				const parameterXpath =
					this.getCompetencyCustomWidgetXpath(selectedParameter);
				await PwActions.click(this.page, parameterXpath);
				const parameterOptions = await PwActions.getWebElementsPage(
					this.page,
					this.webElementsDimensionParametersOptions,
				);
				const parameterOptionsNames = await PwActions.getElementsText(
					this.page,
					parameterOptions,
				);

				if (parameterOption) {
					selectedParameterOptions = Array.isArray(parameterOption)
						? parameterOption
						: [parameterOption];
				} else {
					selectedParameterOptions = [
						generateRandomName(parameterOptionsNames),
					];
				}

				for (const option of selectedParameterOptions) {
					const optionXpath = this.getParameterDimensionXpath(option);
					await PwActions.click(this.page, optionXpath);
				}
				await PwActions.click(this.page, this.btnApply);
			} else {
				const parameterXpath =
					this.getCompetencyCustomWidgetXpath(selectedParameter);
				await PwActions.click(this.page, parameterXpath);
			}

			return {
				dimension: selectedDimension,
				dimensionOption:
					selectedDimensionOptions.length === 1
						? selectedDimensionOptions[0]
						: selectedDimensionOptions,
				parameter: selectedParameter,
				parameterOption: selectedParameterOptions
					? selectedParameterOptions.length === 1
						? selectedParameterOptions[0]
						: selectedParameterOptions
					: null,
			};
		}

		/**
		 * Saves the chart block after the chart configuration step.
		 * Waits for the "Save Block" button and success toaster to disappear as confirmation of completion.
		 *
		 * @returns {Promise<void>} Resolves when the block is saved and confirmation toasters have disappeared.
		 *
		 * @example
		 * // After configuring chart with selected dimension option
		 * await configureReportsPage.saveChartBlock();
		 *
		 * // Example inside a workflow:
		 * await configureReportsPage.selectChartBlockType('Horizontal Bar Chart');
		 * await configureReportsPage.configureChartBlockDimensions({ dimension: 'Role' });
		 * await configureReportsPage.saveChartBlock();
		 */

		async saveChartBlock() {
			await CommonUtils.sleep(2);
			await PwActions.click(this.page, this.btnSaveBlock);
			await PwActions.waitTillElementDisappear(
				this.page,
				this.btnSaveBlock,
				10000,
			);
			await PwActions.waitTillElementDisappear(
				this.page,
				this.toasterBlockAddedSuccessfully,
			);
		}

		/**
		 * Saves the current section
		 * @returns {Promise<void>}
		 */

		async saveSection() {
			await PwActions.click(this.page, this.btnSave);
			await PwActions.waitTillElementDisappear(
				this.page,
				this.toasterSectionUpdatedSuccessfully,
			);
		}

		/**
		 * Navigates back to the reports list from section edit view
		 * @param {string} [sectionName] - Section name for verification after navigation
		 * @returns {Promise<void>}
		 */

		async navigateBackToList(sectionName) {
			await PwActions.click(this.page, this.btnBack);
			if (sectionName) {
				await PwActions.waitTillVisible(
					this.page,
					this.getCompetencyCustomWidgetXpath(sectionName),
				);
			}
		}

		/**
		 * Selects a chart widget - tries direct xpath first, falls back to Add + Content Blocks modal
		 * @param {string} directXpath - The xpath for direct widget selection (visible in fresh section)
		 * @param {string} modalWidgetName - The widget name in Content Blocks modal (e.g., "Horizontal Bar Chart")
		 * @returns {Promise<void>}
		 */

		async selectChartWidget(directXpath, modalWidgetName) {
			const isDirectVisible = await PwActions.elementIsVisible(
				this.page,
				directXpath,
			);
			if (isDirectVisible) {
				await PwActions.click(this.page, directXpath);
				return;
			}
			const isAddVisible = await PwActions.elementIsVisible(
				this.page,
				this.btnAdd,
			);
			if (isAddVisible) {
				await PwActions.click(this.page, this.btnAdd);
				const widgetXpath = this.selectWidgetFromList(modalWidgetName);
				await PwActions.click(this.page, widgetXpath);
				return;
			}
			const isViewAllVisible = await PwActions.elementIsVisible(
				this.page,
				this.btnViewAll,
			);
			if (isViewAllVisible) {
				await PwActions.click(this.page, this.btnViewAll);
				const widgetXpath = this.selectWidgetFromList(modalWidgetName);
				await PwActions.click(this.page, widgetXpath);
			}
		}

		/**
		 * Creates a Bar Chart widget in the current section edit view
		 * Does not save automatically - call saveChartBlock() and saveSection() separately
		 * @param {Object} options
		 * @param {string} [options.orientation='horizontal'] - 'horizontal' or 'vertical'
		 * @param {string} [options.dimension] - Dimension name (random if not provided)
		 * @param {string} [options.dimensionOption] - Dimension option (random if not provided)
		 * @param {string} [options.parameter] - Parameter name (random if not provided)
		 * @param {string} [options.parameterOption] - Parameter option if applicable
		 * @returns {Promise<{dimension: string, dimensionOption: string, parameter: string, parameterOption: string|null, orientation: string}>}
		 */

		async createBarChart({
			orientation = "horizontal",
			dimension,
			dimensionOption,
			parameter,
			parameterOption,
		} = {}) {
			const directXpath =
				orientation === "vertical"
					? this.btnBarChartVertical
					: this.btnBarChartHorizontal;
			const modalName =
				orientation === "vertical"
					? "Vertical Bar Chart"
					: "Horizontal Bar Chart";
			await CommonUtils.sleep(2);
			await this.selectChartWidget(directXpath, modalName);
			const config = await this.configureChartDimensionAndParameter({
				dimension,
				dimensionOption,
				parameter,
				parameterOption,
			});
			return { ...config, orientation };
		}

		/**
		 * Creates a Radar Chart widget in the current section edit view
		 * @param {Object} options
		 * @param {string} [options.dimension] - Dimension name (random if not provided)
		 * @param {string} [options.dimensionOption] - Dimension option (random if not provided)
		 * @param {string} [options.parameter] - Parameter name (random if not provided)
		 * @param {string} [options.parameterOption] - Parameter option if applicable
		 * @returns {Promise<{dimension: string, dimensionOption: string, parameter: string, parameterOption: string|null}>}
		 */

		async createRadarChart({
			dimension,
			dimensionOption,
			parameter,
			parameterOption,
		} = {}) {
			await this.selectChartWidget(this.btnRadarChart, "Radar Chart");
			const config = await this.configureChartDimensionAndParameter({
				dimension,
				dimensionOption,
				parameter,
				parameterOption,
			});
			return config;
		}

		/**
		 * Creates a text custom widget
		 * @param {string} customWidgetName - The name of the custom widget
		 * @param {string} sectionName - The name of the section
		 */

		async createTextCustomWidget(customWidgetName, sectionName) {
			try {
				const customWidgetXpath =
					this.getCompetencyCustomWidgetXpath(customWidgetName);
				await PwActions.click(this.page, customWidgetXpath);
				const textOptions = await PwActions.getWebElementsPage(
					this.page,
					this.webElementsTextOptions,
				);
				const textOptionsNames = await PwActions.getElementsText(
					this.page,
					textOptions,
				);
				const textOptionName = generateRandomName(textOptionsNames);
				const textOptionXpath = `//p[text()='${textOptionName}']`;
				await PwActions.click(this.page, textOptionXpath);
				await PwActions.waitTillVisible(this.page, this.inputTextCustomWidget);
				await PwActions.fill(
					this.page,
					this.inputTextCustomWidget,
					textOptionName,
				);
				await PwActions.click(this.page, this.btnSaveBlock);
				await PwActions.waitTillVisible(
					this.page,
					this.toasterBlockAddedSuccessfully,
				);
				await PwActions.waitTillElementDisappear(
					this.page,
					this.toasterBlockAddedSuccessfully,
				);
				await PwActions.verifyElementIsPresent(this.page, customWidgetXpath);
				const textCustomWidgetInReports = `//span[text()='${textOptionName}']`;
				const text = await PwActions.getText(
					this.page,
					textCustomWidgetInReports,
				);
				await PwActions.verifyTextExpected(text, textOptionName);
				await PwActions.click(this.page, this.btnSave);
				await PwActions.waitTillVisible(
					this.page,
					this.toasterSectionUpdatedSuccessfully,
				);
				await PwActions.click(this.page, this.btnBack);
				const sectionXpath = this.getCompetencyCustomWidgetXpath(sectionName);
				await PwActions.click(this.page, sectionXpath);
				await PwActions.waitTillVisible(this.page, textCustomWidgetInReports);
			} catch (error) {
				console.error(`Failed to create text custom widget: ${error.message}`);
				throw error;
			}
		}

		/**
		 * Creates an image custom widget
		 * @param {string} customWidgetName - The name of the custom widget
		 * @param {string} sectionName - The name of the section
		 */

		async createImageCustomWidget(customWidgetName, sectionName) {
			await PwActions.waitForNetworkIdle(this.page);
			try {
				const customWidgetXpath =
					this.getCompetencyCustomWidgetXpath(customWidgetName);
				await PwActions.click(this.page, customWidgetXpath);
				await PwActions.click(this.page, this.btnUploadImage);
				await PwActions.uploadFile(
					this.page,
					this.inputUploadImage,
					constants.Custom_Branding_Logo,
				);
				await PwActions.waitForDOMContentLoaded(this.page, 15000);
				await PwActions.waitTillVisible(this.page, this.btnSaveImage);
				await CommonUtils.sleep(1);
				await PwActions.click(this.page, this.btnSaveImage);
				const hasBackgroundImage = await PwActions.hasBackgroundImage(
					this.page,
					this.imgCustomWidget,
				);
				expect(hasBackgroundImage).toBe(true);
				await PwActions.click(this.page, this.btnSaveBlock);
				await PwActions.waitTillVisible(
					this.page,
					this.toasterBlockAddedSuccessfully,
				);
				await PwActions.waitTillElementDisappear(
					this.page,
					this.toasterBlockAddedSuccessfully,
				);
				await PwActions.verifyElementIsPresent(this.page, customWidgetXpath);
				await PwActions.click(this.page, this.btnSave);
				await PwActions.waitTillVisible(
					this.page,
					this.toasterSectionUpdatedSuccessfully,
				);
				await PwActions.click(this.page, this.btnBack);
				const sectionXpath = this.getCompetencyCustomWidgetXpath(sectionName);
				await PwActions.click(this.page, sectionXpath);
				const hasBackgroundImages = await PwActions.hasBackgroundImage(
					this.page,
					this.imgCustomWidget,
				);
				expect(hasBackgroundImages).toBe(true);
			} catch (error) {
				console.error(`Failed to create image custom widget: ${error.message}`);
				throw error;
			}
		}

		// Creates a custom widget based on the type of the custom widget

		async createCustomWidget() {
			await PwActions.waitForNetworkIdle(this.page);
			const sections = await PwActions.getWebElementsPage(
				this.page,
				this.webElementsAllSections,
			);
			const sectionNames = await PwActions.getElementsText(this.page, sections);

			let sectionName;
			do {
				sectionName = generateRandomName(sectionNames);
			} while (sectionName === "Personal Development Plan");

			const sectionXpath = this.getCompetencyCustomWidgetXpath(sectionName);
			await PwActions.hover(this.page, sectionXpath);
			const editIconXpath = this.getSectionEditIconXpath(sectionName);
			await PwActions.hover(this.page, sectionXpath);
			await PwActions.click(this.page, editIconXpath);
			await PwActions.click(this.page, this.btnAdd);

			const customWidgetNames = await this.getCustomWidgetNames();
			const customWidgetName = generateRandomName(customWidgetNames);

			if (customWidgetName === "Text") {
				await this.createTextCustomWidget(customWidgetName, sectionName);
			} else if (customWidgetName === "Image") {
				await this.createImageCustomWidget(customWidgetName, sectionName);
			} else if (customWidgetName === "Bar Chart (H)") {
				await this.createBarChart({ orientation: "horizontal" });
				await this.saveChartBlock();
				await this.saveSection();
				await this.navigateBackToList(sectionName);
			} else if (customWidgetName === "Bar Chart (V)") {
				await this.createBarChart({ orientation: "vertical" });
				await this.saveChartBlock();
				await this.saveSection();
				await this.navigateBackToList(sectionName);
			} else if (customWidgetName === "Radar Chart") {
				await this.createRadarChart();
				await this.saveChartBlock();
				await this.saveSection();
				await this.navigateBackToList(sectionName);
			}
		}

		/**
		 * Switches between subject report and group report
		 * @param {Page} page - The Playwright page object.
		 * @param {string} reportType - The report type to switch to
		 * @returns {Promise<void>}
		 * @example
		 * await configureReportsPage.switchBetweenReportType({ page: page, reportType: "Subject" });
		 */

		async switchBetweenReportType({ page = this.page, reportType }) {
			await PwActions.click(
				page,
				this.getBtnReportType(reportType + " Report"),
			);
			if (reportType === "Subject") {
				await PwActions.waitTillVisible(page, this.txtReportName);
			} else {
				await PwActions.waitTillVisible(page, this.txtGroupReportName);
			}
		}

		/**
		 * Verifies the subsections in the new section modal
		 * @returns {Promise<void>}
		 * @example
		 * await configureReportsPage.verifySubsectionsInNewSectionModal();
		 */

		async verifySubsectionsInNewSectionModal() {
			await PwActions.waitForElement(this.page, this.btnNewSection);
			await PwActions.click(this.page, this.btnNewSection);
			await PwActions.waitTillVisible(this.page, this.txtChooseAlignment);
			await PwActions.waitTillVisible(this.page, this.inputSectionTitle);
			await PwActions.waitTillVisible(this.page, this.inputSectionDescription);
			const widgets = await PwActions.getWebElementsPage(
				this.page,
				this.webElementsWidgets,
			);
			const widgetNames = await PwActions.getElementsText(this.page, widgets);
			expect(widgetNames.length).toBe(5);
		}

		/**
		 * Creates a new section in the Configure Reports page
		 * @param {string} sectionName - The name/title of the new section
		 * @param {string} sectionDescription - The description of the new section (optional)
		 * @returns {Promise<string>} The created section name
		 * @example
		 * await configureReportsPage.createNewSectionInReports("My Custom Section", "Section description");
		 */

		async createNewSectionInReports(sectionName, sectionDescription = "") {
			if (!sectionName) {
				throw new Error("Section name is required");
			}
			await PwActions.waitAndClick(this.page, this.btnNewSection);
			await PwActions.waitTillVisible(this.page, this.inputSectionTitle);
			await PwActions.fill(this.page, this.inputSectionTitle, sectionName);
			if (sectionDescription) {
				await PwActions.fill(
					this.page,
					this.inputSectionDescription,
					sectionDescription,
				);
			}
			await PwActions.click(this.page, this.btnSave);
			await PwActions.waitTillElementDisappear(
				this.page,
				this.toasterSectionUpdatedSuccessfully,
			);
		}

		/**
		 * Gets the current order of chart dimensions
		 * @returns {Promise<string[]>} Array of dimension names in current order
		 */

		async getChartDimensionsOrder() {
			const items = await PwActions.getWebElementsPage(
				this.page,
				this.chartDimensionItems,
			);
			const dimensionNames = await PwActions.getElementsText(this.page, items);
			return dimensionNames;
		}

		/**
		 * Clicks the Advanced button to expand advanced settings dropdown
		 * @returns {Promise<void>}
		 */

		async clickAdvanced() {
			await PwActions.click(this.page, this.btnAdvanced);
		}

		/**
		 * Reorders chart dimensions to match the specified order via drag-and-drop
		 * Supports bidirectional reordering (up and down)
		 * Automatically enables reorder option before reordering
		 *
		 * @param {string[]} desiredOrder - Array of dimension names in desired order
		 * @returns {Promise<string[]>} The final order after reordering and verification
		 *
		 * @example
		 * // Suppose the chart currently has dimensions: ["Department", "Role", "Location"]
		 * // To reorder to: ["Role", "Department", "Location"], use:
		 * const finalOrder = await configureReportsPage.reorderChartDimensions(["Role", "Department", "Location"]);
		 * // finalOrder will be ["Role", "Department", "Location"]
		 */

		async reorderChartDimensions(desiredOrder) {
			if (!desiredOrder || desiredOrder.length === 0) {
				throw new Error("Desired order array is required");
			}

			await this.clickAdvanced();
			await PwActions.click(this.page, this.checkboxReorderChartDimension);
			await PwActions.waitTillVisible(
				this.page,
				this.chartDimensionItemsContainer,
			);
			await CommonUtils.sleep(1);

			for (
				let targetIndex = 0;
				targetIndex < desiredOrder.length;
				targetIndex++
			) {
				const itemToMove = desiredOrder[targetIndex];
				const currentOrder = await this.getChartDimensionsOrder();
				const currentIndex = currentOrder.indexOf(itemToMove);

				if (currentIndex === -1) {
					throw new Error(
						`Dimension "${itemToMove}" not found in current list`,
					);
				}

				if (currentIndex !== targetIndex) {
					const sourceSelector = this.getChartDimensionItem(itemToMove);
					const targetItemName = currentOrder[targetIndex];
					const targetSelector = this.getChartDimensionItem(targetItemName);

					await PwActions.dragAndDrop(
						this.page,
						sourceSelector,
						targetSelector,
					);
					await CommonUtils.sleep(0.5);
				}
			}

			const finalOrder = await this.getChartDimensionsOrder();
			for (let i = 0; i < desiredOrder.length; i++) {
				expect(finalOrder[i]).toBe(desiredOrder[i]);
			}

			return finalOrder;
		}
	}

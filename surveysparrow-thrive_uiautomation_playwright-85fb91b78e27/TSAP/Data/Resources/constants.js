import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";
import { generateRandomEmployeeProperty } from "./random-values.js";
import { envDetails } from "../test-data.js";
import { jira_credentials } from "./jira-credentials.js";

const { departmentName, managerName, jobtitleName } =
	generateRandomEmployeeProperty();
const randomNum = CommonUtils.getRandomIntInclusive(10000, 99999);

/**
 * PPT export feature — migrated from `ppt-test-data.js`.
 * Slide names, default order, source tab mappings, and configuration options.
 */
const pptExportData = {
	slideNames: {
		INTRODUCTION: "Introduction",
		PARTICIPATION: "Participation",
		OVERVIEW: "Overview",
		SUMMARY: "Summary",
		TRENDS: "Trends",
		DEMOGRAPHIC_SPOTLIGHT: "Demographic Spotlight",
		STRENGTHS: "Strengths",
		AREAS_OF_IMPROVEMENT: "Areas of Improvement",
		TOP_COMMENTS: "Top Comments",
	},
	defaultSlidesOrder: [
		"Introduction",
		"Participation",
		"Overview",
		"Summary",
		"Trends",
		"Demographic Spotlight",
		"Strengths",
		"Areas of Improvement",
		"Top Comments",
	],
	slideSources: {
		Introduction: "Overview",
		Participation: "Overview",
		Overview: "Overview",
		Summary: "Overview",
		Trends: "Overview",
		"Demographic Spotlight": "Heatmap",
		Strengths: "Questions",
		"Areas of Improvement": "Questions",
		"Top Comments": "Responses",
	},
	mandatorySlides: ["Introduction"],
	defaultUncheckedSlides: ["Top Comments"],
	scoreTypes: ["Favourability Score", "Percentage Score"],
	compareWithOptions: ["Overall Score"],
	email: {
		SUBJECT: "Your PPT report is ready",
		MAX_WAIT_TIME_MS: 200000,
		PPTX_MIME_TYPE:
			"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	},
	expectedSlideKeywords: [
		"Participation",
		"Overview",
		"Summary",
		"Trends",
		"Strengths",
		"Areas of Improvement",
	],
};

const constants = {
	admin_name: "Automation Tester",
	teamAnalyticEmployeeName: "Team Analytics",
	teamAnalyticEmployeeEmail: "thrive.automation+team@surveysparrowqa.com",
	sender_email: "test-automation@mailer.noforms.io",
	manager_evaluator_email: "thrive.automation+5@surveysparrowqa.com",
	reportee_evaluator_email: "thrive.automation+4@surveysparrowqa.com",
	new_Employee_name: "auto",
	subjectName: "Subject Automation 1",
	subjectName2: "Subject Automation 2",
	subjectName3: "Subject Automation 3",
	subjectName4: "Subject Automation 4",
	subjectName5: "Subject Automation 5",
	subjectName6: "Subject Automation 6",
	engageParticipantName: "Engage Automation 1",
	evaluatorName: "Evaluator Automation",
	reporteeName: "Reportee Automation",
	managerName: "Manager New",
	manager_department: "Manager Team",
	department_sales: "Sales",
	organization_name: "Test Automation",
	engageSubjectName: "Engage Automation 1",
	engageParticipant1: "Engage Automation 1",
	engageParticipant2: "Engage Automation 2",
	engageParticipant3: "Engage Automation 3",
	engageParticipant4: "Engage Automation 4",
	engageParticipant1Email: "thrive.automation+e1@surveysparrowqa.com",
	engageParticipant2Email: "thrive.automation+e2@surveysparrowqa.com",
	engageParticipant3Email: "thrive.automation+e3@surveysparrowqa.com",
	engageParticipant4Email: "thrive.automation+e4@surveysparrowqa.com",
	new_employee_email: "thrive.automation@surveysparrowqa.com",
	evaluator_email_subject: "Please assess Subject Automation",
	exit_email_subject: "Help us learn from your journey",
	exit_email_reminder_subject: "Your Exit Check Counts!",
	goalOwnerEmail: `thrive.automation+okrowner@surveysparrowqa.com`,
	goalOwnerName: "Goal Owner Automation",
	goalQuestionText1:
		"Validates that goal visibility varies by subject, showing an empty state for one and matching goals for another.",
	goalQuestionText2:
		"Verifies that applying duplicate goal filters results in a no-goals state.",
	goalQuestionText3: "Question for Configuration Verification for Rating Scale",
	goalQuestionText4:
		"Question for Configuration Verification for Text Question",
	goalQuestionText5: "Question for Goal Status Filter Listing and Selection",
	new_employee_email_subject:
		"Welcome to the ThriveSparrow Fam! Get. Set. Thrive.",
	signupWelcomeEmailSubject: "🎉 Welcome to ThriveSparrow!",
	new_employee_email_body:
		"You have been invited to join ThriveSparrow Greetings, <employee_name>! Great news! You have been invited to join ThriveSparrow as a part of your organization's continued efforts to boost workplace engagement. Here, every opinion counts, every contribution is applauded, and the success of each member is a cause for celebration. To get started on this enriching journey, all you need to do is confirm your email address. Verify Email On clicking Verify Email you are agreeing to ThriveSparrow's Terms and Conditions and Privacy Policy. © 2026 SurveySparrow Inc. All rights reserved.",
	subjectReminderEmailSubject:
		"Reminder: Please nominate the evaluators for your 360 degree assessment",
	approverReminderEmailSubject: "Reminder: Request to approve evaluator",
	goalPublishedEmailSubject: "✅ New Goal Assigned: ",
	taskAssignedEmailSubject: "✅ New Task Assigned: ",
	subject_email: "thrive.automation@surveysparrowqa.com",
	subject_email2: "thrive.automation+s2@surveysparrowqa.com",
	subjectEmail3: "thrive.automation+s3@surveysparrowqa.com",
	subjectEmail4: "thrive.automation+s4@surveysparrowqa.com",
	subjectEmail5: "thrive.automation+s5@surveysparrowqa.com",
	subjectEmail6: "thrive.automation+s6@surveysparrowqa.com",
	evaluator_email: "thrive.automation+2@surveysparrowqa.com",
	approver_email: "thrive.automation+3@surveysparrowqa.com",
	approverName: "Approver Automation",
	approverName2: "Approver Automation 2",
	approverEmail2: "thrive.automation+8989@surveysparrowqa.com",
	common_password: "Test@1234",
	engage_email: "thrive.automation+e1@surveysparrowqa.com",
	testEmail: "thrive.automation+43507@surveysparrowqa.com",
	testPassword: "87654321",
	add_to_shortlist: "Add to Shortlist",
	send_invite: "Send Invite",
	self_email_subject: "Please complete self-evaluation",
	engage_email_subject: "Survey Invitation",
	engage_email_reminder_subject: "Complete the Survey",
	engageQREmailSubject:
		"Distribute Attached QR Code to gather Employee Feedback",
	engage_email_subject_edited: "Survey Invitation Edited",
	active: "Active",
	deactivate: "Deactivated",
	inviteNotSent: "Invite Not Sent",
	reasonForTheScore: "Reason for the score is Automation",
	performanceReportTitles: [
		"Introduction",
		"Competency Summary",
		"Gap Analysis - Radar Chart",
		"Your Strengths",
		"Areas of Improvement",
		"Hidden Strengths",
		"Blind Spots",
		"Detailed Feedback",
		"Competency Trend",
	],
	performanceSurveyTemplates: [
		"Choose Evaluators",
		"Reminder to Choose Evaluators",
		"Invite to Self Assessment",
		"Reminder to take Self Assessment",
		"Report Ready Email",
		"Invite to Evaluate Subject",
		"Reminder to Evaluate Subjects",
		"Approve Evaluators",
		"Reminder to Approve Evaluators",
		"Review Report Email",
		"Skipped Evaluation Email",
	],
	performanceActionPlanSurveySectionsToDelete: [
		"Communication Skills",
		"Team Skills",
		"Organizational Skills",
		"Creativity Skills",
		"Interpersonal Skills",
		"Organizational Alignment",
	],
	performanceActionPlanSurveyPermissionsAllRoles: {
		allowApproversToCreateActionPlans: true,
		allowSubjectsToCreateActionPlans: true,
		allowManagersToCreateActionPlans: true,
	},
	engageMessagingTemplates: [
		"Invite to take survey",
		"Survey reminder",
		"Report ready",
	],
	surveyVariables: [
		{ name: "Survey_Name", text: "{surveyName}" },
		{ name: "Survey_URL", text: "{surveyURL}" },
		{ name: "Company_Name", text: "{companyName}" },
		{ name: "Employee_FirstName", text: "{employeeFirstName}" },
		{ name: "Employee_FullName", text: "{employeeFullName}" },
	],
	report_ready_email_subject: "Your 360 feedback report is ready!",
	verifyEmailSubject: "ThriveSparrow email verification",
	resetPasswordUsername: "thrive automation18364",
	resetPasswordMailSubject: "Reset Your ThriveSparrow Password Now! 🔑",
	emailFetchCutoffTimeInMinutes: 10,
	engageOverviewReportTitles: [
		"Engagement Summary",
		"Engagement Score Comparison",
		"Respondents Distribution",
		"Most Engaged respondents",
		"Least Engaged respondents",
	],
	exitReportTitles: [
		"Exit Summary",
		"Exit Score Comparison",
		"Respondents Distribution",
		"Most Engaged respondents",
		"Least Engaged respondents",
	],
	pulseOverviewReportTitles: [
		"Pulse Summary",
		"Pulse Score Comparison",
		"Respondents Distribution",
		"Most Engaged respondents",
		"Least Engaged respondents",
	],
	performanceOverviewReportTitles: [
		"Overall Score",
		"EVALUATION SUMMARY",
		"REPORT SUMMARY",
		"Score Distribution",
		"Performance Summary",
		"Score Comparison",
		"Rating Distribution",
		"Competency Summary",
		"Radar Chart",
	],
	billingModulePrice: {
		Kudos: 2,
		Engage: 3,
		Performance: 5,
		"Goals (OKRs)": 3,
	},
	companyAverageBenchmarkValue: "2.19",
	companyAverageBenchmarkValueForCustomCompetency: "2.10",
	minimumEngageSurveyTemplatesCount: 1,
	minimumPulseSurveyTemplatesCount: 1,
	minimumPerformanceSurveyTemplatesCount: 1,
	performanceReportExpectedPages: 18,
	// Question Banks Count
	QUESTION_BANKS: {
		MINIMUM_ENGAGE_PULSE: 3,
		MINIMUM_ENGAGE: 3,
		MINIMUM_PULSE: 3,
		MINIMUM_PERFORMANCE: 3,
	},
	// Report Types
	REPORT_TYPES: {
		SUBJECT_AND_GROUP_REPORT: "Subject and Group Report",
		SUBJECT_REPORT: "Subject Report",
		GROUP_REPORT: "Group Report",
	},
	// Questions Tab Group By Options
	questionsTabGroupByOptions: ["Reporting Factors", "Questions"],
	questionsTabGroupByKeyMap: {
		"Reporting Factors": "reporting_factors",
		Questions: "questions",
	},
	managerEmail: "thrive.automation+5@surveysparrowqa.com",
	eNPSQuestion:
		"How likely are you to recommend our company as a workplace to a friend or colleague?",
	reminder_email_subject: "Reminder to Evaluate Subjects",
	subjectCustomVariable: "ThriveCustomVariable",
	EvaluateSubjectText: "Evaluate Subject Automation 1",
	agreementScale: {
		agreementScale5Point: {
			0: "Extremely Disagree",
			1: "Strongly Disagree",
			2: "Disagree",
			3: "Average",
			4: "Okay",
			5: "Strongly Agree",
		},

		agreementScale7Point: {
			1: "Strongly Disagree",
			2: "Disagree",
			3: "Moderately Disagree",
			4: "Neutral",
			5: "Moderately Agree",
			6: "Agree",
			7: "Strongly Agree",
		},

		agreementScale10Point: {
			0: "Extremely Disagree",
			1: "Strongly Disagree",
			2: "Disagree",
			3: "Moderately Disagree",
			4: "Slightly Disagree",
			5: "Neutral",
			6: "Slightly Agree",
			7: "Moderately Agree",
			8: "Agree",
			9: "Strongly Agree",
			10: "Extremely Agree",
		},
	},

	frequencyScale: {
		frequencyScale5Point: {
			0: "Never",
			1: "Rarely",
			2: "Occasionally",
			3: "Sometimes",
			4: "Often",
			5: "Always",
		},

		frequencyScale7Point: {
			0: "Never",
			1: "Rarely",
			2: "Occasionally",
			3: "Sometimes",
			4: "Moderately",
			5: "Frequently",
			6: "Often",
			7: "Always",
		},

		frequencyScale10Point: {
			0: "Never",
			1: "Rarely",
			2: "Occasionally",
			3: "Sometimes",
			4: "Moderately",
			5: "Frequently",
			6: "Often",
			7: "Very Often",
			8: "Consistently",
			9: "Almost Always",
			10: "Always",
		},
	},

	adminSurveyOptions: [
		"Edit Survey",
		"View Reports",
		"Duplicate Survey",
		"Archive Survey",
	],
	collaboratorSurveyOptions: ["Edit Survey", "View Reports"],

	GOAL_LEVELS: ["Org", "Department", "Team", "Individual"],

	VISIBILITY: ["Public", "Private", "Restricted"],

	METRIC_TYPES: ["Number", "Percentage", "Currency", "Decision"],

	getOkrsApiEndpoint: "/api/okrs/groups/get-okrs",
	getOkrSelfListApiEndpoint: "/api/okrs/self/list",
	getHighFiveRedeemsApiEndpoint: "/api/highfives/redeems/employee",

	goalStatusMapping: {
		NOT_STARTED: "Not Started",
		ON_TRACK: "On Track",
		AT_RISK: "At Risk",
		BEHIND: "Behind",
		COMPLETED: "Completed",
		ARCHIVED: "Archived",
	},
	goalVisibilityMapping: {
		ORGANIZATION: "Public",
		PRIVATE: "Private",
		RESTRICTED: "Restricted",
	},
	goalLevelMapping: {
		ORGANIZATION: "Org. Goal",
		DEPARTMENT: "Dept. Goal",
		TEAM: "Team Goal",
		INDIVIDUAL: "Indv. Goal",
	},
	goalParticipantRoleMapping: {
		WATCHER: "Watcher",
		OWNER: "Owner",
		CREATOR: "Creator",
		CONTRIBUTOR: "Contributor",
	},

	goalData: {},

	reverseGoalStatusMapping: {
		"Not Started": "NOT_STARTED",
		"On Track": "ON_TRACK",
		"At Risk": "AT_RISK",
		Behind: "BEHIND",
		Completed: "COMPLETED",
		Archived: "ARCHIVED",
	},
	reverseGoalVisibilityMapping: {
		Public: "ORGANIZATION",
		Private: "PRIVATE",
		Restricted: "RESTRICTED",
	},
	reverseGoalLevelMapping: {
		Org: "ORGANIZATION",
		Department: "DEPARTMENT",
		Team: "TEAM",
		Individual: "INDIVIDUAL",
	},
	reverseGoalMetricMapping: {
		Number: "NUMBER",
		Percentage: "PERCENTAGE",
		Currency: "CURRENCY",
		Decision: "DECISION",
	},

	/**
	 * Converts a goal creation payload (from getGoalCreatePayload) into the
	 * snapshot API response structure for 3-way verification.
	 *
	 * @param {object} payload - The goalData object used in createGoal()
	 * @param {object} [options] - Optional configuration
	 * @param {string} [options.goalName] - Goal name to convert (defaults to parent goal). When provided and differs from payload.goalName, searches supportingItem for a matching plain child goal and builds expected data with inherited parent fields.
	 * @returns {object} An object shaped like the snapshot API response
	 * @example
	 * // Parent goal conversion
	 * const expected = constants.convertGoalPayloadToSnapshotFormat(constants.goalData);
	 *
	 * // Child goal conversion with inheritance
	 * const childExpected = constants.convertGoalPayloadToSnapshotFormat(constants.goalData, { goalName: "Supporting Goal" });
	 */
	convertGoalPayloadToSnapshotFormat(payload, options = {}) {
		if (!payload || typeof payload !== "object") return {};

		const { goalName } = options;

		// Child goal fallback: search supportingItem for plain child goal
		if (goalName && goalName !== payload.goalName) {
			if (
				Array.isArray(payload.supportingItem) &&
				payload.supportingItem.length > 0
			) {
				const childGoal = payload.supportingItem.find(
					(item) => item.type === "GOAL" && item.title === goalName,
				);

				if (childGoal) {
					// Guard: reject imported child goals
					if (childGoal.toBrowse === true) {
						throw new Error(
							`Imported child goals (toBrowse: true) are not supported in this flow. Child goal "${goalName}" cannot be verified.`,
						);
					}

					// Build child goal expected data with parent field inheritance
					const childResult = {
						name: childGoal.title,
					};

					// Inherit parent fields
					if (payload.goalDescription)
						childResult.content = payload.goalDescription;
					if (payload.owner) {
						childResult.assigneeDetails = { fullName: payload.owner };
					}
					if (payload.status) {
						childResult.status =
							constants.reverseGoalStatusMapping[payload.status] ||
							payload.status;
					}
					if (payload.progress !== undefined) {
						childResult.currentProgress = Number(payload.progress) || 0;
					}
					if (payload.visibility) {
						const apiKey =
							constants.reverseGoalVisibilityMapping[payload.visibility];
						if (apiKey) {
							childResult.visibility = { [apiKey]: true };
						}
					}
					if (payload.cycle) childResult.cycleName = payload.cycle;
					if (payload.level) {
						childResult.level =
							constants.reverseGoalLevelMapping[payload.level] || payload.level;
					}

					// Child goals don't have nested children in this flow
					// Do not include tasksAndChildGoals or participants for child goals

					return childResult;
				}
			}

			// If no matching child goal found, fall through to parent conversion
		}

		// Parent goal conversion (existing behavior)
		const result = {};

		if (payload.goalName) result.name = payload.goalName;
		if (payload.goalDescription) result.content = payload.goalDescription;

		if (payload.owner) {
			result.assigneeDetails = { fullName: payload.owner };
		}

		if (payload.status) {
			result.status =
				constants.reverseGoalStatusMapping[payload.status] || payload.status;
		}

		if (payload.progress !== undefined) {
			result.currentProgress = Number(payload.progress) || 0;
		}

		if (payload.visibility) {
			const apiKey = constants.reverseGoalVisibilityMapping[payload.visibility];
			if (apiKey) {
				result.visibility = { [apiKey]: true };
			}
		}

		if (payload.cycle) result.cycleName = payload.cycle;

		if (payload.level) {
			result.level =
				constants.reverseGoalLevelMapping[payload.level] || payload.level;
		}

		if (payload.parentGoal) {
			result.alignment = { parent: { name: payload.parentGoal } };
		}

		if (
			Array.isArray(payload.supportingItem) &&
			payload.supportingItem.length > 0
		) {
			result.tasksAndChildGoals = payload.supportingItem.map((item) => {
				const child = { type: item.type, name: item.title };
				if (item.type === "TASK" && item.metric) {
					child.okrMetric = {
						metricType:
							constants.reverseGoalMetricMapping[item.metric] ||
							item.metric.toUpperCase(),
					};
					if (item.startValue !== undefined) child.startValue = item.startValue;
					if (item.targetValue !== undefined) child.endValue = item.targetValue;
					if (item.currentValue !== undefined) {
						child.currentValue = item.currentValue;
					} else {
						child.currentValue = 0;
					}
				}
				return child;
			});
		}

		if (
			Array.isArray(payload.participants) &&
			payload.participants.length > 0
		) {
			result.participants = payload.participants.map((p) => ({
				fullName: p.owner,
				role: p.role ? p.role.toUpperCase() : p.role,
			}));
		}

		return result;
	},

	getPointsApiEndpoint: "/api/highfives/reports/employee/points",
	engageOverviewGroupByOptions: [
		"Department",
		"Job Title",
		"Manager",
		"Tenure",
		"Tags",
		"custom dropdown",
		"Gender",
		"Country",
		"Location",
		"Reporting Factors",
	],
	engageOverviewFilterByOptions: [
		"Department",
		"Job Title",
		"Manager",
		"Tenure",
		"Tags",
		"Question & Answers",
		"custom dropdown",
		"Country",
		"Gender",
		"Location",
	],

	DUMMY_API_URL: "https://api.escuelajs.co/api/v1/auth/profile",
	DUMMY_API_HEADERS: (accessToken) => [
		{ key: "Authorization", value: `Bearer ${accessToken}` },
	],
	/**
	 * Function to get Messaging Template Update API Endpoint
	 * @param {string} surveyId - The survey ID
	 * @returns {string} The API endpoint for updating messaging template
	 * @example
	 * const apiEndpoint = constants.getMessagingTemplateUpdateEndpoint(surveyId);
	 * // Returns: "/api/internal/engagement/123/template/"
	 */
	getMessagingTemplateUpdateEndpoint: (surveyId) =>
		`/api/internal/engagement/${surveyId}/template/`,

	managerReportReadyEmailSubject: "Your Report is now available",

	// Rating Scale Options for engage
	RATING_SCALE_OPTIONS: {
		SCALE_5: "5 Point scale",
		SCALE_7: "7 Point scale",
		SCALE_10: "10 Point scale",
	},
	bulkDownloadReportsEmailSubject: "Reports are ready for download",

	Department_cropped_Img: "TSAP/Data/Resources/department-cropped.jpeg",
	Email_Header_Img: "TSAP/Data/Resources/email-header.png",
	Custom_Header_Img: "TSAP/Data/Resources/custom-header-img.png",
	Custom_Branding_Logo: "TSAP/Data/Resources/departcoverimg.jpeg",

	PERFORMANCE_ROLES: ["Self", "Peer", "Reportee", "Manager", "Guest"],

	PERFORMANCE_DEFAULT_COMPETENCIES: {
		Leadership: "Leadership Skills",
		Communication: "Communication Skills",
		Team: "Team Skills",
		Organizational: "Organizational Skills",
		Creativity: "Creativity Skills",
		Interpersonal: "Interpersonal Skills",
		OrganizationalAlignment: "Organizational Alignment",
	},

	PERFORMANCE_DEFAULT_QUESTIONS: {
		S1Q1: "Exhibits leadership qualities in their current role at the organization.",
		S2Q2: "Actively listens to others.",
		S3Q2: "Treats each and every team member with respect",
	},

	Performance_Reports_snapshot_file: "Performance_Report_Snapshot.yaml",

	Performance_Reports_snapshots_scenarios: {
		peer_disabled: "peer_disabled",
		custom_disabled: "custom_disabled",
		label_change: "label_change",
		goal_based_report: "goal_based_report",
		default_clubbed_with_default: "default_clubbed_with_default",
		default_clubbed_with_custom: "default_clubbed_with_custom",
		custom_and_default_excluded: "custom_and_default_excluded",
		for_roles_excluded_and_combined: "for_roles_excluded_and_combined",
		exclude_self_evaluation_from_average_calculation:
			"exclude_self_evaluation_from_average_calculation",
		// MCQ Scenarios - Subject Reports (3 variations: show roles, hide roles, show name)
		mcq_show_roles_subject: "mcq_show_roles_subject",
		mcq_hide_roles_subject: "mcq_hide_roles_subject",
		mcq_show_name_subject: "mcq_show_name_subject",
		// MCQ Scenarios - Manager Reports
		mcq_show_roles_manager: "mcq_show_roles_manager",
		mcq_hide_roles_manager: "mcq_hide_roles_manager",
		mcq_show_name_manager: "mcq_show_name_manager",
		// MCQ Scenarios - Department Reports
		mcq_show_roles_department: "mcq_show_roles_department",
		mcq_hide_roles_department: "mcq_hide_roles_department",
		mcq_show_name_department: "mcq_show_name_department",
		// MCQ Scenarios - Organization Reports
		mcq_show_roles_organization: "mcq_show_roles_organization",
		mcq_hide_roles_organization: "mcq_hide_roles_organization",
		mcq_show_name_organization: "mcq_show_name_organization",
	},

	Performance_Reports_sections: {
		participants: "section_participants",
		competency_summary: "section_competency_summary",
		detailed_feedback: "section_detailed_feedback",
		goal_summary: "section_goal_summary",
		areas_of_improvement: "section_areas_of_improvement",
		blind_spots: "section_blindspots",
	},
	createOneOnOneDetails: {
		participantName: envDetails.goalsUserName,
		participantEmail: envDetails.goalsUserEmail,
		meetingTitle: CommonUtils.generateRandomText(6),
		startTime: "08:00 AM",
		endTime: "09:00 AM",
		frequency: "Once",
		syncToCalendar: true,
		agendaTemplate: "1:1 Work-Life Balance Agenda Checklist",
		talkingPoints: ["Discuss work-life balance", "Discuss career development"],
		actionitems: true,
		previousPointsOfMeeting: false,
	},
	editOneOnOneDetails: {
		participantName: envDetails.goalsUserName,
		participantEmail: envDetails.goalsUserEmail,
		editMeetingTitle: CommonUtils.generateRandomText(6),
		startTime: "01:00 PM",
		endTime: "02:00 PM",
		frequency: "Once",
		agendaTemplate: "1:1 Work-Life Balance Agenda Checklist",
		talkingPoints: [
			"Discuss work-life balance-edited",
			"Discuss career development-edited",
		],
	},

	/**
	 * Function to get Evaluator Email Subject
	 *
	 * @param {Promise<string>} subjectName - Name of the Subject
	 */
	getEvaluatorEmailSubject(subjectName) {
		return `Please assess ${subjectName}`;
	},

	/**
	 * Function to get Evaluator Email Body
	 *
	 * @param {string} evaluatorName - Evaluator Name
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getevaluatorEmailBody(evaluatorName, subjectName, surveyName) {
		return `Invite to Evaluate Subject Dear ${evaluatorName}, You have been invited to assess Evaluate ${subjectName} › as a part of ${surveyName} (Yearly 360 feedback) Please submit your honest feedback which will help subject(s) to improve their career. If you have any questions, please feel free to reach out. Best,HR Team ©2026 SurveySparrow Inc. All rights reserved. Unsubscribe`;
	},

	/**
	 * Function to get Evaluator Reminder Email Body
	 *
	 * This function generates a reminder email body for evaluators who haven't completed
	 * their peer evaluation. It creates a personalized message that includes the evaluator's
	 * name and subject name to encourage completion of the assessment.
	 *
	 * @param {string} evaluatorName - The name of the evaluator who needs to complete the assessment
	 * @param {string} subjectName - The name of the subject being evaluated
	 * @returns {string} A formatted reminder email body message
	 *
	 * @example
	 * const reminderEmail = getevaluatorReminderEmailBody("John Smith", "Jane Doe");
	 * Returns: "Reminder to Evaluate Subjects Dear John Smith, We have noticed that your peer evaluation of Evaluate Jane Doe is incomplete. We kindly request you to complete assessment at the earliest!"
	 *
	 */
	getevaluatorReminderEmailBody(evaluatorName, subjectName) {
		return `Reminder to Evaluate Subjects Dear ${evaluatorName}, We have noticed that your peer evaluation of ${subjectName} is incomplete. We kindly request you to complete assessment at the earliest!`;
	},

	/**
	 * Function to get Approver Reminder Email Body
	 *
	 * @param {Array<string>} subjectNames - Subject Names
	 * @param {string} approverName - Approver Name
	 */
	getapproverReminderEmailBody(subjectNames, approverName) {
		const subjects = Array.isArray(subjectNames)
			? subjectNames
			: [subjectNames];
		const evaluatorLines = subjects
			.map((subject) => `Approve Evaluators of ${subject} ›`)
			.join("\n");
		return `Reminder to Approve Evaluators Dear ${approverName}, This is a reminder email to approve the evaluators for ${evaluatorLines}. You can review, approve or amend the evaluators by logging in to the portal. ${evaluatorLines} 's assessment can be started only after your approval, so we request you to complete this at the earliest. Please do not hesitate to reach out if you have any questions. Best, HR Team`;
	},

	/**
	 * Function to get Self Email Body
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getSelfEmailBody(subjectName, surveyName) {
		return `Invite to Self Assessment Dear ${subjectName}, You have been invited to complete a self-assessment as a part of ${surveyName} (Yearly 360 feedback) If you have any questions, please feel free to reach out. Best,HR Team GET STARTED ©2026 SurveySparrow Inc. All rights reserved. Unsubscribe`;
	},

	/**
	 * Function to get Self Title Edited
	 * @param {boolean} [addVariable=false] - Whether to include the subject name variable in the title
	 *
	 * This function generates a formatted title message for survey invitations.
	 * When addVariable is true, it appends the subject name to the title.
	 * When addVariable is false, it returns just the base edited title.
	 *
	 * @example
	 * // Get title without variable
	 * const title = constants.getSelfTitleEdited();
	 * // Returns: "Edited!"
	 *
	 * // Get title with variable
	 * const titleWithVar = constants.getSelfTitleEdited(true);
	 * // Returns: "Edited! John Doe" (assuming subjectName is "John Doe")
	 *
	 * @returns {string} A formatted title message for survey invitation
	 */
	getSelfTitleEdited(addVariable = false) {
		if (addVariable) {
			return "Edited!" + " " + constants.subjectName;
		} else {
			return "Edited!";
		}
	},

	/**
	 * Function to get Self Body Without Title Edited
	 * @param {string} surveyName - The name of the survey
	 * @param {boolean} [addVariable=false] - Whether to include the subject name variable in the body
	 *
	 * This function generates the body content for survey invitations without the title.
	 * It includes survey-specific information and HR team signature.
	 * When addVariable is true, it appends the subject name to the body content.
	 *
	 * @example
	 * // Get body without variable
	 * const body = constants.getSelfBodyWithoutTitleEdited("Performance Review 2024");
	 * // Returns: "You have been invited to complete a self-assessment as a part of Performance Review 2024 (Yearly 360 feedback) If you have any questions, please feel free to reach out. Best,HR Team "
	 *
	 * // Get body with variable
	 * const bodyWithVar = constants.getSelfBodyWithoutTitleEdited("Performance Review 2024", true);
	 * // Returns: "You have been invited to complete a self-assessment as a part of Performance Review 2024 (Yearly 360 feedback) If you have any questions, please feel free to reach out. Best,HR Team John Doe"
	 *
	 * @returns {string} A formatted body message for survey invitation
	 */
	getSelfBodyWithoutTitleEdited(surveyName, addVariable = false) {
		if (addVariable) {
			return (
				`You have been invited to complete a self-assessment as a part of ${surveyName} (Yearly 360 feedback) If you have any questions, please feel free to reach out. Best,HR Team Unsubscribe` +
				" " +
				constants.subjectName
			);
		} else {
			return `You have been invited to complete a self-assessment as a part of ${surveyName} (Yearly 360 feedback) If you have any questions, please feel free to reach out. Best,HR Team Unsubscribe`;
		}
	},

	/**
	 * Function to get Self Email Body Edited
	 * @param {string} surveyName - The name of the survey
	 * @param {boolean} [addVariable=false] - Whether to add the variable in the body
	 *
	 * This function generates the complete email body content for survey invitations.
	 * It combines the title and body content, and includes a "GET STARTED" call-to-action.
	 * When addVariable is true, it includes the subject name variable in both title and body.
	 *
	 * @example
	 * // Get complete email body without variable
	 * const emailBody = constants.getSelfEmailBodyEdited("Performance Review 2024");
	 * // Returns: "Edited! You have been invited to complete a self-assessment as a part of Performance Review 2024 (Yearly 360 feedback) If you have any questions, please feel free to reach out. Best,HR Team GET STARTED"
	 *
	 * // Get complete email body with variable
	 * const emailBodyWithVar = constants.getSelfEmailBodyEdited("Performance Review 2024", true);
	 * // Returns: "Edited! John Doe You have been invited to complete a self-assessment as a part of Performance Review 2024 (Yearly 360 feedback) If you have any questions, please feel free to reach out. Best,HR Team John Doe GET STARTED"
	 *
	 * @returns {string} A complete formatted email body message for survey invitation
	 */
	getSelfEmailBodyEdited(surveyName, addVariable = false) {
		if (addVariable) {
			return (
				this.getSelfTitleEdited(true) +
				" " +
				this.getSelfBodyWithoutTitleEdited(surveyName, true) +
				" GET STARTED Unsubscribe"
			);
		} else {
			return (
				this.getSelfTitleEdited(false) +
				" " +
				this.getSelfBodyWithoutTitleEdited(surveyName, false) +
				"GET STARTED ©2026 SurveySparrow Inc. All rights reserved. Unsubscribe"
			);
		}
	},

	/**
	 * Function to get Self Email Subject Edited
	 * @param {boolean} [addVariable=false] - Whether to add the variable in the subject
	 *
	 * This function generates a formatted email subject for survey invitations.
	 * When addVariable is true, it appends the subject name to the subject line.
	 * When addVariable is false, it returns just the base edited subject.
	 *
	 * @example
	 * // Get subject without variable
	 * const subject = constants.getSelfEmailSubjectEdited();
	 * // Returns: "Subject Edited!"
	 *
	 * // Get subject with variable
	 * const subjectWithVar = constants.getSelfEmailSubjectEdited(true);
	 * // Returns: "Subject Edited! John Doe" (assuming subjectName is "John Doe")
	 *
	 * @returns {string} A formatted email subject for survey invitation
	 */

	getSelfEmailSubjectEdited(addVariable = false) {
		if (addVariable) {
			return "Subject Edited!" + " " + constants.subjectName;
		} else {
			return "Subject Edited!";
		}
	},

	/**
	 * Function to get Engage Email Body
	 *
	 * @param {string} participantName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getEngageEmailBody(participantName, surveyName) {
		return `Your Feedback Matters! Hey ${participantName}, Drumroll, please! An engagement survey - ${surveyName}, is about to make a grand entrance. Even a small nugget of feedback helps in building a thriving workplace for you. Happy Surveying!`;
	},

	/**
	 * Function to get reminder email subject
	 *
	 * @param {Promise<string>} subjectName - Name of the Subject
	 */
	getReminderEmailSubject(subjectName) {
		return `Reminder: Please assess ${subjectName}`;
	},
	/**
	 * Function to get PPT Ready Body
	 *
	 * @param {string} adminName - Admin Name
	 * @param {string} surveyName - Survey Name
	 * @param {string} pptName - PPT Name
	 */

	/**
	 * Function to get Pulse Email Body
	 *
	 * @param {string} participantName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getPulseEmailBody(participantName, surveyName) {
		return `Your Pulse Survey Awaits! Hey ${participantName}, Get ready for a quick pulse check! Our pulse survey - ${surveyName}, is gearing up to capture your immediate thoughts. Even the tiniest bit of feedback contributes to shaping a dynamic workplace just for you.`;
	},

	/**
	 * Function to get Engage Email Body
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getEngageEmailBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},Drumroll, please! An engagement survey -  ${surveyName}, is about to make a grand entrance. Even a small nugget of feedback helps in building a thriving workplace for you.`;
	},

	/**
	 * Function to get Engage Email reminder Body
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getEngageEmailReminderBody(subjectName, surveyName) {
		return `Your Voice Matters! Hey ${subjectName},Just a gentle reminder that your thoughts and feedback are important to us. Our engagement survey - ${surveyName},  is awaiting your response.`;
	},

	/**
	 * Function to get Engage Email Body
	 *
	 * This function generates a customized email body for engagement survey invitations.
	 * It creates a personalized message that includes the subject's name and survey name
	 * to encourage participation in the engagement survey with an edited format.
	 *
	 * @param {string} subjectName - The name of the person receiving the survey invitation
	 * @param {string} surveyName - The name of the engagement survey
	 * @returns {string} A formatted email body message for survey invitation
	 *
	 * @example
	 * const emailBody = getEngageEmailBodyEdited("John Doe", "Q4 Employee Engagement Survey");
	 * Returns: "Your Feedback Matters Edited! Hey John Doe,Drumroll, please! An engagement survey - Q4 Employee Engagement Survey, is about to make a grand entrance. Even a small nugget of feedback helps in building a thriving workplace for you."
	 *
	 */
	getEngageEmailBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},Drumroll, please! An engagement survey -  ${surveyName}, is about to make a grand entrance. Even a small nugget of feedback helps in building a thriving workplace for you.`;
	},

	/**
	 * Function to get Engage Email reminder Body
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getEngageEmailReminderBody(subjectName, surveyName) {
		return `Your Voice Matters! Hey ${subjectName},Just a gentle reminder that your thoughts and feedback are important to us. Our engagement survey - ${surveyName},  is awaiting your response.`;
	},

	/**
	 * Function to get Engage Email reminder Body
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getEngageEmailBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},Drumroll, please! An engagement survey -  ${surveyName}, is about to make a grand entrance. Even a small nugget of feedback helps in building a thriving workplace for you.`;
	},

	/**
	 * Function to get Engage Email Body reminder edited
	 *
	 * This function generates a customized email body for engagement survey reminders.
	 * It creates a personalized message that includes the subject's name and survey name
	 * to encourage participation in the engagement survey.
	 *
	 * @param {string} subjectName - The name of the person receiving the reminder email
	 * @param {string} surveyName - The name of the engagement survey
	 * @returns {string} A formatted email body message
	 *
	 * @example
	 * const emailBody = getEngageEmailReminderBodyEdited("John Doe", "Q4 Employee Engagement Survey");
	 * Returns: "Your Feedback Matters Edited! Hey John Doe,Just a gentle reminder that your thoughts and feedback are important to us. Our engagement survey - Q4 Employee Engagement Survey, is awaiting your response."
	 *
	 */
	getEngageEmailReminderBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},Just a gentle reminder that your thoughts and feedback are important to us. Our engagement survey - ${surveyName}, is awaiting your response.`;
	},

	/**
	 * Function to get Engage Email Body
	 *
	 * This function generates a customized email body for engagement survey invitations.
	 * It creates a personalized message that includes the subject's name and survey name
	 * to encourage participation in the engagement survey with an edited format.
	 *
	 * @param {string} subjectName - The name of the person receiving the survey invitation
	 * @param {string} surveyName - The name of the engagement survey
	 * @returns {string} A formatted email body message for survey invitation
	 *
	 * @example
	 * const emailBody = getEngageEmailBodyEdited("John Doe", "Q4 Employee Engagement Survey");
	 * Returns: "Your Feedback Matters Edited! Hey John Doe,Drumroll, please! An engagement survey - Q4 Employee Engagement Survey, is about to make a grand entrance. Even a small nugget of feedback helps in building a thriving workplace for you."
	 *
	 */
	getEngageEmailBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},Drumroll, please! An engagement survey -  ${surveyName}, is about to make a grand entrance. Even a small nugget of feedback helps in building a thriving workplace for you.`;
	},

	/**
	 * Function to get Engage Email reminder Body
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getEngageEmailReminderBody(subjectName, surveyName) {
		return `Your Voice Matters! Hey ${subjectName},Just a gentle reminder that your thoughts and feedback are important to us. Our engagement survey - ${surveyName},  is awaiting your response.`;
	},

	/**
	 * Function to get Pulse Email Body reminder edited
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getPulseEmailReminderBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},A friendly nudge to let you know that your insights hold value. Our pulse survey - ${surveyName}, eagerly anticipates your response.`;
	},

	/**
	 * Function to get Engage Email Body
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getEngageEmailBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},Drumroll, please! An engagement survey -  ${surveyName}, is about to make a grand entrance. Even a small nugget of feedback helps in building a thriving workplace for you.`;
	},

	/**
	 * Function to get Engage Email Body reminder edited
	 *
	 * This function generates a customized email body for engagement survey reminders.
	 * It creates a personalized message that includes the subject's name and survey name
	 * to encourage participation in the engagement survey.
	 *
	 * @param {string} subjectName - The name of the person receiving the reminder email
	 * @param {string} surveyName - The name of the engagement survey
	 * @returns {string} A formatted email body message
	 *
	 * @example
	 * const emailBody = getEngageEmailReminderBodyEdited("John Doe", "Q4 Employee Engagement Survey");
	 * Returns: "Your Feedback Matters Edited! Hey John Doe,Just a gentle reminder that your thoughts and feedback are important to us. Our engagement survey - Q4 Employee Engagement Survey, is awaiting your response."
	 *
	 */
	getEngageEmailReminderBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},Just a gentle reminder that your thoughts and feedback are important to us. Our engagement survey - ${surveyName}, is awaiting your response.`;
	},

	/**
	 * Function to get Engage Email reminder Body
	 *
	 * This function generates a customized email body for pulse survey reminders.
	 * It creates a personalized message that includes the subject's name and survey name
	 * to encourage participation in the pulse survey with a friendly reminder tone.
	 *
	 * @param {string} subjectName - The name of the person receiving the pulse survey reminder
	 * @param {string} surveyName - The name of the pulse survey
	 * @returns {string} A formatted email body message for pulse survey reminder
	 *
	 * @example
	 * const emailBody = getPulseEmailReminderBody("Jane Smith", "Weekly Pulse Check");
	 * Returns: "Your Pulse Check Counts! Hey Jane Smith, A friendly nudge to let you know that your insights hold value. Our pulse survey - Weekly Pulse Check, eagerly anticipates your response."
	 *
	 */
	getPulseEmailReminderBody(subjectName, surveyName) {
		return `Your Pulse Check Counts! Hey ${subjectName}, A friendly nudge to let you know that your insights hold value. Our pulse survey - ${surveyName}, eagerly anticipates your response.`;
	},

	/**
	 * Function to get Pulse Email Body reminder edited
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getPulseEmailReminderBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName},A friendly nudge to let you know that your insights hold value. Our pulse survey - ${surveyName}, eagerly anticipates your response.`;
	},

	/**
	 * Function to get QR Email Body
	 *
	 * @param {string} participantName - Participant Name
	 * @param {string} surveyName - Survey Name
	 * @returns {string} - QR Email Body
	 */
	getQREmailBody(participantName, surveyName) {
		return `${surveyName} Hi ${participantName}, We are conducting a quick survey for ${surveyName} to gather valuable feedback from our employees. Attached is a QR code for the survey. Could you please ensure this QR code is distributed and displayed prominently so that all employees can easily access it?`;
	},

	/** Function to get Report Ready Email Body
	 *
	 * @param {string} SubjectName - Subject Name
	 */
	getReportReadyEmailBody(subjectName) {
		return `Report Ready Email Dear ${subjectName}, Your 360 degree assessment has been completed and the report is ready! You can access the report any time in your 360 degree portal Please feel free to reach out if you have any questions. Best,HR Team ©2026 SurveySparrow Inc. All rights reserved. Unsubscribe`;
	},
	/**
	 * This function will return the email body content for the signup url
	 * @param {string} employeeName - The name of the employee
	 */
	getEmailBodyContentForSignupUrl(employeeName) {
		return `Greetings,${employeeName}!`;
	},

	/**
	 * Function to get Onboard Email Body
	 *
	 * @param {string} employeeName - Employee Name
	 */
	getOnboardEmailBody(employeeName) {
		return `Welcome aboard! Hey there, ${employeeName},A warm welcome to ThriveSparrow! We're excited to have you on board and help you and your organisation embark on a journey of success and growth.`;
	},

	/**
	 * Function to get Signup Welcome Email Body
	 *
	 * @param {string} employeeName - Employee Name
	 * @returns {string} - Signup Welcome Email Body
	 */
	getSignupWelcomeEmailBody(employeeName) {
		return `Welcome to ThriveSparrow! Hello, ${employeeName}, ThriveSparrow is all about creating a workplace where engagement is nurtured, talents are celebrated, and success knows no bounds. It's infused with the spirit of empowering your employees to thrive.`;
	},

	/**
	 * Function to get Sender Email
	 *
	 * @param {string} domainName - Domain Name
	 * @returns {string} - Sender Email
	 */
	getSenderEmail(domainName) {
		const emailDomain = envDetails.emailDomain;
		return `${domainName}@${emailDomain}`;
	},

	/**
	 * Function to get Pulse Email Body
	 *
	 * @param {string} participantName - Participant Name
	 * @param {string} surveyName - Survey Name
	 * @returns {string} - QR Email Body
	 */
	getPulseEmailBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName}, Get ready for a quick pulse check! Our pulse survey - ${surveyName}, is gearing up to capture your immediate thoughts. Even the tiniest bit of feedback contributes to shaping a dynamic workplace just for you.`;
	},

	/**
	 * Function to get Pulse Email Body
	 *
	 * @param {string} participantName - Participant Name
	 * @param {string} surveyName - Survey Name
	 * @returns {string} - QR Email Body
	 */
	getPulseEmailBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName}, Get ready for a quick pulse check! Our pulse survey - ${surveyName}, is gearing up to capture your immediate thoughts. Even the tiniest bit of feedback contributes to shaping a dynamic workplace just for you.`;
	},

	/**
	 * Function to get Pulse Email Body
	 *
	 * @param {string} subjectName - Subject Name
	 * @param {string} surveyName - Survey Name
	 */
	getPulseEmailBodyEdited(subjectName, surveyName) {
		return `Your Feedback Matters Edited! Hey ${subjectName}, Get ready for a quick pulse check! Our pulse survey - ${surveyName}, is gearing up to capture your immediate thoughts. Even the tiniest bit of feedback contributes to shaping a dynamic workplace just for you.`;
	},

	/**
	 * Function to get Goal Published Email Body
	 *
	 * @param {string} goalOwner - The name of the person who owns/is assigned the goal
	 * @param {string} goalName - The name of the goal that was assigned
	 * @returns {string} A formatted email body message for goal assignment notification
	 * @example
	 * const emailBody = getGoalPublishedEmailBody("John Doe", "My New Goal");
	 * Returns: "New Goal Assigned: My New Goal Hey John Doe, You've got a new goal to achieve: My New Goal. We're excited to see you dive into this! Click below to review the details and get started. You're going to do great—let's get started! Best, HR Team"
	 */
	getGoalPublishedEmailBody(goalOwner, goalName) {
		return `New Goal Assigned: ${goalName} Hey ${goalOwner}, You've got a new goal to achieve: ${goalName}. We're excited to see you dive into this! Click below to review the details and get started. You're going to do great—let's get started! Best, HR Team`;
	},

	/**
	 * Function to get Task Assigned Email Body
	 *
	 * @param {string} onwerName - The name of the person who is assigned the task
	 * @param {string} taskName - The name of the task that was assigned
	 * @returns {string} A formatted email body message for task assignment notification
	 * @example
	 * const emailBody = getTaskAssignedEmailBody("John Doe", "My New Task");
	 * Returns: "New Task Assigned: My New Task Hey John Doe, You've been assigned a new task: My New Task. Click below to see what's involved and get started. We're excited to see your progress! Best, HR Team"
	 */
	getTaskAssignedEmailBody(onwerName, taskName) {
		return `New Task Assigned: ${taskName} Hey ${onwerName}, You've been assigned a new task: ${taskName}. Click below to see what's involved and get started. We're excited to see your progress! Best, HR Team`;
	},

	edit_employee: {
		name: "Edited Name",
		nickName: "new nick name",
		employeeEmail: "thrive.automation+55@surveysparrowqa.com",
		department: departmentName,
		manager: managerName,
		jobtitle: jobtitleName,
		employeeId: "5",
		contactNumber: `+91${randomNum}${randomNum}`,
		//dateOfBirth: "01/01/2000",
		gender: "Male",
		location: "Chennai",
		//dateOfJoining:"01/01/2020"
	},

	// Metric types for tasks
	metricTypes: {
		number: "Number",
		percentage: "Percentage",
		currency: "Currency",
		decision: "Decision",
	},

	// Default employee properties
	defaultGender: "Male",
	defaultLocation: "Delhi",

	/**
	 * Generates the email body content for password reset notification
	 *
	 * @param {string} resetPasswordUser - The name of the employee requesting password reset
	 * @returns {string} - The formatted email body containing password reset email body
	 */
	getResetPasswordEmailBody(resetPasswordUser) {
		return `Hello ${resetPasswordUser}, It seems like you've forgotten your ThriveSparrow password. Don't worry! We've got your back. To get back into your account, all you need to do is click the button below and follow the steps to reset your password. This link will remain active for 1 hour from the time this email was sent. If you didn't request a password reset, feel free to ignore this email.
P.S. Your security is of utmost important to us. We don't share your password with anyone, neither should you :)`;
	},

	getSubjectReminderEmailBody(subjectName) {
		return `Reminder to Choose Evaluators Dear ${subjectName}, We are running a 360 degree assessment for you! As a part of this, please nominate the evaluators who can give feedback about you! Please choose at least 5 people from your managers, reportees & peers, etc. You can log in to the portal and click the Nominate button to add the evaluators. If you have any questions or difficulty logging into the portal please contact us! Best, HR Team`;
	},

	getSubjectReminderEmailSubject() {
		return "Reminder: Please nominate the evaluators for your 360 degree assessment";
	},

	getActionPlansEmailBody(subjectName, actionPlanName) {
		return `✅ ${actionPlanName} Assigned: Let’s Get Rolling! Hey ${subjectName}, You’ve been assigned an action plan!. let’s start making progress on those objectives!`;
	},

	/**
	 * Function to get Bulk Download Reports Email Body
	 *
	 * @param {string} recipientName - The name of the person receiving the email
	 * @returns {string} A formatted email body message for bulk download reports notification
	 * @example
	 * const emailBody = getBulkDownloadReportsEmailBody("John Doe");
	 * Returns: "Reports are ready for download Hey John Doe, Your reports are now ready for download. Click the button below to access your secure download link and get your reports without hassle. If you have any questions or need assistance, feel free to get in touch with us. Best, Team ThriveSparrow ©2026 ThriveSparrow Inc. All rights reserved."
	 */
	getBulkDownloadReportsEmailBody(recipientName) {
		return `Reports are ready for download Hey ${recipientName}, Your reports are now ready for download. Click the button below to access your secure download link and get your reports without hassle. If you have any questions or need assistance, feel free to get in touch with us. Best, Team ThriveSparrow ©2026 SurveySparrow Inc. All rights reserved.`;
	},

	/**
	 * Generates email body content for 360 degree assessment review report notifications
	 * @param {string} approverName - The full name of the employee who needs to review the report
	 * @param {string} subjectName - The full name of the subject whose 360 assessment was completed
	 * @returns {string} A formatted email body message for review report notification
	 * @example
	 * const emailBody = getReviewReportEmailBody("John Manager", "Jane Employee");
	 * Returns: "Dear John Manager, Jane Employee's 360 degree assessment has been completed by all evaluators..."
	 */
	getReviewReportEmailBody(approverName, subjectName) {
		return `Dear ${approverName}, ${subjectName}'s 360 degree assessment has been completed by all evaluators. Simply log in to the portal to review, add comments and approve the report to make it available for ${subjectName}. ${subjectName}'s report can be published only after your approval, so we request you to complete this at the earliest. Please do not hesitate to reach out if you have any questions.Best, HR Team`;
	},

	/**
	 * Generates email subject content for 360 degree assessment review report notifications
	 * @param {string} subjectName - The full name of the subject whose 360 assessment was completed
	 * @returns {string} A formatted email subject message for review report notification
	 * @example
	 * const emailSubject = getReviewReportEmailSubject("Jane Employee");
	 * Returns: "Please review Jane Employee's Report"
	 */
	getReviewReportEmailSubject(subjectName) {
		return `Please review ${subjectName}'s Report`;
	},
	/**
	 * Generates a payload for creating a goal.
	 *
	 * @param {string} scenario - The scenario for which the goal is being created.
	 * @param {string} owner - The owner of the goal.
	 * @param {string} parentGoalName - The name of the parent goal.
	 * @param {string} importedChildGoalName - The name of the imported child goal.
	 * @returns {Object} The payload for creating a goal.
	 * @example
	 * const goalPayload = getGoalCreatePayload("goal_with_supporting_goal", "John Doe", "Parent Goal", "Imported Child Goal");
	 * Returns: {
	 *   goalName: "My New Goal",
	 *   goalDescription: "Description here",
	 *   owner: "John Doe",
	 *   visibility: "Public",
	 *   level: "Org",
	 *   cycle: "Test Automation Y 2024",
	 *   supportingItem: [{ type: "GOAL", title: "Support Goal", owner: "Jane Smith" }]
	 * }
	 */
	/**
	 * Creates a goal payload for testing with flexible configuration options.
	 *
	 * @param {Object} options - Configuration object
	 * @param {string} [options.scenario] - Scenario type (e.g., "goal_with_participants", "goal_with_supporting_task")
	 * @param {string} [options.owner] - Owner name for the goal
	 * @param {string} [options.goalName] - Custom goal name (if not provided, generates random)
	 * @param {string} [options.goalDescription] - Custom goal description (if not provided, generates random)
	 * @param {string} [options.parentGoalName] - Parent goal name for alignment
	 * @param {string} [options.importedChildGoalName] - Name of goal to import/browse
	 * @param {string} [options.visibility] - Visibility setting (if not provided, picks random)
	 * @param {string} [options.level] - Goal level (if not provided, picks random)
	 * @param {string} [options.cycle] - Goal cycle (if not provided, uses envDetails.goalCycle)
	 * @param {string} [options.status] - Goal status (default: "Not Started")
	 * @param {string} [options.progress] - Goal progress (default: "0")
	 * @param {Array<Object>} [options.tasks] - Custom tasks to add. If not provided, no tasks will be created (empty array)
	 * @param {string} options.tasks[].title - Task title/name
	 * @param {string} options.tasks[].metric - Metric type: "Number", "Percentage", "Currency", "Decision"
	 * @param {number} [options.tasks[].startValue] - Start value (for Number, Percentage, Currency)
	 * @param {number} [options.tasks[].targetValue] - Target value (for Number, Percentage, Currency)
	 * @param {string} [options.tasks[].unit] - Unit for Currency metric (e.g., "Indian Rupee", "US Dollar")
	 * @param {string} [options.tasks[].owner] - Task owner (if different from goal owner)
	 * @param {Array<Object>} [options.supportingItems] - Custom supporting items (goals/tasks) - overrides tasks parameter and scenario
	 *
	 * @returns {Object} Goal payload object
	 *
	 * @example
	 * // Simple goal with random name
	 * getGoalCreatePayload({ owner: "John Doe" })
	 *
	 * @example
	 * // Goal with custom name and scenario
	 * getGoalCreatePayload({
	 *   goalName: "Increase Revenue",
	 *   scenario: "goal_with_supporting_task",
	 *   owner: "John Doe"
	 * })
	 *
	 * @example
	 * // Goal with custom tasks
	 * getGoalCreatePayload({
	 *   owner: "John Doe",
	 *   scenario: "goal_with_supporting_task",
	 *   tasks: [
	 *     { title: "Complete Market Research", metric: "Decision" },
	 *     { title: "Achieve 85% Satisfaction", metric: "Percentage", startValue: 70, targetValue: 85 },
	 *     { title: "Generate $50K Revenue", metric: "Currency", unit: "US Dollar", startValue: 0, targetValue: 50000 }
	 *   ]
	 * })
	 *
	 * @example
	 * // Goal with parent goal
	 * getGoalCreatePayload({
	 *   owner: "John Doe",
	 *   scenario: "goal_with_parent_goal",
	 *   parentGoalName: "Q4 Targets"
	 * })
	 */
	getGoalCreatePayload({
		scenario,
		owner,
		goalName,
		goalDescription,
		parentGoalName,
		importedChildGoalName,
		visibility,
		level,
		cycle,
		status = "Not Started",
		progress = "0",
		tasks,
		supportingItems,
	} = {}) {
		const defaultPayload = {
			type: "GOAL",
			goalName: goalName || CommonUtils.generateRandomText(10),
			goalDescription: goalDescription || CommonUtils.generateRandomText(10),
			owner,
			status,
			progress,
			visibility:
				visibility ||
				constants.VISIBILITY[
					Math.floor(Math.random() * constants.VISIBILITY.length)
				],
			level:
				level ||
				constants.GOAL_LEVELS[
					Math.floor(Math.random() * constants.GOAL_LEVELS.length)
				],
			cycle: cycle || envDetails.goalCycle,
		};

		const participants = [
			{ role: "Manager", owner: constants.subjectName3 },
			{ role: "Watcher", owner: constants.subjectName4 },
			{ role: "Contributor", owner: constants.subjectName5 },
		];

		const importedGoal = () => ({
			type: "GOAL",
			title: importedChildGoalName,
			toBrowse: true,
		});

		const randomGoal = () => ({
			type: "GOAL",
			title: CommonUtils.generateRandomText(7),
		});
		const randomTask = () => ({
			type: "TASK",
			title: CommonUtils.generateRandomText(7),
			metric: "Decision",
		});

		// Helper function to build task from configuration
		const buildTask = (taskConfig) => {
			const task = {
				type: "TASK",
				title: taskConfig.title || CommonUtils.generateRandomText(7),
				metric: taskConfig.metric || "Decision",
				currentValue: taskConfig.currentValue || 0,
			};

			// Add metric-specific fields
			if (["Number", "Percentage", "Currency"].includes(task.metric)) {
				task.startValue =
					taskConfig.startValue !== undefined
						? taskConfig.startValue
						: Math.ceil(Math.random() * 100);
				task.targetValue =
					taskConfig.targetValue !== undefined
						? taskConfig.targetValue
						: Math.ceil(Math.random() * 100);

				// Ensure targetValue is different from startValue if not specified
				if (taskConfig.targetValue === undefined) {
					while (task.targetValue === task.startValue) {
						task.targetValue = Math.ceil(Math.random() * 100);
					}
				}
			}

			// Add unit for Currency metric
			if (task.metric === "Currency") {
				task.unit = taskConfig.unit || "Indian Rupee";
			}

			// Add owner if specified
			if (taskConfig.owner) {
				task.owner = taskConfig.owner;
			}

			return task;
		};

		const scenarioMap = {
			goal_only: () => ({
				...defaultPayload,
			}),
			goal_with_participants: () => ({
				...defaultPayload,
				participants: [...participants],
			}),
			goal_with_parent_goal: () => ({
				...defaultPayload,
				parentGoal: parentGoalName,
			}),
			goal_with_supporting_goal: () => ({
				...defaultPayload,
				supportingItem: [
					{ type: "GOAL", title: CommonUtils.generateRandomText(7) },
				],
			}),
			goal_with_child_goal_import: () => ({
				...defaultPayload,
				supportingItem: [importedGoal()],
			}),
			goal_with_supporting_goal_and_participants: () => ({
				...defaultPayload,
				supportingItem: [randomGoal()],
				participants: [...participants],
			}),
			goal_with_supporting_task: () => ({
				...defaultPayload,
				supportingItem: tasks ? tasks.map(buildTask) : [],
			}),
			goal_with_supporting_goal_and_task: () => ({
				...defaultPayload,
				supportingItem: [randomGoal(), randomTask()],
			}),
			goal_with_supporting_task_and_participants: () => ({
				...defaultPayload,
				supportingItem: [randomTask()],
				participants: [...participants],
			}),
			goal_with_parent_goal_and_supporting_goal: () => ({
				...defaultPayload,
				parentGoal: parentGoalName,
				supportingItem: [randomGoal()],
			}),
			goal_with_parent_goal_and_supporting_task: () => ({
				...defaultPayload,
				parentGoal: parentGoalName,
				supportingItem: [randomTask()],
			}),
			goal_with_parent_goal_and_supporting_goal_and_task: () => ({
				...defaultPayload,
				parentGoal: parentGoalName,
				supportingItem: [randomGoal(), randomTask()],
			}),
			goal_with_child_goal_import_and_supporting_goal: () => ({
				...defaultPayload,
				supportingItem: [importedGoal(), randomGoal()],
			}),
			goal_with_parent_goal_and_supporting_goal_and_task_and_participants:
				() => ({
					...defaultPayload,
					parentGoal: parentGoalName,
					supportingItem: [randomGoal(), randomTask()],
					participants: [...participants],
				}),
		};

		// Get the payload from scenario or use default
		const payload = scenarioMap[scenario]?.() || defaultPayload;

		// Override supportingItem if supportingItems parameter is provided
		if (supportingItems) {
			payload.supportingItem = supportingItems;
		}

		return payload;
	},

	/**
	 * Builds the `actionPlanData` object passed to `createActionPlan` (Goals / Performance reports).
	 *
	 * @param {Object} [options] - Configuration object
	 * @param {string} [options.title] - Action plan title (default: random "Performance Action …")
	 * @param {string} [options.assigneeName] - Assignee display name (default: `envDetails.goalsUserName`)
	 * @param {string} [options.assigneeEmail] - Assignee email (default: `envDetails.goalsUserEmail`)
	 * @param {string} [options.creatorEmail] - Creator email (default: `envDetails.adminEmail`)
	 * @param {string} [options.description] - Plan description (default: performance-style description; use `""` to omit filling description in UI)
	 * @param {string} [options.source] - Survey name for CSV **Source** (caller-supplied only; never generated here). Use `EntityIds.getsurveyName()` when the plan is tied to the current survey.
	 * @param {Array<{ title: string, status: string }>} [options.checklist] - Checklist rows; default depends on `scenario`
	 * @param {string} [options.scenario] - Preset: `"default_checklist"` | `"empty_checklist"` | `"single_checklist_completed"`
	 * @returns {Object} Action plan creation payload: `{ title, assigneeName, assigneeEmail, creatorEmail, description, checklist, source? }`
	 *
	 * @example
	 * const actionPlanData = constants.getActionPlanCreatePayload({
	 *   title: actionPlanTitle,
	 *   source: EntityIds.getsurveyName(),
	 * });
	 * // actionPlanData → { title, assigneeName, assigneeEmail, creatorEmail, description, checklist: [{ title, status }, ...], source }
	 */
	getActionPlanCreatePayload({
		title,
		assigneeName = envDetails.goalsUserName,
		assigneeEmail = envDetails.goalsUserEmail,
		creatorEmail = envDetails.adminEmail,
		description = "Performance Action Plan Description",
		source,
		checklist,
		scenario = "default_checklist",
	} = {}) {
		const defaultChecklist = [
			{
				title: `Checklist_${CommonUtils.generateRandomText(8)}`,
				status: "completed",
			},
			{
				title: `Checklist_${CommonUtils.generateRandomText(8)}`,
				status: "not started",
			},
		];

		const singleCompletedChecklist = [
			{
				title: `Checklist_${CommonUtils.generateRandomText(8)}`,
				status: "completed",
			},
		];

		const defaultTitle = () =>
			`Performance Action ${CommonUtils.generateRandomText(8)}_${Date.now()}`;

		const buildPayload = (checklistItems) => {
			const payload = {
				title: title || defaultTitle(),
				assigneeName,
				assigneeEmail,
				creatorEmail,
				description,
				checklist: checklistItems,
			};
			if (source !== undefined && source !== null && source !== "") {
				payload.source = source;
			}
			return payload;
		};

		const scenarioMap = {
			default_checklist: () => buildPayload(checklist ?? defaultChecklist),
			empty_checklist: () => buildPayload(checklist ?? []),
			single_checklist_completed: () =>
				buildPayload(checklist ?? singleCompletedChecklist),
		};

		const builder = scenarioMap[scenario] || scenarioMap.default_checklist;
		return builder();
	},

	/**
	 * Function to get Quick Add Payload
	 *
	 * @param {Object} options - Options for generating the payload
	 * @param {string} options.scenario - (Mandatory) Scenario Name. Determines the structure and requirements of the payload.
	 * @param {string} [options.owner] - (Mandatory for all scenarios except imported child/parent scenarios) Owner Name.
	 * @param {string} [options.goalLevel] - (Mandatory for most scenarios. Optional for scenarios: "task_with_imported_parent", "goal_with_imported_parent", "goal_with_imported_child", "goal_with_children", "goal_with_children_and_krs", "goal_with_fixed_structure", "multiple_goals_random")
	 * @param {string} [options.visibility] - (Mandatory for most scenarios. Optional for scenarios: "task_with_imported_parent", "goal_with_imported_parent", "goal_with_imported_child", "goal_with_children", "goal_with_children_and_krs", "goal_with_fixed_structure", "multiple_goals_random")
	 * @param {number} [options.maxChildren=2] - (Optional) Maximum Number of Children (used in scenarios with children)
	 * @param {number} [options.maxKRs=2] - (Optional) Maximum Number of Key Results (used in scenarios with KRs)
	 * @param {string} [options.goalName] - (Optional) Goal Name. Auto-generated if not provided.
	 * @param {string} [options.goalDescription] - (Optional) Goal Description. Auto-generated if not provided.
	 * @param {string} [options.importedGoalName] - (Mandatory for scenarios involving imported parent, e.g., "goal_with_imported_parent", "task_with_imported_parent")
	 * @param {string} [options.importedChildName] - (Mandatory for "goal_with_imported_child" scenario)
	 * @param {string} [options.taskTitle] - (Optional) Task Title. Auto-generated if not provided.
	 * @returns {Array} - Quick Add Payload
	 *
	 * @example
	 * // Example: Creating a simple Org-level goal with no KRs
	 * const payload = constants.getQuickAddPayload({
	 *   scenario: "only_goal_no_krs",
	 *   goalLevel: "Org",
	 *   visibility: "Public",
	 *   owner: constants.subjectName,
	 * });
	 *
	 * // Example: Creating a goal with children and KRs
	 * const payload = constants.getQuickAddPayload({
	 *   scenario: "goal_with_children_and_krs",
	 *   goalLevel: "Team",
	 *   visibility: "Restricted",
	 *   owner: constants.subjectName,
	 *   maxChildren: 2,
	 *   maxKRs: 3,
	 * });
	 *
	 * // Example: Creating a task with imported parent goal
	 * const payload = constants.getQuickAddPayload({
	 *   scenario: "task_with_imported_parent",
	 *   owner: constants.subjectName2,
	 *   importedGoalName: "Parent Goal Name",
	 *   goalLevel: "Team",
	 *   visibility: "Restricted",
	 * });
	 *
	 * // Example: Fixed hierarchy — one child goal and one task (goalLevel/visibility default to Org/Public if omitted)
	 * const payload = constants.getQuickAddPayload({
	 *   scenario: "goal_with_fixed_structure",
	 *   owner: constants.subjectName,
	 * });
	 */
	getQuickAddPayload({
		scenario = "only_goal_no_krs",
		owner = constants.subjectName,
		goalLevel,
		visibility,
		maxChildren = 2,
		maxKRs = 2,
		goalName = `Goal_${CommonUtils.generateRandomText(8)}`,
		goalDescription = `Description_${CommonUtils.generateRandomText(12)}`,
		importedGoalName,
		importedChildName,
		taskTitle = `Task_${CommonUtils.generateRandomText(8)}`,
	} = {}) {
		if (
			(!goalLevel || !visibility) &&
			scenario !== "task_with_imported_parent" &&
			scenario !== "goal_with_imported_parent" &&
			scenario !== "goal_with_imported_child" &&
			scenario !== "goal_with_children" &&
			scenario !== "goal_with_children_and_krs" &&
			scenario !== "goal_with_fixed_structure" &&
			scenario !== "multiple_goals_random"
		) {
			throw new Error(
				"Both 'goalLevel' and 'visibility' must be specified for parent goals.",
			);
		}
		const getLowerGoalLevel = (currentLevel) => {
			const levels = constants.GOAL_LEVELS;
			switch (currentLevel) {
				case "Org":
					return CommonUtils.getRandomElement(levels);

				case "Department":
					return CommonUtils.getRandomElement([
						"Department",
						"Team",
						"Individual",
					]);

				case "Team":
					return CommonUtils.getRandomElement(["Team", "Individual"]);

				case "Individual":
					return "Individual";

				default:
					return currentLevel;
			}
		};

		const getLowerVisibility = (currentVisibility) => {
			const visibilities = constants.VISIBILITY;

			switch (currentVisibility) {
				case "Public":
					return CommonUtils.getRandomElement(visibilities);

				case "Private":
					return "Private";

				case "Restricted":
					return CommonUtils.getRandomElement(["Private", "Restricted"]);

				default:
					return currentVisibility;
			}
		};

		const randomKeyResult = () => {
			const metricType = CommonUtils.getRandomElement(constants.METRIC_TYPES);
			const kr = {
				type: "TASK",
				owner,
				title: `KR_${CommonUtils.generateRandomText(6)}`,
				startValue: Math.ceil(Math.random() * 100),
				targetValue: Math.ceil(Math.random() * 100),
				metric: metricType,
			};
			if (metricType === "Currency") kr.unit = "Indian Rupee";
			return kr;
		};

		const randomGoal = (
			depth = 0,
			parentGoalLevel = goalLevel,
			parentVisibility = visibility,
		) => {
			const addChildren = depth < 2 && Math.random() > 0.5;
			const addKRs = depth < 2 && Math.random() > 0.5;
			const childGoalLevel = getLowerGoalLevel(parentGoalLevel);
			const childVisibility = getLowerVisibility(parentVisibility);
			return {
				type: "GOAL",
				title: `ChildGoal_${CommonUtils.generateRandomText(7)}`,
				owner,
				goalLevel: childGoalLevel,
				visibility: childVisibility,
				keyResults: addKRs
					? Array.from(
							{ length: Math.ceil(Math.random() * maxKRs) },
							randomKeyResult,
						)
					: [],
				children: addChildren
					? Array.from({ length: Math.ceil(Math.random() * maxChildren) }, () =>
							randomGoal(depth + 1, childGoalLevel, childVisibility),
						)
					: [],
			};
		};

		const baseGoal = {
			type: "GOAL",
			goalName,
			goalDescription,
			owner,
			goalLevel,
			visibility,
			children: [],
			keyResults: [],
		};

		switch (scenario) {
			case "only_goal_no_krs":
				return [baseGoal];

			case "only_goal_with_krs":
				return [
					{
						...baseGoal,
						keyResults: Array.from(
							{ length: Math.ceil(Math.random() * maxKRs) },
							randomKeyResult,
						),
					},
				];

			case "goal_with_children":
				return [
					{
						...baseGoal,
						children: Array.from(
							{ length: Math.ceil(Math.random() * maxChildren) },
							() => randomGoal(1, goalLevel, visibility),
						),
					},
				];

			case "goal_with_children_and_krs":
				return [
					{
						...baseGoal,
						keyResults: Array.from(
							{ length: Math.ceil(Math.random() * maxKRs) },
							randomKeyResult,
						),
						children: Array.from(
							{ length: Math.ceil(Math.random() * maxChildren) },
							() => randomGoal(1, goalLevel, visibility),
						),
					},
				];

			case "goal_with_imported_parent":
				return [
					{
						...baseGoal,
						parentGoal: {
							type: "GOAL",
							title: importedGoalName,
							toBrowse: true,
						},
					},
				];

			case "goal_with_imported_child":
				return [
					{
						...baseGoal,
						children: [
							{
								type: "GOAL",
								title: importedChildName,
								toBrowse: true,
								goalLevel: getLowerGoalLevel(goalLevel),
								visibility: getLowerVisibility(visibility),
							},
						],
					},
				];

			case "task_with_imported_parent": {
				const metricType = CommonUtils.getRandomElement(constants.METRIC_TYPES);
				const task = {
					type: "TASK",
					title: taskTitle,
					metric: metricType,
					startValue: Math.ceil(Math.random() * 100),
					targetValue: Math.ceil(Math.random() * 100),
					parentGoal: {
						type: "GOAL",
						title: importedGoalName,
						toBrowse: true,
						goalLevel,
						visibility,
					},
				};
				if (metricType === "Currency") task.unit = "Indian Rupee";
				return [task];
			}

			case "multiple_goals_random": {
				const scenarios = [
					"only_goal_no_krs",
					"only_goal_with_krs",
					"goal_with_children",
					"goal_with_children_and_krs",
				];
				return Array.from(
					{ length: Math.floor(Math.random() * 3) + 1 },
					() =>
						constants.getQuickAddPayload({
							scenario: CommonUtils.getRandomElement(scenarios),
							owner,
							goalLevel,
							visibility,
							maxChildren,
							maxKRs,
						})[0],
				);
			}
			case "goal_with_fixed_structure": {
				const effectiveGoalLevel = goalLevel ?? "Org";
				const effectiveVisibility = visibility ?? "Public";
				return [
					{
						type: "GOAL",
						goalName,
						goalDescription,
						owner,
						goalLevel: effectiveGoalLevel,
						visibility: effectiveVisibility,
						keyResults: [],
						children: [
							{
								type: "GOAL",
								title: `ChildGoal_${CommonUtils.generateRandomText(7)}`,
								owner,
								goalLevel: getLowerGoalLevel(effectiveGoalLevel),
								visibility: getLowerVisibility(effectiveVisibility),
								keyResults: [],
								children: [],
							},
							{
								type: "TASK",
								title: taskTitle,
								owner,
								metric: "Number",
								startValue: 0,
								targetValue: 100,
							},
						],
					},
				];
			}

			default:
				throw new Error(`Unknown Quick Add scenario: ${scenario}`);
		}
	},
	getEngageManagerReportEmailBody(managerName, surveyName) {
		return `Your Report is Ready! Hey ${managerName}, Your in-depth survey report for ${surveyName} is now ready! This report holds the secret sauce and key insights into your team's engagement score, recognition patterns, and overall workplace experience. Analyze these insights and let them steer your journey to building a high-flying team.`;
	},
	getPulseManagerReportEmailBody(managerName, surveyName) {
		return `Your Pulse Report is Ready! Hey ${managerName}, Exciting news! Your comprehensive pulse survey report for ${surveyName} is now available! Dive into the pulse of your team, exploring quick insights into the overall experience of the workplace. Leverage these insights to navigate and elevate your team's experience to new heights!`;
	},

	/**
	 * Function to get Exit Survey Email Body
	 *
	 * This function generates a customized email body for exit survey invitations.
	 * Exit surveys are triggered for employees who are leaving the company.
	 *
	 * @param {string} participantName - The name of the employee leaving
	 * @param {string} surveyName - The name of the exit survey
	 * @returns {string} A formatted email body message for exit survey invitation
	 *
	 * @example
	 * const emailBody = getExitEmailBody("John Doe", "Employee Exit Survey 2025");
	 * Returns: "Your Feedback Matters! Hey John Doe, We value your time with us and would like to hear your honest feedback. Please take a moment to complete this exit survey - Employee Exit Survey 2025. Your insights will help us improve the workplace for future employees."
	 */
	getExitEmailBody(participantName, surveyName) {
		return `Your Exit Survey Awaits! Hey ${participantName}, As you transition from your role, we'd love your honest feedback through our exit survey – ${surveyName}. Your perspective will help us refine retention practices and create better experiences for current and future employees. Thank you for sharing!`;
	},

	/**
	 * Function to get Exit Survey Reminder Email Body
	 *
	 * @param {string} participantName - The name of the employee leaving
	 * @param {string} surveyName - The name of the exit survey
	 * @returns {string} A formatted reminder email body message for exit survey
	 */
	getExitEmailReminderBody(participantName, surveyName) {
		return `Your Voice Matters! Hey ${participantName}, Just a gentle reminder that your exit survey - ${surveyName} is awaiting your response. Please take a moment to share your valuable feedback before you leave.`;
	},
	/**
	 * Generates a payload object for creating a task, based on the given scenario.
	 *
	 * @param {string} scenario - The type of task scenario. Can be "Task_only", "Task_with_initiative", "Task_with_participants", or "Task_Overall".
	 * @param {string} owner - The name of the task owner.
	 * @param {string} parentGoal - The parent goal to which this task belongs.
	 * @param {string} metric - The metric type for the task. If not provided, a random metric type is chosen.
	 * @returns {Object} The generated task payload object, with fields populated according to the scenario.
	 *
	 * @example
	 * const taskPayload = constants.getTaskCreatePayload("Task_Overall", "John Doe", "Parent Goal", "Number");
	 * // Returns:
	 * // {
	 * //   taskName: "randomText",
	 * //   taskDescription: "randomText",
	 * //   taskOwner: "John Doe",
	 * //   metric: {
	 * //     type: "Number",
	 * //     start: "12",
	 * //     target: "123",
	 * //     currency: "Indian Rupee"
	 * //   },
	 * //   parent: "Parent Goal",
	 * //   initiative: ["randomText1", "randomText2", ...],
	 * //   participants: ["Subject Name 2", "Subject Name 3", "Subject Name 4"]
	 * // }
	 *
	 * Explanation:
	 * - This function helps you quickly create a task object for testing or automation.
	 * - It fills in random values for the task name, description, and metric values.
	 * - Depending on the scenario, it can add initiatives (list of random text) and/or participants (predefined subject names).
	 * - The metric type can be specified, or it will randomly pick one if not provided.
	 * - The returned object can be used directly to create a task in the application.
	 */
	getTaskCreatePayload({ scenario, owner, parentGoal, metric }) {
		if (!scenario || !owner || !parentGoal) {
			throw new Error(
				"scenario, owner, and parentGoal parameters are required",
			);
		}
		// Create a default task payload with random values
		const defaultPayload = {
			taskName: CommonUtils.generateRandomText(10),
			taskDescription: CommonUtils.generateRandomText(10),
			taskOwner: owner,
			metric: {
				type:
					metric ||
					this.metricTypes[
						Object.keys(this.metricTypes)[
							Math.floor(Math.random() * Object.keys(this.metricTypes).length)
						]
					],
				start: CommonUtils.generateRandomNumbersWithLength(2),
				target: CommonUtils.generateRandomNumbersWithLength(3),
				currency:
					currencyTypes[Math.floor(Math.random() * currencyTypes.length)],
			},
			parent: parentGoal,
		};
		const participants = [
			constants.subjectName2,
			constants.subjectName3,
			constants.subjectName4,
		];
		const initiatives = [
			CommonUtils.generateRandomText(10),
			CommonUtils.generateRandomText(10),
			CommonUtils.generateRandomText(10),
			CommonUtils.generateRandomText(10),
		];
		// Add extra fields based on the scenario
		switch (scenario) {
			case "Task_only":
				return defaultPayload;
			case "Task_with_initiative":
				// Add a list of random initiatives
				defaultPayload.initiative = initiatives;
				return defaultPayload;
			case "Task_with_participants":
				// Add a list of participants (predefined subject names)
				defaultPayload.participants = participants;
				return defaultPayload;
			case "Task_Overall":
				// Add both initiatives and participants
				defaultPayload.initiative = initiatives;
				defaultPayload.participants = participants;
				return defaultPayload;
			default:
				return defaultPayload;
		}
	},

	/**
	 * Generates an array of scale labels from 1 to the specified length
	 *
	 * @param {number} length - The number of labels to generate (from 1 to length)
	 * @returns {Array<string>} Array of scale labels in the format ["Label 1", "Label 2", ..., "Label N"]
	 *
	 * @example
	 * constants.getScaleLabels(5)
	 * // Returns: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"]
	 *
	 * @example
	 * constants.getScaleLabels(7)
	 * // Returns: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5", "Label 6", "Label 7"]
	 */
	getScaleLabels(length) {
		return Array.from({ length }, (_, i) => `Label ${i + 1}`);
	},
};

//types of currency that thrive supports.
const currencyTypes = [
	"UAE Dirham",
	"Afghani",
	"Lek",
	"Armenian Dram",
	"Netherlands Antillean Guilder",
	"Kwanza",
	"Argentine Peso",
	"Australian Dollar",
	"Aruban Florin",
	"Azerbaijan Manat",
	"Convertible Mark",
	"Barbados Dollar",
	"Taka",
	"Bulgarian Lev",
	"Bahraini Dinar",
	"Burundi Franc",
	"Bermudian Dollar",
	"Brunei Dollar",
	"Boliviano",
	"Mvdol",
	"Brazilian Real",
	"Bahamian Dollar",
	"Ngultrum",
	"Pula",
	"Belarusian Ruble",
	"Belize Dollar",
	"Canadian Dollar",
	"Congolese Franc",
	"WIR Euro",
	"Swiss Franc",
	"WIR Franc",
	"Unidad de Fomento",
	"Chilean Peso",
	"Yuan Renminbi",
	"Colombian Peso",
	"Unidad de Valor Real",
	"Costa Rican Colon",
	"Peso Convertible",
	"Cuban Peso",
	"Cabo Verde Escudo",
	"Czech Koruna",
	"Djibouti Franc",
	"Danish Krone",
	"Dominican Peso",
	"Algerian Dinar",
	"Egyptian Pound",
	"Nakfa",
	"Ethiopian Birr",
	"Euro",
	"Fiji Dollar",
	"Falkland Islands Pound",
	"Pound Sterling",
	"Lari",
	"Ghana Cedi",
	"Gibraltar Pound",
	"Dalasi",
	"Guinean Franc",
	"Quetzal",
	"Guyana Dollar",
	"Hong Kong Dollar",
	"Lempira",
	"Kuna",
	"Gourde",
	"Forint",
	"Rupiah",
	"New Israeli Sheqel",
	"Indian Rupee",
	"Iraqi Dinar",
	"Iranian Rial",
	"Iceland Krona",
	"Jamaican Dollar",
	"Jordanian Dinar",
	"Yen",
	"Kenyan Shilling",
	"Som",
	"Riel",
	"Comorian Franc ",
	"North Korean Won",
	"Won",
	"Kuwaiti Dinar",
	"Cayman Islands Dollar",
	"Tenge",
	"Lao Kip",
	"Lebanese Pound",
	"Sri Lanka Rupee",
	"Liberian Dollar",
	"Loti",
	"Libyan Dinar",
	"Moroccan Dirham",
	"Moldovan Leu",
	"Malagasy Ariary",
	"Denar",
	"Kyat",
	"Tugrik",
	"Pataca",
	"Ouguiya",
	"Mauritius Rupee",
	"Rufiyaa",
	"Malawi Kwacha",
	"Mexican Peso",
	"Mexican Unidad de Inversion (UDI)",
	"Malaysian Ringgit",
	"Mozambique Metical",
	"Namibia Dollar",
	"Naira",
	"Cordoba Oro",
	"Norwegian Krone",
	"Nepalese Rupee",
	"New Zealand Dollar",
	"Rial Omani",
	"Balboa",
	"Sol",
	"Kina",
	"Philippine Peso",
	"Pakistan Rupee",
	"Zloty",
	"Guarani",
	"Qatari Rial",
	"Romanian Leu",
	"Serbian Dinar",
	"Russian Ruble",
	"Rwanda Franc",
	"Saudi Riyal",
	"Solomon Islands Dollar",
	"Seychelles Rupee",
	"Sudanese Pound",
	"Swedish Krona",
	"Singapore Dollar",
	"Saint Helena Pound",
	"Leone",
	"Somali Shilling",
	"Surinam Dollar",
	"South Sudanese Pound",
	"Dobra",
	"El Salvador Colon",
	"Syrian Pound",
	"Lilangeni",
	"Baht",
	"Somoni",
	"Turkmenistan New Manat",
	"Tunisian Dinar",
	"Pa'anga",
	"Turkish Lira",
	"Trinidad and Tobago Dollar",
	"New Taiwan Dollar",
	"Tanzanian Shilling",
	"Hryvnia",
	"Uganda Shilling",
	"US Dollar",
	"US Dollar (Next day)",
	"Uruguay Peso en Unidades Indexadas (UI)",
	"Peso Uruguayo",
	"Unidad Previsional",
	"Uzbekistan Sum",
	"Bolívar Soberano",
	"Dong",
	"Vatu",
	"Tala",
	"CFA Franc BEAC",
	"Silver",
	"Gold",
	"Bond Markets Unit European Composite Unit (EURCO)",
	"Bond Markets Unit European Monetary Unit (E.M.U.-6)",
	"Bond Markets Unit European Unit of Account 9 (E.U.A.-9)",
	"Bond Markets Unit European Unit of Account 17 (E.U.A.-17)",
	"East Caribbean Dollar",
	"SDR (Special Drawing Right)",
	"CFA Franc BCEAO",
	"Palladium",
	"CFP Franc",
	"Platinum",
	"Sucre",
	"Codes specifically reserved for testing purposes",
	"ADB Unit of Account",
	"The codes assigned for transactions where no currency is involved",
	"Yemeni Rial",
	"Rand",
	"Zambian Kwacha",
	"Zimbabwe Dollar",
];

const kudosUserName = {
	S2: "thrive",
	"production-us": "automation75961",
};

/**
 * Generates a name and email with a random number suffix.
 * Supports both employee (default) and guest user types.
 *
 * @param {string} [type="employee"] - User type to generate: "employee" (default) or "guest"
 * @returns {{ employeeName: string, employeeEmail: string } | { name: string, email: string }}
 *
 * @example
 * const { employeeName, employeeEmail } = generateRandomEmployeeNameAndEmail();
 *
 * @example
 * const { name, email } = generateRandomEmployeeNameAndEmail("guest");
 */

function generateRandomEmployeeNameAndEmail(type = "employee") {
	const randomNum = CommonUtils.getRandomIntInclusive(-9999, 9999);
	if (type === "guest") {
		return {
			name: `${CommonUtils.generateRandomText(3)}${randomNum}`.toLowerCase(),
			email:
				`${CommonUtils.generateRandomText(3)}+${CommonUtils.generateRandomNumbersWithLength(2)}@${CommonUtils.generateRandomText(5)}.com`.toLowerCase(),
		};
	}
	return {
		employeeName: `${constants.new_Employee_name}${randomNum}`,
		employeeEmail: `thrive.automation+${randomNum}@surveysparrowqa.com`,
		secondaryEmail: `thrive.secondary+${randomNum}@surveysparrowqa.com`,
	};
}

const jiraJQL = {
	query1: "project = 'SCRUM' ORDER BY created DESC",
	query2: "project = 'SCRUM' AND type = Bug ORDER BY created DESC",
};

const questionVerificationData = {
	ratingScaleData: {
		scale5: [
			"Strongly Disagree",
			"Disagree",
			"Average",
			"Okay",
			"Strongly Agree",
		],
		scale7: [
			"Strongly Disagree",
			"Disagree",
			"Moderately Disagree",
			"Neutral",
			"Moderately Agree",
			"Agree",
			"Strongly Agree",
		],
		scale10: [
			"Extremely Disagree",
			"Strongly Disagree",
			"Disagree",
			"Moderately Disagree",
			"Slightly Disagree",
			"Neutral",
			"Slightly Agree",
			"Moderately Agree",
			"Agree",
			"Strongly Agree",
			"Extremely Agree",
		],
		overall: [
			"Extremely Disagree",
			"Strongly Disagree",
			"Disagree",
			"Moderately Disagree",
			"Slightly Disagree",
			"Neutral",
			"Slightly Agree",
			"Moderately Agree",
			"Agree",
			"Strongly Agree",
			"Extremely Agree",
		],
		enps: [
			"Extremely Unlikely 0",
			"Highly Unlikely 1",
			"Unlikely 2",
			"Slightly Unlikely 3",
			"Not Very Likely 4",
			"Neutral 5",
			"Fairly Likely 6",
			"Likely 7",
			"Very Likely 8",
			"Highly Likely 9",
			"Extremely Likely 10",
		],
	},
	textInputData: {
		multiline: "Enter your feedback here",
		singleline: "What is the reason for your choice?",
		default: "Please Enter Your Response",
	},
	goalQuestion: {
		placeholder: "Placeholder for the Goal",
	},
	mcqOtherInput: {
		defaultPlaceholder: "Please enter your other input",
	},
};

export {
	constants,
	generateRandomEmployeeNameAndEmail,
	kudosUserName,
	jiraJQL,
	questionVerificationData,
	pptExportData,
};

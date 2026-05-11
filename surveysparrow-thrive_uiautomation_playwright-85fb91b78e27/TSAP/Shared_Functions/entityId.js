class EntityIds {
	static cookie = null;
	static surveyId = null;
	static surveyName = null;
	static survey_builder_url = null;
	static questionScaleMap = {};

	static getCookie() {
		return EntityIds.cookie;
	}

	static setCookie(cookie) {
		EntityIds.cookie = cookie;
	}

	static getsurveyId() {
		return EntityIds.surveyId;
	}

	static setsurveyId(id) {
		EntityIds.surveyId = id;
	}

	static setsurveyName(name) {
		EntityIds.surveyName = name;
	}

	static getsurveyName() {
		return EntityIds.surveyName;
	}

	static setSurveyBuilderUrl(url) {
		EntityIds.survey_builder_url = url;
	}

	static getSurveyBuilderUrl() {
		return EntityIds.survey_builder_url;
	}

	static setQuestionScale(questionName, scale) {
		EntityIds.questionScaleMap[questionName] = scale;
	}

	static getQuestionScale(questionName) {
		return EntityIds.questionScaleMap[questionName];
	}

	static clearQuestionScales() {
		EntityIds.questionScaleMap = {};
	}
}

export { EntityIds };

import logger from "playwright-framework/Core/logger.js";
import CommonUtils from "playwright-framework/Core/Utils/common-utils.js";

const selfWeightage = 1;
const peerWeightage = 1;
const reporteeWeightage = 1;
const managerWeightage = 1;

class Calculations {
	/* Calculates an overall performance score based on feedback from various participants such as 
    self-evaluators, peers, reportees, and managers. This score is computed by aggregating scores 
    from different sources and applying specific weightages to each type of feedback.*/
	static async performanceOverallScore(responseData, subject = "Subject") {
		let selfEvaluatorsSum1 = 0;
		let selfEvaluatorsSum2 = 0;
		let sumOfAllPeersScore = 0;
		let sumOfAllReporteeScore = 0;
		let sumOfAllManagersScore = 0;
		let numberOfQuestionsAnsweredBySelf = 0;
		let numberOfQuestionsAnswerdByPeers = 0;
		let numberOfQuestionsAnswerdByReportee = 0;
		let numberOfQuestionsAnswerdByManagers = 0;
		let numberOfManagers = 0;
		let numberOfPeers = 0;
		let numberOfReportees = 0;

		for (const participant in responseData) {
			const data = responseData[participant];
			if (participant === "Subject") {
				const selfEvaluatorsScores =
					await Calculations.sumOfAllOpinionScores(data);
				selfEvaluatorsSum1 = selfEvaluatorsScores[0];
				logger.info(`Self Evaluvator Sum: ${selfEvaluatorsSum1}`);
				numberOfQuestionsAnsweredBySelf = selfEvaluatorsScores[1];
				logger.info(
					`Self Evaluvator Answerd: ${numberOfQuestionsAnsweredBySelf}`,
				);
			} else if (participant === "Subject2") {
				const selfEvaluatorsScores =
					await Calculations.sumOfAllOpinionScores(data);
				selfEvaluatorsSum2 = selfEvaluatorsScores[0];
				logger.info(`Self Evaluvator Sum: ${selfEvaluatorsSum2}`);
				numberOfQuestionsAnsweredBySelf = selfEvaluatorsScores[1];
				logger.info(
					`Self Evaluvator Answerd: ${numberOfQuestionsAnsweredBySelf}`,
				);
			} else if (participant.includes("Evaluator")) {
				if (participant.includes("Peer")) {
					const peerEvaluatorsScores =
						await Calculations.sumOfAllOpinionScores(data);
					numberOfQuestionsAnswerdByPeers =
						numberOfQuestionsAnswerdByPeers + peerEvaluatorsScores[1];
					logger.info(
						`Peer Questions Answerd: ${numberOfQuestionsAnswerdByPeers}`,
					);
					sumOfAllPeersScore = sumOfAllPeersScore + peerEvaluatorsScores[0];
					logger.info(`Peer Sum: ${sumOfAllPeersScore}`);
					numberOfPeers = numberOfPeers + 1;
				} else if (participant.includes("Reportee")) {
					const reporteeEvaluatorsScores =
						await Calculations.sumOfAllOpinionScores(data);
					numberOfQuestionsAnswerdByReportee =
						numberOfQuestionsAnswerdByReportee + reporteeEvaluatorsScores[1];
					logger.info(
						`Reportee Questions Answerd: ${numberOfQuestionsAnswerdByReportee}`,
					);
					sumOfAllReporteeScore =
						sumOfAllReporteeScore + reporteeEvaluatorsScores[0];
					logger.info(`Reportee Sum: ${sumOfAllReporteeScore}`);
					numberOfReportees = numberOfReportees + 1;
				} else if (participant.includes("Manager")) {
					const managerEvaluatorsScores =
						await Calculations.sumOfAllOpinionScores(data);
					numberOfQuestionsAnswerdByManagers =
						numberOfQuestionsAnswerdByManagers + managerEvaluatorsScores[1];
					logger.info(
						`Reporte Questions Answerd: ${numberOfQuestionsAnswerdByManagers}`,
					);
					sumOfAllManagersScore =
						sumOfAllManagersScore + managerEvaluatorsScores[0];
					logger.info(`Manger·Sum: ${sumOfAllManagersScore}`);
					numberOfManagers = numberOfManagers + 1;
				}
			}
		}

		const numerator =
			selfEvaluatorsSum1 * selfWeightage +
			selfEvaluatorsSum2 * selfWeightage +
			sumOfAllPeersScore * peerWeightage +
			sumOfAllReporteeScore * reporteeWeightage +
			sumOfAllManagersScore * managerWeightage;

		logger.info(`Numerator: ${numerator}`);

		const denominator =
			numberOfQuestionsAnswerdByManagers * managerWeightage * numberOfManagers +
			numberOfQuestionsAnswerdByPeers * peerWeightage * numberOfPeers +
			numberOfQuestionsAnswerdByReportee *
				reporteeWeightage *
				numberOfReportees +
			numberOfQuestionsAnsweredBySelf * selfWeightage;
		logger.info(`Denominator: ${denominator}`);
		const overallScore = numerator / denominator;
		logger.info(`Over All Score before: ${overallScore}`);
		const overallScoreAfterRounded =
			await Calculations.progressiveRound(overallScore);
		logger.info(`Over All Score rounded: ${overallScoreAfterRounded}`);
		return { overallScoreAfterRounded, numerator, denominator };
	}

	static async sectionWiseCompetencyScore(responseData, section) {
		const sumAndNumberOfQuestiosn =
			await Calculations.calculateSumOfAllScoresInSection(
				responseData,
				section,
			);
		const sumOfAllScoresInSection = sumAndNumberOfQuestiosn[0];
		const numberOfQuestionsInSection = sumAndNumberOfQuestiosn[1];
		let sectionWiseCompetencyScore =
			sumOfAllScoresInSection / numberOfQuestionsInSection;
		sectionWiseCompetencyScore = await Calculations.progressiveRound(
			sectionWiseCompetencyScore,
		);
		return {
			sectionWiseCompetencyScore,
			sumOfAllScoresInSection,
			numberOfQuestionsInSection,
		}; //rounded to one decimal place
	}

	/*function calculates the sum of scores for all opinion-related questions and counts the number of 
    such questions within a participant's response data.*/
	static async sumOfAllOpinionScores(responseDataOfPrticipant) {
		let sum = 0;
		let numberOfOpinionQuestion = 0;
		for (const section in responseDataOfPrticipant) {
			for (const questions in responseDataOfPrticipant[section]) {
				const value = responseDataOfPrticipant[section][questions];
				if (value && typeof value === "object" && value.type === "opinion") {
					sum = sum + Number.parseInt(value.value);
					numberOfOpinionQuestion += 1;
				}
			}
		}
		return [sum, numberOfOpinionQuestion];
	}

	/*function calculates the sum of scores for all opinion-related questions and counts the number of 
    such questions of a purticular section.*/
	static async calculateSumOfAllScoresInSection(responseData, section) {
		logger.info(
			`Starting sum of all scores calculation for section: ${section}`,
		);
		let sum = 0;
		let numberOfQuestionsInSections = 0;
		for (const participant in responseData) {
			const data = responseData[participant];

			// Handle JSON format with extra nesting level
			if (
				(data && typeof data === "object" && data["Subject"]) ||
				data[section]
			) {
				let subjectData = {};
				if (data[section]) {
					subjectData = data[section];
				} else {
					subjectData = data[data["Subject"]];
				}
				if (subjectData) {
					for (const questions in subjectData) {
						const value = subjectData[questions];
						if (
							value &&
							typeof value === "object" &&
							value.type === "opinion"
						) {
							sum = sum + Number.parseInt(value.value);
							numberOfQuestionsInSections += 1;
						}
					}
				}
			}
		}
		logger.info(
			`Section scores - Sum: ${sum}, Questions: ${numberOfQuestionsInSections}`,
		);
		return [sum, numberOfQuestionsInSections];
	}

	/**
	 * Progressively rounds a given number by reducing decimal places one step at a time
	 * until it reaches the nearest integer.
	 *
	 * @param {number} number - The input number to be progressively rounded.
	 * @returns {number} The progressively rounded number.
	 */
	static async progressiveRound(number) {
		const numStr = number.toString();
		const decimalPlaces = (numStr.split(".")[1] || "").length;

		// Start from highest precision and progressively round down correctly
		for (let i = decimalPlaces; i >= 1; i--) {
			number = Math.round(number * Math.pow(10, i)) / Math.pow(10, i);
		}

		// Final rounding ensures correct behavior
		return number.toFixed(1);
	}

	/**
	 * Calculates favorable, unfavorable, and neutral scores for a participant
	 * @param {Object} responseDataOfParticipant - The participant's response data
	 * @returns {Object} Returns object containing:
	 *   - favourable: Count of favorable responses
	 *   - unfavourable: Count of unfavorable responses
	 *   - neutral: Count of neutral responses
	 *   - totalResponses: Total number of responses
	 *   - eachRatingQuestionFavourability: Object with favourability percentage per question
	 * @example
	 * const data = {
	 *   section1: {
	 *     q1: ["opinion", "4"],
	 *     q2: { value: "2", scale: { start: 1, stop: 5 } }
	 *   }
	 * };
	 * const result = Calculations.favourableScoreCalculation(data);
	 */
	static favourableScoreCalculation(responseDataOfParticipant) {
		logger.info("Starting favorable scores calculation...");
		let favourable = 0;
		let unfavourable = 0;
		let neutral = 0;
		let totalResponses = 0;
		let eachRatingQuestionFavourability = {};
		const getFavorabilityRanges = (scale) => {
			switch (scale) {
				case 5:
					return { favourable: [4, 5], neutral: [3], unfavorable: [1, 2] };
				case 7:
					return {
						favourable: [6, 7],
						neutral: [4, 5],
						unfavorable: [1, 2, 3],
					};
				case 10:
					return {
						favourable: [9, 10],
						neutral: [7, 8],
						unfavorable: [1, 2, 3, 4, 5, 6],
					};
				default:
					throw new Error(
						`Unsupported scale: ${scale}. Only scales 5, 7, and 10 are supported.`,
					);
			}
		};
		const questionStats = {};
		for (const section in responseDataOfParticipant) {
			for (const question in responseDataOfParticipant[section]) {
				const value = responseDataOfParticipant[section][question];
				if (value && typeof value === "object" && value.value && value.scale) {
					const score = Number.parseInt(value.value, 10);
					const scale = value.scale.stop;
					const ranges = getFavorabilityRanges(scale);
					if (!questionStats[question]) {
						questionStats[question] = {
							favourable: 0,
							unfavourable: 0,
							neutral: 0,
							totalResponses: 0,
						};
					}
					if (ranges.favourable.includes(score)) {
						favourable += 1;
						questionStats[question].favourable += 1;
					} else if (ranges.unfavorable.includes(score)) {
						unfavourable += 1;
						questionStats[question].unfavourable += 1;
					} else if (ranges.neutral.includes(score)) {
						neutral += 1;
						questionStats[question].neutral += 1;
					}
					totalResponses += 1;
					questionStats[question].totalResponses += 1;
				}
			}
		}
		for (const question in questionStats) {
			const stats = questionStats[question];
			const favourabilityPercentage =
				stats.totalResponses > 0
					? (stats.favourable / stats.totalResponses) * 100
					: 0;
			eachRatingQuestionFavourability[question] = favourabilityPercentage;
			logger.info(
				`Question "${question}": ${stats.favourable}/${stats.totalResponses} favourable = ${favourabilityPercentage.toFixed(1)}%`,
			);
		}
		logger.info(
			`Favorable scores: ${favourable}, Unfavorable: ${unfavourable}, Neutral: ${neutral}, Total responses: ${totalResponses}`,
		);
		return {
			favourable,
			unfavourable,
			neutral,
			totalResponses,
			eachRatingQuestionFavourability,
		};
	}

	/**
	 * Calculates the overall favorability scores for an Engage/Pulse survey
	 * @param {Object} responseData - Survey response data containing participant answers
	 * @returns {Object} Returns object containing:
	 *   - totalScore: Overall score combining all response types
	 *   - favourableScore: Percentage of favorable responses
	 *   - unfavourableScore: Percentage of unfavorable responses
	 *   - neutralScore: Percentage of neutral responses
	 *   - eachRatingQuestionFavourability: Object with average favourability per question
	 * @throws {Error} If no participants are found
	 * @example
	 * const responseData = {
	 *   participant1: {
	 *     section1: {
	 *       q1: ["opinion", "4"]
	 *     }
	 *   }
	 * };
	 * const result = Calculations.engagePulseOverallFavourability(responseData);
	 */
	static engagePulseOverallFavourability(responseData) {
		logger.info("Starting engage pulse overall favorability calculation...");
		let totalFavourable = 0;
		let totalUnfavourable = 0;
		let totalNeutral = 0;
		let totalResponses = 0;
		let allQuestionFavourability = {};
		if (!responseData) {
			logger.error("Response data is null or undefined");
			throw new Error("Response data is null or undefined");
		}
		for (const participant in responseData) {
			const data = responseData[participant];
			logger.info(`Processing participant: ${participant}`);
			const scores = Calculations.favourableScoreCalculation(data);
			logger.info(
				`Scores for ${participant}: Favourable: ${scores.favourable}, Unfavourable: ${scores.unfavourable}, Neutral: ${scores.neutral}, Total: ${scores.totalResponses}`,
			);
			totalFavourable += scores.favourable;
			totalUnfavourable += scores.unfavourable;
			totalNeutral += scores.neutral;
			totalResponses += scores.totalResponses;
			if (scores.eachRatingQuestionFavourability) {
				for (const question in scores.eachRatingQuestionFavourability) {
					if (!allQuestionFavourability[question]) {
						allQuestionFavourability[question] = [];
					}
					allQuestionFavourability[question].push(
						scores.eachRatingQuestionFavourability[question],
					);
				}
			}
		}
		if (totalResponses === 0) {
			logger.error("No responses found.");
			throw new Error("No responses found.");
		}
		logger.info(
			`Accumulated scores: Favourable: ${totalFavourable}, Unfavourable: ${totalUnfavourable}, Neutral: ${totalNeutral}, Total responses: ${totalResponses}`,
		);
		const finalFavourableScore = (totalFavourable / totalResponses) * 100;
		const finalUnfavourableScore = (totalUnfavourable / totalResponses) * 100;
		const finalNeutralScore = (totalNeutral / totalResponses) * 100;
		const finalTotalScore = finalFavourableScore;
		logger.info(
			`Final calculated scores: Favourable: ${finalFavourableScore.toFixed(2)}%, Unfavourable: ${finalUnfavourableScore.toFixed(2)}%, Neutral: ${finalNeutralScore.toFixed(2)}%, Total: ${finalTotalScore.toFixed(2)}%`,
		);
		const averageQuestionFavourability = {};
		for (const question in allQuestionFavourability) {
			const scores = allQuestionFavourability[question];
			const average =
				scores.reduce((sum, score) => sum + score, 0) / scores.length;
			averageQuestionFavourability[question] = average;
			logger.info(
				`Average favourability for "${question}": ${average.toFixed(1)}%`,
			);
		}
		return {
			totalScore: finalTotalScore,
			favourableScore: finalFavourableScore,
			unfavourableScore: finalUnfavourableScore,
			neutralScore: finalNeutralScore,
			eachRatingQuestionFavourability: averageQuestionFavourability,
		};
	}

	/**
	 * Calculates the Employee Net Promoter Score (eNPS) from survey response data
	 * @param {Object} responseData - The survey response data containing participant answers
	 * @returns {Object} An object containing:
	 *   - totalResponses: Total number of eNPS responses
	 *   - promoters: Count of promoter responses (9-10)
	 *   - passives: Count of passive responses (7-8)
	 *   - detractors: Count of detractor responses (0-6)
	 *   - enpsScore: Final eNPS score
	 * @throws {Error} If no eNPS responses are found in the data
	 * @example
	 * const responseData = {
	 *   Subject: {
	 *     "Engage Automation 1": {
	 *       kGPXj: {
	 *         "How likely are you to recommend our company as a workplace to a friend or colleague?": ["eNPS", "7"]
	 *       }
	 *     }
	 *   }
	 * };
	 * const result = Calculations.engagePulseOverallENPS(responseData);
	 */
	static engagePulseOverallENPS(responseData) {
		logger.info("Starting engage pulse overall ENPS calculation...");
		let totalPromoters = 0;
		let totalPassives = 0;
		let totalDetractors = 0;
		let participantCount = 0;
		const enpsQuestion =
			"How likely are you to recommend our company as a workplace to a friend or colleague?";
		if (!responseData) {
			logger.error("Response data is null or undefined");
			throw new Error("Response data is null or undefined");
		}
		const processResponse = (value) => {
			if (value[0] === "eNPS") {
				const score = Number.parseInt(value[1], 10);
				participantCount++;
				if (score >= 9 && score <= 10) {
					totalPromoters++;
					logger.info("Added to Promoters");
				} else if (score >= 7 && score <= 8) {
					totalPassives++;
					logger.info("Added to Passives");
				} else if (score >= 0 && score <= 6) {
					totalDetractors++;
					logger.info("Added to Detractors");
				}
			}
		};
		Object.values(responseData).forEach((participantData) => {
			Object.values(participantData).forEach((sectionData) => {
				if (sectionData[enpsQuestion]) {
					processResponse(sectionData[enpsQuestion]);
				}
			});
		});
		const totalResponses = totalPromoters + totalPassives + totalDetractors;
		if (participantCount === 0 || totalResponses === 0) {
			logger.error("No eNPS responses found.");
			throw new Error("No eNPS responses found.");
		}
		const enpsScore =
			((totalPromoters - totalDetractors) / totalResponses) * 100;
		logger.info(
			`ENPS Score: ${enpsScore.toFixed(1)} (Promoters: ${totalPromoters}, Passives: ${totalPassives}, Detractors: ${totalDetractors})`,
		);
		return {
			totalResponses,
			promoters: totalPromoters,
			passives: totalPassives,
			detractors: totalDetractors,
			enpsScore: enpsScore,
		};
	}

	/**
	 * Calculates the percentage of 'Yes' responses for Yes/No type questions
	 * @param {Object} responseData - Survey response data object
	 * @returns {Object} Returns object containing:
	 *   - totalResponses: Total number of Yes/No responses
	 *   - yesCount: Count of 'Yes' responses
	 *   - noCount: Count of 'No' responses
	 *   - yesPercentage: Percentage of 'Yes' responses
	 *   - noPercentage: Percentage of 'No' responses
	 * @throws {Error} If no Yes/No responses are found
	 * @example
	 * const responseData = {
	 *   Subject: {
	 *     "User1": {
	 *       sectionA: {
	 *         "Yes/No": ["YesNo", "Yes"]
	 *       }
	 *     }
	 *   }
	 * };
	 * const result = Calculations.calculateYesNoResponses(responseData);
	 */
	static calculateYesNoResponses(responseData) {
		let yesCount = 0;
		let noCount = 0;
		let totalResponses = 0;
		const yesornoQuestion = "Yes/No";
		const yesnoType = "YesNo";
		const data = responseData.Subject || responseData;
		for (const participant in data) {
			const sections = data[participant];
			logger.info(`Processing participant: ${participant}`);
			for (const section in sections) {
				const questions = sections[section];
				if (
					questions[yesornoQuestion] &&
					questions[yesornoQuestion][0] === yesnoType
				) {
					const response = questions[yesornoQuestion][1].toLowerCase();
					totalResponses++;
					if (response === "yes") {
						yesCount++;
						logger.info("Added to Yes count");
					} else if (response === "no") {
						noCount++;
						logger.info("Added to No count");
					}
				}
			}
		}
		if (totalResponses === 0) {
			logger.error("No Yes/No responses found in the data.");
			throw new Error("No Yes/No responses found in the data.");
		}
		const yesPercentage = (yesCount / totalResponses) * 100;
		const noPercentage = (noCount / totalResponses) * 100;
		logger.info(
			`Yes/No Results - Yes: ${yesPercentage.toFixed(1)}%, No: ${noPercentage.toFixed(1)}%, Total: ${totalResponses}`,
		);
		return {
			totalResponses,
			yesCount,
			noCount,
			yesPercentage,
			noPercentage,
		};
	}

	/**
	 * Calculates the percentage of responses for each option in MultiChoice questions
	 * @param {Object} responseData - Survey response data object
	 * @returns {Object} An object containing:
	 *   - totalResponses: Total number of MultiChoice responses
	 *   - questionText: The actual text of the MultiChoice question
	 *   - optionData: Object containing percentages for each option
	 * @throws {Error} If no MultiChoice responses are found in the data
	 * @example
	 * const responseData = {
	 *   Subject: {
	 *     "User1": {
	 *       sectionA: {
	 *         "MultiChoice": ["MultiChoice", "Option1"]
	 *       }
	 *     }
	 *   }
	 * };
	 * const result = Calculations.calculateMultiChoiceResponses(responseData);
	 */
	static calculateMultiChoiceResponses(responseData) {
		let totalResponses = 0;
		const optionData = {};
		let questionText = "";
		const data = responseData.Subject || responseData;
		for (const participant in data) {
			const sections = data[participant];
			for (const section in sections) {
				const questions = sections[section];
				if (
					questions["MultiChoice"] &&
					questions["MultiChoice"][0] === "MultiChoice"
				) {
					const response = questions["MultiChoice"][1];
					totalResponses++;
					if (!questionText) {
						questionText = questions["MultiChoice"][0];
					}
					if (optionData[response]) {
						optionData[response]++;
					} else {
						optionData[response] = 1;
					}
				}
			}
		}
		if (totalResponses === 0) {
			logger.error("No MultiChoice responses found in the data.");
			throw new Error("No MultiChoice responses found in the data.");
		}
		for (const option in optionData) {
			const percentage = (optionData[option] / totalResponses) * 100;
			optionData[option] = Math.round(percentage);
		}
		const result = {
			totalResponses,
			questionText,
			optionData,
		};
		logger.info(
			`MultiChoice results - Total: ${totalResponses}, Options: ${Object.keys(optionData).length}`,
		);
		return result;
	}
}
export { Calculations };

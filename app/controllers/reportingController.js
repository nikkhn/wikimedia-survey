// Controller for handling all logic displayed on the Reporting page

let multipleChoiceResults = [];
let freeTextResults = [];

// Load past survey results from database
const loadResults = async () => {
	const results = await fetch('/results');
	const json = await results.json();
	return json;
};

// Initialize the survey results object that is returned from the API call.
// Create and render table elements to display reporting data
const surveyResults = loadResults().then((response) => {
	if (response.length) {
		const results = response[0];
		multipleChoiceResults = results.filter((result) => result.questionType == 'Multiple Choice');
		freeTextResults = results.filter((result) => result.questionType == 'Free Text');
	}
	if (multipleChoiceResults.length) {
		const uniqueQuestions = getUniqueQuestions(multipleChoiceResults);
		for (const uniqueQ in uniqueQuestions) {
			const tableParentElement = document.getElementById("mc-results-table");
			generateTableRows(tableParentElement, uniqueQ, uniqueQuestions);
		}
	}

	// For free text questions, display the three most common and unique answers along 
	// with the number of responses for each of those popular answers.
	if (freeTextResults.length) {
		const uniqueQuestions = getUniqueQuestions(freeTextResults);
		for (const uniqueQ in uniqueQuestions) {
			const questions = uniqueQuestions[uniqueQ];
			const topThreeCommon = questions.slice(0, 3);
			const topThreeUnique = questions.slice(questions.length - 4, questions.length-1);
			const combinedAnswers = topThreeCommon.concat(topThreeUnique);
			const tableParentElement = document.getElementById("text-results-table");
			generateTableRows(tableParentElement, uniqueQ, { [uniqueQ]: combinedAnswers});
		}
	}
});

// Return map of results mapping each question to its answers
const getUniqueQuestions = (results) => {
	const uniqueQuestions = {};
	results.forEach((question) => {
		if (!uniqueQuestions[question.question]) { // new question we've come across
			uniqueQuestions[question.question] = [];
		}
		uniqueQuestions[question.question].push(question)
	});
	return uniqueQuestions;
}

// Generate and populate <th> and <td> elements for the question and its subsequent answers
const generateTableRows = (tableParentElement, uniqueQ, uniqueQuestions) => {
	const tableRow = document.createElement('tr');
	tableParentElement.appendChild(tableRow)
	const questionElement = document.createElement('th');
	questionElement.innerHTML = uniqueQ;
	tableRow.appendChild(questionElement)
	const answers = uniqueQuestions[uniqueQ];
	answers.forEach((ans) => {
		const answerElement = document.createElement('td');
		answerElement.innerHTML = `${ans.answer} (${ans.count})`;
		tableRow.appendChild(answerElement)
	})
}
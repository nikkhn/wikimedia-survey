const loadResults = async () => {
	const results = await fetch('/results');
	const json = await results.json();
	return json;
};

let multipleChoiceResults = [];
let freeTextResults = [];
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
			console.log(uniqueQuestions)
			generateTableRows(tableParentElement, uniqueQ, uniqueQuestions);
		}
	}
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

// For free text questions, the report should show the three most common and unique answers along with the number of responses for each of those popular answers.

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

const generateTableRows = (tableParentElement, uniqueQ, uniqueQuestions) => {
	console.log(uniqueQuestions)
	const tableRow = document.createElement('tr');
	tableParentElement.appendChild(tableRow)
	const questionElement = document.createElement('th');
	questionElement.innerHTML = uniqueQ;
	tableRow.appendChild(questionElement)
	const answers = uniqueQuestions[uniqueQ];
	answers.forEach((ans) => {
		const answerElement = document.createElement('td');
		answerElement.innerHTML = `${ans.answer} ${ans.count}`;
		tableRow.appendChild(answerElement)
	})
}
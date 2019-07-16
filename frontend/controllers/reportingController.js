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
		const uniqueQuestions = {};
		multipleChoiceResults.forEach((question) => {
			if (!uniqueQuestions[question.question]) { // new question we've come across
				uniqueQuestions[question.question] = [];
			}
			uniqueQuestions[question.question].push(question)
		});
		for (const uniqueQ in uniqueQuestions) {
			const tableParentElement = document.getElementById("mc-results-table");
			generateTableRows(tableParentElement, uniqueQ, uniqueQuestions);
		}
	}
	if (freeTextResults.length) {
		const uniqueQuestions = {};
		freeTextResults.forEach((question) => {
			if (!uniqueQuestions[question.question]) { // new question we've come across
				uniqueQuestions[question.question] = [];
			}
			uniqueQuestions[question.question].push(question)
		});
		for (const uniqueQ in uniqueQuestions) {
			console.log(uniqueQuestions);
			const tableParentElement = document.getElementById("text-results-table");
			generateTableRows(tableParentElement, uniqueQ, uniqueQuestions);
		}
	}
});

const generateTableRows = (tableParentElement, uniqueQ, uniqueQuestions) => {
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
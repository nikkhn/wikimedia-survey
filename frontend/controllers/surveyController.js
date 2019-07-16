
// create input elements for free text
const fillFreeTextQuestions = (elem, questions) => {
		const parentElement = document.getElementById(elem);
		questions.forEach((question, index) => {
			const labelElement = createButtonLabel();
			const inputElement = createInput();
			const appendChildElement = parentElement.appendChild(labelElement)
			const appendInput = parentElement.appendChild(inputElement);
			appendChildElement.innerHTML = question;
	});
}

// create question elements from an array of question objects
const fillMultipleChoiceQuestions = (elem, questions) => {
		const parentElement = document.getElementById(elem);
		questions.forEach((question) => {
			const questionText = Object.keys(question)[0];
			const questionTextElement = document.createElement('p');
		  parentElement.appendChild(questionTextElement).innerHTML = questionText;
			const answers = question[questionText];
			answers.forEach((answer) => {
				const divElement = document.createElement("div");
				divElement.setAttribute("class", "form-check");
				const par = parentElement.appendChild(divElement);
				const inputElement = createRadioButton(questionText); 
				const labelElement = createButtonLabel(answer);
				appendedAnswer = divElement.appendChild(inputElement)
				appendedAnswer = divElement.appendChild(labelElement)
			})
		})
}

const createButtonLabel = (answer) => {
	const labelElement = document.createElement('label');
		labelElement.setAttribute("class", "form-check-label");
		labelElement.innerHTML = answer;
		return labelElement;
}

const createRadioButton = (question) => {
	const radioButton = document.createElement('input');
	radioButton.setAttribute("type", "radio")
	radioButton.setAttribute("name", `btn-answer-${question}`);
	return radioButton;
}

const createInput = () => {
	const inputElement = document.createElement('input');
	inputElement.setAttribute("class", "form-control");
	return inputElement;
}

const loadQuestions = async () => {
	// // const results = fetch('frontend/models/questions.json')
	return await $.ajax({url: "frontend/models/questions.json"});
};

const generateBody = () => {
	return [
		{
			"question": 2,
			"answer": 1
		},
		{
			"question": 3,
			"answer": 2
		},
		{
			"question": 4,
			"answer": "Rarity"
		},
		{
			"question": 5,
			"answer": "Rainbow Dash"
		}
	]
}

const submitSurvey = async () => {
	console.log("WOOO");
	const response = fetch({
		url: "/survey",
		method: "POST",
		body: generateBody(),
	})
}

const loadPage = loadQuestions().then((response) =>{
	console.log(response);
	fillMultipleChoiceQuestions('multiple-choice-questions', response.multipleChoiceQs);
	fillFreeTextQuestions('free-text-questions', response.freeTextQs);
});
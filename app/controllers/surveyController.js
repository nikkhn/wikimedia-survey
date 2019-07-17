
// Boilerplate for body to POST survey results
const postObject = [];

// Create, populate, and render input elements for free text questions
const fillFreeTextQuestions = (elem, questions) => {
		const parentElement = document.getElementById(elem);
		questions.forEach((question, index) => {
			const labelElement = createButtonLabel();
			const inputElement = createInput(question.questionID);
			const appendChildElement = parentElement.appendChild(labelElement)
			const appendInput = parentElement.appendChild(inputElement);
			appendChildElement.innerHTML = question.question;
	});
}

// Create, populate, and render multiple choice question elements
const fillMultipleChoiceQuestions = (elem, questions) => {
		const parentElement = document.getElementById(elem);
		questions.forEach((question) => {
			const questionTextElement = document.createElement('div');
			questionTextElement.setAttribute("class", "question-title");
		  parentElement.appendChild(questionTextElement).innerHTML = question.question;

			question.answers.forEach((answer) => {
				const divElement = document.createElement("div");
				divElement.setAttribute("class", "form-check");
				const par = parentElement.appendChild(divElement);
				const inputElement = createRadioButton(question.questionID, answer); 
				const labelElement = createButtonLabel(answer);
				appendedAnswer = divElement.appendChild(inputElement)
				appendedAnswer = divElement.appendChild(labelElement)
			})
		})
}

// Create and return a label element
const createButtonLabel = (answer) => {
	const labelElement = document.createElement('label');
		labelElement.setAttribute("class", "form-check-label");
		labelElement.innerHTML = answer;
		return labelElement;
}

// Create and return a radio button element
const createRadioButton = (questionID, answer) => {
	const radioButton = document.createElement('input');
	radioButton.setAttribute("type", "radio")
	radioButton.setAttribute("value", answer);
	radioButton.setAttribute("name", `question-${questionID}`);
	radioButton.addEventListener("click", (event) => {
		const matchingQuestion = postObject.find((obj) => obj.question == questionID);
		matchingQuestion.answer = answer;
		checkDisabledStatus()
	});
	return radioButton;
}

// Check validity of form, and enable Submit button if need be
const checkDisabledStatus = () => {
	const submitButton = document.getElementById('survey-submit-button');
	const validForm = postObject.find((question) => question.answer == null)
	if (!validForm) {
		submitButton.removeAttribute("disabled");
	}
}

// Create input element for free text field
const createInput = (questionID) => {
	const inputElement = document.createElement('input');
	inputElement.setAttribute("class", "form-control");
	inputElement.addEventListener("input", (event) => {
	const matchingQuestion = postObject.find((obj) => obj.question == questionID);
		matchingQuestion.answer = event.srcElement.value;
		checkDisabledStatus();
	});
	return inputElement;
}

// Initialize body to POST survey results
const initializePostObject = (questions) => {
	questions.forEach((question) => {
		postObject.push({question: question.questionID, answer: null, questionType: question.questionType})
	})
}

const loadQuestions = async () => {
	const questions = await $.ajax({url: "app/json/questions.json"});
	initializePostObject(questions);
	return questions
};

// Post survey results to API
const submitSurvey = async () => {
	const response = await fetch("/survey", {
		headers: { 'Content-Type': 'application/json'},
		method: "POST",
		body: JSON.stringify(postObject),
	})
	if (response.status !== 200) {
		console.log(response);
	}
}

const loadPage = loadQuestions().then((response) =>{
	const multipleChoiceQs = response.filter((q) => q.questionType == 'Multiple Choice');
	const freeTextQs = response.filter((q) => q.questionType == 'Free Text');
	fillMultipleChoiceQuestions('multiple-choice-questions', multipleChoiceQs);
	fillFreeTextQuestions('free-text-questions', freeTextQs);
});
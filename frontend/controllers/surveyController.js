
// create input elements for free text
const fillFreeTextQuestions = (elem, questions) => {
		const parentElement = document.getElementById(elem);
		questions.forEach((question, index) => {
			console.log(question);
			const labelElement = createButtonLabel();
			const inputElement = createInput(question.questionID);
			const appendChildElement = parentElement.appendChild(labelElement)
			const appendInput = parentElement.appendChild(inputElement);
			appendChildElement.innerHTML = question.question;
	});
}
// create question elements from an array of question objects
const fillMultipleChoiceQuestions = (elem, questions) => {
	console.log(questions);
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

const createButtonLabel = (answer) => {
	const labelElement = document.createElement('label');
		labelElement.setAttribute("class", "form-check-label");
		labelElement.innerHTML = answer;
		return labelElement;
}


const createRadioButton = (questionID, answer) => {
	const radioButton = document.createElement('input');
	radioButton.setAttribute("type", "radio")
	radioButton.setAttribute("value", answer);
	radioButton.setAttribute("name", `question-${questionID}`);
	radioButton.addEventListener("click", (event) => {
		const matchingQuestion = postObject.find((obj) => obj.question == questionID);
		matchingQuestion.answer = answer;
	});
	return radioButton;
}

const createInput = (questionID) => {
	const inputElement = document.createElement('input');
	inputElement.setAttribute("class", "form-control");
	inputElement.addEventListener("input", (event) => {
	const matchingQuestion = postObject.find((obj) => obj.question == questionID);
		matchingQuestion.answer = event.srcElement.value;
	});
	return inputElement;
}

const postObject = [];

const initializePostObject = (questions) => {
	questions.forEach((question) => {
		postObject.push({question: question.questionID, answer: null, questionType: question.questionType})
	})
}

const loadQuestions = async () => {
	const questions = await $.ajax({url: "frontend/models/questions.json"});
	initializePostObject(questions);
	return questions
};

const submitSurvey = async () => {
	try {
		const response = await fetch("/survey", {
			headers: { 'Content-Type': 'application/json'},
			method: "POST",
			body: JSON.stringify(postObject),
		})
	} catch(e) {
		console.log(e);
	}

	// console.log(await response.json());
}

const loadPage = loadQuestions().then((response) =>{
	const multipleChoiceQs = response.filter((q) => q.questionType == 'Multiple Choice');
	const freeTextQs = response.filter((q) => q.questionType == 'Free Text');
	fillMultipleChoiceQuestions('multiple-choice-questions', multipleChoiceQs);
	fillFreeTextQuestions('free-text-questions', freeTextQs);
});
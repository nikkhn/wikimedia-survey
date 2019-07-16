
Use WikiSurvey;
CREATE TABLE users (
UserId int Auto_Increment,
Username varchar(50) NOT NULL,
PRIMARY KEY (UserId)
)

Use WikiSurvey;
CREATE TABLE questionTypes (
QuestionTypeID  int Auto_Increment,
QuestionType varchar(50) NOT NULL,
PRIMARY KEY (QuestionTypeID)
)

Use WikiSurvey;
INSERT INTO questionTypes (questiontype) values ("Multiple Choice");
INSERT INTO questionTypes (questiontype) values ("Free Text");

Use WikiSurvey;
CREATE TABLE questions (
QuestionID int Auto_Increment,
Question varchar(256) NOT NULL,
fk_QuestionType int NOT NULL,
FOREIGN KEY (fk_QuestionType) REFERENCES QuestionTypes(QuestionTypeID),
PRIMARY KEY (QuestionID)
);

Use WikiSurvey;
INSERT INTO questions (question, fk_questionType) values ("Who's your favorite princess?", 1);
INSERT INTO questions (question, fk_questionType) values ("What's your favorite pony type?", 1);
INSERT INTO questions (question, fk_questionType) values ("Who's your favorite pet?" , 1);
INSERT INTO questions (question, fk_questionType) values ("Which character do you want to see more of?", 2);
INSERT INTO questions (question, fk_questionType) values ("What's your favorite MLP fanfic?", 7);


Use WikiSurvey;
CREATE TABLE questions (
QuestionID int Auto_Increment,
Question varchar(256) NOT NULL,
fk_QuestionType int NOT NULL,
FOREIGN KEY (fk_QuestionType) REFERENCES QuestionTypes(QuestionTypeID),
PRIMARY KEY (QuestionID)
);


Use WikiSurvey;
CREATE TABLE answerTypes (
AnswerTypeID  int Auto_Increment,
AnswerType varchar(50) NOT NULL,
PRIMARY KEY (AnswerTypeID)
)

Use WikiSurvey;
INSERT INTO answerTypes (answerType) values ("Multiple Choice");
INSERT INTO answerTypes (answerType) values ("Free Text");


Use WikiSurvey;
CREATE TABLE answers (
AnswerID int Auto_Increment,
Answer varchar(256) NOT NULL,
fk_AnswerType int NOT NULL,
FOREIGN KEY (fk_AnswerType) REFERENCES AnswerTypes(AnswerTypeID),
PRIMARY KEY (AnswerID)
);

Use WikiSurvey;
CREATE TABLE questions_answers (
question_answer_ID int AUTO_Increment,
fk_questionID varchar(256) NOT NULL,
fk_answerId int NOT NULL,
 PRIMARY KEY (question_answer_ID)
);


-- SELECT * from answerTypes

-- Use WikiSurvey;
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Alicorn", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Earth Pony", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Pegasus" , 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Unicorn", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Zebra", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Sea Pony", 1);

-- INSERT INTO answers (Answer, fk_AnswerType) values ("Luna", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Celestia", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Cadance" , 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Twilight", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Opal", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Owloysius", 1);

-- INSERT INTO answers (Answer, fk_AnswerType) values ("Angel", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Tank", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Gummy" , 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Winona", 1);

-- INSERT INTO answers (Answer, fk_AnswerType) values ("Alicorn", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Earth Pony", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Pegasus" , 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Unicorn", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Zebra", 1);
-- INSERT INTO answers (Answer, fk_AnswerType) values ("Sea Pony", 1);

-- INSERT INTO answers (Answer, fk_AnswerType) values ("WooHoo!", 2);


-- USE wikisurvey;
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 1);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 2);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 3);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 4);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 5);


-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 7);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 8);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 9);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 10);

-- DELETE from questions_answers where fk_questionID = (SELECT  1)

-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 11);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 12);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 13);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 14);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 15);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 16);
-- INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 25);
-- INSERT into answers (answer, fk_answerType) values ("Dr. Who", 2);

-- SELECT * from questions
-- SELECT * from answers
-- SELECT * from questions_answers inner join questions on questions.questionID = fk_questionID inner join answers on 
-- answers.answerID = fk_answerID


Use WikiSurvey;
CREATE TABLE users_questions_answers (
fk_question_answer_ID int NOT NULL,
fk_userId  int NOT NULL,
FOREIGN KEY (fk_userId) REFERENCES Users(UserID),
FOREIGN KEY (fk_question_answer_ID) REFERENCES questions_answers(question_answer_ID)
);


-- SPROC for survey results
USE wikiSurvey;
DELIMITER //
CREATE  PROCEDURE GetSurveyResults()
   BEGIN
   SELECT * FROM
   ( SELECT  questions.questionID, questions.question,answers.answer, questionTypes.questionType, questions_answers.count
		FROM questions
		INNER JOIN questions_answers ON questions_answers.fk_questionID = questions.questionID
		INNER JOIN answers ON answers.AnswerID = questions_answers.fk_answerId
		INNER JOIN questionTypes ON questions.fk_questionType = questionTypes.questionTypeID
        GROUP BY  questions.questionID, questions.question, answers.answer,questionTypes.questionType, questions_answers.count
        ORDER BY count desc
	) results;

   END //
 DELIMITER ;

 

 







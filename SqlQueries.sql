
CREATE DATABASE WikiSurvey;

Use WikiSurvey;
CREATE TABLE questionTypes (
QuestionTypeID  int Auto_Increment,
QuestionType varchar(50) NOT NULL,
PRIMARY KEY (QuestionTypeID)
);

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
CREATE TABLE answerTypes (
AnswerTypeID  int Auto_Increment,
AnswerType varchar(50) NOT NULL,
PRIMARY KEY (AnswerTypeID)
);

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
count int DEFAULT 0,
 PRIMARY KEY (question_answer_ID)
);



Use WikiSurvey;
INSERT INTO questions (question, fk_questionType) values ("What's your favorite pony type?", 1);
INSERT INTO questions (question, fk_questionType) values ("Who's your favorite princess?", 1);
INSERT INTO questions (question, fk_questionType) values ("Who's your favorite pet?" , 1);
INSERT INTO questions (question, fk_questionType) values ("Which character do you want to see more of?", 2);
INSERT INTO questions (question, fk_questionType) values ("What's your favorite MLP fanfic?", 2);


-- Use WikiSurvey;
INSERT INTO answers (Answer, fk_AnswerType) values ("Alicorn", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Earth Pony", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Pegasus" , 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Unicorn", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Zebra", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Sea Pony", 1);

INSERT INTO answers (Answer, fk_AnswerType) values ("Luna", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Celestia", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Cadance" , 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Twilight", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Opal", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Owloysius", 1);

INSERT INTO answers (Answer, fk_AnswerType) values ("Angel", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Tank", 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Gummy" , 1);
INSERT INTO answers (Answer, fk_AnswerType) values ("Winona", 1);


-- USE wikisurvey;
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 1);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 2);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 3);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 4);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (1, 5);


INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 7);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 8);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 9);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 10);


INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 11);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 12);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 13);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 14);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 15);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (3, 16);
INSERT INTO questions_answers (fk_questionID, fk_answerID) values (2, 25);


SET SQL_SAFE_UPDATES = 0;

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

 
-- SPROC for inserting new survey data
USE wikiSurvey;
DELIMITER //
CREATE PROCEDURE PostSurvey(IN answerValue varchar(255), IN questionID int, IN inputAnswerType varchar(50))
BEGIN
SET @answerTypeID = (SELECT AnswerTypeID FROM answerTypes where AnswerType = inputAnswerType);
 SET @answerID = (SELECT answerID from answers where answer = answerValue and fk_answerType = @answerTypeID);
 IF ( @answerID IS NULL) THEN -- new answer
	INSERT INTO answers (answer, fk_answerType) VALUES (answerValue, @answerTypeID);
    INSERT INTO questions_answers (fk_questionId, fk_answerID, count) VALUES (questionID, LAST_INSERT_ID(), 1); 
ELSE 
	UPDATE questions_answers SET count = count+1 WHERE fk_questionID = questionID AND fk_answerID = @answerID;
END IF;
END //
DELIMITER ;







const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');
const port = 3000;

const app = require('express')();
app.use(express.static(__dirname));
app.use( bodyParser.json() );      
const pagesDirectory = '../wikimedia-survey/app/pages/';
const config = fs.readFileSync("config.json");
const { sql } = JSON.parse(config);
const connection = mysql.createConnection(sql);

connection.connect((err) => {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})

app.get('/', (req, res) => {  res.sendFile(path.join(__dirname, pagesDirectory, 'index.html'))});
app.get('/success', (req, res) => { res.sendFile(path.join(__dirname, pagesDirectory, 'success.html'))});
app.get('/reporting', (req, res) => { res.sendFile(path.join(__dirname, pagesDirectory, 'reporting.html'))});
app.get('/error', (req, res) => { res.sendFile(path.join(__dirname, pagesDirectory, 'error.html'))});

app.get('/results', (req, res, next) => {
	connection.query('CALL GetSurveyResults()', (error, results, fields) => {
	   if (error) {
		   next(error)
	   } else {
			res.status(200).send(JSON.stringify(results));
	   }
	 });
 });

 app.post('/survey', (req, res, next) => {
	const params = req.body;
	console.log(params);
	params.forEach((param) => {
		const { question, answer, questionType } = param;
		if (!question || !answer || !questionType) {
			return res.status(400).send('Missing required param');
		}
		connection.query('SET @answer = ' + "'" + answer +"'"  + '; SET @questionID = ' + "'" + question + "'" + '; SET @inputAnswerType = ' + "'" + questionType + "'" + '; CALL PostSurvey(@answer, @questionID, @inputAnswerType);', (error, results, fields) =>{
			if (error) {
				return res.status(500).send('Error occurred sending survey');
			}
		});
	})
	return res.status(200).send('Success');
	
 });
 
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



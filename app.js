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
// app.use(bodyParser.urlencoded({  
//   extended: true
// }));
const pagesDirectory = '../wikimedia-survey/frontend/pages/';

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'wikipass',
  database : 'WikiSurvey'
});
 
 
connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})

app.get('/', (req, res) => {  res.sendFile(path.join(__dirname, pagesDirectory, 'index.html'))});
app.get('/success', (req, res) => { res.sendFile(path.join(__dirname, pagesDirectory, 'success.html'))});
app.get('/reporting', (req, res) => { res.sendFile(path.join(__dirname, pagesDirectory, 'reporting.html'))});

app.get('/results', function (req, res) {
	connection.query('CALL GetSurveyResults()', function (error, results, fields) {
	   if (error) throw error;
	   res.end(JSON.stringify(results));
	 });
 });


 app.post('/survey', function (req, res, err) {
	const params  = req.body;
	let sql = `CALL PostSurveyData(?)`;
	console.log(params.length);
	let sqlString = '';
	const questionAnswerData = params.map((param) => {
		// console.log(param);
		sqlString += param.question + ',';
		sqlString += param.answer + ',';
	})
	console.log(sqlString);
	// connection.query(sql, params, function (error, results, fields) {
	// 	console.log(error);
	//    if (error) throw error;
	//    res.end(JSON.stringify(results));
	//  });
 });
 
app.get('/results', (req, res) => { res.send()} )
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



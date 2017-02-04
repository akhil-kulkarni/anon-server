/*jshint esversion: 6 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

var pgp = require("pg-promise")();

var DB_URL = "postgres://localhost/anon-db";
let db = pgp(DB_URL);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/login', function (req, res) {
	console.log("request.body:: " + JSON.stringify(req.body));
	db.any("SELECT * from fys_txn_userinfo where username=$1",[req.body.Key.REQ.USERNAME]).then(function (data) {
		console.log("DATA:", JSON.stringify(data));
		if(data.length>0) {
			if(data[0].password == req.body.Key.REQ.PASSWORD)
				res.send('success');
			else
				res.send('failure');
		}
		else{
			res.send('failure');
		}
	}).catch(function (error) {
		console.log("ERROR:", error);
		res.send('failure');
	});

});


app.post('/register', function (req, res) {
	console.log("in register: " + JSON.stringify(req.body));
	let recToInsert = req.body.Key.REQ.REG_DATA;
	if(!!recToInsert.USERNAME && !!recToInsert.PASSWORD && !!recToInsert.FIRST_NAME && !!recToInsert.LAST_NAME && !!recToInsert.EMAIL_ID && !!recToInsert.DOB && !!recToInsert.OCCUPATION && !!recToInsert.SEX && !!recToInsert.COUNTRY_CODE && !!recToInsert.STATE && !!recToInsert.CITY && !!recToInsert.ZIPCODE){
		let parameterList = [recToInsert.USERNAME, recToInsert.PASSWORD, recToInsert.FIRST_NAME, recToInsert.MIDDLE_NAME, recToInsert.LAST_NAME, recToInsert.EMAIL_ID, recToInsert.DOB, recToInsert.OCCUPATION, recToInsert.SEX, recToInsert.COUNTRY_CODE, recToInsert.STATE, recToInsert.CITY, recToInsert.ZIPCODE];
		db.query("insert into fys_tx_userinfo (username, password, first_name, middle_name, last_name, email_id, dob, occupation, sex, country_code, state, city, zipcode)", parameterList).then(function (data) {
			console.log("DATA:", JSON.stringify(data));
			if(!!data) {
				res.send('success');
			}
			else{
				res.send('failure');
			}
		}).catch(function (error) {
			console.log("ERROR:", error);
			res.send('failure');
		});
	}
	else{
		res.send('mandatory data missing');
	}

});

app.post('/fetchData', function (req, res) {
	console.log("fetchData request.body:: " + JSON.stringify(req.body));
	if(!!req.body.Key.REQ && req.body.Key.REQ.ACN == "COUNTRY_LIST"){
		db.any("select name as COUNTRY_NAME, iso as COUNTRY_CODE from fys_mst_country",[]).then(function (data) {
			console.log("DATA:", (!!data?data.length:null));
			if(data.length>0) {
				res.send(data);
			}
			else{
				res.send('failure');
			}
		}).catch(function (error) {
			console.log("ERROR:", error);
			res.send('failure');
		});
	}
	else{
		res.send('failure');
	}

});


app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

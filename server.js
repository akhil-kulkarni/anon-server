var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

var pgp = require("pg-promise")(/*options*/);

var DB_URL = "postgres://localhost/anon-db";

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/login', function (req, res) {
	console.log("request.body:: " + JSON.stringify(req.body));

	var db = pgp(DB_URL);

	db.any("SELECT * from login where username=$1",[req.body.Key.REQ.USERNAME]).then(function (data) {
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
	});

});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

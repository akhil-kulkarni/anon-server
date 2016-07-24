var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

var mongoClient = require('mongodb').MongoClient;

var DB_URL = 'mongodb://localhost/anon-db';

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/login', function (req, res) {
	console.log("request.body:: " + JSON.stringify(req.body));
	mongoClient.connect(DB_URL, function(err, db) {
		if (err) {
			throw err;
		}
		db.collection('collection').find({'username': req.body.Key.REQ.USERNAME}).toArray(function(err, result) {
			if (err) {
				throw err;
			}
			console.log(result);
			if(result.length>0) {
				if(result[0].password == req.body.Key.REQ.PASSWORD)
					res.send('success');
				else
					res.send('failure');
			}
			else{
				res.send('failure');
			}
		});
	});
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

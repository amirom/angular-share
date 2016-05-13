var express = require('express');
var app = express();                              
var bodyParser = require('body-parser'); 
var request = require('request');   

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


function handleError(res, reason, msg, code) {
	console.log("Error: " + reason);
	res.status(code || 500).json({"error":msg});
}

app.get('/media', function(req,res) {
	request('http://omquin.pythonanywhere.com/media', 
		function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var jarr = [];
			var obj = JSON.parse(body).data;
			for (i = 0; i < obj.length; i++) {
				console.log(obj[i].media);
				jarr.push({src:'http://omquin.pythonanywhere.com/' + obj[i].media, 
					id:obj[i].id});
			}
			res.contentType('application/json');
			res.send(JSON.stringify(jarr));
		}
	});
});

app.post('/email', function(req,res) {
	res.send("email");
});

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App running on port", port);
});
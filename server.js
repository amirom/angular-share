var express = require('express');
var app = express();                              
var bodyParser = require('body-parser'); 
var request = require('request');
var fs = require('fs');
var path = require('path');   

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


function handleError(res, reason, msg, code) {
	console.log("Error: " + reason);
	res.status(code || 500).json({"error":msg});
}

app.get('/media', function(req,res) {
	var url = 'http://omquin.pythonanywhere.com/media';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var jarr = [];
			var obj = JSON.parse(body).data;
			for (i = 0; i < 4; i++) {
				jarr.push({src:'http://omquin.pythonanywhere.com/' + obj[i].media, 
					id:obj[i].id});
			}
			res.contentType('application/json');
			res.send(JSON.stringify(jarr));
		}
	});
});

app.get('/test', function (req, res) {
	// var fule = function fileList(dir) {
 //  		return fs.readdirSync(dir).reduce(function(list, file) {
	// 	    var name = path.join(dir, file);
	// 	    var isDir = fs.statSync(name).isDirectory();
	// 	    return list.concat(isDir ? fileList(name) : [name]);
	// 	  }, []);
	// }
	// res.send(fule('./public/img'));
	fs.readdir(path, function(err, items) {
	    console.log(items);
	 
	    for (var i=0; i<items.length; i++) {
	        console.log(items[i]);
	    }
	});
});

// path = request.args.get('media')
// email = request.args.get('email')
// mediaId = request.args.get('id')
app.post('/email', function(req,res) {
	var options = {
	    url: 'http://samwize.com',
	    method: 'POST',
	    headers: headers,
	    form: {
	    	'path': 'xxx', 
	    	'email': 'yyy',
	    	'mediaId': 'bbb'
	    }
	}
 
	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        // Print out the response body
	        console.log(body)
	    }
	});
	res.send("email");
});

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App running on port", port);
});
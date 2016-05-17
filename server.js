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

// app.use(function noCache(req, res, next){

//     res.header("Cache-Control", "no-cache, no-store, must-revalidate");
//     res.header("Pragma", "no-cache");
//     res.header("Expires",0);
//     next();
// });

app.get('/media', function (req,res) {
	var url = 'http://omquin.pythonanywhere.com/media';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var jarr = [];
			var obj = JSON.parse(body).data;
			for (i = 0; i < 2; i++) {
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
	fs.readdir(path, function (err, items) {
	    console.log(items);
	 
	    for (var i=0; i<items.length; i++) {
	        console.log(items[i]);
	    }
	});
});

// path = request.args.get('media')
// email = request.args.get('email')
// mediaId = request.args.get('id')
app.post('/email', function (req, res) {

var fullBody = '';
    
    req.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk.toString();
      res.send(fullBody);
    });
    
    req.on('end', function() {
    
      // request ended -> do something with the data
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      
      // parse the received body data
      var decodedBody = querystring.parse(fullBody);
 		res.send(decodedBody + 'dfdf');
      // output the decoded data to the HTTP response          
    
      
      res.end();
  });


	
});

var server = app.listen(process.env.PORT || 8000, function () {
	var port = server.address().port;
	console.log("App running on port", port);
});
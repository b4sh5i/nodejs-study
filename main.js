var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
	var queryData = url.parse(_url, true).query;
	
    if(_url == '/'){
      queryData.id = 'HTML';
    }
	if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
	
    response.writeHead(200);
	fs.readFile(`HTML/${queryData.id}`, 'utf8', function(err, data) {
		var desc = data;
		var template = `
		<!doctype html>
		<html>
		<head>
			<title>WEB1 - Welcome</title>
			<meta charset="utf-8">
		</head>
		<body>
			<h1><a href="/index.html">WEB</a></h1>
			<ol>
			<li><a href="/?id=HTML">HTML</a></li>
				<li><a href="/?id=HTML">CSS</a></li>
				<li><a href="/?id=HTML">JavaScript</a></li>
			</ol>
			<h2>${queryData.id}</h2>
			<p>${desc}</p>
		</body>
		</html>
		`;
    	response.end(template); // fs.readFileSync(__dirname + _url)
	});
});

app.listen(6974);

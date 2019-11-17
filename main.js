var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = {
	html : function SetTemplateHTML(list, title, description, control){
		return `
		<!doctype html>
      	<html>
		<head>
       		<title>WEB1 - ${title}</title>
        	<meta charset="utf-8">
		</head>
        <body>
        	<h1><a href="/">WEB</a></h1>
        	${list}
			${control}
         	<h2>${title}</h2>
         	${description}
		</body>
        </html>`;
	},
	SetList : function SetTemplateList(filelist){
		var list = '<ul>';
    	var i = 0;
    	while(i < filelist.length){
    		list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    		i = i + 1;
   		}
    	list = list+'</ul>';
		return list;
	}
}

function SetTemplateHTML(list, title, description, control){
	return `
		<!doctype html>
        <html>
		<head>
        	<title>WEB1 - ${title}</title>
            <meta charset="utf-8">
		</head>
        <body>
        	<h1><a href="/">WEB</a></h1>
        	${list}
			${control}
            <h2>${title}</h2>
            ${description}
		</body>
        </html>`;
}

function SetTemplateList(filelist){
	var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
    	list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    	i = i + 1;
   	}
    list = list+'</ul>';
	return list;
}

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
        if (queryData.id === undefined) {
        	fs.readdir('./data', function(error, filelist){
        		var title = 'Welcome';
          		var description = 'Hello, Node.js';
				response.writeHead(200);
            	response.end(SetTemplateHTML(SetTemplateList(filelist), title, `<p>${description}</p>`, 
											 `<a href='/create'>create</a>`));	
			});
        } 
		else {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                fs.readdir('./data', function(error, filelist){
        			var title = queryData.id;
					response.writeHead(200);
                	response.end(SetTemplateHTML(SetTemplateList(filelist), title, `<p>${description}</p>`,`
						<a href='/create'>create</a> 
						<a href='/update?id=${title}'>update</a>
						<form action='delete_process', method='post'>
							<input type='hidden' name='id', value='${title}'>
							<input type='submit' value='delete'>
						</from>
					`));
				}); 
            });
        }
    }
	else if (pathname === '/create'){
        fs.readdir('./data', function(error, filelist){
        	var title = 'Web - create';
			var description = `
				<form action='/create_process' method='post'>
				<p>
					<input type='text' name='title' placeholder='Title'>
				</p>
				<p>
					<textarea name='description' placeholder='description'></textarea>
				</p>
				<p>
					<input type='submit'>
				</p>
				</form>
			`;
			response.writeHead(200);
            response.end(SetTemplateHTML(SetTemplateList(filelist), title, description, ''));	
		});
	}
	else if(pathname === '/create_process'){
		var body = '';
		request.on('data', function(data){
			body += data;
			//if(body.length > 0x200)
			//	request.connection.destroy();
		});
		request.on('end', function(){
			var post = qs.parse(body);
			var title = post.title;
			var description = post.description;
			fs.writeFile(`data/${title}`, `${description}`, 'utf8', function(err){
				if (err) throw err;
				response.writeHead(302, {Location : `https://b4sh5i.run.goorm.io/?id=${title}`});
				response.end('Success!');
			});
		});
	}
	else if (pathname === '/update'){
		fs.readdir('./data', function(error, filelist){
    		fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
        		var title = queryData.id;
				var _description = `
				<form action='/update_process' method='post'>
				<input type='hidden' name='id' value="${title}">
				<p>
					<input type='text' name='title' value='${title}'>
				</p>
				<p>
					<textarea name='description'>${description}</textarea>
				</p>
				<p>
					<input type='submit'>
				</p>
				</form>
				`;
				response.writeHead(200);
                response.end(SetTemplateHTML(SetTemplateList(filelist), title, `<p>${_description}</p>`,''));
			}); 
        });
	}
	else if(pathname === '/update_process'){
		var body = '';
		request.on('data', function(data){
			body += data;
			//if(body.length > 0x200)
			//	request.connection.destroy();
		});
		request.on('end', function(){
			var post = qs.parse(body);
			var title = post.title;
			var id = post.id;
			var description = post.description;
			fs.rename(`data/${id}`, `data/${title}`, function(err){
				if(err) throw err;
				fs.writeFile(`data/${title}`, `${description}`, 'utf8', function(err){
					if (err) throw err;
					response.writeHead(302, {Location : `/?id=${title}`});
					response.end('Success!');
				});
			})
		});
	}
	else if(pathname === '/delete_process'){
		var body = '';
		request.on('data', function(data){
			body += data;
			//if(body.length > 0x200)
			//	request.connection.destroy();
		});
		request.on('end', function(){
			var post = qs.parse(body);
			var id = post.id;
			fs.unlink(`data/${id}`, function(err){
				if(err) throw err;
				console.log(`[*] remove data/${id} file.`);
				response.writeHead(302, {Location : "/"});
				response.end('Success!');
			});
		});
	}
	else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(6974);
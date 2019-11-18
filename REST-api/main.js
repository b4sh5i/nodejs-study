const http = require('http');

const port = 6974;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
 	res.end('Hello World\n');
});

server.listen(port, () => {
 	console.log(`Server running at http://b4sh5i.run.goorm.io:${port}/`);
});
var fs = require('fs');

/*
// READFILE SYNC
console.log("A");
console.log(fs.readFileSync('/workspace/nodejs-study/syntax/test.txt', 'utf8'));
console.log("C");
*/

console.log("A");
fs.readFileSync('/workspace/nodejs-study/syntax/test.txt', 'utf8', function(err, result){
	console.log(result);
});
console.log("C");

const express = require('express');
const bodyparser = require('body-parser');
const mocha = require('mocha');
const app = express();


app.get('/', (req, res) => {
  res.send('Hello World!\n');
 });

app.listen(6974, () => {
  console.log('Example app listening on port 6974!');
});

let users = [
  {
    id: 1,
    name: 'alice'
  },
  {
    id: 2,
    name: 'bek'
  },
  {
    id: 3,
    name: 'chris'
  }
]

app.get('/users', (req, res) => res.json(users));

app.get('/users/:id', (req, res) => {
	const id = parseInt(req.params.id, 10);
	if (!id) {
		return res.status(400).json({error: 'Incorrect id'});
  	}
	let user = users.filter(user => user.id === id)[0];
	if (!user){
		return res.status(404).json({error: 'Unknown user'});
	}
	return res.json(user);
});

app.delete('/users/:id', (req, res) => {
	const id = parseInt(req.params.id, 10);
	if (!id) {
		return res.status(400).json({error: 'Incorrect id'});
	const userIdx = users.findIndex(user => user.id === id);
	if (userIdx === -1){
		console.log("?");
		return res.status(404).json({error: 'Unknown user'});
	}
	users.splice(userIdx, 1);
	console.log(users);
	return res.status(204).send();
  }
});

app.post('/users', (req, res) => {
	const name_ = req.body.name || '';
	if (!name_.length) {
		return res.status(400).json({error: 'Incorrenct name'});
	}
	const id_ = users.reduce((maxId, user) => {
		return user.id > maxId ? user.id : maxId
	}, 0) + 1;
	const newUser = {
		id: id_,
		name: name_
	};
	users.push(newUser);
	return res.status(201).json(newUser);
});

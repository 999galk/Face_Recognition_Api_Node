const express = require('express');
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users : [
		{
			id:'1',
			name: 'john',
			email: 'a@gmail.com',
			password: 'cookie',
			entries : 0,
			joined : new Date()
		},
		{
			id:'2',
			name: 'sally',
			email: 's@gmail.com',
			password: 'banana',
			entries : 0,
			joined : new Date()
		}
	],
	login : [
		{
			id: '123',
			hash: '',
			email: 'a@gmail.com'
		}
	]
}

app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req,res) => {
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
		res.json(database.users[0]);
	} else {
		res.json('error signing in')
	}
})

app.post('/register', (req,res) => {
	const { email, name , password} = req.body;
	//bcrypt.hash(password, null, null, function(err, hash) {
    	// Store hash in your password DB.
	//});
	database.users.push({
		id:'3',
		name: name,
		email: email,
		password: password,
		entries : 0,
		joined : new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req,res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		}
		if(!found){
			res.status(404).json('user doesnt exist');
		}
	})
})

app.put('/image', (req,res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			user.entries++;
			return res.json(user.entries);
		}
		if(!found){
			res.status(404).json('user doesnt exist');
		}
	})
})

app.listen(3001, () =>{
	console.log('app is running on port 3001');
})
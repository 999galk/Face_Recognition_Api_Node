const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '1234',
    database : 'smartbrain'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req,res) => {
	const {email, password} = req.body;
	db.select('email','hash').from('login')
	.where('email', '=', email).then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if(isValid){
			return db.select('*').from('users').where('email', '=', email).then(user => {
				res.json(user[0]);
			}).catch(err => res.status(400).json('unable to get user'))
		} else {
			res.status(404).json('incorrect login credentials')
		}
	}).catch(err => res.status(400).json('Error getting users data'));
})

app.post('/register', (req,res) => {
	const { email, name , password} = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx =>{
		trx.insert({
			hash : hash,
			email : email
		}).into('login').returning('email').then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				name: name,
				email: loginEmail[0],
				joined : new Date()
			}).then(user => res.json(user[0]));
		})
		.then(trx.commit)
		.catch(trx.rollback)
	}).catch(err => res.status(400).json('Unable to regiser user'));
})

app.get('/profile/:id', (req,res) => {
	const { id } = req.params;
	db.select('*').from('users').where({
		id : id}).then(user => {
		if(user.length){
			res.json(user[0]);
		} else{
			res.status(404).json('user doesnt exist');
		}
	}).catch(err => res.status(400).json('Error getting users'));
			
})

app.put('/image', (req,res) => {
	const { id } = req.body;
	let found = false;
	
	db('users').where('id', '=', id).increment('entries', 1).returning('entries').then(entries => {
		if(entries.length){
			res.json(entries);
		} else{
			res.status(404).json('user doesnt exist');	
		}
	}).catch(err => res.status(400).json('Error getting entries'));

})

app.listen(3001, () =>{
	console.log('app is running on port 3001');
})
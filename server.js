const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl : true,
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.json('Hey you!');
})

app.post('/signin', (req,res) => {
	signin.handleSignin(req,res,db,bcrypt);
})

app.post('/register', (req,res) => {
	register.handleRegister(req,res,db,bcrypt);
})

app.get('/profile/:id', (req,res) => { 
	profile.getUserProfile(req,res,db);
})

//another way of calling the function from the external module - the req, res are called after the function is triggered anyways so we don't have to mention it here
//we do need to add it in the module !! (db) => (req,res) => {actions}
app.put('/image', image.changeEntries(db))
app.post('/imageUrl', image.handleApiCall())

app.listen(process.env.PORT || 3001 , () =>{
	console.log('app is running on port ${process.env.PORT}');
})
'use strict'
const log = console.log;

const databaselink='mongodb://Micari:password1@ds021681.mlab.com:21681/conspire_db'

const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const movieServer = require('./movie-getter')
const path = require('path')
var session = require('express-session')
const { Movie } = require('./model/Movie')
const { User } = require('./model/User')
const Discussion = require('./model/Discussion')
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const multer = require("multer");
const { ObjectID } = require('mongodb')

mongoose.connect(databaselink, { useNewUrlParser: true});
app.use( express.static( path.join(__dirname, '../App') ));
app.use(session({
	secret: 'somesecret',
	resave: false,
    saveUninitialized: false,
	cookie: {
		expires: 600000,
        httpOnly: true
	}
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionChecker = (req, res, next)=>{
    if(req.session.user) {
        res.redirect('/home')
    }else{
        next()
    }
}

var storage = multer.diskStorage({
    destination: '../App/Pictures',
    filename: function (req, file, cb) {
        cb(null, Date.now()+'-'+file.originalname);
    }
});

const movie_routes = require('./routes/movie_routes');
const discussion_routes  = require('./routes/discussion_routes');
const user_routes  = require('./routes/user_routes');
app.use('/', movie_routes);
app.use('/', discussion_routes);
app.use('/', user_routes);
// app.use(app.router);
// user_routes.initialize(app);
app.use('/', user_routes)

var upload = multer({storage: storage});

app.use(upload.single('photo'));

/* 
*get Login page
 */
app.get('/',sessionChecker, (req, res) => {
    res.redirect('/login')
})

app.get('/login', sessionChecker,(req,res) => {
    res.sendFile(path.join(__dirname, '../App/Login/index.html'))   
});

app.post('/users/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.authenticate(username, password).then((user) => {
		if (!user) {
            res.status(400).send("invalid user")
		} else {
            req.session.user = user._id
			res.redirect('/home')
		}
	}).catch((error) => {
		res.status(400).send("invalid user")
	})  
});

app.post('/creatUser',(req, res)=>{
    const userData = new User({
        username: req.body.username,
        password: req.body.password,
        admin: false,
        icon: req.body.img,
        like:0,
        discussion:[],
        comments:[]
      })
      userData.save(function (error, user) {
        if (error) {
            res.send(error)
        } else {
          req.session.userId = user._id;
          return res.redirect('/home');
        }
      });
})

app.get('/logout', (req, res)=>{
    req.session.destroy((error)=>{
        if(error){
            res.status(500).send(error)
        }else{
            res.redirect('/login')
        }
    })
})

/* 
*get Home page
 */
app.get('/home', (req, res) => {
    //check if we have active session cookie
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/Homepage/homepage.html')) 
    }else{
        res.redirect('/login')
    }
})

/* 
*get discussion page
 */
app.get('/discussionPage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/DiscussionPage/discussion_topic_page.html')) 
    }else{
        res.redirect('/login')
    }
})

/* 
*get profile page
 */
app.get('/profilePage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/UserProfile/user_profile.html'))   
    }else{
        res.redirect('/login')
    }
})

/* 
*get movie page
 */
app.get('/moviePage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/MoviePage/movie_page.html')) 
    }else{
        res.redirect('/login')
    } 
})

/* 
*get admin dash
 */
app.get('/adminDash', (req, res) => {
    res.sendFile(path.join(__dirname, '../App/AdminDash/admin.html'))   
})

 
//This save a the uploaded img to dest folder
app.post('/uploadImg', function(req, res, next){
    res.send(JSON.stringify(req.file.filename));
});

// GET user by id
app.get('/user/:id', (req, res) => {
    const id = req.params.id 
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

app.get('/user/:id', (req, res) => {
    const id = req.params.id 
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

app.listen(port, () => {
    log(`Listening on port ${port}...`)
})


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
mongoose.set('useFindAndModify', false);
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "dxpmsmv08",
    api_key: 897789924997634,
    api_secret: "Gju0WMIQF7Ys_nL-_pe3b_nmLCo"
    });
    const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"],
    });

    const parser = multer({ storage: storage });

mongoose.connect(databaselink, { useNewUrlParser: true});
app.use( express.static( path.join(__dirname, './App') ));
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

const movie_routes = require('./routes/movie_routes');
const discussion_routes  = require('./routes/discussion_routes');
const user_routes  = require('./routes/user_routes');
const page_routes = require('./routes/page_routes');
app.use('/', movie_routes);
app.use('/', discussion_routes);
// app.use(app.router);
// user_routes.initialize(app);
app.use('/', user_routes)
app.use('/', page_routes)

app.post('/users/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.authenticate(username, password).then((user) => {
		if (!user) {
            res.status(400).send("invalid user")
		} else {
            req.session.user = user._id
            res.redirect('/adminDash')
		}
	}).catch((error) => {
		res.status(400).send("invalid user")
	})  
});

app.get('/logout', (req, res)=>{
    req.session.destroy((error)=>{
        if(error){
            res.status(500).send(error)
        }else{
            res.redirect('/loginPage')
        }
    })
})
 
//Upload img to cloud
app.post('/uploadImg', parser.single("photo"), (req, res) => {
    res.send(JSON.stringify(req.file.url))
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

app.listen(port, () => {
    log(`Listening on port ${port}...`)
})


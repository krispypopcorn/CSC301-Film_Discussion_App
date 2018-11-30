'use strict'
const log = console.log;

const databaselink='mongodb://Micari:password1@ds021681.mlab.com:21681/conspire_db'

const express = require('express')
const port = process.env.PORT || 8000
const movieServer = require('./movie-getter')
const path = require('path')
var session = require('express-session')
const { Movie } = require('./model/Movie')
const User = require('./model/User')
const Discussion = require('./model/Discussion')
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
mongoose.connect(databaselink, { useNewUrlParser: true});
const app = express()
app.use( express.static( path.join(__dirname, '../App') ));
app.use(session({
	secret: 'somesecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 60000,
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

/* 
*get Login page
 */
app.get('/',sessionChecker, (req, res) => {
    res.redirect('/login')
})

app.get('/login', sessionChecker,(req,res) => {
    console.log(res.session.user)
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
        icon: "temp",
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
        res.redirect('login')
    }
})

/* 
*get profile page
 */
app.get('/profilePage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/UserProfile/user_profile.html'))   
    }else{
        res.redirect('login')
    }
})

/* 
*get movie page
 */
app.get('/moviePage', (req, res) => {
    if(req.session.user){
        es.sendFile(path.join(__dirname, '../App/MoviePage/movie_page.html')) 
    }else{
        res.redirect('login')
    } 
})

/* 
*get admin dash
 */
app.get('/adminDash', (req, res) => {
    res.sendFile(path.join(__dirname, '../App/AdminDash/admin.html'))   
})

app.get('/getNowPlaying', (req, res) => {
    movieServer.getNowPlaying().then((result)=> {
        res.send(result)
    })
})

app.get('/getTrending', (req, res) => {

    let count = 0;
    let data = []
    movieServer.getTrending().then((result) => {
        for(let i = 0; i < result.length; i++) {
            count++;
            let movie = new Movie({
                name: result[i].title,
                year: result[i].release_date,
                poster: 'https://image.tmdb.org/t/p/original/' + result[i].poster_path,
                banner: 'https://image.tmdb.org/t/p/original/' + result[i].backdrop_path
            })
            data.push(movie)
            // log('works2')    
        }
        return data
    }).then((result) => {
    Movie.insertMany(result).then((dataInserted) => {
        res.send(dataInserted)
        })

    })
});
    
/*
    Returns all the current movies in the database
*/
app.get('/findAllMovies', (req, res) => {
    Movie.find().then((movies) => {
        res.send(movies)
    })
})

/*
    Adds a single movie given a name and release
    year
*/
app.get('/movie/:name/:year', (req, res) => {
    const name = req.params.name
    const year = req.params.year
    // let movieObject
    movieServer.getMovie(name, year).then((result) => {

        new Movie({
        name: result.title,
        year: result.release_date,
        poster: result.poster_path,
        banner: result.backdrop_path,
        numOfDiscussions: 0,
        numOfComments: 0,
        vote_average: 0
            // discussions: null
        }).save().then(result => {
            res.send(result)
        })        
    }).catch((error) => {
        log(error)
    })
});

/*
    Deletes all movies in the database
*/
app.get('/deleteAllMovies', (req, res) => {
    Movie.deleteMany({ }).then((result) => {
        res.send(result)
    })
})

app.get('/search/:name/:year', (req, res) => {
    const name = req.params.name
    const year = req.params.year
    // let movieObject
    movieServer.getMovie(name, year).then((result) => {

        let data = {
        name: result.title,
        year: result.release_date,
        poster: result.poster_path,
        banner: result.backdrop_path,
        numOfDiscussions: 0,
        numOfComments: 0,
        vote_average: 0
            // discussions: null
        }
        return data;
    }).then((result) => {
        res.send(result)
    }).catch((error) => {
        log(error)
    })
})

/*
    get all discussions in the database
*/

app.get('/getAllDiscussions', (req, res) => {
     Discussion.find().then((discussions) => {
         res.send(discussions)
     })
})

app.get('/getMovieCount', (req, res) => {
    Movie.count({}, (error, count) => {
        res.send({
            value: count
        })
        console.log(count)
    })
})

app.listen(port, () => {
    log(`Listening on port ${port}...`)
})


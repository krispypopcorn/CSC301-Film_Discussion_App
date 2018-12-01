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
const multer = require("multer");
const { ObjectID } = require('mongodb')

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

var storage = multer.diskStorage({
    destination: '../App/Pictures',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

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

app.post('/creatDiscussion',(req, res)=>{
    const disc = new Discussion({
        title: req.body.title,
        discussion_content: req.body.discussion_content,
        user: req.session.user,
        movie: req.body.movie,
        img: req.body.img
      })
      disc.save(function (error, user) {
        if (error) {
            res.send(error)
        } else {
          console.log("new discussion posted")
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

app.get('/getNowPlaying', (req, res) => {
    movieServer.getNowPlaying().then((result)=> {
        res.send(result)
    })
})

/*
    Populates the most top 20 most trending movies in the database
*/

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

/*
    Searched a new movie from movieDB server to be added to the
    database
*/

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
        overview: result.overview,
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

/*
    Get the number of movies currently in the database
*/

app.get('/getMovieCount', (req, res) => {
    Movie.count({}, (error, count) => {
        res.send({
            value: count
        })
        log(count)
    })
})

/*
    Searches a movie in the database give the name of the 
    movie
*/

app.get('/search/:name', (req, res) => {

    const movieName = req.params.name
    // console.log(movieName)
    Movie.findOne({name: movieName}).then((result) => {
        if (!result) {
            res.send({
                "name": "NOT FOUND"
            })
        }
        else {
            res.send(result)
        }
    })
})

/*
    Deletes a movie from the database given a movie name
*/

app.delete('/search/:name', (req, res) => {
    const movieName = req.params.name

    Movie.remove({name: movieName}).then((result) => {
        res.status(200).send()
    }).catch((error) => {
        res.status(400).send()
    })
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

app.listen(port, () => {
    log(`Listening on port ${port}...`)
})


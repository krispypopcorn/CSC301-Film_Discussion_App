'use strict'
const log = console.log;

const databaselink='mongodb://Micari:password1@ds021681.mlab.com:21681/conspire_db'
const express = require('express')
const port = process.env.PORT || 8000
const movieServer = require('./movie-getter')
const path = require('path')
// const { Movie } = require('../Models/./Movie')
const { Movie } = require('./model/Movie')
// const { mongoose } = require('../Database/db/mongoose');
const mongoose = require('mongoose')
const mongo = require('mongodb')
mongoose.connect(databaselink, { useNewUrlParser: true});
// mongoose.connect('mongodb+srv://admin:admin@cluster0-6kdjm.mongodb.net/admin')

const app = express()

app.use( express.static( path.join(__dirname, '../App') ));

/* 
*get Login page
 */
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../App/Login/index.html'))   
})

/* 
*get Home page
 */
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../App/Homepage/homepage.html'))   
})

/* 
*get discussion page
 */
app.get('/discussionPage', (req, res) => {
    res.sendFile(path.join(__dirname, '../App/DiscussionPage/discussion_topic_page.html'))   
})

/* 
*get profile page
 */
app.get('/profilePage', (req, res) => {
    res.sendFile(path.join(__dirname, '../App/UserProfile/user_profile.html'))   
})

/* 
*get movie page
 */
app.get('/moviePage', (req, res) => {
    res.sendFile(path.join(__dirname, '../App/MoviePage/movie_page.html'))   
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
})
    // Movie.insertMany(data).then((result) => {
    //     res.send(result)
    //     log(`${result} movies were added`)
    // })
    // }).catch((error) => {
    //     console.log(error)
    // })

    

    // Movie.find().then((movies) => {
	// 	res.send({ movies }) 
	// }, (error) => {
	// 	res.status(400).send(error)
	// })
    

app.get('/movies', (req, res) => {
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
})

/*
    Returns all the current movies in the database
*/
app.get('/findAll', (req, res) => {
    log('found me')
    Movie.find({}).then((movies) => {
		res.send({ movies }) 
	}, (error) => {
		res.status(400).send(error)
	})
})

/*
    Deletes all movies in the database
*/
app.get('/delete', (req, res) => {
    Movie.deleteMany({ }).then((result) => {
        res.send(result)
    })
})


/*
    get all discussions in the database
*/

app.get('/discussions', (req, res) => {
    Discussion.find().then((discussions) => {
        res.send(discussions)
    })
})


app.listen(port, () => {
    log(`Listening on port ${port}...`)
})


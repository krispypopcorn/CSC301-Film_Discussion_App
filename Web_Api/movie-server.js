'use strict'
const log = console.log;

const express = require('express')
const port = process.env.PORT || 8000
const movieServer = require('./movie-getter')
// const { Movie } = require('../Models/./Movie')
const { Movie } = require('./model/Movie')
// const { mongoose } = require('../Database/db/mongoose');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/ConspireView', { useNewUrlParser: true});
// mongoose.connect('mongodb+srv://admin:admin@cluster0-6kdjm.mongodb.net/admin')

const app = express()

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
                banner: 'https://image.tmdb.org/t/p/original/' + result[i].backdrop_path,
                numOfDiscussions: 0,
                numOfComments: 0,
                vote_average: 0
            })
            data.push(movie)
            // log('works2')    
        }
        return count
    }).then((result) => {
        Movie.insertMany(data).then((result) => {
            res.send(result)
        })
        log(`${result} movies were added`)
    }).catch((error) => {
        console.log(error)
    })

    

    // Movie.find().then((movies) => {
	// 	res.send({ movies }) 
	// }, (error) => {
	// 	res.status(400).send(error)
	// })
    
})

app.get('/movies', (req, res) => {
    
    Movie.find().then((movies) => {
        res.send({movies})
    })
})

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

app.get('/findAll', (req, res) => {
    log('found me')
    Movie.find().then((movies) => {
		res.send({ movies }) 
	}, (error) => {
		res.status(400).send(error)
	})
})

app.get('/delete', (req, res) => {
    Movie.deleteMany({ }).then((result) => {
        res.send(result)
    })
})

app.listen(port, () => {
    log(`Listening on port ${port}...`)
})
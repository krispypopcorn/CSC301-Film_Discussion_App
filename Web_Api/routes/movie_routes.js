const movie_routes = require('express').Router();
const { Movie } = require('../model/Movie')
const movieServer = require('../movie-getter')
const log = console.log

movie_routes.get('/findAllMovies', (req, res) => {
    Movie.find().then((movies) => {
        res.send(movies)
    })
});

/*
    Get the number of movies currently in the database
*/
movie_routes.get('/getMovieCount', (req, res) => {
    Movie.count({}, (error, count) => {
        res.send({
            value: count
        })
        log(count)
    })
})

/*
    Adds a single movie given a name and release
    year
*/
movie_routes.get('/movie/:name/:year', (req, res) => {
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
        vote_average: 0,
        voted_user: [],
            // discussions: null
        }).save().then(result => {
            res.send(result)
        })        
    }).catch((error) => {
        log(error)
    })
});


/*
    Searches a movie in the database give the name of the 
    movie
*/

movie_routes.get('/search/:name', (req, res) => {

    const movieName = req.params.name
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

movie_routes.delete('/search/:name', (req, res) => {
    const movieName = req.params.name

    Movie.remove({name: movieName}).then((result) => {
        res.status(200).send()
    }).catch((error) => {
        res.status(400).send()
    })
})

/*
    Searched a new movie from movieDB server to be added to the
    database
*/

movie_routes.get('/search/:name/:year', (req, res) => {
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
    Deletes all movies in the database
*/
movie_routes.delete('/deleteAllMovies', (req, res) => {
    Movie.deleteMany({ }).then((result) => {
        res.send(result)
    })
})


/*
    Populates the most top 20 most trending movies in the database
*/

movie_routes.get('/getTrending', (req, res) => {

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

movie_routes.get('/getNowPlaying', (req, res) => {
    movieServer.getNowPlaying().then((result)=> {
        res.send(result)
    })
})

movie_routes.post('/rateMovie/:id', (req, res)=>{
    const id = req.params.id
    const rating = req.body.rating
    Movie.findById(id, (err, movie) =>{
        if(err){res.send(err)}
        else{
            const target = movie.voted_user
        }
    });

})

module.exports = movie_routes;
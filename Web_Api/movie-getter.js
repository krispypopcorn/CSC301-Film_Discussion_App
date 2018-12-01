'use strict'

const request = require('request')
/*
Example poster request url
https://image.tmdb.org/t/p/original/teEKGIZC25oJBQHXQwsGBMjW2bN.jpg
*/

const getMovie = (name, year) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.themoviedb.org/3/search/movie?api_key=8e712fffe5eef897d004659f932e5659&language=en-US&query=${name}&page=1&include_adult=true&year=${year}`,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject("Can't connect to server")
            } else if (response.statusCode !== 200) {
                reject('issue with getting resourse')
            } else {
                resolve({
                    title: body.results[0].title,
                    poster_path: 'https://image.tmdb.org/t/p/original/' + body.results[0].poster_path,
                    backdrop_path: 'https://image.tmdb.org/t/p/original/' + body.results[0].backdrop_path,
                    overview: body.results[0].overview,
                    release_date: body.results[0].release_date
                })
            }
        })
    })
}

const getNowPlaying = () => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=8e712fffe5eef897d004659f932e5659&language=en-US&page=1',
            json: true
        }, (error, response, body) => {
            if (error) {
                reject("Can't connect to server")
            } else if (response.statusCode !== 200) {
                reject('issue with getting resourse')
            } else {
                resolve(body.results)
            }
        })
    })
}

const getTrending = () => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.themoviedb.org/3/trending/movie/week?api_key=8e712fffe5eef897d004659f932e5659',
            json: true
        }, (error, response, body) => {
            if (error) {
                reject("Can't connect to server")
            } else if (response.statusCode !== 200) {
                reject('issue with getting resourse')
            } else {
                resolve(body.results)
            }
        })
    })
}

module.exports = { getMovie, getNowPlaying, getTrending}

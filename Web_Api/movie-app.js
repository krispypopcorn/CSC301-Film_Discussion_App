'use strict'

const movie = require('./movie-getter')

/*
    Popoluate the given results in a Movie Object and then add them to 
    Movie Database
*/

movie.getMovie("Furious 7", 2015).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
});

movie.getNowPlaying().then((result) => {
    let count = 0;
    for(let i = 0; i < result.length; i++) {
        console.log(result[i].title)
        console.log(result[i].overview)
        count++
    }
    console.log(`Total movies is ${count}`)
}).catch((error) => {
    console.log(error)
}) 

movie.getTrending().then((result) => {
    let count = 0;
    for(let i = 0; i < result.length; i++) {
        console.log(result[i].title)
        console.log(result[i].overview)
        count++
    }
    console.log(`Total movies is ${count}`)
}).catch((error) => {
    console.log(error)
})
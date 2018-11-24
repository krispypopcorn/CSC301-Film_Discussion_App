const mongoose = require('mongoose')

const Movie = mongoose.model('Movie', {

    name: {
        type: String,
        required: true
    },
    year: {
        type: String
    },
    poster: {
        type: String
    },
    banner: {
        type: String
    },
    numOfDiscussions: {
        type: Number
    },
    numOfComments: {
        type: Number
    },
    vote_average: {
        type: Number
    }
})

module.exports = { Movie }
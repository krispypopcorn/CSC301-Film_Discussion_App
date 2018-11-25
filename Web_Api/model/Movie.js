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
        type: Number,
        default: 0
    },
    numOfComments: {
        type: Number,
        default: 0
    },
    vote_average: {
        type: Number,
        default: 0
    },
    discussions: {
        type: Array,
        default: []
    }
})

module.exports = { Movie }
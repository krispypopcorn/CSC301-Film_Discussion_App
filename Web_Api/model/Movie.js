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
    vote_average: {
        type: Number,
        default: 0
    },
    voted_user: {
        type: Array,
        default: []
    }
})

module.exports = { Movie }
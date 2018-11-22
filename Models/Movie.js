const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Movie = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        minlength: 1,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },

    poster: {
        type: String
    },

    banner: {
        type: String
    },

    numOfDiscussions: {
        type: Number,
        required: true,
    },

    numOfComments: {
        type: Number,
        required: true,
    },

    vote_average: {
        type: Number,
        default: 0,
        required: true,
    },

    discussions: [{
        type: Schema.Types.ObjectId,
        ref: 'Discussion'
    }],
})

const MovieModel = mongoose.model('Movie', Movie)

module.exports = {MovieModel}
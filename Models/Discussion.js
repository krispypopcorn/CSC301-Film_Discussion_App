const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Discussion = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        minlength: 1,
        required: true
    },

    date: {
        type: Date,
    },

    discussion_content: {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    },

    likes: {
        type: Number,
        default: 0
    },

    img: {
        data: Buffer,
        contentType: String,
        required: true
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
})

const DiscussionModel = mongoose.model('Discussion', Discussion)

module.exports = {DiscussionModel}
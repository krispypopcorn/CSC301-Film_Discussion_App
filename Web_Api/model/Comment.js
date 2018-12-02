const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Comment =  mongoose.model('Comment',{
    comment_content: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },

    user: {
        type: String
    },

    discussion: {
        type: String
    },

    comment: {
        type: String
    },

    date: {
        type: Date
    },

    replies: {
        type: Array,
        default: []
    },
})

module.exports = { Comment };
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    discussion: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Discussion'
    },

    comment: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Comment'
    },

    date: {
        type: Date,
        default: Date.now
    },

    replies: {
        type: Array,
        default: []
    },
})

module.exports = {Comment};
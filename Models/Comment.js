const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Comment = new mongoose.Schema({
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

    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
})

const CommentModel = mongoose.model('Comment', Comment);

module.exports = {CommentModel};
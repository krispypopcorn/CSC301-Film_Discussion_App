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
    
    comment: {
        type: String
    },

    date: {
        type: Date
    },

    replies: [Comment]
})

const DisSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        minlength: 1,
        required: true
    },

    date: {
        type: Date,
        default: new Date,
    },

    discussion_content: {
        type: String,
        required: true
    },

    user: {
        type: String,
    },

    movie: {
        type: String,
    },

    likes: {
        type: Number,
        default: 0
    },

    img: {
          type: String,
    },

    comments: [Comment],

    liked_user: {
        type: Array,
        default: []
    }
})


var Discussion = mongoose.model('Discussion', DisSchema);
module.exports = { Discussion };

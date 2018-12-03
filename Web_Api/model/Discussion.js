const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const CommentSchema =  new mongoose.Schema({
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

    replies: [{
     type: Schema.ObjectId,
     ref: 'CommentSchema'
	}]
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

    comments: [CommentSchema],

    liked_user: {
        type: Array,
        default: []
    }
})


var Discussion = mongoose.model('Discussion', DisSchema);
module.exports = { Discussion };

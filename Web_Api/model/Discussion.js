const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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

    comments: {
        type: Array,
        default: []
    },

    liked_user: {
        type: Array,
        default: []
    }
})


var Discussion = mongoose.model('Discussion', DisSchema);
module.exports = { Discussion };

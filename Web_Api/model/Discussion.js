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
        type: String,
    },

    discussion_content: {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.Mixed
    },

    movie: {
        type: Schema.Types.Mixed
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
    }
})


var Discussion = mongoose.model('Discussion', DisSchema);
module.exports = Discussion;

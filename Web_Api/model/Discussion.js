const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Discussion = mongoose.model('Discussion',{
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

    //  img: {
    //      data: Buffer,
    //      contentType: String,
    //      required: true
    //  },

    comments: {
        type: Array,
        default: []
    }
})

module.exports = {Discussion}
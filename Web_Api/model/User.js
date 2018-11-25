const mongoose = require('mongoose')

const User = mongoose.model('User',{
    username: {
        type: String,
        trim: true,
        unique: true,
        minlength: 1,
        required: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    admin: {
        type: Boolean,
        default: false
    },

    icon: {
        data: Buffer,
        contentType: String,
        required: true
    },

    like: {
        type: Number,
        default: 0
    },

    discussions: {
        type: Array,
        default: []
    },

    comments: {
        type: Array,
        default: []
    },
})

module.exports = { User }
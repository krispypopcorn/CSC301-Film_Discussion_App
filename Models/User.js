const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = new mongoose.Schema({
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

    discussions: [{
        type: Schema.Types.ObjectId,
        ref: 'Discussion'
    }],


    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
})


const UserModel = mongoose.model('User', User)

module.exports = {UserModel}
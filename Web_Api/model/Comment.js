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
        type: Schema.ObjectId
    },

    date: {
        type: Date,
        default: new Date,
    },

    replies: [{
    type: String
    }]
})

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = { Comment };
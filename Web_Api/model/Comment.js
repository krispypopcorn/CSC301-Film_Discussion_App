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
        type: Schema.Types.Mixed
    },

    discussion: {
        type: Schema.Types.Mixed,
        required: true
    },

    comment: {
        type: Schema.Types.Mixed,
        default: null
    },

    date: {
        type: Date
    },

    replies: {
        type: Array,
        default: []
    },
})

module.exports = {Comment};
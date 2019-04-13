const mongoose = require('mongoose');
const messageScheme = new mongoose.Schema({
    from:{
        type: String
    },
    to:{
        type: String
    },
    text:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date
    }
})

const messageModel = mongoose.model('Message',messageScheme);

module.exports = messageModel;
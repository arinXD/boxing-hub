const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    prefix:{
        type: String,
        required: true
    },
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    tel:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: true
    },
}, {timestamps : true})

const User = mongoose.model('users', userSchema)

module.exports = User
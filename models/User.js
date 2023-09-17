const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const userSchema = new Schema({
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
        required: true,
        unique: true,
        dropDups: true
    },
    password:{
        type: String,
        required: true
    },
    tel:{
        type: String,
        default: null
    },
    img:{
        type: String,
        default: null
    },
    role:{
        type: Number,
        default: 0
    }
}, {timestamps : true})

const User = mongoose.model('users', userSchema)

module.exports = User
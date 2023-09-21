const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const userSchema = new Schema({
    prefix:{
        type: String,
    },
    fname:{
        type: String,
        required: [true, "Please provide first name"],
    },
    lname:{
        type: String,
        required: [true, "Please provide last name"],
    },
    email:{
        type: String,
        required: [true, "Please provide email"],
        unique: [true, "This email already exists"],
        dropDups: true
    },
    password:{
        type: String,
        required: [true, "Please provide password"]
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
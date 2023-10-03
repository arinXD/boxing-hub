const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type: String,
        required: [true, "Please provide username"],
    },
    job:{
        type:String,
    }
    ,
    fname:{
        type: String,
    },
    lname:{
        type: String,
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
        default: 'avartar.png'
    },
    role:{
        type: Number,
        default: 0
    },
    roleteam:{
        type: Number,
        default: 0
    },
    athlete:{
        type: mongoose.Schema.ObjectId,
        ref: 'athletes'
    },
    province:String,
    amphoe:String,
    tambon:String,
    address:String,
}, {timestamps : true})

const User = mongoose.model('users', userSchema)

module.exports = User
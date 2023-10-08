const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type: String,
        required: [true, "กรุณากรอกชื่อผู้ใช้"],
    },
    job:{
        type:String,
    }
    ,
    fname:{
        type: String,
        required: [true, "กรุณากรอกชื่อจริง"]
    },
    lname:{
        type: String,
        required: [true, "กรุณากรอกนามสกุล"]
    },
    email:{
        type: String,
        required: [true, "กรุณากรอกอีเมล"],
        unique: [true, "อีเมลนี้ถูกใช้งานไปแล้ว"],
        dropDups: true
    },
    password:{
        type: String,
        required: [true, "กรุณากรอกรหัสผ่าน"]
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
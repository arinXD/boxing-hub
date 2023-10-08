const mongoose = require('mongoose')
// const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    order:{
        type: Number
    },
    WeightClass:{
        type: String
    },
    Description: {
        type: String,
        default: "Normal"
    },
    Rounds: {
        type: Number,
        default: 3
    },
    ResultClock:{
        type: Number,
        default: null
    },
    ResultRound:{
        type:Number,
        default: 0
    },
    ResultType:{
        type: String,
        default: "ยังไม่มีผลการตัดสิน"
    },
    event:{
        type: mongoose.Schema.ObjectId,
        ref: 'events'
    },
    athletes: [{
        athlete: {
            type: mongoose.Schema.ObjectId,
            ref: 'athletes'
        },
        winner: {
            type: Boolean,
            default: false
        }
    }]

}, {timestamps: true})

const Match = mongoose.model('matches', matchSchema)

module.exports = Match
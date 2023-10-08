const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const matchSchma = new Schema({
    WeightClass: {
        type: String,
        default: "Catchweight"
    },
    Description: {
        type: String,
        default: "Normal"
    },
    Rounds: {
        type: Number,
        default: 3
    },
    ResultClock: {
        type: String,
        default: ""
    },
    ResultRound: {
        type: Number,
        default: 0
    },
    order: {
        type: Number
    },
    resultType:{
        type: String,
        default: "ยังไม่มีผลการตัดสิน"
    },
    athletes: [
        {
            _id: {
                type: mongoose.Schema.ObjectId,
                ref: 'athletes'
            },
            Winner: {
                type: Boolean
            }
        }
    ]
}, { timestamps: true });

const Match = mongoose.model('matches', matchSchma)

module.exports = Match
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// "FightId": 1151,
//         "Order": 1,
//         "Status": "Scrambled",
//         "WeightClass": "Scrambled",
//         "CardSegment": "Scrambled",
//         "Referee": "Scrambled",
//         "Rounds": 13,
//         "ResultClock": 64,
//         "ResultRound": 3,
//         "ResultType": "Scrambled",
//         "WinnerId": 225261395,

const matchSchma = new Schema({
    WeightClass: {
        type: String,
        default: "CatchWeight"
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
        type: Number,
        default: 0
    },
    ResultRound: {
        type: Number,
        default: 0
    },
    athletes: [
        {
            athlete: {
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
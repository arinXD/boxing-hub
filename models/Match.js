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
    WeightClass:{
        type: String
    },
    Description:{
        type: String
    },
    Rounds:{
        type: Number
    } 

}, {timestamps: true})

const Match = mongoose.model('matches', matchSchma)

module.exports = Match
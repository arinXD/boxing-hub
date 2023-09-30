const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// "FighterId": 140000013,
//             "FirstName": "Donald",
//             "LastName": "Cerrone",
//             "PreFightWins": 58,
//             "PreFightLosses": 21,
//             "PreFightDraws": 0,
//             "PreFightNoContests": 0,
//             "Winner": false,
//             "Moneyline": 389,
//             "Active": true
const eventScheme = new Schema({
    eventName:{
        type: String
    },
    eventDate:{
        type: String
    },
    eventTime:{
        type: String
    },
    Status:{
        type: String,
        default: "0"
    },
    Location:{
        type: String
    },
    country:{
        type: String
    },
    matches: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'matches'
        }
    ]

    

}, {timestamps: true})

const Event = mongoose.model('events', eventScheme)

module.exports = Event
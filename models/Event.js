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
        type: String
    },
    matches:{
        type: mongoose.Schema.ObjectId,
        ref: 'matches',
        ResultClock:{
            type: Number,
            default: 0
        },
        ResultRound:{
            type: Number,
            default: 0
        },
        athletes: {
            athlete:{
                type: mongoose.Schema.ObjectId,
                ref: 'athletes',
                Winner:{
                    type:Boolean
                }
            },
            athlete:{
                type: mongoose.Schema.ObjectId,
                ref: 'athletes',
                Winner:{
                    type:Boolean
                }
            }

        }

    }

}, {timestamps: true})

const Event = mongoose.model('events', eventScheme)

module.exports = Event
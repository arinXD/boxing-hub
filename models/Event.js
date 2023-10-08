const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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
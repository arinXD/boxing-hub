// const mongoose = require('mongoose')
// const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventName:{
        type: String
    },
    shortName:{
        type: String
    },
    season:{
        type: Number
    }, 
    day:{
        type: Date
    },
    dateTime:{
        type: String
    },
    matches:[{
        type: mongoose.Schema.ObjectId,
        ref: 'matches'
    }], 

}, {timestamps: true})

// const Event = mongoose.model('events', eventSchema)

// module.exports = Event
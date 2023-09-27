const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const athleteSchema = new Schema({
    aka:{
        type: String,
        required: [true, "Please provide aka"],
    },
    weight:{
        type: Number,
    },
    height:{
        type: Number,
    },
    reach:{
        type: Number,
    },
    bday:{
        type: String,
    },
    country:{type:String},
    weightClass:{type:String},
    profileImg:{type:String},
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, "Please provide userId"]
    },
    confirmed: {
        type: Boolean,
        default: false
    }
    
}, {timestamps : true})

const Athlete = mongoose.model('athletes', athleteSchema)

module.exports = Athlete
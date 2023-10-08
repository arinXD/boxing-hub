// const mongoose = require('mongoose')

// const Schema = mongoose.Schema;
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
    wins:{
        type:Number,
        default:0
    },
    losses:  {
        type:Number,
        default:0
    },
    country:{type:String},
    weightClass:{type:String},
    profileImg:{type:String},
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, "Please provide userId"]
    }
    
}, {timestamps : true})

// const Athlete = mongoose.model('athletes', athleteSchema)

// module.exports = Athlete
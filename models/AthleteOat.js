const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const athleteSchema = new Schema({
    nickname: String,
    weightClass: String,
    height: mongoose.Types.Decimal128,
    weight: mongoose.Types.Decimal128,
    reach: mongoose.Types.Decimal128,
    bday:{
        type:Date,
        default:null
    },
    country:String,
    wins: {
        type:Number,
        default:0
    },
    losses:  {
        type:Number,
        default:0
    },
    draws:  {
        type:Number,
        default:0
    },
    knockouts: {
        type:Number,
        default:0
    },
    knockoutsLosses: {
        type:Number,
        default:0
    },
    technicalKnockouts: {
        type:Number,
        default:0
    },
    technicalKnockoutsLosses: {
        type:Number,
        default:0
    },
    overwhelmingScore: {
        type:Number,
        default:0
    },
    overwhelmingScoreLosses: {
        type:Number,
        default:0
    },
    majorityVotes: {
        type:Number,
        default:0
    },
    majorityVotesLosses: {
        type:Number,
        default:0
    },
    matches:[{
        type: mongoose.Schema.ObjectId,
        ref: 'matches',
    }],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, "Please provide userId"]
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams', // Reference to the Team model
    },

    confirmed: {
        type: Boolean,
        default: false
    }
    
}, {timestamps : true})

const Athlete = mongoose.model('athletes', athleteSchema)

module.exports = Athlete
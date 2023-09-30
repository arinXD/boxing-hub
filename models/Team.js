const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const teamSchema = new Schema({
    teamname:{
        type: String,
    },
    athletes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'athletes',
    }],
    logo:String,
}, {timestamps : true})

const Team = mongoose.model('teams', teamSchema)

module.exports = Team
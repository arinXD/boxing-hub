const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const athleteSchema = new Schema({
    test:{
        type: String,
    },
    
    
}, {timestamps : true})

const Team = mongoose.model('team', athleteSchema)

module.exports = Team
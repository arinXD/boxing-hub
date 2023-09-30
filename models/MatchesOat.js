// const mongoose = require('mongoose')
// const Schema = mongoose.Schema;

// const matchSchema = new Schema({
//     order:{
//         type: Number
//     },
//     weightClass:{
//         type: String
//     },
//     rounds:{
//         type: Number
//     },
//     resultType:String,
//     resultClock:{
//         type: Number,
//         default: null
//     },
//     resultRound:{
//         type:Number,
//         default: null
//     },
//     event:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'events'
//     },
//     winnerId:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'athletes',
//         default: null
//     },
//     athletes: [{
//         athlete: {
//             type: mongoose.Schema.ObjectId,
//             ref: 'athletes'
//         },
//         winner: {
//             type: Boolean
//         }
//     }]

// }, {timestamps: true})

// // const Match = mongoose.model('matches', matchSchema)

// module.exports = Match
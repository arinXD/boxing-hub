var express = require('express');
var router = express.Router();
const Match = require("../models/MatchesOat");
const Event = require("../models/EventOat");
const Athlete = require("../models/AthleteOat");

router.get("/", async (req, res)=>{
    await Match.find()
    .populate('event')
    .populate('winnerId')
    .populate({
          path: 'athletes',
          populate: {
            path:'_id',
            model: 'athletes'
          }
    })
    .then((result=>{
        return res.send(result)
    }))
    .catch((err)=>{
        return res.send(err)
    })
})

router.post('/insert', async (req, res, next) => {
    const eventId = '65103c4c56249b6877787025'
    const winnerId = '65108698c822477839ac3a32'
    const loserId = '65108653d37b8356f4ad3bc4'

    const resultType = "majorityVotes"

    const newMatch = new Match({
        order: 1,
        weightClass: "Scrambled",
        rounds: 6,
        resultType: resultType,
        resultClock: 64,
        resultRound: 3,
        event: eventId,
        winnerId: winnerId,
        athletes: [
            {
                _id: winnerId,
                winner:true
            },
            {
                _id: loserId,
                winner:false
            },
        ],
    })
    newMatch.save()
    .then((result)=>{
        console.log("create match")
    })
    .catch((err)=>{
        console.error(err)
    })

    await Event.findByIdAndUpdate(eventId, { $push: { matches: newMatch._id }}, { upsert: true })
    .then((result) => {
        console.log("insert match")
    }).catch(((err)=>{
        console.error(err)
    }))

    // 1
    if(resultType=="knockouts"){
        // win
        await Athlete.findByIdAndUpdate(winnerId, {
            $inc : { "wins": 1, 'knockouts': 1},
            $push: { matches: newMatch._id }
        }, { upsert: true })
        .then((result) => {
            console.log("insert wins to winner")
        }).catch(((err)=>{
            console.error(err)
        }))
        // loss
        await Athlete.findByIdAndUpdate(loserId, {
            $inc : { "losses": 1, 'knockoutsLosses': 1},
            $push: { matches: newMatch._id }
        }, { upsert: true })
        .then((result) => {
            console.log("insert wins to loser")
        }).catch(((err)=>{
            console.error(err)
        }))
    }
    // 2
    else if(resultType=="technical knockout"){
        // win
        await Athlete.findByIdAndUpdate(winnerId, {
            $inc : { "wins": 1, 'technicalKnockouts': 1},
            $push: { matches: newMatch._id }
        }, { upsert: true })
        .then((result) => {
            console.log("insert wins to winner")
        }).catch(((err)=>{
            console.error(err)
        }))
        // loss
        await Athlete.findByIdAndUpdate(loserId, {
            $inc : { "losses": 1, 'technicalKnockoutsLosses': 1},
            $push: { matches: newMatch._id }
        }, { upsert: true })
        .then((result) => {
            console.log("insert wins to loser")
        }).catch(((err)=>{
            console.error(err)
        }))
    }
    // 3
    else if(resultType=="overwhelming score"){
        // win
        await Athlete.findByIdAndUpdate(winnerId, {
            $inc : { "wins": 1, 'overwhelmingScore': 1},
            $push: { matches: newMatch._id }
        }, { upsert: true })
        .then((result) => {
            console.log("insert wins to winner")
        }).catch(((err)=>{
            console.error(err)
        }))
        // loss
        await Athlete.findByIdAndUpdate(loserId, {
            $inc : { "losses": 1, 'overwhelmingScoreLosses': 1},
            $push: { matches: newMatch._id }
        }, { upsert: true })
        .then((result) => {
            console.log("insert wins to loser")
        }).catch(((err)=>{
            console.error(err)
        }))
    }
    // 4
    else{
        // win
        await Athlete.findByIdAndUpdate(winnerId, {
            $inc : { "wins": 1, 'majorityVotes': 1},
            $push: { matches: newMatch._id }
        }, { upsert: true })
        .then((result) => {
            console.log("insert wins to winner")
        }).catch(((err)=>{
            console.error(err)
        }))
        // loss
        await Athlete.findByIdAndUpdate(loserId, {
            $inc : { "losses": 1, 'majorityVotesLosses': 1},
            $push: { matches: newMatch._id }
        }, { upsert: true })
        .then((result) => {
            console.log("insert wins to loser")
        }).catch(((err)=>{
            console.error(err)
        }))
    }
    
    
    return res.send("insert success")
})


module.exports = router;
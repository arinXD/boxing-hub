const Athlete = require("../models/AthleteOat")
const User = require("../models/User");
const bcrypt = require("bcrypt")


const fetchAthletes = async (req, res) => {

    await Athlete.find().populate('user')
        .then((athletes) => {
            return res.render("athlete/athletesPage", {
                athletesData: athletes
            })
        })
        .catch((err) => {
            console.error(err)
        })
}
const findAthlete = async (req, res) => {
    console.log(req.params.id);
    await Athlete.findOne({
            _id: req.params.id
        }).populate(['matches', 'user',])
        .populate({
            path: 'matches',
            populate: {
              path: 'winnerId', 
              model: 'athletes'
            }
        })
        .populate({
            path: 'matches',
            populate: {
              path: 'event', 
              model: 'events'
            }
        })
        .populate({
            path: 'matches',
            populate: {
              path: 'athletes',
              populate: {
                path:'_id',
                model: 'athletes'
              }
            }
        })
        .populate({
            path: 'matches',
            populate: {
              path: 'athletes',
              populate: {
                path:'_id',
                model: 'athletes',
                populate: {
                    path: 'user',
                    model: 'users'  
                  }
              }
            }
        })
    .then((athlete) => {
        return res.render("athlete/athleteProfile", {athlete})
    })
    .catch((err) => {
        console.error(err)
    })
}
const findAthleteJson = async (req, res) => {
    console.log(req.params.id);
    await Athlete.findOne({
            _id: req.params.id
        }).populate(['matches', 'user',])
        .populate({
            path: 'matches',
            populate: {
              path: 'winnerId', 
              model: 'athletes'
            }
        })
        .populate({
            path: 'matches',
            populate: {
              path: 'event', 
              model: 'events'
            }
        })
        .populate({
            path: 'matches',
            populate: {
              path: 'athletes',
              populate: {
                path:'_id',
                model: 'athletes'
              }
            }
        })
        .populate({
            path: 'matches',
            populate: {
              path: 'athletes',
              populate: {
                path:'_id',
                model: 'athletes',
                populate: {
                    path: 'user',
                    model: 'users'  
                  }
              }
            }
        })
        .then((athlete) => {
            return res.send(athlete)
        })
        .catch((err) => {
            console.error(err)
        })
}
const createAthlete = async (req, res) => {
    const newUser = new User({
        username: "rodtang",
        fname: "รถถัง",
        lname: "จิตร์เมืองน่าน",
        email: "rodtang@gmail.com",
        password: await bcrypt.hash("123", 10),
        role:3
    })
    newUser.save()
        .then((user) => {
            const athlete = new Athlete({
                nickname:"rodtang",
                weightClass:"Scrambled",
                height: 165.57,
                weight: 70.20,
                reach: 115.8,
                bday: "2002-07-05",
                country: "Thailand",
                user:user._id,
            })
            athlete.save()
                .then((result) => {
                    return res.send(result)
                })
                .catch((err) => {
                    console.error(err)
                })
        })
}
module.exports = {
    fetchAthletes,
    createAthlete,
    findAthlete,
    findAthleteJson
}
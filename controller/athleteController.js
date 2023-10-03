const Athlete = require("../models/AthleteOat")
const User = require("../models/User");
const Team = require("../models/Team");
const bcrypt = require("bcrypt")

const fetchAthletesJson = async(req, res) => {
    const athletes = await Athlete.find({confirmed:true}).populate('user')
    return res.json(athletes)
}
const fetchAthletes = async (req, res) => {
    await Athlete.find({confirmed:true}).populate('user')
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
            _id: req.params.id,
            confirmed:true
        }).populate(['matches', 'user', 'team'])
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
const fetchAthletesByNameJson = async(req, res)=>{
    const searchNickname = req.params.nickname
    Athlete.find({ nickname: { $regex: new RegExp(searchNickname, 'i') }, confirmed:true, team:null })
    .populate('user')
    .then(athletes => {
        return res.json(athletes)
    })
    .catch(error => {
        console.error('Error querying database:', error);
    });
}
const searchAthleteJson = async(req, res)=>{
    const searchNickname = req.query.nickname
    if(!searchNickname){
        const athletes = await Athlete.find({confirmed:true}).populate('user')
        return res.json(athletes)
    }
    Athlete.find({ nickname: { $regex: new RegExp(searchNickname, 'i') }, confirmed:true})
    .populate('user')
    .then(athletes => {
        return res.json(athletes)
    })
    .catch(error => {
        console.error('Error querying database:', error);
    });
}

const addAthlete = async function (req, res, next) {
    const teams = await Team.find();
    res.render('athlete/athleteAdd.ejs', {
        teams
    });
}
module.exports = {
    fetchAthletes,
    createAthlete,
    findAthlete,
    findAthleteJson,
    fetchAthletesJson,
    fetchAthletesByNameJson,
    addAthlete,
    searchAthleteJson,
}
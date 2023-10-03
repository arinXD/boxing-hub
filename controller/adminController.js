const User = require("../models/User");
const Team = require("../models/Team");
const Athlete = require("../models/AthleteOat");

const teamPage = (req, res) => {
    Team.find()
        .then((result) => {
            return res.render('admin/team/teamManage', {
                teams: result
            })
        })
        .catch((err) => {
            console.error(err)
        })
}
const teamInfo = async (req, res) => {
    const team = await Team.findOne({
            _id: req.params.id
        })
        .populate('athletes')
        .populate({
            path: 'athletes',
            populate: {
                path: 'user',
                model: 'users'
            }
        })
    return res.render('admin/team/teamInfo', {
        team,
        addStatus: req.flash("addToTeam")
    })
}
const addAthleteToTeam = async (req, res) => {
    const aid = req.body.athlete
    const teamId = req.body.teamId
    await Team.findOne({
            athletes: {
                $in: [aid]
            }
        })
        .then(async (result) => {
            if (result) {
                return res.send({
                    data: result
                })
            } else {
                Athlete.findByIdAndUpdate(
                    aid, {
                        team: teamId
                    }, {
                        new: true
                    }).then((result)=>{
                        console.log("update team to athlete");
                    }).catch((err)=>{
                        console.error(err);
                    })
                await Team.findByIdAndUpdate(
                    teamId, {
                        $push: {
                            athletes: aid
                        }
                    }, {
                        new: true
                    }
                ).then((result) => {
                    req.flash("addToTeam", true)
                    return res.redirect(`/admin/team/${teamId}`);
                }).catch((err) => {
                    console.error(err);
                })

            }
        }).catch((err) => {
            console.error(err)
        })

}
module.exports = {
    teamPage,
    teamInfo,
    addAthleteToTeam,
}
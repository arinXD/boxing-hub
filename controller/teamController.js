const Team = require("../models/Team")
const Athlete = require("../models/AthleteOat")

const teamPage = async function (req, res, next) {
    try {
        const teams = await Team.find().populate('athletes');
        res.render('team/teamPage.ejs', { teams });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
const teamInfo = async function (req, res, next) {
    try {

        Athlete.find()
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
        const id = req.params.id
        const team = await Team.findOne({_id:id})
        .populate('athletes')
        .populate({
            path: 'athletes',
            populate: {
              path: 'user', 
              model: 'users'
            }
        })
        return res.render('admin/atheleteEdit2.ejs',{team, athlete: result, id: req.query.id})
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const teamInfoUser = async function (req, res, next) {
    try {
        const id = req.params.id
        const team = await Team.findOne({_id:id})
        .populate('athletes')
        .populate({
            path: 'athletes',
            populate: {
              path: 'user', 
              model: 'users'
            }
        })
        return res.render('team/teamInfo',{team})
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
const searchTeam = async (req, res)=>{
    const searchTeam = req.query.team
    if(!searchTeam){
        const teams = await Team.find()
        return res.json(teams)
    }
    await Team.find({ teamname: { $regex: new RegExp(searchTeam, 'i') }})
    .then((teams) => {
        return res.json(teams)
    })
    .catch((error) => {
        console.error('Error querying database:', error);
    });
}

module.exports = {
    teamPage,
    teamInfo,
    searchTeam,
    teamInfoUser
}
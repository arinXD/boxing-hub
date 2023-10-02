const User = require("../models/User");
const Team = require("../models/Team");
const Athlete = require("../models/AthleteOat");

const teamPage = (req, res) => {
    Team.find()
    .then((result)=>{
        return res.render('admin/team/teamManage', {teams:result})
    })
    .catch((err)=>{
        console.error(err)
    })
}
const teamInfo = async (req, res) => {
    const team = await Team.findOne({_id:req.params.id})
    .populate('athletes')
    .populate({
        path: 'athletes',
        populate: {
          path: 'user', 
          model: 'users'
        }
    })
    return res.render('admin/team/teamInfo',{
        team
    })
}
const addAthleteToTeam = async (req, res)=>{
    const aid = req.body.athlete
    await Team.findOne({athletes:{ $in: [aid] }})
    .then((result)=>{
        if(result){
            return result
        }else{
            console.log("found");
        }
    }).catch((err)=>{
        console.error(err)
    })
    return res.send(aid)
}
module.exports = {
    teamPage,
    teamInfo,
    addAthleteToTeam,
}
const User = require("../models/User");
const Team = require("../models/Team");
const Athlete = require("../models/AthleteOat");
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const teamPage = (req, res) => {
    const crudStatus = req.flash('crudStatus')
    req.flash('crudStatus', '')
    Team.find()
        .then((result) => {
            return res.render('admin/team/teamManage', {
                teams: result,
                crudStatus
            })
        })
        .catch((err) => {
            console.error(err)
        })
}
const teamInfo = async (req, res) => {
    const addStatus = req.flash("addToTeam")
    const delAth = req.flash("delAth")
    req.flash("addToTeam",'')
    req.flash("delAth",'')
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
        addStatus,
        delAth
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

const insertTeam = async (req, res)=>{
    const getTeamname = req.body.teamname
    const desc = req.body.desc
    new Team({
        teamname:getTeamname,
        desc:desc,
        athletes:[]
    }).save()
    .then((result)=>{
        req.flash('crudStatus','เพิ่มข้อมูลทีมสำเร็จ')
        res.redirect("/admin/team")
    }).catch((err)=>{
        console.error(err)
    })
}
const updateTeamPage = (req, res)=>{
    const updated = req.flash('updated')
    Team.findOne({_id:req.params.id})
    .then((result)=>{
        return res.render("admin/team/updateTeam",{
            team:result,
            updated
        })
    })
    .catch((err)=>{
        console.error(err);
    })
}
const updateTeam = async (req, res)=>{
    let teamname = req.body.teamname
    let desc = req.body.desc
    var tid = req.body.tid
    if(req.file){
        let logo = `${req.file.filename}`
        await Team.findByIdAndUpdate(
            tid,
            { teamname, desc, logo },
            { new: true }
            ).then((team)=>{
                req.flash("updated", team)
            return res.redirect(`/admin/team/update/${tid}`)
        }).catch((err)=>{
            console.error(err);
        })
    }else{
        await Team.findByIdAndUpdate(
            tid,
            { teamname, desc },
            { new: true }
        ).then((team)=>{
            req.flash("updated", team)
            return res.redirect(`/admin/team/update/${tid}`)
        }).catch((err)=>{
            console.error(err);
        })
    }
    
}

const deleteTeam = (req, res)=>{
    const id = req.params.id
    Team.findOne({_id:id})
    .then((team)=>{
        for (const ath of team.athletes) {
            Athlete.findByIdAndUpdate(
                ath._id,
                {team:null},
                { new: true }
            )
            .then((re)=>{
                console.log(re.team);
            })
            .catch((err)=>{
                console.error(err);
            })
        }
    })
    .catch((err)=>{
        console.error(err)
    })
    Team.findByIdAndDelete(id)
    .then((result)=>{
        req.flash('crudStatus','ลบข้อมูลทีมสำเร็จ')
        res.redirect("/admin/team")
    })
    .catch((err)=>{
        console.error(err);
    })
}
const deleteAthleteFromTeam = (req, res)=>{
    const tid = req.params.tid
    const aid = req.params.aid
    Team.findByIdAndUpdate(
        tid,
        { $pull: { athletes: aid } },
        { new: true }
    
    ).then(()=>{
        Athlete.findByIdAndUpdate(
            aid,
            {team:null},
            { new: true }
        ).then((re)=>{
            req.flash('delAth', re.nickname)
            res.redirect(`/admin/team/${tid}`)
        }).catch((err)=>{
            console.error(err);
        })
    }).catch((err)=>{
        console.error(err)
    })
}
module.exports = {
    teamPage,
    teamInfo,
    addAthleteToTeam,
    insertTeam,
    updateTeamPage,
    updateTeam,
    deleteTeam,
    deleteAthleteFromTeam,
}
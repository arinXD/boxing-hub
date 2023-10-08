const User = require("../models/User");
const Team = require("../models/Team");
const Athlete = require("../models/AthleteOat");
const Match = require("../models/MatchesOat");
const Event = require("../models/EventOat");

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
const updateUserPage = async (req, res)=>{
    const user = await User.findOne({_id:req.params.uid})
    return res.render('admin/user/update_user', {user})
}
const adminPage = async (req, res) => {
    const users = await User.find()
    const teams = await Team.find()
    const athletes = await Athlete.find()
    const matches = await Match.find()
    const events = await Event.find()
    let crudAdmin = req.flash('crudAdmin')
    req.flash('crudAdmin', '')
    return res.render('admin/index', { 
        users,
        teams,
        athletes,
        matches,
        events,
        crudAdmin:crudAdmin.at(0)
    })
}
const updateUser = async (req, res)=>{
    const { userId, username, fname, lname, isAdmin, removeAdmin} = req.body
    let role
    if(isAdmin){
        role = 1
    }
    if(removeAdmin){
        const findAthlete = await Athlete.findOne({user:userId})
        role = (findAthlete)? 3:0
        // return res.send({role})
    }
    await User.findByIdAndUpdate(
        userId,
        { username, fname, lname, role },
        { new: true }
    ).then((re)=>{
        req.flash('crudAdmin', `แก้ไขข้อมูลผู้ใช้ของ ${re.fname} ${re.lname} เรียบร้อย`)
        res.redirect(`/admin`)
    }).catch((err)=>{
        console.error(err);
    })
}
const deleteUser = async (req, res)=>{
    try{
        const user = await User.findOne({_id:req.params.uid})
        const athlete = await Athlete.findOne({user:user._id})
        if(athlete.team){
            await Team.findByIdAndUpdate(
                athlete.team,
                { $pull: { athletes: athlete._id } },
                { new: true }
            )
        }
        if((athlete.matches).length>0){
            for (var match of athlete.matches) {
                const matchFind =  await Match.findOne({_id:match})
                for (const ath of matchFind.athletes) {
                    Athlete.findByIdAndUpdate(
                        ath,
                        { $pull: { matches: match } },
                        { new: true }
                    )
                }
                await Event.findByIdAndUpdate(
                    matchFind.event,
                    { $pull: { matches: matchFind._id } },
                    { new: true }
                )
                await Match.findByIdAndDelete(match)
            }
        }
        if(athlete){
            await Athlete.findByIdAndDelete(athlete._id)
            await User.findByIdAndDelete(athlete.user._id)
        }
        return res.redirect('/admin')
    }catch(err){
        console.error(err);
        return res.redirect('/admin')
    }
    
}
const checkAthlete = (req, res)=>{
    const uid = req.params.uid
    Athlete.findOne({user:uid})
    .populate(['matches', 'user', 'team'])
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
    .then((athlete)=>{
        return res.render("athlete/athleteProfile",{athlete})
    })
    .catch((err)=>{
        return res.json({message:"something error"})
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
    updateUserPage,
    updateUser,
    adminPage,
    deleteUser,
    checkAthlete,
}
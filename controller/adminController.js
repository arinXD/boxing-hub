const User = require("../models/User");
const Team = require("../models/Team");
const Athlete = require("../models/Athletes");
const Match = require("../models/Matches");
const Event = require("../models/Events");
const bcrypt = require("bcrypt")

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
    req.flash("addToTeam", '')
    req.flash("delAth", '')
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
                }).then((result) => {
                    console.log("update team to athlete");
                }).catch((err) => {
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

const indexAdmin = async (req, res) => {
    const users = await User.find()
    return res.render('admin/index', { users })
}
const getAddAdmin = async (req, res) => {
    const teams = await Team.find();
    res.render('admin/athleteAdminAdd.ejs', { teams });
}

const RegisterAthleteByAdmin = async (req, res) => {
    try {
        const { nickname, weight, height, reach, bday, country, weightClass, username,
            fname,
            lname,
            email,
            password,
            confirm } = req.body;

        // Convert email to lowercase
        const lowercaseEmail = email.toLowerCase();

        // Check if password and confirmation match
        if (confirm !== password) {
            console.log("Passwords do not match");
            return res.redirect('/admin/adminAdd');
        }

        const selectedTeamValue = req.body.team;
        let teamId = null;

        Team.findOne({ _id: selectedTeamValue })
            .then((result) => {
                if (result) {
                    teamId = result._id;
                }
            })
            .catch((err) => {
                console.log(err);
            });

        // Hash the password
        const hashPass = await bcrypt.hash(password, 10);

        // Create a new user with lowercase email
        const newUser = new User({
            role: 3,
            teamrole: 1,
            username,
            fname,
            lname,
            email: lowercaseEmail, // Store the email in lowercase
            password: hashPass,
        });

        newUser.save()
            .then((result) => {
                // Create a new athlete associated with the user
                const athlete = new Athlete({
                    nickname,
                    weight,
                    height,
                    reach,
                    bday,
                    country,
                    weightClass,
                    user: newUser._id,
                    team: teamId,
                    confirmed: true,
                });

                // Save the athlete
                return athlete.save();
            })
            .then((savedAthlete) => {
                const aid = savedAthlete._id;

                // Update the team with the athlete's ID
                return Team.findByIdAndUpdate(
                    { _id: teamId },
                    { $push: { athletes: aid } },
                    { new: true }
                );
            })
            .then((result) => {
                console.log("Team updated:", result);
                res.redirect('/admin/editAthlete');
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (error) {
        console.error(error);
    }
};

const AdminConfirmPage = async (req, res) => {
    try {
        const unconfirmedAthletes = await Athlete.find({ confirmed: false }).populate('user').populate('team');
        const confirmedAthletes = await Athlete.find({ confirmed: true }).populate('user').populate('team');
        const status = req.flash('confirm')
        req.flash('confirm', '')
        res.render('admin/athleteConfirm', {
            athletesData: unconfirmedAthletes,
            status
            ,athletes: confirmedAthletes
        });

        // return res.send(unconfirmedAthletes)
    } catch (error) {
        console.error(error);
        // Handle errors
    }
}

const AdminConfirmInfo = async (req, res) => {
    try {
        const athlete = await Athlete.findById(req.params._id);
        if (!athlete) {
            return res.status(404).send('Athlete not found');
        }
        const formattedBday = athlete.bday.toISOString().substr(0, 10);
        res.render('admin/atheleteInfo.ejs', { athlete, formattedBday });
    } catch (error) {
        console.error('Error fetching athlete:', error);
        res.status(500).send('An error occurred');
    }
}

const AdminConfirm = async (req, res) => {
    try {
        const athleteId = req.params._id; // Access it as a URL parameter

        // Find the athlete by ID and update the "confirmed" field to true
        const updatedAthlete = await Athlete.findByIdAndUpdate(
            athleteId,
            { confirmed: true },
            { new: true }
        );

        if (!updatedAthlete) {
            return res.status(404).send('Athlete not found');
        }

        const userId = updatedAthlete.user;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: 3, roleteam: 1 },
            { new: true }
        );

        console.log('Updated athlete:', updatedAthlete);
        console.log('Updated user:', updatedUser);
        req.flash('confirm', true)
        res.redirect('/admin/confirm');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}

const AdminCancel = async (req, res) => {
    const id = req.params._id;
    console.log('Deleting Athlete with ID:', id);

    try {
        // Find the athlete by _id
        const deletedAthlete = await Athlete.findById(id);

        if (!deletedAthlete) {
            return res.status(404).send('Athlete not found');
        }

        const userId = deletedAthlete.user;
        const teamId = deletedAthlete.team;
        await Team.findByIdAndUpdate(
            teamId,
            { $pull: { athletes: id } },
            { new: true }
        );
        await User.findByIdAndUpdate(
            userId,
            { role: 0 },
            { new: true }
        );

        // Delete the athlete
        await Athlete.findByIdAndDelete(id);

        console.log('Athlete deleted:', deletedAthlete);

        res.redirect('/admin/confirm');
    } catch (error) {
        console.error('Error deleting Athlete:', error);
        res.status(500).send('An error occurred');
    }
}

const AdminGetEditPage = async (req, res) => {
    // const id = req.query.id;
    Athlete.find().populate('user')
        .then((result) => {
            res.render('admin/atheleteEdit.ejs', { athlete: result, id: req.query.id })
        })
        .catch((err) => {
            console.log(err)
        })
}
const AdminGetEdit = async (req, res) => {
    try {
        const athlete = await Athlete.findById(req.params._id);
        if (!athlete) {
            return res.status(404).send('Athlete not found');
        }
        const formattedBday = athlete.bday.toISOString().substr(0, 10);
        const teams = await Team.find();
        res.render('admin/atheleteEdit2.ejs', { athlete, formattedBday, teams });
        console.log('athlete.team:', athlete.team);

    } catch (error) {
        console.error('Error fetching athlete:', error);
        res.status(500).send('An error occurred');
    }
}
const AdminUpdateEdit = async (req, res) => {
    // console.log(req.body);
    try {
        const { _id, nickname, weight, height, reach, bday, country, weightClass, wins, losses, draw, knockouts, knockoutsLosses, technicalKnockouts, technicalKnockoutsLosses, overwhelmingScore, overwhelmingScoreLosses, majorityVotes, majorityVotesLosses, team } = req.body;

        // Find the previous team of the athlete
        const previousAthlete = await Athlete.findById(_id);
        if (!previousAthlete) {
            return res.status(404).send('Athlete not found');
        }

        const previousTeamId = previousAthlete.team;

        // Update the athlete's information
        const updatedAthlete = await Athlete.findByIdAndUpdate(
            _id,
            { nickname, weight, height, reach, bday, country, weightClass, wins, losses, draw, knockouts, knockoutsLosses, technicalKnockouts, technicalKnockoutsLosses, overwhelmingScore, overwhelmingScoreLosses, majorityVotes, majorityVotesLosses, team },
            { new: true }
        );

        if (!updatedAthlete) {
            return res.status(404).send('Athlete not found');
        }

        // If the athlete's team has changed, remove the athlete's ID from the previous team
        if (previousTeamId !== team) {
            const previousTeam = await Team.findByIdAndUpdate(
                previousTeamId,
                { $pull: { athletes: _id } }, // Remove the athlete's ID from the previous team's athletes array
                { new: true }
            );

            if (!previousTeam) {
                return res.status(404).send('Previous team not found');
            }
        }

        // Update the new team by adding the athlete's ID
        const updatedTeam = await Team.findByIdAndUpdate(
            team,
            { $addToSet: { athletes: _id } }, // Add the athlete's ID to the new team's athletes array
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(404).send('Team not found');
        }

        console.log('Athlete updated:', updatedAthlete);
        console.log('Team updated:', updatedTeam);
        res.redirect('/admin/editAthlete');
    } catch (error) {
        console.error('Error updating Athlete:', error);
        res.status(500).send('An error occurred');
    }
}

const DeleteAthletes = async (req, res) => {
    // const id = req.query.id;
    const id = req.params._id;
    console.log('Deleting Athlete with ID:', id);

    try {
        // Find the athlete by _id
        const deletedAthlete = await Athlete.findById(id);

        if (!deletedAthlete) {
            return res.status(404).send('Athlete not found');
        }

        const userId = deletedAthlete.user;
        const teamId = deletedAthlete.team;
        await Team.findByIdAndUpdate(
            teamId,
            { $pull: { athletes: id } },
            { new: true }
        );
        await User.findByIdAndUpdate(
            userId,
            { role: 0 },
            { new: true }
        );

        // Delete the athlete
        await Athlete.findByIdAndDelete(id);

        console.log('Athlete deleted:', deletedAthlete);

        res.redirect('/admin/editAthlete');
    } catch (error) {
        console.error('Error deleting Athlete:', error);
        res.status(500).send('An error occurred');
    }
}
const insertTeam = async (req, res) => {
    const getTeamname = req.body.teamname
    const desc = req.body.desc
    new Team({
        teamname: getTeamname,
        desc: desc,
        athletes: []
    }).save()
        .then((result) => {
            req.flash('crudStatus', 'เพิ่มข้อมูลทีมสำเร็จ')
            res.redirect("/admin/team")
        }).catch((err) => {
            console.error(err)
        })
}
const updateTeamPage = (req, res) => {
    const updated = req.flash('updated')
    Team.findOne({ _id: req.params.id })
        .then((result) => {
            return res.render("admin/team/updateTeam", {
                team: result,
                updated
            })
        })
        .catch((err) => {
            console.error(err);
        })
}
const updateTeam = async (req, res) => {
    let teamname = req.body.teamname
    let desc = req.body.desc
    var tid = req.body.tid
    if (req.file) {
        let logo = `${req.file.filename}`
        await Team.findByIdAndUpdate(
            tid,
            { teamname, desc, logo },
            { new: true }
        ).then((team) => {
            req.flash("updated", team)
            return res.redirect(`/admin/team/update/${tid}`)
        }).catch((err) => {
            console.error(err);
        })
    } else {
        await Team.findByIdAndUpdate(
            tid,
            { teamname, desc },
            { new: true }
        ).then((team) => {
            req.flash("updated", team)
            return res.redirect(`/admin/team/update/${tid}`)
        }).catch((err) => {
            console.error(err);
        })
    }

}

const deleteTeam = (req, res) => {
    const id = req.params.id
    Team.findOne({ _id: id })
        .then((team) => {
            for (const ath of team.athletes) {
                Athlete.findByIdAndUpdate(
                    ath._id,
                    { team: null },
                    { new: true }
                )
                    .then((re) => {
                        console.log(re.team);
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            }
        })
        .catch((err) => {
            console.error(err)
        })
    Team.findByIdAndDelete(id)
        .then((result) => {
            req.flash('crudStatus', 'ลบข้อมูลทีมสำเร็จ')
            res.redirect("/admin/team")
        })
        .catch((err) => {
            console.error(err);
        })
}
const deleteAthleteFromTeam = (req, res) => {
    const tid = req.params.tid
    const aid = req.params.aid
    Team.findByIdAndUpdate(
        tid,
        { $pull: { athletes: aid } },
        { new: true }

    ).then(() => {
        Athlete.findByIdAndUpdate(
            aid,
            { team: null },
            { new: true }
        ).then((re) => {
            req.flash('delAth', re.nickname)
            res.redirect(`/admin/team/${tid}`)
        }).catch((err) => {
            console.error(err);
        })
    }).catch((err) => {
        console.error(err)
    })
}
const updateUserPage = async (req, res) => {
    const user = await User.findOne({ _id: req.params.uid })
    return res.render('admin/user/update_user', { user })
}
const adminPage = async (req, res) => {
    const users = await User.find({deleted_at:null})
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
        crudAdmin: crudAdmin.at(0)
    })
}
const updateUser = async (req, res) => {
    const { userId, username, fname, lname, isAdmin, removeAdmin } = req.body
    let role
    if (isAdmin) {
        role = 1
    }
    if (removeAdmin) {
        const findAthlete = await Athlete.findOne({ user: userId })
        role = (findAthlete) ? 3 : 0
        // return res.send({role})
    }
    await User.findByIdAndUpdate(
        userId,
        { username, fname, lname, role },
        { new: true }
    ).then((re) => {
        req.flash('crudAdmin', `แก้ไขข้อมูลผู้ใช้ของ ${re.fname} ${re.lname} เรียบร้อย`)
        res.redirect(`/admin`)
    }).catch((err) => {
        console.error(err);
    })
}
const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.uid })
        const date = new Date();
        const timestamp = date.getTime();
        const oldEmail = user.email
        if (user) {
                await User.findByIdAndUpdate(
                    user._id,
                    {
                        email: `deleted_${timestamp}_${oldEmail}`,
                        deleted_at: date
                    },
                    { new: true }
                )
            }
        // const athlete = await Athlete.findOne({ user: user._id })
        // if (athlete.team) {
        //     await Team.findByIdAndUpdate(
        //         athlete.team,
        //         { $pull: { athletes: athlete._id } },
        //         { new: true }
        //     )
        // }
        // if ((athlete.matches).length > 0) {
        //     for (var match of athlete.matches) {
        //         const matchFind = await Match.findOne({ _id: match })
        //         for (const ath of matchFind.athletes) {
        //             Athlete.findByIdAndUpdate(
        //                 ath,
        //                 { $pull: { matches: match } },
        //                 { new: true }
        //             )
        //         }
        //         await Event.findByIdAndUpdate(
        //             matchFind.event,
        //             { $pull: { matches: matchFind._id } },
        //             { new: true }
        //         )
        //         await Match.findByIdAndDelete(match)
        //     }
        // }
        // if (athlete) {
        //     await Athlete.findByIdAndDelete(athlete._id)
        //     await User.findByIdAndDelete(athlete.user._id)
        // }
        return res.redirect('/admin')
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error.' })
    }
}
const checkAthlete = (req, res) => {
    const uid = req.params.uid
    Athlete.findOne({ user: uid })
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
                    path: '_id',
                    model: 'athletes'
                }
            }
        })
        .populate({
            path: 'matches',
            populate: {
                path: 'athletes',
                populate: {
                    path: '_id',
                    model: 'athletes',
                    populate: {
                        path: 'user',
                        model: 'users'
                    }
                }
            }
        })
        .then((athlete) => {
            return res.render("athlete/athleteProfile", { athlete })
        })
        .catch((err) => {
            return res.json({ message: "something error" })
        })
}
module.exports = {
    teamPage,
    teamInfo,
    addAthleteToTeam,
    indexAdmin,
    getAddAdmin,
    RegisterAthleteByAdmin,
    AdminConfirmPage,
    AdminConfirmInfo,
    AdminConfirm,
    AdminCancel,
    AdminGetEditPage,
    AdminGetEdit,
    AdminUpdateEdit,
    DeleteAthletes,
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
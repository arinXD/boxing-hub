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

const indexAdmin = async (req, res) =>{
    const users = await User.find()
    return res.render('admin/index', {users})
}
const getAddAdmin = async (req, res) =>{
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

const AdminConfirmPage = async (req, res) =>{
    try {
        const unconfirmedAthletes = await Athlete.find({ confirmed: false }).populate('user').populate('team');
        const nullAthletes = await Athlete.find({ confirmed: null }).populate('user').populate('team');

        res.render('admin/athleteConfirm', { athletesData: unconfirmedAthletes , 
            status:req.flash('confirm'), athletesNull: nullAthletes
            });
        
        // return res.send(unconfirmedAthletes)
    } catch (error) {
        console.error(error);
        // Handle errors
    }
}

const AdminConfirmInfo = async (req, res) =>{
    try {
        const athlete = await Athlete.findById(req.params._id);
        if (!athlete) {
            return res.status(404).send('Athlete not found');
        }
        const formattedBday = athlete.bday.toISOString().substr(0, 10);
        res.render('admin/atheleteInfo.ejs', { athlete ,formattedBday});
    } catch (error) {
        console.error('Error fetching athlete:', error);
        res.status(500).send('An error occurred');
    }
}

const AdminConfirm = async (req, res) =>{
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

        res.redirect('/admin/confirm');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}

const AdminCancel = async (req, res) =>{
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

const AdminGetEditPage = async (req, res) =>{
        // const id = req.query.id;
        Athlete.find()
        .then((result) => {
            res.render('admin/atheleteEdit.ejs', { athlete: result, id: req.query.id })
        })
        .catch((err) => {
            console.log(err)
        })
}
const AdminGetEdit = async (req, res) =>{
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
const AdminUpdateEdit = async (req, res) =>{
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

const DeleteAthletes = async (req, res) =>{
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
    DeleteAthletes
}
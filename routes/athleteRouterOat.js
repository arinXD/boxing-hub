var express = require('express');
var router = express.Router();

const Athlete = require("../models/AthleteOat")
const User = require("../models/User")
const Team = require("../models/Team")

const athleteController = require("../controller/athleteController")
const bcrypt = require('bcrypt');


router.get('/', athleteController.fetchAthletes)
router.get('/json', athleteController.fetchAthletesJson)
router.get('/json/:nickname', athleteController.fetchAthletesByNameJson)
router.get('/search', athleteController.searchAthleteJson)
router.get('/find/:id', athleteController.findAthlete)
router.get('/find/json/:id', athleteController.findAthleteJson)
router.post('/', athleteController.createAthlete)


// ------------------------------ส่งคำขอลงสมัครนักกีฬา-----------------------------------------------------

router.get('/add', athleteController.addAthlete);

const RegisterAthlete = async (req, res) => {
    try {
        const { nickname, weight, height, reach, bday, country, weightClass } = req.body;
        const userId = req.session.userId;
        const selectedTeamValue = req.body.team;

        // Fetch the team's _id from the database using the selectedTeamValue
        Team.findOne({ _id: selectedTeamValue })
            .then(async (result) => {
                if (!result) {
                    // Handle the case where the team was not found
                    console.error('Team not found');
                    return res.status(404).send('Team not found');
                }

                const teamId = result._id;

                // Create a new athlete associated with the user
                const athlete = new Athlete({
                    nickname,
                    weight,
                    height,
                    reach,
                    bday,
                    country,
                    weightClass,
                    team: teamId,
                    user: userId, // Assign the user's ID to the athlete's user field
                    confirmed: false
                });

                // Save the athlete
                const athleteResult = await athlete.save();

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { role: 2 },
                    { new: true }
                );

                // Add the athlete's ID to the team's "athletes" array
                const updatedTeam = await Team.findByIdAndUpdate(
                    teamId,
                    { $push: { athletes: athleteResult._id } },
                    { new: true }
                );

                if (!updatedTeam) {
                    // Handle the case where the team was not found during update
                    console.error('Team not found during update');
                    return res.status(404).send('Team not found during update');
                }

                console.log('Updated Team:', updatedTeam);

                res.redirect('/');
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (error) {
        console.error(error);
    }
};

router.post('/AddAthlete', RegisterAthlete);

// -----------------------------------------------------------------------------------

module.exports = router;
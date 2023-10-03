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

router.get('/add', athleteController.addAthlete);

router.get('/adminAdd', async function (req, res, next) {
    const teams = await Team.find();
    res.render('admin/athleteAdminAdd.ejs', {
        teams
    });
});

const AdminAddAthlete = async (req, res) => {
    try {
        const {
            nickname,
            weight,
            height,
            reach,
            bday,
            country,
            weightClass,
            username,
            fname,
            lname,
            email,
            password,
            confirm
        } = req.body;

        if (confirm != password) {
            console.log("not match");
            return res.redirect('/athletes/adminAdd')
        }

        const selectedTeamValue = req.body.team;
        var teamId = null
        Team.findOne({
            _id: selectedTeamValue
        }).then((result) => {
            teamId = result._id

        }).catch((err) => {
            console.log(err);
        })
        // Create a new athlete associated with the user
        const hashPass = await bcrypt.hash(password, 10)
        const newUser = new User({
            role: 3,
            teamrole: 1,
            username,
            fname,
            lname,
            email,
            password: hashPass,
            // img:'avartar.png'
        })
        newUser.save().then((result) => {

        }).catch((err) => {
            console.log(err);
        })
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
            confirmed: true
        });

        // Save the athlete
        const savedAthlete = await athlete.save();
        const aid = savedAthlete._id;

        const updatedTeam = await Team.findByIdAndUpdate({
            _id: teamId
        }, {
            $push: {
                athletes: aid
            }
        }, {
            new: true
        }).then((result) => {
            console.log("team");
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });

        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
};

router.post('/AdminAddAthlete', AdminAddAthlete);



const signUpAndAddAthlete = async (req, res) => {
    try {
        let {
            nickname,
            weight,
            height,
            reach,
            bday,
            country,
            team,
            weightClass
        } = req.body
        if(!team){
            team = null
        }
        const userId = signedIn;
        const selectedTeamValue = team;
        if(!userId){
            return res.send({message:"Provide user id"})
        }
        // return res.send({team})

        const athlete = new Athlete({
            nickname,
            weight,
            height,
            reach,
            bday,
            country,
            weightClass,
            team: selectedTeamValue,
            user: userId, 
            confirmed: false
        });
        const athleteResult = await athlete.save();

        const updatedUser = await User.findByIdAndUpdate(
            userId, {
                role: 2
            }, {
                new: true
            }
        );

        let updatedTeam = null
        if(!team){
            updatedTeam = await Team.findByIdAndUpdate(
                selectedTeamValue, {
                    $push: {
                        athletes: athleteResult._id
                    }
                }, {
                    new: true
                }
            );
        }
        if (!updatedTeam) {
            console.error('Team not found');
            return res.status(404).send('Team not found');
        }

        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
};


router.post('/AddAthlete', signUpAndAddAthlete);


router.get('/confirm', async (req, res) => {
    try {
        const unconfirmedAthletes = await Athlete.find({
            confirmed: false
        }).populate('user').populate('team');

        res.render('admin/athleteConfirm', {
            athletesData: unconfirmedAthletes,
            status: req.flash("status"),
        });
        return res.send(unconfirmedAthletes)

    } catch (error) {
        console.error(error);
    }
});

router.get('/info/:_id', async (req, res) => {
    try {
        const athlete = await Athlete.findById(req.params._id);
        if (!athlete) {
            return res.status(404).send('Athlete not found');
        }

        res.render('athlete/atheleteInfo.ejs', {
            athlete
        });
    } catch (error) {
        console.error('Error fetching athlete:', error);
        res.status(500).send('An error occurred');
    }
});

router.post('/info/confirmAthlete/:_id', async (req, res) => {
    try {
        const athleteId = req.params._id;
        const updatedAthlete = await Athlete.findByIdAndUpdate(
            athleteId, {
                confirmed: true
            }, {
                new: true
            }
        );

        if (!updatedAthlete) {
            return res.status(404).send('Athlete not found');
        }

        const userId = updatedAthlete.user;
        const updatedUser = await User.findByIdAndUpdate(
            userId, {
                role: 3,
                roleteam: 1
            }, {
                new: true
            }
        );
        req.flash("status", true)
        return res.redirect('/athletes/confirm');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
// -----------------------------------------------------------------------------------

router.get('/editAthlete', function (req, res, next) {
    // const id = req.query.id;
    Athlete.find()
        .then((result) => {
            res.render('admin/atheleteEdit.ejs', {
                athlete: result,
                id: req.query.id
            })
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/editAthletes/:_id', async (req, res) => {

    try {
        const athlete = await Athlete.findById(req.params._id);
        if (!athlete) {
            return res.status(404).send('Athlete not found');
        }
        const formattedBday = athlete.bday.toISOString().substr(0, 10);
        res.render('admin/atheleteEdit2.ejs', {
            athlete,
            formattedBday
        });
        console.log('athlete.team:', athlete.team);
    } catch (error) {
        console.error('Error fetching athlete:', error);
        res.status(500).send('An error occurred');
    }
});

router.post('/updateAthletes', async (req, res) => {
    console.log(req.body)
    try {
        const {
            _id,
            nickname,
            weight,
            height,
            reach,
            bday,
            country,
            weightClass,
            wins,
            losses,
            draw,
            knockouts,
            knockoutsLosses,
            technicalKnockouts,
            technicalKnockoutsLosses,
            overwhelmingScore,
            overwhelmingScoreLosses,
            majorityVotes,
            majorityVotesLosses
        } = req.body;

        const updatedAthletes = await Athlete.findByIdAndUpdate(
            _id, {
                nickname,
                weight,
                height,
                reach,
                bday,
                country,
                weightClass,
                wins,
                losses,
                draw,
                knockouts,
                knockoutsLosses,
                technicalKnockouts,
                technicalKnockoutsLosses,
                overwhelmingScore,
                overwhelmingScoreLosses,
                majorityVotes,
                majorityVotesLosses
            }, {
                new: true
            }
        );

        if (!updatedAthletes) {
            return res.status(404).send('Athletes not found');
        }

        console.log('Athletes updated:', updatedAthletes);
        res.redirect('/athletes/editAthlete');
    } catch (error) {
        console.error('Error updating Athletes:', error);
        res.status(500).send('An error occurred');
    }
});

router.get('/deleteAthletes/:_id', (req, res) => {
    const id = req.params._id;
    console.log('Deleting Athlete with ID:', id);

    Athlete.findByIdAndDelete(id)
        .then((result) => {
            console.log('Athlete deleted:', result);
            res.redirect('/athletes/editAthlete');
        })
        .catch((err) => {
            console.error('Error deleting Athlete:', err);
            res.status(500).send('An error occurred');
        });
});

module.exports = router;
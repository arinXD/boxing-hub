var express = require('express');
var router = express.Router();

const Athlete = require("../models/Athlete")
const User = require("../models/User")

const athleteController = require("../controller/athleteController")
const bcrypt = require('bcrypt');


router.get('/', athleteController.fetchAthletes)
router.get('/find/:id', athleteController.findAthlete)
router.get('/find/json/:id', athleteController.findAthleteJson)
router.post('/', athleteController.createAthlete)


router.get('/add', function (req, res, next) {
    res.render('athlete/athleteAdd.ejs');
});

router.get('/adminAdd', function (req, res, next) {
    res.render('admin/athleteAdminAdd.ejs');
});

const AdminAddAthlete = async (req, res) => {
    try {
        const { aka, weight, height,reach,bday, country, weightClass, profileImg } = req.body;
        const userId = req.session.userId;
        // Create a new athlete associated with the user
        const athlete = new Athlete({
            aka,
            weight,
            height,
            reach,
            bday,
            country,
            weightClass,
            profileImg,
            user: userId, // Assign the user's ID to the athlete's user field
            confirmed: true
        });

        // Save the athlete
        const athleteResult = await athlete.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
};

router.post('/AdminAddAthlete', AdminAddAthlete);


const signUpAndAddAthlete = async (req, res) => {
    try {
        const { aka, weight, height,reach,bday, country, weightClass, profileImg } = req.body;
        const userId = req.session.userId;
        // Create a new athlete associated with the user
        const athlete = new Athlete({
            aka,
            weight,
            height,
            reach,
            bday,
            country,
            weightClass,
            profileImg,
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

        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
};

// Usage in your Express routes
router.post('/AddAthlete', signUpAndAddAthlete);


router.get('/confirm', async (req, res) => {
    try {
        const unconfirmedAthletes = await Athlete.find({ confirmed: false });


        res.render('admin/athleteConfirm', { athletesData: unconfirmedAthletes });
        // return res.send(unconfirmedAthletes)
    } catch (error) {
        console.error(error);
        // Handle errors
    }
});

// router.post('/confirmAthlete/:_id', async (req, res) => {
//     try {
//         const athleteId = req.params._id; // Access it as a URL parameter

//         const updatedAthlete = await Athlete.findByIdAndUpdate(
//             athleteId,
//             { confirmed: true },
//             { new: true }
//         );

//         console.log('Updated athlete:', updatedAthlete);

//         if (!updatedAthlete) {
//             // Athlete not found, handle the error
//             return res.status(404).send('Athlete not found');
//         }

//         // Redirect back to the confirmation page or another suitable location
//         res.redirect('/athletes/confirm');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// });

router.get('/info/:_id', async (req, res) => {
    try {
        const athlete = await Athlete.findById(req.params._id);
        if (!athlete) {
            return res.status(404).send('Athlete not found');
        }

        res.render('athlete/atheleteInfo.ejs' , { athlete });
    } catch (error) {
        console.error('Error fetching athlete:', error);
        res.status(500).send('An error occurred');
    }
});

router.post('/info/confirmAthlete/:_id', async (req, res) => {
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
            { role: 3 },
            { new: true }
        );

        console.log('Updated athlete:', updatedAthlete);
        console.log('Updated user:', updatedUser);

        res.redirect('/athletes/confirm');
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
            res.render('admin/atheleteEdit.ejs', { athlete: result, id: req.query.id })
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

        res.render('admin/atheleteEdit2.ejs' , { athlete });
    } catch (error) {
        console.error('Error fetching athlete:', error);
        res.status(500).send('An error occurred');
    }
});

router.post('/updateAthletes', async (req, res) => {
    console.log(req.body)
    try {
        const {_id, aka, weight, height,reach,bday, country, weightClass, profileImg } = req.body;

        const updatedAthletes = await Athlete.findByIdAndUpdate(
            _id,
            { aka, weight, height,reach,bday, country, weightClass, profileImg },
            { new: true }
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
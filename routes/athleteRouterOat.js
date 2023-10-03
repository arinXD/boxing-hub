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
router.post('/AddAthlete', athleteController.RegisterAthlete);

// -----------------------------------------------------------------------------------

module.exports = router;
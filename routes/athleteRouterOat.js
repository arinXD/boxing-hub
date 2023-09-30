var express = require('express');
var router = express.Router();

const athleteController = require("../controller/athleteController")

router.get('/', athleteController.fetchAthletes)
router.get('/find/:id', athleteController.findAthlete)
router.get('/find/json/:id', athleteController.findAthleteJson)
router.post('/', athleteController.createAthlete)

module.exports = router;
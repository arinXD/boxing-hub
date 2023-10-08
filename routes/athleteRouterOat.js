var express = require('express');
var router = express.Router();
const athleteController = require("../controller/athleteController")



router.get('/', athleteController.athletePage)
router.get('/json', athleteController.fetchAthletesJson)
router.get('/json/:nickname', athleteController.fetchAthletesByNameJson)
router.get('/search', athleteController.searchAthleteJson)
router.get('/find/:id', athleteController.findAthlete)
router.get('/find/json/:id', athleteController.findAthleteJson)
router.post('/', athleteController.createAthlete)
router.get('/add', athleteController.addAthlete);
router.post('/AddAthlete', athleteController.RegisterAthlete);


module.exports = router;
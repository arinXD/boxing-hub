var express = require('express');
var router = express.Router();
const athleteController = require("../controller/athleteController")
const signInMiddleware = require("../middleware/signInMiddleware")


router.get('/', athleteController.athletePage)
router.get('/json', athleteController.fetchAthletesJson)
router.get('/json/:nickname', athleteController.fetchAthletesByNameJson)
router.get('/search', athleteController.searchAthleteJson)
router.get('/find/:id', athleteController.findAthlete)
router.get('/find/json/:id', athleteController.findAthleteJson)
router.post('/', signInMiddleware.insignIn ,athleteController.createAthlete)
router.get('/add', signInMiddleware.insignIn,athleteController.addAthlete);
router.post('/AddAthlete', signInMiddleware.insignIn,athleteController.RegisterAthlete);


module.exports = router;
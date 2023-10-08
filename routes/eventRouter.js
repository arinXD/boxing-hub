var express = require('express');
var router = express.Router();

const eventController = require("../controller/eventController");

router.get('/', eventController.eventIndex);
router.post('/', eventController.addEvent);
router.get('/edit/:id', eventController.editEvent);
router.post('/updateEvent', eventController.updateEvent);
router.get('/delete/:id', eventController.deleteEvent);


module.exports = router;

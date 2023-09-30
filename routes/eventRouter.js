var express = require('express');
var router = express.Router();

const eventController = require("../controller/eventController");

router.get('/', eventController.eventIndex);
router.post('/', eventController.addEvent);

module.exports = router;

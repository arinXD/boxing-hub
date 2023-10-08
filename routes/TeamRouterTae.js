var express = require('express');
var router = express.Router();
const teamController = require('../controller/teamController');

router.get('/', teamController.teamPage);
router.get('/info/:id', teamController.teamInfo);
router.get('/info2/:id', teamController.teamInfoUser);
router.get('/search', teamController.searchTeam);

module.exports = router;
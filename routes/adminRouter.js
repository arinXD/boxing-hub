var express = require('express');
var router = express.Router();
const adminController = require("../controller/adminController")
const User = require("../models/User");
const Athlete = require("../models/AthleteOat")
const Team = require("../models/Team")

const athleteController = require("../controller/athleteController")
const bcrypt = require('bcrypt');

router.get("/", adminController.indexAdmin)

router.get("/team", adminController.teamPage)
router.get("/team/:id", adminController.teamInfo)

// ยังไม่เสร็จ
router.post("/team/athlete", adminController.addAthleteToTeam)

//---------------------------------เพิ่มนักกีฬา----------------------------------------------------

router.get("/adminAdd", adminController.getAddAdmin)
router.post('/AdminAddAthlete', adminController.RegisterAthleteByAdmin);

//-------------------------------------------------------------------------------------

//----------------------------------ยืนยันนักกีฬา---------------------------------------------------

router.get("/confirm", adminController.AdminConfirmPage)
router.get("/info/:_id", adminController.AdminConfirmInfo)
router.post("/info/confirmAthlete/:_id", adminController.AdminConfirm)
router.get("/cancelAthlete/:_id", adminController.AdminCancel)

//------------------------------------แก้ไข-------------------------------------------------

router.get("/editAthlete", adminController.AdminGetEditPage)
router.get("/editAthletes/:_id", adminController.AdminGetEdit)
router.post("/updateAthletes", adminController.AdminUpdateEdit)

//-------------------------------------------------------------------------------------

//--------------------------------------ลบนักกีฬา-----------------------------------------------

router.get("/deleteAthletes/:_id", adminController.DeleteAthletes)

//-------------------------------------------------------------------------------------

module.exports = router;
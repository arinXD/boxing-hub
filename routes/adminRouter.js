var express = require('express');
var router = express.Router();
const adminController = require("../controller/adminController")
const User = require("../models/User");

router.get("/", async (req, res) => {
    const users = await User.find()
    return res.render('admin/index', {users})
})
router.get("/team", adminController.teamPage)
router.get("/team/:id", adminController.teamInfo)

// ยังไม่เสร็จ
router.post("/team/athlete", adminController.addAthleteToTeam)

module.exports = router;
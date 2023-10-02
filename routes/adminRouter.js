var express = require('express');
var router = express.Router();
const adminController = require("../controller/adminController")

router.get("/", (req, res) => {
    return res.render('admin/index')
})
router.get("/team", adminController.teamPage)
router.get("/team/:id", adminController.teamInfo)

// ยังไม่เสร็จ
router.post("/team/athlete", adminController.addAthleteToTeam)

module.exports = router;
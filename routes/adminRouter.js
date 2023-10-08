var express = require('express');
var router = express.Router();
const adminController = require("../controller/adminController")
const User = require("../models/User");
const Athlete = require("../models/AthleteOat")
const Team = require("../models/Team")
const bcrypt = require('bcrypt');
const multer  = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/images/teams'))
    },
    filename: function (req, file, cb) {
        const postFix = file.originalname.split(".")[1]
        console.log(req.body.tid)
        return cb(null, `${req.body.tid}.${postFix}`)
    }
})
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg',];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({storage, fileFilter})
// ---- ทดสอบเพิ่มผู้ใช้แบบเยอะๆ
router.get("/add/users/random", async (req, res)=>{
    try{
        let usersList = []
        for(let i=501; i<=1000;i++){
            const no = (i<10)? `0${i}`:i
            const user = new User({
                username:`user${no}`,
                fname:`firstname${i}`,
                lname:`lastname${i}`,
                email:`user${no}@gmail.com`,
                password: await bcrypt.hash(`${i}`, 10)
            })
            await user.save()
            usersList.push(user)
        }
        return res.json({usersList})
    }catch(err){
        return res.json({ errorMessage:err.message })
    }
    
})

router.get("/", adminController.adminPage)
router.get("/team", adminController.teamPage)
router.get("/team/:id", adminController.teamInfo)
router.post("/team/athlete", adminController.addAthleteToTeam)
router.post('/team/insert', adminController.insertTeam)
router.get('/team/update/:id', adminController.updateTeamPage)
router.post('/team/update/', upload.single('teamLogo'),adminController.updateTeam)
router.get('/team/delete/:id', adminController.deleteTeam)
router.get('/team/del/athlete/:tid/:aid', adminController.deleteAthleteFromTeam)
router.get('/user/update/:uid', adminController.updateUserPage)
router.post('/user/update', adminController.updateUser)
router.get('/user/delete/:uid', adminController.deleteUser)
router.get('/check/athlete/:uid', adminController.checkAthlete)

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
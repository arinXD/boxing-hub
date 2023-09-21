const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');
const multer  = require('multer')
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/images/profile'))
    //   D:\Github\tko_project\public\images
    //   D:\Github\public\images\profile\6507abe54a9ae45d6f7f33da.png
    },
    filename: function (req, file, cb) {
        const postFix = file.originalname.split(".")[1]
        return cb(null, `${signedIn}.${postFix}`)
    }
})
const upload = multer({storage})

router.get('/', profileController.profilePage)
router.post('/upload/image', upload.single('profileImg'), profileController.uploadProfileImages)


module.exports = router;
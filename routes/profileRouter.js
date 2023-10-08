const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/profile'))
    },
    filename: function (req, file, cb) {
        const postFix = file.originalname.split(".")[1]
        return cb(null, `${signedIn}.${postFix}`)
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

router.get('/', profileController.profilePage)
router.get('/setting', profileController.profileSetting)
router.post('/upload/image', upload.single('profileImg'), profileController.uploadProfileImages)
router.post('/update', profileController.profileUpdate)
router.get('/reset_password', profileController.resetPasswordPage)
router.post('/reset_password', profileController.resetPassword)


module.exports = router;
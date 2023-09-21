var express = require('express');
var router = express.Router();
const authController = require("../controller/authController")

router.get('/signin', authController.signInPage)
router.post('/signin', authController.signIn)

router.get('/signup', authController.signUpPage)
router.post('/signup', authController.signUp)

module.exports = router;
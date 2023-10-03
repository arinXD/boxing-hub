var express = require('express');
var router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.render('index');
})


router.get('/users', async (req, res, next) => {
    let users
    await User.find().then((result) => {
        users = result
    }).catch((err) => {
        console.error(err)
    })
    return res.json(users)
})


module.exports = router;
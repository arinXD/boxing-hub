var express = require('express');
var router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get('/', async (req, res, next) => {
    let name = ""
    let role
    if (signedIn) {
        await User.findById(signedIn).then((result) => {
            // console.log(result);
            name = `${result.fname} ${result.lname}`
        })
    }
    res.render('index', {
        name
    });
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
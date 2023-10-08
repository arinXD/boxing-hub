var express = require('express');
var router = express.Router();
const User = require("../models/User");
const Event = require("../models/Events");
/* GET home page. */
router.get('/', async (req, res, next) => {
    var getEvent = await Event.find().populate("matches").populate({
        path: 'matches',
        populate: {
          path: 'athletes',
          populate: {
            path: 'athlete',
            model: 'athletes',
          }
        }
      });
    res.render('index', {mytitle: 'Hello',getEvent});
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
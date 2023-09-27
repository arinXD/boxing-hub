var express = require('express');
var router = express.Router();

const Team = require("../models/Team")

const bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
    Team.find()
        .then((result) => {
            res.render('team/teamPage.ejs')
        })
        .catch((err) => {
            console.log(err)
        })
});


module.exports = router;
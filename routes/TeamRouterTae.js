var express = require('express');
var router = express.Router();

const Team = require("../models/Team")

const bcrypt = require('bcrypt');

router.get('/', async function (req, res, next) {
    try {
        const teams = await Team.find().populate('athletes');
        res.render('team/teamPage.ejs', { teams });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/info/:id', async function (req, res, next) {
    try {
        const id = req.params.id
        const team = await Team.findOne({_id:id})
        .populate('athletes')
        .populate({
            path: 'athletes',
            populate: {
              path: 'user', 
              model: 'users'
            }
        })
        return res.render('team/teamInfo',{
            team
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
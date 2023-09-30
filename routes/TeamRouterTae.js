var express = require('express');
var router = express.Router();

const Team = require("../models/Team")

const bcrypt = require('bcrypt');

router.get('/', async function (req, res, next) {
    try {
        const teams = await Team.find().populate('athletes');
        // return res.send(teams)
        res.render('team/teamPage.ejs', { teams }); // Pass the teams data to your EJS template
    } catch (err) {
        console.error(err);
        // Handle errors here, such as sending an error response or rendering an error page
        res.status(500).send('Internal Server Error');
    }
});
router.get('/info/:id', async function (req, res, next) {
    try {
        const id = req.params.id
        const team = await Team.findOne({_id:id}).populate('athletes');
        return res.send(team)
        res.render('team/teamPage.ejs', { teams }); // Pass the teams data to your EJS template
    } catch (err) {
        console.error(err);
        // Handle errors here, such as sending an error response or rendering an error page
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
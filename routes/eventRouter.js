var express = require('express');
var router = express.Router();
const Event = require("../models/EventOat");
router.get("/", async (req, res) => {
    Event.find().populate('matches')
        .populate({
            path: 'matches',
            populate: {
                path: 'athletes',
                populate: {
                    path: '_id',
                    model: 'athletes',
                }
            }
        })
        .then((result => {
            return res.send(result)
        }))
        .catch((err) => {
            return res.send(err)
        })
})
router.post('/insert', async (req, res, next) => {
    const newEvent = new Event({
        eventName: req.body.eventName,
        shortName: req.body.shortName,
        season: req.body.season,
        day: req.body.day,
        dateTime: req.body.dateTime,
        matches: req.body.matches,
    })
    newEvent.save()
        .then((result) => {
            return res.send(result)
        })
        .catch((err) => {
            console.error(err)
        })
})


router.get('/', eventController.eventIndex);
router.post('/', eventController.addEvent);
router.get('/edit/:id', eventController.editEvent);
router.post('/updateEvent', eventController.updateEvent);
router.get('/delete/:id', eventController.deleteEvent);


module.exports = router;

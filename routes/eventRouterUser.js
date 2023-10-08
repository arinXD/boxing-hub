var express = require('express');
var router = express.Router();
const Event = require("../models/Events");
const Athlete = require("../models/Athletes");


router.get('/', async (req, res) => {
  try {

    const [events, athletes] = await Promise.all([
      Event.find().sort({
        createAt: -1
      }),
      Athlete.find(),
    ]);

    res.render("event", {
      mytitle: "Event",
      events,
      athletes
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูล");
  }
});

router.get('/showDetail/:id', async (req, res) => {
  const eventFind = req.params.id;

  try {
    var getEvent = await Event.findById(eventFind).populate("matches").populate({
      path: 'matches',
      populate: {
        path: 'athletes',
        populate: {
          path: 'athlete',
          model: 'athletes',
        }
      }
    });

    // ส่งข้อมูลทั้งสองไปยังหน้า eventIndex
    res.render("eventAndMatchesDetail", {
      mytitle: "MatchDetail",
      getEvent
    });
    // return res.json(getEvent);
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูล");
  }

});


module.exports = router;
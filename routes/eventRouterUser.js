var express = require('express');
var router = express.Router();
const Event = require("../models/Events");
const Athlete = require("../models/Athletes");


router.get('/', async (req, res) => {
    try {

      const [events, athletes] = await Promise.all([
        Event.find().sort({ createAt: -1 }),
        Athlete.find(),
      ]);
  
      res.render("event", { mytitle: "Event", events, athletes });
    } catch (err) {
      console.error(err);
      res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  });


module.exports = router;

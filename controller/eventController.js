// const bcrypt = require("bcrypt")
const Event = require("../models/Event");

const Athlete = require("../models/Athlete");

const Match = require("../models/Match");

const eventIndex = async (req, res) => {
    try {
        // ใช้ Promise.all() เพื่อดึงข้อมูลจากสอง collection พร้อมกัน
        const [events, athletes] = await Promise.all([
          Event.find().sort({ createAt: -1 }),
          Athlete.find(),
        ]);
    
        // ส่งข้อมูลทั้งสองไปยังหน้า eventIndex
        res.render("eventIndex", { mytitle: "Event", events, athletes });
      } catch (err) {
        console.error(err);
        res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }

    
}
const addEvent = async (req, res, next) => {
  try {
    // สร้างอาร์เรย์เก็บคู่ข้อมูล firstselector และ secondselector
    const selectors = [];

    // ใช้ลูปเพื่อดึงค่าจาก firstselector1 ถึง firstselector8 และ secondselector1 ถึง secondselector8
    for (let i = 1; i <= 8; i++) {
      const firstSelectorKey = `firstselector${i}`;
      const secondSelectorKey = `secondselector${i}`;

      // ตรวจสอบว่าค่าของ firstselector และ secondselector มีอยู่ใน req.body หรือไม่
      if (req.body[firstSelectorKey] && req.body[secondSelectorKey]) {
        const athlete1 = await Athlete.findOne({ aka: req.body[firstSelectorKey] });
        const athlete2 = await Athlete.findOne({ aka: req.body[secondSelectorKey] });

        if (athlete1 && athlete2) {
          const selectorPair = {
            Order: `คู่ที่ ${i}`,
            firstselector: athlete1._id,
            secondselector: athlete2._id,
          };
          selectors.push(selectorPair);
        }
      }
    }

    // ตรวจสอบว่า selectors มีข้อมูลหรือไม่
    if (selectors.length > 0) {
      // ทำสิ่งที่คุณต้องการกับอาร์เรย์ selectors ที่ได้รับ
      // console.log('selectors:', selectors);
      // console.log(selectors[0].Order + ':', selectors[0].firstselector + ':', selectors[0].secondselector)
      // console.log(selectors[1].Order + ':', selectors[1].firstselector + ':', selectors[1].secondselector)
      // คำสั่งที่คุณต้องการเพิ่มข้อมูลลงใน NoSQL database ในส่วนนี้
      const event = new Event({
        eventName: req.body.eventName,
        eventDate: req.body.eventDate,
        eventTime: req.body.eventTime,
        eventLocation: req.body.eventLocation,
        country: req.body.country,
      });
      
      // บันทึก event ลงในฐานข้อมูล
      await event.save();
      
      // สร้างเหตุการณ์ match และเชื่อม event กับ match
      for (const selector of selectors) {
        const match = new Match({
          Description: "Normal"
          // เพิ่มฟิลด์อื่น ๆ ของ match ตามที่คุณต้องการ
        });
      
        // บันทึก match ลงในฐานข้อมูล
        await match.save();
      
        // เชื่อม event กับ match และสร้างรายการผู้เล่น (athletes) ใน match
        event.matches = event.matches || []; // ตรวจสอบว่า event.matches ยังไม่ได้ถูกสร้าง
      
        event.matches.push(match);
      
        // สร้างรายการผู้เล่น (athletes) ใน match
        const athlete1 = {
          athlete: selector.firstselector,
          Winner: false,
        };
      
        const athlete2 = {
          athlete: selector.secondselector,
          Winner: false,
        };
      
        match.athletes = [athlete1, athlete2];
      
        // บันทึก match อีกครั้งเพื่อเก็บการเชื่อมโยงของ athletes
        await match.save();
      }
      
      // บันทึกการเปลี่ยนแปลงใน event (ที่มี matches และ athletes อัพเดตแล้ว)
      await event.save();

      // Redirect หลังจากเพิ่มข้อมูลเสร็จสิ้น
      return res.redirect('/eventIndex');
    }
  } catch (error) {
    return next(error);
  }
};


module.exports = {
    eventIndex,
    addEvent
    
}
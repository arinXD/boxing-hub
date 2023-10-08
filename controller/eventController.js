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
    // var selectors = [];

    // const eventObj = {
    //   matches: [],
    // };

    // สร้าง event และบันทึกลงในฐานข้อมูล
    const event = new Event({
      eventName: req.body.eventName,
      eventDate: req.body.eventDate,
      eventTime: req.body.eventTime,
      Location: req.body.eventLocation,
      country: req.body.country,
    });

    // เพิ่ม match สำหรับแต่ละรอบ (สูงสุด 8 matches)
    const eventMatches = []; // สร้างอาร์เรย์เพื่อเก็บ match ที่สร้างขึ้น
    // for (let i = 1; i <= 8; i++) {


    //   // let a1 = await Athlete.findOne({_id: selectors[i].firstselector})
    //   // let a2 = await Athlete.findOne({_id: selectors[i].secondselector})

    //   // return res.send({selectors});


    // }

    event.matches = eventMatches; // กำหนด matches ให้กับ event
    await event.save(); // บันทึก event ลงในฐานข้อมูล

    // Redirect หลังจากเพิ่มข้อมูลเสร็จสิ้น

    // ใช้ลูปเพื่อดึงค่าจาก firstselector1 ถึง firstselector8 และ secondselector1 ถึง secondselector8
    for (let i = 1; i <= 8; i++) {

      let firstSelectorKey = `firstselector${i}`;
      let secondSelectorKey = `secondselector${i}`;


      // selectors[i] = {};
      // console.log(weightClass);
      // let iInLoop = i;
      // ตรวจสอบว่าค่าของ firstselector และ secondselector มีอยู่ใน req.body หรือไม่
      if (req.body[firstSelectorKey] && req.body[secondSelectorKey]) {
        const [athlete1, athlete2] = await Promise.all([
          Athlete.findOne({ _id: req.body[firstSelectorKey] }),
          Athlete.findOne({ _id: req.body[secondSelectorKey] }),
        ]);

        // console.log(`คู่ที่ ${i}`)
        // console.log('athlete2:', athlete2);
        // console.log('athlete1:', athlete1);



        // let weightClass1 = athlete1.weightClass;
        // let weightClass2 = athlete2.weightClass;

        // console.log('athlete1:', weightClass1);
        // console.log('athlete2:', weightClass2);

        if (athlete1 && athlete2) {
          // รอให้คำขอ findOne เสร็จสมบูรณ์และได้ข้อมูลนักกีฬา
          const athlete1Id = athlete1._id;
          const athlete2Id = athlete2._id;

          // return res.send({athlete1Id, athlete2Id})
          // console.log(
          //   "----------------------------------------------------------------"+"\n"+
          //   `Id: ${i} `+ athlete1Id + 
          //   `Id: ${i+1} `+ athlete2Id + 
          //   "----------------------------------------------------------------"
          // )

          // const selectorPair = {
          //   Order: `คู่ที่ ${i}`,
          //   firstselector: athlete1Id,
          //   secondselector: athlete2Id,
          // };
          // selectors.push({
          //   Order: `คู่ที่ ${i}`,
          //   firstselector: athlete1Id,
          //   secondselector: athlete2Id,
          // });

          let weightClass = `weightClass${i}`;
          let isChampionship = `description${i}`;
          let reqWeightClass = req.body[weightClass];
          let reqIsChampionship = req.body[isChampionship];

          let GetIsChampionship = '';
          if (reqIsChampionship) {
            GetIsChampionship = "การแข่งขันชิงแชมป์";
          } else {
            GetIsChampionship = "การแข่งขันทั่วไป";
          }

          let getWeightClassToAdd = '';
          if (reqWeightClass) {
            getWeightClassToAdd = reqWeightClass;
          } else {
            getWeightClassToAdd = "Catchweight";
          }

          const match = new Match({
            WeightClass: getWeightClassToAdd,
            Description: GetIsChampionship,
            order: i,
            athletes: [{

              _id: athlete1Id,
              Winner: false,
            }, {
              _id: athlete2Id,
              Winner: false,
            }
            ]
          });
          var matchesSave = await match.save();
          var addIdMatches = await Event.findByIdAndUpdate(
            event._id,
            { $push: { matches: matchesSave._id } },
            { new: true }
          )
          // eventMatches.push(match._id); // เพิ่ม match ID ลงในอาร์เรย์
          // let athleteOne = {

          //   _id: athlete1Id,
          //   Winner: false,
          // };
          // let athleteTwo = {
          //   _id: athlete2Id,
          //   Winner: false,
          // };
          // match.athletes = [athleteOne, athleteTwo];
          // await match.save();
          // if (i == 2) return res.json(selectors);
        } else {
          console.error('ไม่พบข้อมูลนักกีฬาในระบบ');
        }


      }

    }
    // ตรวจสอบว่า selectors มีข้อมูลหรือไม่
    return res.redirect('/eventIndex');

  } catch (error) {
    return next(error);
  }
};

const editEvent = async (req, res) => {
  const eventFind = req.params.id;
  const athletes = await Athlete.find();
  try {
    // ดึงข้อมูล event และ populate matches
    var getEvent = await Event.findById(eventFind).populate("matches").populate({
      path: 'matches',
      populate: {
        path: 'athletes',
        populate: {
          path: '_id',
          model: 'athletes',
        }
      }
    });



    // var getMatches = getEvent.matches;
    var getMatches = getEvent.matches;
    var getAthlete = [];
    for (var i in getMatches) {
      // console.log(getMatches[i].athletes);
      getAthlete.push(getMatches[i].athletes)
    }

    // for (let i = 0; i < 8; i++) { 

    //   let matches = getMatches[i];
    //   console.log("================================")
    //   console.log(`รอบที่ ${i}`)
    //   console.log(matches);
    //   console.log("================================")
    // }

    // var MatchesAthletes = [];
    // for (let i of getMatches) {
    //   // console.log(`รอบที่ ${count}`);
    //   let Id = i.athletes;

    //   // console.log("============\n"
    //   // +Id+"============")
    //   MatchesAthletes.push({Id})
    // //   console.log("--------------------------------");
    // //   count = count + 1;
    // }
    // // return res.json(MatchesAthletes);
    // var AthleteSendToEjs = [];
    // for (var getValues of MatchesAthletes){
    //   for (var getId of getValues.Id){
    //     var getObjectId = await Athlete.findById(getId._id)
    //     var getAka = getObjectId.aka;
    //     var getWinner = getId.Winner;
    //     AthleteSendToEjs.push({getAka, getWinner})
    //   } 
    //}
    // for (let i in getEvent){
    //   console.log(getEvent[i].matches._id)
    // }
    res.render("eventEditForm", { mytitle: "EditForm", getEvent, getMatches, getAthlete, athletes });
    // เมื่อเสร็จสิ้นการทำงานในลูป สามารถแสดงผลหรือประมวลผลเพิ่มเติมได้ตามที่คุณต้องการ
    // return res.json(getAthlete);

    // เช่น return res.json(getEvent) หรือ res.render('eventEditForm', { mytitle: 'Edit', getEvent });

  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูล");
  }
};

const updateEvent = async (req, res) => {
  try {
    var { _idEvent, eventName, eventDate, eventTime,
      Location, country, getEndEvent} = req.body;

    for (var i = 0; i < 8; i++) {
      var getMatchId = req.body[`match${i + 1}`];
      var WeightClass = req.body[`weightClass${i + 1}`];
      var Description1 = req.body[`description${i + 1}`];
      var Rounds = req.body[`round${i + 1}`];
      var ResultRound = req.body[`ResultRound${i + 1}`];
      var ResultClock = req.body[`ResultClock${i + 1}`];
      var resultType = req.body[`getResultType${i + 1}`];
      var getWinner = req.body[`getWinner${i + 1}`];
      var Athlete1 = req.body[`athleteId1${i}`];
      var Athlete2 = req.body[`athleteId2${i}`];
      // console.log(getWinner);
      // console.log("================================");
      // console.log(Athlete1);
      // console.log(Athlete2);


      var athletesMatch;

      if (getWinner == Athlete1) {
        athletesMatch = [
          {
            _id: Athlete1,
            Winner: true
          },
          {
            _id: Athlete2,
            Winner: false
          }
        ];
        await Athlete.findByIdAndUpdate(
          Athlete1,
          { $inc: { wins: 1 } },
          { new: true }
        );
        await Athlete.findByIdAndUpdate(
          Athlete2,
          { $inc: { losses: 1 } },
          { new: true }
        );
      } else if (getWinner == Athlete2) {
        athletesMatch = [
          {
            _id: Athlete1,
            Winner: false
          },
          {
            _id: Athlete2,
            Winner: true
          }
        ];
        await Athlete.findByIdAndUpdate(
          Athlete1,
          { $inc: { losses: 1 } },
          { new: true }
        );
        await Athlete.findByIdAndUpdate(
          Athlete2,
          { $inc: { wins: 1 } },
          { new: true }
        );
      }

      // console.log(athletesMatch)

      var GetIsChampionship = '';
      if (Description1 === "on") {
        GetIsChampionship = "การแข่งขันชิงแชมป์";
      } else {
        GetIsChampionship = "การแข่งขันทั่วไป";

      }
      var Description = GetIsChampionship;

      var updateMatch = await Match.findByIdAndUpdate(
        getMatchId,
        { WeightClass, Description, Rounds, ResultRound, ResultClock, Description, resultType, athletes: athletesMatch },
        { new: true }
      );


    }

    var Status = "";
    if (getEndEvent === "on"){
      Status = "1"
    } else {
      Status = "0"
    }
   
   
    var updateEvent = await Event.findByIdAndUpdate(
      _idEvent,
      { eventName, eventDate, eventTime, Location, country, Status},
      { new: true }
    );



    if (!updateEvent && !updateMatch) {
      return res.status(404).send('Event not found');
    }

    // console.log('Student updated:', updatedStudent);
    res.redirect('/eventIndex');
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('An error occurred');
  }
}

const deleteEvent = async (req, res) => {
  const eventFind = req.params.id;
  const getEvent = await Event.findById(eventFind)
  const getMatch = getEvent.matches;
  
  for (let i=0; i<getMatch.length; i++) {
    var deleteId = await Match.findByIdAndDelete(getMatch[i]);
  }
  
  const getEventDelete = await Event.findByIdAndDelete(eventFind);
  res.redirect('/eventIndex');

}






module.exports = {
  eventIndex,
  addEvent,
  editEvent,
  updateEvent,
  deleteEvent

}
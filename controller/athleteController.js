const Athlete = require("../models/Athlete")

const fetchAthletes = async (req, res)=>{
    await Athlete.find().populate('user')
        .then((athletes)=>{

            return res.render("athlete/athletesPage", { athletesData : athletes})
        })
        .catch((err)=>{
            console.error(err)
        })
}
const findAthlete = async (req, res)=>{
    console.log(req.query.id);
    await Athlete.find({_id:req.query.id}).populate('user')
    .then((athlete)=>{
        return res.json(athlete)
    })
    .catch((err)=>{
        console.error(err)
    })
}
const createAthlete = (req, res)=>{
    console.log(req.body)
    const athlete = new Athlete(req.body)
    athlete.save()
        .then((result) => {
            return res.send(result)
        })
        .catch((err) => {
            console.error(err)
        })
}



module.exports = {
    fetchAthletes,
    createAthlete,
    findAthlete,
}
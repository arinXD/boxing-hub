const Athlete = require("../models/Athletes")
const User = require("../models/User");
const Team = require("../models/Team");
const bcrypt = require("bcrypt")

const fetchAthletesJson = async (req, res) => {
    const athletes = await Athlete.find({ confirmed: true }).populate('user')
    return res.json(athletes)
}
const athletePage = async (req, res) => {
    await Athlete.find({ confirmed: true }).populate('user')
        .then((athletes) => {
            return res.render("athlete/athletesPage", {
                athletesData: athletes
            })
        })
        .catch((err) => {
            console.error(err)
        })
}
const fetchAthletes = async (req, res) => {
    await Athlete.find({ confirmed: true, team: null }).populate('user')
        .then((athletes) => {
            return res.render("athlete/athletesPage", {
                athletesData: athletes
            })
        })
        .catch((err) => {
            console.error(err)
        })
}
const findAthlete = async (req, res) => {
    console.log(req.params.id);
    await Athlete.findOne({
        _id: req.params.id,
        confirmed: true
    }).populate(['matches', 'user', 'team'])
        .populate({
            path: 'matches',
        })
        .populate({
            path: 'matches',
            populate: {
                path: 'event',
                model: 'events'
            }
        })
        .populate({
            path: 'matches',
            populate: {
                path: 'athletes',
                populate: {
                    path: 'athlete',
                    model: 'athletes'
                }
            }
        })
        .populate({
            path: 'matches',
            populate: {
                path: 'athletes',
                populate: {
                    path: 'athlete',
                    model: 'athletes',
                    populate: {
                        path: 'user',
                        model: 'users'
                    }
                }
            }
        })
        .then((athlete) => {
            // return res.send({athlete})
            return res.render("athlete/athleteProfile", { athlete })
        })
        .catch((err) => {
            console.error(err)
        })
}
const findAthleteJson = async (req, res) => {
    console.log(req.params.id);
    await Athlete.findOne({
        _id: req.params.id,
        confirmed: true
    }).populate(['matches', 'user',])
        .populate({
            path: 'matches',
        })
        .populate({
            path: 'matches',
            populate: {
                path: 'event',
                model: 'events'
            }
        })
        .populate({
            path: 'matches',
            populate: {
                path: 'athletes',
                populate: {
                    path: '_id',
                    model: 'athletes'
                }
            }
        })
        .populate({
            path: 'matches',
            populate: {
                path: 'athletes',
                populate: {
                    path: '_id',
                    model: 'athletes',
                    populate: {
                        path: 'user',
                        model: 'users'
                    }
                }
            }
        })
        .then((athlete) => {
            return res.send(athlete)
        })
        .catch((err) => {
            console.error(err)
        })
}
const createAthlete = async (req, res) => {
    const newUser = new User({
        username: "rodtang",
        fname: "รถถัง",
        lname: "จิตร์เมืองน่าน",
        email: "rodtang@gmail.com",
        password: await bcrypt.hash("123", 10),
        role: 3
    })
    newUser.save()
        .then((user) => {
            const athlete = new Athlete({
                nickname: "rodtang",
                weightClass: "Scrambled",
                height: 165.57,
                weight: 70.20,
                reach: 115.8,
                bday: "2002-07-05",
                country: "Thailand",
                user: user._id,
            })
            athlete.save()
                .then((result) => {
                    return res.send(result)
                })
                .catch((err) => {
                    console.error(err)
                })
        })
}
const fetchAthletesByNameJson = async (req, res) => {
    const searchNickname = req.params.nickname
    if (!searchNickname) {
        const athletes = await Athlete.find({ confirmed: true }).populate('user')
        return res.json(athletes)
    }
    Athlete.find({ nickname: { $regex: new RegExp(searchNickname, 'i') }, confirmed: true })
        .populate('user')
        .then(athletes => {
            return res.json(athletes)
        })
        .catch(error => {
            console.error('Error querying database:', error);
        });
}
const searchAthleteJson = async (req, res) => {
    const searchNickname = req.query.nickname
    if (!searchNickname) {
        const athletes = await Athlete.find({ confirmed: true, team: null }).populate('user')
        return res.json(athletes)
    }
    Athlete.find({ nickname: { $regex: new RegExp(searchNickname, 'i') }, confirmed: true, team: null })
        .populate('user')
        .then(athletes => {
            return res.json(athletes)
        })
        .catch(error => {
            console.error('Error querying database:', error);
        });
}

const addAthlete = async function (req, res, next) {
    const teams = await Team.find();
    res.render('athlete/athleteAdd.ejs', {
        teams
    });
}
const RegisterAthlete = async (req, res) => {
    try {
        const { nickname, weight, height, reach, bday, country, weightClass } = req.body;
        const userId = req.session.userId;
        let selectedTeamValue = req.body.team;
        let teamId = null;

        if (selectedTeamValue) {
            Team.findOne({ _id: selectedTeamValue })
                .then(async (team) => {
                    if (!team) {
                        console.error('Team not found');
                        return res.status(404).send('Team not found');
                    }
                    const athlete = new Athlete({
                        nickname,
                        weight,
                        height,
                        reach,
                        bday,
                        country,
                        weightClass,
                        user: userId,
                        team: team._id,
                        confirmed: false
                    });
                    await athlete.save()
                })
                .catch((err) => {
                    console.error(err);
                });
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { role: 2 },
                    { new: true }
                )
                req.session.role = updatedUser.role
                res.redirect('/');
        } else {
            const athlete = new Athlete({
                nickname,
                weight,
                height,
                reach,
                bday,
                country,
                weightClass,
                user: userId,
                confirmed: false
            });
            await athlete.save()

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { role: 2 },
                { new: true }
            )
            req.session.role = updatedUser.role
            res.redirect('/');
        }

    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    fetchAthletes,
    createAthlete,
    findAthlete,
    findAthleteJson,
    fetchAthletesJson,
    fetchAthletesByNameJson,
    addAthlete,
    searchAthleteJson,
    RegisterAthlete,
    athletePage
}
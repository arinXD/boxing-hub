const express = require("express")
const router = express.Router()
const User = require("../models/User")
const url = require('url');    

router.get("/", (req, res, next)=>{
    User.find()
    .then((result)=>{
        return res.json(result)
    })
    .catch((err)=>{
        console.error(err)
        return
    })
})
router.post('/add', (req, res)=>{
    const input = req.body
    const newUser = new User(input)
    newUser.save()
        .then((result)=>{
            
            return res.redirect("/")
        })
        .catch((err)=>{
            console.error(err)
            return res.redirect("/")
        })
})


module.exports = router
const express = require("express")
const router = express.Router()
const User = require("../models/User")

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

module.exports = router
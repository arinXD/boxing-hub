var express = require('express');
var router = express.Router();
const User = require("../models/User");

router.get("/", (req, res)=>{
    return res.render('admin/index')
})

module.exports = router;
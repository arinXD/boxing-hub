var express = require('express');
var router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res)=>{
    let name
    let role
    if(signedIn){
        await User.findById(signedIn).then((result)=>{
            console.log(result);
            name = `${result.fname} ${result.lname}`
            role = result.role
        })
    }
    res.render('admin/index', { name, role});
})

module.exports = router;
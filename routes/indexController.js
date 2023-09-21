var express = require('express');
var router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get('/', async (req, res, next)=>{
    let name = ""
    if(signedIn){
        await User.findById(signedIn).then((result)=>{
            console.log(result);
            name = `${result.fname} ${result.lname}`
        })
    }
    res.render('index', { name});
});


module.exports = router;
var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")

const User = require("../models/User");
const flash = require('connect-flash');

router.get('/', function (req, res, next) {
    res.render('signup', { 
        errs : req.flash("errorMesssage") 
    })
});

router.post('/', async (req, res)=>{
    const prefix = req.body.prefix
    const fname = req.body.fname
    const lname = req.body.lname
    const email = req.body.email
    const password = req.body.password
    const confirm = req.body.confirm

    if(password!=confirm){
        req.flash('errorMesssage',["Password doesn't match"])
        return res.redirect('signup')
    }

    const hashPass = await bcrypt.hash(password, 10)

    const newUser = new User({
        prefix,
        fname,
        lname,
        email,
        password:hashPass
    })
    newUser.save()
        .then((result)=>{
            res.redirect('/')
        })
        .catch((err)=>{
            if(err){
                const errorMesssage = Object.keys(err.errors).map(key=>err.errors[key].message)
                console.log(errorMesssage);
                req.flash('errorMesssage',errorMesssage)
                return res.redirect('signup')
            }
        })
})

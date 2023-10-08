const bcrypt = require("bcrypt")
const User = require("../models/User");

const signInPage = (req, res, next) => {
    const emailData = req.flash("email")[0]
    const errs = req.flash("errorMessage")
    req.flash("email",'')
    req.flash("errorMessage",'')
    let email = ""
    console.log(emailData)
    if (emailData) {
        email = emailData.email
    }
    return res.render('signin', {
        errs,
        email
    })
}
const signIn = async (req, res) => {
    const {email, password} = req.body
    console.log(email, password);
    if (!email || !password) {
        req.flash("errorMessage", "email and password is required")
        req.flash('email', {
            email
        })
        return res.redirect('/authen/signin')
    }
    await User.findOne({
        email: email.toLowerCase()
    }).then((result) => {
        if (result) {
            bcrypt.compare(password, result.password)
                .then((match) => {
                    if (match) {
                        req.session.userId = result._id
                        req.session.role = result.role
                        req.session.userName = result.username
                        req.session.userProfile = result.img
                        if(result.role==1){
                            return res.redirect('/admin')
                        }
                        return res.redirect('/')
                    } else {
                        req.flash("errorMessage", "Incorrect password")
                        req.flash('email', {
                            email
                        })
                        return res.redirect('/authen/signin')
                    }
                })
        } else {
            req.flash("errorMessage", "There is no account")
            req.flash('email', {
                email
            })
            return res.redirect('/authen/signin')
        }
    })
}

const signUpPage = (req, res, next) => {
    let data = req.flash('data')[0]
    const errs = req.flash("errorMesssage")
    req.flash("data",'')
    req.flash("errorMesssage",'')
    let fname = ""
    let lname = ""
    let email = ""
    console.log(data);
    if (data) {
        fname = data.fname
        lname = data.lname
        email = data.email
    }
    res.render('signup', {
        errs,
        fname,
        lname,
        email,
    })
}

const signUp = async (req, res) => {
    let errmes = []
    const username = req.body.username.toLowerCase()
    const fname = req.body.fname.toLowerCase()
    const lname = req.body.lname.toLowerCase()
    const email = (req.body.email).toLowerCase()
    const password = req.body.password
    const confirm = req.body.confirm
    const data = {
        username,
        fname,
        lname,
        email
    }

    if(!email) errmes.push("กรุณากรอกอีเมล")
    if(!fname || !lname) errmes.push("กรุณากรอกชื่อจริงและนามสกุล")
    if(!username) errmes.push("กรุณากรอกชื่อผู้ใช้")
    if (password.length<6) errmes.push("รหัสผ่านของคุณต้องมากกว่า 6 ตัวอักษร")
    if (password != confirm) errmes.push("รหัสผ่านของคุณไม่ตรงกัน")
    if(errmes.length>0){
        req.flash('errorMesssage', errmes)
        req.flash('data', data)
        return res.redirect('signup')
    }
    const hashPass = await bcrypt.hash(password, 10)
    const newUser = new User({

        username,
        fname,
        lname,
        email,
        password: hashPass
    })
    newUser.save()
        .then((result) => {
            req.session.userId = result._id
            req.session.role = result.role
            req.session.userName = result.username
            req.session.userProfile = result.img
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
            if (err.code == 11000) {
                errmes.push("อีเมลนี้ถูกใช้งานไปแล้ว")
            }
            // if (err.errors) {
            //     Object.keys(err.errors).map(key => errmes.push(err.errors[key].message))
            // }
            req.flash('errorMesssage', errmes)
            req.flash('data', data)
            return res.redirect('signup')
        })
}

module.exports = {
    signInPage,
    signIn,
    signUpPage,
    signUp,
}
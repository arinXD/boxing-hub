const bcrypt = require("bcrypt")
const User = require("../models/User");

const signInPage = (req, res, next) => {
    const emailData = req.flash("email")[0]
    let email = ""
    console.log(emailData)
    if (emailData) {
        email = emailData.email
    }
    return res.render('signin', {
        errs: req.flash("errorMessage"),
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
        email: email
    }).then((result) => {
        if (result) {
            bcrypt.compare(password, result.password)
                .then((match) => {
                    if (match) {
                        req.session.userId = result._id
                        req.session.role = result.role
                        req.session.userName = result.username
                        req.session.userProfile = result.img
                        res.redirect('/')
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
        errs: req.flash("errorMesssage"),
        fname,
        lname,
        email,
    })
}

const signUp = async (req, res) => {
    let errmes = []
    const username = req.body.username
    const fname = req.body.fname
    const lname = req.body.lname
    const email = (req.body.email).toLowerCase()
    const password = req.body.password
    const confirm = req.body.confirm
    const data = {
        username,
        fname,
        lname,
        email
    }

    if (password != confirm) {
        req.flash('errorMesssage', ["Password doesn't match"])
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
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
            if (err.code == 11000) {
                errmes.push("This email already exists")
            }
            if (err.errors) {
                Object.keys(err.errors).map(key => errmes.push(err.errors[key].message))
            }
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
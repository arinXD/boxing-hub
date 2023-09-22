const User = require("../models/User")

const profilePage= async (req, res)=>{
    await User.findById(signedIn)
    .then((user) => {
        return res.render('profile',{user})
    })
}

const profileSetting= async (req, res)=>{
    await User.findById(signedIn)
    .then((user) => {
        return res.render('updateProfile',{user})
    })
}

const uploadProfileImages = async (req,res)=>{
    User.findByIdAndUpdate(signedIn, { img: `${req.file.filename}` }, { upsert: true })
    .then(()=>{
        res.redirect("/profile")
    }).catch((err)=>{
        console.error(err)
    })
}

module.exports = {
    profilePage,
    uploadProfileImages,
    profileSetting
}
const User = require("../models/User")
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const profilePage= async (req, res)=>{
    const updateUser = req.flash('updateUser')
    req.flash('updateUser', '')
    await User.findById(signedIn)
    .then((user) => {
        return res.render('profile',{
            user, updateUser
        })
    })
}

const profileSetting= async (req, res)=>{
    await User.findById(signedIn)
    .then((user) => {
        return res.render('updateProfile',{user})
    })
}
const profileUpdate= async (req, res)=>{
    const data = req.body
    const username = data.username
    const fname = data.fname
    const lname = data.lname
    const tel = data.tel
    const province = data.province
    const amphoe = data.amphoe
    const tambon = data. tambon
    const address = data.address
    const job = data.job
    await User.findByIdAndUpdate(signedIn, {
        username,
        fname,
        lname,
        tel,
        province,
        amphoe,
        tambon,
        address,
        job
    }, { upsert: true })
    .then((result) => {
        req.flash('updateUser', true)
        res.redirect('/profile')
    }).catch(((err)=>{
        console.error(err)
    }))
}

const uploadProfileImages = async (req,res)=>{
    const filePath = path.join(__dirname, `../public/images/profile/${req.file.filename}`);
    const resizedFilePath = path.join(__dirname, `../public/images/profile/resized_${req.file.filename}`);
    await sharp(filePath)
        .resize(500, 500) // Set the desired resolution
        .jpeg({ quality: 50 })
        .toFile(resizedFilePath);
    fs.renameSync(resizedFilePath, filePath);
    await User.findByIdAndUpdate(signedIn, { img: `${req.file.filename}` }, { upsert: true })
    .then((result)=>{
        req.session.userProfile = req.file.filename
        res.redirect("/profile")
    }).catch((err)=>{
        console.error(err)
    })
}
const resetPasswordPage = (req, res)=>{
    return res.render('reset_password')
}
const resetPassword = (req, res)=>{
    const password = req.body.password
    const newpassword = req.body.newpassword
    const confirm = req.body.confirm
}
module.exports = {
    profilePage,
    uploadProfileImages,
    profileSetting,
    profileUpdate,
    resetPassword,
    resetPasswordPage,
}
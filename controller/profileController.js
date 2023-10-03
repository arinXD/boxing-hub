const User = require("../models/User")
const fetch = require("node-fetch");
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

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
        res.redirect('/profile/setting')
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

module.exports = {
    profilePage,
    uploadProfileImages,
    profileSetting,
    profileUpdate
}
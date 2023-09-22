const User = require("../models/User")
const fetch = require("node-fetch");

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
    console.log("update data: ")
    console.log(data)
    const username = data.username
    const fname = data.fname
    const lname = data.lname
    const tel = data.tel
    const province = data.province
    const amphoe = data.amphoe
    const tambon = data. tambon
    const address = data.address
    await User.findByIdAndUpdate(signedIn, {
        username,
        fname,
        lname,
        tel,
        province,
        amphoe,
        tambon,
        address,
    }, { upsert: true })
    .then((result) => {
        // return res.send(result)
        return res.redirect('/profile/setting')
    }).catch(((err)=>{
        console.error(err)
    }))
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
    profileSetting,
    profileUpdate
}
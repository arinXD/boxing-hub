const User = require("../models/User")
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const bcrypt = require("bcrypt")

const profilePage = async (req, res) => {
    const updateUser = req.flash('updateUser')
    req.flash('updateUser', '')
    await User.findById(signedIn)
        .then((user) => {
            return res.render('profile', {
                user,
                updateUser
            })
        })
}

const profileSetting = async (req, res) => {
    await User.findById(signedIn)
        .then((user) => {
            return res.render('updateProfile', {
                user
            })
        })
}
const profileUpdate = async (req, res) => {
    const data = req.body
    const username = data.username
    const fname = data.fname
    const lname = data.lname
    const tel = data.tel
    const province = data.province
    const amphoe = data.amphoe
    const tambon = data.tambon
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
        }, {
            upsert: true
        })
        .then((result) => {
            req.flash('updateUser', true)
            res.redirect('/profile')
        }).catch(((err) => {
            console.error(err)
        }))
}

const uploadProfileImages = async (req,res)=>{
    const filePath = await path.join(__dirname, `../public/images/profile/${req.file.filename}`);
    const resizedFilePath = await path.join(__dirname, `../public/images/profile/resized_${req.file.filename}`);
    await sharp(filePath)
        .resize(500, 500)
        .jpeg({ quality: 50 })
        .toFile(resizedFilePath)
    try{
        await fs.promises.rename(resizedFilePath, filePath);
    }catch(err){
        console.error(err);
    }
    await User.findByIdAndUpdate(signedIn, { img: `${req.file.filename}` }, { upsert: true })
    .then((result)=>{
        req.session.userProfile = req.file.filename
        res.redirect("/profile")
    }).catch((err)=>{
        console.error(err)
    })
}

const resetPasswordPage = (req, res) => {
    let status = "";
    let message = "";

    const mesawdaw = req.flash("passwordReset");
    if (mesawdaw.length > 0) {
        console.log(mesawdaw);
        status = mesawdaw[0].status? "yes" : 'no';
        message = mesawdaw[0].mes || "";
        console.log({status, message})
    }

    req.flash("passwordReset", "");
    return res.render('reset_password', {
        status,
        message
    });
};
const resetPassword = async (req, res) => {
    try {
        const {
            password,
            new_password,
            confirm_password
        } = req.body;

        if (new_password !== confirm_password) {
            req.flash('passwordReset', {
                status:false,
                mes:'รหัสผ่านไม่ตรงกัน'
            });
            return res.redirect('/profile/reset_password');
        }
        if (new_password < 6) {
            req.flash('passwordReset', {
                status:false,
                mes:'รหัสผ่านของคุณต้องมากกว่า 6 ตัวอักษร'
            });
            return res.redirect('/profile/reset_password');
        }
        if (new_password==password) {
            req.flash('passwordReset', {
                status:false,
                mes:'รหัสผ่านของคุณต้องไม่ซ้ำกับรหัสเดิม'
            });
            return res.redirect('/profile/reset_password');
        }

        const user = await User.findOne({
            _id: signedIn
        });

        if (!user) {
            req.flash('passwordReset', {
                status:false,
                mes:'User not found'
            });
            return res.redirect('/profile/reset_password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            user.password = await bcrypt.hash(new_password, 10);
            await user.save();
            req.flash('passwordReset', {
                status:true,
                mes:'เปลี่ยนรหัสผ่านเรียบร้อย'
            });
            return res.redirect('/profile/reset_password');
        } else {
            req.flash('passwordReset', {
                status:false,
                mes:'รหัสผ่านเดิมไม่ถูกต้อง'
            });
            return res.redirect('/profile/reset_password');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.redirect('/profile/reset_password');
    }
};
module.exports = {
    profilePage,
    uploadProfileImages,
    profileSetting,
    profileUpdate,
    resetPassword,
    resetPasswordPage,
}
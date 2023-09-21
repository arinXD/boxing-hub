const User = require("../models/User");
const admin = async (req, res, next) => {
    if (signedIn) {
        await User.findById(signedIn)
        .then((result) => {
            const role = result.role
            if(role==1){
                next()
            }else{
                return res.redirect("/")
            }
        })
    }else{
        return res.redirect("/")
    }
    // next()
}

module.exports = admin
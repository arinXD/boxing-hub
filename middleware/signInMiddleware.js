const signedIn = (req, res, next)=>{
    if(req.session.userId){
        return res.redirect('/')
    }
    next()
}
const insignIn = (req, res, next)=>{
    if(!req.session.userId){
        return res.redirect('/authen/signin')
    }
    next()
}

module.exports = {
    signedIn,
    insignIn
}
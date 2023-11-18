var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require("express-session")
const cors = require("cors");

// Router
const indexRouter = require('./routes/indexRouter');
const authenRouter = require('./routes/authenRouter');
const adminRouter = require('./routes/adminRouter');
const athleteRouter = require('./routes/athleteRouterOat');
const profileRouter = require('./routes/profileRouter');
const teamRouter = require('./routes/TeamRouterTae');
const eventRouter = require('./routes/eventRouter');
const eventRouterUser = require('./routes/eventRouterUser');
const matchRouter = require('./routes/matchRouter');

// Middleware
const signInMiddleware = require("./middleware/signInMiddleware")
const adminMiddleware = require("./middleware/adminMiddleware")

var app = express();

// view engine setup
app.use(cors({
    credentials : true,
    origin:['http://localhost:8000','http://localhost:3000']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'tko',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());


const uri = "mongodb+srv://arin:1111@cluster0.hbaluot.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(8000)
        console.log("connect to mongo compass");
    })
    .catch((err) => {
        console.error(err)
    })

global.signedIn = null
global.userRole = null
global.userName = null
global.userProfile = null

app.use("*", (req, res, next) => {
    signedIn = req.session.userId
    userRole = req.session.role
    userName = req.session.userName
    userProfile = req.session.userProfile
    next()
})

app.use('/', indexRouter);

// dev rout -- uncomment under middleware
app.use('/admin', adminRouter); // <-- uncomment me

// demo route
// app.use('/admin', adminMiddleware, adminRouter);

app.use('/authen', signInMiddleware.signedIn, authenRouter);
app.use('/athletes', athleteRouter);
app.use('/team', teamRouter);
app.use('/profile', signInMiddleware.insignIn, profileRouter)
app.use('/event', adminMiddleware, eventRouter)
app.use('/events', eventRouterUser)
app.use('/match', matchRouter)


app.get("/signout", (req, res, next) => {
    req.session.destroy(() => {
        return res.redirect('/')
    })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
    return res.status(404).render("404")
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
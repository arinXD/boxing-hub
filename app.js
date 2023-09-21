var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require("express-session")
const fetch = require("node-fetch");
const fs = require('fs');

// Router
const indexRouter = require('./routes/indexRouter');
const authenRouter = require('./routes/authenRouter');
const adminRouter = require('./routes/adminRouter');
const athleteRouter = require('./routes/athleteRouter');
const profileRouter = require('./routes/profileRouter');

// Middleware
const signInMiddleware = require("./middleware/signInMiddleware")
const adminMiddleware = require("./middleware/adminMiddleware")

var app = express();

// view engine setup
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
    secret: 'tko_project',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());


const url = "mongodb://127.0.0.1:27017/tko";

mongoose.connect(url)
    .then(() => {
        app.listen(4000)
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

app.use('/admin', adminMiddleware, adminRouter);

app.use('/authen', signInMiddleware.signedIn, authenRouter);
app.use('/athletes', athleteRouter);

app.get("/fetch/api", async (req, res) => {

    const url = 'https://api.sportsdata.io/v3/mma/scores/json/Schedule/UFC/2023?key=b3ccef7241c64316a5449c90efb8c1b9';

    fetch(url)
        .then((res) => res.json())
        .then((athletesJson) => {
            const JSONObject = JSON.parse(JSON.stringify(athletesJson))
            fs.writeFile('./UFCdata/ufcEvents.json', JSON.stringify(JSONObject), (error) => {
                if (error) throw error;
            });
            return res.send("Fetch done!\nJSON file created successfully: Event.csv")

        }).catch((err) => {
            return res.send(err)
        })
})

app.get("/signout", (req, res, next) => {
    req.session.destroy(() => {
        return res.redirect('/')
    })
})


app.get("/fetch/api", async (req, res) => {

    const url = 'https://api.sportsdata.io/v3/mma/scores/json/Schedule/UFC/2023?key=b3ccef7241c64316a5449c90efb8c1b9';

    fetch(url)
        .then((res) => res.json())
        .then((athletesJson) => {
            const JSONObject = JSON.parse(JSON.stringify(athletesJson))
            fs.writeFile('./UFCdata/ufcEvents.json', JSON.stringify(JSONObject), (error) => {
                if (error) throw error;
            });
            return res.send("Fetch done!\nJSON file created successfully: Event.csv")

        }).catch((err) => {
            return res.send(err)
        })
})


// catch 404 and forward to error handler
app.use((req, res, next) => {
    return res.render("404")
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
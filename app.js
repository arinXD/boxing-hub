var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require("express-session")

// Router
var indexController = require('./routes/indexController');
var authenRouter = require('./routes/authenRouter');

// Middleware
const signInMiddleware = require("./middleware/signInMiddleware")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
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
        app.listen(3000)
        console.log("connect to mongo compass");
    })
    .catch((err) => {
        console.error(err)
    })


global.signedIn = null

app.use("*", (req, res, next) => {
    signedIn = req.session.userId
    next()
})

app.use('/', indexController);

app.use('/authen', signInMiddleware, authenRouter);

app.get("/signout", (req, res, next)=>{
    req.session.destroy(()=>{
        return res.redirect('/')
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
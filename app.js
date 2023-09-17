var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const User = require('./models/User')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');

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
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000)
const url = "mongodb://127.0.0.1:27017/tko";

// mongoose.connect(url)
//     .then(() => {
//         console.log("connect to mongo compass");
        
//     })
//     .catch((err) => {
//         console.error(err)
//     })

app.use('/', indexRouter);
app.get('/addusers', (req, res)=>{
    const newUser = new User({
        prefix:"Mr.",
        fname:"Arinchawut",
        lname:"Kanlayanam",
        email:"rakuzanoat@gmail.com",
        password:"1234",
        tel:"0898434477",
        img:"./awdawdaw/",
    })
    newUser.save()
        .then((result)=>{
            return res.send(result)
        })
        .catch((err)=>{
            console.error(err)
        })
})
// app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
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
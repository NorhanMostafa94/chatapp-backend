var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var createError = require('http-errors')

require('./db');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messageRouter = require('./routes/message');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/message', messageRouter);

// app.use('/users', usersRouter);

//not found middleware
app.use((req,res,next)=>{
    next(createError(404));
})

//error handler
app.use((err,req,res,next)=>{
    console.error(err)
    res.status(err.status||500);
    res.send(err)
})

module.exports = app;

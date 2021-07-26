const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

// importing routes here
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const meetingsRouter = require('./routes/meetings');
const userAvailabilitiesRouter = require('./routes/user_availabilites');
const userSubjectsRouter = require('./routes/user_subjects');



const app = express();

const env = require('dotenv').config();

env.password

app.use(cors());

//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6k9c9.mongodb.net/${process.env.DB_ENDPOINT}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// setting our route base paths here
// app.use('/meetings', meetingsRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);
app.use('/meetings', meetingsRouter);
app.use('/availabilites', userAvailabilitiesRouter);
app.use('/subjects', userSubjectsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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

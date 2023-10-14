var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const cors = require("cors");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

require("dotenv").config();

const passportSetup = require('./utils/passStrategies');
const authRouter = require("./routes/authRouter");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const allowedOrigins = [
  "https://98.246.0.185",
  "https://yasharalee.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: "content-type",
  })
);

const sesClient = new SESClient({ region: 'us-east-2' });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/test", (req, res) => {
  try {
    console.log("Body:", req.body);
    res.send({ "hit": true });
  } catch (err) {
    console.log('Err', err);
  }
});

app.get("/auth-cancelled", (req, res) => {
  try {
    console.log("Body:", req.body);
    res.send({ "hit": true });
  } catch (err) {
    console.log('Err', err);
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);


app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

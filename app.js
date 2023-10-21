var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const cors = require("cors");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const RequestIp = require("./models/RequesterIPSchema");

const PostContact = require("./routes/PostContactRoutes");

require("dotenv").config();

const passportSetup = require('./utils/passStrategies');
const authRouter = require("./routes/authRouter");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const sesClient = new SESClient({ region: 'us-east-2' });


const allowedOrigins = [
  "https://98.246.0.185",
  "https://yasharalee.com",
  "https://yasalee-qa.com",
  "https://localhost:3000"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: "content-type",
  })
);



app.use((req, res, next) => {
  
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const visitCount = RequestIp.findOne({ IpAddress: clientIp }, select(Count));
  let ipCounts = { clientIp: visitCount || 0 };
  
  if (ipCounts[clientIp]) {
    ipCounts[clientIp]++;
  } else {
    ipCounts[clientIp] = 1;
  }
  try{
    const Requester = new RequestIp({ IpAddress: clientIp, Count: clientIp });
    Requester.save()

  }catch(err){
    console.error(err);
  }


  next();
});


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

app.get('/set-cookie:token', (req, res) => {
  const tokenFromPathParam = req.params.token;
  jwtCookie.setHttpOnlyCookie(res, "access-token", tokenFromPathParam, new Date(Date.now() + 1 * 60 * 60 * 1000), "/")
  res.send(`
        <html>
        <head>
            <script>
                setTimeout(() => {
                    window.location.href = 'https://yasalee-qa.com/contact';
                }, 2000);
            </script>
        </head>
        <body>
            Redirecting you...
        </body>
        </html>
    `);
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
app.use('/PostContact', PostContact);


app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  const title = 'Error Page';
  res.render('error', {title});
});

module.exports = app;

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/authRoute");
var indexRouter = require("./routes/index");
var postRouter = require("./routes/blogPostRoute");
var profileRoute = require("./routes/profileRoute");



var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const origins = [
  "https://98.246.0.185",
  "https://localhost:3000",
  "https://selinaystore.com",
];

app.use(
  cors({
    origin : "*",
    credentials: true, 
  })
);

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/profile", profileRoute);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

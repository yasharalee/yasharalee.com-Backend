var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const passportSetup = require("./utils/passStrategies");
const passport = require("passport");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const RequestIp = require("./models/RequesterIPSchema");

const ContactRoute = require("./routes/ContactRoutes");
const authRouter = require("./routes/authRouter");
const UserRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRoute");
const reCaptchaRouter = require("./endpoints/reCaptchaEndpoint");
var indexRouter = require("./routes/index");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerDef");
const { basicAuthorizer } = require("./middlewares/Authorize");

var app = express();

app.set("trust proxy", true);

const sesClient = new SESClient({ region: "us-east-2" });

const allowedOrigins = [process.env.UI_Env, process.env.SWAGGER_CORS_ENV];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "getUser",
      "Allow-Credentials",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(
  "/swagger",
  basicAuthorizer,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(async (req, res, next) => {
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    let visitCount = await RequestIp.findOne({ IpAddress: clientIp }).select(
      "Count"
    );

    if (visitCount) {
      visitCount.Count++;
      await visitCount.save();
    } else {
      visitCount = new RequestIp({ IpAddress: clientIp, Count: 1 });
      await visitCount.save();
    }
    console.log("Request from IP: ", clientIp);
  } catch (err) {
    console.error(err);
  }

  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/auth-cancelled", (req, res) => {
  try {
    res.send({ hit: true });
  } catch (err) {
    console.log("Err", err);
  }
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/Messages", ContactRoute);
app.use("/client", UserRouter);
app.use("/posts", postRouter);
app.use("/captcha", reCaptchaRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  const title = "Error Page";
  res.render("error", { title });
});

module.exports = app;

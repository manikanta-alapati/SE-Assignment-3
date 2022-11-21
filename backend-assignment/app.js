var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { MongoClient } = require("mongodb");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const DB_NAME = "se-assignment";
const USER_COLLECTION = "users";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const mongoClient = new MongoClient("mongodb://mongo:27017/");
    await mongoClient.connect();
    console.log("mongo");
    const db = await mongoClient.db(DB_NAME);
    res.mongoClient = mongoClient;
    res.db = db;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Mongodb connection failed." });
  } finally {
    // await res.mongoClient.close();
  }
});

// app.use("/", indexRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.post("/add", (req, res) => {
  try {
    const { firstInput, secondInput } = req.body;
    return res.json({ answer: Number(firstInput) + Number(secondInput) });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid inputs." });
  }
});
app.use("/users", async (req, res, next) => {
  try {
    const users = await res.db.collection("users");
    res.users = users;
    next();
  } catch (err) {
    res.status(500).send({ message: "Failed to get users collection." });
  }
});
app.use("/users", usersRouter);

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

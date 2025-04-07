var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// mongoose
const mongoose = require("mongoose");
require("./models/userModel");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var categoryRouter = require("./routes/category");
var productRouter = require("./routes/product");
var cartRouter = require("./routes/cart");
var manageBank = require("./routes/manageBank");
var order = require("./routes/order");
var notification = require("./routes/notification");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// dotenv
require("dotenv").config();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET_KEY;

console.log(`Server đang chạy tại cổng: ${port}`);
console.log(`Khóa bí mật JWT: ${jwtSecret}`);

mongoose
  .connect("mongodb://localhost:27017/App_ASM")
  //mongodb://localhost:27017/
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/manageBank", manageBank);
app.use("/order", order);
app.use("/notification", notification);

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

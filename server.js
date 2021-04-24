// load NPM modules
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const port = process.env.PORT || 3000;

// load environment .env variables
require("dotenv").config();
// connect to MongoDB and OAuth passport
require("./config/database");
require("./config/passport");

// load custom modules like router modules
const indexRoutes = require("./routes/index");
const recipeRoutes = require("./routes/recipes");

// initialize express app
const app = express();

// configure view engine settings
app.set("view engine", "ejs");

// mount app middleware
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());

// mount sessions middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
// mounting passport middleware
app.use(passport.initialize());
app.use(passport.session());

// mount route handlers
app.use("/", indexRoutes);
app.use("/", recipeRoutes);

// tell app to listen on port 3000
app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
});

// load NPM modules
const express = require("express");
const morgan = require("morgan");
const port = process.env.PORT || 3000;

// connect to MongoDB
require("./config/database");
// load .env variables
require("dotenv").config();

// load custom modules like router modules
const indexRoutes = require("./routes/index");
const contestRoutes = require("./routes/contests");
const recipeRoutes = require("./routes/recipes");
const accountRoutes = require("./routes/accounts");

// initialize express app
const app = express();

// configure app settings
app.set("view engine", "ejs");

// mount app middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// mount route handlers
app.use("/", indexRoutes);
app.use("/", contestRoutes);
app.use("/", recipeRoutes);
app.use("/", accountRoutes);

// tell app to listen on port 3000
app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
});

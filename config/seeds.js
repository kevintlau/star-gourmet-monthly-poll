// seed file to generate new contests

const ingredients = {
  Meat: ["Beef", "Chicken", "Eggs", "Fish", "Pork"],
  Seasoning: [
    "Herbs", "Garlic", "Oil", "Peppercorn", 
    "Salt", "Sugar", "Vinegar"
  ],
  Vegetables: [
    "Broccoli", "Chili Pepper", "Carrot", "Celery", 
    "Lettuce", "Onion", "Pumpkin", "Tomato"
  ],
  Fruits: ["Apple", "Banana", "Berries", "Lemon", "Orange", "Peach"],
  Cereals: ["Beans", "Bread", "Corn", "Flour", "Pasta", "Potato", "Rice"],
  Dairy: ["Butter", "Cheese", "Milk", "Yogurt"],
};

const aprilContest = {
  name: "April 2021",
  theme: "American",
  startDate: "2021-04-01T00:00:00Z",
  endDate: "2021-04-30T23:59:59Z",
  recipes: [],
  ingredients: ingredients,
};

const mayContest = {
  name: "May 2021",
  theme: "American",
  startDate: "2021-05-01T00:00:00Z",
  endDate: "2021-05-31T23:59:59Z",
  recipes: [],
  ingredients: ingredients,
};

const mongoose = require("mongoose");
require("dotenv").config();

const connectionURI = process.env.DATABASE_URI;

mongoose.connect(connectionURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
// database connection event
db.on("connected", function () {
  console.log(`Mongoose connected at ${db.host}:${db.port}`);
});

const Contest = require("../models/contest");

Contest.create(mayContest, (err, contest) => {
  console.log("created contest: ", contest);
});
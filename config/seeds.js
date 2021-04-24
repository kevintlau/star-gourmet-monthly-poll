const ingredients = [
    { name: "Fish", type: "meat" },
    { name: "Beef", type: "meat" },
    { name: "Pork", type: "meat" },
    { name: "Chicken", type: "meat" },
    { name: "Herbs", type: "seasoning" },
    { name: "Garlic", type: "seasoning" },
    { name: "Peppercorn", type: "seasoning" },
    { name: "Sugar", type: "seasoning" },
    { name: "Broccoli", type: "vegetable" },
    { name: "Carrot", type: "vegetable" },
    { name: "Onion", type: "vegetable" },
    { name: "Celery", type: "vegetable" },
    { name: "Tomato", type: "vegetable" },
    { name: "Apple", type: "fruit" },
    { name: "Orange", type: "fruit" },
    { name: "Peach", type: "fruit" },
    { name: "Berries", type: "fruit" },
    { name: "Potato", type: "cereal" },
    { name: "Corn", type: "cereal" },
    { name: "Flour", type: "cereal" },
    { name: "Beans", type: "cereal" },
    { name: "Rice", type: "cereal" },
    { name: "Milk", type: "dairy" },
    { name: "Cheese", type: "dairy" },
    { name: "Butter", type: "dairy" },
    { name: "Yogurt", type: "dairy" },
];

const currentContest = {
    name: "April 2021",
    theme: "American",
    startDate: "2021-04-01T00:00:00Z",
    endDate: "2021-04-30T23:59:59Z",
    recipes: [],
    ingredients: [],
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

const Ingredient = require("../models/ingredient");
const Contest = require("../models/contest");

Ingredient.insertMany(ingredients, (err, ingredientDocs) => {
    ingredientDocs.forEach(ingDoc => {
        currentContest.ingredients.push(ingDoc._id);
    });
    console.log("currentContest: ", currentContest);
    Contest.create(currentContest, (err, contest) => {
        console.log("created contest: ", contest);
    });
});

// Ingredient.insertMany(ingredients, (err, ingredientDocs) => {
//   Contest.create(currentContest, (err, contest) => {
//     console.log("created contest: ", contest);
//     ingredientDocs.forEach((ingDoc) => {
//       contest.ingredients.push(ingDoc._id);
//       contest.save((err) => {});
//     });
//   });

//   console.log("currentContest: ", currentContest);
// });
const Recipe = require("../models/recipe");
const Account = require("../models/account");
const Contest = require("../models/contest");

const index = (req, res) => {
  res.render("recipes/index", {
    title: "My Recipes",
    header: "My Recipes",
    recipes: req.user.recipes,
  });
};

const newRecipe = (req, res) => {
  let now = new Date();
  let nowISO = now.toISOString();
  Contest.findOne(
    // search criteria: contest starts before now and ends after now
    {
      startDate: { $gte: ISODate(nowISO) },
      endDate: { $lt: ISODate(nowISO) },
    },
    // callback: render the new page with the theme populated
    (err, currentContest) => {
      res.render("recipes/new", {
        title: "New Recipe Submission",
        header: "Submit a Recipe for the Current Contest",
        theme: currentContest.theme,
        ingredients: currentContest.ingredients,
      });
    }
  );
};

const show = (req, res) => {

}

const create = (req, res) => {

}

const update = (req, res) => {

}

const deleteRecipe = (req, res) => {

}

module.exports = {
  index,
  new: newRecipe,
  show,
  create,
  update,
  delete: deleteRecipe,
};

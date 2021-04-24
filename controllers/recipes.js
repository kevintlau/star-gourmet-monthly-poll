const Recipe = require("../models/recipe");
const Account = require("../models/account");
const Contest = require("../models/contest");

const index = (req, res) => {
  Recipe.find({ _id: req.user.recipes }, (err, recipes) => {
    res.render("recipes/index", {
      title: "My Recipes",
      header: "My Recipes",
      user: req.user,
      recipes,
    });
  });
};

const newRecipe = (req, res) => {
  res.render("recipes/new", {
    title: "New Recipe Submission",
    header: "Submit a Recipe for the Current Contest",
    user: req.user,
  });
  //    let now = new Date();
  //    let nowISO = now.toISOString();
  //   Contest.findOne(
  //     // search criteria: contest starts before now and ends after now
  //     {
  //       startDate: { $gte: ISODate(nowISO) },
  //       endDate: { $lt: ISODate(nowISO) },
  //     },
  //     // callback: render the new page with the theme populated
  //     (err, currentContest) => {
  //       res.render("recipes/new", {
  //         title: "New Recipe Submission",
  //         header: "Submit a Recipe for the Current Contest",
  //         user: req.user,
  //         theme: currentContest.theme,
  //         ingredients: currentContest.ingredients,
  //       });
  //     }
  //   );
};

const show = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    res.render("recipes/edit", {
      title: "Recipe Details",
      header: "Recipe Details",
      user: req.user,
      recipe,
    });
  });
};

const create = (req, res) => {
  req.body.creator = req.user._id;
  req.body.accountsVoted = [req.user._id];
  req.body.score = 1;
  Recipe.create(req.body, (err, recipe) => {
    if (err) return res.redirect("recipes/new");
    req.user.recipes.push(recipe._id);
    req.user.votes.push(recipe._id);
    req.user.save((err) => {
      if (err) return res.redirect("recipes/new");
      res.redirect("/recipes");
    });
  });
};

const update = (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    cuisine: req.body.cuisine,
    type: req.body.type,
    ingredients: req.body.ingredients,
  }, err => {
    res.redirect("/recipes");
  });
};

const deleteRecipe = (req, res) => {
  Recipe.findByIdAndDelete(req.params.id, (err) => {
    req.user.recipes.pull(req.params.id);
    req.user.save(err => {
      res.redirect("/recipes");
    });
  });
};

module.exports = {
  index,
  new: newRecipe,
  show,
  create,
  update,
  delete: deleteRecipe,
};

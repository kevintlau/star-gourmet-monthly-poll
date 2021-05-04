const Recipe = require("../models/recipe");
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
  // find the current contest based on current date/time
  let now = new Date();
  let nowISO = now.toISOString();
  Contest.findOne(
    // search criteria: contest starts before now and ends after now
    {
      startDate: { $lt: nowISO },
      endDate: { $gte: nowISO },
    },
    // callback: render the "new" page with current contest populated
    (err, currContest) => {
      res.render("recipes/new", {
        title: "New Recipe Submission",
        header: `Submit a Recipe: ${currContest.name}`,
        user: req.user,
        contestId: currContest._id,
        contestName: currContest.name,
        theme: currContest.theme,
        // each contest has a list of ingredients, so we need to pass those in
        ingredients: currContest.ingredients,
      });
    }
  );
};

// show and edit functions are on the same page
const show = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    Contest.findById(recipe.contest, (err, contest) => {
      res.render("recipes/edit", {
        title: "Recipe Details",
        header: "Recipe Details",
        user: req.user,
        recipe,
        ingredients: contest.ingredients,
      });
    });
  });
};

const create = (req, res) => {
  // link creator to recipe, and creator automatically votes for recipe
  req.body.creator = req.user._id;
  req.body.accountsVoted = [req.user._id];
  req.body.score = 1;
  // clean up ingredients in new recipe and put into single array
  const ingArr = ["ing1", "ing2", "ing3", "ing4"];
  req.body.ingredients = [];
  ingArr.forEach(ingIndex => {
    if (req.body[ingIndex]) req.body.ingredients.push(req.body[ingIndex]);
    delete req.body[ingIndex];
  });
  // now create the recipe with the name, contestId, theme, type, and ingreds
  Recipe.create(req.body, (err, recipe) => {
    if (err) return res.redirect("recipes/new");
    // after recipe is created: add recipe to user's submission and votes list
    req.user.recipes.push(recipe._id);
    req.user.votes.push(recipe._id);
    req.user.save((err) => {
      if (err) return res.redirect("recipes/new");
      res.redirect("/recipes");
    });
  });
};

const update = (req, res) => {
  // clean up ingredients in new recipe and put into single array
  console.log(req.body);
  const ingArr = ["ing1", "ing2", "ing3", "ing4"];
  const ingredients = [];
  ingArr.forEach(ingIndex => {
    if (req.body[ingIndex]) ingredients.push(req.body[ingIndex]);
  });
  // update the recipe with the fields in the edit form
  Recipe.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      cuisine: req.body.cuisine,
      type: req.body.type,
      image: req.body.image,
      ingredients,
    },
    (err) => {
      res.redirect("/recipes");
    }
  );
};

const deleteRecipe = (req, res) => {
  Recipe.findByIdAndDelete(req.params.id, (err) => {
    // after deleting recipe from DB, delete recipe from user's submissions
    req.user.recipes.pull(req.params.id);
    // TODO: delete recipe from vote list of everyone who voted for the recipe
    req.user.save((err) => {
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

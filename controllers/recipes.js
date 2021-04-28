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
  let now = new Date();
  let nowISO = now.toISOString();
  Contest.findOne(
    // search criteria: contest starts before now and ends after now
    {
      startDate: { $lt: nowISO },
      endDate: { $gte: nowISO },
    },
    // callback: render the new page with the theme populated
    (err, currContest) => {
      console.log(currContest.ingredients);
      res.render("recipes/new", {
        title: "New Recipe Submission",
        header: `Submit a Recipe - ${currContest.name}: ${currContest.theme}`,
        user: req.user,
        contestId: currContest._id,
        contestName: currContest.name,
        theme: currContest.theme,
        ingredients: currContest.ingredients,
      });
    }
  );
};

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
    })
  });
};

const create = (req, res) => {
  // link creator to recipe, and creator automatically votes for recipe
  req.body.creator = req.user._id;
  req.body.accountsVoted = [req.user._id];
  req.body.score = 1;
  // clean up ingredients in new recipe and put into single array
  let ingArr = ["ing1", "ing2", "ing3", "ing4"];
  req.body.ingredients = [];
  ingArr.forEach(ingIndex => {
    if (req.body[ingIndex]) req.body.ingredients.push(req.body[ingIndex]);
    delete req.body[ingIndex];
  });
  // now create the recipe with the name, contestId, theme, type, and ingreds
  Recipe.create(req.body, (err, recipe) => {
    if (err) return res.redirect("recipes/new");
    // link recipe to the creator and count the vote in the creator's votes list
    req.user.recipes.push(recipe._id);
    req.user.votes.push(recipe._id);
    req.user.save((err) => {
      if (err) return res.redirect("recipes/new");
      res.redirect("/recipes");
    });
  });
};

const update = (req, res) => {
  Recipe.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      cuisine: req.body.cuisine,
      type: req.body.type,
      ingredients: req.body.ingredients,
    },
    (err) => {
      res.redirect("/recipes");
    }
  );
};

const deleteRecipe = (req, res) => {
  Recipe.findByIdAndDelete(req.params.id, (err) => {
    req.user.recipes.pull(req.params.id);
    req.user.save((err) => {
      res.redirect("/recipes");
    });
  });
};

const list = (req, res) => {
  Recipe.find({}, (err, recipes) => {
    return res.json(recipes);
  });
}

module.exports = {
  index,
  new: newRecipe,
  show,
  create,
  update,
  delete: deleteRecipe,
  list,
};

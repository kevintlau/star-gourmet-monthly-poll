const Recipe = require("../../models/recipe");
const Account = require("../../models/account");

// retrieve recipes from database to show on front-end contest page
// uses an async function to get the recipes
const index = async (req, res) => {
  // initialize results array
  const results = [];
  // query the database for all recipes
  const recipes = await Recipe.find({});
  // for each recipe...
  for (let i = 0; i < recipes.length; i++) {
    // query the database to get the creator's name for the recipe
    const creator = await Account.findById(recipes[i].creator);
    // once the server responds, save the name as a variable
    let submitter = creator.name;
    // push the following as an object to the results array
    results.push({
      // the deconstructed key-value pairs in the recipe object
      ...recipes[i]._doc,
      // we deconstruct because we need to add a submitter attribute
      submitter,
      // we also want to tell front-end whether user can vote on the recipe
      // user can vote if: user is logged in and hasn't voted for it already
      votable: req.user && !recipes[i].accountsVoted.includes(req.user._id),
    });
  }
  // after all the reconstructed recipes are loaded, send the array as a JSON
  res.json(results);
};

// handle user voting
const vote = (req, res) => {
  // query the database for the recipe id passed from route
  Recipe.findById(req.params.id, (err, recipe) => {
    // if the user hasn't voted on the recipe yet...
    if (!recipe.accountsVoted.includes(req.user._id)) {
      // increment the recipe's score and add the user to the voted list
      recipe.score++;
      recipe.accountsVoted.push(req.user);
      recipe.save((err) => {
        // after recipe is saved in database, query the user who voted
        Account.findById(req.user._id, (err, user) => {
          // add the recipe to the user's vote record list
          user.votes.push(recipe._id);
          user.save((err) => console.log(err));
        });
      });
    }
  });
};

module.exports = {
  index,
  vote,
};

const Recipe = require("../../models/recipe");
const Account = require("../../models/account");

const index = async (req, res) => {
  const results = [];
  const recipes = await Recipe.find({});

  for (let i = 0; i < recipes.length; i++) {
    const creator = await Account.findById(recipes[i].creator);
    let submitter = creator.name;



    results.push({ 
      ...recipes[i]._doc, 
      submitter, 
      votable: req.user && !recipes[i].accountsVoted.includes(req.user._id),
    });
  }

  res.json(results);
};

const show = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    res.json(recipe);
  });
};

const vote = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (!recipe.accountsVoted.includes(req.user._id)) {
      recipe.score++;
      recipe.accountsVoted.push(req.user);
      recipe.save((err) => {
        Account.findById(req.user._id, (err, user) => {
          user.votes.push(recipe._id);
          user.save((err) => console.log(err));
        });
      });
    }
  });
};

module.exports = {
  index,
  show,
  vote,
};

const Recipe = require("../../models/recipe");

const index = (req, res) => {
  Recipe.find({}, (err, recipes) => {
    res.status(200).json(recipes);
  });
};

const show = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    res.status(200).json(recipe);
  });
};

module.exports = {
  index,
  show,
};

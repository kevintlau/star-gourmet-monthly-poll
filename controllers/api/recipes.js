const Recipe = require("../../models/recipe");
const Account = require("../../models/account");

const index = async(req, res) => {
  const results = []; 
  const recipes = await Recipe.find({});

  for (let i = 0; i < recipes.length; i++) {
    
    const creator = await Account.findById(recipes[i].creator);
    let submitter = creator.name;

    results.push({...recipes[i]._doc, submitter});
  };
  
  res.status(200).json(results);
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

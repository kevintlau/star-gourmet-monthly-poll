const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    name: String,
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    contestName: String,
    cuisine: String,
    type: String,
    // URL to an image of the food
    image: String,
    // store ingredients as a string - no need to overengineer and make a model
    ingredients: [String],
    creator: { type: Schema.Types.ObjectId, ref: "Account" },
    // list of users who have voted for the recipe
    accountsVoted: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    score: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);

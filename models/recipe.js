const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema(
  {
    name: String,
    type: String,
  },
  {
    timestamps: true,
  }
);

const recipeSchema = new Schema(
  {
    name: String,
    cuisine: String,
    type: String,
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    ingredients: [ingredientSchema],
    creator: { type: Schema.Types.ObjectId, ref: "Account" },
    accountsVoted: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    score: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);

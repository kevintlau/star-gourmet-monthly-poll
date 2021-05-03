const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    name: String,
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    contestName: String,
    cuisine: String,
    type: String,
    image: String,
    // contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    ingredients: [String],
    // ingedients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
    creator: { type: Schema.Types.ObjectId, ref: "Account" },
    accountsVoted: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    score: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);

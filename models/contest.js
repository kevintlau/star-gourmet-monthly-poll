const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contestSchema = new Schema(
  {
    name: String,
    theme: String,
    startDate: Date,
    endDate: Date,
    // recipes entered into the contest
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    // each contest should have a limited list of ingredients
    ingredients: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);

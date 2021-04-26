const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contestSchema = new Schema(
  {
    name: String,
    theme: String,
    startDate: Date,
    endDate: Date,
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    ingredients: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);

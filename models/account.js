const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    name: String,
    email: String,
    googleId: String,
    // user's submissions
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    // recipes the user has voted for
    votes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);

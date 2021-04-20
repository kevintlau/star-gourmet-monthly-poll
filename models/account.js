const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    email: String,
    googleId: String,
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    votes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);

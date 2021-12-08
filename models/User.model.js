const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: {type: String, required: true},
  surname: {type: String, required: true},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Business" }],
  picture: {
    type: String,
    default:
      "",
  },
  userType: {type: String, default: "user"}
});



module.exports = model("User", userSchema);

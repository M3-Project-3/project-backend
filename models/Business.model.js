const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const businessSchema = new Schema(
  {
  name: {type: String},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: {type: String},
  resType: {type: String},
  foodType: {type: String},
  menuStarters: [{type: Object}],
  menuMain: [{type: Object}],
  menuDeserts: [{type: Object}],
  priceRange: {type: String},
  timetable: [{type: Object}],
  tables: {type: Number},
  userType: {type: String, default: "user"},
  pictures: [{
    type: String,
    default:
      "",
  }],
  userType: {type: String, default: "business"},
  isProfileComplete: {type: Boolean, default: false}
  
  // owner will be added later on
});

module.exports = model("Project", businessSchema);

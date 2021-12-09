const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
  day: {type: String},
  hour: [{type: String}],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  business: { type: Schema.Types.ObjectId, ref: "Business" },
  people: {type: Number},
  status: {type: String, default: "pending"}

});


module.exports = model("Reservation", reservationSchema);

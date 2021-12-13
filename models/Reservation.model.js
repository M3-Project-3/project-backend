const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
  name: {type: String},
  surname: {type: String},
  date: {type: Object},
  hour: {type: String},
  people: {type: Number},
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  businessId: { type: Schema.Types.ObjectId, ref: "Business" },
  status: {type: String, default: "pending"}

});


module.exports = model("Reservation", reservationSchema);

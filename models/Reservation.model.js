const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
  date: {type: new Date},
  hour: [{type: String}],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  business: { type: Schema.Types.ObjectId, ref: "Business" },
  tables: {type: Number},
  status: {type: String}

});


module.exports = model("Reservation", reservationSchema);

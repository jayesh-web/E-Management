const mongoose = require("mongoose");
const BoughtPassesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "events",
  },
  quantityBought: {
    type: Number,
  },
});

const BoughtPassesModel = mongoose.model("bought_passes", BoughtPassesSchema);
module.exports = BoughtPassesModel;

const mongoose = require("mongoose");
const EventTypeSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "event category is required"],

    unique: true,
  },
  description: {
    type: String,
    required: [true, "event description is required"],
  },
});
const EventTypeModel = mongoose.model("event_category", EventTypeSchema);
module.exports = EventTypeModel;

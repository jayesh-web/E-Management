const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "event name is required"],
    minLength: 10,
    maxLength: 40,
  },
  description: {
    type: String,
    required: [true, "event description is required"],
  },
  startDate: {
    type: Date,
    required: [true, "event start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "event end date is required"],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "event_category",
  },
  venue: {
    type: String,
    required: [true, "event venue is required"],
  },
  price: {
    type: Number,
    required: [true, "event ticket price is required"],
  },
  totalPasses: {
    type: Number,
    require: [true, "Total passes is required"],
  },
  soldOutPasses: {
    type: Number,
  },
  photos: [
    {
      type: String,
    },
  ],
  guest: [
    {
      type: String,
    },
  ],
});

//pre Middleware
EventSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "category",
  });
  next();
});
const EventModel = mongoose.model("events", EventSchema);
module.exports = EventModel;

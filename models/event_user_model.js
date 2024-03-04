const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const EventUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "events",
    },
    quantityPurchased: {
      type: Number,
    },
    quantityCanceled: {
      type: Number,
    },
    transactionId: { type: String, default: randomUUID },
    paymentMode: { type: String, default: "Online" },
    pricePerPass: Number,
    totalPrice: Number,
    serviceFee: { type: Number, default: 100 },
    purchaseType: { type: String, enum: { values: ["buy", "cancel"] } },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// EventUserSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "userId",
//     select: "name",
//   });
//   next();
// });

// EventUserSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "eventId",
//     select: "name description -_id",
//   });
//   next();
// });

// EventUserSchema.virtual("users", {
//   ref: "users",
//   foreignField: "event_user",
//   localField: "_id",
// });
// EventUserSchema.pre(/^find/, function (next) {
// this.populate({
//   path:'employee',
//   select:'name'
//  }).populate({
//   path:'user',
//   select:'name'
//  })

//   this.populate({
//     path: "users",
//     select: "name",
//   }).populate({
//     path: "events",
//     select: "name",
//   });
//   next();
// });
const EventUserModel = mongoose.model("event_user", EventUserSchema);
module.exports = EventUserModel;

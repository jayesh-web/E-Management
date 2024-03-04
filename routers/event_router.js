const express = require("express");
const {
  protect,
  restrictTo,
} = require("../controllers/authorization/authController");
const EventController = require("../controllers/eventController");
const eventRouter = express.Router();

eventRouter
  .route("/")
  .post(protect, restrictTo("admin"), EventController.createEvent)
  .get(EventController.getAllEvent);
eventRouter
  .route("/:id")
  .get(EventController.getEvent)
  .patch(protect, restrictTo("admin"), EventController.updateEvent)
  .delete(protect, restrictTo("admin"), EventController.deleteEvent);

module.exports = eventRouter;

const express = require("express");
const EventCategory = require("../controllers/eventCategoryController");
const {
  restrictTo,
  protect,
} = require("../controllers/authorization/authController");
const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(EventCategory.getEventCategory)
  .post(protect, restrictTo("admin"), EventCategory.create);
categoryRouter
  .route("/:id")
  .patch(protect, restrictTo("admin"), EventCategory.updateEventCategory)
  .delete(protect, restrictTo("admin"), EventCategory.deleteCategory);

module.exports = categoryRouter;

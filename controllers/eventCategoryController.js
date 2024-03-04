const EventCategoryRepository = require("../factory/eventCategoryRepository");
const catchAsync = require("../utils/catchAsync");

class EventCategory {
  static create = async (req, res) => {
    try {
      const result = await EventCategoryRepository.create(req.body);
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        error: err,
      });
    }
  };
  static updateEventCategory = catchAsync(async (req, res, next) => {
    try {
      const category = await EventCategoryRepository.updateCategory(
        req.params.id,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        error: err,
      });
    }
  });

  static deleteCategory = catchAsync(async (req, res, next) => {
    try {
      const category = await EventCategoryRepository.deleteCategory(
        req.params.id
      );
      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        error: err,
      });
    }
  });
  static getEventCategory = catchAsync(async (req, res, next) => {
    try {
      const category = await EventCategoryRepository.getAll(req.query);

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        error: err,
      });
    }
  });
}

module.exports = EventCategory;

const EventRepo = require("../factory/eventRepo");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const message = require("../utils/responseMessages");

class EventController {
  static createEvent = catchAsync(async (req, res, next) => {
    const event = await EventRepo.create(req.body);
    res.status(201).json({
      status: "success",
      data: event,
    });
  });
  static getEvent = catchAsync(async (req, res, next) => {
    const event = await EventRepo.getEventById(req.params.id);
    if (!event) {
      return next(new AppError("No Event found with that id ", 404));
    }
    res.status(200).json({
      status: "success",
      data: event,
    });
  });

  static updateEvent = catchAsync(async (req, res, next) => {
    const event = await EventRepo.updateEvent(req.params.id, req.body);
    if (!event) {
      return next(new AppError("No Event found with that id ", 404));
    }
    res.status(200).json({
      status: "success",
      message: message.success.update("event"),
      data: event,
    });
  });

  static deleteEvent = catchAsync(async (req, res, next) => {
    const doc = await EventRepo.deleteEvent(req.params.id);
    if (!doc) {
      return next(new AppError("No document find with that Id", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
  static getAllEvent = catchAsync(async (req, res, next) => {
    const result = await EventRepo.getAllEvents(req.query);
    res.status(200).json({
      status: "success",
      data: result,
    });
  });
}

module.exports = EventController;

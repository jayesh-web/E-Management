const EventUserRepository = require("../factory/eventUserRepository");
const { getOne, getAll } = require("../factory/handleFactory");
const buySellHelper = require("../helpers/buySellHelper");
const BoughtPassesModel = require("../models/bought_Passes_model");
const EventModel = require("../models/eventModel");
const EventUserModel = require("../models/event_user_model");
const BoughtPassesService = require("../services/boughtPassesService");
const EventService = require("../services/eventService");
const EventUserService = require("../services/eventUserService");
const catchAsync = require("../utils/catchAsync");
const message = require("../utils/responseMessages");

const buyPass = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const quantityPurchased = Math.abs(req.body.quantityPurchased);
  const eventDetails = await EventModel.findById({ _id: req.body.eventId });
  const availablePasses = eventDetails.totalPasses - eventDetails.soldOutPasses;
  const pricePerPass = eventDetails.price;
  const serviceFee = 100;
  const totalPrice = pricePerPass * quantityPurchased + serviceFee;
  const purchaseType = "buy";
  const newBody = {
    userId,
    pricePerPass,
    totalPrice,
    serviceFee,
    purchaseType,
    ...req.body,
  };
  try {
    if (quantityPurchased <= availablePasses) {
      const eventUser = await EventUserService.create(newBody);
      await buySellHelper(purchaseType, eventUser, newBody);
      await EventService.updateEvent(
        { _id: req.body.eventId },
        { $inc: { soldOutPasses: quantityPurchased } }
      );
      return res.status(200).json({
        status: "success",
        data: eventUser,
        message: message.success.buy(quantityPurchased),
      });
    }
    return res.status(400).json({
      status: "fail",
      messsage: message.error.buy(availablePasses),
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error,
    });
  }
});

const cancelPass = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const quantityCanceled = Math.abs(req.body.quantityCanceled);
  const eventDetails = await EventModel.findById({ _id: req.body.eventId });
  const pricePerPass = eventDetails.price;
  const serviceFee = 100;
  const totalPrice = pricePerPass * quantityCanceled - serviceFee;
  const purchaseType = "cancel";
  const newBody = {
    userId,
    pricePerPass,
    totalPrice,
    serviceFee,
    purchaseType,
    ...req.body,
    quantityCanceled: quantityCanceled,
  };
  const passesBought = await BoughtPassesService.findPassesByUserIdEventId({
    userId,
    eventId: req.body.eventId,
  });
  const bought = passesBought[0].quantityBought;
  try {
    if (quantityCanceled <= bought) {
      const eventUser = await EventUserService.create(newBody);
      await buySellHelper(purchaseType, eventUser, newBody);
      const result = await EventService.updateEvent(
        { _id: req.body.eventId },
        {
          $inc: {
            soldOutPasses: -quantityCanceled,
            totalPrice: -totalPrice,
          },
        }
      );

      return res.status(200).json({
        status: "success",
        data: eventUser,
        message: message.success.cancel(quantityCanceled),
      });
    }
    return res.status(400).json({
      status: "fail",
      messsage: message.error.cancel(bought),
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error,
    });
  }
});

const getPasses = getOne(EventUserModel);
// const getAllPasses = getAll(EventUserModel);
const getAllPasses = catchAsync(async (req, res, next) => {
  const getPasses = await EventUserRepository.getAll(req.query);
  res.status(200).json({
    status: "success",
    data: getPasses,
  });
});

const getAllTrending = catchAsync(async (req, res, next) => {
  const trending = await EventUserRepository.getTrendingEvents(req.query);
  res.status(200).json({
    status: "success",
    data: trending,
  });
});
module.exports = {
  buyPass,
  getPasses,
  getAllPasses,
  cancelPass,
  getAllTrending,
};

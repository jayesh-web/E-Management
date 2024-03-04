import EventModel from "../models/eventModel";
import catchAsync from "./catchAsync";

export class eventRepository {
  static createEvent = async (req, res) => {
    const event = await EventModel.create(req.body);
    return event;
  };

  static getEventList = catchAsync(async (req, res) => {
    let facet = {
      metadata: [],
      pipeline: [],
    };

    facet.pipeline.push({
      $lookup: {
        from: "event_category",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    });

    
  });
}

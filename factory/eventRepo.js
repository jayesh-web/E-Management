const { cloneDeep } = require("lodash");
const EventModel = require("../models/eventModel");
const moment = require("moment");

class EventRepo {
  static create = async (body) => {
    try {
      return await EventModel.create(body);
    } catch (error) {
      throw error;
    }
  };

  static updateEvent = async (id, body) => {
    try {
      return await EventModel.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw error;
    }
  };

  static deleteEvent = async (id) => {
    try {
      return await EventModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  };

  static getEventById = async (id) => {
    try {
      return await EventModel.findById(id);
    } catch (error) {
      throw error;
    }
  };
  static getAllEvents = async (query) => {
    let facet = {
      metadata: [],
      pipeline: [],
    };

    facet.pipeline.push({
      $lookup: {
        from: "event_categories",
        localField: "category",
        foreignField: "_id",
        as: "event_category_data",
      },
    });
    if (query.search) {
      facet.pipeline.push({
        $match: {
          $or: [
            {
              "event_category_data.category": {
                $regex: query.search.trim(),
                $options: "i",
              },
            },
            {
              venue: {
                $regex: query.search.trim(),
                $options: "i",
              },
            },
            {
              name: { $regex: query.search.trim(), $options: "i" },
            },
          ],
        },
      });
    }

    if (query.startDate && query.endDate) {
      facet.pipeline.push({
        $match: {
          $and: [
            {
              startDate: {
                $gte: moment(query.startDate).startOf("day").toDate(),
              },
            },
            {
              endDate: {
                $lte: moment(query.endDate).startOf("day").toDate(),
              },
            },
          ],
        },
      });
    } else if (query.startDate) {
      facet.pipeline.push({
        $match: {
          startDate: {
            $gte: moment(query.startDate).startOf("day").toDate(),
          },
        },
      });
    } else if (query.endDate) {
      console.log(query.endDate);
      facet.pipeline.push({
        $match: {
          endDate: {
            $lte: moment(query.endDate).startOf("day").toDate(),
          },
        },
      });
    }
    if (query.sortBy) {
      const sortOrder = query.sortAt === "desc" ? -1 : 1;
      facet.pipeline.push({
        $sort: {
          [query.sortBy]: sortOrder,
        },
      });
    }

    facet.metadata = cloneDeep(facet.pipeline);

    facet.metadata.push({
      $count: "totalCount",
    });
    const getAll = await EventModel.aggregate([
      { $facet: facet },
      { $unwind: "$metadata" },
      { $project: { metadata: `$metadata`, data: "$pipeline" } },
    ]);

    if (getAll.length > 0) {
      return getAll[0];
    } else {
      return [];
    }
  };
}
module.exports = EventRepo;

const { cloneDeep } = require("lodash");
const EventUserModel = require("../models/event_user_model");
const EventModel = require("../models/eventModel");
const moment = require("moment");

class EventUserRepository {
  static getAll = async (query) => {
    let facet = {
      metadata: [],
      pipeline: [],
    };

    // facet.pipeline.push({
    //     $count:"Total count"
    // }),
    facet.pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, email: 1, role: 1 } }],
        as: "user_data",
      },
    });

    facet.pipeline.push({
      $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        pipeline: [{ $project: { soldOutPasses: 0 } }],
        as: "event_data",
      },
    });

    facet.pipeline.push({
      $unwind: { path: "$event_data" },
    });

    facet.pipeline.push({
      $lookup: {
        from: "event_categories",
        localField: "event_data.category",
        foreignField: "_id",
        as: "event_category_data",
      },
    });

    const search = query.search;
    console.log(query.endDate, query.startDate);
    if (search) {
      facet.pipeline.push({
        $match: {
          $or: [
            {
              "user_data.name": { $regex: search.trim(), $options: "i" },
            },
            { "event_data.name": { $regex: search.trim(), $options: "i" } },
            {
              "event_category_data.category": {
                $regex: search.trim(),
                $options: "i",
              },
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
              "event_data.startDate": {
                $gte: moment(query.startDate).startOf("day").toDate(),
              },
            },
            {
              "event_data.endDate": {
                $lte: moment(query.endDate).startOf("day").toDate(),
              },
            },
          ],
        },
      });
    } else if (query.startDate) {
      facet.pipeline.push({
        $match: {
          "event_data.startDate": {
            $gte: moment(query.startDate).startOf("day").toDate(),
          },
        },
      });
    } else if (query.endDate) {
      facet.pipeline.push({
        $match: {
          "event_data.endDate": {
            $lte: moment(query.endDate).startOf("day").toDate(),
          },
        },
      });
    }
    //sorting stage
    if (query.sortBy) {
      const sortOrder = query.sortAt === "desc" ? -1 : 1;
      facet.pipeline.push({
        $sort: {
          [query.sortBy]: sortOrder,
        },
      });
    }

    facet.metadata = cloneDeep(facet.pipeline);

    // if (query.ldate) {
    //   console.log(query.ldate)
    //   facet.pipeline.push({
    //     $sort: {
    //       ["endDate"]: { $lte: query.ldate },
    //     },
    //   });
    // }

    facet.metadata.push({
      $count: "totalCount",
    });

    // facet.pipeline.push({
    //   $count: "TotalCount",
    // });

    // facet.metadata = cloneDeep(facet.pipeline);

    if (query.page) {
      const startIndex = (query.page * 1 - 1) * (query.limit * 1);
      facet.pipeline.push({
        $skip: startIndex,
      });
      facet.pipeline.push({
        $limit: query.limit * 1,
      });
    }

    const ALlpasses = await EventUserModel.aggregate([
      { $facet: facet },
      //   { $unwind: "$metadata" },
      //   { $project: { data: "$pipeline" } },

      { $project: { metadata: `$metadata`, data: "$pipeline" } },
    ]);

    if (ALlpasses.length > 0) {
      return ALlpasses[0];
    } else {
      return [];
    }
  };

  static getTrendingEvents = async (query) => {
    let facet = {
      metadata: [],
      pipeline: [],
    };
    //sorting stage
    // if (query.sortBy === "trending") {
    //   const sortOrder = query.sortAt === "asc" ? 1 : -1;
    //   facet.pipeline.push({
    //     $sort: {
    //       ["soldOutPasses"]: sortOrder,
    //     },
    //   });
    // }

    facet.pipeline.push({
      $sort: {
        ["soldOutPasses"]: -1,
      },
    });
    facet.metadata = cloneDeep(facet.pipeline);

    facet.metadata.push({
      $count: "totalCount",
    });
    const trendingEvent = await EventModel.aggregate([
      { $facet: facet },
      { $unwind: "$metadata" },
      //   { $project: { data: "$pipeline" } },

      { $project: { metadata: `$metadata`, data: "$pipeline" } },
    ]);

    if (trendingEvent.length > 0) {
      return trendingEvent[0];
    } else {
      return [];
    }
  };
}
module.exports = EventUserRepository;

const { cloneDeep } = require("lodash");
const EventTypeModel = require("../models/event_type_model");

class EventCategoryRepository {
  static create = async (body) => {
    try {
      const category = await EventTypeModel.create(body);
      return category;
    } catch (error) {
      throw error;
    }
  };
  static updateCategory = async (id, data) => {
    try {
      const category = await EventTypeModel.findByIdAndUpdate(id, data);
      return category;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static deleteCategory = async (id) => {
    try {
      const category = await EventTypeModel.findByIdAndDelete(id);
      return category;
    } catch (error) {
      throw error;
    }
  };

  static getAll = async (query) => {
    let facet = {
      metadata: [],
      pipeline: [],
    };
    if (query.search) {
      facet.pipeline.push({
        $match: {
          $or: [{ category: { $regex: query.search.trim(), $options: "i" } }],
        },
      });
    }

    facet.metadata = cloneDeep(facet.pipeline);

    facet.metadata.push({
      $count: "totalCount",
    });
    const getAll = await EventTypeModel.aggregate([
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

module.exports = EventCategoryRepository;

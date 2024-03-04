const EventModel = require("../models/eventModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const EventService = require("../utils/eventService");

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document find with that Id", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model, populateOption) =>
  catchAsync(async (req, res, next) => {
    // const employee = await Employee.findById(req.params.id).populate({path:'guides',select:'-__v -password'});
    let query = Model.findById(req.params.id);
    if (populateOption) query = query.populate(populateOption);
    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that id ", 404));
    }
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res) => {
    try {
      let filter = {};
      if (req.params.id) filter = { userId: req.params.id };

      //-------EXECUTE QUERY-----------
      const features = new EventService(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      //   const features = await EventModel.aggregate([
      //     {
      //       $group: { _id: "$soldOutPasses" },
      //     },
      //   ]);
      const doc = await features.query;
      //   const doc = await features.query.explain();
      res.status(200).json({
        status: "success",
        results: doc.length,
        data: {
          data: doc,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    }
  });

// const getAllEvents = async (query) => {
//   let facet = {
//     metadata: [],
//     pipeline: [],
//   };
//   // facet.pipeline.push({
//   //   $sort: {
//   //     ["soldOutPasses"]: -1,
//   //   },
//   // });
//   if (query.startDate && query.endDate) {
//     facet.pipeline.push({
//       $match: {
//         $and: [
//           {
//             startDate: {
//               $gte: moment(query.startDate).startOf("day").toDate(),
//             },
//           },
//           {
//             endDate: {
//               $lte: moment(query.endDate).startOf("day").toDate(),
//             },
//           },
//         ],
//       },
//     });
//   } else if (query.startDate) {
//     facet.pipeline.push({
//       $match: {
//         startDate: {
//           $gte: moment(query.startDate).startOf("day").toDate(),
//         },
//       },
//     });
//   } else if (query.endDate) {
//     facet.pipeline.push({
//       $match: {
//         endDate: {
//           $lte: moment(query.endDate).startOf("day").toDate(),
//         },
//       },
//     });
//   }

//   facet.metadata = cloneDeep(facet.pipeline);

//   facet.metadata.push({
//     $count: "totalCount",
//   });
//   const getAll = await EventModel.aggregate([
//     { $facet: facet },
//     { $unwind: "$metadata" },
//     { $project: { metadata: `$metadata`, data: "$pipeline" } },
//   ]);

//   if (getAll.length > 0) {
//     return getAll[0];
//   } else {
//     return [];
//   }
// };
module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
  // getAllEvents,
};

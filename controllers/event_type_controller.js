const { getOne, createOne, getAll } = require("../factory/handleFactory");
const EventTypeModel = require("../models/event_type_model");

const getEventTypeById = getOne(EventTypeModel);
const createEventType= createOne(EventTypeModel);
const getAllEventType= getAll(EventTypeModel);
module.exports ={getEventTypeById,createEventType,getAllEventType} 
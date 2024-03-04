const EventModel = require("../models/eventModel");

class EventService {
  static createEvent = async (data) => {
    try {
      const result = await EventModel.create(data);
      return result;
    } catch (error) {
      throw error;
    }
  };
  static updateEvent = async (id,data) => {
    try {
      const result = await EventModel.findByIdAndUpdate(id,data);
      return result;
    } catch (error) {
      throw error;
    }
  };

  static deleteEvent = async (id) => {
    try {
      const result = await EventModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  static getEvent = async (id) => {
    try {
      const result = await EventModel.findById(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  static getAllEvent = async () => {
    try {
      const result = await EventModel.find();
      return result;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = EventService;

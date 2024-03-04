const EventUserModel = require("../models/event_user_model");

class EventUserService {
  static create = async (body) => {
    try {
      const result = await EventUserModel.create(body);
      return result;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = EventUserService;

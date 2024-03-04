const BoughtPassesModel = require("../models/bought_Passes_model");

class BoughtPassesService {
  static findPassesByUserIdEventId = async (data) => {
    try {
      const result = await BoughtPassesModel.find(data);
      return result;
    } catch (error) {
      throw error;
    }
  };

  static findPassesByUserId = async (userId) => {
    try {
      const result = await BoughtPassesModel.find(userId);
      return result;
    } catch (error) {
      throw error;
    }
  };
  static updateBoughtPasses = async (id, data) => {
    try {
      const result = await BoughtPassesModel.findByIdAndUpdate(id, data);
      return result;
    } catch (error) {
      throw error;
    }
  };

  static createPasses = async (data) => {
    try {
      const result = await BoughtPassesModel.create(data);
      return result;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = BoughtPassesService;

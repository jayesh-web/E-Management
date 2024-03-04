const BoughtPassesService = require("../services/boughtPassesService");
const buySellHelper = async (purchaseType, eventUser, body) => {
    const boughtPass = await BoughtPassesService.findPassesByUserIdEventId({
      userId: body.userId,
      eventId: eventUser.eventId,
    });
    if (boughtPass.length > 0 ) {
      await BoughtPassesService.updateBoughtPasses(boughtPass[0]._id, {
        $inc: {
          quantityBought:
            purchaseType === "buy"
              ? body.quantityPurchased
              : purchaseType === "cancel"
              ? -body.quantityCanceled
              : 0,
        },
      });
    } else if (purchaseType === "buy" && boughtPass.length === 0) {

      await BoughtPassesService.createPasses({
        eventId: eventUser.eventId,
        userId: eventUser.userId,
        quantityBought: body.quantityPurchased,
      });
    }
  }
module.exports = buySellHelper;

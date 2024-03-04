const express =require('express');
const { getEventTypeById,createEventType } = require('../controllers/event_type_controller');
const { restrictTo, protect } = require('../controllers/authorization/authController');
const eventTypeRouter =express.Router();
eventTypeRouter.route('/').post(protect,restrictTo('admin'), createEventType)
eventTypeRouter.route('/:id').get(getEventTypeById);

module.exports = eventTypeRouter;
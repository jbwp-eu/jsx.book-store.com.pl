import express from 'express';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();

import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  deleteOrder
} from '../controllers/orderController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, checkObjectId, getOrderById);
router.route('/:id/pay').put(protect, checkObjectId, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, checkObjectId, updateOrderToDelivered)
router.route('/:id').delete(protect, admin, checkObjectId, deleteOrder);

export default router;
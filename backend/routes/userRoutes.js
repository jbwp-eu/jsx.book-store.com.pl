import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

import {
  registerUser,
  authUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById
} from '../controllers/userController.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

router.route('/profile').put(protect, updateUserProfile);

router.route('/').get(protect, admin, getUsers);
router.route('/:id').get(protect, admin, checkObjectId, getUserById).delete(protect, admin, checkObjectId, deleteUser).put(protect, admin, checkObjectId, updateUser);

export default router;
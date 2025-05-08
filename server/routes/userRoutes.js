import express from 'express'
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, admin, getUsers)
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

export default router
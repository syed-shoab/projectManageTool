import express from 'express'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskComment,
} from '../controllers/taskController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks)

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask)

router.route('/:id/comments')
  .post(protect, addTaskComment)

export default router
import express from 'express'
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks,
} from '../controllers/projectController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects)

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject)

router.route('/:id/tasks')
  .get(protect, getProjectTasks)

export default router
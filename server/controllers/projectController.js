import asyncHandler from 'express-async-handler'
import Project from '../models/projectModel.js'
import Task from '../models/taskModel.js'

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description, status, startDate, endDate, priority, members } = req.body

  const project = await Project.create({
    name,
    description,
    status,
    startDate,
    endDate,
    priority,
    user: req.user._id,
    members: members || [],
  })

  res.status(201).json(project)
})

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  // Get projects created by user or projects where user is a member
  const projects = await Project.find({
    $or: [
      { user: req.user._id },
      { members: req.user._id }
    ]
  }).populate('user', 'name email')

  res.json(projects)
})

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('user', 'name email')
    .populate('members', 'name email')
    .populate({
      path: 'tasks',
      populate: {
        path: 'assignedTo',
        select: 'name email',
      },
    })

  if (project) {
    // Check if user is authorized to access this project
    if (
      project.user._id.toString() === req.user._id.toString() ||
      project.members.some(member => member._id.toString() === req.user._id.toString())
    ) {
      res.json(project)
    } else {
      res.status(401)
      throw new Error('Not authorized to access this project')
    }
  } else {
    res.status(404)
    throw new Error('Project not found')
  }
})

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (project) {
    // Check if user is authorized to update this project
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401)
      throw new Error('Not authorized to update this project')
    }

    project.name = req.body.name || project.name
    project.description = req.body.description || project.description
    project.status = req.body.status || project.status
    project.startDate = req.body.startDate || project.startDate
    project.endDate = req.body.endDate || project.endDate
    project.priority = req.body.priority || project.priority
    project.members = req.body.members || project.members

    const updatedProject = await project.save()
    res.json(updatedProject)
  } else {
    res.status(404)
    throw new Error('Project not found')
  }
})

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (project) {
    // Check if user is authorized to delete this project
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401)
      throw new Error('Not authorized to delete this project')
    }

    // Delete all tasks related to this project
    await Task.deleteMany({ project: req.params.id })
    
    // Delete the project
    await project.deleteOne()
    res.json({ message: 'Project removed' })
  } else {
    res.status(404)
    throw new Error('Project not found')
  }
})

// @desc    Get project tasks
// @route   GET /api/projects/:id/tasks
// @access  Private
const getProjectTasks = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    res.status(404)
    throw new Error('Project not found')
  }

  // Check if user is authorized to access this project
  if (
    project.user.toString() !== req.user._id.toString() &&
    !project.members.includes(req.user._id)
  ) {
    res.status(401)
    throw new Error('Not authorized to access this project')
  }

  const tasks = await Task.find({ project: req.params.id })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')

  res.json(tasks)
})

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks,
}
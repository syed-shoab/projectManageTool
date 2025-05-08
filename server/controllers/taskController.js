import asyncHandler from 'express-async-handler'
import Task from '../models/taskModel.js'
import Project from '../models/projectModel.js'

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignedTo } = req.body

  // Check if project exists
  const projectExists = await Project.findById(project)
  if (!projectExists) {
    res.status(404)
    throw new Error('Project not found')
  }

  // Check if user is authorized to create tasks for this project
  if (
    projectExists.user.toString() !== req.user._id.toString() &&
    !projectExists.members.includes(req.user._id)
  ) {
    res.status(401)
    throw new Error('Not authorized to create tasks for this project')
  }

  const task = await Task.create({
    title,
    description: description || '',
    status: status || 'not-started',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    project,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
  })

  // Populate task with user information
  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')

  res.status(201).json(populatedTask)
})

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  // Get projects created by user or where user is a member
  const projects = await Project.find({
    $or: [
      { user: req.user._id },
      { members: req.user._id }
    ]
  })

  const projectIds = projects.map(project => project._id)

  // Get all tasks for these projects
  const tasks = await Task.find({ project: { $in: projectIds } })
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')

  res.json(tasks)
})

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('comments.user', 'name email')

  if (task) {
    // Check if user has access to this task's project
    const project = await Project.findById(task.project)
    
    if (
      project.user.toString() === req.user._id.toString() ||
      project.members.includes(req.user._id)
    ) {
      res.json(task)
    } else {
      res.status(401)
      throw new Error('Not authorized to access this task')
    }
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (task) {
    // Check if user is authorized to update this task
    const project = await Project.findById(task.project)
    
    if (
      project.user.toString() !== req.user._id.toString() &&
      !project.members.includes(req.user._id)
    ) {
      res.status(401)
      throw new Error('Not authorized to update this task')
    }

    task.title = req.body.title || task.title
    task.description = req.body.description || task.description
    task.status = req.body.status || task.status
    task.priority = req.body.priority || task.priority
    task.dueDate = req.body.dueDate || task.dueDate
    task.assignedTo = req.body.assignedTo || task.assignedTo

    const updatedTask = await task.save()
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
    
    res.json(populatedTask)
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (task) {
    // Check if user is authorized to delete this task
    const project = await Project.findById(task.project)
    
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401)
      throw new Error('Not authorized to delete this task')
    }

    await task.deleteOne()
    res.json({ message: 'Task removed' })
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addTaskComment = asyncHandler(async (req, res) => {
  const { text } = req.body
  const task = await Task.findById(req.params.id)

  if (task) {
    // Check if user has access to this task's project
    const project = await Project.findById(task.project)
    
    if (
      project.user.toString() !== req.user._id.toString() &&
      !project.members.includes(req.user._id)
    ) {
      res.status(401)
      throw new Error('Not authorized to comment on this task')
    }

    const comment = {
      text,
      user: req.user._id,
    }

    task.comments.push(comment)
    await task.save()

    const updatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name email')

    res.status(201).json(updatedTask.comments)
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskComment,
}
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import { useProject } from '../../contexts/ProjectContext'
import { FaSpinner } from 'react-icons/fa'

function TaskForm({ task, projectId, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { projects, getProjects, createTask, updateTask } = useProject()
  
  useEffect(() => {
    if (!projectId) {
      getProjects()
    }
  }, [getProjects, projectId])
  
  const initialValues = {
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'not-started',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    project: task?.project || projectId || '',
    assignedTo: task?.assignedTo?._id || '',
  }
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    status: Yup.string().required('Status is required'),
    priority: Yup.string().required('Priority is required'),
    project: Yup.string().required('Project is required'),
  })
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        
        if (task) {
          await updateTask(task._id, values)
        } else {
          await createTask(values)
        }
        
        onClose()
      } catch (error) {
        console.error('Task form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })
  
  // Mock team members data (would usually come from an API)
  const teamMembers = [
    { _id: '605c72ef153207f53c0b8f9a', name: 'John Doe' }, // Example MongoDB ObjectId in string format
    { _id: '605c72ef153207f53c0b8f9b', name: 'Jane Smith' },
    { _id: '605c72ef153207f53c0b8f9c', name: 'David Johnson' },
  ]
  
  
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="form-label">
          Task Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-input ${
            formik.touched.title && formik.errors.title ? 'border-error-500' : ''
          }`}
          placeholder="Enter task title"
          {...formik.getFieldProps('title')}
        />
        {formik.touched.title && formik.errors.title ? (
          <div className="form-error">{formik.errors.title}</div>
        ) : null}
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          className={`form-input ${
            formik.touched.description && formik.errors.description ? 'border-error-500' : ''
          }`}
          placeholder="Enter task description"
          {...formik.getFieldProps('description')}
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="form-error">{formik.errors.description}</div>
        ) : null}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            className={`form-input ${
              formik.touched.status && formik.errors.status ? 'border-error-500' : ''
            }`}
            {...formik.getFieldProps('status')}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {formik.touched.status && formik.errors.status ? (
            <div className="form-error">{formik.errors.status}</div>
          ) : null}
        </div>
        
        <div>
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className={`form-input ${
              formik.touched.priority && formik.errors.priority ? 'border-error-500' : ''
            }`}
            {...formik.getFieldProps('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {formik.touched.priority && formik.errors.priority ? (
            <div className="form-error">{formik.errors.priority}</div>
          ) : null}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className={`form-input ${
              formik.touched.dueDate && formik.errors.dueDate ? 'border-error-500' : ''
            }`}
            {...formik.getFieldProps('dueDate')}
          />
          {formik.touched.dueDate && formik.errors.dueDate ? (
            <div className="form-error">{formik.errors.dueDate}</div>
          ) : null}
        </div>
        
        {!projectId && (
          <div>
            <label htmlFor="project" className="form-label">
              Project
            </label>
            <select
              id="project"
              name="project"
              className={`form-input ${
                formik.touched.project && formik.errors.project ? 'border-error-500' : ''
              }`}
              {...formik.getFieldProps('project')}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {formik.touched.project && formik.errors.project ? (
              <div className="form-error">{formik.errors.project}</div>
            ) : null}
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="assignedTo" className="form-label">
          Assign To
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          className="form-input"
          {...formik.getFieldProps('assignedTo')}
        >
          <option value="">Unassigned</option>
          {teamMembers.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              {task ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            task ? 'Update Task' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useProject } from '../../contexts/ProjectContext'
import { FaSpinner } from 'react-icons/fa'

function ProjectForm({ project, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createProject, updateProject } = useProject()
  
  const initialValues = {
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'not-started',
    priority: project?.priority || 'medium',
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
  }
  
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    status: Yup.string().required('Status is required'),
    priority: Yup.string().required('Priority is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().nullable(),
  })
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        
        if (project) {
          await updateProject(project._id, values)
        } else {
          await createProject(values)
        }
        
        onClose()
      } catch (error) {
        console.error('Project form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })
  
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="form-label">
          Project Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-input ${
            formik.touched.name && formik.errors.name ? 'border-error-500' : ''
          }`}
          placeholder="Enter project name"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="form-error">{formik.errors.name}</div>
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
          placeholder="Enter project description"
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
          <label htmlFor="startDate" className="form-label">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            className={`form-input ${
              formik.touched.startDate && formik.errors.startDate ? 'border-error-500' : ''
            }`}
            {...formik.getFieldProps('startDate')}
          />
          {formik.touched.startDate && formik.errors.startDate ? (
            <div className="form-error">{formik.errors.startDate}</div>
          ) : null}
        </div>
        
        <div>
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            className={`form-input ${
              formik.touched.endDate && formik.errors.endDate ? 'border-error-500' : ''
            }`}
            {...formik.getFieldProps('endDate')}
          />
          {formik.touched.endDate && formik.errors.endDate ? (
            <div className="form-error">{formik.errors.endDate}</div>
          ) : null}
        </div>
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
              {project ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            project ? 'Update Project' : 'Create Project'
          )}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaSpinner, FaPlus, FaEdit, FaTasks, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import { useProject } from '../contexts/ProjectContext'
import PageHeader from '../components/common/PageHeader'
import ProjectForm from '../components/projects/ProjectForm'
import TaskForm from '../components/tasks/TaskForm'
import Modal from '../components/common/Modal'
import TaskList from '../components/tasks/TaskList'

function ProjectDetails() {
  const { id } = useParams()
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const { currentProject, getProjectById, isLoading } = useProject()
  
  useEffect(() => {
    getProjectById(id)
  }, [getProjectById, id])
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800'
      case 'in-progress':
        return 'bg-primary-100 text-primary-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800'
      case 'medium':
        return 'bg-warning-100 text-warning-800'
      default:
        return 'bg-success-100 text-success-800'
    }
  }
  
  if (isLoading || !currentProject) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    )
  }
  
  return (
    <div>
      <PageHeader
        title={currentProject.name}
        subtitle={`Created on ${new Date(currentProject.createdAt).toLocaleDateString()}`}
        actions={
          <>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="btn bg-secondary-500 text-white hover:bg-secondary-600 flex items-center"
            >
              <FaEdit className="mr-2" />
              Edit Project
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="btn btn-primary flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Task
            </button>
          </>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex flex-col">
          <div className="text-sm font-medium text-gray-500 uppercase mb-2">Status</div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(currentProject.status)}`}>
              {currentProject.status === 'not-started' 
                ? 'Not Started' 
                : currentProject.status === 'in-progress' 
                  ? 'In Progress' 
                  : 'Completed'}
            </span>
          </div>
        </div>
        
        <div className="card flex flex-col">
          <div className="text-sm font-medium text-gray-500 uppercase mb-2">Priority</div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getPriorityColor(currentProject.priority)}`}>
              {currentProject.priority.charAt(0).toUpperCase() + currentProject.priority.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="card flex flex-col">
          <div className="text-sm font-medium text-gray-500 uppercase mb-2">Timeline</div>
          <div className="flex items-center text-sm">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <span>
              {new Date(currentProject.startDate).toLocaleDateString()}
              {currentProject.endDate ? ` - ${new Date(currentProject.endDate).toLocaleDateString()}` : ' (No end date)'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 card">
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <p className="text-gray-700">{currentProject.description}</p>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <FaUsers className="mr-2 text-gray-500" />
            Team Members
          </h2>
          {currentProject.members && currentProject.members.length > 0 ? (
            <div className="space-y-3">
              {currentProject.members.map((member) => (
                <div key={member._id} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No team members assigned</p>
          )}
          <button className="mt-4 w-full btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center">
            <FaPlus className="mr-2" />
            Add Member
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <FaTasks className="mr-2 text-gray-500" />
            Tasks
          </h2>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
          >
            <FaPlus className="mr-1" />
            Add Task
          </button>
        </div>
        
        <TaskList projectId={id} />
      </div>
      
      {/* Edit Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Edit Project"
      >
        <ProjectForm
          project={currentProject}
          onClose={() => setIsProjectModalOpen(false)}
        />
      </Modal>
      
      {/* Add Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add Task"
      >
        <TaskForm
          projectId={id}
          onClose={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default ProjectDetails
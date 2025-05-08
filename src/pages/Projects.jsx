import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaSpinner, FaTrash, FaEdit, FaSort } from 'react-icons/fa'
import { useProject } from '../contexts/ProjectContext'
import PageHeader from '../components/common/PageHeader'
import ProjectForm from '../components/projects/ProjectForm'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'

function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sortField, setSortField] = useState('updatedAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const { projects, getProjects, deleteProject, isLoading } = useProject()
  const navigate = useNavigate()

  useEffect(() => {
    getProjects()
  }, [getProjects])

  const openCreateModal = () => {
    setSelectedProject(null)
    setIsModalOpen(true)
  }

  const openEditModal = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const openDeleteDialog = (project) => {
    setSelectedProject(project)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    await deleteProject(selectedProject._id)
    setIsDeleteDialogOpen(false)
  }

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    } else if (sortField === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    } else if (sortField === 'priority') {
      const priorityValue = { low: 1, medium: 2, high: 3 }
      return sortDirection === 'asc'
        ? priorityValue[a.priority] - priorityValue[b.priority]
        : priorityValue[b.priority] - priorityValue[a.priority]
    } else {
      // Default sort by updatedAt
      return sortDirection === 'asc'
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt)
    }
  })

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Manage your projects"
        actions={
          <button
            onClick={openCreateModal}
            className="btn btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            New Project
          </button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-primary-500" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === 'status' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center">
                      Priority
                      {sortField === 'priority' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProjects.length > 0 ? (
                  sortedProjects.map((project) => (
                    <tr 
                      key={project._id} 
                      onClick={() => navigate(`/projects/${project._id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${project.status === 'completed' 
                            ? 'bg-success-100 text-success-800' 
                            : project.status === 'in-progress' 
                              ? 'bg-primary-100 text-primary-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status === 'completed' 
                            ? 'Completed' 
                            : project.status === 'in-progress' 
                              ? 'In Progress' 
                              : 'Not Started'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${project.priority === 'high' 
                            ? 'bg-error-100 text-error-800' 
                            : project.priority === 'medium' 
                              ? 'bg-warning-100 text-warning-800' 
                              : 'bg-success-100 text-success-800'
                          }`}
                        >
                          {project.priority === 'high' 
                            ? 'High' 
                            : project.priority === 'medium' 
                              ? 'Medium' 
                              : 'Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.endDate 
                          ? new Date(project.endDate).toLocaleDateString() 
                          : 'No deadline'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(project);
                          }}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(project);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No projects found. Create your first project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject ? 'Edit Project' : 'Create Project'}
      >
        <ProjectForm
          project={selectedProject}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.name}"? This will also delete all tasks associated with this project.`}
      />
    </div>
  )
}

export default Projects
import { useEffect, useState } from 'react'
import { FaEdit, FaTrash, FaSpinner, FaFilter, FaSort } from 'react-icons/fa'
import { useProject } from '../../contexts/ProjectContext'
import Modal from '../common/Modal'
import TaskForm from './TaskForm'
import ConfirmDialog from '../common/ConfirmDialog'

function TaskList({ projectId }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' })
  const [sortField, setSortField] = useState('updatedAt')
  const [sortDirection, setSortDirection] = useState('desc')
  
  const { tasks, getTasks, deleteTask, isLoading } = useProject()
  
  useEffect(() => {
    if (projectId) {
      getTasks({ projectId })
    } else {
      getTasks()
    }
  }, [getTasks, projectId])
  
  const openEditModal = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }
  
  const openDeleteDialog = (task) => {
    setSelectedTask(task)
    setIsDeleteDialogOpen(true)
  }
  
  const handleDelete = async () => {
    await deleteTask(selectedTask._id, selectedTask.project)
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
  
  const filteredTasks = tasks.filter((task) => {
    return (
      (filter.status === 'all' || task.status === filter.status) &&
      (filter.priority === 'all' || task.priority === filter.priority)
    )
  })
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortField === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    } else if (sortField === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    } else if (sortField === 'priority') {
      const priorityValue = { low: 1, medium: 2, high: 3 }
      return sortDirection === 'asc'
        ? priorityValue[a.priority] - priorityValue[b.priority]
        : priorityValue[b.priority] - priorityValue[a.priority]
    } else if (sortField === 'dueDate') {
      if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1
      if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1
      return sortDirection === 'asc'
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate)
    } else {
      // Default sort by updatedAt
      return sortDirection === 'asc'
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt)
    }
  })
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <FaSpinner className="animate-spin text-3xl text-primary-500" />
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="mr-2">
            <FaFilter className="text-gray-500" />
          </div>
          <select
            className="form-input py-1 mr-3"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="form-input py-1"
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
        </div>
      </div>
      
      {filteredTasks.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {sortField === 'title' && (
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
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center">
                      Due Date
                      {sortField === 'dueDate' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${task.status === 'completed' 
                          ? 'bg-success-100 text-success-800' 
                          : task.status === 'in-progress' 
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status === 'completed' 
                          ? 'Completed' 
                          : task.status === 'in-progress' 
                            ? 'In Progress' 
                            : 'Not Started'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${task.priority === 'high' 
                          ? 'bg-error-100 text-error-800' 
                          : task.priority === 'medium' 
                            ? 'bg-warning-100 text-warning-800' 
                            : 'bg-success-100 text-success-800'
                        }`}
                      >
                        {task.priority === 'high' 
                          ? 'High' 
                          : task.priority === 'medium' 
                            ? 'Medium' 
                            : 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.dueDate 
                        ? new Date(task.dueDate).toLocaleDateString() 
                        : 'No due date'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.assignedTo ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-xs">
                            {task.assignedTo.name.charAt(0)}
                          </div>
                          <span className="ml-2 text-sm text-gray-700">{task.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(task)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(task)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No tasks found matching your filters.
        </div>
      )}
      
      {/* Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Task"
      >
        <TaskForm
          task={selectedTask}
          projectId={projectId}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title}"?`}
      />
    </div>
  )
}

export default TaskList
import { createContext, useContext, useReducer, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

// Create context
const ProjectContext = createContext()

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  tasks: [],
  isLoading: false,
  error: null
}

// Action types
const PROJECT_LOADING = 'PROJECT_LOADING'
const PROJECT_SUCCESS = 'PROJECT_SUCCESS'
const PROJECT_FAIL = 'PROJECT_FAIL'
const PROJECT_CURRENT = 'PROJECT_CURRENT'
const TASK_SUCCESS = 'TASK_SUCCESS'
const CLEAR_ERROR = 'CLEAR_ERROR'

// Reducer function
function projectReducer(state, action) {
  switch (action.type) {
    case PROJECT_LOADING:
      return { ...state, isLoading: true, error: null }
    case PROJECT_SUCCESS:
      return { ...state, isLoading: false, projects: action.payload, error: null }
    case PROJECT_CURRENT:
      return { ...state, isLoading: false, currentProject: action.payload, error: null }
    case TASK_SUCCESS:
      return { ...state, isLoading: false, tasks: action.payload, error: null }
    case PROJECT_FAIL:
      return { ...state, isLoading: false, error: action.payload }
    case CLEAR_ERROR:
      return { ...state, error: null }
    default:
      return state
  }
}

// Provider component
export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState)
  
  // API URL
  const API_URL = 'http://localhost:5000/api'
  
  // Get auth token from local storage
  const getAuthConfig = () => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }
  
  // Get all projects
  const getProjects = useCallback(async () => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      const { data } = await axios.get(`${API_URL}/projects`, getAuthConfig())
      
      dispatch({ type: PROJECT_SUCCESS, payload: data })
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch projects'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }, [])
  
  // Get project by ID
  const getProjectById = async (id) => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      const { data } = await axios.get(`${API_URL}/projects/${id}`, getAuthConfig())
      
      dispatch({ type: PROJECT_CURRENT, payload: data })
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch project'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Create new project
  const createProject = async (projectData) => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      const { data } = await axios.post(`${API_URL}/projects`, projectData, getAuthConfig())
      
      // Refresh projects list
      getProjects()
      
      toast.success('Project created successfully!')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Update project
  const updateProject = async (id, projectData) => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      const { data } = await axios.put(`${API_URL}/projects/${id}`, projectData, getAuthConfig())
      
      // Refresh current project and projects list
      getProjectById(id)
      getProjects()
      
      toast.success('Project updated successfully!')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update project'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Delete project
  const deleteProject = async (id) => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      await axios.delete(`${API_URL}/projects/${id}`, getAuthConfig())
      
      // Refresh projects list
      getProjects()
      
      toast.success('Project deleted successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete project'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Get all tasks
  const getTasks = useCallback(async (filters = {}) => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      let url = `${API_URL}/tasks`
      if (filters.projectId) {
        url = `${API_URL}/projects/${filters.projectId}/tasks`
      }
      
      const { data } = await axios.get(url, getAuthConfig())
      
      dispatch({ type: TASK_SUCCESS, payload: data })
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }, [])
  
  // Create new task
  const createTask = async (taskData) => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      const { data } = await axios.post(`${API_URL}/tasks`, taskData, getAuthConfig())
      
      // Refresh tasks list for the project
      if (taskData.project) {
        getTasks({ projectId: taskData.project })
      } else {
        getTasks()
      }
      
      toast.success('Task created successfully!')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Update task
  const updateTask = async (id, taskData) => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      const { data } = await axios.put(`${API_URL}/tasks/${id}`, taskData, getAuthConfig())
      
      // Refresh tasks list for the project
      if (taskData.project) {
        getTasks({ projectId: taskData.project })
      } else {
        getTasks()
      }
      
      toast.success('Task updated successfully!')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Delete task
  const deleteTask = async (id, projectId) => {
    try {
      dispatch({ type: PROJECT_LOADING })
      
      await axios.delete(`${API_URL}/tasks/${id}`, getAuthConfig())
      
      // Refresh tasks list
      if (projectId) {
        getTasks({ projectId })
      } else {
        getTasks()
      }
      
      toast.success('Task deleted successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task'
      dispatch({ type: PROJECT_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR })
  }
  
  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects,
        currentProject: state.currentProject,
        tasks: state.tasks,
        isLoading: state.isLoading,
        error: state.error,
        getProjects,
        getProjectById,
        createProject,
        updateProject,
        deleteProject,
        getTasks,
        createTask,
        updateTask,
        deleteTask,
        clearError
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

// Custom hook
export const useProject = () => useContext(ProjectContext)
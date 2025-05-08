import { createContext, useContext, useReducer, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

// Create context
const AuthContext = createContext()

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  error: null
}

// Action types
const AUTH_LOADING = 'AUTH_LOADING'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_FAIL = 'AUTH_FAIL'
const AUTH_LOGOUT = 'AUTH_LOGOUT'
const CLEAR_ERROR = 'CLEAR_ERROR'

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_LOADING:
      return { ...state, isLoading: true, error: null }
    case AUTH_SUCCESS:
      return { ...state, isLoading: false, user: action.payload, error: null }
    case AUTH_FAIL:
      return { ...state, isLoading: false, error: action.payload }
    case AUTH_LOGOUT:
      return { ...state, user: null, error: null }
    case CLEAR_ERROR:
      return { ...state, error: null }
    default:
      return state
  }
}

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  
  // API URL
  const API_URL = 'http://localhost:5000/api'
  
  // Check if user is logged in
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      dispatch({ type: AUTH_SUCCESS, payload: null })
      return
    }
    
    try {
      dispatch({ type: AUTH_LOADING })
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      
      const { data } = await axios.get(`${API_URL}/users/profile`, config)
      
      dispatch({ type: AUTH_SUCCESS, payload: data })
    } catch (error) {
      localStorage.removeItem('token')
      dispatch({ 
        type: AUTH_FAIL, 
        payload: error.response?.data?.message || 'Authentication failed' 
      })
    }
  }, [])
  
  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_LOADING })
      
      const { data } = await axios.post(`${API_URL}/users/register`, userData)
      
      localStorage.setItem('token', data.token)
      
      dispatch({ type: AUTH_SUCCESS, payload: data.user })
      
      toast.success('Registration successful!')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: AUTH_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Login user
  const login = async (userData) => {
    try {
      dispatch({ type: AUTH_LOADING })
      
      const { data } = await axios.post(`${API_URL}/users/login`, userData)
      
      localStorage.setItem('token', data.token)
      
      dispatch({ type: AUTH_SUCCESS, payload: data.user })
      
      toast.success('Login successful!')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: AUTH_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: AUTH_LOGOUT })
    toast.info('Logged out successfully')
  }
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: AUTH_LOADING })
      
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      
      const { data } = await axios.put(`${API_URL}/users/profile`, userData, config)
      
      dispatch({ type: AUTH_SUCCESS, payload: data })
      
      toast.success('Profile updated successfully!')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      dispatch({ type: AUTH_FAIL, payload: message })
      toast.error(message)
      throw error
    }
  }
  
  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR })
  }
  
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        register,
        login,
        logout,
        updateProfile,
        checkAuthStatus,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export const useAuth = () => useContext(AuthContext)
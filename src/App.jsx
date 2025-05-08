import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Tasks from './pages/Tasks'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/layout/Layout'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Team from './pages/Team'

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return children
}

function App() {
  const { checkAuthStatus } = useAuth()
  
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="team" element={<Team />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
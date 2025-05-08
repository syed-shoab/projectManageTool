import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaProjectDiagram, FaTasks, FaUsers, FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { useAuth } from '../contexts/AuthContext'
import { useProject } from '../contexts/ProjectContext'
import PageHeader from '../components/common/PageHeader'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

function Dashboard() {
  const { user } = useAuth()
  const { projects, tasks, getProjects, getTasks, isLoading } = useProject()
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    teamMembers: 8 // Mock data
  })

  useEffect(() => {
    getProjects()
    getTasks()
  }, [getProjects, getTasks])

  useEffect(() => {
    if (projects && tasks) {
      const completedTasks = tasks.filter(task => task.status === 'completed').length
      const pendingTasks = tasks.filter(task => task.status === 'in-progress' || task.status === 'not-started').length
      const overdueTasks = tasks.filter(task => {
        if (task.status !== 'completed' && task.dueDate) {
          const dueDate = new Date(task.dueDate)
          return dueDate < new Date()
        }
        return false
      }).length

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        overdueTasks,
        teamMembers: 8 // Mock data
      })
    }
  }, [projects, tasks])

  // Chart data for task status
  const taskStatusData = {
    labels: ['Completed', 'In Progress', 'Overdue'],
    datasets: [
      {
        data: [stats.completedTasks, stats.pendingTasks, stats.overdueTasks],
        backgroundColor: ['#22C55E', '#4F46E5', '#EF4444'],
        borderWidth: 1,
      },
    ],
  }

  // Chart data for project progress
  const projectProgressData = {
    labels: projects.slice(0, 5).map(project => project.name),
    datasets: [
      {
        label: 'Completion (%)',
        data: projects.slice(0, 5).map(project => {
          const projectTasks = tasks.filter(task => task.project === project._id)
          if (projectTasks.length === 0) return 0
          const completedTasks = projectTasks.filter(task => task.status === 'completed').length
          return Math.round((completedTasks / projectTasks.length) * 100)
        }),
        backgroundColor: '#4F46E5',
      },
    ],
  }

  const recentProjects = projects.slice(0, 3)
  const recentTasks = tasks.slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`} 
        subtitle="Here's an overview of your projects and tasks"
      />
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <FaProjectDiagram className="text-xl text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold">{stats.totalProjects}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mr-4">
              <FaTasks className="text-xl text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center mr-4">
              <FaCheckCircle className="text-xl text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Tasks</p>
              <p className="text-2xl font-semibold">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-xl text-error-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue Tasks</p>
              <p className="text-2xl font-semibold">{stats.overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Task Status Overview</h2>
          <div className="h-64">
            <Pie data={taskStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
          <div className="h-64">
            <Bar 
              data={projectProgressData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Recent activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4 px-6 pt-6">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {recentProjects.length > 0 ? (
              recentProjects.map(project => (
                <div key={project._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/projects/${project._id}`}
                      className="font-medium text-gray-800 hover:text-primary-600"
                    >
                      {project.name}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No projects found. Create your first project.
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-center mb-4 px-6 pt-6">
            <h2 className="text-lg font-semibold">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <div key={task._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{task.title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {task.project && projects.find(p => p._id === task.project)?.name}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      task.status === 'completed' 
                        ? 'bg-success-100 text-success-700' 
                        : task.status === 'in-progress' 
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status === 'completed' 
                        ? 'Completed' 
                        : task.status === 'in-progress' 
                          ? 'In Progress' 
                          : 'Not Started'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No tasks found. Create your first task.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
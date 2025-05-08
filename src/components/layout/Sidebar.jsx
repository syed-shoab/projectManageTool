import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  FaHome, 
  FaProjectDiagram, 
  FaTasks, 
  FaUsers, 
  FaUser, 
  FaTimes 
} from 'react-icons/fa'

function Sidebar({ isOpen, toggleSidebar }) {
  const { user } = useAuth()

  const navItems = [
    { path: '/', icon: <FaHome />, text: 'Dashboard' },
    { path: '/projects', icon: <FaProjectDiagram />, text: 'Projects' },
    { path: '/tasks', icon: <FaTasks />, text: 'Tasks' },
    { path: '/team', icon: <FaUsers />, text: 'Team' },
    { path: '/profile', icon: <FaUser />, text: 'Profile' },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="ProjectFlow Logo" 
              className="h-8 w-8 mr-2" 
            />
            <span className="text-xl font-semibold text-primary-600">ProjectFlow</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="ml-2 overflow-hidden">
                <p className="font-medium text-gray-800 truncate">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                end={item.path === '/'}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.text}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
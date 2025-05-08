import { NavLink } from 'react-router-dom'
import { FaHome, FaProjectDiagram, FaTasks, FaUsers } from 'react-icons/fa'

function MobileNav() {
  const navItems = [
    { path: '/', icon: <FaHome />, text: 'Dashboard' },
    { path: '/projects', icon: <FaProjectDiagram />, text: 'Projects' },
    { path: '/tasks', icon: <FaTasks />, text: 'Tasks' },
    { path: '/team', icon: <FaUsers />, text: 'Team' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center py-2 px-3 ${
                isActive 
                  ? 'text-primary-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`
            }
            end={item.path === '/'}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs mt-1">{item.text}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
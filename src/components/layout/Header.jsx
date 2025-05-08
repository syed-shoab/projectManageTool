import { useState } from 'react'
import { FaBars, FaBell, FaSearch, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function Header({ toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 text-gray-500 rounded-md lg:hidden hover:text-gray-600 hover:bg-gray-100"
        >
          <FaBars />
        </button>

        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 rounded-full hover:text-gray-600 hover:bg-gray-100">
          <FaBell />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:block font-medium">{user?.name || 'User'}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
              <div className="px-4 py-2 text-xs text-gray-500">Account</div>
              <a
                href="#profile"
                onClick={(e) => {
                  e.preventDefault()
                  setShowDropdown(false)
                  navigate('/profile')
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
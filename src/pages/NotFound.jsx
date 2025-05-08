import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h2 className="text-6xl font-extrabold text-primary-600 mb-6">404</h2>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h3>
          <p className="text-gray-500 mb-6">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
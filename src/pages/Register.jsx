import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa'

function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        // Remove confirmPassword as it's not needed for the API
        const { confirmPassword, ...registerData } = values
        await register(registerData)
        navigate('/')
      } catch (error) {
        console.error('Registration error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formik.touched.name && formik.errors.name 
                      ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {formik.touched.name && formik.errors.name ? (
                <p className="mt-2 text-sm text-error-600">{formik.errors.name}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formik.touched.email && formik.errors.email 
                      ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  placeholder="you@example.com"
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <p className="mt-2 text-sm text-error-600">{formik.errors.email}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formik.touched.password && formik.errors.password 
                      ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <p className="mt-2 text-sm text-error-600">{formik.errors.password}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword 
                      ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <p className="mt-2 text-sm text-error-600">{formik.errors.confirmPassword}</p>
              ) : null}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
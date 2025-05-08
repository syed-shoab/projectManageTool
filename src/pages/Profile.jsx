import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaEnvelope, FaBriefcase, FaLock, FaSpinner } from 'react-icons/fa'
import PageHeader from '../components/common/PageHeader'

function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, updateProfile } = useAuth()
  
  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      position: user?.position || '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      position: Yup.string(),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .test('passwords-match', 'Passwords must match', function (value) {
          return !value || !this.parent.confirmPassword || value === this.parent.confirmPassword
        }),
      confirmPassword: Yup.string()
        .test('passwords-match', 'Passwords must match', function (value) {
          return !value || !this.parent.password || value === this.parent.password
        }),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        
        // Only include password if provided
        const updateData = {
          name: values.name,
          email: values.email,
          position: values.position,
        }
        
        if (values.password) {
          updateData.password = values.password
        }
        
        await updateProfile(updateData)
        setIsEditing(false)
      } catch (error) {
        console.error('Profile update error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })
  
  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name || '',
        email: user.email || '',
        position: user.position || '',
        password: '',
        confirmPassword: '',
      })
    }
  }, [user])
  
  return (
    <div>
      <PageHeader
        title="Your Profile"
        subtitle="Manage your account information"
      />
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
        
        <div className="px-6 py-5">
          {isEditing ? (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="form-label">
                  <FaUser className="inline mr-2 text-gray-400" />
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-input ${
                    formik.touched.name && formik.errors.name ? 'border-error-500' : ''
                  }`}
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="form-error">{formik.errors.name}</div>
                ) : null}
              </div>
              
              <div>
                <label htmlFor="email" className="form-label">
                  <FaEnvelope className="inline mr-2 text-gray-400" />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${
                    formik.touched.email && formik.errors.email ? 'border-error-500' : ''
                  }`}
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="form-error">{formik.errors.email}</div>
                ) : null}
              </div>
              
              <div>
                <label htmlFor="position" className="form-label">
                  <FaBriefcase className="inline mr-2 text-gray-400" />
                  Job Position
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  className="form-input"
                  {...formik.getFieldProps('position')}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                
                <div>
                  <label htmlFor="password" className="form-label">
                    <FaLock className="inline mr-2 text-gray-400" />
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`form-input ${
                      formik.touched.password && formik.errors.password ? 'border-error-500' : ''
                    }`}
                    {...formik.getFieldProps('password')}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="form-error">{formik.errors.password}</div>
                  ) : null}
                </div>
                
                <div className="mt-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    <FaLock className="inline mr-2 text-gray-400" />
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`form-input ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-error-500' : ''
                    }`}
                    {...formik.getFieldProps('confirmPassword')}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <div className="form-error">{formik.errors.confirmPassword}</div>
                  ) : null}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    <FaUser className="inline mr-2 text-gray-400" />
                    Full Name
                  </p>
                  <p className="text-base font-medium text-gray-900">{user?.name || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    <FaEnvelope className="inline mr-2 text-gray-400" />
                    Email Address
                  </p>
                  <p className="text-base font-medium text-gray-900">{user?.email || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  <FaBriefcase className="inline mr-2 text-gray-400" />
                  Job Position
                </p>
                <p className="text-base font-medium text-gray-900">{user?.position || 'Team Member'}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  <FaLock className="inline mr-2 text-gray-400" />
                  Password
                </p>
                <p className="text-base font-medium text-gray-900">••••••••</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
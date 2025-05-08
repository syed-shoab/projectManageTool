import { FaExclamationTriangle } from 'react-icons/fa'

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        ></div>
        
        <div 
          className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center mr-3">
              <FaExclamationTriangle className="text-error-600" />
            </div>
            <h3 
              className="text-lg font-semibold text-gray-900"
              id="modal-headline"
            >
              {title}
            </h3>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-error-600 hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500"
              onClick={() => {
                onConfirm()
                onClose()
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
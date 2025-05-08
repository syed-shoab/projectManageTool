import { useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'

function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null)
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])
  
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        ></div>
        
        <div 
          ref={modalRef}
          className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-lg font-semibold text-gray-900"
              id="modal-headline"
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
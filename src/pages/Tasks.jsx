import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import PageHeader from '../components/common/PageHeader'
import TaskList from '../components/tasks/TaskList'
import Modal from '../components/common/Modal'
import TaskForm from '../components/tasks/TaskForm'

function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Manage all your tasks across projects"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            New Task
          </button>
        }
      />
      
      <TaskList />
      
      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Task"
      >
        <TaskForm
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Tasks
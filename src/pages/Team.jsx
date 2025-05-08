import { useState } from 'react'
import { FaPlus, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import PageHeader from '../components/common/PageHeader'

function Team() {
  // Mock team members data
  const [teamMembers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Project Manager',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      projects: 8,
      tasks: 24,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'UI/UX Designer',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      projects: 6,
      tasks: 18,
    },
    {
      id: '3',
      name: 'David Johnson',
      email: 'david.johnson@example.com',
      position: 'Frontend Developer',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      projects: 5,
      tasks: 15,
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily.wilson@example.com',
      position: 'Backend Developer',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      phone: '+1 (555) 321-6547',
      location: 'Seattle, WA',
      projects: 7,
      tasks: 22,
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      position: 'Full Stack Developer',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      phone: '+1 (555) 789-1234',
      location: 'Chicago, IL',
      projects: 4,
      tasks: 12,
    },
    {
      id: '6',
      name: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      position: 'QA Engineer',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      phone: '+1 (555) 654-9870',
      location: 'Miami, FL',
      projects: 3,
      tasks: 9,
    },
  ])
  
  return (
    <div>
      <PageHeader
        title="Team Members"
        subtitle="Manage your team and collaborate on projects"
        actions={
          <button className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" />
            Add Member
          </button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative pb-3">
              <div className="h-24 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <div className="absolute top-12 left-6">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                />
              </div>
            </div>
            
            <div className="px-6 pt-3 pb-6">
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.position}</p>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{member.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaPhone className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{member.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaMapMarkerAlt className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{member.location}</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <p className="text-lg font-semibold text-gray-800">{member.projects}</p>
                  <p className="text-xs text-gray-500 uppercase">Projects</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <p className="text-lg font-semibold text-gray-800">{member.tasks}</p>
                  <p className="text-xs text-gray-500 uppercase">Tasks</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <button className="btn-primary py-1 px-4 text-sm">View Profile</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Team
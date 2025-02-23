import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiX, FiUser, FiMail, FiPhone, FiMapPin, 
  FiClock, FiShield, FiEdit2, FiAlertCircle 
} from 'react-icons/fi';

export default function UserProfileModal({ user, onClose, onEdit, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('details');

  // Mock activity log - Replace with API data
  const activityLog = [
    {
      action: 'Login',
      timestamp: '2024-02-20T10:30:00',
      details: 'Logged in from Mumbai, India'
    },
    {
      action: 'Profile Update',
      timestamp: '2024-02-19T15:45:00',
      details: 'Updated contact information'
    },
    // Add more activities
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
            <p className="text-gray-600 mt-1">ID: {user.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-4 px-6">
            {[
              { id: 'details', label: 'Details', icon: <FiUser /> },
              { id: 'activity', label: 'Activity Log', icon: <FiClock /> },
              { id: 'security', label: 'Security', icon: <FiShield /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1 text-gray-900">{user.role}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Region</label>
                  <p className="mt-1 text-gray-900">{user.region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Policies</label>
                  <div className="mt-1 space-y-1">
                    {user.policies.map(policy => (
                      <div key={policy} className="text-sm text-gray-900">
                        {policy}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {activityLog.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <FiClock className="mt-1 text-gray-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {activity.action}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {activity.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Password Management</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Last password change: 30 days ago
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Reset Password
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Status: Not Enabled
                </p>
                <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiEdit2 />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => onStatusChange(user.id, user.status === 'Active' ? 'Suspended' : 'Active')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  user.status === 'Active'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <FiAlertCircle />
                <span>{user.status === 'Active' ? 'Suspend User' : 'Activate User'}</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
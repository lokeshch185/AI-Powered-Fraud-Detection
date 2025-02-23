import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiDownload, FiUserPlus, 
  FiBell, FiMoreVertical 
} from 'react-icons/fi';
import UserTable from '../components/UserTable';
import UserProfileModal from '../components/UserProfileModal';
import AddEditUserModal from '../components/ModifyUserModal';
import { toast } from 'react-toastify';
import Sidebar from '../components/admin/layouts/Sidebar';  

export default function UserManagementPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    role: [],
    status: [],
    region: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddUser = (userData) => {
    // API call to add user
    toast.success('User added successfully');
    setShowAddUser(false);
  };

  const handleEditUser = (userData) => {
    // API call to edit user
    toast.success('User updated successfully');
    setShowUserProfile(false);
  };

  const handleDeleteUser = (userId) => {
    // API call to delete user
    toast.success('User deleted successfully');
  };

  const handleStatusChange = (userId, newStatus) => {
    // API call to update user status
    toast.success(`User status updated to ${newStatus}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Sidebar Toggle Button */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                  User Management
                </h1>
              </div>

              {/* Existing header controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 md:flex-none md:w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    showFilters 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FiFilter className="mr-2" />
                  Filters
                </button>

                {/* Export Button */}
                <button className="flex items-center px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  <FiDownload className="mr-2" />
                  Export
                </button>

                {/* Add User Button */}
                <button
                  onClick={() => setShowAddUser(true)}
                  className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <FiUserPlus className="mr-2" />
                  Add User
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Role Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      multiple
                      className="w-full rounded-lg border-gray-300"
                      value={filters.role}
                      onChange={(e) => setFilters({
                        ...filters,
                        role: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                    >
                      <option value="policyholder">Policyholder</option>
                      <option value="investigator">Investigator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      multiple
                      className="w-full rounded-lg border-gray-300"
                      value={filters.status}
                      onChange={(e) => setFilters({
                        ...filters,
                        status: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Region Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      multiple
                      className="w-full rounded-lg border-gray-300"
                      value={filters.region}
                      onChange={(e) => setFilters({
                        ...filters,
                        region: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                    >
                      <option value="north">North</option>
                      <option value="south">South</option>
                      <option value="east">East</option>
                      <option value="west">West</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserTable
            onViewProfile={(user) => {
              setSelectedUser(user);
              setShowUserProfile(true);
            }}
            onEditUser={(user) => {
              setSelectedUser(user);
              setShowAddUser(true);
            }}
            onDeleteUser={handleDeleteUser}
            onStatusChange={handleStatusChange}
            filters={filters}
            searchQuery={searchQuery}
          />
        </main>

        {/* Modals */}
        {showAddUser && (
          <AddEditUserModal
            user={selectedUser}
            onClose={() => {
              setShowAddUser(false);
              setSelectedUser(null);
            }}
            onSubmit={selectedUser ? handleEditUser : handleAddUser}
          />
        )}

        {showUserProfile && selectedUser && (
          <UserProfileModal
            user={selectedUser}
            onClose={() => {
              setShowUserProfile(false);
              setSelectedUser(null);
            }}
            onEdit={() => {
              setShowUserProfile(false);
              setShowAddUser(true);
            }}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
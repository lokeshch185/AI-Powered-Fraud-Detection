import { useState } from 'react';
import { 
  FiEdit2, FiTrash2, FiEye, FiMoreVertical,
  FiChevronDown, FiChevronUp 
} from 'react-icons/fi';

export default function UserTable({ 
  onViewProfile, 
  onEditUser, 
  onDeleteUser, 
  onStatusChange,
  filters,
  searchQuery 
}) {
  const [sortConfig, setSortConfig] = useState({ key: 'lastActive', direction: 'desc' });
  const [selectedRows, setSelectedRows] = useState([]);

  // Mock data - Replace with API data
  const users = [
    {
      id: 'SBI001',
      name: 'lokesh',
      email: 'lokesh@sbi.co.in', 
      role: 'Admin',
      status: 'Active',
      lastActive: '2024-02-20T10:30:00',
      region: 'Mumbai Region',
      policies: ['POL-001', 'POL-002'],
      phone: '+91 98765 43210'
    },
    {
      id: 'SBI002',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@sbi.co.in',
      role: 'Manager',
      status: 'Pending',
      lastActive: '2024-02-20T10:30:00',
      region: 'North',
      policies: ['POL-001', 'POL-002'],
      phone: '+91 98765 43210'
    },
    // Add more mock users
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'text-green-600 bg-green-50',
      'Suspended': 'text-red-600 bg-red-50',
      'Pending': 'text-yellow-600 bg-yellow-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedUsers = [...users]
    .filter(user => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(user => {
      if (filters.role.length && !filters.role.includes(user.role.toLowerCase())) return false;
      if (filters.status.length && !filters.status.includes(user.status.toLowerCase())) return false;
      if (filters.region.length && !filters.region.includes(user.region.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === sortedUsers.length 
        ? [] 
        : sortedUsers.map(user => user.id)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === sortedUsers.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {[
                { key: 'id', label: 'User ID' },
                { key: 'name', label: 'Full Name' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Role' },
                { key: 'status', label: 'Status' },
                { key: 'lastActive', label: 'Last Active' },
                { key: 'actions', label: 'Actions' }
              ].map(column => (
                <th
                  key={column.key}
                  onClick={() => column.key !== 'actions' && handleSort(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.key !== 'actions' && sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="w-8 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleRowSelect(user.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusColor(user.status)
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastActive).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onViewProfile(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Profile"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit User"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete User"
                    >
                      <FiTrash2 />
                    </button>
                    <div className="relative">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        title="More Actions"
                      >
                        <FiMoreVertical />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
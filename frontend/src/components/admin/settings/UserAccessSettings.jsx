import { useState } from 'react';
import { 
  FiUserCheck, FiShield, FiLock, FiUnlock, FiInfo,
  FiAlertTriangle, FiPlus, FiTrash2, FiEdit2, FiSave,
  FiX, FiCheck 
} from 'react-icons/fi';

export default function UserAccessSettings({ settings, onChange }) {
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Default roles and their permissions
  const defaultRoles = {
    admin: {
      name: 'Administrator',
      description: 'Full system access',
      permissions: {
        dashboard: ['view', 'edit'],
        claims: ['view', 'edit', 'delete', 'approve'],
        users: ['view', 'edit', 'delete', 'create'],
        settings: ['view', 'edit'],
        reports: ['view', 'export']
      }
    },
    investigator: {
      name: 'Investigator',
      description: 'Claim investigation and processing',
      permissions: {
        dashboard: ['view'],
        claims: ['view', 'edit', 'investigate'],
        users: ['view'],
        reports: ['view']
      }
    },
    user: {
      name: 'Basic User',
      description: 'Limited access for policyholders',
      permissions: {
        dashboard: ['view'],
        claims: ['view', 'create'],
        users: ['view']
      }
    }
  };

  const permissionCategories = {
    dashboard: 'Dashboard Access',
    claims: 'Claims Management',
    users: 'User Management',
    settings: 'System Settings',
    reports: 'Reports & Analytics'
  };

  const permissionActions = {
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    approve: 'Approve',
    investigate: 'Investigate',
    export: 'Export'
  };

  const handlePermissionToggle = (role, category, action) => {
    const currentPerms = settings?.roles?.[role]?.permissions?.[category] || [];
    const updatedPerms = currentPerms.includes(action)
      ? currentPerms.filter(p => p !== action)
      : [...currentPerms, action];

    onChange({
      roles: {
        ...settings?.roles,
        [role]: {
          ...settings?.roles?.[role],
          permissions: {
            ...settings?.roles?.[role]?.permissions,
            [category]: updatedPerms
          }
        }
      }
    });
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;

    onChange({
      roles: {
        ...settings?.roles,
        [newRoleName.toLowerCase()]: {
          name: newRoleName,
          description: '',
          permissions: {}
        }
      }
    });
    setNewRoleName('');
  };

  const handleDeleteRole = (roleId) => {
    const updatedRoles = { ...settings?.roles };
    delete updatedRoles[roleId];
    onChange({ roles: updatedRoles });
    setShowDeleteConfirm(null);
  };

  const handleUpdateRole = (roleId, updates) => {
    onChange({
      roles: {
        ...settings?.roles,
        [roleId]: {
          ...settings?.roles?.[roleId],
          ...updates
        }
      }
    });
    setEditingRole(null);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">User Access Control</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage roles and permissions for different user types
        </p>
      </div>

      {/* Add New Role */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter new role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddRole}
            disabled={!newRoleName.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FiPlus />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      {/* Roles and Permissions */}
      <div className="space-y-6">
        {Object.entries(settings?.roles || defaultRoles).map(([roleId, role]) => (
          <div key={roleId} className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
            {/* Role Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {editingRole === roleId ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={role.name}
                      onChange={(e) => handleUpdateRole(roleId, { name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={role.description}
                      onChange={(e) => handleUpdateRole(roleId, { description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingRole(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateRole(roleId, { name: role.name, description: role.description })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingRole(roleId)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FiEdit2 />
                </button>
                {roleId !== 'admin' && (
                  <button
                    onClick={() => setShowDeleteConfirm(roleId)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>

            {/* Permissions Grid */}
            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(permissionCategories).map(([category, categoryName]) => (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {categoryName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(permissionActions).map(([action, actionName]) => (
                            <button
                              key={action}
                              onClick={() => handlePermissionToggle(roleId, category, action)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                role.permissions?.[category]?.includes(action)
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {role.permissions?.[category]?.includes(action) ? (
                                <FiCheck className="mr-1" />
                              ) : (
                                <FiLock className="mr-1" />
                              )}
                              {actionName}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm === roleId && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  Are you sure you want to delete this role? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteRole(roleId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Role
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Warning Message */}
      <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
        <FiAlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-700">
          Changes to role permissions will affect all users assigned to these roles.
          Please review carefully before saving changes.
        </p>
      </div>
    </div>
  );
}

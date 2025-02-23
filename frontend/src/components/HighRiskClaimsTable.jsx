import { useState } from 'react';
import { 
  FiAlertTriangle, FiEye, FiUserPlus, FiMessageSquare,
  FiChevronDown, FiChevronUp, FiFilter, FiDownload, FiMoreVertical 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function HighRiskClaimsTable({ onViewDetails }) {
  const [sortConfig, setSortConfig] = useState({ key: 'riskScore', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({
    riskLevel: [],
    policyType: [],
    status: []
  });

  // Mock data - Replace with API data
  const claims = [
    {
      id: 'CLM001',
      policyholder: 'Rajesh Kumar',
      policyType: 'Life Insurance',
      amount: '₹5,00,000',
      submissionDate: '2024-02-20',
      riskScore: 85,
      status: 'Under Investigation',
      flags: ['Multiple Policies', 'Document Mismatch'],
      assignedTo: 'Investigator A'
    },
    {
      id: 'CLM002',
      policyholder: 'Priya Singh',
      policyType: 'Health Insurance',
      amount: '₹2,50,000',
      submissionDate: '2024-02-19',
      riskScore: 92,
      status: 'Pending Review',
      flags: ['Unusual Pattern', 'High Value'],
      assignedTo: null
    },
    // Add more mock data as needed
  ];

  const getRiskLevelColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Under Investigation': 'text-orange-600 bg-orange-50',
      'Pending Review': 'text-blue-600 bg-blue-50',
      'Flagged': 'text-red-600 bg-red-50',
      'Cleared': 'text-green-600 bg-green-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedClaims = [...claims].sort((a, b) => {
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
      selectedRows.length === claims.length ? [] : claims.map(claim => claim.id)
    );
  };

  return (
    <div className="w-full">
      {/* Table Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-300'
            }`}
          >
            <FiFilter />
            <span>Filters</span>
          </button>

          {selectedRows.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedRows.length} selected
              </span>
              <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                Assign to Investigator
              </button>
              <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                Export Selected
              </button>
            </div>
          )}
        </div>

        <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <FiDownload />
          <span>Export All</span>
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Risk Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Level
                </label>
                <select
                  multiple
                  className="w-full rounded-lg border-gray-300 text-sm"
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({
                    ...filters,
                    riskLevel: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  <option value="high">High Risk (80+)</option>
                  <option value="medium">Medium Risk (60-79)</option>
                  <option value="low">Low Risk (&lt;60)</option>
                </select>
              </div>

              {/* Policy Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Type
                </label>
                <select
                  multiple
                  className="w-full rounded-lg border-gray-300 text-sm"
                  value={filters.policyType}
                  onChange={(e) => setFilters({
                    ...filters,
                    policyType: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  <option value="life">Life Insurance</option>
                  <option value="health">Health Insurance</option>
                  <option value="vehicle">Vehicle Insurance</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  multiple
                  className="w-full rounded-lg border-gray-300 text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters({
                    ...filters,
                    status: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  <option value="investigation">Under Investigation</option>
                  <option value="pending">Pending Review</option>
                  <option value="flagged">Flagged</option>
                  <option value="cleared">Cleared</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === claims.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {[
                  { key: 'id', label: 'Claim ID' },
                  { key: 'policyholder', label: 'Policyholder' },
                  { key: 'policyType', label: 'Policy Type' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'riskScore', label: 'Risk Score' },
                  { key: 'status', label: 'Status' },
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
              {sortedClaims.map(claim => (
                <tr 
                  key={claim.id}
                  className="hover:bg-gray-50"
                >
                  <td className="w-8 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(claim.id)}
                      onChange={() => handleRowSelect(claim.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.policyholder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.policyType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getRiskLevelColor(claim.riskScore)
                    }`}>
                      {claim.riskScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(claim.status)
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onViewDetails(claim)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Assign Investigator"
                      >
                        <FiUserPlus />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Add Note"
                      >
                        <FiMessageSquare />
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
    </div>
  );
}
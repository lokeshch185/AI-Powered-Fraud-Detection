import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiDownload, FiEye, FiUpload, 
  FiMessageSquare, FiX, FiChevronDown, FiCalendar, FiMenu 
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Sidebar from '../components/Sidebar';

export default function ClaimsHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockClaims = [
    {
      id: 'CLM001',
      policyType: 'Health Insurance',
      amount: 50000,
      dateFiled: '2024-02-20',
      status: 'In Progress',
      riskScore: 'Low',
      description: 'Medical expenses for hospitalization',
      documents: ['medical_report.pdf', 'bills.pdf'],
      timeline: [
        { date: '2024-02-20', status: 'Submitted' },
        { date: '2024-02-21', status: 'Under Review' }
      ]
    },
    // Add more mock claims as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-600"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <div>
                <h1 className="text-xl font-semibold">Claims History</h1>
                <p className="text-sm text-gray-600">View and manage your claims</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <img 
                src="/avatar.png" 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search claims..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FiFilter className="mr-2" />
                Filters
              </button>

              {/* Export Button */}
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <option>All Statuses</option>
                        <option>In Progress</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>

                    {/* Policy Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Policy Type
                      </label>
                      <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <option>All Types</option>
                        <option>Health Insurance</option>
                        <option>Vehicle Insurance</option>
                        <option>Life Insurance</option>
                      </select>
                    </div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Claim ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Filed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {claim.id}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {claim.policyType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{claim.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(claim.dateFiled).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${claim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            claim.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${claim.riskScore === 'Low' ? 'bg-green-100 text-green-800' :
                            claim.riskScore === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {claim.riskScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedClaim(claim)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FiEye />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiUpload />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiMessageSquare />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">
                    Showing
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="mx-1 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    entries
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Claim Details Modal */}
      <AnimatePresence>
        {selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold">Claim Details</h2>
                  <button
                    onClick={() => setSelectedClaim(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Claim Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Claim ID</h3>
                      <p className="mt-1">{selectedClaim.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Policy Type</h3>
                      <p className="mt-1">{selectedClaim.policyType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                      <p className="mt-1">₹{selectedClaim.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="mt-1">{selectedClaim.status}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{selectedClaim.description}</p>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
                    <div className="space-y-2">
                      {selectedClaim.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span>{doc}</span>
                          <button className="text-blue-600 hover:text-blue-800">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
                    <div className="space-y-4">
                      {selectedClaim.timeline.map((event, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <div className="h-full w-0.5 bg-blue-200"></div>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Analysis */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Analysis</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Document', score: 0.8 },
                          { name: 'Amount', score: 0.6 },
                          { name: 'History', score: 0.9 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="score" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Upload Additional Documents
                    </button>
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

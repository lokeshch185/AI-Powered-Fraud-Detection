import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiBell, FiMenu, FiMoreVertical, FiDownload, FiStar
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import Sidebar from '../components/admin/layouts/Sidebar';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Mock data for charts
  const claimStatusData = [
    { name: 'Approved', value: 45, color: '#34D399' },
    { name: 'Pending', value: 30, color: '#FBBF24' },
    { name: 'Rejected', value: 15, color: '#F87171' },
    { name: 'Investigating', value: 10, color: '#60A5FA' }
  ];

  const fraudTrendData = [
    { month: 'Jan', cases: 12 },
    { month: 'Feb', cases: 19 },
    { month: 'Mar', cases: 15 },
    { month: 'Apr', cases: 21 },
    { month: 'May', cases: 14 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-600"
              >
                <FiMenu size={24} />
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2">
                <FiBell size={24} className="text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <img
                src="/admin-avatar.jpg"
                alt="Admin"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              {
                title: 'Total Claims',
                value: '2,456',
                change: '+12%',
                color: 'blue'
              },
              {
                title: 'Under Investigation',
                value: '85',
                change: '-5%',
                color: 'yellow'
              },
              {
                title: 'Fraud Cases',
                value: '32',
                change: '+8%',
                color: 'red'
              },
              {
                title: 'High-Risk Claims',
                value: '126',
                change: '+15%',
                color: 'orange'
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-gray-600 mb-2">{card.title}</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{card.value}</span>
                  <span className={`text-sm ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {card.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Claims Status Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Claims Status</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreVertical />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={claimStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {claimStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fraud Trend Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Fraud Trends</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreVertical />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fraudTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cases"
                      stroke="#1B4F9B"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Claims Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Claims</h2>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <FiDownload />
                  <span>Export</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Claim ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Policyholder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      id: 'CLM001',
                      name: 'John Doe',
                      amount: '₹50,000',
                      status: 'Pending',
                      risk: 'Low'
                    },
                    {
                      id: 'CLM002',
                      name: 'Jane Smith',
                      amount: '₹1,25,000',
                      status: 'Investigating',
                      risk: 'High'
                    }
                  ].map((claim, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {claim.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {claim.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {claim.amount}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${claim.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${claim.risk === 'Low'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {claim.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
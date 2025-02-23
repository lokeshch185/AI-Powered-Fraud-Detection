import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHome, FiFileText, FiClock, FiUser, FiHelpCircle, FiLogOut,
  FiBell, FiMenu, FiX, FiAlertTriangle, FiUpload, FiMessageSquare 
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        className={`fixed md:static w-64 h-screen bg-white shadow-lg z-30`}
      >
        <div className="p-6">
          <img src="/sbi-logo.png" alt="SBI Logo" className="h-8 mb-8" />
          
          <nav className="space-y-2">
            {[
              { icon: <FiHome />, label: 'Dashboard', active: true },
              { icon: <FiFileText />, label: 'File a Claim' },
              { icon: <FiClock />, label: 'Claims History' },
              { icon: <FiUser />, label: 'Profile' },
              { icon: <FiHelpCircle />, label: 'Support' },
            ].map((item, index) => (
              <button
                key={index}
                className={`flex items-center w-full p-3 rounded-lg text-left space-x-3
                  ${item.active 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <button className="flex items-center w-full p-3 text-red-600 space-x-3 mt-8">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Top Header */}
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
                <h1 className="text-xl font-semibold">Welcome, Rajesh Kumar</h1>
                <p className="text-sm text-gray-600">Last login: Today, 10:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2">
                <FiBell size={24} className="text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <img 
                src="/avatar.jpg" 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Active Policies', value: '3', color: 'blue' },
              { title: 'Claims in Process', value: '2', color: 'yellow' },
              { title: 'Approved Claims', value: '5', color: 'green' },
              { title: 'Fraud Risk Score', value: 'Low', color: 'green' },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-gray-600 mb-2">{card.title}</h3>
                <p className={`text-2xl font-bold text-${card.color}-600`}>
                  {card.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FiFileText />, label: 'File New Claim' },
              { icon: <FiUpload />, label: 'Upload Documents' },
              { icon: <FiMessageSquare />, label: 'Contact Support' },
            ].map((action, index) => (
              <button
                key={index}
                className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Recent Claims Table */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Claims</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Claim ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Policy Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Risk Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      id: 'CLM001',
                      type: 'Health Insurance',
                      status: 'In Progress',
                      date: '2024-02-20',
                      risk: 'Low'
                    },
                    {
                      id: 'CLM002',
                      type: 'Vehicle Insurance',
                      status: 'Approved',
                      date: '2024-02-18',
                      risk: 'Low'
                    }
                  ].map((claim, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {claim.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {claim.type}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs
                          ${claim.status === 'Approved' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {claim.date}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-green-600 flex items-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                          {claim.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiAlertTriangle className="text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Fraud Prevention Tip</h3>
                    <p className="text-sm text-gray-600">
                      Always verify communication from SBI through official channels.
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Jan', value: 12 },
                      { name: 'Feb', value: 19 },
                      { name: 'Mar', value: 15 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
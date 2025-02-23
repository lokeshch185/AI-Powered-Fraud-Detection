import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FiSearch, FiBell, FiMenu, FiMoreVertical, FiUpload, FiTrendingUp,
  FiCheckCircle, FiAlertTriangle, FiClock, FiShield, FiUsers
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend, AreaChart, Area
} from 'recharts';
import Sidebar from '../components/admin/layouts/Sidebar';

const theme = {
  primary: '#1B4F9B',
  secondary: '#E3F2FD',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  background: '#F9FAFB'
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/dashboard-stats`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': theme.warning,
      'Approved': theme.success,
      'Rejected': theme.danger,
      'High': theme.danger,
      'Medium': theme.warning,
      'Low': theme.success
    };
    return colors[status] || theme.primary;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <QuickStatCard title="Total Claims" value={dashboardData?.totalClaims} icon={<FiCheckCircle />} color={theme.primary} trend="+12%" />
            <QuickStatCard title="High Risk Claims" value={dashboardData?.highRiskClaims} icon={<FiAlertTriangle />} color={theme.danger} trend="+5%" />
            <QuickStatCard title="Pending Review" value={dashboardData?.pendingClaims} icon={<FiClock />} color={theme.warning} trend="-3%" />
            <QuickStatCard title="Approved Today" value={dashboardData?.approvedToday} icon={<FiShield />} color={theme.success} trend="+8%" />
          </div>

          {/* Charts Row */}
          <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            {/* Product Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Product Distribution</h2>
                <select className="text-sm bg-white/50 border-0 rounded-lg px-3 py-1 hover:bg-white">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData?.productDistribution}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardData?.productDistribution?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={[
                            '#1B4F9B', '#34D399', '#FBBF24', 
                            '#F87171', '#60A5FA', '#8B5CF6'
                          ][index % 6]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [`${value} claims`, `${name}`]}
                    />
                    <Legend 
                      layout="horizontal" 
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{ paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Claims Status Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Claims Status</h2>
                <select className="text-sm bg-white/50 border-0 rounded-lg px-3 py-1 hover:bg-white">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData?.claimsByStatus}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardData?.claimsByStatus?.map((entry) => (
                        <Cell 
                          key={entry._id}
                          fill={
                            entry._id === 'Approved' ? '#34D399' :
                            entry._id === 'Pending' ? '#FBBF24' : '#F87171'
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [`${value} claims`, `${name}`]}
                    />
                    <Legend 
                      layout="horizontal" 
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{ paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Monthly Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Claims Monthly Trend</h2>
              <select className="text-sm bg-white/50 border-0 rounded-lg px-3 py-1 hover:bg-white">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData?.monthlyTrend}>
                  <defs>
                    <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B4F9B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1B4F9B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month"
                    tickFormatter={(value) => {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      return months[value - 1];
                    }}
                    stroke="#6B7280"
                  />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(value) => {
                      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                                    'July', 'August', 'September', 'October', 'November', 'December'];
                      return `${months[value - 1]} ${new Date().getFullYear()}`;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#1B4F9B" 
                    fillOpacity={1} 
                    fill="url(#colorClaims)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Claims */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Claims</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Claim ID</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Risk Level</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentClaims.map((claim) => (
                    <tr key={claim.claim_id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{claim.claim_id}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={claim.status} />
                      </td>
                      <td className="px-4 py-2">
                        <RiskBadge risk={claim.risk_level} />
                      </td>
                      <td className="px-4 py-2">{formatCurrency(claim.sum_assured)}</td>
                      <td className="px-4 py-2">{new Date(claim.claim_date).toLocaleDateString()}</td>
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

const QuickStatCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    className="p-4 bg-white rounded-lg shadow-lg flex items-center justify-between"
  >
    <div>
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</p>
    </div>
    <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
      <span className="text-xl" style={{ color }}>{icon}</span>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>{status}</span>
  );
};

const RiskBadge = ({ risk }) => {
  const colors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[risk]}`}>{risk}</span>
  );
};

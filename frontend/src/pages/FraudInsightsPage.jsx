import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiAlertTriangle, FiSearch, FiCalendar, FiDownload, 
  FiBell, FiMap, FiBarChart2, FiTrendingUp 
} from 'react-icons/fi';

// Import components we'll create next
import FraudHeatmap from '../components/FraudHeatmap';
import FraudTrendsChart from '../components/FraudTrendsChart';
import FraudIndicatorsChart from '../components/FraudIndicatorsChart';
import HighRiskClaimsTable from '../components/HighRiskClaimsTable';
import FraudDetailsModal from '../components/FraudDetailsModal';

export default function FraudDetectionPage() {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedCase, setSelectedCase] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock summary data
  const summaryData = {
    totalFraudCases: 156,
    highRiskClaims: 42,
    potentialSavings: '₹2.5 Cr',
    activeInvestigations: 28
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Fraud Detection Insights
            </h1>
            
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cases..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Date Range Picker */}
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiCalendar className="mr-2" />
                Select Date Range
              </button>

              {/* Export Button */}
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiDownload className="mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Fraud Cases',
              value: summaryData.totalFraudCases,
              icon: <FiAlertTriangle className="text-red-500" />,
              trend: '+12%'
            },
            {
              title: 'High Risk Claims',
              value: summaryData.highRiskClaims,
              icon: <FiBarChart2 className="text-orange-500" />,
              trend: '-5%'
            },
            {
              title: 'Potential Savings',
              value: summaryData.potentialSavings,
              icon: <FiTrendingUp className="text-green-500" />,
              trend: '+18%'
            },
            {
              title: 'Active Investigations',
              value: summaryData.activeInvestigations,
              icon: <FiMap className="text-blue-500" />,
              trend: '+3%'
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {card.icon}
                </div>
                <span className={`text-sm ${
                  card.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm">{card.title}</h3>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Fraud Insights Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Fraud Risk Heatmap</h2>
            <FraudHeatmap />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Fraud Trend Analysis</h2>
            <FraudTrendsChart />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Top Fraud Indicators</h2>
            <FraudIndicatorsChart />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">High Risk Claims</h2>
            <HighRiskClaimsTable 
              onViewDetails={(claim) => {
                setSelectedCase(claim);
                setShowDetailsModal(true);
              }}
            />
          </div>
        </div>
      </main>

      {/* Fraud Details Modal */}
      {showDetailsModal && selectedCase && (
        <FraudDetailsModal
          fraudCase={selectedCase}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}
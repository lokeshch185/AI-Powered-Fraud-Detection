import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/admin/layouts/Sidebar';
import { FiUpload, FiRefreshCw, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';

export default function FraudAnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5001/api/fraud-analytics');
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await axios.post('http://127.0.0.1:5001/api/fraud-analytics', formData);
      toast.success('CSV uploaded successfully');
      fetchAnalytics(); // Refresh analytics after upload
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Fraud Analytics Dashboard</h1>
                <p className="text-gray-600">Comprehensive analysis of insurance claims</p>
              </div>
              <div className="flex gap-4">
                <label className="relative inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <FiUpload className="mr-2" />
                  <span className="text-sm font-medium">Upload CSV</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                <button
                  onClick={fetchAnalytics}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>
          </header>

          {/* Summary Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SummaryCard
                icon={<FiBarChart2 className="w-6 h-6" />}
                title="Total Claims"
                value={analytics.summary.total_claims}
                color="blue"
              />
              <SummaryCard
                icon={<FiPieChart className="w-6 h-6" />}
                title="Average Premium"
                value={`$${analytics.summary.avg_premium.toFixed(2)}`}
                color="green"
              />
              <SummaryCard
                icon={<FiTrendingUp className="w-6 h-6" />}
                title="Recent Claims"
                value={analytics.summary.recent_claims}
                color="purple"
              />
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              // Skeleton loaders for charts
              Array(6).fill(null).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))
            ) : analytics && (
              <>
                <ChartCard
                  title="Cluster Analysis"
                  plot={analytics.plots.cluster_scatter}
                />
                <ChartCard
                  title="Distribution Analysis"
                  plot={analytics.plots.cluster_distribution}
                />
                <ChartCard
                  title="Correlation Analysis"
                  plot={analytics.plots.correlation_heatmap}
                />
                {Object.entries(analytics.plots.feature_distributions).map(([feature, plot]) => (
                  <ChartCard
                    key={feature}
                    title={`${feature.replace('_', ' ').charAt(0).toUpperCase() + feature.slice(1)} Distribution`}
                    plot={plot}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const SummaryCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      </div>
      <div className={`p-3 bg-${color}-50 rounded-lg text-${color}-500`}>
        {icon}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, plot }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="relative aspect-[4/3]">
      <img 
        src={`data:image/svg+xml;base64,${plot}`}
        alt={title}
        className="w-full h-full object-contain"
      />
    </div>
  </div>
);
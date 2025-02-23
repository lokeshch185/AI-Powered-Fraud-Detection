import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiSave, FiBell, FiAlertCircle,
  FiSettings, FiShield, FiUserCheck, FiLink,
  FiActivity, FiGlobe
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Import components
import GeneralSettings from '../components/admin/settings/GeneralSettings';
import SecuritySettings from '../components/admin/settings/SecuritySettings';
import FraudDetectionSettings from '../components/admin/settings/FraudDetectionSettings';
import UserAccessSettings from '../components/admin/settings/UserAccessSettings';
import IntegrationSettings from '../components/admin/settings/IntegrationSettings';
import AuditLogs from '../components/admin/settings/AuditLogs';

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    general: {},
    security: {},
    fraudDetection: {},
    userAccess: {},
    integrations: {}
  });

  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'General Settings', icon: <FiSettings /> },
    { id: 'security', label: 'Security Settings', icon: <FiShield /> },
    { id: 'fraudDetection', label: 'Fraud Detection', icon: <FiAlertCircle /> },
    { id: 'userAccess', label: 'User Access Control', icon: <FiUserCheck /> },
    { id: 'integrations', label: 'Integrations', icon: <FiLink /> },
    { id: 'auditLogs', label: 'Audit Logs', icon: <FiActivity /> }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      await fetch('/api/admin/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      toast.success('Settings saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (section, updates) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    setHasUnsavedChanges(true);
  };

  // Filter tabs based on search
  const filteredTabs = tabs.filter(tab =>
    tab.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              System Settings
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              <button
                onClick={handleSaveChanges}
                disabled={!hasUnsavedChanges || isLoading}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  hasUnsavedChanges
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FiSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 space-y-1">
            {filteredTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              {activeTab === 'general' && (
                <GeneralSettings
                  settings={settings.general}
                  onChange={(updates) => handleSettingChange('general', updates)}
                />
              )}
              {activeTab === 'security' && (
                <SecuritySettings
                  settings={settings.security}
                  onChange={(updates) => handleSettingChange('security', updates)}
                />
              )}
              {activeTab === 'fraudDetection' && (
                <FraudDetectionSettings
                  settings={settings.fraudDetection}
                  onChange={(updates) => handleSettingChange('fraudDetection', updates)}
                />
              )}
              {activeTab === 'userAccess' && (
                <UserAccessSettings
                  settings={settings.userAccess}
                  onChange={(updates) => handleSettingChange('userAccess', updates)}
                />
              )}
              {activeTab === 'integrations' && (
                <IntegrationSettings
                  settings={settings.integrations}
                  onChange={(updates) => handleSettingChange('integrations', updates)}
                />
              )}
              {activeTab === 'auditLogs' && (
                <AuditLogs />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

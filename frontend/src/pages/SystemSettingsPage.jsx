import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiSave, FiBell, FiAlertCircle,
  FiSettings, FiShield, FiUserCheck, FiLink,
  FiActivity, FiGlobe
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Sidebar from '../components/admin/layouts/Sidebar';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useState({
    general: {
      organizationName: 'SBI General Insurance Co. Ltd.',
      organizationLogo: '/sbi-logo.png',
      contactEmail: 'customer.care@sbigeneral.in',
      contactPhone: '1800 102 1111',
      address: 'Corporate Office, Natraj, M V Road & Western Express Highway Junction, Andheri (East), Mumbai - 400069',
      defaultLanguage: 'en',
      timezone: 'Asia/Kolkata',
      defaultCurrency: 'INR'
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expiryDays: 90
      },
      mfaEnabled: true,
      sessionTimeout: 30, // minutes
      ipWhitelist: ['10.0.0.0/24', '192.168.1.0/24']
    },
    fraudDetection: {
      autoFlagThreshold: 85,
      highRiskAmount: 500000,
      suspiciousPatterns: [
        'Multiple claims in 30 days',
        'Claims from different locations',
        'Policy age less than 90 days'
      ],
      notificationEmails: ['fraud.alert@sbigeneral.in'],
      enableMLDetection: true
    },
    userAccess: {
      roles: [
        {
          name: 'Branch Manager',
          permissions: ['approve_claims', 'view_reports', 'manage_staff']
        },
        {
          name: 'Claims Officer',
          permissions: ['process_claims', 'view_policies', 'contact_customers']
        },
        {
          name: 'Policy Executive',
          permissions: ['create_policy', 'view_policies', 'basic_support']
        }
      ],
      branchAccess: [
        'Mumbai Region',
        'Delhi Region',
        'Kolkata Region',
        'Chennai Region'
      ]
    },
    integrations: {
      paymentGateways: [
        {
          name: 'SBI Payment Gateway',
          enabled: true,
          mode: 'production'
        },
        {
          name: 'RazorPay',
          enabled: true,
          mode: 'sandbox'
        }
      ],
      smsProviders: [
        {
          name: 'MSG91',
          enabled: true,
          templates: ['policy_issued', 'claim_status', 'payment_reminder']
        }
      ],
      emailService: {
        provider: 'AWS SES',
        enabled: true,
        dailyLimit: 100000
      },
      thirdPartyAPIs: [
        {
          name: 'IRDAI Verification',
          enabled: true,
          endpoint: 'https://api.irdai.gov.in/verify'
        },
        {
          name: 'Vehicle Database',
          enabled: true,
          endpoint: 'https://vahan.nic.in/api'
        }
      ]
    }
  });

  // Tabs configuration
  const tabs = [
    { 
      id: 'general', 
      label: 'General Settings', 
      icon: <FiSettings />,
      description: 'Basic organization and regional settings'
    },
    { 
      id: 'security', 
      label: 'Security Settings', 
      icon: <FiShield />,
      description: 'Access control and security policies'
    },
    { 
      id: 'fraudDetection', 
      label: 'Fraud Detection', 
      icon: <FiAlertCircle />,
      description: 'Claim verification and risk assessment'
    },
    { 
      id: 'userAccess', 
      label: 'User Access Control', 
      icon: <FiUserCheck />,
      description: 'Role management and branch access'
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      icon: <FiLink />,
      description: 'Payment and third-party service connections'
    },
    { 
      id: 'auditLogs', 
      label: 'Audit Logs', 
      icon: <FiActivity />,
      description: 'System activity and compliance tracking'
    }
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Sidebar Toggle Button */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                  System Settings
                </h1>
              </div>
              
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
    </div>
  );
}

import { useState } from 'react';
import { 
  FiAlertTriangle, FiSliders, FiBell, FiBarChart2,
  FiInfo, FiToggleLeft, FiToggleRight, FiHelpCircle 
} from 'react-icons/fi';

export default function FraudDetectionSettings({ settings, onChange }) {
  const [showThresholdHelp, setShowThresholdHelp] = useState(false);

  // Fraud indicators with descriptions
  const fraudIndicators = [
    {
      id: 'documentForgery',
      name: 'Document Forgery Detection',
      description: 'Analyzes submitted documents for signs of manipulation or forgery',
      category: 'Documentation'
    },
    {
      id: 'multipleSubmissions',
      name: 'Multiple Claim Submissions',
      description: 'Detects patterns of multiple claims from same policyholder',
      category: 'Behavior'
    },
    {
      id: 'identityMismatch',
      name: 'Identity Verification',
      description: 'Cross-references identity documents with external databases',
      category: 'Identity'
    },
    {
      id: 'unusualPatterns',
      name: 'Unusual Claim Patterns',
      description: 'Identifies statistically abnormal claim patterns',
      category: 'Analytics'
    },
    {
      id: 'networkAnalysis',
      name: 'Network Analysis',
      description: 'Detects suspicious connections between claims and parties',
      category: 'Analytics'
    }
  ];

  const handleThresholdChange = (type, value) => {
    onChange({
      riskThresholds: {
        ...settings?.riskThresholds,
        [type]: value
      }
    });
  };

  const handleIndicatorToggle = (indicatorId) => {
    onChange({
      enabledIndicators: {
        ...settings?.enabledIndicators,
        [indicatorId]: !settings?.enabledIndicators?.[indicatorId]
      }
    });
  };

  const getThresholdColor = (value) => {
    if (value <= 30) return 'bg-green-500';
    if (value <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Fraud Detection Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure AI-powered fraud detection parameters and risk thresholds
        </p>
      </div>

      {/* Risk Thresholds */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <FiSliders />
            <span>Risk Score Thresholds</span>
          </h3>
          <button
            type="button"
            onClick={() => setShowThresholdHelp(!showThresholdHelp)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiHelpCircle size={20} />
          </button>
        </div>

        {showThresholdHelp && (
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
            <p>Risk thresholds determine how claims are categorized and processed:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Low Risk (0-30): Standard processing</li>
              <li>Medium Risk (31-70): Enhanced verification</li>
              <li>High Risk (71-100): Manual review required</li>
            </ul>
          </div>
        )}

        <div className="space-y-6">
          {/* Low Risk Threshold */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Low Risk Threshold
              </label>
              <span className="text-sm text-gray-500">
                {settings?.riskThresholds?.low || 30}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings?.riskThresholds?.low || 30}
              onChange={(e) => handleThresholdChange('low', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${getThresholdColor(settings?.riskThresholds?.low || 30)} 0%, ${getThresholdColor(settings?.riskThresholds?.low || 30)} ${settings?.riskThresholds?.low || 30}%, #E5E7EB ${settings?.riskThresholds?.low || 30}%, #E5E7EB 100%)`
              }}
            />
          </div>

          {/* Medium Risk Threshold */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Medium Risk Threshold
              </label>
              <span className="text-sm text-gray-500">
                {settings?.riskThresholds?.medium || 70}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings?.riskThresholds?.medium || 70}
              onChange={(e) => handleThresholdChange('medium', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${getThresholdColor(settings?.riskThresholds?.medium || 70)} 0%, ${getThresholdColor(settings?.riskThresholds?.medium || 70)} ${settings?.riskThresholds?.medium || 70}%, #E5E7EB ${settings?.riskThresholds?.medium || 70}%, #E5E7EB 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Fraud Indicators */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <FiBarChart2 />
          <span>Fraud Indicators</span>
        </h3>

        <div className="space-y-4">
          {fraudIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{indicator.name}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {indicator.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{indicator.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleIndicatorToggle(indicator.id)}
                className={`ml-4 p-2 rounded-lg ${
                  settings?.enabledIndicators?.[indicator.id]
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {settings?.enabledIndicators?.[indicator.id] ? (
                  <FiToggleRight size={24} />
                ) : (
                  <FiToggleLeft size={24} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Alerts */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <FiBell />
          <span>Real-time Alert Settings</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">High Risk Alerts</label>
              <p className="text-sm text-gray-500">
                Send immediate notifications for high-risk claims
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ enableHighRiskAlerts: !settings?.enableHighRiskAlerts })}
              className={`p-2 rounded-lg ${
                settings?.enableHighRiskAlerts
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {settings?.enableHighRiskAlerts ? (
                <FiToggleRight size={24} />
              ) : (
                <FiToggleLeft size={24} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">Pattern Detection Alerts</label>
              <p className="text-sm text-gray-500">
                Alert when suspicious patterns are detected
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ enablePatternAlerts: !settings?.enablePatternAlerts })}
              className={`p-2 rounded-lg ${
                settings?.enablePatternAlerts
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {settings?.enablePatternAlerts ? (
                <FiToggleRight size={24} />
              ) : (
                <FiToggleLeft size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
        <FiAlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-700">
          Adjusting these settings will affect how the system identifies and processes potentially fraudulent claims. 
          Review changes carefully before saving.
        </p>
      </div>
    </div>
  );
}

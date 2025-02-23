import { useState } from 'react';
import { 
  FiLink, FiCloud, FiDatabase, FiMail, FiMessageSquare,
  FiEye, FiEyeOff, FiRefreshCw, FiCheck, FiAlertTriangle,
  FiInfo, FiToggleLeft, FiToggleRight 
} from 'react-icons/fi';

export default function IntegrationSettings({ settings, onChange }) {
  const [showSecrets, setShowSecrets] = useState({});
  const [testingIntegration, setTestingIntegration] = useState('');

  const integrationCategories = [
    {
      id: 'storage',
      name: 'Cloud Storage',
      icon: <FiCloud className="w-5 h-5" />,
      integrations: [
        {
          id: 'aws',
          name: 'Amazon S3',
          fields: [
            { key: 'accessKeyId', label: 'Access Key ID', type: 'password' },
            { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password' },
            { key: 'region', label: 'Region', type: 'text' },
            { key: 'bucketName', label: 'Bucket Name', type: 'text' }
          ]
        },
        {
          id: 'gcs',
          name: 'Google Cloud Storage',
          fields: [
            { key: 'projectId', label: 'Project ID', type: 'text' },
            { key: 'keyFilePath', label: 'Key File Path', type: 'text' },
            { key: 'bucketName', label: 'Bucket Name', type: 'text' }
          ]
        }
      ]
    },
    {
      id: 'database',
      name: 'External Databases',
      icon: <FiDatabase className="w-5 h-5" />,
      integrations: [
        {
          id: 'mongodb',
          name: 'MongoDB',
          fields: [
            { key: 'connectionString', label: 'Connection String', type: 'password' },
            { key: 'database', label: 'Database Name', type: 'text' }
          ]
        }
      ]
    },
    {
      id: 'communication',
      name: 'Communication Services',
      icon: <FiMessageSquare className="w-5 h-5" />,
      integrations: [
        {
          id: 'smtp',
          name: 'SMTP Server',
          fields: [
            { key: 'host', label: 'Host', type: 'text' },
            { key: 'port', label: 'Port', type: 'number' },
            { key: 'username', label: 'Username', type: 'text' },
            { key: 'password', label: 'Password', type: 'password' }
          ]
        },
        {
          id: 'sms',
          name: 'SMS Gateway',
          fields: [
            { key: 'apiKey', label: 'API Key', type: 'password' },
            { key: 'senderId', label: 'Sender ID', type: 'text' }
          ]
        }
      ]
    }
  ];

  const handleToggleSecret = (integrationId, fieldKey) => {
    setShowSecrets(prev => ({
      ...prev,
      [`${integrationId}-${fieldKey}`]: !prev[`${integrationId}-${fieldKey}`]
    }));
  };

  const handleTestIntegration = async (integrationId) => {
    setTestingIntegration(integrationId);
    try {
      // Simulate API call to test integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Success notification would go here
    } catch (error) {
      // Error notification would go here
    } finally {
      setTestingIntegration('');
    }
  };

  const handleFieldChange = (integrationId, field, value) => {
    onChange({
      ...settings,
      [integrationId]: {
        ...settings?.[integrationId],
        [field.key]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Integration Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure external service integrations and API settings
        </p>
      </div>

      {/* Integration Categories */}
      {integrationCategories.map(category => (
        <div key={category.id} className="bg-gray-50 p-6 rounded-lg space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            {category.icon}
            <span>{category.name}</span>
          </h3>

          <div className="space-y-6">
            {category.integrations.map(integration => (
              <div
                key={integration.id}
                className="bg-white p-6 rounded-lg border border-gray-200 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      {integration.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange({
                      ...settings,
                      [`${integration.id}Enabled`]: !settings?.[`${integration.id}Enabled`]
                    })}
                    className={`p-2 rounded-lg ${
                      settings?.[`${integration.id}Enabled`]
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                        : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {settings?.[`${integration.id}Enabled`] ? (
                      <FiToggleRight size={24} />
                    ) : (
                      <FiToggleLeft size={24} />
                    )}
                  </button>
                </div>

                {settings?.[`${integration.id}Enabled`] && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {integration.fields.map(field => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={
                                field.type === 'password' && !showSecrets[`${integration.id}-${field.key}`]
                                  ? 'password'
                                  : 'text'
                              }
                              value={settings?.[integration.id]?.[field.key] || ''}
                              onChange={(e) => handleFieldChange(integration.id, field, e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                            {field.type === 'password' && (
                              <button
                                type="button"
                                onClick={() => handleToggleSecret(integration.id, field.key)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                              >
                                {showSecrets[`${integration.id}-${field.key}`] ? (
                                  <FiEyeOff className="w-5 h-5" />
                                ) : (
                                  <FiEye className="w-5 h-5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => handleTestIntegration(integration.id)}
                        disabled={testingIntegration === integration.id}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {testingIntegration === integration.id ? (
                          <>
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <FiCheck className="w-4 h-4" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Warning Message */}
      <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
        <FiAlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-700">
          Keep your API keys and credentials secure. Never share them with unauthorized personnel.
          Regularly rotate your keys for enhanced security.
        </p>
      </div>
    </div>
  );
}

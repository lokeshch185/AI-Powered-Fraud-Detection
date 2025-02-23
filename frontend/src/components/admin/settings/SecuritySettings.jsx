import { useState } from 'react';
import { 
  FiShield, FiLock, FiKey, FiClock, FiSmartphone,
  FiAlertTriangle, FiInfo, FiCheck, FiX 
} from 'react-icons/fi';

export default function SecuritySettings({ settings, onChange }) {
  const [showPasswordExample, setShowPasswordExample] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-blue-500',
      'bg-green-500'
    ];
    return colors[strength - 1] || 'bg-gray-200';
  };

  const renderPasswordExample = () => {
    const example = 'StrongP@ss123';
    const strength = calculatePasswordStrength(example);
    
    return (
      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Example: {example}</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-1 w-full rounded-full ${
                  level <= strength ? getStrengthColor(strength) : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              {/[A-Z]/.test(example) ? <FiCheck className="text-green-500" /> : <FiX className="text-red-500" />}
              <span>Uppercase letter</span>
            </li>
            <li className="flex items-center space-x-2">
              {/[a-z]/.test(example) ? <FiCheck className="text-green-500" /> : <FiX className="text-red-500" />}
              <span>Lowercase letter</span>
            </li>
            <li className="flex items-center space-x-2">
              {/[0-9]/.test(example) ? <FiCheck className="text-green-500" /> : <FiX className="text-red-500" />}
              <span>Number</span>
            </li>
            <li className="flex items-center space-x-2">
              {/[^A-Za-z0-9]/.test(example) ? <FiCheck className="text-green-500" /> : <FiX className="text-red-500" />}
              <span>Special character</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure system-wide security policies and authentication requirements
        </p>
      </div>

      {/* Password Policies */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <FiLock />
          <span>Password Policies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minimum Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Password Length
            </label>
            <input
              type="number"
              min="8"
              max="32"
              value={settings?.passwordMinLength || 8}
              onChange={(e) => onChange({ passwordMinLength: parseInt(e.target.value) })}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Expiry */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password Expiry (Days)
            </label>
            <input
              type="number"
              min="30"
              max="365"
              value={settings?.passwordExpiryDays || 90}
              onChange={(e) => onChange({ passwordExpiryDays: parseInt(e.target.value) })}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Password Requirements */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="requireUppercase"
              checked={settings?.requireUppercase}
              onChange={(e) => onChange({ requireUppercase: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="requireUppercase" className="text-sm text-gray-700">
              Require uppercase letters
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="requireNumbers"
              checked={settings?.requireNumbers}
              onChange={(e) => onChange({ requireNumbers: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="requireNumbers" className="text-sm text-gray-700">
              Require numbers
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="requireSpecialChars"
              checked={settings?.requireSpecialChars}
              onChange={(e) => onChange({ requireSpecialChars: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="requireSpecialChars" className="text-sm text-gray-700">
              Require special characters
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPasswordExample(!showPasswordExample)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showPasswordExample ? 'Hide' : 'Show'} password example
        </button>

        {showPasswordExample && renderPasswordExample()}
      </div>

      {/* Multi-Factor Authentication */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <FiSmartphone />
          <span>Multi-Factor Authentication (MFA)</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="requireMFA"
                checked={settings?.requireMFA}
                onChange={(e) => onChange({ requireMFA: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="requireMFA" className="text-sm text-gray-700">
                Require MFA for all users
              </label>
            </div>
          </div>

          <div className="space-y-4 pl-8">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="allowSMS"
                checked={settings?.allowSMS}
                onChange={(e) => onChange({ allowSMS: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!settings?.requireMFA}
              />
              <label htmlFor="allowSMS" className="text-sm text-gray-700">
                Allow SMS authentication
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="allowEmail"
                checked={settings?.allowEmail}
                onChange={(e) => onChange({ allowEmail: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!settings?.requireMFA}
              />
              <label htmlFor="allowEmail" className="text-sm text-gray-700">
                Allow email authentication
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="allowAuthenticator"
                checked={settings?.allowAuthenticator}
                onChange={(e) => onChange({ allowAuthenticator: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!settings?.requireMFA}
              />
              <label htmlFor="allowAuthenticator" className="text-sm text-gray-700">
                Allow authenticator apps
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <FiClock />
          <span>Session Management</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Session Timeout (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              value={settings?.sessionTimeout || 30}
              onChange={(e) => onChange({ sessionTimeout: parseInt(e.target.value) })}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Concurrent Sessions
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings?.maxConcurrentSessions || 1}
              onChange={(e) => onChange({ maxConcurrentSessions: parseInt(e.target.value) })}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
        <FiAlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-700">
          Changes to security settings may require users to re-authenticate. Ensure all users are notified before making significant changes.
        </p>
      </div>
    </div>
  );
}

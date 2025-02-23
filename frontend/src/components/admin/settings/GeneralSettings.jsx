import { useState, useRef } from 'react';
import { 
  FiUpload, FiGlobe, FiClock, FiDollarSign,
  FiMail, FiPhone, FiMapPin, FiInfo 
} from 'react-icons/fi';

export default function GeneralSettings({ settings, onChange }) {
  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(settings?.organizationLogo);

  const timezones = [
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Singapore',
    // Add more timezones as needed
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    // Add more currencies as needed
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    // Add more languages as needed
  ];

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        onChange({ organizationLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure your organization's basic information and preferences
        </p>
      </div>

      {/* Organization Details */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Organization Details</h3>
        
        {/* Logo Upload */}
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Organization Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <FiUpload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Change Logo
            </button>
            <p className="mt-1 text-xs text-gray-500">
              Recommended: 400x400px, Max 5MB
            </p>
          </div>
        </div>

        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            value={settings?.organizationName || ''}
            onChange={(e) => onChange({ organizationName: e.target.value })}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Email
            </label>
            <div className="mt-1 relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={settings?.contactEmail || ''}
                onChange={(e) => onChange({ contactEmail: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Phone
            </label>
            <div className="mt-1 relative">
              <FiPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                value={settings?.contactPhone || ''}
                onChange={(e) => onChange({ contactPhone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <div className="mt-1 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <textarea
              value={settings?.address || ''}
              onChange={(e) => onChange({ address: e.target.value })}
              rows={3}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        <h3 className="text-lg font-medium text-gray-900">System Preferences</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Language
            </label>
            <div className="mt-1 relative">
              <FiGlobe className="absolute left-3 top-3 text-gray-400" />
              <select
                value={settings?.defaultLanguage || 'en'}
                onChange={(e) => onChange({ defaultLanguage: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <div className="mt-1 relative">
              <FiClock className="absolute left-3 top-3 text-gray-400" />
              <select
                value={settings?.timezone || 'Asia/Kolkata'}
                onChange={(e) => onChange({ timezone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Currency
            </label>
            <div className="mt-1 relative">
              <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
              <select
                value={settings?.defaultCurrency || 'INR'}
                onChange={(e) => onChange({ defaultCurrency: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="flex items-start space-x-3 text-sm text-gray-500">
        <FiInfo className="mt-0.5 flex-shrink-0" />
        <p>
          These settings will be applied system-wide. Some changes may require a system restart to take effect.
        </p>
      </div>
    </div>
  );
}
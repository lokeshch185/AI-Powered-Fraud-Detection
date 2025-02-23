import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiCheck, FiAlertTriangle, FiClock, 
  FiFileText, FiDownload, FiMessageSquare,
  FiUser, FiCalendar, FiDollarSign,
  FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';

export default function ClaimDetailsModal({ claim, onClose, onStatusUpdate }) {
  console.log(claim);
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Utility functions for safe data formatting
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Safe data getters
  const getValue = (key, defaultValue = 'N/A') => {
    return claim?.[key] || defaultValue;
  };

  const tabs = [
    { id: 'details', label: 'Claim Details', icon: FiFileText },
    { id: 'timeline', label: 'Timeline', icon: FiClock },
    { id: 'risk', label: 'Risk Analysis', icon: FiAlertTriangle }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Claim Details - {getValue('claim_id')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Policy Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-500">Policy Start Date</label>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(getValue('policy_start_date'))}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Claim Date</label>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(getValue('claim_date'))}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Sum Assured</label>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(getValue('sum_assured'))}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Premium Amount</label>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(getValue('premium_amount'))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Assured Details</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-500">Age</label>
                    <p className="text-sm font-medium text-gray-900">
                      {getValue('age')} years
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Annual Income</label>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(getValue('income'))}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Channel</label>
                    <p className="text-sm font-medium text-gray-900">
                      {getValue('channel')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Product Type</label>
                    <p className="text-sm font-medium text-gray-900">
                      {getValue('product_type')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-8 px-4">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute h-full w-0.5 bg-gray-200 left-6 top-0"></div>

                {/* Timeline Events */}
                <div className="space-y-8">
                  {/* Submitted Step - Always shown */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 w-12">
                      <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-white"></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">Claim Submitted</div>
                        <FiCheckCircle className="ml-2 text-green-500" />
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(claim.claim_date)}</div>
                      <div className="mt-1 text-sm text-gray-600">
                        Claim ID: {claim.claim_id} | Amount: {formatCurrency(claim.sum_assured)}
                      </div>
                    </div>
                  </motion.div>

                  {/* Under Review Step */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 w-12">
                      <div className={`w-3 h-3 rounded-full ring-4 ring-white ${
                        claim.risk_level ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <div className={`font-medium ${claim.risk_level ? 'text-gray-900' : 'text-gray-500'}`}>
                          Risk Analysis
                        </div>
                        {claim.risk_level && <FiCheckCircle className="ml-2 text-blue-500" />}
                      </div>
                      <div className="text-sm text-gray-500">
                        {claim.risk_level ? formatDate(claim.claim_date) : 'Pending'}
                      </div>
                      {claim.risk_level && (
                        <div className="mt-1 text-sm text-gray-600">
                          Risk Level: {claim.risk_level.toUpperCase()} | 
                          Category: {claim.fraud_category || 'N/A'}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Final Status Step */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 w-12">
                      <div className={`w-3 h-3 rounded-full ring-4 ring-white ${
                        claim.status === 'Approved' ? 'bg-green-500' :
                        claim.status === 'Rejected' ? 'bg-red-500' :
                        'bg-gray-300'
                      }`}></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <div className={`font-medium ${
                          claim.status !== 'Pending' ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          Final Decision
                        </div>
                        {claim.status !== 'Pending' && (
                          <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            claim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            claim.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {claim.status}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {claim.status !== 'Pending' ? formatDate(claim.updatedAt || claim.claim_date) : 'Awaiting Decision'}
                      </div>
                      {claim.comment && (
                        <div className="mt-1 text-sm text-gray-600">
                          Comment: {claim.comment}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 p-4"
            >
              {/* Risk Score Indicator */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Fraud Category */}
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-lg p-6 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-700">Fraud Category</h4>
                      <FiAlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {claim.fraud_category || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Based on ML model analysis
                    </div>
                  </motion.div>

                  {/* Risk Level */}
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-lg p-6 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-700">Confidence Level</h4>
                      <div className={`h-3 w-3 rounded-full ${
                        claim.risk_level === 'high' ? 'bg-red-500' :
                        claim.risk_level === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${
                      claim.risk_level === 'high' ? 'text-red-600' :
                      claim.risk_level === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {(claim.risk_level || 'N/A').toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Confidence level indicator
                    </div>
                  </motion.div>
                </div>

                {/* Risk Factors */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Key Risk Indicators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-sm font-medium text-gray-500">Claim Amount</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(claim.sum_assured)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-sm font-medium text-gray-500">Policy Age</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.floor((new Date(claim.claim_date) - new Date(claim.policy_start_date)) / (1000 * 60 * 60 * 24 * 365))} years
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-sm font-medium text-gray-500">Premium Ratio</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {((claim.premium_amount / claim.income) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              getValue('status') === 'Approved' ? 'bg-green-100 text-green-800' :
              getValue('status') === 'Rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {getValue('status')}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Close
            </button>
            {getValue('status') === 'Pending' && (
              <>
                <button
                  onClick={() => onStatusUpdate('Approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Rejection
              </h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                rows={4}
              />
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onStatusUpdate('Rejected', comment);
                    setShowConfirmation(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
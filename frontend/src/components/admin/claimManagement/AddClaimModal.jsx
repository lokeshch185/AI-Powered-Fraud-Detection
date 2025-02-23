import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiAlertCircle } from 'react-icons/fi';

export default function AddClaimModal({ 
  onClose, 
  onSuccess, 
  onShowDetails,
  loading: parentLoading,
  initialStatus = 'Pending',
  productTypes = ["Health", "Non Par", "Pension", "Traditional", "ULIP", "Variable"],
  channels = ['RetailAgency', 'Bancassurance', 'Direct', 'Online']
}) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    premium_amount: '',
    sum_assured: '',
    income: '',
    policy_start_date: '',
    claim_date: '',
    channel: '',
    product_type: '',
    status: initialStatus,
    // Optional fields
    nominee_relation: '',
    premium_payment_mode: 'Monthly',
    holder_marital_status: 'Single',
    policy_term: '',
    correspondence_city: '',
    correspondence_state: '',
    correspondence_postcode: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    const requiredFields = {
      name: 'Name is required',
      age: 'Age is required',
      premium_amount: 'Premium amount is required',
      sum_assured: 'Sum assured is required',
      income: 'Income is required',
      policy_start_date: 'Policy start date is required',
      claim_date: 'Claim date is required',
      channel: 'Channel is required',
      product_type: 'Product type is required'
    };

    Object.keys(requiredFields).forEach(field => {
      if (!formData[field]) {
        newErrors[field] = requiredFields[field];
      }
    });

    // Numeric validations
    if (formData.age && (Number(formData.age) < 18 || Number(formData.age) > 100)) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    if (formData.premium_amount && Number(formData.premium_amount) <= 0) {
      newErrors.premium_amount = 'Premium amount must be greater than 0';
    }

    if (formData.sum_assured && Number(formData.sum_assured) <= 0) {
      newErrors.sum_assured = 'Sum assured must be greater than 0';
    }

    if (formData.income && Number(formData.income) < 0) {
      newErrors.income = 'Income cannot be negative';
    }

    // Date validations
    if (formData.policy_start_date && formData.claim_date) {
      const startDate = new Date(formData.policy_start_date);
      const claimDate = new Date(formData.claim_date);
      const today = new Date();

      if (startDate > today) {
        newErrors.policy_start_date = 'Policy start date cannot be in the future';
      }
      if (claimDate < startDate) {
        newErrors.claim_date = 'Claim date cannot be before policy start date';
      }
      if (claimDate > today) {
        newErrors.claim_date = 'Claim date cannot be in the future';
      }
    }

    // Add name validation
    if (formData.name && formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      setLoading(true);
      
      // Prepare the data
      const submitData = {
        name: formData.name,
        age: Number(formData.age),
        premium_amount: Number(formData.premium_amount),
        sum_assured: Number(formData.sum_assured),
        income: Number(formData.income),
        policy_start_date: formData.policy_start_date,
        claim_date: formData.claim_date,
        channel: formData.channel,
        product_type: formData.product_type,

      };

      // Add optional fields if they have values
      if (formData.nominee_relation) submitData.nominee_relation = formData.nominee_relation;
      if (formData.premium_payment_mode) submitData.premium_payment_mode = formData.premium_payment_mode;
      if (formData.holder_marital_status) submitData.holder_marital_status = formData.holder_marital_status;
      if (formData.policy_term) submitData.policy_term = Number(formData.policy_term);
      if (formData.correspondence_city) submitData.correspondence_city = formData.correspondence_city;
      if (formData.correspondence_state) submitData.correspondence_state = formData.correspondence_state;
      if (formData.correspondence_postcode) {
        submitData.correspondence_postcode = Number(formData.correspondence_postcode);
      }

      // Call the onSuccess callback with the prepared data
      const response = await onSuccess(submitData);
      
      // Close the add modal and show details modal with the new claim
      onClose();
      if (response?.data?.claim) {
        onShowDetails(response.data.claim);
      }
      
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Error submitting claim'
      });
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting = loading || parentLoading;

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
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-900">Add New Claim</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 bg-gray-100">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              <div className="ml-3 flex-grow border-t border-gray-200" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter full name"
                  style={{ padding: '10px' }}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.age ? 'border-red-300' : ''
                  }`}
                  style={{ padding: '10px' }}
                  onWheel={(e) => e.target.blur()}
                />
                {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Income <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.income ? 'border-red-300' : ''
                  }`}
                  style={{ padding: '10px' }}
                  onWheel={(e) => e.target.blur()}
                />
                {errors.income && <p className="mt-1 text-sm text-red-600">{errors.income}</p>}
              </div>

            </div>
          </div>

          {/* Policy Details Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900">Policy Details</h3>
              <div className="ml-3 flex-grow border-t border-gray-200" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Premium Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="premium_amount"
                  value={formData.premium_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, premium_amount: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.premium_amount ? 'border-red-300' : ''
                  }`}
                  style={{ padding: '10px' }}
                  onWheel={(e) => e.target.blur()}
                />
                {errors.premium_amount && <p className="mt-1 text-sm text-red-600">{errors.premium_amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sum Assured <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sum_assured"
                  value={formData.sum_assured}
                  onChange={(e) => setFormData(prev => ({ ...prev, sum_assured: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.sum_assured ? 'border-red-300' : ''
                  }`}
                  style={{ padding: '10px' }}
                  onWheel={(e) => e.target.blur()}
                />
                {errors.sum_assured && <p className="mt-1 text-sm text-red-600">{errors.sum_assured}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Channel <span className="text-red-500">*</span>
                </label>
                <select
                  name="channel"
                  value={formData.channel}
                  onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.channel ? 'border-red-300' : ''
                  }`}
                  style={{ padding: '10px' }}
                >
                  <option value="">Select Channel</option>
                  {channels.map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
                {errors.channel && <p className="mt-1 text-sm text-red-600">{errors.channel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="product_type"
                  value={formData.product_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, product_type: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.product_type ? 'border-red-300' : ''
                  }`}
                  style={{ padding: '10px' }}
                >
                  <option value="">Select Product Type</option>
                  {productTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.product_type && <p className="mt-1 text-sm text-red-600">{errors.product_type}</p>}
              </div>
            </div>
          </div>

          {/* Claim Details Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900">Claim Details</h3>
              <div className="ml-3 flex-grow border-t border-gray-200" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="policy_start_date"
                  value={formData.policy_start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, policy_start_date: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.policy_start_date ? 'border-red-300' : ''
                  }`}
                  style={{ padding: '10px' }}
                />
                {errors.policy_start_date && <p className="mt-1 text-sm text-red-600">{errors.policy_start_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Claim Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="claim_date"
                  value={formData.claim_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, claim_date: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.claim_date ? 'border-red-300' : ''
                  }`}
                  style={{ padding: '10px' }}
                />
                {errors.claim_date && <p className="mt-1 text-sm text-red-600">{errors.claim_date}</p>}
              </div>
            </div>
          </div>

          {/* Optional Information Section */}
          <div>
            <details className="rounded-lg">
              <summary className="flex items-center text-lg font-medium text-gray-900 cursor-pointer">
                <span>Optional Information</span>
                <div className="ml-3 flex-grow border-t border-gray-200" />
              </summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nominee Relation <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="nominee_relation"
                    value={formData.nominee_relation}
                    onChange={(e) => setFormData(prev => ({ ...prev, nominee_relation: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter nominee relation"
                    style={{ padding: '10px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Premium Payment Mode <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <select
                    name="premium_payment_mode"
                    value={formData.premium_payment_mode}
                    onChange={(e) => setFormData(prev => ({ ...prev, premium_payment_mode: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                    style={{ padding: '10px' }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Marital Status <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <select
                    name="holder_marital_status"
                    value={formData.holder_marital_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, holder_marital_status: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                    style={{ padding: '10px' }}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Policy Term (Years) <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    name="policy_term"
                    value={formData.policy_term}
                    onChange={(e) => setFormData(prev => ({ ...prev, policy_term: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter policy term"
                    style={{ padding: '10px' }}
                    onWheel={(e) => e.target.blur()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="correspondence_city"
                    value={formData.correspondence_city}
                    onChange={(e) => setFormData(prev => ({ ...prev, correspondence_city: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter city"
                    style={{ padding: '10px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="correspondence_state"
                    value={formData.correspondence_state}
                    onChange={(e) => setFormData(prev => ({ ...prev, correspondence_state: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter state"
                    style={{ padding: '10px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    name="correspondence_postcode"
                    value={formData.correspondence_postcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, correspondence_postcode: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-md bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter postal code"
                    style={{ padding: '10px' }}
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
              </div>
            </details>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <div className="flex">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
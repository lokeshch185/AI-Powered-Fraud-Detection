import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiX, FiCheck, FiAlertCircle, 
  FiCalendar, FiDollarSign, FiFileText, FiMenu 
} from 'react-icons/fi';
import Sidebar from '../components/Sidebar';

export default function FileClaim() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    income: '',
    premium_amount: '',
    sum_assured: '',
    channel: '',
    product_type: '',
    policy_start_date: '',
    claim_date: '',
    // Optional fields
    nominee_relation: '',
    premium_payment_mode: 'Monthly',
    holder_marital_status: 'Single',
    policy_term: '',
    correspondence_city: '',
    correspondence_state: '',
    correspondence_postcode: ''
  });

  const steps = [
    { number: 1, label: 'Personal Information' },
    { number: 2, label: 'Policy Details' },
    { number: 3, label: 'Additional Details' },
    { number: 4, label: 'Document Upload' }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const productTypes = ["Health", "Non Par", "Pension", "Traditional", "ULIP", "Variable"];
  const channels = ['RetailAgency', 'Bancassurance', 'Direct', 'Online'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-600"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <div>
                <h1 className="text-xl font-semibold">File a Claim</h1>
                <p className="text-sm text-gray-600">Submit your insurance claim</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <img 
                src="/avatar.png" 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Form Content */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-center relative">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {/* Steps */}
                {steps.map((step) => (
                  <div key={step.number} className="relative flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                        ${step.number <= currentStep ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}
                    >
                      {step.number < currentStep ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className={`mt-2 text-sm font-medium ${
                      step.number <= currentStep ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter age"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Income <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.income}
                        onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter annual income"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">Policy Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Premium Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.premium_amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, premium_amount: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sum Assured <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.sum_assured}
                        onChange={(e) => setFormData(prev => ({ ...prev, sum_assured: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Channel <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.channel}
                        onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Channel</option>
                        {channels.map(channel => (
                          <option key={channel} value={channel}>{channel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Product Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.product_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, product_type: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Product Type</option>
                        {productTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Policy Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.policy_start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, policy_start_date: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Claim Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.claim_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, claim_date: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">Additional Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nominee Relation
                      </label>
                      <input
                        type="text"
                        value={formData.nominee_relation}
                        onChange={(e) => setFormData(prev => ({ ...prev, nominee_relation: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Premium Payment Mode
                      </label>
                      <select
                        value={formData.premium_payment_mode}
                        onChange={(e) => setFormData(prev => ({ ...prev, premium_payment_mode: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Half-Yearly">Half-Yearly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Marital Status
                      </label>
                      <select
                        value={formData.holder_marital_status}
                        onChange={(e) => setFormData(prev => ({ ...prev, holder_marital_status: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Policy Term (Years)
                      </label>
                      <input
                        type="number"
                        value={formData.policy_term}
                        onChange={(e) => setFormData(prev => ({ ...prev, policy_term: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        value={formData.correspondence_city}
                        onChange={(e) => setFormData(prev => ({ ...prev, correspondence_city: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        value={formData.correspondence_state}
                        onChange={(e) => setFormData(prev => ({ ...prev, correspondence_state: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <input
                        type="number"
                        value={formData.correspondence_postcode}
                        onChange={(e) => setFormData(prev => ({ ...prev, correspondence_postcode: e.target.value }))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-700">
                            Upload a file
                          </span>
                          <span className="text-gray-500"> or drag and drop</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            multiple
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        PDF, JPEG, PNG up to 5MB each
                      </p>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <FiFileText className="text-gray-400" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                    <FiAlertCircle className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">
                        AI-Powered Tip
                      </h3>
                      <p className="text-sm text-blue-600 mt-1">
                        Ensure your documents are clear and legible for faster processing.
                        Our AI system works best with high-quality scans.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
                  >
                    Submit Claim
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-md mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Claim Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Track your claim status in the dashboard.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    className="w-full px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Upload More Documents
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

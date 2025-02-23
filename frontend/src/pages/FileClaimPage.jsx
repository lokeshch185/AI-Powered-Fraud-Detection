import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiX, FiCheck, FiAlertCircle, 
  FiCalendar, FiDollarSign, FiFileText 
} from 'react-icons/fi';

export default function FileClaim() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const steps = [
    { number: 1, label: 'Policy Selection' },
    { number: 2, label: 'Claim Details' },
    { number: 3, label: 'Document Upload' },
    { number: 4, label: 'Review & Submit' }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img src="/sbi-logo.png" alt="SBI Logo" className="h-8" />
            <div className="flex items-center space-x-4">
              <button className="p-2">
                <img src="/avatar.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">File a Claim</h1>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex-1">
                  <div className="relative">
                    <div className={`h-2 ${
                      step.number <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                    <div className="absolute -top-2 transform -translate-y-1/2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.number <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}>
                        {step.number < currentStep ? (
                          <FiCheck className="w-4 h-4" />
                        ) : (
                          step.number
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm">{step.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Select Your Policy</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700">Policy Type</span>
                    <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option>Health Insurance</option>
                      <option>Vehicle Insurance</option>
                      <option>Life Insurance</option>
                    </select>
                  </label>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800">Policy Details</h3>
                    <p className="text-sm text-blue-600 mt-2">
                      Policy Number: POL123456<br />
                      Coverage: ₹5,00,000<br />
                      Valid Until: 31 Dec 2024
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Claim Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Incident Date
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="date"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Incident Description
                    </label>
                    <textarea
                      rows="4"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Please describe what happened..."
                      maxLength={500}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Maximum 500 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Claim Amount
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="number"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-8"
                        placeholder="0.00"
                      />
                      <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
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

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Policy Details</h3>
                    <p className="text-sm text-gray-600">
                      Policy Type: Health Insurance<br />
                      Policy Number: POL123456<br />
                      Claim Amount: ₹50,000
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Uploaded Documents</h3>
                    <ul className="text-sm text-gray-600">
                      {uploadedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-600">
                      I confirm that all the information provided is accurate
                    </label>
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

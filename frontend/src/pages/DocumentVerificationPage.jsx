import { useState } from 'react';
import { FiUpload, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/admin/layouts/Sidebar';

export default function DocumentVerificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setVerificationResult(null);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleVerify = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // First, verify the document and extract data
      const ocrResponse = await axios.post(
        `http://127.0.0.1:5000/ocr-predict`,
        formData
      );
      console.log(ocrResponse.data);
      // Then, check the signature
      const signatureResponse = await axios.post(
        `http://127.0.0.1:5000/signature_check`,
        formData
      );
      console.log(signatureResponse.data);
      setVerificationResult({
        ...ocrResponse.data,
        signature: signatureResponse.data
      });

      toast.success('Document verified successfully');
    } catch (error) {
      toast.error('Verification failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDB = async () => {
    if (!verificationResult) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/claims/single`,
        verificationResult
      );
      toast.success('Claim added to database successfully');
      // Reset the form
      setFile(null);
      setPreviewUrl(null);
      setVerificationResult(null);
    } catch (error) {
      toast.error('Failed to add to database: ' + error.message);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              SBI Document Verification
            </h1>
            <p className="mt-2 text-gray-600">
              Upload and verify insurance claim documents
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-50">
                <FiUpload className="w-8 h-8 text-blue-600" />
                <span className="mt-2 text-base leading-normal text-gray-600">
                  Select a PDF file
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Preview and Actions */}
          {file && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">Selected Document</h3>
                  <p className="text-sm text-gray-500">{file.name}</p>
                </div>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    'Verify Document'
                  )}
                </button>
              </div>

              {/* PDF Preview */}
              <div className="border rounded-lg p-4 mb-4 h-96">
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            </div>
          )}

          {/* Verification Results */}
          {verificationResult && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Verification Results</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Fraud Analysis */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Fraud Analysis</h4>
                  <div className="flex items-center">
                    <div className={`mr-2 ${
                      verificationResult.fraud_category === 'no fraud'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {verificationResult.fraud_category === 'no fraud' ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <FiX className="w-5 h-5" />
                      )}
                    </div>
                    <span className="capitalize">
                      {verificationResult.fraud_category}
                    </span>
                  </div>
                </div>

                {/* Signature Verification */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Signature Verification</h4>
                  <div className="flex items-center">
                    <div className={`mr-2 ${
                      verificationResult.signature.result === 'real'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {verificationResult.signature.result === 'real' ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <FiX className="w-5 h-5" />
                      )}
                    </div>
                    <span className="capitalize">
                      {verificationResult.signature.result} 
                      ({verificationResult.signature.confidence}% confidence)
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Database Button */}
              <button
                onClick={handleAddToDB}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={
                  verificationResult.fraud_category !== 'no fraud' ||
                  verificationResult.signature.result !== 'real'
                }
              >
                Add to Database
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
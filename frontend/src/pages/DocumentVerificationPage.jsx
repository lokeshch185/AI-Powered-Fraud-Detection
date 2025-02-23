import { useState } from 'react';
import { FiUpload, FiCheck, FiX, FiLoader, FiFileText } from 'react-icons/fi';
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
      toast.error('Please upload a valid PDF file');
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
      const ocrResponse = await axios.post('http://127.0.0.1:5000/ocr-predict', formData);
      const signatureResponse = await axios.post('http://127.0.0.1:5000/signature_check', formData);
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
      await axios.post(`${import.meta.env.VITE_API_URL}/api/claims/single`, verificationResult);
      toast.success('Claim added to database successfully');
      setFile(null);
      setPreviewUrl(null);
      setVerificationResult(null);
    } catch (error) {
      toast.error('Failed to add to database: ' + error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex">
        {/* Left Panel - Upload and Results */}
        <div className="w-[45%] p-6 overflow-y-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Document Verification</h1>
            <p className="text-sm text-gray-600">Upload and verify insurance claim documents securely.</p>
          </header>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <label className="flex flex-col items-center p-4 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
              <FiUpload className="text-blue-500 w-8 h-8 mb-2" />
              <span className="text-sm text-gray-600">Click or drag a PDF file to upload</span>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>

          {file && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FiFileText className="text-blue-500 w-5 h-5 mr-2" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? <FiLoader className="animate-spin" /> : 'Verify Document'}
                </button>
              </div>
            </div>
          )}

          {verificationResult && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Verification Results</h3>
              <div className="space-y-4">
                <ResultCard
                  title="Fraud Analysis"
                  status={verificationResult.fraud_category === 'no fraud'}
                  message={verificationResult.fraud_category}
                />
                <ResultCard
                  title="Signature Verification"
                  status={verificationResult.signature.result === 'real'}
                  message={`${verificationResult.signature.result} (${verificationResult.signature.confidence}% confidence)`}
                />
              </div>
              <button
                onClick={handleAddToDB}
                className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Add to Database
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - PDF Preview */}
        <div className="w-[55%] p-6 bg-gray-50">
          {previewUrl ? (
            <div className="h-full rounded-lg overflow-hidden border border-gray-200 bg-white">
              <iframe src={previewUrl} className="w-full h-full" title="PDF Preview"></iframe>
            </div>
          ) : (
            <div className="h-full rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-4" />
              <div className="w-48 h-4 bg-gray-200 animate-pulse mb-2" />
              <div className="w-32 h-3 bg-gray-200 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ResultCard = ({ title, status, message }) => (
  <div className="group p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
    {/* Background decoration */}
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-all duration-300 group-hover:scale-110 ${status ? 'bg-green-500' : 'bg-red-500'}`} />
    
    {/* Status indicator line */}
    <div className={`absolute left-0 top-0 h-full w-1 ${status ? 'bg-green-500' : 'bg-red-500'} opacity-70`} />

    {/* Content */}
    <div className="relative">
      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
        {title}
        <div className={`ml-2 w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
      </h4>
      
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${status ? 'bg-green-50' : 'bg-red-50'} transition-colors duration-300`}>
          {status ? (
            <FiCheck className={`w-5 h-5 text-green-500 animate-[bounce_0.5s_ease-in-out]`} />
          ) : (
            <FiX className={`w-5 h-5 text-red-500 animate-[shake_0.5s_ease-in-out]`} />
          )}
        </div>
        <div className="flex-1">
          <span className={`text-sm font-medium capitalize
            ${status ? 'text-green-700' : 'text-red-700'}`}>
            {message}
          </span>
          <div className={`h-1 rounded-full mt-2 w-full bg-gray-100 overflow-hidden`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 
                ${status ? 'bg-green-500 w-full' : 'bg-red-500 w-1/3'}
                animate-[slideRight_1s_ease-in-out]`} 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);


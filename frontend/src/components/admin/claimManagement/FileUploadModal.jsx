import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiX, FiCheck, FiDownload, FiFile } from 'react-icons/fi';
import axios from 'axios';

export default function FileUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    isUploading: false,
    progress: 0,
    error: null,
    result: null
  });
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.type === 'application/vnd.ms-excel')) {
      setFile(selectedFile);
    } else {
      setUploadStatus(prev => ({
        ...prev,
        error: 'Please select a valid CSV file'
      }));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus({
      isUploading: true,
      progress: 0,
      error: null,
      result: null
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/claims/bulk`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadStatus(prev => ({ ...prev, progress }));
          }
        }
      );

      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        result: response.data
      }));

      onSuccess(response.data);
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        error: error.response?.data?.message || 'Failed to upload file'
      }));
    }
  };

  const handleDownload = () => {
    if (!uploadStatus.result?.processedData) return;
    
    const blob = new Blob([uploadStatus.result.processedData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_claims.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setFile(null);
    setUploadStatus({
      isUploading: false,
      progress: 0,
      error: null,
      result: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Upload Claims</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!uploadStatus.isUploading && !uploadStatus.result && (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv"
                    className="hidden"
                  />
                  <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV files only</p>
                </div>
              )}

              {file && !uploadStatus.isUploading && !uploadStatus.result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FiFile className="h-5 w-5 text-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    onClick={handleUpload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload
                  </button>
                </div>
              )}

              {uploadStatus.isUploading && (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadStatus.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    Processing claims... {uploadStatus.progress}%
                  </p>
                </div>
              )}

              {uploadStatus.result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center text-green-500">
                    <FiCheck className="h-16 w-16" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900">Processing Complete</p>
                    <p className="text-sm text-gray-600">
                      Successfully processed {uploadStatus.result.successCount} claims
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiDownload className="mr-2" />
                    Download Processed File
                  </button>
                </div>
              )}

              {uploadStatus.error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {uploadStatus.error}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
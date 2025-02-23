export default function ProcessingModal({ status }) {
    if (!status.isUploading && !status.result) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <h3 className="text-lg font-medium mb-4">
            {status.isUploading ? 'Processing Claims' : 'Processing Complete'}
          </h3>
          
          {status.isUploading && (
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${status.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Uploading and processing claims... {status.progress}%
              </p>
            </div>
          )}
  
          {status.result && (
            <div className="space-y-4">
              <p>Successfully processed {status.result.successCount} claims</p>
              {status.result.errorCount > 0 && (
                <p className="text-red-600">
                  Failed to process {status.result.errorCount} claims
                </p>
              )}
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white rounded-md py-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
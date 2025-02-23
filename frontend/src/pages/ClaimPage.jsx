export default function Claims() {
    return (
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Claims Management</h2>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">File New Claim</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Claim Type</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Insurance Claim</option>
                  <option>Fraud Report</option>
                  <option>Dispute Resolution</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                ></textarea>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                Submit Claim
              </button>
            </form>
          </div>
  
          <div>
            <h3 className="text-lg font-semibold mb-4">Claims Status</h3>
            <div className="space-y-4">
              {/* Sample Claim Card */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Claim #12345</p>
                    <p className="text-sm text-gray-600">Insurance Claim</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    In Progress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiFileText, FiUpload, FiPlus, FiUploadCloud } from 'react-icons/fi';
import Sidebar from '../components/admin/layouts/Sidebar';
import ClaimsTable from '../components/admin/claimManagement/ClaimsTable';
import ClaimsFilter from '../components/admin/claimManagement/ClaimsFilter';
import AddClaimModal from '../components/admin/claimManagement/AddClaimModal';
import ClaimDetailsModal from '../components/admin/claimManagement/ClaimDetailsModal';
import { StatusBadge, RiskBadge } from '../components/admin/claimManagement/Badges';
import ProcessingModal from '../components/admin/claimManagement/ProcessingModal';
import FileUploadModal from '../components/admin/claimManagement/FileUploadModal';


export default function ClaimsManagementPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: null,
      endDate: null
    },
    product_type: '',
    status: '',
    correspondence_city: ''
  });
  const [uploadStatus, setUploadStatus] = useState({
    isUploading: false,
    progress: 0,
    error: null,
    result: null
  });
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);

  const columns = [
    { header: 'Claim ID', accessor: 'claim_id' },
    { header: 'Name', accessor: 'name' },
    { 
      header: 'Policy Start Date', 
      accessor: 'policy_start_date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    { 
      header: 'Claim Date', 
      accessor: 'claim_date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    { header: 'Channel', accessor: 'channel' },
    { header: 'Product Type', accessor: 'product_type' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />
    },
    { 
      header: 'Risk', 
      accessor: 'risk_level',
      render: (value, row) => {
        console.log(row);
        if (row?.fraud_category?.toLowerCase() === 'no fraud') {
          return <RiskBadge risk="safe" />;
        }
        return <RiskBadge risk={value} />;
      }
    }
  ];

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.product_type && { product_type: filters.product_type }),
        ...(filters.correspondence_city && { correspondence_city: filters.correspondence_city }),
        ...(filters.dateRange.startDate && { 
          startDate: filters.dateRange.startDate.toISOString() 
        }),
        ...(filters.dateRange.endDate && { 
          endDate: filters.dateRange.endDate.toISOString() 
        })
      });

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/claims?${params}`);
      console.log(response.data);
      setClaims(response.data.claims);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pages,
        totalItems: response.data.total
      }));
    } catch (error) {
      toast.error('Failed to fetch claims');
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [pagination.currentPage,pagination.limit, filters]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
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

      // If there's processed data from Flask API, you can download it
      if (response.data.processedData) {
        // Create and download the processed CSV
        const blob = new Blob([response.data.processedData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'processed_claims.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }

      toast.success('Claims uploaded successfully');
      fetchClaims();
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        error: error.message
      }));
      toast.error('Failed to upload claims: ' + error.message);
    }
  };

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleStatusUpdate = async (claimId, newStatus, comment) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/claims/${claimId}/status`, {
        status: newStatus,
        comment
      });
      
      toast.success(`Claim ${newStatus.toLowerCase()} successfully`);
      fetchClaims();
      setSelectedClaim(response.data.claim); // Update with new data before closing
      setTimeout(() => setSelectedClaim(null), 500); // Close after showing updated state
      
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update claim status');
      throw error; // Propagate error to modal
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    fetchClaims();
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: {
        startDate: null,
        endDate: null
      },
      product_type: '',
      status: '',
      correspondence_city: ''
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handleUploadSuccess = (result) => {
    fetchClaims();
    toast.success(`Successfully processed ${result.successCount} claims`);
  };

  return (
    <div className="flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Claims Management
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Single Claim Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Claim
              </button>

              {/* Bulk Upload Button */}
              <button
                onClick={() => setShowFileUploadModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiUploadCloud className="mr-2" />
                Upload Claims
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ClaimsFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Claims Table with Pagination */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map(column => (
                      <th 
                        key={column.accessor} 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.header}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <ClaimsTable
                    claims={claims}
                    loading={loading}
                    columns={columns}
                    onViewDetails={handleViewDetails}
                  />
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {((pagination.currentPage - 1) * pagination.limit) + 1}
                    </span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{pagination.totalItems}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                            ${page === pagination.currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddClaimModal
            onClose={() => setShowAddModal(false)}
            onSuccess={async (claimData) => {
              try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/claims/single`, claimData);
                fetchClaims();
                toast.success('Claim added successfully');
                return response; // Return the response so AddClaimModal can access the new claim data
              } catch (error) {
                toast.error('Failed to add claim');
                throw error;
              }
            }}
            onShowDetails={(claim) => {
              setSelectedClaim(claim);
            }}
          />
        )}

        {selectedClaim && (
          <ClaimDetailsModal
            claim={selectedClaim}
            onClose={() => setSelectedClaim(null)}
            onStatusUpdate={(status, comment) => 
              handleStatusUpdate(selectedClaim.claim_id, status, comment)
            }
          />
        )}

        <ProcessingModal status={uploadStatus} />

        <FileUploadModal
          isOpen={showFileUploadModal}
          onClose={() => setShowFileUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </div>
  );
}
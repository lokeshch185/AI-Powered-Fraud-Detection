import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';

export default function ClaimsFilter({ filters, onFilterChange, onApply, onReset }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <FiFilter className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <button 
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <FiX className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Claim Date Range
            </label>
            <div className="flex gap-2">
              <DatePicker
                selected={filters.dateRange.startDate}
                onChange={(date) => onFilterChange('dateRange', { 
                  ...filters.dateRange, 
                  startDate: date 
                })}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Start"
                dateFormat="MMM dd, yyyy"
              />
              <DatePicker
                selected={filters.dateRange.endDate}
                onChange={(date) => onFilterChange('dateRange', { 
                  ...filters.dateRange, 
                  endDate: date 
                })}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="End"
                dateFormat="MMM dd, yyyy"
                minDate={filters.dateRange.startDate}
              />
            </div>
          </div>

          {/* Product Type */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Product Type
            </label>
            <select
              value={filters.product_type}
              onChange={(e) => onFilterChange('product_type', e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Products</option>
              <option value="Health">Health</option>
              <option value="Term">Term</option>
              <option value="ULIP">ULIP</option>
              <option value="Endowment">Endowment</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
        </div>

       
      </div>
    </div>
  );
}

ClaimsFilter.propTypes = {
  filters: PropTypes.shape({
    dateRange: PropTypes.shape({
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date)
    }),
    product_type: PropTypes.string,
    status: PropTypes.string,
    correspondence_city: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

ClaimsFilter.defaultProps = {
  filters: {
    dateRange: {
      startDate: null,
      endDate: null
    },
    product_type: '',
    status: '',
    correspondence_city: ''
  }
};
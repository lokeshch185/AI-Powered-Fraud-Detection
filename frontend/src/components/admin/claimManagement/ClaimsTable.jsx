import { FiInbox } from 'react-icons/fi';
import { StatusBadge, RiskBadge } from './Badges';
import { FiEye } from 'react-icons/fi';

export default function ClaimsTable({ claims, loading, columns, onViewDetails }) {
  if (loading) {
    return (
      <tr>
        <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
          <div className="flex justify-center items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            <span className="text-gray-500">Loading claims...</span>
          </div>
        </td>
      </tr>
    );
  }

  if (!claims.length) {
    return (
      <tr>
        <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
          <div className="text-gray-500">
            <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-base">No claims found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        </td>
      </tr>
    );
  }

  return claims.map(claim => (
    <tr key={claim.claim_id} className="hover:bg-gray-50">
      {columns.map(column => (
        <td key={`${claim.claim_id}-${column.accessor}`} className="px-6 py-4 whitespace-nowrap">
          {column.render ? column.render(claim[column.accessor], claim) : claim[column.accessor] || '-'}
        </td>
      ))}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button
          onClick={() => onViewDetails(claim)}
          className="text-blue-600 hover:text-blue-900 mx-auto flex justify-center items-center"
          title="View Details"
        >
          <FiEye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  ));
}
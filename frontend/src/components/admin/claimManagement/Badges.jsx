import { memo } from 'react';

export const StatusBadge = memo(({ status }) => {
  if (!status) return <span className="text-gray-500">-</span>;

  const getStatusStyle = (statusValue) => {
    switch (statusValue.toLowerCase()) {
      case 'approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '●',
        };
      case 'rejected':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '●',
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: '●',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '●',
        };
    }
  };

  const style = getStatusStyle(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className="text-xs">{style.icon}</span>
      {status}
    </span>
  );
});

export const RiskBadge = memo(({ risk }) => {
  if (!risk) return <span className="text-gray-500">-</span>;

  const getRiskStyle = (riskValue) => {
    switch (riskValue.toLowerCase()) {
      case 'safe':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '↓',
        };
      case 'low':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '↓',
        };
      case 'high':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '↑',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: '→',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '•',
        };
    }
  };

  const style = getRiskStyle(risk);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className="text-xs">{style.icon}</span>
      {risk}
    </span>
  );
});

// Add display names for better debugging
StatusBadge.displayName = 'StatusBadge';
RiskBadge.displayName = 'RiskBadge';
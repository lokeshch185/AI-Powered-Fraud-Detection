import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import { FiCalendar, FiDownload, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function FraudTrendsChart() {
  const [timeRange, setTimeRange] = useState('30days');
  const [chartType, setChartType] = useState('line');

  // Mock data - Replace with API data
  const trendData = {
    '30days': [
      { date: '01/02', fraudCases: 12, flaggedCases: 28, amount: 150000 },
      { date: '05/02', fraudCases: 19, flaggedCases: 35, amount: 280000 },
      { date: '10/02', fraudCases: 15, flaggedCases: 30, amount: 200000 },
      { date: '15/02', fraudCases: 22, flaggedCases: 40, amount: 320000 },
      { date: '20/02', fraudCases: 18, flaggedCases: 32, amount: 250000 },
      { date: '25/02', fraudCases: 25, flaggedCases: 45, amount: 380000 },
      { date: '01/03', fraudCases: 20, flaggedCases: 38, amount: 290000 }
    ],
    '7days': [
      { date: '24/02', fraudCases: 8, flaggedCases: 15, amount: 120000 },
      { date: '25/02', fraudCases: 10, flaggedCases: 18, amount: 150000 },
      { date: '26/02', fraudCases: 7, flaggedCases: 14, amount: 100000 },
      { date: '27/02', fraudCases: 12, flaggedCases: 22, amount: 180000 },
      { date: '28/02', fraudCases: 9, flaggedCases: 17, amount: 130000 },
      { date: '01/03', fraudCases: 11, flaggedCases: 20, amount: 160000 },
      { date: '02/03', fraudCases: 8, flaggedCases: 16, amount: 140000 }
    ]
  };

  // Calculate trend percentages
  const calculateTrend = (data) => {
    const firstValue = data[0].fraudCases;
    const lastValue = data[data.length - 1].fraudCases;
    const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
    return percentageChange.toFixed(1);
  };

  const trend = calculateTrend(trendData[timeRange]);
  const isPositiveTrend = trend > 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm text-gray-600">
                {entry.name}: {entry.value}
                {entry.name === 'Amount' ? '₹' : ''}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-2 text-sm rounded-lg ${
                chartType === 'line'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-2 text-sm rounded-lg ${
                chartType === 'area'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Area
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${
            isPositiveTrend ? 'text-red-600' : 'text-green-600'
          }`}>
            {isPositiveTrend ? <FiTrendingUp /> : <FiTrendingDown />}
            <span className="text-sm font-medium">{trend}%</span>
          </div>
          
          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <FiDownload />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={trendData[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value/1000}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="fraudCases"
                name="Fraud Cases"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="flaggedCases"
                name="Flagged Cases"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="amount"
                name="Amount"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={trendData[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="fraudCases"
                name="Fraud Cases"
                stroke="#EF4444"
                fill="#FEE2E2"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="flaggedCases"
                name="Flagged Cases"
                stroke="#F59E0B"
                fill="#FEF3C7"
                strokeWidth={2}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
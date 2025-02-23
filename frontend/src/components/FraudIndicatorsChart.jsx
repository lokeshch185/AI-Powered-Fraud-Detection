import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { FiBarChart2, FiPieChart, FiInfo } from 'react-icons/fi';

export default function FraudIndicatorsChart() {
  const [chartType, setChartType] = useState('bar');
  const [showTooltip, setShowTooltip] = useState(null);

  // Mock data - Replace with API data
  const indicatorsData = [
    {
      indicator: 'Document Forgery',
      cases: 245,
      riskScore: 85,
      trend: '+12%',
      description: 'Falsified or manipulated documentation submitted with claims'
    },
    {
      indicator: 'Multiple Claims',
      cases: 189,
      riskScore: 75,
      trend: '+8%',
      description: 'Multiple claims filed for the same incident or condition'
    },
    {
      indicator: 'Identity Theft',
      cases: 156,
      riskScore: 90,
      trend: '+15%',
      description: 'Claims filed using stolen or fake identities'
    },
    {
      indicator: 'Inflated Amount',
      cases: 134,
      riskScore: 70,
      trend: '-5%',
      description: 'Claim amounts significantly higher than expected'
    },
    {
      indicator: 'Policy Stacking',
      cases: 98,
      riskScore: 65,
      trend: '+3%',
      description: 'Multiple policies for same risk without disclosure'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = indicatorsData.find(item => item.indicator === label);
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">{label}</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Cases: <span className="font-medium">{data.cases}</span>
            </p>
            <p className="text-sm text-gray-600">
              Risk Score: <span className="font-medium">{data.riskScore}%</span>
            </p>
            <p className="text-sm text-gray-600">
              Trend: <span className={`font-medium ${
                data.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
              }`}>{data.trend}</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">{data.description}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              chartType === 'bar'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiBarChart2 />
            <span>Bar Chart</span>
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              chartType === 'radar'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiPieChart />
            <span>Radar Chart</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-600">Cases</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-gray-600">Risk Score</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={indicatorsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="indicator"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
              <YAxis yAxisId="right" orientation="right" stroke="#EF4444" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="left"
                dataKey="cases"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="riskScore"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <RadarChart outerRadius={150} data={indicatorsData}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis
                dataKey="indicator"
                tick={{ fontSize: 12 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Cases"
                dataKey="cases"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Radar
                name="Risk Score"
                dataKey="riskScore"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Indicators List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicatorsData.map((indicator, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            onMouseEnter={() => setShowTooltip(index)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{indicator.indicator}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {indicator.cases} cases detected
                </p>
              </div>
              <span className={`text-sm font-medium ${
                indicator.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
              }`}>
                {indicator.trend}
              </span>
            </div>
            
            {showTooltip === index && (
              <div className="mt-2 text-sm text-gray-600">
                {indicator.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
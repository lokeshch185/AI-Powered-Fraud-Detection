import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiX, FiAlertTriangle, FiFileText, FiUser, FiCalendar,
  FiDollarSign, FiPieChart, FiMessageSquare, FiUserPlus,
  FiDownload, FiCheckCircle, FiXCircle, FiFlag
} from 'react-icons/fi';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip
} from 'recharts';

export default function FraudDetailsModal({ fraudCase, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');

  // Mock data for risk factors analysis
  const riskFactors = [
    { factor: 'Document Authenticity', score: 85 },
    { factor: 'Claim Pattern', score: 75 },
    { factor: 'Policy History', score: 90 },
    { factor: 'Financial Pattern', score: 65 },
    { factor: 'Identity Verification', score: 80 }
  ];

  // Mock timeline data
  const timeline = [
    {
      date: '2024-02-20',
      action: 'Claim Submitted',
      user: 'System',
      details: 'Initial claim submission received'
    },
    {
      date: '2024-02-21',
      action: 'AI Risk Detection',
      user: 'AI System',
      details: 'High risk patterns detected in documentation'
    },
    {
      date: '2024-02-22',
      action: 'Investigation Initiated',
      user: 'Investigator Singh',
      details: 'Case assigned for detailed review'
    }
  ];

  // Mock notes
  const [notes] = useState([
    {
      id: 1,
      user: 'Investigator Singh',
      date: '2024-02-22',
      content: 'Multiple discrepancies found in submitted documents. Requiring additional verification.',
      type: 'investigation'
    },
    {
      id: 2,
      user: 'AI System',
      date: '2024-02-21',
      content: 'Pattern analysis indicates similarity with previous fraudulent claims.',
      type: 'system'
    }
  ]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    // Add note logic here
    setNewNote('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Fraud Analysis Details
            </h2>
            <p className="text-gray-600 mt-1">
              Claim ID: {fraudCase.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-4 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: <FiPieChart /> },
              { id: 'documents', label: 'Documents', icon: <FiFileText /> },
              { id: 'timeline', label: 'Timeline', icon: <FiCalendar /> },
              { id: 'notes', label: 'Investigation Notes', icon: <FiMessageSquare /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Claim Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Claim Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FiUser className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Policyholder</p>
                      <p className="font-medium">{fraudCase.policyholder}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiFileText className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Policy Type</p>
                      <p className="font-medium">{fraudCase.policyType}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiDollarSign className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Claim Amount</p>
                      <p className="font-medium">{fraudCase.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiCalendar className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Submission Date</p>
                      <p className="font-medium">{fraudCase.submissionDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riskFactors}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Risk Score"
                        dataKey="score"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Fraud Indicators */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Detected Fraud Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fraudCase.flags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg"
                    >
                      <FiAlertTriangle className="text-red-500 mt-1" />
                      <div>
                        <p className="font-medium text-red-700">{flag}</p>
                        <p className="text-sm text-red-600 mt-1">
                          High confidence detection by AI system
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Submitted Documents</h3>
                <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <FiDownload />
                  <span>Download All</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mock document cards */}
                {['Policy Document', 'Claim Form', 'Supporting Evidence'].map((doc, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <FiFileText className="text-gray-400" />
                        <div>
                          <p className="font-medium">{doc}</p>
                          <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Investigation Timeline</h3>
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiCalendar className="text-blue-600" />
                      </div>
                      {index !== timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-blue-100 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.action}</h4>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                      <p className="text-sm text-gray-500 mt-2">By: {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new investigation note..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Note
                </button>
              </div>

              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{note.user}</span>
                        <span className="text-sm text-gray-500">{note.date}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        note.type === 'investigation'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {note.type === 'investigation' ? 'Investigation' : 'System'}
                      </span>
                    </div>
                    <p className="text-gray-600">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiUserPlus />
                <span>Assign Investigator</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiFlag />
                <span>Flag for Review</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                <FiXCircle />
                <span>Mark as Fraud</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <FiCheckCircle />
                <span>Clear Case</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
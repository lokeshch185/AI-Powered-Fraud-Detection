import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageCircle, FiHelpCircle, FiFileText, FiPhone,
  FiSearch, FiChevronDown, FiChevronRight, FiPaperclip,
  FiX, FiCopy, FiMail, FiHome
} from 'react-icons/fi';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Claims Processing',
      questions: [
        {
          q: 'How do I file a new claim?',
          a: 'You can file a new claim through your dashboard by clicking on "File a Claim" and following the step-by-step process.'
        },
        {
          q: 'What documents are required for claims?',
          a: 'Required documents typically include policy details, incident reports, and relevant supporting documentation.'
        }
      ]
    },
    {
      title: 'Fraud Detection',
      questions: [
        {
          q: 'How does SBI detect fraudulent claims?',
          a: 'We use advanced AI algorithms to analyze claims patterns and detect potential fraud indicators.'
        }
      ]
    }
    // Add more categories as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <FiHome />
            <span>&gt;</span>
            <span>Support</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Support Center</h1>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: <FiMessageCircle className="w-6 h-6" />,
              title: 'AI Chatbot',
              description: 'Get instant help from our AI assistant.',
              action: () => setShowChatbot(true),
              buttonText: 'Start Chat'
            },
            {
              icon: <FiHelpCircle className="w-6 h-6" />,
              title: 'FAQ Section',
              description: 'Find answers to common questions.',
              action: () => document.getElementById('faq-section').scrollIntoView(),
              buttonText: 'View FAQs'
            },
            {
              icon: <FiFileText className="w-6 h-6" />,
              title: 'Raise a Ticket',
              description: 'Submit a support request for detailed assistance.',
              action: () => setShowTicketForm(true),
              buttonText: 'Submit Ticket'
            },
            {
              icon: <FiPhone className="w-6 h-6" />,
              title: 'Contact Us',
              description: 'Reach out to our support team directly.',
              action: () => document.getElementById('contact-section').scrollIntoView(),
              buttonText: 'Contact Support'
            }
          ].map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-blue-600 mb-4">{option.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>
              <button
                onClick={option.action}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {option.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <section id="faq-section" className="mb-12">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.title ? null : category.title
                  )}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium">{category.title}</span>
                  {selectedCategory === category.title ? (
                    <FiChevronDown className="text-gray-600" />
                  ) : (
                    <FiChevronRight className="text-gray-600" />
                  )}
                </button>
                <AnimatePresence>
                  {selectedCategory === category.title && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 space-y-4">
                        {category.questions.map((item, qIndex) => (
                          <div key={qIndex}>
                            <h4 className="font-medium text-gray-800 mb-2">{item.q}</h4>
                            <p className="text-gray-600">{item.a}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <FiPhone className="text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Phone Support</h3>
                <p className="text-gray-600">1800-XXX-XXXX</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM IST</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FiMail className="text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Email Support</h3>
                <p className="text-gray-600">support@sbi.co.in</p>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center mt-1">
                  <FiCopy className="mr-1" /> Copy Email
                </button>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FiMessageCircle className="text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Live Chat</h3>
                <p className="text-gray-600">Chat with our support team</p>
                <button 
                  onClick={() => setShowChatbot(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-lg z-50"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">SBI Support Chat</h3>
              <button 
                onClick={() => setShowChatbot(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            </div>
            <div className="h-96 p-4">
              {/* Chat messages would go here */}
            </div>
            <div className="p-4 border-t">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Form Modal */}
      <AnimatePresence>
        {showTicketForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Submit Support Ticket</h3>
                  <button
                    onClick={() => setShowTicketForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="flex items-center justify-center">
                        <FiPaperclip className="mr-2 text-gray-400" />
                        <span className="text-gray-600">
                          Drag files here or click to upload
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowTicketForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Button (Fixed) */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
      >
        <FiMessageCircle size={24} />
      </button>
    </div>
  );
}

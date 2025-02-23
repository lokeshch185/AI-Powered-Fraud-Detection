import { motion } from 'framer-motion';
import { 
  FiShield, FiClock, FiCheckCircle, FiFileText, 
  FiPhone, FiAward, FiHelpCircle, FiAlertCircle,
  FiMapPin, FiDownload, FiUpload, FiDollarSign,
  FiSmartphone, FiMessageSquare, FiTrendingUp, FiStar
} from 'react-icons/fi';
import sbiLogo from '../assets/sbi-logo.png';
import family from '../assets/family.png';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();
  const trustMetrics = [
    { number: "98%", label: "Claim Settlement Ratio", icon: <FiCheckCircle /> },
    { number: "30min", label: "Average Response Time", icon: <FiClock /> },
    { number: "7000+", label: "Network Hospitals", icon: <FiMapPin /> },
    { number: "50M+", label: "Protected Indians", icon: <FiShield /> }
  ];

  const claimSteps = [
    {
      title: "Digital Claim Filing",
      description: "Submit claims instantly through our app or website",
      icon: <FiSmartphone />,
      color: "bg-blue-500"
    },
    {
      title: "Real-time Tracking",
      description: "Track your claim status 24/7",
      icon: <FiTrendingUp />,
      color: "bg-green-500"
    },
    {
      title: "Quick Processing",
      description: "Claims processed within 30 minutes*",
      icon: <FiClock />,
      color: "bg-purple-500"
    },
    {
      title: "Instant Settlement",
      description: "Direct bank transfer post approval",
      icon: <FiDollarSign />,
      color: "bg-orange-500"
    }
  ];

  const customerTestimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      quote: "My health insurance claim was settled within 24 hours. Excellent service!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      quote: "The cashless hospitalization process was seamless. Thank you SBI Insurance!",
      rating: 5
    },
    {
      name: "Amit Patel",
      location: "Ahmedabad",
      quote: "Quick claim settlement for my car insurance. Very professional service.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={sbiLogo} alt="SBI Logo" className="h-12" />
              <span className="ml-2 text-xl font-semibold text-blue-900">General Insurance</span>
            </div>
            
            {/* <div className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-gray-700 hover:text-blue-800">Products</a>
              <a href="#claims" className="text-gray-700 hover:text-blue-800">Claims</a>
              <a href="#support" className="text-gray-700 hover:text-blue-800">Support</a>
              <a href="#network" className="text-gray-700 hover:text-blue-800">Network</a>
            </div> */}

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <p className="text-sm text-gray-600">24/7 Helpline</p>
                <p className="text-blue-800 font-semibold">1800 209 5555</p>
              </div>
              <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900" onClick={() => navigate('/login')}>
                Login / Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Emergency Assistance Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Emergency Assistance</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:18002095555" className="flex items-center text-red-800 hover:text-red-900">
              <FiPhone className="mr-1" />
              1800 209 5555
            </a>
            <a href="#" className="flex items-center text-green-800 hover:text-green-900">
              <FiMessageSquare className="mr-1" />
              WhatsApp Help
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section with Trust Focus */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Insurance Claims Made <span className="text-yellow-400">Simple</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Experience hassle-free claims with India's most trusted insurance provider. 
                30-minute claim assistance, guaranteed.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-300 transition font-semibold">
                  File a Claim
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition">
                  Track Claim Status
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img 
                src={family} 
                alt="Digital Claim Process" 
                className="w-80 max-w-sm mx-auto"
              />
            </motion.div>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {trustMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
              >
                <div className="text-yellow-400 text-3xl mb-2">{metric.icon}</div>
                <div className="text-2xl font-bold">{metric.number}</div>
                <div className="text-blue-100 text-sm">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Claim Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900">
              4 Simple Steps to Claim Settlement
            </h2>
            <p className="text-gray-600 mt-4">
              We've simplified the claim process to get you faster settlements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {claimSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${step.color}`} />
                <div className={`w-12 h-12 rounded-lg ${step.color} text-white flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900">
              Trusted by Millions
            </h2>
            <p className="text-gray-600 mt-4">
              Here's what our customers say about their claim experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                  <FiCheckCircle className="text-green-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Digital Services */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Digital Services
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
                    <FiSmartphone className="mr-3" />
                    <span>Download Our App</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
                    <FiUpload className="mr-3" />
                    <span>Upload Documents</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
                    <FiDownload className="mr-3" />
                    <span>Download Policy</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Network Hospitals */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">
                Find Nearest Hospital
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter PIN code"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
                <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Search Hospitals
                </button>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4">
                24/7 Emergency Support
              </h3>
              <div className="space-y-4">
                <a href="tel:18002095555" className="flex items-center text-red-700">
                  <FiPhone className="mr-3" />
                  <div>
                    <p className="font-semibold">1800 209 5555</p>
                    <p className="text-sm">Toll Free</p>
                  </div>
                </a>
                <a href="#" className="flex items-center text-green-700">
                  <FiMessageSquare className="mr-3" />
                  <div>
                    <p className="font-semibold">WhatsApp Support</p>
                    <p className="text-sm">Quick Response</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src={sbiLogo} alt="SBI Logo" className="h-12 mb-4 brightness-0 invert" />
              <p className="text-blue-100">
                SBI General Insurance Company Limited
              </p>
              <p className="text-blue-200 text-sm mt-2">
                IRDAI Reg. No. 144 dated 15/12/2009
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Insurance</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white">Health Insurance</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Motor Insurance</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Home Insurance</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Travel Insurance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Important Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Grievance Redressal</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Policy Terms</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-blue-200">
                <li>Corporate Office:</li>
                <li>Natraj, M.V. Road & Western Express Highway Junction</li>
                <li>Andheri (East), Mumbai - 400069</li>
                <li className="mt-4">CIN: U66000MH2009PLC190546</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>© 2024 SBI General Insurance Company Limited. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Insurance is the subject matter of solicitation. For more details on benefits, exclusions, limitations, terms & conditions, please refer sales brochure carefully before concluding a sale.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiFileText, FiClock, FiUser, FiHelpCircle, FiLogOut 
} from 'react-icons/fi';
import sbiLogo from '../assets/sbi-logo.png';
export default function Sidebar({ sidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiFileText />, label: 'File a Claim', path: '/file-claim' },
    { icon: <FiClock />, label: 'Claims History', path: '/claims-history' },
    { icon: <FiHelpCircle />, label: 'Support', path: '/support' },
  ];

  const handleLogout = () => {
    // Clear auth token and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: sidebarOpen ? 0 : -250 }}
      className={`fixed md:static w-64 h-auto bg-white shadow-lg z-30`}
    >
      <div className="p-6">
        <img 
          src={sbiLogo} 
          alt="SBI Logo" 
          className="h-8 mb-8 cursor-pointer" 
          onClick={() => navigate('/')}
        />
        
        <nav className="space-y-2">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full p-3 rounded-lg text-left space-x-3
                ${location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-red-600 space-x-3 mt-8 hover:bg-red-50"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}
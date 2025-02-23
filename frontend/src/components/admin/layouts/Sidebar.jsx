import { motion } from 'framer-motion';
import { 
  FiHome, FiFileText, FiAlertTriangle, FiUsers, 
  FiSettings, FiLogOut 
} from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import sbiLogo from '../../../assets/sbi-logo.png';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      icon: <FiHome />, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      icon: <FiFileText />, 
      label: 'Claims Management', 
      path: '/admin/claims' 
    },
    { 
      icon: <FiFileText />, 
      label: 'Document Verification', 
      path: '/admin/document-verification' 
    },
    { 
      icon: <FiAlertTriangle />, 
      label: 'Fraud Detection', 
      path: '/admin/fraud-insights' 
    },
    { 
      icon: <FiUsers />, 
      label: 'User Management', 
      path: '/admin/user-management' 
    },
    { 
      icon: <FiSettings />, 
      label: 'Settings', 
      path: '/admin/system-settings' 
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: isOpen ? 0 : -250 }}
      className={`fixed md:static w-64  bg-white shadow-lg z-30 h-auto`}
    >
      <div className="p-6">
        <img src={sbiLogo} alt="SBI Logo" className="h-8 mb-8" />
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center w-full p-3 rounded-lg text-left space-x-3
                ${location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-red-600 space-x-3 mt-8 hover:bg-red-50 rounded-lg"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}
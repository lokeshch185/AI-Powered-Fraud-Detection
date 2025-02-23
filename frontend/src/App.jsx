import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/LandingPage'
import Claims from './pages/ClaimPage'
import AdminDashboard from './pages/AdminDashboardPage'
import UserDashboard from './pages/UserDashboardPage'
import FileClaim from './pages/FileClaimPage'
import ClaimsHistory from './pages/ClaimsHistoryPage'
import SupportPage from './pages/SupportPage'
import ClaimsManagement from './pages/ClaimsManagementPage'
import FraudInsights from './pages/FraudInsightsPage'
import UserManagement from './pages/UserManagementPage'
import SystemSettingsPage from './pages/SystemSettingsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DocumentVerificationPage from './pages/DocumentVerificationPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/file-claim" element={<FileClaim />} />
        <Route path="/claims-history" element={<ClaimsHistory />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/admin/claims" element={<ClaimsManagement />} />
        <Route path="/admin/fraud-insights" element={<FraudInsights />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/system-settings" element={<SystemSettingsPage />} />
        <Route path="/admin/document-verification" element={<DocumentVerificationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
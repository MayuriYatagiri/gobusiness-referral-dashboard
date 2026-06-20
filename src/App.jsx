import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ReferralDetail from './components/ReferralDetail';
import NotFound from './components/NotFound';

// Protected Route Guard Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('jwt_token');
  
  // If no token exists, send them back to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/referral/:id" 
          element={
            <ProtectedRoute>
              <ReferralDetail />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route matching standard Dashboard */}
        <Route path="/dashboard/referrals" element={<Navigate to="/" replace />} />

        {/* 404 Route - Kept public */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
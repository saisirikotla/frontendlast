import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/user/UserDashboard';
import BrowseItems from './pages/user/BrowseItems';
import ReportItem from './pages/user/ReportItem';
import MyItems from './pages/user/MyItems';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminItems from './pages/admin/AdminItems';
import AdminUsers from './pages/admin/AdminUsers';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  // While checking localStorage, always show landing page at "/" — no flash/redirect
  if (loading) return <LandingPage />;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      {/* User routes */}
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/browse" element={<ProtectedRoute><BrowseItems /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
      <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/items" element={<ProtectedRoute adminOnly><AdminItems /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141d35',
              color: '#f0f4ff',
              border: '1px solid rgba(79,142,247,0.3)',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
            duration: 3000,
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Members } from '@/pages/Members';
import { Wars } from '@/pages/Wars';
import { PlayerProfile } from '@/pages/Player';
import { Loader } from '@/components/Common/Loader';
import { useClanInfo } from '@/hooks/useClanData';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen text="Checking authentication..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Layout with Header
const Layout: React.FC = () => {
  const { data: clanInfo } = useClanInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header clanInfo={clanInfo ? {
        name: clanInfo.name,
        tag: clanInfo.tag,
        badgeUrls: clanInfo.badgeUrls,
        clanLevel: clanInfo.clanLevel,
      } : null} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

// App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/wars" element={<Wars />} />
          <Route path="/player/:playerTag" element={<PlayerProfile />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

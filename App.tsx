
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './hooks/useAppContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MyRequestsPage from './pages/MyRequestsPage';
import TeamRequestsPage from './pages/TeamRequestsPage';
import UserManagementPage from './pages/UserManagementPage';
import Layout from './components/Layout';
import { UserRole } from './types';

const App: React.FC = () => {
  const { currentUser } = useAppContext();

  return (
    <HashRouter>
      <div className="bg-gray-50 min-h-screen">
        {currentUser ? (
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-requests" element={<MyRequestsPage />} />
              {(currentUser.role === UserRole.DirectManager || currentUser.role === UserRole.HRManager || currentUser.role === UserRole.Dean) && (
                <Route path="/team-requests" element={<TeamRequestsPage />} />
              )}
              {currentUser.role === UserRole.HRManager && (
                <Route path="/user-management" element={<UserManagementPage />} />
              )}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
};

export default App;

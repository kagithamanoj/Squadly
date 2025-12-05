import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JoinTripPage from './pages/JoinTripPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Main Pages
import DashboardPage from './pages/DashboardPage';
import AllExpensesPage from './pages/AllExpensesPage';
import TravelPage from './pages/TravelPage';
import TripDetailsPage from './pages/TripDetailsPage';
import ProfilePage from './pages/ProfilePage';
import EventsPage from './pages/EventsPage';
import ProjectsPage from './pages/ProjectsPage';
import SocialPage from './pages/SocialPage';
import Sidebar from './components/layout/Sidebar';

// Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '463624001072-nctullf7urj3neu8avbkhf0jj30u408t.apps.googleusercontent.com';
console.log('Using Google Client ID:', GOOGLE_CLIENT_ID);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/join/:passCode" element={<JoinTripPage />} />

          {/* Protected Routes */}
          <Route path="/*" element={
            <PrivateRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 lg:ml-72 pb-20 lg:pb-0">
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/expenses" element={<AllExpensesPage />} />
                    <Route path="/travel" element={<TravelPage />} />
                    <Route path="/travel/:id" element={<TripDetailsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/social" element={<SocialPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

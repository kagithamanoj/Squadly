import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Main Pages
import DashboardPage from './pages/DashboardPage';
import AllExpensesPage from './pages/AllExpensesPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';

// Home Scenario
import HomeOverview from './pages/home/HomeOverview';
import ChoresPage from './pages/home/ChoresPage';
import ShoppingPage from './pages/home/ShoppingPage';
import MealsPage from './pages/home/MealsPage';
import HomeExpensesPage from './pages/home/HomeExpensesPage';

// Travel Scenario
import TravelOverview from './pages/travel/TravelOverview';
import TripsPage from './pages/travel/TripsPage';
import ItinerariesPage from './pages/travel/ItinerariesPage';
import PackingPage from './pages/travel/PackingPage';
import TravelExpensesPage from './pages/travel/TravelExpensesPage';

// Events Scenario
import EventsOverview from './pages/events/EventsOverview';
import EventsListPage from './pages/events/EventsListPage';
import GuestListsPage from './pages/events/GuestListsPage';
import EventTasksPage from './pages/events/EventTasksPage';
import EventExpensesPage from './pages/events/EventExpensesPage';

// Projects Scenario
import ProjectsOverview from './pages/projects/ProjectsOverview';
import ProjectsListPage from './pages/projects/ProjectsListPage';
import ProjectTasksPage from './pages/projects/ProjectTasksPage';
import FilesPage from './pages/projects/FilesPage';
import ProjectExpensesPage from './pages/projects/ProjectExpensesPage';

// Social Scenario
import SocialOverview from './pages/social/SocialOverview';
import ActivitiesPage from './pages/social/ActivitiesPage';
import PollsPage from './pages/social/PollsPage';
import ChatPage from './pages/social/ChatPage';
import SocialExpensesPage from './pages/social/SocialExpensesPage';

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Home Scenario */}
            <Route path="home">
              <Route index element={<HomeOverview />} />
              <Route path="chores" element={<ChoresPage />} />
              <Route path="shopping" element={<ShoppingPage />} />
              <Route path="meals" element={<MealsPage />} />
              <Route path="expenses" element={<HomeExpensesPage />} />
            </Route>

            {/* Travel Scenario */}
            <Route path="travel">
              <Route index element={<TravelOverview />} />
              <Route path="trips" element={<TripsPage />} />
              <Route path="itineraries" element={<ItinerariesPage />} />
              <Route path="packing" element={<PackingPage />} />
              <Route path="expenses" element={<TravelExpensesPage />} />
            </Route>

            {/* Events Scenario */}
            <Route path="events">
              <Route index element={<EventsOverview />} />
              <Route path="list" element={<EventsListPage />} />
              <Route path="guests" element={<GuestListsPage />} />
              <Route path="tasks" element={<EventTasksPage />} />
              <Route path="expenses" element={<EventExpensesPage />} />
            </Route>

            {/* Projects Scenario */}
            <Route path="projects">
              <Route index element={<ProjectsOverview />} />
              <Route path="list" element={<ProjectsListPage />} />
              <Route path="tasks" element={<ProjectTasksPage />} />
              <Route path="files" element={<FilesPage />} />
              <Route path="expenses" element={<ProjectExpensesPage />} />
            </Route>

            {/* Social Scenario */}
            <Route path="social">
              <Route index element={<SocialOverview />} />
              <Route path="activities" element={<ActivitiesPage />} />
              <Route path="polls" element={<PollsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="expenses" element={<SocialExpensesPage />} />
            </Route>

            {/* Global Pages */}
            <Route path="expenses" element={<AllExpensesPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

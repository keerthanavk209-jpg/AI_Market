import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import AIChat from './components/AIChat';
import CustomerJourney from './components/CustomerJourney';
import Analytics from './components/Analytics';
import ProductRecommendation from './components/ProductRecommendation';
import UserProfile from './components/UserProfile';
import TrendAnalyzer from './components/TrendAnalyzer';

// ⭐ NEW FILE IMPORT FOR PRODUCT RANGE
import Range from './components/range';

// Protect dashboard pages
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Default Landing Page */}
        <Route path="/" element={<Login />} />

        {/* Public Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/campaigns" element={
          <ProtectedRoute><Campaigns /></ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute><Analytics /></ProtectedRoute>
        } />

        <Route path="/ai-chat" element={
          <ProtectedRoute><AIChat /></ProtectedRoute>
        } />

        <Route path="/user-profile" element={
          <ProtectedRoute><UserProfile /></ProtectedRoute>
        } />

        <Route path="/trend-analyzer" element={
          <ProtectedRoute><TrendAnalyzer /></ProtectedRoute>
        } />

        <Route path="/customer-journey" element={
          <ProtectedRoute><CustomerJourney /></ProtectedRoute>
        } />

        <Route path="/product-recommendation" element={
          <ProtectedRoute><ProductRecommendation /></ProtectedRoute>
        } />

        {/* ⭐ NEW PRODUCT RANGE ROUTE */}
        <Route path="/product-range" element={
          <ProtectedRoute><Range /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

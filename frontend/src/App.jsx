import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TrackingProvider } from './context/TrackingContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Dashboard from './pages/Dashboard';

function AppContent() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Normal User Routes */}
          <Route 
            path="/blogs" 
            element={
              <PrivateRoute>
                <BlogList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/blogs/:id" 
            element={
              <PrivateRoute>
                <BlogDetail />
              </PrivateRoute>
            } 
          />

          {/* Protected Admin User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/blogs" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TrackingProvider>
          <AppContent />
        </TrackingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

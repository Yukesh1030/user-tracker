import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TrackingProvider } from './context/TrackingContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import About from './pages/About';
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
          {/* Public Views */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Member Home */}
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />

          {/* Protected Blog Views */}
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

          {/* Protected Admin Control Panel */}
          <Route 
            path="/dashboard" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />

          {/* Default Catch-all Redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
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

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking permissions...</p>
      </div>
    );
  }

  const isAdmin = token && user && user.role === 'admin';

  return isAdmin ? children : <Navigate to="/blogs" replace />;
};

export default AdminRoute;

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios Defaults
axios.defaults.baseURL = 'http://localhost:8000/api/';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Configure Axios authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('access_token', token);
      
      // Decode user details stored in localStorage or fetch them
      const storedUser = localStorage.getItem('user_details');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user details", e);
        }
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_details');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // Login handler
  const login = async (username, password) => {
    try {
      const response = await axios.post('login/', { username, password });
      const { access, role, email, id } = response.data;
      
      const userProfile = { id, username, email, role };
      localStorage.setItem('user_details', JSON.stringify(userProfile));
      setToken(access);
      setUser(userProfile);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      const errorMsg = error.response?.data?.detail || "Invalid username or password";
      return { success: false, error: errorMsg };
    }
  };

  // Register handler
  const register = async (username, email, password, role) => {
    try {
      await axios.post('register/', { username, email, password, role });
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      let errorMsg = "Registration failed. Please check your inputs.";
      if (error.response?.data) {
        // Collect specific validation errors
        const errors = error.response.data;
        if (typeof errors === 'object') {
          errorMsg = Object.entries(errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
        }
      }
      return { success: false, error: errorMsg };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  const checkLogin = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.me();
      // Handle different response formats
      const userData = res.data || res.user || res;
      
      // Ensure user has required fields including role
      if (userData && userData.id) {
        setUser(userData);
      } else {
        // Invalid user data, clear token
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      // Token invalid or expired - clear it silently
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      
      // Store token
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      
      // Set user data
      const userData = res.data || res.user || res;
      if (userData && userData.id) {
        setUser(userData);
      } else {
        // Fallback: fetch user data if not included in login response
        await checkLogin();
      }
      
      return res;
    } catch (err) {
      // Clear any existing token on login failure
      localStorage.removeItem('token');
      setUser(null);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if available
      await authAPI.logout();
    } catch (err) {
      // Ignore logout API errors, still clear local state
      console.warn('Logout API failed, clearing local session anyway');
    } finally {
      // Always clear local state
      localStorage.removeItem('token');
      setUser(null);
      // Redirect to login
      window.location.href = '/login';
    }
  };

  // Helper function to check if user is admin
  const isAdmin = user?.role === 'admin';

  // Helper function to check if user is logged in
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAdmin,
    isAuthenticated,
    login,
    logout,
    checkLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
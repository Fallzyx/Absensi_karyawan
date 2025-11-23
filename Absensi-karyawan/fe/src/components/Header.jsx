import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1>Supermarket Attendance</h1>
          {user && (
            <span className="user-role">
              {user.role === 'admin' ? 'Administrator' : 
               user.role === 'manager' ? 'Manager' : 'Karyawan'} - {user.nama}
            </span>
          )}
        </div>

        <div className="header-right">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Logout Button */}
          {user && (
            <button 
              onClick={logout}
              className="btn-logout"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
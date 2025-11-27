// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme dari localStorage atau system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('absensi_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Fallback ke system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [mounted, setMounted] = useState(false);

  // Set mounted state setelah component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme ke DOM
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('absensi_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('absensi_theme', 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setLightMode = () => {
    setIsDarkMode(false);
  };

  const setDarkMode = () => {
    setIsDarkMode(true);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    setLightMode,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
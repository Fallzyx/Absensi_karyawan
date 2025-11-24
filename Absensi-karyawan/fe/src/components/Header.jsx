import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Role label yang rapi
  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "manager"
      ? "Store Manager"
      : "Karyawan";

  // Inisial nama untuk avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={`sticky top-0 z-50 shadow-lg backdrop-blur-lg border-b ${
        isDarkMode
          ? "bg-gray-900/95 border-gray-800"
          : "bg-white/95 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Info */}
          <div className="flex items-center space-x-6">
            <h1
              className={`text-2xl font-bold bg-gradient-to-r ${
                isDarkMode
                  ? "from-blue-400 to-purple-400"
                  : "from-blue-600 to-purple-600"
              } bg-clip-text text-transparent`}
            >
              Supermarket Attendance
            </h1>

            {user && (
              <div className="hidden sm:flex items-center space-x-3 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      : user.role === "manager"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {roleLabel}
                </span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {user.nama}
                </span>
              </div>
            )}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              <span className="text-xl">{isDarkMode ? "Sun" : "Moon"}</span>
            </button>

            {/* User Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      user.role === "admin"
                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                        : user.role === "manager"
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                        : "bg-gradient-to-br from-green-500 to-emerald-500"
                    }`}
                  >
                    {getInitials(user.nama)}
                  </div>

                  {/* Arrow */}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    } ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />

                    <div
                      className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden border ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.nama}
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {roleLabel}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-all hover:bg-red-500 hover:text-white ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

// src/components/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.jabatan === 'Manager';
  const roleLabel = isAdmin ? 'Administrator' : 'Karyawan';

  const getInitials = (name) => {
    if (!name) return 'K';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);

    const result = await Swal.fire({
      title: 'Yakin ingin keluar?',
      text: 'Anda akan logout dari sistem absensi',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-purple-200',
        title: 'text-2xl font-bold text-gray-800',
        confirmButton: 'px-8 py-3 mx-2 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all',
        cancelButton: 'px-8 py-3 mx-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all'
      },
      backdrop: 'rgba(0,0,0,0.6)',
      allowOutsideClick: false
    });

    if (result.isConfirmed) {
      // Animasi logout keren
      Swal.fire({
        title: 'Sampai jumpa!',
        html: `<p class="text-lg">Terima kasih telah bekerja hari ini, <strong>${user.nama.split(' ')[0]}</strong>!</p>`,
        icon: 'success',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-3xl shadow-2xl',
          title: 'text-3xl font-bold text-emerald-600'
        },
        willClose: () => {
          logout();
        }
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 shadow-xl backdrop-blur-xl border-b transition-all duration-500 ${
        isDarkMode
          ? 'bg-gray-900/95 border-gray-800'
          : 'bg-white/95 border-purple-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 p-0.5 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity"></div>
            </div>

            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${
                isDarkMode
                  ? 'from-purple-400 via-pink-400 to-rose-400'
                  : 'from-purple-600 via-purple-500 to-pink-600'
              } bg-clip-text text-transparent`}>
                Supermarket Attendance
              </h1>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                Sistem Absensi Modern
              </p>
            </div>
          </div>

          {/* Role Badge (Desktop Only) */}
          {user && (
            <div className="hidden lg:flex items-center space-x-4">
              <div className={`px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg backdrop-blur-sm border ${
                isAdmin
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400/50'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50'
              }`}>
                {isAdmin ? 'ADMINISTRATOR' : 'KARYAWAN'}
              </div>
              <span className={`font-semibold text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {user.nama}
              </span>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg ${
                isDarkMode
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User Avatar Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isDarkMode
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-purple-50'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xl ${
                    isAdmin
                      ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-rose-600'
                      : 'bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600'
                  }`}>
                    {getInitials(user.nama)}
                  </div>
                  <svg className={`w-5 h-5 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className={`absolute right-0 mt-3 w-72 rounded-3xl shadow-2xl overflow-hidden border z-50 ${
                      isDarkMode
                        ? 'bg-gray-800/95 border-gray-700'
                        : 'bg-white/95 border-purple-200'
                    } backdrop-blur-xl`}>
                      {/* User Info */}
                      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-purple-100'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white font-bold text-lg shadow-2xl ${
                            isAdmin
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                              : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                          }`}>
                            {getInitials(user.nama)}
                          </div>
                          <div>
                            <p className={`font-bold text-lg truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.nama}
                            </p>
                            <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.email}
                            </p>
                            <div className="mt-2">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                isAdmin
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {roleLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className={`w-full px-6 py-5 text-left flex items-center gap-4 transition-all font-semibold text-lg group ${
                          isDarkMode
                            ? 'hover:bg-red-900/50 text-gray-300 hover:text-white'
                            : 'hover:bg-red-50 text-gray-700 hover:text-red-600'
                        }`}
                      >
                        <div className="p-3 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-all">
                          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span>Logout dari Sistem</span>
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
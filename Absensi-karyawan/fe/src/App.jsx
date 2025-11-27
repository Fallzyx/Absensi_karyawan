// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import KaryawanList from './components/KaryawanList';  // Hanya ini yang dipakai
import AbsensiList from './components/AbsensiList';

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600 mb-6">Hanya administrator yang dapat mengakses halaman ini.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Main Layout
const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'chart', allowedRoles: ['admin', 'karyawan'] },
    { path: '/absensi', label: 'Absensi', icon: 'check', allowedRoles: ['admin', 'karyawan'] },
    { path: '/karyawan', label: 'Kelola Karyawan', icon: 'users', allowedRoles: ['admin'] },
  ].filter(item => item.allowedRoles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-2xl border-r border-gray-200 pt-20 hidden lg:block">
          <nav className="p-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all ${
                  currentPath === item.path
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                }`}
              >
                {item.icon === 'chart' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
                {item.icon === 'check' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {item.icon === 'users' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                isAdmin ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                {user?.nama?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.nama}</p>
                <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Karyawan'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pt-20 lg:ml-64">
          <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/absensi" element={<AbsensiList />} />

              {/* HALAMAN KARYAWAN – Hanya untuk Admin, Tanpa Tambah Manual */}
              <Route
                path="/karyawan"
                element={
                  <ProtectedRoute adminOnly>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-800">Manajemen Karyawan</h1>
                          <p className="text-gray-600 mt-1">
                            Hanya bisa edit & hapus • Karyawan baru otomatis dari registrasi
                          </p>
                        </div>
                      </div>
                      <KaryawanList />
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Redirect default */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-3 flex flex-col items-center justify-center transition-colors ${
                currentPath === item.path
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon === 'chart' && (
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
              {item.icon === 'check' && (
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {item.icon === 'users' && (
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

// Root App
function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
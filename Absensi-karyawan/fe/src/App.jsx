import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import KaryawanList from './components/KaryawanList';
import KaryawanForm from './components/KaryawanForm';
import AbsensiList from './components/AbsensiList';
import AbsensiForm from './components/AbsensiForm';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showKaryawanForm, setShowKaryawanForm] = useState(false);
  const [showAbsensiForm, setShowAbsensiForm] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Jika belum login → tampilkan Login
  if (!user) {
    return <Login />;
  }

  const handleKaryawanEdit = (karyawan) => {
    setSelectedKaryawan(karyawan);
    setShowKaryawanForm(true);
    setSidebarOpen(false);
  };

  const handleKaryawanSave = () => {
    setShowKaryawanForm(false);
    setSelectedKaryawan(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAbsensiSave = () => {
    setShowAbsensiForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ChartBarIcon' },
    ...(isAdmin ? [{ id: 'karyawan', label: 'Karyawan', icon: 'UsersIcon' }] : []),
    { id: 'absensi', label: 'Absensi', icon: 'CheckCircleIcon' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 bg-white shadow-2xl border-r border-gray-200 pt-20 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <nav className="p-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                }`}
              >
                {/* Icon SVG */}
                {item.icon === 'ChartBarIcon' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h8a2 2 0 012 2v6m-6-8v8m-4-4v4" />
                  </svg>
                )}
                {item.icon === 'UsersIcon' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H9v-1a4 4 0 014-4h2a4 4 0 014 4v1z" />
                  </svg>
                )}
                {item.icon === 'CheckCircleIcon' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen pt-20 lg:pt-0">
          <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed top-24 left-6 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Section Header + Action Button */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'karyawan' && 'Manajemen Karyawan'}
                  {activeTab === 'absensi' && 'Data Absensi'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'dashboard' && 'Ringkasan aktivitas hari ini'}
                  {activeTab === 'karyawan' && 'Kelola data karyawan supermarket'}
                  {activeTab === 'absensi' && 'Catat dan pantau absensi harian'}
                </p>
              </div>

              {/* Tombol Aksi */}
              {(activeTab === 'karyawan' && isAdmin) && (
                <button
                  onClick={() => setShowKaryawanForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
                >
                  + Tambah Karyawan
                </button>
              )}
              {activeTab === 'absensi' && (
                <button
                  onClick={() => setShowAbsensiForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
                >
                  + Check In Manual
                </button>
              )}
            </div>

            {/* Konten Utama */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {activeTab === 'dashboard' && <Dashboard />}

              {activeTab === 'karyawan' && isAdmin && (
                <>
                  {showKaryawanForm ? (
                    <KaryawanForm
                      karyawan={selectedKaryawan}
                      onSave={handleKaryawanSave}
                      onCancel={() => {
                        setShowKaryawanForm(false);
                        setSelectedKaryawan(null);
                      }}
                    />
                  ) : (
                    <KaryawanList
                      onEdit={handleKaryawanEdit}
                      refresh={refreshTrigger}
                    />
                  )}
                </>
              )}

              {activeTab === 'absensi' && (
                <>
                  {showAbsensiForm ? (
                    <AbsensiForm
                      onSave={handleAbsensiSave}
                      onCancel={() => setShowAbsensiForm(false)}
                    />
                  ) : (
                    <AbsensiList refresh={refreshTrigger} />
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
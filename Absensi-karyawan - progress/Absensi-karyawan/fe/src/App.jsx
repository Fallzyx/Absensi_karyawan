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
import Laporan from './components/Laporan';
import './App.css';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showKaryawanForm, setShowKaryawanForm] = useState(false);
  const [showAbsensiForm, setShowAbsensiForm] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redirect to login if not authenticated
  if (!user) {
    return <Login />;
  }

  const handleKaryawanEdit = (karyawan) => {
    setSelectedKaryawan(karyawan);
    setShowKaryawanForm(true);
  };

  const handleKaryawanSave = () => {
    setShowKaryawanForm(false);
    setSelectedKaryawan(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleKaryawanCancel = () => {
    setShowKaryawanForm(false);
    setSelectedKaryawan(null);
  };

  const handleAbsensiSave = () => {
    setShowAbsensiForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <Header />
      
      <nav className="main-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        
        {isAdmin && (
          <button 
            className={activeTab === 'karyawan' ? 'active' : ''}
            onClick={() => setActiveTab('karyawan')}
          >
            👥 Karyawan
          </button>
        )}
        
        <button 
          className={activeTab === 'absensi' ? 'active' : ''}
          onClick={() => setActiveTab('absensi')}
        >
          ✅ Absensi
        </button>
        
        <button 
          className={activeTab === 'laporan' ? 'active' : ''}
          onClick={() => setActiveTab('laporan')}
        >
            📈 Laporan
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        
        {activeTab === 'karyawan' && isAdmin && (
          <div className="karyawan-section">
            <div className="section-header">
              <h2>Manajemen Karyawan</h2>
              <button 
                onClick={() => setShowKaryawanForm(true)}
                className="btn-primary"
              >
                + Tambah Karyawan
              </button>
            </div>

            {showKaryawanForm ? (
              <KaryawanForm
                karyawan={selectedKaryawan}
                onSave={handleKaryawanSave}
                onCancel={handleKaryawanCancel}
              />
            ) : (
              <KaryawanList
                onEdit={handleKaryawanEdit}
                refresh={refreshTrigger}
              />
            )}
          </div>
        )}

        {activeTab === 'absensi' && (
          <div className="absensi-section">
            <div className="section-header">
              <h2>Data Absensi</h2>
              <button 
                onClick={() => setShowAbsensiForm(true)}
                className="btn-primary"
              >
                + Check In
              </button>
            </div>

            {showAbsensiForm ? (
              <AbsensiForm
                onSave={handleAbsensiSave}
                onCancel={() => setShowAbsensiForm(false)}
              />
            ) : (
              <AbsensiList refresh={refreshTrigger} />
            )}
          </div>
        )}

        {activeTab === 'laporan' && <Laporan />}
      </main>
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
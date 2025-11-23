import React, { useState, useEffect } from 'react';
import { karyawanAPI, absensiAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalKaryawan: 0,
    hadirHariIni: 0,
    belumAbsen: 0,
    terlambat: 0
  });
  const [recentAbsensi, setRecentAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      // Load semua data sekaligus
      const [karyawanRes, absensiRes] = await Promise.all([
        karyawanAPI.getAll(),
        absensiAPI.getHariIni()
      ]);

      const totalKaryawan = karyawanRes.data?.length || 0;
      const absensiHariIni = absensiRes.data || [];
      const hadirHariIni = absensiHariIni.length;
      
      // Hitung yang terlambat (asumsi jam masuk standar 08:00)
      const terlambat = absensiHariIni.filter(a => 
        a.jam_masuk && a.jam_masuk > '08:00:00'
      ).length;

      setStats({
        totalKaryawan,
        hadirHariIni,
        belumAbsen: totalKaryawan - hadirHariIni,
        terlambat
      });

      setRecentAbsensi(absensiHariIni.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <div className="loading">Memuat dashboard...</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {/* Statistik Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Karyawan</h3>
            <p className="stat-number">{stats.totalKaryawan}</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Hadir Hari Ini</h3>
            <p className="stat-number">{stats.hadirHariIni}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>Belum Absen</h3>
            <p className="stat-number">{stats.belumAbsen}</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Terlambat</h3>
            <p className="stat-number">{stats.terlambat}</p>
          </div>
        </div>
      </div>

      {/* Recent Absensi */}
      <div className="recent-absensi">
        <h3>Absensi Terbaru</h3>
        {recentAbsensi.length === 0 ? (
          <p>Belum ada absensi hari ini</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jam Masuk</th>
                  <th>Jam Keluar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAbsensi.map((absensi) => (
                  <tr key={absensi.id}>
                    <td>{absensi.nama}</td>
                    <td>{absensi.jam_masuk || '-'}</td>
                    <td>{absensi.jam_keluar || '-'}</td>
                    <td>
                      <span className={`status-badge ${
                        !absensi.jam_masuk ? 'absent' : 
                        !absensi.jam_keluar ? 'checked-in' : 'checked-out'
                      }`}>
                        {!absensi.jam_masuk ? 'Tidak Hadir' : 
                         !absensi.jam_keluar ? 'Checked In' : 'Checked Out'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
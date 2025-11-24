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
      const [karyawanRes, absensiRes] = await Promise.all([
        karyawanAPI.getAll(),
        absensiAPI.getHariIni()
      ]);

      const totalKaryawan = karyawanRes.data?.length || 0;
      const absensiHariIni = absensiRes.data || [];
      const hadirHariIni = absensiHariIni.length;

      const terlambat = absensiHariIni.filter(a => 
        a.jam_masuk && a.jam_masuk > '08:00:00'
      ).length;

      setStats({
        totalKaryawan,
        hadirHariIni,
        belumAbsen: totalKaryawan - hadirHariIni,
        terlambat
      });

      setRecentAbsensi(absensiHariIni.slice(0, 8)); // Tampilkan 8 terbaru
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded w-20"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Judul */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Dashboard Absensi</h1>
        <p className="text-gray-600 mt-2">Selamat datang kembali! Berikut ringkasan hari ini.</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Karyawan */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Karyawan</p>
              <p className="text-4xl font-bold mt-2">{stats.totalKaryawan}</p>
            </div>
            <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H9v-1a4 4 0 014-4h2a4 4 0 014 4v1z" />
            </svg>
          </div>
        </div>

        {/* Hadir Hari Ini */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Hadir Hari Ini</p>
              <p className="text-4xl font-bold mt-2">{stats.hadirHariIni}</p>
            </div>
            <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Belum Absen */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Belum Absen</p>
              <p className="text-4xl font-bold mt-2">{stats.belumAbsen}</p>
            </div>
            <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Terlambat */}
        <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Terlambat</p>
              <p className="text-4xl font-bold mt-2">{stats.terlambat}</p>
            </div>
            <svg className="w-12 h-12 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabel Absensi Terbaru */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Absensi Terbaru Hari Ini</h3>
        </div>

        {recentAbsensi.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">Belum ada absensi hari ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Karyawan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jam Masuk</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jam Keluar</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAbsensi.map((absensi) => {
                  const isLate = absensi.jam_masuk && absensi.jam_masuk > '08:00:00';
                  return (
                    <tr key={absensi.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">{absensi.nama}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {absensi.jam_masuk ? (
                          <span className={isLate ? 'text-red-600 font-semibold' : ''}>
                            {absensi.jam_masuk}
                            {isLate && ' (Terlambat)'}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {absensi.jam_keluar || '-'}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          !absensi.jam_masuk
                            ? 'bg-gray-100 text-gray-700'
                            : !absensi.jam_keluar
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {!absensi.jam_masuk ? 'Belum Absen' : 
                           !absensi.jam_keluar ? 'Sedang Bekerja' : 'Pulang'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
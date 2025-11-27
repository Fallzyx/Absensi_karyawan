// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { absensiAPI, karyawanAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.jabatan === 'Manager';

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
      setLoading(true);
      const [karyawanRes, absensiRes] = await Promise.all([
        karyawanAPI.getAll(),
        absensiAPI.getHariIni()
      ]);

      const semuaKaryawan = (Array.isArray(karyawanRes) ? karyawanRes : karyawanRes.data || [])
        .filter(k => k.role !== 'ADMIN' && k.role !== 'admin');

      let absensiHariIni = Array.isArray(absensiRes) ? absensiRes : absensiRes.data || [];
      absensiHariIni = absensiHariIni.filter(absen =>
        semuaKaryawan.some(k => k.id === absen.karyawan_id)
      );

      const hadirHariIni = absensiHariIni.length;
      const terlambat = absensiHariIni.filter(a => a.jam_masuk && a.jam_masuk > '08:00:00').length;

      setStats({
        totalKaryawan: semuaKaryawan.length,
        hadirHariIni,
        belumAbsen: semuaKaryawan.length - hadirHariIni,
        terlambat
      });
      setRecentAbsensi(absensiHariIni.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Header Selamat Datang */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 p-8 transition-all hover:shadow-2xl">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Selamat datang kembali, {user?.nama}!
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-md">
              {isAdmin ? 'Administrator' : 'Karyawan'}
            </span>
            <span className="text-gray-600 font-medium">Sistem Absensi • Supermarket Modern</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Karyawan */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Karyawan</p>
                <p className="text-5xl font-bold text-gray-900 mt-2">{stats.totalKaryawan}</p>
                <p className="text-xs text-gray-500 mt-1">Tidak termasuk admin</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-md">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hadir Hari Ini */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Hadir Hari Ini</p>
                <p className="text-5xl font-bold text-gray-900 mt-2">{stats.hadirHariIni}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-md">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Belum Absen */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Belum Absen</p>
                <p className="text-5xl font-bold text-gray-900 mt-2">{stats.belumAbsen}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-md">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Terlambat */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Terlambat</p>
                <p className="text-5xl font-bold text-gray-900 mt-2">{stats.terlambat}</p>
                <p className="text-xs text-gray-500 mt-1">&gt; 08:00:00</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-red-100 rounded-2xl flex items-center justify-center shadow-md">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Absensi Terbaru */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden transition-all hover:shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-5">
            <h3 className="text-xl font-bold text-white">Absensi Terbaru Hari Ini</h3>
          </div>

          {recentAbsensi.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-600">Belum ada karyawan yang check-in hari ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Karyawan</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jam Masuk</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jam Keluar</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentAbsensi.map((a) => {
                    const isLate = a.jam_masuk && a.jam_masuk > '08:00:00';
                    return (
                      <tr key={a.id} className="hover:bg-gray-50/70 transition-all duration-200">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                              {a.nama?.[0]?.toUpperCase() || 'K'}
                            </div>
                            <span className="font-semibold text-gray-900">{a.nama}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-mono">
                          {a.jam_masuk ? (
                            <div className="flex items-center gap-3">
                              <span className={isLate ? 'text-rose-600 font-bold' : 'text-gray-800 font-medium'}>
                                {a.jam_masuk}
                              </span>
                              {isLate && (
                                <span className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-100 rounded-xl">
                                  Terlambat
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-8 py-6 font-mono text-gray-600">
                          {a.jam_keluar || '—'}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                            !a.jam_keluar
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {!a.jam_keluar ? 'Sedang Bekerja' : 'Sudah Pulang'}
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
    </div>
  );
};

export default Dashboard;
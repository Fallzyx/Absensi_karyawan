// src/components/AbsensiList.jsx
import React, { useState, useEffect } from 'react';
import { absensiAPI, karyawanAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

let confetti;
try {
  confetti = require('canvas-confetti').default || require('canvas-confetti');
} catch (e) {
  console.warn('canvas-confetti belum terinstall');
}

const AbsensiList = ({ refresh }) => {
  const { user } = useAuth();
  const [absensi, setAbsensi] = useState([]);
  const [karyawanList, setKaryawanList] = useState([]); // Daftar semua karyawan
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [myAbsenToday, setMyAbsenToday] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin' || user?.jabatan === 'Manager';

  // Load daftar karyawan sekali saja (untuk mapping nama & filter admin)
  useEffect(() => {
    const loadKaryawan = async () => {
      try {
        const res = await karyawanAPI.getAll();
        const data = (Array.isArray(res) ? res : res.data || [])
          .filter(k => k.role !== 'ADMIN' && k.role !== 'admin'); // HANYA KARYAWAN BIASA

        setKaryawanList(data);
      } catch (err) {
        console.error('Gagal load karyawan:', err);
      }
    };
    loadKaryawan();
  }, []);

  const loadAbsensi = async (date = selectedDate) => {
    setLoading(true);
    try {
      const res = date === today
        ? await absensiAPI.getHariIni()
        : await absensiAPI.getByDate(date);

      let data = Array.isArray(res) ? res : res.data || [];

      // FILTER: Hanya tampilkan absensi karyawan NON-ADMIN
      data = data.filter(absen => {
        const karyawan = karyawanList.find(k => k.id === absen.karyawan_id);
        return karyawan && karyawan.role !== 'ADMIN' && karyawan.role !== 'admin';
      });

      // Join nama karyawan dari karyawanList
      const enrichedData = data.map(absen => {
        const karyawan = karyawanList.find(k => k.id === absen.karyawan_id);
        return {
          ...absen,
          nama: karyawan?.nama || 'Unknown',
          email: karyawan?.email || '-'
        };
      });

      setAbsensi(enrichedData);

      // Cek absen user sendiri (hanya jika bukan admin)
      if (user && date === today && !isAdmin) {
        const myRecord = enrichedData.find(a =>
          String(a.karyawan_id) === String(user.id || user.karyawan_id)
        );
        setMyAbsenToday(myRecord || null);
      }
    } catch (err) {
      console.error('Error load absensi:', err);
      Swal.fire('Error', 'Gagal memuat data absensi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbsensi();
  }, [refresh, selectedDate, karyawanList, user]);

  const triggerConfetti = () => {
    if (confetti) {
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981']
      });
    }
  };

  const handleCheckIn = async () => {
    if (isAdmin) return;

    const result = await Swal.fire({
      title: 'Check In Sekarang?',
      html: `<p class="text-lg">Selamat pagi, <strong>${user.nama}</strong>!<br>Yakin ingin mencatat kehadiran?</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Check In!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-3xl shadow-2xl',
        confirmButton: 'px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl',
        cancelButton: 'px-8 py-3 bg-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-400'
      }
    });

    if (!result.isConfirmed) return;

    Swal.fire({ title: 'Mencatat kehadiran...', didOpen: () => Swal.showLoading() });

    try {
      const jamMasuk = new Date().toTimeString().slice(0, 8);
      const karyawanId = user.id || user.karyawan_id;

      await absensiAPI.checkIn({
        karyawan_id: karyawanId,
        jam_masuk: jamMasuk
      });

      triggerConfetti();

      Swal.fire({
        icon: 'success',
        title: 'Check In Berhasil!',
        html: `<p class="text-lg">Selamat bekerja hari ini, <strong>${user.nama.split(' ')[0]}</strong>!</p>`,
        timer: 4000,
        timerProgressBar: true,
        customClass: { popup: 'rounded-3xl shadow-2xl' }
      });

      loadAbsensi();
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.message || 'Sudah check-in hari ini!', 'error');
    }
  };

  const handleCheckOut = async (id, nama) => {
    const result = await Swal.fire({
      title: `Check Out untuk ${nama || 'Karyawan'}?`,
      text: 'Yakin ingin mencatat jam pulang?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Pulang!',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl',
        cancelButton: 'px-8 py-3 bg-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-400'
      }
    });

    if (!result.isConfirmed) return;

    Swal.fire({ title: 'Mencatat jam pulang...', didOpen: () => Swal.showLoading() });

    try {
      const jamKeluar = new Date().toTimeString().slice(0, 8);
      await absensiAPI.checkOut(id, { jam_keluar: jamKeluar });

      triggerConfetti();

      Swal.fire({
        icon: 'success',
        title: 'Check Out Berhasil!',
        text: `${nama || 'Karyawan'} telah pulang pukul ${jamKeluar}`,
        timer: 3000,
        timerProgressBar: true
      });

      loadAbsensi();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Gagal check out', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-xl font-bold text-gray-700">Memuat data absensi karyawan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Check-in Card HANYA untuk Karyawan (bukan Admin) */}
      {user && !isAdmin && selectedDate === today && (
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-10 text-white text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-6">Halo, {user.nama}!</h3>

            {myAbsenToday ? (
              <div className="space-y-8">
                <p className="text-2xl opacity-95">
                  Check-in: <span className="font-bold text-4xl">{myAbsenToday.jam_masuk}</span>
                </p>

                {!myAbsenToday.jam_keluar ? (
                  <button
                    onClick={() => handleCheckOut(myAbsenToday.id, user.nama)}
                    className="px-24 py-12 bg-white text-purple-700 font-black text-4xl rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    CHECK OUT SEKARANG
                  </button>
                ) : (
                  <div className="inline-block px-20 py-12 bg-white/20 backdrop-blur-xl rounded-3xl text-4xl font-bold">
                    Pulang pukul {myAbsenToday.jam_keluar}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                className="px-32 py-20 bg-white text-purple-700 font-black text-6xl rounded-3xl shadow-2xl hover:scale-105 hover:shadow-purple-600/50 transition-all duration-300 animate-pulse"
              >
                TAP UNTUK CHECK IN
              </button>
            )}
          </div>
        </div>
      )}

      {/* Welcome Admin */}
      {isAdmin && selectedDate === today && (
        <div className="bg-gradient-to-r from-purple-700 to-pink-700 rounded-3xl shadow-2xl p-12 text-white text-center">
          <h3 className="text-5xl font-bold mb-4">Selamat Datang, Administrator!</h3>
          <p className="text-2xl opacity-90">Anda sedang mengelola absensi <strong>{absensi.length} karyawan</strong> hari ini</p>
        </div>
      )}

      {/* Date Picker + Total */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">Daftar Absensi Karyawan</h2>
          <p className="text-xl font-semibold text-purple-600 mt-2">
            Total hadir: <span className="text-4xl font-bold">{absensi.length}</span> orang
          </p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-6 py-4 bg-white border-2 border-purple-300 rounded-2xl text-lg font-medium focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all shadow-lg"
        />
      </div>

      {/* Tabel Absensi (Hanya Karyawan Non-Admin) */}
      {absensi.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-24 text-center">
          <p className="text-2xl font-semibold text-gray-500">Belum ada karyawan yang check-in pada tanggal ini</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <th className="px-8 py-6 text-left font-bold text-lg">Nama</th>
                  <th className="px-8 py-6 text-left font-bold text-lg">Jam Masuk</th>
                  <th className="px-8 py-6 text-left font-bold text-lg">Jam Keluar</th>
                  <th className="px-8 py-6 text-left font-bold text-lg">Status</th>
                  {isAdmin && <th className="px-8 py-6 text-left font-bold text-lg">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {absensi.map((a) => {
                  const isLate = a.jam_masuk && a.jam_masuk > '08:00:00';
                  return (
                    <tr key={a.id} className="hover:bg-purple-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-lg">
                            {a.nama?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="font-semibold text-gray-900 text-lg">{a.nama}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-lg">
                        {a.jam_masuk ? (
                          <span className={isLate ? 'text-rose-600 font-bold' : 'text-emerald-700'}>
                            {a.jam_masuk}
                            {isLate && <span className="ml-3 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">Terlambat</span>}
                          </span>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-8 py-6 font-mono text-lg text-gray-600">
                        {a.jam_keluar || '—'}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-5 py-2.5 rounded-xl font-bold text-sm ${
                          !a.jam_masuk ? 'bg-gray-100 text-gray-700' :
                          !a.jam_keluar ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {!a.jam_masuk ? 'Belum Hadir' : !a.jam_keluar ? 'Sedang Bekerja' : 'Sudah Pulang'}
                        </span>
                      </td>
                      {isAdmin && !a.jam_keluar && a.jam_masuk && (
                        <td className="px-8 py-6">
                          <button
                            onClick={() => handleCheckOut(a.id, a.nama)}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg transform hover:scale-105 transition-all"
                          >
                            Check Out
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsensiList;
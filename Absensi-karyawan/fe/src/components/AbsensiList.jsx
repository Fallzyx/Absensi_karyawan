import React, { useState, useEffect } from 'react';
import { absensiAPI } from '../services/api';

const AbsensiList = ({ refresh }) => {
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadAbsensi = async (date = selectedDate) => {
    setLoading(true);
    setError('');
    try {
      const response = date === new Date().toISOString().split('T')[0]
        ? await absensiAPI.getHariIni()
        : await absensiAPI.getByDate(date);
      setAbsensi(response.data || []);
    } catch (err) {
      setError('Gagal memuat data absensi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbsensi();
  }, [refresh]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    loadAbsensi(newDate);
  };

  const handleCheckOut = async (id, nama) => {
    if (!window.confirm(`Check-out untuk ${nama} sekarang?`)) return;

    const jamKeluar = new Date().toTimeString().slice(0, 8);
    try {
      await absensiAPI.checkOut(id, { jam_keluar: jamKeluar });
      loadAbsensi();
    } catch (err) {
      alert('Gagal check-out: ' + (err.response?.data?.message || err.message));
    }
  };

  // === LOGIKA STATUS MASUK BARU ===
  const getJamMasukInfo = (jamMasuk) => {
    if (!jamMasuk) {
      return {
        waktu: '-',
        keterangan: 'Tidak Hadir',
        warnaWaktu: 'text-gray-400',
        warnaKeterangan: 'text-gray-500 font-medium',
        badge: 'bg-gray-100 text-gray-700'
      };
    }

    const [h, m, s] = jamMasuk.split(':').map(Number);
    const totalMenit = h * 60 + m;

    // 04:00 - 07:00 → Tepat Waktu
    if (totalMenit >= 240 && totalMenit <= 420) {
      return {
        waktu: jamMasuk,
        keterangan: 'Tepat Waktu',
        warnaWaktu: 'text-green-700 font-semibold',
        warnaKeterangan: 'text-green-600',
        badge: 'bg-green-100 text-green-800'
      };
    }
    // 07:01 - 13:00 → Terlambat
    else if (totalMenit > 420 && totalMenit <= 780) {
      return {
        waktu: jamMasuk,
        keterangan: 'Terlambat',
        warnaWaktu: 'text-red-700 font-semibold',
        warnaKeterangan: 'text-red-600',
        badge: 'bg-red-100 text-red-800'
      };
    }
    // > 13:00 → Pulang Awal / Masuk terlalu siang
    else {
      return {
        waktu: jamMasuk,
        keterangan: 'Pulang Awal / Terlalu Siang',
        warnaWaktu: 'text-purple-700 font-semibold',
        warnaKeterangan: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800'
      };
    }
  };

  // Status badge (Sedang Bekerja / Pulang / Tidak Hadir)
  const getStatusBadge = (a) => {
    if (!a.jam_masuk) {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Tidak Hadir</span>;
    }
    if (!a.jam_keluar) {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Sedang Bekerja</span>;
    }
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Pulang</span>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Data Absensi Karyawan</h2>
          <p className="text-gray-600 mt-1">Lihat dan kelola absensi harian</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Pilih Tanggal:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Legenda Warna (Sangat membantu user) */}
      <div className="flex flex-wrap items-center gap-6 text-sm bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100"></div>
          <span>04:00 – 07:00 (Tepat Waktu)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100"></div>
          <span>07:01 – 13:00 (Terlambat)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-100"></div>
          <span>&gt; 13:00 atau Tidak Hadir</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Tabel Absensi */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {absensi.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600">Tidak ada data absensi untuk tanggal ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Jam Masuk</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Jam Keluar</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {absensi.map((a) => {
                  const info = getJamMasukInfo(a.jam_masuk);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">{a.nama}</td>
                      <td className="px-6 py-5 text-sm text-gray-600">{a.jabatan || '-'}</td>
                      <td className="px-6 py-5 text-sm text-gray-600">{a.tanggal}</td>

                      {/* Jam Masuk + Keterangan */}
                      <td className="px-6 py-5 text-sm">
                        <div className="flex flex-col">
                          <span className={info.warnaWaktu}>{info.waktu}</span>
                          {a.jam_masuk && (
                            <span className={`text-xs mt-0.5 ${info.warnaKeterangan}`}>
                              ({info.keterangan})
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {a.jam_keluar || <span className="text-gray-400">-</span>}
                      </td>

                      <td className="px-6 py-5">{getStatusBadge(a)}</td>

                      <td className="px-6 py-5">
                        {a.jam_masuk && !a.jam_keluar && (
                          <button
                            onClick={() => handleCheckOut(a.id, a.nama)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-sm rounded-lg hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
                          >
                            Check Out
                          </button>
                        )}
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

export default AbsensiList;
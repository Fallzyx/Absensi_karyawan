import React, { useState, useEffect } from 'react';
import { karyawanAPI } from '../services/api';

const KaryawanList = ({ onEdit, refresh }) => {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadKaryawan = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await karyawanAPI.getAll();
      setKaryawan(response.data || []);
    } catch (err) {
      setError('Gagal memuat data karyawan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKaryawan();
  }, [refresh]);

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Hapus karyawan "${nama}" secara permanen?`)) return;

    try {
      await karyawanAPI.delete(id);
      loadKaryawan(); // Refresh otomatis
    } catch (err) {
      alert('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">Daftar Karyawan</h2>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between h-16 bg-gray-100 rounded-lg animate-pulse">
                <div className="flex-1 flex gap-6 px-6">
                  <div className="h-6 bg-gray-300 rounded w-48"></div>
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-6 bg-gray-300 rounded w-40"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded-lg w-32 mr-6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-700">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-semibold">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Judul */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Daftar Karyawan</h2>
        <p className="text-gray-600 mt-1">Kelola data karyawan supermarket</p>
      </div>

      {/* Tabel Karyawan */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {karyawan.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-gray-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 4.354a4 4 0 110 5.292M15 21H9v-1a4 4 0 014-4h2a4 4 0 014 4v1z M19 11a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-600 font-medium">Belum ada data karyawan</p>
            <p className="text-gray-500 mt-2">Tambahkan karyawan pertama Anda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Telepon</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {karyawan.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-5 text-sm font-semibold text-gray-900 flex items-center gap-3">
                      {/* Avatar kecil */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {k.nama.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      {k.nama}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {k.jabatan || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">{k.departemen || '-'}</td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-mono">{k.email || '-'}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{k.telepon || '-'}</td>
                    <td className="px-6 py-5 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(k)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-xs rounded-lg hover:from-amber-600 hover:to-orange-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
                          title="Edit karyawan"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(k.id, k.nama)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium text-xs rounded-lg hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
                          title="Hapus karyawan"
                        >
                          Hapus
                        </button>
                      </div>
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

export default KaryawanList;
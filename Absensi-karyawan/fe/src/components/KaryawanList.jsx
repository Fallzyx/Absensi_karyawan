// src/components/KaryawanList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { karyawanAPI } from '../services/api';
import Swal from 'sweetalert2';

const KaryawanList = () => {
  const { user } = useAuth();
  
  // Deteksi admin: role ADMIN atau jabatan Manager
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin' || user?.jabatan === 'Manager';

  const [karyawans, setKaryawans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const jabatanOptions = ['Kasir', 'Staff', 'Supervisor', 'Manager'];
  const departemenOptions = ['Kasir', 'HRD', 'Gudang', 'Manajemen', 'Operasional', 'Keuangan', 'Marketing'];

  const loadKaryawans = async () => {
    setLoading(true);
    try {
      const res = await karyawanAPI.getAll();
      const data = (Array.isArray(res) ? res : res.data || []);
      setKaryawans(data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Tidak dapat memuat data karyawan',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadKaryawans();
  }, [isAdmin]);

  // Cek apakah user adalah admin
  const isUserAdmin = (k) => {
    return k.role === 'ADMIN' || k.role === 'admin' || k.jabatan === 'Manager';
  };

  const handleEdit = (karyawan) => {
    if (isUserAdmin(karyawan)) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Diizinkan',
        text: 'Data Administrator tidak dapat diubah!',
        confirmButtonColor: '#8b5cf6'
      });
      return;
    }

    setEditingId(karyawan.id);
    setEditForm({
      nama: karyawan.nama || '',
      email: karyawan.email || '',
      jabatan: karyawan.jabatan || '',
      departemen: karyawan.departemen || '',
      telepon: karyawan.telepon || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await karyawanAPI.update(id, editForm);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data karyawan diperbarui',
        timer: 2000,
        showConfirmButton: false
      });
      setEditingId(null);
      loadKaryawans();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.response?.data?.message || 'Gagal menyimpan perubahan',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDelete = async (id, nama) => {
    const result = await Swal.fire({
      title: `Hapus ${nama}?`,
      text: "Data karyawan akan dihapus permanen dan tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-3xl shadow-2xl',
        confirmButton: 'px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl',
        cancelButton: 'px-8 py-3 rounded-xl font-bold'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await karyawanAPI.delete(id);
      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: `${nama} telah dihapus dari sistem.`,
        timer: 2500,
        showConfirmButton: false
      });
      loadKaryawans();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: 'Karyawan mungkin memiliki data absensi terkait.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const filteredKaryawan = karyawans.filter(k =>
    (k.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Jika bukan admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200 p-16 text-center max-w-md">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Akses Ditolak</h2>
          <p className="text-lg text-gray-600">Hanya Administrator yang dapat mengelola data karyawan.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-8 text-2xl font-bold text-purple-700">Memuat data karyawan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-3xl shadow-2xl p-10 text-white">
        <h1 className="text-5xl font-bold mb-3">Manajemen Karyawan</h1>
        <p className="text-xl opacity-90">
          Total terdaftar: <span className="font-bold text-3xl">{karyawans.length}</span> orang
          {karyawans.filter(isUserAdmin).length > 0 && (
            <span className="ml-4"> • <strong>{karyawans.filter(isUserAdmin).length}</strong> Administrator</span>
          )}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6">
        <div className="relative max-w-2xl mx-auto">
          <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama, email, atau jabatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-purple-50/50 border-2 border-purple-200 rounded-2xl text-lg font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <th className="px-8 py-6 text-left font-bold text-lg">Karyawan</th>
                <th className="px-8 py-6 text-left font-bold text-lg">Email</th>
                <th className="px-8 py-6 text-left font-bold text-lg">Jabatan</th>
                <th className="px-8 py-6 text-left font-bold text-lg">Departemen</th>
                <th className="px-8 py-6 text-left font-bold text-lg">Status</th>
                <th className="px-8 py-6 text-center font-bold text-lg">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {filteredKaryawan.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-32">
                    <div className="text-gray-400">
                      <svg className="w-24 h-24 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-2xl font-bold text-purple-600">
                        {searchTerm ? 'Tidak ditemukan' : 'Belum ada karyawan'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredKaryawan.map((k) => {
                  const admin = isUserAdmin(k);
                  return (
                    <tr key={k.id} className={`hover:bg-purple-50/50 transition-all ${admin ? 'bg-purple-50/30' : ''}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl ${
                            admin
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                              : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                          }`}>
                            {k.nama?.[0]?.toUpperCase() || 'K'}
                          </div>
                          <div>
                            {editingId === k.id ? (
                              <input
                                value={editForm.nama}
                                onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                                className="px-4 py-2 bg-white border-2 border-purple-300 rounded-xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-purple-100"
                                autoFocus
                              />
                            ) : (
                              <span className="font-bold text-gray-900 text-lg">{k.nama}</span>
                            )}
                            {admin && <div className="text-xs font-bold text-purple-600">ADMINISTRATOR</div>}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 font-medium text-gray-700">{k.email}</td>

                      <td className="px-8 py-6">
                        {editingId === k.id ? (
                          <select
                            value={editForm.jabatan}
                            onChange={(e) => setEditForm({ ...editForm, jabatan: e.target.value })}
                            className="px-4 py-3 bg-white border-2 border-purple-300 rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-100"
                          >
                            <option value="">Pilih Jabatan</option>
                            {jabatanOptions.map(j => <option key={j} value={j}>{j}</option>)}
                          </select>
                        ) : (
                          <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                            admin ? 'bg-purple-200 text-purple-800' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {k.jabatan || '—'}
                          </span>
                        )}
                      </td>

                      <td className="px-8 py-6">
                        {editingId === k.id ? (
                          <select
                            value={editForm.departemen}
                            onChange={(e) => setEditForm({ ...editForm, departemen: e.target.value })}
                            className="px-4 py-3 bg-white border-2 border-purple-300 rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-100"
                          >
                            <option value="">Pilih Departemen</option>
                            {departemenOptions.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        ) : (
                          <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                            k.departemen ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {k.departemen || '—'}
                          </span>
                        )}
                      </td>

                      <td className="px-8 py-6">
                        <span className={`px-5 py-2.5 rounded-xl font-bold text-sm ${
                          admin
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {admin ? 'ADMIN' : 'KARYAWAN'}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          {editingId === k.id ? (
                            <>
                              <button
                                onClick={() => saveEdit(k.id)}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-6 py-3 bg-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-400 transition-all"
                              >
                                Batal
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(k)}
                                disabled={admin}
                                className={`px-6 py-3 font-bold rounded-xl shadow-lg transition-all ${
                                  admin
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                                }`}
                              >
                                {admin ? 'Dilindungi' : 'Edit'}
                              </button>

                              {!admin && (
                                <button
                                  onClick={() => handleDelete(k.id, k.nama)}
                                  className="px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:from-rose-600 hover:to-red-700 transition-all"
                                >
                                  Hapus
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KaryawanList;
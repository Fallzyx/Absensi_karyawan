import React, { useState, useEffect } from 'react';
import { karyawanAPI } from '../services/api';

const KaryawanForm = ({ karyawan, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    departemen: '',
    email: '',
    telepon: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (karyawan) {
      setFormData({
        nama: karyawan.nama || '',
        jabatan: karyawan.jabatan || '',
        departemen: karyawan.departemen || '',
        email: karyawan.email || '',
        telepon: karyawan.telepon || ''
      });
    } else {
      setFormData({
        nama: '',
        jabatan: '',
        departemen: '',
        email: '',
        telepon: ''
      });
    }
  }, [karyawan]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (karyawan) {
        await karyawanAPI.update(karyawan.id, formData);
      } else {
        await karyawanAPI.create(formData);
      }
      onSave();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Gagal menyimpan data karyawan. Periksa kembali isian.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!karyawan;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Backdrop putih + opacity ringan agar tetap terasa modal */}
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-sm" 
        onClick={onCancel} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl mx-4 transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        
        {/* Header Gradient (tetap cantik) */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">
            {isEdit ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
          </h2>
          <p className="mt-1 text-indigo-100">
            {isEdit ? 'Perbarui data karyawan' : 'Lengkapi semua field di bawah'}
          </p>
        </div>

        <div className="p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold">Terjadi kesalahan</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              {/* Jabatan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="Contoh: Kasir, Staff Gudang"
                />
              </div>

              {/* Departemen */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Departemen <span className="text-red-500">*</span>
                </label>
                <select
                  name="departemen"
                  value={formData.departemen}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="">— Pilih Departemen —</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="HRD">HRD </option>
                  <option value="Gudang">Gudang</option>
                  <option value="Kasir">Kasir</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="budi@supermarket.co.id"
                />
              </div>

              {/* Telepon */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="0812-3456-7890 (opsional)"
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-bold text-white flex items-center gap-3 transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>{isEdit ? 'Update Karyawan' : 'Simpan Karyawan'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KaryawanForm;
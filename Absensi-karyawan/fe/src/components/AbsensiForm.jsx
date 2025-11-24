import React, { useState, useEffect } from 'react';
import { absensiAPI, karyawanAPI } from '../services/api';

const AbsensiForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    karyawan_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    jam_masuk: new Date().toTimeString().split(' ')[0].slice(0, 5),
    keterangan: ''
  });
  const [karyawanList, setKaryawanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingKaryawan, setLoadingKaryawan] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadKaryawan();
  }, []);

  const loadKaryawan = async () => {
    setLoadingKaryawan(true);
    try {
      const response = await karyawanAPI.getAll();
      setKaryawanList(response.data || []);
    } catch (err) {
      setError('Gagal memuat daftar karyawan');
      console.error(err);
    } finally {
      setLoadingKaryawan(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await absensiAPI.checkIn(formData);
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal check-in. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Backdrop putih bersih + sedikit blur */}
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-sm" 
        onClick={onCancel} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg mx-4 transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        
        {/* Header tetap gradient (biar cantik) */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Check In Karyawan</h2>
          <p className="mt-1 text-indigo-100">Absen masuk karyawan untuk hari ini</p>
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
            {/* Karyawan Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Karyawan <span className="text-red-500">*</span>
              </label>
              {loadingKaryawan ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-200"></div>
                  ))}
                </div>
              ) : (
                <select
                  name="karyawan_id"
                  value={formData.karyawan_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="">— Pilih Karyawan —</option>
                  {karyawanList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} ({k.jabatan || 'Karyawan'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            {/* Jam Masuk */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jam Masuk <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="jam_masuk"
                value={formData.jam_masuk}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keterangan (opsional)
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                rows={3}
                placeholder="Contoh: Izin dokter, datang lebih awal, dll."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition resize-none"
              />
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
                disabled={loading || loadingKaryawan}
                className={`px-8 py-3 rounded-lg font-bold text-white flex items-center gap-3 transition-all ${
                  loading || loadingKaryawan
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
                    Memproses...
                  </>
                ) : (
                  'Check In Karyawan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AbsensiForm;
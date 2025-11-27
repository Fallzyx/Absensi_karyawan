// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api'; // ← UBAH INI (dari karyawanAPI ke authAPI)
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    jabatan: '',
    departemen: '',
    telepon: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.nama || !formData.email || !formData.password || !formData.jabatan || !formData.departemen) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Semua field wajib diisi!',
        confirmButtonColor: '#8b5cf6'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Password tidak cocok!',
        confirmButtonColor: '#8b5cf6'
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Password minimal 6 karakter!',
        confirmButtonColor: '#8b5cf6'
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ UBAH INI - Pakai authAPI.register, bukan karyawanAPI.create
      await authAPI.register({
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        jabatan: formData.jabatan,
        departemen: formData.departemen,
        telepon: formData.telepon || null,
        role: 'karyawan' // Default role
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Akun berhasil dibuat. Silakan login.',
        confirmButtonColor: '#10b981'
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      console.error('Register error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mendaftar',
        text: err.message || 'Email mungkin sudah terdaftar.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Daftar Akun</h2>
          <p className="text-purple-100 mt-2">Supermarket Attendance System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contoh: budi@supermarket.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Jabatan & Departemen */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan <span className="text-red-500">*</span>
              </label>
              <select
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Pilih</option>
                <option value="Kasir">Kasir</option>
                <option value="Staff">Staff</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departemen <span className="text-red-500">*</span>
              </label>
              <select
                name="departemen"
                value={formData.departemen}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Pilih</option>
                <option value="Kasir">Kasir</option>
                <option value="HRD">HRD</option>
                <option value="Gudang">Gudang</option>
                <option value="Manajemen">Manajemen</option>
              </select>
            </div>
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No. Telepon
            </label>
            <input
              type="tel"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              placeholder="08123456789 (opsional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Masukkan password lagi"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Mendaftar...' : 'DAFTAR'}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700">
              Masuk di sini
            </Link>
          </p>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-500 border-t">
          © 2025 Supermarket Attendance System
        </div>
      </div>
    </div>
  );
};

export default Register;
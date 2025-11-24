import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Mock users (hanya untuk demo)
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', nama: 'Administrator' },
  { id: 2, username: 'manager', password: 'manager123', role: 'manager', nama: 'Store Manager' },
  { id: 3, username: 'karyawan', password: 'karyawan123', role: 'user', nama: 'karyawan supermarket' }
]; 

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = mockUsers.find(u => 
        u.username === formData.username && u.password === formData.password
      );

      if (user) {
        login(user);
      } else {
        setError('Username atau password salah');
      }
      setLoading(false);
    }, 1000);
  };

  const quickLogin = (username, password) => {
    setFormData({ username, password });
    // Auto submit setelah isi form
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 px-4">
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <h2 className="text-3xl font-bold text-white">Sistem Absensi</h2>
            <p className="text-indigo-100 mt-2 text-lg">Supermarket Attendance System</p>
          </div>

          <div className="p-8">
            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Masukkan password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                {loading ? 'Sedang Login...' : 'Login'}
              </button>
            </form>

            {/* Quick Login Demo */}
            <div className="mt-10">
              <p className="text-center text-sm text-gray-600 mb-4 font-medium">
                Akun Demo – Klik untuk login cepat
              </p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => quickLogin('admin', 'admin123')}
                  className="py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Admin (admin / admin123)
                </button>
                <button
                  onClick={() => quickLogin('manager', 'manager123')}
                  className="py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Manager (manager / manager123)
                </button>
                <button
                  onClick={() => quickLogin('karyawan', 'karyawan123')}
                  className="py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Karyawan (karyawan / karyawan123)
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-8">
              © 2025 Supermarket Attendance System • Demo Version
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
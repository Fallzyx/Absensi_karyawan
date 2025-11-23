import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Simple mock users - in real app, this would come from backend
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', nama: 'Administrator' },
  { id: 2, username: 'manager', password: 'manager123', role: 'manager', nama: 'Store Manager' },
  { id: 3, username: 'karyawan', password: 'karyawan123', role: 'user', nama: 'Budi Santoso' }
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

    // Mock authentication
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

  // Quick login buttons for demo
  const quickLogin = (username, password) => {
    setFormData({ username, password });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login Sistem Absensi</h2>
        <p className="login-subtitle">Supermarket Attendance System</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary login-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Quick login for demo */}
        <div className="quick-login">
          <p>Demo Accounts:</p>
          <div className="quick-buttons">
            <button 
              onClick={() => quickLogin('admin', 'admin123')}
              className="btn-admin"
            >
              Login as Admin
            </button>
            <button 
              onClick={() => quickLogin('manager', 'manager123')}
              className="btn-manager"
            >
              Login as Manager
            </button>
            <button 
              onClick={() => quickLogin('karyawan', 'karyawan123')}
              className="btn-user"
            >
              Login as Karyawan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
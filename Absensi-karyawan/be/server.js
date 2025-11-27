// server.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

// Import routes
const karyawanRoutes = require('./routes/karyawanRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
const authRoutes = require('./routes/authRoutes'); // ← TAMBAHKAN INI

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // URL frontend Vite
  credentials: true
}));

app.use(express.json());

// Session setup
app.use(session({
  secret: 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set true jika pakai HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 jam
  }
}));

// Routes
app.use('/api/auth', authRoutes);         // ← TAMBAHKAN INI (HARUS DI ATAS)
app.use('/api/karyawan', karyawanRoutes);
app.use('/api/absensi', absensiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
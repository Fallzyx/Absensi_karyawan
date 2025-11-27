// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const KaryawanModel = require('../models/karyawanModels');

// ===================== MIDDLEWARE =====================
const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({
      success: false,
      message: 'Silakan login terlebih dahulu'
    });
  }
  next();
};

// ===================== ROUTES =====================

// ✅ REGISTER - PUBLIC (TANPA AUTH)
router.post('/register', async (req, res) => {
  try {
    const { nama, email, password, jabatan, departemen, telepon, role } = req.body;

    // Validasi field wajib
    if (!nama?.trim() || !email?.trim() || !password || !jabatan?.trim() || !departemen?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, password, jabatan, dan departemen wajib diisi!'
      });
    }

    // Validasi password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter!'
      });
    }

    // Cek email sudah ada belum
    const existing = await KaryawanModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email ini sudah terdaftar!'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const result = await KaryawanModel.create({
      nama: nama.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      jabatan: jabatan.trim(),
      departemen: departemen.trim(),
      telepon: telepon?.trim() || null,
      role: role || 'karyawan' // Default role
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error register:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mendaftar',
      error: error.message
    });
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi!'
      });
    }

    // Cari user berdasarkan email
    const user = await KaryawanModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah!'
      });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah!'
      });
    }

    // Simpan session
    req.session.user = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      jabatan: user.jabatan,
      departemen: user.departemen
    };

    res.json({
      success: true,
      message: 'Login berhasil!',
      user: req.session.user
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// ✅ GET CURRENT USER (CEK SESSION)
router.get('/me', requireLogin, (req, res) => {
  res.json({
    success: true,
    user: req.session.user
  });
});

// ✅ LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Gagal logout'
      });
    }
    res.clearCookie('connect.sid'); // Nama cookie default express-session
    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  });
});

module.exports = router;
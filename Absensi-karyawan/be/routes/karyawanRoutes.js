// routes/karyawanRoutes.js
const express = require('express');
const router = express.Router();
const KaryawanController = require('../controllers/karyawanControllers');

// ==== MIDDLEWARE ====

// 1. Hanya butuh login (untuk dashboard, absen, dll)
const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({
      success: false,
      message: 'Silakan login terlebih dahulu'
    });
  }
  next();
};

// 2. Hanya admin yang boleh CRUD karyawan
const isAdmin = (req, res, next) => {
  if (!req.session?.user || req.session.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya Admin yang diperbolehkan.'
    });
  }
  next();
};

// ===================== ROUTES =====================

// ✅ PUBLIC ROUTE - REGISTRASI (TANPA AUTH)
// Ini harus di PALING ATAS sebelum middleware lain
router.post('/register', KaryawanController.createKaryawan);

// PUBLIC + LOGIN ONLY → untuk Dashboard, Absen Tablet, dll
// Semua yang sudah login boleh lihat daftar karyawan
router.get('/', requireLogin, KaryawanController.getAllKaryawan);

// ADMIN ONLY → untuk halaman manajemen karyawan
router.get('/:id', isAdmin, KaryawanController.getKaryawanById);
router.post('/', isAdmin, KaryawanController.createKaryawan); // Untuk admin tambah karyawan manual
router.put('/:id', isAdmin, KaryawanController.updateKaryawan);
router.delete('/:id', isAdmin, KaryawanController.deleteKaryawan);

module.exports = router;
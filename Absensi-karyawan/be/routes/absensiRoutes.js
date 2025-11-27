// routes/absensiRoutes.js
const express = require('express');
const router = express.Router();
const AbsensiController = require('../controllers/absensiControllers');

// Middleware: HARUS LOGIN
const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu" });
  }
  next();
};

// === SEMUA ROUTE ABSENSI HARUS LOGIN ===
router.get('/', requireLogin, AbsensiController.getAllAbsensi);
router.get('/hari-ini', requireLogin, AbsensiController.getAbsensiHariIni);
router.get('/date/:tanggal', requireLogin, AbsensiController.getAbsensiByDate);
router.get('/:id', requireLogin, AbsensiController.getAbsensiById);

router.post('/checkin', requireLogin, AbsensiController.checkIn);
router.put('/checkout/:id', requireLogin, AbsensiController.checkOut);

module.exports = router;
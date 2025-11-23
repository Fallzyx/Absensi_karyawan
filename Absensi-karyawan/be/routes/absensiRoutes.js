const express = require('express');
const router = express.Router();
const AbsensiController = require('../controllers/absensiControllers');

// GET /api/absensi - Get all absensi
router.get('/', AbsensiController.getAllAbsensi);

// GET /api/absensi/hari-ini - Get today's absensi
router.get('/hari-ini', AbsensiController.getAbsensiHariIni);

// GET /api/absensi/date/:tanggal - Get absensi by date
router.get('/date/:tanggal', AbsensiController.getAbsensiByDate);

// GET /api/absensi/:id - Get absensi by ID
router.get('/:id', AbsensiController.getAbsensiById);

// POST /api/absensi/checkin - Check-in
router.post('/checkin', AbsensiController.checkIn);

// PUT /api/absensi/checkout/:id - Check-out
router.put('/checkout/:id', AbsensiController.checkOut);

// PUT /api/absensi/:id - Update status
router.put('/:id', AbsensiController.updateStatus);

module.exports = router;
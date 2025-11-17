const express = require('express');
const router = express.Router();
const KaryawanController = require('../controllers/karyawanController');

// GET /api/karyawan - Get all karyawan
router.get('/', KaryawanController.getAllKaryawan);

// GET /api/karyawan/:id - Get karyawan by ID
router.get('/:id', KaryawanController.getKaryawanById);

// POST /api/karyawan - Create new karyawan
router.post('/', KaryawanController.createKaryawan);

// PUT /api/karyawan/:id - Update karyawan
router.put('/:id', KaryawanController.updateKaryawan);

// DELETE /api/karyawan/:id - Delete karyawan
router.delete('/:id', KaryawanController.deleteKaryawan);

module.exports = router;
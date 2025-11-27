// controllers/karyawanController.js
const KaryawanModel = require('../models/karyawanModels');
const bcrypt = require('bcrypt'); // ← TAMBAHKAN INI (install dulu: npm install bcrypt)

class KaryawanController {
  // GET semua karyawan
  static async getAllKaryawan(req, res) {
    try {
      const karyawan = await KaryawanModel.getAll();
      res.json(karyawan);
    } catch (error) {
      console.error('Error getAllKaryawan:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data karyawan',
        error: error.message
      });
    }
  }

  // GET karyawan by ID
  static async getKaryawanById(req, res) {
    try {
      const { id } = req.params;
      const karyawan = await KaryawanModel.getById(id);

      if (!karyawan) {
        return res.status(404).json({
          success: false,
          message: 'Karyawan tidak ditemukan'
        });
      }

      res.json(karyawan);
    } catch (error) {
      console.error('Error getKaryawanById:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server'
      });
    }
  }

  // CREATE karyawan baru (UNTUK REGISTRASI & ADMIN)
  static async createKaryawan(req, res) {
    try {
      const { nama, jabatan, departemen, email, telepon, password, role } = req.body;

      // Validasi field wajib
      if (!nama?.trim() || !jabatan?.trim() || !departemen?.trim() || !email?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nama, jabatan, departemen, dan email wajib diisi!'
        });
      }

      // ✅ VALIDASI PASSWORD (untuk registrasi)
      if (password && password.length < 6) {
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

      // ✅ Data untuk disimpan
      const dataToSave = {
        nama: nama.trim(),
        jabatan: jabatan.trim(),
        departemen: departemen.trim(),
        email: email.toLowerCase().trim(),
        telepon: telepon?.trim() || null,
        role: role || 'karyawan' // Default role
      };

      // ✅ HASH PASSWORD jika ada
      if (password) {
        dataToSave.password = await bcrypt.hash(password, 10);
      }

      const result = await KaryawanModel.create(dataToSave);

      res.status(201).json({
        success: true,
        message: 'Karyawan berhasil ditambahkan!',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error createKaryawan:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal menambahkan karyawan',
        error: error.message
      });
    }
  }

  // UPDATE karyawan
  static async updateKaryawan(req, res) {
    try {
      const { id } = req.params;
      const { nama, jabatan, departemen, email, telepon } = req.body;

      if (!nama?.trim() || !jabatan?.trim() || !departemen?.trim() || !email?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Semua field wajib diisi!'
        });
      }

      // Cek apakah email sudah dipakai orang lain
      const existing = await KaryawanModel.findByEmail(email);
      if (existing && existing.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan karyawan lain!'
        });
      }

      const result = await KaryawanModel.update(id, {
        nama: nama.trim(),
        jabatan: jabatan.trim(),
        departemen: departemen.trim(),
        email: email.toLowerCase().trim(),
        telepon: telepon?.trim() || null
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Karyawan tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Data karyawan berhasil diperbarui!'
      });
    } catch (error) {
      console.error('Error updateKaryawan:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal memperbarui data'
      });
    }
  }

  // DELETE karyawan
  static async deleteKaryawan(req, res) {
    try {
      const { id } = req.params;

      const result = await KaryawanModel.delete(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Karyawan tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Karyawan berhasil dihapus!'
      });
    } catch (error) {
      console.error('Error deleteKaryawan:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus karyawan'
      });
    }
  }
}

module.exports = KaryawanController;
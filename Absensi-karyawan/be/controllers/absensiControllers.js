// controllers/absensiControllers.js
const AbsensiModel = require("../models/absensiModels");

class AbsensiController {
  // GET semua absensi
  static async getAllAbsensi(req, res) {
    try {
      const absensi = await AbsensiModel.getAll();
      res.json(absensi); // LANGSUNG ARRAY → frontend langsung pakai
    } catch (error) {
      console.error("Error getAllAbsensi:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil data absensi" });
    }
  }

  // GET absensi hari ini
  static async getAbsensiHariIni(req, res) {
    try {
      const today = new Date().toISOString().split("T")[0];
      const absensi = await AbsensiModel.getByDate(today);
      res.json(absensi); // LANGSUNG ARRAY
    } catch (error) {
      console.error("Error getAbsensiHariIni:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil absensi hari ini" });
    }
  }

  // GET absensi berdasarkan tanggal
  static async getAbsensiByDate(req, res) {
    try {
      const { tanggal } = req.params;
      if (!tanggal || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
        return res.status(400).json({ success: false, message: "Format tanggal salah (YYYY-MM-DD)" });
      }
      const absensi = await AbsensiModel.getByDate(tanggal);
      res.json(absensi); // LANGSUNG ARRAY
    } catch (error) {
      console.error("Error getAbsensiByDate:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil data" });
    }
  }

  // GET absensi by ID
  static async getAbsensiById(req, res) {
    try {
      const { id } = req.params;
      const absensi = await AbsensiModel.getById(id);
      if (!absensi) {
        return res.status(404).json({ success: false, message: "Absensi tidak ditemukan" });
      }
      res.json(absensi);
    } catch (error) {
      console.error("Error getAbsensiById:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
  }

  // POST Check In
  static async checkIn(req, res) {
    try {
      const { karyawan_id, jam_masuk, keterangan } = req.body;
      const tanggal = new Date().toISOString().split("T")[0];

      if (!karyawan_id || !jam_masuk) {
        return res.status(400).json({ success: false, message: "karyawan_id dan jam_masuk wajib diisi" });
      }

      // Cek sudah check-in belum hari ini
      const existing = await AbsensiModel.getTodayCheckIn(karyawan_id, tanggal);
      if (existing) {
        return res.status(400).json({ success: false, message: "Karyawan sudah check-in hari ini" });
      }

      const result = await AbsensiModel.checkIn({
        karyawan_id,
        tanggal,
        jam_masuk,
        keterangan: keterangan || null
      });

      res.status(201).json({
        success: true,
        message: "Check-in berhasil!",
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error("Error checkIn:", error);
      res.status(500).json({ success: false, message: error.message || "Gagal check-in" });
    }
  }

  // PUT Check Out
  static async checkOut(req, res) {
    try {
      const { id } = req.params;
      const { jam_keluar } = req.body;

      if (!jam_keluar) {
        return res.status(400).json({ success: false, message: "jam_keluar wajib diisi" });
      }

      const result = await AbsensiModel.checkOut(id, jam_keluar);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Absensi tidak ditemukan atau sudah check-out" });
      }

      res.json({ success: true, message: "Check-out berhasil!" });
    } catch (error) {
      console.error("Error checkOut:", error);
      res.status(500).json({ success: false, message: error.message || "Gagal check-out" });
    }
  }
}

module.exports = AbsensiController;
const AbsensiModel = require("../models/absensiModels");

class AbsensiController {
  static async getAllAbsensi(req, res) {
    try {
      const absensi = await AbsensiModel.getAll();
      res.json({
        success: true,
        data: absensi,
        count: absensi.length,
      });
    } catch (error) {
      console.error("Error in getAllAbsensi:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getAbsensiHariIni(req, res) {
    try {
      const today = new Date().toISOString().split("T")[0];
      const absensi = await AbsensiModel.getByDate(today);
      res.json({
        success: true,
        data: absensi,
        count: absensi.length,
      });
    } catch (error) {
      console.error("Error in getAbsensiHariIni:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // TAMBAHKAN METHOD INI
  static async getAbsensiById(req, res) {
    try {
      const { id } = req.params;
      // You'll need to add this method in AbsensiModel
      const absensi = await AbsensiModel.getById(id);

      if (!absensi) {
        return res.status(404).json({
          success: false,
          message: "Absensi tidak ditemukan",
        });
      }

      res.json({
        success: true,
        data: absensi,
      });
    } catch (error) {
      console.error("Error in getAbsensiById:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getAbsensiByDate(req, res) {
    try {
      const { tanggal } = req.params;
      const absensi = await AbsensiModel.getByDate(tanggal);
      res.json({
        success: true,
        data: absensi,
        count: absensi.length,
      });
    } catch (error) {
      console.error("Error in getAbsensiByDate:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async checkIn(req, res) {
    try {
      const { karyawan_id, tanggal, jam_masuk, keterangan } = req.body;

      if (!karyawan_id || !tanggal || !jam_masuk) {
        return res.status(400).json({
          success: false,
          message: "Data tidak lengkap",
        });
      }

      const existingCheckin = await AbsensiModel.getTodayCheckIn(
        karyawan_id,
        tanggal
      );
      if (existingCheckin) {
        return res.status(400).json({
          success: false,
          message: "Sudah check-in hari ini",
        });
      }

      const result = await AbsensiModel.checkIn(req.body);
      res.status(201).json({
        success: true,
        message: "Check-in berhasil",
        data: { id: result.insertId },
      });
    } catch (error) {
      console.error("Error in checkIn:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async checkOut(req, res) {
    try {
      const { id } = req.params;
      const { jam_keluar } = req.body;

      if (!jam_keluar) {
        return res.status(400).json({
          success: false,
          message: "Jam keluar wajib diisi",
        });
      }

      const result = await AbsensiModel.checkOut(id, jam_keluar);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Data absensi tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Check-out berhasil",
      });
    } catch (error) {
      console.error("Error in checkOut:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, keterangan } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status wajib diisi",
        });
      }

      const result = await AbsensiModel.updateStatus(id, {
        status,
        keterangan,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Data absensi tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Status berhasil diupdate",
      });
    } catch (error) {
      console.error("Error in updateStatus:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = AbsensiController;

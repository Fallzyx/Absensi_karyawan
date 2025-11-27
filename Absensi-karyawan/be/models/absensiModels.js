// models/absensiModels.js
const db = require('../config/database');

class AbsensiModel {
  static async getAll() {
    const [rows] = await db.execute(`
      SELECT a.*, k.nama, k.jabatan, k.departemen, k.email
      FROM absensi a
      JOIN karyawan k ON a.karyawan_id = k.id
      ORDER BY a.tanggal DESC, a.jam_masuk DESC
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(`
      SELECT a.*, k.nama, k.jabatan, k.departemen, k.email
      FROM absensi a
      JOIN karyawan k ON a.karyawan_id = k.id
      WHERE a.id = ?
    `, [id]);
    return rows[0] || null;
  }

  static async getByDate(tanggal) {
    const [rows] = await db.execute(`
      SELECT a.*, k.nama, k.jabatan, k.departemen, k.email
      FROM absensi a
      JOIN karyawan k ON a.karyawan_id = k.id
      WHERE a.tanggal = ?
      ORDER BY a.jam_masuk ASC
    `, [tanggal]);
    return rows;
  }

  static async getTodayCheckIn(karyawanId, tanggal) {
    const [rows] = await db.execute(
      'SELECT * FROM absensi WHERE karyawan_id = ? AND tanggal = ?',
      [karyawanId, tanggal]
    );
    return rows[0] || null;
  }

  static async checkIn(data) {
    const { karyawan_id, tanggal, jam_masuk, keterangan } = data;
    const [result] = await db.execute(
      `INSERT INTO absensi (karyawan_id, tanggal, jam_masuk, keterangan) 
       VALUES (?, ?, ?, ?)`,
      [karyawan_id, tanggal, jam_masuk, keterangan || null]
    );
    return result;
  }

  static async checkOut(id, jam_keluar) {
    const [result] = await db.execute(
      `UPDATE absensi SET jam_keluar = ? WHERE id = ? AND jam_keluar IS NULL`,
      [jam_keluar, id]
    );
    return result;
  }
}

module.exports = AbsensiModel;
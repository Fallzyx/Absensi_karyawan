const db = require('../config/database');

class AbsensiModel {
    static async getAll() {
        try {
            const [rows] = await db.execute(`
                SELECT a.*, k.nama, k.jabatan, k.departemen 
                FROM absensi a 
                JOIN karyawan k ON a.karyawan_id = k.id 
                ORDER BY a.tanggal DESC, a.created_at DESC
            `);
            return rows;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // TAMBAHKAN METHOD INI
    static async getById(id) {
        try {
            const [rows] = await db.execute(`
                SELECT a.*, k.nama, k.jabatan, k.departemen 
                FROM absensi a 
                JOIN karyawan k ON a.karyawan_id = k.id 
                WHERE a.id = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async getByDate(tanggal) {
        try {
            const [rows] = await db.execute(`
                SELECT a.*, k.nama, k.jabatan, k.departemen 
                FROM absensi a 
                JOIN karyawan k ON a.karyawan_id = k.id 
                WHERE a.tanggal = ?
                ORDER BY a.jam_masuk DESC
            `, [tanggal]);
            return rows;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async checkIn(absensiData) {
        try {
            const { karyawan_id, tanggal, jam_masuk, keterangan } = absensiData;
            const [result] = await db.execute(
                'INSERT INTO absensi (karyawan_id, tanggal, jam_masuk, keterangan) VALUES (?, ?, ?, ?)',
                [karyawan_id, tanggal, jam_masuk, keterangan]
            );
            return result;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async checkOut(id, jam_keluar) {
        try {
            const [result] = await db.execute(
                'UPDATE absensi SET jam_keluar = ? WHERE id = ?',
                [jam_keluar, id]
            );
            return result;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async updateStatus(id, statusData) {
        try {
            const { status, keterangan } = statusData;
            const [result] = await db.execute(
                'UPDATE absensi SET status = ?, keterangan = ? WHERE id = ?',
                [status, keterangan, id]
            );
            return result;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async getTodayCheckIn(karyawanId, tanggal) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM absensi WHERE karyawan_id = ? AND tanggal = ?',
                [karyawanId, tanggal]
            );
            return rows[0];
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }
}

module.exports = AbsensiModel;
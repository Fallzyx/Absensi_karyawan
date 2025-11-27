// models/karyawanModels.js
const db = require('../config/database');

class KaryawanModel {
    static async getAll() {
        try {
            const [rows] = await db.execute('SELECT id, nama, email, jabatan, departemen, telepon, role FROM karyawan ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM karyawan WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async create(karyawanData) {
        try {
            const { nama, jabatan, departemen, email, telepon, password, role = 'karyawan' } = karyawanData;
            
            // ✅ Query dengan password
            const [result] = await db.execute(
                'INSERT INTO karyawan (nama, jabatan, departemen, email, telepon, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nama, jabatan, departemen, email, telepon || null, password || null, role]
            );
            return result;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async update(id, karyawanData) {
        try {
            const { nama, jabatan, departemen, email, telepon } = karyawanData;
            const [result] = await db.execute(
                'UPDATE karyawan SET nama = ?, jabatan = ?, departemen = ?, email = ?, telepon = ? WHERE id = ?',
                [nama, jabatan, departemen, email, telepon || null, id]
            );
            return result;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM karyawan WHERE id = ?', [id]);
            return result;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM karyawan WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }
}

module.exports = KaryawanModel;
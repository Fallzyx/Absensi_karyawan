const KaryawanModel = require('../models/karyawanModel');

class KaryawanController {
    static async getAllKaryawan(req, res) {
        try {
            const karyawan = await KaryawanModel.getAll();
            res.json({
                success: true,
                data: karyawan,
                count: karyawan.length
            });
        } catch (error) {
            console.error('Error in getAllKaryawan:', error);
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
        }
    }

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
            
            res.json({
                success: true,
                data: karyawan
            });
        } catch (error) {
            console.error('Error in getKaryawanById:', error);
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
        }
    }

    static async createKaryawan(req, res) {
        try {
            const { nama, jabatan, departemen, email, telepon } = req.body;
            
            if (!nama || !jabatan || !departemen || !email) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Semua field wajib diisi' 
                });
            }

            const existingKaryawan = await KaryawanModel.findByEmail(email);
            if (existingKaryawan) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Email sudah terdaftar' 
                });
            }

            const result = await KaryawanModel.create(req.body);
            res.status(201).json({ 
                success: true,
                message: 'Karyawan berhasil ditambahkan',
                data: { id: result.insertId }
            });
        } catch (error) {
            console.error('Error in createKaryawan:', error);
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
        }
    }

    static async updateKaryawan(req, res) {
        try {
            const { id } = req.params;
            const { nama, jabatan, departemen, email, telepon } = req.body;
            
            if (!nama || !jabatan || !departemen || !email) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Semua field wajib diisi' 
                });
            }

            const result = await KaryawanModel.update(id, req.body);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Karyawan tidak ditemukan' 
                });
            }
            
            res.json({ 
                success: true,
                message: 'Karyawan berhasil diupdate' 
            });
        } catch (error) {
            console.error('Error in updateKaryawan:', error);
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
        }
    }

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
                message: 'Karyawan berhasil dihapus' 
            });
        } catch (error) {
            console.error('Error in deleteKaryawan:', error);
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
        }
    }
}

module.exports = KaryawanController;
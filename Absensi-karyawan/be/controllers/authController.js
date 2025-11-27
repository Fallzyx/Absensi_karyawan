const db = require('../config/database');
const bcrypt = require('bcrypt');

// REGISTER → langsung jadi karyawan
const register = async (req, res) => {
  try {
    const { nama, email, password, jabatan, departemen, telepon } = req.body;

    const [ada] = await db.query('SELECT id FROM karyawan WHERE email = ?', [email]);
    if (ada.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO karyawan (nama, email, password, jabatan, departemen, telepon, role) 
       VALUES (?, ?, ?, ?, ?, ?, 'karyawan')`,
      [nama, email, hashed, jabatan, departemen, telepon || null]
    );

    res.json({ success: true, message: 'Pendaftaran berhasil! Silakan login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// LOGIN → simpan ke session
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query('SELECT * FROM karyawan WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email salah' });
    }

    const user = rows[0];
    const cocok = await bcrypt.compare(password, user.password);
    if (!cocok) {
      return res.status(401).json({ success: false, message: 'Password salah' });
    }

    // SIMPAN KE SESSION (ini pengganti JWT)
    req.session.user = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      jabatan: user.jabatan,
      role: user.role
    };

    res.json({
      success: true,
      message: 'Login berhasil!',
      user: req.session.user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CHECK LOGIN STATUS
const me = (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: 'Belum login' });
  }
};

// LOGOUT
const logout = (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logout berhasil' });
};

module.exports = { register, login, me, logout };
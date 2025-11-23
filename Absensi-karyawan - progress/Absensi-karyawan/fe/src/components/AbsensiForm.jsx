import React, { useState, useEffect } from 'react';
import { absensiAPI, karyawanAPI } from '../services/api';

const AbsensiForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    karyawan_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    jam_masuk: new Date().toTimeString().split(' ')[0],
    keterangan: ''
  });
  const [karyawanList, setKaryawanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadKaryawan(); }, []);

  const loadKaryawan = async () => {
    try {
      const response = await karyawanAPI.getAll();
      setKaryawanList(response.data || []);
    } catch (error) {
      setError('Gagal memuat data karyawan: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await absensiAPI.checkIn(formData);
      onSave();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absensi-form">
      <h2>Check In Karyawan</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Karyawan *</label>
          <select name="karyawan_id" value={formData.karyawan_id} onChange={handleChange} required>
            <option value="">Pilih Karyawan</option>
            {karyawanList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama} - {k.jabatan}</option>
            ))}
          </select>
        </div>
        <div className="form-group"><label>Tanggal *</label><input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required /></div>
        <div className="form-group"><label>Jam Masuk *</label><input type="time" name="jam_masuk" value={formData.jam_masuk} onChange={handleChange} required /></div>
        <div className="form-group"><label>Keterangan</label><textarea name="keterangan" value={formData.keterangan} onChange={handleChange} rows="3" /></div>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Memproses...' : 'Check In'}</button>
          <button type="button" onClick={onCancel} className="btn-secondary">Batal</button>
        </div>
      </form>
    </div>
  );
};

export default AbsensiForm;
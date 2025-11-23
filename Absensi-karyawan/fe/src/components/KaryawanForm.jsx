import React, { useState, useEffect } from 'react';
import { karyawanAPI } from '../services/api';

const KaryawanForm = ({ karyawan, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nama: '', jabatan: '', departemen: '', email: '', telepon: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (karyawan) {
      setFormData({
        nama: karyawan.nama || '',
        jabatan: karyawan.jabatan || '',
        departemen: karyawan.departemen || '',
        email: karyawan.email || '',
        telepon: karyawan.telepon || ''
      });
    }
  }, [karyawan]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (karyawan) {
        await karyawanAPI.update(karyawan.id, formData);
      } else {
        await karyawanAPI.create(formData);
      }
      onSave();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="karyawan-form">
      <h2>{karyawan ? 'Edit Karyawan' : 'Tambah Karyawan'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Nama *</label><input type="text" name="nama" value={formData.nama} onChange={handleChange} required /></div>
        <div className="form-group"><label>Jabatan *</label><input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} required /></div>
        <div className="form-group"><label>Departemen *</label><input type="text" name="departemen" value={formData.departemen} onChange={handleChange} required /></div>
        <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
        <div className="form-group"><label>Telepon</label><input type="text" name="telepon" value={formData.telepon} onChange={handleChange} /></div>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Menyimpan...' : (karyawan ? 'Update' : 'Simpan')}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">Batal</button>
        </div>
      </form>
    </div>
  );
};

export default KaryawanForm;
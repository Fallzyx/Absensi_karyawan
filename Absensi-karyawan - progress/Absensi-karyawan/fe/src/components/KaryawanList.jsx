import React, { useState, useEffect } from 'react';
import { karyawanAPI } from '../services/api';

const KaryawanList = ({ onEdit, refresh }) => {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadKaryawan = async () => {
    try {
      setError('');
      const response = await karyawanAPI.getAll();
      setKaryawan(response.data || []);
    } catch (error) {
      setError('Gagal memuat data karyawan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKaryawan();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
      try {
        await karyawanAPI.delete(id);
        loadKaryawan();
      } catch (error) {
        alert('Gagal menghapus karyawan: ' + error.message);
      }
    }
  };

  if (loading) return <div className="loading">Memuat data karyawan...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="karyawan-list">
      <h2>Daftar Karyawan</h2>
      {karyawan.length === 0 ? (
        <p>Tidak ada data karyawan</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Departemen</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {karyawan.map((k) => (
                <tr key={k.id}>
                  <td>{k.nama}</td>
                  <td>{k.jabatan}</td>
                  <td>{k.departemen}</td>
                  <td>{k.email}</td>
                  <td>{k.telepon || '-'}</td>
                  <td className="actions">
                    <button onClick={() => onEdit(k)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(k.id)} className="btn-delete">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KaryawanList;
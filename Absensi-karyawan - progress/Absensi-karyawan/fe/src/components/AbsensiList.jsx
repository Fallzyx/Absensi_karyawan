import React, { useState, useEffect } from 'react';
import { absensiAPI } from '../services/api';

const AbsensiList = ({ refresh }) => {
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadAbsensi = async (date = selectedDate) => {
    try {
      setError('');
      let response;
      if (date === new Date().toISOString().split('T')[0]) {
        response = await absensiAPI.getHariIni();
      } else {
        response = await absensiAPI.getByDate(date);
      }
      setAbsensi(response.data || []);
    } catch (error) {
      setError('Gagal memuat data absensi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAbsensi(); }, [refresh]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    loadAbsensi(newDate);
  };

  const handleCheckOut = async (id) => {
    const jamKeluar = new Date().toTimeString().split(' ')[0];
    try {
      await absensiAPI.checkOut(id, { jam_keluar: jamKeluar });
      loadAbsensi();
    } catch (error) {
      alert('Gagal check-out: ' + error.message);
    }
  };

  const getStatusBadge = (absensi) => {
    if (!absensi.jam_masuk) return <span className="badge absent">Tidak Hadir</span>;
    if (!absensi.jam_keluar) return <span className="badge checked-in">Checked In</span>;
    return <span className="badge checked-out">Checked Out</span>;
  };

  if (loading) return <div className="loading">Memuat data absensi...</div>;

  return (
    <div className="absensi-list">
      <div className="absensi-header">
        <h2>Data Absensi</h2>
        <div className="date-filter">
          <label>Tanggal: </label>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {absensi.length === 0 ? (
        <p>Tidak ada data absensi untuk tanggal ini</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama</th><th>Jabatan</th><th>Tanggal</th><th>Jam Masuk</th><th>Jam Keluar</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {absensi.map((a) => (
                <tr key={a.id}>
                  <td>{a.nama}</td><td>{a.jabatan}</td><td>{a.tanggal}</td>
                  <td>{a.jam_masuk || '-'}</td><td>{a.jam_keluar || '-'}</td>
                  <td>{getStatusBadge(a)}</td>
                  <td className="actions">
                    {a.jam_masuk && !a.jam_keluar && (
                      <button onClick={() => handleCheckOut(a.id)} className="btn-checkout">Check Out</button>
                    )}
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

export default AbsensiList;
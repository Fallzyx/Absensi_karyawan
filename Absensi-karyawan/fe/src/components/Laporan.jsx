import React, { useState } from 'react';
import { absensiAPI } from '../services/api';

const Laporan = () => {
  const [filter, setFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    department: ''
  });
  const [laporanData, setLaporanData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const generateLaporan = async () => {
    setLoading(true);
    try {
      // Untuk simplicity, kita ambil semua data lalu filter di frontend
      const response = await absensiAPI.getAll();
      let data = response.data || [];

      // Filter by date range
      data = data.filter(item => 
        item.tanggal >= filter.startDate && item.tanggal <= filter.endDate
      );

      // Filter by department jika dipilih
      if (filter.department) {
        data = data.filter(item => 
          item.departemen === filter.department
        );
      }

      setLaporanData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Gagal generate laporan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Simple CSV export
    const headers = ['Nama', 'Jabatan', 'Departemen', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Status'];
    const csvData = laporanData.map(item => [
      item.nama,
      item.jabatan,
      item.departemen,
      item.tanggal,
      item.jam_masuk || '-',
      item.jam_keluar || '-',
      !item.jam_masuk ? 'Tidak Hadir' : !item.jam_keluar ? 'Checked In' : 'Checked Out'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-absensi-${filter.startDate}-to-${filter.endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="laporan">
      <h2>Laporan Absensi</h2>
      
      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Tanggal Mulai</label>
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Tanggal Akhir</label>
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Departemen</label>
          <select
            name="department"
            value={filter.department}
            onChange={handleFilterChange}
          >
            <option value="">Semua Departemen</option>
            <option value="Kasir">Kasir</option>
            <option value="Gudang">Gudang</option>
            <option value="Manajemen">Manajemen</option>
            <option value="Security">Security</option>
          </select>
        </div>

        <div className="filter-actions">
          <button 
            onClick={generateLaporan}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Generating...' : 'Generate Laporan'}
          </button>
          
          {laporanData.length > 0 && (
            <button 
              onClick={exportToExcel}
              className="btn-success"
            >
              Export to Excel
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {laporanData.length > 0 && (
        <div className="laporan-results">
          <h3>Hasil Laporan ({laporanData.length} records)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Departemen</th>
                  <th>Tanggal</th>
                  <th>Jam Masuk</th>
                  <th>Jam Keluar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {laporanData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>
                    <td>{item.jabatan}</td>
                    <td>{item.departemen}</td>
                    <td>{item.tanggal}</td>
                    <td>{item.jam_masuk || '-'}</td>
                    <td>{item.jam_keluar || '-'}</td>
                    <td>
                      <span className={`status-badge ${
                        !item.jam_masuk ? 'absent' : 
                        !item.jam_keluar ? 'checked-in' : 'checked-out'
                      }`}>
                        {!item.jam_masuk ? 'Tidak Hadir' : 
                         !item.jam_keluar ? 'Checked In' : 'Checked Out'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laporan;
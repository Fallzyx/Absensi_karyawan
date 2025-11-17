-- Create database
CREATE DATABASE IF NOT EXISTS absensi_supermarket;
USE absensi_supermarket;

-- Create karyawan table
CREATE TABLE IF NOT EXISTS karyawan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    jabatan VARCHAR(50) NOT NULL,
    departemen VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telepon VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create absensi table
CREATE TABLE IF NOT EXISTS absensi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    karyawan_id INT,
    tanggal DATE NOT NULL,
    jam_masuk TIME,
    jam_keluar TIME,
    status ENUM('Hadir', 'Izin', 'Sakit', 'Cuti') DEFAULT 'Hadir',
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE CASCADE,
    INDEX idx_tanggal (tanggal),
    INDEX idx_karyawan_id (karyawan_id)
);

-- Insert sample data
INSERT INTO karyawan (nama, jabatan, departemen, email, telepon) VALUES
('Budi Santoso', 'Kasir', 'Front Office', 'budi@supermarket.com', '081234567890'),
('Siti Rahayu', 'Manager', 'Management', 'siti@supermarket.com', '081234567891'),
('Ahmad Wijaya', 'Stok Gudang', 'Gudang', 'ahmad@supermarket.com', '081234567892'),
('Dewi Lestari', 'Kasir', 'Front Office', 'dewi@supermarket.com', '081234567893'),
('Rudi Hermawan', 'Security', 'Keamanan', 'rudi@supermarket.com', '081234567894');

-- Insert sample absensi data for today
INSERT INTO absensi (karyawan_id, tanggal, jam_masuk, jam_keluar, status) VALUES
(1, CURDATE(), '08:00:00', '16:00:00', 'Hadir'),
(2, CURDATE(), '08:15:00', '16:30:00', 'Hadir'),
(3, CURDATE(), '07:45:00', '16:15:00', 'Hadir'),
(4, CURDATE(), NULL, NULL, 'Izin'),
(5, CURDATE(), '08:05:00', NULL, 'Hadir');
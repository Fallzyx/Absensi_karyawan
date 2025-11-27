-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2025 at 02:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `absensi_supermarket`
--

-- --------------------------------------------------------

--
-- Table structure for table `absensi`
--

CREATE TABLE `absensi` (
  `id` int(11) NOT NULL,
  `karyawan_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `jam_masuk` time DEFAULT NULL,
  `jam_keluar` time DEFAULT NULL,
  `status` enum('Hadir','Izin','Sakit','Cuti','Alpha') DEFAULT 'Hadir',
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `absensi`
--

INSERT INTO `absensi` (`id`, `karyawan_id`, `tanggal`, `jam_masuk`, `jam_keluar`, `status`, `keterangan`, `created_at`) VALUES
(2, 5, '2025-11-26', '15:10:07', '15:10:33', 'Hadir', NULL, '2025-11-26 08:10:07'),
(3, 2, '2025-11-26', '16:03:06', '16:03:10', 'Hadir', NULL, '2025-11-26 09:03:06'),
(5, 4, '2025-11-26', '17:42:22', '17:42:37', 'Hadir', NULL, '2025-11-26 10:42:22'),
(6, 10, '2025-11-26', '17:44:48', '17:44:54', 'Hadir', NULL, '2025-11-26 10:44:48'),
(7, 11, '2025-11-26', '19:56:48', '19:56:56', 'Hadir', NULL, '2025-11-26 12:56:48');

-- --------------------------------------------------------

--
-- Table structure for table `karyawan`
--

CREATE TABLE `karyawan` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `jabatan` varchar(50) NOT NULL,
  `role` enum('admin','karyawan') DEFAULT 'karyawan',
  `departemen` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telepon` varchar(15) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `karyawan`
--

INSERT INTO `karyawan` (`id`, `nama`, `jabatan`, `role`, `departemen`, `email`, `password`, `telepon`, `created_at`, `updated_at`) VALUES
(2, 'Nopal', 'Manager', 'admin', 'Manajemen', 'admin@supermarket.co.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', '2025-11-26 07:23:22', '2025-11-26 13:15:00'),
(4, 'suki', 'kryawan', 'karyawan', 'Kasir', 'suki@gmail.com', '$2b$10$lW7c9A1xs4VBdBSQPnASSOXxBgbiZFce9886GtmJdipK.7SYOBfgS', '08976543', '2025-11-26 07:40:49', '2025-11-26 07:40:49'),
(5, 'albi', 'karyawan', 'karyawan', 'Kasir', 'albi@gmail.com', '$2b$10$/bCbfAMFk9ne2eKki680PeX9uAsy/i/ydpxws.s2Zb7GObHX8dqyC', NULL, '2025-11-26 07:48:13', '2025-11-26 07:48:13'),
(10, 'konci', 'Kasir', 'karyawan', 'Operasional', 'konci@gmail.com', '$2b$10$3Rr.mVBW.hc4PnAqWNTr9.18IQdzCx.BGTQPcI2V/f6ckBChSYO2.', '06448489', '2025-11-26 10:44:14', '2025-11-26 12:48:12'),
(11, 'nopal', 'Staff', 'karyawan', 'Gudang', 'nopal@gmail.com', '$2b$10$QhscqHv6YGLiu9iC/dDVz.d1Rzo4l5UefZBqXHxxlYt3UH.RVWT/m', '0912387124', '2025-11-26 12:56:21', '2025-11-26 12:56:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absensi`
--
ALTER TABLE `absensi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `karyawan_id` (`karyawan_id`);

--
-- Indexes for table `karyawan`
--
ALTER TABLE `karyawan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absensi`
--
ALTER TABLE `absensi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `karyawan`
--
ALTER TABLE `karyawan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absensi`
--
ALTER TABLE `absensi`
  ADD CONSTRAINT `absensi_ibfk_1` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

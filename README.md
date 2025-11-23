Absensi Karyawan API
 Deskripsi Singkat
Absensi Karyawan API adalah aplikasi backend berbasis Express.js yang digunakan untuk mengelola data absensi karyawan. Sistem ini menyediakan operasi CRUD lengkap terhadap resource utama yaitu Absensi, serta terhubung dengan database MySQL untuk penyimpanan data.
Fitur utama:
- Manajemen data absensi karyawan (check-in, check-out, status hadir).
- Operasi CRUD (GET, POST, PUT/PATCH, DELETE).
- Validasi input sederhana.
- Response API konsisten dalam format JSON.
- Error handling dasar (data tidak ditemukan, input tidak valid, dll.).

 Struktur Project
absensi-karyawan/
│── config/          # Konfigurasi database
│── controllers/     # Logika bisnis (CRUD)
│── data/            # Untuk script database agar bisa di konfigurasi
│── routes/          # Routing endpoint API
│── models/          # Model database (ORM / query builder)
│── package.json     # Dependency & script
│── README.md        # Dokumentasi project



 Cara Menjalankan
- Clone repository
https://github.com/Fallzyx(username)/Absensi_karyawan.git
cd absensi-karyawan
npm install
- Konfigurasi database
- Buat database MySQL dengan nama absensi_supermarket.
- script database ada di folder data/ data.sql
- Sesuaikan file config/db.js dengan username, password, dan nama database.
- Jalankan server
npm start


- Server akan berjalan di http://localhost:(berbeda")
Endpoint API- GET /api/absensi → Menampilkan semua data absensi
- GET /api/absensi/:id → Menampilkan detail absensi berdasarkan ID
- POST /api/absensi → Menambah data absensi baru
- PUT /api/absensi/:id → Mengubah data absensi berdasarkan ID
- DELETE /api/absensi/:id → Menghapus data absensi berdasarkan ID
Contoh Response JSON:{
  "status": "success",
  "message": "Data absensi berhasil ditambahkan",
  "data": {
    "id": 1,
    "nama": "Naufal",
    "tanggal": "2025-11-23",
    "status": "Hadir"
  }
}
 Pengujian APIGunakan Postman atau Thunder Client untuk menguji endpoint.
Contoh pengujian:- GET http://localhost:(berbeda")/api/absensi
- POST http://localhost:(berbeda")/api/absensi dengan body JSON:
{
  "nama": "Naufal",
  "tanggal": "2025-11-23",
  "status": "Hadir"
}
 Nilai Tambah (Opsional)
- Frontend React: Menampilkan daftar absensi dan form input absensi.
- Styling: Menggunakan TailwindCSS agar tampilan rapi dan responsif.
- Fitur tambahan: Pencarian absensi berdasarkan nama/tanggal, konfirmasi sebelum delete, check in/check out berdasarkan jam real time 
   Anggota Kelompok
- Nama Anggota 1 Naufal
- Nama Anggota 2 Safa
- Nama Anggota 3 Saifudin
- Nama Anggota 4 Akbar

// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Helper: handle semua response + error parsing
const handleResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    throw new Error('Server tidak merespon (empty response)');
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse JSON:', text);
    throw new Error('Respons server bukan JSON valid');
  }

  if (!response.ok) {
    const msg = data.message || data.error || `HTTP ${response.status}`;
    throw new Error(msg);
  }

  return data;
};

// Generic fetch dengan session cookie otomatis
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      credentials: 'include', // PENTING! Biar cookie session ikut terkirim
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Tidak bisa terhubung ke server. Pastikan backend jalan di port 5000');
    }
    throw error;
  }
};

// ===================== KARYAWAN API =====================
export const karyawanAPI = {
  getAll: () => fetchAPI('/karyawan'),
  getById: (id) => fetchAPI(`/karyawan/${id}`),
  create: (data) => fetchAPI('/karyawan', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/karyawan/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/karyawan/${id}`, { method: 'DELETE' }),
};

// ===================== ABSENSI API =====================
export const absensiAPI = {
  getAll: () => fetchAPI('/absensi'),
  getHariIni: () => fetchAPI('/absensi/hari-ini'),                    // SUDAH ADA
  getByDate: (tanggal) => fetchAPI(`/absensi/date/${tanggal}`),       // SUDAH ADA
  getByKaryawan: (karyawanId) => fetchAPI(`/absensi/karyawan/${karyawanId}`), // INI YANG DULU HILANG!
  getById: (id) => fetchAPI(`/absensi/${id}`),

  checkIn: (data) => fetchAPI('/absensi/checkin', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  checkOut: (id, data) => fetchAPI(`/absensi/checkout/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
};

// ===================== AUTH API =====================
export const authAPI = {
  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (data) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  me: () => fetchAPI('/auth/me'), // cek user yang login

  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
};

export default fetchAPI;
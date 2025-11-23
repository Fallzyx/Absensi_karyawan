const API_BASE_URL = 'http://localhost:5000/api';

// Handle API responses dengan better error handling
const handleResponse = async (response) => {
  const text = await response.text();
  
  if (!text) {
    throw new Error('Empty response from server');
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    console.error('JSON parse error:', error);
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Generic fetch function dengan error handling
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const karyawanAPI = {
  getAll: () => fetchAPI(`${API_BASE_URL}/karyawan`),
  getById: (id) => fetchAPI(`${API_BASE_URL}/karyawan/${id}`),
  create: (data) => fetchAPI(`${API_BASE_URL}/karyawan`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchAPI(`${API_BASE_URL}/karyawan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchAPI(`${API_BASE_URL}/karyawan/${id}`, { 
    method: 'DELETE' 
  })
};

export const absensiAPI = {
  getAll: () => fetchAPI(`${API_BASE_URL}/absensi`),
  getHariIni: () => fetchAPI(`${API_BASE_URL}/absensi/hari-ini`),
  getByDate: (tanggal) => fetchAPI(`${API_BASE_URL}/absensi/date/${tanggal}`),
  getById: (id) => fetchAPI(`${API_BASE_URL}/absensi/${id}`),
  checkIn: (data) => fetchAPI(`${API_BASE_URL}/absensi/checkin`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  checkOut: (id, data) => fetchAPI(`${API_BASE_URL}/absensi/checkout/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  updateStatus: (id, data) => fetchAPI(`${API_BASE_URL}/absensi/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const karyawanRoutes = require('./routes/karyawanRoutes');
const absensiRoutes = require('./routes/absensiRoutes');

// Use routes
app.use('/api/karyawan', karyawanRoutes);
app.use('/api/absensi', absensiRoutes);

// Basic routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Absensi Supermarket API',
        status: 'Running',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        database: 'MySQL',
        timestamp: new Date().toISOString()
    });
});

// Error handling untuk route tidak ditemukan
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME || 'absensi_supermarket'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
});
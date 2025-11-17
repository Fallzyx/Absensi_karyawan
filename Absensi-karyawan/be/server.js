const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes sementara tanpa require yang error
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

// Simple karyawan route untuk testing
app.get('/api/karyawan', (req, res) => {
    res.json({
        success: true,
        message: 'Karyawan endpoint is working',
        data: []
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME || 'absensi_supermarket'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
});
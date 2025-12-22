const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require('./routes/statsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://ciudad-segura-cliente.onrender.com'] // Agrega tu URL de frontend
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationRoutes);


// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend Ciudad Segura funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Ciudad Segura API',
    description: 'Backend para sistema de reportes ciudadanos',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/register'],
      complaints: ['/api/complaints', '/api/complaints/:id'],
      users: ['/api/users/profile/:id']
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
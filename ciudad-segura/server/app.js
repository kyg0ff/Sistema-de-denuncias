const express = require('express');
const cors = require('cors');
const path = require('path');

// --- IMPORTACIÓN DE RUTAS ---
// Aquí cargamos los "planos" de cada sección de nuestra API
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ← Posible origen del crash si hay error aquí
const statsRoutes = require('./routes/statsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// --- MIDDLEWARES ---


// Configuración de CORS: Permite que el Frontend se comunique con el Backend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ciudad-segura-frontend.onrender.com', 
    'https://ciudad-segura-backend.onrender.com'   
  ],
  credentials: true 
}));

// Permite que el servidor entienda datos en formato JSON (necesario para POST y PUT)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MONTAJE DE RUTAS ---
// Definimos los prefijos. Ej: Todo lo que empiece con /api/admin irá a adminRoutes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- RUTAS DE UTILIDAD ---

// Ruta de salud: Sirve para que Render sepa que el servidor está vivo
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend Ciudad Segura funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta raíz: Información básica al entrar a la URL principal
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

// --- MANEJO DE ERRORES ---

// 404 handler: Se ejecuta si ninguna ruta de arriba coincidió
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`
  });
});

// Error handler global: Captura errores de código (500) para que la app no muera silenciosamente
app.use((err, req, res, next) => {
  console.error('Error detectado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
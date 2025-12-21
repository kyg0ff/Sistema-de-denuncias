const express = require('express');
const cors = require('cors');
const app = express();

// ========================
// MIDDLEWARE
// ========================
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu Vite
  credentials: true
}));
app.use(express.json());

// ========================
// DATOS EN MEMORIA (SIMULANDO DB)
// ========================

// Usuarios (incluye admin por defecto)
let users = [
  {
    id: 1,
    dni: "12345678",
    name: "Luis Fernando",
    lastName: "Gallegos Ballon",
    email: "luis.gallegos@gmail.com",
    password: "123456", // En producción esto debe estar hasheado
    role: "user",
    status: "active",
    phone: "+51 987 654 321",
    address: "Av. La Cultura 123, Cusco"
  },
  {
    id: 2,
    dni: "87654321",
    name: "Administrador",
    lastName: "Sistema",
    email: "admin@ciudadsegura.com",
    password: "admin123",
    role: "admin",
    status: "active",
    phone: "+51 999 888 777",
    address: "Municipalidad de Cusco"
  }
];

// Denuncias/Reportes
let complaints = [
  {
    id: "RPT-1001",
    userId: 1,
    category: "obstruccion",
    title: "Vehículo mal estacionado en zona escolar",
    description: "Vehículo gris bloqueando rampa de acceso para discapacitados",
    location: {
      lat: -13.5167,
      lng: -71.9781,
      address: "Av. La Cultura 800, Wanchaq"
    },
    plate: "V1Z-982",
    status: "en_revision",
    evidence: "https://images.unsplash.com/photo-1562512685-2e6f2cb66258",
    createdAt: "2024-11-25T10:30:00Z",
    trackingCode: "D-2024-001",
    reference: "Frente al colegio San José"
  },
  {
    id: "RPT-1002",
    userId: null, // Denuncia anónima
    category: "invasion",
    title: "Estacionamiento sobre acera peatonal",
    description: "Camioneta blanca obstruye paso peatonal completo",
    location: {
      lat: -13.5175,
      lng: -71.9790,
      address: "Av. El Sol 450"
    },
    plate: "ABC-789",
    status: "pendiente",
    evidence: "",
    createdAt: "2024-11-24T15:45:00Z",
    trackingCode: "D-2024-002",
    reference: "Esquina con calle Mantas"
  }
];

// Organizaciones (para panel admin)
let organizations = [
  { id: 1, name: "Municipalidad de Wanchaq", type: "Gobierno Local", color: "#4f46e5" },
  { id: 2, name: "Policía de Tránsito", type: "Seguridad", color: "#059669" }
];

// Autoridades
let authorities = [
  { id: 1, name: "Oficial Roberto Gómez", cargo: "Jefe de Tránsito", orgId: 2, status: "Activo" },
  { id: 2, name: "Inspector Luis Alva", cargo: "Supervisor de Vías", orgId: 1, status: "Activo" }
];

// Notificaciones
let notifications = [
  { id: 1, userId: 1, type: "update", message: "Tu reporte RPT-1001 ha sido asignado a un equipo", time: "Hace 2 horas", read: false },
  { id: 2, userId: 1, type: "new_report", message: "Nuevo reporte cerca de tu ubicación", time: "Hace 5 horas", read: true }
];

// ========================
// RUTAS DE AUTENTICACIÓN
// ========================

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Credenciales incorrectas' 
    });
  }
  
  // Eliminar password de la respuesta
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    message: 'Login exitoso',
    user: userWithoutPassword
  });
});

// Registro
app.post('/api/auth/register', (req, res) => {
  const { dni, name, lastName, email, password } = req.body;
  
  // Validar que el email no exista
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'El email ya está registrado'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    dni,
    name,
    lastName,
    email,
    password, // ¡En producción hashear!
    role: 'user',
    status: 'active',
    phone: '',
    address: ''
  };
  
  users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    user: userWithoutPassword
  });
});

// ========================
// RUTAS DE DENUNCIAS
// ========================

// Obtener todas las denuncias
app.get('/api/complaints', (req, res) => {
  res.json({
    success: true,
    count: complaints.length,
    data: complaints
  });
});

// Crear nueva denuncia
app.post('/api/complaints', (req, res) => {
  const {
    category,
    title,
    description,
    location,
    plate,
    reference,
    userId // puede ser null para anónimo
  } = req.body;
  
  // Generar ID y tracking code
  const newId = `RPT-${1000 + complaints.length + 1}`;
  const trackingCode = `D-${new Date().getFullYear()}-${String(complaints.length + 1).padStart(3, '0')}`;
  
  const newComplaint = {
    id: newId,
    userId: userId || null,
    category,
    title,
    description: description || '',
    location,
    plate: plate ? plate.toUpperCase() : '',
    status: 'pendiente',
    evidence: '', // URL de imagen/video (se subiría aparte)
    createdAt: new Date().toISOString(),
    trackingCode,
    reference: reference || ''
  };
  
  complaints.push(newComplaint);
  
  // Crear notificación si hay usuario
  if (userId) {
    const newNotification = {
      id: notifications.length + 1,
      userId,
      type: 'new_report',
      message: `Tu reporte ${newId} ha sido recibido`,
      time: 'Justo ahora',
      read: false
    };
    notifications.push(newNotification);
  }
  
  res.status(201).json({
    success: true,
    message: 'Denuncia creada exitosamente',
    data: newComplaint
  });
});

// Obtener denuncia por ID
app.get('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const complaint = complaints.find(c => c.id === id);
  
  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Denuncia no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: complaint
  });
});

// ========================
// RUTAS DE USUARIO
// ========================

// Perfil del usuario
app.get('/api/users/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === parseInt(userId));
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  const { password, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    data: userWithoutPassword
  });
});

// Actualizar perfil
app.put('/api/users/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  
  const userIndex = users.findIndex(u => u.id === parseInt(userId));
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  // Actualizar solo campos permitidos (no password ni role)
  const allowedUpdates = ['name', 'lastName', 'phone', 'address'];
  allowedUpdates.forEach(field => {
    if (updates[field] !== undefined) {
      users[userIndex][field] = updates[field];
    }
  });
  
  const { password, ...updatedUser } = users[userIndex];
  
  res.json({
    success: true,
    message: 'Perfil actualizado',
    data: updatedUser
  });
});

// ========================
// RUTAS DE NOTIFICACIONES
// ========================

// Notificaciones por usuario
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const userNotifications = notifications.filter(n => n.userId === parseInt(userId));
  
  res.json({
    success: true,
    count: userNotifications.length,
    data: userNotifications
  });
});

// ========================
// RUTAS DE ADMINISTRACIÓN
// ========================

// Estadísticas para dashboard admin
app.get('/api/admin/statistics', (req, res) => {
  const stats = {
    totalUsers: users.length,
    totalComplaints: complaints.length,
    activeComplaints: complaints.filter(c => c.status === 'pendiente' || c.status === 'en_revision').length,
    resolvedComplaints: complaints.filter(c => c.status === 'resuelto').length,
    totalOrganizations: organizations.length,
    totalAuthorities: authorities.length
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// Listar usuarios (solo admin)
app.get('/api/admin/users', (req, res) => {
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json({
    success: true,
    count: usersWithoutPasswords.length,
    data: usersWithoutPasswords
  });
});

// ========================
// RUTAS DE SALUD/PRUEBA
// ========================

// Ruta de prueba
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
      users: ['/api/users/profile/:userId'],
      admin: ['/api/admin/statistics', '/api/admin/users'],
      notifications: ['/api/notifications/:userId']
    }
  });
});

// ========================
// MANEJO DE ERRORES
// ========================

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`
  });
});

// Error handler general
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ========================
// INICIAR SERVIDOR
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend Ciudad Segura corriendo en: http://localhost:${PORT}`);
  console.log(`🌍 Frontend: http://localhost:5173`);
  console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
  console.log(`✅ Salud del sistema: http://localhost:${PORT}/api/health`);
});
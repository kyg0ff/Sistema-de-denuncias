const app = require('./app');
const pool = require('./db'); // Importamos el pool
const bcrypt = require('bcrypt'); // Para hashear la contraseña

const PORT = process.env.PORT || 5000;

// Iniciar el servidor directamente, sin datos estáticos de demo
app.listen(PORT, () => {
  console.log(`🚀 Backend Ciudad Segura corriendo en: http://localhost:${PORT}`);
  console.log(`🌍 Frontend: http://localhost:5173`);
  console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
  console.log(`✅ Salud del sistema: http://localhost:${PORT}/api/health`);
});
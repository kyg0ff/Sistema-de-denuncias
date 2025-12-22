const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend Ciudad Segura corriendo en: http://localhost:${PORT}`);
  console.log(`🌍 Frontend: http://localhost:5173`);
  console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
  console.log(`✅ Salud del sistema: http://localhost:${PORT}/api/health`);
  console.log(`👤 Usuarios demo:`);
  console.log(`   • Ciudadano: luis.gallegos@gmail.com / 123456`);
  console.log(`   • Admin: admin@ciudadsegura.com / admin123`);
});
const app = require('./app');
const pool = require('./db'); // Importamos el pool
const bcrypt = require('bcrypt'); // Para hashear la contraseña

const PORT = process.env.PORT || 5000;

// Función para inicializar el admin demo si no existe
async function initAdminUser() {
  try {
    const adminEmail = 'admin@ciudadsegura.com';
    const adminPassword = 'admin123'; // Contraseña demo
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Verificar si ya existe
    const existingAdmin = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [adminEmail]);
    if (existingAdmin.rows.length === 0) {
      // Insertar admin
      await pool.query(`
        INSERT INTO usuarios (dni, nombres, apellidos, correo, telefono, contraseña_hash, rol)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, ['00000000', 'Admin', 'Sistema', adminEmail, '000000000', hashedPassword, 'administrador']);
      console.log('✅ Usuario admin demo creado exitosamente');
    } else {
      console.log('ℹ️ Usuario admin demo ya existe');
    }
  } catch (error) {
    console.error('❌ Error al inicializar usuario admin:', error);
  }
}

// Iniciar el servidor después de crear el admin (si es necesario)
initAdminUser().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Ciudad Segura corriendo en: http://localhost:${PORT}`);
    console.log(`🌍 Frontend: http://localhost:5173`);
    console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
    console.log(`✅ Salud del sistema: http://localhost:${PORT}/api/health`);
    console.log(`👤 Usuarios demo:`);
    console.log(`   • Ciudadano: luis.gallegos@gmail.com / 123456`);
    console.log(`   • Admin: admin@ciudadsegura.com / admin123`);
  });
});
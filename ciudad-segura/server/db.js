const { Pool } = require('pg');

const pool = new Pool({
  user: 'ciudad_app',
  host: 'localhost',
  database: 'ciudad_segura',
  password: 'tu_contraseña_segura', // ASEGÚRATE QUE ESTA SEA TU CLAVE DE POSTGRES
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a DB:', err.stack);
  } else {
    console.log('✅ Conectado a PostgreSQL exitosamente');
  }
  release();
});

module.exports = pool;
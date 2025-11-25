// Configuración de la conexión a la base de datos PostgreSQL

//  Importamos el módulo 'pg' para PostgreSQL
const { Pool } = require('pg');
// Cargamos las variables de entorno desde el archivo .env
require('dotenv').config(); 

// Creamos una nueva instancia de Pool con la configuración de la base de datos
// para mjorar el rendimiento
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Exportamos una función para ejecutar consultas a la base de datos
module.exports = {
  query: (text, params) => pool.query(text, params),
};
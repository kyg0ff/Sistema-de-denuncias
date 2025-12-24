const pool = require('../db'); 
const bcrypt = require('bcrypt');

class User {
  async findAll() {
    const res = await pool.query('SELECT id, dni, nombres, apellidos, correo, telefono, rol, estado FROM usuarios');
    return res.rows;
  }

  async findById(id) {
    const res = await pool.query(
      'SELECT id, dni, nombres, apellidos, correo, telefono, rol, estado FROM usuarios WHERE id = $1', 
      [id]
    );
    return res.rows[0] || null;
  }

  async findByEmail(correo) {
    const res = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return res.rows[0] || null;
  }

  async findByDni(dni) {
    const res = await pool.query('SELECT * FROM usuarios WHERE dni = $1', [dni]);
    return res.rows[0] || null;
  }

  async create(userData) {
    const passwordToHash = userData.password || userData.contraseña;
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);
    
    const res = await pool.query(
      `INSERT INTO usuarios (dni, nombres, apellidos, correo, telefono, contraseña_hash, rol)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, dni, nombres, apellidos, correo, telefono, rol, estado`,
      [
        userData.dni, 
        userData.nombres, 
        userData.apellidos, 
        userData.correo, 
        userData.telefono, 
        hashedPassword, 
        userData.rol || 'ciudadano'
      ]
    );
    return res.rows[0];
  }

  async update(id, updates) {
    let query = 'UPDATE usuarios SET ';
    const values = [];
    let paramCount = 1;

    if (updates.telefono !== undefined) {
      query += `telefono = $${paramCount}, `;
      values.push(updates.telefono);
      paramCount++;
    }
    
    if (updates.contraseña || updates.password) {
      const hashed = await bcrypt.hash(updates.contraseña || updates.password, 10);
      query += `contraseña_hash = $${paramCount}, `;
      values.push(hashed);
      paramCount++;
    }

    // Quitar la última coma y espacio
    query = query.slice(0, -2); 
    query += ` WHERE id = $${paramCount} RETURNING id, dni, nombres, apellidos, correo, telefono, rol, estado`;
    values.push(id);

    const res = await pool.query(query, values);
    return res.rows[0] || null;
  }
}

// EXPORTAMOS LA INSTANCIA
module.exports = new User();
const pool = require('../db');

class Category {
  async findAll() {
    const res = await pool.query('SELECT * FROM categorias ORDER BY prioridad DESC');
    return res.rows;
  }

  // Puedes agregar más métodos si necesitas (ej: findById, create, etc. para admin)
}

module.exports = new Category();
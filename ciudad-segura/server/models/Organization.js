const pool = require('../db');

class Organization {
  async getAll() {
    const res = await pool.query('SELECT * FROM organizaciones ORDER BY nombre');
    return res.rows;
  }

  async getAuthoritiesByOrg(organizacion_id) {
    const res = await pool.query(`
      SELECT u.*, ad.cargo, ad.fecha_asignacion
      FROM usuarios u
      JOIN autoridades_detalle ad ON u.id = ad.usuario_id
      WHERE ad.organizacion_id = $1 AND u.rol = 'autoridad'
    `, [organizacion_id]);
    return res.rows;
  }

  async getAllAuthorities() {
    const res = await pool.query(`
      SELECT u.*, ad.cargo, ad.fecha_asignacion, o.nombre AS organizacion_nombre
      FROM usuarios u
      JOIN autoridades_detalle ad ON u.id = ad.usuario_id
      JOIN organizaciones o ON ad.organizacion_id = o.id
      WHERE u.rol = 'autoridad'
    `);
    return res.rows;
  }
}

module.exports = new Organization();
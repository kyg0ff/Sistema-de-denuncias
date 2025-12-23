const pool = require('../db');

class Complaint {
  async findAll() {
    // Asegúrate de que la tabla se llame 'denuncias' en tu Postgres
    const res = await pool.query('SELECT * FROM denuncias ORDER BY fecha_creacion DESC');
    return res.rows;
  }

  async findById(id) {
    const res = await pool.query('SELECT * FROM denuncias WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findByUserId(usuario_id) {
    const res = await pool.query('SELECT * FROM denuncias WHERE usuario_id = $1 ORDER BY fecha_creacion DESC', [usuario_id]);
    return res.rows;
  }

  async create(complaintData) {
    const año = new Date().getFullYear();
    const conteoRes = await pool.query(
      'SELECT COUNT(*) FROM denuncias WHERE EXTRACT(YEAR FROM fecha_creacion) = $1',
      [año]
    );
    const secuencial = String(parseInt(conteoRes.rows[0].count) + 1).padStart(3, '0');
    const codigo_seguimiento = `D-${año}-${secuencial}`;

    const res = await pool.query(
      `INSERT INTO denuncias (
        codigo_seguimiento, usuario_id, organizacion_asignada_id, categoria, titulo, descripcion,
        placa, ubicacion, evidencias, referencia, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        codigo_seguimiento,
        complaintData.usuario_id || null,
        complaintData.organizacion_asignada_id || null,
        complaintData.categoria,
        complaintData.titulo,
        complaintData.descripcion,
        complaintData.placa || null,
        complaintData.ubicacion,
        complaintData.evidencias || null,
        complaintData.referencia || null,
        'pendiente'
      ]
    );
    return res.rows[0];
  }
}

module.exports = new Complaint();
const pool = require('../db');

class Complaint {
  async findAll() {
    const res = await pool.query(`
      SELECT 
        d.*,
        c.slug AS categoria_slug,
        c.titulo AS categoria_titulo,
        c.color AS categoria_color
      FROM denuncias d
      LEFT JOIN categorias c ON d.categoria_id = c.id
      ORDER BY d.fecha_creacion DESC
    `);
    return res.rows;
  }

  async findById(id) {
    const res = await pool.query(`
      SELECT 
        d.*,
        c.slug AS categoria_slug,
        c.titulo AS categoria_titulo,
        c.color AS categoria_color
      FROM denuncias d
      LEFT JOIN categorias c ON d.categoria_id = c.id
      WHERE d.id = $1
    `, [id]);
    return res.rows[0] || null;
  }

  async findByUserId(usuario_id) {
    const res = await pool.query(`
      SELECT 
        d.*,
        c.slug AS categoria_slug,
        c.titulo AS categoria_titulo,
        c.color AS categoria_color
      FROM denuncias d
      LEFT JOIN categorias c ON d.categoria_id = c.id
      WHERE d.usuario_id = $1 
      ORDER BY d.fecha_creacion DESC
    `, [usuario_id]);
    return res.rows;
  }

  async create(complaintData) {
    // 1. Resolver categoria_id a partir del slug que envía el frontend
    const catRes = await pool.query(
      'SELECT id FROM categorias WHERE slug = $1',
      [complaintData.categoria_slug]
    );

    if (catRes.rows.length === 0) {
      throw new Error('Categoría no encontrada en la base de datos');
    }
    const categoria_id = catRes.rows[0].id;

    // 2. Generar código de seguimiento
    const año = new Date().getFullYear();
    const conteoRes = await pool.query(
      'SELECT COUNT(*) FROM denuncias WHERE EXTRACT(YEAR FROM fecha_creacion) = $1',
      [año]
    );
    const conteo = parseInt(conteoRes.rows[0].count) + 1;
    const codigo_seguimiento = `CS-${año}-${conteo.toString().padStart(4, '0')}`;

    // 3. Insertar la denuncia
    const res = await pool.query(`
      INSERT INTO denuncias (
        codigo_seguimiento, usuario_id, organizacion_asignada_id, categoria_id,
        titulo, descripcion, placa, ubicacion, evidencias, referencia, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      codigo_seguimiento,
      complaintData.usuario_id || null,
      complaintData.organizacion_asignada_id || null,
      categoria_id,
      complaintData.titulo,
      complaintData.descripcion,
      complaintData.placa || null,
      complaintData.ubicacion,
      complaintData.evidencias || null,
      complaintData.referencia || null,
      'pendiente'
    ]);

    return res.rows[0];
  }
}

module.exports = new Complaint();
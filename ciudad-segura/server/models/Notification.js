const pool = require('../db');

class Notification {
  async findByUserId(usuario_id) {
    const res = await pool.query(
      'SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY fecha_creacion DESC',
      [usuario_id]
    );
    return res.rows;
  }

  async findUnreadByUserId(usuario_id) {
    const res = await pool.query(
      'SELECT * FROM notificaciones WHERE usuario_id = $1 AND leida = FALSE',
      [usuario_id]
    );
    return res.rows;
  }

  async create(notificationData) {
    const res = await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, mensaje, denuncia_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        notificationData.usuario_id,
        notificationData.tipo,
        notificationData.mensaje,
        notificationData.denuncia_id || null
      ]
    );
    return res.rows[0];
  }

  async markAsRead(usuario_id, notificacion_id) {
    const res = await pool.query(
      'UPDATE notificaciones SET leida = TRUE WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [notificacion_id, usuario_id]
    );
    return res.rows[0] || null;
  }

  async markAllAsRead(usuario_id) {
    await pool.query(
      'UPDATE notificaciones SET leida = TRUE WHERE usuario_id = $1',
      [usuario_id]
    );
    return true;
  }
}

module.exports = new Notification();
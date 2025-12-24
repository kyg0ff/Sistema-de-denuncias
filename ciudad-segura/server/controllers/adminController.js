const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Organization = require('../models/Organization');

// =====================
// Estadísticas
// =====================

exports.getStatistics = async (req, res) => {
  try {
    const allComplaints = await Complaint.findAll();
    const allUsers = await User.findAll();

    const resolvedComplaints = allComplaints.filter(
      (c) => c.estado === 'resuelto'
    );

    const avgResponseTime =
      resolvedComplaints.length > 0
        ? Math.floor(
            resolvedComplaints.reduce((sum, c) => {
              const createdAt = new Date(c.fecha_creacion);
              const resolvedAt = new Date(
                c.fecha_actualizacion ||
                  createdAt.getTime() + 2 * 24 * 60 * 60 * 1000
              );
              return sum + (resolvedAt - createdAt) / (1000 * 60 * 60);
            }, 0) / resolvedComplaints.length
          )
        : 0;

    const stats = {
      totalUsers: allUsers.length,
      totalComplaints: allComplaints.length,
      resolvedComplaints: resolvedComplaints.length,
      pendingComplaints: allComplaints.filter(
        (c) => c.estado === 'pendiente'
      ).length,
      avgResponseTime: `${avgResponseTime} horas`,
      resolutionRate:
        allComplaints.length > 0
          ? Math.round(
              (resolvedComplaints.length / allComplaints.length) * 100
            )
          : 0,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};

// =====================
// Usuarios
// =====================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error al obtener usuarios' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.update(parseInt(id), updates);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error al actualizar usuario' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft-delete: cambiar estado a 'eliminado'
    const updated = await User.update(parseInt(id), { estado: 'eliminado' });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      message: 'Usuario marcado como eliminado',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error al eliminar usuario' });
  }
};

// =====================
// Organizaciones
// =====================

exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.getAll();
    res.json({ success: true, data: organizations });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener organizaciones',
    });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const {
      nombre,
      correo_contacto,
      numero_contacto,
      ubicacion,
    } = req.body;

    const result = await pool.query(
      'INSERT INTO organizaciones (nombre, correo_contacto, numero_contacto, ubicacion) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, correo_contacto, numero_contacto, ubicacion]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error al crear organización' });
  }
};

// =====================
// Autoridades
// =====================

exports.getAuthorities = async (req, res) => {
  try {
    const authorities = await Organization.getAllAuthorities();
    res.json({ success: true, data: authorities });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error al obtener autoridades' });
  }
};

exports.getAuthoritiesByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const authorities = await Organization.getAuthoritiesByOrg(
      parseInt(orgId)
    );
    res.json({ success: true, data: authorities });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener autoridades de organización',
    });
  }
};

exports.createAuthority = async (req, res) => {
  try {
    const { usuario_id, organizacion_id, cargo } = req.body;

    const result = await pool.query(
      'INSERT INTO autoridades_detalle (usuario_id, organizacion_id, cargo) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, organizacion_id, cargo]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error al crear autoridad' });
  }
};

exports.updateAuthority = async (req, res) => {
  try {
    const { id } = req.params;
    const { cargo } = req.body;

    const result = await pool.query(
      'UPDATE autoridades_detalle SET cargo = $1 WHERE usuario_id = $2 RETURNING *',
      [cargo, id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Autoridad no encontrada' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error al actualizar autoridad' });
  }
};

exports.deleteAuthority = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM autoridades_detalle WHERE usuario_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Autoridad no encontrada' });
    }

    res.json({ success: true, message: 'Autoridad eliminada' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error al eliminar autoridad' });
  }
};

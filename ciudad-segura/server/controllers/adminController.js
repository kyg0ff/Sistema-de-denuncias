const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Organization = require('../models/Organization');

const pool = require('../db'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcrypt');

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
exports.createUser = async (req, res) => {
  try {
    const { dni, nombres, apellidos, correo, contraseña_hash, rol, telefono } = req.body;

    // 1. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña_hash, salt);

    // 2. Insertar en la base de datos usando pool directamente
    // Usamos los nombres exactos de tus columnas SQL
    const result = await pool.query(
      `INSERT INTO usuarios (dni, nombres, apellidos, correo, contraseña_hash, rol, telefono, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'activo') 
       RETURNING id, dni, nombres, apellidos, correo, rol, estado`,
      [dni, nombres, apellidos, correo, hash, rol, telefono]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Usuario creado exitosamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Manejo de error por si el correo o DNI ya existen
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'El correo o DNI ya están registrados' });
    }
    res.status(500).json({ success: false, message: 'Error interno al crear usuario' });
  }
};

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
    // Extraemos los campos exactos que vienen del formulario del Dashboard
    const { nombres, apellidos, dni, correo, telefono, rol, estado } = req.body;

    // Ejecutamos el UPDATE directamente en SQL
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombres = $1, 
           apellidos = $2, 
           dni = $3, 
           correo = $4, 
           telefono = $5, 
           rol = $6, 
           estado = $7 
       WHERE id = $8 
       RETURNING id, dni, nombres, apellidos, correo, rol, estado`,
      [nombres, apellidos, dni, correo, telefono, rol, estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Devolvemos el usuario actualizado para que el Frontend refresque la tabla
    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al actualizar usuario' 
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Usamos 'inactivo' para que coincida con tu lógica de Login/Dashboard
    const result = await pool.query(
      "UPDATE usuarios SET estado = 'inactivo' WHERE id = $1 RETURNING id, nombres, estado",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      message: 'El usuario ha sido desactivado (Baja lógica)',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ success: false, message: 'Error al procesar la baja' });
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

exports.getAvailableAuthorities = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.nombres, u.apellidos, u.dni, u.correo
      FROM usuarios u
      WHERE u.rol = 'autoridad' 
      AND u.estado = 'activo'
      AND u.id NOT IN (SELECT usuario_id FROM autoridades_detalle)
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener autoridades disponibles:', error);
    res.status(500).json({ success: false, message: 'Error al filtrar autoridades' });
  }
};
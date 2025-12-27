const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const pool = require('../db'); // Necesario para consultar la vista

router.get('/home', async (req, res) => {
  try {
    // Obtener todas las denuncias (con JOIN a categorías)
    const allComplaints = await Complaint.findAll();
    const resolvedComplaints = allComplaints.filter(c => c.estado === 'resuelto');

    // Usar la vista de la BD para estadísticas por categoría
    const statsRes = await pool.query('SELECT * FROM vista_estadisticas');

    const categoriesDistribution = statsRes.rows
      .filter(row => row.cantidad_por_categoria > 0)
      .map(row => ({
        label: row.categoria_nombre,           // título bonito
        value: row.cantidad_por_categoria,     // cantidad
        color: row.categoria_color || '#64748b' // color de BD o gris fallback
      }));

    // Tiempo promedio (de la vista o calculado manualmente)
    let averageResponseTime = 0;
    if (statsRes.rows.length > 0 && statsRes.rows[0].tiempo_promedio_resolucion_horas !== null) {
      averageResponseTime = Math.round(statsRes.rows[0].tiempo_promedio_resolucion_horas);
    } else if (resolvedComplaints.length > 0) {
      averageResponseTime = Math.round(
        resolvedComplaints.reduce((sum, c) => {
          const created = new Date(c.fecha_creacion);
          const updated = new Date(c.fecha_actualizacion || c.fecha_creacion);
          return sum + (updated - created) / (1000 * 60 * 60);
        }, 0) / resolvedComplaints.length
      );
    }

    const stats = {
      totalComplaints: allComplaints.length,
      resolutionRate: allComplaints.length > 0
        ? Math.round((resolvedComplaints.length / allComplaints.length) * 100)
        : 0,
      averageResponseTime,
      categoriesDistribution,
      recentComplaints: allComplaints.slice(0, 3).map(c => ({
        id: c.id,
        category: c.categoria_titulo || c.categoria_slug || 'Sin categoría',
        title: c.titulo || `Denuncia ${c.codigo_seguimiento}`,
        status: c.estado,
        location: typeof c.ubicacion === 'object' ? c.ubicacion.address : c.ubicacion || 'No especificada',
        createdAt: c.fecha_creacion
      }))
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error en /api/stats/home:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
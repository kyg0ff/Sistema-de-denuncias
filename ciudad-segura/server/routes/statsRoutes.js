const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint'); // Ahora esto es el objeto instanciado
const User = require('../models/User');           // Ahora esto es el objeto instanciado

router.get('/home', async (req, res) => {
  try {
    // Ahora .findAll() funcionará porque Complaint ya es una instancia
    const allComplaints = await Complaint.findAll();
    const resolvedComplaints = allComplaints.filter(c => c.estado === 'resuelto');
    
    const stats = {
      totalComplaints: allComplaints.length,
      resolutionRate: allComplaints.length > 0 
        ? Math.round((resolvedComplaints.length / allComplaints.length) * 100)
        : 0,
      avgResponseTime: '48h', 
      
      byCategory: [
        { name: 'Obstrucción', value: allComplaints.filter(c => c.categoria === 'obstruccion').length, color: 'var(--deep-blue)' },
        { name: 'Invasión Peatonal', value: allComplaints.filter(c => c.categoria === 'invasion').length, color: 'var(--medium-blue)' },
        { name: 'Zonas Prohibidas', value: allComplaints.filter(c => c.categoria === 'zonas').length, color: 'var(--vibrant-blue)' },
        { name: 'Accesos Públicos', value: allComplaints.filter(c => c.categoria === 'accesos').length, color: '#eab308' },
        { name: 'Conducta Indebida', value: allComplaints.filter(c => c.categoria === 'conducta').length, color: 'var(--soft-blue)' }
      ].filter(item => item.value > 0),
      
      recentComplaints: allComplaints
        .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
        .slice(0, 3)
        .map(c => ({
          id: c.id,
          category: c.categoria,
          title: c.titulo || `Denuncia ${c.codigo_seguimiento}`,
          status: c.estado,
          location: c.ubicacion || 'Ubicación no especificada',
          createdAt: c.fecha_creacion
        }))
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error en statsRoutes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
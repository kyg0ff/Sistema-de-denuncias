const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Estadísticas públicas (sin necesidad de login)
router.get('/home', (req, res) => {
  const allComplaints = Complaint.findAll();
  const allUsers = User.findAll();
  
  // Calcular estadísticas para el Home
  const resolvedComplaints = allComplaints.filter(c => c.status === 'resuelto');
  
  const stats = {
    // Totales para las tarjetas
    totalComplaints: allComplaints.length,
    resolutionRate: allComplaints.length > 0 
      ? Math.round((resolvedComplaints.length / allComplaints.length) * 100)
      : 82,
    avgResponseTime: '48h', // Podrías calcularlo como en admin
    
    // Distribución por categoría para el gráfico
    byCategory: [
      { name: 'Obstrucción', value: allComplaints.filter(c => c.category === 'obstruccion').length, color: 'var(--deep-blue)' },
      { name: 'Invasión Peatonal', value: allComplaints.filter(c => c.category === 'invasion').length, color: 'var(--medium-blue)' },
      { name: 'Zonas Prohibidas', value: allComplaints.filter(c => c.category === 'zonas').length, color: 'var(--vibrant-blue)' },
      { name: 'Accesos Públicos', value: allComplaints.filter(c => c.category === 'accesos').length, color: '#eab308' },
      { name: 'Conducta Indebida', value: allComplaints.filter(c => c.category === 'conducta').length, color: 'var(--soft-blue)' }
    ].filter(item => item.value > 0), // Filtrar categorías sin datos
    
    // Denuncias recientes para las cards
    recentComplaints: allComplaints
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3) // Solo 3 para el Home
      .map(c => ({
        id: c.id,
        category: c.category,
        title: c.title || `Denuncia ${c.id}`,
        status: c.status,
        location: c.location?.address || 'Ubicación no especificada',
        createdAt: c.createdAt,
        // Mapear categorías a nombres amigables
        categoryName: mapCategoryToName(c.category)
      }))
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// Función helper para nombres de categoría
function mapCategoryToName(category) {
  const categoryMap = {
    'obstruccion': 'Obstrucción',
    'invasion': 'Invasión Peatonal',
    'zonas': 'Zonas Prohibidas',
    'accesos': 'Accesos Públicos',
    'conducta': 'Conducta Indebida'
  };
  return categoryMap[category] || category;
}

module.exports = router;
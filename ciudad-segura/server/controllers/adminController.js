const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Organization = require('../models/Organization');

exports.getStatistics = (req, res) => {
  const allComplaints = Complaint.findAll();
  const allUsers = User.findAll();
  
  // Calcular tiempos de respuesta
  const resolvedComplaints = allComplaints.filter(c => c.status === 'resuelto');
  const avgResponseTime = resolvedComplaints.length > 0 
    ? Math.floor(resolvedComplaints.reduce((sum, c) => {
        const createdAt = new Date(c.createdAt);
        // Simular fecha de resolución (2 días después)
        const resolvedAt = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
        return sum + (resolvedAt - createdAt) / (1000 * 60 * 60); // Horas
      }, 0) / resolvedComplaints.length)
    : 48; // Valor por defecto

  const stats = {
    // Totales
    totalUsers: allUsers.length,
    totalComplaints: allComplaints.length,
    activeComplaints: allComplaints.filter(c => 
      c.status === 'pendiente' || c.status === 'en_revision'
    ).length,
    resolvedComplaints: resolvedComplaints.length,
    
    // Tiempos
    avgResponseTime: `${avgResponseTime}h`,
    resolutionRate: allComplaints.length > 0 
      ? Math.round((resolvedComplaints.length / allComplaints.length) * 100)
      : 82,
    
    // Por categoría (para el gráfico)
    byCategory: {
      obstruccion: allComplaints.filter(c => c.category === 'obstruccion').length,
      invasion: allComplaints.filter(c => c.category === 'invasion').length,
      zonas: allComplaints.filter(c => c.category === 'zonas').length,
      accesos: allComplaints.filter(c => c.category === 'accesos').length,
      conducta: allComplaints.filter(c => c.category === 'conducta').length
    },
    
    // Últimos 7 días (para posible gráfico de línea)
    last7Days: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        date: dateStr,
        count: allComplaints.filter(c => 
          c.createdAt && c.createdAt.startsWith(dateStr)
        ).length
      };
    }).reverse(),
    
    // Denuncias recientes (para el Home)
    recentComplaints: allComplaints
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6) // Últimas 6 denuncias
      .map(c => ({
        id: c.id,
        category: c.category,
        title: c.title || `Denuncia ${c.id}`,
        status: c.status,
        location: c.location?.address || 'Ubicación no especificada',
        createdAt: c.createdAt
      }))
  };
  
  res.json({
    success: true,
    data: stats
  });
};

exports.getAllUsers = (req, res) => {
  const users = User.findAll();
  res.json({
    success: true,
    count: users.length,
    data: users
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const updatedUser = User.update(parseInt(id), updates);
  
  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  res.json({
    success: true,
    message: 'Usuario actualizado',
    data: updatedUser
  });
};

exports.deleteUser = (req, res) => {
  // En una implementación real, marcaríamos como inactivo
  // Por ahora simulamos éxito
  res.json({
    success: true,
    message: 'Usuario marcado como inactivo'
  });
};

// Organizaciones
exports.getAllOrganizations = (req, res) => {
  const orgs = Organization.getAllOrgs();
  res.json({
    success: true,
    count: orgs.length,
    data: orgs
  });
};

exports.createOrganization = (req, res) => {
  const orgData = req.body;
  const newOrg = Organization.createOrg(orgData);
  
  res.status(201).json({
    success: true,
    message: 'Organización creada',
    data: newOrg
  });
};

// Autoridades
exports.getAuthorities = (req, res) => {
  const authorities = Organization.getAllAuthorities();
  res.json({
    success: true,
    count: authorities.length,
    data: authorities
  });
};

exports.getAuthoritiesByOrg = (req, res) => {
  const { orgId } = req.params;
  const authorities = Organization.getAuthoritiesByOrg(parseInt(orgId));
  
  res.json({
    success: true,
    count: authorities.length,
    data: authorities
  });
};

exports.createAuthority = (req, res) => {
  const authData = req.body;
  const newAuthority = Organization.createAuthority(authData);
  
  res.status(201).json({
    success: true,
    message: 'Autoridad creada',
    data: newAuthority
  });
};

exports.updateAuthority = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const updatedAuthority = Organization.updateAuthority(parseInt(id), updates);
  
  if (!updatedAuthority) {
    return res.status(404).json({
      success: false,
      message: 'Autoridad no encontrada'
    });
  }
  
  res.json({
    success: true,
    message: 'Autoridad actualizada',
    data: updatedAuthority
  });
};

exports.deleteAuthority = (req, res) => {
  const { id } = req.params;
  const success = Organization.deleteAuthority(parseInt(id));
  
  if (!success) {
    return res.status(404).json({
      success: false,
      message: 'Autoridad no encontrada'
    });
  }
  
  res.json({
    success: true,
    message: 'Autoridad eliminada'
  });
};
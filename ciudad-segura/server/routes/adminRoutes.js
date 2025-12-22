const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware para verificar admin (simple por ahora)
const isAdmin = (req, res, next) => {
  // En una app real, verificaríamos el token JWT
  // Por ahora permitimos todo
  next();
};

// Estadísticas
router.get('/statistics', isAdmin, adminController.getStatistics);

// Usuarios
router.get('/users', isAdmin, adminController.getAllUsers);
router.put('/users/:id', isAdmin, adminController.updateUser);
router.delete('/users/:id', isAdmin, adminController.deleteUser);

// Organizaciones
router.get('/organizations', isAdmin, adminController.getAllOrganizations);
router.post('/organizations', isAdmin, adminController.createOrganization);

// Autoridades
router.get('/authorities', isAdmin, adminController.getAuthorities);
router.get('/organizations/:orgId/authorities', isAdmin, adminController.getAuthoritiesByOrg);
router.post('/authorities', isAdmin, adminController.createAuthority);
router.put('/authorities/:id', isAdmin, adminController.updateAuthority);
router.delete('/authorities/:id', isAdmin, adminController.deleteAuthority);

module.exports = router;
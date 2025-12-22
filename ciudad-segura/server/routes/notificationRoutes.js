const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET /api/notifications/:userId - Obtener notificaciones de usuario
router.get('/:userId', notificationController.getUserNotifications);

// POST /api/notifications/:userId - Crear notificación (testing)
router.post('/:userId', notificationController.createNotification);

// PUT /api/notifications/:userId/read/:notificationId - Marcar como leída
router.put('/:userId/read/:notificationId', notificationController.markAsRead);

// PUT /api/notifications/:userId/read-all - Marcar todas como leídas
router.put('/:userId/read-all', notificationController.markAllAsRead);

// DELETE /api/notifications/:userId/:notificationId - Eliminar notificación
router.delete('/:userId/:notificationId', notificationController.deleteNotification);

module.exports = router;
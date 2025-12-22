const Notification = require('../models/Notification');

// Obtener notificaciones de un usuario
exports.getUserNotifications = (req, res) => {
  const { userId } = req.params;
  
  const notifications = Notification.findByUserId(parseInt(userId));
  
  // Formatear el tiempo relativo
  const formattedNotifications = notifications.map(notif => ({
    ...notif,
    time: getRelativeTime(notif.createdAt)
  }));
  
  res.json({
    success: true,
    count: formattedNotifications.length,
    unreadCount: Notification.findUnreadByUserId(parseInt(userId)).length,
    data: formattedNotifications
  });
};

// Marcar notificación como leída
exports.markAsRead = (req, res) => {
  const { userId, notificationId } = req.params;
  
  const success = Notification.markAsRead(parseInt(notificationId), parseInt(userId));
  
  if (!success) {
    return res.status(404).json({
      success: false,
      message: 'Notificación no encontrada'
    });
  }
  
  res.json({
    success: true,
    message: 'Notificación marcada como leída'
  });
};

// Marcar todas como leídas
exports.markAllAsRead = (req, res) => {
  const { userId } = req.params;
  
  const count = Notification.markAllAsRead(parseInt(userId));
  
  res.json({
    success: true,
    message: `${count} notificaciones marcadas como leídas`,
    count
  });
};

// Eliminar notificación
exports.deleteNotification = (req, res) => {
  const { userId, notificationId } = req.params;
  
  const success = Notification.delete(parseInt(notificationId), parseInt(userId));
  
  if (!success) {
    return res.status(404).json({
      success: false,
      message: 'Notificación no encontrada'
    });
  }
  
  res.json({
    success: true,
    message: 'Notificación eliminada'
  });
};

// Crear notificación manual (para testing)
exports.createNotification = (req, res) => {
  const { userId } = req.params;
  const { type, message, complaintId } = req.body;
  
  const notification = Notification.create({
    userId: parseInt(userId),
    type: type || 'update',
    message: message || 'Nueva notificación',
    complaintId
  });
  
  res.status(201).json({
    success: true,
    message: 'Notificación creada',
    data: notification
  });
};

// Función helper para tiempo relativo
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem`;
  return date.toLocaleDateString('es-ES');
}
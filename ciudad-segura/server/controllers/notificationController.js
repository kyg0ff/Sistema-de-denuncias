const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findByUserId(parseInt(userId));

    const formattedNotifications = notifications.map(notif => ({
      ...notif,
      time: getRelativeTime(notif.fecha_creacion)
    }));

    res.json({
      success: true,
      count: formattedNotifications.length,
      unreadCount: (await Notification.findUnreadByUserId(parseInt(userId))).length,
      data: formattedNotifications
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;
    const updated = await Notification.markAsRead(parseInt(userId), parseInt(notificationId));
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    }
    res.json({ success: true, message: 'Notificación marcada como leída', data: updated });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({ success: false, message: 'Error al marcar notificación' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.markAllAsRead(parseInt(userId));
    res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar todas:', error);
    res.status(500).json({ success: false, message: 'Error al marcar todas' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tipo, mensaje, denuncia_id } = req.body;

    const notification = await Notification.create({
      usuario_id: parseInt(userId),
      tipo,
      mensaje,
      denuncia_id: denuncia_id ? parseInt(denuncia_id) : null
    });

    res.status(201).json({ success: true, message: 'Notificación creada', data: notification });
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ success: false, message: 'Error al crear notificación' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;
    // Placeholder: puedes implementar eliminación real si lo necesitas
    res.json({ success: true, message: 'Notificación eliminada (pendiente de implementación)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar notificación' });
  }
};

// Helper
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
  return date.toLocaleDateString('es-ES');
}
class Notification {
  constructor() {
    this.notifications = [
      {
        id: 1,
        userId: 1,
        type: 'update',
        message: 'Tu reporte RPT-1001 ha sido asignado a un equipo',
        time: 'Hace 2 horas',
        read: false,
        complaintId: 'RPT-1001',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 horas atrás
      },
      {
        id: 2,
        userId: 1,
        type: 'new_report',
        message: 'Nuevo reporte cerca de tu ubicación',
        time: 'Hace 5 horas',
        read: true,
        complaintId: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        userId: 1,
        type: 'resolved',
        message: 'Tu reporte RPT-1002 ha sido resuelto',
        time: 'Ayer',
        read: false,
        complaintId: 'RPT-1002',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // Obtener notificaciones por usuario
  findByUserId(userId) {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Más recientes primero
  }

  // Obtener notificaciones no leídas
  findUnreadByUserId(userId) {
    return this.notifications.filter(n => n.userId === userId && !n.read);
  }

  // Crear nueva notificación
  create(notificationData) {
    const newNotification = {
      id: this.notifications.length + 1,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString(),
      time: 'Justo ahora'
    };
    
    this.notifications.push(newNotification);
    return newNotification;
  }

  // Marcar como leída
  markAsRead(notificationId, userId) {
    const notification = this.notifications.find(
      n => n.id === notificationId && n.userId === userId
    );
    
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  // Marcar todas como leídas
  markAllAsRead(userId) {
    let count = 0;
    this.notifications.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        count++;
      }
    });
    return count;
  }

  // Eliminar notificación
  delete(notificationId, userId) {
    const index = this.notifications.findIndex(
      n => n.id === notificationId && n.userId === userId
    );
    
    if (index !== -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }

  // Crear notificación automática por evento
  createForEvent(userId, type, data) {
    let message = '';
    let complaintId = null;

    switch(type) {
      case 'complaint_created':
        message = `Tu reporte ${data.complaintId} ha sido recibido`;
        complaintId = data.complaintId;
        break;
      case 'complaint_assigned':
        message = `Tu reporte ${data.complaintId} ha sido asignado a un equipo`;
        complaintId = data.complaintId;
        break;
      case 'complaint_resolved':
        message = `¡Tu reporte ${data.complaintId} ha sido resuelto!`;
        complaintId = data.complaintId;
        break;
      case 'complaint_updated':
        message = `Hay una actualización en tu reporte ${data.complaintId}`;
        complaintId = data.complaintId;
        break;
      case 'new_complaint_nearby':
        message = `Nuevo reporte cerca de tu ubicación: ${data.title}`;
        complaintId = data.complaintId;
        break;
      case 'system_alert':
        message = data.message || 'Alerta del sistema';
        break;
      default:
        message = 'Tienes una nueva notificación';
    }

    return this.create({
      userId,
      type: type === 'complaint_resolved' ? 'resolved' : 
             type === 'new_complaint_nearby' ? 'new_report' : 'update',
      message,
      complaintId
    });
  }
}

module.exports = new Notification();
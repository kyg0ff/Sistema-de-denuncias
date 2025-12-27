const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll();
    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Denuncia no encontrada' });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Error al obtener denuncia por ID:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    // Manejo de archivos subidos con multer
    const evidencesArray = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        evidencesArray.push(`/uploads/${file.filename}`);
      });
    }

    // Datos del formulario (el frontend envía 'categoria' como slug string)
    const complaintData = {
      categoria_slug: req.body.categoria,                // ← CAMBIO CLAVE: ahora es slug
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      placa: req.body.placa || null,
      ubicacion: req.body.ubicacion ? JSON.parse(req.body.ubicacion) : null,
      referencia: req.body.referencia || null,
      usuario_id: req.body.usuario_id ? parseInt(req.body.usuario_id) : null,
      organizacion_asignada_id: req.body.organizacion_asignada_id ? parseInt(req.body.organizacion_asignada_id) : null,
      evidencias: evidencesArray.length > 0 ? evidencesArray : null
    };

    // Crear la denuncia (el modelo Complaint se encarga de resolver slug → categoria_id)
    const newComplaint = await Complaint.create(complaintData);

    // Crear notificación para el usuario (si está autenticado)
    if (complaintData.usuario_id) {
      try {
        await Notification.create({
          usuario_id: complaintData.usuario_id,
          tipo: 'denuncia_creada',
          mensaje: `Tu denuncia ha sido registrada con éxito. Código de seguimiento: ${newComplaint.codigo_seguimiento}`,
          denuncia_id: newComplaint.id
        });
      } catch (notifError) {
        console.error('Error al crear notificación:', notifError);
        // No rompemos el flujo principal por error en notificación
      }
    }

    // Respuesta exitosa al frontend
    res.status(201).json({
      success: true,
      message: 'Denuncia creada exitosamente',
      complaintId: newComplaint.id,
      trackingCode: newComplaint.codigo_seguimiento,
      data: newComplaint
    });

  } catch (error) {
    console.error('Error detallado al crear denuncia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar la denuncia en el servidor', 
      error: error.message 
    });
  }
};
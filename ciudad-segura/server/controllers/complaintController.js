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

    res.json({ success: true, data: complaint });
  } catch (error) {
    console.error('Error al obtener denuncia:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const complaintData = req.body;

    if (!complaintData.categoria || !complaintData.descripcion || !complaintData.ubicacion) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios (categoría, descripción, ubicación)' });
    }

    const newComplaint = await Complaint.create(complaintData);

    if (complaintData.usuario_id) {
      await Notification.create({
        usuario_id: complaintData.usuario_id,
        tipo: 'denuncia_creada',
        mensaje: `Tu denuncia "${newComplaint.titulo || 'sin título'}" ha sido registrada con código ${newComplaint.codigo_seguimiento}`,
        denuncia_id: newComplaint.id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Denuncia creada exitosamente',
      data: newComplaint
    });
  } catch (error) {
    console.error('Error al crear denuncia:', error);
    res.status(500).json({ success: false, message: 'Error al crear denuncia', error: error.message });
  }
};
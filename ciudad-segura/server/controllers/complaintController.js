const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

exports.getAllComplaints = (req, res) => {
  const complaints = Complaint.findAll();
  res.json({
    success: true,
    count: complaints.length,
    data: complaints
  });
};

exports.getComplaintById = (req, res) => {
  const { id } = req.params;
  const complaint = Complaint.findById(id);
  
  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Denuncia no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: complaint
  });
};

exports.createComplaint = (req, res) => {
  const complaintData = req.body;
  const newComplaint = Complaint.create(complaintData);
  
  // Crear notificación si hay usuario
  if (complaintData.userId) {
    Notification.createForEvent(
      complaintData.userId,
      'complaint_created',
      { complaintId: newComplaint.id }
    );
  }
  
  res.status(201).json({
    success: true,
    message: 'Denuncia creada exitosamente',
    data: newComplaint
  });
};
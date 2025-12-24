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
    console.log("--- NUEVA PETICIÓN ---");
    console.log("Datos recibidos (body):", req.body);
    
    // 1. Extraer datos del cuerpo
    const { categoria, descripcion, placa, referencia, usuario_id, ubicacion } = req.body;

    // --- SOLUCIÓN PARA EL ERROR DE INTEGER ["5", "5"] ---
    let finalUserId = usuario_id;

    // Si por alguna razón llega como un array, tomamos el primer valor
    if (Array.isArray(finalUserId)) {
      finalUserId = finalUserId[0];
    }

    // Convertimos a número entero. Si es un string vacío, 'null' o undefined, será null.
    finalUserId = (finalUserId && finalUserId !== '' && finalUserId !== 'null') 
      ? parseInt(finalUserId, 10) 
      : null;
    // ----------------------------------------------------

    // 2. Validación de campos obligatorios
    if (!categoria || !ubicacion) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos obligatorios (categoría, ubicación)' 
      });
    }

    // 3. Procesar las evidencias
    const evidenciasArray = req.files ? req.files.map(file => file.filename) : [];

    // 4. Preparar el objeto para el modelo
    const finalUbicacion = typeof ubicacion === 'string' 
      ? ubicacion 
      : JSON.stringify(ubicacion);

    const complaintData = {
      categoria,
      titulo: `Reporte de ${categoria}`,
      descripcion,
      placa,
      referencia,
      usuario_id: finalUserId, 
      // Convertimos el array de archivos a un string JSON válido: ["img1.png"]
      ubicacion: finalUbicacion,
      evidencias: JSON.stringify(evidenciasArray) 
    };

    // 5. Crear la denuncia en la base de datos
    const newComplaint = await Complaint.create(complaintData);

    // 6. Crear notificación si el usuario está registrado
    // Usamos finalUserId para la comprobación
    if (finalUserId) {
      try {
        await Notification.create({
          usuario_id: finalUserId,
          tipo: 'denuncia_creada',
          mensaje: `Tu denuncia ha sido registrada con éxito. Código de seguimiento: ${newComplaint.codigo_seguimiento}`,
          denuncia_id: newComplaint.id
        });
      } catch (notifError) {
        console.error('Error al crear notificación:', notifError);
      }
    }

    // 7. Respuesta al frontend
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
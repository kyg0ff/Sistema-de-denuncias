const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const upload = require('../middleware/uploadMiddleware');

// ✅ ESTA ES LA ÚNICA RUTA POST QUE DEBE EXISTIR
// Multer (upload.array) "abre" el FormData y llena el req.body
router.post('/', upload.array('evidencias', 5), complaintController.createComplaint);

// GET /api/complaints
router.get('/', complaintController.getAllComplaints);

// GET /api/complaints/:id
router.get('/:id', complaintController.getComplaintById);

// ❌ HE ELIMINADO LA LÍNEA QUE TENÍAS AQUÍ: router.post('/', complaintController.createComplaint);

module.exports = router;
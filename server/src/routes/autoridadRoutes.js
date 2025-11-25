const express = require('express');
const router = express.Router();
const autoridadController = require('../controllers/autoridadController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Middleware Combinado: Primero comprueba Login, luego comprueba ROL
const soloAutoridades = [authMiddleware, roleMiddleware(['AUTORIDAD', 'ADMIN'])];

// Ruta: GET /api/autoridad/bandeja
router.get('/bandeja', soloAutoridades, autoridadController.listarDenunciasAsignadas);

// Ruta: PUT /api/autoridad/atender/:id_denuncia
router.put('/atender/:id_denuncia', soloAutoridades, autoridadController.cambiarEstadoDenuncia);

module.exports = router;
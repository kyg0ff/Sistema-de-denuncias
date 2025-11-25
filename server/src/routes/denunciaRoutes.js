const express = require('express');
const router = express.Router();
const denunciaController = require('../controllers/denunciaController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// --- RUTAS PRIVADAS (Requieren Token) ---
router.post('/', authMiddleware, upload.single('imagen'), denunciaController.crearDenuncia);
router.get('/', authMiddleware, denunciaController.listarMisDenuncias);

// --- RUTAS PÚBLICAS (C6 - Anónimas) ---

// 1. Registrar sin login
router.post('/anonima', upload.single('imagen'), denunciaController.crearDenunciaAnonima);

// 2. Consultar estado por código (Ej: GET /api/denuncias/seguimiento/D-12345)
router.get('/seguimiento/:codigo', denunciaController.consultarPorCodigo);

// NUEVAS RUTAS PARA EL HOME
router.get('/recientes', denunciaController.listarRecientes);
router.get('/estadisticas', denunciaController.obtenerEstadisticas);

module.exports = router;
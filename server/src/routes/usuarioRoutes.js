const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Definir la ruta POST para registrar
// La URL final será: http://localhost:3000/api/usuarios/registro
router.post('/registro', usuarioController.registrarUsuario);
router.post('/login', usuarioController.login);

module.exports = router;
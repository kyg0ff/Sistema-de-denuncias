const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Definición de rutas
router.get('/profile/:id', userController.getProfile);
router.put('/profile/:id', userController.updateProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// GET /api/categories - Obtener todas las categorías
router.get('/', categoriesController.getAllCategories);

module.exports = router;
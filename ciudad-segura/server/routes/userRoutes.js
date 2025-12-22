const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/profile/:id
router.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const user = User.findById(parseInt(id));
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// PUT /api/users/profile/:id
router.put('/profile/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const updatedUser = User.update(parseInt(id), updates);
  
  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  res.json({
    success: true,
    message: 'Perfil actualizado',
    data: updatedUser
  });
});

module.exports = router;
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // El await es fundamental para esperar a la DB
    const user = await User.findById(parseInt(id));

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Enviamos el objeto dentro de 'data'
    res.json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.update(parseInt(id), updates);
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Perfil actualizado correctamente', 
      data: updatedUser 
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar perfil' 
    });
  }
};
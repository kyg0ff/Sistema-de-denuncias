const User = require('../models/User');

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  const user = User.findByEmail(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ 
      success: false, 
      message: 'Credenciales incorrectas' 
    });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    message: 'Login exitoso',
    user: userWithoutPassword
  });
};

exports.register = (req, res) => {
  const { dni, name, lastName, email, phone, password } = req.body; // <-- Agregar phone
  
  // Validar que el email no exista
  const existingUser = User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'El email ya está registrado'
    });
  }
  
  const newUser = User.create({
    dni,
    name,
    lastName,
    email,
    phone: phone || '', // <-- Agregar teléfono
    password // ¡En producción hashear!
  });
  
  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    user: newUser
  });
};
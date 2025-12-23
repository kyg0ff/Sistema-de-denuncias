const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan email o contraseña' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.contraseña_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const { contraseña_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.register = async (req, res) => {
  try {
    const { dni, name, lastName, email, phone, password } = req.body;

    // 1. Validar campos obligatorios
    if (!dni || !name || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    // 2. Validar si el Email ya existe
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    // 3. Validar si el DNI ya existe (Esto evita el error 23505 de Postgres)
    const existingDni = await User.findByDni(dni);
    if (existingDni) {
      return res.status(400).json({ success: false, message: 'El DNI ya se encuentra registrado' });
    }

    // 4. Crear el usuario si todo está bien
    const newUser = await User.create({
      dni,
      nombres: name,
      apellidos: lastName,
      correo: email,
      telefono: phone || null,
      password: password
    });

    const { contraseña_hash, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error detallado en registro:', error);
    
    // Captura de seguridad por si falla la base de datos por otra razón de duplicidad
    if (error.code === '23505') {
      return res.status(400).json({ 
        success: false, 
        message: 'El DNI o el Correo ya existen en el sistema' 
      });
    }

    res.status(500).json({ success: false, message: 'Error al registrar usuario en el servidor' });
  }
};
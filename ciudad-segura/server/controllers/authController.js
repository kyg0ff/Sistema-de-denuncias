const bcrypt = require('bcrypt'); // Librería para encriptar y comparar contraseñas
const User = require('../models/User'); // Importación del modelo que habla con la base de datos

/**
 * CONTROLADOR: Login
 * Procesa el inicio de sesión de los ciudadanos.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validación de entrada
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan email o contraseña' });
    }

    // 2. Búsqueda
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // --- NUEVO: FILTRO DE ESTADO (SEGURIDAD) ---
    // Verificamos que el usuario no esté 'inactivo' o 'eliminado'
    if (user.estado !== 'activo') {
      return res.status(403).json({ 
        success: false, 
        message: 'Esta cuenta ha sido desactivada. Por favor, contacte al administrador.' 
      });
    }
    // -------------------------------------------

    // 3. Verificación de Contraseña
    const passwordMatch = await bcrypt.compare(password, user.contraseña_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // 4. Seguridad: Extraemos el hash para no enviarlo
    const { contraseña_hash, ...userWithoutPassword } = user;

    // 5. Respuesta
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

/**
 * CONTROLADOR: Register
 * Procesa la creación de nuevas cuentas de ciudadanos.
 */
exports.register = async (req, res) => {
  try {
    // Recibe los datos desde el formulario de registro de React
    const { dni, name, lastName, email, phone, password } = req.body;

    // 1. Validar campos obligatorios: Evita guardar datos nulos en columnas NOT NULL
    if (!dni || !name || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    // 2. Verificación de Duplicidad (Email): No pueden haber dos usuarios con el mismo correo
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    // 3. Verificación de Duplicidad (DNI): Evita el error de llave primaria/única en Postgres
    const existingDni = await User.findByDni(dni);
    if (existingDni) {
      return res.status(400).json({ success: false, message: 'El DNI ya se encuentra registrado' });
    }

    // 4. Persistencia: Crea el usuario en la base de datos
    // NOTA IMPORTANTE: Observa cómo se mapean los nombres aquí abajo.
    const newUser = await User.create({
      dni,
      nombres: name,      // El campo 'name' del frontend se guarda como 'nombres'
      apellidos: lastName, // El campo 'lastName' se guarda como 'apellidos'
      correo: email,
      telefono: phone || null,
      password: password
    });

    // 5. Limpieza y Respuesta: Enviamos el nuevo usuario (sin el hash) al frontend
    const { contraseña_hash, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error detallado en registro:', error);
    
    // Captura del error 23505 (Violación de restricción única en PostgreSQL)
    if (error.code === '23505') {
      return res.status(400).json({ 
        success: false, 
        message: 'El DNI o el Correo ya existen en el sistema' 
      });
    }

    res.status(500).json({ success: false, message: 'Error al registrar usuario en el servidor' });
  }
};
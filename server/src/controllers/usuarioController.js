// Controlador para gestionar usuarios

const db = require('../config/db'); // Importamos config de la BD
const bcrypt = require('bcryptjs'); // Importar bcrypt para hashear contraseñas
const jwt = require('jsonwebtoken'); 

// Registrar un nuevo ciudadano
const registrarUsuario = async (req, res) => {
  const { nombre, apellido, dni, correo, password } = req.body;

  if (!nombre || !apellido || !dni || !correo || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const userExist = await db.query('SELECT * FROM usuarios WHERE correo = $1 OR dni = $2', [correo, dni]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'El correo o DNI ya están registrados' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newCtx = await db.query(
      `INSERT INTO usuarios (nombre, apellido, dni, correo, password_hash) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, correo, rol`,
      [nombre, apellido, dni, correo, password_hash]
    );

    res.status(201).json({ mensaje: 'Usuario registrado', usuario: newCtx.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// --- FUNCION: INICIAR SESION ---
const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    // 1. Buscar usuario por correo
    const userResult = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales inválidas' }); // Por seguridad no decimos "correo no existe"
    }

    const usuario = userResult.rows[0];

    // 2. Comparar contraseñas (Texto plano vs Hash en DB)
    const validPassword = await bcrypt.compare(password, usuario.password_hash);

    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // 3. Crear el Token (El gafete)
    // Guardamos el ID y el ROL dentro del token
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token, // Aquí va el string largo JWT
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = {
  registrarUsuario,
  login // <--- NO OLVIDES EXPORTARLO
};
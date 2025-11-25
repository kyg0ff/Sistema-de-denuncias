const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Leer el token del header
  // El formato estándar es: "Authorization: Bearer <token>"
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
  }

  try {
    // Quitamos la palabra "Bearer " para quedarnos solo con el código
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    // 2. Verificar el token usando la palabra secreta
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Si es válido, guardamos los datos del usuario en la request
    req.usuario = verified; // { id: 1, rol: 'CIUDADANO', ... }
    
    next(); // Dejar pasar a la siguiente función (el controlador)

  } catch (err) {
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
};
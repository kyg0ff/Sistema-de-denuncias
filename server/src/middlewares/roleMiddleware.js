const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // req.usuario ya viene con datos gracias al authMiddleware previo
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ error: 'Acceso denegado. No tiene permisos suficientes.' });
        }
        next();
    };
};

module.exports = verificarRol;
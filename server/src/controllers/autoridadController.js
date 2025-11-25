// CONTROLADOR PARA FUNCIONES DE AUTORIDADES

// Importamos la configuración de la base de datos
const db = require('../config/db');

// FUNCIONES:

// 1. VER DENUNCIAS DE MI JURISDICCIÓN
const listarDenunciasAsignadas = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;

        // A. Averiguar a qué entidad pertenece esta autoridad
        const autoridadInfo = await db.query(
            `SELECT a.id_entidad, e.distrito 
             FROM autoridades a 
             JOIN entidades e ON a.id_entidad = e.id_entidad 
             WHERE a.id_usuario = $1`,
            [id_usuario]
        );

        if (autoridadInfo.rows.length === 0) {
            return res.status(403).json({ error: 'Usuario no tiene perfil de autoridad activo' });
        }

        const { distrito } = autoridadInfo.rows[0];

        // B. Buscar denuncias de ese distrito
        const denuncias = await db.query(
            `SELECT * FROM denuncias 
             WHERE distrito = $1 
             ORDER BY fecha_creado ASC`, // Las más antiguas primero para atenderlas
            [distrito]
        );

        // Peticion exitosa
        res.json({
            distrito_asignado: distrito,
            cantidad_pendientes: denuncias.rows.length,
            denuncias: denuncias.rows
        });

    } catch (err) {
        // Manejo de errores
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener denuncias' });
    }
};

// 2. ATENDER DENUNCIA (Cambiar estado)
const cambiarEstadoDenuncia = async (req, res) => {
    const { id_denuncia } = req.params;
    const { nuevo_estado, observacion } = req.body; // Ej: 'EN_PROCESO', 'Ya enviamos la grúa'
    const id_usuario = req.usuario.id;

    try {
        // A. Validar que el estado sea válido (usamos el enum de Postgres mentalmente)
        const estadosValidos = ['RECIBIDA', 'VALIDADA', 'EN_PROCESO', 'RESUELTA', 'RECHAZADA'];
        if (!estadosValidos.includes(nuevo_estado)) {
            return res.status(400).json({ error: 'Estado inválido' });
        }

        // B. Obtener ID de autoridad para el historial
        const autoridadResult = await db.query('SELECT id_autoridad FROM autoridades WHERE id_usuario = $1', [id_usuario]);
        const id_autoridad = autoridadResult.rows[0].id_autoridad;

        // C. Actualizar la denuncia
        const update = await db.query(
            `UPDATE denuncias 
             SET estado = $1 
             WHERE id_denuncia = $2 
             RETURNING *`,
            [nuevo_estado, id_denuncia]
        );

        if (update.rows.length === 0) return res.status(404).json({ error: 'Denuncia no encontrada' });

        // D. Guardar en el HISTORIAL (ODS 16 - Auditoría)
        await db.query(
            `INSERT INTO denuncias_historial (id_denuncia, id_autoridad, accion, estado_nuevo, observacion) 
             VALUES ($1, $2, 'CAMBIO_ESTADO', $3, $4)`,
            [id_denuncia, id_autoridad, nuevo_estado, observacion]
        );

        res.json({ mensaje: 'Estado actualizado correctamente', denuncia: update.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};


// Exportamos las funciones del controlador
module.exports = {
    listarDenunciasAsignadas,
    cambiarEstadoDenuncia
};
// CONTROLADOR PARA FUNCIONES DE DENUNCIAS

// Importamos la configuración de la base de datos
const db = require('../config/db');

// FUNCIONES:

// FUNCION AUXILIAR: para generar código único de seguimiento
const generarCodigo = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `D-${timestamp}-${random}`;
};

// --- FUNCION: CREAR DENUNCIA ---
const crearDenuncia = async (req, res) => {
    // 1. VERIFICAR SI LLEGÓ LA IMAGEN
    if (!req.file) {
        return res.status(400).json({ error: 'La imagen es obligatoria' });
    }

    // 2. CREAR LA URL PÚBLICA
    // Esta es la ruta que se guardará en la BD (ej: /uploads/imagen-167888999.jpg)
    const imagen_url = `/uploads/${req.file.filename}`;

    // Estos datos vienen del formulario (body)
    const { categoria, subcategoria, descripcion, distrito, direccion_referencia, latitud, longitud } = req.body;
    
    // Este dato viene del Token (gracias al middleware)
    const id_usuario = req.usuario.id; 

    // Validaciones básicas
    if (!categoria || !distrito || !latitud || !longitud) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (categoria, distrito, ubicación)' });
    }

    try {
        const codigo = generarCodigo();

        // Insertar en Base de Datos
        // Nota: id_entidad_asignada se queda en NULL por ahora (lo haremos con trigger o lógica después)
        const nuevaDenuncia = await db.query(
            `INSERT INTO denuncias 
            (id_usuario, codigo_seguimiento, categoria, subcategoria, descripcion, distrito, direccion_referencia, latitud, longitud, imagen_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [id_usuario, codigo, categoria, subcategoria, descripcion, distrito, direccion_referencia, latitud, longitud, imagen_url]
        );
        
        // Petición exitosa
        res.status(201).json({
            mensaje: 'Denuncia registrada exitosamente',
            denuncia: nuevaDenuncia.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al registrar la denuncia' });
    }
};

// --- FUNCION: LISTAR MIS DENUNCIAS ---
const listarMisDenuncias = async (req, res) => {


    try {
        // Obtenemos el ID del usuario desde el Token (gracias al middleware)
        const id_usuario = req.usuario.id;

        const denuncias = await db.query(
            'SELECT * FROM denuncias WHERE id_usuario = $1 ORDER BY fecha_creado DESC',
            [id_usuario]
        );

        res.json({
            cantidad: denuncias.rows.length,
            mis_denuncias: denuncias.rows
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener las denuncias' });
    }
};

// --- FUNCION: CREAR DENUNCIA ANÓNIMA (C6) ---
const crearDenunciaAnonima = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'Debe subir una foto como evidencia.' });
    }

    const imagen_url = `/uploads/${req.file.filename}`;

    const { categoria, subcategoria, descripcion, distrito, direccion_referencia, latitud, longitud } = req.body;

// Validaciones básicas de campos de texto
    if (!categoria || !distrito || !latitud || !longitud) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (categoria, distrito, ubicación)' });
    }

    try {
        const codigo = generarCodigo();

        // NOTA: Pasamos NULL como id_usuario
        const nuevaDenuncia = await db.query(
            `INSERT INTO denuncias 
            (id_usuario, codigo_seguimiento, categoria, subcategoria, descripcion, distrito, direccion_referencia, latitud, longitud, imagen_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING codigo_seguimiento, estado, categoria, fecha_creado, imagen_url`,
            [null, codigo, categoria, subcategoria, descripcion, distrito, direccion_referencia, latitud, longitud, imagen_url]
        );

        // Respuesta con énfasis en el CÓDIGO
        res.status(201).json({
            mensaje: 'Denuncia anónima registrada. ¡GUARDE SU CÓDIGO!',
            alerta: 'Sin este código no podrá consultar el estado de su denuncia.',
            datos: nuevaDenuncia.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al registrar la denuncia anónima' });
    }
};

// --- FUNCION: CONSULTAR POR CÓDIGO DE SEGUIMIENTO (Pública) ---
const consultarPorCodigo = async (req, res) => {
    const { codigo } = req.params; // Viene en la URL: /api/denuncias/seguimiento/D-123...

    try {
        const denuncia = await db.query(
            'SELECT codigo_seguimiento, categoria, distrito, estado, fecha_creado FROM denuncias WHERE codigo_seguimiento = $1',
            [codigo]
        );

        if (denuncia.rows.length === 0) {
            return res.status(404).json({ error: 'Código no encontrado' });
        }

        res.json(denuncia.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al consultar la denuncia' });
    }
};

// --- FUNCION: OBTENER DENUNCIAS RECIENTES (PÚBLICO - C10) ---
const listarRecientes = async (req, res) => {
    try {
        // Traemos las últimas 3 denuncias con foto
        const recientes = await db.query(
            `SELECT id_denuncia, categoria, distrito, fecha_creado, imagen_url, estado 
             FROM denuncias 
             WHERE imagen_url IS NOT NULL 
             ORDER BY fecha_creado DESC 
             LIMIT 3`
        );
        res.json(recientes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener recientes' });
    }
};

// --- FUNCION: OBTENER ESTADÍSTICAS (PÚBLICO - C9) ---
const obtenerEstadisticas = async (req, res) => {
    try {
        // Contar total
        const totalResult = await db.query('SELECT COUNT(*) FROM denuncias');
        const total = parseInt(totalResult.rows[0].count);

        // Contar resueltas
        const resueltasResult = await db.query("SELECT COUNT(*) FROM denuncias WHERE estado = 'RESUELTA'");
        const resueltas = parseInt(resueltasResult.rows[0].count);

        // Calcular porcentaje (evitar división por cero)
        const porcentaje = total > 0 ? Math.round((resueltas / total) * 100) : 0;

        res.json({
            total_denuncias: total,
            resueltas_pct: porcentaje,
            tiempo_promedio: '24h' // Dato simulado por ahora, calcularlo real requiere SQL complejo
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

// Exportamos las funciones del controlador
module.exports = {
    crearDenuncia,
    listarMisDenuncias,
    crearDenunciaAnonima,
    consultarPorCodigo,
    listarRecientes,      
    obtenerEstadisticas   
};
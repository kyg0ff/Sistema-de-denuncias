const pool = require('../db'); // Asegúrate de que la ruta a tu conexión sea correcta

exports.getHomeStats = async (req, res) => {
  try {
    // Consultamos directamente tu vista de PostgreSQL
    const result = await pool.query('SELECT * FROM vista_estadisticas');
    
    // Enviamos las filas encontradas
    res.json({
      success: true,
      data: result.rows // Esto enviará un array con una fila por categoría
    });
  } catch (error) {
    console.error('Error al obtener vista_estadisticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al conectar con la vista de estadísticas' 
    });
  }
};
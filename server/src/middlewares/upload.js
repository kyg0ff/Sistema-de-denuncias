const multer = require('multer');
const path = require('path');

// 1. Configuración del almacenamiento
const storage = multer.diskStorage({
    // Dónde guardar el archivo
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    // Nombre del archivo (timestamp-nombreoriginal.jpg)
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// 2. Filtro de archivos (Solo imágenes)
const fileFilter = (req, file, cb) => {
    // Tipos MIME permitidos
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // Aceptar
    } else {
        cb(new Error('Formato de archivo no soportado. Solo JPG o PNG.'), false); // Rechazar
    }
};

// 3. Inicializar Multer
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Límite de 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
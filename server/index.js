const express = require('express');
const cors = require('cors');
const path = require('path');
const autoridadRoutes = require('./src/routes/autoridadRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el body

// Importar Rutas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const denunciaRoutes = require('./src/routes/denunciaRoutes');

// Usar Rutas
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/denuncias', denunciaRoutes);
app.use('/api/autoridad', autoridadRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API Sistema de Denuncias funcionando correctamente');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Permitir este origen o cualquiera si no está configurado
  credentials: process.env.FRONTEND_URL ? true : false, // Permitir cookies solo si hay FRONTEND_URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos desde la carpeta uploads

app.use('/uploads', express.static('uploads'));

// Registro de rutas
require('./routes/login.routes')(app);
require('./routes/users.routes')(app);
require('./routes/projects.routes')(app);
require('./routes/tasks.routes')(app);

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Ruta no encontrada'
  });
});

// Manejador de errores global
const errorHandler = require('./middlewares/errorHandler.middleware');
const e = require('cors');
app.use(errorHandler);

// Puerto de escucha
app.set('port', process.env.PORT || 3000);

//if(!process.env.NODE_ENV){  // Descomentar al subir a producción
  // Iniciar el servidor - escuchar en 0.0.0.0 para aceptar conexiones externas (cloud deployment)
  app.listen(app.get('port'), '0.0.0.0',() => {
    console.log(`Servidor activo en http://0.0.0.0:${app.get('port')}`);
    console.log(`FRONTEND_URL configurada como: ${process.env.FRONTEND_URL || 'No configurada - usando wildcard (*)'}`);
  });
//}

module.exports = app;
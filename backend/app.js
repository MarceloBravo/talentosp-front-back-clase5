require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL2,
  process.env.FRONTEND_URL3
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`Petición desde: ${req.headers.origin}`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.url}`);
  next();
});

console.log(`CORS configurado para permitir acceso desde las siguientes URLs: ${allowedOrigins.join(', ')}`);

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
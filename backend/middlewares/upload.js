const multer = require('multer');

// Usar memoryStorage para mantener archivos en memoria
// Los archivos se guardarán en disco desde el servicio después de validar todo
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por archivo 
});

module.exports = upload;


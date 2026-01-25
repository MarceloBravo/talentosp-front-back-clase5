const bcrypt = require('bcryptjs');

const password = process.argv.slice(2);

console.log(password);

const saltRounds = process.env.SALTROUNDS || '10';

// Generar el hash
bcrypt.hash(password[0], parseInt(saltRounds), (err, hash) => {
  if (err) {
    console.error("Error al generar hash:", err);
    return;
  }
  console.log("Hash generado:", hash);

});
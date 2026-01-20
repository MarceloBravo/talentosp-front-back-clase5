require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({ user: { id: 1, nombre: 'Test User' } }, process.env.TOKEN_SECRETS, { expiresIn: '1h' });
console.log(token);

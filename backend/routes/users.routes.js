const UsersModel = require('../models/users.model');
const UserController = require('../controllers/users.controller');
const UsersService = require('../services/users.service');
const validaDatosUsuario = require('../middlewares/validaDatosUsuario.middleware');
const authenticateToken = require('../middlewares/auth.middleware');
const parseUserData = require('../middlewares/parseUserData.middleware');
const upload = require('../middlewares/upload');

module.exports = (app) => {
    const userService = new UsersService(new UsersModel());
    const userController = new UserController(userService);

    app.get('/api/users', (req, res, next) => userController.getAllUsers(req, res, next));
    app.get('/api/users/:id', (req, res, next) => userController.getUserById(req, res, next));
    app.post('/api/users', authenticateToken, validaDatosUsuario, parseUserData, upload.single('attachments'), (req, res, next) => userController.createUser(req, res, next));
    app.post('/api/register', validaDatosUsuario, parseUserData, upload.single('attachments'), (req, res, next) => userController.createUser(req, res, next));
    app.put('/api/users/:id', authenticateToken, validaDatosUsuario, parseUserData, upload.single('attachments'), (req, res, next) => userController.updateUser(req, res, next));
    app.delete('/api/users/:id', authenticateToken, (req, res, next) => userController.deleteUser(req, res, next));
}
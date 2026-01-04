const UsersModel = require('../models/users.model');
const UserController = require('../controllers/users.controller');
const UsersService = require('../services/users.service');
const validaDatosUsuario = require('../middlewares/validaDatosUsuario.middleware');
const authenticateToken = require('../middlewares/auth.middleware');
const parseUserData = require('../middlewares/parseUserData.middleware');
const UploadFileService = require('../services/uploadFile.service');

const upload = require('../middlewares/upload');

module.exports = (app) => {
    const uploadFileService = new UploadFileService()
    const userService = new UsersService(new UsersModel(), uploadFileService);
    const userController = new UserController(userService);

    app.get('/api/users', (req, res, next) => userController.getAllUsers(req, res, next));
    app.get('/api/users/:id', (req, res, next) => userController.getUserById(req, res, next));
    app.post('/api/users', upload.single('avatar'), authenticateToken, validaDatosUsuario, parseUserData, (req, res, next) => userController.createUser(req, res, next));
    app.post('/api/register', upload.single('avatar'), validaDatosUsuario, parseUserData, (req, res, next) => userController.createUser(req, res, next));
    app.put('/api/users/:id', upload.single('avatar'), authenticateToken, validaDatosUsuario, parseUserData, (req, res, next) => userController.updateUser(req, res, next));
    app.delete('/api/users/:id', authenticateToken, (req, res, next) => userController.deleteUser(req, res, next));
}
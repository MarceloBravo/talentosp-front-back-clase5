const UsersModel = require('../models/users.model');
const LoginService = require('../services/login.service');
const LoginController = require('../controllers/login.controller');
const validaDatosLogin = require('../middlewares/validaDatosLogin.middleware');

module.exports = (app) => {
    const loginService = new LoginService(new UsersModel());   
    const loginController = new LoginController(loginService);

    app.post('/api/login', validaDatosLogin, (req, res, next) => loginController.login(req, res, next));
    app.post('/api/logout', (req, res, next) => loginController.logout(req, res, next));
    app.post('/api/refreshToken', (req, res, next) => loginController.refreshToken(req, res, next));
}
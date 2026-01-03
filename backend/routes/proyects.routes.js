const ProyectController = require('../controllers/proyectos.controller.js');
const ProyectsTaskService = require('../services/proyects-task.service.js');
const TaskService = require('../services/tasks.service.js');
const ProyectService = require('../services/proyect.service.js');
const TaskModel = require('../models/task.model.js');
const ProjectModel = require('../models/project.model.js');

const validaDatosProyecto = require('../middlewares/validaDatosProyecto.middleware.js');
const validaDatosTareas = require('../middlewares/validaDatosTareas.middleware.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const parseProyectData = require('../middlewares/parseProyectData.middleware.js');
const upload = require('../middlewares/upload.js');

module.exports = (app) => {
    const projectModel = new ProjectModel();
    const taskModel = new TaskModel();
    const proyectService = new ProyectService(projectModel);
    const taskService = new TaskService(taskModel);
    const proyectsTaskService = new ProyectsTaskService(proyectService, taskService);
    const proyectController = new ProyectController(proyectService, proyectsTaskService);

    app.get('/api/proyectos', (req, res, next) => proyectController.getAllProjects(req, res, next));
    app.get('/api/proyectos/:id', (req, res, next) => proyectController.getProjectById(req, res, next));
    app.post('/api/proyectos', authenticateToken, upload.single('product_photo'), validaDatosProyecto, validaDatosTareas, parseProyectData, (req, res, next) => proyectController.createProject(req, res, next));
    app.put('/api/proyectos/:id', authenticateToken, upload.single('product_photo'), validaDatosProyecto, validaDatosTareas, parseProyectData, (req, res, next) => proyectController.updateProject(req, res, next));
    app.delete('/api/proyectos/:id', authenticateToken, (req, res, next) => proyectController.deleteProject(req, res, next));
}
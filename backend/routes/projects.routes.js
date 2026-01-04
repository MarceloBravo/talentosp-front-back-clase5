const ProjectController = require('../controllers/projects.controller.js');
const ProjectsTaskService = require('../services/projects-task.service.js');
const TaskService = require('../services/tasks.service.js');
const ProjectService = require('../services/project.service.js');
const TaskModel = require('../models/task.model.js');
const ProjectModel = require('../models/project.model.js');
const AttachmentsService = require('../services/attachments.service.js');
const AttachmentsProjectModel = require('../models/attachmentsProject.model.js');

const validaDatosProject = require('../middlewares/validaDatosProject.middleware.js');
const validaDatosTareas = require('../middlewares/validaDatosTareas.middleware.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const parseProjectData = require('../middlewares/parseProjectData.middleware.js');

const upload = require('../middlewares/upload.js');
const UploadFileService = require('../services/uploadFile.service.js');

module.exports = (app) => {
    const attachmentsProjectModel = new AttachmentsProjectModel();
    const attachmentsService = new AttachmentsService(attachmentsProjectModel);
    const uploadFileService = new UploadFileService();
    const projectModel = new ProjectModel();
    const taskModel = new TaskModel();
    const projectService = new ProjectService(projectModel, attachmentsService, uploadFileService);
    const taskService = new TaskService(taskModel, uploadFileService, attachmentsService);
    const projectsTaskService = new ProjectsTaskService(projectService, taskService);
    const projectController = new ProjectController(projectService, projectsTaskService);

    app.get('/api/projects', (req, res, next) => projectController.getAllProjects(req, res, next));
    app.get('/api/projects/:id', (req, res, next) => projectController.getProjectById(req, res, next));
    app.post('/api/projects', upload.array('attachments', 10), authenticateToken, validaDatosProject, validaDatosTareas, parseProjectData, (req, res, next) => projectController.createProject(req, res, next));
    app.put('/api/projects/:id', upload.array('attachments', 10), authenticateToken, validaDatosProject, validaDatosTareas, parseProjectData,(req, res, next) => projectController.updateProject(req, res, next));
    app.delete('/api/projects/:id', authenticateToken, (req, res, next) => projectController.deleteProject(req, res, next));
}
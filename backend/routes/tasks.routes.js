const TasksController = require("../controllers/tasks.controller");
const TaskService = require("../services/tasks.service");
const TaskModel = require("../models/task.model");
const authenticateToken = require("../middlewares/auth.middleware");
const parseTaskData = require("../middlewares/parseTaskData.middleware");
const validaDatosTarea = require("../middlewares/validaDatosTarea.middleware");

module.exports = (app) => {
    const taskModel = new TaskModel();
    const taskService = new TaskService(taskModel);
    const taskController = new TasksController(taskService);

    app.get('/api/tasks', authenticateToken,  (req, res, next) => taskController.getAllTasks(req, res, next));
    app.get('/api/tasks/:id', authenticateToken, (req, res, next) => taskController.getTaskById(req, res, next));
    app.get('/api/tasks/project/:projectId', authenticateToken, (req, res, next) => taskController.getAllTasksByProjectId(req, res, next));
    app.post('/api/tasks', authenticateToken, validaDatosTarea, parseTaskData,(req, res, next) => taskController.createTask(req, res, next));
    app.put('/api/tasks/:id', authenticateToken, validaDatosTarea, parseTaskData,(req, res, next) => taskController.updateTask(req, res, next));
    app.delete('/api/tasks/:id', authenticateToken,(req, res, next) => taskController.deleteTask(req, res, next));
    app.delete('/api/tasks/project/:projectId', authenticateToken,(req, res, next) => taskController.deleteTaskByProjectId(req, res, next));
}
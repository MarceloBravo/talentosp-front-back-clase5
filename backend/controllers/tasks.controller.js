class TasksController{
    constructor(service){
        this.service = service;
    }


    async getAllTasks(req, res, next){
        try {
            const search = req.query.search;
            const tasks = await this.service.getAll(search);
            res.json({data: tasks});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    

    async getTaskById(req, res, next){
        try {
            const {id} = req.params;
            const task = await this.service.getById(id);
            res.json({data: task});
        }catch(error){
            console.log(error);
            next(error);
        }
    }


    async getAllTasksByProjectId(req, res, next){
        try {
            const {projectId} = req.params;
            const tasks = await this.service.getAllByProjectId(projectId);
            res.json({data: tasks});
        }catch(error){
            console.log(error);
            next(error);
        }
    }


    async createTask(req, res, next){
        try {
            const taskData = req.body;
            const files = req.files || null; // Archivos desde multer (memoryStorage)
            const task = await this.service.create(taskData, files);
            res.json({data: task});
        }catch(error){
            console.log(error);
            next(error);
        }
    }


    async updateTask(req, res, next){
        try {
            const {id} = req.params;
            const taskData = req.body;
            const files = req.files || null; // Archivos desde multer (memoryStorage)
            const task = await this.service.update(id, taskData, files);
            res.json({data: task});
        }catch(error){
            console.log(error);
            next(error);
        }
    }


    async deleteTask(req, res, next){
        try {
            const {id} = req.params;
            const task = await this.service.delete(id);
            res.json({data: task});
        }catch(error){
            console.log(error);
            next(error);
        }
    }

    async deleteTaskByProjectId(req, res, next){
        try {
            const {projectId} = req.params;
            const task = await this.service.deleteByProjectId(projectId);
            res.json({data: task});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}

module.exports = TasksController;
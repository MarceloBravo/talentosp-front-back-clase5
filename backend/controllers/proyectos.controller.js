class ProyectController {
    constructor(service, proyectsTaskService) {
        this.service = service;
        this.proyectsTaskService = proyectsTaskService;
    }

    async getAllProjects(req, res, next) {
        try {
            const search = req.query.search;
            const result = await this.service.getAll(search);
            res.json({ data: result });
        } catch (error) {
            next(error);
        }
    }

    async getProjectById(req, res, next) {
        try {
            const id = req.params.id;
            const project = await this.proyectsTaskService.getById(id);
            res.json({ data: project });
        } catch (error) {
            next(error);
        }
    }

    async createProject(req, res, next) {
        try {
            const data = req.body;
            const proyect = data.proyect;
            const tasks = data.tasks;
            const result = await this.proyectsTaskService.create(proyect, tasks);
            res.status(201).json({ message: 'Project created successfully.', data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateProject(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            const proyect = data.proyect;
            const tasks = data.tasks;
            const idTasksDedeleted = data.idTasksDedeleted;
            const result = await this.proyectsTaskService.update(id, proyect, tasks, idTasksDedeleted);
            if (result) {
                return res.json({ message: 'Proyecto actualizado exitosamente.', data: result });
            }
            res.status(404).json({ error: 'El proyecto no pudo ser actualizado o no existe.' });
        } catch (error) {
            next(error);
        }
    }

    async deleteProject(req, res, next) {
        try {
            const id = req.params.id;
            const affectedRows = await this.proyectsTaskService.delete(id);
            if (affectedRows > 0) {
                return res.json({ message: 'El proyecto ha sido eliminado exitosamente.' });
            }
            res.status(404).json({ error: 'El proyecto no pudo ser eliminado o no existe.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProyectController;
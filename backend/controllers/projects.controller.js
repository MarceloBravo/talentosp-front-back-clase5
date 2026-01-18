class ProjectController {
    constructor(service, projectsTaskService = null) {
        this.service = service;
        this.projectsTaskService = projectsTaskService;
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
            const project = await this.service.getById(id);
            res.json({ data: project });
        } catch (error) {
            next(error);
        }
    }

    async createProject(req, res, next) {
        try {
            const project = req.body;
            const files = req.files || null; // Archivos desde multer (memoryStorage)
            const result = await this.service.create(project, files);
            res.status(201).json({ code: 201, message: 'Projecto creado exitosamente.', data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateProject(req, res, next) {
        try {
            const id = req.params.id;
            const project = req.body;
            const files = req.files || null; // Archivos desde multer (memoryStorage)
            const result = await this.service.update(id, project, files);
            if (result) {
                return res.json({ code: 200, message: 'Project actualizado exitosamente.', data: result });
            }
            res.status(404).json({code: 500, error: 'El projecto no pudo ser actualizado o no existe.' });
        } catch (error) {
            next(error);
        }
    }

    async deleteProject(req, res, next) {
        try {
            const id = req.params.id;
            const affectedRows = await this.projectsTaskService.delete(id);
            if (affectedRows > 0) {
                return res.json({ code: 200, message: 'El proyecto ha sido eliminado exitosamente.' });
            }
            res.status(404).json({ code: 404, error: 'El proyecto no pudo ser eliminado o no existe.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProjectController;
class ProjectService{

    constructor(model, attachmentsService = null, uploadFileService = null){
        this.model = model;
        this.attachmentsService = attachmentsService;
        this.uploadFileService = uploadFileService;
    }

    async getAll(search = null){
        return await this.model.getAll(search);
    }

    async getById(id){
        return await this.model.getById(id);
    }


    async create(data, files = null){
        const project = await this.model.create(data);
        if (!project) {
            throw new Error('No se pudo crear el proyecto');
        }

        // Si hay archivos nuevos y attachmentsService está disponible, guardarlos
        if (files && files.length > 0 && this.attachmentsService) {
            await this.uploadFileService.saveAttachments(files, project.id);
        }

        return project;
    }


    async update(id, data, files = null){
        const project = await this.model.update(id, data);
        if (!project) {
            throw new Error('No se pudo actualizar el proyecto');
        }

        // Si hay archivos nuevos y attachmentsService está disponible, guardarlos
        if (files && files.length > 0 && this.attachmentsService) {
            await this.uploadFileService.saveAttachments(files, project.id);
        }

        return project;
    }

    async delete(id){
        const result = await this.model.delete(id);
        if(result > 0){
            return result;
        }
        return result;
    }

}

module.exports = ProjectService;
const fs = require('fs').promises;
const path = require('path');

class TaskService{

    constructor(model, uploadFileService, attachmentsService = null){
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
    


    async getAllTasksByProjectId(id){
        return await this.model.getAllTasksByProjectId(id);
    }



    async create(data, files = null){
        // Crear la tarea primero
        const task = await this.model.create(data);
        
        if (!task) {
            throw new Error('No se pudo crear la tarea');
        }

        // Si hay archivos nuevos y attachmentsService está disponible, guardarlos
        if (files && files.length > 0 && this.attachmentsService) {
            await this.uploadFileService.saveAttachments(files, task.id, '/tasks');
        }

        return task;
    }



    async update(id, data, files = null){
        // Actualizar la tarea
        const task = await this.model.update(id, data);
        
        if (!task) {
            return null;
        }

        // Si hay archivos nuevos y attachmentsService está disponible, guardarlos
        if (files && files.length > 0 && this.attachmentsService) {
            await this.uploadFileService.saveAttachments(files, task.id, '/tasks');
        }

        return task;
    }



    async delete(id){
        await this.uploadFileService.deleteAttachmentsFiles(id);

        return await this.model.delete(id);
    }
    
    async deleteByProjectId(id){
        return await this.model.deleteByProjectId(id);
    }

}

module.exports = TaskService;
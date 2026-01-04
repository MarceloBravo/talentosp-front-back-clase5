const fs = require('fs').promises;
const path = require('path');

class TaskService{

    constructor(model, attachmentsService = null){
        this.model = model;
        this.attachmentsService = attachmentsService;
    }

    async getAll(search = null){
        return await this.model.getAll(search);
    }

    async getById(id){
        return await this.model.getById(id);
    }
    
    async getAllByProjectId(id){
        return await this.model.getAllByProjectId(id);
    }

    /**
     * Guarda un archivo en disco y retorna la ruta
     * @param {Object} file - Objeto de archivo de multer (con buffer)
     * @param {Number} taskId - ID de la tarea
     * @returns {String} - Ruta del archivo guardado
     */
    async saveFileToDisk(file, taskId) {
        const uploadsDir = path.join(__dirname, '../uploads');
        
        // Asegurar que el directorio existe
        try {
            await fs.access(uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
        }

        // Generar nombre único para el archivo
        const timestamp = Date.now();
        const originalName = file.originalname;
        const ext = path.extname(originalName);
        const baseName = path.basename(originalName, ext);
        const uniqueFileName = `${taskId}_${timestamp}_${baseName}${ext}`;
        const filePath = path.join(uploadsDir, uniqueFileName);

        // Guardar archivo en disco
        await fs.writeFile(filePath, file.buffer);

        // Retornar ruta relativa para la URL
        return `/uploads/${uniqueFileName}`;
    }

    /**
     * Guarda múltiples archivos y crea registros de attachments
     * @param {Array} files - Array de archivos de multer
     * @param {Number} taskId - ID de la tarea
     * @returns {Array} - Array de attachments creados
     */
    async saveAttachments(files, taskId) {
        if (!files || files.length === 0 || !this.attachmentsService) {
            return [];
        }

        const attachments = [];
        const savedFiles = [];

        try {
            // Guardar todos los archivos en disco
            for (const file of files) {
                const fileUrl = await this.saveFileToDisk(file, taskId);
                savedFiles.push({ file, fileUrl });
            }

            // Crear registros de attachments en la base de datos
            for (const { file, fileUrl } of savedFiles) {
                const attachment = await this.attachmentsService.create({
                    task_id: taskId,
                    file_name: file.originalname,
                    file_url: fileUrl
                });
                if (attachment) {
                    attachments.push(attachment);
                }
            }

            return attachments;
        } catch (error) {
            // Si falla, limpiar archivos guardados
            for (const { fileUrl } of savedFiles) {
                try {
                    const fullPath = path.join(__dirname, '../', fileUrl);
                    await fs.unlink(fullPath);
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo:', unlinkError);
                }
            }
            throw error;
        }
    }

    async create(data, files = null){
        // Crear la tarea primero
        const task = await this.model.create(data);
        
        if (!task) {
            throw new Error('No se pudo crear la tarea');
        }

        // Si hay archivos y attachmentsService está disponible, guardarlos
        if (files && files.length > 0 && this.attachmentsService) {
            try {
                await this.saveAttachments(files, task.id);
            } catch (error) {
                // Si falla al guardar archivos, eliminar la tarea creada
                await this.model.delete(task.id);
                throw error;
            }
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
            try {
                await this.saveAttachments(files, task.id);
            } catch (error) {
                // Si falla al guardar archivos, la tarea ya está actualizada
                // Los archivos no se guardaron, pero la tarea sí
                console.error('Error al guardar archivos adjuntos:', error);
                throw error;
            }
        }

        return task;
    }

    async delete(id){
        // Si hay attachmentsService, eliminar archivos asociados
        if (this.attachmentsService) {
            try {
                const deletedAttachments = await this.attachmentsService.deleteByTaskId(id);
                // Eliminar archivos físicos
                for (const attachment of deletedAttachments) {
                    try {
                        const fullPath = path.join(__dirname, '../', attachment.file_url);
                        await fs.unlink(fullPath);
                    } catch (error) {
                        console.error('Error al eliminar archivo físico:', error);
                    }
                }
            } catch (error) {
                console.error('Error al eliminar attachments:', error);
            }
        }

        return await this.model.delete(id);
    }
    
    async deleteByProjectId(id){
        return await this.model.deleteByProjectId(id);
    }

}

module.exports = TaskService;
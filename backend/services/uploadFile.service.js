const fs = require('fs').promises;
const path = require('path');

class UploadFileService{

    constructor(attachmentsService = null){
        this.attachmentsService = attachmentsService;
    }

    /**
     * Guarda un archivo en disco y retorna la ruta
     * @param {Object} file - Objeto de archivo de multer (con buffer)
     * @param {Number} regId - ID del regístro asociado al archivo
     * @returns {String} - Ruta del archivo guardado
     */
    async saveFileToDisk(file, regId, subDirectory='') {
        const uploadsDir = path.join(__dirname, '../uploads' + subDirectory);
        
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
        const uniqueFileName = `${regId}_${timestamp}_${baseName}${ext}`;
        const filePath = path.join(uploadsDir, uniqueFileName);

        // Guardar archivo en disco
        await fs.writeFile(filePath, file.buffer);

        // Retornar ruta relativa para la URL
        const subDirPath = subDirectory ? `${subDirectory}/` : '';
        return `/uploads/${subDirPath}${uniqueFileName}`;
    }

    /**
     * Guarda múltiples archivos y crea registros de attachments
     * @param {Array} files - Array de archivos de multer
     * @param {Number} regId - ID de la tarea
     * @returns {Array} - Array de attachments creados
     */
    async saveAttachments(files, regId) {
        if (!files || files.length === 0) {
            return [];
        }

        const attachments = [];
        const savedFiles = [];

        try {
            // Guardar todos los archivos en disco
            for (const file of files) {
                const fileUrl = await this.saveFileToDisk(file, regId);
                savedFiles.push({ file, fileUrl });
            }

            // Crear registros de attachments en la base de datos
            if(this.attachmentsService){
                for (const { file, fileUrl } of savedFiles) {
                    const attachment = await this.attachmentsService.create({
                        task_id: regId,
                        file_name: file.originalname,
                        file_url: fileUrl
                    });
                    if (attachment) {
                        attachments.push(attachment);
                    }
                }
            }

            return [savedFiles, attachments];
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

    /**
     * Guarda un archivo de avatar y retorna la ruta
     * @param {Object} file - Objeto de archivo de multer (con buffer)
     * @param {Number} userId - ID del usuario
     * @returns {String} - Ruta del archivo guardado
     */
    async saveAvatarFile(file, userId) {
        if (!file) {
            return null;
        }
        
        const subDirectory = '/avatars';
        const fileUrl = await this.saveFileToDisk(file, userId, subDirectory);
        return fileUrl;
    }

    async deleteTasksFiles(id){
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
    }

    async deleteAvatarFile(user){
        if (user) {
            try {
                // Eliminar archivos físicos - puede ser file_url o file_url
                const fileUrl = user.file_url || user.file_url;
                if(fileUrl) {
                    const fullPath = path.join(__dirname, '../', fileUrl);
                    await fs.unlink(fullPath);
                }
            } catch (error) {
                console.error('Error al eliminar archivo físico:', error);
            }
        }
    }
    
}

module.exports = UploadFileService;
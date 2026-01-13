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

        // Derivar la extensión del MIME type para mayor fiabilidad
        const mimeTypeMap = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp'
        };
        let ext = mimeTypeMap[file.mimetype];

        // Si el mimetype no es de una imagen conocida, intentar obtenerla del nombre original
        if (!ext) {
            ext = path.extname(file.originalname);
        }

        const originalName = file.originalname;
        const baseName = path.basename(originalName, path.extname(originalName));

        // Generar nombre único para el archivo
        const timestamp = Date.now();
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
    async saveAttachments(files, regId, directoryName = '') {
        if (!files || files.length === 0) {
            return [];
        }

        const attachments = [];
        const savedFiles = [];

        try {
            // Guardar todos los archivos en disco
            for (const file of files) {
                const fileUrl = await this.saveFileToDisk(file, regId, directoryName);
                savedFiles.push({ file, fileUrl });
            }

            // Crear registros de attachments en la base de datos
            if(this.attachmentsService){
                for (const { file, fileUrl } of savedFiles) {
                    const attachment = await this.attachmentsService.create({
                        owner_id: regId,
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
                    const fullpath = path.join( process.cwd() + att.file_url);
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

    async deleteAvatarFile(user){
        if (user && user.file_url) {
            try {
                // user.file_url es '/uploads/avatars/file.jpg'. process.cwd() es '.../backend'.
                // Se debe quitar la barra inicial de user.file_url para unirlos correctamente.
                const relativePath = user.file_url.substring(1);
                const fullPath = path.join(process.cwd(), relativePath);
                
                await fs.unlink(fullPath);
            } catch (error) {
                // Si el archivo no existe (ENOENT), no es un error crítico, así que lo ignoramos.
                if (error.code !== 'ENOENT') {
                    console.error('Error al eliminar archivo físico:', error);
                }
            }
        }
    }

    async deleteAttachmentsFiles(id){
        if (this.attachmentsService) {
            try{
                const deletedAttachments = await this.attachmentsService.deleteByOwnerId(id);
                for(const att of deletedAttachments){
                    try{
                        // user.file_url es '/uploads/proyecto/file.pdf'. process.cwd() es '.../backend'.
                        const relativePath = att.file_url.substring(1);
                        const fullpath = path.join(process.cwd(), relativePath);
                        await fs.unlink(fullpath);
                    }catch(error){
                        if (error.code !== 'ENOENT') {
                            console.log('Error al intentar eliminar el archivo ' + att.file_name);
                        }
                    }
                }
            }catch(error){
                console.log('Error al eliminar adjuntos');
            }
        }
    }
    
}

module.exports = UploadFileService;
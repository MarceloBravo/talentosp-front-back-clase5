class UsersService{

    constructor(model, uploadFileService){
        this.model = model;
        this.uploadFileService = uploadFileService;
    }


    async getAll(search = null){
        const params = [];
        if (search && search.trim().length > 0) {
            params.push(`%${search}%`);
        }
        const result = await this.model.getUsersAll(params)
        return result;
    }


    async getById(id){
        const result = await this.model.getUserById(id);
        return result;
    }


    async create(data, file = null){
        const result = await this.model.createUser(data);

        if(!result){
            throw new Error('Error al crear el usuario.')
        }
        
        // Si hay archivo, guardarlo y actualizar el usuario
        if (file) {
            await this.saveAvatarFile(file, result.id);
            // Obtener el usuario actualizado con el file_url
            return await this.getById(result.id);
        }

        return result;
    }


    async update(id, data, file = null){
        // Si hay archivo nuevo, eliminar el anterior primero
        if (file) {
            const currentUser = await this.getById(id);
            if(currentUser && (currentUser.profile_image_url || currentUser.file_url)){
                await this.uploadFileService.deleteAvatarFile(currentUser);
            }
            // Guardar el nuevo archivo
            const fileUrl = await this.uploadFileService.saveAvatarFile(file, id);
            data.profile_image_url = fileUrl;
        }

        const result = await this.model.updateUser(id, data);

        if(!result){
            throw new Error('Error al actualizar el usuario.')
        }

        return result;
    }


    async delete(id){
        const user = await this.getById(id);
        if(user){
            // Eliminar archivo de avatar si existe
            if(user.profile_image_url || user.file_url){
                await this.uploadFileService.deleteAvatarFile(user);
            }
            const result = await this.model.deleteUser(id);
            return result;
        }
        return 0;
    }


    async saveAvatarFile(file, userId){
        // Guardar archivo de avatar
        const fileUrl = await this.uploadFileService.saveAvatarFile(file, userId);
        
        // Actualizar el campo profile_image_url en la base de datos
        if(fileUrl){
            await this.model.updateUserProfileImage(userId, fileUrl);
        }
    }


}

module.exports = UsersService;
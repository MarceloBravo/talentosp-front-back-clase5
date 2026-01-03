class UserController{
    constructor(service){
        this.service = service;
    }

    async getAllUsers(req, res, next){
        try {
            const search = req.query.search;
            const users = await this.service.getAll(search);
            res.json({data: users});
        }catch(error){
            console.log(error);
            next(error);
        }
    }

    async getUserById(req, res, next){
        try {
            const id = req.params.id;
            const user = await this.service.getById(id);
            res.json({data: user});
        }catch(error){
            console.log(error);
            next(error);
        }
    }

    async createUser(req, res, next){
        try {
            const data = req.body;
            const result = await this.service.create(data);
            if(result){
                return res.json({mensaje: 'Usuario creado exitosamente.',data: result});
            }else{
                res.json({error: 'No se pudo crear el usuario.'});
            }
        }catch(error){
            console.log(error);
            next(error);
        }
    }


    async updateUser(req, res, next){
        try {
            const id = req.params.id;
            const data = req.body;
            const result = await this.service.update(id, data);
            if(result){
                return res.json({mensaje: 'Usuario actualizado exitosamente.',data: result});
            }else{
                res.json({error: 'No se pudo actualizar el usuario.'});
            }
        }catch(error){
            console.log(error);
            next(error);
        }
    }

    async deleteUser(req, res, next){
        try {
            const id = req.params.id;
            const result = await this.service.delete(id);
            if(result > 0){
                return res.json({mensaje: 'Usuario eliminado exitosamente.'});
            }else{
                res.json({error: 'No se pudo eliminar el usuario.'});
            }
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}

module.exports = UserController;
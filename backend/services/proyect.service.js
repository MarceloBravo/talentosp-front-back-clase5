class ProyectService{

    constructor(model){
        this.model = model;
    }

    async getAll(search = null){
        return await this.model.getAll(search);
    }

    async getById(id){
        return await this.model.getById(id);
    }

    async create(data){
        return await this.model.create(data);
    }

    async update(id, data){
        return await this.model.update(id, data);
    }

    async delete(id){
        return await this.model.delete(id);
    }

}

module.exports = ProyectService;
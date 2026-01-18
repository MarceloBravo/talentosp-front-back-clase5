class AttachmentsService{

    constructor(model){
        this.model = model;
    }


    async getAll(){
        const result = await this.model.getAll();
        return result;
    }

    async getByOwnerId(taskId){
        const result = await this.model.getByOwnerId(taskId);
        return result;
    }
    
    async getById(id){
        const result = await this.model.getById(id);
        return result;
    }

    async create(data){
        const result = await this.model.create(data);
        return result;
    }

    async update(id, data){
        const result = await this.model.update(id, data);
        return result;
    }

    async delete(id){
        const result = await this.model.delete(id);
        return result;
    }

    async deleteByOwnerId(Id){
        const result = await this.model.deleteById(Id);        
        return result;
    }


}

module.exports = AttachmentsService;
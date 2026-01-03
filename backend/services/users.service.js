class UsersService{

    constructor(model){
        this.model = model;
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
        const result = this.model.getUserById(id);
        return result;
    }


    async create(data){
        const result = await this.model.createUser(data);
        return result;
    }


    async update(id, data){
        const result = await this.model.updateUser(id, data);
        return result;
    }


    async delete(id){
        const result = await this.model.deleteUser(id);
        return result;
    
    }
}

module.exports = UsersService;
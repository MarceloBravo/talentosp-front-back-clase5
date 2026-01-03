class ProyectsTaskService{

    constructor(proyectService, taskService){
        this.proyectService = proyectService;
        this.taskService = taskService;
    }

    async getById(id){
        const project = await this.proyectService.getById(id);
        if(project.length > 0){
            const tasks = await this.taskService.getAllByProjectId(project[0].id);
            return {project, tasks: tasks.rows};
        }
        return null;
    }

    async create(proyectData, taskData){
        const project = await this.proyectService.create(proyectData);
        if(project){
            const newTaskPromises = taskData.map(async t => {
                t.project_id = project.id;
                const task = await this.taskService.create(t);
                return task;
            });
            const newTasks = await Promise.all(newTaskPromises);
            return {project, newTasks};
        }
        return null;
    }

    async update(id, proyectData, taskData, idTasksDedeleted){
        const project = await this.proyectService.update(id, proyectData);
        if(project){

            // crear y actualizar
            const newTasksPromises = taskData.map(async t => {
                const task = t.id ? await this.taskService.getById(t.id) : null; 
                let newTask = null;

                if(!task){
                    t.project_id = project.id;
                    newTask = await this.taskService.create(t);
                }else{
                    newTask = await this.taskService.update(t.id, t);
                }
                return newTask;
            });
            const newTasks = await Promise.all(newTasksPromises);

            // Eliminar
            const deleteTasksPromises = idTasksDedeleted.map(async id => {
                return await this.taskService.delete(id);
            })
            const deleteTasks = await Promise.all(deleteTasksPromises);

            // Retornar
            return {project, newTasks, totalEliminados: deleteTasks.length, tareasEliminadas: idTasksDedeleted};
        }
        return null;
    }

    async delete(projectId){
        const affectedRows = await this.proyectService.delete(projectId);
        if(affectedRows > 0){
            return await this.taskService.deleteByProjectId(projectId);
        }
        return 0;
    }

}

module.exports = ProyectsTaskService;
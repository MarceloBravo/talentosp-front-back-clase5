class ProjectsTaskService{

    constructor(projectService, taskService){
        this.projectService = projectService;
        this.taskService = taskService;
    }

    async getById(id){
        const project = await this.projectService.getById(id);
        if(project.length > 0){
            const tasks = await this.taskService.getAllByProjectId(project[0].id);
            return {project, tasks: tasks.rows};
        }
        return null;
    }

    async create(projectData, taskData, files = null){
        const project = await this.projectService.create(projectData, files);
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

    async update(id, projectData, taskData, idTasksDedeleted = []){
        const project = await this.projectService.update(id, projectData);
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
        const affectedRows = await this.projectService.delete(projectId);
        if(affectedRows > 0){
            await this.taskService.deleteByProjectId(projectId);
            return affectedRows;
        }
        return 0;
    }

}

module.exports = ProjectsTaskService;
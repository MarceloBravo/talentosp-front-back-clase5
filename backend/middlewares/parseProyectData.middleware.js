const parseProyectData = (req, res, next) => {
    const {proyect, tasks} = req.body    
    const { name, description, owner_id } = proyect;

    // Formateando datos del proyecto
    if (name) {
        req.body.proyect.name = `${name}`;
    }
    if (description) {
        req.body.proyect.description = `${description}`
    }
    if (owner_id) {
        req.body.proyect.owner_id = parseInt(owner_id);
    }

    // Formateando datos de las tareas
    tasks.forEach((t, index)=> {
        if (t.title) {
            req.body.tasks[index].title = `${t.title}`;
        }
        if (t.description) {
            req.body.tasks[index].description = `${t.description}`
        }
        if (t.status) {
            req.body.tasks[index].status = `${t.status}`;
        }
        if (t.priority) {
            req.body.tasks[index].priority = `${t.priority}`;
        }
        if (t.assignee_id) {
            req.body.tasks[index].assignee_id = parseInt(t.assignee_id);
        }
        if (t.due_date) {
            req.body.tasks[index].due_date = new Date(t.due_date);
        }
    });

    next();
};
module.exports = parseProyectData;
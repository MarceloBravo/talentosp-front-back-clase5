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
        req = parseTaskData(req, t, index);
    });

    next();
};

module.exports = parseProyectData;
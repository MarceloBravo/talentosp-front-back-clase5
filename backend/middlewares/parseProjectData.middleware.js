const parseTaskData = require("./parseTaskData.middleware");

const parseProjectData = (req, res, next) => {    
    const { name, description, owner_id } = req.body;
    
    // Formateando datos del project
    if (name) {
        req.body.name = `${name}`;
    }
    if (description) {
        req.body.description = `${description}`
    }
    if (owner_id) {
        req.body.owner_id = parseInt(owner_id);
    }
        
    // Formateando datos de las tareas (comentado para uso futuro)
    /*
    tasks.forEach((t, index)=> {
        req = parseTaskData(req, t, index);
    });
    */
    
    next();
};

module.exports = parseProjectData;
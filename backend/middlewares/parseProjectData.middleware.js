const parseTaskData = require("./parseTaskData.middleware");

const parseProjectData = (req, res, next) => {    
    const contentType = req.headers["content-type"]
    if(contentType.includes("multipart/form-data")){
        req.body.tasks =  JSON.parse(req.body.tasks);
        req.body.project = JSON.parse(req.body.project);
        req.body.idTasksDedeleted = JSON.parse(req.body.idTasksDedeleted);
    }
    const {project, tasks} = req.body    
    const { name, description, owner_id } = project;

    // Formateando datos del project
    if (name) {
        req.body.project.name = `${name}`;
    }
    if (description) {
        req.body.project.description = `${description}`
    }
    if (owner_id) {
        req.body.project.owner_id = parseInt(owner_id);
    }

    // Formateando datos de las tareas
    tasks.forEach((t, index)=> {
        req = parseTaskData(req, t, index);
    });

    next();
};

module.exports = parseProjectData;
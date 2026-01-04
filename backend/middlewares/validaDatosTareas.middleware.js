const validaDatosTareaHelper = require("../helpers/validaDatosTareaHelper");

function validaDatosTareas(req, res, next){
    const contentType = req.headers["content-type"]
    const tasks = contentType.includes("application/json") ? req.body.task : JSON.parse(req.body.tasks);
    
    if(!tasks){
        return res.status(400).json({
            status: 'error',
            message: 'Debe especificar almenos una tarea.'
        })
    }
    
    if(!Array.isArray(tasks)){
        return res.status(400).json({
            status: 'error',
            message: 'Formato de tareas incorrecto.'
        })
    }
    
    tasks.forEach(t => {
        validaDatosTareaHelper(t);
    })
    

    next();
}

module.exports = validaDatosTareas;
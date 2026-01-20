const validaDatosTareaHelper = require("../helpers/validaDatosTareaHelper");


function validaDatosTarea(req, res, next){

    const projectId = (req.method === 'POST') ? req.params.projectId : req.body.project_id;
    if(!projectId || isNaN(projectId) || parseInt(projectId) < 0 || projectId - parseInt(projectId) !== 0){
        return res.status(400).json({
            status: 'error',
            message: 'El proyecto al que asignar la tarea no es válido.'
        })
    }
    const errorMessage = validaDatosTareaHelper(req.body);
    if(errorMessage){
        return res.status(400).json({ status: 'error', message: errorMessage });
    }

    next();
}

module.exports = validaDatosTarea;
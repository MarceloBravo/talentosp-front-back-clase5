function validaDatosTareaHelper(task){
    const {title, description, status, priority, assignee_id, due_date}  = task;

    if(!title || title.trim().length === 0){
        return res.status(400).json({
            status: 'error',
            message: 'El titulo de la tarea es obligatorio.'
        })
    }
    if(!description || description.trim().length === 0){
        return res.status(400).json({
            status: 'error',
            message: 'La descripcion de la tarea es obligatoria.'
        })
    }
    if(!status || status.trim().length === 0){
        return res.status(400).json({
            status: 'error',
            message: 'El estado de la tarea es obligatorio.'
        })
    }
    if(!priority || priority.trim().length === 0){
        return res.status(400).json({
            status: 'error',
            message: 'La prioridad de la tarea es obligatoria.'
        })
    }
    if(!assignee_id || isNaN(assignee_id) || parseInt(assignee_id) < 0 || assignee_id - parseInt(assignee_id) !== 0){
        return res.status(400).json({
            status: 'error',
            message: 'El usuario a quien asignar la tarea no es válido.'
        })
    } 
    if(!due_date || due_date.trim().length === 0 || isNaN(Date.parse(due_date))){
        return res.status(400).json({
            status: 'error',
            message: 'La fecha de vencimiento de la tarea no es válida.'
        })
    }
}

module.exports = validaDatosTareaHelper;
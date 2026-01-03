function validaDatosTareaHelper(task){
    const {title, description, status, priority, assignee_id, due_date}  = task;

    if(!t.title || t.title.trim().length === 0){
        return res.status(400).json({
            status: 'error',
            message: 'El titulo de la tarea es obligatorio.'
        })
    }
    if(!t.description || t.description.trim().length === 0){
        return res.status(400).json({
            status: 'error',
            message: 'La descripcion de la tarea es obligatoria.'
        })
    }
    if(!t.status || t.status.trim().length === 0){
        return res.status(400).json({
            status: 'error',
            message: 'El estado de la tarea es obligatorio.'
        })
    }
    if(!t.priority || t.priority.trim().length === 0){
        return res.status(400).json({
            status: 'error',
            message: 'La prioridad de la tarea es obligatoria.'
        })
    }
    if(!t.assignee_id || isNaN(t.assignee_id) || parseInt(t.assignee_id) < 0 || t.assignee_id - parseInt(t.assignee_id) !== 0){
        return res.status(400).json({
            status: 'error',
            message: 'El usuario a quien asignar la tarea no es válido.'
        })
    } 
    if(!t.due_date || t.due_date.trim().length === 0 || isNaN(Date.parse(t.due_date))){
        return res.status(400).json({
            status: 'error',
            message: 'La fecha de vencimiento de la tarea no es válida.'
        })
    }
}

module.exports = validaDatosTareaHelper;
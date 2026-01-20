const parseTaskData = (req, res, next) => {
    const {title, description, status, priority, assignee_id, due_date} = req.body;
    
    // Formateando datos de la tarea
    if (title) {
        req.body.title = `${title}`;
    }
    if (description) {
        req.body.description = `${description}`;
    }
    if (status) {
        req.body.status = `${status}`;
    }
    if (priority) {
        req.body.priority = `${priority}`;
    }
    if (assignee_id) {
        req.body.assignee_id = parseInt(assignee_id);
    }
    if (due_date) {
        req.body.due_date = `${due_date}`;
    }

    next();
};

module.exports = parseTaskData;